import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

import { StandardRateComponent } from './standard-rate.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from './../../../../app.module';
import { StandardModule } from '../../standard.module';
import { APP_BASE_HREF } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { StandardRateService } from './service/standard-rate.service';
import { StandardRateModel } from './model/standard-rate.model';

describe('StandardRateComponent', () => {
  let component: StandardRateComponent;
  let fixture: ComponentFixture<StandardRateComponent>;
  const router = {
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  };
  const messageservice: MessageService = new MessageService();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, AppModule, StandardModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, { provide: Router, useValue: router }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const stairRateDTO = {'accessorialRateTypeName': '1',
    'accessorialRateRoundingTypeName': '2',
    'minimumAmountDisplayName': '3',
    'maximumAmountDisplayName': '4',
    'accessorialMaximumRateApplyTypeName': '5',
    'customerAccessorialStairStepRates': [{'stairStepRateAmountDisplayName': 'a', 'fromQuantity': 1, 'toQuantity': 2}]
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onCreateRateSetup', () => {
    component.onCreateRateSetup();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/standard/rates');
  });

  it('should call toastMessage', () => {
    spyOn(messageservice, 'clear');
    spyOn(messageservice, 'add');
    component.toastMessage(messageservice, 'error', 'Error', 'message');
    expect(messageservice.clear).toHaveBeenCalled();
    expect(messageservice.add).toHaveBeenCalled();
  });

  it('should call searchGridRecords when null', () => {
    component.standardRateModel.dataFlag = true;
    component.standardRateModel.rateListValues = [];
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.class-jasmine-test'));
    element.triggerEventHandler('keyup', null);
    fixture.detectChanges();
    spyOn(component, 'getGridValues');
  });

  it('should call searchGridRecords when event and rateItemizeIndicator true', () => {
    component.standardRateModel.dataFlag = true;
    component.standardRateModel.rateListValues = [];
    component.standardRateModel.isSubscribeFlag = true;
    const response = {hits: { hits: [{
      _source: {
        chargeTypeName: '',
        effectiveDate: '',
        expirationDate: '',
        waived: '',
        rateSetupStatus: ''
      },
      inner_hits: {
        customerAccessorialRateChargeDTOs: {hits: { hits: [
          { _source: {
            accessorialRateTypeName: '',
            rateAmount: 123,
            rateItemizeIndicator: true
          }}
        ]}}
      }
    }], total: 1}};
    spyOn(StandardRateService.prototype, 'getRateData').and.returnValue(of(response));
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.class-jasmine-test'));
    element.triggerEventHandler('keyup', { target: { value: 'test' }, sortField: 'contract', sortOrder: 1 });
    fixture.detectChanges();
  });

  it('should call searchGridRecords when event and rateItemizeIndicator false', () => {
    component.standardRateModel.dataFlag = true;
    component.standardRateModel.rateListValues = [];
    component.standardRateModel.isSubscribeFlag = true;
    const response = {hits: { hits: [{
      _source: {
        chargeTypeName: '',
        effectiveDate: '',
        expirationDate: '',

      },
      inner_hits: {
        customerAccessorialRateChargeDTOs: {hits: { hits: [
          { _source: {
            accessorialRateTypeName: '',
            rateAmount: 123,
            rateItemizeIndicator: false
          }}
        ]}}
      }
    }], total: 1}};
    spyOn(StandardRateService.prototype, 'getRateData').and.returnValue(of(response));
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.class-jasmine-test'));
    element.triggerEventHandler('keyup', { target: { value: 'test' }, sortField: 'contract', sortOrder: 1 });
    fixture.detectChanges();
  });

  it('should call searchGridRecords when event and no source in customerAccessorialRateChargeDTOs', () => {
    component.standardRateModel.dataFlag = true;
    component.standardRateModel.rateListValues = [];
    component.standardRateModel.isSubscribeFlag = true;
    const response = {hits: { hits: [{
      _source: {
        chargeTypeName: '',
        effectiveDate: '',
        expirationDate: '',
        businessUnitServiceOfferingDTOs: null
      },
      inner_hits: {
        customerAccessorialRateChargeDTOs: {hits: { hits: [
          { _source: null }
        ]}}
      }
    }], total: 1}};
    spyOn(StandardRateService.prototype, 'getRateData').and.returnValue(of(response));
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.class-jasmine-test'));
    element.triggerEventHandler('keyup', { target: { value: 'test' }, sortField: 'contract', sortOrder: 1 });
    fixture.detectChanges();
  });

  it('should call searchGridRecords when event and no customerAccessorialRateChargeDTOs in innerhits', () => {
    component.standardRateModel.dataFlag = true;
    component.standardRateModel.rateListValues = [];
    component.standardRateModel.isSubscribeFlag = true;
    const response = {hits: { hits: [{
      _source: {
        chargeTypeName: '',
        effectiveDate: '',
        expirationDate: '',
        businessUnitServiceOfferingDTOs: [
          {
            businessUnit: 'bu', serviceLevel: 'sl'
          },
          {
            businessUnit: 'vs', serviceLevel: 'sl'
          }
        ],
        customerAccessorialRateAdditionalChargeDTOs: [
          { additionalChargeTypeName: 'name', additionalChargeCodeName: 'code', accessorialRateTypeName: 'type', rateAmount: 123}
        ],
        carrierDTOs: [
          { carrierName: 'name', carrierCode: 'code'}
        ],
        customerAccessorialRateAlternateChargeDTO: [
          { accessorialRateAlternateChargeQuantityTypeName: 'name', customerAlternateChargeThresholdQuantity: 123,
           alternateChargeTypeName: 'altname' }
        ]
      },
      inner_hits: {
        customerAccessorialRateChargeDTOs: {hits: { hits: null}}
      }
    }], total: 1}};
    spyOn(StandardRateService.prototype, 'getRateData').and.returnValue(of(response));
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.class-jasmine-test'));
    element.triggerEventHandler('keyup', { target: { value: 'test' }, sortField: 'contract', sortOrder: 1 });
    fixture.detectChanges();
  });

  it('should call searchGridRecords when event and empty response', () => {
    component.standardRateModel.dataFlag = true;
    component.standardRateModel.rateListValues = [];
    component.standardRateModel.isSubscribeFlag = true;
    const response = {hits: { hits: [], total: 1}};
    spyOn(StandardRateService.prototype, 'getRateData').and.returnValue(of(response));
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.class-jasmine-test'));
    element.triggerEventHandler('keyup', { target: { value: 'test'}, sortField: 'contract', sortOrder: 1 });
    fixture.detectChanges();
  });

  it('should call loadgriddata when event', () => {
    component.standardRateModel.rateListValues = [];
    component.standardRateModel.dataFlag = true;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.tableWrapper'));
    element.triggerEventHandler('onLazyLoad', { rows: 25, first: 0, sortField: 'rateType', sortOrder: 1});
    fixture.detectChanges();
 });

  it('should call loadgriddata when no event', () => {
    component.standardRateModel.rateListValues = [];
    component.standardRateModel.dataFlag = true;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.tableWrapper'));
    element.triggerEventHandler('onLazyLoad', null);
    fixture.detectChanges();
  });

  it('should call searchGridRecords when event and no inner hits', () => {
    component.standardRateModel.dataFlag = true;
    component.standardRateModel.rateListValues = [];
    component.standardRateModel.isSubscribeFlag = true;
    const response = {hits: { hits: [{
      _source: {
        chargeTypeName: '',
        effectiveDate: '',
        expirationDate: '',
        customerAccessorialRateChargeDTOs: [
          {
            accessorialRateTypeName: '',
            rateAmount: 123,
            rateItemizeIndicator: true
          }
        ]
      },
      inner_hits: {
      }
    }], total: 1}};
    spyOn(StandardRateService.prototype, 'getRateData').and.returnValue(of(response));
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.class-jasmine-test'));
    element.triggerEventHandler('keyup', { target: { value: 'test' }, sortField: 'contract', sortOrder: 1 });
    fixture.detectChanges();
  });

  it('should call searchGridRecords when event and no customerAccessorialRateChargeDTOS', () => {
    component.standardRateModel.dataFlag = true;
    component.standardRateModel.rateListValues = [];
    component.standardRateModel.isSubscribeFlag = true;
    const response = {hits: { hits: [{
      _source: {
        chargeTypeName: '',
        effectiveDate: '',
        expirationDate: '',
        customerAccessorialRateChargeDTOs: null
      },
      inner_hits: {
      }
    }], total: 1}};
    spyOn(StandardRateService.prototype, 'getRateData').and.returnValue(of(response));
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.class-jasmine-test'));
    element.triggerEventHandler('keyup', { target: { value: 'test' }, sortField: 'contract', sortOrder: 1 });
    fixture.detectChanges();
  });

  it('should call getGridValues when error having error message', () => {
    component.standardRateModel.dataFlag = true;
    component.standardRateModel.rateListValues = [];
    component.standardRateModel.isSubscribeFlag = true;
    const response = {
      error: {
        errors: [
          {
            errorMessage: 'Not found'
          }
        ]
      }
    };
    spyOn(StandardRateService.prototype, 'getRateData').and.returnValue(throwError(response));
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.class-jasmine-test'));
    element.triggerEventHandler('keyup', { target: { value: 'test' }, sortField: 'contract', sortOrder: 1 });
    fixture.detectChanges();
  });

  it('should call searchGridRecords when error having no error message', () => {
    component.standardRateModel.dataFlag = true;
    component.standardRateModel.rateListValues = [];
    component.standardRateModel.isSubscribeFlag = true;
    const response = {};
    spyOn(StandardRateService.prototype, 'getRateData').and.returnValue(throwError(response));
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.class-jasmine-test'));
    element.triggerEventHandler('keyup', { target: { value: 'test' }, sortField: 'contract', sortOrder: 1 });
    fixture.detectChanges();
  });
  it( 'should call commanStairStepFramer', () => {

    const rateObj = {
      'stepRateType': [],
      'stepRounding': [],
      'stepRateAmount': [],
      'stepMinimunAmount': [],
      'stepMaximunAmount': [],
      'maximumApplied': [],
      'fromQuantity': [],
      'toQuantity': []
    };
    component.commanStairStepFramer(stairRateDTO, rateObj);
  });
  it ('should populate rateObj with rateValues', () => {
    const rateObj = {
      'rateType': [],
      'rateAmount': [],
      'itemizedRates': [],
      'minimumAmount': [],
      'maximumAmount': [],
      'rounding': [],
      'rateOperator': []
    };
    const rateValues = {
      'rateItemizeIndicator': 1,
      'customerAccessorialRateCharges': [{'accessorialRateTypeName': 'a', 'rateAmountDisplayName': 'b'}]} ;
    spyOn(component, 'rateObjectFramer');
    component.rateFramer(rateValues, rateObj);
    expect(component.rateObjectFramer).toHaveBeenCalled();
  });
  it ('should populate stairRateDTO with rateValues', () => {
    const rateObj = {
      'stepRateAmount': [],
      'fromQuantity': [],
      'toQuantity': [],
      'stepItemizedRates': []
    };
    const rateValues = {
      'rateItemizeIndicator': 1,
      'customerAccessorialRateStairStepCharge': 'abc',
      'customerAccessorialStairRate': [{'accessorialRateTypeName': 'a', 'rateAmountDisplayName': 'b'}]} ;
    spyOn(component, 'commanStairStepFramer');
    component.stairStepFramer(rateValues, rateObj);
    expect(component.commanStairStepFramer).toHaveBeenCalled();
  });
  it ('should call additionalFramer', () => {
    const dataValues = [
      {'additionalChargeTypeName': 'qwerty', 'additionalChargeCodeName': 'abc', 'accessorialRateTypeName': 'def', 'rateAmount': '2'}
    ];
    component.additionalFramer(dataValues);
  });
  it ('should call rateObjectFramer', () => {
    const rateObj = {
      'rateType': [],
      'rateAmount': [],
      'itemizedRates': [],
      'minimumAmount': [],
      'maximumAmount': [],
      'rounding': [],
      'rateOperator': []
    };
    const dataVal = {'minimumAmountDisplayName': 'a',
      'maximumAmountDisplayName': 'b',
      'accessorialRateRoundingTypeName': 'c',
      'rateOperator': 'd'};

    component.rateObjectFramer(rateObj, dataVal);
  });
  it('should check string value', () => {
    const value = 'abc';
    spyOn(component, 'checkStringValue');
    component.checkStringValue(value);
    expect(component.checkStringValue).toHaveBeenCalled();
  });
  it('should check integer value', () => {
    const value =  0;
    spyOn(component, 'checkIntegerValue').and.callThrough();
    component.checkIntegerValue(value);
    expect(component.checkIntegerValue).toHaveBeenCalled();
  });
  it ('should populate businessArray', () => {
    const rateData = [{'businessUnit': 'serviceOffering'}, {'businessUnit': 'serviceOffering'}];

    component.businessFramer(rateData);
  });
  it ('should call serviceLevelFramer', () => {
    const data = [{'serviceLevel': 'a'}, {'serviceLevel': 'b'}];
    component.serviceLevelFramer(data);
  });
  it ('should call requestedServiceFramer', () => {
    const data = [{'requestedServiceTypeCode': 'a'}, {'requestedServiceTypeCode': 'b'}];
    component.requestedServiceFramer(data);
  });
  it ('should call carrierFramer', () => {
    const data = [{'carrierName': 'a'}, {'carrierName': 'b'}];
    component.carrierFramer(data);
  });
  it( 'should call commanStairStepFramer else', () => {
    const stairRateDTO1 = {
      'accessorialRateTypeName': '1',
      'accessorialRateRoundingTypeName': '2',
      'minimumAmountDisplayName': '3',
      'maximumAmountDisplayName': '4',
      'accessorialMaximumRateApplyTypeName': '5',
      'customerAccessorialStairStepRates': null
    };
    const rateObj = {
      'stepRateType': [],
      'stepRounding': [],
      'stepRateAmount': [],
      'stepMinimunAmount': [],
      'stepMaximunAmount': [],
      'maximumApplied': [],
      'fromQuantity': [],
      'toQuantity': []
    };
    component.commanStairStepFramer(stairRateDTO1, rateObj);
  });

  it ('should call itemizeFramer', () => {
    component.itemizeFramer('0');
    component.itemizeFramer('--');
  });

});
