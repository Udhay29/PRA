import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';
import { ViewAgreementDetailsModule } from '../../../view-agreement-details.module';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { OverviewComponent } from './overview.component';
import { OverviewService } from './services/overview.service';
import { of } from 'rxjs';

import { ViewAgreementDetailsUtility } from './../../../service/view-agreement-details-utility';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BroadcasterService } from '../../../../../shared/jbh-app-services/broadcaster.service';

import { EquipmentLength } from './model/overview.interface';
import { MessageService } from 'primeng/components/common/messageservice';
import { By } from '@angular/platform-browser';

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;
  let equipmentLengths: EquipmentLength;
  let editLineHaulData: any;
  let messageService: MessageService;
  let utilityService: ViewAgreementDetailsUtility;
  let broadcasterService: BroadcasterService;
  const lineHaulEditDetails: any = {
    'lineHaulConfigurationID': 3456,
    'laneID': 2397,
    'lineHaulSourceTypeID': 4,
    'lineHaulSourceTypeName': 'Manual ',
    'origin': {
      'type': 'Address',
      'typeID': 3,
      'country': null,
      'point': null,
      'pointID': 263074,
      'description': null,
      'vendorID': null,
      'addressLine1': null,
      'addressLine2': null,
      'cityName': null,
      'countryCode': null,
      'countryName': null,
      'postalCode': null,
      'stateCode': null,
      'stateName': null,
      'lowerBoundID': null,
      'lowerBound': null,
      'upperBoundID': null,
      'upperBound': null,
      'boundRange': null
    },
    'destination': {
      'type': 'Address',
      'typeID': 3,
      'country': null,
      'point': null,
      'pointID': 1673754,
      'description': null,
      'vendorID': null,
      'addressLine1': null,
      'addressLine2': null,
      'cityName': null,
      'countryCode': null,
      'countryName': null,
      'postalCode': null,
      'stateCode': null,
      'stateName': null,
      'lowerBoundID': null,
      'lowerBound': null,
      'upperBoundID': null,
      'upperBound': null,
      'boundRange': null
    },
    'stops': [
      {
        'stopSequenceNumber': 1,
        'stopTypeName': 'Address',
        'stopTypeID': 3,
        'stopCountry': null,
        'stopPoint': null,
        'stopPointID': 57886,
        'geographicPointUsageLevelTypeAssociationID': 32,
        'vendorID': null
      }
    ],
    'stopChargeIncludedIndicator': true,
    'status': 'Draft',
    'effectiveDate': '2019-07-22',
    'expirationDate': '2019-07-23',
    'agreementID': 134,
    'agreementName': 'The Home Depot Inc (HDAT)',
    'contractID': 263,
    'contractNumber': 'CONT0010',
    'contractName': 'Primary Home Depot Account',
    'sectionID': 1701,
    'sectionName': 'section6909994',
    'financeBusinessUnitServiceOfferingAssociationID': 1,
    'businessUnit': 'JBT',
    'serviceOffering': 'OTR',
    'serviceOfferingDescription': 'Over The Road',
    'serviceOfferingBusinessUnitTransitModeAssociationID': 1,
    'transitMode': 'Truck',
    'transitModeDescription': 'Transit By Truck',
    'serviceLevelBusinessUnitServiceOfferingAssociationID': 1,
    'serviceLevel': 'Standard',
    'serviceLevelDescription': 'Standard',
    'equipmentRequirementSpecificationAssociationID': 13141,
    'equipmentClassificationCode': 'Chassis',
    'equipmentClassificationCodeDescription': 'CHASSIS',
    'equipmentTypeCode': 'Dolly',
    'equipmentTypeCodeDescription': 'DOLLY',
    'equipmentLengthQuantity': 10,
    'unitOfEquipmentLengthMeasurementCode': 'Feet',
    'operationalServices': [
      {
        'serviceTypeCode': 'TrailWshOt',
        'serviceTypeDescription': 'Trailer Washout and Flush'
      }
    ],
    'priorityNumber': 65,
    'overriddenPriority': 5,
    'awardStatusID': 1,
    'awardStatus': 'Primary',
    'rates': [
      {
        'customerLineHaulRateID': 3939,
        'customerLineHaulConfigurationID': 3456,
        'chargeUnitType': 'Flat',
        'rateAmount': 10,
        'minimumAmount': null,
        'maximumAmount': null,
        'currencyCode': 'CAD'
      }
    ],
    'groupRateType': null,
    'groupRateItemIndicator': false,
    'sourceID': null,
    'sourceLineHaulID': null,
    'billTos': null,
    'carriers': [],
    'mileagePreference': {
      'mileagePreferenceID': null,
      'mileagePreferenceName': null,
      'mileagePreferenceMinRange': null,
      'mileagePreferenceMaxRange': null
    },
    'unitOfMeasurement': {
      'code': null,
      'description': null,
      'minWeightRange': null,
      'maxWeightRange': null
    },
    'hazmatIncludedIndicator': false,
    'fuelIncludedIndicator': false,
    'autoInvoiceIndicator': true,
    'createdUserId': 'rcon770',
    'lastUpdateUserId': 'rcon770',
    'recordStatus': 'active',
    'dbSyncUpdateTimestamp': null
  };
  const businessUnitServiceOffering: any = [
    {
      'financeBusinessUnitServiceOfferingAssociation': {
        'financeBusinessUnitServiceOfferingAssociationID': 1,
        'financeBusinessUnitCode': 'JBT',
        'serviceOfferingCode': 'OTR',
        'effectiveTimestamp': '2016-01-01T00:00',
        'expirationTimestamp': '2199-12-31T23:59:59',
        'lastUpdateTimestampString': '2017-11-20T08:24:31.8980803'
      },
      'transitMode': {
        'transitModeCode': 'Truck',
        'transitModeDescription': 'Transit By Truck',
        'lastUpdateTimestampString': '2017-10-17T10:58:53.3255625'
      },
      'utilizationClassification': {
        'utilizationClassificationCode': 'Headhaul',
        'utilizationClassificationDescription': 'Headhaul Utilization',
        'lastUpdateTimestampString': '2017-11-20T08:24:31.9990816'
      },
      'freightShippingType': {
        'freightShippingTypeCode': 'FTL',
        'freightShippingTypeDescription': 'Full Truck Load Shipping',
        'lastUpdateTimestampString': '2017-11-20T08:24:32.0111474'
      },
      'lastUpdateTimestampString': '2017-11-20T08:24:32.0290906',
      '_links': {
        'self': {
          'href': 'http://jvtweb18101.nonprod.jbhunt.com/referencedataservices/serviceOfferingBusinessUnitTransitModeAssociations/1'
        },
        'serviceOfferingBusinessUnitTransitModeAssociation': {
          'href':
            'http://jvtweb18101.nonprod.jbhunt.com/referencedataservices/serviceOfferingBusinessUnitTransitModeAssociations/1{?projection}',
          'templated': true
        }
      }
    }];
  const equipmentType: any = {
    '_embedded': {
      'equipmentTypes': [
        {
          '@id': 1,
          'createTimestamp': '2019-05-21T07:07:14.1014607',
          'equipmentTypeCode': 'Chassis',
          'effectiveTimestamp': '2019-05-21T07:07:14.1014607',
          'equipmentTypeDescription': 'CHASSIS',
          'expirationTimestamp': '2099-12-31T23:59:59.454',
          '_links': {
            'self': {
              'href': 'https://asset-test.jbhunt.com/ws_masterdata_asset/equipmenttype/Chassis'
            },
            'equipmentType': {
              'href': 'https://asset-test.jbhunt.com/ws_masterdata_asset/equipmenttype/Chassis'
            },
            'equipmentClassificationTypeAssociations': {
              'href': 'https://asset-test.jbhunt.com/ws_masterdata_asset/equipmenttype/Chassis/equipmentClassificationTypeAssociations'
            },
            'equipments': {
              'href': 'https://asset-test.jbhunt.com/ws_masterdata_asset/equipmenttype/Chassis/equipments'
            }
          }
        },
        {
          '@id': 2,
          'createTimestamp': '2019-05-21T07:07:14.1014607',
          'equipmentTypeCode': 'Dolly',
          'effectiveTimestamp': '2019-05-21T07:07:14.1014607',
          'equipmentTypeDescription': 'DOLLY',
          'expirationTimestamp': '2099-12-31T23:59:59.454',
          '_links': {
            'self': {
              'href': 'https://asset-test.jbhunt.com/ws_masterdata_asset/equipmenttype/Dolly'
            },
            'equipmentType': {
              'href': 'https://asset-test.jbhunt.com/ws_masterdata_asset/equipmenttype/Dolly'
            },
            'equipmentClassificationTypeAssociations': {
              'href': 'https://asset-test.jbhunt.com/ws_masterdata_asset/equipmenttype/Dolly/equipmentClassificationTypeAssociations'
            },
            'equipments': {
              'href': 'https://asset-test.jbhunt.com/ws_masterdata_asset/equipmenttype/Dolly/equipments'
            }
          }
        },
        {
          '@id': 3,
          'createTimestamp': '2019-05-21T07:07:14.1170631',
          'equipmentTypeCode': 'Extend',
          'effectiveTimestamp': '2019-05-21T07:07:14.1170631',
          'equipmentTypeDescription': 'EXTENDABLE',
          'expirationTimestamp': '2099-12-31T23:59:59.454',
          '_links': {
            'self': {
              'href': 'https://asset-test.jbhunt.com/ws_masterdata_asset/equipmenttype/Extend'
            },
            'equipmentType': {
              'href': 'https://asset-test.jbhunt.com/ws_masterdata_asset/equipmenttype/Extend'
            },
            'equipmentClassificationTypeAssociations': {
              'href': 'https://asset-test.jbhunt.com/ws_masterdata_asset/equipmenttype/Extend/equipmentClassificationTypeAssociations'
            },
            'equipments': {
              'href': 'https://asset-test.jbhunt.com/ws_masterdata_asset/equipmenttype/Extend/equipments'
            }
          }
        },
        {
          '@id': 4,
          'createTimestamp': '2017-11-20T08:24:32.1540989',
          'equipmentTypeCode': 'Intermodal',
          'effectiveTimestamp': '2016-01-01T00:00:00',
          'equipmentTypeDescription': 'INTERMODAL',
          'expirationTimestamp': '2199-12-31T23:59:59',
          '_links': {
            'self': {
              'href': 'https://asset-test.jbhunt.com/ws_masterdata_asset/equipmenttype/Intermodal'
            },
            'equipmentType': {
              'href': 'https://asset-test.jbhunt.com/ws_masterdata_asset/equipmenttype/Intermodal'
            },
            'equipmentClassificationTypeAssociations': {
              'href': 'https://asset-test.jbhunt.com/ws_masterdata_asset/equipmenttype/Intermodal/equipmentClassificationTypeAssociations'
            },
            'equipments': {
              'href': 'https://asset-test.jbhunt.com/ws_masterdata_asset/equipmenttype/Intermodal/equipments'
            }
          }
        }
      ]
    },
    '_links': {
      'self': {
        'href':
          `https://asset-test.jbhunt.com/ws_masterdata_asset/equipmenttype/search/byequipmentclassification
          ?equipmentClassificationCode=Chassis`
      }
    }
  };
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule, HttpClientModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, MessageService]
    });
  });

  beforeEach(() => {
    const formBuilder: FormBuilder = new FormBuilder();
    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    utilityService = TestBed.get(ViewAgreementDetailsUtility);
    messageService = TestBed.get(MessageService);
    broadcasterService = TestBed.get(BroadcasterService);
    component.overviewModel.overviewForm = formBuilder.group({
      sectionValue: [''],
      businessUnit: [''],
      serviceOffering: [''],
      serviceLevel: [''],
      operationalServices: [''],
      equipmentCategory: [''],
      equipmentType: [''],
      equipmentLength: [''],
      awardStatus: [''],
      overriddenPriority: ['']
    });

    component.overviewModel.overviewForm.controls['businessUnit'].setValue({ 'label': 'DCS', 'value': 'DCS' });
    component.overviewModel.overviewForm.controls['serviceOffering'].setValue({
      'label': 'Dedicated', 'value': 'Dedicated', 'id': '5'
    });
    component.overviewModel.overviewForm.controls['awardStatus'].setValue({ 'label': 'Routeguide', 'value': '2' });
    component.overviewModel.overviewForm.controls['equipmentCategory'].setValue({ 'label': 'CHASSIS', 'value': 'Chassis' });
    component.overviewModel.overviewForm.controls['serviceLevel'].setValue({ 'label': 'Standard', 'value': 'Standard', 'id': 12 });
    component.overviewModel.overviewForm.controls['sectionValue'].setValue({ 'label': 'sectionA', 'value': 498 });
    component.overviewModel.overviewForm.controls['operationalServices'].setValue(['Team']);
    component.overviewModel.overviewForm.controls['equipmentType'].setValue({ 'label': 'DOLLY', 'value': 'Dolly' });
    component.overviewModel.overviewForm.controls['overriddenPriority'].setValue({ 'label': 1, 'value': 1 });
    component.overviewModel.overviewForm.controls['equipmentLength'].setValue({
      'label': '123', 'value': '123', 'id': '5', 'code': 'abc', 'specificationId': 123
    });
    fixture.detectChanges();
    utilityService.editLineHaulData = {
      lineHaulDetails: 1760,
      isEditFlag: true
    };
    utilityService.setEditLineHaulData(utilityService.editLineHaulData);
    utilityService.LineHaulDetailData = {
      customerAgreementID: 'abc',
      customerAgreementName: 'abc',
      customerAgreementContractSectionID: 'abc',
      customerLineHaulConfigurationID: 123
    };
    utilityService.setLineHaulData(utilityService.LineHaulDetailData);
    editLineHaulData = {
      lineHaulConfigurationID: 123,
      laneID: 123,
      lineHaulSourceTypeID: 123,
      lineHaulSourceTypeName: 'abc',
      origin: {
        type: 'abc',
        typeID: 123,
        country: 'abc',
        point: 'abc',
        pointID: 123,
        description: 'abc',
        vendorID: 'abc',
      },
      destination: {
        type: 'abc',
        typeID: 123,
        country: 'abc',
        point: 'abc',
        pointID: 123,
        description: 'abc',
        vendorID: 'abc'
      },
      stops: [{
        stopSequenceNumber: 123,
        stopTypeName: 'abc',
        stopTypeID: 123,
        stopCountry: 'abc',
        stopPoint: 'abc',
        stopPointID: 123,
      }],
      stopChargeIncludedIndicator: true,
      status: 'abc',
      effectiveDate: 'abc',
      expirationDate: 'abc',
      agreementID: 123,
      agreementName: 'abc',
      contractID: 123,
      contractNumber: 'abc',
      contractName: 'abc',
      sectionID: 123,
      sectionName: 'abc',
      financeBusinessUnitServiceOfferingAssociationID: 123,
      businessUnit: 'abc',
      serviceOffering: 'abc',
      serviceOfferingDescription: 'abc',
      serviceOfferingBusinessUnitTransitModeAssociationID: 123,
      transitMode: 'abc',
      serviceLevelBusinessUnitServiceOfferingAssociationID: 123,
      serviceLevel: 'abc',
      equipment: 'any',
      operationalServices: [{ serviceTypeCode: 'abc' }],
      priorityNumber: 123,
      overriddenPriority: 1,
      awardStatusID: 123,
      awardStatus: 'abc',
      rates: [{
        customerLineHaulRateID: 123,
        customerLineHaulConfigurationID: 123,
        chargeUnitType: 'abc',
        rateAmount: 123,
        minimumAmount: 123,
        maximumAmount: 123,
        currencyCode: 'abc',
      }],
      groupRateType: 'abc',
      groupRateItemIndicator: true,
      sourceID: 123,
      sourceLineHaulID: 123,
      overridenPriorityNumber: 123,
      billTos: [{}, {}],
      carriers: [{}, {}],
      mileagePreference: {},
      mileagePreferenceMinRange: 123,
      mileagePreferenceMaxRange: 123,
      unitOfMeasurement: {},
      hazmatIncludedIndicator: true,
      fuelIncludedIndicator: true,
      autoInvoiceIndicator: true,
      equipmentRequirementSpecificationAssociationID: 123,
      equipmentClassificationCode: 'abc',
      equipmentClassificationCodeDescription: 'abc',
      equipmentTypeCode: 'abc',
      equipmentClassificationDescription: 'abc',
      equipmentTypeCodeDescription: 'abc',
      equipmentLengthQuantity: 123,
      unitOfEquipmentLengthMeasurementCode: 123
    };
    equipmentLengths = {
      _embedded: {
        equipmentDimensions: [{
          'lengthQuantity': 'abc',
          'unitOfLengthMeasurementCode': 'abc',
          'equipmentDimensionId': 'abc'
        }]
      },
      _links: {}
    };
    component.overviewModel.serviceLevelList = [{
      label: 'Standard',
      value: 'Standard',
      id: 1
    }];
    component.editSectionDate = {
      effectiveDate: '',
      expirationDate: ''
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should ngOnDestroy', () => {
    component.ngOnDestroy();
  });

  it('should call overviewForm', () => {
    component.overviewForm();
  });

  it('should call onServiceOfferingBlurred BU', () => {
    const event = {
      target : {
        value: 'DCS'
      }
    };
    component.overviewModel.overviewForm.controls['businessUnit'].setValue({ 'label': 'DCS', 'value': 'DCS' });
    component.onServiceOfferingBlurred(event);
  });

  it('should call onServiceOfferingBlurred', () => {
    const event = {
      target : {
        value: 'ICS'
      }
      };
    component.overviewModel.overviewForm.controls.businessUnit.setValue({ 'label': '', 'value': '' });
    component.onServiceOfferingBlurred(event);
  });

  it('should call onautoCompleteBlur', () => {
    component.overviewModel.overviewForm.controls['sectionValue'].setValue({ 'label': 'sectionA', 'value': 498 });
    const element = fixture.debugElement.query(By.css('[formControlName="sectionValue"]'));
    element.triggerEventHandler('onBlur', { target: { value: '' } });
    fixture.detectChanges();
  });

  it('should call getPriorityValues', () => {
    const response = {
      customerSectionID: 123,
      customerSectionName: 'abc',
      customerContractID: 123,
      customerContractName: 'abc',
      sectionEffectiveDate: 'abc',
      sectionExpirationDate: 'abc'
    };
    spyOn(OverviewService.prototype, 'getPriorityNumber').and.returnValue(of(response));
    component.getPriorityValues(123);
  });

  it('should call getServicelevelList', () => {
    const form = {
      sectionValue: ['Legal', Validators.required],
      businessUnit: ['DCS', Validators.required],
      serviceOffering: ['dedicated', Validators.required],
      serviceLevel: ['aaa'],
      operationalServices: ['aaa'],
      equipmentCategory: ['CONTAINER', Validators.required],
      equipmentType: ['DRY VAN'],
      equipmentLength: ['20 Feet'],
      awardStatus: ['Primary', Validators.required],
      overriddenPriority: ['4']
    };
    component.overviewModel.overviewForm.setValue(form);
    const response = {
      _embedded: {
        serviceLevelBusinessUnitServiceOfferingAssociations: [{
          serviceLevel: {
            serviceLevelCode: 'abc',
            serviceLevelDescription: 'abc',
            lastUpdateTimestampString: 'abc',
          },
          lastUpdateTimestampString: 'abc',
          _links: {
            self: {},
            serviceLevelBusinessUnitServiceOfferingAssociation: {
              href: 'https://pricing-test.jbhunt.com/pricingaccessorialservices/customerAccessorialDocumentConfigurations/84',
              templated: 'abc',
            },
            financeBusinessUnitServiceOfferingAssociation: {}
          }
        }]
      },
      _links: {}
    };
    component.overviewModel.selectedServiceOffering = 'Backhaul';
    component.overviewModel.selectedBu = 'JBI';
    spyOn(OverviewService.prototype, 'getServiceLevel').and.returnValue(of(response));
    component.getServicelevelList();
  });

  it('should call onTypeServiceLevel', () => {
    const event: any = { originalEvent: 'InputEvent', query: 'a' };
    component.overviewModel.serviceLevelList = [{
      label: 'Standard',
      value: 'Standard',
      id: 1
    }];
    component.onTypeServiceLevel(event);
  });

  it('should call serviceLevelSelected', () => {
    component.serviceLevelSelected('Standard');
  });

  it('should call onserviceLevelBlurred BU', () => {
    component.overviewModel.overviewForm.controls['businessUnit'].setValue({ 'label': 'DCS', 'value': 'DCS' });
    component.overviewModel.overviewForm.controls['serviceOffering'].setValue({
      'label': 'Dedicated', 'value': 'Dedicated', 'id': '5'
    });
    component.onserviceLevelBlurred('serviceOffering');
  });

  it('should call onserviceLevelBlurred', () => {
    component.overviewModel.overviewForm.controls['businessUnit'].setValue('');
    component.overviewModel.overviewForm.controls['serviceOffering'].setValue('');
    component.onserviceLevelBlurred('service');
  });

  it('should call getEquipmentCategory', () => {
    const equipmentCategory = {
      _embedded: {
        equipmentClassifications: [{
          effectiveTimestamp: '2038-01-19 03:14:07.999999',
          equipmentClassificationCode: 'abc',
          equipmentClassificationDescription: 'abc',
          equipmentFunctionalGroup: 'abc',
          expirationTimestamp: '2038-01-19 03:14:07.999999',
          lastUpdateTimestampString: '2038-01-19 03:14:07.999999',
        }]
      },
      _links: {}
    };
    spyOn(OverviewService.prototype, 'getEquipmentCategory').and.returnValue(of(equipmentCategory));
    component.getEquipmentCategory();
  });

  it('should call onTypeEquipmentCategory', () => {
    const event: any = { originalEvent: 'InputEvent', query: 'f' };
    component.overviewModel.equipmentCategory = [{
      label: 'Flatbed',
      value: 'Flatbed'
    }];
    component.onTypeEquipmentCategory(event);
  });

  it('should call equipmentCategorySelected', () => {
    component.overviewModel.overviewForm.addControl('equipmentType', new FormControl('abc', Validators.required));
    component.overviewModel.overviewForm.addControl('equipmentLength', new FormControl('2', Validators.required));
    component.equipmentCategorySelected('Flat bed');
  });

  it('should call onEquipmentBlur equipmentCategory', () => {
    component.overviewModel.overviewForm.controls['businessUnit'].setValue({ 'label': 'DCS', 'value': 'DCS' });
    component.overviewModel.overviewForm.controls['serviceOffering'].setValue({
      'label': 'Dedicated', 'value': 'Dedicated', 'id': '5'
    });
    component.overviewModel.overviewForm.controls['awardStatus'].setValue({ 'label': 'Routeguide', 'value': '2' });
    component.overviewModel.overviewForm.controls['equipmentCategory'].setValue({ 'label': 'CHASSIS', 'value': 'Chassis' });
    component.overviewModel.overviewForm.controls['serviceLevel'].setValue({ 'label': 'Standard', 'value': 'Standard', 'id': 12 });
    component.overviewModel.overviewForm.controls['sectionValue'].setValue({ 'label': 'sectionA', 'value': 498 });
    component.overviewModel.overviewForm.controls['operationalServices'].setValue(['Team']);
    component.overviewModel.overviewForm.controls['equipmentType'].setValue({ 'label': 'DOLLY', 'value': 'Dolly' });
    component.overviewModel.overviewForm.controls['overriddenPriority'].setValue({ 'label': 1, 'value': 1 });
    component.overviewModel.overviewForm.controls['equipmentLength'].setValue({
      'label': '123', 'value': '123', 'id': '5', 'code': 'abc', 'specificationId': 123
    });
    const element = fixture.debugElement.query(By.css('[formControlName="equipmentCategory"]'));
    element.triggerEventHandler('onBlur', { target: { value: '' } });
    fixture.detectChanges();
  });


  it('should call onEquipmentBlur equipmentType', () => {
    component.overviewModel.overviewForm.controls['businessUnit'].setValue({ 'label': 'DCS', 'value': 'DCS' });
    component.overviewModel.overviewForm.controls['serviceOffering'].setValue({
      'label': 'Dedicated', 'value': 'Dedicated', 'id': '5'
    });
    component.overviewModel.overviewForm.controls['awardStatus'].setValue({ 'label': 'Routeguide', 'value': '2' });
    component.overviewModel.overviewForm.controls['equipmentCategory'].setValue({ 'label': 'CHASSIS', 'value': 'Chassis' });
    component.overviewModel.overviewForm.controls['serviceLevel'].setValue({ 'label': 'Standard', 'value': 'Standard', 'id': 12 });
    component.overviewModel.overviewForm.controls['sectionValue'].setValue({ 'label': 'sectionA', 'value': 498 });
    component.overviewModel.overviewForm.controls['operationalServices'].setValue(['Team']);
    component.overviewModel.overviewForm.controls['equipmentType'].setValue({ 'label': 'DOLLY', 'value': 'Dolly' });
    component.overviewModel.overviewForm.controls['overriddenPriority'].setValue({ 'label': 1, 'value': 1 });
    component.overviewModel.overviewForm.controls['equipmentLength'].setValue({
      'label': '123', 'value': '123', 'id': '5', 'code': 'abc', 'specificationId': 123
    });
    const element = fixture.debugElement.query(By.css('[formControlName="equipmentType"]'));
    element.triggerEventHandler('onBlur', { target: { value: '' } });
  });

  it('should call getEquipmentType', () => {
    const equipmentTypex = {
      _embedded: {
        equipmentTypes: [{
          effectiveTimestamp: '2038-01-19 03:14:07.999999',
          equipmentClassificationTypeAssociations: [{
            EquipmentClassificationTypeAssociationID: 123,
            effectiveTimestamp: '2038-01-19 03:14:07.999999',
            equipmentClassification: 'abc',
            equipmentClassificationTypeAssociationID: 123,
            expirationTimestamp: '2038-01-19 03:14:07.999999',
            lastUpdateTimestampString: '2038-01-19 03:14:07.999999',
          }],
          equipmentTypeCode: 'abc',
          equipmentTypeDescription: 'abc',
          expirationTimestamp: '2038-01-19 03:14:07.999999',
          lastUpdateTimestampString: '2038-01-19 03:14:07.999999'
        }]
      },
      _links: {}
    };

    component.overviewModel.overviewForm.controls['businessUnit'].setValue({ 'label': 'DCS', 'value': 'DCS' });
    component.overviewModel.overviewForm.controls['serviceOffering'].setValue({
      'label': 'Dedicated', 'value': 'Dedicated', 'id': '5'
    });
    component.overviewModel.overviewForm.controls['awardStatus'].setValue({ 'label': 'Routeguide', 'value': '2' });
    component.overviewModel.overviewForm.controls['equipmentCategory'].setValue({ 'label': 'CHASSIS', 'value': 'Chassis' });
    component.overviewModel.overviewForm.controls['serviceLevel'].setValue({ 'label': 'Standard', 'value': 'Standard', 'id': 12 });
    component.overviewModel.overviewForm.controls['sectionValue'].setValue({ 'label': 'sectionA', 'value': 498 });
    component.overviewModel.overviewForm.controls['operationalServices'].setValue(['Team']);
    component.overviewModel.overviewForm.controls['equipmentType'].setValue({ 'label': 'DOLLY', 'value': 'Dolly' });
    component.overviewModel.overviewForm.controls['overriddenPriority'].setValue({ 'label': 1, 'value': 1 });
    component.overviewModel.overviewForm.controls['equipmentLength'].setValue({
      'label': '123', 'value': '123', 'id': '5', 'code': 'abc', 'specificationId': 123
    });
    component.overviewModel.selectedCategory = 'Chassis';
    spyOn(OverviewService.prototype, 'getEquipmentType').and.returnValue(of(equipmentTypex));
    component.getEquipmentType();
  });

  it('should call getEquipmentType when equipmentCategory is empty', () => {
    component.overviewModel.overviewForm.controls['equipmentCategory'].setValue(null);
    component.getEquipmentType();
  });

  it('should call onTypeEquipmentType', () => {
    const event: any = { 'originalEvent': { 'isTrusted': true }, 'query': '' };
    component.overviewModel.equipmentType = [{
      label: 'DRYVAN',
      value: 'DRYVAN'
    }];
    component.onTypeEquipmentType(event);
  });

  it('should call equipmentTypeSelected', () => {
    component.overviewModel.overviewForm.addControl('equipmentLength', new FormControl('2', Validators.required));
    component.overviewModel.equipmentType = [{
      label: 'DOLLY',
      value: 'Dolly'
    }];
    component.equipmentTypeSelected('Dolly');
  });

  it('should call equipmentFieldblurred', () => {
    component.overviewModel.overviewForm.controls.equipmentCategory.setValue(null);
    component.equipmentFieldblurred();
  });

  it('should call getEquipmentLength', () => {
    component.overviewModel.selectedCategory = 'Chassis';
    component.overviewModel.equipmentTypeCode = 'Dolly';
    const equipmentLength = {
      _embedded: {
        equipmentDimensions: [{
          'lengthQuantity': '1',
          'unitOfLengthMeasurementCode': 'Feet',
          'equipmentDimensionId': '12'
        }]
      },
      _links: {}
    };
    spyOn(OverviewService.prototype, 'getEquipmentLength').and.returnValue(of(equipmentLength));
    component.getEquipmentLength();
  });

  it('should call getEquipmentLength when type empty', () => {
    component.overviewModel.selectedCategory = '';
    component.overviewModel.equipmentTypeCode = '';
    const equipmentLength = {
      _embedded: {
        equipmentDimensions: [{
          'lengthQuantity': '1',
          'unitOfLengthMeasurementCode': 'Feet',
          'equipmentDimensionId': '12'
        }]
      },
      _links: {}
    };
    spyOn(OverviewService.prototype, 'getEquipmentLength').and.returnValue(of(equipmentLength));
    component.getEquipmentLength();
  });

  it('should call onTypeEquipmentLength', () => {
    const event: any = { 'originalEvent': { 'isTrusted': true }, 'query': '' };
    component.overviewModel.equipmentLength = [{
      label: '20 feet',
      value: '20 feet',
      id: 1,
      specificationId: 123,
      code: 'feet'
    }];
    component.onTypeEquipmentLength(event);
  });

  it('should call equipmentLengthSelected', () => {
    component.overviewModel.equipmentLength = [{
      label: '20 feet',
      value: '20 feet',
      id: 1,
      specificationId: 123,
      code: 'feet'
    }];
    component.equipmentLengthSelected('20 feet');
  });

  it('should call callOperationService', () => {
    component.overviewModel.selectedBu = 'JBI';
    component.overviewModel.selectedServiceOffering = 'Backhaul';
    const operationalServices = [{
      'serviceTypeCode': 'Team', 'serviceCategoryCode': 'ReqServ', 'chargeCode': 'Team',
      'serviceTypeDescription': 'Team Driving', 'effectiveTimestamp': '2016-01-01T00:00', 'expirationTimestamp': '2199-12-31T23:59:59',
      'lastUpdateTimestampString': '2018-06-11T13:46:04.514808900'
    }, {
      'serviceTypeCode': 'TrailWshOt', 'serviceCategoryCode': 'ReqServ',
      'chargeCode': null, 'serviceTypeDescription': 'Trailer Washout and Flush', 'effectiveTimestamp': '2016-01-01T00:00',
      'expirationTimestamp': '2199-12-31T23:59:59', 'lastUpdateTimestampString': '2018-06-11T13:46:04.548754900'
    }];
    spyOn(OverviewService.prototype, 'getOperationalServices').and.returnValue(of(operationalServices));
    component.callOperationService();
  });

  it('should call getOperationalServices', () => {
    component.getOperationalServices();
  });

  it('should call getOperationalServices when BU null', () => {
    component.overviewModel.overviewForm.controls['businessUnit'].setValue(null);
    component.overviewModel.overviewForm.controls['serviceOffering'].setValue(null);
    component.getOperationalServices();
  });

  it('should call getAwardStatus', () => {
    const awardStatus = {
      _embedded: {
        lineHaulAwardStatusTypes: [{
          awardStatusTypeID: 123,
          awardStatusTypeName: 'abc',
          _links: {}
        }]
      },
      _links: {},
      page: {}
    };
    spyOn(OverviewService.prototype, 'getAwardStatus').and.returnValue(of(awardStatus));
    component.getAwardStatus();
  });

  it('should call onTypeAwardStatus', () => {
    const event: any = { 'originalEvent': { 'isTrusted': true }, 'query': 'Primary' };
    component.overviewModel.awardStatus = [{
      label: 'Primary',
      value: 1
    }];
    component.onTypeAwardStatus(event);
  });

  it('should call awardStatusSelected', () => {
    component.awardStatusSelected(123);
  });

  it('should call getBusinessUnitList', () => {
    const businessUnit = {
      _embedded: {
        serviceOfferingBusinessUnitTransitModeAssociations: [{
          financeBusinessUnitServiceOfferingAssociation: {
            financeBusinessUnitServiceOfferingAssociationID: 123,
            financeBusinessUnitCode: 'abc',
            serviceOfferingCode: 'abc',
            effectiveTimestamp: 'abc',
            expirationTimestamp: 'abc',
            lastUpdateTimestampString: 'abc'
          },
          transitMode: 'abc',
          utilizationClassification: 'abc',
          freightShippingType: 'abc',
          lastUpdateTimestampString: 'abc',
          _links: {}
        }]
      },
      _links: {}
    };
    spyOn(OverviewService.prototype, 'getBusinesUnit').and.returnValue(of(businessUnit));
    component.getBusinessUnitList();
  });

  it('should call onTypeBusinessValue', () => {
    const event: any = { 'originalEvent': { 'isTrusted': true }, 'query': '' };
    component.overviewModel.businessUnitList = [{
      label: 'DCS',
      value: 'DCS'
    }];
    component.onTypeBusinessValue(event);
  });

  it('should call businsessUnitSelected', () => {
    component.businsessUnitSelected('DCS');
  });

  it('should call serviceOfferingSelected', () => {
    const selectedServiceOffering = {
      label: 'LTL',
      value: 'LTL',
      id: 123
    };
    component.serviceOfferingSelected(selectedServiceOffering);
  });

  it('should call setServiceOffering', () => {
    component.overviewModel.businessUnitServiceOffering = [{
      financeBusinessUnitServiceOfferingAssociation: {
        financeBusinessUnitServiceOfferingAssociationID: 123,
        financeBusinessUnitCode: 'DCS',
        serviceOfferingCode: 'LTL',
        effectiveTimestamp: 'abc',
        expirationTimestamp: 'abc',
        lastUpdateTimestampString: 'abc',
      },
      transitMode: 'abc',
      utilizationClassification: 'abc',
      freightShippingType: 'abc',
      lastUpdateTimestampString: 'abc',
      _links: {
        self: {
          href: 'abc/abc/abc'
        }
      },
    }];
    component.overviewModel.selectedServiceOffering = 'LTL';
    component.overviewModel.selectedBu = 'DCS';
    const selectedServiceOffering = {
      label: 'LTL',
      value: 'LTL',
      id: 123
    };
    component.setServiceOffering(selectedServiceOffering);
  });

  it('should call editserviceOfferingSelected', () => {
    const selectedServiceOffering = {
      label: 'LTL',
      value: 'LTL',
      id: 123
    };
    component.editserviceOfferingSelected(selectedServiceOffering);
  });

  it('should call setTransitMode', () => {
    component.overviewModel.businessUnitServiceOffering = [{
      financeBusinessUnitServiceOfferingAssociation: {
        financeBusinessUnitServiceOfferingAssociationID: 123,
        financeBusinessUnitCode: 'DCS',
        serviceOfferingCode: 'LTL',
        effectiveTimestamp: 'abc',
        expirationTimestamp: 'abc',
        lastUpdateTimestampString: 'abc',
      },
      transitMode: 'abc',
      utilizationClassification: 'abc',
      freightShippingType: 'abc',
      lastUpdateTimestampString: 'abc',
      _links: {
        self: {
          href: 'abc/abc/abc'
        }
      },
    }];
    component.overviewModel.selectedBu = 'DCS';
    component.overviewModel.selectedServiceOffering = 'LTL';
    component.setTransitMode();
  });

  it('should call getServiceOffering', () => {
    component.overviewModel.businessUnitServiceOffering = [{
      financeBusinessUnitServiceOfferingAssociation: {
        financeBusinessUnitServiceOfferingAssociationID: 123,
        financeBusinessUnitCode: 'abc',
        serviceOfferingCode: 'abc',
        effectiveTimestamp: 'abc',
        expirationTimestamp: 'abc',
        lastUpdateTimestampString: 'abc'
      },
      transitMode: 'abc',
      utilizationClassification: 'abc',
      freightShippingType: 'abc',
      lastUpdateTimestampString: 'abc',
      _links: {}
    }];
    const serviceOfferingValues = [{
      financeBusinessUnitServiceOfferingAssociationID: 123,
      serviceOfferingCode: 'abc',
      serviceOfferingDescription: 'abc',
      transitModeId: 123,
      transitModeCode: 'abc',
      transitModeDescription: 'abc',
    }];
    spyOn(OverviewService.prototype, 'getServiceOffering').and.returnValue(of(serviceOfferingValues));
    component.getServiceOffering();
  });

  it('should call setServiceOfferings', () => {
    component.overviewModel.serviceOfferingList = [];
    const serviceOfferingValues = [{
      financeBusinessUnitServiceOfferingAssociationID: 123,
      serviceOfferingCode: 'abc',
      serviceOfferingDescription: 'abc',
      transitModeId: 123,
      transitModeCode: 'abc',
      transitModeDescription: 'abc',
    }];
    component.setServiceOfferings(serviceOfferingValues);
  });

  it('should call onTypeServiceOffering', () => {
    const event: any = { 'originalEvent': { 'isTrusted': true }, 'query': '' };
    component.overviewModel.serviceOfferingList = [{
      label: 'LTL',
      value: 'LTL',
      id: 123
    }];
    component.onTypeServiceOffering(event);
  });

  it('should call getSectionData', () => {
    component.overviewModel.sectionData = [{
      customerSectionID: 123,
      customerSectionName: 'abc',
      customerContractID: 123,
      customerContractName: 'abc',
      sectionEffectiveDate: 'abc',
      sectionExpirationDate: 'abc'
    }];
    component.getSectionData();
  });

  it('should call onTypeSectionValue', () => {
    const event: any = { 'originalEvent': { 'isTrusted': true }, 'query': '' };
    component.overviewModel.sectionValues = [{
      label: 'abc',
      value: 1
    }];
    component.onTypeSectionValue(event);
  });

  it('should call onSectionSelected', () => {
    component.overviewModel.sectionData = [{
      customerSectionID: 123,
      customerSectionName: 'abc',
      customerContractID: 123,
      customerContractName: 'abc',
      sectionEffectiveDate: 'abc',
      sectionExpirationDate: 'abc'
    }];
    component.onSectionSelected(123);
  });

  it('should call toastMessage', () => {
    component.toastMessage(messageService, 'error', 'Error');
  });

  it('should call getOverRiddenPriorityValues', () => {
    component.overviewModel.priorityLevelNumber = 50;
    component.getOverRiddenPriorityValues();
  });

  it('should call onTypePriorityValue', () => {
    const event: any = { 'originalEvent': { 'isTrusted': true }, 'query': '' };
    component.overviewModel.overRiddenPriorityValues = [{
      label: '1',
      value: '1'
    }];
    component.onTypePriorityValue(event);
  });

  it('should call onPrioritySelected', () => {
    component.onPrioritySelected('2');
  });

  it('should call operationalServiceSelected', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="operationalServices"]'));
    element.triggerEventHandler('onChange', { value: 'abc' });
    fixture.detectChanges();
  });


  xit('should call setvalueforOverviewSection', () => {
    broadcasterService.broadcast('editlinehaulDetails', lineHaulEditDetails);
    component.setvalueforOverviewSection();
  });

  xit('should call setEditEquipmentType', () => {
    component.overviewModel.editEquipmentType = 'Dolly';
    component.overviewModel.equipmentType = [{ 'label': 'CHASSIS', 'value': 'Chassis' },
    { 'label': 'DOLLY', 'value': 'Dolly' }, { 'label': 'EXTENDABLE', 'value': 'Extend' },
    { 'label': 'INTERMODAL', 'value': 'Intermodal' }];
    component.setEditEquipmentType();
  });

  xit('should call setEditEquipmentLength', () => {
    component.overviewModel.equipmentLength = [
      { 'label': '6 Feet', 'value': '6 Feet', 'id': 6, 'specificationId': 2351, 'code': 'Feet' },
      { 'label': '10 Feet', 'value': '10 Feet', 'id': 10, 'specificationId': 13141, 'code': 'Feet' }];
    component.overviewModel.editEquipmentLength = 2351;
    component.setEditEquipmentLength();
  });

  it('should call getEditSectionDetails', () => {
    component.editSectionDate = {
      effectiveDate: '2019-06-24',
      expirationDate: '2019-10-17'
    };
    const response: any = [
      {
        'customerSectionID': 1701,
        'customerSectionName': 'section4682840',
        'customerContractID': 263,
        'customerContractName': 'Primary Home Depot Account',
        'customerContractNumber': 'CONT0010',
        'sectionEffectiveDate': '2019-06-24',
        'sectionExpirationDate': '2019-10-17',
        'customerAgreementID': 134,
        'customerAgreementName': 'The Home Depot Inc (HDAT)'
      }];
    spyOn(OverviewService.prototype, 'onSaveManualDetails').and.returnValue(of(response));
    component.getEditSectionDetails(lineHaulEditDetails);

  });
  xit('should call getEditSectionDetails-empty', () => {
    component.editSectionDate = {
      effectiveDate: '',
      expirationDate: ''
    };
    const response: any = [
      {
        'customerSectionID': 1701,
        'customerSectionName': 'section4682840',
        'customerContractID': 263,
        'customerContractName': 'Primary Home Depot Account',
        'customerContractNumber': 'CONT0010',
        'sectionEffectiveDate': '2019-06-24',
        'sectionExpirationDate': '2019-10-17',
        'customerAgreementID': 134,
        'customerAgreementName': 'The Home Depot Inc (HDAT)'
      }];
    spyOn(OverviewService.prototype, 'onSaveManualDetails').and.returnValue(of(response));
    component.getEditSectionDetails(lineHaulEditDetails);

  });
  xit('should call getEditPriorityDetails', () => {
    component.getEditPriorityDetails(editLineHaulData);
  });

  it('should call setEditOperationalService', () => {
    component.overviewModel.editEquipmentOperational = [{
      serviceTypeCode: 'Blind Shipment'
    }];
    component.overviewModel.operationalServices = [{
      label: 'Blind Shipment',
      value: 'Blind Shipment'
    }];
    component.setEditOperationalService();
  });

  it('should call editequipmentTypeSelected', () => {
    component.overviewModel.equipmentType = [{
      label: 'abc',
      value: 'abc'
    }];
    component.editequipmentTypeSelected('abc');
  });

  it('should call setEditDataforOverview overriddenPriority 0', () => {
    lineHaulEditDetails.overriddenPriority = 0;
    component.setEditDataforOverview(lineHaulEditDetails);
  });

  it('should call setEditDataforOverview overriddenPriority 1', () => {
    component.setEditDataforOverview(lineHaulEditDetails);
  });

  it('should call getEditEquipmentType', () => {
    component.overviewModel.selectedCategory = 'Chassis';
    component.overviewModel.overviewForm.controls['equipmentCategory'].setValue({ 'label': 'CHASSIS', 'value': 'Chassis' });
    spyOn(OverviewService.prototype, 'getEquipmentType').and.returnValue(of(equipmentType));
    component.getEditEquipmentType();

  });

  it('should call setError', () => {
    const error: any = {
      'traceid': 'e512661ba4e5ee4b',
      'error': {
        'errors': [{
          'errorMessage': 'Cargo Release specified cannot be less than default Cargo Release value',
          'fieldErrorFlag': false,
          'errorType': 'Business Validation Error',
          'fieldName': null,
          'code': 'CARGO_VALUE_LESS_THAN_DEFAULT_VALUE',
          'errorSeverity': 'ERROR'
        }]
      }
    };
    component.setError(error);
  });

  it('should call getEditEquipmentLength', () => {
    component.overviewModel.selectedCategory = 'Chassis';
    component.overviewModel.equipmentTypeCode = 'Extend';
    component.overviewModel.equipmentLength = [{
      label: '48 feet',
      value: '48 feet',
      id: 1,
      specificationId: 123,
      code: 'feet'
    }];
    equipmentLengths = {
      _embedded: {
        equipmentDimensions: [{
          id: 1,
          createTimestamp: '2019-06-06T06:35:56.9865272',
          effectiveTimestamp: '2019-06-06T06:35:56.9865272',
          equipmentDimensionId: 7,
          expirationTimestamp: '2099-12-31T23:59:59.454',
          heightQuantity: 114,
          lengthQuantity: 48,
          tenantID: 1,
          unitOfHeightMeasurementCode: 'Inches',
          unitOfLengthMeasurementCode: 'Feet',
          unitOfWidthMeasurementCode: 'Inches',
          widthQuantity: 102,
          _links: {
            equipmentClassificationTypeAssociation: {
              href:
                'https://asset-test.jbhunt.com/ws_masterdata_asset/equipmentdimension/7/equipmentClassificationTypeAssociation'
            },
            equipmentDimension: { href: 'https://asset-test.jbhunt.com/ws_masterdata_asset/equipmentdimension/7' },
            equipments: { href: 'https://asset-test.jbhunt.com/ws_masterdata_asset/equipmentdimension/7/equipments' },
            self: { href: 'https://asset-test.jbhunt.com/ws_masterdata_asset/equipmentdimension/7' }
          }
        }]
      },
      _links: {
        self: { href: 'https://asset-test.jbhunt.com/ws_masterdata_asset/equipmentdimension/7' }
      }
    };
    spyOn(OverviewService.prototype, 'getEquipmentLength').and.returnValue(of(equipmentLengths));
    component.getEditEquipmentLength();
  });

  it('should call getEditEquipmentLength  when equipmentTypeCode null', () => {
    component.overviewModel.selectedCategory = 'Chassis';
    component.overviewModel.equipmentTypeCode = null;
    component.overviewModel.equipmentLength = [{
      label: '48 feet',
      value: '48 feet',
      id: 1,
      specificationId: 123,
      code: 'feet'
    }];
    equipmentLengths = {
      _embedded: {
        equipmentDimensions: [{
          id: 1,
          createTimestamp: '2019-06-06T06:35:56.9865272',
          effectiveTimestamp: '2019-06-06T06:35:56.9865272',
          equipmentDimensionId: 7,
          expirationTimestamp: '2099-12-31T23:59:59.454',
          heightQuantity: 114,
          lengthQuantity: 48,
          tenantID: 1,
          unitOfHeightMeasurementCode: 'Inches',
          unitOfLengthMeasurementCode: 'Feet',
          unitOfWidthMeasurementCode: 'Inches',
          widthQuantity: 102,
          _links: {
            equipmentClassificationTypeAssociation: {
              href:
                'https://asset-test.jbhunt.com/ws_masterdata_asset/equipmentdimension/7/equipmentClassificationTypeAssociation'
            },
            equipmentDimension: { href: 'https://asset-test.jbhunt.com/ws_masterdata_asset/equipmentdimension/7' },
            equipments: { href: 'https://asset-test.jbhunt.com/ws_masterdata_asset/equipmentdimension/7/equipments' },
            self: { href: 'https://asset-test.jbhunt.com/ws_masterdata_asset/equipmentdimension/7' }
          }
        }]
      },
      _links: {
        self: { href: 'https://asset-test.jbhunt.com/ws_masterdata_asset/equipmentdimension/7' }
      }
    };
    spyOn(OverviewService.prototype, 'getEquipmentLength').and.returnValue(of(equipmentLengths));
    component.getEditEquipmentLength();
  });

  it('should call getEditOperationService', () => {
    component.overviewModel.selectedBu = 'abc';
    component.overviewModel.selectedServiceOffering = 'abc';
    const operationalServices = [{
      'serviceTypeCode': 'Team', 'serviceCategoryCode': 'ReqServ', 'chargeCode': 'Team',
      'serviceTypeDescription': 'Team Driving', 'effectiveTimestamp': '2016-01-01T00:00', 'expirationTimestamp': '2199-12-31T23:59:59',
      'lastUpdateTimestampString': '2018-06-11T13:46:04.514808900'
    }, {
      'serviceTypeCode': 'TrailWshOt', 'serviceCategoryCode': 'ReqServ',
      'chargeCode': null, 'serviceTypeDescription': 'Trailer Washout and Flush', 'effectiveTimestamp': '2016-01-01T00:00',
      'expirationTimestamp': '2199-12-31T23:59:59', 'lastUpdateTimestampString': '2018-06-11T13:46:04.548754900'
    }];
    spyOn(OverviewService.prototype, 'getOperationalServices').and.returnValue(of(operationalServices));
    component.getEditOperationService();
  });

  it('should call onClearDropDown equipmentType', () => {
    component.onClearDropDown('equipmentType');
  });

  it('should call onClearDropDown equipmentLength', () => {
    component.onClearDropDown('equipmentLength');
  });

  it('should call onClearDropDown overriddenPriority', () => {
    component.onClearDropDown('overriddenPriority');
  });

  it('should call onClearDropDown serviceLevel', () => {
    component.onClearDropDown('serviceLevel');
  });

  it('should call onClearDropDown serviceLevel', () => {
    component.onClearDropDown('serviceLevel123');
  });

  it('should call editbusinsessUnitSelected ', () => {
    component.editbusinsessUnitSelected(lineHaulEditDetails);
  });

  it('should call getEditServiceOffering ', () => {
    const serviceOfferingValues = [
      {
        'financeBusinessUnitServiceOfferingAssociationID': 1,
        'serviceOfferingCode': 'OTR',
        'serviceOfferingDescription': 'Over The Road',
        'transitModeId': 1,
        'transitModeCode': 'Truck',
        'transitModeDescription': 'Transit By Truck',
        'financeBusinessUnitCode': 'JBT',
        'chargeTypeBusinessUnitServiceOfferingAssociationID': null
      }
    ];
    component.overviewModel.selectedBu = 'JBT';
    component.overviewModel.selectedCategory = 'Chassis';
    component.overviewModel.businessUnitServiceOffering = businessUnitServiceOffering;
    spyOn(OverviewService.prototype, 'getServiceOffering').and.returnValue(of(serviceOfferingValues));
    component.getEditServiceOffering(lineHaulEditDetails);
  });

  it('should call editSectionType when sectionValues null', () => {
    component.overviewModel.sectionValues = [{
      label: 'xyz',
      value: 100001
    }];
    component.editSectionType(editLineHaulData);
  });
});
