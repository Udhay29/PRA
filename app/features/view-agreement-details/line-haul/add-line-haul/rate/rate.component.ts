import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormControl, FormArray, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';
import { MessageService } from 'primeng/components/common/messageservice';
import * as utils from 'lodash';

import { RateModel } from './models/rate.model';
import { RateService } from './services/rate.service';
import {
  RateTypesInterface, GroupRateTypesInterface,
  RateDropDownInterface, ResponseType
} from './models/rate.interface';
import { ContractInterface } from '../overview/model/overview.interface';
import { LineHaulValues } from '../../additional-information/line-haul-overview/model/line-haul-overview.interface';
import { ViewAgreementDetailsUtility } from './../../../service/view-agreement-details-utility';
import { BroadcasterService } from '../../../../../shared/jbh-app-services/broadcaster.service';


@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss']
})
export class RateComponent implements OnInit {
  @Input() sourceType: RateDropDownInterface;
  @Input() set selectedSection(sectionValue: ContractInterface) {
    if (sectionValue) {
      this.getCurrencyCodeBasedOnSection(sectionValue);
    }
  }
  rateModel: RateModel;

  constructor(private readonly rateService: RateService,
    private readonly messageService: MessageService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly currencyPipe: CurrencyPipe, private readonly utilityService: ViewAgreementDetailsUtility,
    private readonly shared: BroadcasterService) {
    this.rateModel = new RateModel();
  }

  ngOnInit() {
    this.createRatesForm();
    this.getRateTypes();
    this.getGroupRateTypes();
    this.getCurrencyCode();
    this.setvalueforRateSection();
  }

  createRatesForm() {
    this.rateModel.rateForm = new FormGroup({
      sourceIdentifier: new FormControl('', Validators.pattern('[0-9]*')),
      sourceLineHaulIdentifier: new FormControl('', Validators.pattern('[0-9]*')),
      rates: new FormArray([this.createRateItem()]),
      groupRateType: new FormControl(''),
      isGroupRateItemize: new FormControl(false)
    });

    this.enableFirstCurrency();
  }

  addRate(position: number) {
    const rateFC = (this.rateModel.rateForm.get('rates') as FormArray);
    const rateFCLength = (this.rateModel.rateForm.controls.rates as FormArray).length;
    const CurrencyinFirstRow = (this.rateModel.rateForm.get('rates') as FormArray).at(0).get('currency');

    if ((this.rateModel.rateForm.get('rates') as FormArray).valid) {
      if (!CurrencyinFirstRow.value) {
        this.rateModel.selectedCurrency = '';
      }
      (this.rateModel.rateForm.controls.rates as FormArray).insert(position + 1, this.createRateItem());
      this.showHideRateGroup();
    } else {
      for (let i = 0; i < rateFCLength; i++) {
        rateFC.at(i).get('type').markAsTouched();
        rateFC.at(i).get('amount').markAsTouched();
        rateFC.at(i).get('currency').markAsTouched();
      }
      this.messageService.clear();
      this.messageService.add({
        severity: 'error', summary: 'Missing Required Information',
        detail: 'Provide the required information in the highlighted fields'
      });

      this.checkMinMaxRange(position);
    }

  }

  onautoCompleteBlur(event: Event, controlName: string, position: number) {
    this.rateModel.showMinusIcon = true;
  }

  onClearValue(controlName: string, position: number) {
    (this.rateModel.rateForm.controls.rates as FormArray).at(position).get(controlName).setValue(null);
  }
  showHideRateGroup() {
    const ratesLength = (this.rateModel.rateForm.controls.rates as FormArray).length;
    const groupRateType = this.rateModel.rateForm.get('groupRateType');
    const isGroupRateItemizeFC = this.rateModel.rateForm.get('isGroupRateItemize');
    if (ratesLength > 1) {
      this.rateModel.isMoreThanOneRate = true;
      groupRateType.setValidators(Validators.required);
    } else {
      this.rateModel.isMoreThanOneRate = false;
      groupRateType.setValue('');
      groupRateType.markAsUntouched();
      groupRateType.clearValidators();
      isGroupRateItemizeFC.setValue(false);
    }

    groupRateType.updateValueAndValidity();
  }

