import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';

import { CanDeactivateGuardService } from '../../../../shared/jbh-app-services/can-deactivate-guard.service';
import { DefaultRatingRuleModel } from './model/default-rating-rule-model';
import { DefaultRatingRuleService } from './service/default-rating-rule.service';
import { DefaultRatingRuleUtilityService } from './service/default-rating-rule-utility.service';
import { ConfigurationViewDTO, EditValue, RootObject, RuleCriteriaObject } from './model/default-rating-rule.interface';


@Component({
  selector: 'app-default-rating-rule',
  templateUrl: './default-rating-rule.component.html',
  styleUrls: ['./default-rating-rule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DefaultRatingRuleComponent implements OnInit, OnDestroy {
  defaultRatingModel: DefaultRatingRuleModel;
  constructor(private readonly defaultRatingRule: DefaultRatingRuleService,
     private readonly changeDetector: ChangeDetectorRef, private readonly router: Router,
    private readonly messageService: MessageService, private readonly formBuilder: FormBuilder) {
  this.defaultRatingModel = new DefaultRatingRuleModel();
}

  ngOnInit() {
    this.defaultRatingModel.defaultRatingForm = DefaultRatingRuleUtilityService.getFormControls(this.formBuilder);
    this.populateDefaultRatingRule();
  }

  ngOnDestroy() {
    this.defaultRatingModel.isSubscriberFlag = false;
  }

  canDeactivate(component: CanDeactivateGuardService, route: ActivatedRouteSnapshot, state: RouterStateSnapshot,
    nextState: RouterStateSnapshot): Observable<boolean> | boolean {
    this.defaultRatingModel.routingUrl = nextState.url;
    DefaultRatingRuleUtilityService.setRadiusAndEffDate(this.defaultRatingModel);
    if (this.defaultRatingModel.defaultRatingForm.value.radius) {
      this.defaultRatingModel.defaultRatingForm.value.radius = Number(this.defaultRatingModel.defaultRatingForm.value.radius);
    }
    DefaultRatingRuleUtilityService.attrChangeCheck(this.defaultRatingModel);
    if (!this.defaultRatingModel.isChangesSaving && this.defaultRatingModel.defaultRatingForm.dirty && this.defaultRatingModel.isEditFlag &&
       (this.defaultRatingModel.requestParam.attributeChanged || this.defaultRatingModel.effectiveDateChangedCheck ||
         !this.defaultRatingModel.defaultRatingForm.valid)) {
      this.defaultRatingModel.isPopupVisible = true;
    } else {
      this.defaultRatingModel.isChangesSaving = true;
    }
    this.changeDetector.detectChanges();
    return this.defaultRatingModel.isChangesSaving;
  }

  onClickDontSave() {
    this.defaultRatingModel.isPopupVisible = false;
    this.defaultRatingModel.isChangesSaving = true;
    this.router.navigate([this.defaultRatingModel.routingUrl]);
  }

  onClickSave() {
    this.defaultRatingModel.isPopupVisible = false;
    this.defaultRatingModel.isChangesSaving = true;
    this.onSave();
  }

  onClose() {
    DefaultRatingRuleUtilityService.setRadiusAndEffDate(this.defaultRatingModel);
    if (this.defaultRatingModel.defaultRatingForm.value.radius) {
      this.defaultRatingModel.defaultRatingForm.value.radius = Number(this.defaultRatingModel.defaultRatingForm.value.radius);
    }
    DefaultRatingRuleUtilityService.attrChangeCheck(this.defaultRatingModel);
    if (!this.defaultRatingModel.isChangesSaving && this.defaultRatingModel.defaultRatingForm.dirty && this.defaultRatingModel.isEditFlag &&
       (this.defaultRatingModel.requestParam.attributeChanged || this.defaultRatingModel.effectiveDateChangedCheck)
        || !this.defaultRatingModel.defaultRatingForm.valid) {
      this.defaultRatingModel.isSaveChanges = true;
    } else {
      this.onDontSave();
    }
  }
  onHidePop(keyName: string) {
    this.defaultRatingModel[keyName] = false;
  }
  onDontSave() {
     this.populateDefaultRatingRule();
    this.defaultRatingModel.isSaveChanges = false;
    this.defaultRatingModel.isEditFlag = false;
    this.defaultRatingModel.defaultRatingForm.reset();
  }

  populateDefaultRatingRule(errorFlag?: Boolean) {
    this.defaultRatingModel.isPageLoading = true;
    this.defaultRatingRule.getPopulateData().pipe(takeWhile(() => this.defaultRatingModel.isSubscriberFlag)).
      subscribe((data: RootObject) => {
        this.defaultRatingModel.isPageLoading = false;
        if (!utils.isEmpty(data)) {
          this.defaultRatingModel.populateData = data;
          this.defaultRatingModel.customerRatingRuleID = data.customerRatingRuleID;
          DefaultRatingRuleUtilityService.formatData(this.defaultRatingModel);
          this.defaultRatingModel.editData = DefaultRatingRuleUtilityService.formatEditData(this.defaultRatingModel);
          if (errorFlag) {
            this.onEditClick();
          }
          this.changeDetector.detectChanges();
        }
      }, (error: Error) => {
        this.defaultRatingModel.isPageLoading = false;
        this.defaultRatingModel.populateData = null;
        DefaultRatingRuleUtilityService.toastMessage(this.messageService, 'error', error.message);
        this.changeDetector.detectChanges();
      });
  }

  getDefaultRatingRule() {
    this.defaultRatingModel.isPageLoading = true;
    this.defaultRatingRule.getRules().pipe(takeWhile(() => this.defaultRatingModel.isSubscriberFlag)).
    subscribe((data: RuleCriteriaObject) => {
      this.defaultRatingModel.isPageLoading = false;
      if (!utils.isEmpty(data) && !utils.isEmpty(data['_embedded']) && !utils.isEmpty(data['_embedded']['ruleCriterias'])) {
        this.defaultRatingModel.defaultRules = data['_embedded']['ruleCriterias'];
      }
      this.populateRadioFields();
      this.defaultRatingModel.patchedValues = this.defaultRatingModel.defaultRatingForm.value;
      this.changeDetector.detectChanges();
    }, (error: Error) => {
      this.defaultRatingModel.isPageLoading = false;
      this.defaultRatingModel.defaultRules = null;
      DefaultRatingRuleUtilityService.toastMessage(this.messageService, 'error', error.message);
      this.changeDetector.detectChanges();
    });
  }

   populateRadioFields() {
    utils.forEach(this.defaultRatingModel.editData, (data: EditValue) => {
      DefaultRatingRuleUtilityService.populateRadioFields(this.defaultRatingModel, data);
    });
  }

  saveData() {
    this.defaultRatingModel.isPageLoading = true;
    this.defaultRatingModel.isSaveChanges = false;
    this.defaultRatingRule.saveRules(this.defaultRatingModel.requestParam,
       this.defaultRatingModel.customerRatingRuleID).pipe(takeWhile(() => this.defaultRatingModel.isSubscriberFlag)).
      subscribe((data: any) => {
        this.saveDataSuccess();
      }, (error: HttpErrorResponse) => {
        this.defaultRatingModel.isPageLoading = false;
        this.defaultRatingModel.isChangesSaving = false;
        if (error.status === 409) {
          const errorData = 'Data has already been updated; please refresh to continue';
          DefaultRatingRuleUtilityService.toastMessage(this.messageService, 'error', errorData);
          this.defaultRatingModel.defaultRatingForm.markAsUntouched();
          this.populateDefaultRatingRule(true);
        } else {
        const errorData = (error && error.error && error.error.errors && error.error.errors.length > 0 &&
           error.error.errors[0].errorMessage) ? error.error.errors[0].errorMessage : error.message;
        DefaultRatingRuleUtilityService.toastMessage(this.messageService, 'error', errorData);
        }
        this.changeDetector.detectChanges();
      });
 }
 saveDataSuccess() {
  this.defaultRatingModel.isPageLoading = false;
  this.defaultRatingModel.isEditFlag = false;
  this.defaultRatingModel.isChangesSaving = false;
  this.removeDrity(this.defaultRatingModel.defaultRatingForm);
  DefaultRatingRuleUtilityService.toastMessage(this.messageService, 'success',
   'You have saved the default rating rule successfully');
  this.populateDefaultRatingRule();
 }
 removeDrity(form: FormGroup) {
    Object.keys(form.controls).forEach(control => {
      form.controls[control].markAsPristine();
    });
 }

  onEditClick() {
    this.defaultRatingModel.isEditFlag = true;
    this.getDefaultRatingRule();
    DefaultRatingRuleUtilityService.initialDate(this.defaultRatingModel);
    DefaultRatingRuleUtilityService.populateEffectiveDate(this.defaultRatingModel);
    this.onChangeOfCitySubstitution(this.defaultRatingModel.populateData.citySubstitutionIndicator === 'Y' ? true : false);
    DefaultRatingRuleUtilityService.populateRadiusValue(this.defaultRatingModel);
    DefaultRatingRuleUtilityService.formatRequestJson(this.defaultRatingModel);
    this.defaultRatingModel.defaultRatingForm.updateValueAndValidity();
  }

  onChangeOfCitySubstitution(event: boolean) {
    this.defaultRatingModel.isCheckBoxSelected = event;
    this.defaultRatingModel.city = this.defaultRatingModel.isCheckBoxSelected ? ['citySubstitution'] : [];
    if (event === true) {
      this.defaultRatingModel.defaultRatingForm.controls.radius.setValidators([Validators.required]);
      this.defaultRatingModel.requestParam.citySubstitutionIndicator = 'Y';
    } else {
      this.defaultRatingModel.defaultRatingForm.controls.radius.markAsUntouched();
      this.defaultRatingModel.defaultRatingForm.controls.radius.setValidators([]);
      this.defaultRatingModel.defaultRatingForm.controls.radius.updateValueAndValidity();
      this.defaultRatingModel.requestParam.citySubstitutionIndicator = 'N';
      this.defaultRatingModel.defaultRatingForm.controls.radius.setValue(null);
    }
  }

  onTypeDate(event: Event) {
    if (this.defaultRatingModel.defaultRatingForm.controls['effectiveDate'].value) {
      this.defaultRatingModel.inCorrectEffDateFormat = false;
      DefaultRatingRuleUtilityService.getValidDate(this.defaultRatingModel);
    }
    DefaultRatingRuleUtilityService.validateDateFormat(event, this.defaultRatingModel);
    DefaultRatingRuleUtilityService.setFormErrors(this.defaultRatingModel);
    this.dateValidation('defaultRatingForm', 'effectiveDate');
  }

  dateValidation(formName: string, effectiveDate: string) {
    const effDate = this.defaultRatingModel[formName].controls[effectiveDate].value;
    if (effDate) {
      this.defaultRatingModel[formName].controls[effectiveDate].setErrors(Validators.required);
    }
    this.defaultRatingModel[formName].controls[effectiveDate].updateValueAndValidity();
  }

  onRadioClick(index: number, name: string, id: number, value: string) {
    index = index + 1;
    utils.forEach(this.defaultRatingModel.requestParam.customerRatingRuleConfigurationInputDTOs , (requestData: ConfigurationViewDTO) => {
      if (index === requestData.ruleCriteriaID && value !== requestData.ruleCriteriaValueName) {
        requestData.ruleCriteriaName = name;
        requestData.ruleCriteriaValueID = id;
        requestData.ruleCriteriaValueName = value;
      }
    });
  }

  onSave() {
    if (this.defaultRatingModel.defaultRatingForm.value.radius) {
      this.defaultRatingModel.defaultRatingForm.value.radius = Number(this.defaultRatingModel.defaultRatingForm.value.radius);
    }
    const isChanged = utils.isMatch(this.defaultRatingModel.patchedValues, this.defaultRatingModel.defaultRatingForm.value);
    DefaultRatingRuleUtilityService.attrChangeCheck(this.defaultRatingModel);
    if (this.defaultRatingModel.defaultRatingForm.dirty && this.defaultRatingModel.defaultRatingForm.touched && !isChanged) {
      this.checkSaveValues();
    } else {
      DefaultRatingRuleUtilityService.warningMessage(this.messageService);
    }

  }

  checkSaveValues() {
    if (this.defaultRatingModel.defaultRatingForm.valid) {
      DefaultRatingRuleUtilityService.setRadiusAndEffDate(this.defaultRatingModel);
      this.saveData();
    } else {
      utils.forIn(this.defaultRatingModel.defaultRatingForm.controls, (value: FormControl, name: string) => {
      this.defaultRatingModel.defaultRatingForm.controls[name].markAsTouched();
      });
      this.messageService.clear();
      this.messageService.add({
        severity: 'error',
        summary: 'Missing Required Information',
        detail: 'Provide the required information in the highlighted fields and submit the form again'
      });
      this.defaultRatingModel.isSaveChanges = false;
      this.defaultRatingModel.isChangesSaving = false;
    }
  }
}
