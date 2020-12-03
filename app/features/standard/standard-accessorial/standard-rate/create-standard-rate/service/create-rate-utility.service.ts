import { Injectable } from '@angular/core';
import {
  AbstractControl, FormArray,
  FormBuilder, FormControl, FormGroup, Validators
} from '@angular/forms';
import * as moment from 'moment';
import * as utils from 'lodash';
import { CurrencyPipe } from '@angular/common';

import { AdditionalChargesComponent
} from './../../../../../shared/accessorials/additional-charges/additional-charges/additional-charges.component';
import {
  AdditionalChargesModel
} from './../../../../../shared/accessorials/additional-charges/additional-charges/model/additional-charges-model';
import { AddStairStepModel } from './../../../../../shared/accessorials/stair-step/add-stair-step/model/add-stair-step.model';
import { CreateStandardRatesModel } from './../model/create-standard-rate.model';
import { OptionalAttributesModel } from './../../../../../view-agreement-details/accessorials/shared/models/optional-attributes.model';
import { AddRatesModel } from './../../../../../view-agreement-details/accessorials/rates/add-rates/model/add-rates.model';
import {
  BillToInterface, BusinessUnitInterface, CarrierCodeResponse,
  RequestedServiceResponse, RateCriteriaResponse
} from '../model/create-standard-interface';
import { CreateStandardRateComponent } from '../create-standard-rate.component';

@Injectable({
  providedIn: 'root'
})

