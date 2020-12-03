import { MenuItem } from 'primeng/api';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpResponseBase, HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/components/common/messageservice';
import * as utils from 'lodash';

import { AddContractsModel } from './../model/add-contracts.model';
import { ContractTypesItem, DateFormat, SaveResponse } from '../model/add-contracts.interface';
import { ChangeDetectorRef } from '@angular/core';

export class AddContractsUtility {
  static initialDate(model: AddContractsModel) {
    if (model.createAgreement) {
      model.effectiveMinDate = new Date(model.createAgreement.effectiveDate.replace(/-/g, '\/').replace(/T.+/, ''));
      model.effectiveMaxDate = new Date(model.createAgreement.expirationDate.replace(/-/g, '\/').replace(/T.+/, ''));
      model.expirationMinDate = new Date(model.createAgreement.effectiveDate.replace(/-/g, '\/').replace(/T.+/, ''));
      model.expirationMaxDate = new Date(model.createAgreement.expirationDate.replace(/-/g, '\/').replace(/T.+/, ''));
    }
  }

  static onSelectExpDate(model: AddContractsModel) {
    model.inCorrectExpDateFormat = false;
    if (model.contractForm.controls['effectiveDate'].value) {
      this.getValidDate(model);
    }
    const expDateValue = model.contractForm.controls['expirationDate'].value.setHours(0, 0, 0, 0);
    model.inCorrectExpDateFormat = (expDateValue > model.expirationMaxDate.setHours(0, 0, 0, 0));
  }

  static getValidDate(model: AddContractsModel) {
    model.isNotValidDate = false;
    const effDateValue = model.contractForm.controls['effectiveDate'].value;
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    model.inCorrectEffDateFormat = (effDateValue.getTime() < model.effectiveMinDate.setHours(0, 0, 0, 0));
    if (todayDate.getDate() === effDateValue.getDate()) {
      effDateValue.setHours(0, 0, 0, 0);
    }
    if (effDateValue && model.contractForm.controls['expirationDate'].value) {
      model.isNotValidDate = (effDateValue.getTime() > model.contractForm.controls['expirationDate'].value.setHours(0, 0, 0, 0) ||
      effDateValue.getTime() > model.expirationMaxDate.setHours(0, 0, 0, 0));
    }
  }

  static dateObj(effDate: string | Date): DateFormat {
    if (typeof effDate === 'string') {
      const dateFormat = effDate.split('-');
      return {
        date: {
          year: parseInt(dateFormat[0], 10), month: parseInt(dateFormat[1], 10),
          day: parseInt(dateFormat[2].split('T')[0], 10)
        }
      };
    } else {
      return {
        date: {
          year: effDate.getFullYear(), month: effDate.getMonth() + 1, day: effDate.getDate()
        }
      };
    }
  }

  static dateFormatter(value: number): string {
    if (value < 10) {
      return `0${value.toString()}`;
    }
    return value.toString();
  }

  static datePipe(date: DateFormat): string {
    return `${this.dateFormatter(date['date'].month)}/${this.dateFormatter(date['date'].day)}/${date['date'].year}`;
  }

  static transactionalType(model: AddContractsModel) {
    model.isTransactional = true;
    model.contractForm.controls.contractId.setValue(null);
    model.contractForm.controls.contractId.setValidators(null);
  }

  static getContractList(contract: SaveResponse, model: AddContractsModel): SaveResponse {
    if (contract.customerAgreementContractTypeName.toLowerCase() === 'tariff' &&
    contract.customerContractNumber === model.tariffContractId.toString()) {
      model.tariffContractId = '';
    }
    contract.effectiveDate = this.datePipe(this.dateObj(contract.effectiveDate));
    contract.expirationDate = this.datePipe(this.dateObj(contract.expirationDate));
    contract.customerContractNumber = contract.customerContractNumber ? contract.customerContractNumber : '--';
    return contract;
  }

