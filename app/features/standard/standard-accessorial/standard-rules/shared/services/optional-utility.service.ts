import { Message } from 'primeng/api';
import { Injectable, ChangeDetectorRef } from '@angular/core';
import * as utils from 'lodash';
import { OptionalAttributesModel } from '../../shared/models/optional-attributes.model';

@Injectable({
  providedIn: 'root'
})
export class OptionalUtilityService {
  documentationCheck: object;
  missingRequiredMessasge = 'Missing Required Information';
  constructor() {
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
