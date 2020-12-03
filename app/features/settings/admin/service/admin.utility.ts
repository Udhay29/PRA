import { Injectable } from '@angular/core';
import { AdminModel } from '../model/admin-model';
import { FormGroup } from '@angular/forms';
import { AdminType } from '../model/admin-interface';
@Injectable({
  providedIn: 'root'
})
export class AdminUtility {
  constructor() { }
  static setValuesforEachField(parentRef: any, response: AdminType, adminFormRef: FormGroup) {
    const keysList = Object.keys(response);
    keysList.forEach(key => {
      if (parentRef.adminModel.adminPopulate[key] && response[key] && response[key].length) {
        const formName = parentRef.adminModel.adminPopulate[key]['formName'];
        parentRef.adminModel.componentValues[key] = response[key];
        const dataList = [];
        for (const value of response[key]) {
          dataList.push(value[parentRef.adminModel.adminPopulate[key]['value']]);
        }
        adminFormRef.controls[formName].setValue(dataList);
        parentRef.changeDetector.detectChanges();
      }
    });
  }
  static getRequestBody(settingForm: FormGroup, adminModel: AdminModel) {
    const requestBody = {};
    for (const control in settingForm.controls) {
      if (settingForm.get(control) && settingForm.get(control).touched) {
        this.requestBodyFrammer(adminModel, requestBody, control);
      }
    }
    return requestBody;
  }
  static requestBodyFrammer(adminModel: AdminModel, requestBody: object, control: string) {
    const dtoName = adminModel.adminRequestData[control];
    const dtoArray = this.droArrayFrammer(adminModel, control, dtoName);
    if (dtoArray.length) {
      requestBody[dtoName] = dtoArray;
    }
  }
  static droArrayFrammer(adminModel: AdminModel, control: string, dtoName: string): Array<object> {
    const dtoArray = [];
    const requestData = adminModel.componentValues[dtoName];
    const dtoId = adminModel.adminPopulate[dtoName].key;
    const dtoValue = adminModel.adminPopulate[dtoName].value;
    for (const value of requestData) {
      if (value && (!value[dtoId] || value.isRemoved)) {
        const chipsData = {};
        chipsData[dtoId] = value[dtoId] ? value[dtoId] : null;
        chipsData[dtoValue] = value[dtoValue];
        dtoArray.push(chipsData);
      }
    }
    return dtoArray;
  }
}
