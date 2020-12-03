import { element } from 'protractor';
import { Injectable, ModuleWithProviders } from '@angular/core';
import {
  CustomerAgreementDto, AgreementBURequestListDto, AgreementBURequestDto,
  ContractRequestDto, SectionRequestDto, ContractBuRequestDto, ContractBuRequestList,
  SectionBuRequestDto, SectionBuRequestList, SectionRowData, ContractBUList
} from './../../models/add-cargo-interface';
import * as moment from 'moment';
import * as utils from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CreateCargoUtilsService {

  constructor() { }


  onCreateAgreementQuery(parent): CustomerAgreementDto {
    return {
      'cargoReleaseType': 'Agreement',
      'customerAgreementCargoDTO': {
        'existingESDocID': (parent['rowData'] && parent['rowData'][0]) ? parent['rowData'][0]['uniqueDocID'] : null,
        'customerAgreementCargoID': (parent['rowData'] && parent['rowData'][0]) ?
        parent['rowData'][0]['customerAgreementCargoIDs'][0] : null,
        'agreementCargoAmount': this.amountFormatter(parent.createCargoModel.cargoReleaseForm.controls['cargoValue'].value),
        'agreementEffectiveDate': this.postDateFormatter(parent.createCargoModel.effectiveDate),
        'agreementExpirationDate': this.postDateFormatter(parent.createCargoModel.expirationDate)
      }
    };
  }
  amountFormatter(amount: number): string {
    return amount.toString().replace(/[$,]/g, '');
  }
  onCreateAgreementBuQuery(parent): AgreementBURequestDto {
    if (!utils.isEmpty(parent['rowData']) && !utils.isEmpty(parent['rowData'][0])) {
      return {
        'cargoReleaseType': parent.createCargoModel.cargoType,
        'customerAgreementBusinessUnitCargoList': this.iterateRowDataBu(parent)
      };
    } else {
      return {
        'cargoReleaseType': parent.createCargoModel.cargoType,
        'customerAgreementBusinessUnitCargoList': this.iterateBusinessUnit(parent)
      };
    }
  }

  iterateRowDataBu(parent): Array<AgreementBURequestListDto> {
    let businessUnitValues = [];
    const selectedBusinessUnit = [];
    const newbusinessUnitValues = [];
    parent['rowData'][0]['financeBusinessUnitAssociations'].forEach((existingBusinessUnit: any) => {
      let count = 0;
      parent.createCargoModel.cargoReleaseForm.controls['businessUnit'].value.forEach((businessUnit, valIndex) => {
        newbusinessUnitValues.push(businessUnit['value']);
        if (existingBusinessUnit['financeBusinessUnitCode'] === businessUnit['value']) {
          selectedBusinessUnit.push(businessUnit['value']);
          count++;
        }
      });
      businessUnitValues.push(this.checkbusinessUnitValues(parent, count, existingBusinessUnit));
    });
    const newBusinessUnitValue = utils.difference(utils.uniq(newbusinessUnitValues), selectedBusinessUnit);
    if (!utils.isEmpty(newBusinessUnitValue)) {
      businessUnitValues = this.addedBusinessUnitDto(newBusinessUnitValue, businessUnitValues, parent);
    }
    return businessUnitValues;
  }

  addedBusinessUnitDto(newBusinessUnitValue: Array<string>,
    businessUnitValues: Array<AgreementBURequestListDto>, parent): Array<AgreementBURequestListDto> {
    newBusinessUnitValue.forEach(newBusinessUnitList => {
      businessUnitValues.push({
        'customerAgreementID': parent['rowData'][0]['agreementID'],
        'customerAgreementBusinessUnitCargoID': null,
        'action': null,
        'financeBusinessUnitCode': newBusinessUnitList,
        'existingESDocID': parent['rowData'][0]['uniqueDocID'],
        'isCreateFlow': false,
        'agreementBusinessUnitCargoAmount': this.amountFormatter(parent.createCargoModel.cargoReleaseForm.controls['cargoValue'].value),
        'agreementBuEffectiveDate': this.postDateFormatter(parent.createCargoModel.cargoReleaseForm.controls['effectiveDate'].value),
        'agreementBuExpirationDate': this.postDateFormatter(parent.createCargoModel.cargoReleaseForm.controls['expirationDate'].value),
        'agreementDefaultCargoAmount': this.amountFormatter(parent.createCargoModel.cargoDefaultAmount)
      });
    });
    return businessUnitValues;
  }

  checkbusinessUnitValues(parent, count: number, existingBusinessUnit: any): AgreementBURequestListDto {
    let businessUnitValues;
    existingBusinessUnit['customerAgreementID'] = parent.createCargoModel.agreementId.customerAgreementID;
    existingBusinessUnit['agreementDefaultCargoAmount'] = this.amountFormatter(parent.createCargoModel.cargoDefaultAmount);
    existingBusinessUnit['customerAgreementBusinessUnitCargoID'] = existingBusinessUnit.customerAgreementBusinessUnitCargoID;
    existingBusinessUnit['existingESDocID'] = parent['rowData'][0]['uniqueDocID'];
    existingBusinessUnit['agreementBusinessUnitCargoAmount'] =
      this.amountFormatter(parent.createCargoModel.cargoReleaseForm.controls['cargoValue'].value);
    existingBusinessUnit['agreementBuEffectiveDate'] =
      this.postDateFormatter(parent.createCargoModel.cargoReleaseForm.controls['effectiveDate'].value);
    existingBusinessUnit['agreementBuExpirationDate'] =
      this.postDateFormatter(parent.createCargoModel.cargoReleaseForm.controls['expirationDate'].value);
    delete existingBusinessUnit['currencyCode'];
    if (count === 0) {
      existingBusinessUnit['action'] = 'DELETE';
    }
    businessUnitValues = existingBusinessUnit;
    return businessUnitValues;
  }
  onCreateContractQuery(parent): ContractRequestDto {
    const contractSelected = this.getSelectedContract(parent);
    return {
      'cargoReleaseType': parent.createCargoModel.cargoType,
      'customerContractCargoDTO': {
        'existingESDocID': (parent['rowData'] && parent['rowData'][0]) ? parent['rowData'][0]['uniqueDocID'] : null,
        'contractID': contractSelected['label']['customerContractID'],
        'contractName': contractSelected['label']['customerContractName'],
        'contractNumber': contractSelected['label']['customerContractNumber'],
        'contractType': contractSelected['label']['customerContractType'],
        'contractDisplayName': contractSelected.value,
        'customerContractCargoID': (parent['rowData'] && parent['rowData'][0]) ?
        parent['rowData'][0]['customerAgreementCargoIDs'][0] : null,
        'contractCargoAmount': this.amountFormatter(parent.createCargoModel.cargoReleaseForm.controls['cargoValue'].value),
        'contractEffectiveDate': this.postDateFormatter(parent.createCargoModel.cargoReleaseForm.controls['effectiveDate'].value),
        'contractExpirationDate': this.postDateFormatter(parent.createCargoModel.cargoReleaseForm.controls['expirationDate'].value),
        'agreementDefaultCargoAmount': this.amountFormatter(parent.createCargoModel.cargoDefaultAmount)
      }
    };
  }
  getSelectedContract(parent) {
    let returnData = parent.createCargoModel.cargoReleaseForm.controls['contract'].value;
    if (parent['rowData'] && parent['rowData'][0]) {
      const filteredContract = utils.filter(parent.createCargoModel.allContractCargoValues, ['value',
        parent.createCargoModel.cargoReleaseForm.controls['contract'].value.value]);
      returnData = !(utils.isEmpty(filteredContract)) ? filteredContract[0] : {};
    }
    return returnData;
  }
  onCreateSectionQuery(parent): SectionRequestDto {
    return {
      'cargoReleaseType': parent.createCargoModel.cargoType,
      'customerSectionCargoDTO': {
        'sectionID': parent.createCargoModel.selectedSectionsList['customerSectionID'],
        'sectionName': parent.createCargoModel.selectedSectionsList['customerSectionName'],
        'customerContractSectionCargoID': (parent['rowData'] && parent['rowData'][0])
          ? parent['rowData'][0]['customerAgreementCargoIDs'][0] : null,
        'sectionCargoAmount': this.amountFormatter(parent.createCargoModel.cargoReleaseForm.controls['cargoValue'].value),
        'sectionEffectiveDate': this.postDateFormatter(parent.createCargoModel.cargoReleaseForm.controls['effectiveDate'].value),
        'sectionExpirationDate': this.postDateFormatter(parent.createCargoModel.cargoReleaseForm.controls['expirationDate'].value),
        'agreementDefaultCargoAmount': this.amountFormatter(parent.createCargoModel.cargoDefaultAmount),
        'existingESDocID': (parent['rowData'] && parent['rowData'][0]) ? parent['rowData'][0]['uniqueDocID'] : null,
        'customerAgreementID': parent.createCargoModel.agreementId.customerAgreementID,
      }
    };
  }
  onCreateContractBuQuery(parent): ContractBuRequestDto {
    if (!utils.isEmpty(parent['rowData']) && !utils.isEmpty(parent['rowData'][0])) {
      return {
        'cargoReleaseType': 'ContractBU',
        'customerContractBusinessUnitCargoList': this.iterateRowDataCargoBu(parent)
      };
    } else {
      return {
        'cargoReleaseType': 'ContractBU',
        'customerContractBusinessUnitCargoList': this.iterateContractBu(parent)
      };
    }
  }
  iterateRowDataCargoBu(parent): Array<ContractBuRequestList> {
    let businessUnitValues = [];
    const selectedBusinessUnit = [];
    const newbusinessUnitValues = [];
    parent['rowData'][0]['financeBusinessUnitAssociations'].forEach((existingBusinessUnit) => {
      let count = 0;
      parent.createCargoModel.cargoReleaseForm.controls['businessUnit'].value.forEach((businessUnit, valIndex) => {
        newbusinessUnitValues.push(businessUnit['value']);
        if (existingBusinessUnit['financeBusinessUnitCode'] === businessUnit['value']) {
          selectedBusinessUnit.push(businessUnit['value']);
          count++;
        }
      });
      if (existingBusinessUnit['financeBusinessUnitCode']) {
        businessUnitValues.push(this.checkCargoBusinessUnitValues(parent, count, existingBusinessUnit));
      }
    });
    const newBusinessUnitValue = utils.difference(utils.uniq(newbusinessUnitValues), selectedBusinessUnit);
    if (!utils.isEmpty(newBusinessUnitValue)) {
      businessUnitValues = this.addedCargoBusinessUnitDto(newBusinessUnitValue, businessUnitValues, parent);
    }
    return businessUnitValues;
  }
  addedCargoBusinessUnitDto(newBusinessUnitValue: Array<string>,
    businessUnitValues: Array<ContractBuRequestList>, parent): Array<ContractBuRequestList> {
    const contractSelected = this.getSelectedContract(parent);
    newBusinessUnitValue.forEach(newBusinessUnitList => {
      businessUnitValues.push({
        'contractID': (contractSelected['label']['customerContractID']) ? contractSelected['label']['customerContractID'] :
          contractSelected['label'],
        'contractName': contractSelected['label']['customerContractName'],
        'contractType': contractSelected['label']['customerContractType'],
        'contractNumber': contractSelected['label']['customerContractNumber'],
        'customerAgreementID': parent.createCargoModel.agreementId.customerAgreementID,
        'contractDisplayName': contractSelected.value,
        'customerContractBusinessUnitCargoID': null,
        'action': null,
        'isCreateFlow': false,
        'existingESDocID': parent['rowData'][0]['uniqueDocID'],
        'financeBusinessUnitCode': newBusinessUnitList,
        'contractBusinessUnitCargoAmount': this.amountFormatter(parent.createCargoModel.cargoReleaseForm.controls['cargoValue'].value),
        'contractBuEffectiveDate': this.postDateFormatter(parent.createCargoModel.cargoReleaseForm.controls['effectiveDate'].value),
        'contractBuExpirationDate': this.postDateFormatter(parent.createCargoModel.cargoReleaseForm.controls['expirationDate'].value),
        'agreementDefaultCargoAmount': this.amountFormatter(parent.createCargoModel.cargoDefaultAmount)
      });
    });
    return businessUnitValues;
  }
  checkCargoBusinessUnitValues(parent, count: number, existingBusinessUnit: any): Array<ContractBuRequestList> {
    let businessUnitValues;
    const contractSelected = this.getSelectedContract(parent);
    existingBusinessUnit['customerContractBusinessUnitCargoID'] = existingBusinessUnit.customerAgreementBusinessUnitCargoID;
    existingBusinessUnit['existingESDocID'] = parent['rowData'][0]['uniqueDocID'];
    existingBusinessUnit['contractName'] = contractSelected['label']['customerContractName'];
    existingBusinessUnit['contractType'] = contractSelected['label']['customerContractType'];
    existingBusinessUnit['contractNumber'] = contractSelected['label']['customerContractNumber'];
    existingBusinessUnit['customerAgreementID'] = parent.createCargoModel.agreementId.customerAgreementID;
    existingBusinessUnit['contractDisplayName'] = contractSelected.value;
    existingBusinessUnit['agreementDefaultCargoAmount'] = this.amountFormatter(parent.createCargoModel.cargoDefaultAmount);
    existingBusinessUnit['contractID'] = (contractSelected['label']['customerContractID']) ?
      contractSelected['label']['customerContractID'] : contractSelected['label'];
    existingBusinessUnit['contractBusinessUnitCargoAmount'] =
      this.amountFormatter(parent.createCargoModel.cargoReleaseForm.controls['cargoValue'].value);
    existingBusinessUnit['contractBuEffectiveDate'] =
      this.postDateFormatter(parent.createCargoModel.cargoReleaseForm.controls['effectiveDate'].value);
    existingBusinessUnit['contractBuExpirationDate'] =
      this.postDateFormatter(parent.createCargoModel.cargoReleaseForm.controls['expirationDate'].value);
    delete existingBusinessUnit['currencyCode'];
    if (count === 0) {
      existingBusinessUnit['action'] = 'DELETE';
    }
    businessUnitValues = existingBusinessUnit;
    return businessUnitValues;
  }
  onCreateSectionBuQuery(parent): SectionBuRequestDto {
    if (!utils.isEmpty(parent['rowData']) && !utils.isEmpty(parent['rowData'][0])) {
      return {
        'cargoReleaseType': 'SectionBU',
        'customerSectionBusinessUnitCargoList': this.iterateRowDataSectionBu(parent)
      };
    } else {
      return {
        'cargoReleaseType': 'SectionBU',
        'customerSectionBusinessUnitCargoList': this.iterateSectionBu(parent)
      };
    }
  }
  iterateRowDataSectionBu(parent): any {
    let businessUnitValues = [];
    const selectedBusinessUnit = [];
    const newbusinessUnitValues = [];
    parent['rowData'][0]['financeBusinessUnitAssociations'].forEach((existingBusinessUnit) => {
      let count = 0;
      parent.createCargoModel.cargoReleaseForm.controls['businessUnit'].value.forEach((businessUnit, valIndex) => {
        newbusinessUnitValues.push(businessUnit['value']);
        if (existingBusinessUnit['financeBusinessUnitCode'] === businessUnit['value']) {
          selectedBusinessUnit.push(businessUnit['value']);
          count++;
        }
      });
      if (existingBusinessUnit['financeBusinessUnitCode']) {
        businessUnitValues.push(this.checkSectionBusinessUnitValues(parent, count, existingBusinessUnit));
      }
    });
    const newBusinessUnitValue = utils.difference(utils.uniq(newbusinessUnitValues), selectedBusinessUnit);
    if (!utils.isEmpty(newBusinessUnitValue)) {
      businessUnitValues =
        this.addedSectionBusinessUnitDto(newBusinessUnitValue, businessUnitValues, parent);
    }
    return businessUnitValues;
  }
  checkSectionBusinessUnitValues(parent, count: number, existingBusinessUnit) {
    let businessUnitValues;
    existingBusinessUnit['agreementDefaultCargoAmount'] = this.amountFormatter(parent.createCargoModel.cargoDefaultAmount);
    existingBusinessUnit['existingESDocID'] = parent['rowData'][0]['uniqueDocID'];
    existingBusinessUnit['sectionID'] = parent.createCargoModel.selectedSectionsList['customerSectionID'];
    existingBusinessUnit['sectionName'] = parent.createCargoModel.selectedSectionsList['customerSectionName'];
    existingBusinessUnit['customerAgreementID'] = parent.createCargoModel.agreementId.customerAgreementID;
    existingBusinessUnit['customerSectionBusinessUnitCargoID'] = existingBusinessUnit.customerAgreementBusinessUnitCargoID;
    existingBusinessUnit['sectionBusinessUnitCargoAmount'] =
      this.amountFormatter(parent.createCargoModel.cargoReleaseForm.controls['cargoValue'].value);
    existingBusinessUnit['sectionBuEffectiveDate'] =
      this.postDateFormatter(parent.createCargoModel.cargoReleaseForm.controls['effectiveDate'].value);
    existingBusinessUnit['sectionBuExpirationDate'] =
      this.postDateFormatter(parent.createCargoModel.cargoReleaseForm.controls['expirationDate'].value);
    delete existingBusinessUnit['currencyCode'];
    if (count === 0) {
      existingBusinessUnit['action'] = 'DELETE';
    }
    businessUnitValues = existingBusinessUnit;
    return businessUnitValues;
  }
  addedSectionBusinessUnitDto(newBusinessUnitValue: Array<string>, businessUnitValues, parent) {

    if (newBusinessUnitValue.length > 0) {
      newBusinessUnitValue.forEach(newBusinessUnitList => {
        businessUnitValues.push({
          'customerAgreementID': parent.createCargoModel.agreementId.customerAgreementID,
          'sectionID': parent.createCargoModel.selectedSectionsList['customerSectionID'],
          'sectionName': parent.createCargoModel.selectedSectionsList['customerSectionName'],
          'customerSectionBusinessUnitCargoID': null,
          'action': null,
          'financeBusinessUnitCode': newBusinessUnitList,
          'sectionBusinessUnitCargoAmount': this.amountFormatter(parent.createCargoModel.cargoReleaseForm.controls['cargoValue'].value),
          'sectionBuEffectiveDate': this.postDateFormatter(parent.createCargoModel.cargoReleaseForm.controls['effectiveDate'].value),
          'sectionBuExpirationDate': this.postDateFormatter(parent.createCargoModel.cargoReleaseForm.controls['expirationDate'].value),
          'agreementDefaultCargoAmount': this.amountFormatter(parent.createCargoModel.cargoDefaultAmount),
          'existingESDocID': parent['rowData'][0]['uniqueDocID'],
          'isCreateFlow': false
        });
      });
    }
    return businessUnitValues;
  }
  iterateSectionBu(parent): Array<SectionBuRequestList> {
    const businessValues = [];
    if (parent.createCargoModel.cargoReleaseForm.controls['businessUnit'].value) {
      parent.createCargoModel.cargoReleaseForm.controls['businessUnit'].value.forEach(newBu => {
        businessValues.push({
          'sectionID': parent.createCargoModel.selectedSectionsList['customerSectionID'],
          'sectionName': parent.createCargoModel.selectedSectionsList['customerSectionName'],
          'customerAgreementID': parent.createCargoModel.agreementId.customerAgreementID,
          'customerSectionBusinessUnitCargoID': null,
          'financeBusinessUnitCode': newBu.value,
          'sectionBusinessUnitCargoAmount': this.amountFormatter(parent.createCargoModel.cargoReleaseForm.controls['cargoValue'].value),
          'sectionBuEffectiveDate': this.postDateFormatter(parent.createCargoModel.cargoReleaseForm.controls['effectiveDate'].value),
          'sectionBuExpirationDate': this.postDateFormatter(parent.createCargoModel.cargoReleaseForm.controls['expirationDate'].value),
          'agreementDefaultCargoAmount': this.amountFormatter(parent.createCargoModel.cargoDefaultAmount),
          'isCreateFlow': true
        });
      });
    }
    return businessValues;
  }
  postDateFormatter(value: string): string {
    return moment(value).format('YYYY-MM-DD');
  }
  iterateBusinessUnit(parent): Array<AgreementBURequestListDto> {
    const businessValues = [];
    if (parent.createCargoModel.cargoReleaseForm.controls['businessUnit'].value) {
      parent.createCargoModel.cargoReleaseForm.controls['businessUnit'].value.forEach(newBu => {
        businessValues.push({
          'customerAgreementID': parent.createCargoModel.agreementId['customerAgreementID'],
          'customerAgreementBusinessUnitCargoID': null,
          'action': null,
          'financeBusinessUnitCode': newBu.value,
          'agreementBusinessUnitCargoAmount': this.amountFormatter(parent.createCargoModel.cargoReleaseForm.controls['cargoValue'].value),
          'agreementBuEffectiveDate': this.postDateFormatter(parent.createCargoModel.cargoReleaseForm.controls['effectiveDate'].value),
          'agreementBuExpirationDate': this.postDateFormatter(parent.createCargoModel.cargoReleaseForm.controls['expirationDate'].value),
          'agreementDefaultCargoAmount': this.amountFormatter(parent.createCargoModel.cargoDefaultAmount),
          'isCreateFlow': true
        });
      });
    }
    return businessValues;
  }
  iterateContractBu(parent) {
    const businessValues = [];
    if (parent.createCargoModel.cargoReleaseForm.controls['businessUnit'].value) {
      parent.createCargoModel.cargoReleaseForm.controls['businessUnit'].value.forEach(newBu => {
        businessValues.push({
          'customerAgreementID': parent.createCargoModel.agreementId.customerAgreementID,
          'contractID': parent.createCargoModel.cargoReleaseForm.controls['contract'].value['label']['customerContractID'],
          'contractDisplayName': parent.createCargoModel.cargoReleaseForm.controls['contract'].value.value,
          'contractName': parent.createCargoModel.cargoReleaseForm.controls['contract'].value['label']['customerContractName'],
          'contractNumber': parent.createCargoModel.cargoReleaseForm.controls['contract'].value['label']['customerContractNumber'],
          'contractType': parent.createCargoModel.cargoReleaseForm.controls['contract'].value['label']['customerContractType'],
          'customerContractBusinessUnitCargoID': null,
          'financeBusinessUnitCode': newBu.value,
          'contractBusinessUnitCargoAmount': this.amountFormatter(parent.createCargoModel.cargoReleaseForm.controls['cargoValue'].value),
          'contractBuEffectiveDate': this.postDateFormatter(parent.createCargoModel.cargoReleaseForm.controls['effectiveDate'].value),
          'contractBuExpirationDate': this.postDateFormatter(parent.createCargoModel.cargoReleaseForm.controls['expirationDate'].value),
          'agreementDefaultCargoAmount': this.amountFormatter(parent.createCargoModel.cargoDefaultAmount),
          'isCreateFlow': true
        });
      });
    }
    return businessValues;
  }
  sectionListDtoFormation(model, key): SectionRowData {
    if (key === 'default') {
      return model.rowValue[0];
    } else {
      return {
        'customerAgreementID': model.agreementId.customerAgreementID,
        'customerAgreementName': model.agreementId.customerAgreementName,
        'customerSectionID': model.rowValue[0].customerSectionID,
        'customerSectionName': model.rowValue[0].customerSectionName,
        'customerContractID': model.rowValue[0].customerContractID,
        'customerContractNumber': model.rowValue[0].customerContractNumber,
        'customerContractName': (model.rowValue[0].customerContractNumber) ?
          `${model.rowValue[0].customerContractNumber}-${model.rowValue[0].customerContractName}`
          : `(Transactional)-${model.rowValue[0].customerContractName}`,
        'sectionEffectiveDate': (model.rowValue[0]['customerSectionBusinessUnitCargo'] &&
        model.rowValue[0]['customerSectionBusinessUnitCargo'].length) ?
          model.rowValue[0]['customerSectionBusinessUnitCargo'][0]['sectionBuEffectiveDate'] : model.rowValue[0].effectiveDate,
        'sectionExpirationDate': (model.rowValue[0]['customerSectionBusinessUnitCargo'] &&
        model.rowValue[0]['customerSectionBusinessUnitCargo'].length) ?
          model.rowValue[0]['customerSectionBusinessUnitCargo'][0]['sectionBuExpirationDate'] : model.rowValue[0].expirationDate
      };
    }
  }
  warningMessage(messageService) {
    messageService.clear();
    messageService.add({
      severity: 'info',
      summary: 'No Changes Found',
      detail: 'You have not made any changes to save the data'
    });
  }
  formFieldsTouched(parent, messageService) {
    parent.createCargoModel.isSaveChanges = false;
    utils.forIn(parent.createCargoModel.cargoReleaseForm.controls, (value, name: string) => {
      parent.createCargoModel.cargoReleaseForm.controls[name].markAsTouched();
    });
    messageService.clear();
    messageService.add({
      severity: 'error', summary: 'Missing Required Information',
      detail: 'Provide the required information in the highlighted fields and submit the form again'
    });
    parent.changeDetector.detectChanges();
  }
}
