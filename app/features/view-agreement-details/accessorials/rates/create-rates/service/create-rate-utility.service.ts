import { Injectable, ElementRef } from '@angular/core';
import { AbstractControl, FormArray,
  FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { CurrencyPipe } from '@angular/common';
import { MessageService } from 'primeng/components/common/messageservice';
import { AdditionalChargesComponent
} from './../../../../../shared/accessorials/additional-charges/additional-charges/additional-charges.component';
import { AdditionalChargesModel
} from './../../../../../shared/accessorials/additional-charges/additional-charges/model/additional-charges-model';
import { CreateRatesModel } from '../model/create-rates.model';
import { AddStairStepModel } from './../../../../../shared/accessorials/stair-step/add-stair-step/model/add-stair-step.model';
import { OptionalAttributesModel } from '../../../shared/models/optional-attributes.model';
import { BillToModel } from '../../../shared/billto-list/model/bill-to.model';
import { AddRatesModel } from '../../add-rates/model/add-rates.model';
import { CreateRuleModel } from '../../../rules/create-rules/model/create-rules.model';
import { ViewDocumentationModel } from '../../../shared/view-documentation/models/view-documentation.model';
import { BillToInterface, BusinessUnitInterface, CarrierCodeResponse,
  RequestedServiceResponse, RateCriteriaResponse, CheckBoxAttributesInterface } from '../model/create-rates.interface';
import { BillToValueInterface } from '../../../shared/billto-list/model/bill-to.interface';
import { ContractTypesItemInterface } from '../../../shared/contract-list/model/contract-list.interface';
import { SectionsGridResponseInterface } from '../../../shared/sections/model/sections-interface';
import { CreateRatesComponent } from '../create-rates.component';
import { CreateRateUtilsService } from './create-rate-utils.service';
import * as utils from 'lodash';

@Injectable({
  providedIn: 'root'
})

export class CreateRateUtilityService {
  constructor(private readonly createRateUtilsService: CreateRateUtilsService) {
  }

  documentationCheck: object;
  ratePostFramer(rateModel: CreateRatesModel, optionalModel: OptionalAttributesModel,
    billToModel: BillToModel,
    addRateModel: AddRatesModel, documentModel: ViewDocumentationModel, addChargesModel: AdditionalChargesModel,
    stairStepRatesModel: AddStairStepModel): object {
    const framerObject = this.onRefreshRatePostFramer(rateModel, rateModel.ratesForm, optionalModel, billToModel,
      String(rateModel.agreementDetails.customerAgreementID));
    const groupRateTypeID = addRateModel ? addRateModel.addRateForm['controls']['groupRateType']['value'] : null;
    const itemizer = (stairStepRatesModel) ? (stairStepRatesModel.addStairStepForm['controls']['itemizeRates']['value'] ? 1 : 0) : 0;
    let groupRateTypeLabel = null;
    if (groupRateTypeID && groupRateTypeID.value) {
      const groupRateTypes = addRateModel.groupRateTypes;
      groupRateTypeLabel = utils.find(groupRateTypes, utils.matchesProperty('value', groupRateTypeID.value)).label;
    }
    framerObject['rateItemizeIndicator'] = stairStepRatesModel ?
      itemizer : this.isGroupRateItemizeIndicator(groupRateTypeLabel, addRateModel);
    framerObject['groupRateTypeId'] = groupRateTypeID ? groupRateTypeID.value : null;
    framerObject['customerAccessorialRateCriteriaDTOs'] =
      this.postRateCriteriaFramer(rateModel) ? this.postRateCriteriaFramer(rateModel) : null;
    framerObject['customerAccessorialRateAlternateChargeDTO'] = this.getAlternateChargeDetails(rateModel);
    framerObject['customerAccessorialRateChargeDTOs'] = addRateModel ? this.getRateDetails(addRateModel) : null;
    framerObject['chargeTypeCode'] = this.checkNullConditionForChargeTypeCode
      (rateModel.ratesForm.controls['chargeType'].value['description']);
    framerObject['documentLegalDescription'] = this.checkNullConditionForDocumentation(documentModel.legalTextArea);
    framerObject['documentInstructionalDescription'] = this.checkNullConditionForDocumentation(documentModel.instructionalTextArea);
    framerObject['customerAccessorialRateAdditionalChargeDTOs'] = (addChargesModel) ? this.getAddChargesDetails(addChargesModel) : null;
    framerObject['customerAccessorialStairRateDTO'] = stairStepRatesModel
      ? this.getStairStepRateDetails(stairStepRatesModel) : null;
    framerObject['docFileNames'] = this.documentationName(documentModel);
    framerObject['docHasAttachment'] = framerObject['docFileNames'].length !== 0;
    return framerObject;
  }
  documentationName(documentModel) {
    const documentationName = [];
    documentModel.attachments.forEach((data) => {
      documentationName.push(data['documentName']);
    });
    return documentationName;
  }
  checkNullConditionForDocumentation(documentLegalOrInstruction: string): string {
    return (documentLegalOrInstruction &&
      documentLegalOrInstruction.length) ? documentLegalOrInstruction : null;
  }
  checkNullConditionForChargeTypeCode(chargeTypeValue: string): string {
    return (chargeTypeValue) ? chargeTypeValue : null;
  }
  onRefreshRatePostFramer(modelData: CreateRatesModel | CreateRuleModel, accessorialForm: FormGroup, optionalModel: OptionalAttributesModel,
    billToModel: BillToModel, agreementId: string) {
    let framerObject = {
      customerChargeName: (accessorialForm.controls['customerName']) ? accessorialForm.controls['customerName'].value : null,
      customerAgreementId: agreementId,
      accessorialDocumentTypeId: null,
      equipmentLengthId: (optionalModel.optionalForm.controls['equipmentLength'].value) ?
        optionalModel.optionalForm.controls['equipmentLength'].value['id'] : null,
      equipmentLengthDescription: (optionalModel.optionalForm.controls['equipmentLength'].value) ?
        optionalModel.optionalForm.controls['equipmentLength'].value['value'] : null,
      equipmentLength : (optionalModel.optionalForm.controls['equipmentLength'].value) ?
        optionalModel.optionalForm.controls['equipmentLength'].value['label'] : null,
      equipmentTypeId: (optionalModel.optionalForm.controls['equipmentType'].value) ?
        optionalModel.equipTypeId : null,
      customerAccessorialAccountDTOs: this.iterateContractSection(modelData, billToModel),
      businessUnitServiceOfferingDTOs: (!utils.isEmpty(optionalModel.serviceLevelValues)) ?
        this.iterateBusinessUnitValues(optionalModel) : null,
      requestServiceDTOs: (!utils.isEmpty(optionalModel.optionalForm.controls['requestedService'].value)) ?
        this.iterateRequestedService(optionalModel) : null,
      carrierDTOs: (!utils.isEmpty(optionalModel.optionalForm.controls['carriers'].value)) ? this.iterateCarriers(optionalModel) : null
    };
    framerObject = utils.assign(framerObject, this.postCallJsonFramer(modelData, accessorialForm, optionalModel, billToModel));
    return framerObject;
  }
  postCallJsonFramer(modelData: CreateRatesModel | CreateRuleModel, accessorialForm: FormGroup, optionalModel: OptionalAttributesModel,
    billToModel: BillToModel) {
    const framerObject = {
      effectiveDate: this.postDateFormatter(accessorialForm.controls['effectiveDate'].value),
      expirationDate: this.postDateFormatter(accessorialForm.controls['expirationDate'].value),
      level: this.getAccessorialLevel(modelData, billToModel, optionalModel),
      attributeLevel: this.createRateUtilsService.getAttributeLevel(optionalModel),
      chargeTypeId: (accessorialForm.controls['chargeType'].value) ?
        accessorialForm.controls['chargeType'].value['value'] : null,
      chargeTypeName: (accessorialForm.controls['chargeType'].value) ?
        accessorialForm.controls['chargeType'].value['label'] : null,
      ruleType:  (accessorialForm.controls['ruleType'] && accessorialForm.controls['ruleType'].value) ?
      accessorialForm.controls['ruleType'].value['label'] : null,
      currencyCode: this.getCurrencyValue(accessorialForm),
      equipmentCategoryCode: (optionalModel.optionalForm.controls['equipmentCategory'].value) ?
        optionalModel.optionalForm.controls['equipmentCategory'].value['value'] : null,
      equipmentTypeCode: (optionalModel.optionalForm.controls['equipmentType'].value) ?
        optionalModel.optionalForm.controls['equipmentType'].value['value'] : null,
    };
    return framerObject;
  }
  getCurrencyValue(accessorialForm: FormGroup): string {
    let currencyValue;
    if (accessorialForm.controls['currency']) {
      currencyValue = (accessorialForm.controls['currency'].value) ? accessorialForm.controls['currency']['value']['value'] : 'USD';
    } else {
      currencyValue = null;
    }
    return currencyValue;
  }
  getAlternateChargeDetails(rateModel: CreateRatesModel) {
    let alternateCharge: object;
    const valuePlaces = new RegExp(',', 'g');
    const quantityType = rateModel.ratesForm.controls.quantityType.value ? rateModel.ratesForm.controls.quantityType.value : null;
    const alternateChargeType = rateModel.ratesForm.controls.alternateChargeType.value ?
      rateModel.ratesForm.controls.alternateChargeType.value : null;
    const quantity = rateModel.ratesForm.controls.quantity.value ?
      rateModel.ratesForm.controls.quantity.value.toString().replace(valuePlaces, '') : null;
    if (!quantityType && !alternateChargeType && !quantity) {
      alternateCharge = null;
    } else {
      alternateCharge = this.getAlternateChargeObject(rateModel, quantity);
    }
    return alternateCharge;
  }
  getAlternateChargeObject(rateModel: CreateRatesModel, quantity) {
    return {
      customerAccessorialRateAlternateChargeId: null,
      accessorialRateAlternateChargeQuantityTypeId: (rateModel.ratesForm.controls.quantityType.value) ?
        rateModel.ratesForm.controls.quantityType.value['value'] : null,
      accessorialRateAlternateChargeQuantityTypeName: (rateModel.ratesForm.controls.quantityType.value) ?
        rateModel.ratesForm.controls.quantityType.value['label'] : null,
      alternateChargeTypeId: (rateModel.ratesForm.controls.alternateChargeType.value) ?
        rateModel.ratesForm.controls.alternateChargeType.value['value'] : null,
      alternateChargeTypeName: (rateModel.ratesForm.controls.alternateChargeType.value) ?
        rateModel.ratesForm.controls.alternateChargeType.value['label'] : null,
      customerAlternateChargeThresholdQuantity: (quantity) ? quantity : null
    };
  }
  getRateDetails(addRateModel: AddRatesModel) {
    const rateObj = [];
    const valuePlaces = new RegExp(',', 'g');
    addRateModel.addRateForm['controls']['rates']['controls'].forEach((element, index) => {
      const minAmount = element['controls']['minAmount']['value'] ?
        element['controls']['minAmount']['value'].toString().replace(valuePlaces, '') : '';
      const maxAmount = element['controls']['maxAmount']['value'] ?
        element['controls']['maxAmount']['value'].toString().replace(valuePlaces, '') : '';
      const amount = element['controls']['rateAmount']['value'] ?
        element['controls']['rateAmount']['value'].toString().replace(valuePlaces, '') : '';
      this.addRateDetails(rateObj, element, amount, minAmount, maxAmount, addRateModel);
    });
    return rateObj;
  }
  getStairStepRateDetails(stairStepRatesModel: AddStairStepModel) {
    const StairStepRateArrayObj = [];
    const controls = stairStepRatesModel.addStairStepForm['controls'];
    const valuePlaces = new RegExp(',', 'g');
    const minAmount = controls['minAmount'] ?
      controls['minAmount']['value'].toString().replace(valuePlaces, '') : '';
    const maxAmount = controls['maxAmount'] ?
      controls['maxAmount']['value'].toString().replace(valuePlaces, '') : '';
    controls['stepsArray']['controls'].forEach((element, index) => {
      const amount = element['controls']['rateAmount']['value'] ?
        element['controls']['rateAmount']['value'].toString().replace(valuePlaces, '') : '';
      this.addStairStepRateDetails(StairStepRateArrayObj, element, amount, stairStepRatesModel);
    });
    return {
      'customerAccessorialStairRateId': null,
      'accessorialRateTypeName': controls['rateType']['value']['label'] ?
        controls['rateType']['value']['label'] : null,
      'accessorialRateTypeId': controls['rateType']['value']['value'] ?
        +controls['rateType']['value']['value'] : null,
      'accessorialRateRoundingTypeId': controls['rounding']['value']['value'] ?
        +controls['rounding']['value']['value'] : null,
      'accessorialRateRoundingTypeName': controls['rounding']['value']['label'] ?
        controls['rounding']['value']['label'] : null,
      'accessorialMaximumRateApplyTypeId': controls['maxApplidedWhen']['value'] ?
        +controls['maxApplidedWhen']['value']['value'] : null,
      'accessorialMaximumRateApplyTypeName': controls['maxApplidedWhen']['value']['label'] ?
        controls['maxApplidedWhen']['value']['label'] : null,
      'minimumAmount': minAmount ? +minAmount : null,
      'maximumAmount': maxAmount ? +maxAmount : null,
      'customerAccessorialStairStepRateDTOs': StairStepRateArrayObj
    };
  }
  addStairStepRateDetails(StairStepRateArrayObj, element, amount, stairStepRatesModel) {
    StairStepRateArrayObj.push({
      'customerAccessorialRateStairStepId': null,
      'stepNumber': element['controls']['step']['value']['label']
        ? element['controls']['step']['value']['value'] : element['controls']['step']['value'],
      'fromQuantity': +element['controls']['fromQuantity']['value'],
      'toQuantity': +element['controls']['toQuantity']['value'],
      'stairStepRateAmount': +amount
    });
    return StairStepRateArrayObj;
  }
  addRateDetails(rateObj: object[], element: AbstractControl, amount: string, minAmount: string,
    maxAmount: string, addRateModel: AddRatesModel) {
    if (element['controls']['rateAmount']['value'] && element['controls']['rateType']['value']) {
      rateObj.push({
        'customerAccessorialRateChargeId': null,
        'accessorialRateTypeName': element['controls']['rateType']['value']['label'],
        'accessorialRateTypeId': element['controls']['rateType']['value']['value'],
        'accessorialRateRoundingTypeId': element['controls']['rounding']['value'] ?
          element['controls']['rounding']['value']['value'] : null,
        'accessorialRateRoundingTypeName': element['controls']['rounding']['value'] ?
          element['controls']['rounding']['value']['label'] : null,
        'rateAmount': +amount,
        'minimumAmount': minAmount ? +minAmount : null,
        'maximumAmount': maxAmount ? +maxAmount : null,
        'rateOperator': addRateModel.addRateForm['controls']['groupRateType']['value'] ?
          addRateModel.addRateForm['controls']['groupRateType']['value']['label'] : null
      });
    } else {
      rateObj = null;
    }
    return rateObj;
  }
  getAddChargesDetails(addChargesModel: AdditionalChargesModel) {
    const addChargesObj = [];
    const chargesForm = (addChargesModel.addChargesForm.get('charges') as FormArray);
    const valuePlaces = new RegExp(',', 'g');
    chargesForm.controls.forEach((rowRef: FormGroup) => {
      addChargesObj.push({
        'customerAccessorialRateAdditionalChargeId': null,
        'accessorialRateTypeId': rowRef['controls']['rateType'].value['value'],
        'accessorialRateTypeName': rowRef['controls']['rateType'].value['label'],
        'additionalChargeTypeId': rowRef['controls']['chargeType'].value['value'],
        'additionalChargeTypeName': rowRef['controls']['chargeType'].value['label'].split(' (', 1)[0],
        'additionalChargeCodeName': rowRef['controls']['chargeType'].value['description'],
        'additionalRateAmount': parseFloat(rowRef['controls']['rateAmount'].value.toString().replace(valuePlaces, ''))
      });
    });
    return addChargesObj;
  }
  isGroupRateItemizeIndicator(groupRateTypeLabel: string, addRateModel: AddRatesModel) {
    if (groupRateTypeLabel === 'Sum') {
      return addRateModel.addRateForm['controls']['isGroupRateItemize']['value'] ? 1 : 0;
    }
    return null;
  }
  getAccessorialLevel(rateModel: CreateRatesModel | CreateRuleModel, billToModel: BillToModel, optionaModel: OptionalAttributesModel) {
    const rateLevel = this.getRateLevel(rateModel);
    const isBillTo = this.isBillTo(billToModel);
    const isCarrier = this.isCarrier(optionaModel);
    if (isBillTo && isCarrier) {
      return rateLevel - 9;
    } else if (isCarrier) {
      return rateLevel - 3;
    } else if (isBillTo) {
      return rateLevel - 6;
    } else {
      return rateLevel;
    }
  }
  isCarrier(optionalModel: OptionalAttributesModel) {
    let isCarrier;
    if (!utils.isEmpty(optionalModel.optionalForm.controls['carriers'].value)) {
      isCarrier = true;
    } else {
      isCarrier = false;
    }
    return isCarrier;
  }
  isBillTo(billToModel: BillToModel): boolean {
    let billToExist;
    if (billToModel['selectedBillTo'] && billToModel['selectedBillTo'].length) {
      billToExist = true;
    } else {
      billToExist = false;
    }
    return billToExist;
  }

  getRateLevel(rateModel: CreateRatesModel | CreateRuleModel) {
    if (rateModel['selectedContractValue'] && rateModel['selectedContractValue'].length) {
      return 11;
    } else if (rateModel['selectedSectionValue'] && rateModel['selectedSectionValue'].length) {
      return 10;
    } else {
      return 12;
    }
  }
  iterateContractSection(rateModel: CreateRatesModel | CreateRuleModel, billToModel: BillToModel): BillToInterface[] {
    let contract;
    if (billToModel['selectedBillTo'] && billToModel['selectedBillTo'].length) {
      contract = this.iterateBillTos(rateModel, billToModel);
    } else {
      contract = this.iterateContractSectionBillTo(rateModel);
    }
    contract = utils.uniqWith(contract, utils.isEqual);
    return contract;
  }
  iterateBillTos(rateModel: CreateRatesModel | CreateRuleModel, billToModel: BillToModel): BillToInterface[] {
    let contract;
    if ((!rateModel['selectedContractValue'] || !rateModel['selectedContractValue'].length) &&
      (!rateModel['selectedSectionValue'] || !rateModel['selectedSectionValue'].length)) {
      contract = this.iterateAgreementBillTo(billToModel);
    } else {
      if (rateModel['selectedContractValue'] && rateModel['selectedContractValue'].length) {
        contract = this.iterateBillToContract(rateModel, billToModel);
      } else if (rateModel['selectedSectionValue'] && rateModel['selectedSectionValue'].length) {
        contract = this.iterateBillToSection(rateModel, billToModel);
      }
    }
    contract = utils.uniqWith(contract, utils.isEqual);
    return contract;
  }
  iterateAgreementBillTo(billToModel: BillToModel): BillToInterface[] {
    const accountDetails: BillToInterface[] = [];
    billToModel['selectedBillTo'] = utils.uniq(billToModel['selectedBillTo']);
    billToModel['selectedBillTo'].forEach((selectedBillToElement) => {
      accountDetails.push({
        customerAccessorialAccountId: null,
        customerAgreementContractSectionId: null,
        customerAgreementContractSectionName: null,
        customerAgreementContractId: null,
        customerAgreementContractName: null,
        customerAgreementContractSectionAccountId: selectedBillToElement['customerAgreementContractSectionAccountID'],
        customerAgreementContractSectionAccountName: selectedBillToElement['billToDetails']
      });
    });
    return accountDetails;
  }
  iterateBillToContract(rateModel: CreateRatesModel | CreateRuleModel, billToModel: BillToModel): BillToInterface[] {
    const accountDetails = [];
    billToModel['selectedBillTo'] = utils.uniq(billToModel['selectedBillTo']);
    rateModel['selectedContractValue'] = this.contractFramer(rateModel['selectedContractValue']);
    rateModel['selectedContractValue'].forEach((contractElement) => {
      let count = 0;
      billToModel['selectedBillTo'].forEach((selectedBillToElement) => {
        if (selectedBillToElement['customerAgreementContractID'] === contractElement['customerAgreementContractID']) {
          count++;
          accountDetails.push(this.compareBillToContractValues(selectedBillToElement));
        }
      });
      if (count === 0) {
        accountDetails.push(this.setAccountValue(contractElement));
      }
    });
    return accountDetails;
  }
  iterateBillToSection(rateModel: CreateRatesModel | CreateRuleModel, billToModel: BillToModel): BillToInterface[] {
    const accountDetails = [];
    billToModel['selectedBillTo'] = utils.uniq(billToModel['selectedBillTo']);
    rateModel['selectedSectionValue'] = this.contractFramer(rateModel['selectedSectionValue']);
    rateModel['selectedSectionValue'].forEach((sectionElement) => {
      let count = 0;
      billToModel['selectedBillTo'].forEach((selectedBillToElement) => {
        if (selectedBillToElement['customerAgreementContractID'] === sectionElement['customerAgreementContractID']) {
          count++;
          selectedBillToElement['isSection'] = true;
          accountDetails.push(this.compareBillToContractValues(selectedBillToElement));
        }
      });
      if (count === 0) {
        sectionElement['isSection'] = true;
        accountDetails.push(this.setAccountValue(sectionElement));
      }
    });
    return accountDetails;
  }
  contractFramer(selectedContract) {
    selectedContract.forEach(contractElement => {
      contractElement['customerContractNumber'] = (contractElement['customerContractNumber']) ?
        contractElement['customerContractNumber'] : 'Transactional';
      contractElement['customerContractName'] = `${contractElement['customerContractNumber']} (${contractElement['customerContractName']})`;
    });
    return selectedContract;
  }
  compareBillToContractValues(selectedBillToElement: BillToValueInterface) {
    let accountValue;
    selectedBillToElement['isMatch'] = true;
    accountValue = this.setAccountValue(selectedBillToElement);
    return accountValue;
  }
  setAccountValue(selectedBillToElement: BillToValueInterface | ContractTypesItemInterface | SectionsGridResponseInterface) {
    return {
      customerAccessorialAccountId: null,
      customerAgreementContractSectionId: (selectedBillToElement['isSection']) ?
        selectedBillToElement['customerAgreementContractSectionID'] : null,
      customerAgreementContractSectionName: (selectedBillToElement['isSection']) ?
        selectedBillToElement['customerAgreementContractSectionName'] : null,
      customerAgreementContractId: selectedBillToElement['customerAgreementContractID'],
      customerAgreementContractName: selectedBillToElement['customerContractName'],
      customerAgreementContractNumber: selectedBillToElement['customerContractNumber'],
      customerAgreementContractSectionAccountId: (selectedBillToElement['isMatch']) ?
        selectedBillToElement['customerAgreementContractSectionAccountID'] : null,
      customerAgreementContractSectionAccountName: selectedBillToElement['billToDetails']
    };
  }
  iterateContractSectionBillTo(rateModel: CreateRatesModel | CreateRuleModel): BillToInterface[] {
    let accountDetails: BillToInterface[] = [];
    if (rateModel['selectedContractValue'] && (rateModel['selectedContractValue'].length)) {
      accountDetails = this.iterateContractBillTo(rateModel['selectedContractValue']);
    } else if (rateModel['selectedSectionValue']) {
      accountDetails = this.iterateContractBillTo(rateModel['selectedSectionValue']);
    }
    return accountDetails;
  }
  iterateContractBillTo(selectedValues): BillToInterface[] {
    const accountDetails = [];
    selectedValues.forEach((sectionElement) => {
      if (sectionElement) {
        sectionElement['customerContractNumber'] = (sectionElement['customerContractNumber']) ?
          sectionElement['customerContractNumber'] : 'Transactional';
        accountDetails.push({
          customerAccessorialAccountId: null,
          customerAgreementContractSectionId: (sectionElement['customerAgreementContractSectionID']) ?
            sectionElement['customerAgreementContractSectionID'] : null,
          customerAgreementContractSectionName: (sectionElement['customerAgreementContractSectionName']) ?
            sectionElement['customerAgreementContractSectionName'] : null,
          customerAgreementContractId: sectionElement['customerAgreementContractID'],
          customerAgreementContractName: `${sectionElement['customerContractNumber']} (${sectionElement['customerContractName']})`,
          customerAgreementContractNumber: sectionElement['customerContractNumber'],
          customerAgreementContractSectionAccountId: null,
          customerAgreementContractSectionAccountName: sectionElement['billToDetails']
        });
      }
    });
    return accountDetails;
  }
  iterateBusinessUnitValues(optionalModel: OptionalAttributesModel): BusinessUnitInterface[] {
    const businessUnits = [];
    if (!utils.isEmpty(optionalModel.serviceLevelValues && optionalModel.optionalForm.controls['businessUnit'].value)) {
      optionalModel.optionalForm.controls['businessUnit'].value.forEach(businessUnitValues => {
        optionalModel.serviceLevelResponse.forEach((serviceLevel) => {
          const businessUnit = {
            customerAccessorialServiceLevelBusinessUnitServiceOfferingId: null,
            serviceLevelBusinessUnitServiceOfferingAssociationId: null,
            businessUnit: businessUnitValues['financeBusinessUnitCode'],
            serviceOffering: businessUnitValues['serviceOfferingDescription'],
            serviceOfferingCode:  businessUnitValues['serviceOfferingCode'],
            businessUnitDisplayName:
              `${businessUnitValues['financeBusinessUnitCode']} - ${businessUnitValues['serviceOfferingDescription']}`,
            serviceLevel: null
          };
          const businessData = this.serviceLevelValidation(businessUnitValues, optionalModel, serviceLevel, businessUnit);
          if (!utils.isEmpty(businessData)) {
            businessUnits.push(businessData);
          }
        });
      });
    }
    return businessUnits;
  }
  serviceLevelValidation(businessUnitValues, optionalModel, serviceLevel, businessUnit) {
    let businessUnits;
    const businessAssocicationId = businessUnitValues.financeBusinessUnitServiceOfferingAssociationID;
    const serviceAssociationId =
      serviceLevel.financeBusinessUnitServiceOfferingAssociation.financeBusinessUnitServiceOfferingAssociationID;
    if (businessAssocicationId === serviceAssociationId && !utils.isEmpty(optionalModel.optionalForm.controls['serviceLevel'].value)) {
      optionalModel.optionalForm.controls['serviceLevel'].value.forEach(element => {
        if (element.label.toLowerCase() === serviceLevel.serviceLevel['serviceLevelDescription'].toLowerCase()) {
          businessUnit.serviceLevel = serviceLevel.serviceLevel.serviceLevelDescription;
          businessUnit.serviceLevelCode = serviceLevel.serviceLevel.serviceLevelCode;
          businessUnit.serviceLevelBusinessUnitServiceOfferingAssociationId =
            serviceLevel.serviceLevelBusinessUnitServiceOfferingAssociationID;
          businessUnits = businessUnit;
        }
      });
    }
    return businessUnits;
  }
  iterateRequestedService(optionalModel: OptionalAttributesModel): RequestedServiceResponse[] {
    const requestedServices = [];
    if (!utils.isEmpty(optionalModel.optionalForm.controls['requestedService'].value)) {
      optionalModel.optionalForm.controls['requestedService'].value.forEach(requestedServicesElement => {
        requestedServices.push({
          requestedServiceTypeCode: requestedServicesElement
        });
      });
    }
    return requestedServices;
  }
  iterateCarriers(optionalModel: OptionalAttributesModel): CarrierCodeResponse[] {
    const carriers = [];
    if (!utils.isEmpty(optionalModel.optionalForm.controls['carriers'].value)) {
      optionalModel.optionalForm.controls['carriers'].value.forEach(carriersElement => {
        carriers.push({
          carrierId: Number(carriersElement.value['id']),
          carrierName: carriersElement.value['name'],
          carrierCode: carriersElement.value['code'],
          carrierDisplayName: `${carriersElement.value['name']} (${carriersElement.value['code']})`
        });
      });
    }
    return carriers;
  }
  postDateFormatter(value: string | Date): string {
    return moment(value).format('YYYY-MM-DD');
  }
  postRateCriteriaFramer(data: CreateRatesModel): RateCriteriaResponse[] {
    const resultset = [];
    let waived;
    let calculateRate;
    let passThrough;
    let rollUp;
    data.checkBoxValue.forEach((checkbox) => {
      switch (checkbox.label) {
        case 'Waived': waived = checkbox.value;
          break;
        case 'Calculate Rate Manually': calculateRate = checkbox.value;
          break;
        case 'Pass Through': passThrough = checkbox.value;
          break;
        case 'Roll Up': rollUp = checkbox.value;
          break;
      }
    });
    if (data.ratesForm.controls['waived'].value) {
      resultset.push({
        'customerAccessorialRateCriteriaTypeId': waived
      });
    }
    if (data.ratesForm.controls['calculateRate'].value) {
      resultset.push({
        'customerAccessorialRateCriteriaTypeId': calculateRate
      });
    }
    if (data.ratesForm.controls['passThrough'].value) {
      resultset.push({
        'customerAccessorialRateCriteriaTypeId': passThrough
      });
    }
    if (data.ratesForm.controls['rollUp'].value) {
      resultset.push({
        'customerAccessorialRateCriteriaTypeId': rollUp
      });
    }
    return resultset;
  }
  formatAmount(value: string, currencyPipe: CurrencyPipe) {
    let formattedRateAmount;
    const enteredAmount = value ? value.replace(/[, ]/g, '').trim() : '';
    const wholeAmount = enteredAmount.split('.')[0].substring(0, 7);
    const decimalAmount = enteredAmount.split('.')[1] || '';
    const amount = +`${wholeAmount}.${decimalAmount}`;
    if (isNaN(amount)) {
      formattedRateAmount = '';
    } else {
      const modifiedAmount = amount.toString().replace(/[, ]/g, '').trim();
      formattedRateAmount = currencyPipe.transform(modifiedAmount, '', '', '1.2-4');
    }
    return formattedRateAmount;
  }
  checkContractValidity(parentComponent) {
    let inactiveContract;
    if (parentComponent.contract) {
      inactiveContract = parentComponent.contract.contractListModel.selectedContract.find(value =>
        (value['status'] === 'Inactive' && value['dateMismatchFlag']));
      return inactiveContract;
    }
    return false;
  }
  checkSectionValidity(parentComponent) {
    let inactiveSection;
    if (parentComponent.sectionListModel) {
      inactiveSection = parentComponent.sectionListModel.sectionsModel.dataSelected.find(value =>
        (value['status'] === 'Inactive' && value['dateMismatchFlag']));
      return inactiveSection;
    }
    return false;
  }
  checkBillToValidity(parentComponent) {
    let inactiveBillTo;
    if (parentComponent.billTo) {
      inactiveBillTo = parentComponent.billTo.billToModel.dataSelected.find(value =>
        (value['status'] === 'Inactive'));
      return inactiveBillTo;
    }
    return false;
  }
  invalidSelections(parentComponent) {
    const inactiveContract = this.checkContractValidity(parentComponent);
    const inactiveSection = this.checkSectionValidity(parentComponent);
    const inactiveBillTo = this.checkBillToValidity(parentComponent);
    if (inactiveContract || inactiveSection || inactiveBillTo) {
      this.toastMessage(parentComponent.messageService, 'error', 'Date Range Mismatch',
        inactiveBillTo ? 'Some of the Bill To Accounts selected are not valid for the specified date range. Please uncheck to proceed' :
          'Some of the Contracts(or Sections) selected are not valid for the specified date range. Please uncheck to proceed');
      return true;
    }
    return false;
  }
  checkAcccesorialRateFormDiry(parentComponent) {
    if ((parentComponent.createRatesModel.isEditFlagEnabled) && (parentComponent.createRatesModel['ratesForm'].dirty ||
        parentComponent.optionalFields['optionalAttributesModel']['optionalForm'].dirty || parentComponent.checkDirty())) {
      return true;
    }
    return false;
  }
  onValidateForm(isRefresh: boolean, parentComponent): boolean | undefined {
    const invalidSelection = this.invalidSelections(parentComponent);
    const isAccessorialRateFormDirty = this.checkAcccesorialRateFormDiry(parentComponent);
    const isCurrencySelectionValid = parentComponent.createRateUtilsService.isCurrencySelectionsValid(parentComponent);
    if (invalidSelection || !isCurrencySelectionValid) {
      return;
    }
    if (!isAccessorialRateFormDirty && parentComponent.createRatesModel.isEditAccessorialRateClicked) {
      this.toastMessage(parentComponent.messageService, 'info', 'No Changes Found', 'There are no changes detected in the current action');
      return;
    }
    parentComponent.createRatesModel.errorMsg = false;
    return this.nestedValidation(isRefresh, parentComponent);
  }
  nestedValidation(isRefresh, parentComponent) {
    const rateLevel = parentComponent.createRatesModel.ratesForm.value.documentationLevel;
    const validOptionalFields = parentComponent.optionalUtilityService.
      validateOptionalFields(parentComponent.optionalFields.optionalAttributesModel,
        parentComponent.messageService);
    const validAdditionalCharges = (parentComponent.addCharges && !isRefresh) ? this.validateAdditionalCharges(parentComponent) : true;
    if (((!isRefresh && (this.validateRateForm(parentComponent)
      && this.validateStairStepRateForm(parentComponent)) && validAdditionalCharges) || isRefresh) &&
      parentComponent.createRatesModel.ratesForm.valid && validOptionalFields) {
      if ((rateLevel === 'contract' &&
        !parentComponent.optionalUtilityService.isContractSelected(parentComponent.contract.contractListModel,
          parentComponent.messageService)) ||
        (rateLevel === 'section' &&
          !parentComponent.optionalUtilityService.isSectionSelected(parentComponent.sectionListModel.sectionsModel,
            parentComponent.messageService))) {
        parentComponent.changeDetector.markForCheck();
        return false;
      }
      parentComponent.changeDetector.markForCheck();
      return true;
    } else {
      this.formFieldsTouched(parentComponent);
      parentComponent.changeDetector.markForCheck();

      return false;
    }
  }
  validateAdditionalCharges(parentComponent): boolean {
    const addCharges: AdditionalChargesComponent = parentComponent.addCharges;
    let isValid = true;
    const chargesForm = (addCharges.addChargesModel.addChargesForm.get('charges') as FormArray);
    if (!chargesForm.valid) {
      chargesForm.controls.forEach((rowRef) => {
        if (!addCharges.validateRow(rowRef, false)) {
          isValid = false;
          return;
        }
      });
    }
    return isValid;
  }
  stairStepFormMandatory(parentComponent) {
    parentComponent.addStairStepRates.stairStepModel.addStairStepForm.controls['maxApplidedWhen'].markAsTouched();
    parentComponent.addStairStepRates.stairStepModel.addStairStepForm.controls['maxAmount'].markAsTouched();
    utils.forIn(parentComponent.addStairStepRates.stairStepModel.addStairStepForm.controls, (value, name: string) => {
      if (name !== 'stepsArray' && name === 'rateType') {
        const error = parentComponent.addStairStepRates.stairStepModel.addStairStepForm.controls[name].errors;
        parentComponent.addStairStepRates.stairStepModel.addStairStepForm.controls[name].setValidators(Validators.required);
        parentComponent.addStairStepRates.stairStepModel.addStairStepForm.controls[name].markAsTouched();
        parentComponent.addStairStepRates.stairStepModel.addStairStepForm.controls[name].
          updateValueAndValidity();
        if (error) {
          parentComponent.addStairStepRates.stairStepModel.addStairStepForm.controls[name].setErrors(error);
        }
        parentComponent.addStairStepRates.changeDetector.detectChanges();
      }
      if (name === 'stepsArray') {
        utils.forIn(value['controls'], (forArrayValue, forArrayName: string) => {
          this.arrayIterateStairStep(forArrayValue, parentComponent);
        });
      }
    });
  }
  arrayIterateStairStep(forArrayValue, parentComponent) {
    utils.forIn(forArrayValue['controls'], (control, controlName: string) => {
      const error = control.errors;
      control.setValidators(Validators.required);
      control.markAsTouched();
      control.updateValueAndValidity();
      if (error) {
        control.setErrors(error);
      }
      parentComponent.addStairStepRates.changeDetector.detectChanges();
    });
  }
  removestairStepFormMandatory(parentComponent) {
    utils.forIn(parentComponent.addStairStepRates.stairStepModel.addStairStepForm.controls, (value, name: string) => {
      if (name !== 'stepsArray' && name === 'rateType') {
        parentComponent.addStairStepRates.stairStepModel.addStairStepForm.controls[name].setValidators(null);
        parentComponent.addStairStepRates.stairStepModel.addStairStepForm.controls[name].markAsTouched();
        parentComponent.addStairStepRates.stairStepModel.addStairStepForm.controls[name].
          updateValueAndValidity();
        parentComponent.addStairStepRates.changeDetector.detectChanges();
      }
      if (name === 'stepsArray') {
        utils.forIn(value['controls'], (forArrayValue, forArrayName: string) => {
          this.removearrayIterateStairStep(forArrayValue, parentComponent);

        });
      }
    });
  }
  removearrayIterateStairStep(forArrayValue, parentComponent) {
    utils.forIn(forArrayValue['controls'], (control, controlName: string) => {
      control.setValidators(null);
      control.markAsTouched();
      control.updateValueAndValidity();
      parentComponent.addStairStepRates.changeDetector.detectChanges();
    });
  }
  formFieldsTouched(parentComponent) {
    this.isEffectiveDateAndChargeTypeValid(parentComponent.createRatesModel, parentComponent);
    parentComponent.optionalUtilityService.isOptionalFormValid(parentComponent.optionalFields.optionalAttributesModel,
      parentComponent.changeDetector);
    const addRateValidate = this.isAddStairStepClickedValidate(parentComponent);
    const stariStepRateValidate = this.isAddRateClickedValidate(parentComponent);
    if (addRateValidate || stariStepRateValidate) {
      return;
    }
    this.errorMsgOnSave(parentComponent);
    parentComponent.changeDetector.detectChanges();
  }
  isEffectiveDateAndChargeTypeValid(createRatesModel, parentComponent) {
    createRatesModel.isSetUpFormValid = true;
    utils.forIn(createRatesModel.ratesForm.controls, (value, name: string) => {
      if (name !== 'customerName' && name !== 'waived' && name !== 'calculateRate' &&
        name !== 'passThrough' && name !== 'rollUp' && name !== 'legalTextArea' && name !== 'instructionalTextArea' && !value['value']) {
        createRatesModel.ratesForm.controls[name].markAsTouched();
      }
    });
    parentComponent.effectiveandChargeTypeValidation();
  }
  isAddStairStepClickedValidate(parentComponent): boolean | undefined {
    if (parentComponent.createRatesModel.isAddStairStepClicked) {
      return this.addStairStepValidation(parentComponent);
    }
  }
  addStairStepValidation(parentComponent): boolean {
    const addChargesRef: AdditionalChargesComponent = parentComponent.addCharges;
    const isAdditionalChargesValid: boolean = (addChargesRef) ? addChargesRef.addChargesModel.addChargesForm.valid : true;
    this.stairStepFormMandatory(parentComponent);
    if (parentComponent.addStairStepRates.stairStepModel.addStairStepForm.valid &&  parentComponent.createRatesModel.isSetUpFormValid &&
      this.validateDocumentation(parentComponent) && isAdditionalChargesValid) {
      this.checkForValidRateWithoutFree(parentComponent);
    } else if ((parentComponent.addStairStepRates.stairStepModel.addStairStepForm.valid
      && !parentComponent.createRatesModel.ratesForm.valid)
      || !parentComponent.addStairStepRates.stairStepModel.addStairStepForm.valid
      || !isAdditionalChargesValid) {
      this.errorMsgOnSave(parentComponent);
    } else {
      if (parentComponent.createRatesModel.isSetUpFormValid) {
        this.validateDocumentation(parentComponent);
      } else {
        this.errorMsgOnSave(parentComponent);
      }
    }
    return true;
  }
  checkForValidRateWithoutFree(parentComponent) {
    if (parentComponent.addStairStepRates.stairStepModel.addStairStepForm.controls.stepsArray['controls'].length === 1 &&
      parentComponent.addStairStepRates.stairStepModel.addStairStepForm.controls.stepsArray['controls'][0]['controls']['step'].value.label
      === 'Free') {
      parentComponent.messageService.clear();
      parentComponent.messageService.add({
        severity: 'error', summary: 'Missing Required Information',
        detail: 'Please specify a valid stair steps'
      });
    } else {
      this.checkAlternateCharge(parentComponent);
    }
  }
  isAddRateClickedValidate(parentComponent): boolean | undefined {
    const addChargesRef: AdditionalChargesComponent = parentComponent.addCharges;
    const isAdditionalChargesValid: boolean = (addChargesRef) ? addChargesRef.addChargesModel.addChargesForm.valid : true;
    if (parentComponent.createRatesModel.isAddRateClicked) {
      this.setRateAndRateTypeMandatory(parentComponent);
      this.isGroupRateTypeMandatory(parentComponent);
      if (parentComponent.addRates.addRatesModel.addRateForm.valid &&  parentComponent.createRatesModel.isSetUpFormValid &&
        this.validateDocumentation(parentComponent) && isAdditionalChargesValid) {
        this.checkAlternateCharge(parentComponent);
        return true;
      } else if ((parentComponent.addRates.addRatesModel.addRateForm.valid && !parentComponent.createRatesModel.ratesForm.valid)
        || !parentComponent.addRates.addRatesModel.addRateForm.valid || !isAdditionalChargesValid) {
        this.errorMsgOnSave(parentComponent);
        return true;
      } else {
        if (parentComponent.createRatesModel.isSetUpFormValid) {
          this.validateDocumentation(parentComponent);
        } else {
          this.errorMsgOnSave(parentComponent);
        }
        return true;
      }
    }
  }
  checkAlternateCharge(parentComponent) {
    if (parentComponent.createRatesModel.ratesForm.valid) {
      parentComponent.createRatesModel.isShowSavePopup = true;
    } else {
      this.errorMsgOnSave(parentComponent);
    }
  }
  validateDocumentation(parentComponent): boolean {
    if (!parentComponent.documentation.viewDocumentationModel.docIsLegalText) {
      if (parentComponent.documentation.viewDocumentationModel.docIsInstructionalText) {
        parentComponent.documentation.viewDocumentationModel.noDocumentationFound = true;
        parentComponent.documentation.changeDetector.detectChanges();
      } else {
        this.toastMessage(parentComponent.messageService, 'error', 'Error', 'Please Refresh the Documentation to Proceed');
      }
      return false;
    } else {
      return true;
    }
  }
  validateRateForm(parentComponent): boolean {
    let ratesFormValid: boolean;
    const checkBoxValidity: boolean = this.validateRateCheckBoxes(parentComponent.createRatesModel.CheckBoxAttributes);
    parentComponent.createRatesModel.createRatesValidation.checkBoxSelected = checkBoxValidity;
    if (!checkBoxValidity) {
      this.checkRates(parentComponent);
    } else if (parentComponent.createRatesModel.CheckBoxAttributes.rollUp) {
      ratesFormValid = false;
    } else if (!parentComponent.createRatesModel.CheckBoxAttributes.rollUp && parentComponent.createRatesModel.isAddRateClicked) {
      if (parentComponent.addRates.addRatesModel.addRateForm.dirty) {
        this.setRateAndRateTypeMandatory(parentComponent);
        this.isGroupRateTypeMandatory(parentComponent);
      }
      ratesFormValid = this.checkRateFormValidity(parentComponent);
    } else {
      ratesFormValid = true;
    }
    return ratesFormValid;
  }
  validateStairStepRateForm(parentComponent): boolean {
    let stairStepratesFormValid: boolean;
    const checkBoxValidity: boolean = this.validateRateCheckBoxes(parentComponent.createRatesModel.CheckBoxAttributes);
    parentComponent.createRatesModel.createRatesValidation.checkBoxSelected = checkBoxValidity;
    if (!checkBoxValidity) {
      this.checkStairStepRates(parentComponent);
    } else if (parentComponent.createRatesModel.CheckBoxAttributes.rollUp) {
      stairStepratesFormValid = false;
    } else if (!parentComponent.createRatesModel.CheckBoxAttributes.rollUp && parentComponent.createRatesModel.isAddStairStepClicked) {
      if (parentComponent.addStairStepRates.stairStepModel.addStairStepForm.dirty) {
        this.stairStepFormMandatory(parentComponent);
      } else {
        this.removestairStepFormMandatory(parentComponent);
      }
      stairStepratesFormValid = this.checkStairStepRateFormValidity(parentComponent);
    } else {
      stairStepratesFormValid = true;
    }
    return stairStepratesFormValid;
  }
  checkRates(parentComponent) {
    if (parentComponent.createRatesModel.isAddRateClicked) {
      parentComponent.restrictZeroInAddedFields();
      this.setRateAndRateTypeMandatory(parentComponent);
      this.isGroupRateTypeMandatory(parentComponent);
    } else {
      if (!parentComponent.createRatesModel.isAddStairStepClicked) {
        this.errorMsgOnSave(parentComponent);
      }
    }
  }
  checkStairStepRates(parentComponent) {
    if (parentComponent.createRatesModel.isAddStairStepClicked) {
      this.stairStepFormMandatory(parentComponent);
    } else {
      if (!parentComponent.createRatesModel.isAddRateClicked) {
        this.errorMsgOnSave(parentComponent);
      }
    }
  }
  validateRateCheckBoxes(checkBoxAttributes: CheckBoxAttributesInterface): boolean {
    return checkBoxAttributes.waived || checkBoxAttributes.calculateRate || checkBoxAttributes.passThrough;
  }
  checkRateFormValidity(parentComponent): boolean {
    let ratesFormValidity: boolean;
    if (parentComponent.addRates.addRatesModel.addRateForm.valid) {
      ratesFormValidity = true;
    } else {
      ratesFormValidity = false;
    }
    return ratesFormValidity;
  }
  checkStairStepRateFormValidity(parentComponent): boolean {
    return parentComponent.addStairStepRates.stairStepModel.addStairStepForm.valid;
  }
  setRateAndRateTypeMandatory(parentComponent) {
    utils.forIn(parentComponent.addRates.addRatesModel.addRateForm.controls.rates.controls, (value, name: string) => {
      utils.forIn(value['controls'], (forArrayValue, forArrayName: string) => {
        if (forArrayName !== 'minAmount' && forArrayName !== 'maxAmount' && forArrayName !== 'rounding' && !forArrayValue['value']) {
          parentComponent.addRates.addRatesModel.addRateForm.controls.rates.controls[name]['controls'][forArrayName]
            .setValidators(Validators.required);
          parentComponent.addRates.addRatesModel.addRateForm.controls.rates.controls[name]['controls'][forArrayName].markAsTouched();
          parentComponent.addRates.addRatesModel.addRateForm.controls.rates.controls[name]['controls'][forArrayName].
            updateValueAndValidity();
          parentComponent.addRates.changeDetector.detectChanges();
        }
      });
    });
  }
  removeRateAndRateTypeMandatory(parentComponent) {
    utils.forIn(parentComponent.addRates.addRatesModel.addRateForm.controls.rates.controls, (value, name: string) => {
      utils.forIn(value['controls'], (forArrayValue, forArrayName: string) => {
        if (forArrayName !== 'minAmount' && forArrayName !== 'maxAmount' && forArrayName !== 'rounding' && !forArrayValue['value']) {
          parentComponent.addRates.addRatesModel.addRateForm.controls.rates.controls[name]['controls'][forArrayName]
            .setValidators(null);
          parentComponent.addRates.addRatesModel.addRateForm.controls.rates.controls[name]['controls'][forArrayName].
            updateValueAndValidity();
          parentComponent.addRates.changeDetector.detectChanges();
        }
      });
    });
  }
  isGroupRateTypeMandatory(parentComponent) {
    if (parentComponent.addRates.addRatesModel.addRateForm.controls.rates.controls.length > 1) {
      parentComponent.addRates.addRatesModel.addRateForm.controls['groupRateType'].setValidators(Validators.required);
      parentComponent.addRates.addRatesModel.addRateForm.controls['groupRateType'].updateValueAndValidity();
      parentComponent.addRates.addRatesModel.addRateForm.get('groupRateType').markAsTouched();
    }
  }
  toastMessage(messageService: MessageService, key: string, type: string, data: string) {
    const message = {
      severity: key,
      summary: type,
      detail: data
    };
    messageService.clear();
    messageService.add(message);
  }
  isInvalidChargeTypeError(parentComponent: CreateRatesComponent): boolean {
    let isRateClicked = false;
    let rateForm;
    if (parentComponent.createRatesModel.isAddRateClicked) {
      isRateClicked = true;
      rateForm = parentComponent.addRates.addRatesModel.addRateForm;
    } else if (parentComponent.createRatesModel.isAddStairStepClicked) {
      isRateClicked = true;
      rateForm = parentComponent.addStairStepRates.stairStepModel.addStairStepForm;
    } else {
      isRateClicked = false;
    }
    return parentComponent.createRatesModel.ratesForm.valid &&
      parentComponent.optionalFields.optionalAttributesModel.optionalForm.valid && isRateClicked &&
      rateForm.valid && parentComponent.addCharges && parentComponent.addCharges.addChargesModel.invalidChargeType;
  }
  errorMsgOnSave(parentComponent) {
    const requiredMessage = 'Missing Required Information';
    const detail = 'Provide the required information in the highlighted fields and submit the form again';
    if (!parentComponent.createRatesModel.isSetUpFormValid) {
      this.toastMessage(parentComponent.messageService, 'error', requiredMessage, detail);
    } else  if (this.checkAddIsClicked(parentComponent)) {
      parentComponent.messageService.clear();
      parentComponent.messageService.add({
        severity: 'error', summary: requiredMessage,
        detail:
          `Provide the required information in the highlighted fields and submit the form again.
        Please specify Rates to complete the Rate setup`
      });
    } else if (this.isInvalidChargeTypeError(parentComponent)) {
      this.toastMessage(parentComponent.messageService, 'error', parentComponent.addCharges.addChargesModel.invalidChargeTypeSummary,
        parentComponent.addCharges.addChargesModel.invalidChargeTypeDetail);
    } else {
      this.toastMessage(parentComponent.messageService, 'error', requiredMessage, detail);
    }
  }
  checkAddIsClicked(parentComponent) {
    return ((!parentComponent.createRatesModel.isAddRateClicked || !parentComponent.createRatesModel.isAddStairStepClicked) &&
      parentComponent.createRatesModel.CheckBoxAttributes.rollUp) || (!parentComponent.createRatesModel.isAddRateClicked
        && !parentComponent.createRatesModel.isAddStairStepClicked);
  }
}
