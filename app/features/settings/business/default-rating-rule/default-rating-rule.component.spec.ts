import { FormBuilder, Validators } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { of, throwError } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../app.module';
import { SettingsModule } from './../../settings.module';
import { DefaultRatingRuleComponent } from './default-rating-rule.component';
import { DefaultRatingRuleService } from './service/default-rating-rule.service';
import { CanDeactivateGuardService } from '../../../../shared/jbh-app-services/can-deactivate-guard.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

describe('DefaultRatingRuleComponent', () => {
  let component: DefaultRatingRuleComponent;
  let fixture: ComponentFixture<DefaultRatingRuleComponent>;
  let service: DefaultRatingRuleService;
  let canDeactivateGuardService: CanDeactivateGuardService;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;
  let nextState: RouterStateSnapshot;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, DefaultRatingRuleService, CanDeactivateGuardService,
      { provide: RouterStateSnapshot, useValue: DefaultRatingRuleComponent },
      { provide: ActivatedRouteSnapshot, useValue: DefaultRatingRuleComponent }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultRatingRuleComponent);
    component = fixture.componentInstance;
    service = TestBed.get(DefaultRatingRuleService);
    canDeactivateGuardService = TestBed.get(CanDeactivateGuardService);
    route = TestBed.get(ActivatedRouteSnapshot);
    state = TestBed.get(RouterStateSnapshot);
    nextState = TestBed.get(RouterStateSnapshot);
    component.defaultRatingModel.populateData = {
      citySubstitutionIndicator: 'Y',
      citySubstitutionRadiusValue: 25,
      customerRatingRuleConfigurationViewDTOs: [],
      customerRatingRuleID: 1588,
      effectiveDate: '2019-05-01',
      expirationDate: '2099-12-31',
      invalidReasonTypeName: 'Active',
      lastUpdatedTimestamp: '2019-05-31T09:09:30.685',
      radiusUnitOfLengthMeasurement: 'Miles',
      attributeChanged: false
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call ngOnDestroy', () => {
    component.ngOnDestroy();
  });
  it('should call onClickDontSave', () => {
    component.defaultRatingModel.routingUrl = '/dashboard';
    component.onClickDontSave();
  });
  it('should call onClickSave', () => {
    component.onClickSave();
  });
  it('should call onClose', () => {
    component.onClose();
  });
  it('should call onHidePop', () => {
    component.onHidePop('isSaveChanges');
  });
  it('should call onDontSave', () => {
    component.onDontSave();
  });
  it('should call populateDefaultRatingRule for false', () => {
    const res = {
      'customerRatingRuleID': 1589,
      'citySubstitutionIndicator': 'Y',
      'citySubstitutionRadiusValue': 25.0000,
      'radiusUnitOfLengthMeasurement': 'Miles',
      'inactivateIndicator': null,
      'invalidReasonTypeName': 'Active',
      'effectiveDate': '2019-05-01',
      'expirationDate': '2099-12-31',
      'customerRatingRuleConfigurationViewDTOs': [{
        'ruleCriteriaID': 1,
        'ruleCriteriaName': 'Congestion Charge',
        'ruleCriteriaValueID': 1,
        'ruleCriteriaValueName': 'On intermediate stops'
      }, {
        'ruleCriteriaID': 2,
        'ruleCriteriaName': 'Flat Rate With Stops',
        'ruleCriteriaValueID': 3,
        'ruleCriteriaValueName': 'Use published flat rate'
      }, {
        'ruleCriteriaID': 3,
        'ruleCriteriaName': 'Hazmat Charge Rules',
        'ruleCriteriaValueID': 5,
        'ruleCriteriaValueName': 'Placards not required to charge'
      }],
      'lastUpdatedTimestamp': '2019-06-03T11:19:55.781'
    };
    spyOn(service, 'getPopulateData').and.returnValue(of(res));
    component.populateDefaultRatingRule();
  });
  it('should call populateDefaultRatingRule for true', () => {
    const res = {
      'customerRatingRuleID': 1589,
      'citySubstitutionIndicator': 'Y',
      'citySubstitutionRadiusValue': 25.0000,
      'radiusUnitOfLengthMeasurement': 'Miles',
      'inactivateIndicator': null,
      'invalidReasonTypeName': 'Active',
      'effectiveDate': '2019-05-01',
      'expirationDate': '2099-12-31',
      'customerRatingRuleConfigurationViewDTOs': [{
        'ruleCriteriaID': 1,
        'ruleCriteriaName': 'Congestion Charge',
        'ruleCriteriaValueID': 1,
        'ruleCriteriaValueName': 'On intermediate stops'
      }, {
        'ruleCriteriaID': 2,
        'ruleCriteriaName': 'Flat Rate With Stops',
        'ruleCriteriaValueID': 3,
        'ruleCriteriaValueName': 'Use published flat rate'
      }, {
        'ruleCriteriaID': 3,
        'ruleCriteriaName': 'Hazmat Charge Rules',
        'ruleCriteriaValueID': 5,
        'ruleCriteriaValueName': 'Placards not required to charge'
      }],
      'lastUpdatedTimestamp': '2019-06-03T11:19:55.781'
    };
    spyOn(service, 'getPopulateData').and.returnValue(of(res));
    component.populateDefaultRatingRule(true);
  });
  it('should call getDefaultRatingRule', () => {
    const res = {
      '_embedded': {
        'ruleCriterias': [{
          'ruleCriteriaName': 'Congestion Charge',
          'ruleCriteriaID': 1,
          'ruleCriteriaValues': [{
            'ruleCriteriaValueName': 'On intermediate stops',
            'ruleCriteriaValueID': 1
          }, {
            'ruleCriteriaValueName': 'On intermediate stops and destination',
            'ruleCriteriaValueID': 2
          }],
          '_links': {
            'self': {
              'href': 'https://pricing-dev.jbhunt.com/pricingagreementservices/rulecriterias/1'
            },
            'ruleCriteria': {
              'href': 'https://pricing-dev.jbhunt.com/pricingagreementservices/rulecriterias/1{?projection}',
              'templated': true
            }
          }
        }, {
          'ruleCriteriaName': 'Flat Rate With Stops',
          'ruleCriteriaID': 2,
          'ruleCriteriaValues': [{
            'ruleCriteriaValueName': 'Use published flat rate',
            'ruleCriteriaValueID': 3
          }, {
            'ruleCriteriaValueName': 'Use distance to recalculate flat rate',
            'ruleCriteriaValueID': 4
          }],
          '_links': {
            'self': {
              'href': 'https://pricing-dev.jbhunt.com/pricingagreementservices/rulecriterias/2'
            },
            'ruleCriteria': {
              'href': 'https://pricing-dev.jbhunt.com/pricingagreementservices/rulecriterias/2{?projection}',
              'templated': true
            }
          }
        }, {
          'ruleCriteriaName': 'Hazmat Charge Rules',
          'ruleCriteriaID': 3,
          'ruleCriteriaValues': [{
            'ruleCriteriaValueName': 'Placards not required to charge',
            'ruleCriteriaValueID': 5
          }, {
            'ruleCriteriaValueName': 'Placards required to charge',
            'ruleCriteriaValueID': 6
          }],
          '_links': {
            'self': {
              'href': 'https://pricing-dev.jbhunt.com/pricingagreementservices/rulecriterias/3'
            },
            'ruleCriteria': {
              'href': 'https://pricing-dev.jbhunt.com/pricingagreementservices/rulecriterias/3{?projection}',
              'templated': true
            }
          }
        }]
      },
      '_links': {
        'self': {
          'href': 'https://pricing-dev.jbhunt.com/pricingagreementservices/rulecriterias{?page,size,sort,projection}',
          'templated': true
        },
        'profile': {
          'href': 'https://pricing-dev.jbhunt.com/pricingagreementservices/profile/rulecriterias'
        }
      },
      'page': {
        'size': 50,
        'totalElements': 3,
        'totalPages': 1,
        'number': 0
      }
    };
    spyOn(service, 'getRules').and.returnValue(of(res));
    component.getDefaultRatingRule();
  });
  it('should call populateRadioFields', () => {
    component.defaultRatingModel.editData = [{
      name: 'Congestion Charge', value: '1'
    }, {
      name: 'Flat Rate With Stops', value: '3'
    }, {
      name: 'Hazmat Charge Rules', value: '6'
    }];
    component.populateRadioFields();
  });
  it('should call onEditClick', () => {
    component.onEditClick();
  });
  it('should call onSave', () => {
    component.onSave();
  });
  it('should call checkSaveValues', () => {
    component.checkSaveValues();
  });
  it('should call saveData', () => {
    component.defaultRatingModel.requestParam = {
      'citySubstitutionIndicator': 'Y',
      'citySubstitutionRadiusValue': 10,
      'radiusUnitOfLengthMeasurement': 'Miles',
      'effectiveDate': '2019-07-01',
      'expirationDate': '2019-07-29',
      'customerRatingRuleConfigurationInputDTOs': [
        {
          'ruleCriteriaID': 1,
          'ruleCriteriaName': 'Congestion Charge',
          'ruleCriteriaValueID': 8,
          'ruleCriteriaValueName': 'On intermediate stops and destination'
        },
        {
          'ruleCriteriaID': 2,
          'ruleCriteriaName': 'Flat Rate With Stops',
          'ruleCriteriaValueID': 9,
          'ruleCriteriaValueName': 'Use published flat rate'
        },
        {
          'ruleCriteriaID': 3,
          'ruleCriteriaName': 'Hazmat Charge Rules',
          'ruleCriteriaValueID': 12,
          'ruleCriteriaValueName': 'Placards required to charge'
        }
      ],
      'effectiveDateChanged': false,
      'lastUpdatedTimestamp': '2019-07-02T01:52:25.452',
      'attributeChanged': true,
      'customerRatingRuleID': 197
    };
    component.defaultRatingModel.patchedValues = {
      citySubstitution: ['citySubstitution'],
      effectiveDate: new Date(),
      radius: '30',
      ruleCriteria1: '1',
      ruleCriteria2: '3',
      ruleCriteria3: '6'
    };
    component.defaultRatingModel.defaultRatingForm.patchValue({
      citySubstitution: ['citySubstitution'],
      effectiveDate: new Date(),
      radius: '25',
      ruleCriteria1: '1',
      ruleCriteria2: '3',
      ruleCriteria3: '6'
    });
    component.defaultRatingModel.defaultRatingForm.markAsDirty();
    component.defaultRatingModel.defaultRatingForm.markAsTouched();
    component.saveData();
  });
  it('should call saveData', () => {
    const res = {
      'customerRatingRuleID': 461,
      'citySubstitutionIndicator': 'N',
      'citySubstitutionRadiusValue': null,
      'radiusUnitOfLengthMeasurement': 'Miles',
      'inactivateIndicator': null,
      'invalidReasonTypeName': 'Active',
      'effectiveDate': '2019-06-14',
      'expirationDate': '2019-06-30',
      'customerRatingRuleConfigurationViewDTOs': [{
        'ruleCriteriaID': 1,
        'ruleCriteriaName': 'Congestion Charge',
        'ruleCriteriaValueID': 8,
        'ruleCriteriaValueName': 'On intermediate stops and destination'
      }, {
        'ruleCriteriaID': 2,
        'ruleCriteriaName': 'Flat Rate With Stops',
        'ruleCriteriaValueID': 9,
        'ruleCriteriaValueName': 'Use published flat rate'
      }, {
        'ruleCriteriaID': 3,
        'ruleCriteriaName': 'Hazmat Charge Rules',
        'ruleCriteriaValueID': 12,
        'ruleCriteriaValueName': 'Placards required to charge'
      }],
      'lastUpdatedTimestamp': '2019-06-20T07:44:23.506'
    };
    spyOn(service, 'saveRules').and.returnValue(of(res));
    component.saveData();
  });
  it('should call saveDataSuccess', () => {
    component.saveDataSuccess();
  });
  it('should call saveData err', () => {
    const err = {
      'traceid': '343481659c77ad99',
      'status': 409,
      'errors': [{
        'fieldErrorFlag': false,
        'errorMessage': 'Failed to convert undefined into java.lang.Integer!',
        'errorType': 'System Runtime Error',
        'fieldName': null,
        'code': 'ServerRuntimeError',
        'errorSeverity': 'ERROR'
      }]
    };
    component.defaultRatingModel.defaultRatingForm.markAsTouched();
    spyOn(service, 'saveRules').and.returnValue(throwError(err));
    component.saveData();
  });
  it('should call onChangeOfCitySubstitution for true condition', () => {
    component.onChangeOfCitySubstitution(true);
  });
  it('should call onChangeOfCitySubstitution for false condition', () => {
    component.onChangeOfCitySubstitution(false);
  });
  it('should call onTypeDate', () => {
    const event: any = {
      srcElement: {
        value: 'a'
      }
    };
    component.onTypeDate(event);
  });
  it('should call dateValidation', () => {
    component.defaultRatingModel.defaultRatingForm.patchValue({
      effectiveDate: new Date()
    });
    component.dateValidation('defaultRatingForm', 'effectiveDate');
  });
  it('should call onRadioClick', () => {
    component.defaultRatingModel.requestParam.customerRatingRuleConfigurationInputDTOs = [{
      ruleCriteriaID: 1,
      ruleCriteriaName: 'Congestion Charge',
      ruleCriteriaValueID: 2,
      ruleCriteriaValueName: 'On intermediate stops and destination'
    }, {
      ruleCriteriaID: 2,
      ruleCriteriaName: 'Flat Rate With Stops',
      ruleCriteriaValueID: 3,
      ruleCriteriaValueName: 'Use published flat rate'
    }, {
      ruleCriteriaID: 3,
      ruleCriteriaName: 'Hazmat Charge Rules',
      ruleCriteriaValueID: 6,
      ruleCriteriaValueName: 'Placards required to charge'
    }];
    component.onRadioClick(1, 'test', 1, 'test');
  });
  it('should call removeDrity', () => {
    component.removeDrity(component.defaultRatingModel.defaultRatingForm);
  });
  it('should call onSave for if condition', () => {
    component.defaultRatingModel.patchedValues = {
      citySubstitution: ['citySubstitution'],
      effectiveDate: new Date(),
      radius: '30',
      ruleCriteria1: '1',
      ruleCriteria2: '3',
      ruleCriteria3: '6'
    };
    component.defaultRatingModel.defaultRatingForm.patchValue({
      citySubstitution: ['citySubstitution'],
      effectiveDate: new Date(),
      radius: '25',
      ruleCriteria1: '1',
      ruleCriteria2: '3',
      ruleCriteria3: '6'
    });
    component.defaultRatingModel.defaultRatingForm.markAsDirty();
    component.defaultRatingModel.defaultRatingForm.markAsTouched();
    component.onSave();
  });
  it('should call onSave for else condition', () => {
    component.defaultRatingModel.patchedValues = {
      citySubstitution: ['citySubstitution'],
      effectiveDate: new Date(),
      radius: '30',
      ruleCriteria1: '1',
      ruleCriteria2: '3',
      ruleCriteria3: '6'
    };
    component.defaultRatingModel.defaultRatingForm.patchValue({
      citySubstitution: ['citySubstitution'],
      effectiveDate: new Date(),
      radius: '30',
      ruleCriteria1: '1',
      ruleCriteria2: '3',
      ruleCriteria3: '6'
    });
    component.defaultRatingModel.defaultRatingForm.markAsPending();
    component.defaultRatingModel.defaultRatingForm.markAsUntouched();
    component.onSave();
  });
  it('should call checkSaveValues for if condition', () => {
    component.defaultRatingModel.defaultRatingForm.patchValue({
      citySubstitution: ['citySubstitution'],
      effectiveDate: new Date(),
      radius: '30',
      ruleCriteria1: '1',
      ruleCriteria2: '3',
      ruleCriteria3: '6'
    });
    component.checkSaveValues();
  });
  it('should call checkSaveValues for else condition', () => {
    component.defaultRatingModel.defaultRatingForm.patchValue({
      citySubstitution: ['citySubstitution'],
      effectiveDate: new Date(),
      radius: '',
      ruleCriteria1: '1',
      ruleCriteria2: '3',
      ruleCriteria3: '6'
    });
    component.checkSaveValues();
  });

  it('should call canDeactivate for if', () => {
    const formBuilder: FormBuilder = new FormBuilder();
    const defaultRatingsForm = formBuilder.group({
      effectiveDate: ['', Validators.required],
      citySubstitution: [],
      radius: [2],
      ruleCriteria1: [],
      ruleCriteria2: [],
      ruleCriteria3: []
    });
    component.defaultRatingModel.isChangesSaving = true;
    component.defaultRatingModel.routingUrl = nextState.url;
    component.defaultRatingModel.defaultRatingForm = defaultRatingsForm;
    component.canDeactivate(canDeactivateGuardService, route, state, nextState);
    expect(component.canDeactivate).toBeTruthy();
  });
});