  static setFormErrors(model: AddContractsModel) {
    const effError = (model.inCorrectEffDateFormat || model.isNotValidDate);
    const expError = (model.inCorrectExpDateFormat || model.isNotValidDate);
    model.contractForm.controls.effectiveDate.setErrors(effError ? {invalid: true} : null);
    model.contractForm.controls.expirationDate.setErrors(expError ? {invalid: true} : null);
  }

  static hideDateErrors(model: AddContractsModel) {
    model.inCorrectEffDateFormat = false;
    model.inCorrectExpDateFormat = false;
    model.isNotValidDate = false;
  }

  static viewReset(model: AddContractsModel) {
    model.isSplitView = false;
    model.selectedRowContract = [];
    model.contractForm.reset();
  }

  static getFormControls(formBuilder: FormBuilder, model: AddContractsModel) {
    model.contractForm = formBuilder.group({
      contractType: ['', Validators.required],
      contractId: ['', Validators.required],
      description: ['', Validators.required],
      effectiveDate: ['', Validators.required],
      expirationDate: ['', Validators.required],
      notes: ['']
    });
  }

  static getPatchValues(model: AddContractsModel, contractValue: MenuItem, formValues: SaveResponse) {
    model.contractForm.patchValue({
      contractType: contractValue,
      contractId: (contractValue.label.toLowerCase() === 'transactional') ? null : formValues.customerContractNumber,
      description: formValues.customerContractName,
      effectiveDate: new Date(formValues.effectiveDate.replace(/-/g, '\/').replace(/T.+/, '')),
      expirationDate: new Date(formValues.expirationDate.replace(/-/g, '\/').replace(/T.+/, '')),
      notes: formValues.customerContractComment
    });
  }

  static splitScreenCheck(model: AddContractsModel): string {
    let contractid = '';
    if (model.isSplitView) {
      contractid = model.selectedRowContract[0].customerAgreementContractID.toString();
    } else {
      const idList = [];
      utils.forEach(model.selectedContractsList, (value: SaveResponse) => {
        idList.push(value.customerAgreementContractID);
      });
      contractid = idList.join();
    }
    return contractid;
  }

  static onSuccessDeleteContract(value: HttpResponseBase, messageService: MessageService, model: AddContractsModel) {
    if (value.status === 204) {
      AddContractsUtility.toastMessage(messageService, 'success', 'Contract(s) Deleted successfully');
      model.isSplitView = false;
      const arrayList = (utils.isEmpty(model.selectedContractsList)) ? model.selectedRowContract : model.selectedContractsList;
      utils.forEach(arrayList, (data: SaveResponse) => {
        const index = utils.findIndex(model.contractsList, data);
        if (index > -1) {
          model.contractsList.splice(index, 1);
        }
      });
      model.selectedContractsList = [];
      model.selectedRowContract = [];
    }
  }

