import * as utils from 'lodash';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { MessageService } from 'primeng/components/common/messageservice';
import { HttpErrorResponse } from '@angular/common/http';

import { AccountDetails, HitsItem, CarrierDTO } from './../model/agreement-details.interface';
import { AgreementDetailsModel } from '../model/agreement-details.model';

export class AgreementDetailsUtility {
  static checkFormDirty(model: AgreementDetailsModel): boolean {
    if (model.agreementType === 'Customer') {
      return model.agreementDetailsForm.get('accountName').value ||
      model.agreementDetailsForm.get('teams').value;
    } else {
      return model.carrierDetailsForm.dirty;
    }
  }
  static getSearchResults(dataList: HitsItem[]): AccountDetails  {
    const resultList: AccountDetails = {
      OrganizationName: '', accountName: '', accountCode: '', partyId: null
    };
    utils.forEach(dataList, (value: HitsItem) => {
      if (!utils.isEmpty(value._source) && value._source.OrganizationName) {
        resultList.OrganizationName = `${value._source.OrganizationName.trim()} (${value._source.OrganizationCode.trim()})`;
        resultList.accountName = value._source.OrganizationName.trim();
        resultList.accountCode = value._source.OrganizationCode.trim();
        resultList.partyId = value._source.OrganizationID;
      }
    });
    return resultList;
  }
  static valueChangedCheck(model: AgreementDetailsModel): boolean {
    let isValueChanged = false;
    if (model.agreementDetails) {
      utils.forIn(model.agreementDetailsForm.controls, (value: FormControl, name: string) => {
        isValueChanged = this.checkFormValues(value, name, model);
        return !isValueChanged;
      });
    } else if (model.agreementDetailsForm.dirty) {
      isValueChanged = true;
    }
    return isValueChanged;
  }
  static  checkFormValues(value: FormControl, name: string, model: AgreementDetailsModel): boolean {
    switch (name) {
      case 'teams':
        return (!utils.isEqual(value.value, model.agreementDetails[name]));
      case 'agreementType':
        return (value.value !== model.agreementDetails[name]);
      case 'accountName':
        return (value.value[name] !== model.agreementDetails[name][name]);
      default: return false;
    }
  }
  static getCarrierSearchResults(dataList: HitsItem[]): CarrierDTO  {
    const resultList: CarrierDTO = {
      legalName: '',
      carrierID: null,
      carrierCode: '',
      carrierDisplayName: ''
    };
    utils.forEach(dataList, (value: HitsItem) => {
      if (!utils.isEmpty(value._source) && value._source.LegalName && value._source.CarrierCode) {
        resultList.carrierDisplayName = `${value._source.LegalName.trim()} (${value._source.CarrierCode.trim()})`;
        resultList.legalName = value._source.LegalName.trim();
        resultList.carrierID = value._source.CarrierID;
        resultList.carrierCode = value._source.CarrierCode;
      }
    });
    return resultList;
  }
  static validateDateFormat(event: string, dateStatus: string, index: number, model: AgreementDetailsModel): boolean | undefined {
    const date = event;
    const datePat = /^(1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])\/[0-9]{4}$/;
    const matchArray = date.match(datePat);
    if (matchArray === null || !moment(event, 'MM/DD/YYYY').isValid()) {
      switch (dateStatus) {
        case 'effective':
          model.inCorrectEffDateFormat[index] = true;
          break;
        case 'expiration':
          model.inCorrectExpDateFormat[index] = true;
          break;
      }
      return false;
    }
  }
  static applySort(value1: string | Date, value2: string | Date): number {
    let result = null;
    if (value1 == null && value2 != null) {
      result = -1;
    } else if (value1 != null && value2 == null) {
      result = 1;
    } else if (value1 == null && value2 == null) {
      result = 0;
    } else if (typeof value1 === 'string' && typeof value2 === 'string') {
      result = value1.localeCompare(value2);
    } else {
      result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
    }
    return result;
  }
  /** function to display error in the strip message
   * @static
   * @param {string} errorMessage
   * @param {string} summaryText
   * @param {AgreementDetailsModel} model
   * @param {MessageService} messageService
   * @memberof AgreementDetailsUtility */
  static showError(errorMessage: string, summaryText: string, model: AgreementDetailsModel, messageService: MessageService) {
    model.duplicateErrorFlag = true;
    model.inlineErrormessage.push({
      severity: 'error', summary: summaryText, detail: errorMessage
    });
    messageService.clear();
  }
  /** function to handle error
   * @static
   * @param {HttpErrorResponse} error
   * @param {AgreementDetailsModel} model
   * @param {MessageService} messageService
   * @memberof AgreementDetailsUtility */
  static handleError(error: HttpErrorResponse, model: AgreementDetailsModel, messageService: MessageService) {
    let errorMessage = '';
    if (!utils.isEmpty(error.error.errors[0])) {
      const link = `<a href=\'viewcarrierdetails/${error.error.errors[0].
        errorMessage}\' class=\'pull-right pad-right10 pad-top5 inactivate-link\'>View Agreement</a>`;
      if (error.error.errors[0].code === 'AGREEMENT_NAME_DUPLICATE') {
        errorMessage = `Carrier agreement with specified name already exists. ${link}`;
        AgreementDetailsUtility.showError(errorMessage, 'Agreement Exists', model, messageService);
      } else if (error.error['errors'][0].code === 'CARRIER_DUPLICATE') {
        errorMessage = `End carriers association to other agreement or remove the carrier from this agreement. ${link}`;
        AgreementDetailsUtility.showError(errorMessage, 'Carrier Exists', model, messageService);
      }
    }
  }
}
