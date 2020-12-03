import { Component, ElementRef, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DocumentationDetailedViewModel } from './model/documentation-detailed-view-model';
import { LocalStorageService } from './../../../../../shared/jbh-app-services/local-storage.service';
import * as utils from 'lodash';
import * as moment from 'moment';

import { DocumentationDetailedViewService } from './service/documentation-detailed-view.service';
import { BroadcasterService } from '../../../../../shared/jbh-app-services/broadcaster.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { takeWhile } from 'rxjs/operators';
import { DocumentationDetailedViewInterface } from './model/documentation-detailed-view-interface';
import { TimeZoneService } from '../../../../../shared/jbh-app-services/time-zone.service';

@Component({
  selector: 'app-documentation-detailed-view',
  templateUrl: './documentation-detailed-view.component.html',
  styleUrls: ['./documentation-detailed-view.component.scss']
})
export class DocumentationDetailedViewComponent implements OnInit, OnDestroy {
  @ViewChild('fileAttachment') fileAttachment: ElementRef;
  @ViewChild('onMenu') onMenu: ElementRef;
  @ViewChild('textAreaLegal') textAreaLegal: ElementRef;
  @ViewChild('textAreaInstructional') textAreaInstructional: ElementRef;


  documentationDetailedViewModel: DocumentationDetailedViewModel;
  agreementID: string;
  configurationId: number;
  constructor(private readonly activeRoute: ActivatedRoute, private readonly localStore: LocalStorageService,
    private readonly documentationDetailedViewService: DocumentationDetailedViewService,
    private readonly shared: BroadcasterService, private readonly router: Router,
    private readonly messageService: MessageService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly timeZone: TimeZoneService) {
    this.activeRoute.queryParams.subscribe((params) => {
      this.agreementID = String(params['id']);
      if (params['id'] && params['docId']) {
        this.configurationId = params['docId'];
      } else {
        this.onClickClose();
      }
    });
    this.documentationDetailedViewModel = new DocumentationDetailedViewModel(this.agreementID);
  }
  ngOnInit() {
    this.getAgreementDetails();
    this.documentationDetailedViewModel.overflowMenuList = this.overflowMenuList();
    this.documentationDetailedViewModel.documentConfigurationId = this.configurationId;
    this.getDocumentationDetail();
  }
  ngOnDestroy() {
    this.documentationDetailedViewModel.subscriberFlag = false;
  }
  onClickClose() {
    this.localStore.setAccessorialTab('accessType', 'create', { id: 1, text: 'documentation' });
    this.router.navigate(['/viewagreement'], {
      queryParams:
        { id: this.agreementID }
    });
  }
  onClickOverflowIcon(onMenu, event) {
    if (this.documentationDetailedViewModel.documentationDetailedViewResponse.status === 'Active') {
      onMenu.toggle(event);
    }
  }
  overflowMenuList() {
    return [{
      label: 'Edit'
    }];
  }
  getAgreementDetails() {
    this.documentationDetailedViewService.getAgreementDetails(this.agreementID)
      .pipe(takeWhile(() => this.documentationDetailedViewModel.subscriberFlag)).subscribe((data) => {
        if (!utils.isEmpty(data)) {
          this.documentationDetailedViewModel.agreementDetails = data;
        }
        this.changeDetector.detectChanges();
      }, (error: Error) => {
        this.errorScenarioInagreementDetails(error);
      });
  }
  errorScenarioInagreementDetails(error) {
    this.documentationDetailedViewModel.agreementDetails = null;
    this.toastMessage(this.messageService, 'error', 'Error', error['error'].errors[0].errorMessage);
    this.changeDetector.detectChanges();
  }
  getDocumentationDetail() {
    this.documentationDetailedViewModel.isLoading = true;
    this.documentationDetailedViewService.getDoumentaionDetails(this.agreementID,
      this.documentationDetailedViewModel.documentConfigurationId)
      .pipe(takeWhile(() => this.documentationDetailedViewModel.subscriberFlag))
      .subscribe((documentDetails: DocumentationDetailedViewInterface) => {
        this.getDocumentationDetailData(documentDetails);
      }, (agreementLevelError: Error) => {
        this.errorScenarioForDocumentDetail(agreementLevelError);
      });
  }
  errorScenarioForDocumentDetail(error) {
    this.documentationDetailedViewModel.isLoading = false;
    this.toastMessage(this.messageService,
      'error', 'Error', error['message']);
  }
  getDocumentationDetailData(documentDetails) {
    if (documentDetails['responseStatus'] === 'PARTIAL') {
      const invaliderrorMessages = `${documentDetails['errorMessages'].toString().replace(/[,]/gi, '.<br>')}.`;
      const messages = {
        severity: 'warn',
        summary: 'Warning',
        detail: invaliderrorMessages
      };
      this.messageService.add(messages);
    }
    this.documentationDetailedViewModel.isLoading = false;
    this.documentationDetailedViewModel.documentationDetailedViewResponse = documentDetails;
    this.getChargeTypes(this.documentationDetailedViewModel.documentationDetailedViewResponse);
    this.getBusinessOffering(this.documentationDetailedViewModel.documentationDetailedViewResponse);
    this.getCarrierCodes(this.documentationDetailedViewModel.documentationDetailedViewResponse);
    this.getRequestService(this.documentationDetailedViewModel.documentationDetailedViewResponse);
    this.getattachmentAddedOnDate(this.documentationDetailedViewModel.documentationDetailedViewResponse);
    if (this.documentationDetailedViewModel.documentationDetailedViewResponse.documentationType === 'Legal' &&
      this.documentationDetailedViewModel.documentationDetailedViewResponse.customerAccessorialText) {
      this.documentationDetailedViewModel.legalText =
        this.documentationDetailedViewModel.documentationDetailedViewResponse.customerAccessorialText.text;
      const matchText = this.documentationDetailedViewModel.legalText.match(/\n/g);
      const length = (matchText) ? (matchText.length) + 1 : 1;
      this.textAreaFramer('legalText', length);
    } else if (this.documentationDetailedViewModel.documentationDetailedViewResponse.documentationType === 'Instructional' &&
      this.documentationDetailedViewModel.documentationDetailedViewResponse.customerAccessorialText) {
      this.documentationDetailedViewModel.instructionalText =
        this.documentationDetailedViewModel.documentationDetailedViewResponse.customerAccessorialText.text;
      const matchText = this.documentationDetailedViewModel.instructionalText.match(/\n/g);
      const length = matchText ? (matchText.length + 1) : 1;
      this.textAreaFramer('instructionalText', length);
    }
    this.documentationDetailedViewModel.effectiveDate =
      moment(this.documentationDetailedViewModel.documentationDetailedViewResponse['effectiveDate'])
        .format(this.documentationDetailedViewModel.dateFormat);
    this.documentationDetailedViewModel.expirationDate =
      moment(this.documentationDetailedViewModel.documentationDetailedViewResponse['expirationDate'])
        .format(this.documentationDetailedViewModel.dateFormat);
  }
  private textAreaFramer(fieldKey: string, length: number) {
    if (this.documentationDetailedViewModel[fieldKey].length < 200 && length < 4) {
      this.textAreaLegal.nativeElement.setAttribute('rows', length);
    } else {
      this.textAreaLegal.nativeElement.setAttribute('rows', '8');
    }
  }