  static validateDateFormat(event: string, dateStatus: string, model): boolean | undefined {
    const date = event;
    const datePat = /^(1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])\/[0-9]{4}$/;
    const matchArray = date.match(datePat);
    if (matchArray == null) {
      switch (dateStatus) {
        case 'effective':
          model.inCorrectEffDateFormat = true;
          break;
        case 'expiration':
          model.inCorrectExpDateFormat = true;
          break;
      }
      return false;
    }
  }

  static toastMessage(messageService: MessageService, key: string, data: string) {
    const message = {
      severity: key,
      summary: (key === 'error') ? 'Error' : 'Success',
      detail: data
    };
    messageService.clear();
    messageService.add(message);
  }

  static getContractType(contractTypes: ContractTypesItem[]): MenuItem[] {
    const contractList = [];
    utils.forEach(contractTypes, (value: ContractTypesItem) => {
      contractList.push({
        label: value.contractTypeName,
        value: {
          label: value.contractTypeName,
          value: value.contractTypeID
        }
      });
    });
    return contractList;
  }

  static duplicateCheckError(id: number, description: number, messageService: MessageService) {
    let errorMessage = '';
    if (id > -1) {
      errorMessage = 'A contract with the same Identifier already exists. No duplicates allowed';
    } else if (description > -1) {
      errorMessage = 'A contract with the same Description already exists. No duplicates allowed';
    } else if (id > -1 && description > -1) {
      errorMessage = 'A contract with the same Identifier & Description already exists. No duplicates allowed';
    }
    this.toastMessage(messageService, 'error', errorMessage);
  }

  static saveRequest(model: AddContractsModel): SaveResponse {
    return {
      customerAgreementContractID: (!utils.isEmpty(model.selectedContractsList)) ?
      model.selectedContractsList[0].customerAgreementContractID : null,
      customerAgreementContractVersionID: (!utils.isEmpty(model.selectedContractsList)) ?
      model.selectedContractsList[0].customerAgreementContractVersionID : null,
      customerAgreementID: model.createAgreement.customerAgreementID,
      customerAgreementContractTypeID: model.contractForm.get('contractType').value.value,
      customerAgreementContractTypeName: model.contractForm.get('contractType').value.label,
      customerContractNumber: model.contractForm.get('contractId').value ? model.contractForm.get('contractId').value : null,
      customerContractName: model.contractForm.get('description').value,
      effectiveDate: model.contractForm.get('effectiveDate').value.toISOString().split('T')[0],
      expirationDate: model.contractForm.get('expirationDate').value.toISOString().split('T')[0],
      customerContractComment: model.contractForm.get('notes').value ? model.contractForm.get('notes').value : null,
      createAgreementFlow: true,
      isElasticSync: false
    };
  }

  static matchedIndex(model: AddContractsModel, key: string, formField: string): number {
    return utils.findIndex(model.contractsList, (value: SaveResponse) => {
      if (value[key] && model.contractForm.get(formField).value && utils.isString(model.contractForm.get(formField).value)) {
        return value[key].toLowerCase() === model.contractForm.get(formField).value.toLowerCase();
      }
    });
  }

  static formFieldsTouched(model: AddContractsModel, messageService: MessageService) {
    model.isSaveChanges = false;
    utils.forIn(model.contractForm.controls, (value: FormControl, name: string) => {
      model.contractForm.controls[name].markAsTouched();
    });
    messageService.clear();
    messageService.add({severity: 'error', summary: 'Missing Required Information',
    detail: 'Provide the required information in the highlighted fields and submit the form again'});
  }

  static handleError(error: HttpErrorResponse, model: AddContractsModel, messageService: MessageService,
    changeDetector: ChangeDetectorRef) {
    model.pageLoading = false;
    model.isSaveChanges = false;
    if (error.status === 400  && error.error.errors[0].errorMessage === 'max_size_violation') {
      messageService.clear();
      messageService.add({ severity: 'error', summary: 'Error',
      detail: 'Exceeds Permissible Limit'});
    } else if (error.status && error.status >= 500) {
      messageService.clear();
      messageService.add({ severity: 'error', summary: 'Error',
       detail: 'Pricing Configuration System is currently unavailable.  Contact help desk' });
    } else if (!utils.isEmpty(error.error) && !utils.isEmpty(error.error.errors)) {
      messageService.clear();
      messageService.add({ severity: 'error', summary: error.error.errors[0].errorType, detail: error.error.errors[0].errorMessage });
    }
    changeDetector.detectChanges();
  }

  static resetVariables(model: AddContractsModel) {
    model.isSplitView = true;
    model.isSaved = false;
    model.isTransactional = false;
    model.isContractTypeDisabled = false;
    model.selectedContractsList = [];
    model.selectedRowContract = [];
  }

  static checkTariff(model: AddContractsModel, event: MenuItem): boolean {
    if (!utils.isEmpty(model.selectedRowContract)) {
      return model.selectedRowContract[0].customerAgreementContractTypeName.toLowerCase() === event.label.toLowerCase();
    } else {
      return false;
    }
  }

  static warningMessage(messageService: MessageService) {
    messageService.clear();
    messageService.add({
      severity: 'info',
      summary: 'No Changes Found',
      detail: 'You have not made any changes to save the data'
    });
  }
}
