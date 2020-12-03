import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { ViewAgreementDetailsModule } from '../../../view-agreement-details.module';
import { ContractFilterUtility } from './contracts-filter.utility';
import { AppModule } from '../../../../../app.module';
import { configureTestSuite } from 'ng-bullet';

describe('ContractFilterUtility', () => {
    const rootObjectMock = {
        took: 123456,
        timed_out: true,
        _shards: {
            total: 123456,
            successful: 123456,
            skipped: 123456,
            failed: 123456
        },
        hits: {
            total: 123456,
            max_score: 123456,
            hits: [{
                _index: '01',
                _type: '01',
                _id: '01',
                _score: 12345,
                _source: {
                    AgreementID: 12345,
                    ContractID: 12345,
                    ContractRanges: [
                        {
                            ContractComment: '01',
                            ContractNumber: '01',
                            LastUpdateProgram: '01',
                            CreateUser: '01',
                            ContractExpirationDate: '01',
                            ContractInvalidReasonType: '01',
                            ContractVersionID: 123456,
                            ContractInvalidIndicator: '01',
                            LastUpdateTimestamp: '01',
                            ContractName: '01',
                            LastUpdateUser: '01',
                            ContractEffectiveDate: '01',
                            ContractTypeName: '01',
                            CreateProgram: '01',
                            CreateTimestamp: '01'
                        }
                    ]
                },
                fields: {
                    Status: '01',
                    ContractRanges: ['01', '02']
                },
                sort: ['01', '02']
            }]
        },
        aggregations: {
            nesting: {
                doc_count: 123456,
                count: {
                    value: 123456
                }
            }
        }
    };
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule],
            providers: [ContractFilterUtility, { provide: APP_BASE_HREF, useValue: '/' }],
        });
    });

    it('should be created', () => {
        expect(ContractFilterUtility).toBeTruthy();
    });
    it('should call contractDataFramer', () => {
        ContractFilterUtility.contractDataFramer(rootObjectMock);
    });
    it('should call contractTypeDataFramer', () => {
        const data = {
            _embedded: {
                contractTypes: [{
                    contractTypeName: 'jbh001',
                    contractTypeID: 123456,
                    _links: {
                        self: 'jbh001',
                        contractType: {
                            href: 'jbh001',
                            templated: true
                        }
                    }
                }]
            },
            _links: {
                self: 'jbh001',
                contractType: {
                    href: 'jbh001',
                    templated: true
                }
            }
        };
        ContractFilterUtility.contractTypeDataFramer(data);
    });
    it('should call contractIdDataFramer', () => {
        ContractFilterUtility.contractIdDataFramer(rootObjectMock);
    });
    it('should call contractIdDataFramer', () => {
        ContractFilterUtility.contractIdDataFramer(rootObjectMock);
    });
    it('should call createdProgramFramer', () => {
        ContractFilterUtility.createdProgramFramer(rootObjectMock);
    });
    it('should call lastUpdateProgramFramer', () => {
        ContractFilterUtility.lastUpdateProgramFramer(rootObjectMock);
    });
    it('should call LastUpdateUserFramer', () => {
        ContractFilterUtility.LastUpdateUserFramer(rootObjectMock);
    });
    it('should call createdUserFramer', () => {
        ContractFilterUtility.createdUserFramer(rootObjectMock);
    });
    it('should call createProgramFramer', () => {
        ContractFilterUtility.createProgramFramer(rootObjectMock);
    });
    it('should call LastUpdateFramer', () => {
        ContractFilterUtility.LastUpdateFramer(rootObjectMock);
    });
});
