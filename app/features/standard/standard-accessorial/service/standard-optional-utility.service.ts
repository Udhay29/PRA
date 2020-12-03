import { Injectable, ChangeDetectorRef } from '@angular/core';
import * as utils from 'lodash';
import { StandardOptionalAttributesModel } from '../model/standard-optional-attributes.model';

@Injectable({
  providedIn: 'root'
})
export class StandardOptionalUtilityService {

  constructor() {
  }


  onTypeChargeValue(event: Event, standardOptionalModel: StandardOptionalAttributesModel, changeDetector: ChangeDetectorRef) {
    standardOptionalModel.chargeTypeFiltered = [];
    if (standardOptionalModel.chargeType) {
      standardOptionalModel.chargeType.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          standardOptionalModel.chargeTypeFiltered.push({
            label: element.label,
            value: element.value,
            description: element.description
          });
        }
      });
    }
    standardOptionalModel.chargeTypeFiltered = utils.differenceBy(standardOptionalModel.chargeTypeFiltered,
      standardOptionalModel.optionalForm.controls['chargeType'].value, 'label');
    standardOptionalModel.chargeTypeFiltered.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);
    changeDetector.detectChanges();
  }
  onTypeBusinessUnit(event: Event, standardOptionalModel: StandardOptionalAttributesModel, changeDetector: ChangeDetectorRef) {
    standardOptionalModel.businessUnitFiltered = [];
    if (standardOptionalModel.businessUnitData) {
      standardOptionalModel.businessUnitData.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          standardOptionalModel.businessUnitFiltered.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    changeDetector.detectChanges();
  }
  onTypeEquipmentCategory(event: Event, standardOptionalModel: StandardOptionalAttributesModel, changeDetector: ChangeDetectorRef) {
    standardOptionalModel.equipmentCategoryFiltered = [];
    if (standardOptionalModel.equipmentCategory) {
      standardOptionalModel.equipmentCategory.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          standardOptionalModel.equipmentCategoryFiltered.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    standardOptionalModel.equipmentCategoryFiltered.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);
    changeDetector.detectChanges();
  }
  onTypeEquipmentType(event: Event, standardOptionalModel: StandardOptionalAttributesModel, changeDetector: ChangeDetectorRef) {
    standardOptionalModel.equipmentTypeFiltered = [];
    if (standardOptionalModel.equipmentType) {
      standardOptionalModel.equipmentType.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          standardOptionalModel.equipmentTypeFiltered.push({
            label: element.label,
            value: element.value,
            id: element.id
          });
        }
      });
    }
    standardOptionalModel.equipmentTypeFiltered.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);
    changeDetector.detectChanges();
  }
  onTypeEquipmentLength(event: Event, standardOptionalModel: StandardOptionalAttributesModel, changeDetector: ChangeDetectorRef) {
    standardOptionalModel.equipmentLengthFiltered = [];
    if (standardOptionalModel.equipmentLength) {
      standardOptionalModel.equipmentLength.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          standardOptionalModel.equipmentLengthFiltered.push({
            label: element.label,
            value: element.value,
            id: element.id,
          });
        }
      });
    }
    standardOptionalModel.equipmentLength.sort((chargeTypefirstValue, chargeTypeSecondValue) => {
      return (chargeTypefirstValue.label > chargeTypeSecondValue.label) ? 1 : -1;
    });
    changeDetector.detectChanges();
  }
  onTypeCarrierValue(event: Event, standardOptionalModel: StandardOptionalAttributesModel, changeDetector: ChangeDetectorRef) {
    standardOptionalModel.carrierSuggestions = [];
    if (standardOptionalModel.carriersList) {
      standardOptionalModel.carriersList.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          standardOptionalModel.carrierSuggestions.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    standardOptionalModel.carrierSuggestions = utils.differenceBy(standardOptionalModel.carrierSuggestions,
      standardOptionalModel.optionalForm.controls['carriers'].value, 'label');
    standardOptionalModel.carrierSuggestions = utils.sortBy(standardOptionalModel.carrierSuggestions, ['label']);
    changeDetector.detectChanges();
  }
}