  validateAmount(value: string, position: number, controlName: string) {
    const amountFC = (this.rateModel.rateForm.get('rates') as FormArray).at(position).get(controlName);
    if (amountFC.valid || amountFC.hasError('error')) {
      const enteredAmount = value.replace(/[, ]/g, '').trim();
      const wholeAmount = enteredAmount.split('.')[0].substring(0, 9);
      const decimalAmount = enteredAmount.split('.')[1] || '';
      const amount = +`${wholeAmount}.${decimalAmount}`;

      if (isNaN(amount)) {
        amountFC.setValue('');
      } else {
        const modifiedAmount = amount.toString().replace(/[, ]/g, '').trim();
        const formattedAmount = this.currencyPipe.transform(modifiedAmount, '', '', '1.2-4');
        amountFC.setValue(formattedAmount);
      }

      this.validateAmountRange(position, controlName);
    }
  }
  amountFieldEntered() {
    this.rateModel.showMinusIcon = true;
  }
  validateAmountRange(position: number, controlName: string) {
    const amountFC = (this.rateModel.rateForm.get('rates') as FormArray).at(position).get('amount');
    const minAmountFC = (this.rateModel.rateForm.get('rates') as FormArray).at(position).get('minAmount');
    const maxAmountFC = (this.rateModel.rateForm.get('rates') as FormArray).at(position).get('maxAmount');

    switch (controlName) {
      case 'amount':
        if (amountFC.value && maxAmountFC.value) {
          this.checkMinMaxRange(position);
        }
        break;

      case 'minAmount':
        if (minAmountFC.value && maxAmountFC.value) {
          this.checkMinMaxRange(position);
        }
        break;

      case 'maxAmount':
        if ((minAmountFC.value && maxAmountFC.value) || (amountFC.value && maxAmountFC.value)) {
          this.checkMinMaxRange(position);
        }
        break;
    }
  }

  checkMinMaxRange(position: number) {
    const rateFC = (this.rateModel.rateForm.get('rates') as FormArray).at(position);
    const minAmountFC = rateFC.get('minAmount');
    const maxAmountFC = rateFC.get('maxAmount');
    const amountFC = rateFC.get('amount');
    const amount = parseFloat(amountFC.value.toString().replace(/,/g, ''));
    const minAmount = parseFloat(minAmountFC.value.toString().replace(/,/g, ''));
    const maxAmount = parseFloat(maxAmountFC.value.toString().replace(/,/g, ''));

    if (minAmountFC.hasError('error')) {
      minAmountFC.setErrors(null);
    }

    if (amountFC.hasError('error')) {
      amountFC.setErrors(null);
    }

    if (maxAmountFC.hasError('error')) {
      maxAmountFC.setErrors(null);
    }

    if (minAmount > maxAmount) {
      this.showError('The minimum amount cannot be greater than the maximum amount');
      minAmountFC.setErrors({ error: true });
      maxAmountFC.setErrors({ error: true });
    } else if (amount > maxAmount) {
      this.showError('The amount specified should be less than the maximum amount specified');
      amountFC.setErrors({ error: true });
      maxAmountFC.setErrors({ error: true });
    }
  }

  showError(message: string) {
    this.messageService.clear();
    this.messageService.add({
      severity: 'error', summary: 'Missing Required Information',
      detail: message
    });
  }

  createRateItem(): FormGroup {
    const selectedCurrency = this.rateModel.selectedCurrency;

    const currency = selectedCurrency ? { value: { label: selectedCurrency, value: selectedCurrency }, disabled: true } : '';

    return new FormGroup({
      type: new FormControl('', Validators.required),
      amount: new FormControl('', [Validators.required, Validators.pattern('[0-9., ]*')]),
      minAmount: new FormControl('', [Validators.pattern('[0-9., ]*')]),
      maxAmount: new FormControl('', [Validators.pattern('[0-9., ]*')]),
      currency: new FormControl(currency, Validators.required)
    });
  }

  removeRate(position: number) {
    const ratesForm = (this.rateModel.rateForm.get('rates') as FormArray);
    const firstRate = ratesForm.at(0);
    if (ratesForm.length === 1) {
      firstRate.reset();
      if (this.rateModel.currecyCodeBasedOnSection) {
        firstRate.get('currency').setValue({ label: this.rateModel.selectedCurrency, value: this.rateModel.selectedCurrency });
      }
    } else {
      ratesForm.removeAt(position);

      if (!position && !this.rateModel.currecyCodeBasedOnSection) {
        this.enableFirstCurrency();
      }
    }
    this.showHideRateGroup();
  }

  enableFirstCurrency() {
    (this.rateModel.rateForm.get('rates') as FormArray).at(0).get('currency').enable();
  }

  getRateTypes() {
    this.rateService.getRateTypes().pipe(takeWhile(() => this.rateModel.subscribeFlag))
      .subscribe((data: ResponseType) => {
        if (data) {
          this.setRateTypes(data);
        }
      });
  }

