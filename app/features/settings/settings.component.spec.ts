import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../app.module';
import { SettingsModule } from './settings.module';
import { SettingsComponent } from './settings.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BroadcasterService } from '../../shared/jbh-app-services/broadcaster.service';
import { CanDeactivateGuardService } from '../../shared/jbh-app-services/can-deactivate-guard.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';


describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let shared: BroadcasterService;
  let canDeactivateGuardService: CanDeactivateGuardService;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;
  let nextState: RouterStateSnapshot;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, CanDeactivateGuardService,
      { provide: RouterStateSnapshot, useValue: SettingsComponent },
      { provide: ActivatedRouteSnapshot, useValue: SettingsComponent }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    shared = TestBed.get(BroadcasterService);
    canDeactivateGuardService = TestBed.get(CanDeactivateGuardService);
    route = TestBed.get(ActivatedRouteSnapshot);
    state = TestBed.get(RouterStateSnapshot);
    nextState = TestBed.get(RouterStateSnapshot);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call onSave', () => {
    component.onSave();
  });
  it('should call onDontSave', () => {
    component.settingsModel.routingUrl = '/dashboard';
    component.onDontSave();
  });
  it('should call checkChargesTab', () => {
    spyOn(shared, 'on').and.returnValue(of(true));
    component.checkChargesTab();
  });
  it('should call handleChange', () => {
    component.settingsModel.selectedIndex = 0;
    component.tabRef0.settingForm.markAsDirty();
    component.handleChange(1, '');
  });
  it('should call confirm', () => {
    component.confirm();
  });

  it('should call canDeactivate for if', () => {
    component.settingsModel.selectedIndex = 0;
    component.settingsModel.isChangesSaving = true;
    component.settingsModel.routingUrl = nextState.url;
    spyOn(shared, 'broadcast');
    shared.broadcast('navigationStarts', nextState);
    component.canDeactivate(canDeactivateGuardService, route, state, nextState);
    expect(component.canDeactivate).toBeTruthy();
  });

  it('should call canDeactivate for else', () => {
    component.settingsModel.selectedIndex = 0;
    component.settingsModel.isChangesSaving = false;
    component.settingsModel.routingUrl = nextState.url;
    spyOn(shared, 'broadcast');
    shared.broadcast('navigationStarts', nextState);
    component.canDeactivate(canDeactivateGuardService, route, state, nextState);
    expect(component.canDeactivate).toBeTruthy();
  });
});
