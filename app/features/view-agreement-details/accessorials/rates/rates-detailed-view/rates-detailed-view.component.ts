import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';
import * as moment from 'moment';
import { MessageService } from 'primeng/components/common/messageservice';

import { LocalStorageService } from './../../../../../shared/jbh-app-services/local-storage.service';
import { RatesDetailedViewModel } from './model/rates-detailed-view-model';
import { RatesDetailedViewService } from './service/rates-detailed-view.service';
import {
  CustomerAccessorialRateAdditionalChargeDTO,
  CustomerAccessorialRateChargeDTO
} from './model/rates-detailed-view-interface';
import { BroadcasterService } from '../../../../../shared/jbh-app-services/broadcaster.service';

@Component({
  selector: 'app-rates-detailed-view',
  templateUrl: './rates-detailed-view.component.html',
  styleUrls: ['./rates-detailed-view.component.scss']
})
export class RatesDetailedViewComponent implements OnInit, OnDestroy {
  ratesDetailedViewModel: RatesDetailedViewModel;
  agreementID: string;
  customerContractID = 'customerContractID';

  constructor(private readonly activeRoute: ActivatedRoute, private readonly localStore: LocalStorageService,
    private readonly ratesDetailedViewService: RatesDetailedViewService,
    private readonly shared: BroadcasterService, private readonly router: Router,
    private readonly messageService: MessageService,
    private readonly changeDetector: ChangeDetectorRef) {
    this.activeRoute.queryParams.subscribe((params) => {
      this.agreementID = String(params['id']);
    });
    this.ratesDetailedViewModel = new RatesDetailedViewModel(this.agreementID);
  }

