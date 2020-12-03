import { MenuItem } from 'primeng/api';
import * as utils from 'lodash';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';
import { Message } from 'primeng/components/common/message';

import {
  CustomerAgreementContractsItem, SectionTypesItem, BillToList, TableDisplayFormat,
  ConfigurationParameterDetailsItem, SaveRequest, EditRequest, ImpactCount
} from '../../model/sections.interface';
import { SectionsCreationModel } from '../model/sections-creation.model';
export class SectionsCreationUtility {
  static getSectionType(sectionType: SectionTypesItem[]): MenuItem[] {
    const sectionList = [];
    utils.forEach(sectionType, (value: SectionTypesItem) => {
      sectionList.push({
        label: value.sectionTypeName,
        value: value.sectionTypeID
      });
    });
    return sectionList;
  }
  static getCurrencyList(currency: string[]): MenuItem[] {
    const currencyList = [];
    utils.forEach(currency, (value: string) => {
      currencyList.push({ label: value, value });
    });
    return currencyList;
  }
  static getContractList(contract: CustomerAgreementContractsItem[], model: SectionsCreationModel): CustomerAgreementContractsItem[] {
    const contractList = [];
    utils.forEach(contract, (value: CustomerAgreementContractsItem) => {
      const contractId = (value.contractTypeName.toLowerCase() !== 'transactional') ? `${value.customerContractNumber}` :
        `${value.contractTypeName}`;
      value.label = `${contractId} (${value.customerContractName})`;
      value.value = value.customerContractName;
      value.customerAgreementContractTypeName = value.contractTypeName;
      value.customerAgreementID = model.splitViewDetails.agreementId;
      value.customerAgreementContractTypeID = value.contractTypeID;
      delete value._links;
      contractList.push(value);
    });
    return contractList;
  }
  static setFormErrors(model: SectionsCreationModel) {
    const effError = (model.inCorrectEffDateFormat || model.isNotValidDate);
    const expError = (model.inCorrectExpDateFormat || model.isNotValidDate);
    model.sectionForm.controls.effectiveDate.setErrors(effError ? { invalid: true } : null);
    model.sectionForm.controls.expirationDate.setErrors(expError ? { invalid: true } : null);
  }
  static setBillToFormErrors(model: SectionsCreationModel) {
    const effError = (model.inCorrectEffDateFormat || model.isNotValidDate);
    const expError = (model.inCorrectExpDateFormat || model.isNotValidDate);
    model.popupFormGroup.controls.billtoEffective.setErrors(effError ? { invalid: true } : null);
    model.popupFormGroup.controls.billtoExpiration.setErrors(expError ? { invalid: true } : null);
  }
  static clearError(event: string, model: SectionsCreationModel) {
    if (event === 'effective') {
      model.inCorrectEffDateFormat = false;
    } else {
      model.inCorrectExpDateFormat = false;
    }
  }
  static validateDateFormat(event: string, dateStatus: string, model: SectionsCreationModel): boolean | undefined {
    this.clearError(dateStatus, model);
    const date = event;
    const datePat = /^(1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])\/[0-9]{4}$/;
    const matchArray = date.match(datePat);
    if (matchArray === null) {
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
  static formErrorCheck(model: SectionsCreationModel, messageService: MessageService) {
    utils.forIn(model.sectionForm.controls, (value: FormControl, name: string) => {
      model.sectionForm.controls[name].markAsTouched();
    });
    this.toastMessage(messageService, 'error', 'Missing Required Information',
      'Provide the required information in the highlighted fields and submit the form again');
  }
  static toastMessage(messageService: MessageService, type: string, title: string, message: string) {
    messageService.clear();
    messageService.add({
      severity: type,
      summary: title,
      detail: message
    });
  }
  static getBillToCodes(data: BillToList[]): TableDisplayFormat[] {
    const billToCodesList = [];
    utils.forEach(data, (billTo: BillToList) => {
      billToCodesList.push({
        billToCodes: `${billTo.billingPartyName} (${billTo.billingPartyCode})`,
        assignment: utils.isNull(billTo.customerAgreementContractSectionName) ? 'Unassigned' :
          billTo.customerAgreementContractSectionName,
        assignedDates: (utils.isNull(billTo.effectiveDate) && utils.isNull(billTo.expirationDate)) ? '--' :
          `${moment(billTo.effectiveDate).format('MM/DD/YYYY')} - ${moment(billTo.expirationDate).format('MM/DD/YYYY')}`,
        rowDetail: billTo
      });
    });
    return billToCodesList;
  }
  static createSaveRequest(model: SectionsCreationModel, isValidate: boolean): SaveRequest {
    return {
      customerAgreementContractSectionID: null,
      customerAgreementContractSectionVersionID: null,
      customerAgreementContractSectionName: model.sectionForm.get('sectionName').value.trim(),
      customerAgreementContractSectionTypeID: model.sectionForm.get('sectionType').value.value,
      customerAgreementContractSectionTypeName: model.sectionForm.get('sectionType').value.label,
      currencyCode: model.sectionForm.get('currency').value.label,
      customerAgreementContractDTO: this.createContractDTO(model),
      customerAgreementContractSectionAccountDTOs: isValidate ? null : this.createSectionDTO(model),
      effectiveDate: model.sectionForm.get('effectiveDate').value.toISOString().split('T')[0],
      expirationDate: model.sectionForm.get('expirationDate').value.toISOString().split('T')[0],
      isContractChanged: false,
      isCreateAgreementFlow: false,
      customerAgreementOwnershipUpdateDTOs: null
    };
  }
  static createContractDTO(model: SectionsCreationModel): CustomerAgreementContractsItem {
    return {
      customerAgreementContractID: model.sectionForm.get('contractId').value.customerAgreementContractID,
      customerAgreementID: model.splitViewDetails.agreementId,
      customerAgreementContractTypeID: model.sectionForm.get('contractId').value.contractTypeID,
      customerAgreementContractTypeName: model.sectionForm.get('contractId').value.contractTypeName,
      customerContractName: model.sectionForm.get('contractId').value.customerContractName,
      customerContractNumber: model.sectionForm.get('contractId').value.customerContractNumber,
      effectiveDate: model.sectionForm.get('contractId').value.effectiveDate,
      expirationDate: model.sectionForm.get('contractId').value.expirationDate
    };
  }
  static createSectionDTO(model: SectionsCreationModel): BillToList[] {
    const billToList = [];
    utils.forEach(model.selectedCodesList, (codes: TableDisplayFormat) => {
      codes.rowDetail.effectiveDate = model.popupFormGroup.get('billtoEffective').value.toISOString().split('T')[0];
      codes.rowDetail.expirationDate = model.popupFormGroup.get('billtoExpiration').value.toISOString().split('T')[0];
      billToList.push(codes.rowDetail);
    });
    return billToList;
  }
  static getDates(data: ConfigurationParameterDetailsItem[], model: SectionsCreationModel) {
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
  static getDatesValue(model: SectionsCreationModel, key: string, value?: Date): Date {
    if (key === 'min') {
      return moment(value).subtract(model.maximumBackDate, 'days').toDate();
    } else {
      const futureDatedDate = moment(value).add(model.maximumFutureDate, 'days');
      return futureDatedDate.toDate();
    }
  }

  static editSaveRequest(model: SectionsCreationModel, isValidate: boolean): EditRequest {
    return {
      customerAgreementContractSectionID: model.splitViewDetails.sectionDetails.customerAgreementContractSectionID,
      customerAgreementContractSectionVersionID: model.splitViewDetails.sectionDetails.customerAgreementContractSectionVersionID,
      customerAgreementContractSectionName: model.sectionForm.get('sectionName').value.trim(),
      customerAgreementContractSectionTypeID: model.sectionForm.get('sectionType').value.value,
      customerAgreementContractSectionTypeName: model.sectionForm.get('sectionType').value.label,
      currencyCode: model.sectionForm.get('currency').value.label,
      customerAgreementContractDTO: this.createContractDTO(model),
      customerAgreementContractSectionAccountDTOs: isValidate ? null : this.editSectionDTO(model),
      effectiveDate: model.sectionForm.get('effectiveDate').value.toISOString().split('T')[0],
      expirationDate: model.sectionForm.get('expirationDate').value.toISOString().split('T')[0],
      isContractChanged: false,
      isCreateAgreementFlow: false,
      customerAgreementOwnershipUpdateDTOs: null,
      lastUpdateTimestamp: model.splitViewDetails.sectionDetails.lastUpdateTimestamp
    };
  }

  static editSectionDTO(model: SectionsCreationModel): BillToList[] {
    const billToList = [];
    if (model.editSelectedBillToList.length) {
      utils.forEach(model.editSelectedBillToList, (codes: TableDisplayFormat) => {
        if (!codes.rowDetail.isRemoved && codes.rowDetail.isRemoved !== null) {
          codes.rowDetail.effectiveDate = model.popupFormGroup.get('billtoEffective').value.toISOString().split('T')[0];
          codes.rowDetail.expirationDate = model.popupFormGroup.get('billtoExpiration').value.toISOString().split('T')[0];
          billToList.push(codes.rowDetail);
        } else {
          billToList.push(codes.rowDetail);
        }
      });
      return billToList;
    } else {
      if (model.selectedCodesList.length) {
      utils.forEach(model.selectedCodesList, (codes: TableDisplayFormat) => {
        billToList.push(codes.rowDetail);
      });
    }
      return billToList;
    }
  }

  static frameEditBillToCodeList(newSelectedList: TableDisplayFormat[], deSelectedList: TableDisplayFormat[]) {
    const editBillToList = [];
    if (newSelectedList.length) {
      utils.forEach(newSelectedList, (codes: TableDisplayFormat) => {
        codes.rowDetail.isRemoved = false;
        editBillToList.push(codes);
      });
    }
    if (deSelectedList.length) {
      utils.forEach(deSelectedList, (codes: TableDisplayFormat) => {
        codes.rowDetail.isRemoved = true;
        editBillToList.push(codes);
      });
    }
    return editBillToList;
  }

  static setSelectedBillToList(defaultSelectedList: TableDisplayFormat[], model: SectionsCreationModel) {
    utils.forEach(defaultSelectedList, (codes: TableDisplayFormat) => {
      model.editSelectedBillToList.push(codes);
    });
    return model.editSelectedBillToList;
  }

  static isBillToChanged(model: SectionsCreationModel) {
    const sectionAccountId = 'rowDetail.customerAgreementContractSectionAccountID';
    model.selectedCodeListCopy =
      utils.sortBy(model.selectedCodeListCopy, sectionAccountId);
    model.selectedCodesList =
      utils.sortBy(model.selectedCodesList, sectionAccountId);
    const newlySelectedValues = utils.differenceBy(model.selectedCodesList,
      model.selectedCodeListCopy, sectionAccountId);
    const deSelectedValues = utils.differenceBy(model.selectedCodeListCopy,
      model.selectedCodesList, sectionAccountId);
    if (newlySelectedValues.length || deSelectedValues.length) {
      return false;
    } else {
      return true;
    }
  }

  static checkImpactChildCount(countData: ImpactCount, model: SectionsCreationModel): boolean {
    model.accessorialCount = this.getAccessorialCount(countData);
    const childCountSum: number = model.accessorialCount + countData.cargos + countData.fuels + countData.linehauls
      + countData.mileages + countData.ratingRules;
    if (childCountSum === 0) {
      return false;
    } else {
        return true;
    }
  }

   static getAccessorialCount(countData: ImpactCount): number {
    return  countData.documents + countData.rates + countData.averages + countData.gracePeriods
    + countData.freeRules + countData.notifications + countData.suspends;
   }
}
