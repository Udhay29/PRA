import { MessageService } from 'primeng/components/common/messageservice';
import { HttpErrorResponse, HttpResponseBase } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import * as utils from 'lodash';
import * as moment from 'moment';
import { takeWhile } from 'rxjs/operators';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, timer } from 'rxjs';

import { RatingRulesModel } from './model/rating-rules.model';
import { RatingsModel } from '../rating-rule/model/rating.model';
import { RatingRulesService } from './service/rating-rules.service';
import {
  RootObject, CanComponentDeactivate, SectionList,
  RatingRuleDetails, AgreementDetails, SaveRequest, AffiliationEvent, ContractsListItem, ContractTableFormat
} from './model/rating-rules.interface';
import { RatingRuleDetail } from '../rating-rule/model/rating.interface';
import { RatingRulesUtility } from './service/rating-rules-utility';
import { BroadcasterService } from '../../../shared/jbh-app-services/broadcaster.service';
import { Validation } from '../../../shared/jbh-app-services/validation';
import { LocalStorageService } from '../../../shared/jbh-app-services/local-storage.service';


@Component({
  selector: 'app-rating-rules',
  templateUrl: './rating-rules.component.html',
  styleUrls: ['./rating-rules.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatingRulesComponent implements OnInit, OnDestroy {
  ratingRulesModel: RatingRulesModel;
  ratingsModel: RatingsModel;
  ratingRuleId: number;
  ruleConfig: Object = {};
  constructor(
    private readonly service: RatingRulesService, private readonly formBuilder: FormBuilder, private readonly router: Router,
    private readonly changeDetector: ChangeDetectorRef, private messageService: MessageService, private shared: BroadcasterService,
    private readonly localStore: LocalStorageService) {
    this.ratingRulesModel = new RatingRulesModel();
    this.ratingsModel = new RatingsModel();
  }
  /** ngOnInit function of the rating rules component
   * @memberof RatingRulesComponent */
  ngOnInit() {
    this.createRatingRulesForm();
    this.subscribeDetails();
    this.getRatingRulesCriteria();
    if (!this.ratingRulesModel.ratingRuleEditFlag) {
      this.getBusinessUnitServiceOffering();
    }
    this.localStore.setItem('agreementDetails', 'create', 'Rating Rule', true);
  }
  /** ngOnDestroy function to unsubscribe the subscribed values on component destruction
   * @memberof RatingRulesComponent */
  ngOnDestroy() {
    this.ratingRulesModel.isSubscribe = false;
  }
  /** function to get the agreement id broadcasted from view-agreement-details component
   * @memberof RatingRulesComponent */
  subscribeDetails() {
    this.ratingRulesModel.isPageLoading = true;
    this.shared.on<RatingRuleDetails>('ratingruledetails').pipe(takeWhile(() => this.ratingRulesModel.isSubscribe))
      .subscribe((data: RatingRuleDetails) => {
        if (!utils.isEmpty(data)) {
          this.ratingRulesModel.isAgreementDefault = data.isAgreementDefault;
          this.ratingRulesModel.isShowOptional = this.ratingRulesModel.isAgreementDefault;
          this.ratingRulesModel.breadCrumbList[3].label = this.ratingRulesModel.isAgreementDefault ? 'Create Agreement Rating Rule' :
            'Create Rating Rule';
          RatingRulesUtility.setBusinessUnitValidation(this.ratingRulesModel);
          if (data.ratingRuleId) {
            this.ratingRuleId = data.ratingRuleId;
            this.ratingRulesModel.ratingRuleEditFlag = true;
            this.ratingRulesModel.breadCrumbList[3].label = this.ratingRulesModel.isAgreementDefault ?
              this.ratingRulesModel.editAgreementBreadCrumbValue : this.ratingRulesModel.editBreadCrumbValue;
          }
          this.getDetails(data);
        }
        this.changeDetector.detectChanges();
      });
  }
  /** function to get the agreement details with the agreement id subscribed using subscribeDetails function
   * @param {RatingRuleDetails} data
   * @memberof RatingRulesComponent */
  getDetails(data: RatingRuleDetails) {
    this.service.getAgreementDetails(data.agreementId).pipe(takeWhile(() => this.ratingRulesModel.isSubscribe))
      .subscribe((details: AgreementDetails) => {
        if (!this.ratingRuleId) {
          this.ratingRulesModel.isPageLoading = false;
        }
        if (!utils.isEmpty(details)) {
          this.ratingRulesModel.agreementDetails = details;
          this.ratingRulesModel.breadCrumbList[2].queryParams = { id: details.customerAgreementID };
          this.ratingRulesModel.ratingRulesForm.patchValue({
            effectiveDate: new Date(),
            expirationDate: new Date(details.expirationDate.replace(/-/g, '\/').replace(/T.+/, ''))
          });
          this.ratingRulesModel.effectiveMinDate = new Date(details.effectiveDate.replace(/-/g, '\/').replace(/T.+/, ''));
          this.ratingRulesModel.expirationMaxDate = new Date(details.expirationDate.replace(/-/g, '\/').replace(/T.+/, ''));
          this.onDateSelected(new Date(), 0);
          this.onDateSelected(new Date(details.expirationDate.replace(/-/g, '\/').replace(/T.+/, '')), 1);
          if (this.ratingRulesModel.ratingRuleEditFlag) {
            this.detailsFetch(this.ratingRuleId);
          }
        }
        this.changeDetector.detectChanges();
      }, (error) => {
        this.errorSceniarioInagreementDetails(error);
      });
  }
  errorSceniarioInagreementDetails(error) {
    this.ratingRulesModel.isPageLoading = false;
    this.ratingRulesModel.agreementDetails = null;
    RatingRulesUtility.toastMessage(this.messageService, 'error', 'Error', error['error'].errors[0].errorMessage);
    this.changeDetector.detectChanges();
  }
  canDeactivate(component: CanComponentDeactivate, route: ActivatedRouteSnapshot, state: RouterStateSnapshot,
    nextState: RouterStateSnapshot): Observable<boolean> | boolean {
    this.ratingRulesModel.routerUrl = nextState.url;
    if (this.ratingRulesModel.ratingRulesForm.pristine) {
      return true;
    } else {
      this.ratingRulesModel.isShowPopup = true;
      this.changeDetector.detectChanges();
      return false;
    }
  }
  /** function that creates formcontrols on component's ngOnInit
   * @memberof RatingRulesComponent */
  createRatingRulesForm() {
    this.ratingRulesModel.ratingRulesForm = this.formBuilder.group({
      effectiveDate: [null, Validators.required],
      expirationDate: [null],
      citySubstitution: [false],
      radius: [null],
      congestionCharge: ['On intermediate stops'],
      flatRate: ['Use published flat rate'],
      hazmatCharge: ['Placards not required to charge'],
      businessUnit: [null],
      affiliation: ['agreement'],
      selectedData: [this.ratingRulesModel.selectedList]
    });
  }
  /** function to disable effective and expiration dates based on date selected using calendar component
   * @param {Date} value * @param {number} key
   * @memberof RatingRulesComponent */
  onDateSelected(value: Date, key: number) {
    if (key === 0) {
      this.ratingRulesModel.ratingRulesForm.controls.effectiveDate.setErrors(null);
      this.ratingRulesModel.expirationMinDate = new Date(value);
      RatingRulesUtility.checkErrors('expirationDate', this.ratingRulesModel);
    } else {
      this.ratingRulesModel.ratingRulesForm.controls.expirationDate.setErrors(null);
      this.ratingRulesModel.effectiveMaxDate = new Date(value);
      RatingRulesUtility.checkErrors('effectiveDate', this.ratingRulesModel);
    }
    this.callContractList();
    this.callSectionList();
  }
  /** function to disable and validate date based on the date typed in the calendar's input field
   * @param {Event} event * @param {string} fieldName
   * @memberof RatingRulesComponent */
  onTypeDate(event, fieldName: string) {
    this.ratingRulesModel.isNotValidDate = false;
    this.ratingRulesModel.ratingRulesForm.controls['effectiveDate'].markAsTouched();
    this.ratingRulesModel.ratingRulesForm.controls['expirationDate'].markAsTouched();
    switch (fieldName) {
      case 'effective':
        if (this.ratingRulesModel.ratingRulesForm.controls['effectiveDate'].value) {
          this.ratingRulesModel.inCorrectEffDateFormat = false;
          this.onSelectEffDate();
          this.ratingRulesModel.expirationMinDate = new Date(this.ratingRulesModel.ratingRulesForm.controls['effectiveDate'].value);
        }
        break;
      case 'expiration':
        if (this.ratingRulesModel.ratingRulesForm.controls['expirationDate'].value) {
          this.ratingRulesModel.inCorrectExpDateFormat = false;
          RatingRulesUtility.onSelectExpDate(this.ratingRulesModel);
          this.ratingRulesModel.effectiveMaxDate = new Date(this.ratingRulesModel.ratingRulesForm.controls['expirationDate'].value);
        }
        break;
      default: break;
    }
    RatingRulesUtility.validateDateFormat(event, fieldName, this.ratingRulesModel);
    RatingRulesUtility.setFormErrors(this.ratingRulesModel);
    this.callContractList();
    this.callSectionList();
  }
  /** function to validate effective date and disable the previous dates
   * @memberof RatingRulesComponent */
  onSelectEffDate() {
    RatingRulesUtility.getValidDate(this.ratingRulesModel);
  }
  /** function to show/hide radius input field and set validators based on city substitution checkbox value change
   * @param {boolean} substitutionValue
   * @memberof RatingRulesComponent */
  onCitySubstitutionChange(substitutionValue: boolean) {
    this.ratingRulesModel.isShowRadius = substitutionValue;
    const validation = substitutionValue ? [Validators.required, Validation.numbersOnly] : null;
    if (!this.ratingRulesModel.ratingRuleEditFlag || !substitutionValue) {
      this.ratingRulesModel.ratingRulesForm.controls['radius'].reset();
    }
    this.ratingRulesModel.ratingRulesForm.controls['radius'].setValidators(validation);
    this.ratingRulesModel.ratingRulesForm.controls['radius'].updateValueAndValidity();
  }
  /** function to fetch the list of rating criterias
   * @memberof RatingRulesComponent */
  getRatingRulesCriteria() {
    this.ratingRulesModel.isRuleLoading = true;
    this.service.getRuleCriteria().pipe(takeWhile(() => this.ratingRulesModel.isSubscribe)).subscribe((data: RootObject) => {
      RatingRulesUtility.ratingRulesCriteria(data, this.ratingRulesModel);
      this.changeDetector.detectChanges();
    }, (error: HttpErrorResponse) => {
      this.ratingRulesModel.isRuleLoading = false;
      this.errorHandling();
    });
  }
  /** function that turns loader off on error scenarios* @memberof RatingRulesComponent */
  errorHandling() {
    this.ratingRulesModel.isPageLoading = false;
    this.changeDetector.detectChanges();
  }
  /** show popup if there is any unsaved data else routes to viewagreement details page
   * @memberof RatingRulesComponent */
  onCancel() {
    if (this.ratingRulesModel.ratingRulesForm.dirty) {
      this.ratingRulesModel.isShowPopup = true;
    } else {
      this.router.navigate([this.ratingRulesModel.routerUrl], {
        queryParams:
          { id: this.ratingRulesModel.agreementDetails.customerAgreementID }
      });
      this.ratingRulesModel.breadCrumbList[3].label = this.ratingRulesModel.createBreadCrumbValue;
      this.ratingRulesModel.ratingRuleEditFlag = false;
    }
  }
  /** function will mark all the formfield as pristine when user does not want to save the changes
   * @memberof RatingRulesComponent */
  removeDirty() {
    utils.forIn(this.ratingRulesModel.ratingRulesForm.controls, (value: FormControl, name: string) => {
      this.ratingRulesModel.ratingRulesForm.controls[name].markAsPristine();
    });
    if (this.ratingRulesModel.routerUrl === '/viewagreement') {
      this.router.navigate([this.ratingRulesModel.routerUrl], {
        queryParams:
          { id: this.ratingRulesModel.agreementDetails.customerAgreementID }
      });
    } else {
      this.router.navigateByUrl(this.ratingRulesModel.routerUrl);
    }
    this.ratingRulesModel.breadCrumbList[3].label = this.ratingRulesModel.createBreadCrumbValue;
    this.ratingRulesModel.ratingRuleEditFlag = false;
  }
  /** function to validate formfields and create save request
   * @memberof RatingRulesComponent */
  onSave() {
    this.ratingRulesModel.isShowPopup = false;
    this.ratingRulesModel.isShowAffliationMessage = false;
    const selectionValid = RatingRulesUtility.checkContracts(this.ratingRulesModel);
    if (!this.ratingRulesModel.ratingRuleEditFlag) {
      if (this.ratingRulesModel.ratingRulesForm.valid && selectionValid) {
        const requestParam = RatingRulesUtility.createRequestParam(this.ratingRulesModel);
        this.saveRatingRule(requestParam);
      } else {
        this.setValidationOnSave(selectionValid);
      }
    } else {
      this.validateEditRatingRule(selectionValid);
    }
  }
  validateEditRatingRule(selectionValid) {
    if (this.ratingRulesModel.ratingRulesForm.valid && this.ratingRulesModel.ratingRulesForm.dirty && selectionValid) {
      const requestParam = RatingRulesUtility.createRequestParam(this.ratingRulesModel);
      this.editRatingRule(requestParam);
    } else if (this.ratingRulesModel.ratingRulesForm.dirty) {
      this.setValidationOnSave(selectionValid);
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'No Changes Found',
        detail: 'There are no changes detected in the current action'
      });
    }
  }
  setValidationOnSave(selectionValid) {
    utils.forIn(this.ratingRulesModel.ratingRulesForm.controls, (value: FormControl, name: string) => {
      this.ratingRulesModel.ratingRulesForm.controls[name].markAsTouched();
    });
    RatingRulesUtility.toastMessage(this.messageService, 'error', 'Missing Required Information',
      'Provide the required information in the highlighted fields and submit the form again');
    this.emptySelectionError(selectionValid);
  }
  /** function to save the created rating rule
   * @param {SaveRequest} requestParam
   * @memberof RatingRulesComponent */
  saveRatingRule(requestParam: SaveRequest) {
    this.ratingRulesModel.isPageLoading = true;
    this.service.saveRatingRule(requestParam, this.ratingRulesModel.agreementDetails.customerAgreementID)
      .pipe(takeWhile(() => this.ratingRulesModel.isSubscribe)).subscribe((data: HttpResponseBase) => {
        if (!utils.isEmpty(data) && data.status === 201) {
          if (data['body']['status'] === 'Warning') {
            RatingRulesUtility.toastMessage(this.messageService, 'warn', 'Warning', data['body']['message']);
          } else {
            RatingRulesUtility.toastMessage(this.messageService, 'success', 'Rating Rule Created',
              'You have created the rating rule successfully');
          }
          this.changeDetector.detectChanges();
          this.removeDirty();
        }
      }, (error: HttpErrorResponse) => {
        if (!utils.isEmpty(error.error) && !utils.isEmpty(error.error.errors)) {
          RatingRulesUtility.toastMessage(this.messageService, 'error', error.error.errors[0].errorType,
            error.error.errors[0].errorMessage);
        }
        this.errorHandling();
      });
  }
  editRatingRule(requestParam) {
    this.ratingRulesModel.isPageLoading = true;
    this.service.editSaveRatingRule(requestParam, this.ratingRulesModel.agreementDetails.customerAgreementID, this.ratingRuleId)
      .pipe(takeWhile(() => this.ratingRulesModel.isSubscribe)).subscribe((data) => {
        if (!utils.isEmpty(data) && data.status === 200) {
          if (data['body']['status'] === 'Warning') {
            RatingRulesUtility.toastMessage(this.messageService, 'warn', 'Warning', data['body']['message']);
          } else {
            RatingRulesUtility.toastMessage(this.messageService, 'success', 'Rating Rule Edited',
              'You have Edited the rating rule successfully');
          }
          this.ratingRulesModel.isPageLoading = false;
          this.changeDetector.detectChanges();
          this.removeDirty();
        }
      }, (error: HttpErrorResponse) => {
        if (!utils.isEmpty(error.error) && !utils.isEmpty(error.error.errors)) {
          RatingRulesUtility.toastMessage(this.messageService, 'error', error.error.errors[0].errorType,
            error.error.errors[0].errorMessage);
          this.ratingRulesModel.isPageLoading = false;
        }
        this.errorHandling();
      });
  }
  /** function to fetch business unit and service offering list for dropdown
   * @memberof RatingRulesComponent */
  getBusinessUnitServiceOffering() {
    if (!this.ratingRulesModel.isAgreementDefault) {
      this.service.getBusinessUnitServiceOffering().pipe(takeWhile(() => this.ratingRulesModel.isSubscribe))
        .subscribe((offeringList: RootObject) => {
          this.ratingRulesModel.businessUnitServiceOfferingList = RatingRulesUtility.getBusinessUnitServiceOfferingList(offeringList);
          this.setBusinessUnit(this.ratingsModel.ratingRulesDetail['businessUnitServiceOfferingViewDTOs']);
          if (this.ratingRulesModel.ratingRuleEditFlag) {
            timer(200).subscribe(timerData => {
              this.ratingRulesModel.isPageLoading = false;
              this.changeDetector.detectChanges();
            });
          }
        }, (error: HttpErrorResponse) => {
          this.errorHandling();
        });
    }
  }
  /** function called when affiliation field value gets changed and displays popup if contract/section is selected
   * @param {AffiliationEvent} event
   * @memberof RatingRulesComponent */
  affiliationChanged(event: AffiliationEvent) {
    if (this.ratingRulesModel.affiliationValue !== event['value']) {
      this.ratingRulesModel.selectedAffiliationValue = event.value;
      this.ratingRulesModel.searchInputValue = '';
      this.checkSelectedData(event);
      this.affiliationChangeValue(event.value);
      if (this.ratingRulesModel.selectedAffiliationValue === this.ratingRulesModel.ratingRulesForm.get('affiliation').value) {
        this.callContractList();
        this.callSectionList();
      }
    }
  }
  /** function to show popup if selected data is dirty
   * @param {AffiliationEvent} event
   * @memberof RatingRulesComponent */
  checkSelectedData(event: AffiliationEvent) {
    if (this.ratingRulesModel.ratingRulesForm.get('selectedData').dirty && this.ratingRulesModel.selectedAffiliationValue ===
      this.ratingRulesModel.ratingRulesForm.get('affiliation').value && this.ratingRulesModel.affiliationValue !==
      this.ratingRulesModel.selectedAffiliationValue) {
      event.originalEvent.preventDefault();
      event.value = this.ratingRulesModel.affiliationValue;
      this.ratingRulesModel.ratingRulesForm.get('affiliation').setValue(this.ratingRulesModel.affiliationValue,
        { emitModelToViewChange: true });
      this.ratingRulesModel.isShowPopup = true;
      this.ratingRulesModel.isShowAffliationMessage = true;
      this.ratingRulesModel.ratingRulesForm.get('affiliation').updateValueAndValidity();
    } else {
      this.ratingRulesModel.affiliationValue = event.value;
    }
  }
  /** function to reset business unit field when there is no values selected for business unit
   * @memberof RatingRulesComponent */
  onBusinessUnitChange() {
    if (utils.isEmpty(this.ratingRulesModel.ratingRulesForm.get('businessUnit').value) && !this.ratingRulesModel.ratingRuleEditFlag) {
      this.ratingRulesModel.ratingRulesForm.get('businessUnit').reset();
    }
  }
  /** function to get all the active contracts based on the effective & expiration date
   * @memberof RatingRulesComponent */
  callContractList() {
    this.ratingRulesModel.noContractFoundFlag = false;
    this.ratingRulesModel.selectedList = [];
    this.ratingRulesModel.sectionSelectedList = [];
    this.ratingRulesModel.contractsList = [];
    if (this.ratingRulesModel.ratingRulesForm.get('affiliation').value === 'contract' &&
      this.ratingRulesModel.ratingRulesForm.get('effectiveDate').valid &&
      this.ratingRulesModel.ratingRulesForm.get('expirationDate').valid) {
      const requestParam = {
        agreementId: this.ratingRulesModel.agreementDetails.customerAgreementID,
        params: {
          effectiveDate: this.ratingRulesModel.ratingRulesForm.get('effectiveDate').value.toISOString().split('T')[0],
          expirationDate: this.ratingRulesModel.ratingRulesForm.get('expirationDate').value.toISOString().split('T')[0]
        }
      };
      this.ratingRulesModel.isPageLoading = true;
      this.service.getContractsList(requestParam).pipe(takeWhile(() => this.ratingRulesModel.isSubscribe))
        .subscribe((contractsList: ContractsListItem[]) => {
          this.ratingRulesModel.isPageLoading = false;
          this.ratingRulesModel.contractsList = RatingRulesUtility.contractTableList(contractsList);
          if (this.ratingRulesModel.ratingRuleEditFlag) {
            this.setSelectedContractList(this.ratingsModel['ratingRulesDetail']);
          }
          this.changeDetector.detectChanges();
        }, (error: HttpErrorResponse) => {
          this.ratingRulesModel.isPageLoading = false;
          this.errorHandling();
        });
    }
  }
  /** function to get all the active section based on the effective & expiration date
   * @memberof RatingRulesComponent */
  callSectionList() {
    this.ratingRulesModel.noSectionFoundFlag = false;
    this.ratingRulesModel.selectedList = [];
    this.ratingRulesModel.sectionSelectedList = [];
    this.ratingRulesModel.sectionList = [];
    if (this.ratingRulesModel.ratingRulesForm.get('affiliation').value === 'section' &&
      this.ratingRulesModel.ratingRulesForm.get('effectiveDate').valid &&
      this.ratingRulesModel.ratingRulesForm.get('expirationDate').valid) {
      const requestParam = {
        agreementId: this.ratingRulesModel.agreementDetails.customerAgreementID,
        params: {
          effectiveDate: this.ratingRulesModel.ratingRulesForm.get('effectiveDate').value.toISOString().split('T')[0],
          expirationDate: this.ratingRulesModel.ratingRulesForm.get('expirationDate').value.toISOString().split('T')[0]
        }
      };
      this.ratingRulesModel.isPageLoading = true;
      this.service.getSectionList(requestParam).pipe(takeWhile(() => this.ratingRulesModel.isSubscribe))
        .subscribe((sectionList: SectionList[]) => {
          this.ratingRulesModel.isPageLoading = false;
          this.ratingRulesModel.sectionList = RatingRulesUtility.sectionTableList(sectionList);
          if (this.ratingRulesModel.ratingRuleEditFlag) {
            this.setSelectedSectionList(this.ratingsModel['ratingRulesDetail']);
          }
          this.ratingRulesModel.noSectionFoundFlag = false;
          this.changeDetector.detectChanges();
        }, (error: HttpErrorResponse) => {
          this.ratingRulesModel.isPageLoading = false;
          this.errorHandling();
        });
    }
  }
  /** function to display toast message when no contract is selected on submitting the form
   * @param {boolean} valid
   * @memberof RatingRulesComponent */
  emptySelectionError(valid: boolean) {
    if (!valid) {
      RatingRulesUtility.toastMessage(this.messageService, 'error', 'Error',
        `Select ${this.ratingRulesModel.affiliationValue}(s) for creating rating rule`);
    }
  }
  /** function to get businessunit validation based on selected affiliation value
   * @param {string} value
   * @memberof RatingRulesComponent */
  affiliationChangeValue(value: string) {
    this.ratingRulesModel.isShowOptional = (value !== 'agreement');
    this.ratingRulesModel.isShowSection = (value === 'section');
    this.ratingRulesModel.isShowContract = (value === 'contract');
    RatingRulesUtility.setBusinessUnitValidation(this.ratingRulesModel);
  }
  /** function called when yes is clicked on the progess lost intimating popup
   * @memberof RatingRulesComponent */
  affiliationChangeYes() {
    this.ratingRulesModel.isShowPopup = false;
    this.ratingRulesModel.isShowAffliationMessage = false;
    this.ratingRulesModel.ratingRulesForm.get('selectedData').markAsPristine();
    this.ratingRulesModel.affiliationValue = this.ratingRulesModel.selectedAffiliationValue;
    this.ratingRulesModel.ratingRulesForm.patchValue({
      affiliation: this.ratingRulesModel.selectedAffiliationValue
    });
    this.ratingRulesModel.ratingRulesForm.updateValueAndValidity();
    this.affiliationChangeValue(this.ratingRulesModel.selectedAffiliationValue);
    this.callContractList();
    this.callSectionList();
  }
  /** function called when no is clicked in popup
   * @memberof RatingRulesComponent */
  popupCancel() {
    this.ratingRulesModel.isShowPopup = false;
    this.ratingRulesModel.routerUrl = '/viewagreement';
    this.ratingRulesModel.isShowAffliationMessage = false;
    this.ratingRulesModel.selectedAffiliationValue = this.ratingRulesModel.ratingRulesForm.get('affiliation').value;
  }

  detailsFetch(ratingRuleId: number) {
    this.ratingRulesModel.isPageLoading = true;
    this.service.getRateDetails(this.ratingRulesModel.agreementDetails.customerAgreementID, ratingRuleId).pipe(takeWhile(() =>
      this.ratingRulesModel.isSubscribe)).subscribe((data: RatingRuleDetail) => {
        if (!utils.isEmpty(data)) {
          this.ratingsModel['ratingRulesDetail'] = data;
          this.getBusinessUnitServiceOffering();
          data.customerRatingRuleConfigurationViewDTOs.forEach(element => {
            this.ruleConfig[element['ruleCriteriaName']] = element['ruleCriteriaValueName'];
          });
          let citySubstitutionIndicatorVal = false;
          if (data['citySubstitutionIndicator'] === 'Y') {
            citySubstitutionIndicatorVal = true;
          }
          this.ratingRulesModel.ratingRulesForm.patchValue({
            effectiveDate: new Date(this.formatDate(data['effectiveDate'])),
            expirationDate: new Date(this.formatDate(data['expirationDate'])),
            citySubstitution: citySubstitutionIndicatorVal,
            radius: data['citySubstitutionRadiusValue'],
            congestionCharge: this.ruleConfig['Congestion Charge'],
            flatRate: this.ruleConfig['Flat Rate With Stops'],
            hazmatCharge: this.ruleConfig['Hazmat Charge Rules'],
            affiliation: this.setAffliation(),
            selectedData: [this.ratingRulesModel.selectedList]
          });
          this.ratingRulesModel.isShowRadius = false;
          if (data['citySubstitutionRadiusValue']) {
            this.ratingRulesModel.isShowRadius = true;
            this.onCitySubstitutionChange(true);
          }
          this.changeAffilation(data);
          this.hideLoaderOnEdit();
        }
      }, (error: Error) => {
        this.ratingRulesModel.isPageLoading = false;
        RatingRulesUtility.toastMessage(this.messageService, 'error', 'Error', error['error'].errors[0].errorMessage);
      });
  }
  hideLoaderOnEdit() {
    if (this.ratingRulesModel.isAgreementDefault) {
      this.ratingRulesModel.isPageLoading = false;
    }
    this.changeDetector.detectChanges();
  }
  changeAffilation(data: RatingRuleDetail) {
    const affiliationEvent = {
      originalEvent: null,
      value: ''
    };
    if (data['customerAgreementContractAssociationViewDTOs'] &&
      data['customerAgreementContractAssociationViewDTOs'].length) {
      affiliationEvent['value'] = 'contract';
      this.affiliationChanged(affiliationEvent);
    }
    if (data['customerAgreementContractSectionAssociationViewDTOs'] &&
      data['customerAgreementContractSectionAssociationViewDTOs'].length) {
      affiliationEvent['value'] = 'section';
      this.affiliationChanged(affiliationEvent);
    }
  }
  setAffliation() {
    return (this.ratingsModel['ratingRulesDetail']['customerAgreementContractAssociationViewDTOs'] &&
      this.ratingsModel['ratingRulesDetail']['customerAgreementContractAssociationViewDTOs'].length > 0) ?
      'contract' : ((this.ratingsModel['ratingRulesDetail']['customerAgreementContractSectionAssociationViewDTOs'] &&
        this.ratingsModel['ratingRulesDetail']['customerAgreementContractSectionAssociationViewDTOs']
          .length > 0) ? 'section' : 'agreement');
  }
  setBusinessUnit(ratingRuleDetail) {
    const selectedBusinessUnit = [];
    utils.forEach(ratingRuleDetail, (businessunit) => {
      const businessUnit = utils.find(this.ratingRulesModel.businessUnitServiceOfferingList,
        {
          value: {
            financeBusinessUnitServiceOfferingAssociationID: businessunit.financeBusinessUnitServiceOfferingAssociationID
          }
        });
      selectedBusinessUnit.push(businessUnit['value']);
    });
    this.ratingRulesModel.ratingRulesForm.controls['businessUnit'].setValue(selectedBusinessUnit);
    this.changeDetector.detectChanges();
  }
  setSelectedContractList(ratingRuleDetail) {
    const selectedContractList = [];
    if (ratingRuleDetail && ratingRuleDetail['customerAgreementContractAssociationViewDTOs']) {
      utils.forEach(ratingRuleDetail.customerAgreementContractAssociationViewDTOs, (contract) => {
        const displayContract = utils.find(this.ratingRulesModel.contractsList,
          {
            saveData: {
              contractID: contract.customerAgreementContractID
            }
          });
        if (displayContract) {
          selectedContractList.push(displayContract);
        }
      });
      this.ratingRulesModel.selectedList = selectedContractList;
      this.changeDetector.detectChanges();
    }
  }
  setSelectedSectionList(ratingRuleDetail) {
    const selectedSectionList = [];
    if (ratingRuleDetail && ratingRuleDetail['customerAgreementContractSectionAssociationViewDTOs']) {
      utils.forEach(ratingRuleDetail.customerAgreementContractSectionAssociationViewDTOs, (section) => {
        const displaySection = utils.find(this.ratingRulesModel.sectionList,
          {
            sectionSaveData: {
              sectionID: section.customerAgreementContractSectionID
            }
          });
        if (displaySection) {
          selectedSectionList.push(displaySection);
        }
      });
      this.ratingRulesModel.sectionSelectedList = selectedSectionList;
      this.changeDetector.detectChanges();
    }
  }
  formatDate(value: string | Date) {
    return moment(value).format('MM/DD/YYYY');
  }

  isEmptyTable(event, flag) {
    RatingRulesUtility.isEmptyTable(this.ratingRulesModel, event, flag);
  }

}

