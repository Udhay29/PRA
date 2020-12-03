import {
  Component, ChangeDetectionStrategy, ChangeDetectorRef,
  ElementRef, Input, OnInit, Output, EventEmitter, ViewChild, AfterViewInit
} from '@angular/core';
import { Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { MessageService } from 'primeng/components/common/messageservice';
import * as utils from 'lodash';

import { LocalStorageService } from './../../../../shared/jbh-app-services/local-storage.service';

import { AddLineHaulModel } from './model/add-line-haul.model';
import { SaveResponseDto, StopsDetailsDto, StopDetails } from './../create-line-haul/model/create-line-haul.interface';
import { LaneCardService } from './lane-card/services/lane-card.service';
import { CreateLineHaulService } from '../create-line-haul/services/create-line-haul.service';
import { ViewAgreementDetailsUtility } from './../../service/view-agreement-details-utility';
import { ContractInterface } from '../add-line-haul/overview/model/overview.interface';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';
import { LineHaulValues } from '../additional-information/line-haul-overview/model/line-haul-overview.interface';
import { AddLineHaulUtility } from './service/add-line-haul-utility';
@Component({
  selector: 'app-add-line-haul',
  templateUrl: './add-line-haul.component.html',
  styleUrls: ['./add-line-haul.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddLineHaulComponent implements OnInit, AfterViewInit {

  @Input() dateValues: any;
  @Input() sectionData: Array<SaveResponseDto>;
  @Input()
  set isConfirmationContinue(value) {
    if (value) {
      this.onSave();
    }
  }
  @Input()
  set saveDraft(value) {
    if (value) {
      this.addLineHaulModel.isSaveDraft = value;
    }
  }
  @Output() backFlag: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() confirmationFlag: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() sectionDate: EventEmitter<object> = new EventEmitter<object>();
  @ViewChild('laneCard') laneCard: any;
  @ViewChild('overview') overview: any;
  @ViewChild('stops') stops: any;
  @ViewChild('rate') rate: any;
  addLineHaulModel: AddLineHaulModel;
  reviewUrl: string;
  private readonly editlineHaulDetails: LineHaulValues;
  constructor(
    private readonly router: Router,
    private readonly messageService: MessageService,
    private readonly laneCardService: LaneCardService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly localStore: LocalStorageService,
    private readonly createLineHaulService: CreateLineHaulService,
    private readonly utilityService: ViewAgreementDetailsUtility, private readonly shared: BroadcasterService) {
    this.addLineHaulModel = new AddLineHaulModel();
    this.reviewUrl = '/viewagreement/review';
  }

  ngOnInit() {
    if (this.sectionData) {
      this.addLineHaulModel.sectionValues = this.sectionData;
      this.changeDetector.detectChanges();
    }
    this.getEditLineHaulDetails();
  }

  ngAfterViewInit() {
    this.addLineHaulModel.loading = false;
  }
  onLaneCardCancel() {
    if (!this.laneCard.laneCardModel.laneCardForm.pristine || !this.overview.overviewModel.overviewForm.pristine
      || !this.rate.rateModel.rateForm.pristine || !this.stops.stopsModel.stopsForm.pristine) {
      this.addLineHaulModel.isCancel = true;
      const lineHaulDetailsData = this.utilityService.getEditLineHaulData();
      if (lineHaulDetailsData !== undefined && lineHaulDetailsData.isEditFlag) {
        this.messageService.clear();
        this.messageService.add({
          severity: 'warn', summary: 'Warning',
          detail: 'Your data will not be saved when you click on SaveAs Draft'
        });
      }
    } else {
      this.utilityService.setEditLineHaulData(
        this.addLineHaulModel.setEditSectionData = {
          isEditFlag: false,
          lineHaulDetails: null
        });
      this.navigateLineHaul();
    }
  }
  navigateLineHaul() {
    const status = this.utilityService.getreviewCancelStatus();
    if (status) {
      this.router.navigate([this.reviewUrl], { queryParams: { id: this.dateValues['agreementDetails']['customerAgreementID'] } });
    } else {
      this.router.navigate([this.addLineHaulModel.viewAgreementURL],
        { queryParams: { id: this.dateValues['agreementDetails']['customerAgreementID'] } });
    }
  }

  getTypeValues(value) {
    this.addLineHaulModel.typeId = value;
  }
  onDontSave() {
    this.utilityService.setEditLineHaulData(
      this.addLineHaulModel.setEditSectionData = {
        isEditFlag: false,
        lineHaulDetails: null
      });
    this.confirmationFlag.emit(false);
    this.navigateLineHaul();
  }
  onSave() {
    const lineHaulDetailsData = this.utilityService.getEditLineHaulData();
    if (lineHaulDetailsData !== undefined && lineHaulDetailsData.isEditFlag) {
      this.addLineHaulModel.isCancel = false;
      this.confirmationFlag.emit(false);
      this.router.navigate([this.addLineHaulModel.viewAgreementURL],
        { queryParams: { id: this.dateValues['agreementDetails']['customerAgreementID'] } });
    } else {
      this.onLaneCardContinue();
      this.addLineHaulModel.isSaveDraft = true;
      this.addLineHaulModel.isCancel = false;
    }
  }
  onLaneCardBack() {
    const lineHaulDetailsData = this.utilityService.getEditLineHaulData();
    if (lineHaulDetailsData !== undefined && lineHaulDetailsData.isEditFlag) {
    if (this.laneCard.laneCardModel.laneCardForm['controls']['originType']['value']['label'].includes('Region') ||
      this.laneCard.laneCardModel.laneCardForm['controls']['destinationType']['value']['label'].includes('Region')) {
      this.addLineHaulModel.isLaneCardBackClicked = false;
      this.addLineHaulModel.isLaneCardContinueClicked = false;
      this.toastMessage(this.messageService, 'error', 'Error', 'Screens are under development');
    } else {
      this.backNavigate();
    }
  } else {
    this.backNavigate();
    }
  }
  onLaneCardContinue() {
    if (this.addLineHaulModel.isLaneCardBackClicked) {
      this.addLineHaulModel.isLaneCardContinueClicked = false;
      this.addLineHaulModel.isLineHaulContinue = false;
    } else {
      this.addLineHaulModel.isLaneCardContinueClicked = true;
      this.addLineHaulModel.isLaneCardBackClicked = false;
      this.addLineHaulModel.isLineHaulContinue = true;
    }
    this.stops.stopsModel.isConsecutive = false;
    this.validateLaneCard();
    const isValidRegion = AddLineHaulUtility.checkValidRegion(this.laneCard.laneCardModel);
    if (this.laneCard.laneCardModel.laneCardForm.valid && this.overview.overviewModel.overviewForm.valid &&
      this.stops.stopsModel.stopsForm.valid && this.rate.rateModel.rateForm.valid && isValidRegion &&
      !this.laneCard.laneCardModel.isOriginRangeError && !this.laneCard.laneCardModel.isDestinationRangeError) {
      const lineHaulDetailsData = this.utilityService.getEditLineHaulData();
      this.saveDetails(lineHaulDetailsData);
    } else {
      this.addLineHaulModel.loading = false;
      if (!this.stops.stopsModel.isConsecutive) {
        this.formFieldsTouched();
      }
      if (!isValidRegion) {
        this.toastMessage(this.messageService, 'error', 'Error', 'Please select more than one value in Origin/Destination Point');
      }
    }
  }
  validateLaneCard() {
    if (this.laneCard.laneCardModel.laneCardForm.valid && this.overview.overviewModel.overviewForm.valid &&
      this.rate.rateModel.rateForm.valid) {
      this.onLaneCardValidate();
    } else {
      this.addLineHaulModel.isLaneCardBackClicked = false;
    }
  }
  saveDetails(lineHaulDetailsData) {
    if (lineHaulDetailsData !== undefined) {
      if (this.laneCard.laneCardModel.laneCardForm['controls']['originType']['value']['label'].includes('Region') ||
      this.laneCard.laneCardModel.laneCardForm['controls']['destinationType']['value']['label'].includes('Region')) {
        this.addLineHaulModel.isLaneCardBackClicked = false;
        this.addLineHaulModel.isLaneCardContinueClicked = false;
        this.toastMessage(this.messageService, 'error', 'Error', 'Screens are under development');
      } else {
        this.addLineHaulModel.loading = true;
        const payload = this.editpayloadFramer();
        this.saveEditLane(payload);
      }
    } else {
      this.addLineHaulModel.loading = true;
      const payload = this.payloadFramer();
      this.saveLane(payload);
    }
  }
  setConsErrorNull(i) {
    if (this.stops.stopsModel.stopsForm.controls.stops.controls[i + 1].value.point !== '') {
      this.stops.stopsModel.stopsForm.controls.stops.controls[i].controls.point.setErrors(null);
      this.stops.stopsModel.stopsForm.controls.stops.controls[i + 1].controls.point.setErrors(null);
      this.stops.stopsModel.stopsForm.controls.stops.controls[i].controls.point.updateValueAndValidity();
      this.stops.stopsModel.stopsForm.controls.stops.controls[i + 1].controls.point.updateValueAndValidity();
    }
  }
  onLaneCardValidate() {
    this.stops.stopsModel.invalidArray = [];
    for (let i = 0; i < this.stops.stopsModel.stopsForm.controls.stops.controls.length; i++) {
      if ((this.stops.stopsModel.stopsForm.controls.stops.controls[i].value.type.label === 'Address'
        || this.stops.stopsModel.stopsForm.controls.stops.controls[i].value.type.label === 'Ramp'
        || this.stops.stopsModel.stopsForm.controls.stops.controls[i].value.type.label === 'Yard'
        || this.stops.stopsModel.stopsForm.controls.stops.controls[i].value.type.label === 'Location') &&
        this.stops.stopsModel.stopsForm.controls.stops.controls[i + 1] &&
        this.stops.stopsModel.stopsForm.controls.stops.controls[i + 1].value.type.label !== 'Country') {
        if ((utils.isEqual(this.stops.stopsModel.stopsForm.controls.stops.controls[i].value.point.value,
          this.stops.stopsModel.stopsForm.controls.stops.controls[i + 1].value.point.value))
          && ((utils.isEqual(this.stops.stopsModel.stopsForm.controls.stops.controls[i].value.vendorid,
            this.stops.stopsModel.stopsForm.controls.stops.controls[i + 1].value.vendorid)) ||
            (!this.stops.stopsModel.stopsForm.controls.stops.controls[i].value.vendorid &&
              !this.stops.stopsModel.stopsForm.controls.stops.controls[i + 1].value.vendorid))) {
          this.toastMessage(this.messageService, 'error', 'Error', 'Two consecutive stops cannot have same point');
          this.stops.stopsModel.stopsForm.controls.stops.controls[i].controls.point.setErrors({ invalid: true });
          this.stops.stopsModel.stopsForm.controls.stops.controls[i + 1].controls.point.setErrors({ invalid: true });
          this.stops.stopsModel.stopsForm.controls.stops.controls[i].controls.point.markAsTouched();
          this.stops.stopsModel.stopsForm.controls.stops.controls[i + 1].controls.point.markAsTouched();
          this.stops.stopsModel.invalidArray.push(i);
          this.stops.stopsModel.invalidArray.push(i + 1);
          this.stops.stopsModel.isConsecutive = true;
          i++;
        } else {
          this.setConsErrorNull(i);
        }
        this.changeDetector.detectChanges();
      } else if (!this.stops.stopsModel.stopsForm.controls.stops.controls[i + 1]) {
        this.setErrorNull(i);
      }
      if (!this.stops.stopsModel.isConsecutive) {
        this.setErrorNull(i);
      }
    }

  }
  setErrorNull(i) {
    if (this.stops.stopsModel.stopsForm.controls.stops.controls[i].value.type.label !== '' &&
      (this.stops.stopsModel.stopsForm.controls.stops.controls[i].value.type.label === 'Country' ||
        this.stops.stopsModel.stopsForm.controls.stops.controls[i].value.point.label !== '') &&
      this.stops.stopsModel.stopsForm.controls.stops.controls[i].value.country.label !== ''
    ) {
      this.stops.stopsModel.stopsForm.controls.stops.controls[i].controls.point.setErrors(null);
      this.stops.stopsModel.stopsForm.controls.stops.controls[i].controls.point.updateValueAndValidity();
      this.changeDetector.detectChanges();
    }
  }
  saveLineHaulDraft() {
    this.laneCardService.lineHaulDraftSave(this.localStore.getLineHaulIds()).pipe(takeWhile(() =>
      this.addLineHaulModel.subscribeFlag)).subscribe((data: number) => {
        if (data && data['status'] === 'warning') {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data['message'] });
        } else if (data && data['status'] === 'success') {
          this.toastMessage(this.messageService, 'success', 'Line Haul Saved', 'Line Haul saved as draft');
        }
        this.navigateLineHaul();
        this.addLineHaulModel.loading = false;
        this.changeDetector.detectChanges();
      }, (saveDraftError: Error) => {
        this.addLineHaulModel.loading = false;
        this.toastMessage(this.messageService, 'error', 'Error', saveDraftError.message);
      });
  }
  originDestPointReqFrame(pType: string) {
    const laneCardFormControls = this.laneCard.laneCardModel.laneCardForm['controls'];
    const originDestValues = this.laneCard.laneCardModel[`${pType}Values`];
    if (laneCardFormControls[`${pType}Type`]['value']['label'].includes('Region')) {
      const selectedType = laneCardFormControls[`${pType}Type`]['value']['label'];
      return AddLineHaulUtility.regionPayloadFramer(this.laneCard.laneCardModel, `${pType}Point`, `${pType}Country`, selectedType);
    } else {
      return [{
        'pointType': this.checkAndReturnValue(laneCardFormControls[`${pType}Type`]['value']['label']),
        'pointTypeID': this.checkAndReturnValue(laneCardFormControls[`${pType}Type`]['value']['value']),
        'point': laneCardFormControls[`${pType}Point`]['value'] ? laneCardFormControls[`${pType}Point`]['value']['label'] : null,
        'pointID': laneCardFormControls[`${pType}Point`]['value'] ? laneCardFormControls[`${pType}Point`]['value']['value'] : null,
        'address1': this.checkAndReturnValue(originDestValues['addressLine1']),
        'address2': this.checkAndReturnValue(originDestValues['addressLine2']),
        'city': this.checkAndReturnValue(originDestValues['cityName']),
        'stateCode': this.checkAndReturnValue(originDestValues['stateCode']),
        'countryCode': this.checkAndReturnValue(originDestValues['countryCode']),
        'country': this.checkAndReturnValue(originDestValues['countryName']),
        'postalCode': this.checkAndReturnValue(originDestValues['postalCode']),
        'pointLowerBoundID': this.checkBoundValue(laneCardFormControls[`${pType}PointFrom`]['value'], 'value'),
        'pointLowerBound': this.checkBoundValue(laneCardFormControls[`${pType}PointFrom`]['value'], 'label'),
        'pointUpperBoundID': this.checkBoundValue(laneCardFormControls[`${pType}PointTo`]['value'], 'value'),
        'pointUpperBound': this.checkBoundValue(laneCardFormControls[`${pType}PointTo`]['value'], 'label')
      }];
    }
  }
  checkBoundValue(value, key) {
    return value ? value[key] : null;
  }
  getLaneDTO(): object {
    const laneCardFormControl = this.laneCard.laneCardModel.laneCardForm['controls'];
    return {
      'originType': laneCardFormControl['originType']['value']['label'],
      'originTypeID': laneCardFormControl['originType']['value']['value'],
      'originCountry': laneCardFormControl['originCountry']['value']['label'],
      'originPoint': this.originDestPointReqFrame('origin'),
      'originDescription': laneCardFormControl['originDescription']['value'] ?
        laneCardFormControl['originDescription']['value'] : null,
      'originVendorID': laneCardFormControl['originVendorId']['value'] ?
        laneCardFormControl['originVendorId']['value'] : null,
      'destinationType': laneCardFormControl['destinationType']['value']['label'],
      'destinationTypeID': laneCardFormControl['destinationType']['value']['value'],
      'destinationCountry': laneCardFormControl['destinationCountry']['value']['label'],
      'destinationPoint': this.originDestPointReqFrame('destination'),
      'destinationDescription': laneCardFormControl['destinationDescription']['value'] ?
        laneCardFormControl['destinationDescription']['value'] : null,
      'destinationVendorID': laneCardFormControl['destinationVendorId']['value'] ?
        laneCardFormControl['destinationVendorId']['value'] : null

    };
  }
  payloadFramer(): object {
    const val = this.rate;
    const stopValues = this.stops.stopsModel.stopsForm.getRawValue();
    const groupRateTypeID = this.rate.rateModel.rateForm['controls']['groupRateType']['value'];
    let groupRateTypeLabel = null;

    if (groupRateTypeID && groupRateTypeID.value) {
      const groupRateTypes = this.rate.rateModel.groupRateTypes;
      groupRateTypeLabel = utils.find(groupRateTypes, utils.matchesProperty('value', groupRateTypeID.value)).label;
    }

    const obj = {
      'laneDTO': this.getLaneDTO(),
      'overViewDTO': this.getEditOverViewDTO(),
      'customerLineHaulStops': this.getStopDetails(stopValues),
      'stopChargeIncludedIndicator': this.isStopChargeIncludedIndicator(stopValues),
      'lineHaulEffectiveDate': new Date(this.dateValues['effectiveDate']).toISOString().split('T')[0],
       'lineHaulExpirationDate': new Date(this.dateValues['expirationDate']).toISOString().split('T')[0],
      'sourceID': this.rate.rateModel.rateForm['controls']['sourceIdentifier']['value'] ?
        +this.rate.rateModel.rateForm['controls']['sourceIdentifier']['value'] : null,
      'sourceLineHaulID': this.rate.rateModel.rateForm['controls']['sourceLineHaulIdentifier']['value'] ?
        +this.rate.rateModel.rateForm['controls']['sourceLineHaulIdentifier']['value'] : null,
      'groupRateTypeID': groupRateTypeID ? groupRateTypeID.value : null,
      'groupRateTypeName': groupRateTypeLabel,
      'groupRateItemizeIndicator': this.isGroupRateItemizeIndicator(groupRateTypeLabel),
      'lineHaulSourceTypeID': this.rate.sourceType.value,
      'customerLineHaulRateDTOs': this.getRateDetails(this.rate.rateModel.rateForm['controls']['rates']),
      'lineHaulSourceTypeName': this.rate.sourceType.label,
      'customerLineHaulConfigurationID': null
    };
    return obj;
  }
  isStopChargeIncludedIndicator(stopValues: StopDetails) {
    if (stopValues.stops && stopValues.stops.length > 0) {
      return stopValues.isStopChargeIncluded;
    }

    return null;
  }
  isGroupRateItemizeIndicator(groupRateTypeLabel: string) {
    if (groupRateTypeLabel === 'Sum') {
      return this.rate.rateModel.rateForm['controls']['isGroupRateItemize']['value'];
    }

    return null;
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
  getStopDetails(stopValues: StopDetails): Array<StopsDetailsDto> {
    const stopDetailsObj = [];
    stopValues.stops.forEach((element, index) => {
      const isNotCountry = (element['type']['label'] !== 'Country');

      const stopLocationId = (element['type']['label'] === 'Country') ? element['point']['value']['id'] :
        element['point']['value'] ? element['point']['value'] : null;

      const stopObj = {
        'type' : null,
        'typeID' : null,
        'country' : null,
        'point' : null,
        'pointID' : null,
        'addressLine1' : null,
        'addressLine2' : null,
        'cityName' : null,
        'countryCode' : null,
        'postalCode' : null,
        'stateCode' : null,
        'stateName' : null,
        'sequenceNumber': null,
        'geographicPointUsageLevelTypeAssociationID': null,
        'vendorID': null,
      };

      stopObj.type = this.checkAndReturnValue(element['type']['label']);
      stopObj.typeID = this.checkAndReturnValue(element['type']['value']);
      stopObj.country = this.checkAndReturnValue(element['country']['label']);
      stopObj.point = this.checkAndReturnValue(element['point']['label']);
      stopObj.countryCode = this.checkAndReturnValue(element['country']['value']['code']);
      stopObj.pointID = stopLocationId;
      stopObj.sequenceNumber = index + 1;
      stopObj.vendorID = this.checkAndReturnValue(element['vendorid']);

      if (!utils.isEmpty(element['point']['rawData'])) {
        stopObj.addressLine1 = this.stopCheckValue(isNotCountry, element['point']['rawData']['AddressLine1']);
        stopObj.cityName = this.stopCheckValue(isNotCountry, element['point']['rawData']['CityName']);
        stopObj.postalCode = this.stopCheckValue(isNotCountry, element['point']['rawData']['PostalCode']);
        if (element['type']['label'].includes('State')) {
          stopObj.stateCode = this.stopCheckValue(isNotCountry, element['point']['rawData']['State']['StateCode']);
          stopObj.stateName = this.stopCheckValue(isNotCountry, element['point']['rawData']['State']['StateName']);
        } else {
          stopObj.stateCode = this.stopCheckValue(isNotCountry, element['point']['rawData']['StateCode']);
          stopObj.stateName = this.stopCheckValue(isNotCountry, element['point']['rawData']['StateName']);
        }
      }
      stopDetailsObj.push(stopObj);
    });
    return stopDetailsObj;
  }
  stopCheckValue(isNotCountry: boolean, value) {
    return (isNotCountry) && value ? value : null;
  }
  checkAndReturnValue(value) {
    return value ? value : null;
  }
  getRateDetails(rateData: FormArray) {
    const rateTypes = this.rate.rateModel.rateTypes;
    const rateObj = [];
    const valuePlaces = new RegExp(',', 'g');
    rateData['controls'].forEach((element, index) => {

      const minAmount = element['controls']['minAmount']['value'] ?
        element['controls']['minAmount']['value'].toString().replace(valuePlaces, '') : null;
      const maxAmount = element['controls']['maxAmount']['value'] ?
        element['controls']['maxAmount']['value'].toString().replace(valuePlaces, '') : null;
      const amount = element['controls']['amount']['value'].toString().replace(valuePlaces, '');

      rateObj.push({
        'chargeUnitTypeName': utils.find(rateTypes, utils.matchesProperty('value', element['controls']['type']['value']['value'])).label,
        'lineHaulChargeUnitTypeID': element['controls']['type']['value']['value'],
        'rateAmount': +amount,
        'minimumAmount': minAmount ? +minAmount : null,
        'maximumAmount': maxAmount ? +maxAmount : null,
        'currencyCode': element['controls']['currency']['value']['value']
      });
    });
    return rateObj;
  }
  toastMessage(messageService: MessageService, key: string, type: string, data: string) {
    const message = {
      severity: key,
      summary: type,
      detail: data
    };
    messageService.clear();
    messageService.add(message);
  }
  formFieldsTouched() {
    utils.forIn(this.laneCard.laneCardModel.laneCardForm.controls, (value, name: string) => {
      if (name !== 'originDescription' && name !== 'originVendorId' && name !== 'destinationDescription'
        && name !== 'destinationVendorId') {
        this.laneCard.laneCardModel.laneCardForm.controls[name].markAsTouched();
        this.laneCard.changeDetector.detectChanges();
      }
    });
    utils.forIn(this.overview.overviewModel.overviewForm.controls, (value, name: string) => {
      if (name !== 'equipmentType' && name !== 'equipmentLength' && name !== 'operationalServices') {
        this.overview.overviewModel.overviewForm.controls[name].markAsTouched();
        this.overview.changeDetector.detectChanges();
      }
    });
    utils.forIn(this.stops.stopsModel.stopsForm.controls.stops.controls, (value, name: string) => {
      utils.forIn(value['controls'], (forArrayValue, forArrayName: string) => {
        this.stops.stopsModel.stopsForm.controls.stops.controls[name]['controls'][forArrayName].markAsTouched();
        this.stops.changeDetector.detectChanges();
      });
    });
    utils.forIn(this.rate.rateModel.rateForm.controls.rates.controls, (value, name: string) => {
      utils.forIn(value['controls'], (forArrayValue, forArrayName: string) => {
        this.rate.rateModel.rateForm.controls.rates.controls[name]['controls'][forArrayName].markAsTouched();
      });
    });
    this.rate.rateModel.rateForm.get('groupRateType').markAsTouched();

    this.messageService.clear();
    this.messageService.add({
      severity: 'error', summary: 'Missing Required Information',
      detail: 'Provide the required information in the highlighted fields and submit the form again'
    });
  }
  saveLane(payload: object) {
    const agreementID = this.laneCard['expirationDate']['agreementDetails']['customerAgreementID'];
    if (payload) {
      this.laneCardService.postLaneCardData(this.dateValues['agreementDetails']['customerAgreementID'],
        payload).pipe(takeWhile(() => this.addLineHaulModel.subscribeFlag)).subscribe((data: number) => {
          this.localStore.setLineHaulIds(data['customerLineHaulConfigurationID']);
          if (this.addLineHaulModel.isSaveDraft) {
            this.toastMessage(this.messageService, 'success', 'Line Haul SavedLine Haul Saved', 'Line Haul saved as draft');
            this.navigateLineHaul();
          } else {
            if (this.addLineHaulModel.isLaneCardBackClicked) {
              this.utilityService.setEditLineHaulData(
                this.addLineHaulModel.setEditSectionData = {
                  isEditFlag: true,
                  lineHaulDetails: data['customerLineHaulConfigurationID']
                });
              const obj = {
                effectiveDate: this.dateValues['effectiveDate'],
                expirationDate: this.dateValues['expirationDate']
              };
              this.backFlag.emit(true);
              this.sectionDate.emit(obj);
              this.setWizardStatus();
            } else {
              this.saveLaneOnSuccess(data, agreementID, payload);
            }
          }
        }, (error: Error) => {
          this.handleError(error);
        });
    }
  }

  saveEditLane(payload: object) {
    if (payload) {
      this.laneCardService.postEditLaneCardData(this.dateValues['lineHaulConfigurationID'],
      this.dateValues['linehaulStatus'], payload).pipe(takeWhile(() => this.addLineHaulModel.subscribeFlag)).subscribe((data: boolean) => {
          if (data) {
            if (this.addLineHaulModel.isLaneCardContinueClicked) {
              this.changeDetector.markForCheck();
              this.confirmationFlag.emit(false);
              this.addLineHaulModel.loading = false;
              this.utilityService.setConfigurationID(
                this.addLineHaulModel.nameConfigurationDetails = {
                  customerAgreementName: this.dateValues['agreementDetails']['customerAgreementName'],
                  customerLineHaulConfigurationID: this.dateValues['lineHaulConfigurationID']
                }
              );
              this.utilityService.setEditLineHaulData(
                this.addLineHaulModel.setEditSectionData = {
                  isEditFlag: true,
                  lineHaulDetails: this.dateValues['lineHaulConfigurationID']
                });
              this.utilityService.setlineHaulStatus(
                this.addLineHaulModel.linehaulStatus = {
                  'isLineHaulEdit': true,
                });
              this.setWizardStatus();
              this.router.navigate(['/viewagreement/additionalInfo'], {
                queryParams: {
                  id: this.dateValues['agreementID'],
                  sectionID: this.addLineHaulModel.selectedSection['sectionId']
                }
              });
            }
          } else {
            this.addLineHaulModel.loading = false;
          }
        }, (error: Error) => {
          this.handleError(error);
        });
    }
  }
  handleError(error) {
    this.addLineHaulModel.loading = false;
    let errorMessage = error.message;
    let errorType = 'Error';
    if (!utils.isEmpty(error['error']) && !utils.isEmpty(error['error']['errors'])
      && error['error']['errors'].length > 0) {
      errorMessage = error['error']['errors'][0]['errorMessage'];
      errorType = error['error']['errors'][0]['errorType'];
    }
    this.toastMessage(this.messageService, 'error', errorType, errorMessage);
    this.changeDetector.detectChanges();
  }
  saveLaneOnSuccess(data, agreementID: number, payload) {
    this.localStore.setLineHaulIds(data['customerLineHaulConfigurationID']);
    this.utilityService.setConfigurationID(
      this.addLineHaulModel.nameConfigurationDetails = {
        customerAgreementName: this.dateValues['agreementDetails']['customerAgreementName'],
        customerLineHaulConfigurationID: data['customerLineHaulConfigurationID']
      }
    );
    this.changeDetector.markForCheck();
    this.confirmationFlag.emit(false);
    this.addLineHaulModel.loading = false;
    if (data && data['status'] === 'warning') {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data['message'] });
    }
    this.setWizardStatus();
    this.router.navigate(['/viewagreement/additionalInfo'], {
      queryParams: {
        id: agreementID,
        sectionID: this.addLineHaulModel.selectedSection['sectionId']
      }
    });

  }

  onLaneCardConfirmationNo() {
    this.addLineHaulModel.isBack = false;
    this.utilityService.setEditLineHaulData(
      this.addLineHaulModel.setEditSectionData = {
        isEditFlag: false,
        lineHaulDetails: null
      });
  }
  onLaneCardNo() {
    this.addLineHaulModel.isBack = false;
    this.backFlag.emit(true);
  }
  getSelectedSection(selectedSection: ContractInterface) {
    this.addLineHaulModel.selectedSection = selectedSection;
  }

  getEditLineHaulDetails() {
    const lineHaulDetailsData = this.utilityService.getEditLineHaulData();
    if (lineHaulDetailsData !== undefined && lineHaulDetailsData.isEditFlag) {
      this.addLineHaulModel.loading = true;
      this.shared.on<LineHaulValues>('editlinehaulDetails').pipe(takeWhile(() =>
      this.addLineHaulModel.subscribeFlag)).subscribe((editLineHaulData: LineHaulValues) => {
        if (!utils.isEmpty(editLineHaulData)) {
          if (utils.isEmpty(this.dateValues['effectiveDate']) && utils.isEmpty(this.dateValues['expirationDate'])) {
            this.dateValues['effectiveDate'] = editLineHaulData['effectiveDate'];
            this.dateValues['expirationDate'] = editLineHaulData['expirationDate'];
          }
          this.dateValues['lineHaulConfigurationID'] = editLineHaulData['customerLineHaulConfigurationID'];
          this.dateValues['agreementID'] = editLineHaulData['customerAgreementID'];
          this.dateValues['linehaulStatus'] = editLineHaulData.status;
        }
      });
      this.setWizardEnable();
    }
  }

  editpayloadFramer(): object {
    const stopValues = this.stops.stopsModel.stopsForm.getRawValue();
    const groupRateTypeID = this.rate.rateModel.rateForm['controls']['groupRateType']['value'];
    let groupRateTypeLabel = null;
    if (groupRateTypeID && groupRateTypeID.value) {
      const groupRateTypes = this.rate.rateModel.groupRateTypes;
      groupRateTypeLabel = utils.find(groupRateTypes, utils.matchesProperty('value', groupRateTypeID.value)).label;
    }
    return {
      'laneDTO': this.getLaneDTO(),
      'overViewDTO': this.getEditOverViewDTO(),
      'customerLineHaulStops': this.getStopDetails(stopValues),
      'stopChargeIncludedIndicator': this.isStopChargeIncludedIndicator(stopValues),
      'lineHaulEffectiveDate': this.dateValues['effectiveDate'],
      'lineHaulExpirationDate': this.dateValues['expirationDate'],
      'sourceID': this.rate.rateModel.rateForm['controls']['sourceIdentifier']['value'] ?
        +this.rate.rateModel.rateForm['controls']['sourceIdentifier']['value'] : null,
      'sourceLineHaulID': this.rate.rateModel.rateForm['controls']['sourceLineHaulIdentifier']['value'] ?
        +this.rate.rateModel.rateForm['controls']['sourceLineHaulIdentifier']['value'] : null,
      'groupRateTypeID': groupRateTypeID ? groupRateTypeID.value : null,
      'groupRateTypeName': groupRateTypeLabel,
      'groupRateItemizeIndicator': this.isGroupRateItemizeIndicator(groupRateTypeLabel),
      'lineHaulSourceTypeID': this.rate.sourceType.value,
      'customerLineHaulRateDTOs': this.getRateDetails(this.rate.rateModel.rateForm['controls']['rates']),
      'lineHaulSourceTypeName': this.rate.sourceType.label,
      'customerLineHaulConfigurationID': this.dateValues['lineHaulConfigurationID'],
    };
  }

  getEditOverViewDTO(): object {
    return {
      'customerAgreementContractSectionID': this.overview.overviewModel.overviewForm['controls']['sectionValue']['value']['value'],
      'priorityLevelNumber': this.overview.overviewModel.priorityLevelNumber ? this.overview.overviewModel.priorityLevelNumber : null,
      'overriddenPriorityLevelNumber': (this.priorityFramer(this.overview.overviewModel.overriddenPriorityLevelNumber)),
      'serviceOfferingID': this.overview.overviewModel.overviewForm['controls']['serviceOffering']['value']['id'],
      'transitModeID': this.overview.overviewModel.transitMode.id,
      'serviceLevelID': utils.isEmpty(this.overview.overviewModel.overviewForm['controls']['serviceLevel']['value']) ? null :
        this.overview.overviewModel.overviewForm['controls']['serviceLevel']['value']['id'],
      'equipmentClassificationCode': this.overview.overviewModel.selectedCategory ? this.overview.overviewModel.selectedCategory : null,
      'equipmentTypeCode': utils.isEmpty(this.overview.overviewModel.overviewForm['controls']['equipmentType']['value']) ? null
        : this.overview.overviewModel.overviewForm['controls']['equipmentType']['value']['value'],
      'equipmentLengthQuantity': utils.isEmpty(this.overview.overviewModel.overviewForm['controls']['equipmentLength']['value']) ? null
        : this.overview.overviewModel.overviewForm['controls']['equipmentLength']['value']['id'],
      'unitOfEquipmentLengthMeasurementCode': utils.isEmpty(this.overview.overviewModel.overviewForm['controls']
      ['equipmentLength']['value']) ? null : this.overview.overviewModel.overviewForm['controls']['equipmentLength']['value']['code'],
      'customerLineHaulOperationalServiceID': null,
      'lineHaulAwardStatusTypeID': this.overview.overviewModel.overviewForm['controls']['awardStatus']['value']['value'],
      'equipmentRequirementSpecificationAssociationID': this.overview.overviewModel.overviewForm['controls']['equipmentLength']['value']
        === null || undefined || '' ? null :
        this.overview.overviewModel.overviewForm['controls']['equipmentLength']['value']['specificationId'],
      'serviceTypeCodes': this.overview.overviewModel.overviewForm['controls']['operationalServices']['value'] ?
        this.overview.overviewModel.overviewForm['controls']['operationalServices']['value'] : [],
      'billToCode': null,
      'lineHaulAwardStatusTypeName': this.overview.overviewModel.overviewForm['controls']['awardStatus']['value']['label']
    };
  }

  onIndexChange(event: number) {
    this.addLineHaulModel.activeIndex = event;
    this.showComponents(event);
  }

  showComponents(index) {
    if (index === 1) {
      this.navigateToAdditionalInfo();
    }
  }
  navigateToAdditionalInfo() {
    this.onLaneCardContinue();
  }
  setWizardEnable() {
    const getWizardStatus = this.utilityService.getreviewwizardStatus();
    if (getWizardStatus !== undefined) {
      utils.each(this.addLineHaulModel.stepsList, (stepListData) => {
        if (stepListData['label'] === 'Additional Information') {
          stepListData['disabled'] = getWizardStatus.isAdditionalInfo;
        }
      });
    }
  }

  setWizardStatus() {
    const getReviewstatus = this.utilityService.getreviewwizardStatus();
    if (getReviewstatus !== undefined) {
      this.addLineHaulModel.reviewWizardStatus = {
        'isAdditionalInfo': getReviewstatus.isAdditionalInfo,
        'isLineHaulReviewed': getReviewstatus.isLineHaulReviewed,
        'isLaneCardInfo': false
      };
      this.utilityService.setreviewwizardStatus(this.addLineHaulModel.reviewWizardStatus);
    }
  }

  backNavigate() {
    this.setWizardStatus();
      const obj = {
        effectiveDate: this.dateValues['effectiveDate'],
        expirationDate: this.dateValues['expirationDate']
      };
      this.backFlag.emit(true);
      this.sectionDate.emit(obj);
  }
}