  getGroupRateTypes() {
    this.rateService.getGroupRateTypes().pipe(takeWhile(() => this.rateModel.subscribeFlag))
      .subscribe((data: ResponseType) => {
        if (data) {
          this.setGroupTypes(data);
        }
      });
  }

  getCurrencyCode() {
    this.rateService.getCurrencyCodes().pipe(takeWhile(() => this.rateModel.subscribeFlag)).subscribe((data: [string]) => {
      if (data) {
        this.rateModel.currencyCodes = data.map((currencyCode: string, index: number) => {
          return {
            label: currencyCode,
            value: currencyCode
          };
        });
      }
    });
  }

  onGroupTypeChange(groupTypeId: number) {
    if (groupTypeId === 1) {
      this.rateModel.isGroupRateTypeSum = true;
    } else {
      this.rateModel.isGroupRateTypeSum = false;
    }
  }

  onSourceIdenfiterBlur(value: string) {
    const sourceIdenfitierControl = this.rateModel.rateForm.get('sourceIdentifier');
    sourceIdenfitierControl.setValue(value.trim().substring(0, 9));
  }

  onSourceLHIdenfiterBlur(value: string) {
    const sourceLineHaulIdentifierControl = this.rateModel.rateForm.get('sourceLineHaulIdentifier');
    sourceLineHaulIdentifierControl.setValue(value.trim().substring(0, 9));
  }

  onCurrencyChange(currency: string) {
    const ratesFC = this.rateModel.rateForm.get('rates')['controls'];
    this.rateModel.selectedCurrency = currency;
    utils.each(ratesFC, (rate, index: number) => {
      if (index > 0) {
        (this.rateModel.rateForm.get('rates') as FormArray).at(index).get('currency').disable();
      }
      rate['controls']['currency'].setValue({ label: currency, value: currency });
    });
  }

