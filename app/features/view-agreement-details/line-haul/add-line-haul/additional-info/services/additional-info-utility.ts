import { Injectable, ElementRef } from '@angular/core';
import * as utils from 'lodash';
import * as moment from 'moment';
import { FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';
import { Message } from 'primeng/components/common/message';
import { AdditionalInfoModel } from '../models/additional-info.model';
import {
    BillToCodeList, ElasticRootObject, HitsArray, MileagePreferenceRequest,
    ReqParam, WeightUnit
  } from '../models/additional-info.interface';
  import { ViewAgreementDetailsUtility } from '../../../../service/view-agreement-details-utility';
  import { AdditionalInfoComponent } from '../additional-info.component';
  import { LineHaulValues } from '../../../additional-information/line-haul-overview/model/line-haul-overview.interface';

  export class AdditionalInfoUtility {

    static setWeightUnitValidation(model: AdditionalInfoModel ) {
        if (model.weightMinRange && model.weightMaxRange && !model.unitOfWeight) {
            model.additionalInformationForm.controls['weightUnitOfMeasure'].markAsTouched();
            model.additionalInformationForm.controls['weightUnitOfMeasure'].setErrors({ invalid: true });
            model.additionalInformationForm.controls['weightUnitOfMeasure'].setValidators([Validators.required]);
            model.additionalInformationForm.controls['weightUnitOfMeasure'].updateValueAndValidity();
        }
        if (model.unitOfWeight) {
          if (!model.weightMinRange && !model.weightMaxRange) {
            model.weightInvalidFlag = false;
            model.additionalInformationForm.controls['weightRangeFrom'].markAsTouched();
            model.additionalInformationForm.controls['weightRangeTo'].markAsTouched();
            model.additionalInformationForm.controls['weightRangeFrom'].setErrors({ invalid: true });
            model.additionalInformationForm.controls['weightRangeTo'].setErrors({ invalid: true });
            model.additionalInformationForm.controls['weightRangeFrom'].setValidators([Validators.required]);
            model.additionalInformationForm.controls['weightRangeTo'].setValidators([Validators.required]);
            model.additionalInformationForm.controls['weightRangeFrom'].updateValueAndValidity();
            model.additionalInformationForm.controls['weightRangeTo'].updateValueAndValidity();
          }
        } else if (!model.weightInvalidFlag && !model.weightInputFlag) {
          model.additionalInformationForm.controls['weightRangeFrom'].markAsUntouched();
          model.additionalInformationForm.controls['weightRangeTo'].markAsUntouched();
          model.additionalInformationForm.controls['weightRangeFrom'].setValidators(null);
          model.additionalInformationForm.controls['weightRangeTo'].setValidators(null);
          model.additionalInformationForm.controls['weightRangeFrom'].updateValueAndValidity();
          model.additionalInformationForm.controls['weightRangeTo'].updateValueAndValidity();
        }
      }

      static setWeightMeasurement(model: AdditionalInfoModel) {
        if (model.additionalInformationForm.
          controls['weightUnitOfMeasure'].value !== null) {
          model.additionalInfoReqParam['unitOfWeightMeasurement'] = {
            'code': model.additionalInformationForm.
              controls['weightUnitOfMeasure'].value['label'],
            'description': model.additionalInformationForm.
              controls['weightUnitOfMeasure'].value['label'],
          };
        } else {
          model.additionalInfoReqParam['unitOfWeightMeasurement'] = {
            'code': null,
            'description': null,
            'lineHaulWeightRangeMinQuantity': null,
            'lineHaulWeightRangeMaxQuantity': null
          };
        }
      }

      static setMileagePreference(model: AdditionalInfoModel) {
        if (!utils.isEmpty(model.additionalInformationForm.
          controls['mileagePreference'].value)) {
          model.additionalInfoReqParam['mileagePreference'] = {
            'mileagePreferenceID': model.additionalInformationForm.
              controls['mileagePreference'].value['label'],
            'mileagePreferenceName': model.additionalInformationForm.
              controls['mileagePreference'].value['value'],
          };
        } else {
          model.additionalInfoReqParam['mileagePreference'] = {
            'mileagePreferenceID': null,
            'mileagePreferenceName': null,
          };
        }
      }

      static thousandSeperator(value: string): string {
        const enteredRange = value.replace(/,/g, '');
        return enteredRange.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }

      static getEditBillToCodeList(linehaulOverviewData: LineHaulValues , model: AdditionalInfoModel) {
        const selectedBillToList = [];
        if (!utils.isEmpty(linehaulOverviewData.billTos)) {
          utils.each(linehaulOverviewData.billTos, (value) => {
            utils.each(model.billToCodeList, (data) => {
              if (value['billToID'] === data['value']['billToID']) {
                selectedBillToList.push(data['value']);
              }
            });
          });
        }
        return selectedBillToList;
      }
      static getEditCarrierCodeList(linehaulOverviewData: LineHaulValues, model: AdditionalInfoModel) {
        const selectedCarrierCodeList = [];
        if (!utils.isEmpty(linehaulOverviewData.carriers)) {
          utils.each(linehaulOverviewData.carriers, (value) => {
            utils.each(model.carrierList, (data) => {
              if (value['carrierID'] === parseInt(data['value']['id'], 10)) {
                selectedCarrierCodeList.push(data['value']);
              }
            });
          });
        }
        return selectedCarrierCodeList;
      }

  }