  ngOnInit() {
    this.configurationIdSubscription();
    this.ratesDetailedViewModel.agreementDetails = this.localStore.getAgreementDetails();
    this.ratesDetailedViewModel.overflowMenuList = this.overflowMenuList();
    this.getRatesDetail();
  }
  ngOnDestroy() {
    this.ratesDetailedViewModel.subscriberFlag = false;
  }
  onClickClose() {
    this.router.navigate(['/viewagreement'], {
      queryParams:
        { id: this.agreementID }
    });
  }
  onClickOverflowIcon(menu, event) {
    if (this.ratesDetailedViewModel.ratesDetailedViewResponse.status === 'Active') {
      menu.toggle(event);
    }
  }
  overflowMenuList() {
    return [{
      label: 'Edit',
      command: (onclick) => {
        this.shared.broadcast('editAccesorialRates', {
          editRateData: this.ratesDetailedViewModel.ratesDetailedViewResponse,
          isAccessorialRateEdit: true,
          refreshDocumentResponse: this.ratesDetailedViewModel.refreshDocumentResponse,
          rateConfigurationId: this.ratesDetailedViewModel.rateConfigurationId,
          editRequestedServiceResponse: this.ratesDetailedViewModel.editRequestedService
        });
        this.router.navigate(['/viewagreement/editrates'], { queryParams: { id: this.agreementID } });
      }
    }];
  }
  configurationIdSubscription() {
    this.shared.on<number>('rateDetailedViewConfigurationId').pipe(takeWhile(() => this.ratesDetailedViewModel.subscriberFlag))
      .subscribe((id: number) => {
        this.ratesDetailedViewModel.rateConfigurationId = id;
      });
  }
  getRatesDetail() {
    this.ratesDetailedViewModel.isLoading = true;
    let errorInSerive = true;
    this.ratesDetailedViewService.getRatesDetailedViewData(this.agreementID, this.ratesDetailedViewModel.rateConfigurationId)
      .pipe(takeWhile(() => this.ratesDetailedViewModel.subscriberFlag))
      .subscribe((details) => {
        if (details['responseStatus'] === 'PARTIAL') {
          errorInSerive = false;
          const invaliderrorMessages = `${details['errorMessages'].toString().replace(/[,]/gi, '.<br>')}.`;
          const messages = {
            severity: 'warn',
            summary: 'Warning',
            detail: invaliderrorMessages
          };
          this.messageService.add(messages);
        }
        this.ratesDetailedViewModel.ratesDetailedViewResponse = details;
        this.ratesDetailedViewModel.rateEffectiveDate = moment(details['effectiveDate']).format('MM/DD/YYYY');
        this.ratesDetailedViewModel.rateExpirationDate = moment(details['expirationDate']).format('MM/DD/YYYY');
        utils.forEach(details.customerAccessorialRateChargeDTOs, (rate: CustomerAccessorialRateChargeDTO) => {
          this.ratesDetailedViewModel.ratesTableData.push(rate);
        });
        this.loadBUSO();
        this.loadCarrier();
        this.loadRequestService();
        this.loadAdditionalCharges();
        if (errorInSerive) {
          this.getDocumentationDetails(details);
        }
        this.ratesDetailedViewModel.isLoading = false;
      }, (error: Error) => {
        this.errorHandling(error);
      });
  }
  loadAdditionalCharges() {
    utils.forEach(this.ratesDetailedViewModel.ratesDetailedViewResponse.customerAccessorialRateAdditionalChargeDTOs,
      (additionalCharge: CustomerAccessorialRateAdditionalChargeDTO) => {
        if (!utils.isEmpty(additionalCharge['additionalChargeTypeName'])) {
          additionalCharge['additionalChargeTypeNameWithCode'] = `${additionalCharge['additionalChargeTypeName']} (${
            additionalCharge['additionalChargeCodeName']})`;
        }
        this.ratesDetailedViewModel.additionalChargesTableData.push(additionalCharge);
      });
  }
  loadBUSO() {
    let buSoFramer = [];
    let serviceLevels = [];
    utils.forEach(this.ratesDetailedViewModel.ratesDetailedViewResponse.businessUnitServiceOfferingDTOs,
      (buSo) => {
        buSoFramer.push(`${buSo['businessUnit']} - ${buSo['serviceOffering']}`);
        serviceLevels.push(`${buSo['serviceLevel']}`);
        this.frameBuSoForDocument(buSo);
      });
    buSoFramer = utils.uniq(buSoFramer);
    serviceLevels = utils.uniq(serviceLevels);
    this.ratesDetailedViewModel.businessUnitServiceOffering = buSoFramer.join(', ');
    this.ratesDetailedViewModel.serviceLevelList = serviceLevels.join(', ');
  }
  frameBuSoForDocument(businessUnitDTO) {
    const buSoId = businessUnitDTO['customerAccessorialServiceLevelBusinessUnitServiceOfferingId'];
    const buObj = {
      'customerAccessorialServiceLevelBusinessUnitServiceOfferingId': buSoId,
      'serviceLevelBusinessUnitServiceOfferingAssociationId': businessUnitDTO['serviceLevelBusinessUnitServiceOfferingAssociationId'],
      'businessUnit': businessUnitDTO['businessUnit'],
      'serviceOffering': businessUnitDTO['serviceOffering'],
      'serviceLevel': businessUnitDTO['serviceLevel']
    };
    this.ratesDetailedViewModel.buSoForDocument.push(buObj);
  }
  loadCarrier() {
    const carrierFramer = [];
    utils.forEach(this.ratesDetailedViewModel.ratesDetailedViewResponse.carrierDTOs,
      (carrier) => {
        carrierFramer.push(`${carrier['carrierName']} (${carrier['carrierCode']})`);
      });
    this.ratesDetailedViewModel.carriers = carrierFramer.join(', ');
  }
  loadRequestService() {
    const reqService = [];
    const reqServiceForEdit = [];
    utils.forEach(this.ratesDetailedViewModel.ratesDetailedViewResponse.requestServiceDTOs,
      (service) => {
        reqService.push(`${service['serviceTypeDescription']}`);
        reqServiceForEdit.push({
          code: service['requestedServiceTypeCode'],
          description: service['serviceTypeDescription']
        });
      });
    this.ratesDetailedViewModel.editRequestedService = reqServiceForEdit;
    this.changeDetector.markForCheck();
    this.ratesDetailedViewModel.reqService = reqService.join(', ');
  }
  getDocumentationDetails(detail) {
    const param = this.frameDocumentationReqParam(detail);
    this.ratesDetailedViewService.getRatesDocumentation(this.agreementID, param)
      .pipe(takeWhile(() => this.ratesDetailedViewModel.subscriberFlag))
      .subscribe((details) => {
        this.ratesDetailedViewModel.refreshDocumentResponse = details;
        utils.forEach(details, (document) => {
          if (document['accessorialDocumentTypeName'] === 'Legal') {
            this.ratesDetailedViewModel.legalText = document['text'];
          }
          if (document['accessorialDocumentTypeName'] === 'Instructional') {
            this.ratesDetailedViewModel.instructionalText = document['text'];
          }
          this.ratesDetailedViewModel.attachments = this.ratesDetailedViewModel.attachments.concat(document['attachments']);
        });
      }, (error: Error) => {
        this.errorHandling(error);
      });
  }
  frameDocumentationReqParam(details) {
    return {
      'attributeLevel': this.getAttributeLevel(details),
      'customerChargeName': this.ratesDetailedViewModel.ratesDetailedViewResponse.customerChargeName,
      'customerAgreementId': this.ratesDetailedViewModel.ratesDetailedViewResponse.customerAgreementId,
      'accessorialDocumentTypeId': this.ratesDetailedViewModel.ratesDetailedViewResponse.accessorialDocumentTypeId,
      'equipmentLengthId': this.ratesDetailedViewModel.ratesDetailedViewResponse.equipmentLengthId,
      'equipmentTypeId': this.ratesDetailedViewModel.ratesDetailedViewResponse.equipmentTypeId,
      'customerAccessorialAccountDTOs': this.frameAccountDTOForDocument(),
      'businessUnitServiceOfferingDTOs': (this.ratesDetailedViewModel.buSoForDocument.length > 0) ?
        this.ratesDetailedViewModel.buSoForDocument : null,
      'requestServiceDTOs': this.ratesDetailedViewModel.ratesDetailedViewResponse.requestServiceDTOs,
      'carrierDTOs': this.frameCarrierDTOForDocument(),
      'effectiveDate': this.ratesDetailedViewModel.ratesDetailedViewResponse.effectiveDate,
      'expirationDate': this.ratesDetailedViewModel.ratesDetailedViewResponse.expirationDate,
      'level': this.getAccessorialLevel(),
      'chargeTypeId': this.ratesDetailedViewModel.ratesDetailedViewResponse.chargeTypeId,
      'chargeTypeName': this.ratesDetailedViewModel.ratesDetailedViewResponse.chargeTypeName,
      'currencyCode': this.ratesDetailedViewModel.ratesDetailedViewResponse.currencyCode,
      'equipmentCategoryCode': this.ratesDetailedViewModel.ratesDetailedViewResponse.equipmentCategoryCode,
      'equipmentTypeCode': this.ratesDetailedViewModel.ratesDetailedViewResponse.equipmentTypeDescription
    };
  }
  getAccessorialLevel() {
    const rateLevel = this.getRateLevel();
    const isBillTo = this.isBillTo();
    const isCarrier = this.isCarrier();
    if (isBillTo && isCarrier) {
      return rateLevel - 9;
    } else if (isCarrier) {
      return rateLevel - 3;
    } else if (isBillTo) {
      return rateLevel - 6;
    } else {
      return rateLevel;
    }
  }
  getRateLevel() {
    if (this.ratesDetailedViewModel.ratesDetailedViewResponse.level === 'Contract') {
      return 11;
    } else if (this.ratesDetailedViewModel.ratesDetailedViewResponse.level === 'Section') {
      return 10;
    } else {
      return 12;
    }
  }
  isBillTo(): boolean {
    let billToExist;
    if (this.ratesDetailedViewModel.ratesDetailedViewResponse['sectionAccounts']) {
      billToExist = true;
    } else {
      billToExist = false;
    }
    return billToExist;
  }
  isCarrier() {
    let isCarrier;
    if ((!utils.isEmpty(this.ratesDetailedViewModel.ratesDetailedViewResponse.carrierDTOs))) {
      isCarrier = true;
    } else {
      isCarrier = false;
    }
    return isCarrier;
  }
  frameCarrierDTOForDocument() {
    let carrierDTO = null;
    const carrierObj = [];
    let obj;
    utils.forEach(this.ratesDetailedViewModel.ratesDetailedViewResponse.carrierDTOs,
      (carrier) => {
        obj = {
          'carrierId': carrier['carrierId'],
          'customerAccessorialRateConfigurationId': this.ratesDetailedViewModel.rateConfigurationId,
          'customerAccessorialRateCarrierId': carrier['customerAccessorialCarrierId'],
          'carrierCode': carrier['carrierCode'],
          'carrierName': carrier['carrierName']
        };
        carrierObj.push(obj);
      });
    carrierDTO = (carrierObj.length) ? carrierObj : null;
    return carrierDTO;
  }
  frameAccountDTOForDocument() {
    let accountDTO;
    let accountDTOArray = [];
    if (this.ratesDetailedViewModel.ratesDetailedViewResponse.level === 'Contract') {
      accountDTOArray = this.setContractAccountDTO();
    } else if (this.ratesDetailedViewModel.ratesDetailedViewResponse.level === 'Section') {
      accountDTOArray = this.setSectionAccountDTO();
    } else if (this.ratesDetailedViewModel.ratesDetailedViewResponse.level === 'Agreement') {
      accountDTOArray = this.setAccountDTO();
    }
    accountDTO = (accountDTOArray && accountDTOArray.length) ? accountDTOArray : null;
    return accountDTO;
  }
  setAccountDTO() {
    let accountObj;
    if (this.ratesDetailedViewModel.ratesDetailedViewResponse.sectionAccounts) {
      accountObj = this.iterateAgreementBillTo();
    }
    return accountObj;
  }
  iterateAgreementBillTo() {
    const accountDetails = [];
    this.ratesDetailedViewModel.ratesDetailedViewResponse['sectionAccounts'].forEach((billTo) => {
      accountDetails.push({
        customerAccessorialAccountId: null,
        customerAgreementContractSectionId: null,
        customerAgreementContractSectionName: null,
        customerAgreementContractId: null,
        customerAgreementContractName: null,
        customerAgreementContractSectionAccountId: billTo['customerAgreementContractSectionAccountID'],
        customerAgreementContractSectionAccountName: billTo['billToName']
      });
    });
    return accountDetails;
  }
  setContractAccountDTO() {
    let contractObj;
    if (this.ratesDetailedViewModel.ratesDetailedViewResponse.sectionAccounts) {
      contractObj = this.iterateContractBillTo();
    } else {
      contractObj = this.iterateContract();
    }
    return contractObj;
  }
  setSectionAccountDTO() {
    let sectionObj;
    let sectionContractAssociateObj;
    if (this.ratesDetailedViewModel.ratesDetailedViewResponse.sectionAccounts) {
      sectionObj = this.iterateSectionBillTo();
    } else {
      sectionObj = this.iterateSection();
    }
    sectionContractAssociateObj = this.iterateSectionContract(sectionObj);
    return sectionContractAssociateObj;
  }
  iterateContract() {
    const accountDetails = [];
    this.ratesDetailedViewModel.ratesDetailedViewResponse['contracts'].forEach((contract) => {
      accountDetails.push({
        customerAccessorialAccountId: null,
        customerAgreementContractSectionId: null,
        customerAgreementContractSectionName: null,
        customerAgreementContractId: contract['customerAgreementContractID'],
        customerAgreementContractName: contract['customerContractName'],
        customerAgreementContractSectionAccountId: null,
        customerAgreementContractSectionAccountName: null
      });
    });
    return accountDetails;
  }
  iterateSection() {
    const sectionAccountDetails = [];
    this.ratesDetailedViewModel.ratesDetailedViewResponse['sections'].forEach((section) => {
      sectionAccountDetails.push({
        customerAccessorialAccountId: null,
        customerAgreementContractSectionId: section['customerAgreementContractSectionID'],
        customerAgreementContractSectionName: section['customerAgreementContractSectionName'],
        customerAgreementContractId: section[this.customerContractID],
        customerAgreementContractName: null,
        customerAgreementContractSectionAccountId: null,
        customerAgreementContractSectionAccountName: null,
        customerContractNumber: section['customerContractNumber']
      });
    });
    return sectionAccountDetails;
  }
  iterateContractBillTo() {
    const accountDetails = [];
    this.ratesDetailedViewModel.ratesDetailedViewResponse['contracts'].forEach((contractElement) => {
      let count = 0;
      this.ratesDetailedViewModel.ratesDetailedViewResponse['sectionAccounts'].forEach((billToElement) => {
        if (contractElement['customerAgreementContractID'] === billToElement['customerAgreementContractID']) {
          count++;
          accountDetails.push(this.setContractBillTo(billToElement));
        }
      });
      if (count === 0) {
        accountDetails.push(this.setAccountValue(contractElement));
      }
    });
    return accountDetails;
  }
  iterateSectionBillTo() {
    const accountDetails = [];
    this.ratesDetailedViewModel.ratesDetailedViewResponse['sections'].forEach((sectionElement) => {
      let count = 0;
      this.ratesDetailedViewModel.ratesDetailedViewResponse['sectionAccounts'].forEach((billToElement) => {
        if (sectionElement['customerAgreementContractSectionID'] === billToElement['customerAgreementContractSectionID']) {
          count++;
          accountDetails.push(this.setSectionBillTo(billToElement));
        }
      });
      if (count === 0) {
        accountDetails.push(this.setAccountValue(sectionElement));
      }
    });
    return accountDetails;
  }
  setContractBillTo(billToElement) {
    return {
      customerAccessorialAccountId: null,
      customerAgreementContractSectionId: null,
      customerAgreementContractSectionName: null,
      customerAgreementContractId: billToElement['customerAgreementContractID'],
      customerAgreementContractName: billToElement['customerContractName'],
      customerAgreementContractSectionAccountId: billToElement['customerAgreementContractSectionAccountID'],
      customerAgreementContractSectionAccountName: billToElement['billToName']
    };
  }
  setSectionBillTo(billToElement) {
    return {
      customerAccessorialAccountId: null,
      customerAgreementContractSectionId: billToElement['customerAgreementContractSectionID'],
      customerAgreementContractSectionName: billToElement['customerAgreementContractSectionName'],
      customerAgreementContractId: billToElement['customerAgreementContractID'],
      customerAgreementContractName: null,
      customerAgreementContractSectionAccountId: billToElement['customerAgreementContractSectionAccountID'],
      customerAgreementContractSectionAccountName: billToElement['billToName'],
    };
  }
  iterateSectionContract(sectionAccountObj) {
    if (this.ratesDetailedViewModel.ratesDetailedViewResponse['contracts']) {
      sectionAccountObj.forEach((sectionAccountElement) => {
        this.ratesDetailedViewModel.ratesDetailedViewResponse['contracts'].forEach((contract) => {
          if (contract['customerAgreementContractID'] === sectionAccountElement['customerAgreementContractId']) {
            sectionAccountElement['customerAgreementContractId'] = contract['customerAgreementContractID'];
            sectionAccountElement['customerAgreementContractName'] = contract['customerContractName'];
          }
        });
      });
    }
    return sectionAccountObj;
  }
  setAccountValue(accountElement) {
    return {
      customerAccessorialAccountId: null,
      customerAgreementContractSectionId: accountElement['customerAgreementContractSectionID'] ?
        accountElement['customerAgreementContractSectionID'] : null,
      customerAgreementContractSectionName: accountElement['customerAgreementContractSectionName'] ?
        accountElement['customerAgreementContractSectionName'] : null,
      customerAgreementContractId: this.setAgreementContractId(accountElement),
      customerAgreementContractName: accountElement['customerContractName'] ? accountElement['customerContractName'] : null,
      customerAgreementContractSectionAccountId: null,
      customerAgreementContractSectionAccountName: null,
      customerContractNumber: (accountElement['customerAgreementContractSectionName'] &&
        accountElement['customerContractNumber']) ? accountElement['customerContractNumber'] : null
    };
  }
  setAgreementContractId(accountElement) {
    if (accountElement['customerAgreementContractID']) {
      return accountElement['customerAgreementContractID'];
    } else if (accountElement[this.customerContractID]) {
      return accountElement[this.customerContractID];
    } else {
      return null;
    }
  }
  toastMessage(messageService: MessageService, severityType: string, title: string, messageDetail: string) {
    const message = {
      severity: severityType,
      summary: title,
      detail: messageDetail
    };
    messageService.clear();
    messageService.add(message);
  }
  errorHandling(error) {
    this.ratesDetailedViewModel.isLoading = false;
    this.loadRequestService();
    if (error && error['error'] && error['error']['errors']) {
      this.toastMessage(this.messageService, 'error', 'Error', error['error']['errors'][0]['errorMessage']);
    }
    this.changeDetector.markForCheck();
  }
  getAttributeLevel(datas) {
    datas.attribteLevel = 12;
    if (this.isBUs(datas)) {
      datas.attribteLevel--;
      if (!utils.isEmpty(datas.requestServiceDTOs)) {
        datas.attribteLevel--;
        this.checkEquipmentLevels(datas, 7);
      } else {
        this.checkEquipmentLevels(datas, 10);
      }
    } else {
      this.checkEquipmentLevels(datas, 4);
    }
    return datas.attribteLevel;
  }
  checkEquipmentLevels(datas, level: number) {
    if (datas.equipmentCategoryCode) {
      datas.attribteLevel = level;
      datas.attribteLevel--;
      if (datas.equipmentTypeDescription) {
        datas.attribteLevel--;
      }
      if (datas.equipmentLength) {
        datas.attribteLevel--;
      }
    }
  }
  isBUs(datas): boolean {
    return !utils.isEmpty(datas.businessUnitServiceOfferingDTOs);
  }
}
