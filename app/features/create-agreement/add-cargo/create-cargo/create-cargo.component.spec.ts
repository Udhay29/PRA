import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/components/common/messageservice';
import { FormBuilder } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';
import { of } from 'rxjs';
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from '../../../../app.module';
import { CreateAgreementModule } from '../../create-agreement.module';
import { CreateCargoComponent } from './create-cargo.component';
import { CreateCargoService } from './services/create-cargo.service';
import { LocalStorageService } from './../../../../shared/jbh-app-services/local-storage.service';
import { CreateCargoUtilsService } from './services/create-cargo-utils.service';

describe('CreateCargoComponent', () => {
    let component: CreateCargoComponent;
    let fixture: ComponentFixture<CreateCargoComponent>;
    let createCargoService: CreateCargoService;
    let messageService: MessageService;
    const formBuilder: FormBuilder = new FormBuilder();
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


    const populateSection: any = [{
        'cargoAmount': 3423,
        'customerAgreementID': null,
        'customerAgreementCargoID': null,
        'agreementDefault': 'Yes',
        'customerContractID': 27,
        'customerContractNumber': 'testIdentifier',
        'customerContractName': 'descADT21',
        'customerContractCargoID': null,
        'customerSectionCargoID': null,
        'customerSectionName': 'adTi123section',
        'customerSectionID': 48,
        'customerAgreementBusinessUnitCargoList': [],
        'customerContractBusinessUnitCargoList': null,
        'customerSectionBusinessUnitCargo': [
            {
                'customerAgreementID': null,
                'sectionID': 48,
                'sectionName': null,
                'customerSectionBusinessUnitCargoID': 4,
                'action': null,
                'financeBusinessUnitCode': 'JBT',
                'sectionBusinessUnitCargoAmount': 12344,
                'currencyCode': 'USD',
                'sectionBuEffectiveDate': '2019-05-27',
                'sectionBuExpirationDate': '2019-07-31',
                'agreementDefaultCargoAmount': null,
                'existingESDocID': null,
                'isCreateFlow': null
            },
            {
                'customerAgreementID': null,
                'sectionID': 48,
                'sectionName': null,
                'customerSectionBusinessUnitCargoID': 5,
                'action': null,
                'financeBusinessUnitCode': 'DCS',
                'sectionBusinessUnitCargoAmount': 12344,
                'currencyCode': 'USD',
                'sectionBuEffectiveDate': '2019-05-27',
                'sectionBuExpirationDate': '2019-07-31',
                'agreementDefaultCargoAmount': null,
                'existingESDocID': null,
                'isCreateFlow': null
            },
            {
                'customerAgreementID': null,
                'sectionID': 48,
                'sectionName': null,
                'customerSectionBusinessUnitCargoID': 6,
                'action': null,
                'financeBusinessUnitCode': 'ICS',
                'sectionBusinessUnitCargoAmount': 12344,
                'currencyCode': 'USD',
                'sectionBuEffectiveDate': '2019-05-27',
                'sectionBuExpirationDate': '2019-07-31',
                'agreementDefaultCargoAmount': null,
                'existingESDocID': null,
                'isCreateFlow': null
            },
            {
                'customerAgreementID': null,
                'sectionID': 48,
                'sectionName': null,
                'customerSectionBusinessUnitCargoID': 7,
                'action': null,
                'financeBusinessUnitCode': 'JBI',
                'sectionBusinessUnitCargoAmount': 12344,
                'currencyCode': 'USD',
                'sectionBuEffectiveDate': '2019-05-27',
                'sectionBuExpirationDate': '2019-07-31',
                'agreementDefaultCargoAmount': null,
                'existingESDocID': null,
                'isCreateFlow': null
            }
        ],
        'effectiveDate': '2019-05-27',
        'expirationDate': '2019-07-31',
        'status': null,
        'originalEffectiveDate': null,
        'originalExpirationDate': null,
        'createdUser': 'rcon770',
        'createdDate': '2019-05-27T11:44:51.413',
        'createdProgram': 'Sivanesan Sadhasivam',
        'updatedUser': 'rcon770',
        'updatedDate': '2019-05-27T11:44:51.413',
        'updatedProgram': 'Sivanesan Sadhasivam'
    }
    ];
    const populateSectionElse: any = [{
        'cargoAmount': 3423,
        'customerAgreementID': null,
        'customerAgreementCargoID': null,
        'agreementDefault': 'Yes',
        'customerContractID': 27,
        'customerContractNumber': 'testIdentifier',
        'customerContractName': 'descADT21',
        'customerContractCargoID': null,
        'customerSectionCargoID': null,
        'customerSectionName': 'adTi123section',
        'customerSectionID': 48,
        'customerAgreementBusinessUnitCargoList': [],
        'customerContractBusinessUnitCargoList': null,
        'customerSectionBusinessUnitCargo': [],
        'effectiveDate': '2019-05-27',
        'expirationDate': '2019-07-31',
        'status': null,
        'originalEffectiveDate': null,
        'originalExpirationDate': null,
        'createdUser': 'rcon770',
        'createdDate': '2019-05-27T11:44:51.413',
        'createdProgram': 'Sivanesan Sadhasivam',
        'updatedUser': 'rcon770',
        'updatedDate': '2019-05-27T11:44:51.413',
        'updatedProgram': 'Sivanesan Sadhasivam'
    }
    ];

    const populateCargoReleaseTypes: any = [{
        'cargoAmount': null,
        'customerAgreementID': null,
        'customerAgreementCargoID':
            null,
        'agreementDefault': null,
        'customerContractID': 27,
        'customerContractNumber': 'testIdentifier',
        'customerContractName': 'descADT21',
        'customerContractCargoID': null,
        'customerSectionCargoID': null,
        'customerSectionName': null,
        'customerSectionID': null,
        'customerAgreementBusinessUnitCargoList': [{
            'customerAgreementID': 352,
            'customerAgreementBusinessUnitCargoID': 105, 'action': null, 'financeBusinessUnitCode': 'DCS',
            'agreementBusinessUnitCargoAmount': 100001, 'currencyCode': 'USD', 'agreementBuEffectiveDate':
                '1995-01-01',
            'agreementBuExpirationDate': '2099-12-31', 'agreementDefaultCargoAmount': null, 'existingESDocID': null,
            'isCreateFlow': null
        }],
        'customerContractBusinessUnitCargoList': [
            {
                'contractID': 27,
                'contractName': null,
                'contractNumber': null,
                'contractType': null,
                'contractDisplayName': null,
                'customerAgreementID': null,
                'customerContractBusinessUnitCargoID': 8,
                'action': null,
                'financeBusinessUnitCode': 'JBT',
                'contractBusinessUnitCargoAmount': 10000,
                'currencyCode': 'USD',
                'contractBuEffectiveDate': '2019-05-27',
                'contractBuExpirationDate': '2019-07-31',
                'agreementDefaultCargoAmount': null,
                'existingESDocID': null,
                'isCreateFlow': null
            },
            {
                'contractID': 27,
                'contractName': null,
                'contractNumber': null,
                'contractType': null,
                'contractDisplayName': null,
                'customerAgreementID': null,
                'customerContractBusinessUnitCargoID': 9,
                'action':
                    null,
                'financeBusinessUnitCode': 'DCS',
                'contractBusinessUnitCargoAmount': 10000,
                'currencyCode': 'USD',
                'contractBuEffectiveDate': '2019-05-27',
                'contractBuExpirationDate': '2019-07-31',
                'agreementDefaultCargoAmount': null,
                'existingESDocID': null,
                'isCreateFlow': null
            },
            {
                'contractID': 27,
                'contractName': null,
                'contractNumber': null,
                'contractType': null,
                'contractDisplayName': null,
                'customerAgreementID': null,
                'customerContractBusinessUnitCargoID': 10,
                'action': null,
                'financeBusinessUnitCode': 'ICS',
                'contractBusinessUnitCargoAmount': 10000,
                'currencyCode': 'USD',
                'contractBuEffectiveDate': '2019-05-27',
                'contractBuExpirationDate': '2019-07-31',
                'agreementDefaultCargoAmount': null,
                'existingESDocID': null,
                'isCreateFlow': null
            },
            {
                'contractID': 27,
                'contractName': null,
                'contractNumber': null,
                'contractType': null,
                'contractDisplayName': null,
                'customerAgreementID': null,
                'customerContractBusinessUnitCargoID': 11,
                'action':
                    null,
                'financeBusinessUnitCode': 'JBI',
                'contractBusinessUnitCargoAmount': 10000,
                'currencyCode':
                    'USD',
                'contractBuEffectiveDate': '2019-05-27',
                'contractBuExpirationDate': '2019-07-31',
                'agreementDefaultCargoAmount': null,
                'existingESDocID': null,
                'isCreateFlow': null
            }],
        'customerSectionBusinessUnitCargo': null,
        'effectiveDate': '2019-05-27',
        'expirationDate': '2019-07-31',
        'status': null,
        'originalEffectiveDate': null,
        'originalExpirationDate': null,
        'createdUser': 'rcon770',
        'createdDate': '2019-05-27T11:35:04.74',
        'createdProgram': 'Sivanesan Sadhasivam',
        'updatedUser': 'rcon770',
        'updatedDate': '2019-05-27T11:35:04.74',
        'updatedProgram': 'Sivanesan Sadhasivam'
    }];

    const agreementContactRowValue = [{
        'cargoAmount': null, 'customerAgreementID': null, 'customerAgreementCargoID':
            null, 'agreementDefault': null, 'customerContractID': 24, 'customerContractNumber': 'idenAGH090',
        'customerContractName': 'desc', 'customerContractCargoID': null, 'customerSectionCargoID': null,
        'customerSectionName': null, 'customerSectionID': null, 'customerAgreementBusinessUnitCargoList': [],
        'customerContractBusinessUnitCargoList': [{
            'contractID': 24, 'contractName': null, 'contractNumber': null,
            'contractType': null, 'contractDisplayName': null, 'customerAgreementID': null,
            'customerContractBusinessUnitCargoID': 4, 'action': null, 'financeBusinessUnitCode': 'DCS',
            'contractBusinessUnitCargoAmount': 9898, 'currencyCode': 'USD', 'contractBuEffectiveDate': '2019-05-27',
            'contractBuExpirationDate': '2019-08-31', 'agreementDefaultCargoAmount': null, 'existingESDocID': null,
            'isCreateFlow': null
        }, {
            'contractID': 24, 'contractName': null, 'contractNumber': null, 'contractType': null,
            'contractDisplayName': null, 'customerAgreementID': null, 'customerContractBusinessUnitCargoID': 5,
            'action': null, 'financeBusinessUnitCode': 'ICS', 'contractBusinessUnitCargoAmount': 9898, 'currencyCode': 'USD',
            'contractBuEffectiveDate': '2019-05-27', 'contractBuExpirationDate': '2019-08-31', 'agreementDefaultCargoAmount':
                null, 'existingESDocID': null, 'isCreateFlow': null
        }, {
            'contractID': 24, 'contractName': null, 'contractNumber':
                null, 'contractType': null, 'contractDisplayName': null, 'customerAgreementID': null,
            'customerContractBusinessUnitCargoID': 6, 'action': null, 'financeBusinessUnitCode': 'JBI',
            'contractBusinessUnitCargoAmount': 9898, 'currencyCode': 'USD', 'contractBuEffectiveDate': '2019-05-27',
            'contractBuExpirationDate': '2019-08-31', 'agreementDefaultCargoAmount': null, 'existingESDocID': null,
            'isCreateFlow': null
        }, {
            'contractID': 24, 'contractName': null, 'contractNumber': null, 'contractType': null,
            'contractDisplayName': null, 'customerAgreementID': null, 'customerContractBusinessUnitCargoID': 7,
            'action': null, 'financeBusinessUnitCode': 'JBT', 'contractBusinessUnitCargoAmount': 9898, 'currencyCode':
                'USD', 'contractBuEffectiveDate': '2019-05-27', 'contractBuExpirationDate': '2019-08-31',
            'agreementDefaultCargoAmount': null, 'existingESDocID': null, 'isCreateFlow': null
        }], 'customerSectionBusinessUnitCargo': null, 'effectiveDate': '2019-05-27', 'expirationDate': '2019-08-31',
        'status': null, 'originalEffectiveDate': null, 'originalExpirationDate': null, 'createdUser': 'rcon770',
        'createdDate': '2019-05-27T10:57:34.768', 'createdProgram': 'Sivanesan Sadhasivam', 'updatedUser': 'rcon770',
        'updatedDate': '2019-05-27T10:57:34.768', 'updatedProgram': 'Sivanesan Sadhasivam'
    }];
    const agreementTypeRowValue = [{
        'cargoAmount': null, 'customerAgreementID': null, 'customerAgreementCargoID':
            null, 'agreementDefault': null, 'customerContractID': 27, 'customerContractNumber': 'testIdentifier',
        'customerContractName': 'descADT21', 'customerContractCargoID': null, 'customerSectionCargoID': null,
        'customerSectionName': 'adTi123section', 'customerSectionID': 48, 'customerAgreementBusinessUnitCargoList': [],
        'customerContractBusinessUnitCargoList': null, 'customerSectionBusinessUnitCargo': [
            {
                'customerAgreementID': null, 'sectionID': 48, 'sectionName': null,
                'customerSectionBusinessUnitCargoID': 4, 'action': null,
                'financeBusinessUnitCode': 'JBT', 'sectionBusinessUnitCargoAmount': 12344, 'currencyCode': 'USD',
                'sectionBuEffectiveDate': '2019-05-27', 'sectionBuExpirationDate': '2019-07-31', 'agreementDefaultCargoAmount':
                    null, 'existingESDocID': null, 'isCreateFlow': null
            }, {
                'customerAgreementID': null, 'sectionID': 48,
                'sectionName': null, 'customerSectionBusinessUnitCargoID': 5, 'action': null, 'financeBusinessUnitCode': 'DCS',
                'sectionBusinessUnitCargoAmount': 12344, 'currencyCode': 'USD', 'sectionBuEffectiveDate': '2019-05-27',
                'sectionBuExpirationDate': '2019-07-31', 'agreementDefaultCargoAmount': null, 'existingESDocID': null,
                'isCreateFlow': null
            }, {
                'customerAgreementID': null, 'sectionID': 48, 'sectionName': null,
                'customerSectionBusinessUnitCargoID': 6, 'action': null, 'financeBusinessUnitCode': 'ICS',
                'sectionBusinessUnitCargoAmount': 12344, 'currencyCode': 'USD', 'sectionBuEffectiveDate': '2019-05-27',
                'sectionBuExpirationDate': '2019-07-31', 'agreementDefaultCargoAmount': null, 'existingESDocID': null,
                'isCreateFlow': null
            }, {
                'customerAgreementID': null, 'sectionID': 48, 'sectionName': null, 'customerSectionBusinessUnitCargoID':
                    7, 'action': null, 'financeBusinessUnitCode': 'JBI', 'sectionBusinessUnitCargoAmount': 12344, 'currencyCode':
                    'USD', 'sectionBuEffectiveDate': '2019-05-27', 'sectionBuExpirationDate': '2019-07-31',
                'agreementDefaultCargoAmount': null, 'existingESDocID': null, 'isCreateFlow': null
            }], 'effectiveDate':
            '2019-05-27', 'expirationDate': '2019-07-31', 'status': null, 'originalEffectiveDate': null,
        'originalExpirationDate': null, 'createdUser': 'rcon770', 'createdDate': '2019-05-27T11:44:51.413',
        'createdProgram': 'Sivanesan Sadhasivam', 'updatedUser': 'rcon770', 'updatedDate': '2019-05-27T11:44:51.413',
        'updatedProgram': 'Sivanesan Sadhasivam'
    }];
    const fb = {
        cargoValue: '100,000.00',
        selectContract: '',
        agreementType: 'contract',
        contract: {
            'label': {
                'customerContractID': 529, 'customerContractNumber': 'AWKE27Ident',
                'customerContractName': 'AWKE27Desc', 'customerContractType': 'Legal', 'contractEffectiveDate':
                    '2019-06-11', 'contractExpirationDate': '2019-06-30'
            },
            'value': 'AWKE27Ident-AWKE27Desc'
        },
        businessUnit: [{ 'label': 'DCS', 'value': 'DCS' }],
        effectiveDate: '06/11/2019',
        expirationDate: '06/30/2019'
    };
    const fbError = {
        cargoValue: '',
        selectContract: '',
        agreementType: '',
        contract: [''],
        businessUnit: [''],
        effectiveDate: '',
        expirationDate: ''
    };
    let localStore: LocalStorageService;
    const agreementDetails = {
        customerAgreementID: 943,
        effectiveDate: '1995-01-01',
        expirationDate: '2099-12-31'
    };
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule, CreateAgreementModule, HttpClientTestingModule],
            declarations: [],
            providers: [{ provide: APP_BASE_HREF, useValue: '/' }, CreateCargoService, CreateCargoUtilsService,
                LocalStorageService, FormBuilder, MessageService]
        });
    });
    beforeEach(() => {
        fixture = TestBed.createComponent(CreateCargoComponent);
        component = fixture.componentInstance;
        createCargoService = TestBed.get(CreateCargoService);
        messageService = TestBed.get(MessageService);
        localStore = TestBed.get(LocalStorageService);
        component.createCargoModel.agreementId = agreementId;
        component.screenName = 'createDefault';
        const rowData: any = [{
            'uniqueDocID': 'A_614_401',
            'agreementDefaultIndicator': 'Yes',
            'agreementID': 614,
            'customerAgreementCargoIDs': [401],
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
            'customerContractName': '',
            'customerSectionName': ''
        }
        ];
        component.rowData = rowData;
        component.createCargoModel.cargoReleaseForm = formBuilder.group({
            cargoValue: [''],
            selectContract: [''],
            agreementType: [''],
            contract: [''],
            businessUnit: [''],
            effectiveDate: [''],
            expirationDate: ['']
        });
        fixture.detectChanges();
    });

    it('should create', () => {
        component.createCargoModel.rowValue = populateSection;
        expect(component).toBeTruthy();
        fixture.detectChanges();
    });
    xit('should create- ngOnInit', () => {
        component.createCargoModel.agreementId = agreementId;
        component.defaultAgreement = false;
        component.ngOnInit();
    });
    it('shoul call createCargoReleaseForm', () => {
        component.createCargoModel.rowValue = populateSection;
        component.createCargoReleaseForm();
    });
    it('shoul call getAgreementTimestamp', () => {
        component.createCargoModel.rowValue = populateSection;
        const response = {
            'agreementDefaultAmount': 100000,
            'agreementEffectiveDate': '1995-01-01',
            'agreementExpirationDate': '2099-12-31',
            'agreementID': 610,
            'customerContractDetailDTO': null,
            'customerSectionDetailDTO': null
        };
        spyOn(createCargoService, 'getAgreementTime').and.returnValue(of(response));
        component.getAgreementTimestamp();
        fixture.detectChanges();
    });
    it('shoul call getCargoDetails', () => {
        component.createCargoModel.agreementId = agreementId;
        component.createCargoModel.rowValue = populateSection;
        const response = {
            'agreementDefaultAmount': 100000,
            'agreementEffectiveDate': '1995-01-01',
            'agreementExpirationDate': '2099-12-31',
            'agreementID': 610,
            'customerContractDetailDTO': null,
            'customerSectionDetailDTO': null
        };
        spyOn(createCargoService, 'getAgreementCargoDetails').and.returnValue(of(response));
        component.getCargoDetails();
        fixture.detectChanges();
    });

    it('shoul call populateCargoReleaseTypes - customerContractName', () => {
        component.createCargoModel.rowValue = populateCargoReleaseTypes;
        component.populateCargoReleaseTypes();
    });
    it('shoul call populateCargoReleaseTypes - customerSectionName', () => {
        const populateCargoReleaseTypesx = [{
            'cargoAmount': 1234,
            'customerAgreementID': null,
            'customerAgreementCargoID': null,
            'agreementDefault': null,
            'customerContractID': 27,
            'customerContractNumber': 'testIdentifier',
            'customerContractName': 'descADT21',
            'customerContractCargoID': null,
            'customerSectionCargoID': null,
            'customerSectionName': 'adTi123section',
            'customerSectionID': 48,
            'customerAgreementBusinessUnitCargoList': [],
            'customerContractBusinessUnitCargoList': null,
            'customerSectionBusinessUnitCargo': [
                {
                    'customerAgreementID':
                        null,
                    'sectionID': 48,
                    'sectionName': null,
                    'customerSectionBusinessUnitCargoID': 4,
                    'action': null,
                    'financeBusinessUnitCode': 'JBT',
                    'sectionBusinessUnitCargoAmount': 12344,
                    'currencyCode': 'USD',
                    'sectionBuEffectiveDate': '2019-05-27',
                    'sectionBuExpirationDate': '2019-07-31',
                    'agreementDefaultCargoAmount': null,
                    'existingESDocID': null,
                    'isCreateFlow': null
                },
                {
                    'customerAgreementID': null,
                    'sectionID': 48,
                    'sectionName': null,
                    'customerSectionBusinessUnitCargoID': 5,
                    'action': null,
                    'financeBusinessUnitCode': 'DCS',
                    'sectionBusinessUnitCargoAmount': 12344,
                    'currencyCode': 'USD',
                    'sectionBuEffectiveDate': '2019-05-27',
                    'sectionBuExpirationDate': '2019-07-31',
                    'agreementDefaultCargoAmount': null,
                    'existingESDocID': null,
                    'isCreateFlow': null
                },
                {
                    'customerAgreementID': null,
                    'sectionID': 48,
                    'sectionName': null,
                    'customerSectionBusinessUnitCargoID': 6,
                    'action': null,
                    'financeBusinessUnitCode': 'ICS',
                    'sectionBusinessUnitCargoAmount': 12344,
                    'currencyCode': 'USD',
                    'sectionBuEffectiveDate': '2019-05-27',
                    'sectionBuExpirationDate': '2019 - 07 - 31',
                    'agreementDefaultCargoAmount': null,
                    'existingESDocID': null,
                    'isCreateFlow': null
                },
                {
                    'customerAgreementID': null,
                    'sectionID': 48,
                    'sectionName': null,
                    'customerSectionBusinessUnitCargoID':
                        7,
                    'action': null,
                    'financeBusinessUnitCode': 'JBI',
                    'sectionBusinessUnitCargoAmount': 12344,
                    'currencyCode':
                        'USD',
                    'sectionBuEffectiveDate': '2019 - 05 - 27',
                    'sectionBuExpirationDate': '2019-07-31',
                    'agreementDefaultCargoAmount': null,
                    'existingESDocID': null,
                    'isCreateFlow': null
                }],
            'effectiveDate': '2019-05-27',
            'expirationDate': '2019-07-31',
            'status': null,
            'originalEffectiveDate': null,
            'originalExpirationDate': null,
            'createdUser': 'rcon770',
            'createdDate': '2019-05-27T11:44:51.413',
            'createdProgram': 'Sivanesan Sadhasivam',
            'updatedUser': 'rcon770',
            'updatedDate': '2019-05-27T11:44:51.413',
            'updatedProgram': 'Sivanesan Sadhasivam'
        }
        ];
        component.createCargoModel.rowValue = populateCargoReleaseTypesx;
        component.populateCargoReleaseTypes();
    });

    it('shoul call populateCargoReleaseTypes - empty', () => {
        populateCargoReleaseTypes[0]['customerSectionName'] = null;
        populateCargoReleaseTypes[0]['customerContractName'] = null;
        component.createCargoModel.rowValue = populateCargoReleaseTypes;
        component.populateCargoReleaseTypes();
    });
    it('shoul call populateSection', () => {
        component.createCargoModel.rowValue = populateSection;
        component.populateSection();
    });
    it('shoul call populateSection- Else', () => {
        component.createCargoModel.rowValue = populateSectionElse;
        component.populateSection();
    });

    it('shoul call populateContract', () => {
        component.createCargoModel.rowValue = populateCargoReleaseTypes;
        component.populateContract();
    });
    it('shoul call populateContract - Else', () => {
        component.createCargoModel.rowValue = populateSectionElse;
        component.populateContract();
    });
    it('shoul call populateBusinessUnit', () => {
        const rv = [{
            'cargoAmount': null, 'customerAgreementID': null, 'customerAgreementCargoID': null, 'agreementDefault': null,
            'customerContractID': null, 'customerContractNumber': null, 'customerContractName': null,
            'customerContractCargoID': null, 'customerSectionCargoID': null, 'customerSectionName': null,
            'customerSectionID': null, 'customerAgreementBusinessUnitCargoList': [{
                'customerAgreementID': 352,
                'customerAgreementBusinessUnitCargoID': 105, 'action': null, 'financeBusinessUnitCode': 'DCS',
                'agreementBusinessUnitCargoAmount': 100001, 'currencyCode': 'USD', 'agreementBuEffectiveDate':
                    '1995-01-01',
                'agreementBuExpirationDate': '2099-12-31', 'agreementDefaultCargoAmount': null, 'existingESDocID': null,
                'isCreateFlow': null
            }, {
                'customerAgreementID': 352, 'customerAgreementBusinessUnitCargoID': 106, 'action': null,
                'financeBusinessUnitCode': 'ICS', 'agreementBusinessUnitCargoAmount': 100001, 'currencyCode': 'USD',
                'agreementBuEffectiveDate': '1995-01-01', 'agreementBuExpirationDate': '2099-12-31',
                'agreementDefaultCargoAmount': null, 'existingESDocID': null, 'isCreateFlow': null
            }, {
                'customerAgreementID':
                    352, 'customerAgreementBusinessUnitCargoID': 107, 'action': null, 'financeBusinessUnitCode': 'JBI',
                'agreementBusinessUnitCargoAmount': 100001, 'currencyCode': 'USD', 'agreementBuEffectiveDate':
                    '1995-01-01',
                'agreementBuExpirationDate': '2099-12-31', 'agreementDefaultCargoAmount': null, 'existingESDocID': null,
                'isCreateFlow': null
            }, {
                'customerAgreementID': 352, 'customerAgreementBusinessUnitCargoID': 108, 'action': null,
                'financeBusinessUnitCode': 'JBT', 'agreementBusinessUnitCargoAmount': 100001, 'currencyCode': 'USD',
                'agreementBuEffectiveDate': '1995-01-01', 'agreementBuExpirationDate': '2099-12-31',
                'agreementDefaultCargoAmount': null, 'existingESDocID': null, 'isCreateFlow': null
            }],
            'customerContractBusinessUnitCargoList': null, 'customerSectionBusinessUnitCargo': null, 'effectiveDate':
                '1995-01-01', 'expirationDate': '2099-12-31', 'status': null, 'originalEffectiveDate': null,
            'originalExpirationDate': null, 'createdUser': 'rcon770', 'createdDate': '2019-06-11T11:37:43.023',
            'createdProgram': 'Sivanesan Sadhasivam', 'updatedUser': 'rcon770', 'updatedDate': '2019-06-11T11:37:43.023',
            'updatedProgram': 'Sivanesan Sadhasivam'
        }];
        component.createCargoModel.rowValue = rv;
        component.populateBusinessUnit();
    });
    it('shoul call getSectionCargoValues', () => {
        component.createCargoModel.agreementId = agreementId;
        const response = {
            'agreementID': null, 'agreementDefaultAmount': null, 'agreementEffectiveDate': null,
            'agreementExpirationDate': null, 'customerContractDetailDTO': null, 'customerSectionDetailDTO': [{
                'customerSectionID': 43, 'customerSectionName': 'AGHOA2Sect', 'customerContractID': 23,
                'customerContractName': 'descAGHOA2', 'customerContractNumber': '1883', 'sectionEffectiveDate': '2019-05-26',
                'sectionExpirationDate': '2099-12-31', 'customerAgreementID': 16, 'customerAgreementName': 'Agar Corp (AGHOA2)'
            }]
        };
        spyOn(createCargoService, 'getSectionCargo').and.returnValue(of(response));
        component.getSectionCargoValues();
        fixture.detectChanges();
    });
    it('shoul call getSectionCargoValues-section', () => {
        component.createCargoModel.agreementId = agreementId;
        component.createCargoModel.tabValue = 'section';
        const response = {
            'agreementID': null, 'agreementDefaultAmount': null, 'agreementEffectiveDate': null,
            'agreementExpirationDate': null, 'customerContractDetailDTO': null, 'customerSectionDetailDTO': [{
                'customerSectionID': 43, 'customerSectionName': 'AGHOA2Sect', 'customerContractID': 23,
                'customerContractName': 'descAGHOA2', 'customerContractNumber': '1883', 'sectionEffectiveDate': '2019-05-26',
                'sectionExpirationDate': '2099-12-31', 'customerAgreementID': 16, 'customerAgreementName': 'Agar Corp (AGHOA2)'
            }]
        };
        spyOn(createCargoService, 'getSectionCargo').and.returnValue(of(response));
        component.getSectionCargoValues();
        fixture.detectChanges();
    });
    it('shoul call onRowSelect', () => {
        component.createCargoModel.rowValue = populateSection;
        const obj = {
            'originalEvent': { 'isTrusted': true }, 'data': {
                'customerSectionID': 48, 'customerSectionName':
                    'adti12Section', 'customerContractID': 28, 'customerContractName': '1885-descAD', 'customerContractNumber': '1885',
                'sectionEffectiveDate': '2019-05-27', 'sectionExpirationDate': '2019-07-31', 'customerAgreementID': 20,
                'customerAgreementName': 'A Denovi Service Inc (ADTI21)'
            }, 'type': 'radiobutton'
        };
        component.onRowSelect(obj);
    });
    it('shoul call onRowSelect-else', () => {
        component.createCargoModel.rowValue = populateSection;
        const obj = {
            'originalEvent': { 'isTrusted': true }, 'data': {
                'customerSectionID': 49, 'customerSectionName':
                    'adti12Section', 'customerContractID': 28, 'customerContractName': '1885-descAD', 'customerContractNumber': '1885',
                'sectionEffectiveDate': '2019-05-27', 'sectionExpirationDate': '2019-07-31', 'customerAgreementID': 20,
                'customerAgreementName': 'A Denovi Service Inc (ADTI21)'
            }, 'type': 'radiobutton'
        };
        component.onRowSelect(obj);
    });
    it('shoul call getContractCargoValues', () => {

        component.createCargoModel.agreementId = {
            'customerAgreementID': 15, 'customerAgreementName':
                'Hgr Industrial Surplus, Inc (HGEU2)', 'agreementType': 'Customer', 'ultimateParentAccountID': 137136,
            'currencyCode': null, 'cargoReleaseAmount': null, 'businessUnits': null, 'taskAssignmentIDs': null,
            'effectiveDate': '1995-01-01', 'expirationDate': '2099-12-31', 'invalidIndicator': 'N',
            'invalidReasonTypeName': null, 'teams': null
        };

        const response = {
            'agreementID': null, 'agreementDefaultAmount': null, 'agreementEffectiveDate': null,
            'agreementExpirationDate': null, 'customerContractDetailDTO': [{
                'customerContractID': 22,
                'customerContractNumber': null, 'customerContractName': 'desc', 'customerContractType': 'Transactional',
                'contractEffectiveDate': '2019-05-27', 'contractExpirationDate': '2099-12-31'
            }], 'customerSectionDetailDTO': null
        };

        spyOn(createCargoService, 'getContractCargo').and.returnValue(of(response));
        component.getContractCargoValues();
    });

    it('shoul call onTypeContractCargo', () => {
        const obj: any = { 'originalEvent': { 'isTrusted': true }, 'query': '' };
        const evtObj = new CustomEvent('selectRowx', obj);
        component.onTypeContractCargo(evtObj);
    });

    it('shoul call onSelectContract', () => {
        const obj: any = {
            'label': {
                'customerContractID': 22,
                'customerContractNumber': null, 'customerContractName': 'desc', 'customerContractType': 'Transactional',
                'contractEffectiveDate': '2019-05-27', 'contractExpirationDate': '2099-12-31'
            }
        };
        component.onSelectContract(obj);
    });

    it('shoul call getBusinessUnitValues', () => {
        const response = {
            '_embedded': {
                'serviceOfferingBusinessUnitTransitModeAssociations': [
                    {
                        'financeBusinessUnitServiceOfferingAssociation': {
                            'financeBusinessUnitServiceOfferingAssociationID': null, 'financeBusinessUnitCode': 'DCS',
                            'serviceOfferingCode': null, 'effectiveTimestamp': null, 'expirationTimestamp': null,
                            'lastUpdateTimestampString': null
                        }, 'transitMode': null, 'utilizationClassification': null,
                        'freightShippingType': null, 'lastUpdateTimestampString': null, '_links': {
                            'self':
                                { 'href': 'http://jvtweb18101.nonprod.jbhunt.com/referencedataservices' },
                            'serviceOfferingBusinessUnitTransitModeAssociation':
                                { 'href': 'http://jvtweb18101.nonprod.jbhunt.com/referencedataservices', 'templated': true }
                        }
                    }, {
                        'financeBusinessUnitServiceOfferingAssociation': {
                            'financeBusinessUnitServiceOfferingAssociationID': null, 'financeBusinessUnitCode': 'ICS',
                            'serviceOfferingCode': null, 'effectiveTimestamp': null, 'expirationTimestamp': null,
                            'lastUpdateTimestampString': null
                        }, 'transitMode': null, 'utilizationClassification': null,
                        'freightShippingType': null, 'lastUpdateTimestampString': null, '_links': {
                            'self': {
                                'href':
                                    'http://jvtweb18101.nonprod.jbhunt.com/referencedataservices'
                            },
                            'serviceOfferingBusinessUnitTransitModeAssociation': {
                                'href':
                                    'http://jvtweb18101.nonprod.jbhunt.com/referencedataservices', 'templated': true
                            }
                        }
                    }, {
                        'financeBusinessUnitServiceOfferingAssociation': {
                            'financeBusinessUnitServiceOfferingAssociationID': null, 'financeBusinessUnitCode': 'JBI',
                            'serviceOfferingCode': null, 'effectiveTimestamp': null, 'expirationTimestamp': null,
                            'lastUpdateTimestampString': null
                        }, 'transitMode': null, 'utilizationClassification': null,
                        'freightShippingType': null, 'lastUpdateTimestampString': null, '_links': {
                            'self': {
                                'href':
                                    'http://jvtweb18101.nonprod.jbhunt.com/referencedataservices'
                            },
                            'serviceOfferingBusinessUnitTransitModeAssociation': {
                                'href':
                                    'http://jvtweb18101.nonprod.jbhunt.com/referencedataservices', 'templated': true
                            }
                        }
                    }, {
                        'financeBusinessUnitServiceOfferingAssociation': {
                            'financeBusinessUnitServiceOfferingAssociationID': null, 'financeBusinessUnitCode': 'JBT',
                            'serviceOfferingCode': null, 'effectiveTimestamp': null, 'expirationTimestamp': null,
                            'lastUpdateTimestampString': null
                        }, 'transitMode': null, 'utilizationClassification': null, 'freightShippingType': null,
                        'lastUpdateTimestampString': null, '_links': {
                            'self': { 'href': 'http://jvtweb18101.nonprod.jbhunt.com/referencedataservices' },
                            'serviceOfferingBusinessUnitTransitModeAssociation': {
                                'href':
                                    'http://jvtweb18101.nonprod.jbhunt.com/referencedataservices', 'templated': true
                            }
                        }
                    }]
            }, '_links': { 'self': { 'href': 'http://jvtweb18101.nonprod.jbhunt.com/referencedataservices' } }
        };
        spyOn(createCargoService, 'getBusinessUnit').and.returnValue(of(response));
        component.getBusinessUnitValues();
        fixture.detectChanges();
    });

    it('shoul call createCargoReleaseAgreement-true', () => {
        component.defaultAgreement = true;
        component.createCargoReleaseAgreement();
    });
    it('shoul call createCargoReleaseAgreement-false', () => {
        component.defaultAgreement = false;
        localStore.setItem('createAgreement', 'detail', agreementDetails);
        component.createCargoReleaseAgreement();
    });
    it('shoul call checkStore', () => {
        localStore.setItem('createAgreement', 'detail', agreementDetails);
        component.checkStore();
    });
    it('shoul call initialDate', () => {
        component.createCargoModel.agreementDetails = agreementDetails;
        component.initialDate();
    });
    it('shoul call onSelectType-Agreement', () => {
        const obj: any = {
            'originalEvent': {
                'isTrusted': true
            },
            'option': {
                'label': 'Agreement',
                'value': 'agreement'
            },
            'index': 0
        };
        const evtObj = new CustomEvent('onSelectType-Agreement', obj);
        component.onSelectType(obj);
    });
    it('shoul call buBlur', () => {
        component.createCargoModel.tabValue = 'agreement';
        component.buBlur(event);
    });

    it('shoul call agreementType-agreement', () => {
        component.agreementType('agreement');
    });

    it('shoul call agreementType-contract', () => {
        component.createCargoModel.rowValue = agreementContactRowValue;
        component.agreementType('contract');
    });

    it('shoul call agreementType-section', () => {
        component.createCargoModel.rowValue = agreementTypeRowValue;
        component.agreementType('section');
    });

    it('shoul call populateDefaultContract-true', () => {
        component.createCargoModel.isChanged = true;
        component.createCargoModel.rowValue = agreementContactRowValue;
        const contractObj = {
            'customerContractID': 22,
            'customerContractNumber': 'ADLOAHIdent', 'customerContractName': 'ADLOAHDesc', 'customerContractType': 'Transactional',
            'contractEffectiveDate': '2019-05-27', 'contractExpirationDate': '2099-12-31'
        };
        component.createCargoModel.allContractCargoValues = [{
            label: contractObj,
            value: 'ADLOAHIdent-ADLOAHDesc'
        }];
        component.populateDefaultContract();
    });
    it('shoul call populateDefaultContract-false', () => {
        component.createCargoModel.isChanged = false;
        component.createCargoModel.rowValue = agreementContactRowValue;
        const contractObj = {
            'customerContractID': 22,
            'customerContractNumber': 'ADLOAHIdent', 'customerContractName': 'ADLOAHDesc', 'customerContractType': 'Transactional',
            'contractEffectiveDate': '2019-05-27', 'contractExpirationDate': '2099-12-31'
        };
        component.createCargoModel.allContractCargoValues = [{
            label: contractObj,
            value: 'ADLOAHIdent-ADLOAHDesc'
        }];
        component.populateDefaultContract();
    });
    it('shoul call populateContractBusinessUnit', () => {
        const rowValue = [{
            'cargoAmount': null, 'customerAgreementID': null, 'customerAgreementCargoID':
                null, 'agreementDefault': null, 'customerContractID': 24, 'customerContractNumber': 'idenAGH090',
            'customerContractName': 'desc', 'customerContractCargoID': null, 'customerSectionCargoID': null,
            'customerSectionName': null, 'customerSectionID': null, 'customerAgreementBusinessUnitCargoList': [],
            'customerContractBusinessUnitCargoList': [{
                'contractID': 24, 'contractName': null, 'contractNumber': null,
                'contractType': null, 'contractDisplayName': null, 'customerAgreementID': null,
                'customerContractBusinessUnitCargoID': 4, 'action': null, 'financeBusinessUnitCode': 'DCS',
                'contractBusinessUnitCargoAmount': 9898, 'currencyCode': 'USD', 'contractBuEffectiveDate': '2019-05-27',
                'contractBuExpirationDate': '2019-08-31', 'agreementDefaultCargoAmount': null, 'existingESDocID': null,
                'isCreateFlow': null
            }, {
                'contractID': 24, 'contractName': null, 'contractNumber': null, 'contractType': null,
                'contractDisplayName': null, 'customerAgreementID': null, 'customerContractBusinessUnitCargoID': 5,
                'action': null, 'financeBusinessUnitCode': 'ICS', 'contractBusinessUnitCargoAmount': 9898, 'currencyCode': 'USD',
                'contractBuEffectiveDate': '2019-05-27', 'contractBuExpirationDate': '2019-08-31', 'agreementDefaultCargoAmount':
                    null, 'existingESDocID': null, 'isCreateFlow': null
            }, {
                'contractID': 24, 'contractName': null, 'contractNumber': null, 'contractType': null,
                'contractDisplayName': null, 'customerAgreementID': null,
                'customerContractBusinessUnitCargoID': 6, 'action': null, 'financeBusinessUnitCode': 'JBI',
                'contractBusinessUnitCargoAmount': 9898, 'currencyCode': 'USD', 'contractBuEffectiveDate': '2019-05-27',
                'contractBuExpirationDate': '2019-08-31', 'agreementDefaultCargoAmount': null, 'existingESDocID': null,
                'isCreateFlow': null
            }, {
                'contractID': 24, 'contractName': null, 'contractNumber': null, 'contractType': null,
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
        component.populateContractBusinessUnit();
    });

    it('shoul call populateSectionBusinessUnit', () => {
        const rowValue = [{
            'cargoAmount': null,
            'customerAgreementID': null,
            'customerAgreementCargoID': null,
            'agreementDefault': null,
            'customerContractID': 27,
            'customerContractNumber': 'testIdentifier',
            'customerContractName': 'descADT21',
            'customerContractCargoID': null,
            'customerSectionCargoID': null,
            'customerSectionName': 'adTi123section',
            'customerSectionID': 48,
            'customerAgreementBusinessUnitCargoList': [],
            'customerContractBusinessUnitCargoList': null,
            'customerSectionBusinessUnitCargo': [{
                'customerAgreementID': null,
                'sectionID': 48,
                'sectionName': null,
                'customerSectionBusinessUnitCargoID': 4,
                'action': null,
                'financeBusinessUnitCode': 'JBT',
                'sectionBusinessUnitCargoAmount': 12344,
                'currencyCode': 'USD',
                'sectionBuEffectiveDate': '2019-05-27',
                'sectionBuExpirationDate': '2019-07-31',
                'agreementDefaultCargoAmount': null,
                'existingESDocID': null,
                'isCreateFlow': null
            }, {
                'customerAgreementID': null,
                'sectionID': 48,
                'sectionName': null,
                'customerSectionBusinessUnitCargoID': 5,
                'action': null,
                'financeBusinessUnitCode': 'DCS',
                'sectionBusinessUnitCargoAmount': 12344,
                'currencyCode': 'USD',
                'sectionBuEffectiveDate': '2019-05-27',
                'sectionBuExpirationDate': '2019-07-31',
                'agreementDefaultCargoAmount': null,
                'existingESDocID': null,
                'isCreateFlow': null
            }, {
                'customerAgreementID': null,
                'sectionID': 48,
                'sectionName': null,
                'customerSectionBusinessUnitCargoID': 6,
                'action': null,
                'financeBusinessUnitCode': 'ICS',
                'sectionBusinessUnitCargoAmount': 12344,
                'currencyCode': 'USD',
                'sectionBuEffectiveDate': '2019-05-27',
                'sectionBuExpirationDate': '2019-07-31',
                'agreementDefaultCargoAmount': null,
                'existingESDocID': null,
                'isCreateFlow': null
            }, {
                'customerAgreementID': null,
                'sectionID': 48,
                'sectionName': null,
                'customerSectionBusinessUnitCargoID': 7,
                'action': null,
                'financeBusinessUnitCode': 'JBI',
                'sectionBusinessUnitCargoAmount': 12344,
                'currencyCode': 'USD',
                'sectionBuEffectiveDate': '2019-05-27',
                'sectionBuExpirationDate': '2019-07-31',
                'agreementDefaultCargoAmount': null,
                'existingESDocID': null,
                'isCreateFlow': null
            }],
            'effectiveDate': '2019-05-27',
            'expirationDate': '2019-07-31',
            'status': null,
            'originalEffectiveDate': null,
            'originalExpirationDate': null,
            'createdUser': 'rcon770',
            'createdDate': '2019-05-27T11:44:51.413',
            'createdProgram': 'Sivanesan Sadhasivam',
            'updatedUser': 'rcon770',
            'updatedDate': '2019-05-27T11:44:51.413',
            'updatedProgram': 'Sivanesan Sadhasivam'
        }];
        component.createCargoModel.rowValue = rowValue;
        component.populateSectionBusinessUnit();
    });

    it('shoul call populateDefaultSection', () => {
        component.createCargoModel.rowValue = agreementTypeRowValue;
        component.createCargoModel.sectionsList = [{
            'customerSectionID': 876, 'customerSectionName': 'BNEL10Sect',
            'customerContractID': 558, 'customerContractName': '(Transactional)-BNEL10desfc', 'customerContractNumber': null,
            'sectionEffectiveDate': '2019-06-11', 'sectionExpirationDate': '2019-06-30', 'customerAgreementID': 361,
            'customerAgreementName': 'B&N Freight Services, Inc. (BNEL10)'
        }];
        component.populateDefaultSection();
    });

    it('shoul call populateDefaultSection-Else', () => {
        component.createCargoModel.rowValue = [];
        component.createCargoModel.sectionsList = [{
            'customerSectionID': 876, 'customerSectionName': 'BNEL10Sect',
            'customerContractID': 558, 'customerContractName': '(Transactional)-BNEL10desfc', 'customerContractNumber': null,
            'sectionEffectiveDate': '2019-06-11', 'sectionExpirationDate': '2019-06-30', 'customerAgreementID': 361,
            'customerAgreementName': 'B&N Freight Services, Inc. (BNEL10)'
        }];
        component.populateDefaultSection();
    });
    it('shoul call populateDefaultBusinessUnit', () => {
        component.populateDefaultBusinessUnit();
    });

    it('shoul call populateDefaultBusinessUnit-Else', () => {
        component.createCargoModel.rowValue = [];
        const defaultCargoData: any = {
            'agreementID': 324, 'agreementDefaultAmount': 100000, 'agreementEffectiveDate': '1995-01-01',
            'agreementExpirationDate': '2099-12-31', 'customerContractDetailDTO': null, 'customerSectionDetailDTO': null
        };
        component.createCargoModel.defaultCargoData = defaultCargoData;
        component.populateDefaultBusinessUnit();
    });
    it('shoul call setBusinessUnitValue', () => {
        const bu = [
            {
                'customerAgreementID': null,
                'sectionID': 48,
                'sectionName': null,
                'customerSectionBusinessUnitCargoID': 4,
                'action': null,
                'financeBusinessUnitCode': 'JBT',
                'sectionBusinessUnitCargoAmount': 12344,
                'currencyCode': 'USD',
                'sectionBuEffectiveDate': '2019-05-27',
                'sectionBuExpirationDate': '2019-07-31',
                'agreementDefaultCargoAmount': null,
                'existingESDocID': null,
                'isCreateFlow': null
            }];
        component.setBusinessUnitValue(bu);
    });

    it('shoul call populateValues-Yes', () => {
        component.createCargoModel.rowValue = [{
            'cargoAmount': 100001,
            'customerAgreementID': 15,
            'customerAgreementCargoID': 9,
            'agreementDefault': 'Yes',
            'customerContractID': null,
            'customerContractNumber': null,
            'customerContractName': null,
            'customerContractCargoID': null,
            'customerSectionCargoID': null,
            'customerSectionName': null,
            'customerSectionID': null,
            'customerAgreementBusinessUnitCargoList': [],
            'customerContractBusinessUnitCargoList': null,
            'customerSectionBusinessUnitCargo': null,
            'effectiveDate': '1995-01-01',
            'expirationDate': '2099-12-31',
            'status': 'Active',
            'originalEffectiveDate': '1995-01-01',
            'originalExpirationDate': '2099-12-31',
            'createdUser': 'rcon770',
            'createdDate': '2019-05-27T09:43:29.814',
            'createdProgram': 'Sivanesan Sadhasivam',
            'updatedUser': 'rcon770',
            'updatedDate': '2019-05-27T09:43:29.814',
            'updatedProgram': 'Sivanesan Sadhasivam'
        }];
        component.populateValues();
    });
    it('shoul call populateValues-No', () => {
        const rowValue = [{
            'cargoAmount': null,
            'customerAgreementID': null,
            'customerAgreementCargoID': null,
            'agreementDefault': null,
            'customerContractID': 27,
            'customerContractNumber': 'testIdentifier',
            'customerContractName': 'descADT21',
            'customerContractCargoID': null,
            'customerSectionCargoID': null,
            'customerSectionName': null,
            'customerSectionID': null,
            'customerAgreementBusinessUnitCargoList': [],
            'customerContractBusinessUnitCargoList': [{
                'contractID': 27,
                'contractName': null,
                'contractNumber': null,
                'contractType': null,
                'contractDisplayName': null,
                'customerAgreementID': null,
                'customerContractBusinessUnitCargoID': 8,
                'action': null,
                'financeBusinessUnitCode': 'JBT',
                'contractBusinessUnitCargoAmount': 10000,
                'currencyCode': 'USD',
                'contractBuEffectiveDate': '2019-05-27',
                'contractBuExpirationDate': '2019-07-31',
                'agreementDefaultCargoAmount': null,
                'existingESDocID': null,
                'isCreateFlow': null
            }, {
                'contractID': 27,
                'contractName': null,
                'contractNumber': null,
                'contractType': null,
                'contractDisplayName': null,
                'customerAgreementID': null,
                'customerContractBusinessUnitCargoID': 9,
                'action': null,
                'financeBusinessUnitCode': 'DCS',
                'contractBusinessUnitCargoAmount': 10000,
                'currencyCode': 'USD',
                'contractBuEffectiveDate': '2019-05-27',
                'contractBuExpirationDate': '2019-07-31',
                'agreementDefaultCargoAmount': null,
                'existingESDocID': null,
                'isCreateFlow': null
            }, {
                'contractID': 27,
                'contractName': null,
                'contractNumber': null,
                'contractType': null,
                'contractDisplayName': null,
                'customerAgreementID': null,
                'customerContractBusinessUnitCargoID': 10,
                'action': null,
                'financeBusinessUnitCode': 'ICS',
                'contractBusinessUnitCargoAmount': 10000,
                'currencyCode': 'USD',
                'contractBuEffectiveDate': '2019-05-27',
                'contractBuExpirationDate': '2019-07-31',
                'agreementDefaultCargoAmount': null,
                'existingESDocID': null,
                'isCreateFlow': null
            }, {
                'contractID': 27,
                'contractName': null,
                'contractNumber': null,
                'contractType': null,
                'contractDisplayName': null,
                'customerAgreementID': null,
                'customerContractBusinessUnitCargoID': 11,
                'action': null,
                'financeBusinessUnitCode': 'JBI',
                'contractBusinessUnitCargoAmount': 10000,
                'currencyCode': 'USD',
                'contractBuEffectiveDate': '2019-05-27',
                'contractBuExpirationDate': '2019-07-31',
                'agreementDefaultCargoAmount': null,
                'existingESDocID': null,
                'isCreateFlow': null
            }],
            'customerSectionBusinessUnitCargo': null,
            'effectiveDate': '2019-05-27',
            'expirationDate': '2019-07-31',
            'status': null,
            'originalEffectiveDate': null,
            'originalExpirationDate': null,
            'createdUser': 'rcon770',
            'createdDate': '2019-05-27T11:35:04.74',
            'createdProgram': 'Sivanesan Sadhasivam',
            'updatedUser': 'rcon770',
            'updatedDate': '2019-05-27T11:35:04.74',
            'updatedProgram': 'Sivanesan Sadhasivam'
        }];
        component.createCargoModel.rowValue = rowValue;
        component.populateValues();
    });


    it('shoul call onBlurInput', () => {
        component.onBlurInput();
    });

    it('shoul call onClose', () => {
        component.onClose();
    });

    it('shoul call onSave', () => {
        component.onSave();
    });
    it('shoul call onSave-if', () => {
        component.createCargoModel.sectionSelectFlag = true;
        component.onSave();
    });

    it('shoul call buSaveCheck', () => {
        component.createCargoModel.tabValue = 'agreement';
        component.buSaveCheck();
    });
    it('shoul call buSaveCheck-else', () => {
        component.createCargoModel.tabValue = 'section';
        component.screensName = 'createdefault';
        component.createCargoModel.cargoReleaseForm.setValue(fb);
        component.createCargoModel.cargoReleaseForm.controls.cargoValue.setValue(23456);
        component.createCargoModel.cargoDefaultAmount = 12345;
        component.rowData[0]['financeBusinessUnitAssociations'] = [
            {
                'customerAgreementBusinessUnitCargoID': 41,
                'financeBusinessUnitCode': 'ICS'
            }
        ];
        component.buSaveCheck();
    });

    it('shoul call setBuValidators', () => {
        component.setBuValidators();
    });

    it('shoul call checkPristine', () => {
        component.screensName = 'createdefault';
        component.checkPristine();
    });
    it('shoul call checkPristine-section', () => {
        component.screensName = 'section';
        component.checkPristine();
    });

    it('shoul call onSaveCargo', () => {
        component.screenName = 'create';
        component.createCargoModel.cargoType = 'Agreement';
        component.createCargoModel.cargoReleaseForm.setValue(fb);
        component.onSaveCargo();
    });

    it('shoul call onSaveCargo', () => {
        component.screenName = 'edit';
        component.createCargoModel.cargoReleaseForm.setValue(fb);
        component.onSaveCargo();
    });
    it('shoul call onCreateSave', () => {
        component.createCargoModel.cargoType = 'Agreement';
        component.createCargoModel.cargoReleaseForm.setValue(fb);
        spyOn(createCargoService, 'saveCargo').and.returnValue(of([345]));
        component.onCreateSave();
    });

    it('shoul call createQueryType', () => {
        component.createCargoModel.cargoType = 'Agreement';
        const fbx = {
            cargoValue: '100,000.00',
            selectContract: '',
            agreementType: '',
            contract: '',
            businessUnit: '',
            effectiveDate: '',
            expirationDate: ''
        };
        component.createCargoModel.cargoReleaseForm.setValue(fbx);
        component.createQueryType();
    });
    it('shoul call createQueryType-agreementBU', () => {
        component.createCargoModel.cargoType = 'agreementBU';
        component.createCargoModel.cargoReleaseForm.setValue(fb);
        component.createCargoModel.cargoDefaultAmount = 12345;
        component.rowData[0]['financeBusinessUnitAssociations'] =  [
            {
                'customerAgreementBusinessUnitCargoID': 41,
                'financeBusinessUnitCode': 'ICS'
            }
        ];
        component.createQueryType();
    });
    it('shoul call createQueryType-contract', () => {
        component.createCargoModel.cargoType = 'contract';
        component.createCargoModel.cargoReleaseForm.setValue(fb);
        component.createCargoModel.cargoDefaultAmount = 12345;
        component['rowData'][0]['financeBusinessUnitAssociations'] = [
            {
                'customerAgreementBusinessUnitCargoID': 41,
                'financeBusinessUnitCode': 'ICS'
            }
        ];
        const contractObj = {
            'customerContractID': 529,
            'customerContractNumber': 'AWKE27Ident', 'customerContractName': 'AWKE27Desc', 'customerContractType': 'Legal',
            'contractEffectiveDate': '2019-05-27', 'contractExpirationDate': '2099-12-31'
        };
        component.createCargoModel.allContractCargoValues = [{
            label: contractObj,
            value: 'AWKE27Ident-AWKE27Desc'
        }];
        component.createQueryType();
    });
    it('shoul call createQueryType-contract-else', () => {
        component.createCargoModel.cargoType = 'contract';
        component.createCargoModel.cargoReleaseForm.setValue(fb);
        component.createCargoModel.cargoReleaseForm.controls.businessUnit.setValue({});
        component.createCargoModel.cargoDefaultAmount = 12345;
        component.rowData[0]['financeBusinessUnitAssociations'] = [
            {
                'customerAgreementBusinessUnitCargoID': 41,
                'financeBusinessUnitCode': 'ICS'
            }
        ];
        const contractObj = {
            'customerContractID': 529,
            'customerContractNumber': 'AWKE27Ident', 'customerContractName': 'AWKE27Desc', 'customerContractType': 'Legal',
            'contractEffectiveDate': '2019-05-27', 'contractExpirationDate': '2099-12-31'
        };
        component.createCargoModel.allContractCargoValues = [{
            label: contractObj,
            value: 'AWKE27Ident-AWKE27Desc'
        }];
        component.createQueryType();
    });
    it('shoul call createQueryType-section', () => {
        component.createCargoModel.cargoType = 'Section';
        component.createCargoModel.cargoDefaultAmount = 12345;
        component.rowData[0]['financeBusinessUnitAssociations'] = [
            {
                'customerAgreementBusinessUnitCargoID': 41,
                'financeBusinessUnitCode': 'ICS'
            }
        ];
        component.createCargoModel.selectedSectionsList = {
            'customerSectionID': 843, 'customerSectionName': 'DFPDENSecti',
            'customerContractID': 538, 'customerContractName': '2104-DFPDENDesc', 'customerContractNumber': '2104',
            'sectionEffectiveDate': '2019-06-11', 'sectionExpirationDate': '2019-06-30', 'customerAgreementID': 343,
            'customerAgreementName': 'Dawn Food Products, Inc. (DFPDEN)'
        };
        component.createCargoModel.cargoReleaseForm.setValue(fb);
        component.createQueryType();
    });
    it('shoul call createQueryType-sectionBU', () => {
        component.createCargoModel.cargoType = 'SectionBU';
        component.createCargoModel.cargoDefaultAmount = 12345;
        component.rowData[0]['financeBusinessUnitAssociations'] = [
            {
                'customerAgreementBusinessUnitCargoID': 41,
                'financeBusinessUnitCode': 'ICS'
            }
        ];
        component.createCargoModel.selectedSectionsList = {
            'customerSectionID': 843, 'customerSectionName': 'DFPDENSecti',
            'customerContractID': 538, 'customerContractName': '2104-DFPDENDesc', 'customerContractNumber': '2104',
            'sectionEffectiveDate': '2019-06-11', 'sectionExpirationDate': '2019-06-30', 'customerAgreementID': 343,
            'customerAgreementName': 'Dawn Food Products, Inc. (DFPDEN)'
        };
        component.createCargoModel.cargoReleaseForm.setValue(fb);
        component.createQueryType();
    });
    it('shoul call createQueryType-ContractBU', () => {
        component.createCargoModel.cargoType = 'ContractBU';
        component.createCargoModel.cargoReleaseForm.setValue(fb);
        component.createCargoModel.cargoDefaultAmount = 12345;
        component.rowData[0]['financeBusinessUnitAssociations'] = [
            {
                'customerAgreementBusinessUnitCargoID': 41,
                'financeBusinessUnitCode': 'ICS'
            }
        ];
        const contractObj = {
            'customerContractID': 529,
            'customerContractNumber': 'AWKE27Ident', 'customerContractName': 'AWKE27Desc', 'customerContractType': 'Legal',
            'contractEffectiveDate': '2019-05-27', 'contractExpirationDate': '2099-12-31'
        };
        component.createCargoModel.allContractCargoValues = [{
            label: contractObj,
            value: 'AWKE27Ident-AWKE27Desc'
        }];
        component.createQueryType();
    });

    it('shoul call sectionValidator-SectionBU', () => {
        component.createCargoModel.cargoReleaseForm.setValue(fb);
        component.createCargoModel.cargoDefaultAmount = 12345;
        component.rowData[0]['financeBusinessUnitAssociations'] = [
            {
                'customerAgreementBusinessUnitCargoID': 41,
                'financeBusinessUnitCode': 'ICS'
            }
        ];
        component.createCargoModel.selectedSectionsList = {
            'customerSectionID': 843, 'customerSectionName': 'DFPDENSecti',
            'customerContractID': 538, 'customerContractName': '2104-DFPDENDesc', 'customerContractNumber': '2104',
            'sectionEffectiveDate': '2019-06-11', 'sectionExpirationDate': '2019-06-30', 'customerAgreementID': 343,
            'customerAgreementName': 'Dawn Food Products, Inc. (DFPDEN)'
        };
        component.sectionValidator();
    });

    it('shoul call sectionValidator-section', () => {
        component.createCargoModel.cargoReleaseForm.setValue(fb);
        component.createCargoModel.cargoDefaultAmount = 12345;
        component.createCargoModel.cargoReleaseForm.controls.businessUnit.setValue({});
        component.createCargoModel.selectedSectionsList = {
            'customerSectionID': 843, 'customerSectionName': 'DFPDENSecti',
            'customerContractID': 538, 'customerContractName': '2104-DFPDENDesc', 'customerContractNumber': '2104',
            'sectionEffectiveDate': '2019-06-11', 'sectionExpirationDate': '2019-06-30', 'customerAgreementID': 343,
            'customerAgreementName': 'Dawn Food Products, Inc. (DFPDEN)'
        };
        component.sectionValidator();
    });

    it('shoul call sectionValidator-else', () => {
        component.createCargoModel.selectedSectionsList = null;
        component.sectionValidator();
    });

    it('shoul call sectionBUValidator', () => {
        component.createCargoModel.cargoReleaseForm.setValue(fb);
        component.createCargoModel.cargoDefaultAmount = 12345;
        component.rowData[0]['financeBusinessUnitAssociations'] = [
            {
                'customerAgreementBusinessUnitCargoID': 41,
                'financeBusinessUnitCode': 'ICS'
            }
        ];
        component.createCargoModel.selectedSectionsList = {
            'customerSectionID': 843, 'customerSectionName': 'DFPDENSecti',
            'customerContractID': 538, 'customerContractName': '2104-DFPDENDesc', 'customerContractNumber': '2104',
            'sectionEffectiveDate': '2019-06-11', 'sectionExpirationDate': '2019-06-30', 'customerAgreementID': 343,
            'customerAgreementName': 'Dawn Food Products, Inc. (DFPDEN)'
        };
        component.sectionBUValidator();
    });

    it('shoul call sectionBUValidator-else', () => {
        component.createCargoModel.selectedSectionsList = null;
        component.sectionBUValidator();
    });

    it('shoul call onEditSave', () => {
        component.createCargoModel.cargoType = 'Agreement';
        component.createCargoModel.cargoReleaseForm.setValue(fb);
        spyOn(createCargoService, 'updateCargo').and.returnValue(of([345]));
        component.onEditSave();
    });

    it('shoul call dateFormatter', () => {
        expect(component.dateFormatter('1995-01-01')).toBe('01/01/1995');
    });

    it('shoul call onClickYes-cancel', () => {
        component.createCargoModel.cargoType = 'Agreement';
        component.createCargoModel.cargoReleaseForm.setValue(fb);
        component.onClickYes('cancel');
    });

    it('shoul call onClickYes-delete', () => {
        component.createCargoModel.cargoType = 'Agreement';
        component.createCargoModel.cargoReleaseForm.setValue(fb);
        component.onClickYes('delete');
    });

    it('shoul call onClickNo-cancel', () => {
        component.createCargoModel.cargoType = 'Agreement';
        component.createCargoModel.cargoReleaseForm.setValue(fb);
        component.onClickNo('cancel');
    });

    it('shoul call onClickNo-delete', () => {
        component.createCargoModel.cargoType = 'Agreement';
        component.createCargoModel.cargoReleaseForm.setValue(fb);
        component.onClickNo('delete');
    });

    it('shoul call onDateSelected-effectiveDate', () => {
        component.createCargoModel.expirationMaxDate = new Date('06/30/2019'.replace(/-/g, '\/').replace(/T.+/, ''));
        component.createCargoModel.cargoReleaseForm.setValue(fb);
        component.onDateSelected('06/11/2019', 'effectiveDate');
    });

    it('shoul call onDateSelected-expirationDate', () => {
        component.createCargoModel.expirationMaxDate = new Date('06/30/2019'.replace(/-/g, '\/').replace(/T.+/, ''));
        component.createCargoModel.cargoReleaseForm.setValue(fb);
        component.onDateSelected('06/30/2019', 'expirationDate');
    });

    it('shoul call onTypeDate-effectiveDate', () => {
        component.createCargoModel.expirationMaxDate = new Date('06/30/2019'.replace(/-/g, '\/').replace(/T.+/, ''));
        component.createCargoModel.cargoReleaseForm.setValue(fb);
        component.onTypeDate('06/11/2019', 'effectiveDate');
    });

    it('shoul call onTypeDate-effectiveDate-else', () => {
        component.createCargoModel.expirationMaxDate = new Date('06/30/2019'.replace(/-/g, '\/').replace(/T.+/, ''));
        component.createCargoModel.cargoReleaseForm.setValue(fb);
        component.createCargoModel.cargoReleaseForm.controls.effectiveDate.setValue('');
        component.onTypeDate('06/11/2019', 'effectiveDate');
    });
    it('shoul call onTypeDate-expirationDate', () => {
        component.createCargoModel.expirationMaxDate = new Date('06/30/2019'.replace(/-/g, '\/').replace(/T.+/, ''));
        component.createCargoModel.cargoReleaseForm.setValue(fb);
        component.onTypeDate('06/30/2019', 'expirationDate');
    });

    it('shoul call onTypeDate-expirationDate-else', () => {
        component.createCargoModel.expirationMaxDate = new Date('06/30/2019'.replace(/-/g, '\/').replace(/T.+/, ''));
        component.createCargoModel.cargoReleaseForm.setValue(fb);
        component.createCargoModel.cargoReleaseForm.controls.expirationDate.setValue('');
        component.onTypeDate('06/30/2019', 'expirationDate');
    });

    it('shoul call validateDateFormat-expirationDate', () => {
        component.validateDateFormat('06302019', 'expirationDate');
    });

    it('shoul call setDateValues-effectiveDate', () => {
        component.setDateValues('effectiveDate', '06/11/2019');
    });

    it('shoul call setDateValues-expirationDate', () => {
        component.setDateValues('expirationDate', '06/30/2019');
    });

    it('shoul call setFormErrors', () => {
        component.createCargoModel.isNotValidDate = true;
        component.setFormErrors();
    });

    it('shoul call validExpDate', () => {
        component.createCargoModel.expirationMaxDate = new Date('06/30/2019'.replace(/-/g, '\/').replace(/T.+/, ''));
        component.validExpDate();
    });

    it('shoul call validEffDate', () => {
        component.createCargoModel.expirationMaxDate = new Date('06/30/2019'.replace(/-/g, '\/').replace(/T.+/, ''));
        component.validEffDate();
    });

    it('shoul call emptyFormValue', () => {
        component.emptyFormValue();
    });

    it('shoul call onClickDelete', () => {
        component.onClickDelete();
    });

    it('shoul call onDelete', () => {
        component.createCargoModel.rowValue = agreementContactRowValue;
        const response: any = { 'cargoReleaseType': 'section', 'cargoId': 12 };
        spyOn(createCargoService, 'deleteGridData').and.returnValue(of(response));
        component.onDelete();
    });

    it('shoul call onSearch', () => {
        component.createCargoModel.rowValue = agreementContactRowValue;
        component.createCargoModel.sectionsList = [{
            'customerSectionID': 843, 'customerSectionName': 'DFPDENSecti',
            'customerContractID': 538, 'customerContractName': '2104-DFPDENDesc', 'customerContractNumber': '2104',
            'sectionEffectiveDate': '2019-06-11', 'sectionExpirationDate': '2019-06-30', 'customerAgreementID': 343,
            'customerAgreementName': 'Dawn Food Products, Inc. (DFPDEN)'
        }];
        const obj: any = { 'isTrusted': true, 'target': { 'value': 'DFPDENSecti' } };
        component.onSearch(obj);
    });

    it('should call toastMessage-success', () => {
        component.toastMessage(messageService, 'success', 'You need to have atleast Agreement Cargo Release for Agreement to be created');
    });

    it('shoul call validateCurrency', () => {
        component.validateCurrency('100,000', 'cargoValue');
    });
    it('shoul call formatCurrency', () => {
        component.formatCurrency('100,000', 'cargoValue');
    });
    it('shoul call formatCurrency-else', () => {
        component.formatCurrency('100', 'cargoValue');
    });
    it('shoul call formatCurrency-NAN', () => {
        component.formatCurrency('ABC', 'cargoValue');
    });
    it('shoul call currenyValueFormatter', () => {
        component.currenyValueFormatter('100000', 'cargoValue', '00');
    });

});
