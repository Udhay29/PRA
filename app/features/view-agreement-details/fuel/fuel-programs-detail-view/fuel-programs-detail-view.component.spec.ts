import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../app.module';
import { ViewAgreementDetailsModule } from './../../view-agreement-details.module';
import { AgreementDetails } from './model/fuel-detail-view.interface';

import { FuelProgramsDetailViewComponent } from './fuel-programs-detail-view.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

xdescribe('FuelProgramsDetailViewComponent', () => {
  let component: FuelProgramsDetailViewComponent;
  let fixture: ComponentFixture<FuelProgramsDetailViewComponent>;
  let agreementDetails: AgreementDetails;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelProgramsDetailViewComponent);
    component = fixture.componentInstance;
    agreementDetails = {
      'customerAgreementID': 27,
      'customerAgreementName': 'Adams Cable Equipment (ADLE59)',
      'agreementType': 'Customer',
      'ultimateParentAccountID': 45667,
      'currencyCode': 'USD',
      'cargoReleaseAmount': '$100,000',
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
    component.agreementData = agreementDetails;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
