import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as utils from 'lodash';
import { takeWhile } from 'rxjs/operators';
import { MessageService } from 'primeng/components/common/messageservice';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { timer } from 'rxjs';
import { AdditionalInfoModel } from './models/additional-info.model';
import { AdditionalInfoService } from './services/additional-info.service';
import { AdditionalInfoUtility } from './services/additional-info-utility';
import { AdditionalInfoQuery } from './query/additional-info.query';
import {
  BillToCodeList, ElasticRootObject, HitsArray, MileagePreferenceRequest,
  ReqParam, WeightUnit
} from './models/additional-info.interface';
import { ViewAgreementDetailsUtility } from './../../../service/view-agreement-details-utility';
import { CarrierQuery } from './query/carrier.query';
import { BroadcasterService } from '../../../../../shared/jbh-app-services/broadcaster.service';
import { LineHaulValues } from '../../additional-information/line-haul-overview/model/line-haul-overview.interface';

@Component({
  selector: 'app-additional-info',
  templateUrl: './additional-info.component.html',
  styleUrls: ['./additional-info.component.scss'],
  providers: [AdditionalInfoService]
})
export class AdditionalInfoComponent implements OnInit {
  autoInvoice: string;
  additionalInfoModel: AdditionalInfoModel;
  reviewUrl: string;
  agreementUrl: string;
  dummy: any;
  linehaulStatus: string;
  constructor(private readonly formBuilder: FormBuilder, private readonly additionalInformationService: AdditionalInfoService,
    private readonly changeDetector: ChangeDetectorRef, private readonly messageService: MessageService,
    private readonly router: Router, public route: ActivatedRoute,
    private readonly viewAgreementUtilityService: ViewAgreementDetailsUtility, private readonly shared: BroadcasterService) {
    this.additionalInfoModel = new AdditionalInfoModel();
    this.autoInvoice = 'Auto Invoice';
    this.reviewUrl = '/viewagreement/review';
    this.agreementUrl = '/viewagreement';
  }
  ngOnInit() {
    this.additionalInfoFormInitialization();
    this.routeQueryParams();
    this.getLineHaulConfigurationID();
    this.getLineHaulPriorityNumber();
    this.populateInputFields();
    this.setDefaultValues();
    this.setagreementDetails();
    this.setPatchValuesForEdit();
    this.shared.on<LineHaulValues>('linehaulOverView')
    .pipe(takeWhile(() => this.additionalInfoModel.subscriberFlag)).subscribe((linehaulOverviewData: LineHaulValues) => {
      if (!utils.isEmpty(linehaulOverviewData)) {
        this.additionalInfoModel.linehaulOverviewData = linehaulOverviewData;
        this.changeDetector.detectChanges();
      }
    });
  }
  onBlurRange(event, controlName: string) {
    const enteredValue = event['target']['value'].replace(/,/g, '');
    switch (controlName) {
      case 'mileageRangeFrom':
        this.additionalInfoModel.mileagePreferenceMinRange = (enteredValue) ? enteredValue : null;
        this.validateRange(event['target']['value'], controlName, 'mileageRangeFrom',
          'mileageRangeTo');
        break;
      case 'mileageRangeTo':
        this.additionalInfoModel.mileagePreferenceMaxRange = (enteredValue) ? enteredValue : null;
        this.validateRange(event['target']['value'], controlName,
          'mileageRangeFrom',
          'mileageRangeTo');
        break;
      case 'weightRangeFrom':
        this.additionalInfoModel.weightMinRange = (enteredValue) ? enteredValue : null;
        this.validateRange(event['target']['value'], controlName, 'weightRangeFrom',
          'weightRangeTo');
        break;
      case 'weightRangeTo':
        this.additionalInfoModel.weightMaxRange = (enteredValue) ? enteredValue : null;
        this.validateRange(event['target']['value'], controlName,
          'weightRangeFrom', 'weightRangeTo');
        break;
    }
  }
  onBlurWeightUnit() {
    AdditionalInfoUtility.setWeightUnitValidation(this.additionalInfoModel);
  }
  removePrecision(event, control: string) {
    const value = event['target']['value'].replace(/,/g, '');
    this.additionalInfoModel.additionalInformationForm.controls[control].setValue(value);
  }
  validateRange(value, control: string, minValueField, maxValueField) {
    const pattern: RegExp = /^[0-9]*$/;
    if (value) {
      if (pattern.test(value.replace(/,/g, '')) && value.replace(/,/g, '') <= this.additionalInfoModel.maxLimit) {
        if ((control === 'mileageRangeFrom' || control === 'mileageRangeTo')) {
          this.additionalInfoModel.mileageInputFlag = false;
        } else {
          this.additionalInfoModel.weightInputFlag = false;
        }
        this.additionalInfoModel.additionalInformationForm.controls[control].setErrors(null);
        const formattedRange = AdditionalInfoUtility.thousandSeperator(value);
        this.additionalInfoModel.additionalInformationForm.controls[control].setValue(formattedRange);
        this.checkMinMaxRange(minValueField, maxValueField, control);
      } else {
        if (control === 'mileageRangeFrom' || control === 'mileageRangeTo') {
          this.additionalInfoModel.mileageInputFlag = true;
        } else {
          this.additionalInfoModel.weightInputFlag = true;
        }
        this.additionalInfoModel.additionalInformationForm.controls[minValueField].markAsTouched();
        this.additionalInfoModel.additionalInformationForm.controls[minValueField].setErrors({ invalid: true });
        this.additionalInfoModel.additionalInformationForm.controls[maxValueField].markAsTouched();
        this.additionalInfoModel.additionalInformationForm.controls[maxValueField].setErrors({ invalid: true });
      }
    } else {
      if ((control === 'mileageRangeFrom' || control === 'mileageRangeTo')) {
        this.additionalInfoModel.mileageInputFlag = false;
      } else {
        this.additionalInfoModel.weightInputFlag = false;
      }
      this.additionalInfoModel.additionalInformationForm.controls[control].setErrors(null);
      this.checkMinMaxRange(minValueField, maxValueField, control);
    }
  }
  checkMinMaxRange(minValueField: string, maxValueField: string, control: string) {
    const minVal = this.additionalInfoModel.additionalInformationForm.controls[minValueField].value;
    const maxVal = this.additionalInfoModel.additionalInformationForm.controls[maxValueField].value;
    const minValue = parseInt(minVal.replace(/,/g, ''), 10);
    const maxValue = parseInt(maxVal.replace(/,/g, ''), 10);
    const pattern: RegExp = /^[0-9]*$/;
    const validRange = (minVal.replace(/,/g, '') <= this.additionalInfoModel.maxLimit && maxVal.replace(/,/g, '') <=
      this.additionalInfoModel.maxLimit);
    if (pattern.test(minVal.replace(/,/g, '')) && pattern.test(maxVal.replace(/,/g, '')) && validRange) {
      if (minValue >= 0 && maxValue >= 0) {
        if (minValue < maxValue) {
          if (control === 'mileageRangeFrom' || control === 'mileageRangeTo') {
            this.additionalInfoModel.mileageInvalidFlag = false;
            this.setErrorsNull(minValueField, maxValueField);
          } else {
            this.additionalInfoModel.weightInvalidFlag = false;
            this.setErrorsNull(minValueField, maxValueField);
            AdditionalInfoUtility.setWeightUnitValidation(this.additionalInfoModel);
          }

        } else {
          if (control === 'mileageRangeFrom' || control === 'mileageRangeTo') {
            this.additionalInfoModel.mileageInvalidFlag = true;
          } else {
            this.additionalInfoModel.weightInvalidFlag = true;
          }
          this.setValidErrors(minValueField, maxValueField);
        }
      } else {
        this.checkFieldValidity(minValueField, maxValueField, control);
      }
    } else {
      if (control === 'mileageRangeFrom' || control === 'mileageRangeTo') {
        this.additionalInfoModel.mileageInvalidFlag = true;
      } else {
        this.additionalInfoModel.weightInvalidFlag = true;
      }
      this.setValidErrors(minValueField, maxValueField);
    }
  }
  setErrorsNull(minValueField: string, maxValueField: string) {
    this.additionalInfoModel.additionalInformationForm.controls[minValueField].markAsUntouched();
    this.additionalInfoModel.additionalInformationForm.controls[maxValueField].markAsUntouched();
    this.additionalInfoModel.additionalInformationForm.controls[minValueField].setErrors(null);
    this.additionalInfoModel.additionalInformationForm.controls[maxValueField].setErrors(null);
  }
  setValidErrors(minValueField: string, maxValueField: string) {
    this.additionalInfoModel.additionalInformationForm.controls[minValueField].markAsTouched();
    this.additionalInfoModel.additionalInformationForm.controls[minValueField].setErrors({ invalid: true });
    this.additionalInfoModel.additionalInformationForm.controls[maxValueField].markAsTouched();
    this.additionalInfoModel.additionalInformationForm.controls[maxValueField].setErrors({ invalid: true });
  }
  checkFieldValidity(minValueField: string, maxValueField: string, control: string) {
    const minVal = this.additionalInfoModel.additionalInformationForm.controls[minValueField].value;
    const maxVal = this.additionalInfoModel.additionalInformationForm.controls[maxValueField].value;
    const minValue = parseInt(minVal.replace(/,/g, ''), 10);
    const maxValue = parseInt(maxVal.replace(/,/g, ''), 10);
    if (isNaN(minValue) && isNaN(maxValue)) {
      if (control === 'mileageRangeFrom' || control === 'mileageRangeTo') {
        this.additionalInfoModel.mileageInvalidFlag = false;
        this.setErrorsNull(minValueField, maxValueField);
      } else {
        if (this.additionalInfoModel.unitOfWeight) {
          AdditionalInfoUtility.setWeightUnitValidation(this.additionalInfoModel);
        } else {
          this.additionalInfoModel.weightInvalidFlag = false;
          this.additionalInfoModel.additionalInformationForm.controls['weightUnitOfMeasure'].setValidators(null);
          this.additionalInfoModel.additionalInformationForm.controls['weightUnitOfMeasure'].setErrors(null);
          this.additionalInfoModel.additionalInformationForm.controls['weightUnitOfMeasure'].markAsUntouched();
          this.setErrorsNull(minValueField, maxValueField);
        }
      }
    } else {
      if (control === 'mileageRangeFrom' || control === 'mileageRangeTo') {
        this.additionalInfoModel.mileageInvalidFlag = true;
      } else {
        this.additionalInfoModel.weightInvalidFlag = true;
      }
      this.setValidErrors(minValueField, maxValueField);
    }
  }
  onChangeBillToCode(event) {
    this.additionalInfoModel.billToCodes = [];
    if (event && event['value'] && event['value'].length > 0) {
      event['value'].forEach((code: any) => {
        this.additionalInfoModel.billToCodes.push(code);
      });
    }
  }
  onChangeCarriers(event) {
    this.additionalInfoModel.carriers = [];
    if (event && event['value'] && event['value'].length > 0) {
      event['value'].forEach((code: any) => {
        this.additionalInfoModel.carriers.push(code);
      });
    }
  }
  onChangeCheckboxList(event, field: string) {
    this.additionalInfoModel.additionalInformationForm.markAsDirty();
    switch (field) {
      case 'Hazmat Included':
        this.additionalInfoModel.additionalInfoReqParam['hazmatIncludedIndicator'] = (event) ? 'Y' : 'N';
        break;
      case 'Fuel Included':
        this.additionalInfoModel.additionalInfoReqParam['fuelIncludedIndicator'] = (event) ? 'Y' : 'N';
        break;
      case this.autoInvoice:
        this.additionalInfoModel.additionalInfoReqParam['autoInvoiceIndicator'] = (event) ? 'Y' : 'N';
        break;
      default:
        break;
    }
  }
  public onClickReview(isSaveDraft?: string) {
    if ((this.additionalInfoModel.linehaulOverviewData['originType'].includes('Region') ||
    this.additionalInfoModel.linehaulOverviewData['destinationType'].includes('Region')) && !isSaveDraft) {
          this.toastMessage(this.messageService, 'error', 'Screens are under development');
        } else {
          this.additionalInfoModel.isReviewBtnClicked = true;
          this.constructReviewData(isSaveDraft);
        }
  }
  private setWeightRange() {
    if (this.additionalInfoModel.additionalInfoReqParam['unitOfWeightMeasurement']) {
      this.additionalInfoModel.additionalInfoReqParam['unitOfWeightMeasurement']['lineHaulWeightRangeMinQuantity'] =
        this.removeDelimiters(this.additionalInfoModel.additionalInformationForm.
          controls['weightRangeFrom'].value);
      this.additionalInfoModel.additionalInfoReqParam['unitOfWeightMeasurement']['lineHaulWeightRangeMaxQuantity'] =
        this.removeDelimiters(this.additionalInfoModel.additionalInformationForm.
          controls['weightRangeTo'].value);
    }
  }
  private validateWeightRange() {
    if (((this.additionalInfoModel.weightMinRange && this.additionalInfoModel.weightMaxRange) &&
      (!this.additionalInfoModel.unitOfWeight)) || ((this.additionalInfoModel.unitOfWeight) &&
        (!this.additionalInfoModel.weightMinRange && !this.additionalInfoModel.weightMaxRange)) ||
      (this.additionalInfoModel.weightInvalidFlag)) {
      this.validToastMessage(this.messageService, 'Valid Information Needed',
        'Provide valid information in the highlighted fields and submit the form again');
      this.additionalInfoModel.isbackBtnclicked = false;
    }
  }

