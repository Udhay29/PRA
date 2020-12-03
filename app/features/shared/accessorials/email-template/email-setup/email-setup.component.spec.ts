import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { EmailSetupComponent } from './email-setup.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '../../../../../app.module';
import { StandardModule } from '../../../../standard/standard.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { TemplateService } from '../service/template.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('EmailSetupComponent', () => {
  let component: EmailSetupComponent;
  let fixture: ComponentFixture<EmailSetupComponent>;
  const fb = new FormBuilder();
  let templateService: TemplateService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      declarations: [],
      providers: [TemplateService, { provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailSetupComponent);
    component = fixture.componentInstance;
    const form: FormGroup = fb.group({
      subjectText: [''],
      subjectDataElements: [''],
      introParagraph: fb.array([fb.group({text: ['', Validators.required]})]),
      bodyDataElements: [''],
      conclusionParagraph: fb.array([fb.group({text: ['']})]),
      signatureLine: fb.array([fb.group({text: ['']})]),
      chargeType: [{id: 1}, [Validators.required]],
      notificationType: [{id: 1}, [Validators.required]]
    });
    component.setUpForm = form;
    fixture.detectChanges();
    templateService = TestBed.get(TemplateService);
  });
  const notificationResponse = {
    '_embedded' : {
      'accessorialNotificationTypes' : [ {
        '@id' : 1,
        'createTimestamp' : '2019-05-24T14:35:25.0637895',
        'createProgramName' : 'SSIS',
        'lastUpdateProgramName' : 'SSIS',
        'createUserId' : 'PIDNEXT',
        'lastUpdateUserId' : 'PIDNEXT',
        'accessorialNotificationTypeId' : 1,
        'accessorialNotificationTypeName' : 'Prenotify',
        'effectiveDate' : '2019-05-24',
        'expirationDate' : '2099-12-31',
        'lastUpdateTimestampString' : '2019-05-24T14:35:25.0637895',
        '_links' : {
          'self' : {
            'href' : 'https://pricing-test.jbhunt.com/api/pricingaccessorialservices/accessorialNotificationTypes/1'
          },
          'accessorialNotificationType' : {
            'href' : 'https://pricing-test.jbhunt.com/api/pricingaccessorialservices/accessorialNotificationTypes/1'
          }
        }
      } ]
    },
    '_links' : {
      'self' : {
        'href' : 'https://pricing-test.jbhunt.com/api/pricingaccessorialservices/accessorialNotificationTypes{?page,size,sort}',
        'templated' : true
      },
      'profile' : {
        'href' : 'https://pricing-test.jbhunt.com/api/pricingaccessorialservices/profile/accessorialNotificationTypes'
      }
    },
    'page' : {
      'size' : 50,
      'totalElements' : 3,
      'totalPages' : 1,
      'number' : 0
    }
  };
  const chargeTypeResponse = [ {
    'chargeTypeID' : 64,
    'chargeTypeCode' : 'ADMIN',
    'chargeTypeName' : 'Administration Fee',
    'chargeTypeDescription' : 'Additional fees incurred for processing of charges.',
    'chargeTypeBusinessUnitServiceOfferingAssociations' : null
  } ];

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    spyOn(templateService, 'getNotificationTypes').and.returnValues(of(notificationResponse));
    spyOn(templateService, 'getChargeTypes').and.returnValues(of(chargeTypeResponse));
    component.ngOnInit();
  });

  it('should call getFilteredSuggestions', () => {
    component.emailTemplateModel['chargeType'] = [ {
      id: 1,
      name: 'string',
      association: 'string',
      invalid: true
  } ];
    const element = fixture.debugElement.query(By.css('[formControlName="chargeType"]'));
    element.triggerEventHandler('completeMethod', { query: 's' });
  });

  it('should call getFilteredSuggestions else', () => {
    component.emailTemplateModel['notificationType'] = [ {
      id: 1,
      name: 'string',
      association: 'string',
      invalid: true
  } ];
    const element = fixture.debugElement.query(By.css('[formControlName="notificationType"]'));
    element.triggerEventHandler('completeMethod', { query: 's' });
  });

  it('should call checkDuplicate', () => {
    spyOn(templateService, 'checkDefaultTemplateExists').and.returnValues(of(true));
    component.checkDuplicate();
  });

  it('should call checkDuplicate else', () => {
    spyOn(templateService, 'checkDefaultTemplateExists').and.returnValues(of(false));
    component.checkDuplicate();
  });

  it('should call onBlur', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="chargeType"]'));
    element.triggerEventHandler('onBlur', { target: {'value': ''} });
  });

  it('should call onBlur else', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="chargeType"]'));
    element.triggerEventHandler('onBlur', { target: {'value': 'value'} });
  });
});
