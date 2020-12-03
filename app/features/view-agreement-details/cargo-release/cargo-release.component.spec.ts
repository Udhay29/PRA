import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../app.module';
import { ViewAgreementDetailsModule } from '../view-agreement-details.module';

import { CargoReleaseComponent } from './cargo-release.component';
import { CargoReleaseService } from './services/cargo-release.service';
import { By } from '@angular/platform-browser';

describe('CargoReleaseComponent', () => {
    let component: CargoReleaseComponent;
    let fixture: ComponentFixture<CargoReleaseComponent>;
    let cargoReleaseService: CargoReleaseService;

    const sortClickEventObj: any = {
        'filters': {},
        'first': 0,
        'globalFilter': null,
        'multiSortMeta': undefined,
        'rows': 25,
        'sortField': 'cargoReleaseAmount',
        'sortOrder': 1
    };
    const gridQuery = {
        'size': 25, 'from': 0, '_source': '*', 'query': {
            'bool': {
                'must': [{
                    'query_string': {
                        'default_field': 'agreementID', 'query': 521
                    }
                }, {
                    'bool': {
                        'should': [{
                            'query_string': {
                                'fields':
                                    ['cargoReleaseAmount', 'agreementDefaultIndicator.keyword', 'invalidReasonTypeName'],
                                'query': '*', 'default_operator': 'AND'
                            }
                        }, {
                            'query_string': {
                                'default_field': 'sectionAssociation.sectionName', 'query': '*',
                                'default_operator': 'AND'
                            }
                        }, {
                            'query_string': {
                                'default_field': 'contractAssociation.contractDisplayName',
                                'query': '**', 'default_operator': 'AND'
                            }
                        }, {
                            'nested': {
                                'path': 'financeBusinessUnitAssociations', 'query': {
                                    'query_string': {
                                        'default_field': 'financeBusinessUnitAssociations.financeBusinessUnitCode', 'query': '*',
                                        'default_operator': 'AND'
                                    }
                                }
                            }
                        }, {
                            'query_string': {
                                'default_field': 'effectiveDate.text', 'query': '*',
                                'default_operator': 'AND'
                            }
                        }, {
                            'query_string': {
                                'default_field': 'expirationDate.text', 'query': '*',
                                'default_operator': 'AND'
                            }
                        }]
                    }
                }, {
                    'bool': {
                        'must': [{ 'query_string': { 'default_field': 'agreementDefaultIndicator.keyword', 'query': '*' } }, {
                            'range': {
                                'cargoReleaseAmount.integer': {
                                    'gte':
                                        100000, 'lte': 1000000
                                }
                            }
                        }, { 'query_string': { 'default_field': 'createProgram.keyword', 'query': '*' } }, {
                            'query_string': { 'default_field': 'createTimestamp.keyword', 'query': '*' }
                        }, {
                            'query_string': {
                                'default_field': 'createUser.keyword', 'query': '**'
                            }
                        }, { 'query_string': { 'default_field': 'invalidReasonTypeName.keyword', 'query': 'Active' } }, {
                            'query_string': { 'default_field': 'lastUpdateProgram.keyword', 'query': '**' }
                        }, {
                            'query_string': { 'default_field': 'lastUpdateTimestamp.keyword', 'query': '*' }
                        }, {
                            'query_string': { 'default_field': 'lastUpdateUser.keyword', 'query': '*' }
                        }, { 'query_string': { 'default_field': 'contractAssociation.contractDisplayName.keyword', 'query': '*' } }, {
                            'nested': {
                                'path': 'financeBusinessUnitAssociations', 'query': {
                                    'query_string': {
                                        'default_field':
                                            'financeBusinessUnitAssociations.financeBusinessUnitCode.keyword', 'query': '*'
                                    }
                                }
                            }
                        }, {
                            'query_string': {
                                'default_field': 'sectionAssociation.sectionName.keyword',
                                'query': '*'
                            }
                        }, { 'range': { 'effectiveDate': { 'gte': '1995-01-01' } } }, {
                            'range': {
                                'expirationDate': {
                                    'lte': '2099-12-31'
                                }
                            }
                        }, {
                            'range': {
                                'originalEffectiveDate': { 'gte': '1995-01-01' }
                            }
                        }, {
                            'range': {
                                'originalExpirationDate': { 'lte': '2099-12-31' }
                            }
                        }]
                    }
                }]
            }
        }, 'sort': [{ 'financeBusinessUnitAssociations.financeBusinessUnitCode.aux': { 'order': 'asc', 'missing': '_last' } }]
    };

    const newQuery = {
        'size': 25,
        'from': 0,
        '_source': '*',
        'script_fields': {
            'Status': {
                'script': {
                    'lang': 'painless',
                    'source': `def x = [];def sfn = new SimpleDateFormat('yyyy/ MM / dd');def today = new Date();def now =
                    sfn.parse(sfn.format(today));def sf = new SimpleDateFormat('yyyy - MM - dd');def expire = sf.parse(
                        params['_source']['expirationDate']);if ((expire.after(now) || expire.equals(now)) &&
                        params['_source']['invalidIndicator'] == 'N' && params['_source']['invalidReasonTypeName'] == 'Active')
                         {x.add('Active')} else if ((expire.before(now) && params['_source']['invalidIndicator'] == 'Y' &&
                         params['_source']['invalidReasonTypeName'] == 'InActive')|| (expire.before(now) && params['_source']
                         ['invalidIndicator'] == 'N' && params['_source']['invalidReasonTypeName'] == 'InActive') ||
                         (expire.before(now) && params['_source']['invalidIndicator'] == 'N' && params['_source']
                         ['invalidReasonTypeName'] == 'Active')) { x.add('Inactive') } else if (params['_source']
                         ['invalidIndicator'] == 'Y' && params['_source']['invalidReasonTypeName'] == 'Deleted')
                         { x.add('Deleted')} return x`
                }
            }
        },
        'query': {
            'bool': {
                'must': [
                    {
                        'query_string': {
                            'default_field': 'agreementID',
                            'query': 134
                        }
                    },
                    {
                        'bool': {
                            'should': [

                            ]
                        }
                    },
                    {
                        'bool': {
                            'must': [
                                {
                                    'query_string': {
                                        'default_field': 'agreementDefaultIndicator.keyword',
                                        'query': '*'
                                    }
                                },
                                {
                                    'range': {
                                        'cargoReleaseAmount.integer': {
                                            'gte': 100000,
                                            'lte': 1000000
                                        }
                                    }
                                },
                                {
                                    'query_string': {
                                        'default_field': 'createProgram.keyword',
                                        'query': '*'
                                    }
                                },
                                {
                                    'query_string': {
                                        'default_field': 'createTimestamp.keyword',
                                        'query': '*'
                                    }
                                },
                                {
                                    'query_string': {
                                        'default_field': 'createUser.keyword',
                                        'query': '**'
                                    }
                                },
                                {
                                    'bool': {
                                        'should': [
                                            {
                                                'script': {
                                                    'script': `def sfn = new SimpleDateFormat('yyyy/ MM / dd');def today =
                                                    new Date();def now = sfn.parse(sfn.format(today));def sf=new
                                                    SimpleDateFormat('yyyy - MM - dd');def expire=sf.parse(
                                                        doc['expirationDate.keyword'].value); ((expire.after(now) ||
                                                        expire.equals(now)) && doc['invalidReasonTypeName.keyword'].value ==
                                                        'active' && doc['invalidIndicator.keyword'].value == 'n')`
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    'query_string': {
                                        'default_field': 'lastUpdateProgram.keyword',
                                        'query': '**'
                                    }
                                },
                                {
                                    'query_string': {
                                        'default_field': 'lastUpdateTimestamp.keyword',
                                        'query': '*'
                                    }
                                },
                                {
                                    'query_string': {
                                        'default_field': 'lastUpdateUser.keyword',
                                        'query': '*'
                                    }
                                },
                                {
                                    'query_string': {
                                        'default_field': 'contractAssociation.contractDisplayName.keyword',
                                        'query': '*'
                                    }
                                },
                                {
                                    'nested': {
                                        'path': 'financeBusinessUnitAssociations',
                                        'query': {
                                            'query_string': {
                                                'default_field': 'financeBusinessUnitAssociations.financeBusinessUnitCode.keyword',
                                                'query': '*'
                                            }
                                        }
                                    }
                                },
                                {
                                    'query_string': {
                                        'default_field': 'sectionAssociation.sectionName.keyword',
                                        'query': '*'
                                    }
                                },
                                {
                                    'range': {
                                        'effectiveDate': {
                                            'gte': '1995-01-01'
                                        }
                                    }
                                },
                                {
                                    'range': {
                                        'expirationDate': {
                                            'lte': '2099-12-31'
                                        }
                                    }
                                },
                                {
                                    'range': {
                                        'originalEffectiveDate': {
                                            'gte': '1995-01-01'
                                        }
                                    }
                                },
                                {
                                    'range': {
                                        'originalExpirationDate': {
                                            'lte': '2099-12-31'
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        'sort': [
            {
                'cargoType.keyword': {
                    'order': 'asc'
                }
            }
        ]
    };
    const elQuerySource = {
        '_source': {
            'cargoType': 'Agreement',
            'customerAgreementCargoIDs': [337],
            'lastUpdateProgram': 'Process ID',
            'agreementDefaultIndicator': 'Yes',
            'uniqueDocID': 'A_521_337',
            'sectionAssociation': {
                'sectionName': null,
                'sectionID': null
            },
            'createTimestamp': '2019-05-10T15:58:37.314',
            'lastUpdateTimestamp': '2019-05-10T15:58:37.314',
            'originalEffectiveDate': '1995-01-01',
            'originalExpirationDate': '2099-12-31',
            'invalidIndicator': 'N',
            'invalidReasonTypeName': 'Active',
            'agreementID': 521,
            'cargoReleaseAmount': 100000,
            'contractAssociation': {
                'contractDisplayName': null,
                'contractType': null,
                'contractNumber': null,
                'contractName': null,
                'customerAgreementContractID': null
            },
            'lastUpdateUser': 'jcnt311',
            'createUser': 'jcnt311',
            'effectiveDate': '1995-01-01',
            'createProgram': 'Process ID',
            'financeBusinessUnitAssociations': [{
                'financeBusinessUnitCode': null,
                'financeBusinessUnitCargoID': null
            }],
            'expirationDate': '2099-12-31'
        }
    };


    const sourceData: any = {
        'sourceData': `def x = [];def sfn = new SimpleDateFormat('yyyy/MM/dd');def today = new Date();def now =
        sfn.parse(sfn.format(today));def sf = new SimpleDateFormat('yyyy-MM-dd');def expire =
        sf.parse(params['_source']['expirationDate']);if ((expire.after(now) || expire.equals(now)) &&
        params['_source']['invalidIndicator'] == 'N' && params['_source']['invalidReasonTypeName'] == 'Active') {
            x.add('Active')} else if ((expire.before(now) && params['_source']['invalidIndicator'] == 'Y' &&
            params['_source']['invalidReasonTypeName'] == 'InActive')|| (expire.before(now) && params['_source']
            ['invalidIndicator'] == 'N' && params['_source']['invalidReasonTypeName'] == 'InActive') || (expire.before(now)
             && params['_source']['invalidIndicator'] == 'N' && params['_source']['invalidReasonTypeName'] == 'Active')) {
                 x.add('Inactive') } else if (params['_source']['invalidIndicator'] == 'Y' && params['_source']
                 ['invalidReasonTypeName'] == 'Deleted') { x.add('Deleted')} return x`,
        'script': {
            'active': `def sfn = new SimpleDateFormat('yyyy/MM/dd');def today = new Date();def now =
            sfn.parse(sfn.format(today));def sf=new SimpleDateFormat('yyyy-MM-dd');def expire=sf.parse(
                doc['expirationDate.keyword'].value); ((expire.after(now) || expire.equals(now)) &&
                doc['invalidReasonTypeName.keyword'].value == 'active' && doc['invalidIndicator.keyword'].value == 'n')`,
            'inactive': `def sfn = new SimpleDateFormat('yyyy/MM/dd');def today = new Date();def now =
            sfn.parse(sfn.format(today));def sf=new SimpleDateFormat('yyyy-MM-dd');def expire=sf.parse(
                doc['expirationDate.keyword'].value); ((expire.before(now) && doc['invalidIndicator.keyword'].value ==
                'n' && doc['invalidReasonTypeName.keyword'].value == 'inactive') || (expire.before(now) &&
                doc['invalidIndicator.keyword'].value == 'n' && doc['invalidReasonTypeName.keyword'].value == 'inactive')
                || (expire.before(now) && doc['invalidIndicator.keyword'].value == 'n' &&
                doc['invalidReasonTypeName.keyword'].value == 'active'))`,
            'deleted': `(doc['invalidIndicator.keyword'].value == 'y') && (doc['invalidReasonTypeName.keyword'].value == 'deleted')`,
            'status': `def x = [];def sfn = new SimpleDateFormat('yyyy/MM/dd');def today = new Date();def now =
            sfn.parse(sfn.format(today));def sf = new SimpleDateFormat('yyyy-MM-dd');def expire=sf.parse(
                params['_source']['expirationDate']);if((expire.after(now) || expire.equals(now)) && params['_source']
                ['invalidIndicator'] == 'N' && params['_source']['invalidReasonTypeName'] == 'Active'){x.add('Active')}
                else if((expire.before(now) && params['_source']['invalidIndicator'] == 'Y' && params['_source']
                ['invalidReasonTypeName'] == 'InActive') || (expire.before(now) && params['_source']['invalidIndicator']
                == 'N' && params['_source']['invalidReasonTypeName'] == 'InActive') || (expire.before(now) &&
                params['_source']['invalidIndicator'] == 'N' && params['_source']['invalidReasonTypeName'] == 'Active'))
                {x.add('Inactive')}else if(params['_source']['invalidIndicator'] == 'Y' && params['_source']
                ['invalidReasonTypeName'] == 'Deleted'){x.add('Deleted')}return x`
        }
    };
    const sortColumns = {
        'cargoReleaseAmount': 'cargoReleaseAmount.integer',
        'agreementDefaultIndicator': 'agreementDefaultIndicator.keyword',
        'customerContractName': 'contractAssociation.contractDisplayName.aux',
        'businessUnitData': 'financeBusinessUnitAssociations.financeBusinessUnitCode.aux',
        'customerSectionName': 'sectionAssociation.sectionName.aux',
        'effectiveDate': 'effectiveDate',
        'expirationDate': 'expirationDate',
        'invalidReasonTypeName': 'invalidReasonTypeName.keyword'
    };
    const nestedColumns = {
        'businessUnitData': 'financeBusinessUnitAssociations'
    };
    const defQuery = {
        'size': 25, 'from': 0, '_source': '*', 'query': {
            'bool': {
                'must': [{
                    'query_string': {
                        'default_field': 'agreementID', 'query': 521
                    }
                }, {
                    'bool': {
                        'should': [{
                            'query_string': {
                                'fields':
                                    ['cargoReleaseAmount', 'agreementDefaultIndicator.keyword', 'invalidReasonTypeName'], 'query': '*ac*',
                                'default_operator': 'AND'
                            }
                        }, {
                            'query_string': {
                                'default_field': 'sectionAssociation.sectionName', 'query':
                                    '*ac*', 'default_operator': 'AND'
                            }
                        }, {
                            'query_string': {
                                'default_field':
                                    'contractAssociation.contractDisplayName', 'query': '*ac*', 'default_operator': 'AND'
                            }
                        }, {
                            'nested': {
                                'path': 'financeBusinessUnitAssociations', 'query': {
                                    'query_string': {
                                        'default_field': 'financeBusinessUnitAssociations.financeBusinessUnitCode', 'query':
                                            '*ac*', 'default_operator': 'AND'
                                    }
                                }
                            }
                        }]
                    }
                }, {
                    'bool': {
                        'must': [{
                            'query_string': {
                                'default_field': 'agreementDefaultIndicator.keyword',
                                'query': '*'
                            }
                        }, { 'range': { 'cargoReleaseAmount.integer': { 'gte': 100000, 'lte': 1000000 } } }, {
                            'query_string': { 'default_field': 'createProgram.keyword', 'query': '*' }
                        }, {
                            'query_string': {
                                'default_field': 'createTimestamp.keyword', 'query': '*'
                            }
                        }, {
                            'query_string': {
                                'default_field':
                                    'createUser.keyword', 'query': '**'
                            }
                        }, { 'query_string': { 'default_field': 'invalidReasonTypeName.keyword', 'query': 'Active' } }, {
                            'query_string': {
                                'default_field':
                                    'lastUpdateProgram.keyword', 'query': '**'
                            }
                        }, { 'query_string': { 'default_field': 'lastUpdateTimestamp.keyword', 'query': '*' } }, {
                            'query_string': { 'default_field': 'lastUpdateUser.keyword', 'query': '*' }
                        }, {
                            'query_string': { 'default_field': 'contractAssociation.contractDisplayName.keyword', 'query': '*' }
                        }, {
                            'nested': {
                                'path': 'financeBusinessUnitAssociations', 'query': {
                                    'query_string': {
                                        'default_field': 'financeBusinessUnitAssociations.financeBusinessUnitCode.keyword', 'query': '*'
                                    }
                                }
                            }
                        }, {
                            'query_string': {
                                'default_field':
                                    'sectionAssociation.sectionName.keyword', 'query': '*'
                            }
                        }, { 'range': { 'effectiveDate': { 'gte': '1995-01-01' } } }, {
                            'range': {
                                'expirationDate': {
                                    'lte': '2099-12-31'
                                }
                            }
                        }, { 'range': { 'originalEffectiveDate': { 'gte': '1995-01-01' } } }, {
                            'range': {
                                'originalExpirationDate': { 'lte': '2099-12-31' }
                            }
                        }]
                    }
                }]
            }
        }, 'sort': [{ 'cargoType.keyword': { 'order': 'asc' } }]
    };

    const listDetails = {
        'took': 18, 'timed_out': false, '_shards': {
            'total': 3, 'successful': 3, 'skipped': 0,
            'failed': 0
        }, 'hits': {
            'total': 6, 'max_score': null, 'hits': [{
                '_index': 'pricing-customer-cargo-1-2019.05.08',
                '_type': 'doc', '_id': 'CB_134_64', '_score': null, '_source': {
                    'cargoType': 'ContractBU', 'customerAgreementCargoIDs': [64],
                    'lastUpdateProgram': 'Process ID', 'agreementDefaultIndicator': 'No', 'uniqueDocID': 'CB_134_64',
                    'sectionAssociation': null, 'createTimestamp': '2019-05-30T13:15:52.129',
                    'lastUpdateTimestamp': '2019-05-30T13:15:52.129', 'originalEffectiveDate': '2019-01-01', 'originalExpirationDate':
                        '2099-12-31', 'invalidIndicator': 'N', 'invalidReasonTypeName': 'Active', 'agreementID': 134,
                    'cargoReleaseAmount': 200000,
                    'contractAssociation': {
                        'contractDisplayName': 'CONT0010-Primary Home Depot Account', 'contractType': 'Legal',
                        'contractNumber': 'CONT0010', 'contractName': 'Primary Home Depot Account', 'customerAgreementContractID': 263
                    },
                    'lastUpdateUser': 'JISAMC1', 'createUser': 'JISAMC1', 'effectiveDate': '2019-01-01', 'createProgram': 'Process ID',
                    'financeBusinessUnitAssociations': [{ 'financeBusinessUnitCode': 'JBI', 'financeBusinessUnitCargoID': 64 }],
                    'expirationDate': '2099-12-31'
                }, 'fields': { 'Status': ['Active'] }, 'sort': ['contractbu']
            }]
        }
    };
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
            declarations: [],
            providers: [{ provide: APP_BASE_HREF, useValue: '/' }, CargoReleaseService]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CargoReleaseComponent);
        component = fixture.componentInstance;
        cargoReleaseService = TestBed.get(CargoReleaseService);
        component.cargoReleaseModel.gridQuery = newQuery;
        component.cargoReleaseModel.sortColumns = sortColumns;
        component.cargoReleaseModel.nestedColumns = nestedColumns;
        component.cargoReleaseModel.sourceData = sourceData;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call ngOnInit', () => {
        component.ngOnInit();
    });

    it('should call getMockJson', () => {
        spyOn(cargoReleaseService, 'getMockJson').and.returnValue(of(sourceData));
        component.getMockJson();
    });

    it('should call ngOnDestroy', () => {
        component.ngOnDestroy();
    });

    it('it should call sortClick', () => {
        component.cargoReleaseModel.gridQuery = newQuery;
        const event = new Event('sortClicks');
        event['sortField'] = 'businessUnitData';
        event['sortOrder'] = 1;
        component.sortClick(event);
        fixture.detectChanges();
    });
    it('it should call sortClick-invalidReasonTypeName', () => {
        component.cargoReleaseModel.gridQuery = newQuery;
        const event = new Event('sortClicks');
        event['sortField'] = 'invalidReasonTypeName';
        event['sortOrder'] = 1;
        component.sortClick(event);
        fixture.detectChanges();
    });
    it('it should call sortClick-cargoReleaseAmount', () => {
        component.cargoReleaseModel.gridQuery = newQuery;
        const event = new Event('sortClicks');
        event['sortField'] = 'cargoReleaseAmount';
        event['sortOrder'] = 1;
        component.sortClick(event);
        fixture.detectChanges();
    });
    xit('it should call getNestedFieldSortQuery', () => {
        component.cargoReleaseModel.gridQuery = newQuery;

        const event = new Event('sortClicks');
        event['sortField'] = 'businessUnitData';
        event['sortOrder'] = 1;
        component.getNestedFieldSortQuery('financeBusinessUnitAssociations',
            'financeBusinessUnitAssociations.financeBusinessUnitCode.aux', event);
    });
    it('it should call frameSearchQuery-active', () => {
        component.frameSearchQuery(defQuery, 'active');
    });
    it('it should call frameSearchQuery', () => {
        component.frameSearchQuery(defQuery, 'jbt');
    });
    it('it should call frameDateSearchQuery', () => {
        const defQueryx = {
            'size': 25, 'from': 0, '_source': '*', 'query': {
                'bool': {
                    'must': [{
                        'query_string': {
                            'default_field': 'agreementID', 'query': 521
                        }
                    }, {
                        'bool': {
                            'should': [{
                                'query_string': {
                                    'fields': ['cargoReleaseAmount', 'agreementDefaultIndicator.keyword',
                                        'invalidReasonTypeName'], 'query': '*12\\\\\\/02\\\\\\/201*',
                                    'default_operator': 'AND'
                                }
                            }, {
                                'query_string': {
                                    'default_field': 'sectionAssociation.sectionName',
                                    'query': '*12\\\\\\/02\\\\\\/201*', 'default_operator': 'AND'
                                }
                            }, {
                                'query_string': {
                                    'default_field': 'contractAssociation.contractDisplayName', 'query':
                                        '*12\\\\\\/02\\\\\\/201*', 'default_operator': 'AND'
                                }
                            },
                            {
                                'nested': {
                                    'path': 'financeBusinessUnitAssociations', 'query': {
                                        'query_string': {
                                            'default_field':
                                                'financeBusinessUnitAssociations.financeBusinessUnitCode', 'query':
                                                '*12\\\\\\/02\\\\\\/201*', 'default_operator': 'AND'
                                        }
                                    }
                                }
                            }]
                        }
                    }, {
                        'bool': {
                            'must': [{
                                'query_string': {
                                    'default_field': 'agreementDefaultIndicator.keyword', 'query':
                                        '*'
                                }
                            }, { 'range': { 'cargoReleaseAmount.integer': { 'gte': 100000, 'lte': 1000000 } } }, {
                                'query_string': { 'default_field': 'createProgram.keyword', 'query': '*' }
                            }, { 'query_string': { 'default_field': 'createTimestamp.keyword', 'query': '*' } }, {
                                'query_string': { 'default_field': 'createUser.keyword', 'query': '**' }
                            }, { 'query_string': { 'default_field': 'invalidReasonTypeName.keyword', 'query': 'Active' } }, {
                                'query_string': { 'default_field': 'lastUpdateProgram.keyword', 'query': '**' }
                            }, { 'query_string': { 'default_field': 'lastUpdateTimestamp.keyword', 'query': '*' } }, {
                                'query_string': { 'default_field': 'lastUpdateUser.keyword', 'query': '*' }
                            }, {
                                'query_string': {
                                    'default_field': 'contractAssociation.contractDisplayName.keyword',
                                    'query': '*'
                                }
                            }, {
                                'nested': {
                                    'path': 'financeBusinessUnitAssociations', 'query': {
                                        'query_string': {
                                            'default_field':
                                                'financeBusinessUnitAssociations.financeBusinessUnitCode.keyword', 'query': '*'
                                        }
                                    }
                                }
                            }, {
                                'query_string': {
                                    'default_field': 'sectionAssociation.sectionName.keyword', 'query': '*'
                                }
                            }, { 'range': { 'effectiveDate': { 'gte': '1995-01-01' } } }, {
                                'range': {
                                    'expirationDate':
                                        { 'lte': '2099-12-31' }
                                }
                            }, { 'range': { 'originalEffectiveDate': { 'gte': '1995-01-01' } } }, {
                                'range': {
                                    'originalExpirationDate': { 'lte': '2099-12-31' }
                                }
                            }]
                        }
                    }]
                }
            }, 'sort': [{ 'cargoType.keyword': { 'order': 'asc' } }]
        };
        component.frameDateSearchQuery(defQueryx, '12/02/2019');
    });
    it('it should call getGridValues-searchBox', () => {
        sortClickEventObj['sortField'] = undefined;
        const obj = { 'srcElement': 'jb', 'currentTarget': 'jbh' };
        component.getGridValues(obj, 'searchBox');
        // component.getGridValues(null, 'initialFetch', sortClickEventObj);
    });
    it('it should call getGridValues-initialFetch', () => {
        sortClickEventObj['sortField'] = undefined;
        // component.getGridValues('test', 'searchBox');
        const obj = { 'srcElement': 'jb', 'currentTarget': 'jbh' };
        component.getGridValues(obj, 'initialFetch', sortClickEventObj);
    });
    it('it should call getGridValues-initialFetch', () => {
        sortClickEventObj['sortField'] = undefined;
        // component.getGridValues('test', 'searchBox');
        // const obj = { 'srcElement': 'jb', 'currentTarget': 'jbh' };
        component.getGridValues(null, 'initialFetch', sortClickEventObj);
    });
    // sortCargoColumns
    // SearchQueryFramer
    it('it should call loadGridData', () => {
        const response = {
            'took': 16, 'timed_out': false, '_shards': {
                'total': 3, 'successful': 3, 'skipped': 0,
                'failed': 0
            }, 'hits': {
                'total': 1, 'max_score': null, 'hits': [{
                    '_index': 'pricing-customer-cargo-1-2019.05.08', '_type': 'doc', '_id': 'A_521_337', '_score': null, '_source': {
                        'cargoType': 'Agreement', 'customerAgreementCargoIDs': [337],
                        'lastUpdateProgram': 'Process ID', 'agreementDefaultIndicator': 'Yes', 'uniqueDocID': 'A_521_337',
                        'sectionAssociation': null, 'createTimestamp': '2019-05-10T15:58:37.314',
                        'lastUpdateTimestamp': '2019-05-10T15:58:37.314', 'originalEffectiveDate': '1995-01-01',
                        'originalExpirationDate': '2099-12-31', 'invalidIndicator': 'N', 'invalidReasonTypeName': 'Active',
                        'agreementID': 521, 'cargoReleaseAmount':
                            100000, 'contractAssociation': null, 'lastUpdateUser': 'jcnt311', 'createUser': 'jcnt311',
                        'effectiveDate': '1995-01-01',
                        'createProgram': 'Process ID', 'financeBusinessUnitAssociations': null, 'expirationDate':
                            '2099-12-31'
                    }, 'sort': ['agreement']
                }]
            }
        };
        spyOn(cargoReleaseService, 'getCargoGridValues').and.returnValue(of(listDetails));
        component.loadGridData(sortClickEventObj);
        fixture.detectChanges();
    });

    it('it should call gridDataFramer', () => {
        component.gridDataFramer(elQuerySource['_source']);
    });

    xit('it should call contractFramer', () => {
        component.contractFramer(listDetails['_source']);
    });

    it('it should call contractFramer-else', () => {
        component.contractFramer(elQuerySource['_source']);
    });

    xit('it should call buFramer', () => {
        component.buFramer(listDetails['_source']);
    });
    it('it should call buFramer-empty', () => {
        component.buFramer(elQuerySource['_source']);
    });

    it('it should call sectionFramer', () => {
        elQuerySource['_source']['sectionAssociation']['sectionName'] = 'test123';
        component.sectionFramer(elQuerySource['_source']);
    });

    it('it should call sectionFramer-else', () => {
        component.sectionFramer(elQuerySource['_source']);
    });

    it('it should call dateFormatter', () => {
        expect(component.dateFormatter('2099-12-31')).toBe('12/31/2099');
    });
    it('it should call amountFormatter', () => {
        expect(component.amountFormatter('1234')).toBe('1234.00');
        // expect(component.amountFormatter('1234.56')).toBe('1234.56');
    });
    it('it should call amountFormatter-else', () => {
        // expect(component.amountFormatter('1234')).toBe('1234.00');
        expect(component.amountFormatter('1234.56')).toBe('1234.56');
    });
    it('it should call onFilterClick', () => {
        component.onFilterClick();
    });

    it('it should call onRowSelect', () => {
        const event: any = {
            'originalEvent': { 'isTrusted': true }, 'data': {
                'cargoType': 'Agreement', 'customerAgreementCargoIDs': [337], 'lastUpdateProgram': 'Process ID',
                'agreementDefaultIndicator': 'Yes', 'uniqueDocID': 'A_521_337',
                'sectionAssociation': null, 'createTimestamp': '2019-05-10T15:58:37.314',
                'lastUpdateTimestamp': '2019-05-10T15:58:37.314', 'originalEffectiveDate': '1995-01-01',
                'originalExpirationDate': '2099-12-31', 'invalidIndicator': 'N', 'invalidReasonTypeName': 'Active',
                'agreementID': 521, 'cargoReleaseAmount': '$100,000.00', 'contractAssociation': null, 'lastUpdateUser': 'jcnt311',
                'createUser': 'jcnt311', 'effectiveDate': '01/01/1995',
                'createProgram': 'Process ID', 'financeBusinessUnitAssociations': null, 'expirationDate': '12/31/2099',
                'customerSectionName': '--', 'customerContractName': '--', 'businessUnitData': ['--']
            }, 'type': 'row'
        };
        // const evtNeg = new CustomEvent('selectRow', event);
        const obj: any = new Event('row');
        // obj['type'] = 'row';
        obj['data'] = event['data'];
        component.cargoReleaseModel.filterEnabled = true;
        component.onRowSelect(obj);
    });

    it('it should call closeClick', () => {
        const event: any = { 'close': 'close' };
        const evtNeg = new CustomEvent('closeClick', event);
        component.closeClick(evtNeg);
    });

    it('it should call onEditClick', () => {
        component.onEditClick(true);
    });

    it('it should call closeSplitView', () => {
        component.closeSplitView();
    });

    it('it should call lazyLoadCargoDetails', () => {
        const event: any = { 'first': 0, 'rows': 25, 'sortOrder': 1, 'filters': {}, 'globalFilter': null };
        component.cargoReleaseModel.cargoList = [];
        component.cargoReleaseModel.searchValue = 'test';
        spyOn(component, 'getGridValues');
        fixture.detectChanges();
        const element = fixture.debugElement.query(By.css('.cargotable'));
        element.triggerEventHandler('onLazyLoad', event);
        fixture.detectChanges();
    });

    it('it should call loadGridBasedOnFilter', () => {
        /*const event: any = { 'defaultAmt': '123456' };
        const evtNeg = new CustomEvent('loadGridBasedOnFilter', event);
        component.loadGridBasedOnFilter(evtNeg);
        const elseEvent: any = { 'slideValue': '123456' };
        const elseEvtNeg = new CustomEvent('loadGridBasedOnFilter', elseEvent);
        component.loadGridBasedOnFilter(elseEvtNeg);*/
        const obj = { 'srcElement': 'jb', 'currentTarget': 'jbh' };
        component.loadGridBasedOnFilter(obj);
    });
    it('it should call clearFilters', () => {
        component.clearFilters();
    });
});