  validateMileageRange() {
    if (this.additionalInfoModel.mileageInvalidFlag) {
      this.validToastMessage(this.messageService, 'Valid Information Needed',
        'Provide valid information in the highlighted fields and submit the form again');
      this.additionalInfoModel.isbackBtnclicked = false;
    }
  }

  private setMileageRange() {
    if (this.additionalInfoModel.additionalInfoReqParam['mileagePreference']) {
      this.additionalInfoModel.additionalInfoReqParam['mileagePreference']['mileagePreferenceMinRange'] =
        this.removeDelimiters(this.additionalInfoModel.additionalInformationForm.
          controls['mileageRangeFrom'].value);
      this.additionalInfoModel.additionalInfoReqParam['mileagePreference']['mileagePreferenceMaxRange'] =
        this.removeDelimiters(this.additionalInfoModel.additionalInformationForm.
          controls['mileageRangeTo'].value);
    } else {
      this.additionalInfoModel.additionalInfoReqParam['mileagePreference'] = {
        'mileagePreferenceMinRange': this.removeDelimiters(this.additionalInfoModel.additionalInformationForm.
          controls['mileageRangeFrom'].value),
        'mileagePreferenceMaxRange': this.removeDelimiters(this.additionalInfoModel.additionalInformationForm.
          controls['mileageRangeTo'].value)
      };
    }
  }

