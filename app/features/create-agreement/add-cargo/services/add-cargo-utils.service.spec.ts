import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from '../../../../app.module';
import { CreateAgreementModule } from '../../create-agreement.module';

import { AddCargoUtilsService } from './add-cargo-utils.service';

describe('AddCargoUtilsService', () => {
    let service: AddCargoUtilsService;
    let http: HttpClient;
    let data;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule, CreateAgreementModule, HttpClientTestingModule],
            providers: [AddCargoUtilsService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
        });
    });

    beforeEach(() => {
        service = TestBed.get(AddCargoUtilsService);
        http = TestBed.get(HttpClient);
        data = [
            {
                'uniqueDocID': 'AB_339_101',
                'agreementDefaultIndicator': 'No',
                'customerAgreementID': 339,
                'customerAgreementCargoIDs': [
                    101
                ],
                'cargoReleaseAmount': 100000,
                'contractAssociation': null,
                'sectionAssociation': null,
                'financeBusinessUnitAssociations': [
                    {
                        'customerAgreementBusinessUnitCargoID': 101,
                        'financeBusinessUnitCode': 'DCS'
                    }
                ],
                'originalEffectiveDate': '1995-01-01',
                'originalExpirationDate': '2099-12-31',
                'effectiveDate': '01/01/1995',
                'expirationDate': '12/31/2099',
                'invalidIndicator': 'N',
                'invalidReasonTypeName': 'Active',
                'createProgramName': 'Swedha Ravi',
                'createTimestamp': '2019-06-11T09:26:25.806',
                'createUserId': 'jcnt253',
                'lastUpdateProgramName': 'Swedha Ravi',
                'lastUpdateTimestamp': '2019-06-11T09:26:25.806',
                'lastUpdateUserId': 'jcnt253',
                'cargoType': 'AgreementBU',
                'cargoAmount': '$100,000.00',
                'index': 1,
                'businessUnitCode': [
                    'DCS'
                ],
                'customerContractName': '--',
                'customerSectionName': '--'
            }
        ];
    });

    it('should be created', inject([AddCargoUtilsService], () => {
        expect(service).toBeTruthy();
    }));

    it('should call getESDocIDs', () => {
        service.getESDocIDs(data);
    });

    it('should call deletePayloadFramer AgreementBU', () => {
        service.deletePayloadFramer(data);
    });

    it('should call deletePayloadFramer contract', () => {
        data[0]['cargoType'] = 'contract';
        service.deletePayloadFramer(data);
    });

    it('should call deletePayloadFramer section', () => {
        data[0]['cargoType'] = 'section';
        service.deletePayloadFramer(data);
    });

});
