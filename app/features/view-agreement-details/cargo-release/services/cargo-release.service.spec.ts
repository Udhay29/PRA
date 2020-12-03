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
import { ViewAgreementDetailsModule } from '../../view-agreement-details.module';

import { CargoReleaseService } from './cargo-release.service';

describe('CargoReleaseService', () => {
    let service: CargoReleaseService;
    let http: HttpClient;

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
            providers: [CargoReleaseService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
        });
    });
    beforeEach(() => {
        service = TestBed.get(CargoReleaseService);
        http = TestBed.get(HttpClient);
    });
    it('should be created', inject([CargoReleaseService], () => {
        expect(service).toBeTruthy();
    }));

    it('it should call getCargoGridValues', () => {
        const data = {
            '_source': [],
            'size': 10000,
            'query': {
                'match': {
                    'agreementID': '182'
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
        service.getCargoGridValues(data);
    });
});
