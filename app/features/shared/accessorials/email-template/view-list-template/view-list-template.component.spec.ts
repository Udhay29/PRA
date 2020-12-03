import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewListTemplateComponent } from './view-list-template.component';
import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from './../../../../../app.module';
import { StandardModule } from './../../../../standard/standard.module';
import { APP_BASE_HREF } from '@angular/common';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ViewtemplateService } from '../view-list-template/service/viewtemplate.service';

describe('ViewListTemplateComponent', () => {
  let component: ViewListTemplateComponent;
  let fixture: ComponentFixture<ViewListTemplateComponent>;
  let viewtemplateService: ViewtemplateService;
  let masterresponse;
  let data;
  let defaultresponse;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, ViewtemplateService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewListTemplateComponent);
    viewtemplateService = TestBed.get(ViewtemplateService);
    component = fixture.componentInstance;
    masterresponse = {
      emailTemplateConfigurationId: 43,
      emailTemplateReferenceNumber: 'pricing_axs_master_notification',
      emailTemplateType: {
        emailTemplateTypeId: 1,
        emailTemplateTypeName: 'Master',
        effectiveDate: '2019-08-20',
        expirationDate: '2099-12-31'
      },
      accessorialNotificationType: null,
      chargeTypeId: null,
      chargeTypeDisplayName: null,
      chargeTypeCode: null,
      effectiveTimestamp: '2019-08-22T07:54:02.307Z',
      expirationTimestamp: '2100-01-01T00:00:00Z',
      lastUpdateProgramName: 'Process ID',
      lastUpdateUserId: 'jisamg6',
      lastUpdateTimestamp: '2019-08-22T07:54:02.308',
      defaultAttachment: null,
      emailTemplateTexts: [
        {
          emailTemplateTextId: 229,
          emailTemplateConfigurationId: 43,
          emailTemplatePartType: {
            emailTemplatePartTypeId: 6,
            emailTemplatePartTypeName: 'Email Body Introduction',
            effectiveDate: '2019-08-20',
            expirationDate: '2099-12-31'
          },
          emailTemplateText: 'rret',
          emailTemplateTextSequenceNumber: 1
        },
        {
          emailTemplateTextId: 232,
          emailTemplateConfigurationId: 43,
          emailTemplatePartType: {
            emailTemplatePartTypeId: 7,
            emailTemplatePartTypeName: 'Email Body Conclusion',
            effectiveDate: '2019-08-20',
            expirationDate: '2099-12-31'
          },
          emailTemplateText: 'asadas',
          emailTemplateTextSequenceNumber: 1
        },
        {
          emailTemplateTextId: 235,
          emailTemplateConfigurationId: 43,
          emailTemplatePartType: {
            emailTemplatePartTypeId: 5,
            emailTemplatePartTypeName: 'Signature',
            effectiveDate: '2019-08-20',
            expirationDate: '2099-12-31'
          },
          emailTemplateText: 'tytry',
          emailTemplateTextSequenceNumber: 1
        },
        {
          emailTemplateTextId: 238,
          emailTemplateConfigurationId: 43,
          emailTemplatePartType: {
            emailTemplatePartTypeId: 1,
            emailTemplatePartTypeName: 'Subject',
            effectiveDate: '2019-08-20',
            expirationDate: '2099-12-31'
          },
          emailTemplateText: 'sample',
          emailTemplateTextSequenceNumber: 1
        }
      ],
      emailTemplatePartAttributes: [
        {
          emailTemplatePartAttributeId: 125,
          emailTemplateConfigurationId: 43,
          emailTemplateAttributeAssociation: {
            emailTemplateAttributeAssociationId: 54,
            emailTemplatePartType: {
              emailTemplatePartTypeId: 1,
              emailTemplatePartTypeName: 'Subject',
              effectiveDate: '2019-08-20',
              expirationDate: '2099-12-31'
            },
            emailTemplateAttribute: {
              emailTemplateAttributeId: 71,
              emailTemplateAttributeName: 'Arrival Date and Time for Power Detention',
              effectiveDate: '2019-08-20',
              expirationDate: '2099-12-31'
            }
          },
          emailTemplateAttributeSequenceNumber: 1
        }
      ]
    };

    defaultresponse = {
      'emailTemplateConfigurationId': 118,
      'emailTemplateReferenceNumber': 'pricing_axs_admin_prenotify_default_001',
      'emailTemplateType': {
        'emailTemplateTypeId': 2,
        'emailTemplateTypeName': 'Default',
        'effectiveDate': '2019-08-20',
        'expirationDate': '2099-12-31'
      },
      'accessorialNotificationType': {
        'accessorialNotificationTypeId': 1,
        'accessorialNotificationTypeName': 'Prenotify',
        'effectiveDate': '2019-05-24',
        'expirationDate': '2099-12-31'
      },
      'chargeTypeId': 64,
      'chargeTypeDisplayName': 'Administration Fee (ADMIN)',
      'chargeTypeCode': 'ADMIN',
      'effectiveTimestamp': '2019-08-26T09:06:24.315Z',
      'expirationTimestamp': '2100-01-01T00:00:00Z',
      'lastUpdateProgramName': 'Process ID',
      'lastUpdateUserId': 'jisarkc',
      'lastUpdateTimestamp': '2019-08-26T09:06:24.316',
      'defaultAttachment': null,
      'emailTemplateTexts': [{
        'emailTemplateTextId': 720,
        'emailTemplateConfigurationId': 118,
        'emailTemplatePartType': {
          'emailTemplatePartTypeId': 6,
          'emailTemplatePartTypeName': 'Email Body Introduction',
          'effectiveDate': '2019-08-20',
          'expirationDate': '2099-12-31'
        },
        'emailTemplateText': '',
        'emailTemplateTextSequenceNumber': 1
      }, {
        'emailTemplateTextId': 721,
        'emailTemplateConfigurationId': 118,
        'emailTemplatePartType': {
          'emailTemplatePartTypeId': 7,
          'emailTemplatePartTypeName': 'Email Body Conclusion',
          'effectiveDate': '2019-08-20',
          'expirationDate': '2099-12-31'
        },
        'emailTemplateText': '',
        'emailTemplateTextSequenceNumber': 1
      }, {
        'emailTemplateTextId': 722,
        'emailTemplateConfigurationId': 118,
        'emailTemplatePartType': {
          'emailTemplatePartTypeId': 5,
          'emailTemplatePartTypeName': 'Signature',
          'effectiveDate': '2019-08-20',
          'expirationDate': '2099-12-31'
        },
        'emailTemplateText': 'default',
        'emailTemplateTextSequenceNumber': 1
      }, {
        'emailTemplateTextId': 723,
        'emailTemplateConfigurationId': 118,
        'emailTemplatePartType': {
          'emailTemplatePartTypeId': 1,
          'emailTemplatePartTypeName': 'Subject',
          'effectiveDate': '2019-08-20',
          'expirationDate': '2099-12-31'
        },
        'emailTemplateText': '',
        'emailTemplateTextSequenceNumber': 1
      }],
      'emailTemplatePartAttributes': [{
        'emailTemplatePartAttributeId': 353,
        'emailTemplateConfigurationId': 118,
        'emailTemplateAttributeAssociation': {
          'emailTemplateAttributeAssociationId': 237,
          'emailTemplatePartType': {
            'emailTemplatePartTypeId': 3,
            'emailTemplatePartTypeName': 'Batch Excel',
            'effectiveDate': '2019-08-20',
            'expirationDate': '2099-12-31'
          },
          'emailTemplateAttribute': {
            'emailTemplateAttributeId': 85,
            'emailTemplateAttributeName': 'Arrival Grace Period',
            'effectiveDate': '2019-08-20',
            'expirationDate': '2099-12-31'
          }
        },
        'emailTemplateAttributeSequenceNumber': 1
      }, {
        'emailTemplatePartAttributeId': 354,
        'emailTemplateConfigurationId': 118,
        'emailTemplateAttributeAssociation': {
          'emailTemplateAttributeAssociationId': 313,
          'emailTemplatePartType': {
            'emailTemplatePartTypeId': 4,
            'emailTemplatePartTypeName': 'Default Excel',
            'effectiveDate': '2019-08-20',
            'expirationDate': '2099-12-31'
          },
          'emailTemplateAttribute': {
            'emailTemplateAttributeId': 71,
            'emailTemplateAttributeName': 'Arrival Date and Time for Power Detention',
            'effectiveDate': '2019-08-20',
            'expirationDate': '2099-12-31'
          }
        },
        'emailTemplateAttributeSequenceNumber': 1
      }]
    };
    data = [
      {
        emailTemplateTextId: 229,
        emailTemplateConfigurationId: 43,
        emailTemplatePartType: {
          emailTemplatePartTypeId: 6,
          emailTemplatePartTypeName: 'Email Body Introduction',
          effectiveDate: '2019-08-20',
          expirationDate: '2099-12-31'
        },
        emailTemplateText: 'rret',
        emailTemplateTextSequenceNumber: 1
      },
      {
        emailTemplateTextId: 232,
        emailTemplateConfigurationId: 43,
        emailTemplatePartType: {
          emailTemplatePartTypeId: 7,
          emailTemplatePartTypeName: 'Email Body Conclusion',
          effectiveDate: '2019-08-20',
          expirationDate: '2099-12-31'
        },
        emailTemplateText: 'asadas',
        emailTemplateTextSequenceNumber: 1
      },
      {
        emailTemplateTextId: 235,
        emailTemplateConfigurationId: 43,
        emailTemplatePartType: {
          emailTemplatePartTypeId: 5,
          emailTemplatePartTypeName: 'Signature',
          effectiveDate: '2019-08-20',
          expirationDate: '2099-12-31'
        },
        emailTemplateText: 'tytry',
        emailTemplateTextSequenceNumber: 1
      },
      {
        emailTemplateTextId: 238,
        emailTemplateConfigurationId: 43,
        emailTemplatePartType: {
          emailTemplatePartTypeId: 1,
          emailTemplatePartTypeName: 'Subject',
          effectiveDate: '2019-08-20',
          expirationDate: '2099-12-31'
        },
        emailTemplateText: 'sample',
        emailTemplateTextSequenceNumber: 1
      }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loadMasterDetails', () => {
    spyOn(ViewtemplateService.prototype, 'getDetailedMasterView').and.returnValues(of(masterresponse));
    component.loadMasterDetails();
  });

  it('textInputValues', () => {
    component.textInputValues(masterresponse);
  });

  it('dataElementValues', () => {
    component.dataElementValues(masterresponse);
  });

  it('onClickClose', () => {
    component.onClickClose();
  });

  it('signatureValue', () => {
    component.signatureValue(masterresponse, data);
  });

  it('signatureValue', () => {
    component.signatureValue(defaultresponse, data);
  });

  it('should call loadListDetails', () => {
    component.viewTemplateModel.viewMasterTemplateDetails = masterresponse;
    spyOn(ViewtemplateService.prototype, 'getDetailedView').and.returnValues(of(defaultresponse));
    component.loadListDetails();
  });
  it('should call loadListDetails with error', () => {
    const partial = {
      'responseStatus' : 'PARTIAL',
      'errorMessages' : ['error']
    };
    const withPartialError = {...defaultresponse, ...partial};
    component.viewTemplateModel.viewMasterTemplateDetails = masterresponse;
    spyOn(ViewtemplateService.prototype, 'getDetailedView').and.returnValues(of(withPartialError));
    component.loadListDetails();
  });
});
