import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from './../../../../../../app.module';
import { StandardModule } from '../../../../standard.module';
import { APP_BASE_HREF } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { StandardOptionalAttributesComponent } from './standard-optional-attributes.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StandardOptionalAttributesService } from '../../../service/standard-optional-attributes.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { StandardOptionalUtilityService } from '../../../service/standard-optional-utility.service';
import { configureTestSuite } from 'ng-bullet';



describe('StandardOptionalAttributesComponent', () => {
  let component: StandardOptionalAttributesComponent;
  let fixture: ComponentFixture<StandardOptionalAttributesComponent>;
  let standardAttributesService: StandardOptionalAttributesService;
  let utilityService: StandardOptionalUtilityService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      declarations: [],
      providers: [StandardOptionalAttributesService, StandardOptionalUtilityService, { provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardOptionalAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    standardAttributesService = TestBed.get(StandardOptionalAttributesService);
    utilityService = TestBed.get(StandardOptionalUtilityService);
  });
  const chargeTypeResponse = [ {
    'chargeTypeID' : 98,
    'chargeTypeCode' : 'BLOCKBRACE',
    'chargeTypeName' : 'Blocking and Bracing',
    'chargeTypeDescription' : 'Charge to secure',
    'chargeTypeBusinessUnitServiceOfferingAssociations' : [ {
      'chargeTypeBusinessUnitServiceOfferingAssociationID' : 686,
      'chargeTypeID' : null,
      'financeBusinessUnitServiceOfferingAssociation' : {
        'financeBusinessUnitServiceOfferingAssociationID' : 4,
        'financeBusinessUnitCode' : 'DCS',
        'serviceOfferingCode' : 'Backhaul'
      },
      'financeChargeUsageTypeID' : 1,
      'effectiveDate' : '2018-11-01',
      'expirationDate' : '2099-12-31'
    } ]
  } ];
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
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call ngOnInit', () => {
    spyOn(StandardOptionalAttributesService.prototype, 'getBusinessUnitServiceOffering').and
    .returnValues(of(businessUnitServiceOfferingResponse));
    spyOn(StandardOptionalAttributesService.prototype, 'getChargeTypes').and.returnValues(of(chargeTypeResponse));
    spyOn(StandardOptionalAttributesService.prototype, 'getCarrierData').and.returnValues(of(processedCarrierDetailsResponse));
    spyOn(StandardOptionalAttributesService.prototype, 'getEquipmentCategory').and.returnValues(of(equipmentCategoryResponse));
    component.ngOnInit();
  });
  it('should call ngOnInit empty service response', () => {
    spyOn(StandardOptionalAttributesService.prototype, 'getBusinessUnitServiceOffering').and
    .returnValues(of(businessUnitServiceOfferingResponse));
    spyOn(StandardOptionalAttributesService.prototype, 'getChargeTypes').and.returnValues(of([]));
    spyOn(StandardOptionalAttributesService.prototype, 'getCarrierData').and.returnValues(of([]));
    spyOn(StandardOptionalAttributesService.prototype, 'getEquipmentCategory').and.returnValues(of([]));
    component.ngOnInit();
  });
  it('should call onTypeChargeCode', () => {
    spyOn(StandardOptionalUtilityService.prototype, 'onTypeChargeValue');
    const element = fixture.debugElement.query(By.css('[formControlName="chargeType"]'));
    element.triggerEventHandler('completeMethod', {'value': {}});
    element.triggerEventHandler('onSelect', {'value': {}});
  });
  it('should call getBusinessUnitServiceOfferingList', () => {
    component.getBusinessUnitServiceOfferingList([]);
  });
  it('should call getBusinessUnitBasedOnChargeCode', () => {
    const response = [
      {
        'financeBusinessUnitServiceOfferingAssociationID': 1,
        'serviceOfferingCode': 'OTR',
        'serviceOfferingDescription': 'Over The Road',
        'transitModeId': null,
        'transitModeCode': null,
        'transitModeDescription': null,
        'financeBusinessUnitCode': 'JBT',
        'chargeTypeBusinessUnitServiceOfferingAssociationID': 692
      }
    ];
    spyOn(StandardOptionalAttributesService.prototype, 'getBUbasedOnChargeType').and.returnValues(of(response));
    component.getBUbasedOnChargeType('98');
  });
  it('should call onTypeEquipmentLength', () => {
    spyOn(StandardOptionalUtilityService.prototype, 'onTypeEquipmentLength');
    const element = fixture.debugElement.query(By.css('[formControlName="equipmentLength"]'));
    element.triggerEventHandler('completeMethod', {'query': {}});
  });

  it('should call onCarrierCompleteMethod', () => {
    spyOn(StandardOptionalUtilityService.prototype, 'onTypeCarrierValue');
    const element = fixture.debugElement.query(By.css('[formControlName="carriers"]'));
    element.triggerEventHandler('completeMethod', {'query': {}});
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
          'serviceOfferingCodeList': ['JBI Backhaul'],
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
    component.standardOptionalAttributesModel.optionalForm.controls['businessUnit'].setValue(
      [{financeBusinessUnitServiceOfferingDisplayName: 'DCS'}]);
    spyOn(StandardOptionalAttributesService.prototype, 'getOperationalServices').and.returnValues(of(response));
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
    spyOn(StandardOptionalAttributesService.prototype, 'getServiceLevel').and.returnValues(of(response));
    component.standardOptionalAttributesModel.optionalForm.get('businessUnit').setValue(['ICS']);
    const element = fixture.debugElement.query(By.css('[formControlName="businessUnit"]'));
    element.triggerEventHandler('onChange', {'value': {
      'financeBusinessUnitCode': 'DCS',
      'financeBusinessUnitServiceOfferingAssociationID': 4,
      'financeBusinessUnitServiceOfferingDisplayName': 'DCS - Backhaul',
      'serviceOfferingCode': 'Backhaul'
    }});
element.triggerEventHandler('onChange', {'value': null});
  });
  it('should call onBusinessUnitSelected', () => {
    const response = {};
    spyOn(StandardOptionalAttributesService.prototype, 'getServiceLevel').and.returnValues(of(response));
    component.standardOptionalAttributesModel.optionalForm.get('businessUnit').setValue(['ICS']);
    const event = [{
      financeBusinessUnitServiceOfferingAssociationID: 123,
      serviceOfferingCode: '123',
      serviceOfferingDescription: 'string',
      transitModeId: 123,
      transitModeCode: '123',
      transitModeDescription: 'string',
      financeBusinessUnitCode: '123'
    }];
    const element = fixture.debugElement.query(By.css('[formControlName="businessUnit"]'));
element.triggerEventHandler('onChange', event);
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
    const eventValue = {
      'value': {
        'label': 'Container',
        'value': 'Container'
      }
    };
    spyOn(StandardOptionalUtilityService.prototype, 'onTypeEquipmentCategory');
    spyOn(StandardOptionalAttributesService.prototype, 'getEquipmentType').and.returnValues(of(response));
    const element = fixture.debugElement.query(By.css('[formControlName="equipmentCategory"]'));
    element.triggerEventHandler('onSelect', {eventValue});
    element.triggerEventHandler('completeMethod', {eventValue});
  });
  it('should call onSelectEquipmentCategory', () => {
    const response = {};
    const eventValue = {
      'value': {
        'label': 'Container',
        'value': 'Container'
      }
    };
    spyOn(StandardOptionalUtilityService.prototype, 'onTypeEquipmentCategory');
    spyOn(StandardOptionalAttributesService.prototype, 'getEquipmentType').and.returnValues(of(response));
    const element = fixture.debugElement.query(By.css('[formControlName="equipmentCategory"]'));
    element.triggerEventHandler('onSelect', {eventValue});
    element.triggerEventHandler('completeMethod', {eventValue});
  });

  it('should call onSelectEquipmentType', () => {
    const response = {
      '_embedded' : {
        'equipmentRequirementSpecificationAssociations' : [ {
          'equipmentRequirementSpecificationAssociationID' : 28,
          'equipmentRequirementType' : {
            'equipmentRequirementTypeCode' : 'Length',
            'equipmentRequirementTypeDescription' : 'Length Requirement',
            'effectiveTimestamp' : null,
            'expirationTimestamp' : null,
            'lastUpdateTimestampString' : null
          },
          'equipmentRequirementSpecification' : {
            'equipmentRequirementSpecificationCode' : '28Ft',
            'equipmentRequirementSpecificationDescription' : '28 Feet In Length',
            'effectiveTimestamp' : null,
            'expirationTimestamp' : null,
            'lastUpdateTimestampString' : null
          },
          'effectiveTimestamp' : null,
          'expirationTimestamp' : null,
          'equipmentRequirementSpecificationDetail' : null,
          'lastUpdateTimestampString' : null,
          '_links' : {}
        } ]
      },
      '_links' : {}
    };
    spyOn(StandardOptionalAttributesService.prototype, 'getEquipmentLength').and.returnValues(of(response));
    const element = fixture.debugElement.query(By.css('[formControlName="equipmentType"]'));
    element.triggerEventHandler('onSelect', {'id': {
      'id': 2,
      'label': 'Intermodal',
      'value': 'Intermodal'
    }});
  });
  it('should call onSelectEquipmentType', () => {
    const response = {};
    spyOn(StandardOptionalAttributesService.prototype, 'getEquipmentLength').and.returnValues(of(response));
    const element = fixture.debugElement.query(By.css('[formControlName="equipmentType"]'));
    element.triggerEventHandler('onSelect', {'id': {
      'id': 2,
      'label': 'Intermodal',
      'value': 'Intermodal'
    }});
  });
  it('should call onServiceLevelSelected', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="serviceLevel"]'));
    element.triggerEventHandler('onChange', {'value': {}});
  });
  it('should call onSelect/UnselectChargeCode', () => {
    const response = [{
      financeBusinessUnitServiceOfferingAssociationID: 1,
      serviceOfferingCode: 'string',
      serviceOfferingDescription: 'string',
      transitModeId: 1,
      transitModeCode: 'string',
      transitModeDescription: 'string',
      financeBusinessUnitCode: 'string',
      chargeTypeBusinessUnitServiceOfferingAssociationID: 1
    }];
    spyOn(StandardOptionalAttributesService.prototype, 'getBUbasedOnChargeType').and.returnValues(of(response));
    const element = fixture.debugElement.query(By.css('[formControlName="chargeType"]'));
    element.triggerEventHandler('onSelect', { 'value': 10 });
    component.onUnSelectChargeType(10);
  });
  it('should call UnselectChargeCode else case', () => {
    const response = [{
      financeBusinessUnitServiceOfferingAssociationID: 1,
      serviceOfferingCode: 'string',
      serviceOfferingDescription: 'string',
      transitModeId: 1,
      transitModeCode: 'string',
      transitModeDescription: 'string',
      financeBusinessUnitCode: 'string',
      chargeTypeBusinessUnitServiceOfferingAssociationID: 1
    }];
    spyOn(StandardOptionalAttributesService.prototype, 'getBUbasedOnChargeType').and.returnValues(of(response));
    const element = fixture.debugElement.query(By.css('[formControlName="chargeType"]'));
    element.triggerEventHandler('onSelect', { 'value': 10 });
    component.standardOptionalAttributesModel.chargeTypeList = [];
    component.onUnSelectChargeType(10);
  });
  it('should call onOperationalServiceSelected', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="requestedService"]'));
    element.triggerEventHandler('onChange', { 'value': 'test' });
    element.triggerEventHandler('onChange', { 'value': {} });
  });
  it('should call onServiceLevelSelected', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="serviceLevel"]'));
    element.triggerEventHandler('onChange', { 'value': 'test' });
  });
  it('should call onEquipmentBlur inner else', () => {
    component.standardOptionalAttributesModel.optionalForm.controls['equipmentType'].setValue('test');
    const element = fixture.debugElement.query(By.css('[formControlName="equipmentType"]'));
    element.triggerEventHandler('onBlur', { 'target': {'value': false} });
  });
  it('should call onEquipmentBlur', () => {
    component.standardOptionalAttributesModel.optionalForm.controls['equipmentCategory'].setValue('test');
    const element = fixture.debugElement.query(By.css('[formControlName="equipmentCategory"]'));
    element.triggerEventHandler('onBlur', { 'target': {'value': false} });
  });
  it('should call onEquipmentBlur else', () => {
    component.standardOptionalAttributesModel.optionalForm.controls['equipmentCategory'].setValue('test');
    const element = fixture.debugElement.query(By.css('[formControlName="equipmentCategory"]'));
    element.triggerEventHandler('onBlur', { 'target': {'value': true} });
  });

});
