import { FormArray, Validators, FormBuilder } from '@angular/forms';
import { DocumentationDate } from './model/create-documentation.interface';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';
import { MessageService } from 'primeng/components/common/messageservice';

import { AppModule } from '../../../../../app.module';
import { ViewAgreementDetailsModule } from '../../../view-agreement-details.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreateDocumentationComponent } from './create-documentation.component';
import { CreateDocumentationService } from './service/create-documentation.service';
import { of } from 'rxjs';
import { CreateDocumentationUtilsService } from './service/create-documentation-utils.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ContractListModel } from '../../shared/contract-list/model/contract-list.model';
import { SectionListComponent } from '../../../sections/sections.component';
import { HttpHeaders, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { CanDeactivateGuardService } from '../../../../../shared/jbh-app-services/can-deactivate-guard.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

describe('CreateDocumentationComponent', () => {
    let component: CreateDocumentationComponent;
    let fixture: ComponentFixture<CreateDocumentationComponent>;
    let debugElement: DebugElement;
    let createDocumentationService: CreateDocumentationService;
    let createDocumentationUtilsService: CreateDocumentationUtilsService;
    let messageService: MessageService;
    let errorResponse: HttpErrorResponse;
    let canDeactivateGuardService: CanDeactivateGuardService;
    let route: ActivatedRouteSnapshot;
    let state: RouterStateSnapshot;
    let nextState: RouterStateSnapshot;
    const testResponse = {
        _embedded: {
            configurationParameterDetails: [{ configurationParameterValue: 123 }]
        }
    };

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
            declarations: [],

            providers: [CreateDocumentationService, { provide: APP_BASE_HREF, useValue: '/' }, CreateDocumentationUtilsService,
                MessageService, { provide: APP_BASE_HREF, useValue: '/' }, CanDeactivateGuardService,
                { provide: RouterStateSnapshot, useValue: CreateDocumentationComponent },
                { provide: ActivatedRouteSnapshot, useValue: CreateDocumentationComponent }]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateDocumentationComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        createDocumentationService = debugElement.injector.get(CreateDocumentationService);
        createDocumentationUtilsService = debugElement.injector.get(CreateDocumentationUtilsService);
        messageService = TestBed.get(MessageService);
        canDeactivateGuardService = TestBed.get(CanDeactivateGuardService);
        route = TestBed.get(ActivatedRouteSnapshot);
        state = TestBed.get(RouterStateSnapshot);
        nextState = TestBed.get(RouterStateSnapshot);
        spyOn(createDocumentationService, 'getSuperFutureBackDate').and.returnValue(of(testResponse));
        spyOn(createDocumentationService, 'getSuperUserBackDate').and.returnValue(of(testResponse));
        component.createDocumentationForm();
        fixture.detectChanges();
    });
    const responseAttachemnt = {
        '_embedded': {
            'accessorialAttachmentTypes': [{
                '@id': 1,
                'accessorialAttachmentTypeId': 1,
                'accessorialAttachmentTypeName': 'Signed Accessorials',
                'effectiveDate': '2019-05-24',
                'expirationDate': '2099-12-31',
                'lastUpdateTimestampString': '2019-05-24T13:52:55.2694514',
                '_links': {}
            }]
        },
        '_links': {},
        'page': {
            'size': 50,
            'totalElements': 3,
            'totalPages': 1,
            'number': 0
        }
    };

    it('should create', () => {
        spyOn(createDocumentationService, 'getAttachmentType').and.returnValues(of(responseAttachemnt));
        expect(component).toBeTruthy();
    });

    it('should call onDocumentationLevelChange', () => {
        component.onDocumentationLevelChange();
    });

    it('should call typedDateValidate effectiveDate', () => {
        const event = { srcElement: { value: '05/30/2019' } };
        component.createDocumentationModel.documentationForm.controls['effectiveDate'].setValue('05/30/2019');
        component.typedDateValidate(event, 'effectiveDate');
    });

    it('should call typedDateValidate expirationDate', () => {
        const event = { srcElement: { value: '12/31/2099' } };
        component.createDocumentationModel.documentationForm.controls['expirationDate'].setValue('12/31/2019');
        component.typedDateValidate(event, 'expirationDate');
    });

    it('should call validateEffectiveDate', () => {
        component.validateEffectiveDate();
    });

    it('should call onValidateForm', () => {
        component.onValidateForm();
    });


    xit('should call onValidateForm', () => {
        const formBuilder: FormBuilder = new FormBuilder();
        component.createDocumentationModel.documentationForm = formBuilder.group({
            documentationType: ['xyz', Validators.required],
            effectiveDate: ['12/31/2019', Validators.required],
            expirationDate: ['12/31/2099', Validators.required],
            documentationLevel: ['Agreement', Validators.required],
            documentCategorySelect: ['Text Only'],
            textName: ['abc', Validators.required],
            textArea: ['abc', Validators.required],
            attachment: []
        });

        component.optionalFields.optionalAttributesModel.optionalForm = formBuilder.group({
            chargeType: [[]],
            businessUnit: [''],
            serviceLevel: [123],
            requestedService: [''],
            equipmentCategory: [''],
            equipmentType: [''],
            equipmentLength: [''],
            carriers: [[]]
        });
        component.onValidateForm();
    });

    it('should call documentTypePopupYes', () => {
        component.documentTypePopupYes();
    });

    it('should call setFormErrors', () => {
        component.setFormErrors();
    });

    it('should call setAgreementLevelDate', () => {
        const response = {
            'agreementID': 169,
            'agreementDefaultAmount': 1,
            'agreementEffectiveDate': '1995-01-01',
            'agreementExpirationDate': '2099-12-31',
            'customerContractDetailDTO': [],
            'customerSectionDetailDTO': []
        };
        spyOn(createDocumentationService, 'getAgreementLevelDate').and.returnValues(of(response));
        component.setAgreementLevelDate();
    });

    it('should call setDocumentType', () => {
        const response = {
            '_embedded': {
                'accessorialDocumentTypes': [
                    {
                        '@id': 169,
                        'createTimestamp': '2013-09-29T18:46:19Z',
                        'createProgramName': 'string',
                        'lastUpdateProgramName': 'string',
                        'createUserId': '1',
                        'lastUpdateUserId': '1',
                        'accessorialDocumentTypeId': 1,
                        'accessorialDocumentTypeName': 'abc',
                        'effectiveDate': '1995-01-01T06:00:00.000+0000',
                        'expirationDate': '2099-12-31T06:00:00.000+0000',
                        'lastUpdateTimestampString': '2013-09-29T18:46:19Z',
                        '_links': {}
                    }
                ]
            },
            '_links': {},
            'page': {
                'size': 1,
                'totalElements': 25,
                'totalPages': 10,
                'number': 1
            }
        };
        spyOn(createDocumentationService, 'getDocumentationType').and.returnValues(of(response));
        component.setDocumentType();
    });

    it('should call saveDocumentation', () => {
        component.createDocumentationModel.documentationForm.controls['documentCategorySelect'].setValue('Text Only');
        component.createDocumentationModel.documentTypeCompare = 'Text Only';
        const response = {
            'customerAccessorialDocumentConfigurationId': 169,
            'effectiveDate': '2002-01-01',
            'expirationDate': '2000-12-31',
            'customerAgreementId': 349,
            'accessorialDocumentTypeId': 1,
            'accessorialDocumentType': 'Legal',
            'chargeTypeId': 1,
            'chargeTypeName': 'Power Detention',
            'documentationCategory': 'textOnly',
            'equipmentCategoryCode': 'Container',
            'equipmentTypeCode': 'Dry Van',
            'equipmentLengthId': 28,
            'equipmentTypeId': 1,
            'customerAgreementContractSectionAccountsDTOs': [
                {
                    'customerAccessorialAccountId': 1,
                    'customerAgreementContractSectionId': 2,
                    'customerAgreementContractSectionName': 'Documentation',
                    'customerAgreementContractId': 2,
                    'customerAgreementContractName': 'Document',
                    'customerAgreementContractSectionAccountId': 1,
                    'customerAgreementContractSectionAccountName': 'Sample'
                }
            ],
            'businessUnitServiceOfferingDTOs': [
                {
                    'customerAccessorialServiceLevelBusinessUnitServiceOfferingId': 1,
                    'serviceLevelBusinessUnitServiceOfferingAssociationId': 1,
                    'businessUnit': 'JCI',
                    'serviceOffering': 'TRANSPORT',
                    'serviceLevel': 'TRUCK'
                }
            ],
            'requestServiceDTOs': [
                {
                    'customerAccessorialRequestServiceId': 1,
                    'requestedServiceTypeId': 1,
                    'requestedServiceTypeCode': '0001'
                }
            ],
            'carrierDTOs': [
                {
                    'customerAccessorialCarrierId': 1,
                    'carrierId': 1,
                    'carrierCode': '001',
                    'carrierName': 'AAA'
                }
            ],
            'customerAccessorialDocumentTextAttachmentDTO': {
                'customerAccessorialDocumentTextId': 1,
                'documentationCategory': 'test',
                'textName': 'Aggrement',
                'text': 'AgreementInfo',
                'attachmentDTOs': [
                    {
                        'customerAccessorialAttachmentId': 1,
                        'accessorialAttachmentTypeDTO': {
                            'accessorialAttachmentTypeId': 1,
                            'accessorialAttachmentTypeName': 'Document'
                        },
                        'documentNumber': 'DOC01',
                        'documentName': 'Aggreement'
                    }
                ]
            }
        };
        component.createDocumentationModel.agreementDetails = {
            agreementType: 'test',
            businessUnits: 'test',
            cargoReleaseAmount: 123,
            currencyCode: 'test',
            customerAgreementID: 123,
            customerAgreementName: 'test',
            effectiveDate: 'test',
            expirationDate: 'test',
            invalidIndicator: 'test',
            invalidReasonTypeName: 'test',
            taskAssignmentIDs: 'test',
            teams: 'test',
            ultimateParentAccountID: 123
        };
        component.createDocumentationModel.selectedDocumentType = {
            label: 'test',
            value: 123
        };
        component.optionalFields.optionalAttributesModel.optionalForm.controls.equipmentCategory.setValue({ value: 'test' });
        component.optionalFields.optionalAttributesModel.optionalForm.controls.equipmentType.setValue({ value: 'test' });
        component.optionalFields.optionalAttributesModel.optionalForm.controls.equipmentLength.setValue({ id: 123 });
        component.optionalFields.optionalAttributesModel.optionalForm.controls.chargeType.setValue([{ value: 'test', label: 123 }]);
        component.optionalFields.optionalAttributesModel.serviceLevelValues = [{ label: 123, value: 'test' }];
        component.optionalFields.optionalAttributesModel.optionalForm.controls.requestedService.setValue(['code1']);
        spyOn(createDocumentationService, 'postDocumentationData').and.returnValues(of(response));
        component.saveDocumentation();
    });

    it('should call onHidePop', () => {
        component.onHidePop('documentationLevelChange');
    });

    it('should call onDocumentationCancel', () => {
        component.onDocumentationCancel();
    });

    it('should call validateDate', () => {
        component.validateDate('12/31/2099', 'effectiveDate');
        component.validateDate('12/31/2099', 'expirationDate');
    });

    it('should call getContractDetails', () => {
        component.getContractDetails([{
            customerAgreementContractID: 123,
            customerContractName: 'Contract Name',
            customerContractNumber: 'CCN123',
            contractTypeName: 'Contract Type',
            effectiveDate: '2018-05-05',
            expirationDate: '2099-12-31',
            isChecked: true
        }]);
    });

    it('should call onChangeDocumentLevel', () => {
        const element = fixture.debugElement.query(By.css('[formControlName="documentationLevel"]'));
        element.triggerEventHandler('onOptionClick', { option: { value: 'Aggrement' } });
    });

    it('should call onChangeDocumentType', () => {
        const element = fixture.debugElement.query(By.css('[formControlName="documentationType"]'));
        element.triggerEventHandler('onChange', { value: 'Legal' });
    });

    it('should cal invalidSelections', () => {
        component.invalidSelections();
    });

    it('should cal onPopupClose', () => {
        component.createDocumentationModel.isPopupYesClicked = false;
        component.onPopupClose();
    });

    it('should cal contractListCheck', () => {
        const selectedValues = [{
            customerAgreementContractID: 123,
            customerContractName: 'string',
            customerContractNumber: 'string',
            contractTypeID: 2,
            contractTypeName: 'string',
            effectiveDate: 'string',
            expirationDate: 'string',
            isChecked: false
        }];
        component.createDocumentationModel.selectedContractValue = selectedValues;
        component.contractListCheck();
    });
    it('should cal sectionListCheck', () => {
        const selectedValues = [{
            customerAgreementContractSectionID: 234,
            customerAgreementContractSectionName: 'string',
            customerAgreementContractID: 23,
            customerContractName: 'string',
            customerContractNumber: 'string',
            contractTypeName: 'string',
            effectiveDate: 'string',
            expirationDate: 'string',
            isChecked: false,
            currencyCode: 'string',
        }];
        component.createDocumentationModel.selectedSectionValue = selectedValues;
        component.sectionListCheck();
    });
    it('should cal onChangedocumentCategory', () => {
        const selectedDocumentValue = 'attachment';
        component.createDocumentationModel.documentTypeCompare = selectedDocumentValue;
        component.onChangedocumentCategory(selectedDocumentValue);
    });
    it('should cal onChangedocumentCategory else', () => {
        component.onChangedocumentCategory('');
    });

    it('should cal datecheck ', () => {
        component.createDocumentationModel.agreementEffectiveDate = '01-01-2019';
        component.createDocumentationModel.effectiveDate = '02-01-2019';
        component.dateCheck();
    });

    it('should cal checkContractSection', () => {
        component.onDateSelected(new Date(), 'effectiveDate');
    });
    it('should cal checkContractSection', () => {
        component.onDateSelected(new Date(), 'expirationDate');
    });


    it('should cal onTypeAttachmentType', () => {
        const response = {
            query: 'O'
        };
        component.createDocumentationModel.attachmentTypeValue = [{ label: 'On', value: '12' }];
        component.onTypeAttachmentType(response);
    });
    it('should cal onTypeAttachmentTypeElse', () => {
        const response = {
            query: 'O'
        };
        component.createDocumentationModel.attachmentTypeValue = null;
        component.onTypeAttachmentType(response);
    });
    it('should cal onTypeAttachmentTypeElse', () => {
        const response = {
            query: 'Order'
        };
        component.createDocumentationModel.attachmentTypeValue = [{ label: 'On', value: '12' }];
        component.onTypeAttachmentType(response);
    });

    it('should cal onSaveDocumentation', () => {
        component.onSaveDocumentation();
    });

    it('should call saveDocumentation else if', () => {
        component.createDocumentationModel.documentationForm.controls['documentCategorySelect'].setValue('Text Only');
        component.createDocumentationModel.documentTypeCompare = 'Text';
        const response = {
            'customerAccessorialDocumentConfigurationId': 169,
            'effectiveDate': '2002-01-01',
            'expirationDate': '2000-12-31',
            'customerAgreementId': 349,
            'accessorialDocumentTypeId': 1,
            'accessorialDocumentType': 'Legal',
            'chargeTypeId': 1,
            'chargeTypeName': 'Power Detention',
            'documentationCategory': 'textOnly',
            'equipmentCategoryCode': 'Container',
            'equipmentTypeCode': 'Dry Van',
            'equipmentLengthId': 28,
            'equipmentTypeId': 1,
            'customerAgreementContractSectionAccountsDTOs': [
                {
                    'customerAccessorialAccountId': 1,
                    'customerAgreementContractSectionId': 2,
                    'customerAgreementContractSectionName': 'Documentation',
                    'customerAgreementContractId': 2,
                    'customerAgreementContractName': 'Document',
                    'customerAgreementContractSectionAccountId': 1,
                    'customerAgreementContractSectionAccountName': 'Sample'
                }
            ],
            'businessUnitServiceOfferingDTOs': [
                {
                    'customerAccessorialServiceLevelBusinessUnitServiceOfferingId': 1,
                    'serviceLevelBusinessUnitServiceOfferingAssociationId': 1,
                    'businessUnit': 'JCI',
                    'serviceOffering': 'TRANSPORT',
                    'serviceLevel': 'TRUCK'
                }
            ],
            'requestServiceDTOs': [
                {
                    'customerAccessorialRequestServiceId': 1,
                    'requestedServiceTypeId': 1,
                    'requestedServiceTypeCode': '0001'
                }
            ],
            'carrierDTOs': [
                {
                    'customerAccessorialCarrierId': 1,
                    'carrierId': 1,
                    'carrierCode': '001',
                    'carrierName': 'AAA'
                }
            ],
            'customerAccessorialDocumentTextAttachmentDTO': {
                'customerAccessorialDocumentTextId': 1,
                'documentationCategory': 'test',
                'textName': 'Aggrement',
                'text': 'AgreementInfo',
                'attachmentDTOs': [
                    {
                        'customerAccessorialAttachmentId': 1,
                        'accessorialAttachmentTypeDTO': {
                            'accessorialAttachmentTypeId': 1,
                            'accessorialAttachmentTypeName': 'Document'
                        },
                        'documentNumber': 'DOC01',
                        'documentName': 'Aggreement'
                    }
                ]
            }
        };
        spyOn(createDocumentationUtilsService, 'documentationPostFramer');
        spyOn(createDocumentationService, 'postDocumentationData').and.returnValues(of(response));
        component.saveDocumentation();
    });

    it('should cal formfieldtouched', () => {
        component.createDocumentationModel.documentationForm.controls['documentCategorySelect'].setValue('Text Only');
        component.createDocumentationModel.documentTypeCompare = 'Text Only';
        component.createDocumentationModel.fileCount = 1;
        component.formFieldsTouched();
    });
    it('should call setFormErrorsElseIF', () => {
        component.createDocumentationModel.documentationForm.controls.effectiveDate.setErrors(null);
        component.setFormErrors();
    });
    it('should call setFormErrorsElse', () => {
        component.createDocumentationModel.documentationForm.controls.effectiveDate.setErrors(null);
        component.createDocumentationModel.documentationForm.controls.effectiveDate.setValue('01/01/2010');
        component.setFormErrors();
    });
    it('should call loadAttachmentType', () => {
        spyOn(createDocumentationService, 'getAttachmentType').and.returnValues(of(responseAttachemnt));
        component.loadAttachmentType();
    });
    it('should return from onChangeDocumentLevel upon matching value', () => {
        const event1: any = { option: { value: 'abc' } };
        component.createDocumentationModel.documentationForm.controls['documentationLevel'].setValue('abc');
        component.onChangeDocumentLevel(event1);
    });
    it('should call typedDateValidate else', () => {
        const event1: any = { srcElement: { value: '' } };
        const fieldName1 = 'effectiveDate';
        const fieldName2 = 'expirationDate';
        component.typedDateValidate(event1, fieldName1);
        component.typedDateValidate(event1, fieldName2);
    });
    it('should call validateDate', () => {
        component.createDocumentationModel.agreementEndDate = new Date().toString();
        const date1: any = new Date(1465716222496);
        const date2: any = new Date(1455716222496);

        const fieldName1 = 'effectiveDate';
        const fieldName2 = 'expirationDate';
        component.validateDate(date1, fieldName1);
        component.validateDate(date2, fieldName2);
    });
    it('should call validateEffectiveDate', () => {
        component.createDocumentationModel.agreementEndDate = new Date().toString();
        component.createDocumentationModel.documentationForm.controls['effectiveDate'].setValue(new Date(1465716222496));
        component.createDocumentationModel.documentationForm.controls['expirationDate'].setValue(new Date(1455716222496));
        component.validateEffectiveDate();
        expect(component.createDocumentationModel.inValidDate).toEqual(true);
    });
    it('should call checkContractValidity', () => {
        const parent = { contractListModel: { selectedContract: [{ status: 'Inactive' }] } };
        component.checkContractValidity(parent);
    });
    it('should call checkSectionValidity', () => {
        const section = { sectionsModel: { dataSelected: [{ status: 'Inactive' }] } };
        component.checkSectionValidity(section);
    });
    it('should call checkBillToValidity', () => {
        const billTo = { billTo: 'abc', billToModel: { dataSelected: [{ status: 'Inactive' }] } };
        component.checkBillToValidity(billTo);
    });
    it('should call accessorialDocumentationErrorScenario', () => {
        const error: any = { error: { errors: [{ errorMessage: 'abc', code: 'DUPLICATE_EXISTS' }] } };
        component.accessorialDocumentationErrorScenario(error);
    });
    it('should call showDuplicateRateError', () => {
        const error: any = { error: { errors: [{ errorMessage: 'abc', code: 'abc' }] } };
        component.showDuplicateRateError(error);
    });
    it('should call toastMessageForAtaachment', () => {
        component.toastMessageForAtaachment();
        component.createDocumentationModel.documentationForm.controls['textName'].setValue('abc');
        component.createDocumentationModel.documentationForm.controls['textArea'].setValue('abc');
        component.createDocumentationModel.fileCount = 2;
        component.toastMessageForAtaachment();
    });
    it('should call cancelCheck', () => {
        component.optionalFields['optionalAttributesModel']['optionalForm'].markAsDirty();
        component.cancelCheck();
        expect(component.createDocumentationModel.documentationCancel).toEqual(true);
    });
    it('should call onHideCancelPop', () => {
        component.onHideCancelPop('isShowSavePopup');
        expect(component.createDocumentationModel.isShowSavePopup).toEqual(false);
    });
    it('should call getsectionDetails', () => {
        const event1 = {
            customerAgreementContractSectionID: 2,
            customerAgreementContractSectionName: 'abc',
            customerAgreementContractID: 3,
            customerContractName: 'abc',
            customerContractNumber: '34',
            contractTypeName: 'abc',
            effectiveDate: 'abc',
            expirationDate: '12/2/2019',
            isChecked: true,
            currencyCode: 'USD'
        };
        component.getsectionDetails(event1);
    });
    it('should call documentTypePopupNo', () => {
        component.createDocumentationModel.selectedDocumentType = {
            label: 'abc',
            value: 3
        };
        component.documentTypePopupNo();
        expect(component.createDocumentationModel.isShowDocumentTypePopup).toEqual(false);
    });
    it('should call savePopupYes', () => {
        const response = {
            'customerAccessorialDocumentConfigurationId': 169,
            'effectiveDate': '2002-01-01',
            'expirationDate': '2000-12-31',
            'customerAgreementId': 349,
            'accessorialDocumentTypeId': 1,
            'accessorialDocumentType': 'Legal',
            'chargeTypeId': 1,
            'chargeTypeName': 'Power Detention',
            'documentationCategory': 'textOnly',
            'equipmentCategoryCode': 'Container',
            'equipmentTypeCode': 'Dry Van',
            'equipmentLengthId': 28,
            'equipmentTypeId': 1,
            'customerAgreementContractSectionAccountsDTOs': [
                {
                    'customerAccessorialAccountId': 1,
                    'customerAgreementContractSectionId': 2,
                    'customerAgreementContractSectionName': 'Documentation',
                    'customerAgreementContractId': 2,
                    'customerAgreementContractName': 'Document',
                    'customerAgreementContractSectionAccountId': 1,
                    'customerAgreementContractSectionAccountName': 'Sample'
                }
            ],
            'businessUnitServiceOfferingDTOs': [
                {
                    'customerAccessorialServiceLevelBusinessUnitServiceOfferingId': 1,
                    'serviceLevelBusinessUnitServiceOfferingAssociationId': 1,
                    'businessUnit': 'JCI',
                    'serviceOffering': 'TRANSPORT',
                    'serviceLevel': 'TRUCK'
                }
            ],
            'requestServiceDTOs': [
                {
                    'customerAccessorialRequestServiceId': 1,
                    'requestedServiceTypeId': 1,
                    'requestedServiceTypeCode': '0001'
                }
            ],
            'carrierDTOs': [
                {
                    'customerAccessorialCarrierId': 1,
                    'carrierId': 1,
                    'carrierCode': '001',
                    'carrierName': 'AAA'
                }
            ],
            'customerAccessorialDocumentTextAttachmentDTO': {
                'customerAccessorialDocumentTextId': 1,
                'documentationCategory': 'test',
                'textName': 'Aggrement',
                'text': 'AgreementInfo',
                'attachmentDTOs': [
                    {
                        'customerAccessorialAttachmentId': 1,
                        'accessorialAttachmentTypeDTO': {
                            'accessorialAttachmentTypeId': 1,
                            'accessorialAttachmentTypeName': 'Document'
                        },
                        'documentNumber': 'DOC01',
                        'documentName': 'Aggreement'
                    }
                ]
            }
        };
        spyOn(createDocumentationUtilsService, 'documentationPostFramer');
        spyOn(createDocumentationService, 'postDocumentationData').and.returnValues(of(response));
        component.savePopupYes();
        expect(component.createDocumentationModel.isShowSavePopup).toEqual(false);
    });
    it('should call savePopupNo', () => {
        component.savePopupNo();
        expect(component.createDocumentationModel.isShowSavePopup).toEqual(false);
    });
    it('should call moreFileAndSize', () => {
        component.createDocumentationModel.fileCount = 6;
        component.createDocumentationModel.numberOfFilesInDragAndDrop = 6;
        component.moreFileAndSize();
    });
    it('should call onFilesUpload', () => {
        const event1 = { files: [{ name: 'abc.a', size: 9 }, { name: 'def.a', size: 8 }] };
        component.createDocumentationModel.fileCount = 2;
        component.onFilesUpload(event1);
    });
    it('should call postFileDetail', () => {
        const response = {
            'documentId': 22
        };
        const event1: any = { files: [{ name: 'abc.a', size: 9 }, { name: 'def.a', size: 8 }] };
        spyOn(createDocumentationService, 'postFileDetails').and.returnValues(of(response));
        component.createDocumentationModel['selectedDocumentType'] = {
            label: 'abc',
            value: 11
        };
        component.agreementID = '12';

        const formData = new FormData();
        formData.append('file', event1.files[0], event1.files[0].name);
        component.postFileDetail(event1.files[0], formData);
    });
    it('should call handleError', () => {
        const error: any = {
            name: 'error',
            message: 'this is an error',
            error: { errors: 'error' },
            ok: true,
        };
        component.handleError(error);
    });
    it('should call handleDownError-If', () => {
        errorResponse = {
            headers: new HttpHeaders(),
            status: 503,
            message: '',
            name: '', ok: false, statusText: 'Test', url: '', type: HttpEventType.Response,
            error: {
                errors: [{
                    'fieldErrorFlag': false,
                    'errorMessage': '70',
                    'errorType': 'Business Validation Error',
                    'fieldName': null,
                    'code': 'AGREEMENT_NAME_DUPLICATE',
                    'errorSeverity': 'ERROR'
                }]
            }
        };
        component.handleDownError(errorResponse);
    });
    it('should call handleDownError-else', () => {
        errorResponse = {
            headers: new HttpHeaders(),
            status: 400,
            message: '',
            name: '', ok: false, statusText: 'Test', url: '', type: HttpEventType.Response,
            error: {
                errors: [{
                    'fieldErrorFlag': false,
                    'errorMessage': '70',
                    'errorType': 'Business Validation Error',
                    'fieldName': null,
                    'code': 'AGREEMENT_NAME_DUPLICATE',
                    'errorSeverity': 'ERROR'
                }]
            }
        };
        component.handleDownError(errorResponse);
    });
    it('should call onBlurAttachmentType', () => {
        const event1 = { target: { value: 'abc' } };
        const rowIndex1 = 0;
        component.onBlurAttachmentType(event1, rowIndex1);
    });

    it('should call canDeactivate for else', () => {
        component.createDocumentationModel.isDetailsSaved = true;
        component.createDocumentationModel['documentationForm'].markAsDirty();
        component.createDocumentationModel.isChangesSaving = true;
        component.createDocumentationModel.routingUrl = nextState.url;
        component.canDeactivate(canDeactivateGuardService, route, state, nextState);
        expect(component.canDeactivate).toBeTruthy();
    });
    it('should call canDeactivate for if', () => {
        component.createDocumentationModel.isDetailsSaved = false;
        component.createDocumentationModel['documentationForm'].markAsDirty();
        component.createDocumentationModel.isChangesSaving = false;
        component.createDocumentationModel.routingUrl = nextState.url;
        component.canDeactivate(canDeactivateGuardService, route, state, nextState);
        expect(component.canDeactivate).toBeTruthy();
    });
});
