import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';
import { MessageService } from 'primeng/components/common/messageservice';

import { BroadcasterService } from '../../../../../shared/jbh-app-services/broadcaster.service';

import { OptionalAttributesModel } from '../../shared/models/optional-attributes.model';
import { OptionalAttributesService } from '../../shared/services/optional-attributes.service';
import { OptionalUtilityService } from '../../shared/services/optional-utility.service';
import {
  ServiceLevel,
  BusinessUnit, OperationalService, EquipmentCategory,
  EquipmentLength, EquipmentType, HitsInterface, BuSoAssociation, ChargeCodeInterface
} from '../../shared/models/optional-attributes.interface';
import { RateOptionalQuery } from '../../shared/query/rate-optional.query';
import { EditAccesorialData } from './../create-rates/model/create-rates.interface';

@Component({
  selector: 'app-rates-optional-attributes',
  templateUrl: './rates-optional-attributes.component.html',
  styleUrls: ['./rates-optional-attributes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatesOptionalAttributesComponent implements OnInit {

  optionalAttributesModel: OptionalAttributesModel;

  @Input()
  set chargeType(chargeTypeBasedBuSo: BuSoAssociation[]) {
    if (chargeTypeBasedBuSo) {
      this.getBusinessUnitBasedOnChargeCode(chargeTypeBasedBuSo);
    }
  }
  @Input()
  set isEditAccessorialRateClicked(isEditAccessorialRateClicked: boolean) {
    this.optionalAttributesModel.isEditRateClicked = isEditAccessorialRateClicked;
  }
  @Input()
  set selectedChargeType(value: ChargeCodeInterface) {
    this.optionalAttributesModel.selectedChargeType = value;
  }
  @Output() businessUnitServiceOfferingSelected: EventEmitter<number[]> = new EventEmitter<number[]>();
  @Output() selectedBuSo: EventEmitter<number[]> = new EventEmitter<number[]>();
  @Output() setEditRateFlagToFalse: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isBusinessUnitShow: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    private readonly rateAttributesService: OptionalAttributesService,
    private readonly formBuilder: FormBuilder,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly messageService: MessageService,
    private readonly utilityService: OptionalUtilityService,
    private readonly shared: BroadcasterService) {
    this.optionalAttributesModel = new OptionalAttributesModel();
    this.optionalAttributesForm();
  }

  ngOnInit() {
    this.processedCarrierDetails();
    this.getEquipmentCategory();
    this.utilityService.validateOptionalFields(this.optionalAttributesModel, this.messageService);
  }
  optionalAttributesForm() {
    this.optionalAttributesModel.optionalForm = this.formBuilder.group({
      businessUnit: [''],
      serviceLevel: [''],
      requestedService: [''],
      equipmentCategory: [''],
      equipmentType: [''],
      equipmentLength: [''],
      carriers: [[]],
      waived: [''],
      calculateRate: [''],
      passThrough: [''],
      rollUp: ['']
    });
  }
  onWaivedCheckboxSelect(event: Event) {
    if (event) {
      this.optionalAttributesModel.waivedFlag = false;
      this.optionalAttributesModel.optionalForm.controls['calculateRate'].setValue(null);
      this.optionalAttributesModel.optionalForm.controls['passThrough'].setValue(null);
      this.optionalAttributesModel.optionalForm.controls['rollUp'].setValue(null);
    } else {
      this.optionalAttributesModel.waivedFlag = true;
    }
  }
  getBusinessUnitServiceOffering() {
    this.rateAttributesService.getBusinessUnitServiceOffering().pipe(takeWhile(() => this.optionalAttributesModel.subscriberFlag))
      .subscribe((response: BusinessUnit) => {
        this.optionalAttributesModel.businessUnitData = this.getBusinessUnitServiceOfferingList(response);
        this.changeDetector.markForCheck();
      });
  }
  getBusinessUnitBasedOnChargeCode(chargeTypeBasedBuSo: BuSoAssociation[]) {
    this.optionalAttributesModel.businessUnitData = this.getBusinessUnitServiceOfferingList(chargeTypeBasedBuSo);
    this.emitbuSo([]);
  }
  onBusinessUnitShow() {
    if (!this.optionalAttributesModel.selectedChargeType) {
      this.isBusinessUnitShow.emit(true);
      this.messageService.clear();
      this.messageService.add({
        severity: 'error', summary: 'Select Charge Type',
        detail: 'Provide a Charge Type'
      });
    }
  }
  onBusinessUnitSelected(event: Event) {
    this.optionalAttributesModel.isEditRateClicked = false;
    const businessUnit = this.optionalAttributesModel.optionalForm.get('businessUnit').value;
    const serviceLevel = this.optionalAttributesModel.optionalForm.get('serviceLevel');
    if (!utils.isEmpty(event['value'])) {
      this.optionalAttributesModel.businessUnitAdded = true;
      this.optionalAttributesModel.serviceLevelAdded = true;
    } else {
      this.optionalAttributesModel.businessUnitAdded = false;
      this.optionalAttributesModel.optionalForm.controls.serviceLevel.reset();
      this.optionalAttributesModel.serviceLevelAdded = false;
      this.optionalAttributesModel.optionalForm.controls.requestedService.reset();
      this.optionalAttributesModel.operationalServiceAdded = false;
    }
    const businessArray = [];
    this.optionalAttributesModel.operationalArray = [];
    if (event) {
      for (const val of event['value']) {
        businessArray.push(val['financeBusinessUnitServiceOfferingAssociationID']);
        this.optionalAttributesModel.operationalArray.push(`${val['financeBusinessUnitCode']} ${val['serviceOfferingDescription']}`);
      }
      this.selectedBuSo.emit(businessArray);
      this.getServiceLevel(businessArray);
    }

    if (businessUnit && businessUnit.length) {
      serviceLevel.setValidators([Validators.required]);
      serviceLevel.updateValueAndValidity();
    } else {
      serviceLevel.clearValidators();
      serviceLevel.updateValueAndValidity();
    }
    this.setEditRateFlagToFalse.emit(false);
  }
  emitbuSo(businessArray) {
    if (businessArray.length) {
      this.businessUnitServiceOfferingSelected.emit(businessArray);
    } else {
      const array = [];
      for (const val of this.optionalAttributesModel.businessUnitData) {
        array.push(val['value']['chargeTypeBusinessUnitServiceOfferingAssociationID']);
      }
      this.businessUnitServiceOfferingSelected.emit(array);
    }
  }
  onServiceLevelSelected(event: Event) {
    if (!utils.isEmpty(event['value'])) {
      this.optionalAttributesModel.serviceLevelAdded = true;
    } else {
      this.optionalAttributesModel.serviceLevelAdded = false;
    }
  }
  onOperationalServiceSelected(event: Event) {
    if (!utils.isEmpty(event['value'])) {
      this.optionalAttributesModel.operationalServiceAdded = true;
    } else {
      this.optionalAttributesModel.operationalServiceAdded = false;
    }
  }
  getBusinessUnitServiceOfferingList(offeringList) {
    const referenceDataList = [];
    if (!utils.isEmpty(offeringList)) {
      utils.forEach(offeringList,
        (associationList) => {
          const dataObject = associationList;
          const objectFormat = {
            value: {
              financeBusinessUnitServiceOfferingAssociationID: dataObject.financeBusinessUnitServiceOfferingAssociationID,
              chargeTypeBusinessUnitServiceOfferingAssociationID: dataObject.chargeTypeBusinessUnitServiceOfferingAssociationID,
              financeBusinessUnitCode: dataObject.financeBusinessUnitCode,
              serviceOfferingDescription: dataObject.serviceOfferingDescription,
              serviceOfferingCode: dataObject.serviceOfferingCode,
              financeBusinessUnitServiceOfferingDisplayName:
                `${dataObject.financeBusinessUnitCode} - ${dataObject.serviceOfferingDescription}`
            }, label: `${dataObject.financeBusinessUnitCode} - ${dataObject.serviceOfferingDescription}`
          };
          referenceDataList.push(objectFormat);
        });
    }
    return utils.sortBy(referenceDataList, ['value.financeBusinessUnitCode', 'value.serviceOfferingDescription']);
  }
  onTypeBusinessUnit(event: Event) {
    this.utilityService.onTypeBusinessUnit(event, this.optionalAttributesModel, this.changeDetector);
  }
  getServiceLevel(data: Array<number>) {
    this.optionalAttributesModel.serviceLevel = [];
    this.optionalAttributesModel.serviceLevelResponse = [];
    this.optionalAttributesModel.loading = true;
    const param = `?financeBusinessUnitServiceOfferingAssociationIds=${data}`;
    this.rateAttributesService.getServiceLevel(param).pipe(takeWhile(() => this.optionalAttributesModel.subscriberFlag))
      .subscribe((response: ServiceLevel) => {
        this.optionalAttributesModel.loading = false;
        if (!utils.isEmpty(response)) {
          const dataValues = response['_embedded']['serviceLevelBusinessUnitServiceOfferingAssociations'];
          this.optionalAttributesModel.serviceLevelValues = dataValues.map(value => {
            return {
              label: value['serviceLevel']['serviceLevelDescription'],
              value: value['serviceLevelBusinessUnitServiceOfferingAssociationID']
            };
          });
          this.optionalAttributesModel.serviceLevelResponse = dataValues;
          this.optionalAttributesModel.serviceLevel = utils.uniqBy(this.optionalAttributesModel.serviceLevelValues, 'label');
          this.optionalAttributesModel.serviceLevel = utils.sortBy(this.optionalAttributesModel.serviceLevel, ['label']);
          this.populateServiceLevel(this.optionalAttributesModel.serviceLevel);
        }
        this.changeDetector.detectChanges();
      });
  }
  populateServiceLevel(data) {
    const serviceLevels = this.optionalAttributesModel.optionalForm.controls.serviceLevel.value;
    const itemsToStore = [];
    data.forEach(object => {
      if (object['label'] === 'Standard') {
        itemsToStore.push({
          label: object['label'],
          value: object['value']
        });
      }
    });
    if (serviceLevels && serviceLevels.length) {
      serviceLevels.forEach(serviceLevel => {
        const index = data.findIndex(object => object['label'] === serviceLevel['label']);
        if (index >= 0 && serviceLevel['label'] !== 'Standard') {
          itemsToStore.push({
            label: serviceLevel['label'],
            value: serviceLevel['value']
          });
        }
      });
    }
    this.optionalAttributesModel.optionalForm.controls.serviceLevel.patchValue(itemsToStore);
    this.optionalAttributesModel.optionalForm.controls.serviceLevel.updateValueAndValidity();
    this.changeDetector.detectChanges();
  }
  getOperationalService() {
    if (this.optionalAttributesModel.optionalForm.controls['businessUnit'].value &&
      this.optionalAttributesModel.optionalForm.controls['businessUnit'].value.length) {
      this.rateAttributesService.getOperationalServices().pipe(takeWhile(() =>
        this.optionalAttributesModel.subscriberFlag))
        .subscribe((response: Array<OperationalService>) => {
          this.optionalAttributesModel.operationalService = [];
          if (response) {
            this.operationalFrammer(response);
          }
          this.changeDetector.markForCheck();
        });
    } else {
      this.optionalAttributesModel.operationalService = [];
      this.changeDetector.detectChanges();
    }
  }
  operationalFrammer(response: Array<OperationalService>) {
    const resultArray = [];
    const businessUnit = [];
    response['content'].forEach(responseResult => {
      if (responseResult['serviceCategoryCode'] === 'ReqServ') {
        resultArray.push(responseResult);
      }
    });
    this.optionalAttributesModel.operationalArray.forEach((businessUnitElement, index) => {
      resultArray.forEach((serviceLevel, serviceIndex) => {
        serviceLevel['serviceOfferingCodeList'].forEach((element, serviceOfferingIndex) => {
          if (businessUnitElement === element) {
            businessUnit.push({
              value: `${serviceLevel.serviceTypeCode}:${serviceLevel.serviceTypeDescription}`,
              label: serviceLevel.serviceTypeDescription,
              id: serviceLevel.serviceTypeDescription
            });
          }
        });

      });
    });
    this.optionalAttributesModel.operationalService = businessUnit;
    this.optionalAttributesModel.operationalService = utils.uniqBy(this.optionalAttributesModel.operationalService, 'value');
    this.optionalAttributesModel.operationalService = utils.sortBy(this.optionalAttributesModel.operationalService, ['label']);
    this.changeDetector.detectChanges();
  }
  getEquipmentCategory() {
    this.rateAttributesService.getEquipmentCategory().pipe(takeWhile(() => this.optionalAttributesModel.subscriberFlag))
      .subscribe((response: EquipmentCategory) => {
        if (response && response._embedded && response._embedded.equipmentClassifications) {
          this.optionalAttributesModel.equipmentCategory = [];
          for (const equipCat of response._embedded.equipmentClassifications) {
            this.optionalAttributesModel.equipmentCategory.push({
              label: equipCat.equipmentClassificationCode.trim(),
              value: equipCat.equipmentClassificationCode.trim()
            });
          }
        }
        this.changeDetector.detectChanges();
      });
  }
  onTypeEquipmentCategory(event: Event) {
    this.utilityService.onTypeEquipmentCategory(event, this.optionalAttributesModel, this.changeDetector);
  }
  onSelectEquipmentCategory(event: Event) {
    this.optionalAttributesModel.optionalForm.controls.equipmentType.reset();
    this.optionalAttributesModel.optionalForm.controls.equipmentLength.reset();
    this.optionalAttributesModel.equipmentType = [];
    this.optionalAttributesModel.equipmentLength = [];
    this.getEquipmentType(event);
  }
  getEquipmentType(data: Event) {
    const param = `${'?equipmentClassificationCode='}${data['value']}`;
    this.rateAttributesService.getEquipmentType(param).pipe(takeWhile(() => this.optionalAttributesModel.subscriberFlag))
      .subscribe((response: EquipmentType) => {
        if (response && response._embedded && response._embedded.equipmentTypes) {
          this.optionalAttributesModel.equipmentType = [];
          for (const equipType of response._embedded.equipmentTypes) {
            this.optionalAttributesModel.equipmentType.push({
              label: equipType.equipmentTypeDescription.trim(),
              value: equipType.equipmentTypeCode.trim()
            });
          }
        }
        this.changeDetector.detectChanges();
      });
  }
  onBusinessUnitBlur() {
    this.getOperationalService();
  }
  onEquipmentBlur(event: Event, controlName: string) {
    if (this.optionalAttributesModel.optionalForm.controls[controlName].value &&
      !event.target['value']) {
      if (controlName === 'equipmentCategory') {
        if (!event.srcElement['value'].length) {
          this.optionalAttributesModel.optionalForm.controls.equipmentCategory.setValue(null);
        }
        this.optionalAttributesModel.optionalForm.controls.equipmentType.reset();
        this.optionalAttributesModel.optionalForm.controls.equipmentLength.reset();
        this.optionalAttributesModel.equipmentType = [];
        this.optionalAttributesModel.equipmentLength = [];
      } else {
        this.optionalAttributesModel.equipmentLength = [];
        this.optionalAttributesModel.optionalForm.controls.equipmentLength.reset();
      }
    }
  }
  onTypeEquipmentType(event: Event) {
    this.utilityService.onTypeEquipmentType(event, this.optionalAttributesModel, this.changeDetector);
  }
  onSelectEquipmentType(event: Event) {
    this.optionalAttributesModel.optionalForm.controls.equipmentLength.reset();
    this.getEquipmentLength(event);
    this.optionalAttributesModel.equipmentLength = [];
  }
  getEquipmentLength(data: Event) {
    const url = `equipmenttype/${data['value']}/equipmentClassificationTypeAssociations`;
    this.rateAttributesService.getEquipmentLength(url).pipe(takeWhile(() => this.optionalAttributesModel.subscriberFlag))
      .subscribe((response) => {
        if (response && response._embedded && response._embedded.equipmentClassificationTypeAssociations) {
          const equipmentTypeId = response._embedded.equipmentClassificationTypeAssociations[0]['equipmentClassificationTypeAssociationID'];
          this.optionalAttributesModel.equipTypeId = equipmentTypeId;

          const equipmentLengthUrl = `equipmentclassificationtypeassociation/${equipmentTypeId}/equipmentDimensions`;
          this.rateAttributesService.getEquipmentLength(equipmentLengthUrl).
            pipe(takeWhile(() => this.optionalAttributesModel.subscriberFlag))
            .subscribe((equipmentLengthResponse: EquipmentLength) => {
              this.populateEquipmentLength(equipmentLengthResponse);
              this.optionalAttributesModel.equipmentLength = utils.uniqBy(this.optionalAttributesModel.equipmentLength, 'label');
              this.optionalAttributesModel.equipmentLength.sort((chargeTypefirstValue, chargeTypeSecondValue) => {
                return (chargeTypefirstValue.label > chargeTypeSecondValue.label) ? 1 : -1;
              });
              this.changeDetector.detectChanges();
            });
        }
      });
  }
  populateEquipmentLength(equipmentLengthResponse) {
    if (equipmentLengthResponse && equipmentLengthResponse._embedded &&
      equipmentLengthResponse._embedded.equipmentDimensions) {
      this.optionalAttributesModel.equipmentLength = [];
      for (const equipLength of equipmentLengthResponse._embedded.equipmentDimensions) {
        this.optionalAttributesModel.equipmentLength.push({
          label: equipLength['lengthQuantity'],
          value: `${equipLength['lengthQuantity']} ${equipLength['unitOfLengthMeasurementCode']} in Length`,
          id: equipLength['equipmentDimensionId'],
          lengthDescription: `${equipLength['unitOfLengthMeasurementCode']} in Length`
        });
        this.changeDetector.detectChanges();
      }
    }
  }
  onTypeEquipmentLength(event: Event) {
    this.utilityService.onTypeEquipmentLength(event, this.optionalAttributesModel, this.changeDetector);
  }
  processedCarrierDetails() {
    this.optionalAttributesModel.carriersList = [];
    const carrierQuery = RateOptionalQuery.getCarrierQuery();
    this.rateAttributesService.getCarrierData(carrierQuery).pipe(takeWhile(() => this.optionalAttributesModel.subscriberFlag)).
      subscribe((carrierData: HitsInterface[]) => {
        if (!utils.isEmpty(carrierData)) {
          const data = carrierData['hits']['hits'];
          for (const value of data) {
            this.optionalAttributesModel.carriersList.push({
              label: `${value['_source']['LegalName']}${' '}${'('}${value['_source']['CarrierCode']}${')'}`,
              value: {
                code: value['_source']['CarrierCode'],
                id: value['_source']['CarrierID'],
                name: value['_source']['LegalName']
              }
            });
            this.changeDetector.markForCheck();
          }
        }
      });
  }
  onCarrierCompleteMethod(event: Event) {
    this.utilityService.onTypeCarrierValue(event, this.optionalAttributesModel, this.changeDetector);
  }
  onEquipmentClear(event: Event, controlName: string) {
    this.optionalAttributesModel.optionalForm.controls[controlName].setValue('');
  }
}
