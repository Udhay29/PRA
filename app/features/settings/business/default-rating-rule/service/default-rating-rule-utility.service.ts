import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as utils from 'lodash';
import { MessageService } from 'primeng/components/common/messageservice';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { DefaultRatingRuleModel } from '../model/default-rating-rule-model';
import { ConfigurationViewDTO, EditValue, RuleCrietria } from '../model/default-rating-rule.interface';

@Injectable({
  providedIn: 'root'
})
export class DefaultRatingRuleUtilityService {

  constructor() { }
  static getFormControls(formbuilder: FormBuilder): FormGroup {
    return formbuilder.group({
      effectiveDate: ['', Validators.required],
      citySubstitution: [],
      radius: [],
      ruleCriteria1: [],
      ruleCriteria2: [],
      ruleCriteria3: []
    });
  }

  static initialDate(model: DefaultRatingRuleModel) {
    if (model.effectiveDate && model.expirationDate) {
      model.effectiveMinDate = new Date(model.effectiveDate);
      model.effectiveMaxDate = new Date(model.expirationDate);
      model.expirationMinDate = new Date(model.effectiveDate);
      model.expirationMaxDate = new Date(model.expirationDate);
    }
  }

  static formatRequestJson(model) {
    model.requestParam.customerRatingRuleID = model.populateData.customerRatingRuleID;
    model.requestParam.citySubstitutionIndicator = model.populateData.citySubstitutionIndicator;
    model.requestParam.radiusUnitOfLengthMeasurement = model.populateData.radiusUnitOfLengthMeasurement;
    model.requestParam.expirationDate = model.populateData.expirationDate;
    model.requestParam.effectiveDate = model.populateData.effectiveDate;
    model.requestParam.customerRatingRuleConfigurationInputDTOs = model.populateData.
    customerRatingRuleConfigurationViewDTOs;
  }

  static populateEffectiveDate(model: DefaultRatingRuleModel) {
    model.effectiveMinDate = new Date(model.effectiveDate);
    model.effectiveMaxDate = new Date(model.expirationDate);
    model.defaultRatingForm.patchValue({ effectiveDate: model.effectiveMinDate });
  }

  static populateRadioFields(model: DefaultRatingRuleModel, data: EditValue) {
    utils.forEach(model.defaultRules, (fieldData: RuleCrietria) => {
      if (data.name.toLowerCase() === fieldData.ruleCriteriaName.toLowerCase()) {
        model.defaultRatingForm.controls[`ruleCriteria${fieldData.ruleCriteriaID}`].setValue(data.value);
        fieldData.value = data.value;
      }
      });
    }
  static toastMessage(messageService: MessageService, key: string, data: string) {
    const message = {
      severity: key,
      summary: (key === 'error') ? 'Error' : 'Success',
      detail: data
    };
    messageService.clear();
    messageService.add(message);
  }

  static populateRadiusValue(model: DefaultRatingRuleModel) {
    model.defaultRatingForm.controls['radius'].setValue(model.populateData.
    citySubstitutionIndicator === 'Y' ? model.populateData.citySubstitutionRadiusValue : null);
  }

  static formatData(model: DefaultRatingRuleModel) {
    model.effectiveDate = model.populateData.effectiveDate ?
      moment(model.populateData.effectiveDate).format(model.dateFormat) : '';
    model.expirationDate = model.populateData.expirationDate ?
      moment(model.populateData.expirationDate).format(model.dateFormat) : '';
    model.citySubstitution = (model.populateData.citySubstitutionIndicator === 'Y') ? 'Yes' : 'No';
    model.radiusValue = (model.populateData.citySubstitutionIndicator === 'Y') ?
     (model.populateData.citySubstitutionRadiusValue ? `${Number(model.
      populateData.citySubstitutionRadiusValue)} ${model.populateData.radiusUnitOfLengthMeasurement}` : '--') : '--';
  }

  static formatEditData(model: DefaultRatingRuleModel): Array<EditValue> {
    const editData = [];
    utils.forEach(model.populateData.customerRatingRuleConfigurationViewDTOs, (data: ConfigurationViewDTO) => {
      editData.push({
        'name' : data.ruleCriteriaName,
        'value' : data.ruleCriteriaValueID
      });
    });
    return editData;
  }

  static getValidDate(model: DefaultRatingRuleModel) {
    model.isNotValidDate = false;
    const effDateValue = model.defaultRatingForm.controls['effectiveDate'].value;
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    if (effDateValue && model.effectiveMaxDate) {
      model.isNotValidDate = (
      effDateValue.getTime() > model.effectiveMaxDate.setHours(0, 0, 0, 0));
    }
  }

  static validateDateFormat(event: Event, model: DefaultRatingRuleModel): boolean | undefined {
    const date = event.srcElement['value'];
    model.effectiveMinDate = new Date(date);
    const datePat = /^(1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])\/[0-9]{4}$/;
    const matchArray = date.match(datePat);
    if (matchArray == null) {
      model.inCorrectEffDateFormat = true;
      return false;
    }
  }
  static setFormErrors(model: DefaultRatingRuleModel) {
    const effError = (model.inCorrectEffDateFormat || model.isNotValidDate);
    model.defaultRatingForm.controls.effectiveDate.setErrors(effError ? {invalid: true} : null);
  }



  static setRadiusAndEffDate(model: DefaultRatingRuleModel) {
    model.requestParam.lastUpdatedTimestamp = model.populateData.lastUpdatedTimestamp ? model.populateData.lastUpdatedTimestamp : null;
    model.requestParam.citySubstitutionRadiusValue = model.defaultRatingForm.controls.radius.value ?
      Number(model.defaultRatingForm.controls.radius.value) : null;
      if (moment(model.populateData.effectiveDate).format(model.dateFormat) === moment(model.
        defaultRatingForm.
        controls.effectiveDate.value).format(model.dateFormat)) {
        model.requestParam.effectiveDateChanged = false;
        model.effectiveDateChangedCheck = false;
        model.requestParam.effectiveDate = moment(model.defaultRatingForm.
          controls.effectiveDate.value).format('YYYY-MM-DD');
      } else {
        model.requestParam.effectiveDateChanged = true;
        model.effectiveDateChangedCheck = true;
        model.requestParam.effectiveDate = moment(model.defaultRatingForm.
          controls.effectiveDate.value).format('YYYY-MM-DD');
      }
  }

  static warningMessage(messageService: MessageService) {
    messageService.clear();
    messageService.add({
      severity: 'info',
      summary: 'No Changes Found',
      detail: 'You have not made any changes to save the data'
    });
  }
  static attrChangeCheck(model: DefaultRatingRuleModel) {
    const matchExcludingDate = utils.isMatch(utils.omit(model.patchedValues, ['effectiveDate']),
     utils.omit(model.defaultRatingForm.value, ['effectiveDate']));
    if (matchExcludingDate) {
      model.requestParam.attributeChanged = false;
    } else {
      model.requestParam.attributeChanged = true;
    }
  }
}
