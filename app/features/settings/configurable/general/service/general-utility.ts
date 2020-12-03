import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ConfigGeneralType, GeneralType } from '../../model/configurables-interface';
@Injectable({
  providedIn: 'root'
})
export class GeneralUtility {

  constructor() { }
  static populateData(buConfgForm: FormGroup, parentRef: any, response: Array<ConfigGeneralType>) {
    parentRef.componentValues = {};
    if (response && response['configurationParameterDetailDTOs']) {
      const responseData = response['configurationParameterDetailDTOs'];
      responseData.forEach(element => {
        if (element && parentRef['configurableModel'] && parentRef['configurableModel']['dataHandler']) {
          const formName = parentRef['configurableModel']['dataHandler'][element['configurationParameterDetailName']];
          this.validateData(formName, parentRef, element, buConfgForm);
        }
      });
    }
  }
  static validateData(formName: string, parentRef: any, element: GeneralType, buConfgForm: FormGroup) {
    if (formName) {
      if (formName === 'cargoReleaseDefault' || formName === 'cargoReleaseMax') {
        parentRef.formatCurrency(element['configurationParameterValue'], formName);
      } else {
        buConfgForm.controls[formName].setValue(element['configurationParameterValue']);
      }
      parentRef.changeDetector.detectChanges();
    }
  }
}
