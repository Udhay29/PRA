import { Message } from 'primeng/api';
import { Injectable, ChangeDetectorRef } from '@angular/core';
import * as utils from 'lodash';
import { OptionalAttributesModel } from '../../shared/models/optional-attributes.model';
import { ContractListModel } from '../contract-list/model/contract-list.model';
import { SectionsModel } from '../sections/model/sections-model';

@Injectable({
  providedIn: 'root'
})
export class OptionalUtilityService {
  documentationCheck: object;
  missingRequiredMessasge = 'Missing Required Information';
  constructor() {
  }


  onTypeChargeValue(event: Event, optionalModel: OptionalAttributesModel, changeDetector: ChangeDetectorRef) {
    optionalModel.chargeTypeFiltered = [];
    if (optionalModel.chargeType) {
      optionalModel.chargeType.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          optionalModel.chargeTypeFiltered.push({
            label: element.label,
            value: element.value,
            description: element.description
          });
        }
      });
    }
    optionalModel.chargeTypeFiltered = utils.differenceBy(optionalModel.chargeTypeFiltered,
      optionalModel.optionalForm.controls['chargeType'].value, 'label');
    const chargeType = optionalModel.chargeTypeFiltered.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);
    optionalModel.chargeTypeFiltered = chargeType;
    changeDetector.detectChanges();
  }
  onTypeBusinessUnit(event: Event, optionalModel: OptionalAttributesModel, changeDetector: ChangeDetectorRef) {
    optionalModel.businessUnitFiltered = [];
    if (optionalModel.businessUnitData) {
      optionalModel.businessUnitData.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          optionalModel.businessUnitFiltered.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    changeDetector.detectChanges();
  }
  onTypeEquipmentCategory(event: Event, optionalModel: OptionalAttributesModel, changeDetector: ChangeDetectorRef) {
    optionalModel.equipmentCategoryFiltered = [];
    if (optionalModel.equipmentCategory) {
      optionalModel.equipmentCategory.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          optionalModel.equipmentCategoryFiltered.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    const epuipmentCategory =
      optionalModel.equipmentCategoryFiltered.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);
    optionalModel.equipmentCategoryFiltered = epuipmentCategory;
    changeDetector.detectChanges();
  }
  onTypeEquipmentType(event: Event, optionalModel: OptionalAttributesModel, changeDetector: ChangeDetectorRef) {
    optionalModel.equipmentTypeFiltered = [];
    if (optionalModel.equipmentType) {
      optionalModel.equipmentType.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          optionalModel.equipmentTypeFiltered.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    const equipmentType = optionalModel.equipmentTypeFiltered.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);
    optionalModel.equipmentTypeFiltered = equipmentType;
    changeDetector.detectChanges();
  }
  onTypeEquipmentLength(event: Event, optionalModel: OptionalAttributesModel, changeDetector: ChangeDetectorRef) {
    optionalModel.equipmentLengthFiltered = [];
    if (optionalModel.equipmentLength) {
      optionalModel.equipmentLength.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          optionalModel.equipmentLengthFiltered.push({
            label: element.label,
            value: element.value,
            id: element.id,
            lengthDescription: element.lengthDescription
          });
        }
      });
    }
    optionalModel.equipmentLength.sort((chargeTypefirstValue, chargeTypeSecondValue) => {
      return (chargeTypefirstValue.label > chargeTypeSecondValue.label) ? 1 : -1;
    });
    changeDetector.detectChanges();
  }
  onTypeCarrierValue(event: Event, optionalModel: OptionalAttributesModel, changeDetector: ChangeDetectorRef) {
    optionalModel.carrierSuggestions = [];
    if (optionalModel.carriersList) {
      optionalModel.carriersList.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          optionalModel.carrierSuggestions.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    optionalModel.carrierSuggestions = utils.differenceBy(optionalModel.carrierSuggestions,
      optionalModel.optionalForm.controls['carriers'].value, 'label');
    optionalModel.carrierSuggestions = utils.sortBy(optionalModel.carrierSuggestions, ['label']);
    changeDetector.detectChanges();
  }
  validateOptionalFields(optionalModel: OptionalAttributesModel, messageService) {
    const serviceLevel = optionalModel.optionalForm.controls.serviceLevel;
    if (serviceLevel.invalid) {
      serviceLevel.markAsTouched();
      messageService.clear();
      messageService.add({
        severity: 'error', summary: this.missingRequiredMessasge,
        detail: 'Provide a Service Level'
      });
      return false;
    }
    return true;
  }
  isOptionalFormValid(optionalModel: OptionalAttributesModel, changeDetector: ChangeDetectorRef) {
    utils.forIn(optionalModel.optionalForm.controls, (value, name: string) => {
      optionalModel.optionalForm.controls[name].markAsTouched();
      changeDetector.detectChanges();
    });
  }
  isContractSelected(contractListModel: ContractListModel, messageService): boolean {
    if (contractListModel.selectedContract.length) {
      return true;
    }
    messageService.clear();
    messageService.add({
      severity: 'error', summary: this.missingRequiredMessasge,
      detail: 'Please select a Contract'
    });
    return false;
  }
  isSectionSelected(sectionsModel: SectionsModel, messageService): boolean {
    if (sectionsModel.selectedSection.length) {
      return true;
    }
    messageService.clear();
    messageService.add({
      severity: 'error', summary: this.missingRequiredMessasge,
      detail: 'Please select a Section'
    });
    return false;
  }
  setDocumentationValid(rateModel) {
    this.documentationCheck = {
      'refreshed': rateModel.isRefreshClicked,
      'validForm': rateModel.validFields
    };
  }
  getDocumentationValid() {
    return this.documentationCheck;
  }
}