  getChargeTypes(data) {
    const chargeTypes = [];
    utils.forEach(data.customerAccessorialDocumentChargeTypes, (chargeType) => {
      chargeTypes.push(`${chargeType['chargeTypeName']}`);
    });
    this.documentationDetailedViewModel.chargeTypes = chargeTypes.join(', ');
  }

  getBusinessOffering(data) {
    let buSoFramer = [];
    let serviceLevels = [];
    utils.forEach(data.serviceLevelBusinessUnitServiceOfferings,
      (buSo) => {
        buSoFramer.push(`${buSo['businessUnit']} - ${buSo['serviceOffering']}`);
        serviceLevels.push(`${buSo['serviceLevel']}`);
      });
    buSoFramer = utils.uniq(buSoFramer);
    serviceLevels = utils.uniq(serviceLevels);
    this.documentationDetailedViewModel.businessUnitServiceOffering = buSoFramer.join(', ');
    this.documentationDetailedViewModel.serviceLevelList = serviceLevels.join(', ');
  }
  getCarrierCodes(data) {
    const carrierFramer = [];
    utils.forEach(data.carriers,
      (carrier) => {
        carrierFramer.push(`${carrier['carrierName']} (${carrier['carrierCode']})`);
      });
    this.documentationDetailedViewModel.carriers = carrierFramer.join(', ');
  }
  getRequestService(data) {
    const reqService = [];
    utils.forEach(data.requestServices,
      (service) => {
        reqService.push(`${service['requestedServiceTypeCode']}`);
      });
    this.documentationDetailedViewModel.reqService = reqService.join(', ');
  }
  getattachmentAddedOnDate(data) {
    const date = [];
    utils.forEach(data.attachments,
      (Adddate) => {
        Adddate['addedOn'] = this.timeZone.convertToLocalMilitaryUpdatedTime(Adddate['addedOn']);
        date.push(`${Adddate['addedOn']}`);
      });
    this.documentationDetailedViewModel.attachmentAddedOnDate = date;
  }
  viewAttachment(event) {
    const param = {
      'documentId': event.documentNumber,
      'ecmObjectStore': 'PRICING',
      'docClass': 'AGREEMENT'
    };
    this.documentationDetailedViewService.viewAttachmentDetails(param)
      .pipe(takeWhile(() => this.documentationDetailedViewModel.subscriberFlag))
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
  toastMessage(messageService: MessageService, severityType: string, title: string, messageDetail: string) {
    const message = {
      severity: severityType,
      summary: title,
      detail: messageDetail
    };
    messageService.clear();
    messageService.add(message);
  }
}
