import { TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';
import { of } from 'rxjs';
import { AppModule } from '../../../../../app.module';
import { CreateAgreementModule } from '../../../create-agreement.module';
import { CreateCargoComponent } from '../create-cargo.component';
import { CreateCargoUtilsService } from './create-cargo-utils.service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';

describe('CreateCargoUtilsService', () => {
    let service: CreateCargoUtilsService;
    let component: CreateCargoComponent;
    let http: HttpClient;
    let messageService: MessageService;
    const fb = {
        cargoValue: '100,000.00',
        selectContract: '',
        agreementType: 'contract',
        contract: {
            'label': {
                'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                'customerContractType': 'Legal', 'contractEffectiveDate':
                    '2019-06-11', 'contractExpirationDate': '2019-06-30'
            },
            'value': 'AWKE27Ident-AWKE27Desc'
        },
        businessUnit: [{ 'label': 'DCS', 'value': 'DCS' }],
        effectiveDate: '06/11/2019',
        expirationDate: '06/30/2019'
    };

    const agreementId = {
        'agreementType': 'Customer',
        'businessUnits': null,
        'cargoReleaseAmount': null,
        'currencyCode': null,
        'customerAgreementID': 16,
        'customerAgreementName': 'Agar Corp (AGHOA2)',
        'effectiveDate': '1995-01-01',
        'expirationDate': '2099-12-31',
        'invalidIndicator': 'N',
        'invalidReasonTypeName': null,
        'taskAssignmentIDs': null,
        'teams': null,
        'ultimateParentAccountID': 42550
    };
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule, CreateAgreementModule, HttpClientTestingModule],
            providers: [CreateCargoUtilsService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient, CreateCargoComponent,
                ChangeDetectorRef, MessageService],
        });
        service = TestBed.get(CreateCargoUtilsService);
        http = TestBed.get(HttpClient);
        messageService = TestBed.get(MessageService);
        component = TestBed.get(CreateCargoComponent);
        const rowData: any = [{
            'uniqueDocID': 'A_614_401',
            'agreementDefaultIndicator': 'Yes',
            'agreementID': 614,
            'customerAgreementCargoIDs': [401],
            'cargoReleaseAmount': 100000,
            'contractAssociation': {
                'customerAgreementContractID': null,
                'contractName': 'test',
                'contractNumber': null,
                'contractType': null,
                'contractDisplayName': null
            },
            'sectionAssociation': {
                'sectionID': null,
                'sectionName': null
            },
            'financeBusinessUnitAssociations': [
                {
                    'financeBusinessUnitCargoID': null,
                    'financeBusinessUnitCode':
                        null
                }],
            'originalEffectiveDate': '1995-01-01',
            'originalExpirationDate': '2099-12-31',
            'effectiveDate': '01/01/1995',
            'expirationDate': '12/31/2099',
            'invalidIndicator': 'N',
            'invalidReasonTypeName': 'Active',
            'createProgram': 'Sivanesan Sadhasivam',
            'createTimestamp': '2019-05-24T14:14:16.639',
            'createUser': 'rcon770',
            'lastUpdateProgram': 'Sivanesan Sadhasivam',
            'lastUpdateTimestamp': '2019-05-24T14:14:16.639',
            'lastUpdateUser': 'rcon770',
            'cargoType': 'Agreement',
            'cargoAmount': '$100,000.00',
            'index': 0,
            'businessUnitCode': [],
            'customerContractName': 'desc',
            'customerSectionName': ''
        }
        ];
        component.rowData = rowData;
        const rowValue = [{
            'cargoAmount': null, 'customerAgreementID': null, 'customerAgreementCargoID':
                null, 'agreementDefault': null, 'customerContractID': 24, 'customerContractNumber': 'idenAGH090',
            'customerContractName': 'desc', 'customerContractCargoID': null, 'customerSectionCargoID': null,
            'customerSectionName': null, 'customerSectionID': null, 'customerAgreementBusinessUnitCargoList': null,
            'customerContractBusinessUnitCargoList': [{
                'contractID': 24, 'contractName': 'daa', 'contractNumber': null,
                'contractType': null, 'contractDisplayName': null, 'customerAgreementID': null,
                'customerContractBusinessUnitCargoID': 4, 'action': null, 'financeBusinessUnitCode': 'DCS',
                'contractBusinessUnitCargoAmount': 9898, 'currencyCode': 'USD', 'contractBuEffectiveDate': '2019-05-27',
                'contractBuExpirationDate': '2019-08-31', 'agreementDefaultCargoAmount': null, 'existingESDocID': null,
                'isCreateFlow': null
            }, {
                'contractID': 24, 'contractName': 'data', 'contractNumber': null, 'contractType': null,
                'contractDisplayName': null, 'customerAgreementID': null, 'customerContractBusinessUnitCargoID': 5,
                'action': null, 'financeBusinessUnitCode': 'ICS', 'contractBusinessUnitCargoAmount': 9898, 'currencyCode': 'USD',
                'contractBuEffectiveDate': '2019-05-27', 'contractBuExpirationDate': '2019-08-31', 'agreementDefaultCargoAmount':
                    null, 'existingESDocID': null, 'isCreateFlow': null
            }, {
                'contractID': 24, 'contractName': 'test', 'contractNumber': null, 'contractType': null,
                'contractDisplayName': null, 'customerAgreementID': null,
                'customerContractBusinessUnitCargoID': 6, 'action': null, 'financeBusinessUnitCode': 'JBI',
                'contractBusinessUnitCargoAmount': 9898, 'currencyCode': 'USD', 'contractBuEffectiveDate': '2019-05-27',
                'contractBuExpirationDate': '2019-08-31', 'agreementDefaultCargoAmount': null, 'existingESDocID': null,
                'isCreateFlow': null
            }, {
                'contractID': 24, 'contractName': 'test', 'contractNumber': null, 'contractType': null,
                'contractDisplayName': null, 'customerAgreementID': null, 'customerContractBusinessUnitCargoID': 7,
                'action': null, 'financeBusinessUnitCode': 'JBT', 'contractBusinessUnitCargoAmount': 9898, 'currencyCode':
                    'USD', 'contractBuEffectiveDate': '2019-05-27', 'contractBuExpirationDate': '2019-08-31',
                'agreementDefaultCargoAmount': null, 'existingESDocID': null, 'isCreateFlow': null
            }], 'customerSectionBusinessUnitCargo': null, 'effectiveDate': '2019-05-27', 'expirationDate': '2019-08-31',
            'status': null, 'originalEffectiveDate': null, 'originalExpirationDate': null, 'createdUser': 'rcon770',
            'createdDate': '2019-05-27T10:57:34.768', 'createdProgram': 'Sivanesan Sadhasivam', 'updatedUser': 'rcon770',
            'updatedDate': '2019-05-27T10:57:34.768', 'updatedProgram': 'Sivanesan Sadhasivam'
        }];
        component.createCargoModel.rowValue = rowValue;
        component.createCargoModel.agreementId = agreementId;
        const contractObj = {
            'customerContractID': 22,
            'customerContractNumber': null, 'customerContractName': 'desc', 'customerContractType': 'Transactional',
            'contractEffectiveDate': '2019-05-27', 'contractExpirationDate': '2099-12-31'
        };
        component.createCargoModel.allContractCargoValues = [{
            label: contractObj,
            value: 'ADLOAHIdent-ADLOAHDesc'
        }];
    });

    it('should be created', inject([CreateCargoUtilsService], () => {
        expect(service).toBeTruthy();
    }));

    xit('onCreateAgreementQuery', () => {
        service.onCreateAgreementQuery(component);
    });

    xit('amountFormatter', () => {
        const data = 1234;
        const datafix = data.toString();
        expect(service.amountFormatter(data)).toBe(datafix);
    });

    it('onCreateAgreementBuQuery', () => {
        component.createCargoModel.cargoDefaultAmount = 1000;
        component.createCargoModel.allContractCargoValues = [];
        component.createCargoModel.allContractCargoValues.push({
            'label': {
                'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                'customerContractType': 'Legal', 'contractEffectiveDate':
                    '2019-06-11', 'contractExpirationDate': '2019-06-30'
            },
            'value': 'AWKE27Ident-AWKE27Desc'
        });
        const fbx = {
            cargoValue: 100000,
            selectContract: '',
            agreementType: 'contract',
            contract: {
                'label': {
                    'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                    'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                    'customerContractType': 'Legal', 'contractEffectiveDate':
                        '2019-06-11', 'contractExpirationDate': '2019-06-30'
                },
                'value': 'AWKE27Ident-AWKE27Desc'
            },
            businessUnit: [{ 'label': 'DCS', 'value': 'DCS' }],
            effectiveDate: '06/11/2019',
            expirationDate: '06/30/2019'
        };
        component.createCargoModel.cargoReleaseForm.setValue(fbx);
        service.onCreateAgreementBuQuery(component);
    });

    xit('onCreateAgreementBuQuery', () => {
        const fbx = {
            cargoValue: 100000,
            selectContract: '',
            agreementType: 'contract',
            contract: {
                'label': {
                    'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                    'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                    'customerContractType': 'Legal', 'contractEffectiveDate':
                        '2019-06-11', 'contractExpirationDate': '2019-06-30'
                },
                'value': 'AWKE27Ident-AWKE27Desc'
            },
            businessUnit: [{ 'label': 'DCS', 'value': 'DCS' }],
            effectiveDate: '06/11/2019',
            expirationDate: '06/30/2019'
        };
        component.createCargoModel.cargoReleaseForm.setValue(fbx);
        service.onCreateAgreementBuQuery(component);
    });

    it('iterateRowDataBu', () => {
        component.createCargoModel.cargoDefaultAmount = 1000;
        component.createCargoModel.allContractCargoValues = [];
        component.createCargoModel.allContractCargoValues.push({
            'label': {
                'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                'customerContractType': 'Legal', 'contractEffectiveDate':
                    '2019-06-11', 'contractExpirationDate': '2019-06-30'
            },
            'value': 'AWKE27Ident-AWKE27Desc'
        });
        const fbx = {
            cargoValue: 100000,
            selectContract: '',
            agreementType: 'contract',
            contract: {
                'label': {
                    'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                    'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                    'customerContractType': 'Legal', 'contractEffectiveDate':
                        '2019-06-11', 'contractExpirationDate': '2019-06-30'
                },
                'value': 'AWKE27Ident-AWKE27Desc'
            },
            businessUnit: [{ 'label': 'DCS', 'value': 'DCS' }],
            effectiveDate: '06/11/2019',
            expirationDate: '06/30/2019'
        };
        component.createCargoModel.cargoReleaseForm.setValue(fbx);
        service.iterateRowDataBu(component);
    });

    xit('iterateRowDataBu', () => {
        const fbx = {
            cargoValue: 100000,
            selectContract: '',
            agreementType: 'contract',
            contract: {
                'label': {
                    'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                    'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                    'customerContractType': 'Legal', 'contractEffectiveDate':
                        '2019-06-11', 'contractExpirationDate': '2019-06-30'
                },
                'value': 'AWKE27Ident-AWKE27Desc'
            },
            businessUnit: [{ 'label': 'DCS', 'value': 'DCS' }],
            effectiveDate: '06/11/2019',
            expirationDate: '06/30/2019'
        };
        component.createCargoModel.cargoReleaseForm.setValue(fbx);
        service.iterateRowDataBu(component);
    });

    it('addedBusinessUnitDto', () => {
        component.createCargoModel.cargoDefaultAmount = 1000;
        component.createCargoModel.allContractCargoValues = [];
        const arr = ['ICS', 'DCS'];
        component.createCargoModel.allContractCargoValues.push({
            'label': {
                'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                'customerContractType': 'Legal', 'contractEffectiveDate':
                    '2019-06-11', 'contractExpirationDate': '2019-06-30'
            },
            'value': 'AWKE27Ident-AWKE27Desc'
        });
        const fbx = {
            cargoValue: 100000,
            selectContract: '',
            agreementType: 'contract',
            contract: {
                'label': {
                    'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                    'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                    'customerContractType': 'Legal', 'contractEffectiveDate':
                        '2019-06-11', 'contractExpirationDate': '2019-06-30'
                },
                'value': 'AWKE27Ident-AWKE27Desc'
            },
            businessUnit: [{ 'label': 'DCS', 'value': 'DCS' }],
            effectiveDate: '06/11/2019',
            expirationDate: '06/30/2019'
        };
        const buvalue = [{
            customerAgreementID: 614,
            customerAgreementBusinessUnitCargoID: null,
            action: null,
            financeBusinessUnitCode: 'ICS',
            agreementBusinessUnitCargoAmount: '100000.00',
            agreementBuEffectiveDate: '1995-01-01',
            agreementBuExpirationDate: '2099-12-31',
            agreementDefaultCargoAmount: '100000.00',
            existingESDocID: 'AB_487_155',
            isCreateFlow: true
        }];
        buvalue.push({
            customerAgreementID: 487,
            customerAgreementBusinessUnitCargoID: 155,
            action: 'test',
            financeBusinessUnitCode: 'testabc',
            agreementBusinessUnitCargoAmount: '100000.00',
            agreementBuEffectiveDate: '1995-01-01',
            agreementBuExpirationDate: '2099-12-31',
            agreementDefaultCargoAmount: '100000.00',
            existingESDocID: 'A_614_401',
            isCreateFlow: false
        });
        component.createCargoModel.cargoReleaseForm.setValue(fbx);
        spyOn(service, 'amountFormatter');
        service.addedBusinessUnitDto(arr, buvalue, component);
        expect(service.amountFormatter).toHaveBeenCalledTimes(4);
    });

    it('onCreateContractQuery', () => {
        component.createCargoModel.cargoDefaultAmount = 1000;
        component.createCargoModel.allContractCargoValues = [];
        component.createCargoModel.allContractCargoValues.push({
            'label': {
                'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                'customerContractType': 'Legal', 'contractEffectiveDate':
                    '2019-06-11', 'contractExpirationDate': '2019-06-30'
            },
            'value': 'AWKE27Ident-AWKE27Desc'
        });
        const fbx = {
            cargoValue: 100000,
            selectContract: '',
            agreementType: 'contract',
            contract: {
                'label': {
                    'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                    'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                    'customerContractType': 'Legal', 'contractEffectiveDate':
                        '2019-06-11', 'contractExpirationDate': '2019-06-30'
                },
                'value': 'AWKE27Ident-AWKE27Desc'
            },
            businessUnit: [{ 'label': 'DCS', 'value': 'DCS' }],
            effectiveDate: '06/11/2019',
            expirationDate: '06/30/2019'
        };
        component.createCargoModel.cargoReleaseForm.setValue(fbx);
        service.onCreateContractQuery(component);
    });

    it('getSelectedContract', () => {
        component.createCargoModel.cargoDefaultAmount = 1000;
        component.createCargoModel.allContractCargoValues = [];
        component.createCargoModel.allContractCargoValues.push({
            'label': {
                'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                'customerContractType': 'Legal', 'contractEffectiveDate':
                    '2019-06-11', 'contractExpirationDate': '2019-06-30'
            },
            'value': 'AWKE27Ident-AWKE27Desc'
        });
        const fbx = {
            cargoValue: '100,000.00',
            selectContract: '',
            agreementType: 'contract',
            contract: {
                'label': {
                    'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                    'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                    'customerContractType': 'Legal', 'contractEffectiveDate':
                        '2019-06-11', 'contractExpirationDate': '2019-06-30'
                },
                'value': 'AWKE27Ident-AWKE27Desc'
            },
            businessUnit: [{ 'label': 'DCS', 'value': 'DCS' }],
            effectiveDate: '06/11/2019',
            expirationDate: '06/30/2019'
        };
        component.createCargoModel.cargoReleaseForm.setValue(fbx);
        service.getSelectedContract(component);
    });

    it('checkbusinessUnitValues', () => {
        component.createCargoModel.cargoDefaultAmount = 1000;
        component.createCargoModel.allContractCargoValues = [];
        component.createCargoModel.allContractCargoValues.push({
            'label': {
                'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                'customerContractType': 'Legal', 'contractEffectiveDate':
                    '2019-06-11', 'contractExpirationDate': '2019-06-30'
            },
            'value': 'AWKE27Ident-AWKE27Desc'
        });
        const fbx = {
            cargoValue: 100000,
            selectContract: '',
            agreementType: 'contract',
            contract: {
                'label': {
                    'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                    'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                    'customerContractType': 'Legal', 'contractEffectiveDate':
                        '2019-06-11', 'contractExpirationDate': '2019-06-30'
                },
                'value': 'AWKE27Ident-AWKE27Desc'
            },
            businessUnit: [{ 'label': 'DCS', 'value': 'DCS' }],
            effectiveDate: '06/11/2019',
            expirationDate: '06/30/2019'
        };
        component.createCargoModel.cargoDefaultAmount = 123;
        const no = 1;
        const exists = {
            customerAgreementID: 12,
            customerAgreementBusinessUnitCargoID: 13,
            action: 'string',
            financeBusinessUnitCode: 'string',
            agreementBusinessUnitCargoAmount: 'string',
            agreementBuEffectiveDate: 'string',
            agreementBuExpirationDate: 'string',
            agreementDefaultCargoAmount: component.createCargoModel.cargoDefaultAmount,
            existingESDocID: 'string',
            isCreateFlow: true
        };
        component.createCargoModel.cargoReleaseForm.setValue(fbx);
        service.checkbusinessUnitValues(component, no, exists);
        service.amountFormatter(component.createCargoModel.cargoDefaultAmount);
    });

    it('onCreateSectionQuery', () => {
        component.createCargoModel.selectedSectionsList = {
            customerSectionID: 12,
            customerSectionName: 'string',
            customerContractID: 34,
            customerContractName: 'string',
            sectionEffectiveDate: 'string',
            sectionExpirationDate: 'string',
            customerAgreementID: 344,
            customerAgreementName: 'string',
            customerContractNumber: 'string'
        };
        component.createCargoModel.cargoDefaultAmount = 123;
        component.createCargoModel.cargoType = 'Agreement';
        const fbx = {
            cargoValue: 123,
            selectContract: '',
            agreementType: 'contract',
            contract: {
                'label': {
                    'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                    'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                    'customerContractType': 'Legal', 'contractEffectiveDate':
                        '2019-06-11', 'contractExpirationDate': '2019-06-30'
                },
                'value': 'AWKE27Ident-AWKE27Desc'
            },
            businessUnit: [{ 'label': 'DCS', 'value': 'DCS' }],
            effectiveDate: '06/11/2019',
            expirationDate: '06/30/2019'
        };
        component.createCargoModel.cargoReleaseForm.setValue(fbx);
        const sectiondata = ({
            cargoReleaseType: component.createCargoModel.cargoType,
            customerSectionCargoDTO: {
                sectionID: component.createCargoModel.selectedSectionsList.customerSectionID,
                customerContractSectionCargoID: component.createCargoModel.selectedSectionsList.customerSectionName,
                sectionCargoAmount: service.amountFormatter(component.createCargoModel.cargoReleaseForm.controls['cargoValue'].value),
                sectionEffectiveDate: service.postDateFormatter
                    (component.createCargoModel.cargoReleaseForm.controls['effectiveDate'].value),
                sectionExpirationDate: service.postDateFormatter
                    (component.createCargoModel.cargoReleaseForm.controls['expirationDate'].value),
                agreementDefaultCargoAmount: service.amountFormatter(component.createCargoModel.cargoDefaultAmount),
                sectionName: component.createCargoModel.selectedSectionsList['customerSectionName'],
                existingESDocID: null,
                customerAgreementID: component.createCargoModel.agreementId.customerAgreementID
            }
        });
        spyOn(service, 'onCreateSectionQuery').and.returnValue(sectiondata);
        service.onCreateSectionQuery(component);
    });

    it('onCreateContractBuQuery', () => {
        component.createCargoModel.cargoDefaultAmount = 1000;
        component.createCargoModel.allContractCargoValues = [];
        component.createCargoModel.allContractCargoValues.push({
            'label': {
                'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                'customerContractType': 'Legal', 'contractEffectiveDate':
                    '2019-06-11', 'contractExpirationDate': '2019-06-30'
            },
            'value': 'AWKE27Ident-AWKE27Desc'
        });
        const fbx = {
            cargoValue: 100000,
            selectContract: '',
            agreementType: 'contract',
            contract: {
                'label': {
                    'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                    'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                    'customerContractType': 'Legal', 'contractEffectiveDate':
                        '2019-06-11', 'contractExpirationDate': '2019-06-30'
                },
                'value': 'AWKE27Ident-AWKE27Desc'
            },
            businessUnit: [{ 'label': 'DCS', 'value': 'DCS' }],
            effectiveDate: '06/11/2019',
            expirationDate: '06/30/2019'
        };
        component.createCargoModel.cargoReleaseForm.setValue(fbx);
        service.onCreateContractBuQuery(component);
    });

    it('iterateRowDataCargoBu', () => {
        component.createCargoModel.cargoDefaultAmount = 1000;
        component.createCargoModel.allContractCargoValues = [];
        component.createCargoModel.allContractCargoValues.push({
            'label': {
                'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                'customerContractType': 'Legal', 'contractEffectiveDate':
                    '2019-06-11', 'contractExpirationDate': '2019-06-30'
            },
            'value': 'AWKE27Ident-AWKE27Desc'
        });
        const fbx = {
            cargoValue: 100000,
            selectContract: '',
            agreementType: 'contract',
            contract: {
                'label': {
                    'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                    'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                    'customerContractType': 'Legal', 'contractEffectiveDate':
                        '2019-06-11', 'contractExpirationDate': '2019-06-30'
                },
                'value': 'AWKE27Ident-AWKE27Desc'
            },
            businessUnit: [{ 'label': 'DCS', 'value': 'DCS' }],
            effectiveDate: '06/11/2019',
            expirationDate: '06/30/2019'
        };
        component.createCargoModel.cargoReleaseForm.setValue(fbx);
        service.iterateRowDataCargoBu(component);
    });

    it('addedCargoBusinessUnitDto', () => {
        component.createCargoModel.cargoDefaultAmount = 1000;
        component.createCargoModel.allContractCargoValues = [];
        component.createCargoModel.allContractCargoValues.push({
            'label': {
                'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                'customerContractType': 'Legal', 'contractEffectiveDate':
                    '2019-06-11', 'contractExpirationDate': '2019-06-30'
            },
            'value': 'AWKE27Ident-AWKE27Desc'
        });
        const fbx = {
            cargoValue: 100000,
            selectContract: '',
            agreementType: 'contract',
            contract: {
                'label': {
                    'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                    'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                    'customerContractType': 'Legal', 'contractEffectiveDate':
                        '2019-06-11', 'contractExpirationDate': '2019-06-30'
                },
                'value': 'AWKE27Ident-AWKE27Desc'
            },
            businessUnit: [{ 'label': 'DCS', 'value': 'DCS' }],
            effectiveDate: '06/11/2019',
            expirationDate: '06/30/2019'
        };
        const arr = ['ICS', 'DCS'];
        const values = [{
            contractID: 12,
            customerContractBusinessUnitCargoID: 13,
            financeBusinessUnitCode: 'string',
            contractBusinessUnitCargoAmount: 'string',
            contractBuEffectiveDate: 'string',
            contractBuExpirationDate: 'string',
            agreementDefaultCargoAmount: 'string',
            action: 'string',
            contractDisplayName: 'string',
            contractName: 'string',
            contractNumber: 'string',
            contractType: 'string',
            customerAgreementID: 34,
            isCreateFlow: true,
            existingESDocID: 'string'
        }];
        component.createCargoModel.cargoReleaseForm.setValue(fbx);
        service.addedCargoBusinessUnitDto(arr, values, component);
    });

    it('checkCargoBusinessUnitValues', () => {
        component.createCargoModel.cargoDefaultAmount = 1000;
        component.createCargoModel.allContractCargoValues = [];
        component.createCargoModel.allContractCargoValues.push({
            'label': {
                'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                'customerContractType': 'Legal', 'contractEffectiveDate':
                    '2019-06-11', 'contractExpirationDate': '2019-06-30'
            },
            'value': 'AWKE27Ident-AWKE27Desc'
        });
        const fbx = {
            cargoValue: 100000,
            selectContract: '',
            agreementType: 'contract',
            contract: {
                'label': {
                    'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                    'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                    'customerContractType': 'Legal', 'contractEffectiveDate':
                        '2019-06-11', 'contractExpirationDate': '2019-06-30'
                },
                'value': 'AWKE27Ident-AWKE27Desc'
            },
            businessUnit: [{ 'label': 'DCS', 'value': 'DCS' }],
            effectiveDate: '06/11/2019',
            expirationDate: '06/30/2019'
        };
        const no = 1;
        const exists = {
            contractID: 12,
            customerContractBusinessUnitCargoID: 122,
            financeBusinessUnitCode: 'string',
            contractBusinessUnitCargoAmount: '123',
            contractBuEffectiveDate: '12/02/2019',
            contractBuExpirationDate: '12/02/2099',
            agreementDefaultCargoAmount: '11',
            action: 'string',
            contractDisplayName: 'string',
            contractName: 'string',
            contractNumber: 'string',
            contractType: 'string',
            customerAgreementID: 123,
            isCreateFlow: true,
            existingESDocID: 'string',
        };
        component.createCargoModel.cargoReleaseForm.setValue(fbx);
        service.checkCargoBusinessUnitValues(component, no, exists);
        service.amountFormatter(component.createCargoModel.cargoDefaultAmount);
    });

    it('onCreateSectionBuQuery', () => {
        component.createCargoModel.cargoDefaultAmount = 1000;
        component.createCargoModel.allContractCargoValues = [];
        component.createCargoModel.allContractCargoValues.push({
            'label': {
                'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                'customerContractType': 'Legal', 'contractEffectiveDate':
                    '2019-06-11', 'contractExpirationDate': '2019-06-30'
            },
            'value': 'AWKE27Ident-AWKE27Desc'
        });
        component.createCargoModel.selectedSectionsList = {
            customerSectionID: 12,
            customerSectionName: 'string',
            customerContractID: 34,
            customerContractName: 'string',
            sectionEffectiveDate: 'string',
            sectionExpirationDate: 'string',
            customerAgreementID: 344,
            customerAgreementName: 'string',
            customerContractNumber: 'string'
        };
        const fbx = {
            cargoValue: 100000,
            selectContract: '',
            agreementType: 'contract',
            contract: {
                'label': {
                    'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                    'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                    'customerContractType': 'Legal', 'contractEffectiveDate':
                        '2019-06-11', 'contractExpirationDate': '2019-06-30'
                },
                'value': 'AWKE27Ident-AWKE27Desc'
            },
            businessUnit: [{ 'label': 'DCS', 'value': 'DCS' }],
            effectiveDate: '06/11/2019',
            expirationDate: '06/30/2019'
        };
        component.createCargoModel.cargoReleaseForm.setValue(fbx);
        service.onCreateSectionBuQuery(component);
    });


    it('iterateRowDataSectionBu', () => {
        component.createCargoModel.cargoDefaultAmount = 1000;
        component.createCargoModel.allContractCargoValues = [];
        component.createCargoModel.allContractCargoValues.push({
            'label': {
                'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                'customerContractType': 'Legal', 'contractEffectiveDate':
                    '2019-06-11', 'contractExpirationDate': '2019-06-30'
            },
            'value': 'AWKE27Ident-AWKE27Desc'
        });
        component.createCargoModel.selectedSectionsList = {
            customerSectionID: 12,
            customerSectionName: 'string',
            customerContractID: 34,
            customerContractName: 'string',
            sectionEffectiveDate: 'string',
            sectionExpirationDate: 'string',
            customerAgreementID: 344,
            customerAgreementName: 'string',
            customerContractNumber: 'string'
        };
        const fbx = {
            cargoValue: 100000,
            selectContract: '',
            agreementType: 'contract',
            contract: {
                'label': {
                    'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                    'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                    'customerContractType': 'Legal', 'contractEffectiveDate':
                        '2019-06-11', 'contractExpirationDate': '2019-06-30'
                },
                'value': 'AWKE27Ident-AWKE27Desc'
            },
            businessUnit: [{ 'label': 'DCS', 'value': 'DCS' }],
            effectiveDate: '06/11/2019',
            expirationDate: '06/30/2019'
        };
        component.createCargoModel.cargoReleaseForm.setValue(fbx);
        service.iterateRowDataSectionBu(component);
    });

    it('checkCargoBusinessUnitValues', () => {
        component.createCargoModel.selectedSectionsList = {
            customerSectionID: 12,
            customerSectionName: 'string',
            customerContractID: 34,
            customerContractName: 'string',
            sectionEffectiveDate: 'string',
            sectionExpirationDate: 'string',
            customerAgreementID: 344,
            customerAgreementName: 'string',
            customerContractNumber: 'string'
        };
        component.createCargoModel.cargoDefaultAmount = 1000;
        component.createCargoModel.allContractCargoValues = [];
        component.createCargoModel.allContractCargoValues.push({
            'label': {
                'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                'customerContractType': 'Legal', 'contractEffectiveDate':
                    '2019-06-11', 'contractExpirationDate': '2019-06-30'
            },
            'value': 'AWKE27Ident-AWKE27Desc'
        });
        const fbx = {
            cargoValue: 100000,
            selectContract: '',
            agreementType: 'contract',
            contract: {
                'label': {
                    'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                    'customerContractName': 'updatedescMon Feb 04 2019 12:41:44 GMT+0000',
                    'customerContractType': 'Legal', 'contractEffectiveDate':
                        '2019-06-11', 'contractExpirationDate': '2019-06-30'
                },
                'value': 'AWKE27Ident-AWKE27Desc'
            },
            businessUnit: [{ 'label': 'DCS', 'value': 'DCS' }],
            effectiveDate: '06/11/2019',
            expirationDate: '06/30/2019'
        };
        const no = 1;
        const exists = {
            agreementDefaultCargoAmount: '100000.00',
            customerAgreementID: 572,
            customerSectionBusinessUnitCargoID: 275,
            existingESDocID: 'SB_572_274_275_276_277',
            financeBusinessUnitCargoID: 275,
            financeBusinessUnitCode: 'DCS',
            sectionBuEffectiveDate: '2019-06-05',
            sectionBuExpirationDate: '2099-12-31',
            sectionBusinessUnitCargoAmount: '100000.00',
            sectionID: 1164,
            sectionName: 'dggfere'
        };
        component.createCargoModel.cargoReleaseForm.setValue(fbx);
        service.checkSectionBusinessUnitValues(component, no, exists);
        service.amountFormatter(component.createCargoModel.cargoDefaultAmount);
    });
    it('iterateSectionBu', () => {
        service.iterateSectionBu(component);
    });
    it('postDateFormatter', () => {
        service.postDateFormatter('02/04/2019');
    });
    it('iterateBusinessUnit', () => {
        service.iterateBusinessUnit(component);
    });

    it('iterateContractBu', () => {
        service.iterateContractBu(component);
    });

    it('sectionListDtoFormation', () => {
        const key = 'default';
        service.sectionListDtoFormation(component.createCargoModel, key);
    });

    it('warningMessage', () => {
        service.warningMessage(messageService);
    });
});


