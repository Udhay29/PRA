import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from './../../../../app.module';
import { SettingsModule } from './../../settings.module';
import { ConfigurableService } from './configurable.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { ConfigurableComponent } from '../configurable.component';
import { ConfigurableModel } from '../model/configurable.model';
import { of, throwError } from 'rxjs';

describe('ConfigurableService', () => {

  let service: ConfigurableService;
  let http: HttpClient;
  let component: ConfigurableComponent;
  let fixture: ComponentFixture<ConfigurableComponent>;
  const configurableModel = new ConfigurableModel;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      providers: [ConfigurableService, HttpClient, { provide: APP_BASE_HREF, useValue: '/' }],
    });
  });

  beforeEach(() => {
    service = TestBed.get(ConfigurableService);
    http = TestBed.get(HttpClient);
    fixture = TestBed.createComponent(ConfigurableComponent);
    component = fixture.componentInstance;
      fixture.detectChanges();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should be call getData', () => {
    component.configurableModel = configurableModel;
    const response = [{
      configurationParameterDetailID: 1,
      tenantID: 1,
      configurationParameterID: 1,
      configurationParameterName: 'test',
      parameterSpecificationTypeID: 1,
      parameterSpecificationTypeName: 'test',
      configurationParameterValue: 1,
      configurationParameterDetail: 'test'
    }];
    spyOn(service, 'getBuConfDtoService').and.returnValues(of(response));
    service.getData(component);
  });
  it('should be call getData else', () => {
    component.configurableModel = configurableModel;
    spyOn(service, 'getBuConfDtoService').and.returnValues(throwError({stack: 'error'}));
    service.getData(component);
  });
});
