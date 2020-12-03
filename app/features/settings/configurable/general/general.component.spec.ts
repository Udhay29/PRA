import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../app.module';
import { SettingsModule } from './../../settings.module';
import { GeneralComponent } from './general.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GeneralComponent', () => {
  let component: GeneralComponent;
  let fixture: ComponentFixture<GeneralComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call validateOnMax', () => {
    component.validateOnMax();
  });

  it('should call formatCurrency', () => {
    component.formatCurrency('100', 'cargoReleaseDefault');
  });

  it('should call currenyValueFormatter', () => {
    component.currenyValueFormatter('100', 'cargoReleaseDefault', '10');
  });

  it('should call onNullCheckValidate', () => {
    component.onNullCheckValidate('100', 'settingForm');
  });

});
