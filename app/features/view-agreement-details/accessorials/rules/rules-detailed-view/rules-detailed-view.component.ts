import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { RulesDetailedViewModel } from './model/rules-detailed-view-model';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../../../../shared/jbh-app-services/local-storage.service';
import { RulesDetailedViewService } from './service/rules-detailed-view.service';
import { BroadcasterService } from '../../../../../shared/jbh-app-services/broadcaster.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { TimeZoneService } from '../../../../../shared/jbh-app-services/time-zone.service';
import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';
import * as moment from 'moment';
import {
  CustomerAccessorialRuleChargeDTO,
  DocumentationReqParamInterface
} from './model/rules-detailed-view-interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-rules-detailed-view',
  templateUrl: './rules-detailed-view.component.html',
  styleUrls: ['./rules-detailed-view.component.scss']
})
export class RulesDetailedViewComponent implements OnInit, OnDestroy {
  @ViewChild('fileAttachment') fileAttachment: ElementRef;
  @ViewChild('textAreaLegal') textAreaLegal: ElementRef;
  @ViewChild('textAreaInstructional') textAreaInstructional: ElementRef;
  rulesDetailedViewModel: RulesDetailedViewModel;
  agreementID: string;
  customerContractID = 'customerContractID';

  constructor(private readonly activeRoute: ActivatedRoute, private readonly localStore: LocalStorageService,
    private readonly rulesDetailedViewService: RulesDetailedViewService,
    private readonly shared: BroadcasterService, private readonly router: Router,
    private readonly messageService: MessageService,
    private readonly timeZoneService: TimeZoneService,
    private readonly datePipe: DatePipe,
    private readonly changeDetector: ChangeDetectorRef) {
    this.activeRoute.queryParams.subscribe((params) => {
      this.agreementID = String(params['id']);
    });
    this.rulesDetailedViewModel = new RulesDetailedViewModel(this.agreementID);
  }

