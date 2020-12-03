import { MessageService } from 'primeng/components/common/messageservice';
import * as utils from 'lodash';
import { LaneCardModel } from '../model/lane-card.model';

export class LaneCardUtility {
  static setVariables(model: LaneCardModel, field: string, type: string) {
    model[field] = type;
    if (field === 'originPoint') {
      model.isShowMultipleFieldOrigin = true;
      model.selectedPoint = 'origin';
      model.isShowOriginLink = (type === '3-Zip Region');
    } else {
      model.isShowMultipleFieldDestination = true;
      model.selectedPoint = 'destination';
      model.isShowDestinationLink = (type === '3-Zip Region');
    }
  }
  static resetMultipleField(model: LaneCardModel, field: string) {
    if (field === 'originPoint') {
      model.isShowMultipleFieldOrigin = false;
      model.isShowOriginLink = false;
    } else {
      model.isShowMultipleFieldDestination = false;
      model.isShowDestinationLink = false;
    }
  }
  static checkInvalidField(model: LaneCardModel, messageService: MessageService) {
    if (utils.isUndefined(model.zipRangeForm.get('rangeFrom').value.label)) {
      model.zipRangeForm.get('rangeFrom').setErrors({invalid: true});
    }
    if (utils.isUndefined(model.zipRangeForm.get('rangeTo').value.label)) {
      model.zipRangeForm.get('rangeTo').setErrors({invalid: true});
    }
    this.toastMessage('error', 'Missing Required Information',
      'Provide the required information in the highlighted fields and submit the form again', model, messageService);
  }
  static toastMessage(type: string, title: string, message: string, model: LaneCardModel, messageService: MessageService) {
    model.stripErrorMessage = [];
    messageService.clear();
    messageService.add({
      severity: type, summary: title, detail: message
    });
  }
  static onClickAddRange(model: LaneCardModel, messageService: MessageService, pointType: string) {
    if (!model.laneCardForm.controls[`${pointType}Point`].hasError('invalid')) {
      model.selectedPoint = pointType;
      model.isShowAddRangePopup = true;
      model.stripErrorMessage = [{severity: 'error', summary: ' ', detail: 'The 3-Zip Range is not valid. Please try another zip'}];
    } else {
      this.toastMessage('error', 'Missing Required Information',
      'Provide the required information in the highlighted fields and submit the form again', model, messageService);
    }
  }
  static onFieldBlur(event: Event, controlName: string, model: LaneCardModel) {
    if (model.zipRangeForm.controls[controlName].valid && !event.target['value']) {
      model.zipRangeForm.controls[controlName].setValue(null);
    }
    model.isRangeError = false;
    model.stripErrorMessage = [{severity: 'error', summary: ' ', detail: 'The 3-Zip Range is not valid. Please try another zip'}];
    if (utils.isEmpty(model.zipRangeForm.controls[controlName].value)) {
      model.zipRangeForm.controls[controlName].setErrors({ required: true });
    }
    if (model.zipRangeForm.controls['rangeFrom'].value && model.zipRangeForm.controls['rangeTo'].value &&
    model.zipRangeForm.controls['rangeFrom'].valid && model.zipRangeForm.controls['rangeTo'].valid) {
      const fromValue = model.zipRangeForm.controls['rangeFrom'].value.dtoValues;
      const toValue = model.zipRangeForm.controls['rangeTo'].value.dtoValues;
      if (Number(fromValue) >= Number(toValue)) {
        model.isRangeError = true;
      }
    }
    model.zipRangeForm.updateValueAndValidity();
  }
  static frameZipRegion(postalCodeList, element, model) {
    const fieldName = element === 'originPoints' ? 'originPoint' : 'destinationPoint';
    const countryField = element === 'originPoints' ? 'originCountry' : 'destinationCountry';
    const formValueList = [];
    utils.forEach(model.editLineHaulData[element], (pointValue) => {
      let formValueObj = {
        label: null, value: null, dtoValues: null, countryCode: null
      };
      if (pointValue.subTypeName === '3-Zip') {
        formValueObj = this.frameValueDto(utils.filter(postalCodeList, ['PostalCodeID', pointValue.pointID]));
      } else {
        const lowerDto = this.frameValueDto(utils.filter(postalCodeList, ['PostalCodeID', pointValue.lowerBoundID]));
        const upperDto = this.frameValueDto(utils.filter(postalCodeList, ['PostalCodeID', pointValue.upperBoundID]));
        formValueObj.label = `${lowerDto['label']} - ${upperDto['label']}`;
        formValueObj.dtoValues = `${lowerDto['label']} - ${upperDto['label']}`;
        formValueObj.value = {from: lowerDto, to: upperDto};
        formValueObj.countryCode = lowerDto['countryCode'];
      }
      formValueList.push(formValueObj);
    });
    model.laneCardForm.controls[fieldName].setValue(utils.sortBy(formValueList, ['label']));
    model.laneCardForm.controls[countryField].setValue(this.getCountry(fieldName, model));
    model.laneCardForm.updateValueAndValidity();
  }
  static getCountry(fieldName: string, model: LaneCardModel) {
    const countryCode = utils.isUndefined(model.laneCardForm.controls[fieldName].value[0].countryCode) ?
    model.laneCardForm.controls[fieldName].value[0]['dtoValues'].countryCode : model.laneCardForm.controls[fieldName].value[0].countryCode;
    return utils.find(model.countries, { 'value': countryCode });
  }
  static frameValueDto(filteredlist) {
    const formValueObj = {
      label: null, value: null, dtoValues: null, countryCode: null
    };
    if (!utils.isEmpty(filteredlist)) {
      formValueObj.label = filteredlist[0]['PostalCode'];
      formValueObj.dtoValues = filteredlist[0]['PostalCode'];
      formValueObj.value = filteredlist[0]['PostalCodeID'];
      formValueObj.countryCode = filteredlist[0]['CountryCode'];
    }
    return formValueObj;
  }
  static checkDuplicateValue(event, controlName: string, formName: string, model: LaneCardModel, messageService: MessageService) {
    const formFieldName = `${model.selectedPoint}Point`;
    utils.forEach(model.laneCardForm.controls[formFieldName].value, (formValue) => {
      if (utils.includes(formValue['label'], event.label)) {
        model[formName].controls[controlName].setErrors({invalid: true});
        return false;
      }
    });
  }
}
