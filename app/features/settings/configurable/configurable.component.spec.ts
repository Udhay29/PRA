import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppModule } from '../../../app.module';
import { SettingsModule } from './../settings.module';
import { ConfigurableComponent } from './configurable.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GeneralComponent } from './general/general.component';
import { SettingsModel } from '../models/settings.model';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfigurableModel } from './model/configurable.model';
import { ConfigurableService } from './service/configurable.service';
import { BroadcasterService } from '../../../shared/jbh-app-services/broadcaster.service';
import { of } from 'rxjs';

describe('ConfigurableComponent', () => {
  let component: ConfigurableComponent;
  let fixture: ComponentFixture<ConfigurableComponent>;
  let generalComponent: GeneralComponent;
  let generalFixture: ComponentFixture<GeneralComponent>;
  const formBuilder = new FormBuilder();
  let formGroup: FormGroup;
  let messageService: MessageService;
  const settingsModel = new SettingsModel(messageService);
  const configurableModel = new ConfigurableModel;
  let configurableService: ConfigurableService;
  let shared: BroadcasterService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      declarations: [],
      providers: [MessageService, BroadcasterService, ConfigurableService, { provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurableComponent);
    component = fixture.componentInstance;
    generalFixture = TestBed.createComponent(GeneralComponent);
    generalComponent = generalFixture.componentInstance;
    component.generalCmpRef = generalComponent;
    messageService = TestBed.get(MessageService);
    configurableService = TestBed.get(ConfigurableService);
    shared = TestBed.get(BroadcasterService);
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
    component.generalCmpRef.settingForm = formGroup;
    component.settingsModel = settingsModel;
    component.generalCmpRef.configurableModel = configurableModel;
    component.configDataList = [{
      configurationParameterDetailDTOs: {
        configurationParameterValue: 'test',
        configurationParameterDetailName: 'cargo_release_max'
      }
    }];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onChanges', () => {
    component.settingsModel.isChangesSaving = true;
    component.settingForm = formGroup;
    component.settingForm.markAsDirty();
    component.generalCmpRef.settingForm.controls['agreementType'].markAsDirty();
    component.generalCmpRef.configurableModel.cargoReleaseFieldInvalid = false;
    component.onChanges();
  });

  it('should call navigationSubscription', () => {
    component.settingForm = formGroup;
    spyOn(shared, 'on').and.returnValues(of({url: '/'}));
    component.navigationSubscription();
  });
  it('should call saveSubscription', () => {
    component.settingForm = formGroup;
    spyOn(shared, 'on').and.returnValues(of(true));
    component.saveSubscription();
  });
  it('should call saveSubscription', () => {
    component.settingForm = formGroup;
    component.configurableModel.routeUrl = '/';
    spyOn(shared, 'on').and.returnValues(of(false));
    component.saveSubscription();
  });

  it('should call submitForm', () => {
    spyOn(configurableService, 'saveBuConfDtoService').and.callThrough();
    component.submitForm();
  });

  it('should call dataFormater', () => {
    component.settingForm = formGroup;
    component.settingForm.markAsDirty();
    component.generalCmpRef.settingForm.controls['agreementType'].markAsDirty();
    component.configurableModel.outPutdataHandler = {agreementType: 'cargo_release_max'};
    spyOn(configurableService, 'saveBuConfDtoService').and.callThrough();
    component.dataFormater(formGroup);
    component.submitForm();
  });
  it('should call createRequestList', () => {
    component.generalCmpRef = generalComponent;
    component.generalCmpRef.settingForm = formGroup;
    component.settingForm = formGroup;
    component.createRequestList(component.configDataList[0], component.configDataList, 'check');
  });

  it('should call removeDrity', () => {
    component.removeDrity(formGroup);
  });


});
