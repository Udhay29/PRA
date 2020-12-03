import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';
import { ViewAgreementDetailsModule } from '../../../view-agreement-details.module';

import { ViewCargoService } from './view-cargo.service';

describe('ViewCargoService', () => {
    let service: ViewCargoService;
    let http: HttpClient;

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
            providers: [ViewCargoService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
        });
    });

    beforeEach(() => {
        service = TestBed.get(ViewCargoService);
        http = TestBed.get(HttpClient);
    });

    it('should be created', inject([ViewCargoService], () => {
        expect(service).toBeTruthy();
    }));

    it('it should call getViewScreenData', () => {
        service.getViewScreenData(12, [1, 2, 3], 'Agreement');
    });
});
