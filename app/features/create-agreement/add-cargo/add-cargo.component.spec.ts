import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FormBuilder, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { of } from 'rxjs';
import { AppModule } from '../../../app.module';
import { CreateAgreementModule } from './../create-agreement.module';

import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';
import { BroadcasterService } from './../../../shared/jbh-app-services/broadcaster.service';
import { LocalStorageService } from './../../../shared/jbh-app-services/local-storage.service';
import { AddCargoComponent } from './add-cargo.component';
import { AddCargoService } from './services/add-cargo.service';
import { AddCargoUtilsService } from './services/add-cargo-utils.service';
import { CreateCargoComponent } from './create-cargo/create-cargo.component';

describe('AddCargoComponent', () => {
    let component: AddCargoComponent;
    let fixture: ComponentFixture<AddCargoComponent>;
    let addCargoService: AddCargoService;
    let messageService: MessageService;
    const agreementId = {
        'customerAgreementID': 72, 'customerAgreementName': 'Advanced Glassfiber Yarns Llc (ADAI1)',
        'agreementType': 'Customer', 'ultimateParentAccountID': 135161, 'currencyCode': null, 'cargoReleaseAmount': null,
        'businessUnits': null, 'taskAssignmentIDs': null, 'effectiveDate': '1995-01-01', 'expirationDate': '2099-12-31',
        'invalidIndicator': 'N', 'invalidReasonTypeName': null, 'teams': null
    };
    const formBuilder: FormBuilder = new FormBuilder();
    let broadcasterService: BroadcasterService;
    let nextState: RouterStateSnapshot;
    const screenFinderEve: any = {
        'data': {
            'contractAssociation': null,
            'sectionAssociation': {
                'customerAgreementContractSectionID': 150,
                'customerAgreementContractSectionName': 'adaisect'
            }
        }
    };
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule, CreateAgreementModule, HttpClientTestingModule],
            declarations: [],
            providers: [{ provide: APP_BASE_HREF, useValue: '/' }, AddCargoService,
                BroadcasterService, LocalStorageService, AddCargoUtilsService, MessageService,
            { provide: RouterStateSnapshot, useValue: AddCargoComponent }]
        }).overrideComponent(CreateCargoComponent, {
            set: {
                selector: 'app-create-cargo',
                template: `<h6>Create Cargo</h6>`
            }
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AddCargoComponent);
        component = fixture.componentInstance;
        addCargoService = TestBed.get(AddCargoService);
        messageService = TestBed.get(MessageService);
        broadcasterService = TestBed.get(BroadcasterService);
        nextState = TestBed.get(RouterStateSnapshot);
        component.addCargoModel.agreementId = agreementId;
        component.addCargoModel.isSplitView = true;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call ngOnInit', () => {
        broadcasterService.broadcast('needToSave', true);
        component.ngOnInit();
    });

    it('should call ngOnDestroy', () => {
        component.ngOnDestroy();
    });

    it('should call saveSubscription', () => {
        component.saveSubscription();
    });

    it('should call valueChangesSubscription', () => {
        broadcasterService.broadcast('navigationStarts', nextState);
        component.valueChangesSubscription();
    });

    it('should call getGridValues', () => {
        const response = {
            'took': 17, 'timed_out': false, '_shards': {
                'total': 3, 'successful': 3, 'skipped': 0,
                'failed': 0
            }, 'hits': {
                'total': 1, 'max_score': null, 'hits': [{
                    '_index': 'pricing-customer-cargo-1-2019.05.08', '_type': 'doc', '_id': 'A_72_42', '_score': null, '_source': {
                        'uniqueDocID': 'A_72_42',
                        'agreementDefaultIndicator': 'Yes', 'customerAgreementID': 72, 'customerAgreementCargoIDs': [42],
                         'cargoReleaseAmount': 100000, 'contractAssociation': null, 'sectionAssociation': null,
                         'financeBusinessUnitAssociations': null, 'originalEffectiveDate': '1995-01-01',
                        'originalExpirationDate': '2099-12-31', 'effectiveDate': '1995-01-01',
                        'expirationDate': '2099-12-31', 'invalidIndicator': 'N', 'invalidReasonTypeName': 'Active', 'createProgramName':
                            'Sivanesan Sadhasivam', 'createTimestamp': '2019-05-29T07:23:25.309', 'createUserId': 'rcon770',
                        'lastUpdateProgramName': 'Sivanesan Sadhasivam', 'lastUpdateTimestamp': '2019-05-29T07:23:25.309',
                        'lastUpdateUserId': 'rcon770', 'cargoType': 'Agreement'
                    }, 'sort': ['agreement', 788918400000]
                }]
            }
        };
        spyOn(addCargoService, 'getCargoGrid').and.returnValue(of(response));
        component.getGridValues();
    });
    it('should call getGridValues-empty', () => {
        const response = {
            'took': 17, 'timed_out': false, '_shards': {
                'total': 3, 'successful': 3, 'skipped': 0,
                'failed': 0
            }, 'hits': {
                'total': 1, 'max_score': null, 'hits': []
            }
        };
        spyOn(addCargoService, 'getCargoGrid').and.returnValue(of(response));
        component.getGridValues();
    });
    it('should call setGridValues', () => {
        component.addCargoModel.agreementId = agreementId;
        const index = 0;
        const element = {
            'agreementDefaultIndicator': 'Yes',
            'customerAgreementID': 72,
            'businessUnitCode': ['--'],
            'cargoAmount': '$100,000.00',
            'customerAgreementCargoIDs': [42],
            'cargoReleaseAmount': 100000,
            'cargoType': 'Agreement',
            'contractAssociation': null,
            'createProgramName': 'Sivanesan Sadhasivam',
            'createTimestamp': '2019-05-29T07:23:25.309',
            'createUserId': 'rcon770',
            'customerContractName': '--',
            'customerSectionName': '--',
            'effectiveDate': '01/01/1995',
            'expirationDate': '12/31/2099',
            'financeBusinessUnitAssociations': null,
            'index': 0,
            'invalidIndicator': 'N',
            'invalidReasonTypeName': 'Active',
            'lastUpdateProgramName': 'Sivanesan Sadhasivam',
            'lastUpdateTimestamp': '2019-05-29T07:23:25.309',
            'lastUpdateUserId': 'rcon770',
            'originalEffectiveDate': '1995-01-01',
            'originalExpirationDate': '2099-12-31',
            'sectionAssociation': null,
            'uniqueDocID': 'A_72_42'
        };
        component.setGridValues(element, index);
    });

    it('should call iterateContractValue', () => {

        const element: any = {
            'customerAgreementContractID': 153, 'customerContractName': 'adaidesc', 'customerContractNumber':
                'ADAI1identifier', 'contractTypeName': 'Legal', 'contractDisplayName': 'ADAI1identifier-adaidesc'
        };

        component.iterateContractValue(element);
    });
    it('should call iterateContractValue-else', () => {

        const element: any = null;
        component.iterateContractValue(element);
    });

    it('should call amountFormatter', () => {
        expect(component.amountFormatter('1000.00')).toBe('1000.00');
    });
    it('should call amountFormatter-else', () => {
        expect(component.amountFormatter('1000')).toBe('1000.00');
    });
    it('should call deleteUpdated', () => {
        component.deleteUpdated();
    });

    it('should call iterateRowData-Agreement', () => {
        const rowValues = {
            'uniqueDocID': 'A_72_42', 'agreementDefaultIndicator': 'Yes', 'customerAgreementID': 72, 'customerAgreementCargoIDs':
                [42], 'cargoReleaseAmount': 100000, 'contractAssociation': null, 'sectionAssociation': null,
                'financeBusinessUnitAssociations': null, 'originalEffectiveDate': '1995-01-01', 'originalExpirationDate': '2099-12-31',
                 'effectiveDate': '01/01/1995', 'expirationDate': '12/31/2099', 'invalidIndicator': 'N', 'invalidReasonTypeName': 'Active',
            'createProgramName': 'Sivanesan Sadhasivam', 'createTimestamp': '2019-05-29T07:23:25.309', 'createUserId':
                'rcon770', 'lastUpdateProgramName': 'Sivanesan Sadhasivam', 'lastUpdateTimestamp': '2019-05-29T07:23:25.309',
            'lastUpdateUserId': 'rcon770', 'cargoType': 'Agreement', 'cargoAmount': '$100,000.00', 'index': 0
        };
        component.iterateRowData(rowValues);
    });
    it('should call iterateRowData-Contract', () => {
        const rowValues = {
            'uniqueDocID': 'C_82_13',
            'agreementDefaultIndicator': 'No',
            'customerAgreementID': 82,
            'customerAgreementCargoIDs': [
                13
            ],
            'cargoReleaseAmount': 12345,
            'contractAssociation': {
                'customerAgreementContractID': 178,
                'customerContractName': 'AELA44Desc1',
                'customerContractNumber': '1929',
                'contractTypeName': 'Tariff',
                'contractDisplayName': '1929 (AELA44Desc1)'
            },
            'sectionAssociation': null,
            'financeBusinessUnitAssociations': null,
            'originalEffectiveDate': '2019-05-29',
            'originalExpirationDate': '2099-12-31',
            'effectiveDate': '05/29/2019',
            'expirationDate': '12/31/2099',
            'invalidIndicator': 'N',
            'invalidReasonTypeName': 'Active',
            'createProgramName': 'Sivanesan Sadhasivam',
            'createTimestamp': '2019-05-29T11:32:39.581',
            'createUserId': 'rcon770',
            'lastUpdateProgramName': 'Sivanesan Sadhasivam',
            'lastUpdateTimestamp': '2019-05-29T11:32:39.581',
            'lastUpdateUserId': 'rcon770',
            'cargoType': 'Contract',
            'cargoAmount': '$12,345.00',
            'index': 1
        };
        component.iterateRowData(rowValues);
    });
    it('should call iterateRowData-ContractBU', () => {
        const rowValues = {
            'uniqueDocID': 'CB_72_35_36',
            'agreementDefaultIndicator': 'No',
            'customerAgreementID': 72,
            'customerAgreementCargoIDs': [
                35,
                36
            ],
            'cargoReleaseAmount': 45678,
            'contractAssociation': {
                'customerAgreementContractID': 153,
                'customerContractName': 'adaidesc',
                'customerContractNumber': 'ADAI1identifier',
                'contractTypeName': 'Legal',
                'contractDisplayName': 'ADAI1identifier-adaidesc'
            },
            'sectionAssociation': null,
            'financeBusinessUnitAssociations': [
                {
                    'customerAgreementBusinessUnitCargoID': 35,
                    'financeBusinessUnitCode': 'DCS'
                },
                {
                    'customerAgreementBusinessUnitCargoID': 36,
                    'financeBusinessUnitCode': 'JBI'
                }
            ],
            'originalEffectiveDate': '2019-05-29',
            'originalExpirationDate': '2099-12-31',
            'effectiveDate': '05/29/2019',
            'expirationDate': '12/31/2099',
            'invalidIndicator': 'N',
            'invalidReasonTypeName': 'Active',
            'createProgramName': 'Sivanesan Sadhasivam',
            'createTimestamp': '2019-05-29T07:43:17.69',
            'createUserId': 'rcon770',
            'lastUpdateProgramName': 'Sivanesan Sadhasivam',
            'lastUpdateTimestamp': '2019-05-29T07:43:17.69',
            'lastUpdateUserId': 'rcon770',
            'cargoType': 'ContractBU',
            'cargoAmount': '$45,678.00',
            'index': 1
        };
        component.iterateRowData(rowValues);
    });
    it('should call iterateRowData-SectionBU', () => {
        const rowValues = {
            'uniqueDocID': 'SB_72_41',
            'agreementDefaultIndicator': 'No',
            'customerAgreementID': 72,
            'customerAgreementCargoIDs': [
                41
            ],
            'cargoReleaseAmount': 56789,
            'contractAssociation': null,
            'sectionAssociation': {
                'customerAgreementContractSectionID': 150,
                'customerAgreementContractSectionName': 'adaisect'
            },
            'financeBusinessUnitAssociations': [
                {
                    'customerAgreementBusinessUnitCargoID': 41,
                    'financeBusinessUnitCode': 'ICS'
                }
            ],
            'originalEffectiveDate': '2019-05-29',
            'originalExpirationDate': '2099-12-31',
            'effectiveDate': '05/29/2019',
            'expirationDate': '12/31/2099',
            'invalidIndicator': 'N',
            'invalidReasonTypeName': 'Active',
            'createProgramName': 'Sivanesan Sadhasivam',
            'createTimestamp': '2019-05-29T07:50:57.94',
            'createUserId': 'rcon770',
            'lastUpdateProgramName': 'Sivanesan Sadhasivam',
            'lastUpdateTimestamp': '2019-05-29T07:50:57.94',
            'lastUpdateUserId': 'rcon770',
            'cargoType': 'SectionBU',
            'cargoAmount': '$56,789.00',
            'index': 2
        };
        component.iterateRowData(rowValues);
    });
    it('should call iterateRowData-AgreementBU', () => {
        const rowValues = {
            'uniqueDocID': 'AB_72_18',
            'agreementDefaultIndicator': 'No',
            'customerAgreementID': 72,
            'customerAgreementCargoIDs': [
                18
            ],
            'cargoReleaseAmount': 67890,
            'contractAssociation': null,
            'sectionAssociation': null,
            'financeBusinessUnitAssociations': [
                {
                    'customerAgreementBusinessUnitCargoID': 18,
                    'financeBusinessUnitCode': 'DCS'
                }
            ],
            'originalEffectiveDate': '1995-01-01',
            'originalExpirationDate': '2099-12-31',
            'effectiveDate': '01/01/1995',
            'expirationDate': '12/31/2099',
            'invalidIndicator': 'N',
            'invalidReasonTypeName': 'Active',
            'createProgramName': 'Sivanesan Sadhasivam',
            'createTimestamp': '2019-05-29T07:54:13.417',
            'createUserId': 'rcon770',
            'lastUpdateProgramName': 'Sivanesan Sadhasivam',
            'lastUpdateTimestamp': '2019-05-29T07:54:13.417',
            'lastUpdateUserId': 'rcon770',
            'cargoType': 'AgreementBU',
            'cargoAmount': '$67,890.00',
            'index': 1
        };
        component.iterateRowData(rowValues);
    });
    it('should call dateFormatter', () => {
        expect(component.dateFormatter('1995-01-01')).toBe('01/01/1995');
    });
    it('should call onRowSelect - checkBox', () => {
        const checkBox: any = {
            'data': {
                'uniqueDocID': 'SB_72_41',
                'agreementDefaultIndicator': 'No',
                'customerAgreementID': 72,
                'customerAgreementCargoIDs': [
                    41],
                'cargoReleaseAmount': 56789,
                'contractAssociation': null,
                'sectionAssociation': {
                    'customerAgreementContractSectionID': 150,
                    'customerAgreementContractSectionName': 'adaisect'
                },
                'financeBusinessUnitAssociations': [
                    {
                        'customerAgreementBusinessUnitCargoID': 41,
                        'financeBusinessUnitCode': 'ICS'
                    }],
                'originalEffectiveDate': '2019-05-29',
                'originalExpirationDate': '2099-12-31',
                'effectiveDate': '05/29/2019',
                'expirationDate': '12/31/2099',
                'invalidIndicator': 'N',
                'invalidReasonTypeName': 'Active',
                'createProgramName': 'Sivanesan Sadhasivam',
                'createTimestamp': '2019-05-29T07:50:57.94',
                'createUserId': 'rcon770',
                'lastUpdateProgramName': 'Sivanesan Sadhasivam',
                'lastUpdateTimestamp': '2019-05-29T07:50:57.94',
                'lastUpdateUserId': 'rcon770',
                'cargoType': 'SectionBU',
                'cargoAmount': '$56,789.00',
                'index': 3,
                'businessUnitCode': [
                    'ICS'],
                'customerContractName': '--',
                'customerSectionName': 'adaisect'
            },
            'type': 'checkbox'
        };
        component.onRowSelect(checkBox);
    });
    it('should call onRowSelect - select', () => {
        const select: any = {
            'originalEvent': {
                'isTrusted': true
            },
            'data': {
                'uniqueDocID': 'SB_72_41',
                'agreementDefaultIndicator': 'No',
                'customerAgreementID': 72,
                'customerAgreementCargoIDs': [
                    41
                ],
                'cargoReleaseAmount': 56789,
                'contractAssociation': null,
                'sectionAssociation': {
                    'customerAgreementContractSectionID': 150,
                    'customerAgreementContractSectionName': 'adaisect'
                },
                'financeBusinessUnitAssociations': [
                    {
                        'customerAgreementBusinessUnitCargoID': 41,
                        'financeBusinessUnitCode': 'ICS'
                    }
                ],
                'originalEffectiveDate': '2019-05-29',
                'originalExpirationDate': '2099-12-31',
                'effectiveDate': '05/29/2019',
                'expirationDate': '12/31/2099',
                'invalidIndicator': 'N',
                'invalidReasonTypeName': 'Active',
                'createProgramName': 'Sivanesan Sadhasivam',
                'createTimestamp': '2019-05-29T07:50:57.94',
                'createUserId': 'rcon770',
                'lastUpdateProgramName': 'Sivanesan Sadhasivam',
                'lastUpdateTimestamp': '2019-05-29T07:50:57.94',
                'lastUpdateUserId': 'rcon770',
                'cargoType': 'SectionBU',
                'cargoAmount': '$56,789.00',
                'index': 3,
                'businessUnitCode': [
                    'ICS'
                ],
                'customerContractName': '--',
                'customerSectionName': 'adaisect'
            },
            'type': 'row'
        };
        component.onRowSelect(select);
    });

    it('should call screenFinder-If', () => {
        component.addCargoModel.index = 0;
        screenFinderEve['data']['contractAssociation'] = {
            'customerAgreementContractID': 153,
            'customerContractName': 'adaidesc',
            'customerContractNumber': 'ADAI1identifier',
            'contractTypeName': 'Legal',
            'contractDisplayName': 'ADAI1identifier-adaidesc'
        };
        component.screenFinder(screenFinderEve);
    });
    it('should call screenFinder-ElseIf', () => {
        component.addCargoModel.index = 0;
        component.screenFinder(screenFinderEve);
    });
    it('should call screenFinder-Else', () => {
        component.addCargoModel.index = 0;
        screenFinderEve['data']['contractAssociation'] = null;
        screenFinderEve['data']['sectionAssociation'] = null;
        component.screenFinder(screenFinderEve);
    });
    it('should call defaultCargoValue-No', () => {
        const rowValue: any = {
            'uniqueDocID': 'SB_72_41',
            'agreementDefaultIndicator': 'No',
            'customerAgreementID': 72,
            'customerAgreementCargoIDs': [
                41
            ],
            'cargoReleaseAmount': 56789,
            'contractAssociation': null,
            'sectionAssociation': {
                'customerAgreementContractSectionID': 150,
                'customerAgreementContractSectionName': 'adaisect'
            },
            'financeBusinessUnitAssociations': [
                {
                    'customerAgreementBusinessUnitCargoID': 41,
                    'financeBusinessUnitCode': 'ICS'
                }
            ],
            'originalEffectiveDate': '2019-05-29',
            'originalExpirationDate': '2099-12-31',
            'effectiveDate': '05/29/2019',
            'expirationDate': '12/31/2099',
            'invalidIndicator': 'N',
            'invalidReasonTypeName': 'Active',
            'createProgramName': 'Sivanesan Sadhasivam',
            'createTimestamp': '2019-05-29T07:50:57.94',
            'createUserId': 'rcon770',
            'lastUpdateProgramName': 'Sivanesan Sadhasivam',
            'lastUpdateTimestamp': '2019-05-29T07:50:57.94',
            'lastUpdateUserId': 'rcon770',
            'cargoType': 'SectionBU',
            'cargoAmount': '$56,789.00',
            'index': 3,
            'businessUnitCode': [
                'ICS'
            ],
            'customerContractName': '--',
            'customerSectionName': 'adaisect'
        };
        component.defaultCargoValue(rowValue);
    });
    it('should call defaultCargoValue-Yes', () => {
        const rowValue: any = {
            'uniqueDocID': 'SB_72_41',
            'agreementDefaultIndicator': 'Yes',
            'customerAgreementID': 72,
            'customerAgreementCargoIDs': [
                41
            ],
            'cargoReleaseAmount': 56789,
            'contractAssociation': null,
            'sectionAssociation': {
                'customerAgreementContractSectionID': 150,
                'customerAgreementContractSectionName': 'adaisect'
            },
            'financeBusinessUnitAssociations': [
                {
                    'customerAgreementBusinessUnitCargoID': 41,
                    'financeBusinessUnitCode': 'ICS'
                }
            ],
            'originalEffectiveDate': '2019-05-29',
            'originalExpirationDate': '2099-12-31',
            'effectiveDate': '05/29/2019',
            'expirationDate': '12/31/2099',
            'invalidIndicator': 'N',
            'invalidReasonTypeName': 'Active',
            'createProgramName': 'Sivanesan Sadhasivam',
            'createTimestamp': '2019-05-29T07:50:57.94',
            'createUserId': 'rcon770',
            'lastUpdateProgramName': 'Sivanesan Sadhasivam',
            'lastUpdateTimestamp': '2019-05-29T07:50:57.94',
            'lastUpdateUserId': 'rcon770',
            'cargoType': 'SectionBU',
            'cargoAmount': '$56,789.00',
            'index': 3,
            'businessUnitCode': [
                'ICS'
            ],
            'customerContractName': '--',
            'customerSectionName': 'adaisect'
        };
        component.defaultCargoValue(rowValue);
    });
    it('should call onRowUnselect', () => {
        const select: any = {
            'originalEvent': {
                'isTrusted': true
            },
            'data': {
                'uniqueDocID': 'SB_72_41',
                'agreementDefaultIndicator': 'No',
                'customerAgreementID': 72,
                'customerAgreementCargoIDs': [
                    41],
                'cargoReleaseAmount': 56789,
                'contractAssociation': null,
                'sectionAssociation': {
                    'customerAgreementContractSectionID': 150,
                    'customerAgreementContractSectionName': 'adaisect'
                },
                'financeBusinessUnitAssociations': [
                    {
                        'customerAgreementBusinessUnitCargoID': 41,
                        'financeBusinessUnitCode': 'ICS'
                    }],
                'originalEffectiveDate': '2019-05-29',
                'originalExpirationDate': '2099-12-31',
                'effectiveDate': '05/29/2019',
                'expirationDate': '12/31/2099',
                'invalidIndicator': 'N',
                'invalidReasonTypeName': 'Active',
                'createProgramName': 'Sivanesan Sadhasivam',
                'createTimestamp': '2019-05-29T07:50:57.94',
                'createUserId': 'rcon770',
                'lastUpdateProgramName': 'Sivanesan Sadhasivam',
                'lastUpdateTimestamp': '2019-05-29T07:50:57.94',
                'lastUpdateUserId': 'rcon770',
                'cargoType': 'SectionBU',
                'cargoAmount': '$56,789.00',
                'index': 3,
                'businessUnitCode': [
                    'ICS'],
                'customerContractName': '--',
                'customerSectionName': 'adaisect'
            },
            'type': 'row'
        };
        const delList: any = [
            {
                'uniqueDocID': 'SB_72_41',
                'agreementDefaultIndicator': 'No',
                'customerAgreementID': 72,
                'customerAgreementCargoIDs': [
                    41],
                'cargoReleaseAmount': 56789,
                'contractAssociation': null,
                'sectionAssociation': {
                    'customerAgreementContractSectionID': 150,
                    'customerAgreementContractSectionName': 'adaisect'
                },
                'financeBusinessUnitAssociations': [
                    {
                        'customerAgreementBusinessUnitCargoID': 41,
                        'financeBusinessUnitCode': 'ICS'
                    }],
                'originalEffectiveDate': '2019-05-29',
                'originalExpirationDate': '2099-12-31',
                'effectiveDate': '05/29/2019',
                'expirationDate': '12/31/2099',
                'invalidIndicator': 'N',
                'invalidReasonTypeName': 'Active',
                'createProgramName': 'Sivanesan Sadhasivam',
                'createTimestamp': '2019-05-29T07:50:57.94',
                'createUserId': 'rcon770',
                'lastUpdateProgramName': 'Sivanesan Sadhasivam',
                'lastUpdateTimestamp': '2019-05-29T07:50:57.94',
                'lastUpdateUserId': 'rcon770',
                'cargoType': 'SectionBU',
                'cargoAmount': '$56,789.00',
                'index': 3,
                'businessUnitCode': [
                    'ICS'],
                'customerContractName': '--',
                'customerSectionName': 'adaisect'
            }];
        component.addCargoModel.deletedCargoList = delList;
        component.onRowUnselect(select);
    });

    it('should call onRowUnselect', () => {
        const select: any = {
            'originalEvent': {
                'isTrusted': true
            },
            'data': {
                'uniqueDocID': 'SB_72_41',
                'agreementDefaultIndicator': 'No',
                'customerAgreementID': 72,
                'customerAgreementCargoIDs': [
                    41],
                'cargoReleaseAmount': 56789,
                'contractAssociation': null,
                'sectionAssociation': {
                    'customerAgreementContractSectionID': 150,
                    'customerAgreementContractSectionName': 'adaisect'
                },
                'financeBusinessUnitAssociations': [
                    {
                        'customerAgreementBusinessUnitCargoID': 41,
                        'financeBusinessUnitCode': 'ICS'
                    }],
                'originalEffectiveDate': '2019-05-29',
                'originalExpirationDate': '2099-12-31',
                'effectiveDate': '05/29/2019',
                'expirationDate': '12/31/2099',
                'invalidIndicator': 'N',
                'invalidReasonTypeName': 'Active',
                'createProgramName': 'Sivanesan Sadhasivam',
                'createTimestamp': '2019-05-29T07:50:57.94',
                'createUserId': 'rcon770',
                'lastUpdateProgramName': 'Sivanesan Sadhasivam',
                'lastUpdateTimestamp': '2019-05-29T07:50:57.94',
                'lastUpdateUserId': 'rcon770',
                'cargoType': 'SectionBU',
                'cargoAmount': '$56,789.00',
                'index': 3,
                'businessUnitCode': [
                    'ICS'],
                'customerContractName': '--',
                'customerSectionName': 'adaisect'
            },
            'type': 'row'
        };
        const delList: any = [
            {
                'uniqueDocID': 'SB_72_41',
                'agreementDefaultIndicator': 'No',
                'customerAgreementID': 72,
                'customerAgreementCargoIDs': [
                    41],
                'cargoReleaseAmount': 56789,
                'contractAssociation': null,
                'sectionAssociation': {
                    'customerAgreementContractSectionID': 150,
                    'customerAgreementContractSectionName': 'adaisect'
                },
                'financeBusinessUnitAssociations': [
                    {
                        'customerAgreementBusinessUnitCargoID': 41,
                        'financeBusinessUnitCode': 'ICS'
                    }],
                'originalEffectiveDate': '2019-05-29',
                'originalExpirationDate': '2099-12-31',
                'effectiveDate': '05/29/2019',
                'expirationDate': '12/31/2099',
                'invalidIndicator': 'N',
                'invalidReasonTypeName': 'Active',
                'createProgramName': 'Sivanesan Sadhasivam',
                'createTimestamp': '2019-05-29T07:50:57.94',
                'createUserId': 'rcon770',
                'lastUpdateProgramName': 'Sivanesan Sadhasivam',
                'lastUpdateTimestamp': '2019-05-29T07:50:57.94',
                'lastUpdateUserId': 'rcon770',
                'cargoType': 'SectionBU',
                'cargoAmount': '$56,789.00',
                'index': 4,
                'businessUnitCode': [
                    'ICS'],
                'customerContractName': '--',
                'customerSectionName': 'adaisect'
            }];
        component.addCargoModel.deletedCargoList = delList;
        component.onRowUnselect(select);
    });
    it('should call onAddCargo', () => {
        const cargoList: any = [{
            'uniqueDocID': 'A_72_42', 'agreementDefaultIndicator': 'Yes', 'customerAgreementID': 72, 'customerAgreementCargoIDs': [42],
            'cargoReleaseAmount': 100000, 'contractAssociation': null, 'sectionAssociation': null, 'financeBusinessUnitAssociations': null,
            'originalEffectiveDate': '1995-01-01', 'originalExpirationDate': '2099-12-31',
            'effectiveDate': '01/01/1995', 'expirationDate': '12/31/2099', 'invalidIndicator': 'N', 'invalidReasonTypeName': 'Active',
            'createProgramName': 'Sivanesan Sadhasivam', 'createTimestamp': '2019-05-29T07:23:25.309', 'createUserId': 'rcon770',
            'lastUpdateProgramName': 'Sivanesan Sadhasivam', 'lastUpdateTimestamp': '2019-05-29T07:23:25.309',
            'lastUpdateUserId': 'rcon770', 'cargoType': 'Agreement', 'cargoAmount': '$100,000.00', 'index': 0,
            'businessUnitCode': ['--'], 'customerContractName': '--', 'customerSectionName': '--'
        }];
        component.addCargoModel.cargoList = cargoList;
        component.onAddCargo();
    });
    it('should call onAddCargo-empty', () => {
        component.addCargoModel.cargoList = [];
        component.onAddCargo();
    });
    it('should call onClickDelete', () => {
        component.onClickDelete();
    });
    it('should call onDelete-No', () => {
        const delList: any = [
            {
                'uniqueDocID': 'SB_72_41_42',
                'agreementDefaultIndicator': 'No',
                'customerAgreementID': 72,
                'customerAgreementCargoIDs': [
                    41,
                    42
                ],
                'cargoReleaseAmount': 56788,
                'contractAssociation': null,
                'sectionAssociation': {
                    'customerAgreementContractSectionID': 150,
                    'customerAgreementContractSectionName': 'adaisect'
                },
                'financeBusinessUnitAssociations': [
                    {
                        'customerAgreementBusinessUnitCargoID': 42,
                        'financeBusinessUnitCode': 'DCS'
                    },
                    {
                        'customerAgreementBusinessUnitCargoID': 41,
                        'financeBusinessUnitCode': 'ICS'
                    }
                ],
                'originalEffectiveDate': '2019-05-29',
                'originalExpirationDate': '2099-12-31',
                'effectiveDate': '05/29/2019',
                'expirationDate': '12/31/2099',
                'invalidIndicator': 'N',
                'invalidReasonTypeName': 'Active',
                'createProgramName': 'Sivanesan Sadhasivam',
                'createTimestamp': '2019-05-29T07:50:57.94',
                'createUserId': 'rcon770',
                'lastUpdateProgramName': 'Sivanesan Sadhasivam',
                'lastUpdateTimestamp': '2019-05-29T08:11:28.289',
                'lastUpdateUserId': 'rcon770',
                'cargoType': 'SectionBU',
                'cargoAmount': '$56,788.00',
                'index': 3,
                'businessUnitCode': [
                    'DCS',
                    'ICS'
                ],
                'customerContractName': '--',
                'customerSectionName': 'adaisect'
            }
        ];
        component.addCargoModel.deletedCargoList = delList;
        spyOn(addCargoService, 'deleteGridData').and.returnValue(of(null));
        component.onDelete();
    });
    it('should call onDelete-Yes', () => {
        const delList: any = [
            {
                'uniqueDocID': 'SB_72_41_42',
                'agreementDefaultIndicator': 'Yes',
                'customerAgreementID': 72,
                'customerAgreementCargoIDs': [
                    41,
                    42
                ],
                'cargoReleaseAmount': 56788,
                'contractAssociation': null,
                'sectionAssociation': {
                    'customerAgreementContractSectionID': 150,
                    'customerAgreementContractSectionName': 'adaisect'
                },
                'financeBusinessUnitAssociations': [
                    {
                        'customerAgreementBusinessUnitCargoID': 42,
                        'financeBusinessUnitCode': 'DCS'
                    },
                    {
                        'customerAgreementBusinessUnitCargoID': 41,
                        'financeBusinessUnitCode': 'ICS'
                    }
                ],
                'originalEffectiveDate': '2019-05-29',
                'originalExpirationDate': '2099-12-31',
                'effectiveDate': '05/29/2019',
                'expirationDate': '12/31/2099',
                'invalidIndicator': 'N',
                'invalidReasonTypeName': 'Active',
                'createProgramName': 'Sivanesan Sadhasivam',
                'createTimestamp': '2019-05-29T07:50:57.94',
                'createUserId': 'rcon770',
                'lastUpdateProgramName': 'Sivanesan Sadhasivam',
                'lastUpdateTimestamp': '2019-05-29T08:11:28.289',
                'lastUpdateUserId': 'rcon770',
                'cargoType': 'SectionBU',
                'cargoAmount': '$56,788.00',
                'index': 3,
                'businessUnitCode': [
                    'DCS',
                    'ICS'
                ],
                'customerContractName': '--',
                'customerSectionName': 'adaisect'
            }
        ];
        component.addCargoModel.deletedCargoList = delList;
        component.onDelete();
    });

    it('should call onHeaderCheckboxToggle-true', () => {
        const event: any = { 'originalEvent': { 'isTrusted': true }, 'checked': true };
        component.onHeaderCheckboxToggle(event);
    });
    it('should call onHeaderCheckboxToggle-false', () => {
        const event: any = { 'originalEvent': { 'isTrusted': true }, 'checked': false };
        component.onHeaderCheckboxToggle(event);
    });
    it('should call onCancel', () => {
        component.onCancel();
    });
    it('should call closeSplitView', () => {
        component.closeSplitView();
    });

    it('should call onBack', () => {
        component.onBack();
    });
    it('should call onCreateAgreement', () => {
        const cargoList: any = [
            {
                'uniqueDocID': 'A_82_49',
                'agreementDefaultIndicator': 'Yes',
                'customerAgreementID': 82,
                'customerAgreementCargoIDs': [
                    49
                ],
                'cargoReleaseAmount': 100000,
                'contractAssociation': null,
                'sectionAssociation': null,
                'financeBusinessUnitAssociations': null,
                'originalEffectiveDate': '1995-01-01',
                'originalExpirationDate': '2099-12-31',
                'effectiveDate': '01/01/1995',
                'expirationDate': '12/31/2099',
                'invalidIndicator': 'N',
                'invalidReasonTypeName': 'Active',
                'createProgramName': 'Sivanesan Sadhasivam',
                'createTimestamp': '2019-05-29T11:30:20.269',
                'createUserId': 'rcon770',
                'lastUpdateProgramName': 'Sivanesan Sadhasivam',
                'lastUpdateTimestamp': '2019-05-29T11:30:20.269',
                'lastUpdateUserId': 'rcon770',
                'cargoType': 'Agreement',
                'cargoAmount': '$100,000.00',
                'index': 0,
                'businessUnitCode': [
                    '--'
                ],
                'customerContractName': '--',
                'customerSectionName': '--'
            },
            {
                'uniqueDocID': 'C_82_13',
                'agreementDefaultIndicator': 'No',
                'customerAgreementID': 82,
                'customerAgreementCargoIDs': [
                    13
                ],
                'cargoReleaseAmount': 12345,
                'contractAssociation': {
                    'customerAgreementContractID': 178,
                    'customerContractName': 'AELA44Desc1',
                    'customerContractNumber': '1929',
                    'contractTypeName': 'Tariff',
                    'contractDisplayName': '1929 (AELA44Desc1)'
                },
                'sectionAssociation': null,
                'financeBusinessUnitAssociations': null,
                'originalEffectiveDate': '2019-05-29',
                'originalExpirationDate': '2099-12-31',
                'effectiveDate': '05/29/2019',
                'expirationDate': '12/31/2099',
                'invalidIndicator': 'N',
                'invalidReasonTypeName': 'Active',
                'createProgramName': 'Sivanesan Sadhasivam',
                'createTimestamp': '2019-05-29T11:32:39.581',
                'createUserId': 'rcon770',
                'lastUpdateProgramName': 'Sivanesan Sadhasivam',
                'lastUpdateTimestamp': '2019-05-29T11:32:39.581',
                'lastUpdateUserId': 'rcon770',
                'cargoType': 'Contract',
                'cargoAmount': '$12,345.00',
                'index': 1,
                'businessUnitCode': [
                    '--'
                ],
                'customerContractName': '1929-AELA44Desc1',
                'customerSectionName': '--'
            }
        ];
        component.addCargoModel.cargoList = cargoList;
        component.onCreateAgreement();
    });
    it('should call onCreateAgreement-empty', () => {
        component.addCargoModel.cargoList = [];
        component.onCreateAgreement();
    });
    it('should call validateAgreement', () => {
        component.addCargoModel.screen = 'createDefault';
        component.validateAgreement();
    });
    it('should call validateAgreement-else', () => {
        component.validateAgreement();
    });
    it('should call onCreateNewAgreement', () => {
        spyOn(addCargoService, 'createNewAgreement').and.returnValue(of(82));
        component.onCreateNewAgreement();
    });

    it('should call onSave', () => {
        component.onSave();
    });
    it('should call toastMessage-error', () => {
        component.toastMessage(messageService, 'error', 'You need to have atleast Agreement Cargo Release for Agreement to be created');
    });
    it('should call toastMessage-success', () => {
        component.toastMessage(messageService, 'success', 'You need to have atleast Agreement Cargo Release for Agreement to be created');
    });

    it('should call onClickYes-delete', () => {
        component.onClickYes('delete');
    });
    it('should call onClickYes-cancel', () => {
        component.onClickYes('cancel');
    });
    it('should call onClickNo-delete', () => {
        component.onClickNo('delete');
    });
    xit('should call onClickNo-cancel', () => {
        component.onClickNo('cancel');
    });
    xit('should call onClickCancel', () => {
        component.addCargoModel.agreementId = agreementId;
        fixture.detectChanges();
        component.onClickCancel();

    });
    it('should call onClickSave', () => {
        component.onClickSave();
    });
});
