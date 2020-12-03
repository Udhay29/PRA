import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, RouterStateSnapshot } from '@angular/router';
import * as utils from 'lodash';

import { SettingsService } from '../service/settings.service';
import { AdminService } from './service/admin.service';
import { AdminModel } from './model/admin-model';
import { AdminUtility } from './service/admin.utility';
import { Message } from 'primeng/api';
import { BroadcasterService } from '../../../shared/jbh-app-services/broadcaster.service';
import { AdminType } from './model/admin-interface';
import { SettingsModel } from '../models/settings.model';
import { Breadcrumb } from '../../model/breadcrumb.interface';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [AdminService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent implements OnInit {
  @Input() settingsModel: SettingsModel;
  adminModel: AdminModel;
  constructor(private readonly settingsService: SettingsService,
    private readonly adminService: AdminService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly shared: BroadcasterService, private readonly router: Router) { }
  settingForm: FormGroup;
  msgs: Message[] = [];

  ngOnInit() {
    this.adminModel = new AdminModel();
    this.settingForm = this.settingsService.settingConfigurables();
    this.adminService.populateData(this.settingForm, this);
    this.navigationSubscription();
    this.saveSubscription();
    this.onChanges();
  }
  onChanges() {
    this.settingForm.valueChanges.subscribe(val => {
      if (this.settingsModel.isChangesSaving && this.settingForm.dirty) {
        this.settingsModel.isChangesSaving = false;
      }
    });
  }
  submitForm() {
    if (this.settingForm && this.settingForm.controls) {
      for (const control in this.settingForm.controls) {
        if (!this.settingForm.get(control).valid) {
          this.settingForm.get(control).markAsTouched();
        }
      }
      if (this.settingForm.valid && this.settingForm.dirty) {
        this.setRequestData();
      } else {
        this.toastMessage('info', this.adminModel.warnningMsg, 'No changes available to save');
        this.changeDetector.detectChanges();
      }
    }
  }
  setRequestData(): void {
    if (this.settingForm.valid && this.settingForm.dirty) {
      const requestBody = AdminUtility.getRequestBody(this.settingForm, this.adminModel);
      const validateArray = Object.keys(requestBody);
      if (validateArray.length) {
        this.adminModel.pageLoading = true;
        this.adminService.saveITConfDtoService(requestBody).subscribe((response: AdminType) => {
          this.removeDrity(this.settingForm);
          this.toastMessage('success', 'System Values Updated!', 'You have updated the System Values successfully.');
          this.adminService.populateData(this.settingForm, this);
          this.adminModel.pageLoading = false;
          this.changeDetector.detectChanges();
        }, (error: Error) => {
          this.toastMessage('error', 'Error Message', error.message);
          this.adminModel.pageLoading = false;
          this.changeDetector.detectChanges();
        });
      } else {
        this.toastMessage('info', this.adminModel.warnningMsg, 'No changes available to save');
        this.changeDetector.detectChanges();
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
  removeDrity(form: FormGroup) {
    Object.keys(form.controls).forEach(control => {
      form.controls[control].markAsPristine();
    });
  }
  navigationSubscription() {
    const subscription = this.shared.on<RouterStateSnapshot>('navigationStarts').subscribe((value: RouterStateSnapshot) => {
      const data = {
        key: (!this.settingForm.dirty) ? true : false,
        message: 'You have unsaved data. Do you want to save?'
      };
      this.shared.broadcast('saved', data);
      this.adminModel.routeUrl = value.url;
      if (subscription) {
        subscription.unsubscribe();
      }
      this.changeDetector.detectChanges();
    });
  }

  saveSubscription() {
    const subscription = this.shared.on<boolean>('needToSave').subscribe((value: boolean) => {
      if (value) {
        this.setRequestData();
      } else {
        this.router.navigate([this.adminModel.routeUrl]);
        if (subscription) {
          subscription.unsubscribe();
        }
      }
    });
  }
  onAdminFormKeyDown(keyName: string, controlName: string) {
    if (this.settingForm.controls && this.settingForm.controls[controlName] &&
      this.settingForm.controls[controlName].value && this.adminModel.componentValues[keyName] &&
      (this.settingForm.controls[controlName].value.length !== this.adminModel.componentValues[keyName].length)) {
      this.settingForm.controls[controlName].setValue(this.setValuesAfterRemove(keyName, controlName));
      this.changeDetector.detectChanges();
    }
  }
  setValuesAfterRemove(keyName, controlName) {
    const valueArray = [];
    for (const value of this.adminModel.componentValues[keyName]) {
      valueArray.push(value[this.adminModel.adminPopulate[keyName]['value']]);
    }
    return valueArray;
  }
  onClickCharges(navigationLink: Breadcrumb) {
    this.router.navigate(['/settings' + navigationLink.routerLink]);
  }
}
