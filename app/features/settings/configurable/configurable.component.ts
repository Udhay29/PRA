import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Message } from 'primeng/api';
import { Router, RouterStateSnapshot } from '@angular/router';
import * as utils from 'lodash';

import { SettingsService } from './../service/settings.service';
import { ConfigurableModel } from './model/configurable.model';
import { ConfigurableService } from './service/configurable.service';
import { FormGroup } from '../../../../../node_modules/@angular/forms';
import { BroadcasterService } from '../../../shared/jbh-app-services/broadcaster.service';
import { SettingsModel } from './../models/settings.model';
@Component({
  selector: 'app-configurable',
  templateUrl: './configurable.component.html',
  styleUrls: ['./configurable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigurableComponent implements OnInit, AfterViewInit {
  @Input() settingsModel: SettingsModel;
  @ViewChild('settingForm') generalCmpRef;
  settingForm: FormGroup;
  configDataList: Array<object>;
  configurableModel: ConfigurableModel;
  msgs: Message[] = [];
  constructor(private readonly settingsService: SettingsService,
    private readonly configurableService: ConfigurableService, private readonly router: Router,
    private readonly shared: BroadcasterService,
    private readonly changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.configurableModel = new ConfigurableModel();
    this.configurableService.getData(this);
    this.navigationSubscription();
    this.saveSubscription();
  }
  ngAfterViewInit() {
    this.settingForm = this.generalCmpRef.settingForm;
    this.onChanges();
  }
  onChanges() {
    this.settingForm.valueChanges.subscribe(val => {
      if (this.settingsModel.isChangesSaving && this.settingForm.dirty) {
        this.settingsModel.isChangesSaving = false;
      }
    });
  }

  navigationSubscription() {
    const subscription = this.shared.on<RouterStateSnapshot>('navigationStarts').subscribe((value: RouterStateSnapshot) => {
      if (this.settingForm) {
        const data = {
          key: (!this.settingForm.dirty) ? true : false,
          message: 'You have unsaved data. Do you want to save?'
        };
        this.shared.broadcast('saved', data);
        this.configurableModel.routeUrl = value.url;
        if (subscription) {
          subscription.unsubscribe();
        }
      }
      this.changeDetector.detectChanges();
    });
  }

  saveSubscription() {
    const subscription = this.shared.on<boolean>('needToSave').subscribe((value: boolean) => {
      if (value) {
        this.saveServiceCall();
      } else {
        this.router.navigate([this.configurableModel.routeUrl]);
        if (subscription) {
          subscription.unsubscribe();
        }
      }
      this.changeDetector.detectChanges();
    });
  }

  submitForm() {
    this.triggerValidtion(this.settingForm);
    this.saveServiceCall();
    if (!this.settingForm.valid || this.generalCmpRef.configurableModel.cargoReleaseFieldInvalid) {
      this.toastMessage('error', 'Valid Information Required',
        'Provide valid information in the highlighted fields and submit the form again');
    }
    if (this.settingForm && !this.settingForm.dirty) {
      this.toastMessage('info', 'No Changes Found', 'No changes available to save');
    }
  }
  saveServiceCall() {
    if (this.settingForm && this.settingForm.controls && this.settingForm.valid &&
      !this.generalCmpRef.configurableModel.cargoReleaseFieldInvalid) {
      const dataList = this.dataFormater(this.settingForm);
      if (dataList && dataList.length) {
        const requestBody = { 'configurationParameterDetailDTOs': dataList };
        this.configurableModel.pageLoading = true;
        this.configurableService.saveBuConfDtoService(requestBody).subscribe((response: object) => {
          this.toastMessage('success', 'Configurables Updated!', 'You have updated the Configurables successfully.');
          this.removeDrity(this.settingForm);
          this.configurableService.getData(this);
          this.configurableModel.pageLoading = false;
          this.changeDetector.detectChanges();
        }, (error: Error) => {
          this.configurableModel.pageLoading = false;
          this.toastMessage('error', 'Error Message', error.message);
          this.changeDetector.detectChanges();
        });
      }
    }
  }
  toastMessage(severity: string, summary: string, detail: string) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: detail
    });
  }

  triggerValidtion(settingForm: FormGroup) {
    if (settingForm && settingForm.controls) {
      for (const control in settingForm.controls) {
        if (!settingForm.get(control).valid) {
          settingForm.get(control).markAsTouched();
        }
      }
    }
  }
  dataFormater(settingForm: FormGroup): Array<object> {
    const requestBody = [];
    for (const control in settingForm.controls) {
      if (settingForm.get(control).dirty) {
        const fieldValue = settingForm.get(control).value;
        const keyToFind = this.configurableModel.outPutdataHandler[control];
        const configData = utils.find(this.configDataList['configurationParameterDetailDTOs'], (value => {
          return value['configurationParameterDetailName'] === keyToFind;
        }));
        this.createRequestList(configData, requestBody, fieldValue);
      }
    }
    return requestBody;
  }
  createRequestList(configData: object, requestBody: Array<object>, fieldValue: string) {
    if (configData && configData['configurationParameterValue'] &&
      configData['configurationParameterValue'].toString() !== fieldValue) {
      if ((configData['configurationParameterDetailName'] === 'cargo_release_max'
        || configData['configurationParameterDetailName'] === 'cargo_release_default') &&
        !this.generalCmpRef.validateOnMax()) {
        configData['configurationParameterValue'] = (fieldValue.toString()).replace(/[,]/g, '');
      } else {
        configData['configurationParameterValue'] = fieldValue;
      }
      requestBody.push(configData);
    }
  }
  onCancelClick() {
    this.generalCmpRef.generalService.populateData(this.settingForm, this.generalCmpRef, this.configDataList);
    this.removeDrity(this.settingForm);
  }
  removeDrity(form: FormGroup) {
    Object.keys(form.controls).forEach(control => {
      form.controls[control].markAsPristine();
    });
  }

}
