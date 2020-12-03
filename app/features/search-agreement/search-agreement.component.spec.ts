import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from './../../app.module';

import { SearchAgreementModule } from './search-agreement.module';
import { SearchAgreementComponent } from './search-agreement.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SearchAgreementComponent', () => {
  let component: SearchAgreementComponent;
  let fixture: ComponentFixture<SearchAgreementComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SearchAgreementModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should OnInit', () => {
    component.ngOnInit();
  });
  it('should searchCall', () => {
    const event = { query: 'query' };
    component.searchCall(event);
  });
  it('should onPageLoad', () => {
    const event = { query: 'query' };
    component.onPageLoad(event);
  });
  it('should asideToggle', () => {
    const event = { query: 'query' };
    component.asideToggle(event);
  });
  it('should resetCall', () => {
    const event = false;
    component.resetCall(event);
  });

  it('should call search-grid-utility.formatCarrierData for if', () => {
    component.agreementSearchModel.gridData = {
      carrierFlag: true,
      hits: {
        hits: [
          {
            _source: {
              agreementType: 'type',
              carrierAgreementName: 'name'
            },
            fields: { Status: [''] }
          }
        ],
        total: 123
      },
      errorMsg: ''
    };
    fixture.detectChanges();
  });

  it('should call search-grid-utility.formatAgreementData for if', () => {
    component.agreementSearchModel.gridData = {
      carrierFlag: false,
      hits: {
        hits: [
          {
            _source: {
              agreementType: 'type',
              carrierAgreementName: 'name',
              AgreementExpirationDate: new Date(),
              AgreementInvalidIndicator: 'Y'
            },
            fields: { Status: [''] }
          }
        ],
        total: 123
      },
      errorMsg: '',
      aggregations: {
        count: {
          value: 12
        }
      }
    };
    fixture.detectChanges();
  });

  it('should call search-grid-utility.formatCarrierData for else', () => {
    component.agreementSearchModel.gridData = {
      carrierFlag: true,
      hits: {
        hits: null,
        total: 123
      },
      errorMsg: ''
    };
    fixture.detectChanges();
  });

  it('should call search-grid-utility.isActive for else', () => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    component.agreementSearchModel.gridData = {
      carrierFlag: false,
      hits: {
        hits: [
          {
            _source: {
              agreementType: 'type',
              carrierAgreementName: 'name',
              AgreementExpirationDate: currentDate,
              AgreementInvalidIndicator: 'Y'
            },
            fields: { Status: [''] }
          }, undefined
        ],
        total: 123
      },
      errorMsg: '',
      aggregations: {
        count: {
          value: 12
        }
      }
    };
    fixture.detectChanges();
  });

});
