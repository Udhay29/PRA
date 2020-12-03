import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../app.module';
import { ViewAgreementDetailsModule } from '../../view-agreement-details.module';
import { ManageTeamsUtility } from './manage-teams.utility';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ManageTeamsUtility', () => {

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [ManageTeamsUtility, { provide: APP_BASE_HREF, useValue: '/' }],
    });
  });

  it('should be created', () => {
    const service: ManageTeamsUtility = TestBed.get(ManageTeamsUtility);
    expect(service).toBeTruthy();
  });
});
