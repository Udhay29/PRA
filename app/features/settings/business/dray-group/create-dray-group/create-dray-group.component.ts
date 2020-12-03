import { AfterViewInit, Component, ChangeDetectorRef, EventEmitter, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import * as moment from 'moment';
import * as utils from 'lodash';
import { takeWhile } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';
import { CreateDrayGroupUtilsService } from './service/create-dray-group-utils.service';
import { CreateDrayGroupService } from './service/create-dray-group.service';
import { DrayGroupModel } from './models/dray-group.model';
import { DragGroupSaveResponse } from './models/dray-group.interface';
import { detectChanges } from '@angular/core/src/render3';

@Component({
  selector: 'app-create-dray-group',
  templateUrl: './create-dray-group.component.html',
  styleUrls: ['./create-dray-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateDrayGroupComponent implements OnInit, AfterViewInit {

  @Output() closeClickEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() CreateCloseClickEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() EnablePopup: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  drayGroupModel: DrayGroupModel;

  constructor(private readonly formBuilder: FormBuilder, private readonly drayGrpUtil: CreateDrayGroupUtilsService,
    private readonly changeDetector: ChangeDetectorRef, private readonly drayGroupService: CreateDrayGroupService,
    private readonly messageService: MessageService) {
    this.drayGroupModel = new DrayGroupModel();
  }

  ngOnInit() {
    this.initializeForm();
    this.setSuperUserBackDateDays();
    this.setSuperUserFutureDateDays();
    this.countryList();
    this.getRateScopeLabel();
  }

  onFormValueChange() {
    const formFields = ['drayGroupName', 'drayGroupCode', 'rateScopeTypeName', 'effectiveDate', 'expirationDate', 'drayGroupCountries'];
    formFields.forEach(fieldName => {
      this.drayGroupModel.drayGroupForm.controls[fieldName].valueChanges.subscribe(val => {
        if (this.drayGroupModel.drayGroupForm.controls[fieldName].dirty) {
          this.EnablePopup.emit(true);
        }
      });
    });
  }

  ngAfterViewInit() {
    this.onFormValueChange();
  }

  initializeForm() {
    this.drayGroupModel.drayGroupForm = this.formBuilder.group({
      drayGroupName: ['', Validators.required],
      drayGroupCode: ['', Validators.required],
      rateScopeTypeName: [false, Validators.required],
      effectiveDate: ['', Validators.required],
      expirationDate: ['', Validators.required],
      drayGroupCountries: ['', Validators.required]
    });
    this.setExpirationDate();
  }

  countryList() {
    this.drayGroupModel.isPageLoading = true;
    this.drayGroupService.getCountries().pipe(takeWhile(() => this.drayGroupModel.isSubscribe)).subscribe(data => {
      this.drayGroupModel.isPageLoading = false;
      if (!utils.isEmpty(data)) {
        const dataValues = data['_embedded']['countryTypes'];
        this.drayGroupModel.countries = dataValues.map(value => {
          return {
            drayGroupCountryCode: value['countryCode'],
            drayGroupCountryName: value['countryName']
          };
        });
      }
      this.drayGroupModel.countries = utils.sortBy(this.drayGroupModel.countries, ['drayGroupcountryName']);
      this.changeDetector.detectChanges();
    }, (error) => {
      this.drayGrpUtil.handleError(error, this.drayGroupModel, this.messageService, this.changeDetector);
    });
  }

  setSuperUserBackDateDays() {
    this.drayGroupService.getSuperUserBackDate()
      .pipe(takeWhile(() => this.drayGroupModel.drayGroupValidation.isSubscribeFlag))
      .subscribe((backDateRes) => {
        this.drayGroupModel.superUserBackDateDays =
          +backDateRes['_embedded']['configurationParameterDetails'][0]['configurationParameterValue'];
      }, (error) => {
        this.drayGrpUtil.handleError(error, this.drayGroupModel, this.messageService, this.changeDetector);
      });
  }

  setSuperUserFutureDateDays() {
    this.drayGroupService.getSuperFutureBackDate()
      .pipe(takeWhile(() => this.drayGroupModel.drayGroupValidation.isSubscribeFlag))
      .subscribe((backDateRes) => {
        this.drayGroupModel.superUserFutureDateDays =
          +backDateRes['_embedded']['configurationParameterDetails'][0]['configurationParameterValue'];
      }, (error) => {
        this.drayGrpUtil.handleError(error, this.drayGroupModel, this.messageService, this.changeDetector);
      }
      );
  }

  onTypeCountries(event) {
    this.drayGroupModel.countryFiltered = [];
    if (event && event.query && !utils.isEmpty((event.query.trim()))) {
      this.drayGroupModel.countries.forEach(element => {
        if (element.drayGroupCountryCode &&
          element.drayGroupCountryName.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.drayGroupModel.countryFiltered.push({
            drayGroupCountryCode: element.drayGroupCountryCode,
            drayGroupCountryName: element.drayGroupCountryName
          });
        }
      });
    } else if (!event.query) {
      this.drayGroupModel.countryFiltered = utils.cloneDeep(this.drayGroupModel.countries);
    }
    this.removeSelectedCountryFromSugg();
    this.changeDetector.detectChanges();
  }

  removeSelectedCountryFromSugg() {
    this.drayGroupModel.countryFiltered = utils.differenceBy(this.drayGroupModel.countryFiltered,
      this.drayGroupModel.drayGroupForm.controls['drayGroupCountries'].value, 'drayGroupCountryName');
  }

  getRateScopeLabel() {
    this.drayGroupModel.isPageLoading = true;
    this.drayGroupService.getRateScopeLabel().pipe(takeWhile(() => this.drayGroupModel.isSubscribe)).subscribe(data => {
      this.drayGroupModel.isPageLoading = false;
      if (!utils.isEmpty(data)) {
        this.drayGroupModel.rateScope = data['_embedded']['rateScopeTypes'];
        const defaultIndicatorY = utils.find(this.drayGroupModel.rateScope, ['defaultIndicator', 'Y']);
        if (defaultIndicatorY.rateScopeTypeName === 'One-Way') {
          this.drayGroupModel.drayGroupForm.controls['rateScopeTypeName'].setValue(true);
          this.scopeTypeIndicator(true);
        } else {
          this.drayGroupModel.drayGroupForm.controls['rateScopeTypeName'].setValue(false);
          this.scopeTypeIndicator(false);
        }
      }
    }, (error) => {
      this.drayGrpUtil.handleError(error, this.drayGroupModel, this.messageService, this.changeDetector);
    });
  }

  scopeTypeIndicator(checkIndicator: boolean) {
    this.drayGroupModel.scopeObj = [];
    if (checkIndicator) {
      const rateScopeLabelName = utils.find(this.drayGroupModel.rateScope, ['rateScopeTypeName', 'One-Way']);
      this.drayGroupModel.scopeObj.push({
        drayGroupCountryName: rateScopeLabelName.rateScopeTypeName,
        drayGroupCountryCode: rateScopeLabelName.rateScopeTypeID
      });
    } else {
      const rateScopeLabelName = utils.find(this.drayGroupModel.rateScope, ['rateScopeTypeName', 'Two-Way']);
      this.drayGroupModel.scopeObj.push({
        drayGroupCountryName: 'Two-Way',
        drayGroupCountryCode: rateScopeLabelName.rateScopeTypeID
      });
    }
  }

  onrateScopeChange(event) {
    this.scopeTypeIndicator(event.checked);
  }

  typedDateValidate(event, fieldName: string) {
    const regex = new RegExp('^(1[0-2]|0?[1-9])/(3[01]|[12][0-9]|0?[1-9])/[0-9]{4}$');
    if (fieldName === 'effectiveDate') {
      if (event.srcElement['value'] && regex.test(event['srcElement']['value'].trim()) &&
        this.drayGroupModel.drayGroupForm.controls['effectiveDate'].value) {
        this.drayGroupModel.drayGroupValidation.isInCorrectEffDateFormat = false;
        const effDate = new Date(event.srcElement['value']);
        this.drayGroupModel.drayGroupForm.controls['effectiveDate'].setValue(effDate);
        this.onDateSelected(event.srcElement['value'], 'effectiveDate');
      }
    } else {
      if (event.srcElement['value'] && regex.test(event.srcElement['value'].trim())
        && this.drayGroupModel.drayGroupForm.controls['expirationDate'].value) {
        this.drayGroupModel.drayGroupValidation.isInCorrectExpDateFormat = false;
        const expDate = new Date(event.srcElement['value']);
        this.drayGroupModel.drayGroupForm.controls['expirationDate'].setValue(expDate);
        this.onDateSelected(event.srcElement['value'], 'expirationDate');
      }
    }
  }

  onDateSelected(selectedDate: Date, fieldName: string) {
    if (fieldName.toLowerCase() === 'effectivedate') {
      this.drayGroupModel.drayGroupValidation.effectiveDate = this.dateFormatter(selectedDate);
      this.drayGroupModel.drayGroupValidation.expirationMinDate = new Date(selectedDate);
      this.setFormErrors();
      this.setValidation('expirationDate');
    } else if (fieldName.toLowerCase() === 'expirationdate') {
      this.drayGroupModel.drayGroupValidation.expirationDate = this.dateFormatter(selectedDate);
      this.drayGroupModel.drayGroupValidation.effectiveMaxDate = new Date(selectedDate);
      this.setFormErrors();
      this.setValidation('effectiveDate');
    }
  }

  validateDate(date, fieldName: string) {
    const currentEffectiveDate = this.drayGroupModel.drayGroupValidation.currentDate;
    const currentEndDate = this.drayGroupModel.drayGroupValidation.currentDate;
    if (fieldName === 'effectiveDate') {
      if (date < moment(currentEffectiveDate).subtract(this.drayGroupModel.superUserBackDateDays, 'days') ||
        date > moment(currentEndDate).add(this.drayGroupModel.superUserFutureDateDays, 'days')) {
        this.drayGroupModel.drayGroupValidation.isInValidEffDate = true;
      } else {
        this.drayGroupModel.drayGroupValidation.isInValidEffDate = false;
      }
    } else {
      this.validateExpirationDate(date);
    }
  }

  validateExpirationDate(date) {
    if (this.drayGroupModel.drayGroupForm.controls['effectiveDate'].value) {
      (date < moment(this.drayGroupModel.drayGroupForm.controls['effectiveDate'].value) ||
        date > moment(this.drayGroupModel.drayGroupValidation.maxExpirationDate)) ?
        this.drayGroupModel.drayGroupValidation.isInValidExpDate = true : this.drayGroupModel.drayGroupValidation.isInValidExpDate = false;
    } else if (utils.isEmpty(this.drayGroupModel.drayGroupForm.controls['effectiveDate'].value.trim())) {
      (date > this.drayGroupModel.drayGroupValidation.maxExpirationDate) ?
        this.drayGroupModel.drayGroupValidation.isInValidExpDate = true : this.drayGroupModel.drayGroupValidation.isInValidExpDate = false;
    }
  }

  dateFormatter(value: string | Date): string {
    return moment(value).format('MM/DD/YYYY');
  }

  validateEffectiveDate() {
    if (this.drayGroupModel.drayGroupForm.controls['effectiveDate'].value &&
      this.drayGroupModel.drayGroupForm.controls['expirationDate'].value &&
      (new Date(this.drayGroupModel.drayGroupForm.controls['effectiveDate'].value) >
        new Date(this.drayGroupModel.drayGroupForm.controls['expirationDate'].value))) {
      this.drayGroupModel.drayGroupValidation.isInValidDate = true;
    } else {
      this.drayGroupModel.drayGroupValidation.isInValidDate = false;
    }
  }

  setFormErrors() {
    const effError = (this.drayGroupModel.drayGroupValidation.isInValidEffDate ||
      this.drayGroupModel.drayGroupValidation.isInValidDate);
    const expError = (this.drayGroupModel.drayGroupValidation.isInValidExpDate ||
      this.drayGroupModel.drayGroupValidation.isInValidDate);
    this.drayGroupModel.drayGroupForm.controls.effectiveDate.setErrors(null);
    this.drayGroupModel.drayGroupForm.controls.expirationDate.setErrors(null);
    if (this.drayGroupModel.drayGroupForm.controls['expirationDate'].value
      > moment(this.drayGroupModel.drayGroupValidation.maxExpirationDate)) {
      this.drayGroupModel.drayGroupForm.controls.expirationDate.setErrors({ invalid: true });
      this.changeDetector.detectChanges();
    }
    if (effError) {
      this.drayGroupModel.drayGroupForm.controls.effectiveDate.setErrors({ invalid: true });
    }
    if (expError) {
      this.drayGroupModel.drayGroupForm.controls.expirationDate.setErrors({ invalid: true });
    }
    this.changeDetector.detectChanges();
  }

  setValidation(fieldName: string) {
    if (!this.drayGroupModel.drayGroupForm.controls[fieldName].value) {
      this.drayGroupModel.drayGroupForm.controls[fieldName].setErrors({
        'required': true
      });
    }
  }

  setExpirationDate() {
    this.drayGroupModel.drayGroupForm.controls['expirationDate']
      .setValue(this.dateFormatter(new Date(this.drayGroupModel.defaultExpirationDate)));
  }

  onClose() {
    if (this.drayGroupModel.drayGroupForm.dirty && this.drayGroupModel.drayGroupForm.touched) {
      this.drayGroupModel.isShowPopup = true;
    } else {
      this.drayGroupModel.drayGroupForm.reset();
      this.closeClickEvent.emit(false);
      this.setExpirationDate();
    }
  }

  onCheckEmptyData(fieldName) {
    if (utils.isEmpty(this.drayGroupModel.drayGroupForm.controls[fieldName].value.trim())) {
      this.drayGroupModel.drayGroupForm.controls[fieldName].setErrors({
        'required': true
      });
    }
  }

  onCreateClose() {
    this.drayGroupModel.drayGroupForm.reset();
    this.CreateCloseClickEvent.emit();
    this.setExpirationDate();
  }

  onClickPopupNo() {
    this.drayGroupModel.isShowPopup = false;
  }

  onClickPopupYes() {
    this.drayGroupModel.isShowPopup = false;
    this.drayGroupModel.drayGroupForm.reset();
    this.closeClickEvent.emit(false);
    this.EnablePopup.emit(false);
    this.setExpirationDate();
  }

  onSave() {
    if (this.drayGroupModel.drayGroupForm.valid) {
      this.saveDrayGroup();
    } else {
      this.markFormAsTouched();
      this.drayGrpUtil.fieldValidationMessage(this.messageService, 'error', this.drayGroupModel.mandatoryFieldsMsg);
    }
  }


  markFormAsTouched() {
    utils.forIn(this.drayGroupModel.drayGroupForm.controls, (value, name: string) => {
      this.drayGroupModel.drayGroupForm.controls[name].markAsTouched();
    });
  }

  saveDrayGroup() {
    this.drayGroupModel.isPageLoading = true;
    const params = this.drayGrpUtil.drayGroupPostFramer(this.drayGroupModel);
    this.drayGroupService.postDrayGroup(params).pipe(takeWhile(() =>
      this.drayGroupModel.isSubscribe))
      .subscribe((drayGroup: DragGroupSaveResponse) => {
        if (!utils.isEmpty(drayGroup)) {
          this.saveContractOnSuccess(drayGroup);
        }
        this.drayGroupModel.isPageLoading = false;
      }, (error) => {
        this.drayGrpUtil.handleError(error, this.drayGroupModel, this.messageService, this.changeDetector);
      }
      );
  }

  saveContractOnSuccess(response) {
    const successMsg = this.drayGroupModel.saveSuccessMessage;
    (response.status === 'Success') ? this.drayGrpUtil.toastMessage(this.messageService, 'success', successMsg) :
      this.drayGrpUtil.toastMessage(this.messageService, 'info', response.message);
    this.onCreateClose();
    this.changeDetector.detectChanges();
  }
}
