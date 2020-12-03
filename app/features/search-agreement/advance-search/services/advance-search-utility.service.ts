import { Injectable } from '@angular/core';
import * as utils from 'lodash';
import { AbstractControl } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import * as moment from 'moment';

import { AdvanceSearchModel } from '../model/advance-search.model';
import { MessageService } from 'primeng/components/common/messageservice';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { AgreementTypesItem } from '../model/advance-search-interface';

import { SearchGridQuery } from './../../search-grid/query/search-grid.query';
import { Menu } from 'primeng/menu';
import { RootObject } from '../model/advance-search-interface';

@Injectable({
  providedIn: 'root'
})
export class AdvanceSearchUtilityService {

  constructor() { }
  static getAdvanceSearchForm(formbuilder: FormBuilder): FormGroup {
    return formbuilder.group({
      favoriteSearches: [''],
      agreementType: ['', Validators.required],
      agreement: [''],
      contract: [''],
      billTo: [''],
      carrierCode: [''],
      codeStatus: [''],
      operationalTeam: [''],
      agreementStatus: [''],
      carrierStatus: [''],
      carrierAgreement: [''],
      carrier: [''],
      CarrierAgreementStatus: ['']
    });
  }

  static getAgreement(agreementTypes: AgreementTypesItem[]): MenuItem[] {
    const agreementList = [];
    utils.forEach(agreementTypes, (value: AgreementTypesItem) => {
      agreementList.push({
        label: value.agreementTypeName,
        value: value.agreementTypeName
      });
    });
    if (!utils.isEmpty(agreementList)) {
      agreementList.push({
        label: 'All',
        value: 'All'
      });
    }
    return agreementList;
  }

  static setDefaultAgreementType(model: AdvanceSearchModel) {
    if (!utils.isEmpty(model.agreementTypeList)) {
      utils.forEach(model.agreementTypeList, (value: MenuItem) => {
        if (value.label === 'All') {
          model.advanceSearchForm.controls.agreementType.setValue(value);
        }
      });
    }
  }

  static checkMandatoryFields(model: AdvanceSearchModel, formFields: string[]) {
    if (model.isMandatoryFlag) {
      utils.forEach(formFields, (value: string) => {
        model.advanceSearchForm.controls[value].setValidators([]);
        model.advanceSearchForm.controls[value].updateValueAndValidity();
        model.isShowError = false;
      });
    } else {
      utils.forEach(formFields, (value: string) => {
        model.advanceSearchForm.controls[value].setValidators([Validators.required]);
        model.advanceSearchForm.controls[value].updateValueAndValidity();
      });
      model.isShowError = true;
    }
  }

  static getStatus(data: string[]): MenuItem[] {
    const status = [];
    utils.forEach(data, (value: string) => {
      status.push({
        label: value,
        value: value
      });
    });
    return status;
  }

  static searchAgreementType(data: string, model: AdvanceSearchModel, name: string): MenuItem[] {
    const value = [];

    if (!utils.isEmpty(model[name])) {
      utils.forEach(model[name], (result: MenuItem) => {
        if (result.label.toLowerCase().indexOf(data.toLowerCase()) >= 0) {
          value.push(result);
          model.validateFlag = true;
        }
      });
    }
    return value;
  }

  static getAbstractControl(controls: string, model: AdvanceSearchModel): AbstractControl {
    return model.advanceSearchForm.get(controls);
  }

  static checkValidation(formControl: string, model: AdvanceSearchModel, invalidMessage?: boolean, flag?: boolean) {
    const fieldSelected = this.getAbstractControl(formControl, model);
    if (fieldSelected.value) {
      invalidMessage = (invalidMessage && flag === undefined) ? true : false;
      if (flag) {
        invalidMessage = true;
        this.validateForm(formControl, model, flag);
      }
    } else {
      invalidMessage = false;
      fieldSelected.reset();
    }
  }

  static validateForm(formcontrol: string, model: AdvanceSearchModel, invalidFlag?: boolean) {
    const fieldValue = model.advanceSearchForm.controls[formcontrol];
    invalidFlag ? fieldValue.setErrors({ 'invalid': true }) : fieldValue.setErrors(null);
  }

