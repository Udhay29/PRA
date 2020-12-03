import { takeWhile } from 'rxjs/operators';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import * as utils from 'lodash';
import { MessageService } from 'primeng/components/common/messageservice';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Validation } from '../../../../shared/jbh-app-services/validation';
import { CanDeactivateGuardService } from '../../../../shared/jbh-app-services/can-deactivate-guard.service';

import { BusinessDefaultValueModel } from './model/business-default-value.model';
import { BusinessService } from './../service/business.service';
import { ConfigurationDetail, ConfigurationParameterDetailDTOsItem, ControlValueMatch } from './../model/business.interface';
@Component({
  selector: 'app-business-default-values',
  templateUrl: './business-default-values.component.html',
  styleUrls: ['./business-default-values.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusinessDefaultValuesComponent implements OnInit, OnDestroy {
  defaultValueModel: BusinessDefaultValueModel;
  constructor(private readonly formBuilder: FormBuilder, private readonly service: BusinessService,
    private readonly changeDetector: ChangeDetectorRef, private readonly messageService: MessageService,
    private readonly router: Router) {
    this.defaultValueModel = new BusinessDefaultValueModel();
  }
  /** ngOnInit life cycle hook of BusinessDefaultValuesComponent
   * @memberof BusinessDefaultValuesComponent */
  ngOnInit() {
    this.createForm();
    this.getDefaultValues();
  }
  /** ngOnDestroy life cycle hook of BusinessDefaultValuesComponent
   * @memberof BusinessDefaultValuesComponent */
  ngOnDestroy() {
    this.defaultValueModel.isSubscribe = false;
  }

  canDeactivate(component: CanDeactivateGuardService, route: ActivatedRouteSnapshot, state: RouterStateSnapshot,
    nextState: RouterStateSnapshot): Observable<boolean> | boolean {
    this.defaultValueModel.routingUrl = nextState.url;
    if (this.defaultValueModel.defaultValuesForm.dirty) {
      this.defaultValueModel.isPopupVisible = true;
    } else {
      this.defaultValueModel.isChangesSaving = true;
    }
    this.changeDetector.detectChanges();
    return this.defaultValueModel.isChangesSaving;
  }
  /** function to create form controls with validation
   * @memberof BusinessDefaultValuesComponent */
  createForm() {
    this.defaultValueModel.defaultValuesForm = this.formBuilder.group({
      superUserBackDate: [null, [Validators.required, Validation.numbersOnly]],
      superUserFutureDate: [null, [Validators.required, Validation.numbersOnly]],
      superUserDaysAllowed: [null, [Validators.required, Validation.numbersOnly]],
      userBackDate: [null, [Validators.required, Validation.numbersOnly]],
      userFutureDate: [null, [Validators.required, Validation.numbersOnly]],
      userDaysAllowed: [null, [Validators.required, Validation.numbersOnly]]
    });
  }
  /** function to fetch default values
   * @memberof BusinessDefaultValuesComponent */
  getDefaultValues() {
    this.defaultValueModel.isPageLoading = true;
    this.service.getConfigurationValues().pipe(takeWhile(() => this.defaultValueModel.isSubscribe))
      .subscribe((configuration: ConfigurationDetail) => {
        this.defaultValueModel.isPageLoading = false;
        if (!utils.isEmpty(configuration) && !utils.isEmpty(configuration.configurationParameterDetailDTOs)) {
          this.defaultValueModel.fetchedValues = configuration.configurationParameterDetailDTOs;
          this.findValues(configuration.configurationParameterDetailDTOs);
          this.defaultValueModel.patchedValues = this.defaultValueModel.defaultValuesForm.value;
          this.changeDetector.detectChanges();
        }
      }, (error: Error) => {
        this.defaultValueModel.isPageLoading = false;
        this.changeDetector.detectChanges();
      });
  }
  /** function to find the form control to set the initial values
   * @param {ConfigurationParameterDetailDTOsItem[]} configuration
   * @memberof BusinessDefaultValuesComponent */
  findValues(configuration: ConfigurationParameterDetailDTOsItem[]) {
    utils.forEach(this.defaultValueModel.controlMatchList, (controlMatchItem: ControlValueMatch) => {
      const matchObject = utils.find(configuration, ['configurationParameterName', controlMatchItem.fieldName]);
      if (matchObject) {
        this.defaultValueModel.defaultValuesForm['controls'][controlMatchItem.controlName]
          .setValue(matchObject.configurationParameterValue.trim());
      }
    });
  }
  /** function called when cancel button is clicked
   * @memberof BusinessDefaultValuesComponent */
  onCancel() {
    this.router.navigate(['/settings']);
  }
  /** function to check value changes on save click
   * @memberof BusinessDefaultValuesComponent */
  onSave() {
    const isChanged = utils.isMatch(this.defaultValueModel.patchedValues, this.defaultValueModel.defaultValuesForm.value);
    if (this.defaultValueModel.defaultValuesForm.dirty && !isChanged) {
      this.checkValidFields();
    } else {
      this.toastMessage('info', 'No Changes Found', 'You have not made any changes to save the data');
    }
  }
  /** function to check formcontrol as valid
   * @memberof BusinessDefaultValuesComponent */
  checkValidFields() {
    if (this.defaultValueModel.defaultValuesForm.valid) {
      this.saveChanges();
    } else {
      utils.forIn(this.defaultValueModel.defaultValuesForm.controls, (value: FormControl, name: string) => {
        this.defaultValueModel.defaultValuesForm.controls[name].markAsTouched();
      });
      this.toastMessage('error', 'Missing Required Information',
        'Provide the required information in the highlighted fields and submit the form again');
    }
  }
  /** function to make http call to save the changes
   * @memberof BusinessDefaultValuesComponent */
  saveChanges() {
    this.defaultValueModel.isPageLoading = true;
    const param = { configurationParameterDetailDTOs: this.createRequestParam() };
    this.service.saveConfigurationValues(param).pipe(takeWhile(() => this.defaultValueModel.isSubscribe)).subscribe((data) => {
      this.defaultValueModel.isPageLoading = false;
      if (data) {
        this.toastMessage('success', 'Business Settings Edited', 'You have edited business settings successfully');
        this.getDefaultValues();
        this.defaultValueModel.defaultValuesForm.markAsPristine();
        this.changeDetector.detectChanges();
      }
    }, (error: Error) => {
      if (!utils.isEmpty(error['error']) && !utils.isEmpty(error['error']['errors'])
      && error['error']['errors'].length > 0 &&  error['error']['errors'][0].code === 'CONCURRENCY_UPDATE_EXCEPTION') {
      this.getDefaultValues();
      }
      this.defaultValueModel.isPageLoading = false;
      this.changeDetector.detectChanges();
    });
  }

  createRequestParam(): ConfigurationParameterDetailDTOsItem[] {
    const requestParam = [];
    utils.forEach(this.defaultValueModel.controlMatchList, (controlMatchItem: ControlValueMatch) => {
      const matchedObject = utils.find(this.defaultValueModel.fetchedValues, ['configurationParameterName', controlMatchItem.fieldName]);
      if (matchedObject && matchedObject.configurationParameterValue !==
        this.defaultValueModel.defaultValuesForm.controls[controlMatchItem.controlName].value.trim()) {
        matchedObject.configurationParameterValue =
          utils.toString(this.defaultValueModel.defaultValuesForm.controls[controlMatchItem.controlName].value.trim());
        requestParam.push(matchedObject);
      }
    });
    return requestParam;
  }
  /** function to display toast message based on error, success or warning
   * @param {string} type
   * @param {string} title
   * @param {string} detail
   * @memberof BusinessDefaultValuesComponent */
  toastMessage(type: string, title: string, detail: string) {
    this.messageService.clear();
    this.messageService.add({
      severity: type,
      summary: title,
      detail
    });
  }
  /** function called when no is clicked in the popup
   * @memberof BusinessDefaultValuesComponent */
  onPopupCancel() {
    this.defaultValueModel.isPopupVisible = false;
  }
  /** function called when yes is clicked in the popup
   * @memberof BusinessDefaultValuesComponent */
  onPopupProceed() {
    this.defaultValueModel.isPopupVisible = false;
    this.defaultValueModel.defaultValuesForm.markAsPristine();
    this.router.navigate([this.defaultValueModel.routingUrl]);
  }
}
