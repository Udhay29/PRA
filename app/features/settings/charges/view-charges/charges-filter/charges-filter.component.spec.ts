import {
    ComponentFixture,
    TestBed
  } from '@angular/core/testing';
  import {
    NO_ERRORS_SCHEMA
  } from '@angular/core';
  import {
    ChangeDetectorRef
  } from '@angular/core';
  import {
    ChargesFilterService
  } from './service/charge-filter.service';
  import {
    ViewChargesQueryService
  } from '../services/view-charges-query.service';
  import {
    ViewChargesQuery
  } from '../query/view-charges.query';
  import {
    ChargesFilterComponent
  } from './charges-filter.component';
  import {
    of
  } from 'rxjs';
  import {
    configureTestSuite
  } from 'ng-bullet';

  describe('ChargesFilterComponent', () => {
    let component: ChargesFilterComponent;
    let fixture: ComponentFixture < ChargesFilterComponent > ;

    configureTestSuite(() => {
      const changeDetectorRefStub = {};
      const chargesFilterServiceStub = {
        getFilterConfig: (arg1, arg2) => ({})
      };
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        declarations: [ChargesFilterComponent],
        providers: [{
            provide: ChangeDetectorRef,
            useValue: changeDetectorRefStub
          },
          {
            provide: ChargesFilterService,
            ViewChargesQueryService,
            useValue: chargesFilterServiceStub
          }
        ]
      });
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(ChargesFilterComponent);
      component = fixture.componentInstance;
    });
    it('should create', () => {
      expect(component).toBeTruthy();
    });
    describe('ngOnInit', () => {
      it('should call onBUItemsSelected', () => {
        ViewChargesQueryService.setElasticparam(
          ViewChargesQuery.getViewChargesQuery()
        );
        component.onBUItemsSelected(event, 'BusinessUnit');
      });
      it('should call onApplicationLevelSelected', () => {
        ViewChargesQueryService.setElasticparam(
          ViewChargesQuery.getViewChargesQuery()
        );
        component.onApplicationLevelSelected(event, 'ApplicationLevel');
      });
      it('should call onUsageSelected', () => {
        ViewChargesQueryService.setElasticparam(
          ViewChargesQuery.getViewChargesQuery()
        );
        component.onUsageSelected(event, 'Usage');
      });
      it('should call onListingItemsSelected', () => {
        ViewChargesQueryService.setElasticparam(
          ViewChargesQuery.getViewChargesQuery()
        );
        component.onListingItemsSelected(event, 'QuantityRequired');
      });
      it('should call onServiceOfferingItemsSelected', () => {
        ViewChargesQueryService.setElasticparam(
          ViewChargesQuery.getViewChargesQuery()
        );
        component.onServiceOfferingItemsSelected(event, 'BusinessUnitServiceOfferingName');
      });

      it('should call ChargesFilterService', () => {
        const chargesFilterServiceStub: ChargesFilterService = fixture.debugElement.injector.get(
          ChargesFilterService
        );
        spyOn(chargesFilterServiceStub, 'getFilterConfig').and.callThrough();
        component.ngOnInit();
        expect(chargesFilterServiceStub.getFilterConfig).toHaveBeenCalled();
      });
      it('should call Effective Radio Toggle', () => {
        ViewChargesQueryService.setElasticparam(
          ViewChargesQuery.getViewChargesQuery()
        );
        component.effDateRadioToggle(true, 'effDateOnlyFlag', 'date');
        expect(component.filterModel.effDateOnlyFlag).toBeTruthy();
      });

      it('should call Expiration Date Radio Toggle', () => {
        ViewChargesQueryService.setElasticparam(
          ViewChargesQuery.getViewChargesQuery()
        );
        component.expDateRadioToggle(true, 'expDateOnlyFlag', 'date');
        expect(component.filterModel.expDateOnlyFlag).toBeTruthy();
      });
      it('should call Expiry Date Range Select', () => {
        ViewChargesQueryService.setElasticparam(
          ViewChargesQuery.getViewChargesQuery()
        );
        component.onExpDateRangeSelect();
      });
      it('should call Expiry Date Range Select', () => {
        ViewChargesQueryService.setElasticparam(
          ViewChargesQuery.getViewChargesQuery()
        );
        component.matchExactDate(true, 'effDateExactMatch');
        component.matchExactDate(false, 'effDateExactMatch');
      });
      it('should call Expiry Date Range Select', () => {
        ViewChargesQueryService.setElasticparam(
          ViewChargesQuery.getViewChargesQuery()
        );
        component.matchExactDate(true, 'effDateExactMatch');
        component.matchExactDate(false, 'effDateExactMatch');
      });
      it('should call Set Effective Date Params', () => {
        ViewChargesQueryService.setElasticparam(
          ViewChargesQuery.getViewChargesQuery()
        );
        component.filterModel['effectiveDateValue'] = new Date('1/1/2018').toDateString();
        component.setEffectiveDateParams('effectiveNonMatch');
        component.setEffectiveDateParams('effectiveExactMatch');
        component.filterModel['effectiveStartDate'] = new Date('1/4/2018').toDateString();
        component.filterModel['effectiveEndDate'] = new Date('4/4/2019').toDateString();
        component.setEffectiveDateParams('effectiveDateRange');
      });
      it('should call Expiry Date Range Parms NonMatch', () => {
        ViewChargesQueryService.setElasticparam(
          ViewChargesQuery.getViewChargesQuery()
        );
        component.filterModel['expirationDateValue'] = new Date('1/4/2019').toDateString();
        component.setExpirationDateParams('expirationNonMatch');
      });
      it('should call Expiry Date Range Parms Exact Match', () => {
        ViewChargesQueryService.setElasticparam(
          ViewChargesQuery.getViewChargesQuery()
        );
        component.filterModel['expirationDateValue'] = new Date('1/4/2018').toDateString();
        component.setExpirationDateParams('expirationExactMatch');
      });
      it('should call Expiry Date Range Parms ', () => {
        ViewChargesQueryService.setElasticparam(
          ViewChargesQuery.getViewChargesQuery()
        );
        component.filterModel['expirationStartDate'] = new Date('1/4/2018').toDateString();
        component.filterModel['expirationEndDate'] = new Date('4/4/2019').toDateString();
        component.setExpirationDateParams('expirationDateRange');
      });
      it('should call OnClear Filters ', () => {
        ViewChargesQueryService.setElasticparam(
          ViewChargesQuery.getViewChargesQuery()
        );
        component.filterComponents = [{
          filterConfig: {
            title: 'tractor'
          },
          onReset: function () {}
        }];
        component.onClearAllFilters();
      });
    });
    it('should call resetSTatus', () => {
      component.resetStatus();
    });
    it('should call resetEvent', () => {
      component.resetEvent(true);
    });
    it('should call getChargeCodesByStatus', () => {
      component.getChargeCodesByStatus(true, true);
    });
    it('should call statusFramer', () => {
      const data = {
        aggregations: {
          status: {
            buckets: [{
                key: 'active'
              },
              {
                key: 'active'
              }
            ]
          }
        }
      };
      component.statusFramer(data);
    });
    it('should call isStatusCollapsed if', () => {
      component.filterConfig.status = {
        title: 'tractor',
        data: 'jbh001',
        query: {},
        callback: 'jbh001',
        url: 'http://test',
        expanded: true
      };
      component.isStatusCollapsed('TRACTOR');
    });
    it('should call isStatusCollapsed else', () => {
      component.filterConfig.status = {
        title: 'tractor',
        data: 'jbh001',
        query: {},
        callback: 'jbh001',
        url: 'http://test',
        expanded: true
      };
      component.filterConfig.status.expanded = false;
      component.isStatusCollapsed(null);
    });
  });