  ngOnInit() {
    this.configurationIdSubscription();
    this.rulesDetailedViewModel.agreementDetails = this.localStore.getAgreementDetails();
    this.rulesDetailedViewModel.overflowMenuList = this.overflowMenuList();
    this.getRulesDetail();
  }
  ngOnDestroy() {
    this.rulesDetailedViewModel.subscriberFlag = false;
  }
  onClickOverflowIcon(menu, event) {
    if (this.rulesDetailedViewModel.rulesDetailedViewResponse.status === 'Active') {
      menu.toggle(event);
    }
  }
  overflowMenuList() {
    return [{
      label: 'Edit',
      command: (onclick) => {
        this.shared.broadcast('editAccesorialRules', {
          editRuleData: this.rulesDetailedViewModel.rulesDetailedViewResponse,
          isAccessorialRuleEdit: true,
          refreshDocumentResponse: this.rulesDetailedViewModel.refreshDocumentResponseData,
          ruleConfigurationId: this.rulesDetailedViewModel.ruleConfigurationId,
          editRequestedService: this.rulesDetailedViewModel.editRequestedService
        });
        this.router.navigate(['/viewagreement/editrules'], { queryParams: { id: this.agreementID } });
      }
    }];
  }
  configurationIdSubscription() {
    this.shared.on<number>('ruleDetailedViewConfigurationId').pipe(takeWhile(() => this.rulesDetailedViewModel.subscriberFlag))
      .subscribe((id: number) => {
        this.rulesDetailedViewModel.ruleConfigurationId = id;
      });
  }
  getRulesDetail() {
    this.rulesDetailedViewModel.isLoading = true;
    let errorInSerive = true;
    this.rulesDetailedViewService.getRulesDetailedViewData(this.agreementID, this.rulesDetailedViewModel.ruleConfigurationId)
      .pipe(takeWhile(() => this.rulesDetailedViewModel.subscriberFlag))
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
        this.rulesDetailedViewModel.rulesDetailedViewResponse = details;
        this.rulesDetailedViewModel.ruleEffectiveDate = moment(details['effectiveDate']).format(this.rulesDetailedViewModel.dateFormat);
        this.rulesDetailedViewModel.ruleExpirationDate = moment(details['expirationDate']).format(this.rulesDetailedViewModel.dateFormat);
        utils.forEach(this.rulesDetailedViewModel.rulesDetailedViewResponse.
          customerAccessorialRuleChargeDTOs, (rule: CustomerAccessorialRuleChargeDTO) => {
            this.rulesDetailedViewModel.rulesTableData.push(rule);
          });
        this.loadBUSO();
        this.loadCarrier();
        this.getRequestedServices(this.rulesDetailedViewModel.rulesDetailedViewResponse);
        if (errorInSerive) {
          this.getDocumentationDetailData(details);
        }
        this.getDateCreated(this.rulesDetailedViewModel.rulesDetailedViewResponse);
        this.getDateModified(this.rulesDetailedViewModel.rulesDetailedViewResponse);
        this.rulesDetailedViewModel.isLoading = false;
      }, (error: Error) => {
        this.errorHandling(error);
      });
  }
  loadBUSO() {
    let buSoFramer = [];
    let serviceLevels = [];
    utils.forEach(this.rulesDetailedViewModel.rulesDetailedViewResponse.serviceLevelBusinessUnitServiceOfferings,
      (buSo) => {
        buSoFramer.push(`${buSo['businessUnit']} - ${buSo['serviceOffering']}`);
        serviceLevels.push(`${buSo['serviceLevel']}`);
        this.frameBuSoForDocument(buSo);
      });
    buSoFramer = utils.uniq(buSoFramer);
    serviceLevels = utils.uniq(serviceLevels);
    this.rulesDetailedViewModel.businessUnitServiceOffering = buSoFramer.join(', ');
    this.rulesDetailedViewModel.serviceLevelList = serviceLevels.join(', ');
  }
  frameBuSoForDocument(businessUnitDTO) {
    const buSoId = businessUnitDTO['customerAccessorialServiceLevelBusinessUnitServiceOfferingId'];
    const buObj = {
      'customerAccessorialServiceLevelBusinessUnitServiceOfferingId':
        businessUnitDTO['serviceLevelBusinessUnitServiceOfferingAssociationId'],
      'serviceLevelBusinessUnitServiceOfferingAssociationId': buSoId,
      'businessUnit': businessUnitDTO['businessUnit'],
      'serviceOffering': businessUnitDTO['serviceOffering'],
      'serviceLevel': businessUnitDTO['serviceLevel']
    };
    this.rulesDetailedViewModel.buSoForDocument.push(buObj);
  }
  loadCarrier() {
    const carrierFramer = [];
    utils.forEach(this.rulesDetailedViewModel.rulesDetailedViewResponse.carriers,
      (carrier) => {
        carrierFramer.push(`${carrier['carrierName']} (${carrier['carrierCode']})`);
      });
    this.rulesDetailedViewModel.carriers = carrierFramer.join(', ');
  }
  getRequestedServices(data) {
    const reqValuesinEdit = [], reqService = [];
    utils.forEach(this.rulesDetailedViewModel.rulesDetailedViewResponse.requestServices,
      (service) => {
        reqValuesinEdit.push({
          requestedServiceTypeCode: service['requestedServiceTypeCode'],
          serviceTypeDescription: service['serviceTypeDescription'],
          requestedServiceTypeId: service['requestedServiceTypeId'],
          customerAccessorialRequestServiceId: service['customerAccessorialRequestServiceId']
        });
        reqService.push(`${service['serviceTypeDescription']}`);
      });
    this.rulesDetailedViewModel.editRequestedService = reqValuesinEdit;
    this.rulesDetailedViewModel.reqService = reqService.join(', ');
  }
  getDocumentationDetailData(documentDetails) {
    const param = this.frameDocumentationReqParam(documentDetails);
    this.rulesDetailedViewModel.isLoading = true;
    this.rulesDetailedViewService.getRulesDocumentation(this.agreementID, param)
      .pipe(takeWhile(() => this.rulesDetailedViewModel.subscriberFlag))
      .subscribe((documentResponseDetails) => {
        this.rulesDetailedViewModel.isLoading = false;
        this.refreshData(documentResponseDetails);
        this.rulesDetailedViewModel.refreshDocumentResponseData = documentResponseDetails;
      }, (error: Error) => {
        this.errorHandling(error);
      });
  }
  refreshData(documentation) {
    if (documentation.length === 2) {
      this.legalInstructionalDocumentation(documentation);
    } else if (documentation.length === 1) {
      this.legalOrInstructionalDocumentation(documentation);
    } else {
      this.rulesDetailedViewModel.documentation.noDocumentationFound = true;
    }
  }
  legalInstructionalDocumentation(documentation) {
    let legalRef = null;
    let instructionalRef = null;
    this.rulesDetailedViewModel.documentation.attachments = [];
    if (documentation[0]['accessorialDocumentTypeName'] === 'Legal') {
      this.rulesDetailedViewModel.documentation.documentTypeID = documentation[0]['customerAccessorialDocumentTextId'];
      legalRef = documentation[0];
      instructionalRef = documentation[1];
    } else {
      legalRef = documentation[1];
      instructionalRef = documentation[0];
    }
    if (legalRef.attachments) {
      this.rulesDetailedViewModel.documentation.legalAttachments = legalRef.attachments;
    }
    if (instructionalRef.attachments) {
      this.rulesDetailedViewModel.documentation.instructionalAttachments = instructionalRef.attachments;
    }
    this.setAttachment();
    this.rulesDetailedViewModel.documentation.docIsLegalText = true;
    this.rulesDetailedViewModel.documentation.docIsInstructionalText = true;
    this.rulesDetailedViewModel.documentation.legalTextArea = legalRef['text'];
    this.rulesDetailedViewModel.documentation.instructionalTextArea = instructionalRef['text'];
    this.rulesDetailedViewModel.documentation.legalStartDate = this.dateFormatter(legalRef['effectiveDate']);
    this.rulesDetailedViewModel.documentation.legalEndDate = this.dateFormatter(legalRef['expirationDate']);
    this.rulesDetailedViewModel.documentation.instructionStartDate = this.dateFormatter(instructionalRef['effectiveDate']);
    this.rulesDetailedViewModel.documentation.instructionEndDate = this.dateFormatter(instructionalRef['expirationDate']);
    this.changeDetector.detectChanges();
  }
  legalOrInstructionalDocumentation(documentation) {
    let legalRef = null;
    let instructionalRef = null;
    this.rulesDetailedViewModel.documentation.attachments = [];
    if (documentation[0]['accessorialDocumentTypeName'] === 'Legal') {
      legalRef = documentation[0];
      this.rulesDetailedViewModel.documentation.legalTextArea = legalRef['text'];
      this.rulesDetailedViewModel.documentation.docIsLegalText = true;
      this.rulesDetailedViewModel.documentation.legalStartDate = this.dateFormatter(legalRef['effectiveDate']);
      this.rulesDetailedViewModel.documentation.legalEndDate = this.dateFormatter(legalRef['expirationDate']);
      if (legalRef.attachments) {
        legalRef.attachments = this.convertAttachmentDate(legalRef.attachments);
        this.rulesDetailedViewModel.documentation.legalAttachments = legalRef.attachments;
      }
    } else {
      instructionalRef = documentation[0];
      this.rulesDetailedViewModel.documentation.instructionalTextArea = instructionalRef['text'];
      this.rulesDetailedViewModel.documentation.noDocumentationFound = true;
      this.rulesDetailedViewModel.documentation.docIsInstructionalText = true;
      this.rulesDetailedViewModel.documentation.instructionStartDate = this.dateFormatter(instructionalRef['effectiveDate']);
      this.rulesDetailedViewModel.documentation.instructionEndDate = this.dateFormatter(instructionalRef['expirationDate']);
      if (instructionalRef.attachments) {
        instructionalRef.attachments = this.convertAttachmentDate(instructionalRef.attachments);
        this.rulesDetailedViewModel.documentation.instructionalAttachments = instructionalRef.attachments;
      }
    }
    this.setAttachment();
    this.changeDetector.detectChanges();
  }
  setAttachment() {
    this.rulesDetailedViewModel.documentation.attachments = this.rulesDetailedViewModel.documentation.legalAttachments
      .concat(this.rulesDetailedViewModel.documentation.instructionalAttachments);
  }
  convertAttachmentDate(attachments) {
    attachments.forEach(attachment => {
      attachment['createTimestamp'] =
        attachment.createTimestamp ? this.timeZoneService.convertToLocalMilitaryUpdatedTime(attachment.createTimestamp) : null;
    });
    return attachments;
  }
  dateFormatter(value: string | Date): string {
    return moment(value).format(this.rulesDetailedViewModel.dateFormat);
  }
  getDateCreated(data) {
    let createdDate;
    createdDate = this.timeZoneService.convertToLocalMilitaryUpdatedTime(data['createTimestamp']);
    this.rulesDetailedViewModel.createTimestamp = createdDate;
  }
  getDateModified(data) {
    let modifiedDate;
    modifiedDate = this.timeZoneService.convertToLocalMilitaryUpdatedTime(data['lastUpdateTimestamp']);
    this.rulesDetailedViewModel.lastUpdateTimestamp = modifiedDate;
  }
  viewAttachment(event) {
    const param = {
      'documentId': event.documentNumber,
      'ecmObjectStore': 'PRICING',
      'docClass': 'AGREEMENT'
    };
    this.rulesDetailedViewService.viewAttachmentDetails(param)
      .pipe(takeWhile(() => this.rulesDetailedViewModel.subscriberFlag))
      .subscribe((documentDetails) => {
        this.downloadAttachment(documentDetails, event);
      }, (attachmentLevelError: Error) => {
        this.toastMessage(this.messageService,
          'error', 'Error', attachmentLevelError['message']);
      });
  }
  downloadAttachment(documentDetails, attachmentData) {
    const fileName = attachmentData.documentName;
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(documentDetails, fileName);
    } else {
      this.fileAttachment.nativeElement.href = URL.createObjectURL(documentDetails);
      this.fileAttachment.nativeElement.download = fileName;
      this.fileAttachment.nativeElement.click();
    }
  }
  frameDocumentationReqParam(details) {
    return {
      'attributeLevel': this.getAttributeLevel(details),
      'customerChargeName': this.rulesDetailedViewModel.rulesDetailedViewResponse.customerChargeName,
      'customerAgreementId': this.rulesDetailedViewModel.rulesDetailedViewResponse.customerAgreementId,
      'accessorialDocumentTypeId': this.rulesDetailedViewModel.rulesDetailedViewResponse.documentationTypeId,
      'customerAccessorialAccountDTOs': this.frameAccountDTOForDocument(),
      'businessUnitServiceOfferingDTOs': (this.rulesDetailedViewModel.buSoForDocument.length > 0) ?
        this.rulesDetailedViewModel.buSoForDocument : null,
      'requestServiceDTOs': this.iterateRequestedService(),
      'carrierDTOs': this.frameCarrierDTOForDocument(),
      'effectiveDate': this.rulesDetailedViewModel.rulesDetailedViewResponse.effectiveDate,
      'expirationDate': this.rulesDetailedViewModel.rulesDetailedViewResponse.expirationDate,
      'level': this.getAccessorialLevel(),
      'chargeTypeId': this.rulesDetailedViewModel.rulesDetailedViewResponse.chargeTypeId,
      'currencyCode': this.rulesDetailedViewModel.rulesDetailedViewResponse.currencyCode,
      'chargeTypeName': this.rulesDetailedViewModel.rulesDetailedViewResponse.chargeTypeName,
      'equipmentCategoryCode': this.rulesDetailedViewModel.rulesDetailedViewResponse.equipmentCategoryCode,
      'equipmentTypeCode': this.rulesDetailedViewModel.rulesDetailedViewResponse.equipmentType,
      'equipmentLengthDescription': this.rulesDetailedViewModel.rulesDetailedViewResponse.equipmentLengthDescription,
      'equipmentLengthId': this.rulesDetailedViewModel.rulesDetailedViewResponse.equipmentLengthId,
      'equipmentTypeId': this.rulesDetailedViewModel.rulesDetailedViewResponse.equipmentTypeId
    };
  }
  iterateRequestedService() {
    const requestedServices = [];
    if (!utils.isEmpty(this.rulesDetailedViewModel.rulesDetailedViewResponse.requestServices)) {
      this.rulesDetailedViewModel.rulesDetailedViewResponse.requestServices.forEach(requestedServicesElement => {
        requestedServices.push({
          requestedServiceTypeCode:
            `${requestedServicesElement['requestedServiceTypeCode']}:${requestedServicesElement['serviceTypeDescription']}`
        });
      });
    }
    return requestedServices;
  }
  frameAccountDTOForDocument() {
    let accountDTO;
    let accountDTOArray = [];
    if (this.rulesDetailedViewModel.rulesDetailedViewResponse.level === 'Contract') {
      accountDTOArray = this.setContractAccountDTO();
    } else if (this.rulesDetailedViewModel.rulesDetailedViewResponse.level === 'Section') {
      accountDTOArray = this.setSectionAccountDTO();
    } else if (this.rulesDetailedViewModel.rulesDetailedViewResponse.level === 'Agreement') {
      accountDTOArray = this.setAccountDTO();
    }
    accountDTO = (accountDTOArray && accountDTOArray.length) ? accountDTOArray : null;
    return accountDTO;
  }
  setAccountDTO() {
    let accountObj;
    if (this.rulesDetailedViewModel.rulesDetailedViewResponse.billToAccounts) {
      accountObj = this.iterateAgreementBillTo();
    }
    return accountObj;
  }
  iterateAgreementBillTo() {
    const accountDetails = [];
    this.rulesDetailedViewModel.rulesDetailedViewResponse['billToAccounts'].forEach((billTo) => {
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
    if (this.rulesDetailedViewModel.rulesDetailedViewResponse.contracts) {
      contractObj = this.iteruleContractBillTo();
    } else {
      contractObj = this.iteruleContract();
    }
    return contractObj;
  }
  setSectionAccountDTO() {
    let sectionObj;
    let sectionContractAssociateObj;
    if (this.rulesDetailedViewModel.rulesDetailedViewResponse.sections) {
      sectionObj = this.iteruleSectionBillTo();
    } else {
      sectionObj = this.iteruleSection();
    }
    sectionContractAssociateObj = this.iteruleSectionContract(sectionObj);
    return sectionContractAssociateObj;
  }
  iteruleContract() {
    const accountDetails = [];
    this.rulesDetailedViewModel.rulesDetailedViewResponse['contracts'].forEach((contract) => {
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
  iteruleSection() {
    const sectionAccountDetails = [];
    this.rulesDetailedViewModel.rulesDetailedViewResponse['sections'].forEach((section) => {
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
  iteruleContractBillTo() {
    const accountDetails = [];
    this.rulesDetailedViewModel.rulesDetailedViewResponse['contracts'].forEach((contractElement) => {
      let count = 0;
      this.rulesDetailedViewModel.rulesDetailedViewResponse['billToAccounts'].forEach((billToElement) => {
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
  iteruleSectionBillTo() {
    const accountDetails = [];
    this.rulesDetailedViewModel.rulesDetailedViewResponse['sections'].forEach((sectionElement) => {
      let count = 0;
      this.rulesDetailedViewModel.rulesDetailedViewResponse['billToAccounts'].forEach((billToElement) => {
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
  iteruleSectionContract(sectionAccountObj) {
    if (this.rulesDetailedViewModel.rulesDetailedViewResponse['contracts']) {
      sectionAccountObj.forEach((sectionAccountElement) => {
        this.rulesDetailedViewModel.rulesDetailedViewResponse['contracts'].forEach((contract) => {
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
  frameCarrierDTOForDocument() {
    let carrierDTO = null;
    const carrierObj = [];
    let obj;
    utils.forEach(this.rulesDetailedViewModel.rulesDetailedViewResponse.carriers,
      (carrier) => {
        obj = {
          'carrierId': carrier['carrierId'],
          'carrierDisplayName': carrier['carrierDisplayName'],
          'carrierCode': carrier['carrierCode'],
          'carrierName': carrier['carrierName']
        };
        carrierObj.push(obj);
      });
    carrierDTO = (carrierObj.length) ? carrierObj : null;
    return carrierDTO;
  }
  getAccessorialLevel() {
    const ruleLevel = this.getRuleLevel();
    const isBillTo = this.isBillTo();
    const isCarrier = this.isCarrier();
    if (isBillTo && isCarrier) {
      return ruleLevel - 9;
    } else if (isCarrier) {
      return ruleLevel - 3;
    } else if (isBillTo) {
      return ruleLevel - 6;
    } else {
      return ruleLevel;
    }
  }
  getRuleLevel() {
    if (this.rulesDetailedViewModel.rulesDetailedViewResponse.level === 'Contract') {
      return 11;
    } else if (this.rulesDetailedViewModel.rulesDetailedViewResponse.level === 'Section') {
      return 10;
    } else {
      return 12;
    }
  }
  isBillTo(): boolean {
    let billToExist;
    if (!utils.isEmpty(this.rulesDetailedViewModel.rulesDetailedViewResponse['billToAccounts'])) {
      billToExist = true;
    } else {
      billToExist = false;
    }
    return billToExist;
  }
  isCarrier() {
    let isCarrier;
    if (!utils.isEmpty(this.rulesDetailedViewModel.rulesDetailedViewResponse['carriers'])) {
      isCarrier = true;
    } else {
      isCarrier = false;
    }
    return isCarrier;
  }
  isBU(): boolean {
    let isBusinessUnit;
    if (!utils.isEmpty(this.rulesDetailedViewModel.rulesDetailedViewResponse['serviceLevelBusinessUnitServiceOfferings'])) {
      isBusinessUnit = true;
    } else {
      isBusinessUnit = false;
    }
    return isBusinessUnit;
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
    this.rulesDetailedViewModel.isLoading = false;
    if (error && error['error'] && error['error']['errors']) {
      this.toastMessage(this.messageService, 'error', 'Error', error['error']['errors'][0]['errorMessage']);
    }
    this.changeDetector.markForCheck();
  }
  onClickClose() {
    this.localStore.setAccessorialTab('accessType', 'create', { id: 2, text: 'rules' });
    this.router.navigate(['/viewagreement'], {
      queryParams:
        { id: this.agreementID }
    });
  }
  getAttributeLevel(datas) {
    datas.attribteLevel = 12;
    if (this.isBU()) {
      datas.attribteLevel--;
      if (!utils.isEmpty(datas.requestServices)) {
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
      if (datas.equipmentType) {
        datas.attribteLevel--;
      }
      if (datas.equipmentLength) {
        datas.attribteLevel--;
      }
    }
  }

}
