import { UserService } from './../../../../shared/jbh-esa/user.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../app.module';
import { ViewAgreementDetailsModule } from '../../view-agreement-details.module';
import { ReviewComponent } from './review.component';
import { LineHaulModel } from '../model/line-haul.model';
import { LineHaulService } from '../service/line-haul.service';
import { of } from 'rxjs';
import { MessageService } from 'primeng/components/common/messageservice';
import { Services } from '@angular/core/src/view';
import { LineHaulDetailData } from '../add-line-haul/additional-info/models/additional-info.interface';
import { ViewAgreementDetailsUtility } from '../../../view-agreement-details/service/view-agreement-details-utility';
import { CanDeactivateGuardService } from '../../../../shared/jbh-app-services/can-deactivate-guard.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LocalStorageService } from './../../../../shared/jbh-app-services/local-storage.service';


describe('ReviewComponent', () => {
  let service, messageService, lineHaulUtilityService;
  let component: ReviewComponent;
  let fixture: ComponentFixture<ReviewComponent>;
  let canDeactivateGuardService: CanDeactivateGuardService;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;
  let nextState: RouterStateSnapshot;
  let localstore: LocalStorageService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, CanDeactivateGuardService,
      { provide: RouterStateSnapshot, useValue: ReviewComponent },
      { provide: ActivatedRouteSnapshot, useValue: ReviewComponent }]
    });
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewComponent);
    component = fixture.componentInstance;
    service = TestBed.get(LineHaulService);
    messageService = TestBed.get(MessageService);
    lineHaulUtilityService = TestBed.get(ViewAgreementDetailsUtility);
    canDeactivateGuardService = TestBed.get(CanDeactivateGuardService);
    route = TestBed.get(ActivatedRouteSnapshot);
    state = TestBed.get(RouterStateSnapshot);
    nextState = TestBed.get(RouterStateSnapshot);
    localstore = TestBed.get(LocalStorageService);
    component = fixture.componentInstance;

    component.reviewModel.agreementDetails = {
      agreementType: 'aaa',
      businessUnits: 'aaa',
      cargoReleaseAmount: 123,
      currencyCode: 'aaa',
      customerAgreementID: 123,
      customerAgreementName: 'aaa',
      effectiveDate: 'aaa',
      expirationDate: 'aaa',
      invalidIndicator: 'aaa',
      invalidReasonTypeName: 'aaa',
      taskAssignmentIDs: 'aaa',
      teams: 'aaa',
      ultimateParentAccountID: 123
    };
    component.linehaul.LineHaulDetailData = {
      agreementID: 'string',
      agreementName: 'string',
      sectionID: 'string',
      customerLineHaulConfigurationID: 123
    };
    lineHaulUtilityService.setLineHaulData(component.linehaul.LineHaulDetailData);
    component.linehaul.lineHaulModel.selectedLineHaulData = {
      agreementName: 'aaa',
      customerLineHaulConfigurationID: 123
    };
    component.reviewModel = {
      populateFlag: true,
      isReview: true,
      isLineHaulChecked: true,
      isCancel: true,
      subscribeFlag: true,
      isChangesSaved: true,
      isDeleteLineHaul: true,
      isLineHaulPublish: true,
      customerAgreementId: 123,
      activeIndex: 123,
      routingUrl: 'abc',
      agreementUrl: 'abc',
      stepsList: [],
      lineHaulConfigurationIds: [123, 123],
      agreementDetails: {
        agreementType: 'abc',
        businessUnits: 'abc',
        cargoReleaseAmount: 123,
        currencyCode: 'abc',
        customerAgreementID: 123,
        customerAgreementName: 'abc',
        effectiveDate: 'abc',
        expirationDate: 'abc',
        invalidIndicator: 'abc',
        invalidReasonTypeName: 'abc',
        taskAssignmentIDs: 'abc',
        teams: 'abc',
        ultimateParentAccountID: 123
      },
      isBackClicked: true,
      customerAgreementData: {
        customerAgreementName: 'abc',
        customerLineHaulConfigurationID: 123
      },
      linehaulStatus: {
        isLineHaulEdit: true
      },
      editlinehaulData: {
        lineHaulDetails: {
          agreementName: 'abc',
          customerLineHaulConfigurationID: 123,
        },
        isEditFlag: true,
      },
      reviewWizardStatus: {
        isLaneCardInfo: true,
        isLineHaulReviewed: true,
        isAdditionalInfo: true
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setAgreementId', () => {
    component.setAgreementId();
  });
  it('should call getConfigurationIds', () => {
    component.linehaul.lineHaulModel.lineHaulList = [{
      lineHaulConfigurationID: 123,
      laneID: 123,
      lineHaulSourceTypeID: 123,
      lineHaulSourceTypeName: 'abc',
      origin: {
        type: 'aaa',
        typeID: 123,
        country: 'aaa',
        point: 'aaa',
        pointID: 123,
        description: 'aaa',
        vendorID: 'aaa'
      },
      destination: {
        type: 'aaa',
        typeID: 123,
        country: 'aaa',
        point: 'aaa',
        pointID: 123,
        description: 'aaa',
        vendorID: 'aaa'
      },
      stops: {
        stopSequenceNumber: 123,
        stopTypeName: 'aaa',
        stopTypeID: 123,
        stopCountry: 'aaa',
        stopPoint: 'aaa',
        stopPointID: 123
      },
      stopChargeIncludedIndicator: true,
      status: 'abc',
      effectiveDate: 'abc',
      expirationDate: 'abc',
      agreementID: 123,
      agreementName: 'abc',
      contractID: 123,
      contractNumber: 'abc',
      contractName: 'abc',
      sectionID: 123,
      sectionName: 'abc',
      financeBusinessUnitServiceOfferingAssociationID: 123,
      businessUnit: 'abc',
      serviceOffering: 'abc',
      serviceOfferingDescription: 'abc',
      serviceOfferingBusinessUnitTransitModeAssociationID: 123,
      transitMode: 'abc',
      serviceLevelBusinessUnitServiceOfferingAssociationID: 123,
      serviceLevel: 'abc',
      equipmentRequirementSpecificationAssociationID: 123,
      equipmentClassificationCode: 'abc',
      equipmentTypeCode: 'abc',
      equipmentLengthQuantity: 123,
      unitOfEquipmentLengthMeasurementCode: 'abc',
      operationalServices: {
        serviceTypeCode: 'aaa'
      },
      priorityNumber: 123,
      overriddenPriority: 123,
      awardStatusID: 123,
      awardStatus: 'abc',
      rates: {
        customerLineHaulRateID: 123,
        customerLineHaulConfigurationID: 123,
        chargeUnitType: 'aaa',
        rateAmount: 123,
        minimumAmount: 123,
        maximumAmount: 123,
        currencyCode: 'aaa',
      },
      groupRateType: 'abc',
      groupRateItemIndicator: true,
      sourceID: 123,
      sourceLineHaulID: 123,
      overridenPriorityNumber: 123,
      billTos: {
        billToID: 123,
        billToName: 'aaa',
        billToCode: 'aaa',
      },
      carriers: {
        carrierID: 123,
        carrierName: 'aaa',
        carrierCode: 'aaa',
      },
      mileagePreference: {
        mileagePreferenceID: 123,
        mileagePreferenceName: 'aaa',
        mileagePreferenceMinRange: 123,
        mileagePreferenceMaxRange: 123,
      },
      unitOfMeasurement: {
        code: 'aaa',
        description: 'aaa',
        minWeightRange: 123,
        maxWeightRange: 123,
      },
      hazmatIncludedIndicator: true,
      fuelIncludedIndicator: true,
      autoInvoiceIndicator: true,
      recordStatus: 'abc',

    }];
    component.getConfigurationIds();

  });
  it('should call onSelectLineHaul', () => {
    const isLineHaulSelected = true;
    component.reviewModel.isLineHaulChecked = isLineHaulSelected;
    component.onSelectLineHaul(isLineHaulSelected);
  });
  it('should call onLineHaulPublish', () => {
    component.linehaul.lineHaulModel.lineHaulList = [{
      lineHaulConfigurationID: 123,
      laneID: 123,
      lineHaulSourceTypeID: 123,
      lineHaulSourceTypeName: 'abc',
      origin: {
        type: 'aaa',
        typeID: 123,
        country: 'aaa',
        point: 'aaa',
        pointID: 123,
        description: 'aaa',
        vendorID: 'aaa'
      },
      destination: {
        type: 'aaa',
        typeID: 123,
        country: 'aaa',
        point: 'aaa',
        pointID: 123,
        description: 'aaa',
        vendorID: 'aaa'
      },
      stops: {
        stopSequenceNumber: 123,
        stopTypeName: 'aaa',
        stopTypeID: 123,
        stopCountry: 'aaa',
        stopPoint: 'aaa',
        stopPointID: 123
      },
      stopChargeIncludedIndicator: true,
      status: 'abc',
      effectiveDate: 'abc',
      expirationDate: 'abc',
      agreementID: 123,
      agreementName: 'abc',
      contractID: 123,
      contractNumber: 'abc',
      contractName: 'abc',
      sectionID: 123,
      sectionName: 'abc',
      financeBusinessUnitServiceOfferingAssociationID: 123,
      businessUnit: 'abc',
      serviceOffering: 'abc',
      serviceOfferingDescription: 'abc',
      serviceOfferingBusinessUnitTransitModeAssociationID: 123,
      transitMode: 'abc',
      serviceLevelBusinessUnitServiceOfferingAssociationID: 123,
      serviceLevel: 'abc',
      equipmentRequirementSpecificationAssociationID: 123,
      equipmentClassificationCode: 'abc',
      equipmentTypeCode: 'abc',
      equipmentLengthQuantity: 123,
      unitOfEquipmentLengthMeasurementCode: 'abc',
      operationalServices: {
        serviceTypeCode: 'aaa'
      },
      priorityNumber: 123,
      overriddenPriority: 123,
      awardStatusID: 123,
      awardStatus: 'abc',
      rates: {
        customerLineHaulRateID: 123,
        customerLineHaulConfigurationID: 123,
        chargeUnitType: 'aaa',
        rateAmount: 123,
        minimumAmount: 123,
        maximumAmount: 123,
        currencyCode: 'aaa',
      },
      groupRateType: 'abc',
      groupRateItemIndicator: true,
      sourceID: 123,
      sourceLineHaulID: 123,
      overridenPriorityNumber: 123,
      billTos: {
        billToID: 123,
        billToName: 'aaa',
        billToCode: 'aaa',
      },
      carriers: {
        carrierID: 123,
        carrierName: 'aaa',
        carrierCode: 'aaa',
      },
      mileagePreference: {
        mileagePreferenceID: 123,
        mileagePreferenceName: 'aaa',
        mileagePreferenceMinRange: 123,
        mileagePreferenceMaxRange: 123,
      },
      unitOfMeasurement: {
        code: 'aaa',
        description: 'aaa',
        minWeightRange: 123,
        maxWeightRange: 123,
      },
      hazmatIncludedIndicator: true,
      fuelIncludedIndicator: true,
      autoInvoiceIndicator: true,
      recordStatus: 'abc',

    }];
    component.getConfigurationIds();
    component.saveLineHaulRecords('published');
    component.onLineHaulPublish();
  });
  it('should call onSelectLineHaulCancel', () => {
    component.linehaul.lineHaulModel.lineHaulList = [{
      lineHaulConfigurationID: 123,
      laneID: 123,
      lineHaulSourceTypeID: 123,
      lineHaulSourceTypeName: 'abc',
      origin: {
        type: 'aaa',
        typeID: 123,
        country: 'aaa',
        point: 'aaa',
        pointID: 123,
        description: 'aaa',
        vendorID: 'aaa'
      },
      destination: {
        type: 'aaa',
        typeID: 123,
        country: 'aaa',
        point: 'aaa',
        pointID: 123,
        description: 'aaa',
        vendorID: 'aaa'
      },
      stops: {
        stopSequenceNumber: 123,
        stopTypeName: 'aaa',
        stopTypeID: 123,
        stopCountry: 'aaa',
        stopPoint: 'aaa',
        stopPointID: 123
      },
      stopChargeIncludedIndicator: true,
      status: 'abc',
      effectiveDate: 'abc',
      expirationDate: 'abc',
      agreementID: 123,
      agreementName: 'abc',
      contractID: 123,
      contractNumber: 'abc',
      contractName: 'abc',
      sectionID: 123,
      sectionName: 'abc',
      financeBusinessUnitServiceOfferingAssociationID: 123,
      businessUnit: 'abc',
      serviceOffering: 'abc',
      serviceOfferingDescription: 'abc',
      serviceOfferingBusinessUnitTransitModeAssociationID: 123,
      transitMode: 'abc',
      serviceLevelBusinessUnitServiceOfferingAssociationID: 123,
      serviceLevel: 'abc',
      equipmentRequirementSpecificationAssociationID: 123,
      equipmentClassificationCode: 'abc',
      equipmentTypeCode: 'abc',
      equipmentLengthQuantity: 123,
      unitOfEquipmentLengthMeasurementCode: 'abc',
      operationalServices: {
        serviceTypeCode: 'aaa'
      },
      priorityNumber: 123,
      overriddenPriority: 123,
      awardStatusID: 123,
      awardStatus: 'abc',
      rates: {
        customerLineHaulRateID: 123,
        customerLineHaulConfigurationID: 123,
        chargeUnitType: 'aaa',
        rateAmount: 123,
        minimumAmount: 123,
        maximumAmount: 123,
        currencyCode: 'aaa',
      },
      groupRateType: 'abc',
      groupRateItemIndicator: true,
      sourceID: 123,
      sourceLineHaulID: 123,
      overridenPriorityNumber: 123,
      billTos: {
        billToID: 123,
        billToName: 'aaa',
        billToCode: 'aaa',
      },
      carriers: {
        carrierID: 123,
        carrierName: 'aaa',
        carrierCode: 'aaa',
      },
      mileagePreference: {
        mileagePreferenceID: 123,
        mileagePreferenceName: 'aaa',
        mileagePreferenceMinRange: 123,
        mileagePreferenceMaxRange: 123,
      },
      unitOfMeasurement: {
        code: 'aaa',
        description: 'aaa',
        minWeightRange: 123,
        maxWeightRange: 123,
      },
      hazmatIncludedIndicator: true,
      fuelIncludedIndicator: true,
      autoInvoiceIndicator: true,
      recordStatus: 'abc',

    }];
    component.onSelectLineHaulCancel();
  });
  it('should call onSelectLineHaulCancel', () => {
    component.linehaul.lineHaulModel.lineHaulList = [];
    component.onSelectLineHaulCancel();
  });
  it('should call deleteLineHaulData', () => {
    const data = {
      status: 'abc',
      message: 'string',
      customerLineHaulConfigurationID: 123,
    };
    component.reviewModel.lineHaulConfigurationIds = [123, 123];
    component.reviewModel.agreementUrl = '/viewAgreement';
    spyOn(LineHaulService.prototype, 'deleteLineHaulRecords').and.returnValue(of(data));
    component.deleteLineHaulData();
  });
  it('should call deleteLineHaulData', () => {
    const data = {
      status: 'warning',
      message: 'string',
      customerLineHaulConfigurationID: 123,
    };
    component.reviewModel.lineHaulConfigurationIds = [123, 123];
    spyOn(LineHaulService.prototype, 'deleteLineHaulRecords').and.returnValue(of(data));
    component.deleteLineHaulData();
  });
  it('should call deleteLineHaulData', () => {
    component.deleteLineHaulData();
  });
  it('should call onLineHaulDeleteData', () => {
    component.onLineHaulDeleteData();
  });
  it('should call onLineHaulSaveData', () => {
    component.onLineHaulSaveData();
  });
  it('should call saveLineHaulRecords', () => {
    const lineHaulDetailStatus = 'draft';
    const publishedData = {
      status: 'warning',
      message: 'string',
      customerLineHaulConfigurationID: 1234,
    };
    component.reviewModel.lineHaulConfigurationIds = [123, 123];
    spyOn(LineHaulService.prototype, 'publishLineHaulRecords').and.returnValue(of(publishedData));
    component.saveLineHaulRecords(lineHaulDetailStatus);
  });
  it('should call saveLineHaulRecords', () => {
    const lineHaulDetailStatus = 'save';
    const publishedData = {
      status: 'warning',
      message: 'string',
      customerLineHaulConfigurationID: 1234,
    };
    spyOn(LineHaulService.prototype, 'publishLineHaulRecords').and.returnValue(of(publishedData));
    component.saveLineHaulRecords(lineHaulDetailStatus);
  });
  it('should call growlMessage', () => {
    const publishedData = {
      status: 'warning',
      message: 'string',
      customerLineHaulConfigurationID: 123,
    };
    component.growlMessage(publishedData, true);
  });
  it('should call growlMessage', () => {
    const publishedData = {
      status: 'warn',
      message: 'string',
      customerLineHaulConfigurationID: 123,
    };
    component.growlMessage(publishedData, true);
  });
  it('should call growlMessage', () => {
    const publishedData = {
      status: 'warn',
      message: 'string',
      customerLineHaulConfigurationID: 123,
    };
    component.growlMessage(publishedData, false);
  });
  it('should call toastMessage', () => {
    component.toastMessage(messageService, 'error', 'b', 'c');
  });
  it('should call canDeactivate', () => {
    component.linehaul.lineHaulModel.isEmptyLineHaul = true;
    component.linehaul.lineHaulModel.isAddLineHaul = true;
    component.reviewModel.isLineHaulPublish = true;
    component.reviewModel.isDeleteLineHaul = true;
    component.canDeactivate(canDeactivateGuardService, route, state, nextState);
  });
  it('should call canDeactivate', () => {
    component.linehaul.lineHaulModel.isEmptyLineHaul = false;
    component.linehaul.lineHaulModel.isAddLineHaul = false;
    component.reviewModel.isLineHaulPublish = false;
    component.reviewModel.isDeleteLineHaul = false;
    component.canDeactivate(canDeactivateGuardService, route, state, nextState);
  });
  it('should call onClickLineHaulBack', () => {
    component.linehaul.lineHaulModel.selectedLineHaulData = [{
      agreementName: 'abc',
      customerLineHaulConfigurationID: 123
    }];
    component.onClickLineHaulBack();
  });
  it('should call onClickLineHaulBack', () => {
    component.linehaul.lineHaulModel.selectedLineHaulData = [
      {
      agreementName: 'abc',
      customerLineHaulConfigurationID: 123
      },
      {
        agreementName: 'abcd',
        customerLineHaulConfigurationID: 1234
        }
    ];
    component.onClickLineHaulBack();
  });
  it('should call onClickLineHaulBack', () => {
    component.linehaul.lineHaulModel.selectedLineHaulData = [];
    component.onClickLineHaulBack();
  });
  it('should call navigateToAdditionalInfo', () => {
    component.linehaul.lineHaulModel.selectedLineHaulData = [{
      agreementName: 'abc',
      customerLineHaulConfigurationID: 123
    }];
    component.linehaul.lineHaulModel.lineHaulList = [{
      lineHaulConfigurationID: 123,
      laneID: 123,
      lineHaulSourceTypeID: 123,
      lineHaulSourceTypeName: 'abc',
      origin: {
        type: 'aaa',
        typeID: 123,
        country: 'aaa',
        point: 'aaa',
        pointID: 123,
        description: 'aaa',
        vendorID: 'aaa'
      },
      destination: {
        type: 'aaa',
        typeID: 123,
        country: 'aaa',
        point: 'aaa',
        pointID: 123,
        description: 'aaa',
        vendorID: 'aaa'
      },
      stops: {
        stopSequenceNumber: 123,
        stopTypeName: 'aaa',
        stopTypeID: 123,
        stopCountry: 'aaa',
        stopPoint: 'aaa',
        stopPointID: 123
      },
      stopChargeIncludedIndicator: true,
      status: 'abc',
      effectiveDate: 'abc',
      expirationDate: 'abc',
      agreementID: 123,
      agreementName: 'abc',
      contractID: 123,
      contractNumber: 'abc',
      contractName: 'abc',
      sectionID: 123,
      sectionName: 'abc',
      financeBusinessUnitServiceOfferingAssociationID: 123,
      businessUnit: 'abc',
      serviceOffering: 'abc',
      serviceOfferingDescription: 'abc',
      serviceOfferingBusinessUnitTransitModeAssociationID: 123,
      transitMode: 'abc',
      serviceLevelBusinessUnitServiceOfferingAssociationID: 123,
      serviceLevel: 'abc',
      equipmentRequirementSpecificationAssociationID: 123,
      equipmentClassificationCode: 'abc',
      equipmentTypeCode: 'abc',
      equipmentLengthQuantity: 123,
      unitOfEquipmentLengthMeasurementCode: 'abc',
      operationalServices: {
        serviceTypeCode: 'aaa'
      },
      priorityNumber: 123,
      overriddenPriority: 123,
      awardStatusID: 123,
      awardStatus: 'abc',
      rates: {
        customerLineHaulRateID: 123,
        customerLineHaulConfigurationID: 123,
        chargeUnitType: 'aaa',
        rateAmount: 123,
        minimumAmount: 123,
        maximumAmount: 123,
        currencyCode: 'aaa',
      },
      groupRateType: 'abc',
      groupRateItemIndicator: true,
      sourceID: 123,
      sourceLineHaulID: 123,
      overridenPriorityNumber: 123,
      billTos: {
        billToID: 123,
        billToName: 'aaa',
        billToCode: 'aaa',
      },
      carriers: {
        carrierID: 123,
        carrierName: 'aaa',
        carrierCode: 'aaa',
      },
      mileagePreference: {
        mileagePreferenceID: 123,
        mileagePreferenceName: 'aaa',
        mileagePreferenceMinRange: 123,
        mileagePreferenceMaxRange: 123,
      },
      unitOfMeasurement: {
        code: 'aaa',
        description: 'aaa',
        minWeightRange: 123,
        maxWeightRange: 123,
      },
      hazmatIncludedIndicator: true,
      fuelIncludedIndicator: true,
      autoInvoiceIndicator: true,
      recordStatus: 'abc',

    }];
    component.navigateToAdditionalInfo();
  });
  it('should call navigateToLaneCardPage', () => {
    const linehaul = {
      customerLineHaulConfigurationID: 123
    };
    component.linehaul.lineHaulModel.selectedLineHaulData = [{
      agreementName: 'abc',
      customerLineHaulConfigurationID: 123
    }];
    const agreementName = 'anc';
    component.navigateToLaneCardPage();
  });
  it('should call navigateToLaneCardPage', () => {
    component.linehaul.lineHaulModel.lineHaulList = [{
      lineHaulConfigurationID: 123,
      laneID: 123,
      lineHaulSourceTypeID: 123,
      lineHaulSourceTypeName: 'abc',
      origin: {
        type: 'aaa',
        typeID: 123,
        country: 'aaa',
        point: 'aaa',
        pointID: 123,
        description: 'aaa',
        vendorID: 'aaa'
      },
      destination: {
        type: 'aaa',
        typeID: 123,
        country: 'aaa',
        point: 'aaa',
        pointID: 123,
        description: 'aaa',
        vendorID: 'aaa'
      },
      stops: {
        stopSequenceNumber: 123,
        stopTypeName: 'aaa',
        stopTypeID: 123,
        stopCountry: 'aaa',
        stopPoint: 'aaa',
        stopPointID: 123
      },
      stopChargeIncludedIndicator: true,
      status: 'abc',
      effectiveDate: 'abc',
      expirationDate: 'abc',
      agreementID: 123,
      agreementName: 'abc',
      contractID: 123,
      contractNumber: 'abc',
      contractName: 'abc',
      sectionID: 123,
      sectionName: 'abc',
      financeBusinessUnitServiceOfferingAssociationID: 123,
      businessUnit: 'abc',
      serviceOffering: 'abc',
      serviceOfferingDescription: 'abc',
      serviceOfferingBusinessUnitTransitModeAssociationID: 123,
      transitMode: 'abc',
      serviceLevelBusinessUnitServiceOfferingAssociationID: 123,
      serviceLevel: 'abc',
      equipmentRequirementSpecificationAssociationID: 123,
      equipmentClassificationCode: 'abc',
      equipmentTypeCode: 'abc',
      equipmentLengthQuantity: 123,
      unitOfEquipmentLengthMeasurementCode: 'abc',
      operationalServices: {
        serviceTypeCode: 'aaa'
      },
      priorityNumber: 123,
      overriddenPriority: 123,
      awardStatusID: 123,
      awardStatus: 'abc',
      rates: {
        customerLineHaulRateID: 123,
        customerLineHaulConfigurationID: 123,
        chargeUnitType: 'aaa',
        rateAmount: 123,
        minimumAmount: 123,
        maximumAmount: 123,
        currencyCode: 'aaa',
      },
      groupRateType: 'abc',
      groupRateItemIndicator: true,
      sourceID: 123,
      sourceLineHaulID: 123,
      overridenPriorityNumber: 123,
      billTos: {
        billToID: 123,
        billToName: 'aaa',
        billToCode: 'aaa',
      },
      carriers: {
        carrierID: 123,
        carrierName: 'aaa',
        carrierCode: 'aaa',
      },
      mileagePreference: {
        mileagePreferenceID: 123,
        mileagePreferenceName: 'aaa',
        mileagePreferenceMinRange: 123,
        mileagePreferenceMaxRange: 123,
      },
      unitOfMeasurement: {
        code: 'aaa',
        description: 'aaa',
        minWeightRange: 123,
        maxWeightRange: 123,
      },
      hazmatIncludedIndicator: true,
      fuelIncludedIndicator: true,
      autoInvoiceIndicator: true,
      recordStatus: 'abc',

    }];
    component.reviewModel.customerAgreementData.customerLineHaulConfigurationID = 121;
    component.navigateToLaneCardPage();
  });
  it('should call onIndexChange', () => {
    const index = 1;
    component.onIndexChange(index);
  });
  it('should call showComponents', () => {
    const index = 1;
    component.showComponents(index);
  });
  it('should call showComponents', () => {
    const index = 0;
    component.showComponents(index);
  });
  it('should call showComponents', () => {
    const index = 3;
    component.showComponents(index);
  });
});
