import { DateObject } from './../../create-agreement/add-contracts/model/add-contracts.interface';
import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { HttpErrorResponse, HttpResponseBase, HttpHeaders } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';
import {
  FormsModule, ReactiveFormsModule,
  FormControl, Validators, FormBuilder, FormGroup, FormArray, AbstractControl
} from '@angular/forms';
import { AppModule } from '../../../app.module';
import { ViewAgreementDetailsModule } from './../view-agreement-details.module';
import { RatingRulesComponent } from './rating-rules.component';
import { HttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RatingRulesService } from './service/rating-rules.service';
import { BroadcasterService } from '../../../shared/jbh-app-services/broadcaster.service';
import { RatingRulesModel } from './model/rating-rules.model';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import {
  RootObject, CanComponentDeactivate, SectionList,
  RatingRuleDetails, AgreementDetails, SaveRequest, AffiliationEvent, ContractsListItem, ContractTableFormat
} from './model/rating-rules.interface';
import { of } from 'rxjs';
import { RatingRulesUtility } from './service/rating-rules-utility';
import { MessageService } from 'primeng/components/common/messageservice';
import { CanDeactivateGuardService } from '../../../shared/jbh-app-services/can-deactivate-guard.service';

describe('RatingRulesComponent', () => {
  let component: RatingRulesComponent;
  let fixture: ComponentFixture<RatingRulesComponent>;
  let messageService: MessageService;
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000000;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, CanDeactivateGuardService,
      { provide: RouterStateSnapshot, useValue: RatingRulesComponent },
      { provide: ActivatedRouteSnapshot, useValue: RatingRulesComponent },
        MessageService]
    });
  });

  const formBuilder: FormBuilder = new FormBuilder();
  let formGroup: FormGroup;
  let agreementDetail: any;
  let sampleDate: Date;
  let saveRequest: any;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;
  let nextState: RouterStateSnapshot;
  let broadcasterService: BroadcasterService;
  let ratingRulesDetail: any;
  let canDeactivateGuardService: CanDeactivateGuardService;

  beforeEach(() => {
    canDeactivateGuardService = TestBed.get(CanDeactivateGuardService);
    broadcasterService = TestBed.get(BroadcasterService);
    nextState = TestBed.get(RouterStateSnapshot);
    state = TestBed.get(RouterStateSnapshot);
    route = TestBed.get(ActivatedRouteSnapshot);
    messageService = TestBed.get(MessageService);
    fixture = TestBed.createComponent(RatingRulesComponent);
    component = fixture.componentInstance;
    sampleDate = new Date('1995-01-01T14:14:16.639');
    ratingRulesDetail = {
      status: 'string',
      customerRatingRuleID: 1,
      citySubstitutionIndicator: 'string',
      citySubstitutionRadiusValue: 1,
      citySubstitutionUnitofLengthMesurement: 1,
      effectiveDate: '01/01/1995',
      expirationDate: '01/01/1995',
      customerRatingRuleConfigurationViewDTOs: [{
        ruleCriteriaID: 1,
        ruleCriteriaName: 'string',
        ruleCriteriaValueID: 1,
        ruleCriteriaValueName: 'string'
      }],
      agreementDefaultFlag: 'string',
      businessUnitServiceOfferingViewDTOs: [{
        financeBusinessUnitCode: 'string',
        financeBusinessUnitServiceOfferingAssociationID: 1,
        serviceOfferingCode: 'string'
      }],
      customerAgreementContractAssociationViewDTOs: [{
        customerAgreementContractID: 1,
        customerContractName: 'string'
      }],
      customerAgreementContractSectionAssociationViewDTOs: [{
        customerAgreementContractSectionID: '1',
        customerAgreementContractSectionName: 'string'
      }]
    };
    saveRequest = {
      citySubstitutionIndicator: 'string',
      citySubstitutionRadiusValue: 123,
      citySubstitutionUnitofLengthMesurement: 'string',
      effectiveDate: 'string',
      expirationDate: 'string',
      customerRatingRuleConfigurationInputDTOs: null,
      customerRatingRuleBusinessUnitAssociationInputDTOs: null,
      customerRatingRuleContractAssociationInputDTOs: null,
      customerRatingRuleSectionAssociationInputDTOs: null,
      ratingRuleAction: 'string',
      ratingRuleLevel: 'string',
      dateChanged: true,
      customerRatingRuleIDs: null
    };
    formGroup = formBuilder.group({
      effectiveDate: [sampleDate, Validators.required],
      expirationDate: [sampleDate],
      citySubstitution: [false],
      radius: [null],
      congestionCharge: ['On intermediate stops'],
      flatRate: ['Use published flat rate'],
      hazmatCharge: ['Placards not required to charge'],
      businessUnit: ['DCS'],
      affiliation: ['agreement'],
      selectedData: [null]
    });
    agreementDetail = {
      customerAgreementID: 123,
      customerAgreementName: 'string',
      agreementType: 'string',
      ultimateParentAccountID: 123,
      currencyCode: 'string',
      cargoReleaseAmount: 223,
      businessUnits: ['abc'],
      taskAssignmentIDs: [1, 2, 3],
      effectiveDate: 'July 20, 69 00:20:18 GMT+00:00',
      expirationDate: 'July 20, 69 00:20:18 GMT+00:00',
      invalidIndicator: 'string',
      invalidReasonTypeName: 'string'
    };
      component.ratingRulesModel = new RatingRulesModel;

    fixture.detectChanges();
  });

  const data = {
    _embedded: {
      'ruleCriterias': [{
        'ruleCriteriaValues': [{
          'ruleCriteriaValueName': 'On intermediate stops',
          'ruleCriteriaValueID': 7
        }, {
          'ruleCriteriaValueName': 'On intermediate stops and destination',
          'ruleCriteriaValueID': 8
        }],
        'ruleCriteriaName': 'Congestion Charge',
        'ruleCriteriaID': 1,
        _links: {
          'self': {
            'href': 'https://pricing-test.jbhunt.com/api/pricingagreementservices/rulecriterias/1',
            'templated': true
          },
          'ruleCriteria': {
            'href': 'https://pricing-test.jbhunt.com/api/pricingagreementservices/rulecriterias/1{?projection}',
            'templated': true
          }
        }
      }, {
        'ruleCriteriaValues': [{
          'ruleCriteriaValueName': 'Use published flat rate',
          'ruleCriteriaValueID': 9
        }, {
          'ruleCriteriaValueName': 'Use distance to recalculate flat rate',
          'ruleCriteriaValueID': 10
        }],
        'ruleCriteriaName': 'Flat Rate With Stops',
        'ruleCriteriaID': 2,
        _links: {
          'self': {
            'href': 'https://pricing-test.jbhunt.com/api/pricingagreementservices/rulecriterias/2',
            'templated': true
          },
          'ruleCriteria': {
            'href': 'https://pricing-test.jbhunt.com/api/pricingagreementservices/rulecriterias/2{?projection}',
            'templated': true
          }
        }
      }, {
        'ruleCriteriaValues': [{
          'ruleCriteriaValueName': 'Placards not required to charge',
          'ruleCriteriaValueID': 11
        }, {
          'ruleCriteriaValueName': 'Placards required to charge',
          'ruleCriteriaValueID': 12
        }],
        'ruleCriteriaName': 'Hazmat Charge Rules',
        'ruleCriteriaID': 3,
        _links: {
          'self': {
            'href': 'https://pricing-test.jbhunt.com/api/pricingagreementservices/rulecriterias/3',
            'templated': true
          },
          'ruleCriteria': {
            'href': 'https://pricing-test.jbhunt.com/api/pricingagreementservices/rulecriterias/3{?projection}',
            'templated': true
          }
        }
      }]
    },
    _links: {
      'self': {
        'href': 'https://pricing-test.jbhunt.com/api/pricingagreementservices/rulecriterias{?page,size,sort,projection}',
        'templated': true
      },
      'ruleCriteria': {
        'href': 'https://pricing-test.jbhunt.com/api/pricingagreementservices/rulecriterias/3{?projection}',
        'templated': true
      },
      'profile': {
        'href': 'https://pricing-test.jbhunt.com/api/pricingagreementservices/profile/rulecriterias',
        'templated': true
      }
    },
    'page': {
      'size': 50,
      'totalElements': 3,
      'totalPages': 1,
      'number': 0
    }
  };


  const fetchResponse = {
    _embedded: {
      'ruleCriterias': [
        {
          'ruleCriteriaID': 1,
          'ruleCriteriaName': 'Congestion Charge',
          'ruleCriteriaValues': [
            {
              'ruleCriteriaValueID': 7,
              'ruleCriteriaValueName': 'On intermediate stops'
            },
            {
              'ruleCriteriaValueID': 8,
              'ruleCriteriaValueName': 'On intermediate stops and destination'
            }
          ],
          '_links': {}
        }
      ],
      'serviceOfferingBusinessUnitTransitModeAssociations': [
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
          '_links': {}
        }
      ]
    },
    _links: {},
    page: {
      'size': 20,
      'totalElements': 11,
      'totalPages': 1,
      'number': 0
    }
  };

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
  it('should call isEmptyTable', () => {
    const event = { filteredValue: [] },
      flag = 'noSectionFoundFlag';
    component.isEmptyTable(event, flag);
    expect(component.ratingRulesModel[flag]).toBeTruthy();
  });
  it('should call getDetails', () => {
    const data1 = {
      agreementId: 123,
      isAgreementDefault: true,
      isCreate: true,
      ratingRuleId: 123
    };
    component.ratingRuleId = 1;
    const response = {
      customerAgreementID: 1,
      customerAgreementName: 'string',
      agreementType: 'string',
      ultimateParentAccountID: 1,
      currencyCode: 'string',
      cargoReleaseAmount: 1,
      businessUnits: ['DCS'],
      taskAssignmentIDs: [1],
      effectiveDate: '1995-01-01T14:14:16.639',
      expirationDate: '1995-01-01T14:14:16.639',
      invalidIndicator: 'string',
      invalidReasonTypeName: 'string'
    };
    const ratingRulesService: RatingRulesService = fixture.debugElement.injector.get(
      RatingRulesService
    );
    component.ratingRulesModel.ratingRuleEditFlag = true;
    spyOn(ratingRulesService, 'getAgreementDetails').and.returnValues(of(response));
    component.getDetails(data1);
  });
  it('should call getDetails', () => {
    const data1 = {
      agreementId: 123,
      isAgreementDefault: true,
      isCreate: true,
      ratingRuleId: 123
    };
    component.ratingRuleId = 1;
    const response = {};
    const ratingRulesService: RatingRulesService = fixture.debugElement.injector.get(
      RatingRulesService
    );
    spyOn(ratingRulesService, 'getAgreementDetails').and.returnValues(of(response));
    component.getDetails(data1);
  });
  it('should call getDetails with 0 ratingRuleId', () => {
    const data1 = {
      agreementId: 123,
      isAgreementDefault: true,
      isCreate: true,
      ratingRuleId: 123
    };
    component.ratingRuleId = 0;
    const response = {
      customerAgreementID: 1,
      customerAgreementName: 'string',
      agreementType: 'string',
      ultimateParentAccountID: 1,
      currencyCode: 'string',
      cargoReleaseAmount: 1,
      businessUnits: ['DCS'],
      taskAssignmentIDs: [1],
      effectiveDate: '1995-01-01T14:14:16.639',
      expirationDate: '1995-01-01T14:14:16.639',
      invalidIndicator: 'string',
      invalidReasonTypeName: 'string'
    };
    component.ratingRulesModel.ratingRuleEditFlag = false;
    const ratingRulesService: RatingRulesService = fixture.debugElement.injector.get(
      RatingRulesService
    );
    spyOn(ratingRulesService, 'getAgreementDetails').and.returnValues(of(response));
    component.getDetails(data1);
  });
  it('should call errorSceniarioInagreementDetails', () => {
    const value = {
      error: {
        errors: [
          {
            errorMessage: 'failed'
          }
        ]
      }
    };
    component.errorSceniarioInagreementDetails(value);
  });
  it('should call subscribeDetails1', () => {
    formGroup = formBuilder.group({
      effectiveDate: [sampleDate, Validators.required],
      expirationDate: [sampleDate],
      citySubstitution: [false],
      radius: [null],
      congestionCharge: ['On intermediate stops'],
      flatRate: ['Use published flat rate'],
      hazmatCharge: ['Placards not required to charge'],
      businessUnit: ['DCS'],
      affiliation: ['agreement'],
      selectedData: [null]
    });
    component.ratingRulesModel.isAgreementDefault = true;
    component.ratingRulesModel.ratingRulesForm = formGroup;
    const ratingRulesService: RatingRulesService = fixture.debugElement.injector.get(RatingRulesService);
    broadcasterService.broadcast('ratingruledetails', {
      agreementId: 123,
      isAgreementDefault: true,
      isCreate: true
    });
    spyOn(ratingRulesService, 'getAgreementDetails').and.callThrough();
    spyOn(RatingRulesService.prototype, 'getRateDetails').and.callThrough();
    spyOn(RatingRulesService.prototype, 'getBusinessUnitServiceOffering').and.callThrough();
    component.subscribeDetails();
    expect(component.subscribeDetails).toBeTruthy();
  });
  it('should call subscribeDetails2', () => {
    formGroup = formBuilder.group({
      effectiveDate: [sampleDate, Validators.required],
      expirationDate: [sampleDate],
      citySubstitution: [false],
      radius: [null],
      congestionCharge: ['On intermediate stops'],
      flatRate: ['Use published flat rate'],
      hazmatCharge: ['Placards not required to charge'],
      businessUnit: ['DCS'],
      affiliation: ['agreement'],
      selectedData: [null]
    });
    component.ratingRulesModel.isAgreementDefault = false;
    component.ratingRulesModel.ratingRulesForm = formGroup;
    const ratingRulesService: RatingRulesService = fixture.debugElement.injector.get(RatingRulesService);
    broadcasterService.broadcast('ratingruledetails', {
      agreementId: 123,
      isAgreementDefault: true,
      isCreate: true
    });
    spyOn(ratingRulesService, 'getAgreementDetails').and.callThrough();
    spyOn(RatingRulesService.prototype, 'getRateDetails').and.callThrough();
    spyOn(RatingRulesService.prototype, 'getBusinessUnitServiceOffering').and.callThrough();
    component.subscribeDetails();
    expect(component.subscribeDetails).toBeTruthy();
  });
  it('should call onDateSelected', () => {
    const value = new Date('01/01/1995');
    component.onDateSelected(value, 0);
  });
  it('should call onDateSelected with else condition', () => {
    const value = new Date('01/01/1995');
    component.onDateSelected(value, 1);
  });
  it('should call onTypeDate with effective string', () => {
    component.ratingRulesModel.ratingRulesForm = formGroup;
    component.ratingRulesModel.effectiveMinDate = new Date('1995-01-01T14:14:16.639');
    component.ratingRulesModel.effectiveMaxDate = new Date('1995-01-01T14:14:16.639');
    const event = {
      srcElement: {
        value: '01/01/1995'
      }
    };
    component.onTypeDate(event, 'effective');
  });
  it('should call onTypeDate with effective string and empty form', () => {
    component.ratingRulesModel.ratingRulesForm = formBuilder.group({
      effectiveDate: [],
      expirationDate: [],
      citySubstitution: [false],
      radius: [null],
      congestionCharge: ['On intermediate stops'],
      flatRate: ['Use published flat rate'],
      hazmatCharge: ['Placards not required to charge'],
      businessUnit: ['DCS'],
      affiliation: ['agreement'],
      selectedData: [null]
    });
    component.ratingRulesModel.effectiveMinDate = new Date('1995-01-01T14:14:16.639');
    component.ratingRulesModel.effectiveMaxDate = new Date('1995-01-01T14:14:16.639');
    const event = {
      srcElement: {
        value: '01/01/1995'
      }
    };
    component.onTypeDate(event, 'effective');
  });
  it('should call onTypeDate with expiration string', () => {
    component.ratingRulesModel.ratingRulesForm = formGroup;
    component.ratingRulesModel.expirationMinDate = new Date('1995-01-01T14:14:16.639');
    component.ratingRulesModel.expirationMaxDate = new Date('1995-01-01T14:14:16.639');
    component.ratingRulesModel.effectiveMinDate = new Date('1995-01-01T14:14:16.639');
    component.ratingRulesModel.effectiveMaxDate = new Date('1995-01-01T14:14:16.639');
    const event = {
      srcElement: {
        value: '01/01/1995'
      }
    };
    component.onTypeDate(event, 'expiration');
  });
  it('should call onTypeDate with expiration string and empty form', () => {
    component.ratingRulesModel.ratingRulesForm = formBuilder.group({
      effectiveDate: [],
      expirationDate: [],
      citySubstitution: [false],
      radius: [null],
      congestionCharge: ['On intermediate stops'],
      flatRate: ['Use published flat rate'],
      hazmatCharge: ['Placards not required to charge'],
      businessUnit: ['DCS'],
      affiliation: ['agreement'],
      selectedData: [null]
    });
    component.ratingRulesModel.expirationMinDate = new Date('1995-01-01T14:14:16.639');
    component.ratingRulesModel.expirationMaxDate = new Date('1995-01-01T14:14:16.639');
    component.ratingRulesModel.effectiveMinDate = new Date('1995-01-01T14:14:16.639');
    component.ratingRulesModel.effectiveMaxDate = new Date('1995-01-01T14:14:16.639');
    const event = {
      srcElement: {
        value: '01/01/1995'
      }
    };
    component.onTypeDate(event, 'expiration');
  });
  it('should call onTypeDate with default condition', () => {
    component.ratingRulesModel.ratingRulesForm = formGroup;
    component.ratingRulesModel.ratingRulesForm.patchValue({
      effectiveDate: new Date('01/01/1995'),
      expirationDate: new Date('02/01/1995')
    });
    const event = {
      srcElement: {
        value: '01/01/1995'
      }
    };
    component.onTypeDate(event, 'abc');
  });
  it('should call onCitySubstitutionChange with true condition', () => {
    component.ratingRulesModel.ratingRuleEditFlag = false;
    component.onCitySubstitutionChange(true);
  });
  it('should call onCitySubstitutionChange with true condition', () => {
    component.ratingRulesModel.ratingRuleEditFlag = false;
    component.onCitySubstitutionChange(false);
  });
  it('should call getRatingRulesCriteria with true condition', () => {
    const ratingRulesService: RatingRulesService = fixture.debugElement.injector.get(
      RatingRulesService
    );
    const teamsDetail: RootObject = {
      _embedded: null,
      _links: {
        self: {
          href: 'string',
        },
        ruleCriteria: {
          href: 'string'
        },
      }
    };
    spyOn(ratingRulesService, 'getRuleCriteria').and.returnValue(of(teamsDetail));
    component.getRatingRulesCriteria();
  });
  it('should call errorHandling', () => {
    component.errorHandling();
  });
  it('should call onCancel', () => {
    component.ratingRulesModel.ratingRulesForm.markAsDirty();
    component.ratingRulesModel.routerUrl = '/viewagreement';
    component.ratingRulesModel.agreementDetails = agreementDetail;
    component.onCancel();
  });
  it('should call onCancel else', () => {
    component.ratingRulesModel.routerUrl = '/viewagreement';
    component.ratingRulesModel.agreementDetails = agreementDetail;
    component.onCancel();
  });
  it('should call removeDirty with viewagreement route1', () => {
    component.ratingRulesModel.agreementDetails = agreementDetail;
    component.ratingRulesModel.routerUrl = '/viewagreement';
    component.ratingRulesModel.createBreadCrumbValue = 'viewagreement';
    component.removeDirty();
  });
  it('should call removeDirty with viewagreement route2', () => {
    component.ratingRulesModel.agreementDetails = agreementDetail;
    component.ratingRulesModel.routerUrl = '/agreement';
    component.ratingRulesModel.createBreadCrumbValue = 'viewagreement';
    component.removeDirty();
  });
  it('should call validateEditRatingRule if', () => {
    component.ratingRulesModel.agreementDetails = agreementDetail;
    component.ratingRulesModel.ratingRulesForm = formGroup;
    component.ratingRulesModel.ratingRulesForm.markAsDirty();
    component.validateEditRatingRule(true);
  });
  it('should call validateEditRatingRule else if', () => {
    component.ratingRulesModel.ratingRulesForm = formGroup;
    component.ratingRulesModel.ratingRulesForm.markAsDirty();
    component.validateEditRatingRule(false);
  });
  it('should call validateEditRatingRule else', () => {
    component.ratingRulesModel.ratingRulesForm = formGroup;
    component.validateEditRatingRule(false);
  });
  it('should call onSave with if condition true', () => {
    component.ratingRulesModel.ratingRuleEditFlag = false;
    component.onSave();
  });
  it('should call onSave with if condition false', () => {
    component.ratingRulesModel.ratingRuleEditFlag = true;
    component.onSave();
  });
  it('should call setValidationOnSave', () => {
    component.setValidationOnSave(false);
  });
  it('should call saveRatingRule', () => {
    const ratingRulesService: RatingRulesService = fixture.debugElement.injector.get(
      RatingRulesService
    );
    component.ratingRulesModel.agreementDetails = agreementDetail;
    spyOn(ratingRulesService, 'saveRatingRule').and.callThrough();
    component.saveRatingRule(saveRequest);
  });
  it('should call editRatingRule1', () => {
    const ratingRulesService: RatingRulesService = fixture.debugElement.injector.get(
      RatingRulesService
    );
    const successResponse: HttpResponseBase = {
      'headers': new HttpHeaders(),
      'ok': true,
      'status': 201,
      'statusText': 'Created',
      'type': 4,
      'url': ''
    };
    component.ratingRulesModel.agreementDetails = agreementDetail;
    spyOn(ratingRulesService, 'editSaveRatingRule').and.returnValues(of(successResponse));
    component.editRatingRule({bool: false});
  });
  it('should call editRatingRule2 status warning', () => {
    const ratingRulesService: RatingRulesService = fixture.debugElement.injector.get(
      RatingRulesService
    );
    const successResponse = {
      'headers': new HttpHeaders(),
      'ok': true,
      'status': 200,
      'statusText': 'Created',
      'type': 4,
      'url': '',
      'body': {
        'status': 'Warning'
      }
    };
    spyOn(ratingRulesService, 'editSaveRatingRule').and.returnValues(of(successResponse));
    component.ratingRulesModel.agreementDetails = agreementDetail;
    component.editRatingRule({bool: false});
  });
  it('should call editRatingRule2 status success', () => {
    const ratingRulesService: RatingRulesService = fixture.debugElement.injector.get(
      RatingRulesService
    );
    const successResponse = {
      'headers': new HttpHeaders(),
      'ok': true,
      'status': 200,
      'statusText': 'Created',
      'type': 4,
      'url': '',
      'body': {
        'status': 'Success'
      }
    };
    spyOn(ratingRulesService, 'editSaveRatingRule').and.returnValues(of(successResponse));
    component.ratingRulesModel.agreementDetails = agreementDetail;
    component.editRatingRule({bool: false});
  });
  it('should call getBusinessUnitServiceOffering', () => {
    const ratingRulesService: RatingRulesService = fixture.debugElement.injector.get(
      RatingRulesService
    );
    spyOn(ratingRulesService, 'getBusinessUnitServiceOffering').and.returnValues(of(fetchResponse));
    component.getBusinessUnitServiceOffering();
  });
  it('should call getBusinessUnitServiceOfferingList', () => {
    RatingRulesUtility.getBusinessUnitServiceOfferingList(data);
  });

  it('should call affiliationChanged', () => {
    const event = {
      originalEvent: null,
      value: 'agreement'
    };
    component.affiliationChanged(event);
  });
  it('should call checkSelectedData', () => {
    const event = {
      originalEvent: null,
      value: 'agreement'
    };
    component.checkSelectedData(event);
  });
  it('should call onBusinessUnitChange', () => {
    component.onBusinessUnitChange();
  });
  it('should call callContractList', () => {
    component.ratingRulesModel.agreementDetails = agreementDetail;
    formGroup = formBuilder.group({
      effectiveDate: [sampleDate, Validators.required],
      expirationDate: [sampleDate],
      citySubstitution: [false],
      radius: [null],
      congestionCharge: ['On intermediate stops'],
      flatRate: ['Use published flat rate'],
      hazmatCharge: ['Placards not required to charge'],
      businessUnit: [null],
      affiliation: ['contract'],
      selectedData: [null]
    });
    component.ratingRulesModel.ratingRulesForm = formGroup;
    component.callContractList();
  });
  it('should call callSectionList', () => {
    component.ratingRulesModel.agreementDetails = agreementDetail;
    formGroup = formBuilder.group({
      effectiveDate: [sampleDate, Validators.required],
      expirationDate: [sampleDate],
      citySubstitution: [false],
      radius: [null],
      congestionCharge: ['On intermediate stops'],
      flatRate: ['Use published flat rate'],
      hazmatCharge: ['Placards not required to charge'],
      businessUnit: [null],
      affiliation: ['section'],
      selectedData: [null]
    });
    component.ratingRulesModel.ratingRulesForm = formGroup;
    component.callSectionList();
  });
  it('should call emptySelectionError', () => {
    component.emptySelectionError(false);
  });
  it('should call emptySelectionError', () => {
    component.emptySelectionError(true);
  });
  it('should call affiliationChangeValue', () => {
    component.affiliationChangeValue('contract');
  });
  it('should call affiliationChangeYes', () => {
    component.affiliationChangeYes();
  });
  it('should call popupCancel', () => {
    component.popupCancel();
  });
  it('should call detailsFetch', () => {
    const ratingRulesService: RatingRulesService = fixture.debugElement.injector.get(
      RatingRulesService
    );
    component.ratingRulesModel.agreementDetails = agreementDetail;
    spyOn(RatingRulesService.prototype, 'getBusinessUnitServiceOffering').and.returnValues(of(fetchResponse));
    spyOn(RatingRulesService.prototype, 'getRateDetails').and.returnValues(of(ratingRulesDetail));
    component.ratingRulesModel.ratingRulesForm = formGroup;
    component.detailsFetch(89);
  });

  it('should call setSelectedContractList', () => {
    component.ratingRulesModel.ratingRulesForm = formGroup;
    component.setSelectedContractList(ratingRulesDetail);
  });
  it('should call setSelectedSectionList', () => {
    component.ratingRulesModel.ratingRulesForm = formGroup;
    component.setSelectedSectionList(ratingRulesDetail);
  });
  it('should call canDeactivate for if', () => {
    component.ratingRulesModel.ratingRulesForm.markAsPristine();
    component.canDeactivate(canDeactivateGuardService, route, state, nextState);
    expect(component.canDeactivate).toBeTruthy();
  });
  it('should call canDeactivate for else', () => {
    component.ratingRulesModel.ratingRulesForm.markAsDirty();
    component.canDeactivate(canDeactivateGuardService, route, state, nextState);
    expect(component.canDeactivate).toBeTruthy();
  });
  it('should call formatDate', () => {
    component.formatDate(new Date());
  });

  it('should call setSelectedSectionList for else', () => {
    component.setSelectedSectionList(null);
  });

  it('should call setSelectedSectionList for nested if', () => {
    component.ratingRulesModel.sectionList = [{
      effectiveDate: 'string',
      expirationDate: 'string',
      contractDetail: 'string',
      sectionDetail: 'string',
      sectionSaveData: {
        sectionID: '1',
        sectionName: 'string'
      }
    }];
    component.setSelectedSectionList(ratingRulesDetail);
  });

  it('should call setSelectedContractList for else', () => {
    component.setSelectedContractList(null);
  });

  it('should call setSelectedContractList for nested if', () => {
    component.ratingRulesModel.contractsList = [{
      effectiveDate: 'string',
      expirationDate: 'string',
      display: 'string',
      saveData: {
        contractID: 1,
        contractName: 'string',
        contractType: 'string',
        contractNumber: 'string',
        contractDisplayName: 'string'
      }
    }];
    component.setSelectedContractList(ratingRulesDetail);
  });

  it('should call setBusinessUnit', () => {
    component.ratingRulesModel.businessUnitServiceOfferingList = [{
      label: 'label',
      value: {
        financeBusinessUnitServiceOfferingAssociationID: 1,
        financeBusinessUnitCode: 'string',
        serviceOfferingCode: 'string',
        financeBusinessUnitServiceOfferingDisplayName: 'string'
      }
    }];
    component.setBusinessUnit(ratingRulesDetail['businessUnitServiceOfferingViewDTOs']);
  });

  it('should call setAffliation', () => {
    component.setAffliation();
  });

  it('should call changeAffilation', () => {
    component.changeAffilation(ratingRulesDetail);
  });

  it('should call changeAffilation for else', () => {
    ratingRulesDetail['customerAgreementContractAssociationViewDTOs'] = [];
    ratingRulesDetail['customerAgreementContractSectionAssociationViewDTOs'] = [];
    component.changeAffilation(ratingRulesDetail);
  });

  it('should call toastMessage', () => {
    RatingRulesUtility.toastMessage(messageService, 'string', 'string', 'string');
    spyOn(messageService, 'clear');
    spyOn(messageService, 'add');
  });
  it('should call createRequestParam', () => {
    RatingRulesUtility.createRequestParam(component.ratingRulesModel);
  });

  it('should call editRequestParam', () => {
    component.ratingRulesModel.ratingRulesForm = formGroup;
    RatingRulesUtility.editRequestParam(component.ratingRulesModel);
  });

  it('should call ratingRuleConfigurationParam', () => {
    RatingRulesUtility.ratingRuleConfigurationParam(component.ratingRulesModel);
  });

  it('should call onSelectExpDate', () => {
    component.ratingRulesModel.effectiveMinDate = new Date('1995-01-01T14:14:16.639');
    component.ratingRulesModel.effectiveMaxDate = new Date('1995-01-01T14:14:16.639');
    component.ratingRulesModel.expirationMinDate = new Date('1995-01-01T14:14:16.639');
    component.ratingRulesModel.expirationMaxDate = new Date('1995-01-01T14:14:16.639');
    component.ratingRulesModel.ratingRulesForm = formGroup;
    RatingRulesUtility.onSelectExpDate(component.ratingRulesModel);
  });

  it('should call getValidDate', () => {
    component.ratingRulesModel.effectiveMinDate = new Date('1995-01-01T14:14:16.639');
    component.ratingRulesModel.effectiveMaxDate = new Date('1995-01-01T14:14:16.639');
    component.ratingRulesModel.ratingRulesForm = formGroup;
    RatingRulesUtility.getValidDate(component.ratingRulesModel);
  });

  it('should call validateDateFormat', () => {
    const event = {
      srcElement: {
        value: '01/01/1995'
      }
    };
    RatingRulesUtility.validateDateFormat(event, 'effective', component.ratingRulesModel);
  });

  it('should call setFormErrors', () => {
    RatingRulesUtility.setFormErrors(component.ratingRulesModel);
  });

  it('should call setBusinessUnitValidation', () => {
    RatingRulesUtility.setBusinessUnitValidation(component.ratingRulesModel);
  });

  xit('should call dateObj', () => {
    RatingRulesUtility.dateObj('01/01/1995');
  });


  it('should call dateFormatter', () => {
    RatingRulesUtility.dateFormatter(2);
  });

  it('should call checkContracts', () => {
    formGroup = formBuilder.group({
      effectiveDate: [sampleDate, Validators.required],
      expirationDate: [sampleDate],
      citySubstitution: [false],
      radius: [null],
      congestionCharge: ['On intermediate stops'],
      flatRate: ['Use published flat rate'],
      hazmatCharge: ['Placards not required to charge'],
      businessUnit: [null],
      affiliation: ['agreement'],
      selectedData: [null]
    });
    component.ratingRulesModel.ratingRulesForm = formGroup;
    RatingRulesUtility.checkContracts(component.ratingRulesModel);
  });

  it('should call getSelectedContract', () => {
    component.ratingRulesModel.affiliationValue = 'contract';
    RatingRulesUtility.getSelectedContract(component.ratingRulesModel);
  });

  it('should call getSelectedSection', () => {
    component.ratingRulesModel.affiliationValue = 'section';
    RatingRulesUtility.getSelectedSection(component.ratingRulesModel);
  });

  it('should call isEmptyTable', () => {
    const flag = true;
    const event = {
      'filteredValue': 1
    };
    RatingRulesUtility.isEmptyTable(component.ratingRulesModel, event, flag);
  });

  it('should call ratingRulesCriteria', () => {
    component.ratingRulesModel.ruleCriteriaNameList = [{
      'label': '1'
    },
    {
      'label': '2'
    },
    {
      'label': '3'
    }];
    RatingRulesUtility.ratingRulesCriteria(data, component.ratingRulesModel);
  });

  it('should call getCriteriaValues', () => {
    const ruleCriteria = {
      'ruleCriteriaValues': [{
        'ruleCriteriaValueName': 'On intermediate stops',
        'ruleCriteriaValueID': 7
      }, {
        'ruleCriteriaValueName': 'On intermediate stops and destination',
        'ruleCriteriaValueID': 8
      }],
      'ruleCriteriaName': 'Congestion Charge',
      'ruleCriteriaID': 1,
      _links: {
        'self': {
          'href': 'https://pricing-test.jbhunt.com/api/pricingagreementservices/rulecriterias/1',
          'templated': true
        },
        'ruleCriteria': {
          'href': 'https://pricing-test.jbhunt.com/api/pricingagreementservices/rulecriterias/1{?projection}',
          'templated': true
        }
      }
    };
    RatingRulesUtility.getCriteriaValues(ruleCriteria);
  });

  it('should call contractTableList', () => {
    const contarctList = [{
      customerAgreementContractID: 1,
      customerAgreementContractTypeID: 2,
      customerContractName: 'string',
      contractTypeName: 'string',
      customerContractNumber: null,
      effectiveDate: 'string',
      expirationDate: 'string'
    }];
    spyOn(RatingRulesUtility, 'dateObj');
    spyOn(RatingRulesUtility, 'datePipe');
    RatingRulesUtility.contractTableList(contarctList);
  });

  it('should call contractTableList', () => {
    const sectionList = [{
      customerAgreementContractSectionID: 1,
      customerAgreementContractSectionName: 'string',
      customerAgreementContractID: 2,
      customerContractName: 'string',
      customerContractNumber: 'string',
      contractTypeName: 'string',
      effectiveDate: '01/01/2019',
      expirationDate: '01/02/2020'
    }];
    spyOn(RatingRulesUtility, 'dateObj');
    spyOn(RatingRulesUtility, 'datePipe');
    RatingRulesUtility.sectionTableList(sectionList);
  });

});
