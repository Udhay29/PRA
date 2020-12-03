import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';

import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';
import { FormBuilder, Validators } from '@angular/forms';

import { OptionalAttributesModel } from '../../shared/models/optional-attributes.model';
import { OptionalAttributesService } from '../../shared/services/optional-attributes.service';
import { OptionalUtilityService } from '../../shared/services/optional-utility.service';
import {
  ChargeCodeResponseInterface, ServiceLevel,
  BusinessUnit, SoBuAssociation, OperationalService, EquipmentCategory,
  EquipmentLength, EquipmentType, HitsInterface, CarriersInterface, BuSoAssociation, ChargeType
} from '../../shared/models/optional-attributes.interface';
import { RateOptionalQuery } from '../../shared/query/rate-optional.query';
import { ChargeTypeBusinessUnitServiceOfferingAssociation, OptionalFieldInterface } from '../model/optional-attributes.interface';

@Component({
  selector: 'app-optional-attributes',
  templateUrl: './optional-attributes.component.html',
  styleUrls: ['./optional-attributes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionalAttributesComponent implements OnInit {

  optionalAttributesModel: OptionalAttributesModel;
  carrierSuggestions: CarriersInterface[];

  constructor(
    private readonly rateAttributesService: OptionalAttributesService,
    private readonly formBuilder: FormBuilder,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly utilityService: OptionalUtilityService) {
    this.optionalAttributesModel = new OptionalAttributesModel();
    this.optionalAttributesForm();
  }

  ngOnInit() {
    this.getChargeTypes();
    this.getBusinessUnitServiceOffering();
    this.processedCarrierDetails();
    this.getEquipmentCategory();
  }
  optionalAttributesForm() {
    this.optionalAttributesModel.optionalForm = this.formBuilder.group({
      chargeType: [[]],
      businessUnit: [''],
      serviceLevel: [''],
      requestedService: [''],
      equipmentCategory: [''],
      equipmentType: [''],
      equipmentLength: [''],
      carriers: [[]]
    });
  }
  getChargeTypes() {
    this.optionalAttributesModel.loading = true;
    this.rateAttributesService.getChargeTypes().pipe(takeWhile(() => this.optionalAttributesModel.subscriberFlag))
      .subscribe((response: ChargeType[]) => {
        this.optionalAttributesModel.loading = false;
        this.optionalAttributesModel.chargeType =
          response.map(value => {
            const chargetypeNameCode = `${value['chargeTypeName']} (${value['chargeTypeCode']})`;
            return {
              label: chargetypeNameCode,
              value: value['chargeTypeID'],
              description: value['chargeTypeDescription']
            };
          });
        this.changeDetector.detectChanges();
      }, (error: Error) => {
        this.optionalAttributesModel.loading = false;
        this.changeDetector.detectChanges();
      });
  }
  onTypeChargeCode(event: Event) {
    this.utilityService.onTypeChargeValue(event, this.optionalAttributesModel, this.changeDetector);
  }
  onSelectChargeCode(event: Event) {
    this.clearValues();
    this.optionalAttributesModel.chargeTypeIdList.push(event['value']);
    const param = `?chargeTypeIds=${this.optionalAttributesModel.chargeTypeIdList}`;
    this.getBUbasedOnChargeType(param);
  }
  onUnSelectChargeCode(id: number) {
    this.clearValues();
    this.optionalAttributesModel.chargeTypeIdList.splice(this.optionalAttributesModel.chargeTypeIdList.indexOf(id), 1);
    const param = `?chargeTypeIds=${this.optionalAttributesModel.chargeTypeIdList}`;
    if (this.optionalAttributesModel.chargeTypeIdList.length > 0) {
      this.getBUbasedOnChargeType(param);
    }
  }
  clearValues() {
    this.optionalAttributesModel.businessUnitAdded = false;
    this.optionalAttributesModel.serviceLevelAdded = false;
    this.optionalAttributesModel.operationalServiceAdded = false;
    this.optionalAttributesModel.optionalForm.controls.businessUnit.setValue(null);
    this.optionalAttributesModel.optionalForm.controls.serviceLevel.reset();
    this.optionalAttributesModel.optionalForm.controls.serviceLevel.clearValidators();
    this.optionalAttributesModel.optionalForm.controls.serviceLevel.updateValueAndValidity();
    this.optionalAttributesModel.optionalForm.controls.requestedService.reset();
    this.optionalAttributesModel.serviceLevel = [];
    this.optionalAttributesModel.operationalService = [];
  }
  getBUbasedOnChargeType(param: string) {
    this.rateAttributesService.getBUbasedOnChargeType(param).pipe(takeWhile(() =>
      this.optionalAttributesModel.subscriberFlag))
      .subscribe((data: BuSoAssociation[]) => {
        this.optionalAttributesModel.buSoBasedOnChargeType = data;
        this.getBusinessUnitBasedOnChargeCode(data);
        this.changeDetector.detectChanges();
      });
  }
  getBusinessUnitServiceOffering() {
    this.rateAttributesService.getBusinessUnitServiceOffering().pipe(takeWhile(() => this.optionalAttributesModel.subscriberFlag))
      .subscribe((response: BusinessUnit) => {
        this.optionalAttributesModel.businessUnitData = this.getBusinessUnitServiceOfferingList(response);
        this.changeDetector.detectChanges();
      });
  }
  getBusinessUnitBasedOnChargeCode(businessData) {
    this.optionalAttributesModel.optionalForm.controls.businessUnit.setValue(null);
    this.optionalAttributesModel.optionalForm.controls.serviceLevel.reset();
    this.optionalAttributesModel.optionalForm.controls.serviceLevel.clearValidators();
    this.optionalAttributesModel.optionalForm.controls.serviceLevel.updateValueAndValidity();
    this.optionalAttributesModel.optionalForm.controls.requestedService.reset();
    this.optionalAttributesModel.serviceLevel = [];
    this.optionalAttributesModel.operationalService = [];
    this.optionalAttributesModel.businessUnitData = this.getBusinessUnitServiceOfferingList(businessData);
  }

  onBusinessUnitSelected(event: Event) {
    const businessUnit = this.optionalAttributesModel.optionalForm.get('businessUnit').value;
    const serviceLevel = this.optionalAttributesModel.optionalForm.get('serviceLevel');
    if (!utils.isEmpty(event['value'])) {
      this.optionalAttributesModel.businessUnitAdded = true;
      this.optionalAttributesModel.serviceLevelAdded = true;
    } else {
      this.optionalAttributesModel.businessUnitAdded = false;
      this.optionalAttributesModel.optionalForm.controls.serviceLevel.reset();
      this.optionalAttributesModel.serviceLevelAdded = false;
      this.optionalAttributesModel.operationalServiceAdded = false;
      this.optionalAttributesModel.optionalForm.controls.requestedService.reset();

    }
    const businessArray = [];
    this.optionalAttributesModel.operationalArray = [];
    if (event) {
      for (const val of event['value']) {
        businessArray.push(val['financeBusinessUnitServiceOfferingAssociationID']);
        this.optionalAttributesModel.operationalArray.push(`${val['financeBusinessUnitCode']} ${val['serviceOfferingDescription']}`);
      }
      this.getServiceLevel(businessArray);
    }

    if (businessUnit && businessUnit.length) {
      serviceLevel.setValidators([Validators.required]);
      serviceLevel.updateValueAndValidity();
    } else {
      serviceLevel.clearValidators();
      serviceLevel.updateValueAndValidity();
    }
  }

  onServiceLevelSelected(event: Event) {
    if (!utils.isEmpty(event['value'])) {
      this.optionalAttributesModel.serviceLevelAdded = true;
    } else {
      this.optionalAttributesModel.serviceLevelAdded = false;
    }
  }
  onBusinessUnitBlur() {
    this.getOperationalService();
  }

  onOperationalServiceSelected(event: Event) {
    if (!utils.isEmpty(event['value'])) {
      this.optionalAttributesModel.operationalServiceAdded = true;
    } else {
      this.optionalAttributesModel.operationalServiceAdded = false;
    }
  }
  getBusinessUnitServiceOfferingList(offeringList) {
    let referenceDataList = [];
    if (!utils.isEmpty(offeringList)) {
      utils.forEach(offeringList,
        (associationList) => {
          const dataObject = associationList;
          const objectFormat = {
            value: {
              financeBusinessUnitServiceOfferingAssociationID: dataObject.financeBusinessUnitServiceOfferingAssociationID,
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
    this.optionalAttributesModel.buSoListOriginal = referenceDataList;
    referenceDataList = utils.uniqBy(referenceDataList, 'label');
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
          this.optionalAttributesModel.serviceLevelValues = dataValues.map((value) => {
            return {
              label: value['serviceLevel']['serviceLevelDescription'],
              value: value['serviceLevelBusinessUnitServiceOfferingAssociationID']
            };
          });
          this.optionalAttributesModel.serviceLevelResponse = dataValues;
          this.optionalAttributesModel.serviceLevel = utils.uniqBy(this.optionalAttributesModel.serviceLevelValues, 'label');
          this.optionalAttributesModel.serviceLevel = utils.sortBy(this.optionalAttributesModel.serviceLevel, ['label']);
          this.populateServiceLevel(this.optionalAttributesModel.serviceLevel);
          this.changeDetector.detectChanges();
        }
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
      const resultArray = [];
      const businessUnit = [];
      this.rateAttributesService.getOperationalServices().pipe(takeWhile(() =>
        this.optionalAttributesModel.subscriberFlag))
        .subscribe((response: Array<OperationalService>) => {
          this.optionalAttributesModel.operationalService = [];
          if (response) {
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
          this.changeDetector.markForCheck();
        });
    } else {
      this.optionalAttributesModel.operationalService = [];
      this.changeDetector.detectChanges();
    }
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
  onEquipmentBlur(event: Event, controlName: string) {
    if (this.optionalAttributesModel.optionalForm.controls[controlName].value &&
      !event.target['value']) {
      if (controlName === 'equipmentCategory') {
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

