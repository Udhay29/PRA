import { MenuItem } from 'primeng/api';
import { FormControl } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';
import * as utils from 'lodash';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';

import { CodesParam, CodesResponse, CustomerAgreementContractsItem, SaveResponse, SectionTypesItem, BillToCodesItem,
TableFormat, DateFormat, ConfigurationParameterDetailsItem, SaveRequest, HitsItem
} from '../model/add-section.interface';
import { AddSectionModel } from './../model/add-section.model';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';
export class AddSectionUtility {
  static getSectionType(sectionType: SectionTypesItem[]): MenuItem[] {
    const sectionList = [];
    utils.forEach(sectionType, (value: SectionTypesItem) => {
      sectionList.push({ value: {
          label: value.sectionTypeName, value: value.sectionTypeID
        }, label: value.sectionTypeName
      });
    });
    return sectionList;
  }
  static savedBroadcast(model: AddSectionModel, shared: BroadcasterService) {
    const data = {
      key: !(model.isSplitView && model.sectionForm.dirty && model.sectionForm.touched),
      message: 'You made changes to the agreement that were not saved'
    };
    shared.broadcast('saved', data);
  }
  static getCurrencyList(currency: string[]): MenuItem[] {
    const currencyList = [];
    utils.forEach(currency, (value: string) => {
      currencyList.push({ label: value, value });
    });
    return currencyList;
  }
  static getContractList(contract: CustomerAgreementContractsItem[], model: AddSectionModel): CustomerAgreementContractsItem[] {
    const contractList = [];
    utils.forEach(contract, (value: CustomerAgreementContractsItem) => {
      const contractId = (value.contractTypeName.toLowerCase() !== 'transactional') ? `${value.customerContractNumber}` :
      `(${value.contractTypeName})`;
      value.label = `${contractId}-${value.customerContractName}`;
      value.value = value.customerContractName;
      value.customerAgreementContractTypeName = value.contractTypeName;
      value.customerAgreementID = model.createAgreement.customerAgreementID;
      value.customerAgreementContractTypeID = value.contractTypeID;
      delete value._links;
      contractList.push(value);
    });
    return contractList;
  }
  static disableDates(model: AddSectionModel, value: Date, key: number) {
    if (key === 0) {
      model.expirationMinDate = this.getDatesValue(model, value, 'min');
    } else {
      model.effectiveMaxDate = this.getDatesValue(model, value, 'max');
    }
  }
  static getDatesValue(model: AddSectionModel, value: Date, key: string): Date {
    if (key === 'min') {
      const backDatedDate = moment().subtract(model.maximumBackDate, 'day');
      return (moment(value).diff(backDatedDate, 'days') > 0) ? value : backDatedDate.toDate();
    } else {
      const futureDatedDate = moment().add(model.maximumFutureDate, 'day');
      return (moment(value).diff(futureDatedDate, 'days') < 0) ? value : futureDatedDate.toDate();
    }
  }
  static getCodesParam(model: AddSectionModel): CodesParam {
    return {
      agreementId: model.createAgreement.customerAgreementID,
      contractId: model.selectedContractId,
      effectiveDate: model.sectionForm.get('effectiveDate').value.toISOString().split('T')[0],
      expirationDate: model.sectionForm.get('expirationDate').value.toISOString().split('T')[0]
    };
  }
  static getBillToList(codesLists: CodesResponse[]): CodesResponse[] {
    const billToList: CodesResponse[] = [];
    utils.forEach(codesLists, (codeList: CodesResponse) => {
      const matchedPartyId = utils.filter(billToList, ['billingPartyID', codeList['billingPartyID']]);
      if (utils.isEmpty(matchedPartyId)) {
        codeList.codes = `${codeList.billingPartyName} (${codeList.billingPartyCode})`;
        billToList.push(codeList);
      }
    });
    return billToList;
  }
  static matchedIndex(model: AddSectionModel, key: string, formField: string): number {
    return utils.findIndex(model.sectionsList, (value: TableFormat) => {
      if (value[key] && model.sectionForm.get(formField).value && utils.isString(model.sectionForm.get(formField).value)) {
        return value[key].toLowerCase() === model.sectionForm.get(formField).value.toLowerCase();
      }
    });
  }
  static toastMessage(messageService: MessageService, type: string, title: string, message: string) {
    messageService.clear();
    messageService.add({
      severity: type,
      summary: title,
      detail: message
    });
  }
  static viewReset(model: AddSectionModel) {
    model.isSplitView = false;
    model.sectionForm.reset();
    model.selectedCodesList = [];
    model.filteredCodesList = [];
    model.codesList = [];
    model.selectedEditSection = [];
  }
  static onSelectExpDate(model: AddSectionModel) {
    model.inCorrectExpDateFormat = false;
    if (model.sectionForm.controls['effectiveDate'].value) {
      this.getValidDate(model);
    }
    const expDateValue = model.sectionForm.controls['expirationDate'].value.setHours(0, 0, 0, 0);
    model.inCorrectExpDateFormat = model.expirationMaxDate ? (expDateValue > model.expirationMaxDate.setHours(0, 0, 0, 0)) : false;
  }
  static getValidDate(model: AddSectionModel) {
    model.isNotValidDate = false;
    const effDateValue = model.sectionForm.controls['effectiveDate'].value;
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    model.inCorrectEffDateFormat = model.effectiveMinDate ? (effDateValue.getTime() < model.effectiveMinDate.setHours(0, 0, 0, 0)) : false;
    if (todayDate.getDate() === effDateValue.getDate()) { effDateValue.setHours(0, 0, 0, 0); }
    if (effDateValue && model.sectionForm.controls['expirationDate'].value) {
      model.isNotValidDate = (effDateValue.getTime() > model.sectionForm.controls['expirationDate'].value.setHours(0, 0, 0, 0) ||
      (model.expirationMaxDate ? effDateValue.getTime() > model.expirationMaxDate.setHours(0, 0, 0, 0) : false));
    }
  }
  static setFormErrors(model: AddSectionModel) {
    model.effError = (model.inCorrectEffDateFormat || model.isNotValidDate);
    model.expError = (model.inCorrectExpDateFormat || model.isNotValidDate);
  }
  static validateDateFormat(event: string, dateStatus: string, model: AddSectionModel): boolean | undefined {
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
  static getCustomerContract(model: AddSectionModel): CustomerAgreementContractsItem {
    const clonedContractId = utils.clone(model.contractIdList);
    const matchedContract = utils.filter(clonedContractId, ['customerContractName', model.sectionForm.controls['contractId'].value]);
    const clonedContract = utils.clone(matchedContract[0]);
    if (!utils.isEmpty(matchedContract)) {
      clonedContract.effectiveDate = clonedContract.effectiveDate.split('T')[0];
      clonedContract.expirationDate = clonedContract.expirationDate.split('T')[0];
      delete clonedContract.label;
      delete clonedContract.value;
    }
    return clonedContract;
  }
  static getSelectedCodesParam(model: AddSectionModel): CodesResponse[] {
    if (utils.isEmpty(model.selectedEditSection)) {
      const clonedCodes = JSON.parse(JSON.stringify(model.selectedCodesList));
      const codeList: CodesResponse[] = [];
      utils.forEach(clonedCodes, (codes: CodesResponse) => {
        codes.effectiveDate = model.sectionForm.get('effectiveDate').value.toISOString().split('T')[0];
        codes.expirationDate = model.sectionForm.get('expirationDate').value.toISOString().split('T')[0];
        delete codes.codes;
        codeList.push(codes);
      });
      return codeList;
    } else {
      return AddSectionUtility.checkSelectedBillTo(model);
    }
  }
  static checkSelectedBillTo(model: AddSectionModel): CodesResponse[] {
    const clonedCodes = JSON.parse(JSON.stringify(model.codesList));
    const codeList: CodesResponse[] = [];
    utils.forEach(clonedCodes, (codes: CodesResponse) => {
      const matchedIndex = utils.findIndex(model.selectedCodesList, ['billingPartyID', codes.billingPartyID]);
      if (!(utils.isNull(codes.customerAgreementContractSectionAccountID) && matchedIndex === -1)) {
        codes.isRemoved = !(matchedIndex > -1);
        codes.effectiveDate = model.sectionForm.get('effectiveDate').value.toISOString().split('T')[0];
        codes.expirationDate = model.sectionForm.get('expirationDate').value.toISOString().split('T')[0];
        delete codes.codes;
        codeList.push(codes);
      }
    });
    return codeList;
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
  static getSelectedCodes(data: BillToCodesItem[]): string[] {
    const selectedCode = [];
    if (!utils.isEmpty(data)) {
      utils.forEach(data, (list: BillToCodesItem) => {
        selectedCode.push(`${list.BillingPartyName}(${list.BillingPartyCode})`);
      });
    }
    return selectedCode;
  }
  static fetchTableformat(data: HitsItem): TableFormat {
    const billToCodes = this.getSelectedCodes(data._source.SectionRanges[0].BillToCodes);
    return {
      agreementId: data._source.AgreementID,
      contract: (data._source.ContractRanges[0].ContractTypeName.toLowerCase() === 'transactional') ?
      `(${data._source.ContractRanges[0].ContractTypeName})-${data._source.ContractRanges[0].ContractName}` :
      `${data._source.ContractRanges[0].ContractNumber}-${data._source.ContractRanges[0].ContractName}`,
      contractId: data._source.ContractID,
      sectionId: data._source.SectionID,
      effectiveDate: this.datePipe(this.dateObj(data._source.SectionOriginalEffectiveDate)),
      expirationDate: this.datePipe(this.dateObj(data._source.SectionOriginalExpirationDate)),
      currency : data._source.SectionRanges[0].SectionCurrencyCode,
      sectionName: data._source.SectionRanges[0].SectionName,
      sectionType: data._source.SectionRanges[0].SectionTypeName,
      toolTipForBillTo: billToCodes.length > 0 ? billToCodes.join('\n') : '--',
      selectedCode: billToCodes.length > 0 ? this.displayCodes(billToCodes).join('\n') : '--',
      sectionVersionID: data._source.SectionRanges[0].SectionVersionID
    };
  }
  static billToCodesList(model: AddSectionModel, data: CodesResponse[]) {
    model.isBillToLoading = false;
    AddSectionUtility.getClonedList(model, data);
  }
  static displayCodes(value: string[]): string[] {
    if (value.length > 2) {
      const selectedCode = utils.slice(value, 0, 2);
      return utils.concat(selectedCode, 'More');
    } else {
      return value;
    }
  }
  static checkEmptyBillTo(model: AddSectionModel, messageService: MessageService) {
    if (utils.isEmpty(model.filteredCodesList)) {
      this.toastMessage(messageService, 'error', 'Error', 'Bill To is not available for selected date range');
    } else {
      this.toastMessage(messageService, 'error', 'Error', 'Select Bill To Codes for the Section');
    }
  }
  static createRequest(model: AddSectionModel): SaveRequest {
    const contractDTO = this.getCustomerContract(model);
    const contractChanged = (utils.isEmpty(model.selectedEditSection)) ? false : (model.editSectionResponse
    .customerContractName !== contractDTO.customerContractName);
    return {
      customerAgreementContractSectionID: (utils.isEmpty(model.selectedEditSection)) ? null :
      model.editSectionResponse.customerAgreementContractSectionID,
      customerAgreementContractSectionVersionID: (utils.isEmpty(model.selectedEditSection)) ? null :
      model.editSectionResponse.customerAgreementContractSectionVersionID,
      customerAgreementContractSectionName: model.sectionForm.get('sectionName').value,
      customerAgreementContractSectionTypeID: model.sectionForm.get('sectionType').value.value,
      customerAgreementContractSectionTypeName: model.sectionForm.get('sectionType').value.label,
      currencyCode: model.sectionForm.get('currency').value,
      customerAgreementContractDTO: contractDTO,
      customerAgreementContractSectionAccountDTOs: this.getSelectedCodesParam(model),
      customerAgreementOwnershipUpdateDTOs: model.createAgreement.teams,
      effectiveDate: model.sectionForm.get('effectiveDate').value.toISOString().split('T')[0],
      expirationDate: model.sectionForm.get('expirationDate').value.toISOString().split('T')[0],
      isCreateAgreementFlow: true,
      isContractChanged: contractChanged
    };
  }
  static dateVariablesReset(model: AddSectionModel) {
    model.disabledEffDatesList = [];
    model.disabledExpDatesList = [];
    model.effectiveMaxDate = null;
    model.effectiveMinDate = null;
    model.expirationMaxDate = null;
    model.expirationMinDate = null;
    model.selectedContractId = null;
  }
  static hideDateErrors(model: AddSectionModel) {
    model.inCorrectEffDateFormat = false;
    model.inCorrectExpDateFormat = false;
    model.isNotValidDate = false;
  }
  static patchData(data: SaveResponse, model: AddSectionModel) {
    model.editSectionResponse = data;
    const sectionType = {label: data.customerAgreementContractSectionTypeName, value: data.customerAgreementContractSectionTypeID};
    const effDate = new Date(data.effectiveDate.replace(/-/g, '\/').replace(/T.+/, ''));
    const expDate = new Date(data.expirationDate.replace(/-/g, '\/').replace(/T.+/, ''));
    model.sectionForm.patchValue({
      sectionName: data.customerAgreementContractSectionName, sectionType , currency: data.currencyCode,
      contractId: data.customerContractName, effectiveDate: effDate, expirationDate: expDate
    });
    this.disableDates(model, effDate, 0);
    this.disableDates(model, expDate, 1);
    model.pageLoading = false;
    model.isSaved = false;
  }
  static getClonedList(model: AddSectionModel, data: CodesResponse[]) {
    model.codesList = AddSectionUtility.getBillToList(data);
    model.filteredCodesList = utils.clone(model.codesList);
    model.selectedCodesList = [];
    if (!utils.isEmpty(model.selectedEditSection)) {
      this.getEditBillTo(model.codesList, model);
    }
  }
  static getDates(data: ConfigurationParameterDetailsItem[], model: AddSectionModel) {
    utils.forEach(data, (configurationDetails: ConfigurationParameterDetailsItem) => {
      switch (configurationDetails.configurationParameter.configurationParameterName) {
        case 'Super User Back Date Days':
          model.maximumBackDate = parseInt(configurationDetails.configurationParameterValue, 10);
          break;
        case 'Super User Future Date Days':
          model.maximumFutureDate = parseInt(configurationDetails.configurationParameterValue, 10);
          break;
        default: break;
      }
    });
  }
  static getEditBillTo(data: CodesResponse[], model: AddSectionModel) {
    utils.forEach(data, (value: CodesResponse) => {
      if (!utils.isNull(value.customerAgreementContractSectionAccountID)) {
        model.selectedCodesList.push(value);
      }
    });
  }
  static handleSuccess(screen: string, router: Router, shared: BroadcasterService, model: AddSectionModel) {
    switch (screen) {
      case 'search' :
        router.navigate([model.searchUrl]);
        break;
      case 'next' :
        shared.broadcast('stepIndexChange', 'next');
        break;
      case 'back' :
        shared.broadcast('stepIndexChange', 'back');
        break;
      default: break;
    }
  }
  static formErrorCheck(model: AddSectionModel, messageService: MessageService) {
    utils.forIn(model.sectionForm.controls, (value: FormControl, name: string) => {
      model.sectionForm.controls[name].markAsTouched();
    });
    if (utils.isEmpty(model.selectedCodesList)) {
      this.checkEmptyBillTo(model, messageService);
    }
    if (model.sectionForm.invalid) {
      this.toastMessage(messageService, 'error', 'Missing Required Information',
      'Provide the required information in the highlighted fields and submit the form again');
    } else if (model.sectionForm.pristine) {
      this.toastMessage(messageService, 'info', 'No Changes Found', 'You have not made any changes to save the data');
    }
  }

  static clearTableFilterData(codesTable: Table, model: AddSectionModel) {
    if (codesTable && codesTable.filters && codesTable.filters.global && codesTable.filters.global.value) {
      codesTable.filters.global.value = '';
    }
    model.searchInputValue = '';
  }
}
