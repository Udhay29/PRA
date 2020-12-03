import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';
import { ViewAgreementDetailsModule } from '../../../view-agreement-details.module';
import { AdditionalInfoComponent } from './additional-info.component';
import { ViewAgreementDetailsUtility } from '../../../service/view-agreement-details-utility';
import { AdditionalInfoModel } from './models/additional-info.model';
import { AdditionalInfoService } from './services/additional-info.service';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import {
  BillToCodeList, ElasticRootObject, HitsArray, MileagePreferenceRequest,
  ReqParam, WeightUnit
} from './models/additional-info.interface';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AdditionalInfoUtility } from './services/additional-info-utility';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CarrierQuery } from './query/carrier.query';
import { BroadcasterService } from '../../../../../shared/jbh-app-services/broadcaster.service';
import { LineHaulValues } from '../../additional-information/line-haul-overview/model/line-haul-overview.interface';
import { By } from '@angular/platform-browser';

describe('AdditionalInfoComponent', () => {
  const formBuilder: FormBuilder = new FormBuilder();
  let formGroup: FormGroup;
  let overridenForm: FormGroup;
  let component: AdditionalInfoComponent;
  let fixture: ComponentFixture<AdditionalInfoComponent>;
  let agreementUtility: ViewAgreementDetailsUtility;
  let service: AdditionalInfoService;
  const additionalInfoModel = new AdditionalInfoModel;
  let billtoCodesList: any;
  let labelValue: {
    label: any,
    value: any
  };
  let reqParam: ReqParam;
  let broadcasterService: BroadcasterService;
  let lineHaulValues: LineHaulValues;
  let route: ActivatedRoute;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, ViewAgreementDetailsUtility]
    });
  });

  beforeEach(() => {
    lineHaulValues = {
      customerLineHaulConfigurationID: 123,
      laneID: 12,
      lineHaulSourceTypeID: 12,
      lineHaulSourceTypeName: 'string',
      originType : '3-Zip',
      destinationType : '3-Zip',
      originPoints: null,
      destinationPoints: null,
      stops: [],
      stopChargeIncludedIndicator: 'Yes',
      status: 'string',
      effectiveDate: 'string',
      expirationDate: 'string',
      customerAgreementID: 123,
      customerAgreementName: 'string',
      customerAgreementContractID: 123,
      customerAgreementContractNumber: 'string',
      customerAgreementContractName: 'string',
      customerAgreementContractSectionID: 123,
      customerAgreementContractSectionName: 'string',
      financeBusinessUnitServiceOfferingAssociationID: 123,
      financeBusinessUnitName: 'string',
      serviceOfferingCode: 'string',
      serviceOfferingBusinessUnitTransitModeAssociationID: 123,
      transitMode: 'string',
      serviceLevelBusinessUnitServiceOfferingAssociationID: 123,
      serviceLevelCode: 'string',
      equipment: 'any',
      operationalServices: [],
      priorityLevelNumber: 123,
      overriddenPriority: 'string',
      lineHaulAwardStatusTypeID: 123,
      lineHaulAwardStatusTypeName: 'string',
      rates: [],
      groupRateType: 'string',
      groupRateItemizeIndicator: true,
      sourceID: 123,
      sourceLineHaulID: 123,
      overiddenPriorityLevelNumber: 123,
      billTos: [{
        billToID: 123
      }],
      carriers: [{
        carrierID: 123
      }],
      mileagePreference: {
        range: '1,234',
        mileagePreferenceID: 12,
        mileagePreferenceName: 'abc',
        lineHaulMileageRangeMinQuantity: '123',
        lineHaulMileageRangeMaxQuantity: '123',
      },
      lineHaulMileageRangeMinQuantity: 123,
      lineHaulMileageRangeMaxQuantity: 123,
      unitOfMeasurement: {
        code: 'abc',
        lineHaulWeightRangeMinQuantity: '123',
        lineHaulWeightRangeMaxQuantity: '400'
      },
      hazmatIncludedIndicator: 'Yes',
      fuelIncludedIndicator: 'Yes',
      autoInvoiceIndicator: 'Yes',
      equipmentRequirementSpecificationAssociationID: 123,
      equipmentClassificationCode: 'string',
      equipmentClassificationCodeDescription: 'string',
      equipmentTypeCode: 'string',
      equipmentClassificationDescription: 'string',
      equipmentTypeCodeDescription: 'string',
      equipmentLengthQuantity: 123,
      unitOfEquipmentLengthMeasurementCode: 'string'
    };
    agreementUtility = TestBed.get(ViewAgreementDetailsUtility);
    broadcasterService = TestBed.get(BroadcasterService);
    route = TestBed.get(ActivatedRoute);
    agreementUtility.nameConfigurationDetails = { 'customerLineHaulConfigurationID': 234, 'customerAgreementName': 'ABC' };
    agreementUtility.dateRangeValues = { 'effectiveDate': '01/01/2019', 'expirationDate': '01/01/2099' };
    fixture = TestBed.createComponent(AdditionalInfoComponent);
    component = fixture.componentInstance;
    component.additionalInfoModel.lineHaulConfigurationId = 254;
    component.additionalInfoModel.sectionId = '234';
    component.additionalInfoModel.customerAgreementId = '234';
    service = fixture.debugElement.injector.get(AdditionalInfoService);
    labelValue = {
      label: 1,
      value: 'abc'
    };
    formGroup = formBuilder.group({
      billToCode: [''],
      carrierCode: [''],
      mileagePreference: [''],
      mileageRangeFrom: ['1,000'],
      mileageRangeTo: ['5,000'],
      weightRangeFrom: ['1,000'],
      weightRangeTo: ['5,000'],
      weightUnitOfMeasure: ['']
    });
    overridenForm = formBuilder.group({
      priority: ['1']
    });
    billtoCodesList = {
      label: 'string',
      value: {
        billToID: 1,
        billToCode: 'string',
        billToName: 'string'
      }
    };
    reqParam = {
      status: 'string',
      message: 'string',
      customerLineHaulConfigurationID: 1223,
      duplicateFlag: true,
      existingOverriddenPriorityNumber: 12,
      overridenPriorityNumber: 12,
      duplicateErrorMessage: 'string',
      priorityNumber: 12,
      billTos: [{
        billToID: 12,
        billToCode: 'string',
        billToName: 'string'
      }],
      carriers: [{
        id: 12,
        name: 'string',
        code: 'string'
      }],
      mileagePreference: {
        mileagePreferenceID: 12,
        mileagePreferenceName: 'string',
        mileagePreferenceMinRange: 12,
        mileagePreferenceMaxRange: 12
      },
      unitOfWeightMeasurement: {
        code: 'string',
        description: 'string',
        lineHaulWeightRangeMinQuantity: 12,
        lineHaulWeightRangeMaxQuantity: 12
      },
      hazmatIncludedIndicator: 'string',
      fuelIncludedIndicator: 'string',
      autoInvoiceIndicator: 'string'
    };
    component.additionalInfoModel = additionalInfoModel;
    component.additionalInfoModel.linehaulOverviewData = lineHaulValues;
    component.additionalInfoModel.additionalInformationForm = formGroup;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call on init', () => {
    component.additionalInfoModel.additionalInformationForm = formGroup;
    component.additionalInfoModel.availablePriorityOrder = 1;
    component.additionalInfoModel.lineHaulConfigurationDetails['lineHaulConfigurationID'] = 234;
    component.additionalInfoModel.MileageList = [{
      label: 12,
      value: 'string'
    }, {
      label: 12,
      value: 'string'
    }];
    component.additionalInfoModel.additionalInfoReqParam['mileagePreference'] = {};
    spyOn(CarrierQuery, 'carrierData').and.callThrough();
    spyOn(service, 'getCarriers').and.callThrough();
    spyOn(service, 'getMileagePreferences').and.callThrough();
    spyOn(service, 'getWeightUnits').and.callThrough();
    component.ngOnInit();
  });
  it('should call onBlurWeightUnit for first and third if blocks', () => {
    component.additionalInfoModel.weightInvalidFlag = false;
    component.additionalInfoModel.weightInputFlag = false;
    component.additionalInfoModel.weightMinRange = 1;
    component.additionalInfoModel.weightMaxRange = 1;
    component.additionalInfoModel.unitOfWeight = '';
    component.onBlurWeightUnit();
  });
  it('should call onBlurWeightUnit for second if block', () => {
    component.additionalInfoModel.weightMinRange = 0;
    component.additionalInfoModel.weightMaxRange = 0;
    component.additionalInfoModel.unitOfWeight = 'true';
    component.onBlurWeightUnit();
  });
  it('should call removePrecision', () => {
    const event = {
      target: {
        value: 'true, false'
      }
    };
    component.additionalInfoModel.additionalInformationForm = formGroup;
    component.removePrecision(event, 'mileageRangeFrom');
  });
  it('should call back', () => {
    component.onClickBack();
  });
  it('should call thousandSeperator', () => {
    AdditionalInfoUtility.thousandSeperator('100,000');
  });
  it('should call review', () => {
    component.additionalInfoModel.unitOfWeight = 'Miles';
    component.onClickReview('Save Draft');
  });
  it('should call cancel', () => {
    component.onClickCancel();
  });
  it('should call dont save', () => {
    component.reviewUrl = '/viewagreement/review';
    component.additionalInfoModel.routingUrl = component.reviewUrl;
    component.additionalInfoModel.customerAgreementId = '123';
    spyOn(service, 'saveDraftInfo').and.callThrough();
    component.onClickDontSave();
  });
  it('should call dont save override', () => {
    component.onClickDontSaveOverride();
  });
  it('should call add new', () => {
    component.additionalInfoModel.additionalInfoReqParam = {
      duplicateFlag: null,
      overridenPriorityNumber: null,
      existingOverriddenPriorityNumber: null,
      duplicateErrorMessage: null,
      priorityNumber: null,
      billTos: [],
      carriers: [],
      mileagePreference: null,
      unitOfWeightMeasurement: null,
      hazmatIncludedIndicator: 'N',
      fuelIncludedIndicator: 'N',
      autoInvoiceIndicator: '',
      customerLineHaulConfigurationID: null,
    };
    component.additionalInfoModel.isDraft = 'Yes';
    spyOn(service, 'saveAdditionalInfo').and.callThrough();
    component.onClickAddNew();
  });
  it('should call on change bill to code', () => {
    const event = {
      value: ['10', '20']
    };
  });
  it('should call on change carrier', () => {
    const event = {
      value: ['10', '20']
    };
    component.onChangeCarriers(event);
  });
  it('should call on change carrier else condition', () => {
    const event = {
      value: []
    };
    component.onChangeCarriers(event);
  });
  it('should call on change checkbox list Hazmat Included case', () => {
    const event = {
      value: ['10', '20']
    };
    component.onChangeCheckboxList(event, 'Hazmat Included');
  });
  it('should call on change checkbox list Fuel Included case', () => {
    const event = {
      value: ['10', '20']
    };
    component.onChangeCheckboxList(event, 'Fuel Included');
  });
  it('should call on change checkbox list Auto Invoice case', () => {
    const event = {
      value: ['10', '20']
    };
    component.onChangeCheckboxList(event, 'Auto Invoice');
  });
  it('should call on change checkbox list default case', () => {
    const event = {
      value: ['10', '20']
    };
    component.onChangeCheckboxList(event, 'Auto');
  });
  it('should call on blur range', () => {
    component.additionalInfoModel.maxLimit = 1000;
    const event = {
      target: { value: '10' }
    };

    component.onBlurRange(event, 'weightRangeFrom');
  });
  it('should call on blur range', () => {
    component.additionalInfoModel.maxLimit = 1000;
    const event = {
      target: { value: '10' }
    };

    component.onBlurRange(event, 'weightRangeTo');
  });
  it('should call on blur range', () => {
    component.additionalInfoModel.maxLimit = 1000;
    const event = {
      target: { value: '10' }
    };

    component.onBlurRange(event, 'mileageRangeFrom');
  });
  it('should call on blur range', () => {
    component.additionalInfoModel.maxLimit = 1000;
    const event = {
      target: { value: '10' }
    };

    component.onBlurRange(event, 'mileageRangeTo');
  });
  it('should call on clear drop down mileagePreference case', () => {
    component.additionalInfoModel.additionalInfoReqParam = reqParam;
    component.additionalInfoModel.additionalInformationForm = formGroup;
    component.onClearDropDown('mileagePreference');
  });
  it('should call on clear drop down mileagePreference else condition', () => {
    reqParam.mileagePreference = null;
    component.additionalInfoModel.additionalInfoReqParam = reqParam;
    component.additionalInfoModel.additionalInformationForm = formGroup;
    component.onClearDropDown('mileagePreference');
  });
  it('should call on clear drop down priority case', () => {
    component.onClearDropDown('priority');
  });
  it('should call on clear drop down weightUnitOfMeasure case', () => {
    component.additionalInfoModel.additionalInfoReqParam = reqParam;
    component.additionalInfoModel.additionalInformationForm = formGroup;
    component.onClearDropDown('weightUnitOfMeasure');
  });
  it('should call on clear drop down weightUnitOfMeasure case', () => {
    reqParam.unitOfWeightMeasurement = null;
    component.additionalInfoModel.additionalInfoReqParam = reqParam;
    component.additionalInfoModel.additionalInformationForm = formGroup;
    component.onClearDropDown('weightUnitOfMeasure');
  });
  it('should call on clear drop down default case', () => {
    component.onClearDropDown('weightUnit');
  });
  it('should call on save addition info success', () => {
    component.saveAdditionInfoSucess(reqParam);
  });
  it('should call on save addition info success flag false', () => {
    const param = reqParam;
    param.duplicateFlag = false;
    component.saveAdditionInfoSucess(param);
  });
  it('should call on save addition info warning else case', () => {
    component.additionalInfoModel.isbackBtnclicked = true;
    component.additionalInfoModel.lineHaulConfigurationId = 123;
    component.additionalInfoModel.editLineHaulData = {
      lineHaulDetails: lineHaulValues,
      isEditFlag: true
    };
    component.noDuplicateResponse(reqParam);
  });
  it('should call on save addition info warning if condition, success status', () => {
    component.additionalInfoModel.reviewWizardStatus = {
      isLaneCardInfo: true,
      isLineHaulReviewed: true,
      isAdditionalInfo: true
    };
    component.additionalInfoModel.isbackBtnclicked = false;
    const param = reqParam;
    param.status = 'success';
    component.noDuplicateResponse(reqParam);
  });
  it('should call on save addition info warning if condition, warning status', () => {
    component.additionalInfoModel.reviewWizardStatus = {
      isLaneCardInfo: true,
      isLineHaulReviewed: true,
      isAdditionalInfo: true
    };
    component.additionalInfoModel.isbackBtnclicked = false;
    const param = reqParam;
    param.status = 'warning';
    component.noDuplicateResponse(reqParam);
  });
  it('should call routeQueryParams', () => {
    const response = {
      id: 123,
      sectionID: 12
    };
    spyOn(route, 'queryParams').and.returnValue(of(response));
    component.routeQueryParams();
  });
  it('should call routeQueryParams else', () => {
    const response = {
      'id': {},
      'sectionID': {}
    };
    spyOn(route, 'queryParams').and.returnValue(of(response));
    component.routeQueryParams();
  });
  it('should call on add new success', () => {
    const response = {
      status: 'success',
      message: 'SUCCESS'
    };
    component.additionalInfoModel.customerAgreementId = '123';
    component.addNewSuccess(response);
  });
  it('should call on add new warning', () => {
    const response = {
      status: 'warning',
      message: 'WARNING'
    };
    component.additionalInfoModel.customerAgreementId = '123';
    component.addNewSuccess(response);
  });
  it('should call on add new error', () => {
    const response = {
      status: 'error',
      message: 'ERROR'
    };
    component.additionalInfoModel.customerAgreementId = '123';
    component.addNewSuccess(response);
  });
  it('should call additionalInfoFormInitialization', () => {
    component.additionalInfoFormInitialization();
  });
  it('should call on click override', () => {
    component.onClickOverride();
  });
  it('should call on set errors', () => {
    component.setValidErrors('mileageRangeFrom', 'mileageRangeTo');
  });
  it('should call validateRange', () => {
    component.validateRange('99', 'mileageRangeFrom', 'mileageRangeFrom', 'mileageRangeTo');
  });
  it('should call validateRange', () => {
    component.validateRange('99', 'carrierCode', 'mileageRangeFrom', 'mileageRangeTo');
  });
  it('should call validateRange', () => {
    component.validateRange('99,9true', 'mileageRangeFrom', 'mileageRangeFrom', 'mileageRangeTo');
  });
  it('should call validateRange', () => {
    component.validateRange('99,9true', 'carrierCode', 'mileageRangeFrom', 'mileageRangeTo');
  });
  it('should call validateRange', () => {
    component.validateRange(false, 'mileageRangeFrom', 'mileageRangeFrom', 'mileageRangeTo');
  });
  it('should call validateRange', () => {
    component.validateRange(false, 'carrierCode', 'mileageRangeFrom', 'mileageRangeTo');
  });
  it('should call checkMinMaxRange', () => {
    component.additionalInfoModel.maxLimit = 10000;
    component.additionalInfoModel.additionalInformationForm = formGroup;
    component.checkMinMaxRange('mileageRangeFrom', 'mileageRangeTo', 'mileageRangeTo');
  });
  it('should call checkMinMaxRange', () => {
    component.additionalInfoModel.maxLimit = 10000;
    component.additionalInfoModel.additionalInformationForm = formGroup;
    component.checkMinMaxRange('mileageRangeFrom', 'mileageRangeTo', 'weightRangeFrom');
  });
  it('should call checkMinMaxRange', () => {
    component.additionalInfoModel.maxLimit = 10000;
    component.additionalInfoModel.additionalInformationForm = formGroup;
    component.checkMinMaxRange('mileageRangeTo', 'mileageRangeFrom', 'weightRangeFrom');
  });
  it('should call checkMinMaxRange', () => {
    component.additionalInfoModel.maxLimit = 10000;
    component.additionalInfoModel.additionalInformationForm = formGroup;
    component.checkMinMaxRange('mileageRangeTo', 'mileageRangeFrom', 'mileageRangeTo');
  });
  it('should call checkMinMaxRange', () => {
    component.additionalInfoModel.maxLimit = 10000;
    formGroup.controls['mileageRangeTo'].setValue('12..234');
    component.additionalInfoModel.additionalInformationForm = formGroup;
    component.checkMinMaxRange('mileageRangeTo', 'mileageRangeFrom', 'mileageRangeTo');
  });
  it('should call checkMinMaxRange', () => {
    component.additionalInfoModel.maxLimit = 10000;
    formGroup.controls['mileageRangeTo'].setValue('12..234');
    component.additionalInfoModel.additionalInformationForm = formGroup;
    component.checkMinMaxRange('mileageRangeTo', 'mileageRangeFrom', 'weightRangeFrom');
  });
  it('should call getMileagePreferenceList', () => {
    component.additionalInfoModel.additionalInformationForm = formGroup;
    const event = {
      query: 'ab'
    };
    component.getMileagePreferenceList(event);
  });
  it('should call fetchMileagePreference', () => {
    const response = [
      {
        mileagePreferenceID: 1,
        mileagePreferenceName: 'string',
        mileagePreferenceMinRange: 1,
        mileagePreferenceMaxRange: 1
      }
    ];
    component.additionalInfoModel.MileageList = [];
    spyOn(service, 'getMileagePreferences').and.returnValue(of(response));
    component.fetchMileagePreference();
  });
  it('should call noDuplicateResponse', () => {
    component.additionalInfoModel.additionalInformationForm = formGroup;
    component.additionalInfoModel.isbackBtnclicked = false;
    component.noDuplicateResponse(reqParam);
  });
  it('should call noDuplicateResponse', () => {
    component.additionalInfoModel.additionalInformationForm = formGroup;
    component.additionalInfoModel.isbackBtnclicked = false;
    component.noDuplicateResponse(reqParam);
  });
  it('should call noDuplicateResponse', () => {
    const reqParams = {
      status: '',
      message: 'string',
      customerLineHaulConfigurationID: 1223,
      duplicateFlag: false,
      existingOverriddenPriorityNumber: 12,
      overridenPriorityNumber: 12,
      duplicateErrorMessage: 'string',
      priorityNumber: 12,
      billTos: [{
        billToID: 12,
        billToCode: 'string',
        billToName: 'string'
      }],
      carriers: [{
        id: 12,
        name: 'string',
        code: 'string'
      }],
      mileagePreference: {
        mileagePreferenceID: 12,
        mileagePreferenceName: 'string',
        mileagePreferenceMinRange: 12,
        mileagePreferenceMaxRange: 12
      },
      unitOfWeightMeasurement: {
        code: 'string',
        description: 'string',
        lineHaulWeightRangeMinQuantity: 12,
        lineHaulWeightRangeMaxQuantity: 12
      },
      hazmatIncludedIndicator: 'string',
      fuelIncludedIndicator: 'string',
      autoInvoiceIndicator: 'string'
    };
    component.additionalInfoModel.additionalInformationForm = formGroup;
    component.additionalInfoModel.isbackBtnclicked = false;
    component.noDuplicateResponse(reqParams);
  });
  it('should call constructReviewData', () => {
    component.additionalInfoModel.additionalInformationForm = formGroup;
    component.additionalInfoModel.additionalInfoReqParam = reqParam;
    component.constructReviewData('Y');
  });
  it('should call constructReviewData elses of private functions', () => {
    component.additionalInfoModel.additionalInformationForm = formGroup;
    component.additionalInfoModel.additionalInfoReqParam = reqParam;
    component.additionalInfoModel.additionalInfoReqParam['unitOfWeightMeasurement'] = null;
    component.additionalInfoModel.additionalInfoReqParam['mileagePreference'] = null;
    component.additionalInfoModel.mileageInvalidFlag = false;
    component.constructReviewData('Y');
  });
  it('should call fetchCarrierList', () => {
    component.additionalInfoModel.additionalInformationForm = formGroup;
    const response = {
      took: 12,
      timed_out: false,
      _shards: {
        total: 12,
        successful: 12,
        skipped: 0,
        failed: 0
      },
      hits: {
        total: 12,
        max_score: 15,
        hits: [{
          _index: 'string',
          _type: 'string',
          _id: 'string',
          _score: 'string',
          _source: {
            LegalName: 'string',
            CarrierID: 12,
            CarrierCode: 'string'
          }
        }]
      }
    };
    spyOn(service, 'getCarriers').and.returnValue(of(response));
    component.fetchCarrierList();
  });
  it('should call filterPriority', () => {
    const param = {
      query: 'abc'
    };
    component.additionalInfoModel.filterOverride = [{
      label: '2',
      value: '3'
    }];
    component.filterPriority(param);
  });
  it('should call filterPriority else', () => {
    const param = {
      query: 'abc'
    };
    component.additionalInfoModel.filterOverride = [{
      label: 'abcd',
      value: 'abcd'
    }];
    component.filterPriority(param);
  });
  it('should call onClickOverrideSave', () => {
    component.additionalInfoModel.overrideForm = overridenForm;
    spyOn(service, 'saveAdditionalInfo').and.callThrough();
    component.onClickOverrideSave();
  });
  it('should call onClickOverrideSave', () => {
    component.additionalInfoModel.overrideForm = overridenForm;
    component.additionalInfoModel.overrideForm.controls.priority.setValue(false);
    spyOn(service, 'saveAdditionalInfo').and.callThrough();
    component.onClickOverrideSave();
  });
  it('should call onSelectOverriddenPriority', () => {
    component.additionalInfoModel.overrideForm = overridenForm;
    component.additionalInfoModel.additionalInfoReqParam = reqParam;
    component.additionalInfoModel.availablePriorityOrder = 2;
    component.onSelectOverriddenPriority();
  });
  it('should call onClickConfirmOverride', () => {
    component.additionalInfoModel.overrideForm = overridenForm;
    spyOn(service, 'saveAdditionalInfo').and.callThrough();
    component.onClickConfirmOverride();
  });
  it('should call priorityFramer', () => {
    component.priorityFramer(2);
  });
  it('should call priorityFramer with 0', () => {
    component.priorityFramer(0);
  });
  it('should call saveOverRiddenPriority with 0', () => {
    spyOn(service, 'saveAdditionalInfo').and.returnValue(of(reqParam));
    component.saveOverRiddenPriority();
  });
  it('should call saveOverRiddenPriorityOnSuccess with 0', () => {
    component.saveOverRiddenPriorityOnSuccess(reqParam);
  });
  it('should call onCancelPriority with 0', () => {
    component.onCancelPriority();
  });
  it('should call setPatchValuesForEdit', () => {
    agreementUtility.lineHaulStatus = {
      isLineHaulEdit: true
    };
    lineHaulValues.autoInvoiceIndicator = 'Yes';
    lineHaulValues.hazmatIncludedIndicator = 'Yes';
    lineHaulValues.fuelIncludedIndicator = 'Yes';
    broadcasterService.broadcast('linehaulOverView', lineHaulValues);
    component.setPatchValuesForEdit();
  });
  it('should call setPatchValuesForEdit for getmileagerange else', () => {
    agreementUtility.lineHaulStatus = {
      isLineHaulEdit: true
    };
    lineHaulValues.autoInvoiceIndicator = 'Yes';
    lineHaulValues.hazmatIncludedIndicator = 'Yes';
    lineHaulValues.fuelIncludedIndicator = 'Yes';
    lineHaulValues.mileagePreference['mileagePreferenceMinRange'] = null;
    broadcasterService.broadcast('linehaulOverView', lineHaulValues);
    component.setPatchValuesForEdit();
  });
  xit('should call setPatchValuesForEdit for setMinWeightRange else', () => {
    agreementUtility.lineHaulStatus = {
      isLineHaulEdit: true
    };
    lineHaulValues.autoInvoiceIndicator = 'Yes';
    lineHaulValues.hazmatIncludedIndicator = 'Yes';
    lineHaulValues.fuelIncludedIndicator = 'Yes';
    lineHaulValues.unitOfMeasurement['lineHaulWeightRangeMinQuantity'] = null;
    broadcasterService.broadcast('linehaulOverView', lineHaulValues);
    component.setPatchValuesForEdit();
  });
  xit('should call setIndicators', () => {
    lineHaulValues.autoInvoiceIndicator = 'Yes';
    lineHaulValues.hazmatIncludedIndicator = 'Yes';
    lineHaulValues.fuelIncludedIndicator = 'Yes';
    component.setIndicators(lineHaulValues);
  });
  it('should call setIndicators else conditions', () => {
    lineHaulValues.autoInvoiceIndicator = 'Yes';
    lineHaulValues.hazmatIncludedIndicator = 'Yes';
    lineHaulValues.fuelIncludedIndicator = 'Yes';
    component.setIndicators(lineHaulValues);
  });
  it('should call onClickBack', () => {
    component.additionalInfoModel.additionalInformationForm = formGroup;
    component.additionalInfoModel.additionalInfoReqParam = reqParam;
    component.additionalInfoModel.additionalInfoReqParam['unitOfWeightMeasurement'] = null;
    component.additionalInfoModel.additionalInfoReqParam['mileagePreference'] = null;
    component.additionalInfoModel.mileageInvalidFlag = false;
    component.onClickBack();
  });
  it('should call removeDelimiters', () => {
    component.removeDelimiters('5,000');
  });
  it('should call removeDelimiters', () => {
    component.removeDelimiters('');
  });
  it('should call setagreementDetails', () => {
    component.additionalInfoModel.customerAgreementId = '123';
    component.additionalInfoModel.sectionId = '123';
    component.additionalInfoModel.linehaulDetailData = {
      customerAgreementID: '123',
      customerAgreementName: 'string',
      customerAgreementContractSectionID: '234 ',
      customerLineHaulConfigurationID: 123
    };
    component.setagreementDetails();
  });
  it('should call getEditBillToCodeList', () => {
    component.additionalInfoModel.billToCodeList = [
      {
        label: 'string',
        value: {
          billToID: 123,
          billToCode: 'string',
          billToName: 'string'
        }
      }];
      AdditionalInfoUtility.getEditBillToCodeList(lineHaulValues, component.additionalInfoModel);
  });
  it('should call getEditBillToCodeList', () => {
    component.additionalInfoModel.billToCodeList = [
      {
        label: 'string',
        value: {
          billToID: 1,
          billToCode: 'string',
          billToName: 'string'
        }
      }];
      AdditionalInfoUtility.getEditBillToCodeList(lineHaulValues, component.additionalInfoModel);
  });
  it('should call getEditBillToCodeList', () => {
    lineHaulValues.billTos = [];
    component.additionalInfoModel.billToCodeList = [
      {
        label: 'string',
        value: {
          billToID: 123,
          billToCode: 'string',
          billToName: 'string'
        }
      }];
      AdditionalInfoUtility.getEditBillToCodeList(lineHaulValues, component.additionalInfoModel);
  });
  it('should call getEditCarrierCodeList', () => {
    component.additionalInfoModel.carrierList = [
      {
        label: 'string',
        value: {
          id: '123',
          billToCode: 'string',
          billToName: 'string'
        }
      }];
      AdditionalInfoUtility.getEditCarrierCodeList(lineHaulValues, component.additionalInfoModel);
  });
  it('should call getEditCarrierCodeList', () => {
    component.additionalInfoModel.carrierList = [
      {
        label: 'string',
        value: {
          id: '143',
          billToCode: 'string',
          billToName: 'string'
        }
      }];
      AdditionalInfoUtility.getEditCarrierCodeList(lineHaulValues, component.additionalInfoModel);
  });
  it('should call getEditCarrierCodeList', () => {
    lineHaulValues.carriers = [];
    component.additionalInfoModel.carrierList = [
      {
        label: 'string',
        value: {
          id: '123',
          billToCode: 'string',
          billToName: 'string'
        }
      }];
      AdditionalInfoUtility.getEditCarrierCodeList(lineHaulValues, component.additionalInfoModel);
  });
  it('should call backBtnNavigation', () => {
    component.additionalInfoModel.lineHaulConfigurationId = 123;
    component.additionalInfoModel.editLineHaulData = {
      lineHaulDetails: 'abc',
      isEditFlag: true
    };
    component.backBtnNavigation();
  });
  it('should call showSuccessMsg', () => {
    component.showSuccessMsg();
  });
  it('should call displaySuccessMsg', () => {
    component.displaySuccessMsg();
  });
});
