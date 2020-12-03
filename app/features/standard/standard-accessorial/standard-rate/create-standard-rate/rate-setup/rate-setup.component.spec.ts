import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from './../../../../../../app.module';
import { StandardModule } from '../../../../standard.module';
import { APP_BASE_HREF } from '@angular/common';
import { RateSetupComponent } from './rate-setup.component';
import { CreateStandardRateService } from '../service/create-standard-rate.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';

describe('CreateStandardDocumentationComponent', () => {
  let component: RateSetupComponent;
  let fixture: ComponentFixture<RateSetupComponent>;
  let createRateService: CreateStandardRateService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      declarations: [],
      providers: [CreateStandardRateService, { provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
      fixture = TestBed.createComponent(RateSetupComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      createRateService = TestBed.get(CreateStandardRateService);
  });
  const ChargeCodeResponse = [
    {
      'chargeTypeID': 42,
      'chargeTypeCode': 'BOBTAIL',
      'chargeTypeName': 'Bobtail',
      'chargeTypeDescription': null,
      'chargeTypeBusinessUnitServiceOfferingAssociations': [
        {
          'chargeTypeBusinessUnitServiceOfferingAssociationID': 536,
          'chargeTypeID': null,
          'financeBusinessUnitServiceOfferingAssociation': {
            'financeBusinessUnitServiceOfferingAssociationID': 4,
            'financeBusinessUnitCode': 'DCS',
            'serviceOfferingCode': 'Backhaul'
          },
          'financeChargeUsageTypeID': 1,
          'effectiveDate': '2018-12-01',
          'expirationDate': '2099-12-31'
        }
      ]
    }
  ];
  const groupNameResponse = {
    '_embedded': {
        'accessorialGroupTypes': [
            {
                '@id': 1,
                'createTimestamp': '2019-06-18T01:02:28.3632436',
                'createProgramName': 'SSIS',
                'lastUpdateProgramName': 'SSIS',
                'createUserId': 'PIDNEXT',
                'lastUpdateUserId': 'PIDNEXT',
                'accessorialGroupTypeId': 1,
                'accessorialGroupTypeName': 'Standard',
                'defaultIndicator': 'Y',
                'effectiveDate': '2019-06-18',
                'expirationDate': '2099-12-31',
                'lastUpdateTimestampString': '2019-06-18T01:02:28.3632436',
                '_links': {
                    'self': {
                        'href': ''
                    },
                    'accessorialGroupType': {
                        'href': ''
                    }
                }
            }
        ]
    },
    '_links': {
        'self': {
            'href': '',
            'templated': true
        },
        'profile': {
            'href': ''
        }
    },
    'page': {
        'size': 20,
        'totalElements': 3,
        'totalPages': 1,
        'number': 0
    }
};
  const superUserDateResponse = {
    '_embedded' : {
      'configurationParameterDetails' : [ {
        'configurationParameter': {},
        'configurationParameterDetailID': 1,
        'configurationParameterValue': 'test'
      } ]
    }
};

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call ngOnInit', () => {
    spyOn(CreateStandardRateService.prototype, 'getChargeTypes').and.returnValues(of(ChargeCodeResponse));
    spyOn(CreateStandardRateService.prototype, 'getCurrencyCodes').and.returnValues(of([ 'CAD', 'USD' ]));
    spyOn(CreateStandardRateService.prototype, 'getSuperUserBackDate').and.returnValues(of(superUserDateResponse));
    component.ngOnInit();
  });
  it('should call onTypeChargeCode', () => {
    const response = [
      {
        label: 'BOBTAIL',
        value: 1,
        description: 'BOBTAIL'
      }
    ];
    component.createRatesModel.chargeType = response;
    const element = fixture.debugElement.query(By.css('[formControlName="chargeType"]'));
    element.triggerEventHandler('completeMethod', {'query': 'c'});
    element.triggerEventHandler('onSelect', {'value': 42});
    element.triggerEventHandler('input', {'target': {'value': null}});
  });
  it('should call onTypeCurrencyType', () => {
    component.createRatesModel.currencyCodes = [{label: 'USD',
      value: 'USD'}];
    const element = fixture.debugElement.query(By.css('[formControlName="currency"]'));
    element.triggerEventHandler('completeMethod', {'query': 'c'});
    component.createRatesModel.setUpForm.controls['currency'].setValue('USD');
    element.triggerEventHandler('onBlur', {'target': {'value': ''}});
  });
  it('should call onCalulateRateManuallyChecked', () => {
    component.onWaivedCheckboxSelect(true);
    component.onWaivedCheckboxSelect(false);
    component.onCalulateRateManuallyChecked(true);
    component.onPassThroughChecked(true);
  });
  it('should call onDateSelected', () => {
    component.onDateSelected(new Date('05/25/2019'), 'expirationDate');
    component.onDateSelected(new Date('05/25/2019'), 'effectiveDate');

  });
  it('should call typedDateValidate', () => {
    const event = {srcElement: {value: '05/30/2019'}};
    component.typedDateValidate(event, 'effectiveDate');
    component.typedDateValidate(event, 'expirationDate');
  });
  it('should call getGroupNames', () => {
    spyOn(CreateStandardRateService.prototype, 'getGroupNames').and.returnValues(of(groupNameResponse));
    component.getGroupNames();
  });
  it('should call onTypeGroupName', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="groupName"]'));
    element.triggerEventHandler('completeMethod', { value: 'ab' });
  });
  it('should call onAutoCompleteBlur', () => {
    const obj: any = { 'target': { 'value': '' } };
    component.onautoCompleteBlur(obj, 'groupName');
  });
});
