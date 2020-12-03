import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '../../../../app.module';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';

import { AdvanceSearchUtilityService } from './advance-search-utility.service';
import { AdvanceSearchComponent } from '../advance-search.component';
import { SearchAgreementModule } from '../../search-agreement.module';
import {
  FormsModule, ReactiveFormsModule,
  FormControl, Validators, FormBuilder, FormGroup, FormArray, AbstractControl
} from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';

describe('AdvanceSearchUtilityService', () => {
  let service: AdvanceSearchUtilityService;
  let http: HttpClient;
  let component: AdvanceSearchComponent;
  let fixture: ComponentFixture<AdvanceSearchComponent>;
  const formBuilder = new FormBuilder();
  let formGroup: FormGroup;
  let messageService;
  const zzz = {
    'size': 25,
    '_source': [
      'carrierAgreementName'
    ],
    'query': {
      'bool': {
        'must': [
          {
            'query_string': {
              'default_field': 'agreementType.keyword',
              'query': 'Carrier',
              'default_operator': 'AND'
            }
          },
          {
            'query_string': {
              'default_field': 'carrierAgreementName.keyword',
              'query': `*${'carrierAgreementName.keyword'.replace(/[!? :\\["^~=\,.//\\{}&&||<>()+*\]-]/g, '\\$&')}*`,
              'default_operator': 'AND'
            }
          },
          {
            'query_string': {
              'default_field': 'invalidIndicator',
              'query': '*'
            }
          },
          {
            'query_string': {
              'default_field': 'invalidReasonType.keyword',
              'query': '*'
            }
          },
          {
            'nested': {
              'path': 'Teams',
              'query': {
                'bool': {
                  'must': [
                    {
                      'query_string': {
                        'default_field': 'Teams.TeamName',
                        'query': '*'
                      }
                    },
                    {
                      'query_string': {
                        'default_field': 'Teams.TeamName',
                        'query': '*'
                      }
                    },
                    {
                      'query_string': {
                        'default_field': 'Teams.TeamName',
                        'query': '*'
                      }
                    },
                    {
                      'query_string': {
                        'default_field': 'Teams.TeamName',
                        'query': '*'
                      }
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    },
    'sort': [
      {
        'carrierAgreementName.keyword': {
          'order': 'asc'
        }
      }
    ]
  };


  configureTestSuite(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, AppModule, HttpClientTestingModule, SearchAgreementModule],
    providers: [AdvanceSearchUtilityService, MessageService, { provide: APP_BASE_HREF, useValue: '/' }],
  }));

  beforeEach(() => {
    service = TestBed.get(AdvanceSearchUtilityService);
    http = TestBed.get(HttpClient);
    fixture = TestBed.createComponent(AdvanceSearchComponent);
    component = fixture.componentInstance;
    messageService = TestBed.get(MessageService);
    formGroup = formBuilder.group({
      favoriteSearches: ['test'],
      agreementType: ['test', Validators.required],
      agreement: ['test'],
      contract: ['test'],
      billTo: ['test'],
      carrierCode: ['test'],
      codeStatus: ['test'],
      operationalTeam: ['test'],
      agreementStatus: ['test'],
      carrierStatus: ['test'],
      carrierAgreement: ['test'],
      carrier: ['test'],
      CarrierAgreementStatus: ['']
    });
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be getAgreement for else', () => {
    const agreementTypes = [];
    component.advanceSearchModel.agreementList = [];
    AdvanceSearchUtilityService.getAgreement(agreementTypes);
  });

  it('should be setDefaultAgreementType for else', () => {
    component.advanceSearchModel.agreementTypeList = [{
      label: 'All'
    }];
    component.advanceSearchModel.advanceSearchForm = formGroup;
    AdvanceSearchUtilityService.setDefaultAgreementType(component.advanceSearchModel);
  });

  it('should be getStatus', () => {
    AdvanceSearchUtilityService.getStatus(['Success', 'Success']);
  });

  it('should be searchAgreementType', () => {
    AdvanceSearchUtilityService.searchAgreementType('customer', component.advanceSearchModel, 'agreementTypeList');
  });

  it('should be searchAgreementType', () => {
    component.advanceSearchModel.agreementList = [];
    AdvanceSearchUtilityService.searchAgreementType('customer', component.advanceSearchModel, 'agreementTypeList');
  });

  it('should be getAbstractControl', () => {
    AdvanceSearchUtilityService.getAbstractControl('agreementType', component.advanceSearchModel);
  });

  it('should be checkValidation', () => {
    component.advanceSearchModel.advanceSearchForm = formGroup;
    AdvanceSearchUtilityService.checkValidation('agreementType', component.advanceSearchModel, true, true);
  });

  it('should be checkValidation for else', () => {
    component.advanceSearchModel.advanceSearchForm = formGroup;
    component.advanceSearchModel.advanceSearchForm.controls['agreementType'].setValue('');
    AdvanceSearchUtilityService.checkValidation('agreementType', component.advanceSearchModel, true, true);
  });

  it('should be searchTeams for if ', () => {
    component.advanceSearchModel.teamsList = [{label: 'string'}];
    AdvanceSearchUtilityService.searchTeams('', component.advanceSearchModel);
  });

  it('should be searchTeams for else', () => {
    component.advanceSearchModel.teamsList = [{label: ''}];
    AdvanceSearchUtilityService.searchTeams('', component.advanceSearchModel);
  });

  it('should be toastMessage', () => {
    AdvanceSearchUtilityService.toastMessage(messageService, 'error', 'Success');
  });

  it('should be createCarrierSearchQuery', () => {
    component.advanceSearchModel.advanceSearchForm = formGroup;
    component.advanceSearchModel.advanceSearchForm.controls['carrierAgreement'].setValue({'CarrierAgreementName': 'abc'});
    component.advanceSearchModel.advanceSearchForm.controls['carrier'].setValue({'CarrierName': 'abc'});
    component.advanceSearchModel.advanceSearchForm.controls['agreement'].setValue({'name': 'abc', 'key': 'abc'});
    component.advanceSearchModel.advanceSearchFormField = {
        'favoriteSearches': 'abc',
        agreementType: ['test', Validators.required],
        agreement: ['test'],
        contract: ['test'],
        billTo: ['test'],
        carrierCode: ['test'],
        codeStatus: ['test'],
        operationalTeam: ['test'],
        agreementStatus: ['test'],
        carrierStatus: ['test'],
        carrierAgreement: ['test'],
        carrier: ['test'],
        CarrierAgreementStatus: ['']
    };
    AdvanceSearchUtilityService.createCarrierSearchQuery(
        component.advanceSearchModel.advanceSearchForm, zzz,
         {'carrierAgreement': {'CarrierAgreementName': 'abc'}}, component.advanceSearchModel);
  });

  it('should be setCarrierAgreementStatusQuery for Active', () => {
    component.advanceSearchModel.advanceSearchForm = formGroup;
    component.advanceSearchModel.advanceSearchForm.controls['carrierStatus'].setValue({value: 'Active'});
    AdvanceSearchUtilityService.setCarrierAgreementStatusQuery(component.advanceSearchModel, zzz);
  });

  it('should be setCarrierAgreementStatusQuery for Inactive', () => {
    component.advanceSearchModel.advanceSearchForm = formGroup;
    component.advanceSearchModel.advanceSearchForm.controls['carrierStatus'].setValue({value: 'Inactive'});
    AdvanceSearchUtilityService.setCarrierAgreementStatusQuery(component.advanceSearchModel, zzz);
  });

  it('should be setCarrierAgreementStatusQuery for Inactive', () => {
    component.advanceSearchModel.advanceSearchForm = formGroup;
    component.advanceSearchModel.advanceSearchForm.controls['carrierStatus'].setValue({value: 'Not active'});
    AdvanceSearchUtilityService.setCarrierAgreementStatusQuery(component.advanceSearchModel, zzz);
  });

  it('should be setCarrierAgreementStatusQuery for Inactive', () => {
    component.advanceSearchModel.advanceSearchForm = formGroup;
    component.advanceSearchModel.advanceSearchForm.controls['carrierStatus'].setValue('');
    AdvanceSearchUtilityService.setCarrierAgreementStatusQuery(component.advanceSearchModel, zzz);
  });

  it('should be setValueToStatus', () => {
    AdvanceSearchUtilityService.setValueToStatus(component.advanceSearchModel, zzz, 'active', 'active', '01/01/2019');
  });

  it('should be setStatusQuery for Active', () => {
    component.advanceSearchModel.advanceSearchForm.controls['CarrierAgreementStatus'].setValue('Active');
    AdvanceSearchUtilityService.setStatusQuery(component.advanceSearchModel, zzz);
  });

  it('should be setStatusQuery for Inactive', () => {
    component.advanceSearchModel.advanceSearchForm.controls['CarrierAgreementStatus'].setValue('Inactive');
    AdvanceSearchUtilityService.setStatusQuery(component.advanceSearchModel, zzz);
  });

  it('should be setStatusQuery for All', () => {
    component.advanceSearchModel.advanceSearchForm.controls['CarrierAgreementStatus'].setValue('All');
    AdvanceSearchUtilityService.setStatusQuery(component.advanceSearchModel, zzz);
  });

  it('should be setStatusQuery for default', () => {
    component.advanceSearchModel.advanceSearchForm.controls['CarrierAgreementStatus'].setValue('default');
    AdvanceSearchUtilityService.setStatusQuery(component.advanceSearchModel, zzz);
  });

  it('should be createQuery', () => {
    component.advanceSearchModel.advanceSearchForm.controls['contract'].setValue(
        { field: 'AgreementType.keyword', value: 'All', Contract: 'contract'});
    component.advanceSearchModel.advanceSearchFormField = {
      'favoriteSearches': 'abc',
      agreementType: ['test', Validators.required],
      agreement: ['test'],
      contract: ['test'],
      billTo: ['test'],
      carrierCode: ['test'],
      codeStatus: ['test'],
      operationalTeam: ['test'],
      agreementStatus: ['test'],
      carrierStatus: ['test'],
      carrierAgreement: ['test'],
      carrier: ['test'],
      CarrierAgreementStatus: ['']
  };
    AdvanceSearchUtilityService.createQuery(component.advanceSearchModel.advanceSearchForm,
        zzz, {contract: 'value'}, component.advanceSearchModel);
  });

  it('should be createQuery for else if', () => {
    component.advanceSearchModel.advanceSearchForm.controls['agreementStatus'].setValue(
        { field: 'AgreementType.keyword', value: 'All', agreementStatus: 'agreementStatus'});
    component.advanceSearchModel.advanceSearchFormField = {
      'favoriteSearches': 'abc',
      agreementType: ['test', Validators.required],
      agreement: ['test'],
      contract: ['test'],
      billTo: ['test'],
      carrierCode: ['test'],
      codeStatus: ['test'],
      operationalTeam: ['test'],
      agreementStatus: ['test'],
      carrierStatus: ['test'],
      carrierAgreement: ['test'],
      carrier: ['test'],
      CarrierAgreementStatus: ['']
  };
    AdvanceSearchUtilityService.createQuery(component.advanceSearchModel.advanceSearchForm,
        zzz, {agreementStatus: 'value'}, component.advanceSearchModel);
  });

  it('should be createQuery for else', () => {
    component.advanceSearchModel.advanceSearchForm.controls['agreement'].setValue(
        { field: 'AgreementType.keyword', value: 'All', agreement: 'agreement'});
    component.advanceSearchModel.advanceSearchFormField = {
      'favoriteSearches': 'abc',
      agreementType: ['test', Validators.required],
      agreement: ['test'],
      contract: ['test'],
      billTo: ['test'],
      carrierCode: ['test'],
      codeStatus: ['test'],
      operationalTeam: ['test'],
      agreementStatus: ['test'],
      carrierStatus: ['test'],
      carrierAgreement: ['test'],
      carrier: ['test'],
      CarrierAgreementStatus: ['']
  };
    AdvanceSearchUtilityService.createQuery(component.advanceSearchModel.advanceSearchForm,
        zzz, {agreement: 'value'}, component.advanceSearchModel);
  });

  it('should be createIndepthQuery for if', () => {
    component.advanceSearchModel.advanceSearchForm.controls['CarrierAgreementStatus'].setValue('default');
    component.advanceSearchModel.advanceSearchForm = formGroup;
    component.advanceSearchModel.advanceSearchForm.controls['carrierAgreement'].setValue({'CarrierAgreementName': 'abc'});
    component.advanceSearchModel.advanceSearchForm.controls['carrier'].setValue({'CarrierName': 'abc'});
    component.advanceSearchModel.advanceSearchForm.controls['agreement'].setValue({'name': 'abc', 'key': 'abc'});
    component.advanceSearchModel.advanceSearchFormField = {
      'favoriteSearches': 'abc',
      agreementType: ['test', Validators.required],
      agreement: ['test'],
      contract: ['test'],
      billTo: ['test'],
      carrierCode: ['test'],
      codeStatus: ['test'],
      operationalTeam: ['test'],
      agreementStatus: ['test'],
      carrierStatus: ['test'],
      carrierAgreement: ['test'],
      carrier: ['test'],
      CarrierAgreementStatus: ['']
  };
    AdvanceSearchUtilityService.createIndepthQuery('contract', zzz,
      { field: 'AgreementType.keyword', value: 'All', Contract: 'contract'}, {contract: 'value'}, component.advanceSearchModel, );
  });

  it('should be getContractQuery', () => {
    component.advanceSearchModel.advanceSearchForm.controls['CarrierAgreementStatus'].setValue('default');
    component.advanceSearchModel.advanceSearchForm = formGroup;
    component.advanceSearchModel.advanceSearchForm.controls['carrierAgreement'].setValue({'CarrierAgreementName': 'abc'});
    component.advanceSearchModel.advanceSearchForm.controls['carrier'].setValue({'CarrierName': 'abc'});
    component.advanceSearchModel.advanceSearchForm.controls['agreement'].setValue({'name': 'abc', 'key': 'abc'});
    component.advanceSearchModel.advanceSearchFormField = {
      'favoriteSearches': 'abc',
      agreementType: ['test', Validators.required],
      agreement: ['test'],
      contract: ['test'],
      billTo: ['test'],
      carrierCode: ['test'],
      codeStatus: ['test'],
      operationalTeam: ['test'],
      agreementStatus: ['test'],
      carrierStatus: ['test'],
      carrierAgreement: ['test'],
      carrier: ['test'],
      CarrierAgreementStatus: ['']
  };
    AdvanceSearchUtilityService.getContractQuery(zzz,
      { field: 'AgreementType.keyword', value: 'All', Contract: 'contract'}, component.advanceSearchModel, );
  });

  it('should be getCurrentDate', () => {
    AdvanceSearchUtilityService.getCurrentDate();
  });

});
