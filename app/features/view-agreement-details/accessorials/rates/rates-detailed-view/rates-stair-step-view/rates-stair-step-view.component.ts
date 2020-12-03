import { Component, Input, OnInit } from '@angular/core';
import * as utils from 'lodash';

import { StairStepModel } from './model/rates-stair-step-model';
import {
  CustomerAccessorialAdditionalChargeDTOs, CustomerAccessorialStairRateDTO,
  CustomerAccessorialStairStepRateDTOs
} from './model/rates-stair-step-interface';

@Component({
  selector: 'app-rates-stair-step-view',
  templateUrl: './rates-stair-step-view.component.html',
  styleUrls: ['./rates-stair-step-view.component.scss']
})
export class RatesStairStepViewComponent implements OnInit {
  @Input() detailedViewResponse;
  stairStepModel: StairStepModel;
  constructor() {
    this.stairStepModel = new StairStepModel();
  }
  ngOnInit() {
    this.getStairStep(this.detailedViewResponse.customerAccessorialStairRateDTO);
    this.getAdditionalCharge(this.detailedViewResponse.customerAccessorialRateAdditionalChargeDTOs);
  }

  getStairStep(data: CustomerAccessorialStairRateDTO) {
    const obj = {
      'accessorialRateTypeName': data['accessorialRateTypeName'],
      'accessorialRateRoundingTypeName': data['accessorialRateRoundingTypeName'],
      'minimumAmount': data['minimumAmount'],
      'maximumAmount': data['maximumAmount'],
      'accessorialMaximumRateApplyTypeName': data['accessorialMaximumRateApplyTypeName']
    };
    this.stairStepModel.stairListRateValues.push(obj);
    utils.forEach(data.customerAccessorialStairStepRateDTOs, (response) => {
      this.stairStepModel.stairListStairValues.push(response);
    });
  }

  getAdditionalCharge(data: CustomerAccessorialAdditionalChargeDTOs[]) {
    utils.forEach(data, (addresponse: CustomerAccessorialAdditionalChargeDTOs) => {
      if (!utils.isEmpty(addresponse['additionalChargeTypeName'])) {
      addresponse['additionalChargeTypeName'] = addresponse['additionalChargeTypeName'] + ` (${addresponse['additionalChargeCodeName']})`;
      }
      this.stairStepModel.stairListAdditionalValues.push(addresponse);
    });
  }
}
