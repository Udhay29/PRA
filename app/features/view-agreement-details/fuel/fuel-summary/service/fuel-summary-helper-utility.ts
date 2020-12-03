import { FuelSummaryModel } from './../model/fuel-summary.model';
import { AgreementDetails, SaveResponse} from './../model/fuel-summary.interface';
import { MessageService } from 'primeng/components/common/messageservice';
import { FuelSummaryUtility } from './fuel-summary-utility';
import { FormControl } from '@angular/forms';
import * as utils from 'lodash';
import * as moment from 'moment';

export class FuelSummaryHelperUtility {
  /***** @static
   * @param {boolean} value
   * @param {FuelSummaryModel} model
   * @memberof FuelSummaryHelperUtility*/
  static saveSubscription(value: boolean, model: FuelSummaryModel) {
    if (value) {
      model.fuelSummaryForm.markAsPristine();
      model.fuelSummaryForm.markAsUntouched();
    }
  }
  /***** @static
   * @param {FuelSummaryModel} model
   * @param {AgreementDetails} agreementDetails
   * @memberof FuelSummaryHelperUtility */
  static patchDateValues(model: FuelSummaryModel, agreementDetails: AgreementDetails) {
    model.agreementDetails = agreementDetails;
    model.fuelSummaryForm.patchValue({
      effectiveDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
      expirationDate: new Date(agreementDetails.expirationDate.replace(/-/g, '\/').replace(/T.+/, ''))
    });
    model.effectiveMinDate = new Date(agreementDetails.effectiveDate.replace(/-/g, '\/').replace(/T.+/, ''));
    model.expirationMaxDate = new Date(agreementDetails.expirationDate.replace(/-/g, '\/').replace(/T.+/, ''));
  }
  /***** @static
   * @param {FuelSummaryModel} model
   * @returns
   * @memberof FuelSummaryHelperUtility */
  static checkValid(model: FuelSummaryModel): boolean {
    let response = false;
    if (model.fuelSummaryForm.get('effectiveDate').value && model.fuelSummaryForm.get('expirationDate').value
     && model.fuelSummaryForm.get('effectiveDate').valid && model.fuelSummaryForm.get('expirationDate').valid) {
        response = true;
    } else {
        model.billToList = [];
        model.itemList = [];
        response = false;
    }
    return response;
  }
   /***** @static
   * @param {FuelSummaryModel} model
   * @param {MessageService} messageService
   * @memberof FuelSummaryHelperUtility */
  static onClickNext(model: FuelSummaryModel, messageService: MessageService) {
    utils.forIn(model.fuelSummaryForm.controls, (value: FormControl, name: string) => {
      model.fuelSummaryForm.controls[name].markAsTouched();
    });
    FuelSummaryUtility.toastMessage(messageService, 'error', model.errorMessage,
    'Provide the required information in the highlighted fields and submit the form again');
  }
  /***** @static
   * @param {FuelSummaryModel} model
   * @param {string[]} affiliationList
   * @memberof FuelSummaryHelperUtility */
  static getAffiliation(model: FuelSummaryModel, affiliationList: string[]) {
    model.affiliationLevel = FuelSummaryUtility.affiliationList(affiliationList);
    model.fuelSummaryForm.patchValue({
      affiliationLevel: 'agreement'
    });
  }
  /***** @static
   * @param {*} billtotable
   * @memberof FuelSummaryHelperUtility*/
  static clearFilterData(billtotable) {
    if (billtotable && billtotable.filters && billtotable.filters.global && billtotable.filters.global.value) {
      billtotable.filters.global.value = '';
    }
  }
  /***** @static
   * @param {FuelSummaryModel} model
   * @memberof FuelSummaryHelperUtility */
  static affiliationChangeAgreement(model: FuelSummaryModel) {
    model.isShowAgreementBillTO = true;
    model.noRecordMsgFlagBillTo = false;
    model.isShowEmptyBillTo = false;
  }
  /***** @static
   * @param {FuelSummaryModel} model
   * @memberof FuelSummaryHelperUtility */
  static affiliationChangeContract(model: FuelSummaryModel) {
    model.isShowContract = true;
    model.isShowEmptyBillTo = true;
    model.tableLabel = 'Contracts';
    model.tableColumnsList = model.contractColumns;
    model.searchColumns = model.searchContractColumns;
  }
  /***** @static
   * @param {FuelSummaryModel} model
   * @memberof FuelSummaryHelperUtility */
  static affiliationChangeSection(model: FuelSummaryModel) {
    model.isShowContract = true;
    model.isShowEmptyBillTo = true;
    model.tableLabel = 'Sections';
    model.tableColumnsList = model.sectionColumns;
    model.searchColumns = model.searchSectionColumns;
  }
  /***** @static
   * @param {FuelSummaryModel} model
   * @returns
   * @memberof FuelSummaryHelperUtility*/
  static getBillToParams(model: FuelSummaryModel) {
    return {
      effectiveDate: moment(model.fuelSummaryForm.get('effectiveDate').value).format('YYYY-MM-DD'),
      expirationDate: moment(model.fuelSummaryForm.get('expirationDate').value).format('YYYY-MM-DD'),
      isContractWithSections: true
    };
  }
  /***** @static
   * @param {FuelSummaryModel} model
   * @memberof FuelSummaryHelperUtility */
  static clearBeforeBillTo(model: FuelSummaryModel) {
    model.billToList = [];
    model.isTableDataLoading = true;
    model.selectedList = [];
    model.isShowAgreementBillTO = true;
    model.noRecordMsgFlag = false;
    model.noRecordMsgFlagBillTo = false;
  }
  /**** * @static
   * @param {FuelSummaryModel} model
   * @param {*} event
   * @memberof FuelSummaryHelperUtility */
  static isEmptyTable(model: FuelSummaryModel, event) {
    if (event.filteredValue.length === 0) {
      model.noRecordMsgFlag = true;
    } else {
      model.noRecordMsgFlag = false;
    }
  }
  /**** * @static
   * @param {FuelSummaryModel} model
   * @param {*} event
   * @memberof FuelSummaryHelperUtility */
  static isEmptyTableBillTo(model: FuelSummaryModel, event) {
    if (event.filteredValue.length === 0) {
      model.noRecordMsgFlagBillTo = true;
    } else {
      model.noRecordMsgFlagBillTo = false;
    }
  }
  /***** @static
   * @param {FuelSummaryModel} model
   * @memberof FuelSummaryHelperUtility */
  static removeDirty(model: FuelSummaryModel) {
    model.isShowPopup = false;
    model.selectedList = [];
    model.selectedItemList = [];
    utils.forIn(model.fuelSummaryForm.controls, (value: FormControl, name: string) => {
      model.fuelSummaryForm.controls[name].markAsPristine();
    });
  }
  /****
   * @static
   * @param {FuelSummaryModel} model
   * @memberof FuelSummaryHelperUtility*/
  static affiliationChangedYes(model: FuelSummaryModel) {
    model.noRecordMsgFlagBillTo = false;
    model.isShowPopup = false;
    model.fuelSummaryForm.get('selectedData').markAsPristine();
    model.fuelSummaryForm.get('selectedListData').markAsPristine();
    model.affiliationValue = model.selectedAffiliationValue;
    model.fuelSummaryForm.patchValue({
      affiliationLevel: model.selectedAffiliationValue
    });
    model.fuelSummaryForm.updateValueAndValidity();
  }
  /**** * @static
   * @param {FuelSummaryModel} model
   * @returns
   * @memberof FuelSummaryHelperUtility */
  static getContractBillToIds(model: FuelSummaryModel): number[] {
    const idArray = [];
    const ids = model.fuelSummaryForm.controls['affiliationLevel'].value === 'contract' ?
    'customerAgreementContractID' : 'customerAgreementContractSectionID';
    if (!utils.isEmpty(model.selectedItemList)) {
      utils.forEach(model.selectedItemList, contract => {
        idArray.push(contract[ids]);
      });
    }
    return idArray;
  }
  /***** @static
   * @param {FuelSummaryModel} model
   * @memberof FuelSummaryHelperUtility */
  static getAgreementBillTo(model: FuelSummaryModel) {
    model.noRecordMsgFlagBillTo = false;
    model.isContractBillTo = false;
    model.isSectionBillTo = false;
    if (model.selectedList.length > 0 && model.fuelSummaryForm.controls['affiliationLevel'].value === 'contract') {
      model.isShowEmptyBillTo = false;
      model.isContractBillTo = true;
    } else if (model.selectedList.length > 0 && model.fuelSummaryForm.controls['affiliationLevel'].value === 'section') {
      model.isShowEmptyBillTo = false;
      model.isSectionBillTo = true;
    }
  }
  /***** @static
   * @param {FuelSummaryModel} model
   * @memberof FuelSummaryHelperUtility */
  static formatRequest(model: FuelSummaryModel) {
    FuelSummaryUtility.resetRequestData(model);
    const level = model.fuelSummaryForm.controls['affiliationLevel'].value;
    switch (level) {
      case 'agreement':
        FuelSummaryUtility.getBillToRequestData(model);
        break;
      case 'contract':
        if (model.isContractBillTo) {
          FuelSummaryUtility.getSelectedContractBillToRequest(model);
        } else {
          FuelSummaryUtility.getContractListData(model);
        }
        break;
      case 'section':
        if (model.isSectionBillTo) {
          FuelSummaryUtility.getSelectedSectionBillToRequest(model);
        } else {
          FuelSummaryUtility.getSectionListData(model);
        }
        break;
      default: break;
    }
  }
  /***** @static
   * @param {FuelSummaryModel} model
   * @memberof FuelSummaryHelperUtility */
  static clearList(model: FuelSummaryModel) {
    model.searchInputValue = '';
    model.billToSearchInputValue = '';
    model.isTableDataLoading = true;
    model.itemList = [];
    model.selectedList = [];
    model.selectedItemList = [];
    model.billToList = [];
  }
  /***** @static
   * @param {FuelSummaryModel} model
   * @param {SaveResponse[]} data
   * @memberof FuelSummaryHelperUtility */
  static formatList(model: FuelSummaryModel, data: SaveResponse[]) {
    model.isTableDataLoading = false;
    if (!utils.isEmpty(data)) {
      utils.forEach(data, (value: SaveResponse) => {
      value.customerContractNumber =
      value.contractTypeName === 'Transactional' ? `${value.contractTypeName}` : value.customerContractNumber;
      value.combineNameNumber = `${value.customerContractNumber} (${value.customerContractName})`;
      value.effectiveDate = moment(value.effectiveDate).format(model.dateFormat);
      value.expirationDate = moment(value.expirationDate).format(model.dateFormat);
      model.itemList.push(value);
      });
    }
    model.noRecordMsgFlag = false;
  }
}
