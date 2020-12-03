import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import {
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../app.module';
import { SettingsModule } from '../../settings.module';
import { LinehaulPriorityComponent } from './linehaul-priority.component';
import { CanDeactivateGuardService } from '../../../../shared/jbh-app-services/can-deactivate-guard.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

describe('LinehaulPriorityComponent', () => {
  let component: LinehaulPriorityComponent;
  let fixture: ComponentFixture<LinehaulPriorityComponent>;
  let canDeactivateGuardService: CanDeactivateGuardService;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;
  let nextState: RouterStateSnapshot;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, CanDeactivateGuardService,
      { provide: RouterStateSnapshot, useValue: LinehaulPriorityComponent },
      { provide: ActivatedRouteSnapshot, useValue: LinehaulPriorityComponent }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinehaulPriorityComponent);
    component = fixture.componentInstance;
    canDeactivateGuardService = TestBed.get(CanDeactivateGuardService);
    route = TestBed.get(ActivatedRouteSnapshot);
    state = TestBed.get(RouterStateSnapshot);
    nextState = TestBed.get(RouterStateSnapshot);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('it should call handleChange with valid if condition', () => {
    component.linehaulPrioritymodel.selectedIndex = 1;
    component.linehaulPrioritymodel.groupEditFlag = true;
    component.handleChange(1);
  });
  it('it should call handleChange with else condition', () => {
    component.linehaulPrioritymodel.selectedIndex = 0;
    component.linehaulPrioritymodel.groupEditFlag = false;
    component.handleChange(1);
  });
  it('it should call onClickYes', () => {
    component.onClickYes();
  });
  it('it should call onClickNo', () => {
    component.linehaulPrioritymodel.lastSelectedIndex = 1;
    component.onClickNo();
  });

  it('should call canDeactivate for if', () => {
    component.linehaulPrioritymodel.groupEditFlag = true;
    component.linehaulPrioritymodel.routingUrl = nextState.url;
    component.canDeactivate(canDeactivateGuardService, route, state, nextState);
    expect(component.canDeactivate).toBeTruthy();
  });
});
