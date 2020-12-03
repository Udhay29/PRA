import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../app.module';

import { SearchAgreementModule } from '../search-agreement.module';
import { SearchGridComponent } from './search-grid.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SearchGridComponent', () => {
  let component: SearchGridComponent;
  let fixture: ComponentFixture<SearchGridComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SearchAgreementModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should loadGridData', () => {
    const event = { rows: 10, first: 1, sortField: 'Agreement Name (Code)' };
    component.searchGridModel.gridData = [{ griddata: 'value' }];
    component.loadGridData(event);
  });
  it('should onRowSEelect', () => {
    const event = { data: { _source: { AgreementID: 'AgreementID' } } };
    component.onRowSelect(event);
  });
  it('should onSearchClicked', () => {
    component.onSearchClicked();
  });
  it('should sortGridData', () => {
    const event = { rows: 10, first: 1, sortField: 'Agreement Name (Code)' };
    const elasticQuery = {};
    component.sortGridData(elasticQuery, event);
  });

  it('should cal resetGridData', () => {
    component.resetGridData();
  });

  it('should cal loadCarrierrGrid', () => {
    const event = { rows: 10, first: 1, sortField: 'Agreement Name (Code)' };
    const elasticQuery = {};
    component.loadCarrierrGrid(elasticQuery, event);
  });

  it('should cal sortCarrierGridData Agreement Name (Code)', () => {
    const event = { rows: 10, first: 1, sortField: 'Agreement Name (Code)' };
    const elasticQuery = {};
    component.sortCarrierGridData(elasticQuery, event);
  });

  it('should cal sortCarrierGridData Agreement Type', () => {
    const event = { rows: 10, first: 1, sortField: 'Agreement Type' };
    const elasticQuery = {};
    component.sortCarrierGridData(elasticQuery, event);
  });

  it('should cal sortCarrierGridData Agreement Status', () => {
    const event = { rows: 10, first: 1, sortField: 'Agreement Status' };
    const elasticQuery = {};
    component.sortCarrierGridData(elasticQuery, event);
  });

  it('should cal viewCustomerAgreement', () => {
    const event = { data: { _source: { AgreementID: 'AgreementID' } } };
    component.viewCustomerAgreement(event);
  });

  it('should cal viewCarrierAgreement', () => {
    const event = { data: { _source: { AgreementID: 'AgreementID' } } };
    component.viewCarrierAgreement(event);
  });

});



