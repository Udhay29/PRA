import { APP_BASE_HREF } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpHeaders, HttpResponseBase } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';

import { of } from 'rxjs';
import { FuelSummaryHelperUtility } from './service/fuel-summary-helper-utility';
import { AppModule } from '../../../../app.module';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';
import { ViewAgreementDetailsModule } from './../../view-agreement-details.module';
import { FuelSummaryUtility } from './service/fuel-summary-utility';
import { FuelSummaryService } from './service/fuel-summary.service';
import { FuelSummaryComponent } from './fuel-summary.component';
import { AgreementDetails } from './model/fuel-summary.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';


describe('FuelSummaryComponent', () => {
  let component: FuelSummaryComponent;
  let fixture: ComponentFixture<FuelSummaryComponent>;
  let service: FuelSummaryService;
  let utilservice: FuelSummaryUtility;
  let shared: BroadcasterService;
  let agreementDetails: AgreementDetails;
  let successResponse: HttpResponseBase;
  const formBuilder: FormBuilder = new FormBuilder();
  let formGroup: FormGroup;
  let messageService: MessageService;
  let selectedList;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, AppModule, ViewAgreementDetailsModule],
      providers: [FuelSummaryService, FuelSummaryUtility, BroadcasterService, { provide: APP_BASE_HREF, useValue: '/' }, MessageService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelSummaryComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(FuelSummaryService);
    utilservice = fixture.debugElement.injector.get(FuelSummaryUtility);
    shared = fixture.debugElement.injector.get(BroadcasterService);
    messageService = TestBed.get(MessageService);
    fixture.detectChanges();
    formGroup = formBuilder.group({
      programType: ['create', Validators.required],
      programName: ['test', Validators.required],
      effectiveDate: ['20/10/2019', Validators.required],
      expirationDate: ['29/10/2099', Validators.required],
      businessUnit: ['DCS', Validators.required],
      carriers: [null],
      affiliationLevel: ['test', Validators.required],
      notes: [null],
      selectedData: [],
      selectedListData: []
    });
    selectedList = [{
      'display': 'Malnove Incorporated Of Ne (MAOM10)',
      'section': 'sda',
      'contract': '123rest (test)',
      'saveData': {
        'billingPartyID': 175311,
        'billingPartyCode': 'MAOM10',
        'billingPartyName': 'Malnove Incorporated Of Ne',
        'sectionAccountID': 5550,
        'sectionID': 12,
        'sectionName': 'string',
        'contractID': 12,
        'contractName': 'string',
        'contractNumber': 'string',
        'contractType': 'string',
        'saveContractBillTo': null
      },
      'saveContractBillTo': {
        'billingPartyID': 175311,
        'billingPartyCode': 'MAOM10',
        'billingPartyName': 'Malnove Incorporated Of Ne',
        'billingPartyDisplayName': 'Malnove Incorporated Of Ne (MAOM10)',
        'sectionAccountID': 5550,
        'customerAgreementContractID': 86,
        'customerContractNumber': '123rest',
        'customerContractName': 'test',
        'customerContractType': 'Legal',
        'customerContractDisplayName': '123rest (test)'
      },
      'saveSectionBillTo': {
        'customerAgreementSectionID': 3270,
        'customerAgreementSectionName': 'sda',
        'billingPartyID': 175311,
        'billingPartyCode': 'MAOM10',
        'billingPartyName': 'Malnove Incorporated Of Ne',
        'billingPartyDisplayName': 'Malnove Incorporated Of Ne (MAOM10)',
        'sectionAccountID': 5550
      }
    }
    ];

    agreementDetails = {
      'customerAgreementID': 565,
      'customerAgreementName': 'Dkj & Wpj Llc (DKBE6)',
      'agreementType': 'Customer',
      'ultimateParentAccountID': 26905,
      'currencyCode': 'USD',
      'cargoReleaseAmount': 100000,
      'businessUnits': [
        'JBI',
        'JBT',
        'ICS',
        'DCS'
      ],
      'taskAssignmentIDs': null,
      'effectiveDate': '1995-01-01',
      'expirationDate': '2099-12-31',
      'invalidIndicator': 'N',
      'invalidReasonTypeName': 'Active'
    };
    component.fuelSummaryModel.agreementDetails = agreementDetails;
    successResponse = {
      'headers': new HttpHeaders(),
      'ok': true,
      'status': 201,
      'statusText': 'Created',
      'type': 4,
      'url': ''
    };
    component.fuelSummaryModel.fuelSummaryForm = formGroup;
    component.fuelSummaryModel.fuelSummaryForm.controls['effectiveDate']
      .setValue(new Date());
    component.fuelSummaryModel.fuelSummaryForm.controls['expirationDate']
      .setValue(new Date(agreementDetails.expirationDate.replace(/-/g, '\/').replace(/T.+/, '')));
    component.fuelSummaryModel.effectiveMinDate = new Date(agreementDetails.effectiveDate.replace(/-/g, '\/').replace(/T.+/, ''));
    component.fuelSummaryModel.expirationMaxDate = new Date(agreementDetails.expirationDate.replace(/-/g, '\/').replace(/T.+/, ''));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call navigationSubscription', () => {
    component.navigationSubscription();
  });
  it('should call getSharedAgreementDetails', () => {
    spyOn(shared, 'on').and.returnValue(of(agreementDetails));
    component.getSharedAgreementDetails();
  });
  it('should call onDateSelected for if condition', () => {
    FuelSummaryUtility.checkErrors('expirationDate', component.fuelSummaryModel);
    component.onDateSelected(new Date(), 0);
  });
  it('should call onDateSelected for else condition', () => {
    component.onDateSelected(new Date(), 1);
  });
  it('should call checkDateValues', () => {
    component.checkDateValues();
  });

  it('should call onTypeDate for expiration case', () => {
    const onClickMock = spyOn(component, 'onTypeDate');
    fixture.debugElement.query(By.css('#fuelExpirationDate')).triggerEventHandler('onInput', '12/31/2099');
    expect(onClickMock).toHaveBeenCalled();
  });

  it('should call getBusinessUnitServiceOffering', () => {
    const responseData = {
      '_embedded': {
        'serviceOfferingBusinessUnitTransitModeAssociations': [{
          'financeBusinessUnitServiceOfferingAssociation': {
            'financeBusinessUnitServiceOfferingAssociationID': 1,
            'financeBusinessUnitCode': 'JBT',
            'serviceOfferingCode': 'OTR',
            'effectiveTimestamp': '2016-01-01T00:00',
            'expirationTimestamp': '2199-12-31T23:59:59',
            'lastUpdateTimestampString': '2017-11-20T08:24:31.8980803'
          },
          'transitMode': {
            'transitModeCode': 'Truck',
            'transitModeDescription': 'Transit By Truck',
            'lastUpdateTimestampString': '2017-10-17T10:58:53.3255625'
          },
          'utilizationClassification': {
            'utilizationClassificationCode': 'Headhaul',
            'utilizationClassificationDescription': 'Headhaul Utilization',
            'lastUpdateTimestampString': '2017-11-20T08:24:31.9990816'
          },
          'freightShippingType': {
            'freightShippingTypeCode': 'FTL',
            'freightShippingTypeDescription': 'Full Truck Load Shipping',
            'lastUpdateTimestampString': '2017-11-20T08:24:32.0111474'
          },
          'lastUpdateTimestampString': '2017-11-20T08:24:32.0290906',
          '_links': {
            'self': {
              'href': ''
            },
            'serviceOfferingBusinessUnitTransitModeAssociation': {
              'href': '',
              'templated': true
            }
          }
        }]
      },
      '_links': {
        'self': {
          'href': ''
        }
      }
    };
    spyOn(service, 'getBusinessUnitServiceOffering').and.returnValue(of(responseData));
    component.getBusinessUnitServiceOffering();
  });
  it('should call onSearchCarrier', () => {
    const event = new Event('input');
    event['query'] = 's';
    const carrierData = {
      'took': 17,
      'timed_out': false,
      '_shards': {
        'total': 5,
        'successful': 5,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 2,
        'max_score': 2,
        'hits': [
          {
            '_index': 'masterdata-carrier-carrierdetails-v2',
            '_type': 'doc',
            '_id': 'AWZjpiuemEZA5pCXUpzM',
            '_score': 2,
            '_source': {
              'LegalName': 'SEVASHE EXPRESS OFPA INC',
              'CarrierID': 65,
              'CarrierCode': '03EH'
            }
          },
          {
            '_index': 'masterdata-carrier-carrierdetails-v2',
            '_type': 'doc',
            '_id': 'AWZfwWxUmEZA5pCXUpx-',
            '_score': 2,
            '_source': {
              'LegalName': 'Bear & Cub Shipping LLC',
              'CarrierID': 1234,
              'CarrierCode': 'BC123456'
            }
          }
        ]
      },
      'aggregations': {
        'unique': {
          'doc_count_error_upper_bound': 0,
          'sum_other_doc_count': 0,
          'buckets': [
            {
              'key': 'Bear & Cub Shipping LLC',
              'doc_count': 1,
              'Level': {
                'hits': {
                  'total': 1,
                  'max_score': 2,
                  'hits': [
                    {
                      '_index': 'masterdata-carrier-carrierdetails-v2',
                      '_type': 'doc',
                      '_id': 'AWZfwWxUmEZA5pCXUpx-',
                      '_score': 2,
                      '_source': {
                        'LegalName': 'Bear & Cub Shipping LLC',
                        'CarrierID': 1234,
                        'CarrierCode': 'BC123456'
                      }
                    }
                  ]
                }
              }
            },
            {
              'key': 'SEVASHE EXPRESS OFPA INC',
              'doc_count': 1,
              'Level': {
                'hits': {
                  'total': 1,
                  'max_score': 2,
                  'hits': [
                    {
                      '_index': 'masterdata-carrier-carrierdetails-v2',
                      '_type': 'doc',
                      '_id': 'AWZjpiuemEZA5pCXUpzM',
                      '_score': 2,
                      '_source': {
                        'LegalName': 'SEVASHE EXPRESS OFPA INC',
                        'CarrierID': 65,
                        'CarrierCode': '03EH'
                      }
                    }
                  ]
                }
              }
            }
          ]
        }
      }
    };
    spyOn(service, 'getCarrierDetails').and.returnValue(of(carrierData));
    component.onSearchCarrier(event);
  });
  it('should call onCancel', () => {
    component.onCancel();
  });
  it('should call onNext for if condition', () => {
    component.fuelSummaryModel.fuelSummaryForm.markAsTouched();
    spyOn(service, 'fuelSummarySave').and.returnValue(of(successResponse));
    component.onNext();
  });
  it('should call getBillToList', () => {
    const BillToList = [{
      sectionAccountID: 123456,
      billingPartyID: 123456,
      billingPartyName: 'Webcom LTD',
      billingPartyCode: 'WEBB14',
      sectionID: 235489,
      sectionName: 'Webcom section',
      contractID: 123456,
      contractName: 'Webcom Contract',
      contractNumber: 'LEG001',
      contractType: 'Legal',
      saveContractBillTo: {
        billingPartyID: 123456,
        billingPartyCode: 'test',
        billingPartyName: 'test',
        billingPartyDisplayName: 'test',
        sectionAccountID: 123456,
        customerAgreementContractID: 1,
        customerContractNumber: 'test',
        customerContractName: 'test',
        customerContractType: 'test',
        customerContractDisplayName: 'test',
        customerAgreementSectionID: 1,
        customerAgreementSectionName: 'test'
      }
    }];
    spyOn(service, 'getBillToLists').and.returnValue(of(BillToList));
    component.getBillToList({});
  });

  it('should call getContractOrSectionListItem', () => {
    const ContractList = [{
      customerAgreementContractID: 1194,
      customerContractName: 'CNHA2',
      customerContractNumber: 'CNHA2',
      contractTypeID: 1,
      contractTypeName: 'Legal',
      effectiveDate: '2019-03-01',
      expirationDate: '2019-03-31',
      combineNameNumber: 'test',
      customerAgreementContractSectionID: 1,
      customerAgreementContractSectionName: 'test'
    }];
    spyOn(service, 'getContractSectionList').and.returnValue(of(ContractList));
    component.getContractOrSectionListItem();
  });

  it('should call saveSubscription', () => {
    FuelSummaryHelperUtility.saveSubscription(true, component.fuelSummaryModel);
    component.saveSubscription();
  });
  it('should call affiliationChanged', () => {
    component.fuelSummaryModel.fuelSummaryForm = formGroup;
    component.fuelSummaryModel.fuelSummaryForm.controls.affiliationLevel.setValue('test');
    component.fuelSummaryModel.selectedAffiliationValue = 'aggrement';
    const event = { value: 'agreement' };
    component.affiliationChanged(event);
  });

  it('should call affiliationChangeYes', () => {
    FuelSummaryHelperUtility.affiliationChangedYes(component.fuelSummaryModel);
    component.fuelSummaryModel.selectedAffiliationValue = 'section';
    component.affiliationChangeYes();
  });
  it('should call removeDirty', () => {
    FuelSummaryHelperUtility.removeDirty(component.fuelSummaryModel);
    component.removeDirty();
  });
  it('should call popupCancel', () => {
    component.popupCancel();
  });

  it('should call getAffiliationLevel', () => {
    const affiliationList = ['Agreement', 'Contract', 'Section'];
    spyOn(service, 'getAffiliation').and.returnValue(of(affiliationList));
    FuelSummaryUtility.checkSelectedData(component.fuelSummaryModel, 'agreement');
    FuelSummaryHelperUtility.getAffiliation(component.fuelSummaryModel, affiliationList);
    component.getAffiliationLevel();
  });

  it('should call saveSuccess', () => {
    component.saveSuccess(successResponse);
  });

  it('should call onBusinessUnitChange', () => {
    component.fuelSummaryModel.fuelSummaryForm.controls['businessUnit'].setValue('');
    component.onBusinessUnitChange();
  });

  it('should call onTypeDate', () => {
    const event = { srcElement: { value: '29/01/2019' } };
    component.onTypeDate(event, 'effective');
    component.onTypeDate(event, 'expiration');
  });

  it('should call onNext for if condition', () => {
    component.fuelSummaryModel.fuelSummaryForm = formGroup;
    component.fuelSummaryModel.fuelSummaryForm.markAsTouched();
    spyOn(service, 'fuelSummarySave').and.returnValue(of(successResponse));
    component.onNext();
  });
  it('should call sectionLevelValidation', () => {
    component.fuelSummaryModel.selectedOption = 'section';
    component.fuelSummaryModel.selectedItemList = [{
      combineNameNumber: '544 (contract1)',
      contractTypeName: 'Tariff',
      customerAgreementContractID: 2647,
      customerContractName: 'contract1',
      customerContractNumber: '544',
      effectiveDate: '05/01/2019',
      expirationDate: '12/31/2099'
    }];
    component.sectionLevelValidation();
  });
  it('should call affilicationChange for agreement case', () => {
    component.affilicationChange('agreement');
  });
  it('should call affilicationChange for contract case', () => {
    component.affilicationChange('contract');
  });
  it('should call affilicationChange for section case', () => {
    component.affilicationChange('section');
  });
  it('should call affilicationChange for section case', () => {
    component.fuelSummaryModel.fuelSummaryForm.controls.effectiveDate.setValue(null);
    component.affilicationChange('section');
  });
  it('should call isEmptyTable', () => {
    const event = { filteredValue: [] };
    component.isEmptyTable(event);
  });
  it('should call isEmptyTableBillTo', () => {
    const event = { filteredValue: [] };
    component.isEmptyTableBillTo(event);
  });
  it('should call getContractBillToList', () => {
    component.fuelSummaryModel.selectedItemList = [{
      combineNameNumber: '544 (contract1)',
      contractTypeName: 'Tariff',
      customerAgreementContractID: 2647,
      customerContractName: 'contract1',
      customerContractNumber: '544',
      effectiveDate: '05/01/2019',
      expirationDate: '12/31/2099'
    }];
    component.getContractBillToList();
  });
  it('should call getAgreementBillTo', () => {
    component.getAgreementBillTo();
  });
  it('should call onClearValues', () => {
    component.onClearValues('carriers');
  });
  it('should call onMultiSelectBlur', () => {
    component.onMultiSelectBlur();
  });
  it('should call valueChangesSubscription', () => {
    component.valueChangesSubscription();
  });
  xit('should call onClickNext', () => {
    FuelSummaryHelperUtility.onClickNext(component.fuelSummaryModel, messageService);
  });
  it('should call clearFilterData', () => {
    FuelSummaryHelperUtility.clearFilterData(component.billtotable);
  });
  it('should call getContractBillToIds', () => {
    component.fuelSummaryModel.selectedItemList = [
      {
        'customerAgreementContractID': 113,
        'customerContractName': 'Tariff Contract 054',
        'customerContractNumber': '1906',
        'contractTypeName': 'Tariff',
        'effectiveDate': '06/26/2019',
        'expirationDate': '12/31/2099',
        'combineNameNumber': '1906 (Tariff Contract 054)'
      }];
    FuelSummaryHelperUtility.getContractBillToIds(component.fuelSummaryModel);
  });
  it('should call getContractBillToIds', () => {
    component.fuelSummaryModel.selectedItemList = [];
    FuelSummaryHelperUtility.getContractBillToIds(component.fuelSummaryModel);
  });
  it('should call formatRequest for agreement case', () => {
    component.fuelSummaryModel.fuelSummaryForm.controls['affiliationLevel'].setValue('agreement');
    FuelSummaryHelperUtility.formatRequest(component.fuelSummaryModel);
  });
  it('should call formatRequest for contract case', () => {
    component.fuelSummaryModel.fuelSummaryForm.controls['affiliationLevel'].setValue('contract');
    component.fuelSummaryModel.isContractBillTo = true;
    FuelSummaryHelperUtility.formatRequest(component.fuelSummaryModel);
  });
  it('should call formatRequest for contract case', () => {
    component.fuelSummaryModel.fuelSummaryForm.controls['affiliationLevel'].setValue('contract');
    component.fuelSummaryModel.isContractBillTo = false;
    FuelSummaryHelperUtility.formatRequest(component.fuelSummaryModel);
  });
  it('should call formatRequest for section case', () => {
    component.fuelSummaryModel.fuelSummaryForm.controls['affiliationLevel'].setValue('section');
    component.fuelSummaryModel.isSectionBillTo = false;
    FuelSummaryHelperUtility.formatRequest(component.fuelSummaryModel);
  });
  it('should call formatRequest for section case', () => {
    component.fuelSummaryModel.fuelSummaryForm.controls['affiliationLevel'].setValue('section');
    component.fuelSummaryModel.isSectionBillTo = true;
    FuelSummaryHelperUtility.formatRequest(component.fuelSummaryModel);
  });
  it('should call getAgreementBillTo for contract case', () => {
    component.fuelSummaryModel.selectedItemList = [
      {
        'customerAgreementContractID': 113,
        'customerContractName': 'Tariff Contract 054',
        'customerContractNumber': '1906',
        'contractTypeName': 'Tariff',
        'effectiveDate': '06/26/2019',
        'expirationDate': '12/31/2099',
        'combineNameNumber': '1906 (Tariff Contract 054)'
      }];
    component.fuelSummaryModel.fuelSummaryForm.controls['affiliationLevel'].setValue('contract');
    FuelSummaryHelperUtility.getAgreementBillTo(component.fuelSummaryModel);
  });
  it('should call getAgreementBillTo for section case', () => {
    component.fuelSummaryModel.selectedItemList = [
      {
        'customerAgreementContractID': 113,
        'customerContractName': 'Tariff Contract 054',
        'customerContractNumber': '1906',
        'contractTypeName': 'Tariff',
        'effectiveDate': '06/26/2019',
        'expirationDate': '12/31/2099',
        'combineNameNumber': '1906 (Tariff Contract 054)'
      }];
    component.fuelSummaryModel.fuelSummaryForm.controls['affiliationLevel'].setValue('section');
    FuelSummaryHelperUtility.getAgreementBillTo(component.fuelSummaryModel);
  });
  it('should call getSelectedAgreement', () => {
    component.fuelSummaryModel.affiliationValue = 'agreement';
    component.fuelSummaryModel.selectedItemList = [
      {
        'customerAgreementContractID': 113,
        'customerContractName': 'Tariff Contract 054',
        'customerContractNumber': '1906',
        'contractTypeName': 'Tariff',
        'effectiveDate': '06/26/2019',
        'expirationDate': '12/31/2099',
        'combineNameNumber': '1906 (Tariff Contract 054)'
      }];
    FuelSummaryUtility.getSelectedAgreement(component.fuelSummaryModel);
  });
  it('should call getSelectedAgreement', () => {
    component.fuelSummaryModel.affiliationValue = 'contract';
    FuelSummaryUtility.getSelectedAgreement(component.fuelSummaryModel);
  });
  it('should call checkErrors', () => {
    component.fuelSummaryModel.fuelSummaryForm.controls['expirationDate'].setErrors({ invalid: true });
    FuelSummaryUtility.checkErrors('expirationDate', component.fuelSummaryModel);
  });
  it('should call getSelectedContractBillToRequest', () => {
    component.fuelSummaryModel.fuelSummaryForm.controls['affiliationLevel'].setValue('contract');
    component.fuelSummaryModel.selectedList = selectedList;
    component.fuelSummaryModel.selectedItemList = [{
      combineNameNumber: 'CONT0010 (Primary Home Depot Account)',
      contractTypeName: 'Legal',
      customerAgreementContractID: 263,
      customerContractName: 'Primary Home Depot Account',
      customerContractNumber: 'CONT0010',
      effectiveDate: '01/01/2019',
      expirationDate: '12/31/2099'}
    ];
    FuelSummaryUtility.getSelectedContractBillToRequest(component.fuelSummaryModel);
  });
  it('should call getContractListData', () => {
    component.fuelSummaryModel.fuelSummaryForm.controls['affiliationLevel'].setValue('contract');
    component.fuelSummaryModel.selectedItemList = [
      {
        'customerAgreementContractID': 113,
        'customerContractName': 'Tariff Contract 054',
        'customerContractNumber': '1906',
        'contractTypeName': 'Tariff',
        'effectiveDate': '06/26/2019',
        'expirationDate': '12/31/2099',
        'combineNameNumber': '1906 (Tariff Contract 054)'
      }];
    FuelSummaryUtility.getContractListData(component.fuelSummaryModel);
  });
  it('should call getSectionListData', () => {
    component.fuelSummaryModel.fuelSummaryForm.controls['affiliationLevel'].setValue('section');
    component.fuelSummaryModel.selectedItemList = [
      {
        'customerAgreementContractID': 113,
        'customerContractName': 'Tariff Contract 054',
        'customerContractNumber': '1906',
        'contractTypeName': 'Tariff',
        'effectiveDate': '06/26/2019',
        'expirationDate': '12/31/2099',
        'combineNameNumber': '1906 (Tariff Contract 054)'
      }];
    FuelSummaryUtility.getSectionListData(component.fuelSummaryModel);
  });
  it('should call getSelectedSectionBillToRequest', () => {
    component.fuelSummaryModel.fuelSummaryForm.controls['affiliationLevel'].setValue('section');
    component.fuelSummaryModel.selectedList = selectedList;
    component.fuelSummaryModel.selectedItemList = [
      {combineNameNumber: 'CONT0010 (Primary Home Depot Account)',
      contractTypeName: 'Legal',
      customerAgreementContractID: 263,
      customerAgreementContractSectionID: 3226,
      customerAgreementContractSectionName: 'sectio4545',
      customerContractName: 'Primary Home Depot Account',
      customerContractNumber: 'CONT0010',
      effectiveDate: '07/30/2019',
      expirationDate: '12/31/2099'}
    ];
    FuelSummaryUtility.getSelectedSectionBillToRequest(component.fuelSummaryModel);
  });
});
