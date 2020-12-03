import { Injectable, ChangeDetectorRef } from '@angular/core';
import * as utils from 'lodash';
import { OptionalAttributesModel } from './../models/optional-attributes.model';

@Injectable({
  providedIn: 'root'
})
export class OptionalUtilityService {

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
    optionalModel.chargeTypeFiltered.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);
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
    optionalModel.equipmentCategoryFiltered.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);
    changeDetector.detectChanges();
  }
  onTypeEquipmentType(event: Event, optionalModel: OptionalAttributesModel, changeDetector: ChangeDetectorRef) {
    optionalModel.equipmentTypeFiltered = [];
    if (optionalModel.equipmentType) {
      optionalModel.equipmentType.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          optionalModel.equipmentTypeFiltered.push({
            label: element.label,
            value: element.value,
            id: element.id
          });
        }
      });
    }
    optionalModel.equipmentTypeFiltered.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);
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
}
