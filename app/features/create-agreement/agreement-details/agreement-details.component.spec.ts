import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { Router } from '@angular/router';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../app.module';
import { CreateAgreementModule } from './../create-agreement.module';
import { AgreementDetailsComponent } from './agreement-details.component';
import { LocalStorageService } from './../../../shared/jbh-app-services/local-storage.service';
import { AgreementDetailsService } from './service/agreement-details.service';
import { BroadcasterService } from '../../../shared/jbh-app-services/broadcaster.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpHeaders, HttpResponseBase, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

describe('AgreementDetailsComponent', () => {
  let component: AgreementDetailsComponent;
  let fixture: ComponentFixture<AgreementDetailsComponent>;
  let store: LocalStorageService;
  let service: AgreementDetailsService;
  let shared: BroadcasterService;
  let router: Router;
  let errorResponse: HttpErrorResponse;
  const formBuilder: FormBuilder = new FormBuilder();
  let carrierDetailsForm: FormGroup;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, CreateAgreementModule, HttpClientTestingModule],
      providers: [LocalStorageService, { provide: APP_BASE_HREF, useValue: '/' }]
    });
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementDetailsComponent);
    component = fixture.componentInstance;
    store = TestBed.get(LocalStorageService);
    service = TestBed.get(AgreementDetailsService);
    shared = TestBed.get(BroadcasterService);
    router = TestBed.get(Router);
    const agreementDetail = {
      'customerAgreementID': 1072,
      'customerAgreementName': 'Qaqa1 (QABI2)',
      'agreementType': 'Customer',
      'ultimateParentAccountID': 1402,
      'currencyCode': null,
      'cargoReleaseAmount': null,
      'businessUnits': null,
      'taskAssignmentIDs': null,
      'effectiveDate': '1995-01-01',
      'expirationDate': '2099-12-31',
      'invalidIndicator': 'N',
      'invalidReasonTypeName': null,
      'teams': null
    };
    store.setItem('createAgreement', 'detail', agreementDetail);
    errorResponse = {
      headers: new HttpHeaders(),
      status: 400,
      message: '',
      name: '', ok: false, statusText: '', url: '', type: HttpEventType.Response,
      error: {
        errors: [ {
          'fieldErrorFlag' : false,
          'errorMessage' : '70',
          'errorType' : 'Business Validation Error',
          'fieldName' : null,
          'code' : 'AGREEMENT_NAME_DUPLICATE',
          'errorSeverity' : 'ERROR'
        }]
      }
    };
    carrierDetailsForm = formBuilder.group({
      carrierAgreement: formBuilder.array([]),
      carrierAgreementName: [null, Validators.required]
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call checkStore', () => {
    component.checkStore();
  });
  it('should call saveSubscription for true condition', () => {
    spyOn(shared, 'on').and.returnValue(of(true));
    component.saveSubscription();
  });
  it('should call saveSubscription for false condition', () => {
    component.agreementDetailsModel.routeUrl = '/dashboard';
    spyOn(shared, 'on').and.returnValue(of(false));
    component.saveSubscription();
  });
  it('should call navigationSubscription', () => {
    router.navigate(['/searchagreement']);
    component.agreementDetailsModel.agreementDetailsForm.patchValue({
      'agreementType': 'carrier'
    });
    component.navigationSubscription();
  });
  it('should call navigationSubscription Customer', () => {
    const value = { url: 'test' };
    spyOn(BroadcasterService.prototype, 'on').and.returnValue(of(value));
    spyOn(BroadcasterService.prototype, 'broadcast').and.callThrough();
    component.agreementDetailsModel.agreementDetailsForm.controls['agreementType'].setValue('Customer');
    component.agreementDetailsModel.isDetailsSaved = true;
    component.agreementDetailsModel.isNeedToSave = false;
    component.navigationSubscription();
  });
  it('should call navigationSubscription carrier', () => {
    const value = { url: 'test' };
    spyOn(BroadcasterService.prototype, 'on').and.returnValue(of(value));
    spyOn(BroadcasterService.prototype, 'broadcast').and.callThrough();
    component.agreementDetailsModel.agreementDetailsForm.controls['agreementType'].setValue('Carrier');
    component.agreementDetailsModel.carrierDetailsForm = carrierDetailsForm;
    component.agreementDetailsModel.carrierDetailsForm.markAsDirty();
    component.agreementDetailsModel.carrierDetailsForm.markAsTouched();
    component.navigationSubscription();
  });
  it('should call navigationSubscription for else', () => {
    const value = { url: 'test' };
    spyOn(BroadcasterService.prototype, 'on').and.returnValue(of(value));
    spyOn(BroadcasterService.prototype, 'broadcast').and.callThrough();
    component.agreementDetailsModel.agreementDetailsForm.controls['agreementType'].setValue('none');
    component.navigationSubscription();
  });
  it('should call createAgreementDetailsForm', () => {
    component.createAgreementDetailsForm();
  });
  it('should call createCarrierForm', () => {
    component.createCarrierForm();
  });
  it('should call onClearAccount', fakeAsync(() => {
    const agreementTypeChangedMock = spyOn(component, 'onClearAccount');
    fixture.debugElement.query(By.css('#accountNameField')).triggerEventHandler('onClear', []);
    expect(agreementTypeChangedMock).toHaveBeenCalled();
  }));
  it('should call onClearAccount', () => {
    const event: any = {
      target: {
        value: 'abc'
      }
    };
    component.onClearAccount(event);
  });
  it('should call onClearAccount for else', () => {
    const event: any = {
      target: {
        value: ''
      }
    };
    component.onClearAccount(event);
  });
  it('should call getAgreementTypeList', () => {
    component.agreementDetailsModel.defaultText = 'customer';
    const agreementTypeResponse = {
      '_embedded': {
        'agreementTypes': [{
          'agreementTypeID': 1,
          'agreementTypeName': 'Customer',
          '_links': {
            'self': {
              'href': ''
            },
            'agreementType': {
              'href': '',
              'templated': true
            }
          }
        }]
      },
      '_links': {
        'self': {
          'href': ''
        }
      }
    };
    spyOn(service, 'getAgreementType').and.returnValue(of(agreementTypeResponse));
    component.getAgreementTypeList();
  });
  it('should call checkAgreementType for if condition', () => {
    const event = {
      originalEvent: new MouseEvent('onChange', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      }), value: 'Carrier'
    };
    component.agreementDetailsModel.selectedAgreementType = 'Carrier';
    component.agreementDetailsModel.agreementDetailsForm.patchValue({
      agreementType: 'Carrier'});
    component.agreementDetailsModel.agreementType = 'Customer';
    const accountDetails = {
      OrganizationName: 'Advantra (ADAT68)',
      accountCode: 'ADAT68',
      accountName: 'Advantra',
      partyId: 44658
    };
    component.agreementDetailsModel.agreementDetailsForm.patchValue({
      accountName: accountDetails,
      teams: ''
    });
    component.checkAgreementType(event);
  });
  it('should call checkAgreementType for else condition', () => {
    const event = {
      originalEvent: new MouseEvent('onChange', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      }), value: 'Carrier'
    };
    component.agreementDetailsModel.selectedAgreementType = 'Carrier';
    component.agreementDetailsModel.agreementType = 'Carrier';
    component.checkAgreementType(event);
  });
  it('should call onClickPopupNo', () => {
    component.onClickPopupNo();
  });
  it('should call onClickPopupYes for if condition', () => {
    component.agreementDetailsModel.agreementDetailsForm.patchValue({
      agreementType: 'Customer'
    });
    component.agreementDetailsModel.selectedAgreementType = 'Carrier';
  });
  it('should call onClickPopupYes for else condition', () => {
    component.agreementDetailsModel.agreementDetailsForm.patchValue({
      agreementType: 'Carrier'
    });
    component.agreementDetailsModel.selectedAgreementType = 'Customer';
  });
  it('should call agreementTypeChanged', () => {
    const event = {
      originalEvent: new MouseEvent('onChange', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      }), value: 'Carrier'
    };
    component.agreementDetailsModel.agreementType = 'Carrier';
    component.agreementTypeChanged(event);
  });
  it('should call agreementTypeChanged', () => {
    const event = {
      originalEvent: new MouseEvent('onChange', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      }), value: 'Carrier'
    };
    component.agreementDetailsModel.agreementType = 'Customer';
    component.agreementTypeChanged(event);
  });
  it('should call agreementChanged for customer case', () => {
    component.agreementDetailsModel.selectedAgreementType = 'Customer';
    component.agreementDetailsModel.agreementDetailsForm.patchValue({
      agreementType: 'Customer'});
    component.agreementChanged('Customer');
  });
  it('should call agreementChanged for carrier case', () => {
    component.agreementDetailsModel.selectedAgreementType = 'Carrier';
    component.agreementDetailsModel.agreementDetailsForm.patchValue({
      agreementType: 'Carrier'});
    component.agreementChanged('Carrier');
  });
  it('should call agreementChanged for rail case', () => {
    component.agreementDetailsModel.selectedAgreementType = 'Rail';
    component.agreementDetailsModel.agreementDetailsForm.patchValue({
      agreementType: 'Rail'});
    component.agreementChanged('Rail');
  });
  it('should call resetAgreementType', () => {
    component.resetAgreementType();
  });
  it('should call setContainerDetails error', () => {
    const agreementTypeResponse = {
      '_embedded': {
        'agreementTypes': [{
          'agreementTypeID': 1,
          'agreementTypeName': 'Customer',
          '_links': {
            'self': {
              'href': ''
            },
            'agreementType': {
              'href': '',
              'templated': true
            }
          }
        }]
      },
      '_links': {
        'self': {
          'href': ''
        }
      }
    };
    spyOn(service, 'getAgreementType').and.returnValues(throwError('error'));
    component.getAgreementTypeList();
  });
  it('should call handleSearchTeam', () => {
    const err = {
      'traceid' : '343481659c77ad99',
      'status'  : 409,
      'errors' : [ {
        'fieldErrorFlag' : false,
        'errorMessage' : 'Failed to convert undefined into java.lang.Integer!',
        'errorType' : 'System Runtime Error',
        'fieldName' : null,
        'code' : 'ServerRuntimeError',
        'errorSeverity' : 'ERROR'
      } ]
    };
    component.handleSearchTeam(err);
  });
  it('should call handleGetAgreementTypeList', () => {
    const data = {
      '_embedded': {
        'agreementTypes': [{
          'agreementTypeID': 1,
          'agreementTypeName': 'Customer',
          '_links': {
            'self': {
              'href': ''
            },
            'agreementType': {
              'href': '',
              'templated': true
            }
          }
        }]
      },
      '_links': {
        'self': {
          'href': ''
        }
      }
    };
    component.handleGetAgreementTypeList(data);
  });
  it('should call handleGetAgreementTypeList', () => {
    const data = {
      '_embedded': {
        'agreementTypes': [{
          'agreementTypeID': 1,
          'agreementTypeName': 'Customer',
          '_links': {
            'self': {
              'href': ''
            },
            'agreementType': {
              'href': '',
              'templated': true
            }
          }
        }]
      },
      '_links': {
        'self': {
          'href': ''
        }
      }
    };
    component.agreementDetailsModel.defaultText = 'none';
    component.handleGetAgreementTypeList(data);
  });
  it('should call handleGetAgreementTypeList for else', () => {
    const data = {};
    component.handleGetAgreementTypeList(data);
  });
  it('should call agreementTypeChanged', fakeAsync(() => {
    const agreementTypeChangedMock = spyOn(component, 'agreementTypeChanged');
    fixture.debugElement.query(By.css('#agreementType')).triggerEventHandler('onChange', 'Carrier');
    expect(agreementTypeChangedMock).toHaveBeenCalled();
  }));
  it('should call onAccountSearch', () => {
    const accountSearchResponse = {
      'took': 48,
      'timed_out': false,
      '_shards': {
        'total': 5,
        'successful': 5,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 3522,
        'max_score': 0,
        'hits': []
      },
      'aggregations': {
        'unique': {
          'doc_count_error_upper_bound': 5,
          'sum_other_doc_count': 3512,
          'buckets': [{
            'key': 'Advantra',
            'doc_count': 2,
            'Level': {
              'hits': {
                'total': 2,
                'max_score': 13.411933,
                'hits': [
                  {
                    '_index': 'masterdata-account-hierarchy',
                    '_type': 'hierarchy_details',
                    '_id': '6394',
                    '_score': 13.411933,
                    '_source': {
                      'OrganizationName': 'Advantra',
                      'OrganizationCode': 'ADCLA6',
                      'Level': 'Ultimate Parent',
                      'OrganizationID': 43637,
                      'OrganizationAliasName': 'Advantra ADCLA6'
                    }
                  }
                ]
              }
            }
          }]
        }
      }
    };
    component.agreementDetailsModel.isSubscribe = true;
    spyOn(service, 'getAccountName').and.returnValue(of(accountSearchResponse));
    component.onAccountSearch('a');
  });
  it('should call onAccountSearch', () => {
    const err = {
      error: {
      'traceid' : '343481659c77ad99',
      'status'  : 409,
      'errors' : [ {
        'fieldErrorFlag' : false,
        'errorMessage' : 'Failed to convert undefined into java.lang.Integer!',
        'errorType' : 'System Runtime Error',
        'fieldName' : null,
        'code' : 'ServerRuntimeError',
        'errorSeverity' : 'ERROR'
      } ]
    },
    status: 409
    };
    component.agreementDetailsModel.isSubscribe = true;
    spyOn(service, 'getAccountName').and.returnValue(throwError(err));
    component.onAccountSearch('a');
  });
  it('should call handleError', () => {
    const handleError = {
      'error': {
      'traceid' : '343481659c77ad99',
      'status'  : 400,
      'errors' : [ {
        'fieldErrorFlag' : false,
        'errorMessage' : 'max_size_violation',
        'errorType' : 'System Runtime Error',
        'fieldName' : null,
        'code' : 'ServerRuntimeError',
        'errorSeverity' : 'ERROR'
      } ]
    },
    'status': 400
    };
    component.agreementDetailsModel.isSubscribe = true;
    spyOn(service, 'getAccountName').and.returnValue(throwError(handleError));
    component.onAccountSearch('a');
  });
  it('should call handleError', () => {
    const handleError = {
      'error': {
      'traceid' : '343481659c77ad99',
      'status'  : 503,
      'errors' : [ {
        'fieldErrorFlag' : false,
        'errorMessage' : 'Temperorily inavailable',
        'errorType' : 'System Runtime Error',
        'fieldName' : null,
        'code' : 'ServerRuntimeError',
        'errorSeverity' : 'ERROR'
      } ]
    },
    'status': 503
    };
    component.agreementDetailsModel.isSubscribe = true;
    spyOn(service, 'getAccountName').and.returnValue(throwError(handleError));
    component.onAccountSearch('a');
  });
  it('should call handleError', () => {
    component.handleError(errorResponse);
  });
  it('should call handleError', () => {
    errorResponse = {
      headers: new HttpHeaders(),
      status: 400,
      message: '',
      name: '', ok: false, statusText: '', url: '', type: HttpEventType.Response,
      error: {
        errors: [ {
          'fieldErrorFlag' : false,
          'errorMessage' : 'max_size_violation',
          'errorType' : 'Business Validation Error',
          'fieldName' : null,
          'code' : 'AGREEMENT_NAME_DUPLICATE',
          'errorSeverity' : 'ERROR'
        }]
      }
    };
    component.handleError(errorResponse);
  });
  it('should call handleAccountSearchData', () => {
    const accountSearchResponse = {
      'took': 48,
      'timed_out': false,
      '_shards': {
        'total': 5,
        'successful': 5,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 3522,
        'max_score': 0,
        'hits': []
      },
      'aggregations': {
        'unique': {
          'doc_count_error_upper_bound': 5,
          'sum_other_doc_count': 3512,
          'buckets': [{
            'key': 'Advantra',
            'doc_count': 2,
            'Level': {
              'hits': {
                'total': 2,
                'max_score': 13.411933,
                'hits': [
                  {
                    '_index': 'masterdata-account-hierarchy',
                    '_type': 'hierarchy_details',
                    '_id': '6394',
                    '_score': 13.411933,
                    '_source': {
                      'OrganizationName': 'Advantra',
                      'OrganizationCode': 'ADCLA6',
                      'Level': 'Ultimate Parent',
                      'OrganizationID': 43637,
                      'OrganizationAliasName': 'Advantra ADCLA6'
                    }
                  }
                ]
              }
            }
          }]
        }
      }
    };
    component.handleAccountSearchData(accountSearchResponse);
  });
  it('should call handleAccountSearchData for else', () => {
    const accountSearchResponse = {};
    component.handleAccountSearchData(accountSearchResponse);
  });
  it('should call onSearchTeam', () => {
    const searchTeamResponse = {
      'took': 71,
      'timed_out': false,
      '_shards': {
        'total': 5,
        'successful': 5,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 4,
        'max_score': 6.4966927,
        'hits': [{
          '_index': 'infrastructure-taskassignment',
          '_type': 'taskassignments',
          '_id': '695',
          '_score': 6.4966927,
          '_source': {
            'taskGroupName': 'Pricing',
            'taskGroupID': 292,
            'orderOwnershipID': null,
            'teamMemberTaskAssignmentRoleAssociationDTOs': [{
              'teamName': 'Pricing Team',
              'alternateRoleIndicator': 'N',
              'effectiveTimestamp': '2019-01-02T03:27:42.019',
              'teamMemberID': '311984',
              'teamMemberTaskAssignmentRoleAssociationID': 2318,
              'teamMemberTeamAssignmentID': 3919,
              'taskGroupRoleTypeAssociationID': 528,
              'expirationTimestamp': '2099-12-31T23:59:59',
              'teamTeamMemberId': 'Team-375-3919',
              'roleTypeName': 'Agreement Owner',
              'teamID': 375,
              'taskAssignmentID': 695,
              'teamMemberName': 'Suresh Raman, E&T Contract Worker',
              'roleTypeCode': 'AgmntOwnrR'
            }],
            'taskAssignmentID': 695,
            'taskAssignmentName': 'Pricing Task'
          }
        }]
      }
    };
    spyOn(service, 'getTeams').and.returnValue(of(searchTeamResponse));
    component.onSearchTeam('team');
  });
  it('should call onSearchTeam', () => {
    const searchTeamResponse = {
      'took': 71,
      'timed_out': false,
      '_shards': {
        'total': 5,
        'successful': 5,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 4,
        'max_score': 6.4966927,
        'hits': [{
          '_index': 'infrastructure-taskassignment',
          '_type': 'taskassignments',
          '_id': '695',
          '_score': 6.4966927,
          '_source': {
            'taskGroupName': 'Pricing',
            'taskGroupID': 292,
            'orderOwnershipID': null,
            'teamMemberTaskAssignmentRoleAssociationDTOs': [{
              'teamName': 'Pricing Team',
              'alternateRoleIndicator': 'N',
              'effectiveTimestamp': '2019-01-02T03:27:42.019',
              'teamMemberID': '311984',
              'teamMemberTaskAssignmentRoleAssociationID': 2318,
              'teamMemberTeamAssignmentID': 3919,
              'taskGroupRoleTypeAssociationID': 528,
              'expirationTimestamp': '2099-12-31T23:59:59',
              'teamTeamMemberId': 'Team-375-3919',
              'roleTypeName': 'Agreement Owner',
              'teamID': 375,
              'taskAssignmentID': 695,
              'teamMemberName': 'Suresh Raman, E&T Contract Worker',
              'roleTypeCode': 'AgmntOwnrR'
            }],
            'taskAssignmentID': 695,
            'taskAssignmentName': 'Pricing Task'
          }
        }]
      }
    };
    spyOn(service, 'getTeams').and.returnValues(throwError(errorResponse));
    component.onSearchTeam('equipmentsResponse');
  });
  it('should call handleSearchTeam', () => {
    const searchTeamResponse = {
      'took': 71,
      'timed_out': false,
      '_shards': {
        'total': 5,
        'successful': 5,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 4,
        'max_score': 6.4966927,
        'hits': [{
          '_index': 'infrastructure-taskassignment',
          '_type': 'taskassignments',
          '_id': '695',
          '_score': 6.4966927,
          '_source': {
            'taskGroupName': 'Pricing',
            'taskGroupID': 292,
            'orderOwnershipID': null,
            'teamMemberTaskAssignmentRoleAssociationDTOs': [{
              'teamName': 'Pricing Team',
              'alternateRoleIndicator': 'N',
              'effectiveTimestamp': '2019-01-02T03:27:42.019',
              'teamMemberID': '311984',
              'teamMemberTaskAssignmentRoleAssociationID': 2318,
              'teamMemberTeamAssignmentID': 3919,
              'taskGroupRoleTypeAssociationID': 528,
              'expirationTimestamp': '2099-12-31T23:59:59',
              'teamTeamMemberId': 'Team-375-3919',
              'roleTypeName': 'Agreement Owner',
              'teamID': 375,
              'taskAssignmentID': 695,
              'teamMemberName': 'Suresh Raman, E&T Contract Worker',
              'roleTypeCode': 'AgmntOwnrR'
            }],
            'taskAssignmentID': 695,
            'taskAssignmentName': 'Pricing Task'
          }
        }]
      }
    };
    component.handleSearchTeam(searchTeamResponse);
  });
  it('should call handleSearchTeam for else', () => {
    const searchTeamResponse = {
      'took': 71,
      'timed_out': false,
      '_shards': {
        'total': 5,
        'successful': 5,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 4,
        'max_score': 6.4966927,
        'hits': [{
          '_index': 'infrastructure-taskassignment',
          '_type': 'taskassignments',
          '_id': '695',
          '_score': 6.4966927,
          '_source': {}
        }]
      }
    };
    component.handleSearchTeam(searchTeamResponse);
  });
  it('should call onSave for if condition', () => {
    const accountDetails = {
      OrganizationName: 'Advantra (ADAT68)',
      accountCode: 'ADAT68',
      accountName: 'Advantra',
      partyId: 44658
    };
    component.agreementDetailsModel.agreementDetailsForm.patchValue({
      agreementType: 'Customer',
      accountName: accountDetails,
      teams: ''
    });
    component.onSave('next');
  });
  it('should call toastMessage', () => {
    component.toastMessage('error', 'Missing Required Information',
    'Provide the required information in the highlighted fields and submit the form again');
  });
  it('should call checkValueChange', () => {
    const agreementDetails = store.getItem('createAgreement', 'detail');
    const accountName = {
      OrganizationName: agreementDetails.customerAgreementName,
      accountName: agreementDetails.customerAgreementName.split('(')[0],
      accountCode: `(${agreementDetails.customerAgreementName.split('(')[1]}`,
      partyId: agreementDetails.ultimateParentAccountID
    };
    component.agreementDetailsModel.agreementDetailsForm.patchValue({
      agreementType: agreementDetails['agreementType'],
      accountName: accountName,
      teams: agreementDetails.teams
    });
    const saveResponse = {
      'customerAgreementID': 1072,
      'customerAgreementName': 'Qaqa1 (QABI2)',
      'agreementType': 'Customer',
      'ultimateParentAccountID': 1402,
      'currencyCode': null,
      'cargoReleaseAmount': null,
      'businessUnits': null,
      'taskAssignmentIDs': null,
      'effectiveDate': '1995-01-01',
      'expirationDate': '2099-12-31',
      'invalidIndicator': 'N',
      'invalidReasonTypeName': null,
      'teams': null
    };
    spyOn(service, 'agreementCheckSave').and.returnValue(of(saveResponse));
    component.checkValueChange('next');
  });
  it('should call handleAgreementCheckValue', () => {
    const saveResponse = {
      'customerAgreementID': 1072,
      'customerAgreementName': 'Qaqa1 (QABI2)',
      'agreementType': 'Customer',
      'ultimateParentAccountID': 1402,
      'currencyCode': null,
      'cargoReleaseAmount': null,
      'businessUnits': null,
      'taskAssignmentIDs': null,
      'effectiveDate': '1995-01-01',
      'expirationDate': '2099-12-31',
      'invalidIndicator': 'N',
      'invalidReasonTypeName': null,
      'teams': null
    };
    component.handleAgreementCheckValue(saveResponse, {}, 'name');
  });
  it('should call handleSuccess for search case', () => {
    component.handleSuccess('search');
  });
  it('should call handleSuccess for next case', () => {
    component.handleSuccess('next');
  });
  it('should call handleSuccess for else condition', () => {
    component.agreementDetailsModel.routeUrl = '/dashboard';
    component.handleSuccess('');
  });
  it('should call handleSuccess for default case', () => {
    component.handleSuccess('default');
  });
  it('should call loader', () => {
    component.loader(true);
  });
  it('should call ngOnDestroy', () => {
    component.ngOnDestroy();
  });
});
