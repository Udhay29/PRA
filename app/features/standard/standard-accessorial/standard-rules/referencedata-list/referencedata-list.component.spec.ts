import { StandardModule } from './../../../standard.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';

import { ReferencedataListComponent } from './referencedata-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReferencedataListService } from './service/referencedata-list.service';
import { of, throwError } from 'rxjs';

describe('ReferencedataListComponent', () => {
  let component: ReferencedataListComponent;
  let fixture: ComponentFixture<ReferencedataListComponent>;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });
  const eventRule = {
    'customerAccessorialFreeRuleQuantityLookUpDTOS': null,
    'customerAccessorialFreeRuleEventLookUpDTOS': [
      {
        'customerAccessorialFreeRuleConfigurationID': 512,
        'accessorialFreeRuleEventTypeID': 4,
        'accessorialFreeRuleTypeName': 'Outgate',
        'accessorialFreeRuleEventTimeframeTypeID': 2,
        'accessorialFreeRuleEventTimeFrameTypeName': 'Day of Event and Day After',
        'dayOfEventFreeRuleModifierID': 3,
        'accessorialDayOfEventFreeRuleModifierName': 'Day Free if Event Time Before',
        'dayOfEventFreeRuleModifierTime': '1970-01-01 12:39:53.0',
        'dayAfterEventFreeRuleModifierID': 3,
        'accessorialDayAfterEventFreeRuleModifierName': 'Day Free if Event Time Before',
        'dayAfterEventFreeRuleModifierTime': '1970-01-01 12:39:59.0',
        'effectiveDate': '2019-07-22',
        'expirationDate': '2099-12-31'
      }
    ],
    'accessorialFreeRuleTypeId': 2,
    'accessorialFreeRuleTypeName': 'Event'
  };
  const quantityRule = {
    'customerAccessorialFreeRuleQuantityLookUpDTOS':  [
      {
        'accessorialFreeRuleQuantityTypeId': 1,
        'accessorialFreeRuleQuantityTypeName': 'TIme',
        'freeRuleQuantityDistanceTypeId': null,
        'freeRuleQuantityDistanceTypeCode': null,
        'freeRuleQuantityTimeTypeId': null,
        'freeRuleQuantityTimeTypeCode': null,
        'accessorialFreeQuantity': 455,
        'requestedDeliveryDateIndicator': 'N',
        'customerAccessorialFreeRuleConfigurationID': 512
      }
    ],
    'customerAccessorialFreeRuleEventLookUpDTOS': null,
    'accessorialFreeRuleTypeId': 3,
    'accessorialFreeRuleTypeName': 'Quantity'
  };
  const referenceGridParams = {
    'customerChargeName': null,
    'customerAgreementId': '48',
    'accessorialDocumentTypeId': 1,
    'equipmentLengthId': null,
    'equipmentLengthDescription': null,
    'equipmentTypeId': null,
    'customerAccessorialAccountDTOs': [
    ],
    'businessUnitServiceOfferingDTOs': null,
    'requestServiceDTOs': null,
    'carrierDTOs': null,
    'effectiveDate': '2019-07-23',
    'expirationDate': '2099-12-31',
    'level': 12,
    'chargeTypeId': 64,
    'chargeTypeName': 'Administration Fee (ADMIN)',
    'currencyCode': null,
    'equipmentCategoryCode': null,
    'equipmentTypeCode': null,
    'accessorialFreeRuleTypes': [
      {
        'accessorialFreeRuleTypeId': 3,
        'accessorialFreeRuleTypeName': 'Quantity',
        'accessorialFreeRuleQuantityType': {
          'accessorialFreeRuleQuantityTypeId': null,
          'accessorialFreeRuleQuantityTypeName': null,
          'freeRuleQuantityDistanceTypeId': null,
          'freeRuleQuantityDistanceTypeCode': null,
          'freeRuleQuantityTimeTypeId': null,
          'freeRuleQuantityTimeTypeCode': null,
          'accessorialFreeQuantity': null,
          'requestedDeliveryDateIndicator': 'N'
        }
      }
    ],
    'accessorialEquipmentLengthDescription': null,
    'accessorialEquipmentLength': null,
    'accessorialRuleType': 'Free',
    'docLegalDescription': null,
    'docInstructionalDescription': null,
    'docFileNames': []
  };
  const agreementId = '12';
  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencedataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call parseReferenceGridParams Event Rule', () => {
    component.referenceModel.referenceGridRequest = referenceGridParams;
    component.agreementID = agreementId;
    component.referenceModel.dateFormat = 'MM/DD/YYYY';
    spyOn(ReferencedataListService.prototype, 'loadReferenceData').and.returnValue(of(eventRule));
    component.parseReferenceGridParams();
  });

  it('should call parseReferenceGridParams quantity Rule', () => {
    component.referenceModel.referenceGridRequest = referenceGridParams;
    component.referenceModel.dateFormat = 'MM/DD/YYYY';
    component.agreementID = agreementId;
    spyOn(ReferencedataListService.prototype, 'loadReferenceData').and.returnValue(of(quantityRule));
    component.getReferenceListData();
  });

  it('should call getReferenceListData when error', () => {
    spyOn(ReferencedataListService.prototype, 'loadReferenceData').and.returnValue(throwError({}));
    component.getReferenceListData();
  });

  it('should call handleError', () => {
    component.handleError({ message: 'Error', name: '' }, '');
  });

});
