import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JbhFiltersModule } from '../jbh-filters.module';
import { AppModule } from '../../../app.module';
import { ListingFilterComponent } from './listing-filter.component';
import { configureTestSuite } from 'ng-bullet';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('ListingFilterComponent', () => {
  let component: ListingFilterComponent;
  let fixture: ComponentFixture<ListingFilterComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, JbhFiltersModule, AppModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.config = {
      expanded: true,
      data: ['jbh001', 'jbh002'],
      url: 'http://test',
      query: 'jbh001',
      callback: () => ({})
    };
    component.itemList = [{
      label: 'jbh001',
      value: 'jbh001'
    }, {
      label: 'jbh002',
      value: 'jbh002'
    }, {
      label: 'jbh003',
      value: 'jbh003'
    }];
    component.selectedValues = [{
      label: 'jbh001',
      value: 'jbh001'
    }, {
      label: 'jbh002',
      value: 'jbh002'
    }, {
      label: 'jbh003',
      value: 'jbh003'
    }];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set config', () => {
    component.config = {
      expanded: true,
      data: ['jbh001', 'jbh002'],
      url: 'http://test',
      query: 'jbh001'
    };
  });
  it('should set selectedList', () => {
    component.selectedList = [{
      label: 'jbh001',
      value: 'jbh001'
    },
    {
      label: 'jbh002',
      value: 'jbh002'
    }];
  });
  it('should call ngOnInit', () => {
    component.ngOnInit();
  });
  it('should call ngOnDestroy', () => {
    component.ngOnDestroy();
  });
  it('should call loadFilterData else loop', () => {
    component.config = {
      expanded: true,
      data: [],
      url: 'http://test',
      query: 'jbh001'
    };
    component.loadFilterData();
  });
  it('should call closePanel', () => {
    component.closePanel();
  });
  it('should call onSearch', () => {
    component.onSearch('jbh001');
  });
  it('should call setFilteredItemList if loop', () => {
    component.setFilteredItemList('jbh001');
  });
  it('should call setFilteredItemList else loop', () => {
    component.setFilteredItemList('dcs001');
  });
  it('should call getDataFromService if loop', () => {
    spyOn(HttpClient.prototype, 'post').and.returnValues(of('jbh001'));
    component.getDataFromService();
  });
  it('should call getDataFromService else loop', () => {
    spyOn(HttpClient.prototype, 'get').and.returnValues(of('jbh001'));
    component.config = {
      expanded: true,
      data: ['jbh001', 'jbh002'],
      url: 'http://test',
      query: null
    };
    component.getDataFromService();
  });
  it('should call onReset', () => {
    component.onReset();
  });
});
