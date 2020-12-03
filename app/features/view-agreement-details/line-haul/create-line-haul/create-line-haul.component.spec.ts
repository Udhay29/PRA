import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { CreateLineHaulModel } from './model/create-line-haul.model';

import { AppModule } from '../../../../app.module';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ViewAgreementDetailsModule } from '../../view-agreement-details.module';
import { MessageService } from 'primeng/components/common/messageservice';
import { of } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanDeactivateGuardService } from '../../../../shared/jbh-app-services/can-deactivate-guard.service';
import { ViewAgreementDetailsUtility } from './../../service/view-agreement-details-utility';
import { CreateLineHaulComponent } from './create-line-haul.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreateLineHaulService } from './services/create-line-haul.service';
import { AdditionalInfoService } from '../add-line-haul/additional-info/services/additional-info.service';
import { By } from 'protractor';

describe('CreateLineHaulComponent', () => {
  let component: CreateLineHaulComponent;
  let fixture: ComponentFixture<CreateLineHaulComponent>;
  let lineHaulForm: FormGroup;
  let createLineHaulService: CreateLineHaulService;
  let createLineHaulModel: CreateLineHaulModel;
  const formBuilder: FormBuilder = new FormBuilder();
  let messageService: MessageService;
  let canDeactivateGuardService: CanDeactivateGuardService;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;
  let nextState: RouterStateSnapshot;
  let utilityService: ViewAgreementDetailsUtility;
  let additionalInfoService: AdditionalInfoService;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, CreateLineHaulService, MessageService, CanDeactivateGuardService,
      { provide: RouterStateSnapshot, useValue: CreateLineHaulComponent },
      { provide: ActivatedRouteSnapshot, useValue: CreateLineHaulComponent }
      ]
    });
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLineHaulComponent);
    component = fixture.componentInstance;
    createLineHaulModel = new CreateLineHaulModel('test');
    component.createLineHaulModel = createLineHaulModel;
    canDeactivateGuardService = TestBed.get(CanDeactivateGuardService);
    route = TestBed.get(ActivatedRouteSnapshot);
    state = TestBed.get(RouterStateSnapshot);
    nextState = TestBed.get(RouterStateSnapshot);
    createLineHaulModel = new CreateLineHaulModel('123');
    utilityService = TestBed.get(ViewAgreementDetailsUtility);
    additionalInfoService = TestBed.get(AdditionalInfoService);
    component.createLineHaulModel = createLineHaulModel;
    lineHaulForm = formBuilder.group({
      effectiveDate: ['', Validators.required],
      expirationDate: ['', Validators.required],
      lineHaulSourceType: ['']
    });
    component.createLineHaulModel = createLineHaulModel;
    component.createLineHaulModel.lineHaulForm = lineHaulForm;
    component.createLineHaulModel.lineHaulForm.controls['effectiveDate'].setValue('05/15/2019');
    component.createLineHaulModel.lineHaulForm.controls['expirationDate'].setValue('05/09/2019');
    component.createLineHaulModel.lineHaulForm.controls['lineHaulSourceType'].setValue({
      label: 'Advisor',
      value: 1
    });
    fixture.detectChanges();
    createLineHaulService = TestBed.get(CreateLineHaulService);
    messageService = TestBed.get(MessageService);
    const agreementDetails = {
      'customerAgreementID': 133,
      'customerAgreementName': 'Federal Jeans, Inc. (FEBR99)',
      'agreementType': 'Customer',
      'ultimateParentAccountID': 10998,
      'currencyCode': 'USD',
      'cargoReleaseAmount': 100,
      'businessUnits': 'JBI',
      'taskAssignmentIDs': null,
      'effectiveDate': '1995-01-01',
      'expirationDate': '2099-12-31',
      'invalidIndicator': 'N',
      'invalidReasonTypeName': 'Active',
      'teams': 'aa'
    };
    component.createLineHaulModel.agreementDetails = agreementDetails;
    component.createLineHaulModel.lineHaulSourceType = [{
      label: 'Manual',
      value: '4'
    }];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    spyOn(component, 'getSourceTypes');
    spyOn(component, 'getEditLineHaulDetails');
    component.ngOnInit();
    expect(component.getSourceTypes).toHaveBeenCalled();
    expect(component.getEditLineHaulDetails).toHaveBeenCalled();
  });

  it('should call ngOnDestroy', () => {
    component.ngOnDestroy();
  });

  it('should call createLineHaulForm', () => {
    component.createLineHaulForm();
  });

  it('should call getSourceTypes', () => {
    const data = {
      '_embedded': {
        'lineHaulSourceTypes': [
          {
            'lineHaulSourceTypeID': 4,
            'lineHaulSourceTypeName': 'Manual',
            '_links': {
              'self': {
                'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/linehaulsourcetypes/1'
              },
              'lineHaulSourceType': {
                'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/linehaulsourcetypes/1{?projection}',
                'templated': true
              }
            }
          }
        ]
      },
      '_links': {
        'self': {
          'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/linehaulsourcetypes{?page,size,sort,projection}',
          'templated': true
        },
        'profile': {
          'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/profile/linehaulsourcetypes'
        }
      },
      'page': {
        'size': 50,
        'totalElements': 4,
        'totalPages': 1,
        'number': 0
      }
    };
    spyOn(CreateLineHaulService.prototype, 'getSourceDetails').and.returnValue(of(data));
    component.getSourceTypes();
    fixture.detectChanges();
  });

  xit('should call onButtonSelected', () => {
    component.createLineHaulModel.lineHaulSourceType = [{
      label: 'Manual',
      value: '4'
    }];
    component.onButtonSelected(1);
  });

  it('should call onDateSelected effectiveDate', () => {
    const date = new Date('1995-01-01');
    component.onDateSelected(date, 'effectiveDate');
  });

  it('should call onDateSelected expirationDate', () => {
    const date = new Date('1995-01-01');
    component.onDateSelected(date, 'expirationDate');
  });

  it('should call onDateSelected expirationDate', () => {
    const date = new Date('1995-01-01');
    component.onDateSelected(date, 'Date');
  });

  it('should call setValidation', () => {
    component.createLineHaulModel.lineHaulForm.controls['expirationDate'].setValue('');
    component.setValidation('expirationDate');
  });

  it('should call dateFormatter', () => {
    const date = new Date('1995-01-01');
    component.dateFormatter(date);
  });

  it('should call onDateRangeContinue', () => {
    component.createLineHaulModel.lineHaulForm = lineHaulForm;
    component.createLineHaulModel.lineHaulForm.controls['effectiveDate'].setValue('');
    component.createLineHaulModel.lineHaulForm.controls['expirationDate'].setValue('');
    component.createLineHaulModel.lineHaulForm.controls['lineHaulSourceType'].setValue({
      label: '',
      value: null
    });
    component.onDateRangeContinue();
  });

  it('should call lineHaulDetailsSave', () => {
    component.lineHaulDetailsSave();
  });

  it('should call lineHaulDetailsSave', () => {
    component.createLineHaulModel.isSaveDraft = true;
    component.lineHaulDetailsSave();
  });

  it('should call onClickBackLane', () => {
    component.onClickBackLane();
  });

  it('should call onSaveLineHaul', () => {
    const data = [{
      'customerSectionID': 310, 'customerSectionName': 'SSBR22', 'customerContractID': 275, 'customerContractName': 'SSBR22',
      'customerContractNumber': '1973', 'sectionEffectiveDate': '2019-05-31', 'sectionExpirationDate': '2099-12-31',
      'customerAgreementID': 144, 'customerAgreementName': '55 Ferris Associates Inc. (SSBR22)'
    }];
    spyOn(CreateLineHaulService.prototype, 'onSaveManualDetails').and.returnValues(of(data));
    component.onSaveLineHaul();
  });

  it('should call saveLineHaulDraft', () => {
    component.reviewUrl = '/ViewAgreement';
    const reviewCancelStatus = true;
    utilityService.setreviewCancelStatus(reviewCancelStatus);
    component.saveLineHaulDraft();
  });

  it('should call saveLineHaulDraft', () => {
    component.reviewUrl = '/ViewAgreement';
    component.saveLineHaulDraft();
  });

  it('should call saveLineHaulData', () => {
    const data = [{
      customerAgreementID: 147,
      customerAgreementName: 'Adair Mechanical (ADAR78)',
      customerContractID: 279,
      customerContractName: 'con 1',
      customerContractNumber: 'con 1',
      customerSectionID: 324,
      customerSectionName: 'sec 1',
      sectionEffectiveDate: '2019-05-28',
      sectionExpirationDate: '2019-07-19'
    }];
    const editlineHaulData = {
      lineHaulDetails: {},
      isEditFlag: true
    };
    utilityService.setEditLineHaulData(editlineHaulData);
    component.saveLineHaulData(data);
  });

  it('should call saveLineHaulData', () => {
    const data = [{
      customerAgreementID: 147,
      customerAgreementName: 'Adair Mechanical (ADAR78)',
      customerContractID: 279,
      customerContractName: 'con 1',
      customerContractNumber: 'con 1',
      customerSectionID: 324,
      customerSectionName: 'sec 1',
      sectionEffectiveDate: '2019-05-28',
      sectionExpirationDate: '2019-07-19'
    }];
    component.saveLineHaulData(data);
  });

  it('should call saveLineHaulData', () => {
    const data = [];
    component.saveLineHaulData(data);
  });

  it('should call onClickConfirmationCancel', () => {
    component.onClickConfirmationCancel();
  });

  it('should call onDateRangeCancel', () => {
    const reviewCancelStatus = true;
    utilityService.setreviewCancelStatus(reviewCancelStatus);
    component.onDateRangeCancel();
  });

  it('should call onDateRangeCancel', () => {
    component.onDateRangeCancel();
  });

  it('should call onDateRangeCancellation', () => {
    component.createLineHaulModel.routingUrl = 'abc';
    component.agreementURL = 'abc';
    component.lineHaulNavigationOnCancel();
    component.onDateRangeCancellation();
  });

  it('should call lineHaulNavigationOnCancel', () => {
    component.createLineHaulModel.routingUrl = 'abc';
    component.agreementURL = 'aaa';
    component.reviewUrl = 'abc';
    component.lineHaulNavigationOnCancel();
  });

  it('should call lineHaulNavigationOnCancel', () => {
    component.createLineHaulModel.routingUrl = 'abc';
    component.agreementURL = 'aa';
    component.reviewUrl = 'ab';
    spyOn(AdditionalInfoService.prototype, 'saveDraftInfo').and.returnValue(of({}));
    component.lineHaulNavigationOnCancel();
  });

  it('should call lineHaulNavigationOnCancel', () => {
    component.createLineHaulModel.routingUrl = 'abc';
    component.agreementURL = 'aa';
    component.reviewUrl = 'ab';
    const reviewCancelStatus = true;
    utilityService.setreviewCancelStatus(reviewCancelStatus);
    spyOn(AdditionalInfoService.prototype, 'saveDraftInfo').and.returnValue(of({}));
    component.lineHaulNavigationOnCancel();
  });

  it('should call onDateRangeSave', () => {
    component.onDateRangeSave();
  });

  it('should call onDateRangeSave', () => {
    component.lineHaulElement = {
      effectiveDate: '2019-05-28',
      expirationDate: '2019-05-30'
    };
    component.onDateRangeSave();
  });

  it('should call formFieldsTouched', () => {
    component.formFieldsTouched();
  });

  it('should call toastMessage', () => {
    component.toastMessage(messageService, 'error', 'b', 'c');
  });

  it('should call showError', () => {
    component.showError();
  });

  it('should call canDeactivate', () => {
    component.canDeactivate(canDeactivateGuardService, route, state, nextState);
  });

  it('should call typedDateValidate effectiveDate', () => {
    const event: any = {
      srcElement: {
        value: '06/24/1996'
      }
    };
    component.typedDateValidate(event, 'effectiveDate');
  });

  it('should call typedDateValidate effectiveDate', () => {
    const event: any = {
      srcElement: {
        value: ''
      }
    };
    component.typedDateValidate(event, 'effectiveDate');
  });

  it('should call typedDateValidate expirationDate', () => {
    const event: any = {
      srcElement: {
        value: '06/24/1996'
      }
    };
    component.typedDateValidate(event, 'expirationDate');
  });

  it('should call typedDateValidate expirationDate', () => {
    const event: any = {
      srcElement: {
        value: ''
      }
    };
    component.typedDateValidate(event, 'expirationDate');
  });

  it('should call typedDateValidate expirationDate', () => {
    const event: any = {
      srcElement: {
        value: '06/24/1996'
      }
    };
    component.typedDateValidate(event, 'Date');
  });

  it('should call validateDate expirationDate', () => {
    const date = new Date('12/31/2199');
    component.validateDate(date, 'expirationDate');
  });

  it('should call validateDate effectiveDate', () => {
    const date = new Date('12/31/2199');
    component.validateDate(date, 'effectiveDate');
  });

  it('should call validateDate effectiveDate', () => {
    const date = new Date('12/31/2199');
    component.validateDate(date, 'Date');
  });

  it('should call validateExpirationDate', () => {
    component.createLineHaulModel.lineHaulForm.controls['effectiveDate'].setValue('12/31/2199');
    component.createLineHaulModel.lineHaulForm.controls['expirationDate'].setValue('07/31/2199');
    component.validateExpirationDate();
  });

  it('should call validateExpirationDate', () => {
    component.validateExpirationDate();
  });

  it('should call validateEffectiveDate', () => {
    component.validateEffectiveDate();
  });

  it('should call validateEffectiveDate', () => {
    component.createLineHaulModel.lineHaulForm.controls['effectiveDate'].setValue('12/31/2199');
    component.createLineHaulModel.lineHaulForm.controls['expirationDate'].setValue('07/31/2199');
    component.validateEffectiveDate();
  });

  it('should call hideDateErrors', () => {
    component.hideDateErrors();
  });

  it('should call setFormErrors', () => {
    component.createLineHaulModel.inValidEffDate = true;
    component.createLineHaulModel.inValidDate = true;
    component.setFormErrors();
  });

  xit('should call getEditLineHaulDetails', () => {
    const data = {
      'lineHaulConfigurationID': 347,
      'laneID': 221,
      'lineHaulSourceTypeID': 4,
      'lineHaulSourceTypeName': 'Manual ',
      'origin': {
        'type': 'Address',
        'typeID': 3,
        'country': null,
        'point': null,
        'pointID': 101809,
        'description': null,
        'vendorID': null,
        'addressLine1': null,
        'addressLine2': null,
        'cityName': null,
        'countryCode': null,
        'countryName': null,
        'postalCode': null,
        'stateCode': null,
        'stateName': null
      },
      'destination': {
        'type': 'Address',
        'typeID': 3,
        'country': null,
        'point': null,
        'pointID': 87919,
        'description': null,
        'vendorID': null,
        'addressLine1': null,
        'addressLine2': null,
        'cityName': null,
        'countryCode': null,
        'countryName': null,
        'postalCode': null,
        'stateCode': null,
        'stateName': null
      },
      'stops': [],
      'stopChargeIncludedIndicator': false,
      'status': 'Published',
      'effectiveDate': '2019-06-13',
      'expirationDate': '2019-06-13',
      'agreementID': 51,
      'agreementName': 'Adidas America Inc (ADPO65)',
      'contractID': 89,
      'contractNumber': 'con456',
      'contractName': 'des',
      'sectionID': 91,
      'sectionName': 'sec12',
      'financeBusinessUnitServiceOfferingAssociationID': 5,
      'businessUnit': 'DCS',
      'serviceOffering': 'Dedicated',
      'serviceOfferingDescription': 'Dedicated',
      'serviceOfferingBusinessUnitTransitModeAssociationID': 4,
      'transitMode': 'Truck',
      'transitModeDescription': 'Transit By Truck',
      'serviceLevelBusinessUnitServiceOfferingAssociationID': null,
      'serviceLevel': null,
      'serviceLevelDescription': null,
      'equipmentRequirementSpecificationAssociationID': null,
      'equipmentClassificationCode': 'Chassis',
      'equipmentClassificationCodeDescription': 'CHASSIS',
      'equipmentTypeCode': 'Chassis',
      'equipmentTypeCodeDescription': 'CHASSIS',
      'equipmentLengthQuantity': null,
      'unitOfEquipmentLengthMeasurementCode': null,
      'operationalServices': [],
      'priorityNumber': 65,
      'overriddenPriority': null,
      'awardStatusID': 3,
      'awardStatus': 'Secondary',
      'rates': [
        {
          'customerLineHaulRateID': 381,
          'customerLineHaulConfigurationID': 347,
          'chargeUnitType': 'Per Linear Foot',
          'rateAmount': 12.0000,
          'minimumAmount': null,
          'maximumAmount': null,
          'currencyCode': 'USD'
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
      'createdUserId': 'jcnt565',
      'lastUpdateUserId': 'jcnt565',
      'recordStatus': 'active',
      'dbSyncUpdateTimestamp': null
    };
    const editlineHaulData = {
      lineHaulDetails: {},
      isEditFlag: true
    };
    utilityService.setEditLineHaulData(editlineHaulData);
    spyOn(CreateLineHaulService.prototype, 'getLineHaulOverView').and.returnValues(of(data));
    component.getEditLineHaulDetails();
  });

  it('should call getEditLineHaulDetails', () => {
    const editlineHaulData = {
      lineHaulDetails: {},
      isEditFlag: false
    };
    utilityService.setEditLineHaulData(editlineHaulData);
    component.getEditLineHaulDetails();
  });

  it('should call getEditLineHaulDetails', () => {
    component.getEditLineHaulDetails();
  });

  it('should call getSectionDate', () => {
    const dateObj = {
      effectiveDate: '05/15/2019',
      expirationDate: '05/09/2019'
    };
    component.getSectionDate(dateObj);
  });

  it('should call getSectionDate', () => {
    const dateObj = {};
    component.getSectionDate(dateObj);
  });
});
