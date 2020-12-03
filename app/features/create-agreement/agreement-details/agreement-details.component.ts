import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterStateSnapshot } from '@angular/router';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import * as utils from 'lodash';
import { takeWhile } from 'rxjs/operators';
import { MessageService } from 'primeng/components/common/messageservice';

import { BroadcasterService } from '../../../shared/jbh-app-services/broadcaster.service';
import { LocalStorageService } from './../../../shared/jbh-app-services/local-storage.service';

import { AgreementDetailsModel } from './model/agreement-details.model';
import { AgreementDetailsService } from './service/agreement-details.service';
import { AgreementDetailsQuery } from './query/agreement-details.query';
import { AccountDetails, AgreementTypesResponse, AgreementTypesItem, CreateSaveResponse, RootObject, BucketsItem, HitsItem, AgreementEvent
} from './model/agreement-details.interface';
import { AgreementDetailsUtility } from './service/agreement-details-utility';
@Component({
  selector: 'app-agreement-details',
  templateUrl: './agreement-details.component.html',
  styleUrls: ['./agreement-details.component.scss'],
  providers: [AgreementDetailsService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgreementDetailsComponent implements OnInit, OnDestroy {
  agreementDetailsModel: AgreementDetailsModel;
  constructor(
    private readonly formBuilder: FormBuilder, private readonly service: AgreementDetailsService,
    private readonly changeDetector: ChangeDetectorRef, private readonly shared: BroadcasterService,
    private readonly messageService: MessageService, private readonly router: Router,
    private readonly store: LocalStorageService) {
    this.agreementDetailsModel = new AgreementDetailsModel();
  }
  ngOnInit() {
    this.createAgreementDetailsForm();
    this.checkStore();
    this.getAgreementTypeList();
    this.navigationSubscription();
    this.saveSubscription();
  }
  ngOnDestroy() {
    this.agreementDetailsModel.isSubscribe = false;
  }
  /** function to check the local store values for initial patch
   * @memberof AgreementDetailsComponent */
  checkStore() {
    if (!utils.isUndefined(this.store.getItem('createAgreement', 'detail'))) {
      this.agreementDetailsModel.agreementDetails = this.store.getItem('createAgreement', 'detail');
      this.agreementDetailsModel.agreementDetails.accountName = {
        OrganizationName: this.agreementDetailsModel.agreementDetails.customerAgreementName,
        accountName: this.agreementDetailsModel.agreementDetails.customerAgreementName.split('(')[0],
        accountCode: `(${this.agreementDetailsModel.agreementDetails.customerAgreementName.split('(')[1]}`,
        partyId: this.agreementDetailsModel.agreementDetails.ultimateParentAccountID
      };
      this.agreementDetailsModel.agreementDetailsForm.patchValue({
        agreementType: this.agreementDetailsModel.agreementDetails['agreementType'],
        accountName: this.agreementDetailsModel.agreementDetails.accountName,
        teams: this.agreementDetailsModel.agreementDetails.teams
      });
    }
  }
  /** function to call save functin based on the value of needToSave
   * @memberof AgreementDetailsComponent */
  saveSubscription() {
    this.shared.on<boolean>('needToSave').pipe(takeWhile(() => this.agreementDetailsModel.isSubscribe)).subscribe((value: boolean) => {
      this.changeDetector.detectChanges();
      if (value) {
        this.onSave('next');
      } else {
        this.agreementDetailsModel.isNeedToSave = false;
        this.router.navigate([this.agreementDetailsModel.routeUrl]);
      }
    });
  }
  /** function to determine popup message based on the navigationStarts & agreement type
   * @memberof AgreementDetailsComponent */
  navigationSubscription() {
    this.shared.on<RouterStateSnapshot>('navigationStarts').subscribe((value: RouterStateSnapshot) => {
      let data = {key: true, message: '', type: ''};
      if (this.agreementDetailsModel.agreementDetailsForm.get('agreementType').value === 'Customer') {
        data = {
          key: !(AgreementDetailsUtility.valueChangedCheck(this.agreementDetailsModel)),
          message: 'You have unsaved agreement data. Do you want to save as Draft?',
          type: 'Customer'
        };
        if (this.agreementDetailsModel.isDetailsSaved || !this.agreementDetailsModel.isNeedToSave) {
          data['key'] = true;
        }
      } else if (this.agreementDetailsModel.agreementDetailsForm.get('agreementType').value === 'Carrier') {
        data = {
          key: !(this.agreementDetailsModel.carrierDetailsForm.dirty &&
          this.agreementDetailsModel.carrierDetailsForm.touched),
          message: 'You are about to lose all the changes. Do you want to proceed?',
          type: 'Carrier'
        };
      }
      this.shared.broadcast('saved', data);
      this.agreementDetailsModel.routeUrl = value.url;
      this.changeDetector.detectChanges();
    });
  }
  /** function to create customer agreement form fields
   * @memberof AgreementDetailsComponent */
  createAgreementDetailsForm() {
    this.agreementDetailsModel.agreementDetailsForm = this.formBuilder.group({
      agreementType: ['', Validators.required],
      accountName: ['', Validators.required],
      teams: ['']
    });
  }
  /** function to create carrier agreement form fields
   * @memberof AgreementDetailsComponent */
  createCarrierForm() {
    this.agreementDetailsModel.carrierDetailsForm = this.formBuilder.group({
      carrierAgreement: this.formBuilder.array([]),
      carrierAgreementName: [null, Validators.required]
    });
  }
  /** function to set accountName value based on the event.target.value
   * @param {Event} event
   * @memberof AgreementDetailsComponent */
  onClearAccount(event: Event) {
    if (event && event.target && utils.isEmpty(event.target['value'])) {
      this.agreementDetailsModel.agreementDetailsForm.patchValue({
        accountName: event.target['value']
      });
      this.agreementDetailsModel.agreementDetailsForm.updateValueAndValidity();
    }
  }
  /** function to get the agreement type list
   * @memberof AgreementDetailsComponent */
  getAgreementTypeList() {
    this.agreementDetailsModel.pageLoading = true;
    this.service.getAgreementType().pipe(takeWhile(() => this.agreementDetailsModel.isSubscribe))
      .subscribe((data: AgreementTypesResponse) => {
        this.handleGetAgreementTypeList(data);
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.agreementDetailsModel.pageLoading = false;
        this.agreementDetailsModel.agreementTypeList = [];
        if (error.status && error.status >= 500) {
          this.messageService.clear();
          this.messageService.add({ severity: 'error', summary: 'Error',
           detail: 'Pricing Configuration System is currently unavailable.  Contact help desk' });
        }
        this.changeDetector.detectChanges();
      });
  }
  handleGetAgreementTypeList(data) {
    if (!utils.isEmpty(data) && !utils.isEmpty(data._embedded) && !utils.isEmpty(data._embedded['agreementTypes'])) {
      utils.forEach(data._embedded['agreementTypes'], (value: AgreementTypesItem) => {
        this.agreementDetailsModel.pageLoading = false;
        this.agreementDetailsModel.agreementTypeList.push({
          label: value.agreementTypeName,
          value: value.agreementTypeName
        });
        if (value.agreementTypeName.toLowerCase() === this.agreementDetailsModel.defaultText) {
          this.agreementDetailsModel.agreementDetailsForm.patchValue({
            agreementType: value.agreementTypeName
          });
        }
      });
    } else {
      this.agreementDetailsModel.pageLoading = false;
    }
  }
  /** function to check the agreement type on agreement type change
   * @param {AgreementEvent} event
   * @memberof AgreementDetailsComponent */
  checkAgreementType(event: AgreementEvent) {
    if (this.agreementDetailsModel.selectedAgreementType === this.agreementDetailsModel.agreementDetailsForm.get('agreementType').value &&
    this.agreementDetailsModel.selectedAgreementType !== this.agreementDetailsModel.agreementType &&
    AgreementDetailsUtility.checkFormDirty(this.agreementDetailsModel)) {
      event.originalEvent.preventDefault();
      event.value = this.agreementDetailsModel.agreementType;
      this.agreementDetailsModel.agreementDetailsForm.get('agreementType').setValue(this.agreementDetailsModel.agreementType,
        { emitModelToViewChange: true });
      this.agreementDetailsModel.isShowPopup = true;
      this.agreementDetailsModel.agreementDetailsForm.get('agreementType').updateValueAndValidity();
    } else {
      this.agreementDetailsModel.agreementType = event.value;
    }
  }
  /** function called when no button of the popup is clicked
   * @memberof AgreementDetailsComponent */
  onClickPopupNo() {
    this.agreementDetailsModel.isShowPopup = false;
  }
  /** function called when yes button of the popup is clicked
   * @memberof AgreementDetailsComponent */
  onClickPopupYes() {
    this.agreementDetailsModel.isShowPopup = false;
    if (this.agreementDetailsModel.agreementDetailsForm.get('agreementType').value === 'Customer') {
      this.agreementDetailsModel.agreementDetailsForm.markAsPristine();
    } else {
      this.agreementDetailsModel.carrierDetailsForm.markAsPristine();
    }
    this.agreementDetailsModel.agreementType = this.agreementDetailsModel.selectedAgreementType;
    this.agreementDetailsModel.agreementDetailsForm.patchValue({
      agreementType: this.agreementDetailsModel.selectedAgreementType
    });
    this.agreementDetailsModel.agreementDetailsForm.updateValueAndValidity();
    this.agreementChanged(this.agreementDetailsModel.selectedAgreementType);
  }
  /** function called when agreement type is changed
   * @param {AgreementEvent} event
   * @memberof AgreementDetailsComponent */
  agreementTypeChanged(event: AgreementEvent) {
    if (this.agreementDetailsModel.agreementType !== event.value) {
      this.agreementDetailsModel.selectedAgreementType = event.value;
      this.checkAgreementType(event);
      this.agreementChanged(event.value);
    }
  }
  /** function to determine the view based on agreement type
   * @param {string} value
   * @memberof AgreementDetailsComponent */
  agreementChanged(value: string) {
    if (this.agreementDetailsModel.selectedAgreementType === this.agreementDetailsModel.agreementDetailsForm.get('agreementType').value) {
      this.resetAgreementType();
      switch (value.toLowerCase()) {
        case 'customer':
          this.shared.broadcast('agreementType', 'customer');
          this.agreementDetailsModel.isCustomerAgreement = true;
          this.agreementDetailsModel.agreementDetailsForm.get('accountName').reset();
          this.agreementDetailsModel.agreementDetailsForm.get('teams').reset();
          this.changeDetector.detectChanges();
        break;
        case 'carrier':
          this.createCarrierForm();
          this.agreementDetailsModel.selectedItemList = [];
          this.shared.broadcast('agreementType', 'carrier');
          this.agreementDetailsModel.isCarrierAgreement = true;
          this.agreementDetailsModel.firstRowCarrier = '';
          this.changeDetector.detectChanges();
        break;
        case 'rail':
          this.shared.broadcast('agreementType', 'customer');
          this.agreementDetailsModel.isRailAgreement = true;
        break;
        default: break;
      }
    }
  }
  /** function to reset all the view variables
   * @memberof AgreementDetailsComponentv*/
  resetAgreementType() {
    this.agreementDetailsModel.isCustomerAgreement = false;
    this.agreementDetailsModel.isCarrierAgreement = false;
    this.agreementDetailsModel.isRailAgreement = false;
  }
  /** function to get account name based on the typed value in account field
   * @param {string} event
   * @memberof AgreementDetailsComponent */
  onAccountSearch(event: string) {
    const query = AgreementDetailsQuery.getAccountNameQuery(event);
    this.service.getAccountName(query)
      .pipe(takeWhile(() => this.agreementDetailsModel.isSubscribe))
      .subscribe((data: RootObject) => {
        this.handleAccountSearchData(data);
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.changeDetector.detectChanges();
        this.messageService.clear();
        if (error.status && error.status >= 500) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error', detail: 'A&L system is currently unavailable.  Contact help desk'
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: error.statusText, detail: error.message
          });
        }
        this.agreementDetailsModel.accountNameList = [];
      });
  }
  handleAccountSearchData(data) {
    const resultList = [];
    if (!utils.isEmpty(data) && !utils.isEmpty(data.aggregations) &&
      !utils.isEmpty(data.aggregations.unique) && !utils.isEmpty(data.aggregations.unique.buckets)) {
      utils.forEach(data.aggregations.unique.buckets, (bucket: BucketsItem) => {
        if (bucket.key && !utils.isEmpty(bucket.Level) && !utils.isEmpty(bucket.Level.hits) && !utils.isEmpty(bucket.Level.hits.hits)) {
          resultList.push(AgreementDetailsUtility.getSearchResults(bucket.Level.hits.hits));
        }
      });
    }
    this.agreementDetailsModel.accountNameList = resultList;
  }
  onSearchTeam(event: string) {
    const query = AgreementDetailsQuery.getTeamsQuery(event);
    this.service.getTeams(query)
    .pipe(takeWhile(() => this.agreementDetailsModel.isSubscribe))
    .subscribe((data: RootObject) => {
      this.handleSearchTeam(data);
      this.changeDetector.detectChanges();
    }, (error: HttpErrorResponse) => {
      this.agreementDetailsModel.teamList = [];
      if (error.status && error.status >= 500) {
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: 'Error', detail: 'Platform system is currently unavailable. Contact help desk'
        });
      }
      this.changeDetector.detectChanges();
    });
  }
  handleSearchTeam(data) {
    const teamNameList = [];
    this.agreementDetailsModel.teamList = [];
    if (!utils.isEmpty(data) && !utils.isEmpty(data.hits) && !utils.isEmpty(data.hits.hits)) {
      utils.forEach(data.hits.hits, (value: HitsItem) => {
        if (!utils.isEmpty(value._source) && !utils.isEmpty(value._source.teamMemberTaskAssignmentRoleAssociationDTOs)) {
          teamNameList.push({
            teamName: value._source.teamMemberTaskAssignmentRoleAssociationDTOs[0].teamName,
            teamID: value._source.teamMemberTaskAssignmentRoleAssociationDTOs[0].teamID,
            taskAssignmentID: value._source.teamMemberTaskAssignmentRoleAssociationDTOs[0].taskAssignmentID
          });
        }
      });
    }
    this.agreementDetailsModel.teamList = teamNameList;
  }
  /** function called to create a customer agreement
   * @param {string} screen
   * @memberof AgreementDetailsComponent */
  onSave(screen: string) {
    this.agreementDetailsModel.isSaved = false;
    if (this.agreementDetailsModel.agreementDetailsForm.valid) {
      this.checkValueChange(screen);
    } else {
      utils.forIn(this.agreementDetailsModel.agreementDetailsForm.controls, (value: FormControl, name: string) => {
        this.agreementDetailsModel.agreementDetailsForm.controls[name].markAsTouched();
      });
      this.toastMessage('error', 'Missing Required Information',
      'Provide the required information in the highlighted fields and submit the form again');
    }
  }
  /** function to display toast message
   * @param {string} type
   * @param {string} title
   * @param {string} message
   * @memberof AgreementDetailsComponent */
  toastMessage(type: string, title: string, message: string) {
    this.messageService.clear();
    this.messageService.add({
      severity: type, summary: title, detail: message
    });
  }
  /** function to create customer agreement based on values changed
   * @param {string} [screen]
   * @memberof AgreementDetailsComponent */
  checkValueChange(screen?: string) {
    const selectedAccount = this.agreementDetailsModel.agreementDetailsForm.get('accountName').value;
    const data = {
      customerAgreementID: null,
      agreementType: this.agreementDetailsModel.agreementDetailsForm.get('agreementType').value,
      customerAgreementName: selectedAccount.OrganizationName,
      ultimateParentAccountID: selectedAccount.partyId,
      customerAgreementOwnershipDTOs: (!utils.isEmpty(this.agreementDetailsModel.agreementDetailsForm.get('teams').value)) ?
        this.agreementDetailsModel.agreementDetailsForm.get('teams').value : null
    };
    if (AgreementDetailsUtility.valueChangedCheck(this.agreementDetailsModel)) {
      this.store.clearAllItems();
      this.agreementDetailsModel.pageLoading = true;
      this.service.agreementCheckSave(data).pipe(takeWhile(() => this.agreementDetailsModel.isSubscribe))
        .subscribe((response: CreateSaveResponse) => {
          this.handleAgreementCheckValue(response, data.customerAgreementOwnershipDTOs, selectedAccount.OrganizationName);
          this.handleSuccess(screen);
        }, (error: HttpErrorResponse) => {
          this.agreementDetailsModel.pageLoading = false;
          this.handleError(error);
          this.changeDetector.detectChanges();
        });
    } else {
      this.handleSuccess(screen);
    }
  }
  /** function to handle save call error
   * @param {HttpErrorResponse} error
   * @memberof AgreementDetailsComponent
   */
  handleError(error: HttpErrorResponse) {
    if (error.status === 400 && error.error.errors[0].errorMessage === 'max_size_violation') {
      this.toastMessage('error', 'Error',
       'Exceeds Permissible Limit');
    } else if (!utils.isEmpty(error.error) && !utils.isEmpty(error.error.errors)) {
      this.toastMessage('error', error.error.errors[0].errorType, error.error.errors[0].errorMessage);
    }
  }
  handleAgreementCheckValue(response, customerAgreementOwnershipDTOs, OrganizationName) {
    this.agreementDetailsModel.pageLoading = false;
    response.teams = customerAgreementOwnershipDTOs;
    this.store.setItem('createAgreement', 'detail', response);
    this.shared.broadcast('agreementName', OrganizationName);
    this.changeDetector.detectChanges();
    this.agreementDetailsModel.isDetailsSaved = true;
  }
  /** function to handle save success and navigate
   * @param {string} screen
   * @memberof AgreementDetailsComponent */
  handleSuccess(screen: string) {
    if (screen) {
      switch (screen) {
        case 'search':
          this.store.clearAllItems();
          this.router.navigate(['/searchagreement']);
          break;
        case 'next':
          this.shared.broadcast('stepIndexChange', 'next');
          break;
        default: break;
      }
    } else {
      this.router.navigate([this.agreementDetailsModel.routeUrl]);
    }
  }
  loader(event: boolean) {
    this.agreementDetailsModel.pageLoading = event;
  }
}
