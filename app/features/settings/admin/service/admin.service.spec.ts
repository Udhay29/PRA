import { TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../app.module';
import { SettingsModule} from '../../settings.module';
import { AdminService } from './admin.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdminComponent } from '../admin.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('AdminService', () => {
  let services: AdminService;
  let http: HttpClient;
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  const formBuilder = new FormBuilder();
  let formGroup: FormGroup;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      providers: [AdminService, { provide: APP_BASE_HREF, useValue: '/' }],
    });
  });

  beforeEach(() => {
    services = TestBed.get(AdminService);
    http = TestBed.get(HttpClient);
    fixture = TestBed.createComponent(AdminComponent);
      component = fixture.componentInstance;
      formGroup = formBuilder.group({
        agreementType: ['test', Validators.required],
      contractType: ['test', Validators.required],
      adminSectionTypes: ['test', Validators.required],
      supportedLocTypes: ['test'],
      supportedRateTypes: ['test'],
      rateCycle: ['test'],
      awardStatus: ['test'],
      rateStatus: ['test'],
      mileageProgaram: ['test'],
      randMcNallyMileageVersion: ['test'],
      randMcNallyPreferenceGroup: ['test'],
      pcMilerMileageVersion: ['test'],
      pcMilerPreferenceGroup: ['test'],
      mileageType: ['test'],
      Calculation: ['test'],
      fuelPriceSources: ['test'],
      fuelRegions: ['test'],
      supportedTaxTypes: ['test'],
      freeTimeOperationalEvent: ['test'],
      accessorialRateType: ['test'],
      mileageCalculation: ['test']
      });
      fixture.detectChanges();
  });

  it('should be created', inject([AdminService], (service: AdminService) => {
    expect(service).toBeTruthy();
  }));
  it('getITConfDtoService should call get', () => {
    spyOn(http, 'get').and.returnValue('called get');
    services.getITConfDtoService();
    expect(http.get).toHaveBeenCalledTimes(1);
  });
  it('saveITConfDtoService should call get', () => {
    spyOn(http, 'put').and.returnValue('called get');
    services.saveITConfDtoService({});
    expect(http.put).toHaveBeenCalledTimes(1);
  });
  it('should call populateData', inject([AdminService], (service: AdminService) => {
    const errorResponse = {
      stack: 'string'
    };
   spyOn(service, 'saveITConfDtoService').and.returnValue(throwError(errorResponse));
  services.populateData(formGroup, component);
  }));
});
