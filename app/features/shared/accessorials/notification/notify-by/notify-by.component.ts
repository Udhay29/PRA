import { group } from '@angular/animations';
import { NotifyByService } from './service/notify-by.service';
import { NotifyByModel } from './model/notifyby.model';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';

@Component({
  selector: 'app-notify-by',
  templateUrl: './notify-by.component.html',
  styleUrls: ['./notify-by.component.scss']
})
export class NotifyByComponent implements OnInit {
  notifyByModel = new NotifyByModel;

  constructor(private readonly changeDetector: ChangeDetectorRef,
    private readonly notifyByService: NotifyByService, private readonly formBuilder: FormBuilder) {
    this.notifyByModel = new NotifyByModel();
    this.createForm();
  }

  ngOnInit() {
    this.getNotificationType();
    this.getTemplateType();
    this.getCheckBoxData();
  }
  createForm() {
    this.notifyByModel.notifyByForm = this.formBuilder.group({
      notificationType: new FormControl('', [Validators.required]),
      notifyByControl: new FormControl(''),
      selectionCheckbox: ['', [Validators.required]],
      websiteDesc: new FormControl('', []),
      emailNotificationType: new FormControl('')
    });
    this.notifyByModel.notifyByForm.controls['selectionCheckbox'].setValue(this.notifyByModel.defaultNotifyCheck);
    this.notifyByModel.notifyByForm.controls['selectionCheckbox'].updateValueAndValidity();
  }
  getNotificationType() {
    this.notifyByService.getNotificationType().pipe(takeWhile(() => this.notifyByModel.isSubscribeFlag))
      .subscribe((frequency) => {
        this.populateNotificationType(frequency);
      });
  }
  populateNotificationType(frequency) {
    if (frequency) {
      const frequencys = frequency['_embedded']['accessorialNotificationTypes'];
      const frequencyValues = frequencys.map((frequencyValue) => {
        return {
          label: frequencyValue.accessorialNotificationTypeName,
          value: frequencyValue.accessorialNotificationTypeId
        };
      });
      this.notifyByModel.NotificationType = frequencyValues;
      this.changeDetector.detectChanges();
    }
  }
  getTemplateType() {
    this.notifyByService.getTemplateType().pipe(takeWhile(() => this.notifyByModel.isSubscribeFlag))
      .subscribe((frequency) => {
        this.populateTemplateType(frequency);
      });
  }
  populateTemplateType(frequency) {
    if (frequency) {
      const frequencys = frequency['_embedded']['accessorialEmailTemplateTypes'];
      const frequencyValues = frequencys.map((frequencyValue) => {
        return {
          label: frequencyValue.accessorialEmailTemplateTypeName,
          value: frequencyValue.accessorialEmailTemplateTypeId
        };
      });
      this.notifyByModel.TemplateType = frequencyValues;
      this.notifyByModel.TemplateType.forEach(defaultvalue => {
        if (defaultvalue.label === 'Default') {
          this.notifyByModel.notifyByForm.controls['emailNotificationType'].setValue(defaultvalue);
        }
      });
      this.changeDetector.detectChanges();
    }
  }
  getCheckBoxData() {
    this.notifyByService.getCheckBoxData().pipe(takeWhile(() => this.notifyByModel.isSubscribeFlag))
      .subscribe((frequency) => {
        this.populateCheckBoxData(frequency);
      });
  }
  populateCheckBoxData(frequency) {
    if (frequency) {
      const frequencys = frequency['_embedded']['accessorialNotificationMethodTypes'];
      const frequencyValues = frequencys.map((frequencyValue) => {
        return {
          label: frequencyValue.accessorialNotificationMethodTypeName,
          value: frequencyValue.accessorialNotificationMethodTypeId
        };
      });
      this.notifyByModel.CheckBoxData = frequencyValues;
      this.changeDetector.detectChanges();
    }
  }
  onDropDownClick(response, keyName: string) {
    this.notifyByModel.suggestionResult = [];
    if (this.notifyByModel[keyName]) {
      this.notifyByModel[keyName].forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(response['query'].toLowerCase()) !== -1) {
          this.notifyByModel.suggestionResult.push({
            label: element.label,
            value: element.value
          });
        }
        this.notifyByModel.suggestionResult = utils.sortBy(this.notifyByModel.suggestionResult, 'label');
      });
    }
  }
  checkBoxChange() {
    this.setvalidators();
    if (this.notifyByModel.notifyByForm.controls['websiteDesc'].value &&
      !(this.notifyByModel.notifyByForm.controls['selectionCheckbox'].value.indexOf('Website') >= 0)) {
      this.notifyByModel.notifyByForm.controls['websiteDesc'].reset();
    }
  }
  setvalidators() {
    if (this.notifyByModel.notifyByForm.controls['selectionCheckbox'].value.indexOf('Email') >= 0
      && this.notifyByModel.notifyByForm.controls['selectionCheckbox'].value.indexOf('Website') >= 0) {
      this.setEmailAsRequired();
      this.setWebsiteMandatory();
    } else {
      if (this.notifyByModel.notifyByForm.controls['selectionCheckbox'].value.indexOf('Email') >= 0) {
        this.setEmailAsRequired();
        this.removeWebsiteValidatorsRequired();
      }
      if (this.notifyByModel.notifyByForm.controls['selectionCheckbox'].value.indexOf('Website') >= 0) {
        this.setWebsiteMandatory();
        this.removeEmailValidators();
      } else {
        this.removeEmailValidators();
        this.removeWebsiteValidatorsRequired();
      }
    }
  }
  setEmailAsRequired() {
    this.notifyByModel.notifyByForm.controls.emailNotificationType.setValidators([Validators.required]);
    this.notifyByModel.notifyByForm.controls.emailNotificationType.updateValueAndValidity();
  }
  removeEmailValidators() {
    this.notifyByModel.notifyByForm.controls.emailNotificationType.setValidators(null);
    this.notifyByModel.notifyByForm.controls.emailNotificationType.updateValueAndValidity();
  }
  setWebsiteMandatory() {
    this.notifyByModel.notifyByForm.controls.websiteDesc.setValidators([Validators.required]);
    this.notifyByModel.notifyByForm.controls.websiteDesc.updateValueAndValidity();
  }
  removeWebsiteValidatorsRequired() {
    this.notifyByModel.notifyByForm.controls.websiteDesc.setValidators(null);
    this.notifyByModel.notifyByForm.controls.websiteDesc.updateValueAndValidity();
    this.notifyByModel.notifyByForm.controls.websiteDesc.markAsUntouched();
    this.notifyByModel.validUrlCheck = false;
  }
  patternCheck() {
    const urlPattern = this.notifyByModel.rEx;
    if (!urlPattern.test(this.notifyByModel.notifyByForm.controls['websiteDesc'].value)) {
      this.notifyByModel.notifyByForm.controls.websiteDesc.setErrors({ error: true });
      this.notifyByModel.validUrlCheck = true;
    } else {
      this.notifyByModel.validUrlCheck = false;
      this.notifyByModel.notifyByForm.controls.websiteDesc.setErrors(null);
    }
  }
  onBlurNotificationType(event) {
    if (utils.isEmpty(event.target.value)) {
      this.notifyByModel.notifyByForm.controls.notificationType.setValue(null);
    }
  }
  onBluremailNotificationType(event) {
    if (utils.isEmpty(event.target.value)) {
      this.notifyByModel.notifyByForm.controls.emailNotificationType.setValue(null);
    }
  }
}
