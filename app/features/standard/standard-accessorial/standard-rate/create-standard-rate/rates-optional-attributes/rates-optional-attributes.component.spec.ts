import { MessageService } from 'primeng/components/common/messageservice';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StandardModule } from '../../../../standard.module';
import { APP_BASE_HREF } from '@angular/common';
import { RatesOptionalAttributesComponent } from './rates-optional-attributes.component';
import {Observable, of} from 'rxjs';
import { OptionalAttributeService } from './service/optional-attribute.service';
import { OptionalUtilityService } from './service/optional-utility.service';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

describe('CreateStandardDocumentationComponent', () => {
  let component: RatesOptionalAttributesComponent;
  let fixture: ComponentFixture<RatesOptionalAttributesComponent>;
  let rateAttributesService: OptionalAttributeService;
  let utilityService: OptionalUtilityService;
  let messageService: MessageService;


  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,  StandardModule, HttpClientTestingModule],
      declarations: [],
      providers: [OptionalAttributeService, OptionalUtilityService, { provide: APP_BASE_HREF, useValue: '/' }, MessageService]
    });
  });

    beforeEach(() => {
      fixture = TestBed.createComponent(RatesOptionalAttributesComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      messageService = TestBed.get(MessageService);
      rateAttributesService = TestBed.get(OptionalAttributeService);
      utilityService = TestBed.get(OptionalUtilityService);
  });
  const businessUnitServiceOfferingResponse = {
    '_embedded': {
      'serviceOfferingBusinessUnitTransitModeAssociations': [
        {
          'financeBusinessUnitServiceOfferingAssociation': {
            'financeBusinessUnitServiceOfferingAssociationID': 1,
            'financeBusinessUnitCode': 'string',
            'serviceOfferingCode': 'string',
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
  const processedCarrierDetailsResponse = {
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
  const equipmentCategoryResponse = {
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call ngOnInit', () => {
    spyOn(OptionalAttributeService.prototype, 'getBusinessUnitServiceOffering').and.returnValues(of(businessUnitServiceOfferingResponse));
    spyOn(OptionalAttributeService.prototype, 'getCarrierData').and.returnValues(of(processedCarrierDetailsResponse));
    spyOn(OptionalAttributeService.prototype, 'getEquipmentCategory').and.returnValues(of(equipmentCategoryResponse));
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
      'financeBusinessUnitCode': 'JBT'
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
    spyOn(OptionalAttributeService.prototype, 'getOperationalServices').and.returnValues(of(response));
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
    spyOn(OptionalAttributeService.prototype, 'getServiceLevel').and.returnValues(of(response));
    const element = fixture.debugElement.query(By.css('[formControlName="businessUnit"]'));
    element.triggerEventHandler('onChange', {'value': [{
      chargeTypeBusinessUnitServiceOfferingAssociationID: null,
      financeBusinessUnitCode: 'DCS',
      financeBusinessUnitServiceOfferingAssociationID: 4,
      financeBusinessUnitServiceOfferingDisplayName: 'DCS - Backhaul',
      serviceOfferingDescription: 'Backhaul'
    }]});
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
    spyOn(OptionalAttributeService.prototype, 'getEquipmentType').and.returnValues(of(response));
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
    component.onEquipmentBlur(event, 'equipmentCategory');
    component.onEquipmentBlur(event, 'equipmentType');
    component.onEquipmentClear(event, 'equipmentCategory');
  });
  it('should call equipmentLength', () => {
    component.equipmentLength(equipmentResponseLength);
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
  it('should call getBusinessUnitServiceOffering', () => {
    const result = {
      _embedded: { serviceOfferingBusinessUnitTransitModeAssociations: [{
          financeBusinessUnitServiceOfferingAssociation: {
            financeBusinessUnitServiceOfferingAssociationID: 222,
            financeBusinessUnitCode: 'DCS',
            serviceOfferingCode: '',
            serviceOfferingDescription: 'abc',
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
    spyOn(rateAttributesService, 'getBusinessUnitServiceOffering').and.returnValue(Observable.create(obs => {
      obs.next(result);
    }));
    component.getBusinessUnitServiceOffering();
    expect(component.optionalAttributesModel.loading).toEqual(false);
  });
  it('should call onEquipmentBlur', () => {
    const event1: any = { target: { value: null}};
    const controlName1 = 'equipmentCategory';
    const controlName2 = 'requestedService';
    component.optionalAttributesModel.optionalForm.controls['equipmentCategory'].setValue('abc');
    component.optionalAttributesModel.optionalForm.controls['requestedService'].setValue('abc');
    component.onEquipmentBlur(event1, controlName1);
    expect(component.optionalAttributesModel.equipmentType.length).toEqual(0);
    component.onEquipmentBlur(event1, controlName2);
    expect(component.optionalAttributesModel.equipmentLength.length).toEqual(0);
  });
  it('should call onTypeEquipmentType', () => {
    component.optionalAttributesModel.equipmentType = [{label: 'abc', value: 'abc', id: 2}];
    const event1: any = {query: 'abc'};
    component.onTypeEquipmentType(event1);
    expect(component.optionalAttributesModel.equipmentTypeFiltered.length).toBeGreaterThan(0);
  });
  it('should call onTypeEquipmentLength', () => {
    component.optionalAttributesModel.equipmentLength = [{label: 'abc', value: 'abc', id: 2}];
    const event1: any = {query: 'abc'};
    component.onTypeEquipmentLength(event1);
    expect(component.optionalAttributesModel.equipmentLengthFiltered.length).toBeGreaterThan(0);
  });
  it('should call getEquipmentLength', () => {
    const event1: any = {value: 'abc'};
    const result = {
      _embedded: { equipmentClassificationTypeAssociations: [{equipmentClassificationTypeAssociationID: 123 }],
        equipmentDimensions: [{lengthQuantity: 1, unitOfLengthMeasurementCode: 'cm', equipmentDimensionId: 432},
          {lengthQuantity: 2, unitOfLengthMeasurementCode: 'cm', equipmentDimensionId: 432}]
      },
      _links: {}
    };
    spyOn(rateAttributesService, 'getEquipmentLength').and.returnValue(Observable.create(obs => {
      obs.next(result);
    }));
    component.getEquipmentLength(event1);
  });
  it('should call getOperationalService else', () => {
    component.getOperationalService();
    expect(component.optionalAttributesModel.operationalService.length).toEqual(0);
  });
  it ('should call onBusinessUnitSelected else', () => {
    component.optionalAttributesModel.optionalForm.get('businessUnit').setValue('JBI');
    const event1: any = {value: ''};
    component.onBusinessUnitSelected(event1);
    expect(component.optionalAttributesModel.businessUnitAdded).toEqual(false);
  });
  it('should call populateServiceLevel', () => {
    component.optionalAttributesModel.optionalForm.controls.serviceLevel.setValue([
      {label: 'abc', value: 'Standard'}, {label: 'def', value: 'Non-Standard'}]);
    const data1 = [{label: 'abc', value: 'Standard'}, {label: 'def', value: 'Non-Standard'}];
    component.populateServiceLevel(data1);
  });
  it('should call onServiceLevelSelected', () => {
    const event1: any = {value: 'abc'};
    component.onServiceLevelSelected(event1);
    expect(component.optionalAttributesModel.serviceLevelAdded).toEqual(true);
  });
  it('should call emitbuSo', () => {
    component.emitbuSo([1, 2, 3]);
  });
  it('should call onOperationalServiceSelected', () => {
    const event1: any = {value: 'abc'};
    component.onOperationalServiceSelected(event1);
    expect(component.optionalAttributesModel.operationalServiceAdded).toEqual(true);
    const event2: any = {value: ''};
    component.onOperationalServiceSelected(event2);
    expect(component.optionalAttributesModel.operationalServiceAdded).toEqual(false);
  });
  it('should call onBusinessUnitShow', () => {
    component.onBusinessUnitShow();
  });
  it('should call onCarrierCompleteMethod', () => {
    const event1: any = {query: 'abc'};
    component.onCarrierCompleteMethod(event1);
  });
  it('should take input chargeType', () => {
    component.chargeType = [{
    financeBusinessUnitServiceOfferingAssociationID: 55,
    serviceOfferingCode: 'abc',
    serviceOfferingDescription: 'abc',
    transitModeId: 44,
    transitModeCode: 'abc',
    transitModeDescription: 'abc',
    financeBusinessUnitCode: 'JBI'}];
  });
  it('should take input selectedChargeType', () => {
    component.selectedChargeType =  {label: 'abc',
      value: 12,
      description: 'abc'};
    expect(component.optionalAttributesModel.selectedChargeType).toBeDefined();
  });
});