  onTypeRateType(event: Event) {
    this.rateModel.rateTypeSuggestion = [];
    if (this.rateModel.rateTypes) {
      this.rateModel.rateTypes.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.rateModel.rateTypeSuggestion.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    this.changeDetector.detectChanges();
  }

  onTypeCurrency(event: Event) {
    this.rateModel.currencySuggestion = [];
    if (this.rateModel.currencyCodes) {
      this.rateModel.currencyCodes.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.rateModel.currencySuggestion.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    if (this.rateModel.currecyCodeBasedOnSection) {
      this.rateModel.currencySuggestion = [];
    }
    this.changeDetector.detectChanges();
  }

  onTypeGroupRateType(event: Event) {
    this.rateModel.groupRateTypeSuggestion = [];

    if (this.rateModel.groupRateTypes) {
      this.rateModel.groupRateTypes.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.rateModel.groupRateTypeSuggestion.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    this.changeDetector.detectChanges();
  }
  getCurrencyCodeBasedOnSection(sectionValue: ContractInterface) {
    this.rateService.getCurrencyCodeBasedOnSection(sectionValue.sectionId).pipe(takeWhile(() => this.rateModel.subscribeFlag))
      .subscribe((sectionBasedCurrency: string[]) => {
        if (sectionBasedCurrency) {
          this.rateModel.currecyCodeBasedOnSection = sectionBasedCurrency[0];
          const ratesFC = this.rateModel.rateForm.get('rates')['controls'];
          this.rateModel.selectedCurrency = sectionBasedCurrency[0];
          (this.rateModel.rateForm.get('rates') as FormArray).at(0).get('currency').disable();
          utils.each(ratesFC, (rate) => {
            rate['controls']['currency'].setValue({ label: sectionBasedCurrency[0], value: sectionBasedCurrency[0] });
            rate['controls']['currency'].disable();
            this.changeDetector.markForCheck();
          });
        }
      });
  }
  setvalueforRateSection() {
    const lineHaulDetailsData = this.utilityService.getEditLineHaulData();
    if (lineHaulDetailsData !== undefined && lineHaulDetailsData.isEditFlag) {
      this.shared.on<LineHaulValues>('editlinehaulDetails').pipe(takeWhile(() => this.rateModel.subscribeFlag))
      .subscribe((editLineHaulData: LineHaulValues) => {
        if (!utils.isEmpty(editLineHaulData)) {
          if (editLineHaulData['rates'].length >= 1) {
            this.rateModel.showMinusIcon = true;
          }
          if (editLineHaulData['rates'].length > 1) {
            this.rateModel.isMoreThanOneRate = true;
          }
          this.getEditRateTypes(editLineHaulData);
        }
        this.changeDetector.detectChanges();
      });
    }
  }
  createEditRateFormData(editLineHaulData) {
    let selecteddistType = null;
    const rateFormArray = (this.rateModel.rateForm.controls.rates as FormArray);
    this.clearRateFormArray(rateFormArray);
    const formArrayRates = (this.rateModel.rateForm.controls.rates as FormArray);
    utils.each(editLineHaulData['rates'], (rateData) => {
      selecteddistType = this.getDistanceType(rateData.chargeUnitTypeName);
      const editCurrencyType = {
        'value': {
          'label': rateData['currencyCode'],
          'value': rateData['currencyCode'],
        },
        'disabled': true
      };
      const rateAmt = this.currencyPipe.transform( rateData['rateAmount'], '', '', '1.2-4');
      const rateMinAmt = this.currencyPipe.transform( rateData['minimumAmount'], '', '', '1.2-4');
      const rateMaxAmt = this.currencyPipe.transform( rateData['maximumAmount'], '', '', '1.2-4');
      formArrayRates.push(this.editRateItem(selecteddistType, editCurrencyType, rateAmt, rateMinAmt, rateMaxAmt));
    });

  }

  setvalueForRateForm(editLineHaulData) {
    const selectedGroupRate = utils.find(this.rateModel.groupRateTypes,
      { 'label': editLineHaulData.groupRateType });
    const itemizeIndicator = editLineHaulData.groupRateItemizeIndicator === 'Yes';
    this.rateModel.rateForm.get('groupRateType').
      setValue(selectedGroupRate);
    this.rateModel.rateForm.get('isGroupRateItemize').
      setValue(itemizeIndicator);
    if (editLineHaulData.sourceID) {
      this.rateModel.rateForm.get('sourceIdentifier').
        setValue(editLineHaulData.sourceID);
    }
    if (editLineHaulData.sourceLineHaulID) {
      this.rateModel.rateForm.get('sourceLineHaulIdentifier').
        setValue(editLineHaulData.sourceLineHaulID);
    }
  }

  getDistanceType(distanceType) {
    return utils.find(this.rateModel.rateTypes,
      { 'label': distanceType });
  }

  clearRateFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }


  editRateItem(type: RateDropDownInterface, currency: object, amount: string, minAmount: string, maxAmount: string): FormGroup {
    return new FormGroup({
      type: new FormControl(type, Validators.required),
      amount: new FormControl(amount, [Validators.required, Validators.pattern('[0-9., ]*')]),
      minAmount: new FormControl(minAmount, [Validators.pattern('[0-9., ]*')]),
      maxAmount: new FormControl(maxAmount, [Validators.pattern('[0-9., ]*')]),
      currency: new FormControl(currency, Validators.required)
    });
  }

  getEditRateTypes(editLineHaulData) {
    this.rateService.getRateTypes().pipe(takeWhile(() => this.rateModel.subscribeFlag))
      .subscribe((data: ResponseType) => {
        if (data) {
          this.setRateTypes(data);
        }
        this.getEditGroupRateTypes(editLineHaulData);
      });
  }

  setRateTypes(data: ResponseType) {
    let rateTypes = data['_embedded']['lineHaulChargeUnitTypes'];
    rateTypes = rateTypes.map((rate: RateTypesInterface) => {
      return {
        label: rate.chargeUnitTypeName,
        value: rate.lineHaulChargeUnitTypeID
      };
    });
    this.rateModel.rateTypes = rateTypes;
  }

  getEditGroupRateTypes(editLineHaulData) {
    this.rateService.getGroupRateTypes().pipe(takeWhile(() => this.rateModel.subscribeFlag))
      .subscribe((data: ResponseType) => {
        if (data) {
          this.setGroupTypes(data);
        }
        this.createEditRateFormData(editLineHaulData);
        this.setvalueForRateForm(editLineHaulData);
        this.changeDetector.detectChanges();
      });
  }

  setGroupTypes(data: ResponseType) {
    let groupRateTypes = data['_embedded']['groupRateTypes'];
    groupRateTypes = groupRateTypes.map((groupRate: GroupRateTypesInterface) => {
      return {
        label: groupRate.groupRateTypeName,
        value: groupRate.groupRateTypeID
      };
    });
    this.rateModel.groupRateTypes = groupRateTypes;
  }

  onClearGroupDownDropDown() {
    this.rateModel.rateForm['controls']['groupRateType'].setValue('');
    this.rateModel.rateForm.controls.groupRateType.setValidators(Validators.required);
    this.rateModel.rateForm.controls.groupRateType.updateValueAndValidity();
    this.changeDetector.detectChanges();
  }
}
