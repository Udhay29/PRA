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
import { AddCargoService } from './add-cargo.service';

describe('AddCargoService', () => {
    let service: AddCargoService;
    let http: HttpClient;

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule, CreateAgreementModule, HttpClientTestingModule],
            providers: [AddCargoService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
        });
    });

    beforeEach(() => {
        service = TestBed.get(AddCargoService);
        http = TestBed.get(HttpClient);
    });

    it('should be created', inject([AddCargoService], () => {
        expect(service).toBeTruthy();
    }));

    it('should call createNewAgreement', () => {
        service.createNewAgreement(123);
    });

    it('should call getCargoGrid', () => {
        const data = {
            '_source': [],
            'size': 10000,
            'query': {
                'match': {
                    'customerAgreementID': '182'
                }
            },
            'sort': [
                {
                    'cargoType.keyword': {
                        'order': 'asc'
                    }
                },
                {
                    'effectiveDate': {
                        'order': 'asc'
                    }
                }
            ]
        };
        service.getCargoGrid(data);
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
