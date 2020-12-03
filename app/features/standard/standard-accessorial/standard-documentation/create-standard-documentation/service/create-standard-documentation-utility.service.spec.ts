import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from '../../../../../../app.module';
import { StandardModule } from '../../../../standard.module';
import { CreateDocumentationModel } from '../model/create-standard-doucmentation.model';
import { OptionalAttributesModel
} from '../../../../../view-agreement-details/accessorials/shared/models/optional-attributes.model';
import { CreateStandardDocumentationService } from './create-standard-documentation.service';
import { CreateStandardDocumentationUtilityService } from './create-standard-documentation-utility.service';
import { of } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';


describe('CreateStandardDocumentationService', () => {
  let service: CreateStandardDocumentationUtilityService;
  let http: HttpClient;
  const documentationModel = new CreateDocumentationModel;
  const optionalModel = new OptionalAttributesModel;
  let createDocumentationService: CreateStandardDocumentationService;
  const createDocFormBuilder: FormBuilder = new FormBuilder();
  let createDocFormGroup: FormGroup;
  const optionalFormBuilder: FormBuilder = new FormBuilder();
  let optionalFormGroup: FormGroup;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      providers: [CreateStandardDocumentationService, CreateStandardDocumentationUtilityService,
        { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(CreateStandardDocumentationUtilityService);
    createDocumentationService = TestBed.get(CreateStandardDocumentationService);
    http = TestBed.get(HttpClient);
    createDocFormGroup = createDocFormBuilder.group({
      documentationType: ['', Validators.required],
      groupName: ['', Validators.required],
      effectiveDate: ['2019/12/31', Validators.required],
      expirationDate: ['2099/12/31', Validators.required],
      documentCategorySelect: [],
      textName: ['', Validators.required],
      textArea: ['', Validators.required],
      attachment: [[
        {
          'attachmentType': {
            'id': 1,
            'value': 'Document'
          },
          'documentId': 'DOC01',
          'filename': 'Aggreement'
        }
      ]]
    });
    optionalFormGroup = optionalFormBuilder.group({
      chargeType: [''],
      businessUnit: [[{financeBusinessUnitServiceOfferingAssociationID: 1,
        financeBusinessUnitCode: 'JCI',
        serviceOfferingDescription: 'TRANSPORT'}]],
      serviceLevel: [[{label: 'test', value: 'test'}]],
      requestedService: [['test']],
      equipmentCategory: [''],
      equipmentType: [''],
      equipmentLength: [''],
      carriers: [[{value: {id: '1', code: 'test'}, label: 'test'}]]
    });
  });
  const backData = {
    '_embedded' : {
      'configurationParameterDetails' : [ {
        'configurationParameterDetailID' : 203,
        'configurationParameterValue' : '30',
        'configurationParameter' : {
          'configurationParameterName' : 'Super User Back Date Days',
          'configurationParameterID' : 2,
          'configurationParameterValueType' : 'Number',
          '_links' : {}
        },
        'parameterSpecificationType' : {
          'parameterSpecificationTypeID' : 2,
          'parameterSpecificationTypeName' : 'Max'
        },
        '_links' : {}
      } ]
    },
    '_links' : {}
  };
  const futureData = {
    '_embedded' : {
      'configurationParameterDetails' : [ {
        'configurationParameterDetailID' : 205,
        'configurationParameterValue' : '30',
        'configurationParameter' : {
          'configurationParameterName' : 'Super User Future Date Days',
          'configurationParameterID' : 4,
          'configurationParameterValueType' : 'Number',
          '_links' : {}
        },
        'parameterSpecificationType' : {
          'parameterSpecificationTypeID' : 2,
          'parameterSpecificationTypeName' : 'Max'
        },
        '_links' : {}
      } ]
    },
    '_links' : {}
  };

  it('should be created', inject([CreateStandardDocumentationUtilityService], () => {
    expect(service).toBeTruthy();
  }));
  it('should call setSuperUserBackDateDays', inject([CreateStandardDocumentationUtilityService], () => {
    documentationModel.isSubscribeFlag = true;
    spyOn(CreateStandardDocumentationService.prototype, 'getSuperUserBackDate').and.returnValues(of(backData));
    service.setSuperUserBackDateDays(documentationModel);
  }));
  it('should call setSuperUserFutureDateDays', inject([CreateStandardDocumentationUtilityService], () => {
    spyOn(CreateStandardDocumentationService.prototype, 'getSuperFutureBackDate').and.returnValues(of(futureData));
    service.setSuperUserFutureDateDays(documentationModel);
  }));
  it('should call documentationPostFramer', inject([CreateStandardDocumentationUtilityService], () => {
    documentationModel.documentationForm = createDocFormGroup;
    optionalModel.optionalForm = optionalFormGroup;
    documentationModel.selectedDocumentType = {value: 1, label: 'Legal'};
    optionalModel.serviceLevelValues = [{label: 'Standard', value: 'Standard'}];
    optionalModel.serviceLevelResponse = [
      {
        serviceLevel: {
          serviceLevelCode: 'test',
          serviceLevelDescription: 'test'
        },
        financeBusinessUnitServiceOfferingAssociation: {
          financeBusinessUnitServiceOfferingAssociationID: 1,
          financeBusinessUnitCode: 'test',
          serviceOfferingCode: 'test',
          serviceOfferingDescription: 'test',
          effectiveTimestamp: 'test',
          expirationTimestamp: 'test',
          lastUpdateTimestampString: 'test'
        },
        lastUpdateTimestampString: 'test',
        serviceLevelBusinessUnitServiceOfferingAssociationID: 'test',
        _links: {}
      }
    ];
    service.documentationPostFramer(documentationModel, optionalModel);
  }));
});