  static searchTeams(event: string, model: AdvanceSearchModel) {
    const value = [];
    if (!utils.isEmpty(model.teamsList)) {
      utils.forEach(model.teamsList, (result: MenuItem) => {
        if (result.label.toLowerCase().indexOf(event.toLowerCase()) >= 0) {
          value.push(result);
        }
      });
    }
    return value;
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

  static createCarrierSearchQuery(advanceSearchForm: FormGroup, query: object, findKeyString: object, model: AdvanceSearchModel) {
    const carrier = model.advanceSearchForm.controls.carrier.value;
    const agreement = model.advanceSearchForm.controls.carrierAgreement.value;
    if (agreement) {
      query['query']['bool']['must'][1]['query_string']['query'] =
       `${agreement['CarrierAgreementName'].replace(/[!?:\\ ['^~=\//\\{},.&&||<>()+*\]]/g, '\\$&')}`;
       query['sort'] = [];
       query['sort'].push({
        'carrierAgreementName.keyword': {
        'order': 'asc'
        }
       });
    }
    if (carrier) {
      query['query']['bool']['must'][4]['nested']['query']['bool']['must'][0]['query_string']['query'] =
       `*${carrier['CarrierName'].replace(/[!?:\\ ["^~=\//\\{},.&&||<>()+*\]]/g, '\\$&')}*`;
      query['sort'] = [];
      query['sort'].push( {
            'carrierAgreementCarrierAssociation.effectiveDate.keyword': {
              'order': 'desc',
              'mode': 'max',
              'nested': {
                'path': 'carrierAgreementCarrierAssociation',
                'filter' : {
                  'term' : {
                    'carrierAgreementCarrierAssociation.carrierDisplayName.keyword' : carrier['CarrierName']
                  }
                }
              }
            }
          });
       this.setCarrierAgreementStatusQuery(model, query);
    }
    this.setStatusQuery(model, query);
    model.advanceSearchFormValue = '';
    const advancedFormControl = advanceSearchForm.controls;
    for (const controlName in advancedFormControl) {
      if (advancedFormControl[controlName] && advancedFormControl[controlName].value) {
        const fieldValue = advancedFormControl[controlName].value;
      const componentName = model.advanceSearchFormField[controlName];
      model.advanceSearchFormValue += `${componentName['name']}: ${(typeof (fieldValue) !== 'string') ?
        fieldValue[componentName['key']] : findKeyString[controlName]}, `;
      }
    }
    model.advanceSearchFormValue = model.advanceSearchFormValue.substring(0, model.advanceSearchFormValue.length - 2);
  }
  static setCarrierAgreementStatusQuery(model: AdvanceSearchModel, query: object) {
    const carrierStatus = model.advanceSearchForm.controls.carrierStatus.value;
    const date = moment().format(model.momentDateFormat);
    if (carrierStatus && carrierStatus.value) {
      if (carrierStatus.value === 'Active') {
          this.setValueToStatus(model, query, 'N', 'Active', 'gte');
      } else if (carrierStatus.value === 'Inactive') {
        this.setValueToStatus(model, query, 'N OR Y', 'Active OR Inactive', 'lt');
      } else {
        this.setValueToStatus(model, query, '**', '**');
      }
    } else {
      query['query']['bool']['must'][4]['nested']['query']['bool']['must'].push( {
        'range': {
          'carrierAgreementCarrierAssociation.expirationDate': {
            'gte': date,
            'format': model.dateFormat
          }
        }
      });
    }
  }
  static setValueToStatus(model: AdvanceSearchModel, query: object, indicator: string, status: string, date?: string) {
    query['query']['bool']['must'][4]['nested']['query']['bool']['must'][1]['query_string']['query'] = indicator;
    query['query']['bool']['must'][4]['nested']['query']['bool']['must'][2]['query_string']['query'] = status;
    if (date) {
      query['query']['bool']['must'][4]['nested']['query']['bool']['must'].push( {
        'range': {
          'carrierAgreementCarrierAssociation.expirationDate': {
            [date]:  moment().format(model.momentDateFormat)
          }
        }
      });
    }
  }
  static setStatusQuery(model: AdvanceSearchModel, query: object) {
    const carrierAgreementStatus = model.advanceSearchForm.controls.CarrierAgreementStatus.value;
    const date = moment().format(model.momentDateFormat);
    if (carrierAgreementStatus) {
      switch (carrierAgreementStatus.value) {
        case 'Active' :
          query['query']['bool']['must'][2]['query_string']['query'] = 'N';
          query['query']['bool']['must'][3]['query_string']['query'] = 'Active';
          query['query']['bool']['must'].push({
            'range': {
            'expirationDate': {
              'gte': date,
              'format': model.dateFormat
            }
          }
        });
          break;
        case 'Inactive' :
          query['query']['bool']['must'][2]['query_string']['query'] = 'N OR Y';
          query['query']['bool']['must'][3]['query_string']['query'] = 'Active OR Inactive';
          query['query']['bool']['must'].push({
            'range': {
            'expirationDate': {
              'lt': date,
              'format': model.dateFormat
            }
          }
        });
        break;
        case 'All':
          query['query']['bool']['must'][2]['query_string']['query'] = '**';
          query['query']['bool']['must'][3]['query_string']['query'] = '**';
        break;
        default: break;
      }
    } else {
      query['query']['bool']['must'].push({
        'range': {
        'expirationDate': {
          'gte': date,
          'format': model.dateFormat
        }
      }
    });
    }
  }
  static createQuery(advanceSearchForm: FormGroup, query: object, findKeyString: object, advanceSearchModel: AdvanceSearchModel): object {
    const advancedFormControl = advanceSearchForm.controls;
    query['query']['bool']['must'] = [];
    query['query']['bool']['must'].push({
      'query_string': {
        'fields': [
          'AgreementStatus.keyword'
        ],
        'query': 'Completed'
      }
    });
    advanceSearchModel.advanceSearchFormValue = '';
    for (const controlName in advancedFormControl) {
      if (advancedFormControl[controlName] && advancedFormControl[controlName].value) {
        this.createIndepthQuery(controlName, query, advancedFormControl[controlName].value, findKeyString, advanceSearchModel);
      }
    }
    advanceSearchModel.advanceSearchFormValue = advanceSearchModel.advanceSearchFormValue.substring(
      0, advanceSearchModel.advanceSearchFormValue.length - 2);
    return query;
  }
  static createIndepthQuery(controlName: string, query: object, fieldValue: object, findKeyString: object,
    advanceSearchModel: AdvanceSearchModel) {
    let componentValue = (typeof (fieldValue) !== 'string') ? fieldValue[findKeyString[controlName]]
      : findKeyString[controlName];
    const componentName = advanceSearchModel.advanceSearchFormField[controlName];
    advanceSearchModel.advanceSearchFormValue += `${componentName['name']}: ${(typeof (fieldValue) !== 'string') ?
      fieldValue[componentName['key']] : findKeyString[controlName]}, `;
    if (controlName === 'contract') {
      this.getContractQuery(query, fieldValue, advanceSearchModel);
    } else if (controlName === 'agreementStatus' || controlName === 'codeStatus') {
      query['query']['bool']['must'].push(
        SearchGridQuery.getQueryStructure(controlName, this.getCurrentDate(), componentValue.toLowerCase()));
    } else {
      componentValue = (componentValue === 'All') ? '*' : componentValue;
      query['query']['bool']['must'].push(SearchGridQuery.getQueryStructure(controlName, componentValue));
    }
  }
  static getContractQuery(query: object, fieldValue: object, advanceSearchModel: AdvanceSearchModel) {
    const componentName = [
      { field: 'ContractRanges.ContractName', value: 'ContractName' },
      { field: 'ContractRanges.ContractNumber', value: 'contractId' }
    ];
    const queryStructure = SearchGridQuery.getQueryStructure('contract', '');
    utils.forEach(componentName, (key: object) => {
      const mustStructure = {
        'query_string': {
          'default_field': 'ContractRanges.contractDisplayName.keyword',
          'query': `${fieldValue['Contract'].replace(/[!?:\\['^~=\//\\{},.&&||<>()+*\]-]/g, '\\$&')}`,
          'split_on_whitespace': 'false'
        }
      };
      queryStructure['nested']['query']['bool']['must'].push(mustStructure);
    });
    query['query']['bool']['must'].push(queryStructure);
  }
  static getCurrentDate(): string {
    const date = new Date();
    return moment(date).format('YYYY-MM-DD');
  }
  static setDefaultstatus(model: AdvanceSearchModel, field: string) {
    if (!utils.isEmpty(model[field])) {
      utils.forEach(model[field], (value: MenuItem) => {
        if (value.label.toLowerCase() === 'active') {
          (field === 'carrierStatus') ? model.advanceSearchForm.controls.carrierStatus.setValue(value) :
          model.advanceSearchForm.controls.CarrierAgreementStatus.setValue(value);
        }
      });
    }
  }
}
