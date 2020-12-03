import {
  Component, OnInit, OnDestroy, Input, ChangeDetectorRef, Output, EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { AdditionalChargesModel } from './model/additional-charges-model';
import { FormGroup, FormArray, FormControl, Validators, AbstractControl } from '@angular/forms';
import { takeWhile, finalize } from 'rxjs/operators';
import { AdditionalChargesService } from './service/additional-charges.service';
import {
  ChargeCodeInterface, RateTypeInterface, BuSoAssociation, ChargeCodeResponseInterface,
  ChargeTypeBusinessUnitServiceOfferingAssociationsItem,
  EditAdditionalChargeResponse
} from './model/additional-charges-interface';
import * as utils from 'lodash';
import { MessageService } from 'primeng/components/common/messageservice';
import { CurrencyPipe } from '@angular/common';
import { PathcAdditionalChargesUtility } from './service/patch-additional-charges-utility';

@Component({
  selector: 'app-additional-charges',
  templateUrl: './additional-charges.component.html',
  styleUrls: ['./additional-charges.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdditionalChargesComponent implements OnInit, OnDestroy {
  addChargesModel: AdditionalChargesModel;
  constructor(private readonly changeDetector: ChangeDetectorRef,
    private readonly additionalChargesService: AdditionalChargesService,
    private readonly messageService: MessageService,
    private readonly currencyPipe: CurrencyPipe) {
    this.addChargesModel = new AdditionalChargesModel();
  }
  @Input()
  set isEditAccessorialRateClicked(isEditAccessorialRateClicked: boolean) {
    this.addChargesModel.isAddchargesEditRateClicked = isEditAccessorialRateClicked;
  }
  @Input()
  set editAdditionalChargeResponse(editAdditionalChargeResponse: EditAdditionalChargeResponse[]) {
    if (editAdditionalChargeResponse) {
      this.addChargesModel.editAdditionalChargeResponse = editAdditionalChargeResponse;
    }
  }
  @Input()
  set chargeTypeValues(value: ChargeCodeResponseInterface[]) {
    this.addChargesModel.chargeCodeResponse = value;
    this.mapChargeCodeResponse(value);
  }
  @Input()
  set selectedBuSo(data: number[]) {
    this.filterChargeTypeBasedOnBuSo(data);
  }
  @Input()
  set selectedChargeType(value: ChargeCodeInterface) {
    this.addChargesModel.selectedChargeType = value;
    this.validateSelectedChargeType(value);
  }
  @Output()
  removeAll: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit() {
    this.createAdditionalChargesForm();
    this.getRateTypes(0, true);
    this.addChargesModel.rateAmountValues.push(null);
    this.patchAdditionalCharges();
  }
  ngOnDestroy() {
    this.addChargesModel.subscribeFlag = false;
  }
  createAdditionalChargesForm() {
    this.addChargesModel.addChargesForm = new FormGroup({
      charges: new FormArray([this.createChargesItem()])
    });
  }
  patchAdditionalCharges() {
    if (this.addChargesModel.isAddchargesEditRateClicked && !utils.isEmpty(this.addChargesModel.editAdditionalChargeResponse)) {
      PathcAdditionalChargesUtility.patchAdditionalChargeValues
        (this.addChargesModel.editAdditionalChargeResponse, this.addChargesModel, this.currencyPipe);
      this.changeDetector.detectChanges();
    }
  }
  filterChargeTypeBasedOnBuSo(data: Array<number>) {
    let chargeTypes = [];
    if (data.length) {
      data.forEach((selectedBuSo: number) => {
        chargeTypes = this.addChargesModel.chargeCodeResponse.filter((chargeCode: ChargeCodeResponseInterface) => {
          const chargeCodeAssociations = chargeCode.chargeTypeBusinessUnitServiceOfferingAssociations.
            filter((chargeTypeAssociation: ChargeTypeBusinessUnitServiceOfferingAssociationsItem) => {
              return chargeTypeAssociation.
                financeBusinessUnitServiceOfferingAssociation.financeBusinessUnitServiceOfferingAssociationID === selectedBuSo;
            });
          return chargeCodeAssociations.length;
        });
      });
      this.mapChargeCodeResponse(chargeTypes);
      if (this.addChargesModel.addChargesForm && !this.addChargesModel.isAddchargesEditRateClicked) {
        const ratesForm = (this.addChargesModel.addChargesForm.get('charges') as FormArray);
        ratesForm.controls.forEach((rowRef) => {
          rowRef['controls']['chargeType'].setValue('');
          rowRef['controls']['rateType'].setValue('');
        });
      }
    } else {
      this.mapChargeCodeResponse(this.addChargesModel.chargeCodeResponse);
    }
  }
  mapChargeCodeResponse(response: ChargeCodeResponseInterface[]) {
    this.addChargesModel.chargeType = response.map((value: ChargeCodeResponseInterface) => {
      return {
        label: `${value['chargeTypeName']} (${value['chargeTypeCode']})`,
        value: value['chargeTypeID'],
        description: value['chargeTypeCode']
      };
    });
  }
  createChargesItem() {
    const amountPattern = '[-0-9., ]*';
    return new FormGroup({
      chargeType: new FormControl('', [Validators.required]),
      rateType: new FormControl('', [Validators.required]),
      rateAmount: new FormControl('', [Validators.required, Validators.pattern(amountPattern)])
    });
  }
  validateSelectedChargeType(value: ChargeCodeInterface) {
    if (value && this.addChargesModel.addChargesForm) {
      const chargesForm = (this.addChargesModel.addChargesForm.get('charges') as FormArray);
      chargesForm.controls.forEach((rowRef) => {
        if (rowRef['controls']['chargeType'].value['label'] === this.addChargesModel.selectedChargeType['label']) {
          rowRef['controls']['chargeType'].setErrors({ 'invalid': true });
          this.addChargesModel.invalidChargeType = true;
          this.showErrorMsg(this.addChargesModel.invalidChargeTypeSummary,
            this.addChargesModel.invalidChargeTypeDetail);
        } else if (rowRef['controls']['chargeType'].hasError('invalid')) {
          rowRef['controls']['chargeType'].setErrors(null);
          this.addChargesModel.invalidChargeType = false;
        }
      });
    }
  }
  onInputChargeType(event, position: number) {
    const rateTypeRef = (this.addChargesModel.addChargesForm.controls.charges as FormArray).at(position).get('rateType');
    const chargeTypeRef = (this.addChargesModel.addChargesForm.controls.charges as FormArray).at(position).get('chargeType');
    if (!event['data']) {
      rateTypeRef.setValue('');
      chargeTypeRef.setValue('');
      this.addChargesModel.buSoIds = [];
      this.addChargesModel.rateTypesArray[position] = this.addChargesModel.rateTypes;
    }
  }
  onSelectChargeType(event, position: number) {
    const chargeTypeRef = (this.addChargesModel.addChargesForm.controls.charges as FormArray).at(position).get('chargeType');
    const rateTypeRef = (this.addChargesModel.addChargesForm.controls.charges as FormArray).at(position).get('rateType');
    if (event['label'] === this.addChargesModel.selectedChargeType['label']) {
      chargeTypeRef.setErrors({ 'invalid': true });
      this.addChargesModel.invalidChargeType = true;
      this.showErrorMsg(this.addChargesModel.invalidChargeTypeSummary,
        this.addChargesModel.invalidChargeTypeDetail);
    } else {
      chargeTypeRef.setErrors(null);
      this.addChargesModel.invalidChargeType = false;
    }
    this.addChargesModel.buSoIds = [];
    rateTypeRef.setValue('');
    this.additionalChargesService.getBUbasedOnChargeType(event['value'])
      .subscribe((data: BuSoAssociation[]) => {
        data.forEach((buSo: BuSoAssociation) => {
          this.addChargesModel.buSoIds.push(buSo['chargeTypeBusinessUnitServiceOfferingAssociationID']);
        });
        this.getRateTypes(position);
      });
  }

  onTypeChargeType(event: Event) {
    const chargesForm = (this.addChargesModel.addChargesForm.get('charges') as FormArray);
    const chargeTypes = [];
    chargesForm.controls.forEach((rowRef) => {
      chargeTypes.push(rowRef['controls']['chargeType'].value);
    });
    this.addChargesModel.chargeTypeSuggestions = [];
    if (this.addChargesModel.chargeType) {
      this.addChargesModel.chargeType.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.addChargesModel.chargeTypeSuggestions.push({
            label: element.label,
            value: element.value,
            description: element.description
          });
        }
      });
    }
    this.addChargesModel.chargeTypeSuggestions = utils.differenceBy(this.addChargesModel.chargeTypeSuggestions, chargeTypes, 'label');
    this.addChargesModel.chargeTypeSuggestions = utils.sortBy(this.addChargesModel.chargeTypeSuggestions, 'label');
    this.changeDetector.detectChanges();
  }
  onRateAmountFormKeypress(event, position: number): boolean | undefined {
    const pattern = /^\-?\d{0,7}(\.\d{0,4})?$/;
    const rateAmountRef = (this.addChargesModel.addChargesForm.controls.charges as FormArray).at(position).get('rateAmount');
    const rateAmountVal = rateAmountRef.value;
    const isEditScenario = rateAmountVal.includes(',');
    const rateAmount = rateAmountVal.replace(/,/g, '');
    if (!pattern.test(rateAmount)) {
      if (isEditScenario) {
        rateAmountRef.setValue(this.formatAmount(this.addChargesModel.rateAmountValues[position].toString(), rateAmountRef));
      } else {
        rateAmountRef.setValue(this.addChargesModel.rateAmountValues[position]);
      }
      return false;
    }
    this.addChargesModel.rateAmountValues[position] = rateAmount;
    rateAmountRef.setValue(event.target.value);
  }
  getRateTypes(position: number, isComponentInitialized = false) {
    this.addChargesModel.rateTypeLoading = true;
    this.additionalChargesService.getRateTypes(this.addChargesModel.buSoIds).pipe(takeWhile(() => this.addChargesModel.subscribeFlag),
      finalize(() => {
        this.addChargesModel.rateTypeLoading = false;
        this.changeDetector.detectChanges();
      }))
      .subscribe((data: RateTypeInterface[]) => {
        if (data) {
          const rateTypes = [];
          data.forEach((rateType: RateTypeInterface) => {
            rateTypes.push({
              label: rateType.rateTypeName,
              value: rateType.rateTypeId
            });
          });
          // Satisfied for the first time only i.e on ngOnInit when the position will be 0 and array would be empty
          if (isComponentInitialized) {
            this.addChargesModel.rateTypes = rateTypes;
          }
          this.addChargesModel.rateTypesArray[position] = rateTypes;
        }
      }, (error: Error) => {
        this.addChargesModel.rateTypeLoading = false;
        this.addChargesModel.rateTypesArray[position] = [];
      });
  }
  onautoCompleteBlur(event: Event, controlName: string, position: number) {
    const val = (this.addChargesModel.addChargesForm.controls.charges as FormArray).at(position).get(controlName).value;
    if (val && !event.target['value']) {
      (this.addChargesModel.addChargesForm.controls.charges as FormArray).at(position).get(controlName).setValue(null);
      (this.addChargesModel.addChargesForm.controls.charges as FormArray).at(position).get(controlName).markAsDirty();
    }
  }
  onTypeRateType(event: Event, position: number) {
    this.addChargesModel.rateTypeSuggestions[position] = [];
    if (this.addChargesModel.rateTypesArray[position]) {
      this.addChargesModel.rateTypesArray[position].forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.addChargesModel.rateTypeSuggestions[position].push({
            label: element.label,
            value: element.value
          });
        }
        this.addChargesModel.rateTypeSuggestions[position] = utils.sortBy(this.addChargesModel.rateTypeSuggestions[position], 'label');
      });
    }
    this.changeDetector.markForCheck();
  }
  formatAmount(value: string, rateAmountRef: AbstractControl) {
    let formattedRateAmount = '';
    formattedRateAmount = this.currencyPipe.transform(value, '', '', '1.2-4');
    if (formattedRateAmount === '0.00') {
      formattedRateAmount = '';
      rateAmountRef.setErrors({ invalid: true });
    } else {
      rateAmountRef.setErrors(null);
    }
    this.changeDetector.detectChanges();
    return formattedRateAmount;
  }
  validateRateAmount(value: string, position: number) {
    const rateAmount = (this.addChargesModel.addChargesForm.get('charges') as FormArray).at(position).get('rateAmount');
    rateAmount.setValue(this.formatAmount(this.addChargesModel.rateAmountValues[position].toString(), rateAmount));
  }

  addAdditionalChargeRow(position) {
    const rowRef = (this.addChargesModel.addChargesForm.get('charges') as FormArray).at(position);
    if (rowRef.valid) {
      (this.addChargesModel.addChargesForm.controls.charges as FormArray).insert(position + 1, this.createChargesItem());
      this.addChargesModel.rateTypesArray.splice(position + 1, 0, this.addChargesModel.rateTypes);
      this.addChargesModel.rateTypeSuggestions.push([]);
      this.addChargesModel.rateAmountValues.splice(position + 1, 0, null);
      this.addChargesModel.showMinuIcon = true;
      this.changeDetector.markForCheck();
    } else {
      this.validateRow(rowRef, true);
    }
  }
  validateRow(rowRef: AbstractControl, showError: boolean): boolean {
    let valid = true;
    if (this.addChargesModel.invalidChargeType) {
      valid = false;
      if (showError) {
        this.showErrorMsg(this.addChargesModel.invalidChargeTypeSummary,
          this.addChargesModel.invalidChargeTypeDetail);
      }
    } else {
      Object.keys(rowRef['controls']).forEach((fieldControlKey: string) => {
        if (rowRef['controls'][fieldControlKey].value === '') {
          rowRef['controls'][fieldControlKey].markAsTouched();
          valid = false;
        }
      });
      if (!valid && showError) {
        this.showErrorMsg('Missing Required Information', 'Provide the required information in the highlighted fields.');
      }
      this.changeDetector.markForCheck();
    }
    return valid;
  }
  showErrorMsg(summary: string, detail: string) {
    this.messageService.clear();
    this.messageService.add({
      severity: 'error', summary, detail
    });
  }
  removeCharge(position: number) {
    const chargesForm = (this.addChargesModel.addChargesForm.get('charges') as FormArray);
    chargesForm.removeAt(position);
    this.addChargesModel.rateTypesArray.splice(position, 1);
    this.addChargesModel.rateAmountValues.splice(position, 1);
  }
  onRemoveAllChargesClick() {
    if (this.isAdditionalChargesEmpty()) {
      this.removeAllCharges();
    } else {
      this.addChargesModel.showRemoveAllConfirmPop = true;
    }
  }
  isAdditionalChargesEmpty() {
    const chargesForm = (this.addChargesModel.addChargesForm.get('charges') as FormArray);
    return utils.isEmpty(chargesForm.value[0].chargeType || chargesForm.value[0].rateType || chargesForm.value[0].rateAmount);
  }
  onPopNo() {
    this.addChargesModel.showRemoveAllConfirmPop = false;
  }
  removeAllCharges() {
    this.removeAll.emit();
  }

}
