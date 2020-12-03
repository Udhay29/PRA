import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';
import { ViewAgreementDetailsModule } from '../../../view-agreement-details.module';

import { RatesOptionalAttributesComponent } from './rates-optional-attributes.component';
import { OptionalAttributesService } from '../../shared/services/optional-attributes.service';
import { OptionalUtilityService } from '../../shared/services/optional-utility.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { FormGroup, FormBuilder } from '@angular/forms';

describe('RatesOptionalAttributesComponent', () => {
  let component: RatesOptionalAttributesComponent;
  let fixture: ComponentFixture<RatesOptionalAttributesComponent>;
  let rateAttributesService: OptionalAttributesService;
  let utilityService: OptionalUtilityService;
  let businessUnitServiceOfferingResponse;
  let processedCarrierDetailsResponse;
  let equipmentCategoryResponse;
  const formBuilder: FormBuilder = new FormBuilder();
  let optionalForm: FormGroup;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [OptionalAttributesService, OptionalUtilityService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatesOptionalAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    rateAttributesService = TestBed.get(OptionalAttributesService);
    utilityService = TestBed.get(OptionalUtilityService);
    optionalForm = formBuilder.group({
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
    businessUnitServiceOfferingResponse = {
      '_embedded': {
        'serviceOfferingBusinessUnitTransitModeAssociations': [
          {
            'financeBusinessUnitServiceOfferingAssociation': {
              'financeBusinessUnitServiceOfferingAssociationID': 1,
              'financeBusinessUnitCode': 'string',
              'serviceOfferingCode': 'string',
              'serviceOfferingDescription': 'string',
              'effectiveTimestamp': 'abc',
              'expirationTimestamp': 'abc',
              'lastUpdateTimestampString': 'abc'
            },
            'transitMode': 'string',
            'utilizationClassification': 'abc',
            'freightShippingType': 'abc',
            'lastUpdateTimestampString': 'abc',
            '_links': {}
          }
        ]
      },
      '_links': {}
    };
    processedCarrierDetailsResponse = {
      '_shards': {
        'total': 5,
        'successful': 5,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 31,
        'max_score': 0.105360515,
        'hits': [
          {
            '_index': 'masterdata-carrier-carrierdetails-v2',
            '_type': 'doc',
            '_id': 'AWZjpqh-mEZA5pCXUpzQ',
            '_score': 0.105360515,
            '_source': {
              'LegalName': 'J AND A TRANSPORT',
              'CarrierID': 69,
              'CarrierCode': '0D0Z'
            }
          }
        ]
      }
    };
    equipmentCategoryResponse = {
      '_embedded': {
        equipmentClassifications: [
          {
            'effectiveTimestamp': '1995-01-01T06:00:00.000+0000',
            'equipmentClassificationCode': 'test',
            'equipmentClassificationDescription': 'test',
            'equipmentFunctionalGroup': 'test',
            'expirationTimestamp': '2099-12-31T06:00:00.000+0000',
            'lastUpdateTimestampString': '2018-12-16T10:43:23.762'
          }
        ]
      },
      '_links': {}
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    spyOn(OptionalAttributesService.prototype, 'getBusinessUnitServiceOffering').and.returnValues(of(businessUnitServiceOfferingResponse));
    spyOn(OptionalAttributesService.prototype, 'getCarrierData').and.returnValues(of(processedCarrierDetailsResponse));
    spyOn(OptionalAttributesService.prototype, 'getEquipmentCategory').and.returnValues(of(equipmentCategoryResponse));
    component.ngOnInit();
  });

  it('should call getBusinessUnitBasedOnChargeCode', () => {
    const buSoAssociation = [{
      'financeBusinessUnitServiceOfferingAssociationID': 1,
      'serviceOfferingCode': 'OTR',
      'serviceOfferingDescription': 'Over The Road',
      'transitModeId': 1,
      'transitModeCode': 'Truck',
      'transitModeDescription': 'Transit By Truck',
      'financeBusinessUnitCode': 'JBT',
      'chargeTypeId': 98
    }];
    component.getBusinessUnitBasedOnChargeCode(buSoAssociation);
  });

  it('should call onBusinessUnitBlur', () => {
    const response = {
      'content': [
        {
          'serviceTypeCode': 'jit',
          'serviceCategoryCode': 'ReqServ',
          'serviceCategoryCodeDescription': 'Stop',
          'chargeCode': 'FLASHING',
          'serviceTypeDescription': 'jit',
          'stopReasonCode': ['Delivery'],
          'serviceOfferingCodeIds': [3],
          'serviceOfferingCode': null,
          'serviceOfferingCodeList': ['DCS Backhaul'],
          'stopReasonDescription': null,
          'status': 'Active',
          'expirationTimestamp': '2199-12-31T23:59',
          'createTimestamp': '2019-03-01T01:13:05.529',
          'createProgramName': 'Manual',
          'editableStatus': 'Editable'
        }
      ],
      'last': false,
      'totalElements': 39,
      'totalPages': 2,
      'size': 20,
      'number': 0,
      'sort': null,
      'numberOfElements': 20,
      'first': true
    };
    component.optionalAttributesModel.optionalForm.controls['businessUnit'].setValue('ICS');
    component.optionalAttributesModel.operationalArray = ['DCS Backhaul'];
    spyOn(OptionalAttributesService.prototype, 'getOperationalServices').and.returnValues(of(response));
    component.onBusinessUnitBlur();
  });

  it('should call onBusinessUnitSelected', () => {
    const response = {
      '_embedded': {
        'serviceLevelBusinessUnitServiceOfferingAssociations': [{
          'serviceLevel': {
            'serviceLevelCode': 'Standard',
            'serviceLevelDescription': 'Standard'
          },
          'financeBusinessUnitServiceOfferingAssociation': {
            'financeBusinessUnitServiceOfferingAssociationID': 169,
            'financeBusinessUnitCode': 'test',
            'serviceOfferingCode': 'test',
            'effectiveTimestamp': '1995-01-01T06:00:00.000+0000',
            'expirationTimestamp': '2099-12-31T06:00:00.000+0000',
            'lastUpdateTimestampString': '2018-12-16T10:43:23.762'
          },
          'lastUpdateTimestampString': '2013-09-29T18:46:19Z',
          'serviceLevelBusinessUnitServiceOfferingAssociationID': '1',
          '_links': {}
        }]
      },
      '_links': {}
    };
    spyOn(OptionalAttributesService.prototype, 'getServiceLevel').and.returnValues(of(response));
    component.optionalAttributesModel.optionalForm = optionalForm;
    component.optionalAttributesModel.optionalForm.controls['businessUnit'].setValue(['ICS']);
    const element = fixture.debugElement.query(By.css('[formControlName="businessUnit"]'));
    element.triggerEventHandler('onChange', {'value': [{
      chargeTypeBusinessUnitServiceOfferingAssociationID: null,
      financeBusinessUnitCode: 'DCS',
      financeBusinessUnitServiceOfferingAssociationID: 4,
      financeBusinessUnitServiceOfferingDisplayName: 'DCS - Backhaul',
      serviceOfferingDescription: 'Backhaul'
    }]});
  });

  it('should call onBusinessUnitSelected for else', () => {
    const response = {
      '_embedded': {
        'serviceLevelBusinessUnitServiceOfferingAssociations': [{
          'serviceLevel': {
            'serviceLevelCode': 'Standard',
            'serviceLevelDescription': 'Standard'
          },
          'financeBusinessUnitServiceOfferingAssociation': {
            'financeBusinessUnitServiceOfferingAssociationID': 169,
            'financeBusinessUnitCode': 'test',
            'serviceOfferingCode': 'test',
            'effectiveTimestamp': '1995-01-01T06:00:00.000+0000',
            'expirationTimestamp': '2099-12-31T06:00:00.000+0000',
            'lastUpdateTimestampString': '2018-12-16T10:43:23.762'
          },
          'lastUpdateTimestampString': '2013-09-29T18:46:19Z',
          'serviceLevelBusinessUnitServiceOfferingAssociationID': '1',
          '_links': {}
        }]
      },
      '_links': {}
    };
    spyOn(OptionalAttributesService.prototype, 'getServiceLevel').and.returnValues(of(response));
    const element = fixture.debugElement.query(By.css('[formControlName="businessUnit"]'));
    element.triggerEventHandler('onChange', {'value': []});
  });

  it('should call onBusinessUnitSelected for else', () => {
    const response = {
      '_embedded': {
        'serviceLevelBusinessUnitServiceOfferingAssociations': [{
          'serviceLevel': {
            'serviceLevelCode': 'Standard',
            'serviceLevelDescription': 'Standard'
          },
          'financeBusinessUnitServiceOfferingAssociation': {
            'financeBusinessUnitServiceOfferingAssociationID': 169,
            'financeBusinessUnitCode': 'test',
            'serviceOfferingCode': 'test',
            'effectiveTimestamp': '1995-01-01T06:00:00.000+0000',
            'expirationTimestamp': '2099-12-31T06:00:00.000+0000',
            'lastUpdateTimestampString': '2018-12-16T10:43:23.762'
          },
          'lastUpdateTimestampString': '2013-09-29T18:46:19Z',
          'serviceLevelBusinessUnitServiceOfferingAssociationID': '1',
          '_links': {}
        }]
      },
      '_links': {}
    };
    spyOn(OptionalAttributesService.prototype, 'getServiceLevel').and.returnValues(of(response));
    component.optionalAttributesModel.optionalForm = optionalForm;
    const event: any = false;
    component.onBusinessUnitSelected(event);
  });

  it('should call onSelectEquipmentCategory', () => {
    const response = {
      '_embedded': {
        'equipmentTypes': [
          {
            'effectiveTimestamp': '1995-01-01T06:00:00.000+0000',
            'equipmentClassificationTypeAssociations': [
              {
                'EquipmentClassificationTypeAssociationID': 1,
                'effectiveTimestamp': '1995-01-01T06:00:00.000+0000',
                'equipmentClassification': 'test',
                'equipmentClassificationTypeAssociationID': 1,
                'expirationTimestamp': '2099-12-31T06:00:00.000+0000',
                'lastUpdateTimestampString': '2018-12-16T10:43:23.762'
              }
            ],
            'equipmentTypeCode': 'test',
            'equipmentTypeDescription': 'test',
            'expirationTimestamp': '2099-12-31T06:00:00.000+0000',
            'lastUpdateTimestampString': '2018-12-16T10:43:23.762'
          }
        ]
      },
      '_links': {}
    };
    spyOn(OptionalUtilityService.prototype, 'onTypeEquipmentCategory');
    spyOn(OptionalAttributesService.prototype, 'getEquipmentType').and.returnValues(of(response));
    const element = fixture.debugElement.query(By.css('[formControlName="equipmentCategory"]'));
    element.triggerEventHandler('onSelect', {'value': {
      'label': 'Container',
      'value': 'Container'
    }});
    element.triggerEventHandler('completeMethod', {'value': {
      'label': 'Container',
      'value': 'Container'
    }});
    component.optionalAttributesModel.optionalForm.controls['equipmentCategory'].setValue({label: 'Chassis',
    value: 'Chassis'});
    const event = {target: {value: 'test'}};
  });

  it('should call onServiceLevelSelected', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="serviceLevel"]'));
    element.triggerEventHandler('onChange', {'value': {}});
  });

  it('should call onSelectEquipmentType', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="equipmentType"]'));
    element.triggerEventHandler('onSelect', {'id': {
      'id': 2,
      'label': 'Intermodal',
      'value': 'Intermodal'
    }});
  });

  it('should call onWaivedCheckboxSelect', () => {
    const event: any = true;
    component.optionalAttributesModel.optionalForm = optionalForm;
    component.onWaivedCheckboxSelect(event);
  });

  it('should call onWaivedCheckboxSelect for else', () => {
    const event: any = false;
    component.optionalAttributesModel.optionalForm = optionalForm;
    component.onWaivedCheckboxSelect(event);
  });

  it('should call getBusinessUnitServiceOffering', () => {
    spyOn(OptionalAttributesService.prototype, 'getBusinessUnitServiceOffering').and.returnValue(of(businessUnitServiceOfferingResponse));
    component.getBusinessUnitServiceOffering();
  });

  it('should call onBusinessUnitShow', () => {
    component.optionalAttributesModel.selectedChargeType = {
      label: 'string',
      value: 1,
      description: 'string'
    };
    component.onBusinessUnitShow();
  });

  it('should call onBusinessUnitShow', () => {
    component.onBusinessUnitShow();
  });

  it('should call emitbuSo', () => {
    const businessArray = [{
      financeBusinessUnitServiceOfferingAssociationID: 1,
      serviceOfferingCode: 'string',
      serviceOfferingDescription: 'string',
      transitModeId: 1,
      transitModeCode: 'string',
      transitModeDescription: 'string',
      financeBusinessUnitCode: 'string',
      chargeTypeBusinessUnitServiceOfferingAssociationID: 1,
    }];
    component.emitbuSo(businessArray);
  });

  it('should call onOperationalServiceSelected', () => {
    const event: any = {
      value: 'abc'
    };
    component.onOperationalServiceSelected(event);
  });

  it('should call onOperationalServiceSelected for else', () => {
    const event: any = 'abc';
    component.onOperationalServiceSelected(event);
  });

  it('should call getBusinessUnitServiceOfferingList for else', () => {
    const offeringList = [];
    component.getBusinessUnitServiceOfferingList(offeringList);
  });

  it('should call getServiceLevel for else', () => {
    const data = [1, 2];
    const response = {};
    spyOn(OptionalAttributesService.prototype, 'getServiceLevel').and.returnValue(of(response));
    component.getServiceLevel(data);
  });

  it('should call populateServiceLevel', () => {
    component.optionalAttributesModel.serviceLevel = [{
      label: 'Standard',
      value: 'Standard'
    }];
    component.optionalAttributesModel.optionalForm = optionalForm;
    component.optionalAttributesModel.optionalForm.controls['serviceLevel'].setValue([{
      label: 'NotStandard',
      value: 'NotStandard'
    }]);
    component.populateServiceLevel(component.optionalAttributesModel.serviceLevel);
  });

  it('should call getOperationalService for else', () => {
    const response = {};
    spyOn(OptionalAttributesService.prototype, 'getOperationalServices').and.returnValues(of(response));
    component.optionalAttributesModel.optionalForm = optionalForm;
    component.getOperationalService();
  });

  it('should call onEquipmentBlur for else', () => {
    component.optionalAttributesModel.optionalForm = optionalForm;
    const event: any = {target: { value: 'abc'}, srcElement: {value: ['abc', 'abc']}};
    component.onEquipmentBlur(event, 'businessUnit');
  });

  it('should call onTypeEquipmentType', () => {
    const event: any = {query: 'abc'};
    component.optionalAttributesModel.equipmentType = [{
      label: 'string',
      value: 'string',
    }];
    component.onTypeEquipmentType(event);
  });

  it('should call getEquipmentLength', () => {
    const event: any = {value: 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/contracttypes/1'};
    const response = {
      '_embedded': {
            'effectiveTimestamp': '1995-01-01T06:00:00.000+0000',
            'equipmentClassificationTypeAssociations': [
              {
                'EquipmentClassificationTypeAssociationID': 1,
                'effectiveTimestamp': '1995-01-01T06:00:00.000+0000',
                'equipmentClassification': 'test',
                'equipmentClassificationTypeAssociationID': 1,
                'expirationTimestamp': '2099-12-31T06:00:00.000+0000',
                'lastUpdateTimestampString': '2018-12-16T10:43:23.762'
              }
            ],
            'equipmentTypeCode': 'test',
            'equipmentTypeDescription': 'test',
            'expirationTimestamp': '2099-12-31T06:00:00.000+0000',
            'lastUpdateTimestampString': '2018-12-16T10:43:23.762'
      },
      '_links': {}
    };
   spyOn(rateAttributesService, 'getEquipmentLength').and.returnValue(of(response));
    component.getEquipmentLength(event);
  });

  it('should call getEquipmentLength for else', () => {
    const event: any = {value: 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/contracttypes/1'};
    const response = {};
   spyOn(rateAttributesService, 'getEquipmentLength').and.returnValue(of(response));
    component.getEquipmentLength(event);
  });

  it('should call populateEquipmentLength', () => {
    const equipmentResponseLength = {
      '_embedded' : {
        'equipmentDimensions' : [ {
          '@id' : 1,
          'createTimestamp' : '2019-03-14T21:55:17.9863641',
          'equipmentDimensionId' : 95,
          'effectiveTimestamp' : '2019-03-14T21:55:17.9863641',
          'expirationTimestamp' : '2099-12-31T23:59:59.454',
          'heightQuantity' : 0,
          'lengthQuantity' : 53,
          'tenantID' : 1,
          'unitOfHeightMeasurementCode' : 'Inches',
          'unitOfLengthMeasurementCode' : 'Feet',
          'unitOfWidthMeasurementCode' : 'Inches',
          'widthQuantity' : 102,
          '_links' : {}
        } ]
      },
      '_links' : {}
    };
    component.populateEquipmentLength(equipmentResponseLength);
  });

});
