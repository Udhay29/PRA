import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';
import { CreateAgreementModule } from '../../../create-agreement.module';
import { CreateCargoService } from './create-cargo.service';

describe('CreateCargoService', () => {
    let service: CreateCargoService;
    let http: HttpClient;

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule, CreateAgreementModule, HttpClientTestingModule],
            providers: [{ provide: APP_BASE_HREF, useValue: '/' }, CreateCargoService, HttpClient],
        });
    });

    beforeEach(() => {
        service = TestBed.get(CreateCargoService);
        http = TestBed.get(HttpClient);
    });


    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should be getAgreementTime', () => {
        service.getAgreementTime(12);
    });

    it('should be getAgreementCargoDetails', () => {
        service.getAgreementCargoDetails(12, [1, 2], 'Agreement');
    });

    it('should be getSectionCargo', () => {
        service.getSectionCargo(12);
    });

    it('should be getContractCargo', () => {
        service.getContractCargo(12);
    });

    it('should be getBusinessUnit', () => {
        service.getBusinessUnit();
    });

    it('should be saveCargo', () => {
        const data = {
            'cargoReleaseType': 'AgreementBU',
            'customerAgreementBusinessUnitCargoList': [
                {
                    'customerAgreementID': 182,
                    'customerAgreementBusinessUnitCargoID': null,
                    'action': null,
                    'financeBusinessUnitCode': 'ICS',
                    'agreementBusinessUnitCargoAmount': 100000,
                    'agreementBuEffectiveDate': '1995-01-01',
                    'agreementBuExpirationDate': '2099-12-31',
                    'agreementDefaultCargoAmount': 100000,
                    'isCreateFlow': true
                }
            ]
        };
        service.saveCargo('182/cargoreleases?cargoReleaseType=AgreementBU', data);
    });

    it('should be updateCargo', () => {
        const data = {
            'cargoReleaseType': 'AgreementBU',
            'customerAgreementBusinessUnitCargoList': [
                {
                    'financeBusinessUnitCargoID': 59,
                    'financeBusinessUnitCode': 'ICS',
                    'customerAgreementID': 182,
                    'agreementDefaultCargoAmount': 100000,
                    'customerAgreementBusinessUnitCargoID': 59,
                    'existingESDocID': 'AB_182_59',
                    'agreementBusinessUnitCargoAmount': 100000,
                    'agreementBuEffectiveDate': '1995-01-01',
                    'agreementBuExpirationDate': '2099-12-31'
                },
                {
                    'customerAgreementID': 182,
                    'customerAgreementBusinessUnitCargoID': null,
                    'action': null,
                    'financeBusinessUnitCode': 'JBT',
                    'existingESDocID': 'AB_182_59',
                    'isCreateFlow': false,
                    'agreementBusinessUnitCargoAmount': 100000,
                    'agreementBuEffectiveDate': '1995-01-01',
                    'agreementBuExpirationDate': '2099-12-31',
                    'agreementDefaultCargoAmount': 100000
                }
            ]
        };
        service.updateCargo('182/cargoreleases', data);
    });

    it('should call deleteGridData', () => {
        const data = {
            'existingESDocIDs': [
                'AB_182_58'
            ],
            'cargoReleaseTypeDTOList': [
                {
                    'cargoReleaseType': 'AgreementBU',
                    'cargoId': 58
                }
            ]
        };
        service.deleteGridData(data, 182);
    });
});
