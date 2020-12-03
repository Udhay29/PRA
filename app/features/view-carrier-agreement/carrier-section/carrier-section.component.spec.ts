import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AppModule } from '../../../app.module';
import { ViewCarrierAgreementModule } from '../view-carrier-agreement.module';
import { CarrierSectionComponent } from './carrier-section.component';

describe('CarrierSectionComponent', () => {
  let component: CarrierSectionComponent;
  let fixture: ComponentFixture<CarrierSectionComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewCarrierAgreementModule, HttpClientTestingModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call onAddSection', () => {
    component.onAddSection();
  });
  it('should call splitClose', () => {
    component.splitClose(true);
  });
  it('should call loader', () => {
    component.loader(true);
  });
});
