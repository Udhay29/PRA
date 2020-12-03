import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ChangeDetectorRef, ElementRef } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';
import * as utils from 'lodash';
import * as moment from 'moment';
import { Router } from '@angular/router';

import { RatingsModel } from '../model/rating.model';
import { RatingRuleService } from '../service/rating-rule.service';
import { RatingRuleDetail, Source } from '../model/rating.interface';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';

@Component({
  selector: 'app-view-rating-rule-detail',
  templateUrl: './view-rating-rule-detail.component.html',
  styleUrls: ['./view-rating-rule-detail.component.scss'],
  providers: [RatingRuleService]
})
export class ViewRatingRuleDetailComponent implements OnInit, OnDestroy {
  ratingsModel: RatingsModel;
  ratingRuleId: number;
  ruleConfig: Object = {};
  @Output() closeClickEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() closeClickEventOnInactivate: EventEmitter<string> = new EventEmitter<string>();
  @Input() agreementId;
  @Input() set uniqueDocID(ruleId: any) {
    this.ratingRuleId = ruleId;
    this.detailsFetch();
  }

  constructor(private readonly ratingRuleService: RatingRuleService, private readonly changeDetector: ChangeDetectorRef,
    private readonly messageService: MessageService, public router: Router, private readonly shared: BroadcasterService,
    private readonly elementRef: ElementRef,
    private readonly formBuilder: FormBuilder) {
    this.ratingsModel = new RatingsModel();
  }

  ngOnInit() {
    this.formIntialisation();
  }

  ngOnDestroy() {
    this.ratingsModel.viewRatingRuleSubscriberFlag = false;
  }
  formIntialisation() {
    this.ratingsModel.ratingRuleInactivateForm = this.formBuilder.group({
      expirationDate: ['', Validators.required]
    });
  }

  /** function that emits close event of the splitview
   * @memberof RatingRuleComponent */
  onClose() {
    this.closeClickEvent.emit('close');
  }

  detailsFetch() {
    this.ratingsModel.ratingRulesDetail = {};
    this.ruleConfig = {};
    this.ratingsModel.isPageLoading = true;
    this.ratingRuleService.getRateDetails(this.agreementId, this.ratingRuleId).pipe(takeWhile(() =>
      this.ratingsModel.viewRatingRuleSubscriberFlag)).subscribe((data: RatingRuleDetail) => {
        if (!utils.isEmpty(data)) {
          this.ratingsModel.ratingRulesDetail = data;
          this.ratingsModel.ratingRulesDetail['effectiveDate'] = this.formateDate(this.ratingsModel.ratingRulesDetail['effectiveDate']);
          this.ratingsModel.ratingRulesDetail['expirationDate'] = this.formateDate(this.ratingsModel.ratingRulesDetail['expirationDate']);
          this.ratingsModel.ratingRulesDetail.customerRatingRuleConfigurationViewDTOs.forEach(element => {
            this.ruleConfig[element['ruleCriteriaName']] = element['ruleCriteriaValueName'];
          });
          if (data['responseStatus'] === 'PARTIAL') {
            this.toastMessage(this.messageService, 'warn', 'Warning', data['errorMessages']);
          }
          this.ratingsModel.isPageLoading = false;
          this.changeDetector.detectChanges();
        }
      }, (error: Error) => {
        this.ratingsModel.isPageLoading = false;
        this.toastMessage(this.messageService, 'error', 'Error', error.message);
      });
  }

  formateDate(value: string | Date) {
    return moment(value).format('MM/DD/YYYY');
  }
  toastMessage(messageService: MessageService, severityType: string, title: string, messageDetail: string) {
    const message = {
      severity: severityType,
      summary: title,
      detail: messageDetail
    };
    messageService.clear();
    messageService.add(message);
  }

