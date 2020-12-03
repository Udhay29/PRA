import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';

import { AppModule } from '../../../../app.module';
import { ViewAgreementDetailsModule } from './../../view-agreement-details.module';
import { AddLineHaulComponent } from './add-line-haul.component';
import { AddLineHaulModel } from './model/add-line-haul.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  FormBuilder, FormArray, Validators, FormsModule,
  ReactiveFormsModule, FormGroup, FormControl, AbstractControl
} from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';

import { of } from 'rxjs/index';
import { MessageService } from 'primeng/components/common/messageservice';
import { LaneCardService } from './lane-card/services/lane-card.service';
import { RateComponent } from './rate/rate.component';
import { OverviewComponent } from './overview/overview.component';
import { LaneCardComponent } from './lane-card/lane-card.component';
import { ViewAgreementDetailsUtility } from './../../service/view-agreement-details-utility';
import { LocalStorageService } from './../../../../shared/jbh-app-services/local-storage.service';
import { componentNeedsResolution } from '@angular/core/src/metadata/resource_loading';


describe('AddLineHaulComponent', () => {
  let component: AddLineHaulComponent;
  let fixture: ComponentFixture<AddLineHaulComponent>;
  const stopValues = {
    isStopChargeIncluded: true,
    stops: [{
      geographyPointTypeID: 12,
      stopLocationPointID: 123,
      stopSequenceNumber: 1234
    }]
  };
  let messageService: MessageService;
  let laneCardService: LaneCardService;
  let utilityService: ViewAgreementDetailsUtility;
  let laneCardParams;
  let payload;
  let editLineHaulDetails;
  const formBuilder: FormBuilder = new FormBuilder();
  let rateFormGroup: FormGroup;
  let stopsForm: FormGroup;
  let laneCardForm: FormGroup;
  let localStorageService: LocalStorageService;
  const agreementDetails = {
    'customerAgreementID': 134, 'customerAgreementName': 'The Home Depot Inc (HDAT)',
    'agreementType': 'Customer', 'ultimateParentAccountID': 39617, 'currencyCode': 'USD', 'cargoReleaseAmount': '$250,000',
    'businessUnits': ['JBI', 'JBT', 'ICS', 'DCS'], 'taskAssignmentIDs': null, 'effectiveDate': '1995-01-01',
    'expirationDate': '2099-12-31', 'invalidIndicator': 'N', 'invalidReasonTypeName': 'Active'
  };
  const dateValues = {
    agreementDetails: {
      agreementType: 'Customer',
      businessUnits: ['JBI', 'JBT', 'ICS', 'DCS'],
      cargoReleaseAmount: '$100,000',
      currencyCode: 'USD',
      customerAgreementID: 27,
      customerAgreementName: 'Adams Cable Equipment (ADLE59)',
      effectiveDate: '1995-01-01',
      expirationDate: '2099-12-31',
      invalidIndicator: 'N',
      invalidReasonTypeName: 'Active',
      taskAssignmentIDs: null,
      ultimateParentAccountID: 45667
    },
    breadCrumbList: [{
      label: 'Pricing',
      routerLink: ['/dashboard']
    }],
    confirmationFlag: false,
    dateRangeValues: {
      effectiveDate: '2019-05-09',
      expirationDate: '2019-05-21'
    },
    effectiveDate: '2019-05-09',
    expirationDate: '2019-05-21',
    inValidDate: false,
    inValidEffDate: false,
    inValidExpDate: false,
    isCancel: false,
    isChangesSaving: true,
    isDetailsSaved: false,
    isSaveDraft: false,
    isSubscribeFlag: false,
    laneCardFlag: true,
    lineHaulConfigurationID: 2275,
    lineHaulForm: FormGroup,
    lineHaulSourceType: [{
      label: 'Advisor',
      value: 1
    }, {
      label: 'File',
      value: 2
    }, {
      label: 'Copy',
      value: 3
    }, {
      label: 'Manual',
      value: 4
    }],
    routingUrl: '/viewagreement/additionalInfo?id=27&sectionID=45',
    sourceValue: {
      label: 'Manual',
      value: 4
    }
  };
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, MessageService, LaneCardService, LocalStorageService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLineHaulComponent);
    component = fixture.componentInstance;
    component.addLineHaulModel.lineHaulIds = [123, 124];
    fixture.detectChanges();
    messageService = TestBed.get(MessageService);
    laneCardService = TestBed.get(LaneCardService);
    localStorageService = TestBed.get(LocalStorageService);
    const lineHaulId = 1;
    localStorageService.setLineHaulIds(lineHaulId);
    utilityService = TestBed.get(ViewAgreementDetailsUtility);
    fixture.detectChanges();
    const amountPattern = '[-0-9., ]*';
    rateFormGroup = formBuilder.group({
      sourceIdentifier: new FormControl('', Validators.pattern(amountPattern)),
      sourceLineHaulIdentifier: new FormControl('', Validators.pattern(amountPattern)),
      rates: new FormArray([new FormGroup({
        type: new FormControl('', Validators.required),
        amount: new FormControl('1', [Validators.required, Validators.pattern(amountPattern)]),
        minAmount: new FormControl('2', [Validators.pattern(amountPattern)]),
        maxAmount: new FormControl('3', [Validators.pattern(amountPattern)]),
        currency: new FormControl('USD', Validators.required)
      }),
      new FormGroup({
        type: new FormControl('aaa', Validators.required),
        amount: new FormControl('1', [Validators.required, Validators.pattern(amountPattern)]),
        minAmount: new FormControl('2', [Validators.pattern(amountPattern)]),
        maxAmount: new FormControl('3', [Validators.pattern(amountPattern)]),
        currency: new FormControl('USD', Validators.required)
      })
      ]),
      groupRateType: new FormControl('123'),
      isGroupRateItemize: new FormControl(false)
    });
    stopsForm = formBuilder.group({
      isStopChargeIncluded: new FormControl(false),
      stops: new FormArray([new FormGroup({
        type: new FormControl('Address', Validators.required),
        country: new FormControl('USA', Validators.required),
        point: new FormControl('aaa', Validators.required)
      })
      ])
    });
    component.rate.rateModel.rateForm = rateFormGroup;
    component.rate.rateModel.rateForm.controls['groupRateType'].setValue({ 'label': 'Sum', 'value': 1 });
    component.rate.rateModel.rateForm.controls.rates.at(0).controls.type.setValue({ 'label': 'Flat', 'value': 2 });
    component.rate.rateModel.rateForm.controls.rates.at(1).controls.type.setValue({ 'label': 'Cwt', 'value': 1 });
    const stopGroup = formBuilder.group({
      type: [''],
      country: [''],
      point: ['']
    });
    component.stops.stopsModel.stopsForm = formBuilder.group({
      isStopChargeIncluded: [false],
      stops: formBuilder.array([stopGroup, stopGroup])
    });
    component.stops.stopsModel.stopsForm.controls.stops.at(0).controls.type.setValue({ 'label': 'Address', 'value': 3 });
    component.stops.stopsModel.stopsForm.controls.stops.at(0).controls.point.setValue({
      'label':
        `4220 Sanders Ave, Laredo, TX 78041, USA`, 'value': 1665025
    });
    component.stops.stopsModel.stopsForm.controls.stops.at(0).controls.country.setValue({
      'label': 'USA', 'value': { 'code': 'USA', 'id': 184 }
    });
    component.stops.stopsModel.stopsForm.controls.stops.at(1).controls.type.setValue({ 'label': 'Address', 'value': 3 });
    component.stops.stopsModel.stopsForm.controls.stops.at(1).controls.point.setValue({
      'label':
        `4220 Sanders Ave, Laredo, TX 78041, USA`, 'value': 1665025
    });
    component.stops.stopsModel.stopsForm.controls.stops.at(1).controls.country.setValue({
      'label': 'USA', 'value': { 'code': 'USA', 'id': 184 }
    });

    component.overview.overviewModel.overviewForm = formBuilder.group({
      sectionValue: [''],
      businessUnit: [''],
      serviceOffering: [''],
      serviceLevel: [''],
      operationalServices: [''],
      equipmentCategory: [''],
      equipmentType: [''],
      equipmentLength: [''],
      awardStatus: [''],
      overriddenPriority: ['']
    });

    component.overview.overviewModel.overviewForm.controls['businessUnit'].setValue({ 'label': 'DCS', 'value': 'DCS' });
    component.overview.overviewModel.overviewForm.controls['serviceOffering'].setValue({
      'label': 'Dedicated', 'value': 'Dedicated', 'id': '5'
    });
    component.overview.overviewModel.overviewForm.controls['awardStatus'].setValue({ 'label': 'Routeguide', 'value': '2' });
    component.overview.overviewModel.overviewForm.controls['equipmentCategory'].setValue({ 'label': 'CHASSIS', 'value': 'Chassis' });
    component.overview.overviewModel.overviewForm.controls['serviceLevel'].setValue({ 'label': 'Standard', 'value': 'Standard', 'id': 12 });
    component.overview.overviewModel.overviewForm.controls['sectionValue'].setValue({ 'label': 'sectionA', 'value': 498 });
    component.overview.overviewModel.overviewForm.controls['operationalServices'].setValue(['Team']);
    component.overview.overviewModel.overviewForm.controls['equipmentType'].setValue({ 'label': 'DOLLY', 'value': 'Dolly' });
    component.overview.overviewModel.overviewForm.controls['overriddenPriority'].setValue({ 'label': 1, 'value': 1 });
    component.overview.overviewModel.overviewForm.controls['equipmentLength'].setValue({
      'label': '123', 'value': '123', 'id': '5', 'code': 'abc', 'specificationId': 123
    });
    laneCardParams = {
      destinationAddressLine1: '417 Scottys Way',
      destinationAddressLine2: null,
      destinationCityName: 'Bowling Green',
      destinationCountry: 'USA',
      destinationCountryCode: 'USA',
      destinationCountryName: 'USA',
      destinationDescription: null,
      destinationPoint: '417 Scottys Way, Bowling Green, KY, 42101, USA',
      destinationPointID: 1665057,
      destinationPointTypeID: 3,
      destinationPostalCode: '42101',
      destinationStateCode: 'KY',
      destinationStateName: 'Kentucky',
      destinationVendorID: null,
      originAddressLine1: '16666 S Highland Ave',
      originAddressLine2: '',
      originCityName: 'Fontana',
      originCountry: 'USA',
      originCountryCode: 'USA',
      originCountryName: 'USA',
      originDescription: null,
      originPoint: '16666 S Highland Ave, Fontana, CA, 923361213, USA',
      originPointID: 52509,
      originPointTypeID: 3,
      originPostalCode: '923361213',
      originStateCode: 'CA',
      originStateName: 'California',
      originVendorID: null
    };
    payload = {
      laneDTO: laneCardParams,
      overViewDTO: {
        billToCode: null,
        customerAgreementContractSectionID: 44,
        customerLineHaulOperationalServiceID: null,
        equipmentClassificationCode: 'Chassis',
        equipmentLengthQuantity: 48,
        equipmentRequirementSpecificationAssociationID: 450,
        equipmentTypeCode: 'Chassis',
        lineHaulAwardStatusTypeID: 1,
        lineHaulAwardStatusTypeName: 'Primary',
        overriddenPriorityLevelNumber: null,
        priorityLevelNumber: 65,
        serviceLevelID: null,
        serviceOfferingID: 5,
        serviceTypeCodes: [],
        transitModeID: 4,
        unitOfEquipmentLengthMeasurementCode: 'Feet'
      },
      customerLineHaulStops: [],
      stopChargeIncludedIndicator: null,
      lineHaulEffectiveDate: '2019-05-09',
      lineHaulExpirationDate: '2019-05-21',
      sourceID: null,
      sourceLineHaulID: null,
      groupRateTypeID: 2,
      groupRateTypeName: 'Lesser',
      groupRateItemizeIndicator: null,
      lineHaulSourceTypeID: 4,
      customerLineHaulRateDTOs: [{
        chargeUnitTypeName: 'Per Kilometer',
        currencyCode: 'USD',
        lineHaulChargeUnitTypeID: 4,
        maximumAmount: null,
        minimumAmount: null,
        rateAmount: 12
      }],
      lineHaulSourceTypeName: 'Manual',
      customerLineHaulConfigurationID: 5
    };
    editLineHaulDetails = {
      lineHaulConfigurationID: 1814,
      laneID: 4488,
      lineHaulSourceTypeID: 4,
      lineHaulSourceTypeName: 'Manual ',
      origin: {
        country: null,
        description: null,
        point: null,
        pointID: 1686067,
        type: 'Address',
        typeID: 3,
        vendorID: null
      },
      destination: {
        country: null,
        description: null,
        point: null,
        pointID: 90894,
        type: 'Address',
        typeID: 3,
        vendorID: null
      },
      stops: [{
        stopSequenceNumber: 123,
        stopTypeName: 'aaa',
        stopTypeID: 123,
        stopCountry: 'USA',
        stopPoint: 'point',
        stopPointID: 123
      }],
      stopChargeIncludedIndicator: false,
      status: 'Draft',
      effectiveDate: '2019-05-09',
      expirationDate: '2019-05-28',
      agreementID: 27,
      agreementName: 'Adams Cable Equipment (ADLE59)',
      contractID: 47,
      contractNumber: null,
      contractName: 'Adams Contract',
      sectionID: 44,
      sectionName: 'AdamSection1',
      financeBusinessUnitServiceOfferingAssociationID: 7,
      businessUnit: 'ICS',
      serviceOffering: 'Brokerage',
      serviceOfferingBusinessUnitTransitModeAssociationID: 7,
      transitMode: 'Truck',
      serviceLevelBusinessUnitServiceOfferingAssociationID: null,
      serviceLevel: null,
      equipment: null,
      operationalServices: [],
      priorityNumber: 65,
      overriddenPriority: null,
      awardStatusID: 4,
      awardStatus: 'Tertiary',
      rates: [{
        chargeUnitType: 'Per Kilometer',
        currencyCode: 'USD',
        customerLineHaulConfigurationID: 1814,
        customerLineHaulRateID: 1957,
        maximumAmount: null,
        minimumAmount: null,
        rateAmount: 12,
      }],
      groupRateType: null,
      groupRateItemIndicator: false,
      sourceID: null,
      sourceLineHaulID: null,
      overridenPriorityNumber: null,
      billTos: null,
      carriers: [],
      mileagePreference: {},
      mileagePreferenceMinRange: null,
      mileagePreferenceMaxRange: null,
      unitOfMeasurement: {
        code: null,
        description: null,
        maxWeightRange: null,
        minWeightRange: null
      },
      hazmatIncludedIndicator: false,
      fuelIncludedIndicator: false,
      autoInvoiceIndicator: true,
      equipmentRequirementSpecificationAssociationID: 492,
      equipmentClassificationCode: 'Chassis',
      equipmentClassificationCodeDescription: 'CHASSIS',
      equipmentTypeCode: 'Chassis',
      equipmentTypeCodeDescription: 'CHASSIS',
      equipmentLengthQuantity: 6,
      unitOfEquipmentLengthMeasurementCode: 'Feet',
    };

    component.dateValues = dateValues;
    component.laneCard.laneCardModel.destinationValues = {
      addressLine1: null,
      addressLine2: null,
      cityName: 'Toano',
      countryCode: 'USA',
      countryName: 'USA',
      postalCode: '23168',
      stateCode: 'VA',
      stateName: 'Virginia'
    };
    component.addLineHaulModel.sectionValues = component.sectionData;
    component.sectionData = [{
      customerSectionID: 123,
      customerSectionName: 'abc',
      customerContractID: 123,
      customerContractName: 'abc',
      sectionEffectiveDate: 'abc',
      sectionExpirationDate: 'abc',
    }];

  });

  it('should create', () => {
    spyOn(component, 'getEditLineHaulDetails');
    component.ngOnInit();
    expect(component.getEditLineHaulDetails).toHaveBeenCalled();
    expect(component).toBeTruthy();
  });

  it('should call ngAfterViewInit', () => {
    component.ngAfterViewInit();
  });

  it('should call onLaneCardCancel', () => {
    component.laneCard.laneCardModel.laneCardForm.pristine = false;
    component.laneCard['agreementDetails'] = dateValues['agreementDetails'];
    component.dateValues['agreementDetails'] = dateValues['agreementDetails'];
    component.onLaneCardCancel();
  });

  it('should call onLaneCardCancel', () => {
    component.laneCard.laneCardModel.laneCardForm.pristine = true;
    component.laneCard['agreementDetails'] = dateValues['agreementDetails'];
    component.dateValues['agreementDetails'] = dateValues['agreementDetails'];
    component.onLaneCardCancel();
  });

  it('should call navigateLineHaul', () => {
    component.navigateLineHaul();
  });

  it('should call navigateLineHaul', () => {
    const reviewCancelStatus = true;
    utilityService.setreviewCancelStatus(reviewCancelStatus);
    component.navigateLineHaul();
  });

  it('should call getTypeValues', () => {
    component.getTypeValues(123);
  });

  it('should call onDontSave', () => {
    component.onDontSave();
  });

  it('should call onSave', () => {
    component.laneCard.laneCardModel.laneCardForm.controls['originType'].setValue({ 'label': '3-Zip Region', 'value': '5' });
    component.laneCard.laneCardModel.laneCardForm.controls['destinationType'].setValue({ 'label': '3-Zip Region', 'value': '5' });
    component.onSave();
    component.onLaneCardContinue();
    expect(component.addLineHaulModel.isSaveDraft).toBe(true);
    expect(component.addLineHaulModel.isCancel).toBe(false);
  });

  it('should call onSave for if', () => {
    component.laneCard.laneCardModel.laneCardForm.controls['originType'].setValue({ 'label': '3-Zip Region', 'value': '5' });
    component.laneCard.laneCardModel.laneCardForm.controls['destinationType'].setValue({ 'label': '3-Zip Region', 'value': '5' });
    utilityService.editLineHaulData = {
      lineHaulDetails: 'abc',
      isEditFlag: true
    };
    utilityService.setEditLineHaulData(utilityService.editLineHaulData);
    component.onSave();
  });

  it('should call onLaneCardBack', () => {
    component.laneCard.laneCardModel.laneCardForm.controls['originType'].setValue({ 'label': '3-Zip Region', 'value': '5' });
    component.laneCard.laneCardModel.laneCardForm.controls['destinationType'].setValue({ 'label': '3-Zip Region', 'value': '5' });
    component.onLaneCardBack();
    component.addLineHaulModel.isLaneCardBackClicked = true;
    component.onLaneCardContinue();
  });

  it('should call onLaneCardContinue-true', () => {
    component.addLineHaulModel.isLaneCardBackClicked = true;
    component.laneCard.laneCardModel.laneCardForm.controls['originType'].setValue({ 'label': 'Yard', 'value': '5' });
    component.laneCard.laneCardModel.laneCardForm.controls['originCountry'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.laneCard.laneCardModel.laneCardForm.controls['destinationType'].setValue({ 'label': 'Yard', 'value': '5' });
    component.laneCard.laneCardModel.laneCardForm.controls['destinationCountry'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.laneCard.laneCardModel.laneCardForm.controls['originPoint'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.laneCard.laneCardModel.laneCardForm.controls['destinationPoint'].setValue({ 'label': 'USA', 'value': 'USA' });
    utilityService.editLineHaulData = {
      lineHaulDetails: 'abc',
      isEditFlag: true
    };
    utilityService.setEditLineHaulData(utilityService.editLineHaulData);
    stopsForm = formBuilder.group({
      isStopChargeIncluded: new FormControl(false),
      stops: new FormArray([new FormGroup({
        type: new FormControl('Address', Validators.required),
        country: new FormControl({value: { code: 'USA'}}, Validators.required),
        point: new FormControl('aaa', Validators.required)
      })
      ])
    });
    component.stops.stopsModel.stopsForm = stopsForm;
    component.overview.overviewModel.selectedCategory = 'Chassis';
    component.overview.overviewModel.transitMode = { 'id': 'truck', 'value': 'truck' };
    component.rate.sourceType = { 'value': 'truck', 'label': 'truck' };

    component.rate.rateModel.groupRateTypes = [{ 'label': 'Sum', 'value': 1 }, { 'label': 'Lesser', 'value': 2 }, {
      'label': 'Greater', 'value': 3
    }];
    component.rate.rateModel.rateTypes = [{ 'label': 'Cwt', 'value': 1 }, { 'label': 'Flat', 'value': 2 }, {
      'label':
        'Per Linear Foot', 'value': 3
    }, { 'label': 'Per Kilometer', 'value': 4 }, { 'label': 'Per Mile', 'value': 5 }, {
      'label': 'Per Pallet', 'value': 6
    }, { 'label': 'Percent', 'value': 7 }];
    component.onLaneCardContinue();
  });

  it('should call onLaneCardContinue--true', () => {
    component.addLineHaulModel.isLaneCardBackClicked = true;
    component.laneCard.laneCardModel.laneCardForm.controls['originType'].setValue({ 'label': 'Yard', 'value': '5' });
    component.laneCard.laneCardModel.laneCardForm.controls['originCountry'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.laneCard.laneCardModel.laneCardForm.controls['destinationType'].setValue({ 'label': 'Yard', 'value': '5' });
    component.laneCard.laneCardModel.laneCardForm.controls['destinationCountry'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.laneCard.laneCardModel.laneCardForm.controls['originPoint'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.laneCard.laneCardModel.laneCardForm.controls['destinationPoint'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.laneCard.laneCardModel.isOriginRangeError = false;
    component.laneCard.laneCardModel.isDestinationRangeError = false;
    stopsForm = formBuilder.group({
      isStopChargeIncluded: new FormControl(false),
      stops: new FormArray([new FormGroup({
        type: new FormControl('Address', Validators.required),
        country: new FormControl({value: { code: 'USA'}}, Validators.required),
        point: new FormControl('aaa', Validators.required)
      })
      ])
    });
    component.stops.stopsModel.stopsForm = stopsForm;
    component.overview.overviewModel.selectedCategory = 'Chassis';
    component.overview.overviewModel.transitMode = { 'id': 'truck', 'value': 'truck' };
    component.rate.sourceType = { 'value': 'truck', 'label': 'truck' };

    component.rate.rateModel.groupRateTypes = [{ 'label': 'Sum', 'value': 1 }, { 'label': 'Lesser', 'value': 2 }, {
      'label': 'Greater', 'value': 3
    }];
    component.rate.rateModel.rateTypes = [{ 'label': 'Cwt', 'value': 1 }, { 'label': 'Flat', 'value': 2 }, {
      'label':
        'Per Linear Foot', 'value': 3
    }, { 'label': 'Per Kilometer', 'value': 4 }, { 'label': 'Per Mile', 'value': 5 }, {
      'label': 'Per Pallet', 'value': 6
    }, { 'label': 'Percent', 'value': 7 }];
    component.laneCard.expirationDate = {
      agreementDetails: {
        agreementType: 'Customer',
        businessUnits: ['JBI', 'JBT', 'ICS', 'DCS'],
        cargoReleaseAmount: '$100,000',
        currencyCode: 'USD',
        customerAgreementID: 27,
        customerAgreementName: 'Adams Cable Equipment (ADLE59)',
        effectiveDate: '1995-01-01',
        expirationDate: '2099-12-31',
        invalidIndicator: 'N',
        invalidReasonTypeName: 'Active',
        taskAssignmentIDs: null,
        ultimateParentAccountID: 45667
      },
    };
    component.onLaneCardContinue();
  });

  it('should call onLaneCardContinue-false', () => {
    component.laneCard.laneCardModel.laneCardForm.controls['originType'].setValue({ 'label': '3-Zip Region', 'value': '5' });
    component.laneCard.laneCardModel.laneCardForm.controls['destinationType'].setValue({ 'label': '3-Zip Region', 'value': '5' });
    component.addLineHaulModel.isLaneCardBackClicked = false;
    component.onLaneCardContinue();
    expect(component.addLineHaulModel.isLaneCardContinueClicked).toEqual(true);
    expect(component.addLineHaulModel.isLaneCardBackClicked).toEqual(false);
    expect(component.addLineHaulModel.isLineHaulContinue).toEqual(true);
    expect(component.stops.stopsModel.isConsecutive).toEqual(false);
  });

  it('should call validateLaneCard', () => {
    component.laneCard.laneCardModel.laneCardForm.controls['originType'].setValue({ 'label': 'Yard', 'value': '5' });
    component.laneCard.laneCardModel.laneCardForm.controls['originCountry'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.laneCard.laneCardModel.laneCardForm.controls['destinationType'].setValue({ 'label': 'Yard', 'value': '5' });
    component.laneCard.laneCardModel.laneCardForm.controls['destinationCountry'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.laneCard.laneCardModel.laneCardForm.controls['originPoint'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.laneCard.laneCardModel.laneCardForm.controls['destinationPoint'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.rate.rateModel.rateForm['controls']['sourceIdentifier']['value'] = 'abc';
    component.overview.overviewModel.overviewForm.controls['businessUnit'].setValue({ 'label': 'DCS', 'value': 'DCS' });
    component.overview.overviewModel.overviewForm.controls['serviceOffering'].setValue({
      'label': 'Dedicated', 'value': 'Dedicated', 'id': '5'
    });
    component.overview.overviewModel.overviewForm.controls['awardStatus'].setValue({ 'label': 'Routeguide', 'value': '2' });
    component.overview.overviewModel.overviewForm.controls['equipmentCategory'].setValue({ 'label': 'CHASSIS', 'value': 'Chassis' });
    component.overview.overviewModel.overviewForm.controls['serviceLevel'].setValue({ 'label': 'Standard', 'value': 'Standard', 'id': 12 });
    component.overview.overviewModel.overviewForm.controls['sectionValue'].setValue({ 'label': 'sectionA', 'value': 498 });
    component.overview.overviewModel.overviewForm.controls['operationalServices'].setValue(['Team']);
    component.overview.overviewModel.overviewForm.controls['equipmentType'].setValue({ 'label': 'DOLLY', 'value': 'Dolly' });
    component.overview.overviewModel.overviewForm.controls['overriddenPriority'].setValue({ 'label': 1, 'value': 1 });
    component.overview.overviewModel.overviewForm.controls['equipmentLength'].setValue({
      'label': '123', 'value': '123', 'id': '5', 'code': 'abc', 'specificationId': 123
    });
    stopsForm = formBuilder.group({
      isStopChargeIncluded: new FormControl(false),
      stops: new FormArray([new FormGroup({
        type: new FormControl('Address', Validators.required),
        country: new FormControl('USA', Validators.required),
        point: new FormControl('aaa', Validators.required)
      })
      ])
    });
    component.rate.rateModel.rateForm = rateFormGroup;
    component.validateLaneCard();
  });

  it('should call saveDetails', () => {
    component.laneCard.laneCardModel.laneCardForm.controls['originType'].setValue({label: 'Region'});
    component.laneCard.laneCardModel.laneCardForm.controls['destinationType'].setValue({label: 'Region'});
    component.saveDetails(editLineHaulDetails);
  });

  it('should call onLaneCardValidate', () => {
    component.onLaneCardValidate();
  });
  it('should call setConsErrorNull for if', () => {
    stopsForm = formBuilder.group({
      isStopChargeIncluded: new FormControl(false),
      stops: new FormArray([new FormGroup({
        type: new FormControl('Address', Validators.required),
        country: new FormControl('USA', Validators.required),
        point: new FormControl('', Validators.required)
      })
      ])
    });
    component.setConsErrorNull(0);
  });
  it('should call setConsErrorNull for else', () => {
    stopsForm = formBuilder.group({
      isStopChargeIncluded: new FormControl(false),
      stops: new FormArray([new FormGroup({
        type: new FormControl('Address', Validators.required),
        country: new FormControl('USA', Validators.required),
        point: new FormControl('aaa', Validators.required)
      })
      ])
    });
    component.setErrorNull(0);
  });

  it('should call onLaneCardValidate', () => {
    stopsForm = formBuilder.group({
      isStopChargeIncluded: new FormControl(false),
      stops: new FormArray([new FormGroup({
        type: new FormControl({ 'label': 'Address', 'value': 3 }, Validators.required),
        country: new FormControl({ 'label': 'USA', 'value': { 'code': 'USA', 'id': 184 } }, Validators.required),
        point: new FormControl({ 'label': '4220 Sanders Ave, Laredo, TX 78041, USA', 'value': 1665025 }, Validators.required)
      }),
      new FormGroup({
        type: new FormControl({ 'label': 'Country', 'value': 4 }, Validators.required),
        country: new FormControl({ 'label': 'Canada', 'value': { 'code': 'Canada', 'id': 185 } }, Validators.required),
        point: new FormControl({ 'label': '4221 Sanders Ave, Laredo, TX 78041, Canada', 'value': 1665026 }, Validators.required)
      })
      ])
    });
    component.stops.stopsModel.stopsForm = stopsForm;
    component.onLaneCardValidate();
  });

  it('should call onLaneCardValidate- else', () => {
    stopsForm = formBuilder.group({
      isStopChargeIncluded: new FormControl(false),
      stops: new FormArray([new FormGroup({
        type: new FormControl({ 'label': 'addrss', 'value': 3 }, Validators.required),
        country: new FormControl({ 'label': 'USA', 'value': { 'code': 'USA', 'id': 184 } }, Validators.required),
        point: new FormControl({ 'label': '4220 Sanders Ave, Laredo, TX 78041, USA', 'value': 1665025 }, Validators.required)
      }),
      new FormGroup({
        type: new FormControl({ 'label': 'Cntry', 'value': 4 }, Validators.required),
        country: new FormControl({ 'label': 'Canada', 'value': { 'code': 'Canada', 'id': 185 } }, Validators.required),
        point: new FormControl({ 'label': '4221 Sanders Ave, Laredo, TX 78041, Canada', 'value': 1665026 }, Validators.required)
      })
      ])
    });
    component.stops.stopsModel.isConsecutive = true;
    component.onLaneCardValidate();

  });
  it('should call saveLineHaulDraft', () => {
    const data = {
      status: 'success',
      message: null,
      customerLineHaulConfigurationID: 2210
    };
    spyOn(LaneCardService.prototype, 'lineHaulDraftSave').and.returnValue(of(data));
    component.saveLineHaulDraft();
  });
  it('should call saveLineHaulDraft', () => {
    const data = {
      status: 'warning',
      message: null,
      customerLineHaulConfigurationID: 2210
    };
    spyOn(LaneCardService.prototype, 'lineHaulDraftSave').and.returnValue(of(data));
    component.saveLineHaulDraft();
  });
  it('should call saveLineHaulDraft', () => {
    const data = {
      status: 'done',
      message: null,
      customerLineHaulConfigurationID: 2210
    };
    spyOn(LaneCardService.prototype, 'lineHaulDraftSave').and.returnValue(of(data));
    component.saveLineHaulDraft();
  });

  xit('should call getLaneDTO', () => {
    laneCardForm = formBuilder.group({
      originVendorID: null,
      destinationVendorID: null,
      originType: {
        'value': { 'label': 'Yard', 'value': '5' },
        'label': 'USA'
      },
      originCountry: {
        'value': { 'label': 'USA', 'value': 'USA' },
        'label': 'USA'
      },
      destinationType: {
        'value': { 'label': 'Yard', 'value': '5' },
        'label': 'USA'
      },
      destinationCountry: {
        'value': { 'label': 'USA', 'value': 'USA' },
        'label': 'USA'
      },
      destinationPoint: { 'label': 'USA', 'value': 'USA' },
      originPoint: { 'label': 'USA', 'value': 'USA' },
      originPointFrom: { 'label': 'USA', 'value': 'USA' },
      originPointTo: { 'label': 'USA', 'value': 'USA' },
      destinationPointFrom: { 'label': 'USA', 'value': 'USA' },
      destinationPointTo: { 'label': 'USA', 'value': 'USA' },
      originDescription: 'ab',
      destinationDescription: 'abc'
    });
    component.laneCard.laneCardModel.laneCardForm = laneCardForm;
    stopsForm = formBuilder.group({
      type: {'label': '3-Zip', 'value': 12},
      country: {'label': 'USA', 'value': {'code': 'USA', 'id': 184}},
      vendorid: 'asdf',
      point: {'label': '400', 'value': 136287, 'rawData': '400'}
    });
    component.stops.stopsModel.stopsForm = stopsForm;
    component.getLaneDTO();
  });

  it('should call destinationPointReqFrame else', () => {
    laneCardForm = formBuilder.group({
      originVendorID: null,
      destinationVendorID: null,
      originType: {
        'value': { 'label': 'Yard', 'value': '5' },
        'label': 'USA'
      },
      originCountry: {
        'value': { 'label': 'USA', 'value': 'USA' },
        'label': 'USA'
      },
      destinationType: {
        'value': { 'label': 'Yard', 'value': '5' },
        'label': 'USA'
      },
      destinationCountry: {
        'value': { 'label': 'USA', 'value': 'USA' },
        'label': 'USA'
      },
      destinationPoint: { 'label': 'USA', 'value': 'USA' },
      originPoint: { 'label': 'USA', 'value': 'USA' },
      originPointFrom: { 'label': 'USA', 'value': 'USA' },
      originPointTo: { 'label': 'USA', 'value': 'USA' },
      destinationPointFrom: { 'label': 'USA', 'value': 'USA' },
      destinationPointTo: { 'label': 'USA', 'value': 'USA' },
      originDescription: 'ab',
      destinationDescription: 'abc'
    });
    component.laneCard.laneCardModel.laneCardForm = laneCardForm;
    component.originDestPointReqFrame('destination');
  });
  it('should call destinationPointReqFrame if', () => {
    laneCardForm = formBuilder.group({
      originVendorID: null,
      destinationVendorID: null,
      originType: {
        'value': { 'label': 'Yard', 'value': '5' },
        'label': 'USA'
      },
      originCountry: {
        'value': { 'label': 'USA', 'value': 'USA' },
        'label': 'USA'
      },
      destinationType: {
        'value': { 'label': 'Yard', 'value': '5' },
        'label': 'USA'
      },
      destinationCountry: {
        'value': { 'label': 'USA', 'value': 'USA' },
        'label': 'USA'
      },
      destinationPoint: { 'label': 'USA', 'value': 'USA' },
      originPoint: { 'label': 'USA', 'value': 'USA' },
      originPointFrom: { 'label': 'USA', 'value': 'USA' },
      originPointTo: { 'label': 'USA', 'value': 'USA' },
      destinationPointFrom: { 'label': 'USA', 'value': 'USA' },
      destinationPointTo: { 'label': 'USA', 'value': 'USA' },
      originDescription: 'ab',
      destinationDescription: 'abc'
    });
    component.laneCard.laneCardModel.laneCardForm = laneCardForm;
    component.originDestPointReqFrame('destination');
  });

  it('should call originPointReqFrame else', () => {
    laneCardForm = formBuilder.group({
      originVendorID: null,
      destinationVendorID: null,
      originType: {
        'value': { 'label': 'Yard', 'value': '5' },
        'label': 'USA'
      },
      originCountry: {
        'value': { 'label': 'USA', 'value': 'USA' },
        'label': 'USA'
      },
      destinationType: {
        'value': { 'label': 'Yard', 'value': '5' },
        'label': 'USA'
      },
      destinationCountry: {
        'value': { 'label': 'USA', 'value': 'USA' },
        'label': 'USA'
      },
      destinationPoint: { 'label': 'USA', 'value': 'USA' },
      originPoint: { 'label': 'USA', 'value': 'USA' },
      originPointFrom: { 'label': 'USA', 'value': 'USA' },
      originPointTo: { 'label': 'USA', 'value': 'USA' },
      destinationPointFrom: { 'label': 'USA', 'value': 'USA' },
      destinationPointTo: { 'label': 'USA', 'value': 'USA' },
      originDescription: 'ab',
      destinationDescription: 'abc'
    });
    component.laneCard.laneCardModel.laneCardForm = laneCardForm;
    component.originDestPointReqFrame('origin');
  });
  it('should call originPointReqFrame if', () => {
    laneCardForm = formBuilder.group({
      originVendorID: null,
      destinationVendorID: null,
      originType: {
        'value': { 'label': 'Yard', 'value': '5' },
        'label': 'USA'
      },
      originCountry: {
        'value': { 'label': 'USA', 'value': 'USA' },
        'label': 'USA'
      },
      destinationType: {
        'value': { 'label': 'Yard', 'value': '5' },
        'label': 'USA'
      },
      destinationCountry: {
        'value': { 'label': 'USA', 'value': 'USA' },
        'label': 'USA'
      },
      destinationPoint: { 'label': 'USA', 'value': 'USA' },
      originPoint: { 'label': 'USA', 'value': 'USA' },
      originPointFrom: { 'label': 'USA', 'value': 'USA' },
      originPointTo: { 'label': 'USA', 'value': 'USA' },
      destinationPointFrom: { 'label': 'USA', 'value': 'USA' },
      destinationPointTo: { 'label': 'USA', 'value': 'USA' },
      originDescription: 'ab',
      destinationDescription: 'abc'
    });
    component.laneCard.laneCardModel.laneCardForm = laneCardForm;
    component.originDestPointReqFrame('origin');
  });

  xit('should call payloadFramer', () => {
    component.overview.overviewModel.selectedCategory = 'Chassis';
    component.overview.overviewModel.transitMode = { 'id': 'truck', 'value': 'truck' };
    component.rate.sourceType = { 'value': 'truck', 'label': 'truck' };

    component.rate.rateModel.groupRateTypes = [{ 'label': 'Sum', 'value': 1 }, { 'label': 'Lesser', 'value': 2 }, {
      'label': 'Greater', 'value': 3
    }];
    component.rate.rateModel.rateTypes = [{ 'label': 'Cwt', 'value': 1 }, { 'label': 'Flat', 'value': 2 }, {
      'label':
        'Per Linear Foot', 'value': 3
    }, { 'label': 'Per Kilometer', 'value': 4 }, { 'label': 'Per Mile', 'value': 5 }, {
      'label': 'Per Pallet', 'value': 6
    }, { 'label': 'Percent', 'value': 7 }];
    component.rate.rateModel.rateForm['controls']['sourceIdentifier']['value'] = 'abc';
    laneCardForm = formBuilder.group({
      originVendorID: null,
      destinationVendorID: null,
      originType: {
        'value': { 'label': 'Yard', 'value': '5' },
        'label': 'USA'
      },
      originCountry: {
        'value': { 'label': 'USA', 'value': 'USA' },
        'label': 'USA'
      },
      destinationType: {
        'value': { 'label': 'Yard', 'value': '5' },
        'label': 'USA'
      },
      destinationCountry: {
        'value': { 'label': 'USA', 'value': 'USA' },
        'label': 'USA'
      },
      destinationPoint: { 'label': 'USA', 'value': 'USA' },
      originPoint: { 'label': 'USA', 'value': 'USA' },
      originPointFrom: { 'label': 'USA', 'value': 'USA' },
      originPointTo: { 'label': 'USA', 'value': 'USA' },
      destinationPointFrom: { 'label': 'USA', 'value': 'USA' },
      destinationPointTo: { 'label': 'USA', 'value': 'USA' },
      originDescription: 'ab',
      destinationDescription: 'abc'
    });
    component.laneCard.laneCardModel.laneCardForm = laneCardForm;
    stopsForm = formBuilder.group({
      type: {'label': '3-Zip', 'value': 12},
      country: {'label': 'USA', 'value': {'code': 'USA', 'id': 184}},
      vendorid: 'asdf',
      point: {'label': '400', 'value': 136287, 'rawData': '400'}
    });
    component.stops.stopsModel.stopsForm = stopsForm;
    component.payloadFramer();
  });

  it('should call isStopChargeIncludedIndicator', () => {
    component.isStopChargeIncludedIndicator(stopValues);
  });

  it('should call isStopChargeIncludedIndicator- empty', () => {
    const stopVal = {
      isStopChargeIncluded: true,
      stops: []
    };
    component.isStopChargeIncludedIndicator(stopVal);
  });
  it('should call isGroupRateItemizeIndicator', () => {
    const groupRateTypeLabel = 'Sum';
    component.isGroupRateItemizeIndicator(groupRateTypeLabel);
  });
  it('should call isGroupRateItemizeIndicator-null', () => {
    const groupRateTypeLabel = '--';
    component.isGroupRateItemizeIndicator(groupRateTypeLabel);
  });
  it('should call priorityFramer', () => {
    component.priorityFramer(0);
  });

  it('should call priorityFramer', () => {
    component.priorityFramer(1);
  });

  it('should call getStopDetails', () => {
    const stopValue: any = {
      'isStopChargeIncluded': false,
      'stops': [{
        'type': { 'label': 'Address', 'value': 3 },
        'country': {
          'label': 'USA', 'value': {
            'code': 'USA', 'id': 184
          }
        },
        'point': {
          'rawData' : {
            'label': '6201 County Route 21, Addison, NY 148019125, USA',
            'value': 293281,
            'AddressLine1' : '6201 County Route 21',
            'CityName' : '6201 County Route 21',
            'CountryCode' : '6201 County Route 21',
            'CountryName' : '6201 County Route 21',
            'PostalCode' : '6201 County Route 21',
            'StateCode' : '6201 County Route 21',
            'StateName' : '6201 County Route 21'
          }
        }
      }
      ]
    };
    component.getStopDetails(stopValue);
  });

  it('should call getRateDetails', () => {
    component.rate.rateModel.rateTypes = [
      { label: 'Cwt', value: 1 },
      { label: 'Flat', value: 2 }
    ];
    const amountPattern = '[-0-9., ]*';
    let rates: FormArray;
    rates = new FormArray([new FormGroup({
      type: new FormControl({ label: 'Flat', value: 2 }, Validators.required),
      amount: new FormControl('1', [Validators.required, Validators.pattern(amountPattern)]),
      minAmount: new FormControl('2', [Validators.pattern(amountPattern)]),
      maxAmount: new FormControl('3', [Validators.pattern(amountPattern)]),
      currency: new FormControl({ label: 'USD', value: 'USD' }, Validators.required)
    })
    ]);
    component.getRateDetails(rates);
  });

  it('should call toastMessage', () => {
    component.toastMessage(messageService, 'error', 'b', 'c');
  });

  it('should call formFieldsTouched', () => {
    component.formFieldsTouched();
  });

  it('should call saveEditLane', () => {
    spyOn(LaneCardService.prototype, 'postEditLaneCardData').and.returnValue(of(true));
    component.saveEditLane(payload);
    component.addLineHaulModel.isLaneCardContinueClicked = true;
    const conObj: any = {
      customerAgreementName: dateValues['agreementDetails']['customerAgreementName'],
      customerLineHaulConfigurationID: dateValues['lineHaulConfigurationID']
    };
    component.addLineHaulModel.nameConfigurationDetails = conObj;
    const selectedSection = {
      label: 'a',
      value: 'b',
      sectionId: 1
    };
    component.addLineHaulModel.selectedSection = selectedSection;
    component.setWizardStatus();
    const obj = {
      effectiveDate: dateValues['effectiveDate'],
      expirationDate: dateValues['expirationDate']
    };
    component.sectionDate.emit(obj);
  });

  it('should call saveEditLane', () => {
    spyOn(LaneCardService.prototype, 'postEditLaneCardData').and.returnValue(of(false));
    component.saveEditLane(payload);
    component.addLineHaulModel.isLaneCardContinueClicked = true;
    const conObj: any = {
      customerAgreementName: dateValues['agreementDetails']['customerAgreementName'],
      customerLineHaulConfigurationID: dateValues['lineHaulConfigurationID']
    };
    component.addLineHaulModel.nameConfigurationDetails = conObj;
    component.setWizardStatus();
    const obj = {
      effectiveDate: dateValues['effectiveDate'],
      expirationDate: dateValues['expirationDate']
    };
    component.sectionDate.emit(obj);
  });

  it('should call saveLane', () => {
    const data = {
      customerLineHaulConfigurationID: 2191,
    };
    component.laneCard.expirationDate = {
      agreementDetails: {
        agreementType: 'Customer',
        businessUnits: ['JBI', 'JBT', 'ICS', 'DCS'],
        cargoReleaseAmount: '$100,000',
        currencyCode: 'USD',
        customerAgreementID: 27,
        customerAgreementName: 'Adams Cable Equipment (ADLE59)',
        effectiveDate: '1995-01-01',
        expirationDate: '2099-12-31',
        invalidIndicator: 'N',
        invalidReasonTypeName: 'Active',
        taskAssignmentIDs: null,
        ultimateParentAccountID: 45667
      },
    };
    component.addLineHaulModel.isSaveDraft = false;
    component.addLineHaulModel.isLaneCardBackClicked = true;
    spyOn(LaneCardService.prototype, 'postLaneCardData').and.returnValue(of(data));
    component.setWizardStatus();
    const obj = {
      effectiveDate: dateValues['effectiveDate'],
      expirationDate: dateValues['expirationDate']
    };
    component.sectionDate.emit(obj);
    component.backFlag.emit(true);
    component.saveLane(payload);
  });

  it('should call saveLane for else', () => {
    const data = {
      customerLineHaulConfigurationID: 2191,
    };
    component.laneCard.expirationDate = {
      agreementDetails: {
        agreementType: 'Customer',
        businessUnits: ['JBI', 'JBT', 'ICS', 'DCS'],
        cargoReleaseAmount: '$100,000',
        currencyCode: 'USD',
        customerAgreementID: 27,
        customerAgreementName: 'Adams Cable Equipment (ADLE59)',
        effectiveDate: '1995-01-01',
        expirationDate: '2099-12-31',
        invalidIndicator: 'N',
        invalidReasonTypeName: 'Active',
        taskAssignmentIDs: null,
        ultimateParentAccountID: 45667
      },
    };
    component.addLineHaulModel.isSaveDraft = false;
    component.addLineHaulModel.isLaneCardBackClicked = false;
    spyOn(LaneCardService.prototype, 'postLaneCardData').and.returnValue(of(data));
    component.setWizardStatus();
    const obj = {
      effectiveDate: dateValues['effectiveDate'],
      expirationDate: dateValues['expirationDate']
    };
    const data1 = {
      customerLineHaulConfigurationID: 2191,
      message: null,
      status: 'warning'
    };
    const selectedSection = {
      label: 'a',
      value: 'b',
      sectionId: 1
    };
    component.addLineHaulModel.selectedSection = selectedSection;
    component.saveLaneOnSuccess(data1, 27, payload);
    component.sectionDate.emit(obj);
    component.backFlag.emit(true);
    component.saveLane(payload);
  });

  it('should call saveLane', () => {
    const data = {
      customerLineHaulConfigurationID: 2191,
    };
    component.laneCard.expirationDate = {
      agreementDetails: {
        agreementType: 'Customer',
        businessUnits: ['JBI', 'JBT', 'ICS', 'DCS'],
        cargoReleaseAmount: '$100,000',
        currencyCode: 'USD',
        customerAgreementID: 27,
        customerAgreementName: 'Adams Cable Equipment (ADLE59)',
        effectiveDate: '1995-01-01',
        expirationDate: '2099-12-31',
        invalidIndicator: 'N',
        invalidReasonTypeName: 'Active',
        taskAssignmentIDs: null,
        ultimateParentAccountID: 45667
      },
    };
    component.addLineHaulModel.isSaveDraft = true;
    component.addLineHaulModel.isLaneCardBackClicked = false;
    spyOn(LaneCardService.prototype, 'postLaneCardData').and.returnValue(of(data));
    component.setWizardStatus();
    const obj = {
      effectiveDate: dateValues['effectiveDate'],
      expirationDate: dateValues['expirationDate']
    };
    component.sectionDate.emit(obj);
    component.backFlag.emit(true);
    component.saveLane(payload);
  });

  it('should call handleError', () => {
    const error: any = {
      'message': 'testing', 'error': {
        'errors': [{
          'code': 'INVALID_LINEHAUL_BOUND_RANGE',
          'errorMessage': 'Testing', 'errorType': 'Error'
        }]
      }
    };
    component.handleError(error);
  });


  it('should call saveLaneOnSuccess', () => {
    const data = {
      customerLineHaulConfigurationID: 2191,
      message: null,
      status: 'warning'
    };
    const selectedSection = {
      label: 'a',
      value: 'b',
      sectionId: 1
    };
    component.addLineHaulModel.selectedSection = selectedSection;
    component.saveLaneOnSuccess(data, 27, payload);
  });

  it('should call onLaneCardConfirmationNo', () => {
    component.onLaneCardConfirmationNo();
    expect(component.addLineHaulModel.isBack).toBe(false);
  });

  it('should call onLaneCardNo', () => {
    component.onLaneCardNo();
    expect(component.addLineHaulModel.isBack).toBe(false);
  });

  it('should call getSelectedSection', () => {
    const selectedSection = {
      label: 'a',
      value: 'b',
      sectionId: 1
    };
    component.getSelectedSection(selectedSection);
    expect(component.addLineHaulModel.selectedSection).toEqual(selectedSection);
  });

  it('should call getEditLineHaulDetails', () => {
    utilityService.editLineHaulData = {
      lineHaulDetails: 'abc',
      isEditFlag: true
    };
    utilityService.setEditLineHaulData(utilityService.editLineHaulData);
    component.getEditLineHaulDetails();
  });

  xit('should call editpayloadFramer', () => {
    stopsForm = formBuilder.group({
      type: {'label': '3-Zip', 'value': 12},
      country: {'label': 'USA', 'value': {'code': 'USA', 'id': 184}},
      vendorid: 'asdf',
      point: {'label': '400', 'value': 136287, 'rawData': '400'}
    });
    // stopsForm = formBuilder.group({
    //   isStopChargeIncluded: new FormControl(false),
    //   stops: new FormArray([new FormGroup({
    //     type: new FormControl('Address', Validators.required),
    //     country: new FormControl('USA', Validators.required),
    //     point: new FormControl('aaa', Validators.required)
    //   })
    //   ])
    // });
    component.stops.stopsModel.stopsForm = stopsForm;
    component.overview.overviewModel.selectedCategory = 'Chassis';
    component.overview.overviewModel.transitMode = { 'id': 'truck', 'value': 'truck' };
    component.rate.sourceType = { 'value': 'truck', 'label': 'truck' };

    component.rate.rateModel.groupRateTypes = [{ 'label': 'Sum', 'value': 1 }, { 'label': 'Lesser', 'value': 2 }, {
      'label': 'Greater', 'value': 3
    }];
    component.rate.rateModel.rateTypes = [{ 'label': 'Cwt', 'value': 1 }, { 'label': 'Flat', 'value': 2 }, {
      'label':
        'Per Linear Foot', 'value': 3
    }, { 'label': 'Per Kilometer', 'value': 4 }, { 'label': 'Per Mile', 'value': 5 }, {
      'label': 'Per Pallet', 'value': 6
    }, { 'label': 'Percent', 'value': 7 }];
    laneCardForm = formBuilder.group({
      originVendorID: null,
      destinationVendorID: null,
      originType: {
        'value': { 'label': 'Yard', 'value': '5' },
        'label': 'USA'
      },
      originCountry: {
        'value': { 'label': 'USA', 'value': 'USA' },
        'label': 'USA'
      },
      destinationType: {
        'value': { 'label': 'Yard', 'value': '5' },
        'label': 'USA'
      },
      destinationCountry: {
        'value': { 'label': 'USA', 'value': 'USA' },
        'label': 'USA'
      },
      destinationPoint: { 'label': 'USA', 'value': 'USA' },
      originPoint: { 'label': 'USA', 'value': 'USA' },
      originPointFrom: { 'label': 'USA', 'value': 'USA' },
      originPointTo: { 'label': 'USA', 'value': 'USA' },
      destinationPointFrom: { 'label': 'USA', 'value': 'USA' },
      destinationPointTo: { 'label': 'USA', 'value': 'USA' },
      originDescription: 'ab',
      destinationDescription: 'abc'
    });
    component.laneCard.laneCardModel.laneCardForm = laneCardForm;
    component.editpayloadFramer();
  });

  it('should call getEditOverViewDTO', () => {
    component.overview.overviewModel.selectedCategory = 'Chassis';
    component.overview.overviewModel.transitMode = { 'id': 'truck', 'value': 'truck' };
    component.rate.sourceType = { 'value': 'truck', 'label': 'truck' };

    component.rate.rateModel.groupRateTypes = [{ 'label': 'Sum', 'value': 1 }, { 'label': 'Lesser', 'value': 2 }, {
      'label': 'Greater', 'value': 3
    }];
    component.rate.rateModel.rateTypes = [{ 'label': 'Cwt', 'value': 1 }, { 'label': 'Flat', 'value': 2 }, {
      'label':
        'Per Linear Foot', 'value': 3
    }, { 'label': 'Per Kilometer', 'value': 4 }, { 'label': 'Per Mile', 'value': 5 }, {
      'label': 'Per Pallet', 'value': 6
    }, { 'label': 'Percent', 'value': 7 }];
    component.getEditOverViewDTO();
  });

  it('should call setWizardStatus', () => {
    component.setWizardStatus();
  });

  it('should call setWizardEnable', () => {
    component.setWizardEnable();
  });

  it('should call navigateToAdditionalInfo', () => {
    component.laneCard.laneCardModel.laneCardForm.controls['originType'].setValue({ 'label': '3-Zip Region', 'value': '5' });
    component.laneCard.laneCardModel.laneCardForm.controls['destinationType'].setValue({ 'label': '3-Zip Region', 'value': '5' });
    component.navigateToAdditionalInfo();
    component.onLaneCardContinue();
  });

  it('should call showComponents', () => {
    component.laneCard.laneCardModel.laneCardForm.controls['originType'].setValue({ 'label': '3-Zip Region', 'value': '5' });
    component.laneCard.laneCardModel.laneCardForm.controls['destinationType'].setValue({ 'label': '3-Zip Region', 'value': '5' });
    component.showComponents(1);
    component.navigateToAdditionalInfo();
  });

  it('should call onIndexChange', () => {
    component.laneCard.laneCardModel.laneCardForm.controls['originType'].setValue({ 'label': '3-Zip Region', 'value': '5' });
    component.laneCard.laneCardModel.laneCardForm.controls['destinationType'].setValue({ 'label': '3-Zip Region', 'value': '5' });
    component.onIndexChange(1);
    component.showComponents(1);
  });

});
