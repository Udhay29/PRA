import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrayGroupComponent } from './dray-group.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '../../../../app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';
import { SettingsModule } from '../../settings.module';
import { DrayGroupService } from './service/dray-group.service';
import { of } from 'rxjs';
import { CanDeactivateGuardService } from '../../../../shared/jbh-app-services/can-deactivate-guard.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DrayGroupUtilsService } from './service/dray-group-utils.service';
import { By } from '@angular/platform-browser';

describe('DrayGroupComponent', () => {
  let component: DrayGroupComponent;
  let fixture: ComponentFixture<DrayGroupComponent>;
  let drayGroupService: DrayGroupService;
  let canDeactivateGuardService: CanDeactivateGuardService;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;
  let nextState: RouterStateSnapshot;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, HttpClientTestingModule, SettingsModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, DrayGroupService, DrayGroupUtilsService, CanDeactivateGuardService,
      { provide: RouterStateSnapshot, useValue: DrayGroupComponent },
      { provide: ActivatedRouteSnapshot, useValue: DrayGroupComponent }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrayGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    drayGroupService = TestBed.get(DrayGroupService);
    canDeactivateGuardService = TestBed.get(CanDeactivateGuardService);
    route = TestBed.get(ActivatedRouteSnapshot);
    state = TestBed.get(RouterStateSnapshot);
    nextState = TestBed.get(RouterStateSnapshot);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    spyOn(component, 'getGridValues');
    component.ngOnInit();
    expect(component.getGridValues).toHaveBeenCalled();
  });

  it('should call onCreateDrayGroup', () => {
    component.onCreateDrayGroup();
  });

  it('should call showPopupEvent', () => {
    const event = false;
    component.showPopupEvent(event);
  });

  it('should call canDeactivate', () => {
     component.drayGroupModel.routingUrl = '/settings';
     component.canDeactivate(canDeactivateGuardService, route, state, nextState);
     expect(component.canDeactivate).toBeTruthy();
  });
  it('should call canDeactivate if', () => {
    component.drayGroupModel.formChanged = true;
    component.canDeactivate(canDeactivateGuardService, route, state, nextState);
    expect(component.canDeactivate).toBeTruthy();
  });
  it('should call canDeactivate else', () => {
    component.drayGroupModel.formChanged = false;
    component.canDeactivate(canDeactivateGuardService, route, state, nextState);
    expect(component.canDeactivate).toBeTruthy();
  });

  it('should call closeClick', () => {
    component.closeClick();
  });

  it('should call onClickPopupNo', () => {
    component.drayGroupModel.showPopup = true;
    component.onClickPopupNo();
  });

  it('should call ngOnDestroy', () => {
    component.ngOnDestroy();
  });

  it('should call getGridValues', () => {
    const response = {
      'took': 21,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 4,
        'max_score': null,
        'hits': [
          {
            '_index': 'pricing-draygroup',
            '_type': 'doc',
            '_id': '5',
            '_score': null,
            '_source': {
              'createProgramName': 'Eagle',
              'createTimestamp': '01/05/2017 09:00 CST',
              'createUserID': 'John Doe (JD1234)',
              'drayGroupCode': 'D123',
              'drayGroupName': 'StLouis66WB',
              'effectiveDate': '09/02/2019',
              'expirationDate': '12/31/2099',
              'invalidIndicator': 'N',
              'invalidReasonTypeID': '1',
              'invalidReasonTypeName': 'Active',
              'lastUpdateProgramName': 'Eagle',
              'lastUpdateTimestamp': '09/11/2018 14:00 CST',
              'lastUpdateUserID': 'John Doe (JD1234)',
              'rateScopeTypeName': 'Two-Way',
              'drayGroupCountries': [
                {
                  'drayGroupCountryCode': 'US',
                  'drayGroupCountryID': '112',
                  'drayGroupCountryName': 'USA'
                },
                {
                  'drayGroupCountryCode': 'MEX',
                  'drayGroupCountryID': '151',
                  'drayGroupCountryName': 'Mexico'
                },
                {
                  'drayGroupCountryCode': 'CND',
                  'drayGroupCountryID': '601',
                  'drayGroupCountryName': 'Canada'
                }
              ]
            },
            'sort': [
              'stlouis66wb',
              'd123',
              'two-way',
              1567382400000,
              4102358400000,
              'john doe (jd1234)',
              'eagle',
              1483628400000,
              'eagle',
              1536692400000,
              'john doe (jd1234)',
              'canada'
            ]
          }
        ]
      }
    };
    spyOn(drayGroupService, 'getDrayGroup').and.returnValues(of(response));
    const searchtext = 's';
    const from = 0;
    const size = 25;
    const field = 'drayGroupName';
    const order = 'asc';
    component.getGridValues(searchtext, from , size, field, order);
  });

  it('should call getGridValues else', () => {
    spyOn(drayGroupService, 'getDrayGroup').and.returnValues(of(null));
    const searchtext = 's';
    const from = 0;
    const size = 25;
    const field = 'drayGroupName';
    const order = 'asc';
    component.getGridValues(searchtext, from , size, field, order);
  });

  it('it should call onPage', () => {
    const event = {
      first: 0,
      rows: 25,
      sortField: undefined,
      sortOrder: 1
    };
    const element = fixture.debugElement.query(By.css('p-table'));
    element.triggerEventHandler('onPage', event);
    const searchtext = 's';
    const from = 0;
    const size = 25;
    const field = 'drayGroupName';
    const order = 'asc';
    component.getGridValues(searchtext, from , size, field, order);
  });

  it('it should call loadConfigValuesLazy', () => {
    const event = {
      first: 0,
      rows: 25,
      sortField: undefined,
      sortOrder: 1
    };
    const element = fixture.debugElement.query(By.css('p-table'));
    element.triggerEventHandler('onLazyLoad', event);
  });

  it('should call loadDrayGroupData', () => {
    const loadDrayGroupDataResponse = {
      'took': 21,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 4,
        'max_score': null,
        'hits': [
          {
            '_index': 'pricing-draygroup',
            '_type': 'doc',
            '_id': '5',
            '_score': null,
            '_source': {
              'createProgramName': 'Eagle',
              'createTimestamp': '01/05/2017 09:00 CST',
              'createUserID': 'John Doe (JD1234)',
              'drayGroupCode': 'D123',
              'drayGroupName': 'StLouis66WB',
              'effectiveDate': '09/02/2019',
              'expirationDate': '12/31/2099',
              'invalidIndicator': 'N',
              'invalidReasonTypeID': '1',
              'invalidReasonTypeName': 'Active',
              'lastUpdateProgramName': 'Eagle',
              'lastUpdateTimestamp': '09/11/2018 14:00 CST',
              'lastUpdateUserID': 'John Doe (JD1234)',
              'rateScopeTypeName': 'Two-Way',
              'drayGroupCountries': [
                {
                  'drayGroupCountryCode': 'US',
                  'drayGroupCountryID': '112',
                  'drayGroupCountryName': 'USA'
                },
                {
                  'drayGroupCountryCode': 'MEX',
                  'drayGroupCountryID': '151',
                  'drayGroupCountryName': 'Mexico'
                },
                {
                  'drayGroupCountryCode': 'CND',
                  'drayGroupCountryID': '601',
                  'drayGroupCountryName': 'Canada'
                }
              ]
            },
            'sort': [
              'stlouis66wb',
              'd123',
              'two-way',
              1567382400000,
              4102358400000,
              'john doe (jd1234)',
              'eagle',
              1483628400000,
              'eagle',
              1536692400000,
              'john doe (jd1234)',
              'canada'
            ]
          }
        ]
      }
    };
    spyOn(drayGroupService, 'getDrayGroup').and.returnValues(of(loadDrayGroupDataResponse));
    component.loadDrayGroupData({});
  });

  it('should call onSortSelect', () => {
    const searchtext = 's';
    const from = 0;
    const size = 25;
    const field = 'drayGroupName';
    const order = 'asc';
    component.getGridValues(searchtext, from , size, field, order);
    component.onSortSelect(field);
  });

  it('should call parseDrayGroupData', () => {
    const response = {
      '_index': 'pricing-draygroup',
      '_type': 'doc',
      '_id': '5',
      '_score': null,
      '_source': {
        'createProgramName': 'Eagle',
        'createTimestamp': '01/05/2017 09:00 CST',
        'createUserID': 'John Doe (JD1234)',
        'drayGroupCode': 'D123',
        'drayGroupName': 'StLouis66WB',
        'effectiveDate': '09/02/2019',
        'expirationDate': '12/31/2099',
        'invalidIndicator': 'N',
        'invalidReasonTypeID': '1',
        'invalidReasonTypeName': 'Active',
        'lastUpdateProgramName': 'Eagle',
        'lastUpdateTimestamp': '09/11/2018 14:00 CST',
        'lastUpdateUserID': 'John Doe (JD1234)',
        'rateScopeTypeName': 'Two-Way',
        'drayGroupCountries': [
          {
            'drayGroupCountryCode': 'US',
            'drayGroupCountryID': '112',
            'drayGroupCountryName': 'USA'
          },
          {
            'drayGroupCountryCode': 'MEX',
            'drayGroupCountryID': '151',
            'drayGroupCountryName': 'Mexico'
          },
          {
            'drayGroupCountryCode': 'CND',
            'drayGroupCountryID': '601',
            'drayGroupCountryName': 'Canada'
          }
        ]
      },
      'sort': [
        'stlouis66wb',
        'd123',
        'two-way',
        1567382400000,
        4102358400000,
        'john doe (jd1234)',
        'eagle',
        1483628400000,
        'eagle',
        1536692400000,
        'john doe (jd1234)',
        'canada'
      ]
    };
    component.parseDrayGroupData(response);
  });

  it('should call onCreateClose', () => {
    component.onCreateClose();
  });

  it('it should call onDrayGroupKeyPress', () => {
    component.onDrayGroupKeyPress();
  });

  it('it should call onClickSearchFocusPopupYes', () => {
    component.onClickSearchFocusPopupYes();
  });

  it('it should call onClickSearchPopupNo', () => {
    component.onClickSearchPopupNo();
  });

});
