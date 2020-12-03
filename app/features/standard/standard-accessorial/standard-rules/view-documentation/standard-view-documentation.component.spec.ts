import { StandardModule } from './../../../standard.module';
import { CreateRuleStandardUtilsService } from './../create-rules/service/standard-create-rule-utils';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { DebugElement } from '@angular/core';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';

import { StandardViewDocumentationComponent } from './standard-view-documentation.component';
import { OptionalUtilityService } from '../shared/services/optional-utility.service';
import { RatesOptionalAttributesComponent
} from '../../standard-rate/create-standard-rate/rates-optional-attributes/rates-optional-attributes.component';


describe('StandardViewDocumentationComponent', () => {
    let component: StandardViewDocumentationComponent;
    let fixture: ComponentFixture<StandardViewDocumentationComponent>;
    let optionalUtilityService: OptionalUtilityService;
    let debugElement: DebugElement;
    let ratesOptionalAttributesComponent: RatesOptionalAttributesComponent;
    const attachments1 =  [
        {
            'documentName': 'InactivateRates_Json.txt',
            'documentNumber': '{233B8CA6-F39E-41FC-8299-EC4B44419628}',
            'createTimestamp': '2019-07-22T11:43:47.011+0000',
            'createUserID': 'jisassi',
            'accessorialAttachmentTypeName': 'Special Instructions'
        },
        {
            'documentName': 'InactivateRates_Pesucode.txt',
            'documentNumber': '{7C416DF1-AAB4-47A2-8200-48F63F415C2B}',
            'createTimestamp': '2019-07-22T11:43:47.050+0000',
            'createUserID': 'jisassi',
            'accessorialAttachmentTypeName': 'Signed Accessorials'
        }
    ];
    const attachments2 = [
        {
            'documentName': 'InstructSpecial Instructions.txt',
            'documentNumber': '{233B8CA6-F39E-41FC-8299-EC4B44419628}',
            'createTimestamp': '2019-07-22T11:53:01.548+0000',
            'createUserID': 'jisassi',
            'accessorialAttachmentTypeName': 'Special Instructions'
        },
        {
            'documentName': 'Instructional_Signed.txt',
            'documentNumber': '{7C416DF1-AAB4-47A2-8200-48F63F415C2B}',
            'createTimestamp': '2019-07-22T11:53:01.600+0000',
            'createUserID': 'jisassi',
            'accessorialAttachmentTypeName': 'Signed Accessorials'
        }
    ];
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
            declarations: [],
            providers: [{ provide: APP_BASE_HREF, useValue: '/' }, OptionalUtilityService]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StandardViewDocumentationComponent);
        ratesOptionalAttributesComponent = TestBed.createComponent(RatesOptionalAttributesComponent).componentInstance;
        debugElement = fixture.debugElement;
        component = fixture.componentInstance;
        optionalUtilityService = debugElement.injector.get(OptionalUtilityService);
        component.optionalFields = ratesOptionalAttributesComponent;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should call onRefresh', () => {
        const data = {
            'refreshed': true,
            'validForm': true
        };
        spyOn(CreateRuleStandardUtilsService, 'onRefreshRatePostFramer').and.returnValue(data);
        spyOn(optionalUtilityService, 'getDocumentationValid').and.returnValue(data);
        component.onRefresh();
    });
    it('should call noDocFoundPopupNo', () => {
        component.noDocFoundPopupNo();
    });
    it('should call removeDocument legal', () => {
        component.removeDocument('legal');
    });
    it('should call removeDocument legal', () => {
        component.removeDocument('instructional');
    });
    it('should call legalOrInstructionalDocumentation1', () => {
        const data = [{
            'accessorialDocumentTypeName': 'NOLegal',
            'text': 'yes',
            'attachments': [
                {
                    'documentName': 'InactivateRates_Json.txt',
                    'documentNumber': '{233B8CA6-F39E-41FC-8299-EC4B44419628}',
                    'createTimestamp': '2019-07-22T11:43:47.011+0000',
                    'createUserID': 'jisassi',
                    'accessorialAttachmentTypeName': 'Special Instructions'
                },
                {
                    'documentName': 'InactivateRates_Pesucode.txt',
                    'documentNumber': '{7C416DF1-AAB4-47A2-8200-48F63F415C2B}',
                    'createTimestamp': '2019-07-22T11:43:47.050+0000',
                    'createUserID': 'jisassi',
                    'accessorialAttachmentTypeName': 'Signed Accessorials'
                }
            ]
        }];
        component.legalOrInstructionalDocumentation(data);
    });
    it('should call legalOrInstructionalDocumentation', () => {
        const data = [{
            'accessorialDocumentTypeName': 'Legal',
            'text': 'yes',
            'effectiveDate': '22/01/1996',
            'expirationDate': '23/01/1997'
        }];
        component.legalOrInstructionalDocumentation(data);
    });
    it('should call legalInstructionalDocumentationss', () => {
        const data = [{
            'accessorialDocumentTypeName': 'Legal',
            'text': 'yes', 'effectiveDate': '22/01/1996',
            'expirationDate': '23/01/1997',
            'attachments': attachments1
        }, {
            'accessorialDocumentTypeName': 'Instructional',
            'text': 'yes',
            'effectiveDate': '22/01/1996',
            'expirationDate': '23/01/1997',
            'attachments': attachments2
        }];
        component.legalInstructionalDocumentation(data);
    });
    it('should call legalInstructionalDocumentation', () => {
        const data = [{
            'accessorialDocumentTypeName': 's',
            'text': 'yes'
        }, {
            'accessorialDocumentTypeName': 's',
            'text': 'yes'
        }];
        component.legalInstructionalDocumentation(data);
    });
    it('should call noDocFoundPopupNo', () => {
        component.noDocFoundPopupNo();
    });
});
