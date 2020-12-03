import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from './../../../../../app.module';
import { StandardModule } from '../../../standard.module';
import { APP_BASE_HREF } from '@angular/common';
import { CreateStandardDocumentationComponent } from './create-standard-documentation.component';
import { CreateStandardDocumentationService } from './service/create-standard-documentation.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CreateStandardDocumentationUtilityService } from './service/create-standard-documentation-utility.service';
import { StandardOptionalAttributesModel } from '../../../../standard/standard-accessorial/model/standard-optional-attributes.model';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import {
  CanComponentDeactivate,
  UploadFileServiceData
} from '../../../standard-accessorial/standard-documentation/create-standard-documentation/model/create-standard-documenation.interface';
import { RouterStateSnapshot, Router, ActivatedRouteSnapshot } from '@angular/router';

describe('CreateStandardDocumentationComponent', () => {
  let component: CreateStandardDocumentationComponent;
  let fixture: ComponentFixture<CreateStandardDocumentationComponent>;
  let createDocumentationService: CreateStandardDocumentationService;
  let createDocumentationUtilsService: CreateStandardDocumentationUtilityService;
  let canDeactivateGuardService: CanComponentDeactivate;
  const optionalAttrModel = new StandardOptionalAttributesModel;
  let canComponentDeactivatecomponent: CanComponentDeactivate;
  let canComponentDeactivatefixture;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;
  let nextState: RouterStateSnapshot;
  const fb = new FormBuilder();
  canDeactivateGuardService = {
    canDeactivate: undefined
  };
  const optionalRateFormBuilder: FormBuilder = new FormBuilder();
  let optionalRateFormGroup: FormGroup;
  const setting: FormGroup = fb.group({
    documentationType: ['Legal', Validators.required],
    groupName: [{'label': 'Standard'}, Validators.required],
    effectiveDate: ['03/09/2019', Validators.required],
    expirationDate: ['05/10/2022', Validators.required],
    documentCategorySelect: ['Text Only'],
    textName: ['test', Validators.required],
    textArea: ['test', Validators.required],
    attachment: new FormArray([])
  });
  optionalRateFormGroup = optionalRateFormBuilder.group({
    chargeType: [[]],
    businessUnit: ['ICS'],
    serviceLevel: ['Feet', Validators.required],
    requestedService: ['', Validators.required],
    equipmentCategory: [''],
    equipmentType: [''],
    equipmentLength: [''],
    carriers: [[]],
    waived: [''],
    calculateRate: [''],
    passThrough: [''],
    rollUp: ['']
  });

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      declarations: [],
      providers: [CreateStandardDocumentationService, CreateStandardDocumentationUtilityService, { provide: APP_BASE_HREF, useValue: '/' },
          { provide: RouterStateSnapshot, useValue: CreateStandardDocumentationComponent },
          { provide: ActivatedRouteSnapshot, useValue: CreateStandardDocumentationComponent }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStandardDocumentationComponent);
    component = fixture.componentInstance;
    canComponentDeactivatefixture = TestBed.createComponent(CreateStandardDocumentationComponent);
    canComponentDeactivatecomponent = canComponentDeactivatefixture.componentInstance;
    fixture.detectChanges();
    createDocumentationService = TestBed.get(CreateStandardDocumentationService);
    createDocumentationUtilsService = TestBed.get(CreateStandardDocumentationUtilityService);
    route = TestBed.get(ActivatedRouteSnapshot);
    state = TestBed.get(RouterStateSnapshot);
    nextState = TestBed.get(RouterStateSnapshot);
  });
  const response = {
    '_embedded': {
      'accessorialDocumentTypes': [
        {
          '@id': 169,
          'createTimestamp': '2013-09-29T18:46:19Z',
          'createProgramName': 'string',
          'lastUpdateProgramName': 'string',
          'createUserId': '1',
          'lastUpdateUserId': '1',
          'accessorialDocumentTypeId': 1,
          'accessorialDocumentTypeName': 'abc',
          'effectiveDate': '1995-01-01T06:00:00.000+0000',
          'expirationDate': '2099-12-31T06:00:00.000+0000',
          'lastUpdateTimestampString': '2013-09-29T18:46:19Z',
          '_links': {}
        }
      ]
    },
    '_links': {},
    'page': {
      'size': 1,
      'totalElements': 25,
      'totalPages': 10,
      'number': 1
    }
  };
  const groupNameResponse = {
    '_embedded': {
        'accessorialGroupTypes': [
            {
                '@id': 1,
                'createTimestamp': '2019-06-18T01:02:28.3632436',
                'createProgramName': 'SSIS',
                'lastUpdateProgramName': 'SSIS',
                'createUserId': 'PIDNEXT',
                'lastUpdateUserId': 'PIDNEXT',
                'accessorialGroupTypeId': 1,
                'accessorialGroupTypeName': 'Standard',
                'defaultIndicator': 'Y',
                'effectiveDate': '2019-06-18',
                'expirationDate': '2099-12-31',
                'lastUpdateTimestampString': '2019-06-18T01:02:28.3632436',
                '_links': {
                    'self': {
                        'href': ''
                    },
                    'accessorialGroupType': {
                        'href': ''
                    }
                }
            }
        ]
    },
    '_links': {
        'self': {
            'href': '',
            'templated': true
        },
        'profile': {
            'href': ''
        }
    },
    'page': {
        'size': 20,
        'totalElements': 3,
        'totalPages': 1,
        'number': 0
    }
  };
  const errorResponse = {
    error: {
      errors: [
        {
          errorMessage: 'Not found'
        }
      ]
    }
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call setDocumentType', () => {
    spyOn(CreateStandardDocumentationService.prototype, 'getDocumentationType').and.returnValues(of(response));
    component.setDocumentType();
  });

  it('should call setDocumentType for error', () => {
    spyOn(CreateStandardDocumentationService.prototype, 'getDocumentationType').and.returnValues(throwError(errorResponse));
    component.setDocumentType();
  });

  it('should call onDateSelected', () => {
    component.onDateSelected(new Date('1995-01-01'), 'effectiveDate');
    component.onDateSelected(new Date('2099-12-31'), 'expirationDate');
    component.onDateSelected(new Date('2099-12-31'), 'Date');
  });

  it('should call typedDateValidate', () => {
    const event: any = {
      srcElement: {
        value: '01/01/1995'
      }
    };
    component.typedDateValidate(event, 'effectiveDate');
    component.typedDateValidate(event, 'expirationDate');
    component.typedDateValidate(event, 'Date');
  });

  it('should call typedDateValidate for else', () => {
    const event: any = {
      srcElement: {
        value: ''
      }
    };
    component.typedDateValidate(event, 'effectiveDate');
    component.typedDateValidate(event, 'expirationDate');
  });

  it('should call onValidateForm for if', () => {
    optionalAttrModel.optionalForm = optionalRateFormGroup;
    component.onValidateForm();
  });

  it('should call documentTypePopupYes', () => {
    component.createDocumentationModel.documentationForm = setting;
    spyOn(CreateStandardDocumentationService.prototype, 'deleteUploadedFiles').and.returnValues(of(true));
    component.documentTypePopupYes();
  });

  it('should call setFormErrors', () => {
    component.setFormErrors();
  });
  it('should call saveDocumentation', () => {
    const response1 = {
      'customerAccessorialDocumentConfigurationId': 169,
      'effectiveDate': '2002-01-01',
      'expirationDate': '2000-12-31',
      'customerAgreementId': 349,
      'accessorialDocumentTypeId': 1,
      'accessorialDocumentType': 'Legal',
      'chargeTypeId': 1,
      'chargeTypeName': 'Power Detention',
      'documentationCategory': 'textOnly',
      'equipmentCategoryCode': 'Container',
      'equipmentTypeCode': 'Dry Van',
      'equipmentLengthId': 28,
      'equipmentTypeId': 1,
      'customerAgreementContractSectionAccountsDTOs': [
        {
          'customerAccessorialAccountId': 1,
          'customerAgreementContractSectionId': 2,
          'customerAgreementContractSectionName': 'Documentation',
          'customerAgreementContractId': 2,
          'customerAgreementContractName': 'Document',
          'customerAgreementContractSectionAccountId': 1,
          'customerAgreementContractSectionAccountName': 'Sample'
        }
      ],
      'businessUnitServiceOfferingDTOs': [
        {
          'customerAccessorialServiceLevelBusinessUnitServiceOfferingId': 1,
          'serviceLevelBusinessUnitServiceOfferingAssociationId': 1,
          'businessUnit': 'JCI',
          'serviceOffering': 'TRANSPORT',
          'serviceLevel': 'TRUCK'
        }
      ],
      'requestServiceDTOs': [
        {
          'customerAccessorialRequestServiceId': 1,
          'requestedServiceTypeId': 1,
          'requestedServiceTypeCode': '0001'
        }
      ],
      'carrierDTOs': [
        {
          'customerAccessorialCarrierId': 1,
          'carrierId': 1,
          'carrierCode': '001'
        }
      ],
      'customerAccessorialDocumentTextAttachmentDTO': {
        'customerAccessorialDocumentTextId': 1,
        'documentationCategory': 'test',
        'textName': 'Aggrement',
        'text': 'AgreementInfo',
        'attachmentDTOs': [
          {
            'customerAccessorialAttachmentId': 1,
            'accessorialAttachmentTypeDTO': {
              'accessorialAttachmentTypeId': 1,
              'accessorialAttachmentTypeName': 'Document'
            },
            'documentNumber': 'DOC01',
            'documentName': 'Aggreement'
          }
        ]
      }
    };
    spyOn(CreateStandardDocumentationUtilityService.prototype, 'documentationPostFramer');
    spyOn(CreateStandardDocumentationService.prototype, 'postDocumentationData').and.returnValues(of(response1));
    component.saveDocumentation();
  });

  it('should call saveDocumentation for if', () => {
    const response1 = {
      'customerAccessorialDocumentConfigurationId': null,
      'effectiveDate': '2002-01-01',
      'expirationDate': '2000-12-31',
      'customerAgreementId': 349,
      'accessorialDocumentTypeId': 1,
      'accessorialDocumentType': 'Legal',
      'chargeTypeId': 1,
      'chargeTypeName': 'Power Detention',
      'documentationCategory': 'textOnly',
      'equipmentCategoryCode': 'Container',
      'equipmentTypeCode': 'Dry Van',
      'equipmentLengthId': 28,
      'equipmentTypeId': 1,
      'customerAgreementContractSectionAccountsDTOs': [
        {
          'customerAccessorialAccountId': 1,
          'customerAgreementContractSectionId': 2,
          'customerAgreementContractSectionName': 'Documentation',
          'customerAgreementContractId': 2,
          'customerAgreementContractName': 'Document',
          'customerAgreementContractSectionAccountId': 1,
          'customerAgreementContractSectionAccountName': 'Sample'
        }
      ],
      'businessUnitServiceOfferingDTOs': [
        {
          'customerAccessorialServiceLevelBusinessUnitServiceOfferingId': 1,
          'serviceLevelBusinessUnitServiceOfferingAssociationId': 1,
          'businessUnit': 'JCI',
          'serviceOffering': 'TRANSPORT',
          'serviceLevel': 'TRUCK'
        }
      ],
      'requestServiceDTOs': [
        {
          'customerAccessorialRequestServiceId': 1,
          'requestedServiceTypeId': 1,
          'requestedServiceTypeCode': '0001'
        }
      ],
      'carrierDTOs': [
        {
          'customerAccessorialCarrierId': 1,
          'carrierId': 1,
          'carrierCode': '001'
        }
      ],
      'customerAccessorialDocumentTextAttachmentDTO': {
        'customerAccessorialDocumentTextId': 1,
        'documentationCategory': 'test',
        'textName': 'Aggrement',
        'text': 'AgreementInfo',
        'attachmentDTOs': [
          {
            'customerAccessorialAttachmentId': 1,
            'accessorialAttachmentTypeDTO': {
              'accessorialAttachmentTypeId': 1,
              'accessorialAttachmentTypeName': 'Document'
            },
            'documentNumber': 'DOC01',
            'documentName': 'Aggreement'
          }
        ]
      }
    };
    spyOn(CreateStandardDocumentationUtilityService.prototype, 'documentationPostFramer');
    spyOn(CreateStandardDocumentationService.prototype, 'postDocumentationData').and.returnValues(of(response1));
    component.saveDocumentation();
  });


  it('should call onDocumentationCancel', () => {
    component.onDocumentationCancel();
  });

  it('should call validateDate', () => {
    component.validateDate('12/31/2099', 'effectiveDate');
    component.validateDate('12/31/2099', 'expirationDate');
  });

  it('should call onChangeDocumentType', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="documentationType"]'));
    element.triggerEventHandler('onChange', { value: 'Legal' });
  });

  it('should call getGroupNames', () => {
    component.createDocumentationModel.documentationForm = setting;
    spyOn(CreateStandardDocumentationService.prototype, 'getGroupNames').and.returnValues(of(groupNameResponse));
    component.getGroupNames();
  });

  it('should call populateGroupName for else', () => {
    component.createDocumentationModel.groupNameValues = null;
    component.populateGroupName();
  });

  it('should call onTypeGroupName', () => {
    component.createDocumentationModel.groupNameValues = [{label: 'abc', value: 1}];
    const element = fixture.debugElement.query(By.css('[formControlName="groupName"]'));
    element.triggerEventHandler('completeMethod', { query: 's' });
  });

  it('should call onTypeGroupName for else ', () => {
    component.createDocumentationModel.groupNameValues = null;
    component.onTypeGroupName(event);
  });

  it('should call onAutoCompleteBlur', () => {
    component.createDocumentationModel.documentationForm = setting;
    const obj: any = { 'target': { 'value': false } };
    component.onautoCompleteBlur(obj, 'documentationType');
  });

  it('should call formCheck', () => {
    component.createDocumentationModel.documentationForm = setting;
    component.createDocumentationModel.documentationLevelChange = true;
    component.formCheck('groupName');
  });

  it('should call getGroupNames for Error', () => {
    component.createDocumentationModel.documentationForm = setting;
    spyOn(CreateStandardDocumentationService.prototype, 'getGroupNames').and.returnValues(throwError(errorResponse));
    component.getGroupNames();
  });

  it('should call onTypeGroupName Else Condition', () => {
    component.createDocumentationModel.groupNameValues = [];
    const element = fixture.debugElement.query(By.css('[formControlName="groupName"]'));
    element.triggerEventHandler('completeMethod', { query: 's' });
  });

  it('should call typedDateValidate', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="effectiveDate"]'));
    element.triggerEventHandler('onInput', { srcElement: {'value': '03/09/2019'} });
  });

  it('should call typedDateValidate else part', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="expirationDate"]'));
    element.triggerEventHandler('onInput', { srcElement: {'value': '05/10/2019'} });
  });

  it('should call saveDocumentation Error Part', () => {
    spyOn(CreateStandardDocumentationUtilityService.prototype, 'documentationPostFramer');
    spyOn(CreateStandardDocumentationService.prototype, 'postDocumentationData').and.returnValues(throwError(errorResponse));
    component.saveDocumentation();
  });

  it('should call onDocumentationCancel else', () => {
    component.createDocumentationModel.fileCount = 2;
    component.onDocumentationCancel();
  });

  it('should call onDontSaveNavigate', () => {
    component.createDocumentationModel.routingUrl = '/';
    component.onDontSaveNavigate();
  });

  it('should call dateCheck', () => {
    component.createDocumentationModel.agreementEffectiveDate = '03/05/2018';
    component.createDocumentationModel.agreementEndDate = '03/05/2019';
    component.dateCheck();
  });

  it('should call dateCheck Else', () => {
    component.createDocumentationModel.agreementEffectiveDate = '08/02/2019';
    component.createDocumentationModel.agreementEndDate = '12/31/2099';
    component.dateCheck();
  });

  it('should call onChangeDocumentType', () => {
    component.createDocumentationModel.fileCount = 1;
    const element = fixture.debugElement.query(By.css('[formControlName="documentationType"]'));
    element.triggerEventHandler('onChange', { value: 'Legal' });
  });

  it('should call canDeactivate for if', () => {
    component.createDocumentationModel.documentationForm.markAsDirty();
    component.createDocumentationModel.isDetailsSaved = false;
    component.createDocumentationModel.routingUrl = nextState.url;
    component.canDeactivate(canDeactivateGuardService, route, state, nextState);
    expect(component.canDeactivate).toBeTruthy();
  });

  it('should call canDeactivate for Else', () => {
    component.createDocumentationModel.isDetailsSaved = true;
    component.createDocumentationModel.routingUrl = nextState.url;
    component.canDeactivate(canDeactivateGuardService, route, state, nextState);
    expect(component.canDeactivate).toBeTruthy();
  });

  it('should call onAutoCompleteBlur for else', () => {
    component.createDocumentationModel.documentationForm = setting;
    const obj: any = { 'target': { 'value': 'abc' } };
    component.onautoCompleteBlur(obj, 'groupName');
  });

  it('should call setValidation for if ', () => {
    component.setValidation('documentationType');
  });

  it('should call validateEffectiveDate for if ', () => {
    component.createDocumentationModel.documentationForm.controls['effectiveDate'].setValue('08/10/2019');
    component.createDocumentationModel.documentationForm.controls['expirationDate'].setValue('08/05/2019');
    component.validateEffectiveDate();
  });

  it('should call accessorialDocumentationErrorScenario for if ', () => {
    const error: any = {
      error: {
        errors: [{
          code: 'DUPLICATE_EXISTS',
          errorMessage: 'abc'
        }]
      }
    };
    component.accessorialDocumentationErrorScenario(error);
  });

  it('should call accessorialDocumentationErrorScenario for else ', () => {
    const error: any = {
      error: {
        errors: [{
          code: 'DUPLICATE_EXISTS',
          errorMessage: ''
        }]
      }
    };
    component.accessorialDocumentationErrorScenario(error);
  });

  it('should call showDuplicateRateError for else ', () => {
    const error: any = {
      error: {
        errors: [{
          code: 'EXISTS',
          errorMessage: ''
        }]
      }
    };
    component.showDuplicateRateError(error);
  });

  it('should call formFieldsTouched for else if ', () => {
    component.createDocumentationModel.documentationForm = setting;
    component.createDocumentationModel.documentationForm.controls['documentCategorySelect'].setValue('Both');
    component.formFieldsTouched();
  });

  it('should call onHideCancelPop ', () => {
    component.onHideCancelPop('optionalFields');
  });

  it('should call onDontSave ', () => {
    component.onDontSave();
  });

  it('should call canDeactivate for else', () => {
    component.createDocumentationModel.documentationForm = setting;
    optionalAttrModel.optionalForm = optionalRateFormGroup;
    component.canDeactivate(canComponentDeactivatecomponent, route, state, nextState);
  });

  it('should call canDeactivate for if', () => {
    component.createDocumentationModel.documentationForm = setting;
    optionalAttrModel.optionalForm = optionalRateFormGroup;
    component.createDocumentationModel.documentationForm.markAsDirty();
    component.canDeactivate(canComponentDeactivatecomponent, route, state, nextState);
  });

  it('should call dateCheck ', () => {
    component.createDocumentationModel.agreementEffectiveDate = '01/10/2019';
    component.createDocumentationModel.documentationForm.controls['effectiveDate'].setValue('01/01/2019');
    component.dateCheck();
  });

});
