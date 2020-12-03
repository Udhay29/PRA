import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../app.module';
import { SettingsModule } from './../settings.module';

import { BusinessComponent } from './business.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BusinessComponent', () => {
  let component: BusinessComponent;
  let fixture: ComponentFixture<BusinessComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call onClickRow for true condition', () => {
    component.onClickRow('Default Rating Rule');
  });
  it('should call onClickRow for false condition', () => {
    component.onClickRow('Documents, Default and Days');
  });
});
