import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';

import { HttpClient } from '@angular/common/http';
import { AppModule } from '../../../../../app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';
import { CargoFilterUtility } from './cargo-filter.utility';
import { RootObject } from '../../cargo-release-filter/model/cargo-filter.interface';

describe('FilterUtilityService', () => {
    let service: CargoFilterUtility;
    let http: HttpClient;
    configureTestSuite(() => TestBed.configureTestingModule({
        imports: [RouterTestingModule, AppModule, HttpClientTestingModule],
        providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    }));
    beforeEach(() => {
        service = TestBed.get(CargoFilterUtility);
        http = TestBed.get(HttpClient);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    const data = {
        '_embedded': {
            'serviceOfferingBusinessUnitTransitModeAssociations': [{
                'financeBusinessUnitServiceOfferingAssociation': {
                    'financeBusinessUnitServiceOfferingAssociationID': 1,
                    'financeBusinessUnitCode': 'JBT',
                    'serviceOfferingCode': 'OTR',
                    'effectiveTimestamp': '2016-01-01T00:00',
                    'expirationTimestamp': '2199-12-31T23:59:59',
                    'lastUpdateTimestampString': '2017-11-20T08:24:31.8980803'
                }
            }
            ]
        }
    };
    it('should call businessUnitFramer', () => {
        const response = [
            {
                label: 'JBT',
                value: 'JBT'
            }
        ];
        expect(service.businessUnitFramer(data)).toEqual(response);
    });
    const sectionData = {
        'hits': {
            'total': 3,
            'max_score': null,
            'hits': [
                {
                    '_index': 'pricing-customer-ratingrule',
                    '_type': 'doc',
                    '_id': '427',
                    '_score': null,
                    '_source': {
                        'customerAgreementID': 1094,
                        'RatingRuleType': 'Section-BU',
                        'RatingRuleInvalidReasonType': 'Active',
                        'sectionAssociation': {
                            'customerAgreementContractSectionName': 'NELOB1_1',
                            'customerAgreementContractSectionID': '712'
                        },
                        'AgreementDefaultIndicator': 'No',
                        'RatingRuleInvalidIndicator': 'N'
                    }
                }
            ]
        }
    };
    it('should call sectionsFramer', () => {
        const response = [
            {
                label: 'NELOB1_1',
                value: '712'
            }
        ];
        expect(service.sectionFramer(sectionData)).toEqual(response);
    });
    const contractData = {
        'hits': {
            'total': 5,
            'max_score': null,
            'hits': [
                {
                    '_index': 'pricing-customer-ratingrule',
                    '_type': 'doc',
                    '_id': '380',
                    '_score': null,
                    '_source': {
                        'customerAgreementID': 1002,
                        'contractAssociation': {
                            'contractDisplayName': 'ACSAE4 - ACSAE4'
                        }
                    },
                    'sort': [
                        'ACSAE4 - ACSAE4'
                    ]
                }
            ]
        }
    };

    it('should call contractsFramer', () => {
        const response = [
            {
                label: 'ACSAE4 - ACSAE4',
                value: 'ACSAE4 - ACSAE4'
            }
        ];
        expect(service.contractDataFramer(contractData)).toEqual(response);
    });
    const lastUpdateProgram = {
        'took': 4,
        'timed_out': false,
        '_shards': {
            'total': 3,
            'successful': 3,
            'skipped': 0,
            'failed': 0
        },
        'hits': {
            'total': 1,
            'max_score': 7.6236224,
            'hits': [
                {
                    '_index': 'pricing-customer-cargo',
                    '_type': 'doc',
                    '_id': 'A_75_44',
                    '_score': 7.6236224,
                    '_source': {
                        'lastUpdateProgramName': 'process id'
                    },
                    'fields': {
                        'lastUpdateProgramName.keyword': [
                            'process id'
                        ]
                    }
                }
            ]
        }
    };
    const createdUser = {
        'took': 4,
        'timed_out': false,
        '_shards': {
            'total': 3,
            'successful': 3,
            'skipped': 0,
            'failed': 0
        },
        'hits': {
            'total': 1,
            'max_score': 7.6236224,
            'hits': [
                {
                    '_index': 'pricing-customer-cargo',
                    '_type': 'doc',
                    '_id': 'A_75_44',
                    '_score': 7.6236224,
                    '_source': {
                        'createUserId': 'jisals0'
                    },
                    'fields': {
                        'createUserId.keyword': [
                            'jisals0'
                        ]
                    }
                }
            ]
        }
    };
    const createProgram = {
        'took': 5,
        'timed_out': false,
        '_shards': {
            'total': 3,
            'successful': 3,
            'skipped': 0,
            'failed': 0
        },
        'hits': {
            'total': 1,
            'max_score': 7.6236224,
            'hits': [
                {
                    '_index': 'pricing-customer-cargo',
                    '_type': 'doc',
                    '_id': 'A_75_44',
                    '_score': 7.6236224,
                    '_source': {
                        'createProgramName': 'process id'
                    },
                    'fields': {
                        'createProgramName.keyword': [
                            'process id'
                        ]
                    }
                }
            ]
        }
    };
    const lastUpdateUser = {
        'took': 4,
        'timed_out': false,
        '_shards': {
            'total': 3,
            'successful': 3,
            'skipped': 0,
            'failed': 0
        },
        'hits': {
            'total': 1,
            'max_score': 7.6236224,
            'hits': [
                {
                    '_index': 'pricing-customer-cargo',
                    '_type': 'doc',
                    '_id': 'A_75_44',
                    '_score': 7.6236224,
                    '_source': {
                        'lastUpdateUserId': 'jisals0'
                    },
                    'fields': {
                        'lastUpdateUserId.keyword': [
                            'jisals0'
                        ]
                    }
                }
            ]
        }
    };
    it('should call lastUpdateProgramFramer', () => {
        service.lastUpdateProgramFramer(lastUpdateProgram);
    });
    it('should call createdProgramFramer', () => {
        service.createdProgramFramer(createProgram);
    });
    it('should call LastUpdateUserFramer', () => {
        service.LastUpdateUserFramer(lastUpdateUser);
    });
    it('should call createdUserFramer', () => {
        service.createdUserFramer(createdUser);
    });
});