  onClickCancel() {
    this.additionalInfoModel.isCancelClicked = true;
    const lineHaulDetailsData = this.viewAgreementUtilityService.getEditLineHaulData();
    const cancelreviewStatus = this.viewAgreementUtilityService.getreviewCancelStatus();
    if (this.additionalInfoModel.additionalInformationForm.dirty) {
      this.additionalInfoModel.showCancelPopup = true;
      this.additionalInfoModel.routingUrl = cancelreviewStatus ? this.reviewUrl : this.agreementUrl;
    } else if (lineHaulDetailsData !== undefined && lineHaulDetailsData.isEditFlag) {
      this.additionalInfoModel.isDraft = (this.linehaulStatus === 'Draft') ? 'Y' : 'N';
      this.constructReviewData('Save Draft');
    } else {
      this.additionalInfoModel.isDetailsSaved = true;
      this.navigateLineHaul();
    }
  }
  onClickDontSave() {
    this.constructReviewData('Save Draft');
  }
  private naviagte() {
    this.additionalInfoModel.isDetailsSaved = true;
    if (this.additionalInfoModel.routingUrl === this.agreementUrl) {
      this.router.navigate([this.agreementUrl], { queryParams: { id: this.additionalInfoModel.customerAgreementId } });
    } else if (this.additionalInfoModel.routingUrl === this.reviewUrl) {
      this.router.navigate([this.reviewUrl], { queryParams: { id: this.additionalInfoModel.customerAgreementId } });
    } else {
      const cancelreviewStatus = this.viewAgreementUtilityService.getreviewCancelStatus();
      if (cancelreviewStatus) {
        this.additionalInformationService.saveDraftInfo('draft')
          .pipe(takeWhile(() => this.additionalInfoModel.subscriberFlag))
          .subscribe((response: any) => {
            this.router.navigate([this.additionalInfoModel.routingUrl]);
          }, (error: HttpErrorResponse) => {
          });
      } else {
        this.router.navigate([this.agreementUrl], { queryParams: { id: this.additionalInfoModel.customerAgreementId } });
      }
    }
  }

