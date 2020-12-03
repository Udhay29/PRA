import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ElementRef,
  ViewChild, DoCheck
} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { MessageService } from 'primeng/components/common/messageservice';
import { HttpErrorResponse } from '@angular/common/http';
import { SortEvent } from 'primeng/components/common/sortevent';
import { Table } from 'primeng/table';
import * as utils from 'lodash';
import { takeWhile } from 'rxjs/operators';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FuelCalculationModel } from './models/fuel-calculation.model';
import { FuelCalculationDetailsService } from './service/fuel-calculation-details.service';
import { FuelCalculationDetailsUtility } from './service/fuel-calculation-details-utility';
import {
  FuelCalculationDateTypes, ChargeType, RoundingDigit, CustomerAgreementDetail,
  CalculationType, RateType, FuelType, FuelDiscountTypes, ReeferDistanceDropdown, ReeferVolumeDropdown,
  FuelCalculationMethodTypes, DropdownList, ReeferDistanceMeasurement, FuelCalculationDateTypesDropdown, RoundDigitDropdown,
  ReeferVolumeMeasurement, FuelCalculationDropdown, FuelCalculationTypeDropdown, FuelRateTypeDropdown,
  CurrencyDropdownList, DistanceHourRoundingType, AgreementDetails, UploadDataList, FuelTypeDropdown
} from './models/fuel-calculation.interface';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';
@Component({
  selector: 'app-fuel-calculation-details',
  templateUrl: './fuel-calculation-details.component.html',
  styleUrls: ['./fuel-calculation-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FuelCalculationDetailsService, CurrencyPipe]
})
export class FuelCalculationDetailsComponent implements OnInit, DoCheck {
  fuelCalculationModel: FuelCalculationModel;
  CheckValue = false;
  @ViewChild('uploadtable') uploadtable: Table;
  @ViewChild('editField') editField: any;
  @ViewChild('editFieldCurrency') editFieldCurrency: any;
  constructor(private readonly formBuilder: FormBuilder, private readonly currencyPipe: CurrencyPipe,
    private readonly changeDetector: ChangeDetectorRef, private readonly messageService: MessageService,
    private readonly fuelCalculationDetailsService: FuelCalculationDetailsService, private readonly router: Router,
    private readonly broadCastService: BroadcasterService, private readonly elRef: ElementRef) {
    this.fuelCalculationModel = new FuelCalculationModel;
  }
  ngOnInit() {
    this.broadCastService.on<CustomerAgreementDetail>('agreementDetails').subscribe((agreementData: CustomerAgreementDetail) => {
      this.fuelCalculationModel.fuelProgramId = agreementData.fuelProgramID;
      this.fuelCalculationModel.fuelProgramVersionId = agreementData.fuelProgramVersionID;
      this.fuelCalculationModel.agreementId = agreementData.agreementID;
      if (this.fuelCalculationModel.populateFlag) {
        this.populateDropdownValues();
      }
      if (this.fuelCalculationModel.currencyFetchFlag) {
        this.currencyFetch(agreementData.fuelProgramID, agreementData.fuelProgramVersionID);
      }
    });
    this.formInitialization();
    this.navigationSubscription();
    this.saveSubscription();
    this.fuelCalculationModel.decimals = 4;
    this.fuelCalculationModel.gap = [1, 0.1, 0.01, 0.001, 0.0001];
  }
  ngDoCheck() {
    if (this.fuelCalculationModel.tableFlag) {
      setTimeout(() => {
        FuelCalculationDetailsUtility.checkHeight(this.elRef, this.fuelCalculationModel, this.changeDetector);
      }, 100);
    }
  }
  formInitialization() {
    this.fuelCalculationModel.FuelCalculationForm =
    FuelCalculationDetailsUtility.FuelCalculationForm(this.formBuilder);
    this.fuelCalculationModel.FlatDetailsForm = FuelCalculationDetailsUtility.FlatDetailsForm(this.formBuilder);
    this.fuelCalculationModel.FormulaDetailsForm = FuelCalculationDetailsUtility.FormulaDetailsForm(this.formBuilder);
    this.fuelCalculationModel.ReferDetailsForm = FuelCalculationDetailsUtility.ReferDetailsForm(this.formBuilder);
    this.fuelCalculationModel.DistanceDetailsForm = FuelCalculationDetailsUtility.DistanceDetailsForm(this.formBuilder);
    this.fuelCalculationModel.FuelCalculationForm.controls['fuelmethod'].setValue(this.fuelCalculationModel.selectedFormName);
    this.defaultValueforFormulaForm();
  }
  onButtonSelected(value: string) {
    if (this.fuelCalculationModel.selectedFormName !== value) {
      const FormDirtyStatus = this.getFormDirtyCheck(this.fuelCalculationModel.selectedFormName);
      if (FormDirtyStatus) {
        this.fuelCalculationModel.showConfirmationPopup = true;
        this.fuelCalculationModel.buttonNavigate = value;
      } else {
        this.fuelCalculationModel.buttonNavigate = value;
        this.onClickYes();
      }
      this.fuelCalculationModel.isReplace = false;
    }
  }
  populateDropdownValues() {
    this.fuelCalculationModel.populateFlag = false;
    this.fuelCalculationModel.isPageLoading = true;
    this.fuelCalculationDetailsService.getFuelConfigurations().pipe(takeWhile(() => this.fuelCalculationModel.subscriberFlag))
      .subscribe((response: FuelCalculationDropdown[]) => {
        this.fuelCalculationModel.fuelcalculationDropdownList = response;
        this.configureDropdownValues();
        this.patchDefaultValues();
        FuelCalculationDetailsUtility.setDefaultReqParam(this.fuelCalculationModel);
        this.fuelCalculationModel.isPageLoading = false;
        this.changeDetector.markForCheck();
      }, (error: Error) => {
        FuelCalculationDetailsUtility.toastMessage(this.messageService, 'error', error.message);
      });
    this.fuelCalculationDetailsService.getCurrencyDropdown().pipe(takeWhile(() => this.fuelCalculationModel.subscriberFlag))
      .subscribe((response: any[]) => {
        if (response) {
          response.forEach((element: string) => {
            this.fuelCalculationModel.currencyCodeList.push({ label: element, value: element });
          });
        }
        this.fuelCalculationModel.currencyCodeList.forEach((element: CurrencyDropdownList, index: number) => {
          this.fuelCalculationModel.FuelCalculationForm.controls.currency.
            setValue(this.fuelCalculationModel.currencyCodeList[index].value);
        });
        this.fuelCalculationModel.fuelCalculationDetailsReqParam['fuelCurrencyCode'] =
          this.fuelCalculationModel.FuelCalculationForm.controls['currency']['value'];
      }, (error: Error) => {
        FuelCalculationDetailsUtility.toastMessage(this.messageService, 'error', error.message);
      });
    this.fuelCalculationDetailsService.getCurrencyDetails(this.fuelCalculationModel.fuelProgramId,
      this.fuelCalculationModel.fuelProgramVersionId)
      .pipe(takeWhile(() => this.fuelCalculationModel.subscriberFlag))
      .subscribe((response: any[]) => {
        if (response && response['sectionLevelFuelProgram'] === false) {
          this.fuelCalculationModel.FuelCalculationForm.controls.currency.setValue(response['currency']);
        }
      });
    this.getChargeTypeData();
    this.fuelCalculationDetailsService.getLengthMeasurement().pipe(takeWhile(() => this.fuelCalculationModel.subscriberFlag))
      .subscribe((response: ReeferDistanceMeasurement[]) => {
        response.forEach((element: ReeferDistanceMeasurement) => {
          this.fuelCalculationModel.referDistanceList.push({
            label: element['unitOfLengthMeasurementCode'],
            value: {
              'unitOfLengthMeasurementCode': element['unitOfLengthMeasurementCode'],
              'pricingFunctionalAreaID': element['pricingFunctionalAreaID'],
            }
          });
        });
      }, (error: Error) => {
        FuelCalculationDetailsUtility.toastMessage(this.messageService, 'error', error.message);
      });
    this.fuelCalculationDetailsService.getVolumeMeasurement().pipe(takeWhile(() => this.fuelCalculationModel.subscriberFlag))
      .subscribe((response: ReeferVolumeMeasurement[]) => {
        response.forEach((element: ReeferVolumeMeasurement) => {
          this.fuelCalculationModel.referFuelUnitList.push({
            label: element['unitOfVolumeMeasurementCode'],
            value: {
              'unitOfVolumeMeasurementCode': element['unitOfVolumeMeasurementCode'],
              'pricingFunctionalAreaID': element['pricingFunctionalAreaID'],
            }
          });
        });
      }, (error: Error) => {
        FuelCalculationDetailsUtility.toastMessage(this.messageService, 'error', error.message);
      });
  }
  getChargeTypeData() {
    const searchData = '';
    this.fuelCalculationModel.chargeTypeLoading = true;
    this.fuelCalculationModel.chargeList = [];
    this.fuelCalculationDetailsService.getChargeTypeList(searchData, 0, 25)
      .pipe(takeWhile(() => this.fuelCalculationModel.subscriberFlag))
      .subscribe((response: ChargeType[]) => {
        this.fuelCalculationModel.chargeTypeLoading = false;
        this.frameChargeTypeData(response);
        this.changeDetector.markForCheck();
      }, (error: Error) => {
        FuelCalculationDetailsUtility.toastMessage(this.messageService, 'error', error.message);
        this.fuelCalculationModel.chargeTypeLoading = false;
        this.changeDetector.markForCheck();
      });
  }
  currencyFetch(programId: number, versionId: number) {
    this.fuelCalculationModel.currencyFetchFlag = false;
    this.fuelCalculationDetailsService.getCurrencyDetails(programId, versionId)
      .pipe(takeWhile(() => this.fuelCalculationModel.subscriberFlag)).subscribe((response: any[]) => {
        if (response && response['sectionLevelFuelProgram'] === true) {
          this.fuelCalculationModel.FuelCalculationForm.controls.currency.setValue(response['currency']);
          this.fuelCalculationModel.fuelCalculationDetailsReqParam['fuelCurrencyCode'] =
            this.fuelCalculationModel.FuelCalculationForm.controls['currency']['value'];
          this.fuelCalculationModel.sectionValidFlag = true;
        }
      });
  }
  configureDropdownValues() {
    this.fuelCalculationModel.fuelcalculationDropdownList['fuelCalculationDateTypes'].forEach((element: FuelCalculationDateTypes) => {
      this.fuelCalculationModel.fuelCalculationList.push({
        label: element['fuelCalculationDateTypeName'],
        value: {
          'fuelCalculationDateTypeID': element['fuelCalculationDateTypeID'],
          'fuelCalculationDateTypeName': element['fuelCalculationDateTypeName']
        }
      });
    });
    this.fuelCalculationModel.fuelcalculationDropdownList['fuelRoundingDecimals'].forEach((element: RoundingDigit) => {
      this.fuelCalculationModel.roundingdigitList.push({
        label: element['fuelRoundingDecimalNumber'].toString(),
        value: {
          'fuelRoundingDecimalID': element['fuelRoundingDecimalID'],
          'fuelRoundingDecimalNumber': element['fuelRoundingDecimalNumber'],
        }
      });
    });
    this.fuelCalculationModel.fuelcalculationDropdownList['fuelCalculationTypes'].forEach((element: CalculationType) => {
      this.fuelCalculationModel.calculatetypeList.push({
        label: element['fuelCalculationTypeName'],
        value: {
          'fuelCalculationTypeID': element['fuelCalculationTypeID'],
          'fuelCalculationTypeName': element['fuelCalculationTypeName']
        }
      });
    });
    this.fuelCalculationModel.fuelcalculationDropdownList['fuelRateTypes'].forEach((element: RateType) => {
      this.fuelCalculationModel.ratetypeList.push({
        label: element['fuelRateTypeName'],
        value: { 'fuelRateTypeID': element['fuelRateTypeID'], 'fuelRateTypeName': element['fuelRateTypeName'] }
      });
    });
    this.fuelCalculationModel.fuelcalculationDropdownList['fuelTypes'].forEach((element: FuelType) => {
      this.fuelCalculationModel.fueltypeList.push({
        label: element['fuelTypeName'],
        value: { 'fuelTypeID': element['fuelTypeID'], 'fuelTypeName': element['fuelTypeName'] }
      });
    });
    this.fuelCalculationModel.fuelcalculationDropdownList['fuelDiscountTypes'].forEach((element: FuelDiscountTypes) => {
      this.fuelCalculationModel.draydiscountList.push({
        label: element['fuelDiscountTypeName'],
        value: { 'fuelDiscountTypeID': element['fuelDiscountTypeID'], 'fuelDiscountTypeName': element['fuelDiscountTypeName'] }
      });
    });
    this.fuelCalculationModel.fuelcalculationDropdownList['fuelCalculationMethodTypes'].forEach((element: FuelCalculationMethodTypes) => {
      this.fuelCalculationModel.fuelcalculationmethodList.push({
        label: element['fuelCalculationMethodTypeName'], value: element['fuelCalculationMethodTypeID']
      });
      this.fuelCalculationModel.fuelmethodSelectButton.push({
        label: element['fuelCalculationMethodTypeName'], value: element['fuelCalculationMethodTypeName']
      });
    });
    this.fuelCalculationModel.fuelcalculationDropdownList['fuelRoundingTypes'].forEach((element: DistanceHourRoundingType) => {
      this.fuelCalculationModel.referDistanceRoundingList.push({
        label: element['fuelRoundingTypeName'],
        value: {
          'fuelRoundingTypeID': element['fuelRoundingTypeID'], 'fuelRoundingTypeName': element['fuelRoundingTypeName']
        }
      });
      this.fuelCalculationModel.referServiceHourRoundingList = this.fuelCalculationModel.referDistanceRoundingList;
    });
    this.changeDetector.markForCheck();
  }
  populateChargeType(event: Event) {
    this.fuelCalculationModel.chargeTypeList = [];
    if (this.fuelCalculationModel.chargeList) {
      this.fuelCalculationModel.chargeList.forEach((element) => {
        if (element.label && element.label.toString().toLowerCase().startsWith(event['query'].toLowerCase())) {
          this.fuelCalculationModel.chargeTypeList.push({ label: element['label'], value: element['value'] });
        }
      });
      this.changeDetector.markForCheck();
    }
  }
  setSearchDataForChargeType() {
    this.fuelCalculationModel.chargeTypeList = [];
    this.fuelCalculationModel.chargeList.forEach((element) => {
      this.fuelCalculationModel.chargeTypeList.push({ label: element['label'], value: element['value'] });
    });
    this.changeDetector.markForCheck();
  }
  frameChargeTypeData(response) {
    response.forEach((element: ChargeType) => {
      const chargetypeNameCode = `${element['chargeTypeName']} (${element['chargeTypeCode']})`;
      this.fuelCalculationModel.chargeList.push({
        label: chargetypeNameCode,
        value: {
          'chargeTypeCode': element['chargeTypeCode'], 'chargeTypeID': element['chargeTypeID'],
          'chargeTypeName': element['chargeTypeName']
        }
      });
    });
    if (!this.fuelCalculationModel.ischargeTypeChange) {
      this.setdefaultvalueforChargeType(this.fuelCalculationModel.chargeList);
    }
    this.changeDetector.markForCheck();
  }
  onClickNo() {
    this.fuelCalculationModel.showConfirmationPopup = false;
    this.fuelCalculationModel.FuelCalculationForm.controls['fuelmethod'].setValue(this.fuelCalculationModel.selectedFormName);
    this.changeDetector.detectChanges();
  }
  onClickYes() {
    this.fuelCalculationModel.capValidationFlag = false;
    this.fuelCalculationModel.showConfirmationPopup = false;
    this.fuelCalculationModel.selectedFormName = this.fuelCalculationModel.buttonNavigate;
    this.fuelCalculationModel.selectedFuelCalculationType = this.fuelCalculationModel.selectedFormName;
    this.fuelCalculationModel.FuelCalculationForm.controls['fuelmethod'].setValue(this.fuelCalculationModel.selectedFormName);
    this.resetForm(this.fuelCalculationModel.selectedFormName);
    FuelCalculationDetailsUtility.checkIfIncrement(this.fuelCalculationModel);
    this.clickYes();
  }
  validateCurrency(value: string, formName: FormGroup, formElement: string) {
    this.fuelCalculationModel.errFlag = false;
    this.fuelCalculationModel.capvalueFlag = false;
    if (value !== '') {
      this.fuelCalculationModel.formValidateName = formName;
      const enteredFuelAmount = this.fuelCalculationModel.formValidateName.get(formElement);
      const pattern: RegExp = /^[0-9]{0,7}(\.[0-9]{0,4})?$/;
      if (pattern.test(enteredFuelAmount.value)) {
        if (enteredFuelAmount.valid || enteredFuelAmount.hasError('error')) {
          const enteredAmount = value.replace(/[, ]/g, '').trim();
          this.checkDecimalPrecision(enteredAmount, formElement, pattern, formName);
        } else {
          this.fuelCalculationModel.formValidateName.controls[formElement].setErrors({ invalid: true });
          this.fuelCalculationModel.formValidateName.controls[formElement].markAsTouched();
          this.fuelCalculationModel.errFlag = true;
        }
      } else {
        this.fuelCalculationModel.formValidateName.controls[formElement].setErrors({ invalid: true });
        this.fuelCalculationModel.formValidateName.controls[formElement].markAsTouched();
        this.fuelCalculationModel.errFlag = true;
      }
      if (!this.fuelCalculationModel.errFlag) {
        FuelCalculationDetailsUtility.capValidation(this.fuelCalculationModel, this.changeDetector);
      } else {
        this.fuelCalculationModel.inlineErrormessage = [];
        this.fuelCalculationModel.capValidationFlag = false;
      }
    }
  }
  checkDecimalPrecision(enteredAmount: string, formElement: string, pattern: RegExp, formName: FormGroup) {
    this.fuelCalculationModel.formValidateName = formName;
    const enteredFuelAmount = this.fuelCalculationModel.formValidateName.get(formElement);
    const wholeAmount = enteredAmount.split('.')[0].substring(0, 9);
    const decimalAmount = enteredAmount.split('.')[1] || '';
    const amount = +`${wholeAmount}.${decimalAmount}`;
    if (isNaN(amount)) {
      this.fuelCalculationModel.formValidateName.controls[formElement].setErrors({ invalid: true });
      this.fuelCalculationModel.formValidateName.controls[formElement].markAsTouched();
      this.fuelCalculationModel.errFlag = true;
    } else {
      if (pattern.test(amount.toString())) {
        const modifiedAmount = amount.toString().replace(/[, ]/g, '').trim();
        let formattedAmount;
        formattedAmount = this.currencyPipeValidation(amount, modifiedAmount);
        enteredFuelAmount.setValue(formattedAmount);
      } else {
        this.fuelCalculationModel.formValidateName.controls[formElement].setErrors({ invalid: true });
        this.fuelCalculationModel.formValidateName.controls[formElement].markAsTouched();
        this.fuelCalculationModel.errFlag = true;
      }
    }
  }
  currencyPipeValidation(amount: number, modifiedAmount: string) {
    let formattedAmount;
    if (amount !== 0) {
      formattedAmount = this.currencyPipe.transform(modifiedAmount, '', '', '1.2-4');
    } else {
      formattedAmount = modifiedAmount;
    }
    return formattedAmount;
  }
  onFocus(value: string, formName: FormGroup, formElement: string) {
    if (value !== '') {
      this.fuelCalculationModel.formValidateName = formName;
      const enteredAmount = value.replace(/[, ]/g, '').trim();
      this.fuelCalculationModel.formValidateName.controls[formElement].setValue(enteredAmount);
      this.fuelCalculationModel.enteredValue = enteredAmount;
    } else {
      this.fuelCalculationModel.enteredValue = '';
    }
  }
  onChangeFuelCalculationDateType() {
    this.fuelCalculationModel.fuelCalculationDetailsReqParam['fuelCalculationDateType'] =
      this.fuelCalculationModel.FuelCalculationForm.controls['fuelcalculationdatetype']['value'];
  }
  onSelectChargeType(event: Event) {
    this.fuelCalculationModel.fuelCalculationDetailsReqParam['chargeType'] =
      this.fuelCalculationModel.FuelCalculationForm.controls['chargetype']['value']['value'];
  }
  onClearDropDown() {
    this.fuelCalculationModel.FuelCalculationForm.controls['chargetype'].setValue('');
    this.fuelCalculationModel.ischargeTypeChange = true;
  }
  onChangeRoundingDigit() {
    this.fuelCalculationModel.fuelCalculationDetailsReqParam['fuelRoundingDecimal'] =
      this.fuelCalculationModel.FuelCalculationForm.controls['roundingdigit']['value'];
    this.roundingDigit();
  }
  onChangeCalculationType() {
    this.fuelCalculationModel.fuelCalculationDetailsReqParam['fuelCalculationType'] =
      this.fuelCalculationModel.FuelCalculationForm.controls['calculationtype']['value'];
      this.checkRollUp();
  }
  onChangeRateType() {
    this.fuelCalculationModel.fuelCalculationDetailsReqParam['fuelRateType'] =
      this.fuelCalculationModel.FuelCalculationForm.controls['ratetype']['value'];
  }
  onChangeFuelType() {
    this.fuelCalculationModel.fuelCalculationDetailsReqParam['fuelType'] =
      this.fuelCalculationModel.FuelCalculationForm.controls['fueltype']['value'];
  }
  onChangeDrayDiscount(event: Event) {
    this.fuelCalculationModel.FuelCalculationForm.controls['draydiscount'].setValue(event['value']);
    this.fuelCalculationModel.fuelCalculationDetailsReqParam['fuelDiscountType'] =
      this.fuelCalculationModel.FuelCalculationForm.controls['draydiscount']['value'];
  }
  onChangeRollUp(event) {
    if (event) {
      this.fuelCalculationModel.fuelCalculationDetailsReqParam['rollUpIndicator'] = 'Y';
    } else {
      this.fuelCalculationModel.fuelCalculationDetailsReqParam['rollUpIndicator'] = 'N';
    }
  }
  onChangeCurrencyType() {
    this.fuelCalculationModel.fuelCalculationDetailsReqParam['fuelCurrencyCode'] =
      this.fuelCalculationModel.FuelCalculationForm.controls['currency']['value'];
  }
  onChangeReferDistanceUnit(event) {
    this.fuelCalculationModel.referDistanceOptionalText = event['value'].unitOfLengthMeasurementCode;
  }
  onChangeReferFuelUnit(event) {
    this.fuelCalculationModel.referFuelOptionalText = event['value'].unitOfVolumeMeasurementCode;
  }
  onChangeMpgDistanceUnit(event) {
    this.fuelCalculationModel.mpgDistanceOptionalText = event['value'].unitOfLengthMeasurementCode;
  }
  sortUploadedData() {
    if (this.fuelCalculationModel.selectedFormName === 'Increment' && this.fuelCalculationModel.uploadTablearray.length) {
      this.uploadtable.sortOrder = 1;
      this.uploadtable.sortField = 'fuelEndAmount';
      this.fuelCalculationModel.uploadTablearray.sort((chargeTypefirstValue, chargeTypeSecondValue) => {
        return FuelCalculationDetailsUtility.applySort(chargeTypefirstValue.fuelEndAmount, chargeTypeSecondValue.fuelEndAmount);
      });
    }
  }
  onClickNext() {
    this.checkGapAndDuplicates();
    if (this.fuelCalculationModel.validationFlag) {
      FuelCalculationDetailsUtility.capValidation(this.fuelCalculationModel, this.changeDetector);
    }
    this.setMandatoryValidation(this.fuelCalculationModel.selectedFormName);
    const FormStatus = this.getFormStatus(this.fuelCalculationModel.selectedFormName);
    if (this.fuelCalculationModel.FuelCalculationForm.valid && FormStatus) {
      if (!this.fuelCalculationModel.capValidationFlag) {
        this.frameSaveRequestfuel(this.fuelCalculationModel.selectedFormName);
        this.fuelCalculationModel.isPageLoading = true;
        this.fuelCalculationDetailsService.saveCalculationDetails(this.fuelCalculationModel.fuelCalculationDetailsReqParam,
          this.fuelCalculationModel.fuelProgramId)
          .pipe(takeWhile(() => this.fuelCalculationModel.subscriberFlag))
          .subscribe((response: any) => {
            this.fuelCalculationModel.isPageLoading = false;
            if (!response.fuelIncrementalPriceDTOs) {
              const successMessage = 'You have successfully added Fuel Calculation Details';
              this.messageService.add({ severity: 'success', summary: 'Fuel Calculation Details', detail: successMessage });
              this.broadCastService.broadcast('fuelStepIndexChange', 'next');
              this.fuelCalculationModel.customerAgreementDetails['agreementID'] = this.fuelCalculationModel.agreementId;
              this.fuelCalculationModel.customerAgreementDetails['fuelProgramID'] = this.fuelCalculationModel.fuelProgramId;
              this.broadCastService.broadcast('agreementDetails', this.fuelCalculationModel.customerAgreementDetails);
            }
            this.changeDetector.markForCheck();
          }, (error: HttpErrorResponse) => {
            this.fuelCalculationModel.isPageLoading = false;
            this.handleError(error);
            this.changeDetector.markForCheck();
          });
      }
    } else {
      const toastMsg = FuelCalculationDetailsUtility.onClickToastMsg(this.fuelCalculationModel);
      FuelCalculationDetailsUtility.toastMessage(this.messageService, 'error', toastMsg['data'], toastMsg['customSummary']);
      FuelCalculationDetailsUtility.overLapOrDuplicateMsg(this.fuelCalculationModel);
      this.fuelCalculationModel.inlineErrormessage = [];
      this.changeDetector.markForCheck();
    }
    setTimeout(() => {
      FuelCalculationDetailsUtility.checkHeight(this.elRef, this.fuelCalculationModel, this.changeDetector);
    }, 500);
  }
  frameSaveRequestfuel(formName: string) {
    this.fuelCalculationModel.fuelcalculationDropdownList['fuelCalculationMethodTypes']
      .forEach((fuelmethod: FuelCalculationMethodTypes) => {
        if (fuelmethod.fuelCalculationMethodTypeName === formName) {
          this.fuelCalculationModel.fuelCalculationDetailsReqParam['fuelCalculationMethodType'] = fuelmethod;
        }
      });
    FuelCalculationDetailsUtility.selectFormName(formName, this);
  }
  saveRequestforFlatFuel() {
    this.fuelCalculationModel.flatCalculationData['flatConfigurationID'] = null;
    this.fuelCalculationModel.flatCalculationData['fuelSurchargeAmount'] =
      (FuelCalculationDetailsUtility.removeDelimiters(this.fuelCalculationModel.FlatDetailsForm.
        controls['fuelsurchargeamount'].value));
    this.fuelCalculationModel.fuelCalculationDetailsReqParam['flatConfiguration'] = this.fuelCalculationModel.flatCalculationData;
    this.fuelCalculationModel.fuelCalculationDetailsReqParam['formulaConfiguration'] = null;
    this.fuelCalculationModel.fuelCalculationDetailsReqParam['reeferConfiguration'] = null;
    this.fuelCalculationModel.fuelCalculationDetailsReqParam['distancePerFuelQuantityConfiguration'] = null;
  }
  saveRequestforFormulaFuel() {
    this.fuelCalculationModel.formulaCalculationData['formulaConfigurationID'] = null;
    this.fuelCalculationModel.formulaCalculationData['fuelSurchargeFactorAmount'] =
      (FuelCalculationDetailsUtility.removeDelimiters(this.fuelCalculationModel.FormulaDetailsForm.
        controls['fuelsurcharge'].value));
    this.fuelCalculationModel.formulaCalculationData['implementationAmount'] =
      (FuelCalculationDetailsUtility.removeDelimiters(this.fuelCalculationModel.FormulaDetailsForm.
        controls['implementationprice'].value));
    this.fuelCalculationModel.formulaCalculationData['incrementChargeAmount'] =
      (FuelCalculationDetailsUtility.removeDelimiters(this.fuelCalculationModel.FormulaDetailsForm.
        controls['incrementalcharge'].value));
    this.fuelCalculationModel.formulaCalculationData['incrementIntervalAmount'] =
      (FuelCalculationDetailsUtility.removeDelimiters(this.fuelCalculationModel.FormulaDetailsForm.
        controls['incrementalinterval'].value));
    this.fuelCalculationModel.formulaCalculationData['capAmount'] =
      (FuelCalculationDetailsUtility.removeDelimiters(this.fuelCalculationModel.FormulaDetailsForm.
        controls['cap'].value));
    this.fuelCalculationModel.fuelCalculationDetailsReqParam['formulaConfiguration'] = this.fuelCalculationModel.formulaCalculationData;
    this.fuelCalculationModel.fuelCalculationDetailsReqParam['flatConfiguration'] = null;
    this.fuelCalculationModel.fuelCalculationDetailsReqParam['reeferConfiguration'] = null;
    this.fuelCalculationModel.fuelCalculationDetailsReqParam['distancePerFuelQuantityConfiguration'] = null;
  }
  saveRequestforReferFuel() {
    this.fuelCalculationModel.reeferCalculationData['reeferConfigurationID'] = null;
    this.fuelCalculationModel.reeferCalculationData['implementationAmount'] =
    (FuelCalculationDetailsUtility.removeDelimiters(this.fuelCalculationModel.ReferDetailsForm.
        controls['implementprice'].value));
    this.fuelCalculationModel.reeferCalculationData['burnRatePerHourQuantity'] =
      (FuelCalculationDetailsUtility.removeDelimiters(this.fuelCalculationModel.ReferDetailsForm.
        controls['burnrate'].value));
    this.fuelCalculationModel.reeferCalculationData['unitOfVolumeMeasurement'] = this.fuelCalculationModel.ReferDetailsForm.
      controls['fuelqtyunit'].value;
    this.fuelCalculationModel.reeferCalculationData['distancePerHourQuantity'] =
      (FuelCalculationDetailsUtility.removeDelimiters(this.fuelCalculationModel.ReferDetailsForm.
        controls['distancehour'].value));
    this.fuelCalculationModel.reeferCalculationData['unitOfLengthMeasurement'] = this.fuelCalculationModel.ReferDetailsForm.
      controls['distanceunit'].value;
    this.fuelCalculationModel.reeferCalculationData['travelTimeHourRoundingType'] = this.fuelCalculationModel.ReferDetailsForm.
      controls['distancerounding'].value;
    this.fuelCalculationModel.reeferCalculationData['serviceHourAddonQuantity'] =
      this.fuelCalculationModel.ReferDetailsForm.controls['servicehour'].value === null || '' ? null :
        (FuelCalculationDetailsUtility.removeDelimiters(this.fuelCalculationModel.ReferDetailsForm.controls['servicehour'].value));
    this.fuelCalculationModel.reeferCalculationData['serviceHourRoundingType'] = this.fuelCalculationModel.ReferDetailsForm.
      controls['servicehourrounding'].value;
    this.fuelCalculationModel.reeferCalculationData['serviceHourAddonDistanceQuantity'] =
      this.fuelCalculationModel.ReferDetailsForm.controls['addhours'].value === null || '' ? null :
        (FuelCalculationDetailsUtility.removeDelimiters(this.fuelCalculationModel.ReferDetailsForm.controls['addhours'].value));
    this.fuelCalculationModel.reeferCalculationData['loadUnloadHourQuantity'] =
      this.fuelCalculationModel.ReferDetailsForm.controls['loadinghours'].value === null || '' ? null :
      (FuelCalculationDetailsUtility.removeDelimiters(this.fuelCalculationModel.ReferDetailsForm.controls['loadinghours'].value));
    this.fuelCalculationModel.fuelCalculationDetailsReqParam['reeferConfiguration'] = this.fuelCalculationModel.reeferCalculationData;
    this.fuelCalculationModel.fuelCalculationDetailsReqParam['flatConfiguration'] = null;
    this.fuelCalculationModel.fuelCalculationDetailsReqParam['formulaConfiguration'] = null;
    this.fuelCalculationModel.fuelCalculationDetailsReqParam['distancePerFuelQuantityConfiguration'] = null;
  }
  saveRequestforMpgFuel() {
    this.fuelCalculationModel.distanceQtyCalculationData['distancePerFuelQuantityConfigurationID'] = null;
    this.fuelCalculationModel.distanceQtyCalculationData['implementationAmount'] =
      (FuelCalculationDetailsUtility.removeDelimiters(this.fuelCalculationModel.DistanceDetailsForm.
        controls['incrementalprice'].value));
    this.fuelCalculationModel.distanceQtyCalculationData['distancePerFuelQuantity'] =
      (FuelCalculationDetailsUtility.removeDelimiters(this.fuelCalculationModel.DistanceDetailsForm.
        controls['distanceper'].value));
    const addOnAmount = this.fuelCalculationModel.DistanceDetailsForm.controls['addonamount'].value;
    this.fuelCalculationModel.distanceQtyCalculationData['addonAmount'] =
      addOnAmount === null || '' ? null :
        (FuelCalculationDetailsUtility.removeDelimiters(addOnAmount));
    this.fuelCalculationModel.distanceQtyCalculationData['unitOfLengthMeasurement'] = this.fuelCalculationModel.DistanceDetailsForm.
      controls['distance'].value;
    this.fuelCalculationModel.distanceQtyCalculationData['unitOfVolumeMeasurement'] = this.fuelCalculationModel.DistanceDetailsForm.
      controls['fuelqty'].value;
    this.fuelCalculationModel.fuelCalculationDetailsReqParam['flatConfiguration'] = null;
    this.fuelCalculationModel.fuelCalculationDetailsReqParam['formulaConfiguration'] = null;
    this.fuelCalculationModel.fuelCalculationDetailsReqParam['reeferConfiguration'] = null;
    this.fuelCalculationModel.fuelCalculationDetailsReqParam['distancePerFuelQuantityConfiguration'] =
      this.fuelCalculationModel.distanceQtyCalculationData;
  }
  setMandatoryValidation(formName: string) {
    this.fuelCalculationModel.fuelCalculationMandatoryFields.forEach((control: string) => {
      this.fuelCalculationModel.FuelCalculationForm.controls[control].markAsTouched();
    });
    if (formName === this.fuelCalculationModel.flatFuelName) {
      this.fuelCalculationModel.FlatDetailsForm.controls['fuelsurchargeamount'].markAsTouched();
    } else if (formName === this.fuelCalculationModel.formulaFuelName) {
      this.fuelCalculationModel.formulaDetailsMandatoryFields.forEach((control: string) => {
        this.fuelCalculationModel.FormulaDetailsForm.controls[control].markAsTouched();
      });
    } else if (formName === this.fuelCalculationModel.refrigeratedFuelName) {
      this.fuelCalculationModel.referDetailsMandatoryFields.forEach((control: string) => {
        this.fuelCalculationModel.ReferDetailsForm.controls[control].markAsTouched();
      });
    } else if (formName === this.fuelCalculationModel.distanceFuelName) {
      this.fuelCalculationModel.distanceDetailsMandatoryFields.forEach((control: string) => {
        this.fuelCalculationModel.DistanceDetailsForm.controls[control].markAsTouched();
      });
    }
  }
  onClickCancel() {
    this.router.navigate(['/viewagreement'], { queryParams: { id: this.fuelCalculationModel.agreementId } });
  }
  resetForm(fornName: string) {
    if (fornName === this.fuelCalculationModel.flatFuelName) {
      this.fuelCalculationModel.FlatDetailsForm.reset();
    } else if (fornName === this.fuelCalculationModel.formulaFuelName) {
      this.fuelCalculationModel.FormulaDetailsForm.reset();
      this.defaultValueforFormulaForm();
    } else if (fornName === this.fuelCalculationModel.refrigeratedFuelName) {
      this.fuelCalculationModel.ReferDetailsForm.reset();
      this.defaultValueforReferForm();
    } else if (fornName === this.fuelCalculationModel.distanceFuelName) {
      this.fuelCalculationModel.DistanceDetailsForm.reset();
      this.defaultValueforDistanceFuelForm();
    }
  }
  patchDefaultValues() {
    this.fuelCalculationModel.fuelCalculationList.forEach((element: FuelCalculationDateTypesDropdown, index: number) => {
      if (element.label === 'Order Creation') {
        this.fuelCalculationModel.FuelCalculationForm.controls.fuelcalculationdatetype.
          setValue(this.fuelCalculationModel.fuelCalculationList[index].value);
      }
    });
    this.fuelCalculationModel.roundingdigitList.forEach((element: RoundDigitDropdown, index: number) => {
      if (element.label === '3') {
        this.fuelCalculationModel.FuelCalculationForm.controls.roundingdigit.
          setValue(this.fuelCalculationModel.roundingdigitList[index].value);
      }
    });
    this.fuelCalculationModel.calculatetypeList.forEach((element: FuelCalculationTypeDropdown, index: number) => {
      if (element.label === 'Internal') {
        this.fuelCalculationModel.FuelCalculationForm.controls.calculationtype.
          setValue(this.fuelCalculationModel.calculatetypeList[index].value);
      }
      this.checkRollUp();
    });
    this.fuelCalculationModel.ratetypeList.forEach((element: FuelRateTypeDropdown, index: number) => {
      if (element.label === 'Per Distance') {
        this.fuelCalculationModel.FuelCalculationForm.controls.ratetype.
          setValue(this.fuelCalculationModel.ratetypeList[index].value);
      }
    });
    this.fuelCalculationModel.fueltypeList.forEach((element: FuelTypeDropdown, index: number) => {
      if (element.label === 'Diesel') {
        this.fuelCalculationModel.FuelCalculationForm.controls.fueltype.
          setValue(this.fuelCalculationModel.fueltypeList[index].value);
      }
    });
    this.changeDetector.markForCheck();
  }
  setdefaultvalueforChargeType(chargeList) {
    chargeList.forEach((element: any) => {
      if (element['value']['chargeTypeCode'] === 'SUPINC') {
        this.fuelCalculationModel.FuelCalculationForm.controls.chargetype.
          setValue(element);
        this.fuelCalculationModel.fuelCalculationDetailsReqParam['chargeType'] = element.value;
      }
    });
    this.changeDetector.detectChanges();
  }
  defaultValueforFormulaForm() {
    this.fuelCalculationModel.FormulaDetailsForm.controls['cap'].setValue('0');
    this.changeDetector.markForCheck();
    this.fuelCalculationModel.FormulaDetailsForm.controls['cap'].markAsTouched();
    this.fuelCalculationModel.capvalueFlag = true;
    this.changeDetector.markForCheck();
  }
  defaultValueforReferForm() {
    this.fuelCalculationModel.referDistanceList.forEach((element: ReeferDistanceDropdown, index: number) => {
      if (element.label === 'Miles') {
        this.fuelCalculationModel.ReferDetailsForm.controls.distanceunit.
          setValue(this.fuelCalculationModel.referDistanceList[index].value);
      }
    });
    this.fuelCalculationModel.referFuelUnitList.forEach((element: ReeferVolumeDropdown, index: number) => {
      if (element.label === 'Gallons') {
        this.fuelCalculationModel.ReferDetailsForm.controls.fuelqtyunit.
          setValue(this.fuelCalculationModel.referFuelUnitList[index].value);
      }
    });
    this.fuelCalculationModel.referDistanceOptionalText = 'Miles';
    this.fuelCalculationModel.referFuelOptionalText = 'Gallons';
  }
  defaultValueforDistanceFuelForm() {
    this.fuelCalculationModel.DistanceDetailsForm.controls['distanceper'].
      setValue('0');
    this.changeDetector.markForCheck();
    this.fuelCalculationModel.DistanceDetailsForm.controls['distanceper'].markAsTouched();
    this.changeDetector.detectChanges();
    this.fuelCalculationModel.referDistanceList.forEach((element: ReeferDistanceDropdown, index: number) => {
      if (element.label === 'Miles') {
        this.fuelCalculationModel.DistanceDetailsForm.controls.distance.
          setValue(this.fuelCalculationModel.referDistanceList[index].value);
      }
    });
    this.fuelCalculationModel.referFuelUnitList.forEach((element: ReeferVolumeDropdown, index: number) => {
      if (element.label === 'Gallons') {
        this.fuelCalculationModel.DistanceDetailsForm.controls.fuelqty.
          setValue(this.fuelCalculationModel.referFuelUnitList[index].value);
      }
    });
    this.fuelCalculationModel.mpgDistanceOptionalText = 'Miles';
  }
  handleError(error: HttpErrorResponse) {
    if (!utils.isEmpty(error.error) && !utils.isEmpty(error.error.errors)) {
      this.messageService.clear();
      this.messageService.add({
        severity: 'error',
        summary: error.error.errors[0].errorType,
        detail: error.error.errors[0].errorMessage
      });
    }
  }
  getFormStatus(formName: string) {
    let formStatus;
    if (formName === this.fuelCalculationModel.flatFuelName) {
      formStatus = this.fuelCalculationModel.FlatDetailsForm.valid;
    } else if (formName === this.fuelCalculationModel.formulaFuelName) {
      formStatus = this.fuelCalculationModel.FormulaDetailsForm.valid;
    } else if (formName === this.fuelCalculationModel.refrigeratedFuelName) {
      formStatus = this.fuelCalculationModel.ReferDetailsForm.valid;
    } else if (formName === this.fuelCalculationModel.distanceFuelName) {
      formStatus = this.fuelCalculationModel.DistanceDetailsForm.valid;
    } else if (formName === this.fuelCalculationModel.uploadForm) {
      formStatus = FuelCalculationDetailsUtility.getIncrementalFormStatus(this.fuelCalculationModel);
    }
    return formStatus;
  }
  navigationSubscription() {
    this.broadCastService.on<RouterStateSnapshot>('navigationStarts').subscribe((value: RouterStateSnapshot) => {
      if (this.fuelCalculationModel.selectedFormName === this.fuelCalculationModel.flatFuelName) {
        this.navigateToFlat();
      } else if (this.fuelCalculationModel.selectedFormName === this.fuelCalculationModel.formulaFuelName) {
        this.navigateToFormula();
      } else if (this.fuelCalculationModel.selectedFormName === this.fuelCalculationModel.refrigeratedFuelName) {
        this.navigateToRefrigerated();
      } else if (this.fuelCalculationModel.selectedFormName === this.fuelCalculationModel.distanceFuelName) {
        this.navigateToDistance();
      } else if (this.fuelCalculationModel.selectedFormName === 'Increment') {
        this.broadCastService.broadcast('isChanged', (this.fuelCalculationModel.FuelCalculationForm.dirty &&
          this.fuelCalculationModel.FuelCalculationForm.touched));
      }
      this.changeDetector.markForCheck();
    });
  }
  private navigateToDistance() {
    this.broadCastService.broadcast('isChanged', (this.fuelCalculationModel.FuelCalculationForm.dirty &&
      this.fuelCalculationModel.FuelCalculationForm.touched) || (this.fuelCalculationModel.DistanceDetailsForm.dirty &&
        this.fuelCalculationModel.DistanceDetailsForm.touched));
  }
  private navigateToRefrigerated() {
    this.broadCastService.broadcast('isChanged', (this.fuelCalculationModel.FuelCalculationForm.dirty &&
      this.fuelCalculationModel.FuelCalculationForm.touched) || (this.fuelCalculationModel.ReferDetailsForm.dirty &&
        this.fuelCalculationModel.ReferDetailsForm.touched));
  }
  private navigateToFormula() {
    this.broadCastService.broadcast('isChanged', (this.fuelCalculationModel.FuelCalculationForm.dirty &&
      this.fuelCalculationModel.FuelCalculationForm.touched) || (this.fuelCalculationModel.FormulaDetailsForm.dirty &&
        this.fuelCalculationModel.FormulaDetailsForm.touched));
  }
  private navigateToFlat() {
    this.broadCastService.broadcast('isChanged', (this.fuelCalculationModel.FuelCalculationForm.dirty &&
      this.fuelCalculationModel.FuelCalculationForm.touched) || (this.fuelCalculationModel.FlatDetailsForm.dirty &&
        this.fuelCalculationModel.FlatDetailsForm.touched));
  }
  saveSubscription() {
    this.broadCastService.on<boolean>('loseChanges').subscribe((value: boolean) => {
      if (value) {
        FuelCalculationDetailsUtility.saveSubscriptionUtility(this.fuelCalculationModel);
      }
    });
  }
  validateReeferCurrency(value: string, formName: FormGroup, formElement: string) {
    if (value !== '') {
      this.fuelCalculationModel.formValidateName = formName;
      const enteredValue = parseInt(value, 10);
      if (enteredValue <= 32767) {
        this.fuelCalculationModel.formValidateName = formName;
        const enteredFuelAmount = this.fuelCalculationModel.formValidateName.get(formElement);
        const pattern: RegExp = /^[0-9]{1,5}?$/;
        if (enteredFuelAmount.valid || enteredFuelAmount.hasError('error')) {
          const enteredAmount = value.replace(/[, ]/g, '').trim();
          if (pattern.test(enteredAmount.toString())) {
            const modifiedAmount = enteredAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            enteredFuelAmount.setValue(modifiedAmount);
          } else {
            this.fuelCalculationModel.formValidateName.controls[formElement].setErrors({ invalid: true });
            this.fuelCalculationModel.formValidateName.controls[formElement].markAsTouched();
          }
        }
      } else {
        this.fuelCalculationModel.formValidateName.controls[formElement].setErrors({ invalid: true });
        this.fuelCalculationModel.formValidateName.controls[formElement].markAsTouched();
      }
    }
  }
  onChangeDistRounding(event: Event, element: string) {
    if (event['value'] !== null) {
      this.fuelCalculationModel.ReferDetailsForm.controls[element].setValue(event['value']);
    }
  }
  getFormDirtyCheck(formName: string) {
    let formDirtyStatus;
    if (formName === this.fuelCalculationModel.flatFuelName) {
      formDirtyStatus = this.fuelCalculationModel.FlatDetailsForm.dirty;
    } else if (formName === this.fuelCalculationModel.formulaFuelName) {
      formDirtyStatus = this.fuelCalculationModel.FormulaDetailsForm.dirty;
    } else if (formName === this.fuelCalculationModel.refrigeratedFuelName) {
      formDirtyStatus = this.fuelCalculationModel.ReferDetailsForm.dirty;
    } else if (formName === this.fuelCalculationModel.distanceFuelName) {
      formDirtyStatus = this.fuelCalculationModel.DistanceDetailsForm.dirty;
    } else if (formName === this.fuelCalculationModel.uploadForm) {
      formDirtyStatus = this.fuelCalculationModel.uploadTablearray.length > 0 || this.fuelCalculationModel.loaderFlag === true;
    }
    return formDirtyStatus;
  }
  onFilesUpload(event) {
    const extension = event.files[0].name.split('.').pop();
    if (this.fuelCalculationModel.allowedAttahcmentFormat.indexOf(extension.toLowerCase()) === -1 || event.files[0].size > 500000) {
      const message = this.fuelCalculationModel.allowedAttahcmentFormat.indexOf(extension.toLowerCase()) === -1 ?
        'Invalid file format' :
        'Document exceeds max size allowed; Please attach document of a smaller size or break into multiple smaller documents.';
      FuelCalculationDetailsUtility.toastMessage(this.messageService, 'error', message);
      return;
    } else {
      this.fuelCalculationModel.fileName = event.files[0].name;
      this.fuelCalculationModel.fileExt = extension;
      this.fuelCalculationModel.uploadFlag = false;
      this.fuelCalculationModel.loaderFlag = true;
      const formData = new FormData();
      formData.append('file', event.files[0], event.files[0].name);
      this.postFileDetail(this.fuelCalculationModel.fileExt, formData);
    }
  }
  postFileDetail(fileext, formData) {
    this.fuelCalculationDetailsService.getUploadDataTable(formData).pipe(takeWhile(() => this.fuelCalculationModel.subscriberUploadFlag))
      .subscribe((data: UploadDataList[]) => {
        this.fuelCalculationModel.uploadFlag = false;
        this.fuelCalculationModel.loaderFlag = false;
        this.fuelCalculationModel.tableFlag = true;
        this.fuelCalculationModel.isPageLoading = true;
        this.changeDetector.detectChanges();
        if (!utils.isEmpty(data)) {
          setTimeout(() => {
            this.fuelCalculationModel.uploadTablearray = data;
            this.changeDetector.detectChanges();
            this.checkGapAndDuplicates();
            this.fuelCalculationModel.isPageLoading = false;
            FuelCalculationDetailsUtility.toastMessage(this.messageService, 'success',
            this.fuelCalculationModel.isReplace ? 'You have replaced the incremental charge table' :
              'Successful load of fuel increment charge table', this.fuelCalculationModel.isReplace ? 'Incremental Charge Replaced' :
              'Success');
            FuelCalculationDetailsUtility.checkMinimumInArray(this.fuelCalculationModel);
            this.elRef.nativeElement.querySelector(`.uploadTable table tbody > tr:nth-child(
                ${this.fuelCalculationModel.minArrayVal} )`).classList.add('firstError');
            this.elRef.nativeElement.querySelector('.firstError').scrollIntoView();
          }, 500);
          setTimeout(() => {
            FuelCalculationDetailsUtility.checkHeight(this.elRef, this.fuelCalculationModel, this.changeDetector);
          }, 1200);
        }
        this.fuelCalculationModel.uploadFlag = false;
        this.fuelCalculationModel.tableFlag = true;
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.fuelCalculationModel.loaderFlag = false;
        this.fuelCalculationModel.uploadFlag = true;
        this.fuelCalculationModel.inlineError = false;
        if (error.error.errors.length && error.error.errors[0].errorMessage === 'digit_value_violation') {
          FuelCalculationDetailsUtility.toastMessage(this.messageService, 'error', 'Exceeds permissible limit');
        }
        this.changeDetector.detectChanges();
      });
  }
  uploadPopup() {
    if (this.fuelCalculationModel.uploadTablearray.length > 0) {
      this.fuelCalculationModel.uploadPopup = true;
      this.fuelCalculationModel.isReplace = true;
    } else {
      this.clickYes();
    }
  }
  clickNo() {
    this.fuelCalculationModel.uploadPopup = false;
  }
  clickYes() {
    FuelCalculationDetailsUtility.uploadClickYes(this.fuelCalculationModel);
  }
  roundingDigit() {
    for (let index = 0; index < this.fuelCalculationModel.uploadTablearray.length; index++) {
      this.fuelCalculationModel.uploadTablearray[index]['id'] = index;
      FuelCalculationDetailsUtility.fourDecimalprecision(
        this.fuelCalculationModel.FuelCalculationForm.controls['roundingdigit']['value']['fuelRoundingDecimalNumber'],
        this.fuelCalculationModel, index);
    }
  }
  checkGapAndDuplicates() {
    this.sortUploadedData();
    FuelCalculationDetailsUtility.checkGapDupliates(this.fuelCalculationModel);
    for (let index = 0; index < this.fuelCalculationModel.uploadTablearray.length; index++) {
      this.fuelCalculationModel.uploadTablearray[index]['id'] = index;
      FuelCalculationDetailsUtility.fourDecimalprecision(
        this.fuelCalculationModel.FuelCalculationForm.controls['roundingdigit']['value']['fuelRoundingDecimalNumber'],
        this.fuelCalculationModel, index);
      if (FuelCalculationDetailsUtility.checkGapAndOverlap(index, this.fuelCalculationModel)) {
        const errorReason = FuelCalculationDetailsUtility.checkGapOrDuplicate(index, this.fuelCalculationModel);
        FuelCalculationDetailsUtility.checkAndPushGaps(index, errorReason, this.fuelCalculationModel);
      }
      this.checkCharge(index);
      FuelCalculationDetailsUtility.checkForNumber(index, this.fuelCalculationModel);
    }
    FuelCalculationDetailsUtility.overLapOrDuplicateMsg(this.fuelCalculationModel);
  }
  checkOverlap(index: number, range?: string) {
    this.fuelCalculationModel.inlineError = true;
    this.fuelCalculationModel.borderFlag = true;
    FuelCalculationDetailsUtility.fourDecimalprecision(this.fuelCalculationModel.FuelCalculationForm.controls
    ['roundingdigit']['value']['fuelRoundingDecimalNumber'], this.fuelCalculationModel, index);
    FuelCalculationDetailsUtility.checkValidations(index, this.fuelCalculationModel, range);
    if (range) {
      this.checkOverlapSiblings(index, range);
    }
    FuelCalculationDetailsUtility.overLapOrDuplicateMsg(this.fuelCalculationModel);
  }
  checkOverlapSiblings(overlapIndex: number, range: string) {
    if (range === 'fuelEndAmount' && (this.fuelCalculationModel.uploadTablearray.length - 1) !== overlapIndex) {
      this.checkOverlap(overlapIndex + 1);
    } else if (range === 'fuelBeginAmount' && overlapIndex !== 0) {
      this.checkOverlap(overlapIndex - 1);
    }
  }
  checkCharge(index: number) {
    this.fuelCalculationModel.inlineError = true;
    this.fuelCalculationModel.borderFlag = true;
    FuelCalculationDetailsUtility.fourDecimalprecision(this.fuelCalculationModel.FuelCalculationForm.controls
    ['roundingdigit']['value']['fuelRoundingDecimalNumber'], this.fuelCalculationModel, index);
    FuelCalculationDetailsUtility.checkChargeValue(index, this.fuelCalculationModel);
  }
  selectedListRow(event: Event) {
    FuelCalculationDetailsUtility.getSelectedListRows(this.fuelCalculationModel);
  }
  onClickHeaderCheckbox(event) {
    this.fuelCalculationModel.headerCheck = event;
  }
  addNewRow() {
    let rowIndex;
    const indexArray = [];
    for (const value of this.uploadtable._selection) {
      indexArray.push(utils.indexOf(this.uploadtable._value, value));
    }
    const editValues = { 'fuelBeginAmount': '', 'fuelEndAmount': '', 'fuelSurchargeAmount': '' };
    if (indexArray.length > 1 || this.fuelCalculationModel.headerCheck) {
      rowIndex = Math.max.apply(Math, indexArray) + 1;
    } else {
      rowIndex = indexArray[0] + 1;
    }
    this.fuelCalculationModel.uploadTablearray.splice(rowIndex, 0, editValues);
    this.roundingDigit();
    this.resetSort();
    this.clearErrors();
  }
  removeCharge(selectedItemList: UploadDataList[]) {
    FuelCalculationDetailsUtility.removeSelectedCharges(this.fuelCalculationModel, selectedItemList);
    this.resetSort();
    this.clearErrors();
    this.changeDetector.detectChanges();
  }
  resetSort() {
    this.uploadtable.sortOrder = 0;
    this.uploadtable.sortField = '';
  }
  clearErrors() {
    FuelCalculationDetailsUtility.checkGapDupliates(this.fuelCalculationModel);
  }
  onClickDeselect() {
    this.fuelCalculationModel.selectedItemList = [];
    this.changeDetector.detectChanges();
  }
  customSort(event: SortEvent) {
    FuelCalculationDetailsUtility.customSort(event);
  }
  omitSpecialChar(event) {
    return (event.charCode === 46 || (event.charCode >= 48 && event.charCode <= 57));
  }
  onEditTable(event, data: object, value: string) {
    FuelCalculationDetailsUtility.onEditTableValidation(event, data, value, this.fuelCalculationModel);
  }
  onfocusAmount(fieldName) {
    this.fuelCalculationModel.editValue = fieldName.value;
    this.fuelCalculationModel.editValue = this.fuelCalculationModel.editValue ? this.fuelCalculationModel.editValue.replace(/,/g, '') : '';
  }
  checkRollUp() {
    FuelCalculationDetailsUtility.checkRollUp(this.fuelCalculationModel);
  }
  onFormKeypress(value: string, formName: FormGroup, formElement: string, patternName?: string): boolean | undefined {
    const pattern = patternName === 'posInteger' ? /^[0-9]{0,5}?$/ : /^\-?\d{0,7}(\.\d{0,4})?$/;
    if (!pattern.test(value)) {
      formName['controls'][formElement].setValue(this.fuelCalculationModel.enteredValue);
      return false;
    }
    this.fuelCalculationModel.enteredValue =  value;
    formName['controls'][formElement].setValue(value);
  }
}
