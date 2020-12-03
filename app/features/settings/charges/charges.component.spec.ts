import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';

import { AppModule } from '../../../app.module';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { SettingsModule } from '../settings.module';
import { ChargesComponent } from './charges.component';
import { ConfirmationService } from 'primeng/api';
import { BroadcasterService } from '../../../shared/jbh-app-services/broadcaster.service';
import { ChargesModel } from './models/charges.model';
import { TabPanel } from 'primeng/tabview';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ValuesComponent } from './values/values.component';
import { ViewChargesComponent } from './view-charges/view-charges.component';
import { ViewChargesModel } from './view-charges/models/view-charges.model';
import { ValuesModel } from './values/models/values-model';
import { CanDeactivateGuardService } from '../../../shared/jbh-app-services/can-deactivate-guard.service';

describe('ChargesComponent', () => {
  let component: ChargesComponent;
  let fixture: ComponentFixture<ChargesComponent>;
  let viewchargecomponent: ViewChargesComponent;
  let viewchargefixture: ComponentFixture<ViewChargesComponent>;
  let valuecomponent: ValuesComponent;
  let valuefixture: ComponentFixture<ValuesComponent>;
  let broadcasterService: BroadcasterService;
  let confirmationService: ConfirmationService;
  let canDeactivateGuardService: CanDeactivateGuardService;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;
  let nextState: RouterStateSnapshot;
  const formBuilder = new FormBuilder();
  let formGroup: FormGroup;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, CanDeactivateGuardService,
      { provide: RouterStateSnapshot, useValue: ChargesComponent },
      { provide: ActivatedRouteSnapshot, useValue: ChargesComponent }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargesComponent);
    component = fixture.componentInstance;
    viewchargefixture = TestBed.createComponent(ViewChargesComponent);
    viewchargecomponent = viewchargefixture.componentInstance;
    valuefixture = TestBed.createComponent(ValuesComponent);
    valuecomponent = valuefixture.componentInstance;
    confirmationService = TestBed.get(ConfirmationService);
    broadcasterService = TestBed.get(BroadcasterService);
    canDeactivateGuardService = TestBed.get(CanDeactivateGuardService);
    route = TestBed.get(ActivatedRouteSnapshot);
    state = TestBed.get(RouterStateSnapshot);
    nextState = TestBed.get(RouterStateSnapshot);
    valuecomponent.valuesModel = new ValuesModel();
    valuecomponent.valuesModel.valuesSubscriberFlag = true;
    formGroup = formBuilder.group({
      chargeIdentifier: ['', Validators.required],
      chargeName: ['', Validators.required],
      chargeDescription: [''],
      chargeType: [''],
      businessUnit: [''],
      serviceOffering: [''],
      rateType: [''],
      applicationLevel: [''],
      usage: [''],
      effectiveDate: [''],
      expirationDate: [''],
    });
    viewchargecomponent.viewChargesModel.createChargesForm = formGroup;
    valuecomponent.valuesModel.valuesForm = formGroup;
    fixture.detectChanges();
    component.tabRef1 = viewchargecomponent;
    component.tabRef0 = valuecomponent;
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
  it('should call onPopupNo', () => {
    const value = {
      'key': true,
      'data': 'needToSaveValues'
    };
    expect(component.chargesModel.selectedIndex).toBe(0);
    spyOn(broadcasterService, 'broadcast');
    broadcasterService.broadcast('needToSaveValues', true);
    component.onPopupNo();
    expect(component.onPopupNo).toBeTruthy();
  });
  it('should call onPopupNo Else', () => {
    component.chargesModel.selectedIndex = 1;
    spyOn(broadcasterService, 'broadcast');
    broadcasterService.broadcast('needToSaveValues', true);
    component.onPopupNo();
  });
  it('should call onPopupYes for 0 ', () => {
    component.chargesModel.routingUrl = '';
    component.chargesModel.isChangesSaving = true;
    component.chargesModel.lastSelectedIndex = 0;
    const router: Router = fixture.debugElement.injector.get(
      Router
    );
    spyOn(router, 'navigate');
    spyOn(broadcasterService, 'broadcast');
    broadcasterService.broadcast('needToSaveValues', false);
    broadcasterService.broadcast('isValuesCancel', true);
    component.onPopupYes();
    expect(component.onPopupYes).toBeTruthy();
  });
  it('should call onPopupYes for otherthan 0', () => {
    component.chargesModel.selectedIndex = 1;
    component.chargesModel.isChangesSaving = true;
    component.chargesModel.routingUrl = '';
    const router: Router = fixture.debugElement.injector.get(
      Router
    );
    spyOn(router, 'navigate');
    spyOn(broadcasterService, 'broadcast');
    broadcasterService.broadcast('needToSaveCreateCharges', false);
    broadcasterService.broadcast('isValuesCancel', true);
    component.onPopupYes();
  });
  it('should call confirm for reject', () => {
    component.chargesModel.lastSelectedIndex = 0;
    spyOn(confirmationService, 'confirm').and.callFake((params: any) => {
      params.reject();
});
    component.confirm();
  });
  it('should call confirm for accept and 0', () => {
    component.chargesModel.lastSelectedIndex = 0;
    spyOn(confirmationService, 'confirm').and.callFake((params: any) => {
      params.accept();
});
    component.confirm();
  });
  it('should call confirm for accept and otherthan 0', () => {
    component.chargesModel.lastSelectedIndex = 1;
    spyOn(confirmationService, 'confirm').and.callFake((params: any) => {
      params.accept();
});
    component.confirm();
  });
  it('should call handleChange for 0', () => {
    component.chargesModel.selectedIndex = 0;
    component.chargesModel.lastEditedFormFlag = true;
    component.chargesModel.lastSelectedIndex = component.chargesModel.selectedIndex;
    component.handleChange(0, 'asda');
  });
  it('should call handleChange for otherthan 0', () => {
    component.chargesModel.selectedIndex = 1;
    component.chargesModel.lastEditedFormFlag = false;
    component.chargesModel.lastSelectedIndex = component.chargesModel.selectedIndex;
    viewchargecomponent.viewChargesModel.createChargesForm.markAsDirty();
    component.handleChange(1, 'asda');
  });
  it('should call canDeactivate for if', () => {
    component.chargesModel.lastSelectedIndex = 0;
    valuecomponent.valuesModel.valuesForm.markAsDirty();
    component.chargesModel.isChangesSaving = true;
    component.chargesModel.routingUrl = nextState.url;
    spyOn(broadcasterService, 'broadcast');
    broadcasterService.broadcast('navigationStarts', nextState);
    component.canDeactivate(canDeactivateGuardService, route, state, nextState);
    expect(component.canDeactivate).toBeTruthy();
  });
  it('should call canDeactivate for else', () => {
    component.chargesModel.lastSelectedIndex = 1;
    viewchargecomponent.viewChargesModel.createChargesForm.markAsDirty();
    component.chargesModel.isChangesSaving = false;
    component.chargesModel.routingUrl = nextState.url;
    spyOn(broadcasterService, 'broadcast');
    broadcasterService.broadcast('navigationStarts', nextState);
    component.canDeactivate(canDeactivateGuardService, route, state, nextState);
    expect(component.canDeactivate).toBeTruthy();
  });

});
