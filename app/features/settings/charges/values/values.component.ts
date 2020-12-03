import { AfterViewInit, Component, OnInit, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { takeWhile, findIndex } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterStateSnapshot } from '@angular/router';
import * as utils from 'lodash';

import { ValuesService } from './service/values.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { ChargeTypes, ChargeUsageType, ApplicationTypes } from './models/values-interface';
import { ValuesModel } from './models/values-model';
import { ValuesUtility } from './service/values.utility';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';
import { ChargesModel } from './../models/charges.model';


@Component({
  selector: 'app-values',
  templateUrl: './values.component.html',
  styleUrls: ['./values.component.scss']
})
export class ValuesComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() chargesModel: ChargesModel;
  subscription: any;
  valuesModel: ValuesModel;

  constructor(private readonly router: Router, private valuesService: ValuesService,
    private readonly messageService: MessageService,
    private readonly shared: BroadcasterService,
    public changeDetector: ChangeDetectorRef, private formbuilder: FormBuilder) {
  }

  ngOnInit() {
    this.valuesModel = new ValuesModel();
    this.getValuesForm();
    this.getChargeTypes();
    this.getApplicationLevelTypes();
  }
  ngAfterViewInit() {
    this.navigationSubscription();
    this.saveSubscription();
    this.onChanges();
  }
  ngOnDestroy() {
    this.valuesModel.valuesSubscriberFlag = false;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  onChanges() {
    this.valuesModel.valuesForm.valueChanges.subscribe(val => {
      if (this.chargesModel.isChangesSaving && this.valuesModel.valuesForm.dirty) {
        this.chargesModel.isChangesSaving = false;
      }
    });
  }
  onClickCancel() {
    this.valuesModel.routingUrl = '/settings';
    this.onDontSave();
  }
  onSave() {
    this.saveChargeCodeConfigurables();
    this.valuesModel.isSaveChanges = false;
    this.valuesModel.valuesForm.markAsUntouched();
    this.valuesModel.valuesForm.updateValueAndValidity();
  }
  onDontSave() {
    this.router.navigate([this.valuesModel.routingUrl]);
  }
  navigationSubscription() {
    const subscription = this.shared.on<RouterStateSnapshot>('navigationStarts').subscribe((value: RouterStateSnapshot) => {
      if (this.valuesModel.valuesForm) {
        const data = {
          key: (!this.valuesModel.valuesForm.dirty) ? true : false,
          message: 'You have unsaved data. Do you want to save?'
        };
        this.shared.broadcast('saved', data);
        this.valuesModel.routeUrl = value.url;
        if (subscription) {
          subscription.unsubscribe();
        }
      }
      this.changeDetector.detectChanges();
    });
  }
  saveSubscription() {
    this.subscription = this.shared.on<boolean>('needToSaveValues').subscribe((value: boolean) => {
      if (value) {
        this.saveChargeCodeConfigurables();
      } else {
        this.router.navigate([this.valuesModel.routeUrl]);
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
      }
      this.changeDetector.detectChanges();
    });
  }
  getValuesForm() {
    this.valuesModel.valuesForm = this.formbuilder.group({
      usage: [''],
      applicationLevel: ['']
    });
  }
  getChargeTypes() {
    const usageData = [];
    this.valuesService.getChargeTypeValues().pipe(takeWhile(() => this.valuesModel.valuesSubscriberFlag))
      .subscribe((chargeTypeResponse: ChargeTypes) => {
        chargeTypeResponse._embedded.chargeUsageTypes.forEach((chargeType) => {
          usageData.push(chargeType.chargeUsageTypeName);
          chargeType['chargeUsageTypeName'] = chargeType['chargeUsageTypeName'].toLowerCase();
        });
        this.valuesModel.chargeUsageValuesDataList = chargeTypeResponse._embedded.chargeUsageTypes;
        this.valuesModel.valuesForm.controls['usage'].setValue(usageData);
        this.changeDetector.detectChanges();
      }, (error: Error) => {
        ValuesUtility.toastMessage(this.messageService, 'error', error.message);
        this.changeDetector.detectChanges();
      });
  }

  getApplicationLevelTypes() {
    const applicationData = [];
    this.valuesService.getApplicationLevelTypes().pipe(takeWhile(() => this.valuesModel.valuesSubscriberFlag))
      .subscribe((applicationTypeResponse: ApplicationTypes) => {
        applicationTypeResponse._embedded.chargeApplicationLevelTypes.forEach((applicationType) => {
          applicationData.push(applicationType.chargeApplicationLevelTypeName);
          applicationType['chargeApplicationLevelTypeName'] = applicationType['chargeApplicationLevelTypeName'].toLowerCase();
        });
        this.valuesModel.applicationLevelTypesDataList = applicationTypeResponse._embedded.chargeApplicationLevelTypes;
        this.valuesModel.valuesForm.controls['applicationLevel'].setValue(applicationData);
        this.changeDetector.detectChanges();
      }, (error: Error) => {
        ValuesUtility.toastMessage(this.messageService, 'error', error.message);
        this.changeDetector.detectChanges();
      });
  }
  onAdd(event: any, type: string) {
    this.valuesModel.isDetailsSaved = false;
    switch (type) {
      case 'usage':
        this.addChargeUsageTypes(event);
        break;
      case 'applicationLevel':
        this.addApplicationLevelTypes(event);
        break;
      default:
        break;
    }
  }

  private addChargeUsageTypes(event: any) {
    const chargeusageType = {
      'chargeUsageTypeID': null,
      'chargeUsageTypeName': event['value'].trim()
    };
    if (!ValuesUtility.checkDuplicates(this.valuesModel, event, 'usage')) {
      utils.remove(this.valuesModel.chargeUsageValues, { 'chargeUsageTypeName': event['value'].trim() });
      this.valuesModel.chargeUsageValues.push(chargeusageType);
      this.valuesModel.chargeUsageValuesDataList.push(chargeusageType);
    } else {
      this.valuesModel.usageDuplicateValues.push(chargeusageType);
      ValuesUtility.toastMessage(this.messageService, 'error', this.valuesModel.errorMessage);
      this.changeDetector.detectChanges();
    }
  }

  private addApplicationLevelTypes(event: any) {
    const chargeApplicationLevelType = {
      'chargeApplicationLevelTypeID': null,
      'chargeApplicationLevelTypeName': event['value'].trim()
    };
    if (!ValuesUtility.checkDuplicates(this.valuesModel, event, 'applicationLevel')) {
      utils.remove(this.valuesModel.applicationLevelTypes, { 'chargeApplicationLevelTypeName': event['value'].trim() });
      this.valuesModel.applicationLevelTypes.push(chargeApplicationLevelType);
      this.valuesModel.applicationLevelTypesDataList.push(chargeApplicationLevelType);
    } else {
      this.valuesModel.applicationLevelDuplicateValues.push(chargeApplicationLevelType);
      ValuesUtility.toastMessage(this.messageService, 'error', this.valuesModel.errorMessage);
      this.changeDetector.detectChanges();
    }
  }

  onRemoval(event: any, type: string) {
    switch (type) {
      case 'usage':
        this.removeUsageType(event);
        break;
      case 'applicationLevel':
        this.removeApplicationLevelType(event);
        break;
      default:
        break;
    }
  }

  private removeUsageType(event: any) {
    this.valuesModel.usageDuplicateValues.forEach(element => {
      element['chargeUsageTypeName'] = element['chargeUsageTypeName'].toLowerCase();
      this.valuesModel.usageDuplicateValues.push(element);
    });
    const usageValue = utils.find(this.valuesModel.usageDuplicateValues, { 'chargeUsageTypeName': event['value'].toLowerCase().trim() });
    if (usageValue) {
      utils.remove(this.valuesModel.usageDuplicateValues, { 'chargeUsageTypeName': event['value'].toLowerCase().trim() });
    } else {
      const chargeType = utils.find(this.valuesModel.chargeUsageValuesDataList, {
        'chargeUsageTypeName': event['value'].toLowerCase().trim()
      });
      if (chargeType && !chargeType['chargeUsageTypeID']) {
        utils.remove(this.valuesModel.chargeUsageValues, { 'chargeUsageTypeName': event['value'].toLowerCase().trim() });
      } else {
        this.valuesModel.chargeUsageValues.push({
          'chargeUsageTypeName': chargeType['chargeUsageTypeName'],
          'chargeUsageTypeID': chargeType['chargeUsageTypeID']
        });
      }
      ValuesUtility.removeValues(this.valuesModel, event, 'usage');
    }
  }

  private removeApplicationLevelType(event: any) {
    this.valuesModel.applicationLevelDuplicateValues.forEach(element => {
      element['chargeApplicationLevelTypeName'] = element['chargeApplicationLevelTypeName'].toLowerCase();
      this.valuesModel.applicationLevelDuplicateValues.push(element);
    });
    const applicationLevelValue = utils.find(this.valuesModel.applicationLevelDuplicateValues,
      { 'chargeApplicationLevelTypeName': event['value'].toLowerCase().trim() });
    if (applicationLevelValue) {
      utils.remove(this.valuesModel.applicationLevelDuplicateValues, {
        'chargeApplicationLevelTypeName': event['value'].toLowerCase()
          .trim()
      });
    } else {
      const applicationLevelType = utils.find(this.valuesModel.applicationLevelTypesDataList,
        { 'chargeApplicationLevelTypeName': event['value'].toLowerCase().trim() });
      if (applicationLevelType && !applicationLevelType['chargeApplicationLevelTypeID']) {
        utils.remove(this.valuesModel.applicationLevelTypes, { 'chargeApplicationLevelTypeName': event['value'].toLowerCase().trim() });
      } else {
        this.valuesModel.applicationLevelTypes.push({
          'chargeApplicationLevelTypeID': applicationLevelType['chargeApplicationLevelTypeID'],
          'chargeApplicationLevelTypeName': applicationLevelType['chargeApplicationLevelTypeName']
        });
      }
      ValuesUtility.removeValues(this.valuesModel, event, 'applicationLevel');
    }
  }

  saveChargeCodeConfigurables() {
    this.valuesModel.chargeCodeConfigurables = {
      'chargeUsageTypes': this.valuesModel.chargeUsageValues,
      'chargeApplicationLevelTypes': this.valuesModel.applicationLevelTypes
    };
    if (!utils.isEmpty(this.valuesModel.usageDuplicateValues) || !utils.isEmpty(this.valuesModel.applicationLevelDuplicateValues)) {
      ValuesUtility.toastMessage(this.messageService, 'error', this.valuesModel.errorMessage);
      this.chargesModel.isChangesSaving = false;
      this.changeDetector.detectChanges();
    } else if (!utils.isEmpty(this.valuesModel.chargeCodeConfigurables.chargeUsageTypes) ||
      !utils.isEmpty(this.valuesModel.chargeCodeConfigurables.chargeApplicationLevelTypes)) {
      this.valuesService.saveChargeCodeConfigurables(this.valuesModel.chargeCodeConfigurables)
        .pipe(takeWhile(() => this.valuesModel.valuesSubscriberFlag)).subscribe((response) => {
          this.valuesModel.chargeUsageValues = [];
          this.valuesModel.chargeUsageValuesDataList = [];
          this.valuesModel.applicationLevelTypes = [];
          this.valuesModel.applicationLevelTypesDataList = [];
          this.valuesModel.chargeCodeConfigurables = null;
          this.valuesModel.isDetailsSaved = true;
          this.valuesModel.valuesForm.markAsUntouched();
          this.valuesModel.valuesForm.markAsPristine();
          this.valuesModel.valuesForm.updateValueAndValidity();
          this.messageService.add({
            severity: 'success', summary: 'Charge Configurables Updated',
            detail: 'You have updated charge configurables successfully'
          });
          this.getChargeTypes();
          this.getApplicationLevelTypes();
          this.changeDetector.detectChanges();
        }, (error: HttpErrorResponse) => {
          this.handleError(error);
          this.changeDetector.detectChanges();
        });
    } else {
      ValuesUtility.toastMessage(this.messageService, 'info',
        'You have not made any changes to save the data.');
      this.valuesModel.valuesForm.markAsUntouched();
      this.valuesModel.valuesForm.markAsPristine();
      this.valuesModel.valuesForm.updateValueAndValidity();
      this.changeDetector.detectChanges();
    }
  }
  handleError(error: HttpErrorResponse) {
    if (!utils.isEmpty(error) && !utils.isEmpty(error.error.errors)) {
      this.messageService.clear();
      this.messageService.add({
        severity: 'error',
        summary: error.error.errors[0].errorType,
        detail: error.error.errors[0].errorMessage
      });
    }
  }
}
