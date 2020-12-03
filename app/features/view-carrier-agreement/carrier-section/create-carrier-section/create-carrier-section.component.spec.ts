import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { HttpResponseBase, HttpHeaders } from '@angular/common/http';

import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';

import { AppModule } from '../../../../app.module';
import { ViewCarrierAgreementModule } from '../../view-carrier-agreement.module';
import { CreateCarrierSectionComponent } from './create-carrier-section.component';
import { CreateCarrierSectionService } from './service/create-carrier-section.service';
import { RootObject, ESRootObject } from './model/create-carrier-section.interface';

describe('CreateCarrierSectionComponent', () => {
  let component: CreateCarrierSectionComponent;
  let fixture: ComponentFixture<CreateCarrierSectionComponent>;
  let shared: BroadcasterService;
  let service: CreateCarrierSectionService;
  let carrierSegmentResponse: RootObject;
  let accountResponse: ESRootObject;
  let successResponse: HttpResponseBase;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewCarrierAgreementModule, HttpClientTestingModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCarrierSectionComponent);
    component = fixture.componentInstance;
    shared = TestBed.get(BroadcasterService);
    service = TestBed.get(CreateCarrierSectionService);
    component.agreementDetails = {
      'agreementName': 'ABC Agreement',
      'agreementStatus': 'Active',
      'agreementType': 'Carrier',
      'carriers': [
        {
          'carrierID': 145,
          'carrierName': 'CMS Carrier',
          'carrierCode': 'SCAC01'
        },
        {
          'carrierID': 146,
          'carrierName': 'Walmart Carrier',
          'carrierCode': 'WALM01'
        }
      ],
      'agreementEffectiveDate': '1995-01-01',
      'agreementExpirationDate': '2099-12-31'
    };
    component.createSectionForm();
    successResponse = {
      'headers': new HttpHeaders(),
      'ok': true,
      'status': 201,
      'statusText': 'Created',
      'type': 4,
      'url': ''
    };
    carrierSegmentResponse = {
      '_embedded': {
        'carrierSegmentTypes': [
          {
            'carrierSegmentTypeID': '1',
            'carrierSegmentTypeName': 'Dray',
            'defaultBusinessUnitCode': 'ICS',
            'effectiveDate': '1/1/1995',
            'expirationDate': '12/31/2099',
            'defaultIndicator': 'Y'
          },
          {
            'carrierSegmentTypeID': '2',
            'carrierSegmentTypeName': 'FTL',
            'defaultBusinessUnitCode': 'JBI',
            'effectiveDate': '1/1/1995',
            'expirationDate': '12/31/2099',
            'defaultIndicator': 'N'
          }
        ]
      }
    };
    accountResponse = {
      took: 14,
      timed_out: false,
      _shards: {
        total: 3,
        successful: 3,
        skipped: 0,
        failed: 0
      },
      hits: {
        total: 3841,
        max_score: 0,
        hits: []
      },
      aggregations: {
        unique: {
          doc_count_error_upper_bound: 3,
          sum_other_doc_count: 3830,
          buckets: [
            {
              key: 'Furniture Of America',
              doc_count: 3,
              Level: {
                hits: {
                  total: 3,
                  max_score: 13.393717,
                  hits: [
                    {
                      _index: 'masterdata-account-hierarchy',
                      _type: 'doc',
                      _id: '10972',
                      _score: 13.393717,
                      _source: {
                        OrganizationHierarchyID: 10972,
                        HierarchyID: 4,
                        Level: 'Ultimate Parent',
                        OrganizationID: 23008,
                        OrganizationName: 'Furniture Of America',
                        OrganizationAliasName: 'FOA Group',
                        OrganizationCode: 'FUCI24'
                      }
                    }
                  ]
                }
              }
            }
          ]
        }
      }
    };
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call ngOnDestroy', () => {
    component.ngOnDestroy();
  });
  it('should call navigationSubscription', () => {
    spyOn(shared, 'on').and.returnValue(of(true));
    component.navigationSubscription();
  });
  it('should call saveSubscription', () => {
    spyOn(shared, 'on').and.returnValue(of(true));
    component.saveSubscription();
  });
  it('should call valueChangesSubscription', () => {
    component.createSectionModel.carrierSectionForm.patchValue({sectionName: 'test'});
    component.valueChangesSubscription();
  });
  it('should call createSectionForm', () => {
    component.createSectionForm();
  });
  it('should call callCarrierSegmentType', () => {
    spyOn(service, 'getCarrierSegmentTypes').and.returnValue(of(carrierSegmentResponse));
    component.callCarrierSegmentType();
  });
  it('should call getCarrierSegmentList', () => {
    component.getCarrierSegmentList(carrierSegmentResponse._embedded);
  });
  it('should call onAutoCompleteSearch', () => {
    component.onAutoCompleteSearch('a', 'carrierSegmentList', 'carrierSegmentFilteredList');
  });
  it('should call onAutoCompleteClear for 1st if condition', () => {
    component.onAutoCompleteClear('', 'carrierSegment');
  });
  it('should call onAutoCompleteClear for 2nd if condition', () => {
    component.onAutoCompleteClear('', 'account');
  });
  it('should call onCarrierSegmentSelect', () => {
    const selectedValue = {
      label: 'Dray',
      value: {
        'carrierSegmentTypeID': '1',
        'carrierSegmentTypeName': 'Dray',
        'defaultBusinessUnitCode': 'ICS',
        'effectiveDate': '1/1/1995',
        'expirationDate': '12/31/2099',
        'defaultIndicator': 'Y'
      }
    };
    component.onCarrierSegmentSelect(selectedValue);
  });
  it('should call callBusinessUnit', () => {
    const businessUnitResponse = {
      _embedded: {
        serviceOfferingBusinessUnitTransitModeAssociations: [{
          financeBusinessUnitServiceOfferingAssociation: {
            financeBusinessUnitServiceOfferingAssociationID: null,
            financeBusinessUnitCode: 'DCS',
            serviceOfferingCode: null,
            effectiveTimestamp: null,
            expirationTimestamp: null,
            lastUpdateTimestampString: null
          },
          transitMode: null,
          utilizationClassification: null,
          freightShippingType: null,
          lastUpdateTimestampString: null,
          _links: {
            self: { href: '' },
            serviceOfferingBusinessUnitTransitModeAssociation: { href: '', templated: true }
          }
        }]
      },
      _links: { self: { href: '' } }
    };
    spyOn(service, 'getBusinessUnit').and.returnValue(of(businessUnitResponse));
    component.callBusinessUnit();
  });
  it('should call getBusinessUnit', () => {
    const data = [{
      financeBusinessUnitServiceOfferingAssociation: {
        financeBusinessUnitServiceOfferingAssociationID: null,
        financeBusinessUnitCode: 'DCS',
        serviceOfferingCode: null,
        effectiveTimestamp: null,
        expirationTimestamp: null,
        lastUpdateTimestampString: null
      },
      transitMode: null,
      utilizationClassification: null,
      freightShippingType: null,
      lastUpdateTimestampString: null,
      _links: {
        self: { href: '' },
        serviceOfferingBusinessUnitTransitModeAssociation: { href: '', templated: true }
      }
    }];
    component.getBusinessUnit(data);
  });
  it('should call onDateSelected for if condition', () => {
    component.onDateSelected(new Date(), 0);
  });
  it('should call onDateSelected for else condition', () => {
    component.onDateSelected(new Date(), 1);
  });
  it('should call onTypeDate for if condition for effective', () => {
    component.onTypeDate('07/25/2019', 'effective');
  });
  it('should call onTypeDate for if condition for expiration', () => {
    component.onTypeDate('07/25/2019', 'expiration');
  });
  it('should call onTypeDate for else condition for effective', () => {
    component.onTypeDate('', 'effective');
  });
  it('should call onTypeDate for else condition for expiration', () => {
    component.onTypeDate('', 'expiration');
  });
  it('should call onAccountSearch', () => {
    spyOn(service, 'getAccountName').and.returnValue(of(accountResponse));
    component.onAccountSearch('a');
  });
  it('should call handleAccountSearchData', () => {
    component.handleAccountSearchData(accountResponse);
  });
  it('should call onAccountSelect without date', () => {
    const data = {
      label: 'Abf Freight Systems Albnmx (ABFOAV)',
      value: {
        'OrganizationHierarchyID': 38584,
        'HierarchyID': 7,
        'Level': 'Bill To',
        'OrganizationID': 17645,
        'OrganizationName': 'Abf Freight Systems Albnmx',
        'OrganizationAliasName': 'ABF Freight Systems Chnvax',
        'OrganizationCode': 'ABFOAV'
      }
    };
    component.onAccountSelect(data);
  });
  it('should call onClickSave for if condition', () => {
    component.createSectionModel.carrierSectionForm.patchValue({
      carrierSegment: {label: 'Dray', value: {
        'carrierSegmentTypeID': '1',
        'carrierSegmentTypeName': 'Dray',
        'defaultBusinessUnitCode': 'ICS',
        'effectiveDate': '1/1/1995',
        'expirationDate': '12/31/2099'
      }},
      businessUnit: {label: 'ICS', value: 'ICS'}, sectionName: 'sec1',
      effectiveDate: new Date(), expirationDate: new Date(),
      account: { label: 'Abf Freight Systems Albnmx (ABFOCH)', value: {
        HierarchyID: 7,
        Level: 'Bill To',
        OrganizationAliasName: 'ABF Freight Systems Shrlax',
        OrganizationCode: 'ABFOCH',
        OrganizationHierarchyID: 38625,
        OrganizationID: 33119,
        OrganizationName: 'Abf Freight Systems Albnmx'
      }}
    });
    component.createSectionModel.selectedCodesList = [{
      assignment: 'Unassigned',
      billToDisplay: 'Wal-Mart Stores, Inc (WMSTI)',
      rowDetail: {
        billingPartyCode: 'WMSTI', billingPartyID: '10844', billingPartyName: 'Wal-Mart Stores, Inc',
        sectionID: null, sectionName: null }
    }];
    spyOn(service, 'saveCarrierSection').and.returnValue(of(successResponse));
    component.onClickSave();
  });
  it('should call onClickSave for else condition', () => {
    component.onClickSave();
  });
  it('should call showToastMessage', () => {
    component.showToastMessage('success', 'Section Created!', 'You have created the section successfully!');
  });
  it('should call onClickCancel for if condition', () => {
    component.createSectionModel.carrierSectionForm.markAsDirty();
    component.createSectionModel.carrierSectionForm.markAsTouched();
    component.onClickCancel();
  });
  it('should call onClickCancel for else condition', () => {
    component.onClickCancel();
  });
  it('should call cancelSplitView', () => {
    component.cancelSplitView();
  });
  it('should call popupCancel', () => {
    component.popupCancel();
  });
});
