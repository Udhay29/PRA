import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnInit, OnDestroy } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DocumentListService } from '../documentation/service/document-list.service';
import { DocumentationService } from '../documentation/service/documentation.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { DocumentationModel } from '../documentation/model/documentation.model';
import { QueryMock, RootObject, Hits, Document } from '../documentation/model/doumentaion.interface';
import { DocumentsFilterQuery } from '../documentation/query/documentation-list.query';
import * as utils from 'lodash';
import { isArray } from 'util';
import * as moment from 'moment';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';
import { TimeZoneService } from '../../../../shared/jbh-app-services/time-zone.service';


@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentationComponent implements OnInit, OnDestroy {

  @Input() agreementID;
  documentationModel: DocumentationModel;
  constructor(private readonly router: Router, private readonly documentListService: DocumentListService,
    private readonly changeDetector: ChangeDetectorRef, private readonly documentationService: DocumentationService,
    private readonly messageService: MessageService,
    private readonly shared: BroadcasterService, private readonly timeZone: TimeZoneService) {
    this.documentationModel = new DocumentationModel();

  }

  ngOnInit(): void {
    this.getMockJson();
  }
  ngOnDestroy(): void {
    this.documentationModel.subscriberFlag = false;
  }
  onCreateDocumentation() {
    this.router.navigate(['/viewagreement/documentation'], { queryParams: { id: this.agreementID } });
  }
  onRowSelect(event: Event) {
    if (event['type'] !== 'checkbox') {
      this.router.navigate(['/viewagreement/documentationdetailedview'], {
        queryParams: {
          id: this.agreementID,
          docId: event['data']['customerAccessorialDocumentConfigurationViewId']
        }
      });
    }
  }
  getMockJson() {
    this.documentationModel.isShowLoader = true;
    this.documentListService.getMockJson().pipe(takeWhile(() =>
      this.documentationModel.subscriberFlag)).subscribe((data: QueryMock) => {
        this.documentationModel.sourceData = data;
        const query = DocumentsFilterQuery.getDocumentList(this.documentationModel.sourceData, this.agreementID);
        DocumentationService.setElasticparam(query);
        this.getContractsListData();
      });
  }

  getContractsListData() {
    const params = DocumentationService.getElasticparam();
    this.documentationModel.isShowLoader = true;
    this.documentListService.getDocumentList(params).pipe(takeWhile(() =>
      this.documentationModel.subscriberFlag)).subscribe((data: RootObject) => {
        this.documentationModel.documentList = [];
        if (!utils.isEmpty(data) && !utils.isEmpty(data['hits']) && isArray(data['hits']['hits'])) {
          const resultset = [];
          this.documentationModel.gridDataLength = data['hits']['total'];
          utils.forEach(data['hits']['hits'], (response: Hits) => {
            resultset.push(this.formatListData(response['_source']));
            this.changeDetector.detectChanges();
          });
          this.documentationModel.documentList = resultset;
          this.documentationModel.noResultFoundFlag = (this.documentationModel.documentList.length === 0);
          this.documentationModel.isShowLoader = false;
          this.changeDetector.detectChanges();
        }
      }, (error: Error) => {
        this.documentationModel.noResultFoundFlag = true;
        this.documentationModel.isShowLoader = false;
        this.toastMessage('error', error.message);
        this.changeDetector.detectChanges();
      });
  }

  formatListData(resultSetData: any): any {
    resultSetData['text'] = resultSetData['customerAccessorialText']['text'];
    resultSetData['textName'] = resultSetData['customerAccessorialText']['textName'];
    resultSetData['fileType'] = this.attachmentFramer(resultSetData['customerAccessorialAttachments'],
      'fileType');
    resultSetData['accessorialAttachmentTypeName'] = this.attachmentFramer(resultSetData['customerAccessorialAttachments'],
      'accessorialAttachmentTypeName');
    resultSetData['customerAgreementContractName'] = this.getMergedList(resultSetData['customerAccessorialAccounts'],
      'customerAgreementContractName');
    resultSetData['customerAgreementContractSectionName'] = this.getMergedList(resultSetData['customerAccessorialAccounts'],
      'customerAgreementContractSectionName');
    resultSetData['customerAgreementContractSectionAccountName'] = this.getMergedList(resultSetData['customerAccessorialAccounts'],
      'customerAgreementContractSectionAccountName');
    resultSetData['businessUnitServiceOfferingDTOs'] =
      this.businessFramer(resultSetData['customerAccessorialServiceLevelBusinessUnitServiceOfferings']);
    resultSetData['serviceLevel'] = this.serviceLevelFramer(resultSetData['customerAccessorialServiceLevelBusinessUnitServiceOfferings']);
    resultSetData['requestedServices'] = this.reqServiceFramer(resultSetData['customerAccessorialRequestServices']);
    resultSetData['carrierName'] = this.carrierFramer(resultSetData['customerAccessorialCarriers']);
    resultSetData['addedOn'] = this.addOnFramer(resultSetData['customerAccessorialAttachments'],
      'addedOn');
    resultSetData['addedBy'] = this.attachmentFramer(resultSetData['customerAccessorialAttachments'],
      'addedBy');
    resultSetData['documentName'] = this.attachmentFramer(resultSetData['customerAccessorialAttachments'],
      'documentName');
    resultSetData['accessorialAttachmentTypeId'] = this.attachmentFramer(resultSetData['customerAccessorialAttachments'],
      'documentNumber');
    resultSetData['equipmentLengthId'] = resultSetData['equipmentLengthDisplayName'];
    resultSetData.effectiveDate = resultSetData.effectiveDate ? moment(resultSetData.
      effectiveDate).format('MM/DD/YYYY') : '--';
    resultSetData.expirationDate = resultSetData.expirationDate ?
      moment(resultSetData.expirationDate).format('MM/DD/YYYY') : '--';
    resultSetData['customerAccessorialDocumentConfigurationViewId'] = resultSetData['customerAccessorialDocumentConfigurationId'];
    resultSetData['chargeTypeName'] = this.getMergedList(resultSetData['customerAccessorialDocumentChargeTypes'], 'chargeTypeName');
    return resultSetData;
  }

  getMergedList(data: any[], currentKey: string): any {
    let tempList = [];
    utils.forEach(data, (response: any) => {
      if (response && response[currentKey]) {
        tempList.push(response[currentKey]);
      }
    });
    tempList = utils.uniq(tempList);
    tempList.sort(function (element, value) {
      return element.toLowerCase().localeCompare(value.toLowerCase());
    });
    return tempList;
  }
  reqServiceFramer(reqServices) {
    let reqServiceArray = [];
    if (reqServices) {
      reqServices.forEach(value => {
        reqServiceArray.push(`${value['requestedServiceTypeCode']}`);
      });
    }
    reqServiceArray = utils.uniq(reqServiceArray);
    reqServiceArray.sort(function (element, value) {
      return element.toLowerCase().localeCompare(value.toLowerCase());
    });
    return reqServiceArray;
  }
  attachmentFramer(attachmentData, field: string) {
    const attachmentArray = [];
    if (attachmentData) {
      attachmentData.forEach(value => {
        if (field === 'accessorialAttachmentTypeName' && value['accessorialAttachmentType']) {
          attachmentArray.push(`${value['accessorialAttachmentType']['accessorialAttachmentTypeName']} `);
        } else if (field !== 'accessorialAttachmentTypeName') {
          attachmentArray.push(`${value[field]} `);
        }
      });
    }
    return attachmentArray;
  }

  addOnFramer(attachmentData, field: string) {
    const attachmentArray = [];
    if (attachmentData) {
      attachmentData.forEach(value => {
        attachmentArray.push(this.timeZone.convertToLocalMilitaryUpdatedTime(value[field]));
      });
    }
    return attachmentArray;
  }

  businessFramer(rateData: any) {
    let businessArray = [];
    if (rateData) {
      rateData.forEach(value => {
        businessArray.push(`${value['businessUnit']}-${value['serviceOffering']}`);
      });
    }
    businessArray = utils.uniq(businessArray);
    businessArray.sort(function (element, value) {
      return element.toLowerCase().localeCompare(value.toLowerCase());
    });
    return businessArray;
  }
  serviceLevelFramer(rateData) {
    let serviceLevelArray = [];
    if (rateData) {
      rateData.forEach(value => {
        serviceLevelArray.push(value['serviceLevel']);
      });
    }
    serviceLevelArray = utils.uniq(serviceLevelArray);
    serviceLevelArray.sort(function (element, value) {
      return element.toLowerCase().localeCompare(value.toLowerCase());
    });
    return serviceLevelArray;
  }
  carrierFramer(carrierData) {
    let carrierArray = [];
    if (carrierData) {
      carrierData.forEach(value => {
        carrierArray.push(`${value['carrierName']} (${value['carrierCode']})`);
      });
    }
    carrierArray = utils.uniq(carrierArray);
    carrierArray.sort(function (element, value) {
      return element.toLowerCase().localeCompare(value.toLowerCase());
    });
    return carrierArray;
  }
  loadGridData(event: any) {
    if (event && this.documentationModel.documentList && this.documentationModel.documentList.length) {
      const elasticQuery = DocumentationService.getElasticparam();
      elasticQuery['size'] = this.documentationModel.tableSize;
      elasticQuery['from'] = event['first'];
      this.documentationModel.tableSize = event['rows'];
      this.sortGridData(elasticQuery, event);
      DocumentationService.setElasticparam(elasticQuery);
      this.getContractsListData();
    }
  }
  sortGridData(elasticQuery: object, event) {
    if (event && event['sortField'] && event['sortOrder']) {
      const field = this.documentationModel.getFieldNames[event['sortField']];
      const rootVal = this.documentationModel.getNestedRootVal[event['sortField']];
      elasticQuery['sort'] = [];
      elasticQuery['sort'][0] = {};
      elasticQuery['sort'][0][field] = {};
      elasticQuery['sort'][0][field]['order'] = event['sortOrder'] === 1 ? 'asc' : 'desc';
      elasticQuery['sort'][0][field]['missing'] = event['sortOrder'] === 1 ? '_first' : '_last';
      if (rootVal) {
        elasticQuery['sort'][0][field]['nested'] = {
          'path': rootVal
        };
        elasticQuery['sort'][0][field]['mode'] = 'min';
      }
    }
  }
  toastMessage(key: string, data: string) {
    const message = {
      severity: key,
      summary: (key === 'error') ? 'Error' : 'Success',
      detail: data
    };
    this.messageService.clear();
    this.messageService.add(message);
  }
  onFilterClick() {
    this.documentationModel.isFilterEnabled = !this.documentationModel.isFilterEnabled;
  }
  onFilterGridData() {
    this.getContractsListData();
    this.documentationModel.isEmptySearch = true;
  }
  setPaginator() {
    if (this.documentationModel.gridDataLength) {
      return true;
    } else {
      return false;
    }
  }
}
