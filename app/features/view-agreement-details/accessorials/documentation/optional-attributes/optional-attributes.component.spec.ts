import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';
import { ViewAgreementDetailsModule } from '../../../view-agreement-details.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OptionalAttributesComponent } from './optional-attributes.component';
import { OptionalAttributesService } from '../../shared/services/optional-attributes.service';
import { of } from 'rxjs';
import { OptionalUtilityService } from '../../shared/services/optional-utility.service';
import { By } from '@angular/platform-browser';
import { OptionalAttributesModel } from '../../shared/models/optional-attributes.model';

describe('OptionalAttributesComponent', () => {
  let component: OptionalAttributesComponent;
  let fixture: ComponentFixture<OptionalAttributesComponent>;
  let rateAttributesService: OptionalAttributesService;
  let utilityService: OptionalUtilityService;
  let chargeTypeResponse;
  let businessUnitServiceOfferingResponse;
  let processedCarrierDetailsResponse;
  let equipmentCategoryResponse;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [OptionalAttributesService, { provide: APP_BASE_HREF, useValue: '/' }, OptionalUtilityService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionalAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    rateAttributesService = TestBed.get(OptionalAttributesService);
    utilityService = TestBed.get(OptionalUtilityService);
    chargeTypeResponse = [{
      'chargeTypeID': 98,
      'chargeTypeCode': 'BLOCKBRACE',
      'chargeTypeName': 'Blocking and Bracing',
      'chargeTypeDescription': 'Charge to secure',
      'chargeTypeBusinessUnitServiceOfferingAssociations': [{
        'chargeTypeBusinessUnitServiceOfferingAssociationID': 686,
        'chargeTypeID': null,
        'financeBusinessUnitServiceOfferingAssociation': {
          'financeBusinessUnitServiceOfferingAssociationID': 4,
          'financeBusinessUnitCode': 'DCS',
          'serviceOfferingCode': 'Backhaul'
        },
        'financeChargeUsageTypeID': 1,
        'effectiveDate': '2018-11-01',
        'expirationDate': '2099-12-31'
      }]
    }];
    businessUnitServiceOfferingResponse = {
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
    spyOn(OptionalAttributesService.prototype, 'getChargeTypes').and.returnValues(of(chargeTypeResponse));
    spyOn(OptionalAttributesService.prototype, 'getCarrierData').and.returnValues(of(processedCarrierDetailsResponse));
    spyOn(OptionalAttributesService.prototype, 'getEquipmentCategory').and.returnValues(of(equipmentCategoryResponse));
    component.ngOnInit();
  });

  it('should call onTypeChargeCode when no data', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="chargeType"]'));
    element.triggerEventHandler('completeMethod', { 'value': {} });
    element.triggerEventHandler('onSelect', { 'value': {} });
  });

  it('should call onTypeChargeCode', () => {
    component.optionalAttributesModel.chargeType = [{
      label: 'string',
      value: 123,
      description: 'string'
    }];
    const element = fixture.debugElement.query(By.css('[formControlName="chargeType"]'));
    element.triggerEventHandler('completeMethod', { 'value': {} });
    element.triggerEventHandler('onSelect', { 'value': {} });
  });

  it('should call getBusinessUnitBasedOnChargeCode', () => {
    const response = {
      'financeBusinessUnitServiceOfferingAssociation': {
        'financeBusinessUnitServiceOfferingAssociationID': 1,
        'financeBusinessUnitCode': 'test',
        'serviceOfferingCode': 'test',
        'serviceOfferingDescription': 'test',
        'effectiveTimestamp': 'string',
        'expirationTimestamp': 'test',
        'lastUpdateTimestampString': 'test'
      },
      'transitMode': 'test',
      'utilizationClassification': 'test',
      'freightShippingType': 'test',
      'lastUpdateTimestampString': 'string',
      '_links': {}
    };
    component.getBusinessUnitBasedOnChargeCode(response);
  });

  it('should call onTypeEquipmentLength', () => {
    component.optionalAttributesModel.equipmentLength = null;
    const element = fixture.debugElement.query(By.css('[formControlName="equipmentLength"]'));
    element.triggerEventHandler('completeMethod', { 'query': 'test' });
  });

  it('should call onTypeEquipmentLength for if', () => {
    component.optionalAttributesModel.equipmentLength = [{
      label: 'label',
      value: 'value',
      id: 123,
      lengthDescription: 'desc'
    }];
    const element = fixture.debugElement.query(By.css('[formControlName="equipmentLength"]'));
    element.triggerEventHandler('completeMethod', { 'query': 'test' });
  });

  it('should call onTypeEquipmentLength for nested if', () => {
    component.optionalAttributesModel.equipmentLength = [{
      label: 'label',
      value: 'value',
      id: 123,
      lengthDescription: 'desc'
    }];
    const element = fixture.debugElement.query(By.css('[formControlName="equipmentLength"]'));
    element.triggerEventHandler('completeMethod', { 'query': 'label' });
  });

  it('should call onCarrierCompleteMethod', () => {
    component.optionalAttributesModel.carriersList = null;
    const element = fixture.debugElement.query(By.css('[formControlName="carriers"]'));
    element.triggerEventHandler('completeMethod', { 'query': 'test' });
  });

  it('should call onCarrierCompleteMethod for if', () => {
    component.optionalAttributesModel.carriersList = [
      {
        label: 'label',
        value: {
          code: 'code',
          id: 123,
          name: 'name'
        }
      }
    ];
    const element = fixture.debugElement.query(By.css('[formControlName="carriers"]'));
    element.triggerEventHandler('completeMethod', { 'query': 'test' });
  });

  it('should call onCarrierCompleteMethod for nested if', () => {
    component.optionalAttributesModel.carriersList = [
      {
        label: 'test',
        value: {
          code: 'code',
          id: 123,
          name: 'name'
        }
      }
    ];
    const element = fixture.debugElement.query(By.css('[formControlName="carriers"]'));
    element.triggerEventHandler('completeMethod', { 'query': 'test' });
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
    component.optionalAttributesModel.optionalForm.controls['businessUnit'].setValue(
      [{ financeBusinessUnitServiceOfferingDisplayName: 'DCS' }]);
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
    const element = fixture.debugElement.query(By.css('[formControlName="businessUnit"]'));
    element.triggerEventHandler('onChange', {
      'value': {
        'financeBusinessUnitCode': 'DCS',
        'financeBusinessUnitServiceOfferingAssociationID': 4,
        'financeBusinessUnitServiceOfferingDisplayName': 'DCS - Backhaul',
        'serviceOfferingCode': 'Backhaul'
      }
    });
    element.triggerEventHandler('onChange', { 'value': null });
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
    spyOn(OptionalAttributesService.prototype, 'getEquipmentType').and.returnValues(of(response));
    const element = fixture.debugElement.query(By.css('[formControlName="equipmentCategory"]'));
    element.triggerEventHandler('onSelect', { eventValue });
    element.triggerEventHandler('completeMethod', { eventValue });
  });

  it('should call onTypeEquipmentCategory when data', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="equipmentCategory"]'));
    const eventValue = {
      'value': {
        'label': 'Container',
        'value': 'Container'
      }
    };
    component.optionalAttributesModel.equipmentCategory = [{
      label: 'test',
      value: 'test'
    }];
    element.triggerEventHandler('completeMethod', { eventValue });
    fixture.detectChanges();
  });

  it('should call onSelectEquipmentType', () => {
    const response = {
      '_embedded': {
        'equipmentRequirementSpecificationAssociations': [{
          'equipmentRequirementSpecificationAssociationID': 28,
          'equipmentRequirementType': {
            'equipmentRequirementTypeCode': 'Length',
            'equipmentRequirementTypeDescription': 'Length Requirement',
            'effectiveTimestamp': null,
            'expirationTimestamp': null,
            'lastUpdateTimestampString': null
          },
          'equipmentRequirementSpecification': {
            'equipmentRequirementSpecificationCode': '28Ft',
            'equipmentRequirementSpecificationDescription': '28 Feet In Length',
            'effectiveTimestamp': null,
            'expirationTimestamp': null,
            'lastUpdateTimestampString': null
          },
          'effectiveTimestamp': null,
          'expirationTimestamp': null,
          'equipmentRequirementSpecificationDetail': null,
          'lastUpdateTimestampString': null,
          '_links': {}
        }]
      },
      '_links': {}
    };
    spyOn(OptionalAttributesService.prototype, 'getEquipmentLength').and.returnValues(of(response));
    const element = fixture.debugElement.query(By.css('[formControlName="equipmentType"]'));
    element.triggerEventHandler('onSelect', {
      'id': {
        'id': 2,
        'label': 'Intermodal',
        'value': 'Intermodal'
      }
    });
  });

  it('should call onServiceLevelSelected', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="serviceLevel"]'));
    element.triggerEventHandler('onChange', { 'value': {} });
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
    spyOn(OptionalAttributesService.prototype, 'getBUbasedOnChargeType').and.returnValues(of(response));
    const element = fixture.debugElement.query(By.css('[formControlName="chargeType"]'));
    element.triggerEventHandler('onSelect', { 'value': 10 });
    component.onUnSelectChargeCode(10);
  });
  it('should call onOperationalServiceSelected', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="requestedService"]'));
    element.triggerEventHandler('onChange', { 'value': 'test' });
  });
  it('should call onServiceLevelSelected', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="serviceLevel"]'));
    element.triggerEventHandler('onChange', { 'value': 'test' });
  });
  it('should call onEquipmentBlur', () => {
    component.optionalAttributesModel.optionalForm.controls['equipmentType'].setValue('test');
    const element = fixture.debugElement.query(By.css('[formControlName="equipmentType"]'));
    element.triggerEventHandler('onBlur', { 'target': { 'value': 'test' } });
  });
  it('should call onEquipmentBlur', () => {
    component.optionalAttributesModel.optionalForm.controls['equipmentCategory'].setValue('test');
    const element = fixture.debugElement.query(By.css('[formControlName="equipmentCategory"]'));
    element.triggerEventHandler('onBlur', { 'target': { 'value': 'test' } });
  });

  it('it should cal onSelectChargeCode', () => {
    spyOn(OptionalAttributesService.prototype, 'getBUbasedOnChargeType').and.returnValue(of([]));
    const element = fixture.debugElement.query(By.css('[formControlName="chargeType"]'));
    element.triggerEventHandler('onSelect', { value: '' });
  });


  it('should call optionalutilityservice.onTypeEquipmentType for else', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="equipmentType"]'));
    element.triggerEventHandler('completeMethod', { 'query': 'test' });
  });

  it('should call optionalutilityservice.onTypeEquipmentType for nested if', () => {
    component.optionalAttributesModel.equipmentType = [
      { label: 'test', value: 'value' }
    ];
    const element = fixture.debugElement.query(By.css('[formControlName="equipmentType"]'));
    element.triggerEventHandler('completeMethod', { 'query': 'test' });
  });

  it('should call optionalutilityservice.onTypeEquipmentType for if', () => {
    component.optionalAttributesModel.equipmentType = [
      { label: 'test', value: 'value' }
    ];
    const element = fixture.debugElement.query(By.css('[formControlName="equipmentType"]'));
    element.triggerEventHandler('completeMethod', { 'query': 'test1' });
  });

});
