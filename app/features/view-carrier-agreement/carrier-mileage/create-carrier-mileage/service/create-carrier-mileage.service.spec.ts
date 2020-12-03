import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';
import { HttpClient, HttpResponseBase } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { componentNeedsResolution } from '@angular/core/src/metadata/resource_loading';
import { CreateCarrierMileageService } from './create-carrier-mileage.service';
import { AppModule } from '../../../../../app.module';
import { CreateCarrierMileageComponent } from '../create-carrier-mileage.component';
import { ViewCarrierAgreementModule } from '../../../view-carrier-agreement.module';
import { SettingsModule } from '../../../../settings/settings.module';

describe('CreateCarrierMileageService', () => {
    let service: CreateCarrierMileageService;
    let http: HttpClient;
    let component: CreateCarrierMileageComponent;
    let fixture: ComponentFixture<CreateCarrierMileageComponent>;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule, ViewCarrierAgreementModule, HttpClientTestingModule, SettingsModule],
            providers: [CreateCarrierMileageService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient]
        });
    });

    beforeEach(() => {
        service = TestBed.get(CreateCarrierMileageService);
        http = TestBed.get(HttpClient);
        fixture = TestBed.createComponent(CreateCarrierMileageComponent);
        component = fixture.componentInstance;
    });

    it('should be created', inject([CreateCarrierMileageService], () => {
        expect(service).toBeTruthy();
    }));
    it('getMileageDomainAttributes should call get', () => {
        service.getMileageDomainAttributes();
    });
    it('fetchAgreementDetailsBycarrierAgreementId should call get', () => {
        service.fetchAgreementDetailsBycarrierAgreementId(123456);
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
        const params = '/mileagePreferencecarrierAgreementAssociations/search/existsByAgreementID?agreementID=';
        service.getAgreementDefault(123456);
    });
    it('getUnitOfLengthMeasurement should call get', () => {
        service.getUnitOfLengthMeasurement('123456');
    });
});
