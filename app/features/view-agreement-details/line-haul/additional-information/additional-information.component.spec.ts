import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { AppModule } from '../../../../app.module';
import { ViewAgreementDetailsModule } from '../../view-agreement-details.module';
import { AdditionalInformationModel } from './model/additional-information.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AdditionalInformationComponent } from './additional-information.component';
import { ViewAgreementDetailsUtility } from '../../service/view-agreement-details-utility';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanDeactivateGuardService } from '../../../../shared/jbh-app-services/can-deactivate-guard.service';
import { LineHaulOverviewService } from '../additional-information/line-haul-overview/services/line-haul-overview.service';
import { AdditionalInfoModel } from '../add-line-haul/additional-info/models/additional-info.model';

describe('AdditionalInformationComponent', () => {
  let component: AdditionalInformationComponent;
  let fixture: ComponentFixture<AdditionalInformationComponent>;
  let agreementUtility: ViewAgreementDetailsUtility;
  let canDeactivateGuardService: CanDeactivateGuardService;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;
  let nextState: RouterStateSnapshot;
  let lineHaulOverviewService: LineHaulOverviewService;
  const lineHaulDetail: any = {
    'customerLineHaulConfigurationID': 6149,
    'laneID': 3638,
    'lineHaulSourceTypeID': 4,
    'lineHaulSourceTypeName': 'Manual ',
    'origin': {
      'type': 'Address',
      'typeID': 3,
      'country': null,
      'point': null,
      'pointID': 301256,
      'description': null,
      'vendorID': null,
      'addressLine1': null,
      'addressLine2': null,
      'cityName': null,
      'countryCode': null,
      'countryName': null,
      'postalCode': null,
      'stateCode': null,
      'stateName': null,
      'lowerBoundID': null,
      'lowerBound': null,
      'upperBoundID': null,
      'upperBound': null,
      'boundRange': null
    },
    'destination': {
      'type': 'Address',
      'typeID': 3,
      'country': null,
      'point': null,
      'pointID': 124446,
      'description': null,
      'vendorID': null,
      'addressLine1': null,
      'addressLine2': null,
      'cityName': null,
      'countryCode': null,
      'countryName': null,
      'postalCode': null,
      'stateCode': null,
      'stateName': null,
      'lowerBoundID': null,
      'lowerBound': null,
      'upperBoundID': null,
      'upperBound': null,
      'boundRange': null
    },
    'stops': [
    ],
    'stopChargeIncludedIndicator': false,
    'status': 'Draft',
    'effectiveDate': '2019-08-01',
    'expirationDate': '2019-08-02',
    'customerAgreementID': 134,
    'customerAgreementName': 'The Home Depot Inc (HDAT)',
    'customerAgreementContractID': 263,
    'customerAgreementContractNumber': 'CONT0010',
    'customerAgreementContractName': 'Primary Home Depot Account',
    'customerAgreementContractSectionID': 1545,
    'customerAgreementContractSectionName': 'section4682840',
    'financeBusinessUnitServiceOfferingAssociationID': 1,
    'financeBusinessUnitName': 'JBT',
    'serviceOfferingCode': 'OTR',
    'serviceOfferingDescription': 'Over The Road',
    'serviceOfferingBusinessUnitTransitModeAssociationID': 1,
    'transitMode': 'Truck',
    'transitModeDescription': 'Transit By Truck',
    'serviceLevelBusinessUnitServiceOfferingAssociationID': null,
    'serviceLevelCode': null,
    'serviceLevelDescription': null,
    'equipmentRequirementSpecificationAssociationID': null,
    'equipmentClassificationCode': 'Chassis',
    'equipmentClassificationCodeDescription': 'CHASSIS',
    'equipmentTypeCode': null,
    'equipmentTypeCodeDescription': null,
    'equipmentLengthQuantity': null,
    'unitOfEquipmentLengthMeasurementCode': null,
    'operationalServices': [
    ],
    'priorityLevelNumber': 65,
    'overiddenPriorityLevelNumber': null,
    'lineHaulAwardStatusTypeID': 1,
    'lineHaulAwardStatusTypeName': 'Primary',
    'rates': [
      {
        'customerLineHaulRateID': 6688,
        'customerLineHaulConfigurationID': 6149,
        'chargeUnitTypeName': 'Flat',
        'rateAmount': 12,
        'minimumAmount': null,
        'maximumAmount': null,
        'currencyCode': 'CAD',
        'rateDisplayAmount': '$12.00',
        'minDisplayAmount': null,
        'maxDisplayAmount': null
      }
    ],
    'groupRateType': null,
    'groupRateItemizeIndicator': false,
    'sourceID': null,
    'sourceLineHaulID': null,
    'billTos': null,
    'carriers': [
    ],
    'mileagePreference': null,
    'unitOfMeasurement': null,
    'hazmatIncludedIndicator': false,
    'fuelIncludedIndicator': false,
    'autoInvoiceIndicator': true,
    'createdUserId': 'rcon770',
    'lastUpdateUserId': 'rcon770',
    'recordStatus': 'active',
    'dbSyncUpdateTimestamp': null,
    'equipmentLengthDisplayName': '',
    'customerAgreementContractDisplayName': 'CONT0010 (Primary Home Depot Account)'
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, ViewAgreementDetailsUtility, CanDeactivateGuardService,
        LineHaulOverviewService, { provide: RouterStateSnapshot, useValue: AdditionalInformationComponent },
      { provide: ActivatedRouteSnapshot, useValue: AdditionalInformationComponent }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalInformationComponent);
    component = fixture.componentInstance;
    agreementUtility = TestBed.get(ViewAgreementDetailsUtility);
    lineHaulOverviewService = TestBed.get(LineHaulOverviewService);
    canDeactivateGuardService = TestBed.get(CanDeactivateGuardService);
    route = TestBed.get(ActivatedRouteSnapshot);
    state = TestBed.get(RouterStateSnapshot);
    nextState = TestBed.get(RouterStateSnapshot);
    agreementUtility.setLineHaulDates({ 'effectiveDate': '01/01/2019', 'expirationDate': '01/01/2099' });
    const obj: any = { 'isAdditionalInfo': true, 'isLineHaulReviewed': true, 'isLaneCardInfo': false };
    agreementUtility.setreviewwizardStatus(obj);
    const nameConfigurationDetails: any = {
      customerAgreementName: 'Family Dollar 12166 (FAFR8)',
      lineHaulConfigurationID: 1814
    };
    agreementUtility.setConfigurationID(nameConfigurationDetails);
    component.addtionalInfoComponentRef.additionalInfoModel = new AdditionalInfoModel();
    component.addtionalInfoComponentRef.additionalInfoModel.linehaulOverviewData = {
      'originType' : '3-Zip',
      'destinationType' : '3-Zip'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    component.ngOnInit();
  });

  xit('should call canDeactivate', () => {
    component.addtionalInfoComponentRef.additionalInfoModel.additionalInformationForm.controls.weightUnitOfMeasure.setValue('12212');
    component.canDeactivate(canDeactivateGuardService, route, state, nextState);
  });
  it('should call canDeactivate-else', () => {
    component.canDeactivate(canDeactivateGuardService, route, state, nextState);
  });

  it('should call getLineHaulOverview', () => {
    spyOn(lineHaulOverviewService, 'getLineHaulOverView').and.returnValues(of(lineHaulDetail));
    component.getLineHaulOverview();
  });

  xit('should call additionalInfoWizardEnable', () => {
    const stepList: any = [{ 'label': 'Line Haul Details', 'disabled': true }, {
      'label': 'Additional Information',
      'disabled': false
    }, { 'label': 'Review', 'disabled': true }];
    component.additionalInformationModel.stepsList = stepList;
    fixture.detectChanges();
    component.additionalInfoWizardEnable();
  });

  it('should call onIndexChange-0', () => {
    component.onIndexChange(0);
  });
  it('should call onIndexChange-1', () => {
    component.onIndexChange(1);
  });
  it('should call onIndexChange-2', () => {
    component.onIndexChange(2);
  });

  xit('should call navigateToLaneCardPage', () => {
    component.navigateToLaneCardPage();
  });

  xit('should call navigateToReviewPage', () => {
    component.navigateToReviewPage();
  });

});