  navigateToEdit() {
    let isAgreementDefaultVal = false;
    if (this.ratingsModel.ratingRulesDetail.agreementDefaultFlag === 'Yes') {
      isAgreementDefaultVal = true;
    }
    this.shared.broadcast('ratingruledetails', {
      agreementId: this.agreementId,
      isAgreementDefault: isAgreementDefaultVal,
      isCreate: false,
      ratingRuleId: this.ratingRuleId
    });
    this.router.navigate(['/viewagreement/editratingrule'], { queryParams: { id: this.ratingRuleId }, skipLocationChange: true });
  }
  onInactivatePopUpOpen() {
    this.ratingsModel.showInactivatePopUp = true;
    this.ratingsModel.maxDate = null;
    const previousDay = moment(this.ratingsModel.ratingRulesDetail['expirationDate']).subtract(1, 'days');
    this.ratingsModel.maxDate = new Date(previousDay.toLocaleString());
    this.ratingsModel.minDate = new Date(this.ratingsModel.ratingRulesDetail['effectiveDate']);
  }
  onInactivatePopUpClose() {
    this.ratingsModel.ratingRuleInactivateForm.reset();
    this.ratingsModel.showInactivatePopUp = false;
  }
  onClickConfirmInactivate() {
    if (this.ratingsModel.ratingRuleInactivateForm.valid) {
      const reqParam = {
        expirationDate: this.ratingsModel.ratingRuleInactivateForm.get('expirationDate').value.toISOString().split('T')[0],
        ratingRuleAction: 'INACTIVATE',
        customerRatingRuleIDs: [this.ratingRuleId]
      };
      this.ratingsModel.isPageLoading = true;
      this.ratingRuleService.inactivateRatingRule(this.agreementId, reqParam)
        .pipe(takeWhile(() => this.ratingsModel.viewRatingRuleSubscriberFlag)).subscribe((inactivateData) => {
          this.inactivateRatingRule(inactivateData);
        }, (error: Error) => {
          this.errorScenarioOnInactivate(error);
        });
    } else {
      this.ratingsModel.ratingRuleInactivateForm.controls['expirationDate'].markAsTouched();
    }
  }
  errorScenarioOnInactivate(error) {
    this.toastMessage(this.messageService, 'error', 'Error', error['error']['errors'][0]['errorMessage']);
    this.ratingsModel.isPageLoading = false;
    this.onInactivatePopUpClose();
    this.changeDetector.detectChanges();
  }
  inactivateRatingRule(inactivateData) {
    if (inactivateData && inactivateData['status'] === 'Success') {
      this.ratingsModel.isPageLoading = false;
      this.onInactivatePopUpClose();
      this.toastMessage(this.messageService, 'success', 'Rating Rule Inactivated',
        inactivateData['message']);
      this.closeSplitOnInactivate();
    } else {
      this.ratingsModel.isPageLoading = false;
      this.onInactivatePopUpClose();
      this.toastMessage(this.messageService, 'error', 'Error', inactivateData['message']);
    }
  }
  closeSplitOnInactivate() {
    this.closeClickEventOnInactivate.emit('close');
  }
  onBlurDateValidate(enteredDate: string) {
    const regex = new RegExp('^(1[0-2]|0?[1-9])/(3[01]|[12][0-9]|0?[1-9])/?[0-9]{4}$');
    if (enteredDate && regex.test(enteredDate.trim()) &&
      (new Date(enteredDate) <= new Date(this.ratingsModel.maxDate)) &&
      !(new Date(enteredDate) < new Date(this.ratingsModel.ratingRulesDetail['effectiveDate']))) {
      const expDate = new Date(enteredDate);
      this.ratingsModel.ratingRuleInactivateForm.controls['expirationDate'].setValue(expDate);
      this.ratingsModel.ratingRuleInactivateForm.controls['expirationDate'].setValidators(null);
      this.ratingsModel.ratingRuleInactivateForm.controls.expirationDate.setErrors(null);
    } else if (enteredDate === '') {
      this.ratingsModel.ratingRuleInactivateForm.controls['expirationDate'].setValidators([Validators.required]);
    } else {
      this.ratingsModel.ratingRuleInactivateForm.controls.expirationDate.setErrors({ invalid: true });
    }
  }
  onSelectDateValidate(selectedDate: string) {
    if (new Date(selectedDate) < new Date(this.ratingsModel.ratingRulesDetail['effectiveDate'])) {
      this.ratingsModel.ratingRuleInactivateForm.controls.expirationDate.setErrors({ invalid: true });
    }
  }
  onTypeDate(enteredDate: string) {
    const regex = new RegExp('^(1[0-2]|0?[1-9])/(3[01]|[12][0-9]|0?[1-9])/?[0-9]{4}$');
    if (enteredDate && regex.test(enteredDate.trim())) {
      this.ratingsModel.expDate = new Date(enteredDate);
    }
  }
}
