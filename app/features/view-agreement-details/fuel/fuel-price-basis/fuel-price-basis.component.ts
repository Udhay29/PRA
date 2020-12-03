import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';
import { HttpErrorResponse, HttpResponseBase } from '@angular/common/http';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, RouterStateSnapshot } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';
import { SelectItem } from 'primeng/api';

import { FuelPriceModel } from './model/fuel-price-model';
import { FuelPriceService } from './service/fuel-price.service';
import { FuelPriceUtility } from './service/fuel-price-utility';
import { Agreement, DayOfWeek, ResponseObject, RootObject, SelectButtonEvent, DistrictList, States } from './model/fuel-price-interface';
import { FuelPriceBasisUtility } from './service/fuel-price-basis-utility';
@Component({
  selector: 'app-fuel-price-basis',
  templateUrl: './fuel-price-basis.component.html',
  styleUrls: ['./fuel-price-basis.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuelPriceBasisComponent implements OnInit, OnDestroy {
  fuelPriceModel: FuelPriceModel;
  viewAgreement: string;
  constructor(private readonly shared: BroadcasterService,
    private readonly changeDetector: ChangeDetectorRef, private readonly router: Router,
    private readonly service: FuelPriceService, private readonly messageService: MessageService,
    private readonly formBuilder: FormBuilder) {
    this.fuelPriceModel = new FuelPriceModel();
    this.viewAgreement = '/viewagreement';
  }

  ngOnInit() {
    this.shared.on<Agreement>('agreementDetails').subscribe((agreementData: Agreement) => {
      this.fuelPriceModel.fuelProgramId = agreementData.fuelProgramID;
      this.fuelPriceModel.agreementId = agreementData.agreementID;
    });
    this.fuelPriceModel.fuelPriceForm = FuelPriceBasisUtility.getFormFields(this.formBuilder);
    this.getFuelPriceBasisType();
    this.getWeekToApply();
    this.getDayOfWeek();
    this.getPriceFactor();
    this.getPriceSource();
    FuelPriceUtility.setDefaultDelay(this.fuelPriceModel);
    this.navigationSubscription();
    this.saveSubscription();
    this.getRegionType();
    this.getDistrictList();
  }
  ngOnDestroy() {
    this.fuelPriceModel.isSubscribe = false;
  }
  /** function called when navigation changes and check whether the form field is touched
  * @memberof FuelSummaryComponent */
  navigationSubscription() {
    this.shared.on<RouterStateSnapshot>('navigationStarts').subscribe((value: RouterStateSnapshot) => {
      this.shared.broadcast('isChanged', this.fuelPriceModel.fuelPriceForm.dirty && this.fuelPriceModel.fuelPriceForm.touched);
      this.changeDetector.detectChanges();
    });
  }
  /***** @memberof FuelPriceBasisComponent*/
  saveSubscription() {
    this.shared.on<boolean>('loseChanges').subscribe((value: boolean) => {
      FuelPriceUtility.saveSubscription(value, this.fuelPriceModel);
    });
  }
  /**** * @memberof FuelPriceBasisComponent */
  getFuelPriceBasisType() {
    this.fuelPriceModel.fuelPriceType = [];
    this.fuelPriceModel.isPageLoading = true;
    this.service.getFuelPriceBasisType().pipe(takeWhile(() => this.fuelPriceModel.isSubscribe)).subscribe((data: ResponseObject) => {
      this.fuelPriceModel.isPageLoading = false;
      if (!utils.isEmpty(data) && !utils.isEmpty(data['_embedded']) && !utils.isEmpty(data['_embedded']['fuelProgramPriceBasisTypes'])) {
        FuelPriceUtility.formatPatchFuelPriceBasisType(data['_embedded']['fuelProgramPriceBasisTypes'], this.fuelPriceModel);
      }
      this.changeDetector.detectChanges();
    }, (error: HttpErrorResponse) => {
      this.fuelPriceModel.fuelPriceType = [];
      FuelPriceUtility.toastMessage(this.messageService, 'error', error.message);
      FuelPriceBasisUtility.errorHandling(this.fuelPriceModel, this.changeDetector);
    });
  }
  /**** * @memberof FuelPriceBasisComponent */
  getWeekToApply() {
    this.fuelPriceModel.weekToApplyList = [];
    this.fuelPriceModel.isPageLoading = true;
    this.service.getWeekToApply().pipe(takeWhile(() => this.fuelPriceModel.isSubscribe)).subscribe((data: ResponseObject) => {
      this.fuelPriceModel.isPageLoading = false;
      if (!utils.isEmpty(data) && !utils.isEmpty(data['_embedded']) && !utils.isEmpty(data['_embedded']['weekToApplyTypes'])) {
        this.fuelPriceModel.weekToApplyList = utils.cloneDeep(FuelPriceUtility.formatDropdownData(data['_embedded']
        ['weekToApplyTypes'], 'weekToApplyTypeName', 'weekToApplyTypeID'));
        FuelPriceUtility.setDefaultWeek(this.fuelPriceModel);
        this.changeDetector.detectChanges();
      }
    }, (error: HttpErrorResponse) => {
      this.fuelPriceModel.weekToApplyList = [];
      FuelPriceUtility.toastMessage(this.messageService, 'error', error.message);
      FuelPriceBasisUtility.errorHandling(this.fuelPriceModel, this.changeDetector);
    });
  }
  /**** * @memberof FuelPriceBasisComponent */
  getDayOfWeek() {
    this.fuelPriceModel.dayOfWeekList = [];
    this.fuelPriceModel.weeksInAverage = [];
    this.fuelPriceModel.isPageLoading = true;
    this.service.getDayOfWeek().pipe(takeWhile(() => this.fuelPriceModel.isSubscribe)).subscribe((data: DayOfWeek) => {
      this.fuelPriceModel.isPageLoading = false;
      if (!utils.isEmpty(data)) {
        this.fuelPriceModel.dayOfWeekList = FuelPriceUtility.formatDayOfWeek(data.priceChangeDayOfWeek);
        this.fuelPriceModel.weeksInAverage = FuelPriceUtility.formatDayOfWeek(data.weeksInAverage);
        FuelPriceUtility.setDefaultDayOfWeek(this.fuelPriceModel);
        this.changeDetector.detectChanges();
      }
    }, (error: HttpErrorResponse) => {
      this.fuelPriceModel.dayOfWeekList = [];
      this.fuelPriceModel.weeksInAverage = [];
      FuelPriceUtility.toastMessage(this.messageService, 'error', error.message);
      FuelPriceBasisUtility.errorHandling(this.fuelPriceModel, this.changeDetector);
    });
  }
  /**** * @memberof FuelPriceBasisComponent */
  getPriceFactor() {
    this.fuelPriceModel.priceFactorTypes = [];
    this.fuelPriceModel.isPageLoading = true;
    this.service.getPriceFactors().pipe(takeWhile(() => this.fuelPriceModel.isSubscribe)).subscribe((data: ResponseObject) => {
      this.fuelPriceModel.isPageLoading = false;
      if (!utils.isEmpty(data) && !utils.isEmpty(data['_embedded']) && !utils.isEmpty(data['_embedded']['fuelPriceFactorTypes'])) {
        this.fuelPriceModel.priceFactorTypes = FuelPriceUtility.formatDropdownData(data['_embedded']
        ['fuelPriceFactorTypes'], 'fuelPriceFactorTypeName', 'fuelPriceFactorTypeID');
        FuelPriceUtility.setDefaultPriceFactor(this.fuelPriceModel);
        this.changeDetector.detectChanges();
      }
    }, (error: HttpErrorResponse) => {
      this.fuelPriceModel.priceFactorTypes = [];
      FuelPriceUtility.toastMessage(this.messageService, 'error', error.message);
      FuelPriceBasisUtility.errorHandling(this.fuelPriceModel, this.changeDetector);
    });
  }
  /**** * @memberof FuelPriceBasisComponent */
  getPriceSource() {
    this.fuelPriceModel.priceSource = [];
    this.fuelPriceModel.isPageLoading = true;
    this.service.getPriceSource().pipe(takeWhile(() => this.fuelPriceModel.isSubscribe)).subscribe((data: ResponseObject) => {
      this.fuelPriceModel.isPageLoading = false;
      if (!utils.isEmpty(data) && !utils.isEmpty(data['_embedded']) && !utils.isEmpty(data['_embedded']['fuelPriceSourceTypes'])) {
        this.fuelPriceModel.priceSource = FuelPriceUtility.formatDropdownData(data['_embedded']
        ['fuelPriceSourceTypes'], 'fuelPriceSourceTypeName', 'fuelPriceSourceTypeID');
        FuelPriceUtility.setDefaultPriceSource(this.fuelPriceModel);
        this.changeDetector.detectChanges();
      }
    }, (error: HttpErrorResponse) => {
      this.fuelPriceModel.priceSource = [];
      FuelPriceUtility.toastMessage(this.messageService, 'error', error.message);
      FuelPriceBasisUtility.errorHandling(this.fuelPriceModel, this.changeDetector);
    });
  }
  /**** * @memberof FuelPriceBasisComponent */
  getDayOfMonth() {
    this.fuelPriceModel.dayOfMonthList = [];
    this.fuelPriceModel.monthsInAverageList = [];
    this.fuelPriceModel.isPageLoading = true;
    this.service.getDayOfMonth().pipe(takeWhile(() => this.fuelPriceModel.isSubscribe)).subscribe((data: DayOfWeek) => {
      this.fuelPriceModel.isPageLoading = false;
      if (!utils.isEmpty(data)) {
        this.fuelPriceModel.dayOfMonthList = FuelPriceUtility.formatDayOfWeek(data.priceChangeDayOfMonth);
        this.fuelPriceModel.monthsInAverageList = FuelPriceUtility.formatDayOfWeek(data.monthsInAverage);
        FuelPriceUtility.setDefaultMonth(this.fuelPriceModel);
        FuelPriceUtility.isShowWeekAvg(this.fuelPriceModel);
        this.changeDetector.detectChanges();
      }
    }, (error: HttpErrorResponse) => {
      this.fuelPriceModel.dayOfMonthList = [];
      this.fuelPriceModel.monthsInAverageList = [];
      FuelPriceUtility.toastMessage(this.messageService, 'error', error.message);
      FuelPriceBasisUtility.errorHandling(this.fuelPriceModel, this.changeDetector);
    });
  }
  /**** * @param {string} value
   * @param {number} index
   * @memberof FuelPriceBasisComponent
   */
  onclickFuelRadio(value: SelectItem, index: number) {
    this.fuelPriceModel.fuelPriceForm.markAsUntouched();
    FuelPriceUtility.setDefaultPriceFactor(this.fuelPriceModel);
    FuelPriceUtility.setDefaultDelay(this.fuelPriceModel);
    FuelPriceUtility.setDefaultPriceSource(this.fuelPriceModel);
    switch (value['label']) {
      case 'Weekly':
        FuelPriceUtility.weeklySelected(this.fuelPriceModel);
        break;
      case 'Monthly':
        FuelPriceUtility.resetFlags(this.fuelPriceModel);
        this.fuelPriceModel.isSelectedMonthly = true;
        this.fuelPriceModel.fuelPriceForm.controls.dayOfMonth.setValidators(Validators.required);
        this.getDayOfMonth();
        break;
      case 'Last Day of Month':
        FuelPriceUtility.resetFlags(this.fuelPriceModel);
        this.fuelPriceModel.isSelectedLastDay = true;
        this.getDayOfMonth();
        break;
      default: break;
    }
  }
  /**** * @param {SelectItem} event
   * @memberof FuelPriceBasisComponent */
  onChangePriceFactor(event: SelectItem) {
    if (event && event['value']) {
      this.fuelPriceModel.selectedPriceFactor = event['value'].label;
      FuelPriceUtility.isShowWeekAvg(this.fuelPriceModel);
    }
  }
  /**** * @memberof FuelPriceBasisComponent */
  onClickCancel() {
    this.router.navigate([this.viewAgreement], { queryParams: { id: this.fuelPriceModel.agreementId } });
  }
  /**** * @param {HttpResponseBase} data
   * @memberof FuelPriceBasisComponent */
  saveSuccess(data: HttpResponseBase) {
    if (!utils.isEmpty(data) && data.status === 201) {
      FuelPriceUtility.toastMessage(this.messageService, 'success', 'Fuel Program Successfully Saved');
      FuelPriceUtility.resetFormValue(this.fuelPriceModel);
      this.changeDetector.detectChanges();
      this.router.navigate([this.viewAgreement], { queryParams: { id: this.fuelPriceModel.agreementId } });
    }
  }
  /**** * @memberof FuelPriceBasisComponent */
  onClickNext() {
    if (this.fuelPriceModel.fuelPriceForm.valid) {
      const request = FuelPriceUtility.formatRequestParam(this.fuelPriceModel);
      this.fuelPriceModel.isPageLoading = true;
      this.service.fuelPriceSave(request, this.fuelPriceModel.fuelProgramId).pipe(takeWhile(() => this.fuelPriceModel.isSubscribe))
        .subscribe((data: HttpResponseBase) => {
          this.fuelPriceModel.isPageLoading = false;
          this.saveSuccess(data);
        }, (error: HttpErrorResponse) => {
          FuelPriceBasisUtility.errorHandling(this.fuelPriceModel, this.changeDetector);
        });
    } else {
      FuelPriceUtility.onClickNext(this.fuelPriceModel, this.messageService);
    }
  }
  /** function to get the region type list
   * @memberof FuelPriceBasisComponent */
  getRegionType() {
    this.service.getRegionType().pipe(takeWhile(() => this.fuelPriceModel.isSubscribe)).subscribe((regionList: RootObject) => {
      if (!utils.isEmpty(regionList) && !utils.isEmpty(regionList._embedded) &&
        !utils.isEmpty(regionList._embedded.fuelPriceBasisRegionTypes)) {
        this.fuelPriceModel.regionType = FuelPriceBasisUtility
          .returnRegionType(regionList._embedded.fuelPriceBasisRegionTypes, this.fuelPriceModel);
        this.changeDetector.detectChanges();
      }
    }, (error: HttpErrorResponse) => {
      FuelPriceBasisUtility.errorHandling(this.fuelPriceModel, this.changeDetector);
    });
  }
  /** function called when region type is changed
   * @param {SelectButtonEvent} event
   * @memberof FuelPriceBasisComponent */
  regionTypeChanged(event: SelectButtonEvent) {
    this.fuelPriceModel.selectedRegionType = event.value;
    const controlArray = this.fuelPriceModel.fuelPriceForm.controls['customRegion'] as FormArray;
    if (this.fuelPriceModel.regionvalue !== this.fuelPriceModel.selectedRegionType) {
      if (event.value.fuelPriceBasisRegionTypeID === 1) {
        controlArray['controls'].splice(0, this.fuelPriceModel.fuelPriceForm.controls['customRegion']['controls'].length);
        controlArray.reset();
        this.fuelPriceModel.fuelPriceForm.controls['customRegion'].markAsPristine();
        FuelPriceBasisUtility.onRegionTypeChanged(this.fuelPriceModel, event);
        this.addNewRegion();
      } else {
        if (controlArray.dirty && this.fuelPriceModel.selectedRegionType === this.fuelPriceModel.fuelPriceForm
          .get('regionType').value && this.fuelPriceModel.regionvalue !== this.fuelPriceModel.selectedRegionType) {
          FuelPriceBasisUtility.setRegionEvent(event, this.fuelPriceModel);
        } else {
          this.fuelPriceModel.regionvalue = event.value;
          this.fuelPriceModel.isShowRegion = true;
          this.removeRow(0);
        }
      }
    }
  }
  /** function to add new row of region to the table on click of add new region
   * @memberof FuelPriceBasisComponent */
  addNewRegion() {
    if (!FuelPriceBasisUtility.duplicateCheck(this.fuelPriceModel)) {
      const controlArray = this.fuelPriceModel.fuelPriceForm.controls['customRegion'] as FormArray;
      controlArray.push(FuelPriceBasisUtility.newRegion(this.fuelPriceModel, this.formBuilder));
    } else {
      FuelPriceUtility.toast(this.messageService, 'error', 'Error', 'Remove Duplicated Row to proceed further');
    }
  }
  /** function is called when yes is clicked in the popup shown for region change
   * @memberof FuelPriceBasisComponent */
  regionChangeYes() {
    FuelPriceBasisUtility.onRegionChange(this.fuelPriceModel);
  }
  /** function called when averaging field is changed
   * @param {boolean} event
   * @memberof FuelPriceBasisComponent */
  onAveragingChange(event: boolean) {
    FuelPriceBasisUtility.clearArrayControl(this.fuelPriceModel);
    this.fuelPriceModel.isAveraging = event;
    this.showTable();
  }
  /** function to get the district and subdistrict list
   * @memberof FuelPriceBasisComponent */
  getDistrictList() {
    this.fuelPriceModel.isPageLoading = true;
    this.service.getNationalDistrict().pipe(takeWhile(() => this.fuelPriceModel.isSubscribe))
      .subscribe((districts: DistrictList[]) => {
        if (!utils.isEmpty(districts)) {
          this.fuelPriceModel.regionalDistrictList = FuelPriceBasisUtility.getDistrictList(districts);
          this.changeDetector.detectChanges();
        }
      }, (error: HttpErrorResponse) => {
        FuelPriceBasisUtility.errorHandling(this.fuelPriceModel, this.changeDetector);
      });
  }
  /** function to remove the row based on the index value
   * @param {number} index
   * @memberof FuelPriceBasisComponent */
  removeRow(index: number) {
    const controlArray = this.fuelPriceModel.fuelPriceForm.controls['customRegion'] as FormArray;
    controlArray.removeAt(index);
  }
  /** function to check whether the formarray values are duplicated or not
   * @param {number} rowIndex
   * @memberof FuelPriceBasisComponent */
  checkRegion(rowIndex: number) {
    this.getStates(rowIndex);
  }
  /** function to get the states value on region & regionstatesoption change
   * @param {number} rowIndex
   * @memberof FuelPriceBasisComponent */
  getStates(rowIndex: number) {
    const formIndexControl = this.fuelPriceModel.fuelPriceForm.controls['customRegion']['controls'][rowIndex];
    if (!this.fuelPriceModel.isAveraging && formIndexControl['controls']['region'].value &&
      formIndexControl['controls']['regionStateOption'].value) {
      this.fuelPriceModel.isPageLoading = true;
      const param = formIndexControl['controls']['region'].value;
      this.service.getStates(param).pipe(takeWhile(() => this.fuelPriceModel.isSubscribe)).subscribe((states: States) => {
        formIndexControl['controls']['states'].setValue(states.associatedStates);
        FuelPriceBasisUtility.errorHandling(this.fuelPriceModel, this.changeDetector);
      }, (error: HttpErrorResponse) => {
        formIndexControl['controls']['states'].setValue('');
        FuelPriceBasisUtility.errorHandling(this.fuelPriceModel, this.changeDetector);
      });
    }
  }
  /** function is called when yes is clicked in popup
   * @memberof FuelPriceBasisComponent */
  onClickYes() {
    FuelPriceBasisUtility.clearArrayControl(this.fuelPriceModel);
    FuelPriceBasisUtility.yesClicked(this.fuelPriceModel);
    this.showTable();
  }
  /** function to show the table with one row on clicking averaging
   * @memberof FuelPriceBasisComponent */
  showTable() {
    if (this.fuelPriceModel.fuelPriceForm.get('averaging').value) {
      this.fuelPriceModel.regionTableColumnList = [{
        label: 'Region', value: ''
      }];
    } else {
      this.fuelPriceModel.regionTableColumnList = FuelPriceBasisUtility.getColumnList();
    }
  }
  /** function called when no is clicked in popup during region change
   * @memberof FuelPriceBasisComponent */
  regionChangeNo() {
    FuelPriceBasisUtility.onRegionChangeNo(this.fuelPriceModel);
  }
  /** function called when no id clicked in popup during averaging change
   * @memberof FuelPriceBasisComponent */
  onClickNo() {
    this.fuelPriceModel.isShowPopup = false;
  }
}
