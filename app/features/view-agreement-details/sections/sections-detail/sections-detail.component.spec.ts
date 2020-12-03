import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SectionsDetailComponent } from './sections-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserService } from '../../../../shared/jbh-esa/user.service';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';
import { SectionsModel } from '../model/sections.model';
import { Section, SectionDetails } from '../model/sections.interface';
import {
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

describe('SectionsDetailComponent', () => {
    let component: SectionsDetailComponent;
    let fixture: ComponentFixture<SectionsDetailComponent>;
    let sectionViewDetail: SectionDetails;
    sectionViewDetail = {
        'customerAgreementContractSectionID': 94,
        'customerAgreementContractSectionVersionID': 93,
        'customerAgreementContractSectionName': 'section1',
        'customerAgreementContractSectionTypeID': 1,
        'customerAgreementContractSectionTypeName': 'Standard',
        'currencyCode': 'USD',
        'customerAgreementContractTypeID': 1,
        'customerAgreementContractTypeName': 'Legal',
        'customerContractNumber': '123',
        'customerContractName': 'legalcontract',
        'customerAgreementContractSectionAccountDTOs': [{
            'customerAgreementContractSectionAccountID': 91,
            'billingPartyID': 13122,
            'effectiveDate': '2019-01-22',
            'expirationDate': '2019-07-25',
            'billingPartyName': 'Auto-Chlor System',
            'billingPartyCode': 'AUAT12',
            'isRemoved': null
        }, {
            'customerAgreementContractSectionAccountID': 92,
            'billingPartyID': 807,
            'effectiveDate': '2019-01-22',
            'expirationDate': '2019-07-25',
            'billingPartyName': 'Auto Chlor System',
            'billingPartyCode': 'AUSAEN',
            'isRemoved': null
        }, {
            'customerAgreementContractSectionAccountID': null,
            'billingPartyID': 1184,
            'effectiveDate': null,
            'expirationDate': null,
            'billingPartyName': 'Auto Chlor System',
            'billingPartyCode': 'AUSAEO',
            'isRemoved': null
        }],
        'effectiveDate': '2019-01-22',
        'expirationDate': '2019-07-25',
        'status': null,
        'createUserID': 'rcon959',
        'lastUpdateUserID': 'rcon959',
        'lastUpdateProgramName': 'Archana Karthikeyan',
        'createProgramName': 'Archana Karthikeyan',
        'createTimestamp': '2019-01-07T07:39:48.761',
        'lastUpdateTimestamp': '2019-01-07T07:39:48.761',
        'originalEffectiveDate': '2019-01-22',
        'originalExpirationDate': '2019-07-25',
    };
    const viewScreenData = {
        BillingPartyCode: ['Tyler Pipe Company(TYTY24)?'],
        SectionCurrencyCode: 'USD',
        SectionEffectiveDate: '01/01/2019',
        SectionExpirationDate: '01/02/2019',
        SectionName: 'sect1',
        SectionTypeName: 'Standard',
        Status: 'Inactive',
        toolTipForBillTo: 'string',
    };
    class UserServiceStub {
        constructor() {

        }
        hasAccess() {
        }
    }

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            declarations: [SectionsDetailComponent],
            imports: [SplitButtonModule, HttpClientModule,
              RouterTestingModule, BrowserAnimationsModule, HttpClientTestingModule],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            providers: [{ provide: UserService, useClass: UserServiceStub }, BroadcasterService]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SectionsDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create and check for section detail infor', () => {
        expect(component).toBeTruthy();
        component.viewScreenData = viewScreenData;
        component.constructViewDetail(sectionViewDetail);
    });
});
