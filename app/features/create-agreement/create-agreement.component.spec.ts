import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../app.module';
import { CreateAgreementModule } from './create-agreement.module';
import { CreateAgreementComponent } from './create-agreement.component';
import { BroadcasterService } from '../../shared/jbh-app-services/broadcaster.service';
import { CanDeactivateGuardService } from '../../shared/jbh-app-services/can-deactivate-guard.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

describe('CreateAgreementComponent', () => {
  let component: CreateAgreementComponent;
  let fixture: ComponentFixture<CreateAgreementComponent>;
  let shared: BroadcasterService;
  let canDeactivateGuardService: CanDeactivateGuardService;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;
  let nextState: RouterStateSnapshot;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, CreateAgreementModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, CanDeactivateGuardService,
      { provide: RouterStateSnapshot, useValue: CreateAgreementComponent },
      { provide: ActivatedRouteSnapshot, useValue: CreateAgreementComponent }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAgreementComponent);
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
  it('should call onIndexChange', () => {
    component.createAgreementModel.formChanged = true;
    component.createAgreementModel.stepsList[1]['visible'] = true;
    component.onIndexChange(1);
  });
  it('should call resetComponents', () => {
    component.resetComponents();
  });
  it('should call showComponents for case 0', () => {
    component.createAgreementModel.activeIndex = 0;
    component.showComponents();
  });
  it('should call showComponents for case 1', () => {
    component.createAgreementModel.activeIndex = 1;
    component.showComponents();
  });
  it('should call showComponents for case 2', () => {
    component.createAgreementModel.activeIndex = 2;
    component.showComponents();
  });
  it('should call showComponents for case 3', () => {
    component.createAgreementModel.activeIndex = 3;
    component.showComponents();
  });
  it('should call clickYes', () => {
    component.createAgreementModel.routingUrl = '/dashboard';
    component.clickYes();
  });
  it('should call clickNo', () => {
    component.clickNo();
  });
  it('should call onSave', () => {
    spyOn(shared, 'broadcast').and.returnValue(of(true));
    component.onSave();
  });
  it('should call onDontSave', () => {
    component.createAgreementModel.clickedIndex = null;
    spyOn(shared, 'broadcast').and.returnValue(of(false));
    component.onDontSave();
  });
  it('should call onDonotSave', () => {
    spyOn(shared, 'broadcast').and.returnValue(of(false));
    component.onDonotSave();
  });
  it('should call agreementNameSubscription else', () => {
    shared.broadcast('agreementType', '');
    component.agreementNameSubscription();
  });
  it('should call agreementTypeSubscription if', () => {
    shared.broadcast('agreementType', 'carrier');
    component.agreementTypeSubscription();
  });
  it('should call stepIndexSubscription for if condition', () => {
    component.createAgreementModel.activeIndex = 0;
    spyOn(shared, 'on').and.returnValue(of('next'));
    component.stepIndexSubscription();
  });
  it('should call stepIndexSubscription for else condition', () => {
    component.createAgreementModel.activeIndex = 1;
    component.createAgreementModel.stepsList[1]['visible'] = true;
    spyOn(shared, 'on').and.returnValue(of('back'));
    component.stepIndexSubscription();
  });

  it('should call indexChange for if condition', () => {
    component.createAgreementModel.activeIndex = 2;
    component.indexChange();
  });
  it('should call indexChange for else condition', () => {
    component.createAgreementModel.activeIndex = 1;
    component.indexChange();
  });

  it('should cal formCheck', () => {
    const event = true;
    component.formCheck(event);
  });

  it('should call canDeactivate for if', () => {
    component.createAgreementModel.clickedIndex = 0;
    component.createAgreementModel.isChangesSaving = true;
    component.createAgreementModel.routingUrl = nextState.url;
    shared.broadcast('saved', {
      key: true,
      message: null,
      type: null
    });
    shared.broadcast('navigationStarts', nextState);
    component.canDeactivate(canDeactivateGuardService, route, state, nextState);
    expect(component.canDeactivate).toBeTruthy();
  });

  it('should call canDeactivate for if', () => {
    component.createAgreementModel.clickedIndex = 1;
    component.createAgreementModel.isChangesSaving = false;
    component.createAgreementModel.routingUrl = nextState.url;
    shared.broadcast('saved', {
      key: true,
      message: null,
      type: null
    });
    shared.broadcast('navigationStarts', nextState);
    component.canDeactivate(canDeactivateGuardService, route, state, nextState);
    expect(component.canDeactivate).toBeTruthy();
  });
});