  onClickDontSaveOverride() {
    this.additionalInfoModel.isCancelClickedonOverride = false;
    this.additionalInfoModel.isSaveDraftClicked = false;
  }
  onClickAddNew() {
    this.additionalInfoModel.isPageLoaded = true;
    this.changeDetector.detectChanges();
    this.additionalInfoModel.showDuplicatePopup = false;
    this.additionalInfoModel.additionalInfoReqParam['overridenPriorityNumber'] = null;
    this.additionalInformationService.saveAdditionalInfo(this.additionalInfoModel.additionalInfoReqParam,
      this.additionalInfoModel.lineHaulConfigurationId, 'Y', this.additionalInfoModel.isDraft)
      .pipe(takeWhile(() => this.additionalInfoModel.subscriberFlag))
      .subscribe((response: any) => {
        this.clickAddNewOnSuccess(response);
      }, (error: HttpErrorResponse) => {
        this.additionalInfoModel.additionalInfoReqParam['overridenPriorityNumber'] = null;
        this.additionalInfoModel.isPageLoaded = false;
        this.handleError(error);
        this.changeDetector.detectChanges();
      });
  }
  clickAddNewOnSuccess(response) {
    const source = timer(2500);
    source.subscribe(val => {
      this.addNewSuccess(response);
    });
  }
  addNewSuccess(response) {
    this.additionalInfoModel.isPageLoaded = false;
    this.additionalInfoModel.isDetailsSaved = true;
    this.additionalInfoModel.isChangesSaving = true;
    this.changeDetector.detectChanges();
    if (response && response['status'] === 'warning') {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: response['message'] });
    } else if (response && response['status'] === 'success') {
      const successMessage = 'You have successfully added additional information';
      this.messageService.add({ severity: 'success', summary: 'Additional information added', detail: successMessage });
    }
    if (this.additionalInfoModel.isSaveDraftClicked) {
      this.router.navigate([this.agreementUrl],
        { queryParams: { id: this.additionalInfoModel.customerAgreementId } });
    } else {
    this.router.navigate(['viewagreement/review'], { queryParams: { id: this.additionalInfoModel.customerAgreementId } });
    }
  }
  onClickOverride() {
    this.additionalInfoModel.showDuplicatePopup = false;
    this.additionalInfoModel.isCancelClickedonOverride = false;
    this.additionalInfoModel.overrideForm.reset();
    const priorityArray = utils.range(71);
    this.additionalInfoModel.priorityList = [];
    utils.each(priorityArray, (value) => {
      if (this.additionalInfoModel && value !== this.additionalInfoModel.availablePriorityOrder &&
        value !== this.additionalInfoModel.availableOverriddenPriorityNumber) {
        this.additionalInfoModel.priorityList.push({ label: value, value: value });
      }
    });
    this.additionalInfoModel.filterOverride = this.additionalInfoModel.priorityList;
    this.additionalInfoModel.showConfirmOverridePopup = true;
  }
  onSelectMileagePreference(event: Event) {
    this.additionalInfoModel.additionalInfoReqParam['mileagePreference'] = {
      'mileagePreferenceID': event['label'],
      'mileagePreferenceName': event['value']
    };
  }
  onSelectWeightUnitMeasure(event: Event) {
    this.additionalInfoModel.additionalInfoReqParam['unitOfWeightMeasurement'] = {
      'code': event['label'],
      'description': event['value']
    };
    this.additionalInfoModel.unitOfWeight = event['value'];
    this.additionalInfoModel.additionalInformationForm.controls['weightUnitOfMeasure'].setValidators(null);
    this.additionalInfoModel.additionalInformationForm.controls['weightUnitOfMeasure'].markAsUntouched();
  }
  fetchMileagePreference() {
    this.additionalInformationService.getMileagePreferences(this.additionalInfoModel.customerAgreementId)
      .pipe(takeWhile(() => this.additionalInfoModel.subscriberFlag))
      .subscribe((response: MileagePreferenceRequest[]) => {
        this.additionalInfoModel.MileageList = [];
        response.forEach((element: MileagePreferenceRequest) => {
          this.additionalInfoModel.MileageList.push({
            label: element['mileagePreferenceID'],
            value: element['mileagePreferenceName']
          });
        });
        this.changeDetector.detectChanges();
      }, (error: Error) => {
        this.toastMessage(this.messageService, 'error', error.message);
      });
  }
  getMileagePreferenceList(event) {
    this.additionalInfoModel.mileagePreferenceList = [];
    this.additionalInfoModel.MileageList.forEach((element) => {
      if (element.value && element.value.toString().toLowerCase().indexOf(event['query'].toLowerCase()) > -1) {
        this.additionalInfoModel.mileagePreferenceList.push({
          label: element.label,
          value: element.value
        });
      }
    });
  }
  onClearDropDown(control: string) {
    switch (control) {
      case 'mileagePreference':
        if (this.additionalInfoModel.additionalInfoReqParam['mileagePreference'] !== null) {
          this.additionalInfoModel.additionalInfoReqParam['mileagePreference']['mileagePreferenceID'] = null;
          this.additionalInfoModel.additionalInfoReqParam['mileagePreference']['mileagePreferenceName'] = null;
        }
        this.additionalInfoModel.additionalInformationForm['controls']['mileagePreference'].setValue(null);
        break;
      case 'priority':
        this.additionalInfoModel.overrideForm['controls'][control].setValue('');
        this.additionalInfoModel.additionalInfoReqParam['overridenPriorityNumber'] = null;
        this.additionalInfoModel.overrideForm['controls'][control].updateValueAndValidity();
        break;
      case 'weightUnitOfMeasure':
        if (this.additionalInfoModel.additionalInfoReqParam['unitOfWeightMeasurement'] !== null) {
          this.additionalInfoModel.additionalInfoReqParam['unitOfWeightMeasurement']['code'] = null;
          this.additionalInfoModel.additionalInfoReqParam['unitOfWeightMeasurement']['description'] = null;
        }
        this.additionalInfoModel.unitOfWeight = '';
        this.additionalInfoModel.additionalInformationForm['controls']['weightUnitOfMeasure'].setValue(null);
        break;
    }
  }
  getWeightUnits() {
    this.additionalInfoModel.isPageLoaded = true;
    this.additionalInformationService.getWeightUnits().pipe(takeWhile(() => this.additionalInfoModel.subscriberFlag))
      .subscribe((data: WeightUnit[]) => {
        data.forEach((unit: WeightUnit) => {
          this.additionalInfoModel.weightUnit.push({
            label: unit['code'],
            value: unit['description'],
          });
        });
        this.changeDetector.detectChanges();
      }, (error: Error) => {
        this.toastMessage(this.messageService, 'error', error.message);
      });
  }
  getWeightUnitMeasure(event: Event) {
    this.additionalInfoModel.weightUnitList = [];
    this.additionalInfoModel.weightUnit.forEach((element) => {
      if (element.value && element.value.toString().toLowerCase().indexOf(event['query'].toLowerCase()) > -1) {
        this.additionalInfoModel.weightUnitList.push({
          label: element.label,
          value: element.value
        });
      }
    });
  }
  additionalInfoFormInitialization() {
    this.additionalInfoModel.additionalInformationForm = this.formBuilder.group({
      billToCode: [''],
      carrierCode: [''],
      mileagePreference: [''],
      mileageRangeFrom: [''],
      mileageRangeTo: [''],
      weightRangeFrom: [''],
      weightRangeTo: [''],
      weightUnitOfMeasure: ['']
    });
    this.additionalInfoModel.overrideForm = this.formBuilder.group({
      priority: ['', Validators.required]
    });
  }
  populateInputFields() {
    this.fetchBillToCode();
    this.fetchCarrierList();
    this.fetchMileagePreference();
    this.getWeightUnits();
  }
  fetchBillToCode() {
    const lineHaulDateRange = this.viewAgreementUtilityService.getLineHaulDates();
    this.additionalInformationService.getBillToCodes(this.additionalInfoModel.sectionId,
      lineHaulDateRange.effectiveDate, lineHaulDateRange.expirationDate)
      .pipe(takeWhile(() => this.additionalInfoModel.subscriberFlag))
      .subscribe((response: BillToCodeList[]) => {
        response.forEach((element: BillToCodeList) => {
          const billToCode = `${element['billToName']} (${element['billToCode']})`;
          this.additionalInfoModel.billToCodeList.push({
            label: billToCode,
            value: {
              'billToID': element['billToID'],
              'billToName': element['billToName'],
              'billToCode': element['billToCode']
            }
          });
        });
        this.changeDetector.detectChanges();
      }, (error: Error) => {
        this.toastMessage(this.messageService, 'error', error.message);
      });
  }
  fetchCarrierList() {
    const carrierParam = CarrierQuery.carrierData();
    this.additionalInformationService.getCarriers(carrierParam).pipe(takeWhile(() => this.additionalInfoModel.subscriberFlag))
      .subscribe((response: ElasticRootObject) => {
        this.additionalInfoModel.carrierList = [];
        const carriers = response['hits']['hits'];
        carriers.forEach((element: HitsArray) => {
          this.additionalInfoModel.carrierList.push({
            label: `${element['_source']['LegalName']} (${element['_source']['CarrierCode']})`,
            value: {
              'id': element['_source']['CarrierID'],
              'name': element['_source']['LegalName'],
              'code': element['_source']['CarrierCode']
            }
          });
        });
        this.changeDetector.detectChanges();
      }, (error: Error) => {
        this.toastMessage(this.messageService, 'error', error.message);
      });
  }
  saveAdditionalInformation() {
    this.additionalInfoModel.isPageLoaded = true;
    this.changeDetector.detectChanges();
    this.additionalInfoModel.additionalInfoReqParam['customerLineHaulConfigurationID'] = this.additionalInfoModel.lineHaulConfigurationId;
    this.additionalInformationService.saveAdditionalInfo(this.additionalInfoModel.additionalInfoReqParam,
      this.additionalInfoModel.lineHaulConfigurationId, 'N', this.additionalInfoModel.isDraft)
      .pipe(takeWhile(() => this.additionalInfoModel.subscriberFlag))
      .subscribe((response: ReqParam) => {
        if (this.additionalInfoModel.isDraft === 'Y' && !this.additionalInfoModel.isbackBtnclicked) {
          this.additionalInfoModel.isPageLoaded = false;
          const successMessage = 'Line Haul saved as draft';
          this.messageService.add({ severity: 'success', summary: 'Line Haul Saved', detail: successMessage });
          this.naviagte();
        } else {
          this.saveAdditionalInfoOnSuccess(response);
        }
      }, (error: HttpErrorResponse) => {
        this.additionalInfoModel.isPageLoaded = false;
        this.handleError(error);
        this.changeDetector.detectChanges();
      });
  }
  saveAdditionalInfoOnSuccess(saveResponse: ReqParam) {
    this.saveAdditionInfoSucess(saveResponse);
  }
  saveAdditionInfoSucess(saveResponse: ReqParam) {
    this.additionalInfoModel.isPageLoaded = false;
    if (saveResponse && saveResponse['duplicateFlag']) {
      this.additionalInfoModel.showDuplicatePopup = true;
      this.additionalInfoModel.duplicateMessage = saveResponse['duplicateErrorMessage'];
      this.additionalInfoModel.availableOverriddenPriorityNumber = saveResponse['existingOverriddenPriorityNumber'];
    } else {
      this.noDuplicateResponse(saveResponse);
    }
    this.changeDetector.detectChanges();
  }
  noDuplicateResponse(saveResponse: ReqParam) {
    this.additionalInfoModel.isDetailsSaved = true;
    if (!this.additionalInfoModel.isbackBtnclicked) {
      if (saveResponse && saveResponse['status'] === 'warning') {
        this.additionalInfoModel.isPageLoaded = false;
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: saveResponse['message'] });
      } else if (saveResponse && saveResponse['status'] === 'success') {
        this.additionalInfoModel.isReviewBtnClicked = false;
        this.showSuccessMsg();
      }
      const getReviewstatus = this.viewAgreementUtilityService.getreviewwizardStatus();
      if (getReviewstatus !== undefined) {
        this.additionalInfoModel.reviewWizardStatus = {
          'isAdditionalInfo': false,
          'isLineHaulReviewed': false,
          'isLaneCardInfo': false
        };
        this.viewAgreementUtilityService.setreviewwizardStatus(this.additionalInfoModel.reviewWizardStatus);
      }
      if (this.additionalInfoModel.isSaveDraftClicked) {
        this.router.navigate([this.agreementUrl], { queryParams: { id: this.additionalInfoModel.customerAgreementId } });
      } else {
        this.router.navigate([this.reviewUrl], { queryParams: { id: this.additionalInfoModel.customerAgreementId } });
      }
    } else {
      this.backBtnNavigation();
    }
  }
  routeQueryParams() {
    this.route.queryParams.pipe(takeWhile(() => this.additionalInfoModel.subscriberFlag)).subscribe(
      (queryParam: any) => {
        if (!utils.isEmpty(queryParam['id']) && !utils.isEmpty(queryParam['sectionID'])) {
          this.additionalInfoModel.customerAgreementId = queryParam['id'];
          this.additionalInfoModel.sectionId = queryParam['sectionID'];
        }
      });
  }
  getLineHaulConfigurationID() {
    this.additionalInfoModel.lineHaulConfigurationDetails = this.viewAgreementUtilityService.getConfigurationID();
    this.additionalInfoModel.lineHaulConfigurationId = (this.additionalInfoModel.lineHaulConfigurationDetails &&
      this.additionalInfoModel.lineHaulConfigurationDetails['customerLineHaulConfigurationID']) ?
      this.additionalInfoModel.lineHaulConfigurationDetails['customerLineHaulConfigurationID'] : null;
  }
  getLineHaulPriorityNumber() {
    this.additionalInformationService.getPriorityNumber(this.additionalInfoModel.lineHaulConfigurationId)
      .pipe(takeWhile(() => this.additionalInfoModel.subscriberFlag))
      .subscribe((response: any) => {
        this.additionalInfoModel.availablePriorityOrder = response;
      }, (error: Error) => {
        this.toastMessage(this.messageService, 'error', error.message);
      });
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

  validToastMessage(messageService: MessageService, msgSummary: string, data: string) {
    const message = {
      severity: 'error',
      summary: msgSummary,
      detail: data
    };
    messageService.clear();
    messageService.add(message);
  }
  handleError(error: HttpErrorResponse) {
    if (!utils.isEmpty(error.error) && !utils.isEmpty(error.error.errors)) {
      this.messageService.clear();
      this.messageService.add({
        severity: 'error',
        summary: error.error.errors[0].errorType,
        detail: error.error.errors[0].errorMessage
      });
      this.additionalInfoModel.additionalInformationForm.markAsPristine();
    }
  }
  setDefaultValues() {
    this.additionalInfoModel.checkBoxValue.push(this.autoInvoice);
    this.additionalInfoModel.additionalInfoReqParam['autoInvoiceIndicator'] = 'Y';
  }
  filterPriority(event) {
    this.additionalInfoModel.filteredList = [];
    this.additionalInfoModel.filterOverride.forEach((element) => {
      if ((element.value || element.value === 0) && element.value.toString().toLowerCase().indexOf(event['query'].toLowerCase()) > -1) {
        this.additionalInfoModel.filteredList.push({ label: element.label.toString(), value: element.value.toString() });
      }
    });
  }
  onSelectOverriddenPriority() {
    const priority = parseInt(this.additionalInfoModel.overrideForm.get('priority').value['value'], 10);
    const selectedOverridePriority = this.priorityFramer(priority);
    this.additionalInfoModel.additionalInfoReqParam['priorityNumber'] = this.additionalInfoModel.availablePriorityOrder;
    this.additionalInfoModel.additionalInfoReqParam['overridenPriorityNumber'] = selectedOverridePriority;
  }
  onClickOverrideSave() {
    if (utils.isEmpty(this.additionalInfoModel.overrideForm.get('priority').value)) {
      this.additionalInfoModel.overrideForm.get('priority').markAsTouched();
      this.additionalInfoModel.isCancelClickedonOverride = false;
      this.additionalInfoModel.showConfirmOverridePopup = true;
    } else {
      this.saveOverRiddenPriority();
    }
  }
  onClickConfirmOverride() {
    if (utils.isEmpty(this.additionalInfoModel.overrideForm.get('priority').value)) {
      this.additionalInfoModel.overrideForm.get('priority').markAsTouched();
      this.additionalInfoModel.overrideForm.get('priority').setValidators([Validators.required]);
    } else {
      this.saveOverRiddenPriority();
    }
  }
  priorityFramer(value: number): number {
    let priorityValue = null;
    if (value === 0) {
      priorityValue = value;
    } else if (value) {
      priorityValue = value;
    }
    return priorityValue;
  }
  saveOverRiddenPriority() {
    this.additionalInfoModel.isPageLoaded = true;
    this.changeDetector.detectChanges();
    this.additionalInfoModel.showConfirmOverridePopup = false;
    this.additionalInfoModel.isCancelClickedonOverride = false;
    this.additionalInformationService.saveAdditionalInfo(this.additionalInfoModel.additionalInfoReqParam,
      this.additionalInfoModel.lineHaulConfigurationId, 'Y', this.additionalInfoModel.isDraft)
      .pipe(takeWhile(() => this.additionalInfoModel.subscriberFlag))
      .subscribe((response: any) => {
        this.saveOverRiddenPriorityOnSuccess(response);
      }, (error: HttpErrorResponse) => {
        this.additionalInfoModel.isPageLoaded = false;
        this.additionalInfoModel.additionalInfoReqParam['overridenPriorityNumber'] = null;
        this.handleError(error);
        this.changeDetector.detectChanges();
      });
  }
  saveOverRiddenPriorityOnSuccess(response) {
    this.additionalInfoModel.isDetailsSaved = true;
    this.additionalInfoModel.isChangesSaving = true;
    this.changeDetector.detectChanges();
    if (response && response['status'] === 'warning') {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: response['message'] });
    } else if (response && response['status'] === 'success') {
      this.messageService.add({
        severity: 'success', summary: 'Priority Overridden',
        detail: 'You have successfully overridden the Line Haul priority'
      });
    }
    this.additionalInfoModel.overrideForm.get('priority').markAsUntouched();
    const source = timer(2500);
    if (this.additionalInfoModel.isSaveDraftClicked) {
      this.router.navigate([this.agreementUrl],
        { queryParams: { id: this.additionalInfoModel.customerAgreementId } });
    } else {
    source.subscribe(val => {
      this.additionalInfoModel.isPageLoaded = false;
      this.router.navigate([this.reviewUrl], { queryParams: { id: this.additionalInfoModel.customerAgreementId } });
    });
  }
  }
  onCancelPriority() {
    this.additionalInfoModel.isCancelClickedonOverride = true;
    this.additionalInfoModel.showConfirmOverridePopup = false;
    this.additionalInfoModel.isSaveDraftClicked = false;
  }

  setPatchValuesForEdit() {
    const linehaulEditStatus = this.viewAgreementUtilityService.getlineHaulStatus();
    if (linehaulEditStatus !== undefined && linehaulEditStatus.isLineHaulEdit) {
      let weightunitValue = null;
      let carrierValue = [];
      let billToValue = [];
      this.shared.on<LineHaulValues>('linehaulOverView').pipe(takeWhile(() => this.additionalInfoModel.subscriberFlag))
      .subscribe((linehaulOverviewData: LineHaulValues) => {
        if (!utils.isEmpty(linehaulOverviewData)) {
          this.additionalInfoModel.isPageLoaded = true;
          this.linehaulStatus = linehaulOverviewData.status;
          const mileagePreferenceValue = this.getMileagePreference(linehaulOverviewData);
          const mileagepreMinRange = this.getMileageRange(linehaulOverviewData, 'lineHaulMileageRangeMinQuantity');
          const mileagepreMaxRange = this.getMileageRange(linehaulOverviewData, 'lineHaulMileageRangeMaxQuantity');
          weightunitValue = this.setUnitMeasure(linehaulOverviewData);
          const weightMinRange = this.setMinWeightRange(linehaulOverviewData);
          const weightMaxRange = this.setMaxWeightRange(linehaulOverviewData);
          const editCarrierCodeList = AdditionalInfoUtility.getEditCarrierCodeList(linehaulOverviewData, this.additionalInfoModel);
          carrierValue = editCarrierCodeList;
          const editbillToValue = AdditionalInfoUtility.getEditBillToCodeList(linehaulOverviewData, this.additionalInfoModel);
          billToValue = editbillToValue;
          this.additionalInfoModel.additionalInformationForm.patchValue({
            mileageRangeFrom: mileagepreMinRange,
            mileageRangeTo: mileagepreMaxRange,
            weightRangeFrom: weightMinRange,
            weightRangeTo: weightMaxRange,
            weightUnitOfMeasure: weightunitValue,
            mileagePreference: mileagePreferenceValue,
            carrierCode: carrierValue,
            billToCode: billToValue
          });
          this.setIndicators(linehaulOverviewData);
          this.setModelValues(linehaulOverviewData, billToValue, carrierValue);
          this.additionalInfoModel.isPageLoaded = false;
        }
      });
    }
    this.additionalInfoModel.isPageLoaded = false;
  }

  private setUnitMeasure(linehaulOverviewData: LineHaulValues) {
    let weightunitValue = null;
    if (linehaulOverviewData.unitOfMeasurement != null) {
      weightunitValue = {
        'label': linehaulOverviewData.unitOfMeasurement['code'],
        'value': linehaulOverviewData.unitOfMeasurement['code']
      };
      this.additionalInfoModel.unitOfWeight = weightunitValue['label'];
    } else {
      this.additionalInfoModel.unitOfWeight = '';
    }
    return weightunitValue;
  }

  private getMileagePreference(linehaulOverviewData: LineHaulValues) {
    let mileagePreferenceValue = null;
    if (linehaulOverviewData.mileagePreference !== null) {
      mileagePreferenceValue = {
        'label': linehaulOverviewData.mileagePreference['mileagePreferenceID'],
        'value': linehaulOverviewData.mileagePreference['mileagePreferenceName']
      };
    }
    return mileagePreferenceValue;
  }

  private getMileageRange(linehaulOverviewData: LineHaulValues, range: string) {
    let mileageRange;
    if (linehaulOverviewData.mileagePreference && linehaulOverviewData.mileagePreference[range] !== null) {
      mileageRange = AdditionalInfoUtility.thousandSeperator(linehaulOverviewData.mileagePreference[range].toString());
    } else {
      mileageRange = '';
    }
    return mileageRange;
  }

  private setMaxWeightRange(linehaulOverviewData: LineHaulValues) {
    let weightMaxRange;
    if (linehaulOverviewData.unitOfMeasurement !== null) {
      weightMaxRange = AdditionalInfoUtility.
      thousandSeperator(linehaulOverviewData.unitOfMeasurement['lineHaulWeightRangeMaxQuantity'].toString());
      this.additionalInfoModel.weightMaxRange = weightMaxRange;
    } else {
      weightMaxRange = '';
    }
    return weightMaxRange;
  }

  private setMinWeightRange(linehaulOverviewData: LineHaulValues) {
    let weightMinRange;
    if (linehaulOverviewData.unitOfMeasurement !== null) {
      weightMinRange = AdditionalInfoUtility.
      thousandSeperator(linehaulOverviewData.unitOfMeasurement['lineHaulWeightRangeMinQuantity'].toString());
      this.additionalInfoModel.weightMinRange = weightMinRange;
    } else {
      weightMinRange = '';
    }
    return weightMinRange;
  }

  private setModelValues(linehaulOverviewData: LineHaulValues, billToValue: any[], carrierValue: any[]) {
    this.additionalInfoModel.additionalInfoReqParam['autoInvoiceIndicator'] =
      linehaulOverviewData.autoInvoiceIndicator === 'Yes' ? 'Y' : 'N';
    this.additionalInfoModel.additionalInfoReqParam['hazmatIncludedIndicator'] =
      linehaulOverviewData.hazmatIncludedIndicator === 'Yes' ? 'Y' : 'N';
    this.additionalInfoModel.additionalInfoReqParam['fuelIncludedIndicator'] =
      linehaulOverviewData.fuelIncludedIndicator === 'Yes' ? 'Y' : 'N';
    this.additionalInfoModel.billToCodes = billToValue;
    this.additionalInfoModel.carriers = carrierValue;
  }

  setIndicators(linehaulOverviewData: LineHaulValues) {
    if (linehaulOverviewData.autoInvoiceIndicator === 'Yes') {
      this.additionalInfoModel.checkBoxValue = [];
      this.additionalInfoModel.checkBoxValue.push(this.autoInvoice);
    } else {
      this.additionalInfoModel.checkBoxValue = utils.remove(this.additionalInfoModel.checkBoxValue, this.autoInvoice);
    }
    if (linehaulOverviewData.hazmatIncludedIndicator === 'Yes') {
      this.additionalInfoModel.checkBoxValue.push('Hazmat Included');
    }
    if (linehaulOverviewData.fuelIncludedIndicator === 'Yes') {
      this.additionalInfoModel.checkBoxValue.push('Fuel Included');
    }
    this.additionalInfoModel.checkBoxValue = utils.uniq(this.additionalInfoModel.checkBoxValue);
  }

  public onClickBack() {
    this.additionalInfoModel.isDetailsSaved = true;
      this.backBtnNavigation();
  }

  removeDelimiters(value: string) {
    let enteredAmount;
    if (typeof value === 'string' && value !== '') {
      enteredAmount = parseInt(value.replace(/,/g, ''), 10);
    } else {
      enteredAmount = value;
    }
    return enteredAmount;
  }

  setagreementDetails() {
    const linehaulConfigId = this.viewAgreementUtilityService.getConfigurationID();
    this.additionalInfoModel.linehaulDetailData = {
      'customerAgreementID': this.additionalInfoModel.customerAgreementId,
      'customerAgreementName': linehaulConfigId.customerAgreementName,
      'customerLineHaulConfigurationID': linehaulConfigId.customerLineHaulConfigurationID,
      'customerAgreementContractSectionID': this.additionalInfoModel.sectionId
    };
    this.viewAgreementUtilityService.setLineHaulData(this.additionalInfoModel.linehaulDetailData);
  }
  private navigateLineHaul() {
    const status = this.viewAgreementUtilityService.getreviewCancelStatus();
    if (status) {
      this.router.navigate([this.reviewUrl], { queryParams: { id: this.additionalInfoModel.customerAgreementId } });
    } else {
      this.router.navigate([this.agreementUrl],
        { queryParams: { id: this.additionalInfoModel.customerAgreementId } });
    }
  }

  constructReviewData(isSaveDraft: string) {
    this.additionalInfoModel.showCancelPopup = false;
    const billToList = utils.isEmpty(this.additionalInfoModel.additionalInformationForm.
      controls['billToCode'].value) ? [] : this.additionalInfoModel.additionalInformationForm.
        controls['billToCode'].value;
    const carrierList = utils.isEmpty(this.additionalInfoModel.additionalInformationForm.
      controls['carrierCode'].value) ? [] : this.additionalInfoModel.additionalInformationForm.
        controls['carrierCode'].value;
    this.additionalInfoModel.additionalInfoReqParam['billTos'] = billToList;
    this.additionalInfoModel.additionalInfoReqParam['carriers'] = carrierList;
    AdditionalInfoUtility.setMileagePreference(this.additionalInfoModel);
    this.setMileageRange();
    this.validateMileageRange();
    this.validateWeightRange();
    AdditionalInfoUtility.setWeightMeasurement(this.additionalInfoModel);
    this.setWeightRange();
    if (this.additionalInfoModel.additionalInformationForm.valid) {
      const lineHaulDetailsData = this.viewAgreementUtilityService.getEditLineHaulData();
      if (this.additionalInfoModel.isReviewBtnClicked) {
        this.additionalInfoModel.isDraft = 'N';
      } else if (lineHaulDetailsData !== undefined && lineHaulDetailsData.isEditFlag) {
        this.additionalInfoModel.isDraft = (this.linehaulStatus === 'Draft') ? 'Y' : 'N';
      } else {
        this.additionalInfoModel.isDraft = (isSaveDraft) ? 'Y' : 'N';
      }
      this.saveAdditionalInformation();
    }
  }

  backBtnNavigation() {
    this.additionalInfoModel.editLineHaulData = {
      'isEditFlag': true,
      'lineHaulDetails': this.additionalInfoModel.lineHaulConfigurationId
    };
    this.viewAgreementUtilityService.setEditLineHaulData(this.additionalInfoModel.editLineHaulData);
    const getReviewstatus = this.viewAgreementUtilityService.getreviewwizardStatus();
    if (getReviewstatus !== undefined) {
      this.additionalInfoModel.reviewWizardStatus = {
        'isAdditionalInfo': false,
        'isLineHaulReviewed': getReviewstatus.isLineHaulReviewed,
        'isLaneCardInfo': getReviewstatus.isLaneCardInfo
      };
      this.viewAgreementUtilityService.setreviewwizardStatus(this.additionalInfoModel.reviewWizardStatus);
    }
    this.router.navigate(['/viewagreement/linehaul'], { queryParams: { id: this.additionalInfoModel.customerAgreementId } });
  }

  showSuccessMsg() {
    const linehaulEditStatus = this.viewAgreementUtilityService.getEditLineHaulData();
    if (linehaulEditStatus === undefined) {
      this.displaySuccessMsg();
    } else if (linehaulEditStatus !== undefined && linehaulEditStatus.isEditFlag &&
      this.additionalInfoModel.additionalInformationForm.dirty) {
      this.displaySuccessMsg();
    }
  }

  displaySuccessMsg() {
    if (!this.additionalInfoModel.isCancelClicked) {
    const successMessage = 'You have successfully added additional information';
    this.messageService.add({ severity: 'success', summary: 'Additional information added', detail: successMessage });
    }
  }

  onClickSaveDraft(isSaveDraft?: string) {
    this.additionalInfoModel.isSaveDraftClicked = true;
    this.constructReviewData(isSaveDraft);
  }

}
