import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../app.module';
import { ViewAgreementDetailsModule } from '../../view-agreement-details.module';

import { CreateMileageService } from './create-mileage.service';
import { HttpClient, HttpResponseBase } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreateMileageModel } from '../models/create-mileage.model';
import { CreateMileageComponent } from '../create-mileage.component';
import { componentNeedsResolution } from '@angular/core/src/metadata/resource_loading';

describe('CreateMileageService', () => {
    let service: CreateMileageService;
    let http: HttpClient;
    let component: CreateMileageComponent;
    let fixture: ComponentFixture<CreateMileageComponent>;

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
            providers: [CreateMileageService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient]
        });
    });

    beforeEach(() => {
        service = TestBed.get(CreateMileageService);
        http = TestBed.get(HttpClient);
        fixture = TestBed.createComponent(CreateMileageComponent);
        component = fixture.componentInstance;
    });

    it('should be created', inject([CreateMileageService], () => {
        expect(service).toBeTruthy();
    }));
    it('getMileageDomainAttributes should call get', () => {
        service.getMileageDomainAttributes();
    });
    it('fetchAgreementDetailsByCustomerAgreementId should call get', () => {
        service.fetchAgreementDetailsByCustomerAgreementId(123456);
    });
    it('getCarriers should call post', () => {
        const data = {
            'query': {
                'bool': {
                    'must': [
                        {
                            'match': {
                                'CarrierStatus': 'A'
                            }
                        },
                        {
                            'bool': {
                                'should': [
                                    {
                                        'query_string': {
                                            'fields': [
                                                'LegalName',
                                                'CarrierCode'
                                            ],
                                            'query': `*`
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            'from': 0,
            'size': 5,
            '_source': [
                'LegalName',
                'CarrierCode',
                'CarrierID'
            ]
        };
        service.getCarriers(data);
    });
    it('getMileageGeographyAttributes should call get', () => {
        service.getMileageGeographyAttributes('123456');
    });
    it('getBusinessUnit should call get', () => {
        service.getBusinessUnit();
    });
    it('postMileagePreference should call post', () => {
        service.postMileagePreference('asd', 'asd');
    });
    it('getAgreementDefault should call get', () => {
        const params = '/mileagePreferenceCustomerAgreementAssociations/search/existsByAgreementID?agreementID=';
        service.getAgreementDefault(123456);
    });
    it('getUnitOfLengthMeasurement should call get', () => {
        service.getUnitOfLengthMeasurement('123456');
    });
    it('getSectionsSearchResult should call get', () => {
        const response = {
            tenantID: 132458,
            ultimateParentAccountID: 12345,
            customerAgreementName: 'string',
            customerAgreementID: 12345,
            effectiveDate: 'string',
            expirationDate: 'string',
            customerAgreementOwnerships: [{ tenantID: 12345,
                taskAssignmentID: 12345,
                effectiveDate: 'string',
                expirationDate: 'string',
                lastUpdateTimestampString: 'string',
                _embedded: {},
                _links: {}
            }],
            lastUpdateTimestampString: 'string',
            _links: {}
          };
          component.createMileageModel.customerAgreement = response;
        service.getSectionsSearchResult(component.createMileageModel, '');
    });
    it('getContractsByAgreementId should call get', () => {
        const response = {
            tenantID: 132458,
            ultimateParentAccountID: 12345,
            customerAgreementName: 'string',
            customerAgreementID: 12345,
            effectiveDate: 'string',
            expirationDate: 'string',
            customerAgreementOwnerships: [{ tenantID: 12345,
                taskAssignmentID: 12345,
                effectiveDate: 'string',
                expirationDate: 'string',
                lastUpdateTimestampString: 'string',
                _embedded: {},
                _links: {}
            }],
            lastUpdateTimestampString: 'string',
            _links: {}
          };
          component.createMileageModel.customerAgreement = response;
        service.getContractsByAgreementId(component.createMileageModel);
    });
    it('getSectionsData should call get', () => {
        const response = {
            tenantID: 132458,
            ultimateParentAccountID: 12345,
            customerAgreementName: 'string',
            customerAgreementID: 12345,
            effectiveDate: 'string',
            expirationDate: 'string',
            customerAgreementOwnerships: [{ tenantID: 12345,
                taskAssignmentID: 12345,
                effectiveDate: 'string',
                expirationDate: 'string',
                lastUpdateTimestampString: 'string',
                _embedded: {},
                _links: {}
            }],
            lastUpdateTimestampString: 'string',
            _links: {}
          };
          component.createMileageModel.customerAgreement = response;
        service.getSectionsData(component.createMileageModel);
    });
});
