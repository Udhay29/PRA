import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';
import { FormBuilder, Validators } from '@angular/forms';
import { StandardOptionalAttributesModel } from '../../../model/standard-optional-attributes.model';
import { StandardOptionalAttributesService } from '../../../service/standard-optional-attributes.service';
import { StandardOptionalUtilityService } from '../../../service/standard-optional-utility.service';
import {
  ChargeCodeResponseInterface, ServiceLevel,
  BusinessUnit, SoBuAssociation, OperationalService, EquipmentCategory,
  EquipmentLength, EquipmentType, HitsInterface, CarriersInterface, BuSoAssociation, ContentInterface
} from '../../../model/standard-optional-attributes.interface';
import { CarrierOptionalQuery } from '../../../query/carrier-optional.query';

@Component({
  selector: 'app-standard-optional-attributes',
  templateUrl: './standard-optional-attributes.component.html',
  styleUrls: ['./standard-optional-attributes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StandardOptionalAttributesComponent implements OnInit {
  standardOptionalAttributesModel: StandardOptionalAttributesModel;
  carrierSuggestions: CarriersInterface[];
  constructor(
    private readonly standardAttributesService: StandardOptionalAttributesService,
    private readonly formBuilder: FormBuilder,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly utilityService: StandardOptionalUtilityService) {
    this.standardOptionalAttributesModel = new StandardOptionalAttributesModel();
    this.optionalAttributesForm();
  }

  ngOnInit() {
    this.getChargeTypes();
    this.getBusinessUnitServiceOffering();
    this.processedCarrierDetails();
    this.getEquipmentCategory();
  }
  optionalAttributesForm() {
    this.standardOptionalAttributesModel.optionalForm = this.formBuilder.group({
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
    this.standardOptionalAttributesModel.loading = true;
    this.standardAttributesService.getChargeTypes().pipe(takeWhile(() => this.standardOptionalAttributesModel.subscriberFlag))
      .subscribe((response: ContentInterface[]) => {
        this.standardOptionalAttributesModel.loading = false;
        this.changeDetector.detectChanges();
        if (!utils.isEmpty(response)) {
          this.standardOptionalAttributesModel.chargeCodeBUCombination = response;
          this.standardOptionalAttributesModel.chargeType =
            this.standardOptionalAttributesModel.chargeCodeBUCombination.map(value => {
              return {
                label: `${value['chargeTypeName']} (${value['chargeTypeCode']})`,
                value: value['chargeTypeID'],
                description: value['chargeTypeDescription']
              };
            });
        }
      }, (error: Error) => {
        this.standardOptionalAttributesModel.loading = false;
        this.changeDetector.detectChanges();
      });

  }
  onTypeChargeCode(event: Event) {
    this.utilityService.onTypeChargeValue(event, this.standardOptionalAttributesModel, this.changeDetector);
  }
  onSelectChargeCode(event: Event) {
    this.clearValues();
    this.standardOptionalAttributesModel.chargeTypeList.push(event['value']);
    const param = `?chargeTypeIds=${this.standardOptionalAttributesModel.chargeTypeList}`;
    this.getBUbasedOnChargeType(param);
  }
  onUnSelectChargeType(id: number) {
    this.clearValues();
    this.standardOptionalAttributesModel.chargeTypeList.splice(this.standardOptionalAttributesModel.chargeTypeList.indexOf(id), 1);
    const param = `?chargeTypeIds=${this.standardOptionalAttributesModel.chargeTypeList}`;
    if (this.standardOptionalAttributesModel.chargeTypeList.length > 0) {
      this.getBUbasedOnChargeType(param);
    }
  }

  clearValues() {
    this.standardOptionalAttributesModel.businessUnitAdded = false;
    this.standardOptionalAttributesModel.serviceLevelAdded = false;
    this.standardOptionalAttributesModel.operationalServiceAdded = false;
    this.standardOptionalAttributesModel.optionalForm.controls.businessUnit.setValue(null);
    this.standardOptionalAttributesModel.optionalForm.controls.serviceLevel.reset();
    this.standardOptionalAttributesModel.optionalForm.controls.serviceLevel.clearValidators();
    this.standardOptionalAttributesModel.optionalForm.controls.serviceLevel.updateValueAndValidity();
    this.standardOptionalAttributesModel.optionalForm.controls.requestedService.reset();
    this.standardOptionalAttributesModel.serviceLevel = [];
    this.standardOptionalAttributesModel.operationalService = [];
  }

  getBUbasedOnChargeType(param: string) {
    this.standardAttributesService.getBUbasedOnChargeType(param).pipe(takeWhile(() =>
      this.standardOptionalAttributesModel.subscriberFlag))
      .subscribe((data: BuSoAssociation[]) => {
        this.standardOptionalAttributesModel.buSoBasedOnChargeType = data;
        this.getBusinessUnitBasedOnChargeCode(data);
        this.changeDetector.detectChanges();
      });
  }
  getBusinessUnitServiceOffering() {
    this.standardAttributesService.getBusinessUnitServiceOffering().pipe(takeWhile(() =>
      this.standardOptionalAttributesModel.subscriberFlag))
      .subscribe((response: BusinessUnit) => {
        this.standardOptionalAttributesModel.businessUnitData = this.getBusinessUnitServiceOfferingList(response);
        this.changeDetector.detectChanges();
      });
  }
  getBusinessUnitBasedOnChargeCode(businessData: BuSoAssociation[]) {
    this.standardOptionalAttributesModel.optionalForm.controls.businessUnit.setValue(null);
    this.standardOptionalAttributesModel.optionalForm.controls.serviceLevel.reset();
    this.standardOptionalAttributesModel.optionalForm.controls.serviceLevel.clearValidators();
    this.standardOptionalAttributesModel.optionalForm.controls.serviceLevel.updateValueAndValidity();
    this.standardOptionalAttributesModel.optionalForm.controls.requestedService.reset();
    this.standardOptionalAttributesModel.serviceLevel = [];
    this.standardOptionalAttributesModel.operationalService = [];
    this.standardOptionalAttributesModel.businessUnitData = this.getBusinessUnitServiceOfferingList(businessData);
  }
  onBusinessUnitSelected(event: Event) {
    const businessUnit = this.standardOptionalAttributesModel.optionalForm.get('businessUnit').value;
    const serviceLevel = this.standardOptionalAttributesModel.optionalForm.get('serviceLevel');
    if (!utils.isEmpty(event['value'])) {
      this.standardOptionalAttributesModel.businessUnitAdded = true;
      this.standardOptionalAttributesModel.serviceLevelAdded = true;
    } else {
      this.standardOptionalAttributesModel.businessUnitAdded = false;
      this.standardOptionalAttributesModel.optionalForm.controls.serviceLevel.reset();
      this.standardOptionalAttributesModel.serviceLevelAdded = false;
      this.standardOptionalAttributesModel.operationalServiceAdded = false;
      this.standardOptionalAttributesModel.optionalForm.controls.requestedService.reset();
    }
    const businessArray = [];
    this.standardOptionalAttributesModel
      .operationalArray = [];
    if (event) {
      for (const val of event['value']) {
        businessArray.push(val['financeBusinessUnitServiceOfferingAssociationID']);
        this.standardOptionalAttributesModel
          .operationalArray.push(`${val['financeBusinessUnitCode']} ${val['serviceOfferingDescription']}`);
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

  onBusinessUnitBlur() {
    this.getOperationalService();
  }
  onServiceLevelSelected(event: Event) {
    if (!utils.isEmpty(event['value'])) {
      this.standardOptionalAttributesModel.serviceLevelAdded = true;
    } else {
      this.standardOptionalAttributesModel.serviceLevelAdded = false;
    }
  }
  onOperationalServiceSelected(event: Event) {
    if (!utils.isEmpty(event['value'])) {
      this.standardOptionalAttributesModel.operationalServiceAdded = true;
    } else {
      this.standardOptionalAttributesModel.operationalServiceAdded = false;
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
    this.standardOptionalAttributesModel.buSoListOriginal = referenceDataList;
    referenceDataList = utils.uniqBy(referenceDataList, 'label');
    return utils.sortBy(referenceDataList, ['value.financeBusinessUnitCode', 'value.serviceOfferingDescription']);
  }
  onTypeBusinessUnit(event: Event) {
    this.utilityService.onTypeBusinessUnit(event, this.standardOptionalAttributesModel, this.changeDetector);
  }
  getServiceLevel(data: Array<number>) {
    this.standardOptionalAttributesModel.serviceLevel = [];
    this.standardOptionalAttributesModel.serviceLevelResponse = [];
    this.standardOptionalAttributesModel.loading = true;
    const param = `?financeBusinessUnitServiceOfferingAssociationIds=${data}`;
    this.standardAttributesService.getServiceLevel(param).pipe(takeWhile(() => this.standardOptionalAttributesModel.subscriberFlag))
      .subscribe((response: ServiceLevel) => {
        this.standardOptionalAttributesModel.loading = false;
        if (!utils.isEmpty(response)) {
          const dataValues = response['_embedded']['serviceLevelBusinessUnitServiceOfferingAssociations'];
          this.standardOptionalAttributesModel.serviceLevelValues = dataValues.map((value) => {
            return {
              label: value['serviceLevel']['serviceLevelDescription'],
              value: value['serviceLevelBusinessUnitServiceOfferingAssociationID']
            };
          });
          this.standardOptionalAttributesModel.serviceLevelResponse = dataValues;
          this.standardOptionalAttributesModel.serviceLevel =
            utils.uniqBy(this.standardOptionalAttributesModel.serviceLevelValues, 'label');
          this.standardOptionalAttributesModel.serviceLevel = utils.sortBy(this.standardOptionalAttributesModel.serviceLevel, ['label']);
          this.populateServiceLevel(this.standardOptionalAttributesModel.serviceLevel);

          this.changeDetector.detectChanges();
        }
      });
  }
  populateServiceLevel(data) {
    const serviceLevels = this.standardOptionalAttributesModel.optionalForm.controls.serviceLevel.value;
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
    this.standardOptionalAttributesModel.optionalForm.controls.serviceLevel.patchValue(itemsToStore);
    this.standardOptionalAttributesModel.optionalForm.controls.serviceLevel.updateValueAndValidity();
    this.changeDetector.detectChanges();
  }
  getOperationalService() {
    if (this.standardOptionalAttributesModel.optionalForm.controls['businessUnit'].value &&
      this.standardOptionalAttributesModel.optionalForm.controls['businessUnit'].value.length) {
      const resultArray = [];
      this.standardAttributesService.getOperationalServices().pipe(takeWhile(() =>
        this.standardOptionalAttributesModel.subscriberFlag))
        .subscribe((response: Array<OperationalService>) => {
          this.standardOptionalAttributesModel.operationalService = [];
          if (response) {
            response['content'].forEach(responseResult => {
              if (responseResult['serviceCategoryCode'] === 'ReqServ') {
                resultArray.push(responseResult);
              }
            });
            this.getServiceLevelResponse(resultArray);
          }
          this.changeDetector.markForCheck();
        });
    } else {
      this.standardOptionalAttributesModel.operationalService = [];
      this.changeDetector.detectChanges();
    }
  }
  getServiceLevelResponse(resultArray) {
    const businessUnit = [];
    this.standardOptionalAttributesModel.operationalArray.forEach((businessUnitElement, index) => {
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
    this.standardOptionalAttributesModel.operationalService = businessUnit;
    this.standardOptionalAttributesModel.operationalService =
      utils.uniqBy(this.standardOptionalAttributesModel.operationalService, 'value');
    this.standardOptionalAttributesModel.operationalService =
      utils.sortBy(this.standardOptionalAttributesModel.operationalService, ['label']);
    this.changeDetector.detectChanges();
  }
  getEquipmentCategory() {
    this.standardAttributesService.getEquipmentCategory().pipe(takeWhile(() => this.standardOptionalAttributesModel.subscriberFlag))
      .subscribe((response) => {
        if (response && response._embedded && response._embedded.equipmentClassifications) {
          this.standardOptionalAttributesModel.equipmentCategory = [];
          for (const equipCat of response._embedded.equipmentClassifications) {
            this.standardOptionalAttributesModel.equipmentCategory.push({
              label: equipCat.equipmentClassificationCode.trim(),
              value: equipCat.equipmentClassificationCode.trim()
            });
          }
        }
        this.changeDetector.detectChanges();
      });
  }
  onTypeEquipmentCategory(event: Event) {
    this.utilityService.onTypeEquipmentCategory(event, this.standardOptionalAttributesModel, this.changeDetector);
  }
  onEquipmentBlur(event: Event, controlName: string) {
    if (this.standardOptionalAttributesModel.optionalForm.controls[controlName].value &&
      !event.target['value']) {
      if (controlName === 'equipmentCategory') {
        this.standardOptionalAttributesModel.optionalForm.controls.equipmentType.reset();
        this.standardOptionalAttributesModel.optionalForm.controls.equipmentLength.reset();
        this.standardOptionalAttributesModel.equipmentType = [];
        this.standardOptionalAttributesModel.equipmentLength = [];
      } else {
        this.standardOptionalAttributesModel.equipmentLength = [];
        this.standardOptionalAttributesModel.optionalForm.controls.equipmentLength.reset();
      }
    }
  }
  onSelectEquipmentCategory(event: Event) {
    this.standardOptionalAttributesModel.optionalForm.controls.equipmentType.reset();
    this.standardOptionalAttributesModel.optionalForm.controls.equipmentLength.reset();
    this.standardOptionalAttributesModel.equipmentType = [];
    this.standardOptionalAttributesModel.equipmentLength = [];
    this.getEquipmentType(event);
  }
  getEquipmentType(data: Event) {
    const param = `${'?equipmentClassificationCode='}${data['value']}`;
    this.standardAttributesService.getEquipmentType(param).pipe(takeWhile(() => this.standardOptionalAttributesModel.subscriberFlag))
      .subscribe((response: EquipmentType) => {
        if (response && response._embedded && response._embedded.equipmentTypes) {
          this.standardOptionalAttributesModel.equipmentType = [];
          for (const equipType of response._embedded.equipmentTypes) {
            this.standardOptionalAttributesModel.equipmentType.push({
              label: equipType.equipmentTypeDescription.trim(),
              value: equipType.equipmentTypeCode.trim()
            });
          }
        }
        this.changeDetector.detectChanges();
      });
  }
  onTypeEquipmentType(event: Event) {
    this.utilityService.onTypeEquipmentType(event, this.standardOptionalAttributesModel, this.changeDetector);
  }
  onSelectEquipmentType(event: Event) {
    this.standardOptionalAttributesModel.optionalForm.controls.equipmentLength.reset();
    this.getEquipmentLength(event);
    this.standardOptionalAttributesModel.equipmentLength = [];
  }
  getEquipmentLength(data: Event) {
    const url = `equipmenttype/${data['value']}/equipmentClassificationTypeAssociations`;
    this.standardAttributesService.getEquipmentLength(url).pipe(takeWhile(() => this.standardOptionalAttributesModel.subscriberFlag))
      .subscribe((response) => {
        if (response && response._embedded && response._embedded.equipmentClassificationTypeAssociations) {
          const equipmentTypeId = response._embedded.equipmentClassificationTypeAssociations[0]['equipmentClassificationTypeAssociationID'];
          this.standardOptionalAttributesModel.equipTypeId = equipmentTypeId;
          const equipmentLengthUrl = `equipmentclassificationtypeassociation/${equipmentTypeId}/equipmentDimensions`;
          this.standardAttributesService.getEquipmentLength(equipmentLengthUrl).pipe(takeWhile(() =>
            this.standardOptionalAttributesModel.subscriberFlag))
            .subscribe((equipmentLengthResponse) => {
              if (equipmentLengthResponse && equipmentLengthResponse._embedded && equipmentLengthResponse._embedded.equipmentDimensions) {
                this.standardOptionalAttributesModel.equipmentLength = [];
                equipmentLengthResponse._embedded.equipmentDimensions.forEach(equipLength => {
                  this.standardOptionalAttributesModel.equipmentLength.push({
                    label: `${equipLength['lengthQuantity']}`,
                    value: `${equipLength['lengthQuantity']} ${equipLength['unitOfLengthMeasurementCode']} in Length`,
                    id: equipLength['equipmentDimensionId']
                  });
                });
              }
              this.standardOptionalAttributesModel.equipmentLength =
                utils.uniqBy(this.standardOptionalAttributesModel.equipmentLength, 'label');
              this.standardOptionalAttributesModel.equipmentLength.sort((chargeTypefirstValue, chargeTypeSecondValue) => {
                return (chargeTypefirstValue.label > chargeTypeSecondValue.label) ? 1 : -1;
              });
              this.changeDetector.detectChanges();
            });
        }
      });
  }
  onTypeEquipmentLength(event: Event) {
    this.utilityService.onTypeEquipmentLength(event, this.standardOptionalAttributesModel, this.changeDetector);
  }
  processedCarrierDetails() {
    this.standardOptionalAttributesModel.carriersList = [];
    const carrierQuery = CarrierOptionalQuery.getCarrierQuery();
    this.standardAttributesService.getCarrierData(carrierQuery).pipe(takeWhile(() => this.standardOptionalAttributesModel.subscriberFlag)).
      subscribe((carrierData: HitsInterface[]) => {
        if (!utils.isEmpty(carrierData)) {
          const data = carrierData['hits']['hits'];
          for (const value of data) {
            this.standardOptionalAttributesModel.carriersList.push({
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
    this.utilityService.onTypeCarrierValue(event, this.standardOptionalAttributesModel, this.changeDetector);
  }
  onEquipmentClear(event: Event, controlName: string) {
    this.standardOptionalAttributesModel.optionalForm.controls[controlName].setValue('');
  }
}

