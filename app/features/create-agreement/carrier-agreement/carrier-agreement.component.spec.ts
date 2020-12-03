import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { of, throwError } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { HttpHeaders, HttpResponseBase, HttpErrorResponse, HttpEventType } from '@angular/common/http';

import { AppModule } from '../../../app.module';
import { CreateAgreementModule } from './../create-agreement.module';
import { CarrierAgreementComponent } from './carrier-agreement.component';
import { AgreementDetailsUtility } from '../agreement-details/service/agreement-details-utility';
import { BroadcasterService } from '../../../shared/jbh-app-services/broadcaster.service';
import { AgreementDetailsModel } from '../agreement-details/model/agreement-details.model';
import { AgreementDetailsService } from '../agreement-details/service/agreement-details.service';
import { MessageService } from 'primeng/components/common/messageservice';

describe('CarrierAgreementComponent', () => {
  let component: CarrierAgreementComponent;
  let fixture: ComponentFixture<CarrierAgreementComponent>;
  let shared: BroadcasterService;
  let formBuilder: FormBuilder;
  let msg: MessageService;
  let service: AgreementDetailsService;
  let controlArray: FormArray;
  let successResponse: HttpResponseBase;
  let errorResponse: HttpErrorResponse;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, CreateAgreementModule, HttpClientTestingModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierAgreementComponent);
    shared = TestBed.get(BroadcasterService);
    msg = TestBed.get(MessageService);
    component = fixture.componentInstance;
    formBuilder = TestBed.get(FormBuilder);
    service = TestBed.get(AgreementDetailsService);
    component.agreementDetailsModel = new AgreementDetailsModel();
    component.agreementDetailsModel.isCarrierSubscribe = true;
    component.agreementDetailsModel.effectiveMinDate = new Date('1995-01-01'.replace(/-/g, '\/').replace(/T.+/, ''));
    component.agreementDetailsModel.expirationMaxDate = new Date('2099-12-31'.replace(/-/g, '\/').replace(/T.+/, ''));
    component.agreementDetailsModel.carrierDetailsForm = formBuilder.group({
      carrierAgreement: formBuilder.array([]),
      carrierAgreementName: [null, Validators.required]
    });
    component.addNewRow();
    controlArray = component.agreementDetailsModel.carrierDetailsForm.controls['carrierAgreement'] as FormArray;
    successResponse = {
      'headers': new HttpHeaders(),
      'ok': true,
      'status': 201,
      'statusText': 'Created',
      'type': 4,
      'url': ''
    };
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call saveCarrierSubscription', () => {
    spyOn(shared, 'on').and.returnValue(of(false));
    component.saveCarrierSubscription();
  });
  it('should call addNewRow', () => {
    component.addNewRow();
  });
  it('should call touchFormArrayFields', () => {
    component.touchFormArrayFields(controlArray);
  });
  it('should calll onCarrierSearch', () => {
    const carrierData = {
      took: 17,
      timed_out: false,
      _shards: {
        total: 5,
        successful: 5,
        skipped: 0,
        failed: 0
      },
      hits: {
        total: 3,
        max_score: 1.0512933,
        hits: [
          {
            _index: 'masterdata-carrier-carrierdetails-v2',
            _type: 'doc',
            _id: 'AWZjplqKmEZA5pCXUpzN',
            _score: 1.0512933,
            _source: {
              LegalName: 'BIZZMARK LOGISTICS GROUP',
              CarrierID: 66,
              CarrierCode: '07U2'
            }
          },
          {
            _index: 'masterdata-carrier-carrierdetails-v2',
            _type: 'doc',
            _id: '121212',
            _score: 1.0512933,
            _source: {
              LegalName: 'Bizzmark LOGISTICS GROUP',
              CarrierID: 66,
              CarrierCode: '07U2'
            }
          },
          {
            _index: 'masterdata-carrier-carrierdetails-v2',
            _type: 'doc',
            _id: 'AWZfwWxUmEZA5pCXUpx-',
            _score: 1.0512933,
            _source: {
              LegalName: 'Bear & Cub Shipping LLC',
              CarrierID: 1234,
              CarrierCode: 'BC123456'
            }
          }
        ]
      },
      aggregations: {
        unique: {
          doc_count_error_upper_bound: 0,
          sum_other_doc_count: 0,
          buckets: [
            {
              key: 'BIZZMARK LOGISTICS GROUP',
              doc_count: 1,
              Level: {
                hits: {
                  total: 1,
                  max_score: 1.0512933,
                  hits: [
                    {
                      _index: 'masterdata-carrier-carrierdetails-v2',
                      _type: 'doc',
                      _id: 'AWZjplqKmEZA5pCXUpzN',
                      _score: 1.0512933,
                      _source: {
                        LegalName: 'BIZZMARK LOGISTICS GROUP',
                        CarrierID: 66,
                        CarrierCode: '07U2'
                      }
                    }
                  ]
                }
              }
            },
            {
              key: 'Bear & Cub Shipping LLC',
              doc_count: 1,
              Level: {
                hits: {
                  total: 1,
                  max_score: 1.0512933,
                  hits: [
                    {
                      _index: 'masterdata-carrier-carrierdetails-v2',
                      _type: 'doc',
                      _id: 'AWZfwWxUmEZA5pCXUpx-',
                      _score: 1.0512933,
                      _source: {
                        LegalName: 'Bear & Cub Shipping LLC',
                        CarrierID: 1234,
                        CarrierCode: 'BC123456'
                      }
                    }
                  ]
                }
              }
            },
            {
              key: 'Bizzmark LOGISTICS GROUP',
              doc_count: 1,
              Level: {
                hits: {
                  total: 1,
                  max_score: 1.0512933,
                  hits: [
                    {
                      _index: 'masterdata-carrier-carrierdetails-v2',
                      _type: 'doc',
                      _id: '121212',
                      _score: 1.0512933,
                      _source: {
                        LegalName: 'Bizzmark LOGISTICS GROUP',
                        CarrierID: 66,
                        CarrierCode: '07U2'
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
    const check = [{
      _index: 'masterdata-carrier-carrierdetails-v2',
      _type: 'doc',
      _id: 'AWZfwWxUmEZA5pCXUpx-',
      _score: 1.0512933,
      _source: {
        LegalName: 'Bear & Cub Shipping LLC',
        CarrierID: 1234,
        CarrierCode: 'BC123456'
      }}];
    spyOn(service, 'getCarrierDetails').and.returnValue(of(carrierData));
    AgreementDetailsUtility.getCarrierSearchResults(check);
    component.onCarrierSearch('a');
  });
  it('should call onClearCarrier', () => {
    component.onClearCarrier([], 0);
  });
  it('should call checkEmptyFormArray', () => {
    component.agreementDetailsModel.carrierDetailsForm.patchValue({
      carrier: [{
        carrier: {legalName: 'A DUIE PYLE INC', carrierID: 71, carrierCode: 'ADU0', carrierDisplayName: 'A DUIE PYLE INC (ADU0)'},
        effectiveDate: new Date(), expirationDate: new Date()
      }],
      carrierAgreementName: 'A DUIE PYLE INC'
    });
    component.agreementDetailsModel.firstRowCarrier = 'A DUIE PYLE INC';
    component.checkEmptyFormArray();
  });
  it('should call onCarrierSelect', () => {
    const inputValue = {legalName: 'A DUIE PYLE INC', carrierID: 71, carrierCode: 'ADU0', carrierDisplayName: 'A DUIE PYLE INC (ADU0)'};
    component.agreementDetailsModel.firstRowCarrier = '';
    component.onCarrierSelect(inputValue, 0);
  });
  it('should call getEffectiveDate', () => {
    const inputValue = {legalName: 'A DUIE PYLE INC', carrierID: 71, carrierCode: 'ADU0', carrierDisplayName: 'A DUIE PYLE INC (ADU0)'};
    spyOn(service, 'getCarrierEffectiveDate').and.returnValue(of(null));
    component.getEffectiveDate(inputValue, 0);
  });
  it('should call onDateSelected for if condition', () => {
    component.onDateSelected(new Date(), 0, 0);
  });
  it('should call onDateSelected for else condition', () => {
    component.onDateSelected(new Date(), 1, 0);
  });
  it('should call onTypeDate for if condition - effective case', () => {
    component.agreementDetailsModel.carrierDetailsForm.patchValue({
      carrier: [{
        carrier: {legalName: 'A DUIE PYLE INC', carrierID: 71, carrierCode: 'ADU0', carrierDisplayName: 'A DUIE PYLE INC (ADU0)'},
        effectiveDate: new Date(), expirationDate: new Date()
      }],
      carrierAgreementName: 'A DUIE PYLE INC'
    });
    AgreementDetailsUtility.validateDateFormat('07/', 'effective', 1 , component.agreementDetailsModel);
    component.onTypeDate('07/04/2019', 'effective', 0);
  });
  it('should call onTypeDate for if condition - effective case', () => {
    component.agreementDetailsModel.carrierDetailsForm.patchValue({
      carrier: [{
        carrier: {legalName: 'A DUIE PYLE INC', carrierID: 71, carrierCode: 'ADU0', carrierDisplayName: 'A DUIE PYLE INC (ADU0)'},
        effectiveDate: new Date(), expirationDate: new Date()
      }],
      carrierAgreementName: 'A DUIE PYLE INC'
    });
    AgreementDetailsUtility.validateDateFormat('07/0', 'expiration', 1 , component.agreementDetailsModel);
    component.onTypeDate('07/04/2019', 'effective', 0);
  });
  it('should call onTypeDate for if condition - expiration case', () => {
    component.agreementDetailsModel.carrierDetailsForm.patchValue({
      carrier: [{
        carrier: {legalName: 'A DUIE PYLE INC', carrierID: 71, carrierCode: 'ADU0', carrierDisplayName: 'A DUIE PYLE INC (ADU0)'},
        effectiveDate: new Date(), expirationDate: new Date()
      }],
      carrierAgreementName: 'A DUIE PYLE INC'
    });
    component.onTypeDate('07/04/2019', 'expiration', 0);
  });
  it('should call onTypeDate for else condition', () => {
    component.onTypeDate('', 'effective', 0);
  });
  it('should call setFormErrors', () => {
    component.agreementDetailsModel.isNotValidDate[0] = true;
    component.setFormErrors(controlArray, 0);
  });
  it('should call getValidDate', () => {
    controlArray.controls[0].patchValue({
      carrier: {legalName: 'A DUIE PYLE INC', carrierID: 71, carrierCode: 'ADU0', carrierDisplayName: 'A DUIE PYLE INC (ADU0)'},
      effectiveDate: new Date(), expirationDate: new Date()
    });
    component.getValidDate(controlArray, 0);
  });
  it('should call onSelectExpDate', () => {
    controlArray.controls[0].patchValue({
      carrier: {legalName: 'A DUIE PYLE INC', carrierID: 71, carrierCode: 'ADU0', carrierDisplayName: 'A DUIE PYLE INC (ADU0)'},
      effectiveDate: new Date(), expirationDate: new Date()
    });
    component.onSelectExpDate(controlArray, 0);
  });
  it('should call onCancel for if condition', () => {
    component.agreementDetailsModel.carrierDetailsForm.markAsDirty();
    component.agreementDetailsModel.carrierDetailsForm.markAsTouched();
    component.onCancel();
  });
  it('should call createsaveRequest', () => {
    controlArray.controls[0].patchValue({
      carrier: {legalName: 'A DUIE PYLE INC', carrierID: 71, carrierCode: 'ADU0', carrierDisplayName: 'A DUIE PYLE INC (ADU0)'},
      effectiveDate: new Date(), expirationDate: new Date()
    });
    component.agreementDetailsModel.carrierDetailsForm.patchValue({
      carrierAgreementName: 'A DUIE PYLE INC (ADU0)'
    });
    component.createsaveRequest();
  });
  it('should call getcarriersList', () => {
    controlArray.controls[0].patchValue({
      carrier: {legalName: 'A DUIE PYLE INC', carrierID: 71, carrierCode: 'ADU0', carrierDisplayName: 'A DUIE PYLE INC (ADU0)'},
      effectiveDate: new Date(), expirationDate: new Date()
    });
    component.getcarriersList();
  });
  it('should call onCreateCarrier for if condition', () => {
    component.agreementDetailsModel.carrierDetailsForm.patchValue({
      carrier: [{
        carrier: {legalName: 'A DUIE PYLE INC', carrierID: 71, carrierCode: 'ADU0', carrierDisplayName: 'A DUIE PYLE INC (ADU0)'},
        effectiveDate: new Date(), expirationDate: new Date()
      }],
      carrierAgreementName: 'A DUIE PYLE INC'
    });
    spyOn(service, 'saveCarrier').and.returnValue(of(successResponse));
    component.onCreateCarrier();
  });
  it('should call onCreateCarrier err', () => {
    const error: any = {
        'error': {
        'traceid' : '343481659c77ad99',
        'status'  : 409,
        'errors' : [ {
          'fieldErrorFlag' : false,
          'errorMessage' : 'Failed to convert undefined into java.lang.Integer!',
          'errorType' : 'System Runtime Error',
          'fieldName' : null,
          'code' : 'AGREEMENT_NAME_DUPLICATE',
          'errorSeverity' : 'ERROR'
          } ]
        }
    };
    spyOn(service, 'saveCarrier').and.returnValue(throwError(error));
    AgreementDetailsUtility.handleError( error, component.agreementDetailsModel, msg);
    component.onCreateCarrier();
  });
  it('should call onCreateCarrier err duplicate', () => {
    const error: any = {
        'error': {
        'traceid' : '343481659c77ad99',
        'status'  : 409,
        'errors' : [ {
          'fieldErrorFlag' : false,
          'errorMessage' : 'Failed to convert undefined into java.lang.Integer!',
          'errorType' : 'System Runtime Error',
          'fieldName' : null,
          'code' : 'CARRIER_DUPLICATE',
          'errorSeverity' : 'ERROR'
          } ]
        }
    };
    spyOn(service, 'saveCarrier').and.returnValue(throwError(error));
    AgreementDetailsUtility.handleError( error, component.agreementDetailsModel, msg);
    component.onCreateCarrier();
  });
  it('should call onCreateCarrier for else condition', () => {
    component.agreementDetailsModel.carrierDetailsForm.patchValue({
      carrier: [{
        carrier: {legalName: 'A DUIE PYLE INC', carrierID: 71, carrierCode: 'ADU0', carrierDisplayName: 'A DUIE PYLE INC (ADU0)'},
        effectiveDate: '', expirationDate: ''
      }],
      carrierAgreementName: 'A DUIE PYLE INC'
    });
    component.onCreateCarrier();
  });
  it('should call toastMessage', () => {
    component.toastMessage('error', 'Missing Required Information',
    'Provide the required information in the highlighted fields and submit the form again');
  });
  it('should call onClickYes', () => {
    component.onClickYes();
  });
  it('should call onClickNo', () => {
    component.onClickNo();
  });
  it('should all customSort', () => {
    const sortEvent = {
      data: [],
      mode: 'single',
      field: 'carrier',
      order: 1
    };
    AgreementDetailsUtility.applySort('value1', 'value2');
    component.customSort(sortEvent);
  });
});
