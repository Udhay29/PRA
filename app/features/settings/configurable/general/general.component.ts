import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { formatCurrency } from '../../../../../../node_modules/@angular/common';
import { GeneralService } from './service/general.service';
import { GeneralUtility } from './service/general-utility';
import { SettingsService } from './../../service/settings.service';
import { ConfigurableModel } from '../model/configurable.model';
import { ConfigGeneralType } from '../model/configurables-interface';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralComponent implements OnInit {

  @Input() settingForm: FormGroup;
  @Input()
  set dataList(dataValue: Array<ConfigGeneralType>) {
    GeneralUtility.populateData(this.settingForm, this, dataValue);
  }
  configurableModel: ConfigurableModel;
  constructor(private readonly settingsService: SettingsService,
    private readonly changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.configurableModel = new ConfigurableModel;
    this.settingForm = this.settingsService.getBusinessConfigurables();
  }
  validateCurrency(fieldVal: string, formName: string) {
    if (this.settingForm.controls && this.settingForm.controls[formName]) {
      this.settingForm.controls[formName].setValue(fieldVal.trim());
    }
    if (this.settingForm.controls[formName] && this.settingForm.controls[formName].valid) {
      this.formatCurrency(fieldVal, formName);
    }
  }
  validateOnMax(): boolean {
    const cargoReleasemax = this.settingForm.get('cargoReleaseMax').value;
    const cargoReleasemaxVal: string = (cargoReleasemax.toString()).replace(/[,]/g, '');
    const cargoReleaseDefault = this.settingForm.get('cargoReleaseDefault').value;
    const cargoReleaseDefaultVal: string = (cargoReleaseDefault.toString()).replace(/[,]/g, '');
    if (cargoReleasemax && parseFloat(cargoReleaseDefaultVal) > parseFloat(cargoReleasemaxVal)) {
      return true;
    }
    return false;
  }
  formatCurrency(fieldVal: string, formName: string) {
    const currency = parseFloat(fieldVal.toString().replace(/[,]/g, '')).toFixed(2);
    const remainingValue = (currency.toString() && currency.toString().split('.').length > 1) ? currency.toString().split('.')[1] : '';
    const currencyVal: string = (currency.toString().split('.'))[0].replace(/[,]/g, '');
    this.configurableModel.cargoReleaseFieldInvalid = this.validateOnMax();
    if (currencyVal && currencyVal.length > 3) {
      this.currenyValueFormatter(currencyVal, formName, remainingValue);
    } else {
      this.settingForm.controls[formName].setValue(`${currencyVal}.${remainingValue}`);
    }
    this.changeDetector.detectChanges();
  }
  currenyValueFormatter(currencyVal: string, formName: string, remainingValue: string) {
    const currencyLength: number = currencyVal.length;
    let mergingString = '';
    for (let i = currencyLength - 1, j = 1; i >= 0; i--) {
      if (j < 4) {
        mergingString += currencyVal[i];
        j++;
      } else {
        mergingString += ',';
        mergingString += currencyVal[i];
        j = 2;
      }
    }
    mergingString = mergingString.split('').reverse().join('');
    this.settingForm.controls[formName].setValue(`${mergingString}.${remainingValue}`);
    this.changeDetector.detectChanges();
  }
  onNullCheckValidate(fieldValue: string, formName: string) {
    if (this.settingForm.controls && this.settingForm.controls[formName] && this.settingForm.controls[formName].valid) {
      this.settingForm.controls[formName].setValue(fieldValue.trim());
      if (this.settingForm.controls[formName].value) {
        this.settingForm.controls[formName].setValue(parseInt(this.settingForm.controls[formName].value, 10));
      }
    }
  }
}
