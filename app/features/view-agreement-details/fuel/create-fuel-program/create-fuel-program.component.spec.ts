import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { of } from 'rxjs';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';
import { AppModule } from '../../../../app.module';
import { MessageService } from 'primeng/components/common/messageservice';
import { ViewAgreementDetailsModule } from './../../view-agreement-details.module';
import { CreateFuelProgramComponent } from './create-fuel-program.component';
import { CreateFuelProgramService } from './service/create-fuel-program.service';
import { AgreementDetails, CanComponentDeactivate } from './model/create-fuel-program.interface';

describe('CreateFuelProgramComponent', () => {
  let component: CreateFuelProgramComponent;
  let fixture: ComponentFixture<CreateFuelProgramComponent>;
  let agreementDetails: AgreementDetails;
  let service: CreateFuelProgramService;
  let shared: BroadcasterService;
  let messageService: MessageService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, AppModule, ViewAgreementDetailsModule],
      providers: [CreateFuelProgramService, BroadcasterService, MessageService, { provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFuelProgramComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(CreateFuelProgramService);
    shared = fixture.debugElement.injector.get(BroadcasterService);
    messageService = fixture.debugElement.injector.get(MessageService);
    fixture.detectChanges();
    agreementDetails = {
      'customerAgreementID': 565,
      'customerAgreementName': 'Dkj & Wpj Llc (DKBE6)',
      'agreementType': 'Customer',
      'ultimateParentAccountID': 26905,
      'currencyCode': 'USD',
      'cargoReleaseAmount': 100000,
      'businessUnits': [
        'JBI',
        'JBT',
        'ICS',
        'DCS'
      ],
      'taskAssignmentIDs': null,
      'effectiveDate': '1995-01-01',
      'expirationDate': '2099-12-31',
      'invalidIndicator': 'N',
      'invalidReasonTypeName': 'Active'
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  xit('should call getAgreementId', () => {
    component.createFuelProgramModel.agreementId = 565;
    spyOn(service, 'getAgreementDetails').and.returnValue(of(agreementDetails));
    component.getAgreementId();
  });
  it('should call onIndexChange', () => {
    const event = 1;
    component.createFuelProgramModel.stepsList[event]['visible'] = true;
    component.onIndexChange(event);
  });
  it('should call resetComponents', () => {
    component.resetComponents();
  });
  xit('should call showComponents', () => {
    component.createFuelProgramModel.activeIndex = 0;
    component.showComponents();
  });
  xit('should call toastMessage', () => {
    component.toastMessage('error', 'Error', 'Please Check');
  });
  it('should call onPopupCancel', () => {
    component.onPopupCancel();
  });
  xit('should call onPopupYes for if condition', () => {
    component.createFuelProgramModel.routingUrl = '/viewagreement?id=565';
    component.onPopupYes();
  });
  it('should call onPopupYes for else condition', () => {
    component.createFuelProgramModel.routingUrl = '/searchagreement';
    component.onPopupYes();
  });
  it('should call loader to show page loading', () => {
    component.loader(true);
  });
  it('should call loader to hide page loading', () => {
    component.loader(false);
  });
});
