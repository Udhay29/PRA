import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, RouterStateSnapshot } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { takeWhile } from 'rxjs/operators';
import * as moment from 'moment';
import * as utils from 'lodash';
import { HttpErrorResponse } from '@angular/common/http';

import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';
import { CreateChargesModel } from './models/create-charges.model';
import { CreateChargesService } from './services/create-charges.service';
import { BusinessUnitList, ChargeApplicationLevelType, ChargeApplicationLevelTypeList, ChargeUsageType,
  ChargeUsageTypeList, PayloadFinanceBusinessUnitServiceOfferingAssociation,
  RateType, RateTypeList, ServiceOfferingBusinessUnitTransitModeAssociation,
  ServiceOfferingCode } from './models/create-charges.interface';
import { ChargesModel } from './../models/charges.model';

@Component({
  selector: 'app-create-charges',
  templateUrl: './create-charges.component.html',
  styleUrls: ['./create-charges.component.scss'],
  providers: [CreateChargesService],
})
export class CreateChargesComponent implements OnDestroy, OnInit {
  createChargesModel: CreateChargesModel;

  @Input() chargesComponentModel: ChargesModel;
  @Output() closeCreateCharge: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private readonly formBuilder: FormBuilder, private readonly messageService: MessageService,
    private readonly createChargesService: CreateChargesService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly shared: BroadcasterService, private readonly router: Router) {
    this.createChargesModel = new CreateChargesModel();
  }

  ngOnInit() {
    this.createChargesFormInitialization();
    this.setDefaultValues();
    this.populateInputFields();
    this.navigationSubscription();
    this.saveSubscription();
    this.onChanges();
    this.setErrorField();
  }
  ngOnDestroy() {
    this.createChargesModel.subscriberFlag = false;
  }
  onChangeChargeType(event) {
    if (event && event['value'] === 'Associate Charge') {
      this.createChargesModel.associateChargeFlag = true;
      this.createChargesModel.createChargeCodeReqParam['quantityRequiredIndicator'] = 'N';
      this.createChargesModel.createChargeCodeReqParam['autoInvoiceIndicator'] = 'Y';
      this.setAssociateChargeValidators(true);
    } else {
      this.createChargesModel.associateChargeFlag = false;
      this.restoreDefaultPayloadValues();
      this.createChargesModel.associateChargeMandatoryFields.forEach((control: string) => {
        this.createChargesModel.createChargesForm.controls[control].markAsUntouched();
        this.createChargesModel.createChargesForm.controls[control].setValidators(null);
        this.createChargesModel.createChargesForm.controls[control].updateValueAndValidity();
      });
    }
  }
  onChangeBusinessUnit(event) {
    if (event && event['value']) {
      this.populateServiceOffering(event['value']);
    }
  }
  onChangeServiceOffering(event) {
    this.createChargesModel.createChargeCodeReqParam['financeBusinessUnitServiceOfferingAssociations'] = [];
    if (event && event['value'] && event['value'].length > 0) {
      event['value'].forEach((code: PayloadFinanceBusinessUnitServiceOfferingAssociation) => {
        this.createChargesModel.createChargeCodeReqParam['financeBusinessUnitServiceOfferingAssociations'].push(code);
      });
    } else {
      this.createChargesModel.createChargeCodeReqParam['financeBusinessUnitServiceOfferingAssociations'] = [];
    }
  }
  onChangeRateType(event) {
    if (event && event['value']) {
      this.createChargesModel.createChargeCodeReqParam['rateTypes'] = event['value'];
    }
  }
  onSelectUsageType(event) {
    if (event && event['value']) {
      this.createChargesModel.createChargeCodeReqParam['chargeUsageType'] = {
        'chargeUsageTypeID': event['label'],
        'chargeUsageTypeName': event['value']
      };
    }
  }
  onChangeCheckboxList(event, field: string) {
    switch (field) {
      case 'Quantity Required':
        this.createChargesModel.createChargeCodeReqParam['quantityRequiredIndicator'] = (event) ? 'Y' : 'N';
        break;
      case 'Auto Invoice':
        this.createChargesModel.createChargeCodeReqParam['autoInvoiceIndicator'] = (event) ? 'Y' : 'N';
        break;
      default:
        break;
    }
  }
  onDateSelected(event, dateField: string) {
    const date = event;
    this.checkIsValidDateRange();
    this.setDateFieldErrors();
    switch (dateField) {
      case 'effectiveDate':
        this.createChargesModel.createChargeCodeReqParam['effectiveDate'] = new Date(date).toISOString().split('T')[0];
        this.createChargesModel.effectiveMinDate = new Date(date);
        this.createChargesModel.disabledExpDatesList = [new Date(date)];
        break;
      case 'expirationDate':
        this.createChargesModel.createChargeCodeReqParam['expirationDate'] = new Date(date).toISOString().split('T')[0];
        this.createChargesModel.effectiveMaxDate = new Date(date);
        this.createChargesModel.disabledEffDatesList = [new Date(date)];
        break;
      default:
        break;
    }
  }
  onTypeDate(event, dateField: string) {
    const regex: any = new RegExp('^(1[0-2]|0[1-9])/(3[01]|[12][0-9]|0[1-9])/[0-9]{4}$');
    switch (dateField) {
      case 'effectiveDate':
        if (event.srcElement['value'] && regex.test(event.srcElement['value'].trim())) {
          const effDate = new Date(event.srcElement['value']);
          this.createChargesModel.createChargesForm.controls['effectiveDate'].setValue(effDate);
          this.onDateSelected(event.srcElement['value'], 'effectiveDate');
        }
        break;
      case 'expirationDate':
        if (event.srcElement['value'] && regex.test(event.srcElement['value'].trim())) {

          const effDate = new Date(event.srcElement['value']);
          this.createChargesModel.createChargesForm.controls['expirationDate'].setValue(effDate);
          this.onDateSelected(event.srcElement['value'], 'expirationDate');
        }
        break;
      default:
        break;
    }
  }
  onClearDropDown(control: string) {
    if (control === 'applicationLevel') {
      this.createChargesModel.createChargesForm.controls['applicationLevel'].setValue('');
    } else if (control === 'usage') {
      this.createChargesModel.createChargesForm.controls['usage'].setValue('');
    }
  }
  onClickClose() {
    this.createChargesModel.createChargesForm.controls['chargeType'].markAsPristine();
    if (this.createChargesModel.createChargesForm.dirty && this.createChargesModel.createChargesForm.touched) {
      this.createChargesModel.isCancelClicked = true;
    } else {
      this.onPopupYes(false);
    }
  }
  onClickSaveCharge() {
    this.messageService.clear();
    this.changeDetector.detectChanges();
    this.setMandatoryValidation();
    if (this.createChargesModel.associateChargeFlag) {
      if (utils.isEmpty(this.createChargesModel.createChargesForm.controls.businessUnit['value'])) {
        const message = 'Please select at least one Business Unit as "Associate Charges" option has been chosen';
        this.toastMessage(this.messageService, 'error', message);
      } else if (utils.isEmpty(this.createChargesModel.createChargesForm.controls.serviceOffering['value'])) {
          const message = 'Please select at least one service offering as "Associate Charges" option has been chosen';
          this.toastMessage(this.messageService, 'error', message);
      }
    }
    if (this.createChargesModel.createChargesForm.valid) {
      this.setRequestParam();
      this.createChargesService.postChargeCode(this.createChargesModel.createChargeCodeReqParam)
        .pipe(takeWhile(() => this.createChargesModel.subscriberFlag))
        .subscribe((response: any) => {
          const successMessage = `You have created Charge (${
            this.createChargesModel.createChargesForm.controls.chargeIdentifier['value']})`;
          this.messageService.add({ severity: 'success', summary: 'Charge Created', detail: successMessage });
          this.onPopupYes(true);
        }, (error: HttpErrorResponse) => {
          this.handleError(error);
          this.changeDetector.detectChanges();
        });
    } else {
      this.chargesComponentModel.isChangesSaving = false;
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'You have to fill all mandatory fields' });
      this.changeDetector.detectChanges();
    }
  }
  handleError(error) {
    if (!utils.isEmpty(error.error) && !utils.isEmpty(error.error.errors)) {
      this.messageService.clear();
      this.messageService.add({
        severity: 'error',
        summary: error.error.errors[0].errorType,
        detail: error.error.errors[0].errorMessage
      });
    }
  }
  onSelectApplicationLevel(event) {
    this.createChargesModel.createChargeCodeReqParam['chargeApplicationLevelType'] = {
      'chargeApplicationLevelTypeID': event['label'],
      'chargeApplicationLevelTypeName': event['value']
    };
  }
  onPopupNo() {
    this.createChargesModel.isCancelClicked = false;
  }
  onPopupYes(shouldSave: boolean) {
    this.createChargesModel.isCancelClicked = false;
    this.createChargesModel.associateChargeFlag = false;
    this.closeCreateCharge.emit(shouldSave);
    this.createChargesModel.createChargesForm.reset();
    this.createChargesModel.createChargesForm.markAsUntouched();
    this.createChargesModel.createChargesForm.markAsPristine();
    this.createChargesModel.createChargesForm.updateValueAndValidity();
    this.setDefaultValues();
  }
  navigationSubscription() {
    const subscription = this.shared.on<RouterStateSnapshot>('navigationStarts').subscribe((value: RouterStateSnapshot) => {
      const data = {
        key: (!this.createChargesModel.createChargesForm.dirty) ? true : false,
        message: 'You are about to lose all the changes. Do you want to proceed?'
      };
      this.shared.broadcast('saved', data);
      this.createChargesModel.routeUrl = value.url;
      if (subscription) {
        subscription.unsubscribe();
      }
      this.changeDetector.detectChanges();
    });
  }
  onChanges() {
    this.createChargesModel.createChargesForm.valueChanges.subscribe(val => {
      if (this.chargesComponentModel.isChangesSaving && this.createChargesModel.createChargesForm.dirty) {
        this.chargesComponentModel.isChangesSaving = false;
      }
    });
  }
  saveSubscription() {
    const subscription = this.shared.on<boolean>('needToSaveCreateCharges').subscribe((value: boolean) => {
      if (value) {
        this.onClickSaveCharge();
      } else {
        this.router.navigate([this.createChargesModel.routeUrl]);
        if (subscription) {
          subscription.unsubscribe();
        }
      }
    });
  }
  setErrorField() {
    const subscription = this.shared.on<boolean>('setErrorsNull').subscribe((value: boolean) => {
      if (value) {
        this.createChargesModel.createChargesForm.controls['chargeIdentifier'].setErrors(null);
        this.createChargesModel.createChargesForm.controls['chargeName'].setErrors(null);
      }
    });
  }
  createChargesFormInitialization() {
    this.createChargesModel.createChargesForm = this.formBuilder.group({
      chargeIdentifier: ['', Validators.required],
      chargeName: ['', Validators.required],
      chargeDescription: [''],
      chargeType: [''],
      businessUnit: [''],
      serviceOffering: [''],
      rateType: [''],
      applicationLevel: [''],
      usage: [''],
      effectiveDate: [''],
      expirationDate: [''],
    });
  }
  getBusinessUnitList() {
    this.createChargesService.getBusinessUnit().pipe(takeWhile(() => this.createChargesModel.subscriberFlag))
      .subscribe((response: BusinessUnitList) => {
        const businessUnits = response['_embedded']['serviceOfferingBusinessUnitTransitModeAssociations'];
        businessUnits.forEach((element: ServiceOfferingBusinessUnitTransitModeAssociation) => {
          this.createChargesModel.businessUnitList.push({
            label: element['financeBusinessUnitServiceOfferingAssociation']['financeBusinessUnitCode'],
            value: element['financeBusinessUnitServiceOfferingAssociation']['financeBusinessUnitCode']
          });
        });
        this.changeDetector.detectChanges();

      }, (error: Error) => {
        this.toastMessage(this.messageService, 'error', error.message);
      });
  }
  getApplicationLevels() {
    const currentDate = this.getCurrentDate();
    this.createChargesService.getApplicationLevelTypes(currentDate).pipe(takeWhile(() => this.createChargesModel.subscriberFlag))
      .subscribe((response: ChargeApplicationLevelTypeList) => {
        const applicationLevelTypes = response['_embedded']['chargeApplicationLevelTypes'];
        applicationLevelTypes.forEach((type: ChargeApplicationLevelType) => {
          this.createChargesModel.applicationLevels.push({
            label: type['chargeApplicationLevelTypeID'],
            value: type['chargeApplicationLevelTypeName']
          });
        });
        this.changeDetector.detectChanges();

      },
        (error: Error) => {
          this.toastMessage(this.messageService, 'error', error.message);
        });
  }
  getApplicationLevelTypeList(event) {
    this.createChargesModel.applicationTypeLevelList = [];
    this.createChargesModel.applicationLevels.forEach((element) => {
      if (element.value && element.value.toString().toLowerCase().indexOf(event['query'].toLowerCase()) > -1) {
        this.createChargesModel.applicationTypeLevelList.push({
          label: element.label,
          value: element.value
        });
      }
    });
  }
  getUsage() {
    const currentDate = this.getCurrentDate();
    this.createChargesService.getUsage(currentDate).pipe(takeWhile(() => this.createChargesModel.subscriberFlag))
      .subscribe((response: ChargeUsageTypeList) => {
        const usageTypes = response['_embedded']['chargeUsageTypes'];
        usageTypes.forEach((type: ChargeUsageType) => {
          this.createChargesModel.usageList.push({
            label: type['chargeUsageTypeID'],
            value: type['chargeUsageTypeName']
          });
        });
        this.changeDetector.detectChanges();

      },
        (error: Error) => {
          this.toastMessage(this.messageService, 'error', error.message);
        });
  }
  getUsageList(event) {
    this.createChargesModel.usageListValues = [];
    this.createChargesModel.usageList.forEach((element) => {
      if (element.value && element.value.toString().toLowerCase().indexOf(event['query'].toLowerCase()) > -1) {
        this.createChargesModel.usageListValues.push({
          label: element.label,
          value: element.value
        });
      }
    });
  }
  getRateTypesList() {
    this.createChargesService.getRateTypes().pipe(takeWhile(() => this.createChargesModel.subscriberFlag))
      .subscribe((response: RateTypeList) => {
        const rateTypes = response['_embedded']['rateTypes'];
        rateTypes.forEach((type: RateType) => {
          this.createChargesModel.rateTypeList.push({
            label: type['rateTypeName'],
            value: {
              'rateTypeId': type['rateTypeId'],
              'rateTypeName': type['rateTypeName']
            }
          });
        });
        this.changeDetector.detectChanges();

      },
        (error: Error) => {
          this.toastMessage(this.messageService, 'error', error.message);
        });
  }
  populateInputFields() {
    this.getBusinessUnitList();
    this.getApplicationLevels();
    this.getUsage();
    this.getRateTypesList();
  }
  populateServiceOffering(businessUnitSelected: string[]) {
    const serviceOfferingArray = [];
    const selectedServiceOfferingArray = [];
    this.createChargesModel.serviceOfferingList = [];
    businessUnitSelected.forEach((bu: string) => {
      if (!utils.isEmpty(this.createChargesModel.createChargeCodeReqParam['financeBusinessUnitServiceOfferingAssociations'])) {
        const existingArray = utils.filter(this.createChargesModel.
          createChargeCodeReqParam['financeBusinessUnitServiceOfferingAssociations'],
          { 'financeBusinessUnitCode': bu });
        if (!utils.isEmpty(existingArray)) {
          existingArray.forEach(element => {
            serviceOfferingArray.push(element);
          });
        }
      }
      if (!utils.isEmpty(this.createChargesModel.createChargesForm.controls.serviceOffering)) {
        const selectedArray = utils.filter(this.createChargesModel.createChargesForm.controls.serviceOffering.value,
          { 'financeBusinessUnitCode': bu });
        if (!utils.isEmpty(selectedArray)) {
          selectedArray.forEach(element => {
            selectedServiceOfferingArray.push(element);
          });
        }
      }
      this.createChargesService.getServiceOffering(bu).pipe(takeWhile(() => this.createChargesModel.subscriberFlag))
        .subscribe((response: ServiceOfferingCode[]) => {
          response.forEach((element: ServiceOfferingCode) => {
            const buSo = `${element['financeBusinessUnitCode']} - ${element['serviceOfferingCode']}`;
            this.createChargesModel.serviceOfferingList.push({
              label: buSo,
              value: {
                'financeBusinessUnitServiceOfferingAssociationID': null,
                'financeBusinessUnitCode': element['financeBusinessUnitCode'],
                'serviceOfferingCode': element['serviceOfferingCode'],
              }
            });
          });
          this.createChargesModel.serviceOfferingList = utils.orderBy(this.createChargesModel.serviceOfferingList, ['label'], ['asc']);
          this.createChargesModel.serviceOfferingList = utils.uniq(this.createChargesModel.serviceOfferingList);
          this.changeDetector.detectChanges();

        }, (error: Error) => {
          this.toastMessage(this.messageService, 'error', error.message);
        });
    });
    this.createChargesModel.createChargeCodeReqParam['financeBusinessUnitServiceOfferingAssociations'] = serviceOfferingArray;
    this.createChargesModel.createChargesForm.controls['serviceOffering'].setValue(selectedServiceOfferingArray);
  }

  restoreDefaultPayloadValues() {
    this.createChargesModel.createChargeCodeReqParam['financeBusinessUnitServiceOfferingAssociations'] = [];
    this.createChargesModel.createChargeCodeReqParam['rateTypes'] = [];
    this.createChargesModel.createChargeCodeReqParam['chargeUsageType'] = null;
    this.createChargesModel.createChargeCodeReqParam['chargeApplicationLevelType'] = null;
    this.createChargesModel.createChargeCodeReqParam['quantityRequiredIndicator'] = null;
    this.createChargesModel.createChargeCodeReqParam['autoInvoiceIndicator'] = null;
    this.createChargesModel.createChargeCodeReqParam['effectiveDate'] = null;
    this.createChargesModel.createChargeCodeReqParam['expirationDate'] = null;
  }
  setDefaultValues() {
    this.createChargesModel.checkBoxValue = [];
    this.createChargesModel.createChargesForm.controls['chargeType'].setValue('Unassociate Charge');
    this.createChargesModel.checkBoxValue.push('Auto Invoice');
  }
  setMandatoryValidation() {
    this.createChargesModel.mandatoryFields.forEach((control: string) => {
      this.createChargesModel.createChargesForm.controls[control].markAsTouched();
    });
    if (this.createChargesModel.createChargesForm.controls['chargeType'].value === 'Associate Charge') {
      this.setAssociateChargeValidators();
    }
  }
  setAssociateChargeValidators(isAssociateChargeClicked?: boolean) {
    this.createChargesModel.associateChargeMandatoryFields.forEach((control: string) => {
      this.createChargesModel.createChargesForm.controls[control].setValidators(Validators.required);
      if (isAssociateChargeClicked) {
        this.createChargesModel.createChargesForm.controls[control].markAsUntouched();
      } else {
        this.createChargesModel.createChargesForm.controls[control].markAsTouched();
      }
      this.createChargesModel.createChargesForm.controls[control].updateValueAndValidity();
    });
  }
  setRequestParam() {
    this.createChargesModel.createChargeCodeReqParam['chargeType'] = {
      'chargeTypeCode': this.createChargesModel.createChargesForm.controls.chargeIdentifier['value'],
      'chargeTypeName': this.createChargesModel.createChargesForm.controls.chargeName['value'],
      'chargeTypeDescription': this.createChargesModel.createChargesForm.controls.chargeDescription['value']
    };
  }
  toastMessage(messageService: MessageService, key: string, data: string) {
    const message = {
      severity: key,
      summary: (key === 'error') ? 'Error' : 'Success',
      detail: data
    };
    messageService.clear();
    messageService.add(message);
  }
  getCurrentDate(): any {
    const dateFormat = 'YYYY-MM-DD';
    return `${moment(new Date()).format(dateFormat)}`;
  }
  checkIsValidDateRange() {
    if (this.createChargesModel.createChargesForm.controls['effectiveDate']['value'] &&
      this.createChargesModel.createChargesForm.controls['expirationDate']['value']) {
      this.createChargesModel.invalidDateFlag = (this.createChargesModel.createChargesForm.controls['effectiveDate']['value'] >=
        this.createChargesModel.createChargesForm.controls['expirationDate'].value.setHours(0, 0, 0, 0));
    } else {
      this.createChargesModel.invalidDateFlag = false;
    }
  }
  setDateFieldErrors() {
    if (this.createChargesModel.invalidDateFlag) {
      this.createChargesModel.createChargesForm.controls['effectiveDate'].setErrors({ invalid: true });
      this.createChargesModel.createChargesForm.controls['expirationDate'].setErrors({ invalid: true });
    } else {
      this.createChargesModel.createChargesForm.controls['effectiveDate'].setErrors(null);
      this.createChargesModel.createChargesForm.controls['expirationDate'].setErrors(null);
    }
  }
}