export class CreateStandardRateUtilityService {
  ratePostFramer(rateModel: CreateStandardRatesModel, optionalModel: OptionalAttributesModel, setupModel: CreateStandardRatesModel,
    addRateModel: AddRatesModel, stairStepRatesModel: AddStairStepModel, addChargesModel: AdditionalChargesModel): object {
    const framerObject = this.onRefreshRatePostFramer(rateModel, optionalModel, setupModel);
    const groupRateTypeID = addRateModel ? addRateModel.addRateForm['controls']['groupRateType']['value'] : null;
    let groupRateTypeLabel = null;
    const itemizer = (stairStepRatesModel) ? (stairStepRatesModel.addStairStepForm['controls']['itemizeRates']['value'] ? 1 : 0) : 0;
    if (groupRateTypeID && groupRateTypeID.value) {
      const groupRateTypes = addRateModel.groupRateTypes;
      groupRateTypeLabel = utils.find(groupRateTypes, utils.matchesProperty('value', groupRateTypeID.value)).label;
    }
    framerObject['rateItemizeIndicator'] = stairStepRatesModel ?
      itemizer : this.isGroupRateItemizeIndicator(groupRateTypeLabel, addRateModel);
    framerObject['groupRateTypeId'] = groupRateTypeID ? groupRateTypeID.value : null;
    framerObject['customerAccessorialRateCriteriaDTOs'] =
      this.postRateCriteriaFramer(setupModel) ? this.postRateCriteriaFramer(setupModel) : null;
    framerObject['customerAccessorialRateAlternateChargeDTO'] = this.getAlternateChargeDetails(rateModel);
    framerObject['customerAccessorialRateChargeDTOs'] = addRateModel ? this.getRateDetails(addRateModel) : null;
    framerObject['chargeTypeCode'] = (setupModel.setUpForm.controls['chargeType'].value['description']) ?
      setupModel.setUpForm.controls['chargeType'].value['description'] : null;
    framerObject['documentLegalDescription'] = (rateModel.legalTextArea.length) ? rateModel.legalTextArea : null;
    framerObject['documentInstructionalDescription'] = (rateModel.instructionalTextArea.length) ? rateModel.instructionalTextArea : null;
    framerObject['docFileNames'] = this.documentationName(rateModel);
    framerObject['docHasAttachment'] = framerObject['docFileNames'].length !== 0;
    framerObject['customerAccessorialRateAdditionalChargeDTOs'] = (addChargesModel) ? this.getAddChargesDetails(addChargesModel) : null;
    framerObject['customerAccessorialStairRateDTO'] = stairStepRatesModel
      ? this.getStairStepRateDetails(stairStepRatesModel) : null;
    return framerObject;
  }
  documentationName(rateModel: CreateStandardRatesModel): Array<string> {
    return rateModel.attachments.map(attachment => {
      return attachment['documentName'];
    });
  }
  onRefreshRatePostFramer(rateModel: CreateStandardRatesModel, optionalModel: OptionalAttributesModel,
    setUpModel: CreateStandardRatesModel): Object {
    return {
      effectiveDate: this.postDateFormatter(setUpModel.setUpForm.controls['effectiveDate'].value),
      expirationDate: this.postDateFormatter(setUpModel.setUpForm.controls['expirationDate'].value),
      customerChargeName: setUpModel.setUpForm.controls['customerName'].value,
      customerAgreementId: null,
      level: 1,
      accessorialDocumentTypeId: 1,
      chargeTypeId: (setUpModel.setUpForm.controls['chargeType'].value) ?
        setUpModel.setUpForm.controls['chargeType'].value['value'] : null,
      chargeTypeName: (setUpModel.setUpForm.controls['chargeType'].value) ?
        setUpModel.setUpForm.controls['chargeType'].value['label'] : null,
      accessorialGroupTypeId: (setUpModel.setUpForm.controls['groupName'].value) ?
        setUpModel.setUpForm.controls['groupName'].value['value'] : null,
      accessorialGroupTypeName: (setUpModel.setUpForm.controls['groupName'].value) ?
        setUpModel.setUpForm.controls['groupName'].value['label'] : null,
      currencyCode: (setUpModel.setUpForm.controls['currency'].value) ?
        setUpModel.setUpForm.controls['currency']['value']['value'] : 'USD',
      equipmentCategoryCode: (optionalModel.optionalForm.controls['equipmentCategory'].value) ?
        optionalModel.optionalForm.controls['equipmentCategory'].value['value'] : null,
      equipmentTypeCode: (optionalModel.optionalForm.controls['equipmentType'].value) ?
        optionalModel.optionalForm.controls['equipmentType'].value['value'] : null,
      equipmentLengthId: (optionalModel.optionalForm.controls['equipmentLength'].value) ?
        optionalModel.optionalForm.controls['equipmentLength'].value['id'] : null,
      equipmentLengthDescription: (optionalModel.optionalForm.controls['equipmentLength'].value) ?
        optionalModel.optionalForm.controls['equipmentLength'].value['value'] : null,
      equipmentLength : (optionalModel.optionalForm.controls['equipmentLength'].value) ?
        optionalModel.optionalForm.controls['equipmentLength'].value['label'] : null,
      equipmentTypeId: (optionalModel.optionalForm.controls['equipmentType'].value) ?
        optionalModel.equipTypeId : null,
      customerAccessorialAccountDTOs: null,
      businessUnitServiceOfferingDTOs: (!utils.isEmpty(optionalModel.serviceLevelValues)) ?
        this.iterateBusinessUnitValues(optionalModel) : null,
      requestServiceDTOs: (!utils.isEmpty(optionalModel.optionalForm.controls['requestedService'].value)) ?
        this.iterateRequestedService(optionalModel) : null,
      carrierDTOs: (!utils.isEmpty(optionalModel.optionalForm.controls['carriers'].value)) ? this.iterateCarriers(optionalModel) : null
    };
  }
  getAlternateChargeDetails(rateModel: CreateStandardRatesModel): Object {
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
  getAlternateChargeObject(rateModel: CreateStandardRatesModel, quantity): Object {
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
  getRateDetails(addRateModel: AddRatesModel): Object {
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

  addRateDetails(rateObj: object[], element: AbstractControl, amount: string, minAmount: string,
    maxAmount: string, addRateModel: AddRatesModel): object {
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
  isGroupRateItemizeIndicator(groupRateTypeLabel: string, addRateModel: AddRatesModel): number {
    if (groupRateTypeLabel === 'Sum') {
      return addRateModel.addRateForm['controls']['isGroupRateItemize']['value'] ? 1 : 0;
    }
    return null;
  }
  isBU(optionalModel: OptionalAttributesModel): boolean {
    let isBusinessUnit;
    if (!utils.isEmpty(optionalModel.serviceLevelValues && optionalModel.optionalForm.controls['businessUnit'].value)) {
      isBusinessUnit = true;
    } else {
      isBusinessUnit = false;
    }
    return isBusinessUnit;
  }
  getRateLevel(rateModel: CreateStandardRatesModel): number {
    if (rateModel['selectedContractValue']) {
      return 8;
    } else if (rateModel['selectedSectionValue']) {
      return 4;
    } else {
      return 12;
    }
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
  postRateCriteriaFramer(data: CreateStandardRatesModel): RateCriteriaResponse[] {
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
    if (data.setUpForm.controls['waived'].value) {
      resultset.push(
        {
          'customerAccessorialRateCriteriaTypeId': waived
        }
      );
    }
    if (data.setUpForm.controls['calculateRate'].value) {
      resultset.push(
        {
          'customerAccessorialRateCriteriaTypeId': calculateRate
        }
      );
    }
    if (data.setUpForm.controls['passThrough'].value) {
      resultset.push(
        {
          'customerAccessorialRateCriteriaTypeId': passThrough
        }
      );
    }
    if (data.setUpForm.controls['rollUp'].value) {
      resultset.push(
        {
          'customerAccessorialRateCriteriaTypeId': rollUp
        }
      );
    }
    return resultset;
  }

  formatAmount(value: string, currencyPipe: CurrencyPipe): string {
    let formattedRateAmount;
    const enteredAmount = value.replace(/[, ]/g, '').trim();
    const wholeAmount = enteredAmount.split('.')[0].substring(0, 7);
    const decimalAmount = enteredAmount.split('.')[1] || '';
    const amount = +`${wholeAmount}.${decimalAmount}`;
    if (isNaN(amount)) {
      formattedRateAmount = null;
    } else {
      const modifiedAmount = amount.toString().replace(/[, ]/g, '').trim();
      formattedRateAmount = currencyPipe.transform(modifiedAmount, '', '', '1.2-4');
    }
    return formattedRateAmount;
  }
  isInvalidChargeTypeError(parentComponent: CreateStandardRateComponent): boolean {
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
  createRatesForm(createRatesModel: CreateStandardRatesModel, formBuilder: FormBuilder) {
    createRatesModel.ratesForm = formBuilder.group({
      quantity: ['', [Validators.pattern('[-0-9., ]*')]],
      quantityType: [''],
      alternateChargeType: ['']
    });
  }
}

