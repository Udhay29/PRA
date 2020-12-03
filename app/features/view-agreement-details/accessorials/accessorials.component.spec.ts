import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../app.module';
import { ViewAgreementDetailsModule } from '../view-agreement-details.module';

import { AccessorialsComponent } from './accessorials.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AccessorialsComponent', () => {
  let component: AccessorialsComponent;
  let fixture: ComponentFixture<AccessorialsComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
      fixture = TestBed.createComponent(AccessorialsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
