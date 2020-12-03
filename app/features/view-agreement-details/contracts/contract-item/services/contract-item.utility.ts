import { ChangeDetectorRef } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpResponseBase, HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/components/common/messageservice';
import * as utils from 'lodash';

import { ContractItemModel } from './../models/contract-item.model';
import { CreateRequestParam } from '../models/contract-item.interface';

export class ContractItemUtility {
  static initialDate(model) {
    if (model.agreementDetails) {
      model.effectiveMinDate = new Date(model.agreementDetails.effectiveDate.replace(/-/g, '\/').replace(/T.+/, ''));
      model.effectiveMaxDate = new Date(model.agreementDetails.expirationDate.replace(/-/g, '\/').replace(/T.+/, ''));
      model.expirationMinDate = new Date(model.agreementDetails.effectiveDate.replace(/-/g, '\/').replace(/T.+/, ''));
      model.expirationMaxDate = new Date(model.agreementDetails.expirationDate.replace(/-/g, '\/').replace(/T.+/, ''));
    }
  }
  static getContractType(contractTypes) {
    const contractList = [];
    utils.forEach(contractTypes, (value) => {
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
  static saveRequest(model, agreementID: number): CreateRequestParam {
    return {
      customerAgreementContractID: null,
      customerAgreementContractVersionID: null,
      customerAgreementID: agreementID,
      customerAgreementContractTypeID: model.contractForm.get('contractType').value.value,
      customerAgreementContractTypeName: model.contractForm.get('contractType').value.label,
      customerContractNumber: model.contractForm.get('contractId').value ? model.contractForm.get('contractId').value : null,
      customerContractName: model.contractForm.get('description').value,
      effectiveDate: model.contractForm.get('effectiveDate').value.toISOString().split('T')[0],
      expirationDate: model.contractForm.get('expirationDate').value.toISOString().split('T')[0],
      customerContractComment: model.contractForm.get('notes').value ? model.contractForm.get('notes').value : null,
      createAgreementFlow: true,
      isElasticSync: true
    };
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
  static handleError(error, model: ContractItemModel, messageService: MessageService,
    changeDetector: ChangeDetectorRef) {
    model.pageLoading = false;
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
  static formFieldsTouched(model: ContractItemModel, messageService: MessageService) {
    utils.forIn(model.contractForm.controls, (value: FormControl, name: string) => {
      model.contractForm.controls[name].markAsTouched();
    });
    messageService.clear();
    messageService.add({
      severity: 'error', summary: 'Missing Required Information',
      detail: 'Provide the required information in the highlighted fields and submit the form again'
    });
  }
  static warningMessage(messageService: MessageService) {
    messageService.clear();
    messageService.add({
      severity: 'info',
      summary: 'No Changes Found',
      detail: 'You have not made any changes to save the data'
    });
  }
  static onSelectExpDate(model) {
    model.inCorrectExpDateFormat = false;
    if (model.contractForm.controls['effectiveDate'].value) {
      this.getValidDate(model);
    }
    const expDateValue = model.contractForm.controls['expirationDate'].value.setHours(0, 0, 0, 0);
    model.inCorrectExpDateFormat = (expDateValue > model.expirationMaxDate.setHours(0, 0, 0, 0));
  }
  static getValidDate(model) {
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
    ContractItemUtility.setFormErrors(model);
  }
  static validateDateFormat(event: string, dateStatus: string, model) {
    this.clearError(dateStatus, model);
    const date = event;
    const datePat = /^(1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])\/[0-9]{4}$/;
    const matchArray = date.match(datePat);
    if (matchArray === null) {
      switch (dateStatus) {
        case 'effective':
          model.expirationMinDate = new Date(model.agreementDetails.effectiveDate.replace(/-/g, '\/').replace(/T.+/, ''));
          model.expirationMaxDate = new Date(model.agreementDetails.expirationDate.replace(/-/g, '\/').replace(/T.+/, ''));
          model.inCorrectEffDateFormat = true;
          model.effDate = new Date();
          break;
        case 'expiration':
          model.effectiveMinDate = new Date(model.agreementDetails.effectiveDate.replace(/-/g, '\/').replace(/T.+/, ''));
          model.effectiveMaxDate = new Date(model.agreementDetails.expirationDate.replace(/-/g, '\/').replace(/T.+/, ''));
          model.inCorrectExpDateFormat = true;
          model.expDate = new Date();
          break;
      }
    }
  }
  static clearError(event: string, model) {
    if (event === 'effective') {
      model.inCorrectEffDateFormat = false;
    } else {
      model.inCorrectExpDateFormat = false;
    }
  }
  static setDateValues(model, dateStatus, typedDate) {
    switch (dateStatus) {
      case 'effective':
        model.effDate = new Date(typedDate);
        break;
      case 'expiration':
        model.expDate = new Date(typedDate);
        break;
    }
  }
  static setFormErrors(model) {
    const effError = (model.inCorrectEffDateFormat || model.isNotValidDate);
    const expError = (model.inCorrectExpDateFormat || model.isNotValidDate);
    model.contractForm.controls.effectiveDate.setErrors(effError ? { invalid: true } : null);
    model.contractForm.controls.expirationDate.setErrors(expError ? { invalid: true } : null);
  }
}
