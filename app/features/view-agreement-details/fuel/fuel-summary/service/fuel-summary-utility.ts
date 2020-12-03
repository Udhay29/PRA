import { MessageService } from 'primeng/components/common/messageservice';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import * as utils from 'lodash';
import { SelectItem } from 'primeng/api';
import { FuelSummaryModel } from './../model/fuel-summary.model';
import { ListItem, BillToList, BillToFormat, BillToSelectedList, RootObject, ServiceOfferingBusinessUnitTransitModeAssociationsItem,
   HitsItem, FuelSummarySaveRequest, CarrierDTO } from './../model/fuel-summary.interface';
import { SaveResponse } from '../../../../create-agreement/add-section/model/add-section.interface';
export class FuelSummaryUtility {
  /** function to create all the form fields of fuelSummaryForm * @memberof FuelSummaryComponent */
  static createFuelSummaryForm(formbuilder: FormBuilder, model: FuelSummaryModel): FormGroup {
    return formbuilder.group({
      programType: ['create', Validators.required],
      programName: [null, Validators.required],
      effectiveDate: [null, Validators.required],
      expirationDate: [null, Validators.required],
      businessUnit: [null, Validators.required],
      carriers: [null],
      affiliationLevel: ['', Validators.required],
      notes: [null],
      selectedData: [model.selectedList],
      selectedListData: [model.selectedItemList]
    });
  }
  /***** @static
   * @param {Date} value
   * @param {number} key
   * @param {FuelSummaryModel} model
   * @memberof FuelSummaryUtility */
  static onDateSelect(value: Date, key: number, model: FuelSummaryModel) {
    if (key === 0) {
      model.fuelSummaryForm.controls.effectiveDate.setErrors(null);
      model.expirationMinDate = new Date(value);
      this.checkErrors('expirationDate', model);
    } else {
      model.fuelSummaryForm.controls.expirationDate.setErrors(null);
      model.effectiveMaxDate = new Date(value);
      this.checkErrors('effectiveDate', model);
    }
  }
  /***** @static
   * @param {string} key
   * @param {FuelSummaryModel} model
   * @memberof FuelSummaryUtility */
  static checkErrors(key: string, model: FuelSummaryModel) {
    if (model.fuelSummaryForm.get(key).hasError('invalid')) {
      model.fuelSummaryForm.get(key).setErrors(null);
      model.fuelSummaryForm.get(key).setValidators(Validators.required);
      model.fuelSummaryForm.get(key).updateValueAndValidity();
    }
  }
  /** function called to validate the expiration date * @static
   * @param {FuelSummaryModel} model
   * @memberof FuelSummaryUtility */
  static onSelectExpDate(model: FuelSummaryModel) {
    model.inCorrectExpDateFormat = false;
    if (model.fuelSummaryForm.controls['effectiveDate'].value) {
      this.getValidDate(model);
    }
    const expDateValue = model.fuelSummaryForm.controls['expirationDate'].value.setHours(0, 0, 0, 0);
    model.inCorrectExpDateFormat = (expDateValue > model.expirationMaxDate.setHours(0, 0, 0, 0));
  }
  /** function to check whether the entered date is valid
   * @static
   * @param {FuelSummaryModel} model
   * @memberof FuelSummaryUtility */
  static getValidDate(model: FuelSummaryModel) {
    model.isNotValidDate = false;
    const effDateValue = model.fuelSummaryForm.controls['effectiveDate'].value;
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    model.inCorrectEffDateFormat = (effDateValue.getTime() < model.effectiveMinDate.setHours(0, 0, 0, 0));
    if (todayDate.getDate() === effDateValue.getDate()) {
      effDateValue.setHours(0, 0, 0, 0);
    }
    if (effDateValue && model.fuelSummaryForm.controls['expirationDate'].value) {
      model.isNotValidDate = (effDateValue.getTime() > model.fuelSummaryForm.controls['expirationDate'].value.setHours(0, 0, 0, 0) ||
      effDateValue.getTime() > model.expirationMaxDate.setHours(0, 0, 0, 0));
    }
  }
  /***** @static
   * @param {Event} event
   * @param {string} dateStatus
   * @param {FuelSummaryModel} model
   * @returns {(boolean | undefined)}
   * @memberof FuelSummaryUtility */
  static validateDateFormat(event, dateStatus: string, model: FuelSummaryModel): boolean | undefined {
    const date = event.srcElement['value'];
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
  /** function to set errors on date field based on the value * @static
   * @param {FuelSummaryModel} model
   * @memberof FuelSummaryUtility */
  static setFormErrors(model: FuelSummaryModel) {
    const effError = (model.inCorrectEffDateFormat || model.isNotValidDate);
    const expError = (model.inCorrectExpDateFormat || model.isNotValidDate);
    model.fuelSummaryForm.controls.effectiveDate.setErrors(effError ? {invalid: true} : null);
    model.fuelSummaryForm.controls.expirationDate.setErrors(expError ? {invalid: true} : null);
  }
  /***** @static
   * @param {RootObject} offeringList
   * @returns {ListItem[]}
   * @memberof FuelSummaryUtility */
  static getBusinessUnitServiceOfferingList(offeringList: RootObject): ListItem[] {
    const dropdownList = [];
    if (!utils.isEmpty(offeringList) && !utils.isEmpty(offeringList._embedded) &&
    !utils.isEmpty(offeringList._embedded.serviceOfferingBusinessUnitTransitModeAssociations)) {
      utils.forEach(offeringList._embedded.serviceOfferingBusinessUnitTransitModeAssociations,
      (associationList: ServiceOfferingBusinessUnitTransitModeAssociationsItem) => {
        const dataObject = associationList.financeBusinessUnitServiceOfferingAssociation;
        const objectFormat = {
          value: {
            financeBusinessUnitServiceOfferingAssociationID: dataObject.financeBusinessUnitServiceOfferingAssociationID,
            financeBusinessUnitCode: dataObject.financeBusinessUnitCode,
            serviceOfferingCode: dataObject.serviceOfferingCode,
            financeBusinessUnitServiceOfferingDisplayName: `${dataObject.financeBusinessUnitCode} - ${dataObject.serviceOfferingCode}`
          }, label : `${dataObject.financeBusinessUnitCode} - ${dataObject.serviceOfferingCode}`
        };
        dropdownList.push(objectFormat);
      });
    }
    return utils.sortBy(dropdownList, ['value.financeBusinessUnitCode', 'value.serviceOfferingCode']);
  }
  /***** @static
   * @param {FuelSummaryModel} model
   * @returns {FuelSummarySaveRequest}
   * @memberof FuelSummaryUtility */
  static createSaveRequest(model: FuelSummaryModel): FuelSummarySaveRequest {
    const fuelType = utils.upperFirst(model.fuelSummaryForm.get('affiliationLevel').value);
    return {
      customerAgreementID: model.agreementDetails.customerAgreementID,
      customerAgreementName: model.agreementDetails.customerAgreementName,
      fuelProgramName: model.fuelSummaryForm.get('programName').value.trim(),
      effectiveDate: model.fuelSummaryForm.get('effectiveDate').value.toISOString().split('T')[0],
      expirationDate: new Date(model.fuelSummaryForm.get('expirationDate').value.toDateString()).toISOString().split('T')[0],
      fuelProgramCarrierDTOs: utils.isEmpty(model.fuelSummaryForm.get('carriers').value) ? null :
      model.fuelSummaryForm.get('carriers').value,
      fuelProgramServiceOfferingDTOs: model.fuelSummaryForm.get('businessUnit').value,
      fuelProgramAccountBillToCodeDTOs: model.billTorequestData.length > 0 ? model.billTorequestData : null,
      fuelProgramAccountContractDTOs: utils.isEmpty(model.contractListData) ? null : model.contractListData,
      fuelProgramAccountContractBillToCodeDTOs : model.selectedBilltoContract.length > 0 ? model.selectedBilltoContract : null,
      fuelProgramAccountSectionDTOs: utils.isEmpty(model.sectionListData) ? null : model.sectionListData,
      fuelProgramAccountSectionBillToCodeDTOs: model.selectedBillToSection.length > 0 ? model.selectedBillToSection : null,
      fuelProgramComment: utils.isEmpty(model.fuelSummaryForm.get('notes').value) ? null :
      model.fuelSummaryForm.get('notes').value,
      fuelProgramType: model.billTorequestData.length > 0 || model.selectedBilltoContract.length > 0 ||
       model.selectedBillToSection.length > 0 ? `${fuelType}-BillTo` : fuelType,
      agreementEffectiveDate: model.agreementDetails.effectiveDate,
      agreementExpirationDate: model.agreementDetails.expirationDate
    };
  }
  /***** @static
   * @param {string[]} affiliationList
   * @returns {SelectItem[]}
   * @memberof FuelSummaryUtility */
  static affiliationList(affiliationList: string[]): SelectItem[] {
    const affiliationLevelList = [];
    utils.forEach(affiliationList, (affiliationData: string) => {
      affiliationLevelList.push({
        label: affiliationData, value: affiliationData.toLowerCase()
      });
    });
    return affiliationLevelList;
  }
  /***** @static
   * @param {HitsItem[]} carrierList
   * @returns {CarrierDTO[]}
   * @memberof FuelSummaryUtility */
  static getCarrierList(carrierList: HitsItem[]): CarrierDTO[] {
    const carrierDetailList = [];
    utils.forEach(carrierList, (carrierDetail: HitsItem) => {
      if (!utils.isEmpty(carrierDetail._source)) {
        carrierDetailList.push({
          legalName: carrierDetail._source.LegalName,
          carrierID: carrierDetail._source.CarrierID,
          carrierCode: carrierDetail._source.CarrierCode,
          carrierDisplayName: `${carrierDetail._source.LegalName} (${carrierDetail._source.CarrierCode})`
        });
      }
    });
    return carrierDetailList;
  }
  /**** * @static
   * @param {FuelSummaryModel} model
   * @param {(Event | string)} event
   * @memberof FuelSummaryUtility */
  static checkSelectedData(model: FuelSummaryModel, event: Event | string) {
    if ((model.fuelSummaryForm.get('selectedData').dirty && model.selectedAffiliationValue ===
    model.fuelSummaryForm.get('affiliationLevel').value) || (model.fuelSummaryForm.get('selectedListData').dirty &&
    model.selectedAffiliationValue ===
    model.fuelSummaryForm.get('affiliationLevel').value)) {
      event['value'] = model.affiliationValue;
      model.fuelSummaryForm.get('affiliationLevel').setValue(model.affiliationValue,
      {emitModelToViewChange: true});
      model.isShowPopup = true;
      model.fuelSummaryForm.get('affiliationLevel').updateValueAndValidity();
    } else {
      model.affiliationValue = event['value'] ? event['value'] : event;
      model.fuelSummaryForm.patchValue({
        affiliationLevel: model.affiliationValue
      });
    }
  }
  /***** @static
   * @param {*} data
   * @returns
   * @memberof FuelSummaryUtility */
  static formatBillToList(data: BillToList[]) {
    const agreemntdataList = [];
    utils.forEach(data, (contracts: BillToList) => {
      const contractId = (contracts.contractType === 'Transactional') ? `${contracts.contractType}` :
      contracts.contractNumber;
      const billToDisplayName = `${contracts.billingPartyName} (${contracts.billingPartyCode})`;
      const contractObject = {
        display: `${contracts.billingPartyName} (${contracts.billingPartyCode})`,
        section: contracts.sectionName,
        contract: `${contractId} (${contracts.contractName})`,
        saveData: {
          billingPartyID: contracts.billingPartyID,
          billingPartyCode: contracts.billingPartyCode,
          billingPartyName: contracts.billingPartyName,
          billingPartyDisplayName: billToDisplayName,
          sectionAccountID: contracts.sectionAccountID
        },
        saveContractBillTo: {
          billingPartyID: contracts.billingPartyID,
          billingPartyCode: contracts.billingPartyCode,
          billingPartyName: contracts.billingPartyName,
          billingPartyDisplayName: billToDisplayName,
          sectionAccountID: contracts.sectionAccountID,
          customerAgreementContractID: contracts.contractID,
          customerContractNumber: contracts.contractNumber,
          customerContractName: contracts.contractName,
          customerContractType: contracts.contractType,
          customerContractDisplayName: `${contractId} (${contracts.contractName})`
        },
        saveSectionBillTo: {
          customerAgreementSectionID: contracts.sectionID,
          customerAgreementSectionName: contracts.sectionName,
          billingPartyID: contracts.billingPartyID,
          billingPartyCode: contracts.billingPartyCode,
          billingPartyName: contracts.billingPartyName,
          billingPartyDisplayName: billToDisplayName,
          sectionAccountID: contracts.sectionAccountID
        }
      };
      agreemntdataList.push(contractObject);
    });
    return agreemntdataList;
  }
  /***** @static
   * @param {FuelSummaryModel} model
   * @memberof FuelSummaryUtility*/
  static resetShowFlags(model: FuelSummaryModel) {
    model.isShowAgreementBillTO = false;
    model.isShowContract = false;
    model.isShowSection = false;
  }
  /***** @static
   * @param {FuelSummaryModel} model
   * @memberof FuelSummaryUtility */
  static getBillToRequestData(model: FuelSummaryModel)  {
    model.billTorequestData = [];
    const selectionValid = (model.fuelSummaryForm.get('affiliationLevel').value === 'agreement') ? true :
     (!utils.isEmpty(model.selectedList));
     if (model.fuelSummaryForm.valid && selectionValid) {
      model.billTorequestData = this.getSelectedAgreement(model);
    }
  }
  /***** @static
   * @param {FuelSummaryModel} model
   * @returns {*}
   * @memberof FuelSummaryUtility */
  static getSelectedAgreement(model: FuelSummaryModel): BillToSelectedList[] {
    if (model.affiliationValue === 'agreement') {
      const contractRequest = [];
      utils.forEach(model.selectedList, (selected: BillToFormat) => {
        contractRequest.push(selected.saveData);
      });
      return contractRequest;
    } else {
      return null;
    }
  }
  /** function to display toast message on success or error
   * @static
   * @param {MessageService} messageService
   * @param {string} type
   * @param {string} title
   * @param {string} detail
   * @memberof FuelSummaryUtility */
  static toastMessage(messageService: MessageService, type: string, title: string, detail: string) {
    messageService.clear();
    messageService.add({
      severity: type,
      summary: title,
      detail
    });
  }
  /**** * @static
   * @param {FuelSummaryModel} model
   * @memberof FuelSummaryUtility */
  static getContractListData(model: FuelSummaryModel)  {
    const selectionValid = model.fuelSummaryForm.get('affiliationLevel').value === 'contract';
     if (model.fuelSummaryForm.valid && selectionValid && !utils.isEmpty(model.selectedItemList)) {
      model.contractListData = [];
        utils.forEach(model.selectedItemList, (value: any) => {
          model.contractListData.push({
            'customerAgreementContractID': value.customerAgreementContractID,
            'customerContractNumber': value.customerContractNumber,
            'customerContractName' : value.customerContractName,
            'customerContractType': value.contractTypeName,
            'customerContractDisplayName': value.combineNameNumber
          });
        });
    }
  }
  /***** @static
   * @param {FuelSummaryModel} model
   * @memberof FuelSummaryUtility */
  static resetRequestData(model: FuelSummaryModel) {
    model.billTorequestData = [];
    model.selectedBilltoContract = [];
    model.selectedBillToSection = [];
  }
  /**** * @static
   * @param {FuelSummaryModel} model
   * @memberof FuelSummaryUtility */
  static getSelectedContractBillToRequest(model: FuelSummaryModel) {
    model.selectedBilltoContract = [];
    if (!utils.isEmpty(model.selectedList) && model.fuelSummaryForm.get('affiliationLevel').value === 'contract') {
    utils.forEach(model.selectedList, (selected: BillToFormat) => {
      model.selectedBilltoContract.push(selected.saveContractBillTo);
    });
    utils.forEach(model.selectedBilltoContract, (selectedBillto: any) => {
      utils.remove(model.selectedItemList, { customerAgreementContractID: selectedBillto.customerAgreementContractID  });
    });
    if (model.selectedItemList.length) {
      utils.forEach(model.selectedItemList, (contWithoutBillTo: any) => {
        model.selectedBilltoContract.push({
            billingPartyID: null,
            billingPartyCode: null,
            billingPartyName: null,
            billingPartyDisplayName: null,
            sectionAccountID: null,
            customerAgreementContractID: contWithoutBillTo.customerAgreementContractID,
            customerContractNumber: contWithoutBillTo.customerContractNumber,
            customerContractName: contWithoutBillTo.customerContractName,
            customerContractType: contWithoutBillTo.contractTypeName,
            customerContractDisplayName: contWithoutBillTo.combineNameNumber
        });
      });
    }
  }
  }
  /***** @static
   * @param {FuelSummaryModel} model
   * @memberof FuelSummaryUtility */
  static getSectionListData(model: FuelSummaryModel)  {
    const selectionValid = model.fuelSummaryForm.get('affiliationLevel').value === 'section';
     if (model.fuelSummaryForm.valid && selectionValid && !utils.isEmpty(model.selectedItemList)) {
      model.sectionListData = [];
        utils.forEach(model.selectedItemList, (value: SaveResponse) => {
          model.sectionListData.push({
            customerAgreementSectionID: value.customerAgreementContractSectionID,
            customerAgreementSectionName: value.customerAgreementContractSectionName
          });
        });
    }
  }
  /***** @static
   * @param {FuelSummaryModel} model
   * @memberof FuelSummaryUtility */
  static getSelectedSectionBillToRequest(model: FuelSummaryModel) {
    model.selectedBillToSection = [];
    if (!utils.isEmpty(model.selectedList) && model.fuelSummaryForm.get('affiliationLevel').value === 'section') {
      utils.forEach(model.selectedList, (selected: BillToFormat) => {
        model.selectedBillToSection.push(selected.saveSectionBillTo);
      });
      utils.forEach(model.selectedBillToSection, (selectedBillto: any) => {
        utils.remove(model.selectedItemList, { customerAgreementContractSectionID: selectedBillto.customerAgreementSectionID  });
      });
      if (model.selectedItemList.length) {
        utils.forEach(model.selectedItemList, (contWithoutBillTo: any) => {
          model.selectedBillToSection.push({
              customerAgreementSectionID: contWithoutBillTo.customerAgreementContractSectionID,
              customerAgreementSectionName: contWithoutBillTo.customerAgreementContractSectionName,
              billingPartyID: null,
              billingPartyCode: null,
              billingPartyName: null,
              billingPartyDisplayName: null,
              sectionAccountID: null
          });
        });
      }
    }
  }
  /***** @static
   * @param {FuelSummaryModel} model
   * @memberof FuelSummaryUtility*/
  static onTypeEffectiveDate(model: FuelSummaryModel) {
    model.inCorrectEffDateFormat = false;
    this.getValidDate(model);
    model.fuelSummaryForm.controls.effectiveDate.setErrors(null);
    model.expirationMinDate = new Date(model.fuelSummaryForm.controls['effectiveDate'].value);
  }
  /***** @static
   * @param {FuelSummaryModel} model
   * @memberof FuelSummaryUtility*/
  static onTypeExpirationDate(model: FuelSummaryModel) {
    model.inCorrectExpDateFormat = false;
    this.onSelectExpDate(model);
    model.fuelSummaryForm.controls.expirationDate.setErrors(null);
    model.effectiveMaxDate = new Date(model.fuelSummaryForm.controls['expirationDate'].value);
  }
}
