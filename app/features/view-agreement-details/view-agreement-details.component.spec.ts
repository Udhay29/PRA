import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppModule } from '../../app.module';
import { ViewAgreementDetailsModule } from './view-agreement-details.module';
import { ViewAgreementDetailsComponent } from './view-agreement-details.component';
import { LocalStorageService } from './../../shared/jbh-app-services/local-storage.service';
import { ViewAgreementDetailsService } from './service/view-agreement-details.service';
import { BroadcasterService } from '../../shared/jbh-app-services/broadcaster.service';
import { AgreementDetails } from './model/view-agreement-details.interface';
describe('ViewAgreementDetailsComponent', () => {
  let component: ViewAgreementDetailsComponent;
  let fixture: ComponentFixture<ViewAgreementDetailsComponent>;
  let localStore: LocalStorageService;
  let route: ActivatedRoute;
  let service: ViewAgreementDetailsService;
  let shared: BroadcasterService;
  let agreementDetails: AgreementDetails;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAgreementDetailsComponent);
    component = fixture.componentInstance;
    localStore = TestBed.get(LocalStorageService);
    route = TestBed.get(ActivatedRoute);
    service = TestBed.get(ViewAgreementDetailsService);
    shared = TestBed.get(BroadcasterService);
    agreementDetails = {
      'customerAgreementID' : 92143,
      'customerAgreementName' : 'Family Dollar 11878 (FABU5)',
      'agreementType' : 'Customer',
      'ultimateParentAccountID' : 135992,
      'currencyCode' : 'USD',
      'cargoReleaseAmount' : 100000.0000,
      'businessUnits' : [ 'JBI', 'JBT', 'ICS', 'DCS' ],
      'taskAssignmentIDs' : null,
      'effectiveDate' : '1995-01-01',
      'expirationDate' : '2099-12-31',
      'invalidIndicator' : 'N',
      'invalidReasonTypeName' : 'Active'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call popupCancel', () => {
    component.popupCancel();
  });
  it('should call popupYes for if condition', () => {
    component.viewAgreementModel.changedEvent = '';
    component.viewAgreementModel.routingUrl = '/dashboard';
    component.popupYes();
  });
  it('should call popupYes for else condition', () => {
    component.viewAgreementModel.changedEvent = 'Sections';
    localStore.setItem('createSection', 'valueChanges', true, true);
    component.popupYes();
  });
  it('should call showPopup', () => {
    component.showPopup();
  });
  it('should call onChangeValue for if condition', () => {
    localStore.setItem('createSection', 'valueChanges', true, true);
    component.onChangeValue('Mileage');
  });
  it('should call onChangeValue for else condition', () => {
    component.onChangeValue('Sections');
  });
  it('should call onChangeValue for else condition', () => {
    component.onChangeValue('Contracts');
  });
  it('should call onChangeValue for else condition', () => {
    component.onChangeValue('Line Haul');
  });
  it('should call onChangeValue for else condition', () => {
    component.onChangeValue('Rating Rule');
  });
  it('should call onChangeValue for else condition', () => {
    component.onChangeValue('Accessorials');
  });
  it('should call resetShowVariables', () => {
    component.resetShowVariables();
  });
  it('should call getAgreementId', () => {
    spyOn(service, 'getAgreementDetails').and.returnValue(of(agreementDetails));
    component.getAgreementId();
  });
  it('should call getOverflowMenuList', () => {
    component.getOverflowMenuList();
  });
  it('should call getDetailsList for if condition', () => {
    localStore.setItem('agreementDetails', 'create', true, true);
    const detailList = [ 'Contracts', 'Sections', 'Cargo Release', 'Mileage', 'Line Haul', 'Accessorials', 'Fuel', 'Rating Rule' ];
    spyOn(service, 'getDetailsList').and.returnValue(of(detailList));
    component.getDetailsList();
  });
  it('should call getDetailsList for else condition', () => {
    const detailList = [ 'Contracts', 'Sections', 'Cargo Release', 'Mileage', 'Line Haul', 'Accessorials', 'Fuel', 'Rating Rule' ];
    spyOn(service, 'getDetailsList').and.returnValue(of(detailList));
    component.getDetailsList();
  });
  it('should call mileageDatatableSubscription', () => {
    spyOn(shared, 'on').and.returnValue(of('mileage'));
    component.mileageDatatableSubscription();
  });
  it('should call mileageDatatableSubscription err', () => {
    const err = {
      'traceid' : '343481659c77ad99',
      'errors' : [ {
        'fieldErrorFlag' : false,
        'errorMessage' : 'Failed to convert undefined into java.lang.Integer!',
        'errorType' : 'System Runtime Error',
        'fieldName' : null,
        'code' : 'ServerRuntimeError',
        'errorSeverity' : 'ERROR'
      } ]
    };
    spyOn(shared, 'on').and.returnValue(throwError(err));
    component.mileageDatatableSubscription();
  });
  it('should call getStatus for if condition', () => {
    component.getStatus(agreementDetails);
  });
  it('should call getStatus for else condition', () => {
    const agreementDetail = {
      'customerAgreementID' : 92143,
      'customerAgreementName' : 'Family Dollar 11878 (FABU5)',
      'agreementType' : 'Customer',
      'ultimateParentAccountID' : 135992,
      'currencyCode' : 'USD',
      'cargoReleaseAmount' : 100000.0000,
      'businessUnits' : [ 'JBI', 'JBT', 'ICS', 'DCS' ],
      'taskAssignmentIDs' : null,
      'effectiveDate' : '1995-01-01',
      'expirationDate' : '2099-12-31',
      'invalidIndicator' : 'N',
      'invalidReasonTypeName' : 'Inactive'
    };
    component.getStatus(agreementDetail);
  });
  it('should call isActive', () => {
    component.isActive('2099-12-31');
  });
  it('should call getAgreementName', () => {
    component.getAgreementName(agreementDetails);
  });
  it('should call setManageTeams', () => {
    component.setManageTeams(agreementDetails);
  });
  it('should call onTeamsClose', () => {
    component.onTeamsClose(true);
  });
  it('should call successCall', () => {
    component.viewAgreementModel.agreementName = 'Family Dollar 11878';
    component.successCall(true);
  });
  it('should call toastMessage', () => {
    component.toastMessage('success', '', '');
  });
  it('should call loader', () => {
    component.loader(true);
  });
  it('should call setTabIndex', () => {
    component.setTabIndex({id: 0, text: 'rates'});
  });
  it('should call getAccessorialDocumentTab', () => {
    const res = {
      '_embedded': {
         'customerAccessorialDocumentConfigurations': [
            {
               '@id': 1,
               'customerAgreementId': 61,
               'chargeTypeId': 43,
               'equipmentClassificationCode': null,
               'equipmentClassificationTypeAssociationId': null,
               'equipmentRequirementSpecificationAssociationId': null,
               'inactivateLevelId': null,
               'invalidIndicator': 'N',
               'invalidReasonTypeId': 1,
               'effectiveDate': '2019-05-29',
               'expirationDate': '2099-12-31',
               'accessorialGroupTypeId': null,
               'customerAccessorialDocumentText': {
                  '@id': 1,
                  'documentTextName': 'test',
                  'documentText': 'test text',
                  'lastUpdateTimestampString': '2019-05-29T07:21:36.196',
                  '_links': {
                     'customerAccessorialDocumentConfiguration': {
                        'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/customerAccessorialDocumentConfigurations/84'
                     }
                  }
               },
               'customerAccessorialDocumentAttachments': [],
               'customerAccessorialDocumentCarriers': [
                  {
                     '@id': 1,
                     'customerAccessorialDocumentConfigurationId': 84,
                     'carrierId': 66,
                     'lastUpdateTimestampString': '2019-05-29T07:21:36.187'
                  }
               ],
               'customerAccessorialDocumentRequestServices': [],
               'customerAccessorialDocumentServiceLevelBusinessUnitServiceOfferings': [
                  {
                     '@id': 1,
                     'customerAccessorialDocumentConfigurationId': 84,
                     'serviceLevelBusinessUnitServiceOfferingAssociationId': 12,
                     'lastUpdateTimestampString': '2019-05-29T07:21:36.192'
                  },
                  {
                     '@id': 2,
                     'customerAccessorialDocumentConfigurationId': 84,
                     'serviceLevelBusinessUnitServiceOfferingAssociationId': 1,
                     'lastUpdateTimestampString': '2019-05-29T07:21:36.195'
                  }
               ],
               'lastUpdateTimestampString': '2019-05-29T07:21:36.114',
               '_links': {
                  'self': {
                     'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/customerAccessorialDocumentConfigurations/84'
                  },
                  'customerAccessorialDocumentConfiguration': {
                     'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/customerAccessorialDocumentConfigurations/84'
                  },
                  'customerAccessorialDocumentAccounts': {
                     'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices'
                  },
                  'accessorialDocumentType': {
                     'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices'
                  }
               }
            }
    ]
  }
  };
  component.viewAgreementModel.rateTabflag = true;
    spyOn(service, 'getDocumentDetails').and.returnValue(of(res));
    component.getAccessorialDocumentTab(12);
  });
  it('should call getAccessorialDocumentTab err', () => {
    const err = {
      'traceid' : '343481659c77ad99',
      'errors' : [ {
        'fieldErrorFlag' : false,
        'errorMessage' : 'Failed to convert undefined into java.lang.Integer!',
        'errorType' : 'System Runtime Error',
        'fieldName' : null,
        'code' : 'ServerRuntimeError',
        'errorSeverity' : 'ERROR'
      } ]
    };
    spyOn(service, 'getDocumentDetails').and.returnValue(throwError(err));
    component.getAccessorialDocumentTab(12);
  });
});
