import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { SectionsFilterComponent } from './sections-filter.component';
import { SectionsFilterService } from './services/sections-filter.service';
import { SectionsFilterQuery } from './query/sections-filter.query';
import { SectionsService } from '../service/sections.service';
import { ViewAgreementDetailsModule } from '../../view-agreement-details.module';
import { AppModule } from './../../../../app.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';

describe('SectionsFilterComponent', () => {
  let component: SectionsFilterComponent;
  let fixture: ComponentFixture<SectionsFilterComponent>;
  let sectionFilterService: SectionsFilterService;
  const event = new Event('');
  const query = {

    'from': 0,
    'size': 2500,
    '_source': [
      '*',
      'SectionRanges.SectionName',
      'SectionRanges.SectionTypeName',
      'SectionRanges.SectionCurrencyCode',
      'SectionRanges.SectionEffectiveDate',
      'SectionRanges.SectionExpirationDate',
      'SectionRanges.BillToCodes',
      'AgreementID',
      'ContractRanges.ContractNumber',
      'SectionRanges.*',
      'SectionID',
      'ContractID',
      'ContractRanges.ContractName',
      'ContractRanges.ContractTypeName',
      'ContractRanges.contractDisplayName'
    ],
    'sort': [
      {
        'SectionRanges.SectionName.aux': {
          'order': 'asc',
          'nested': {
            'path': 'SectionRanges'
          },
          'mode': 'min'
        }
      },
      {
        'ContractRanges.contractDisplayName.key': {
          'order': 'asc',
          'nested': {
            'path': 'ContractRanges'
          },
          'mode': 'min'
        }
      }
    ],
    'query': {
      'bool': {
        'must': [
          {
            'query_string': { 'default_field': 'AgreementID.keyword', 'query': 48, 'default_operator': 'AND' }
          },
          {
            'bool': {
              'should': [
                {
                  'nested': {
                    'path': 'SectionRanges',
                    'query': {
                      'bool': {
                        'must': [
                          {
                            'bool': {
                              'should': [
                                {
                                  'bool': {
                                    'must': [
                                      {
                                        'query_string': {
                                          'default_field': 'SectionRanges.SectionInvalidReasonType.keyword',
                                          'query': 'Active'
                                        }
                                      },
                                      {
                                        'query_string': {
                                          'default_field': 'SectionRanges.SectionInvalidIndicator.keyword',
                                          'query': 'N'
                                        }
                                      },
                                      {
                                        'range': {
                                          [this.sectionExpirationDateData]: {
                                            'gte': 'now/d'
                                          }
                                        }
                                      }
                                    ]
                                  }
                                }
                              ]
                            }
                          },
                          {
                            'bool': {
                              'should': [
                                {
                                  'query_string': {
                                    'fields': [
                                      this.sectionNameData,
                                      this.sectionTypeNameData,
                                      'SectionRanges.SectionCurrencyCode',
                                      'SectionRanges.contractDisplayName',
                                      'SectionRanges.BillToCodes.billingPartyDisplayName',
                                      'SectionRanges.CreateProgram',
                                      'SectionRanges.LastUpdateProgram',
                                      'SectionRanges.CreateUser',
                                      'SectionRanges.LastUpdateUser',
                                      'SectionRanges.originalEffectiveDate.keyword',
                                      'SectionRanges.originalExpirationDate.keyword',
                                      'SectionRanges.LastUpdateTimestamp.keyword',
                                      'SectionRanges.CreateTimestamp.keyword'
                                    ],
                                    'query': '*', 'default_operator': 'AND'
                                  }
                                }
                              ]
                            }
                          },
                          {
                            'bool': {
                              'must': [
                              ]
                            }
                          }
                        ]
                      }
                    },
                    'inner_hits': { 'sort': {} }
                  }
                }
              ]
            }
          }
        ]
      }
    },
    'script_fields': {
      'Status': {
        'script': {
          'lang': 'painless',
          'source': `def x = [];def now=new Date();
          def sf = new SimpleDateFormat('yyyy-MM-dd');\n\n
          def equateNow=sf.format(now);for(def i = 0;\n\n
            i < params['_source']['SectionRanges'].length; i++)\n
            {def expire=params['_source']['SectionRanges'][i]['SectionExpirationDate'];\n\n
            if((sf.parse(expire).after(now)\n\n  | expire == equateNow)\n\n
             && params['_source']['SectionRanges'][i]['SectionInvalidIndicator']\n\n
              == 'N' && params['_source']['SectionRanges'][i]['SectionInvalidReasonType']\n\n
               == 'Active'){x.add('Active')}else if((sf.parse(expire).before(now)\n\n
                && params['_source']['SectionRanges'][i]['SectionInvalidIndicator'] == 'Y'\n\n
                  && params['_source']['SectionRanges'][i]\n\n
                   ['SectionInvalidReasonType'] == 'InActive')\n\n
                    || (sf.parse(expire).before(now) && params['_source']['SectionRanges'][i]\n\n
                  ['SectionInvalidIndicator'] == 'N'\n\n
                   && params['_source']['SectionRanges'][i]\n\n
                     ['SectionInvalidReasonType'] == 'InActive')\n\n
                      || (sf.parse(expire).before(now) &&\n\n
                      params['_source']['SectionRanges'][i]['SectionInvalidIndicator']\n\n
                        == 'N' && params['_source']['SectionRanges'][i]['SectionInvalidReasonType'] == 'Active'))\n\n
                     {x.add('Inactive')}else if(params['_source']['SectionRanges'][i]\n\n
                     ['SectionInvalidIndicator'] == 'Y' &&\n\n
                      params['_source']['SectionRanges'][i]['SectionInvalidReasonType'] == 'Deleted'){x.add('Deleted')}}return x\n`
        }
      }
    }
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, SectionsService, SectionsFilterService, SectionsFilterQuery]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionsFilterComponent);
    sectionFilterService = TestBed.get(SectionsFilterService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call onUpdateTime-else', () => {
    SectionsService.setElasticparam(query);
    component.filterModel.updatedOnDate = '';
    component.filterModel.updatedOnTime = '';
    component.onUpdateTime();
  });
  it('should call onUpdateDate-time', () => {
    component.filterModel.updatedOnDate = '05-08-2019';
    component.filterModel.updatedOnTime = '03:14:07.999999';
    component.onUpdateDate();
  });
  it('should call onUpdateDate', () => {
    component.filterModel.updatedOnDate = '05-08-2019';
    component.filterModel.updatedOnTime = '';
    component.onUpdateDate();
  });
  it('should call onUpdateDate-else', () => {
    component.filterModel.updatedOnDate = '';
    component.filterModel.updatedOnTime = '';
    component.onUpdateDate();
  });
  it('should call onClearDateValues', () => {
    SectionsService.setElasticparam(query);
    component.onClearDateValues('keyName1', 'keyName2', 'field');
  });
  it('should call onCreateDate', () => {
    SectionsService.setElasticparam(query);
    component.onCreateDate();
  });
  it('should call onCreateDate if', () => {
    SectionsService.setElasticparam(query);
    component.filterModel.createdOnDate = 'Wed Jul 24 2019 00:00:00 GMT+0530 (India Standard Time)';
    component.filterModel.createdOnTime = 'Wed Jul 24 2019 04:30:00 GMT+0530 (India Standard Time)';
    component.onCreateDate();
  });
  it('should call onCreateTime', () => {
    SectionsService.setElasticparam(query);
    component.onCreateTime();
  });
  it('should call onCreateTime if', () => {
    SectionsService.setElasticparam(query);
    component.filterModel.createdOnDate = 'Wed Jul 24 2019 00:00:00 GMT+0530 (India Standard Time)';
    component.filterModel.createdOnTime = 'Wed Jul 24 2019 04:30:00 GMT+0530 (India Standard Time)';
    component.onCreateTime();
  });
  it('should call onStatusSelected', () => {
    component.filterModel.agreementID = 157;
    component.filterConfig = sectionFilterService.getFilterConfig(component);
    SectionsService.setElasticparam(query);
    const statusValues = [{
      'label': 'Active',
      'value': 'Active'
    }];
    component.onStatusSelected(statusValues);
  });
  it('should call statusFramer', () => {
    const statusData = ['Active', 'Inactive', 'Deleted'];
    component.statusFramer(statusData);
  });
  it('should call onListingItemsSelected', () => {
    SectionsService.setElasticparam(query);
    const selectedValues = [{
      'label': 'pb1',
      'value': 'pb1'
    }];
    component.onListingItemsSelected(selectedValues, 'CreateUser');
  });
  it('should call onClearAllFilters', () => {
    SectionsService.setElasticparam(query);
    component.filterComponents = [{
      filterConfig: {
        title: 'createdBy'
      },
      onReset: function () {}
    }];
    component.onClearAllFilters();
  });
});
