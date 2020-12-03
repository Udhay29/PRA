import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';

import { MessageService } from 'primeng/components/common/messageservice';
import * as utils from 'lodash';
import * as moment from 'moment';

import { LocalStorageService } from '../../../shared/jbh-app-services/local-storage.service';
import { BroadcasterService } from '../../../shared/jbh-app-services/broadcaster.service';
import { ViewMileageModel } from './models/view-mileage.model';
import { ViewMileageQuery } from './query/view-mileage.query';
import { ViewMileageService } from './services/view-mileage.service';
import {
  ElasticViewResponseModel, ContractAssociation, SectionAssociation, BusinessUnitAssociation, CarrierAssociation,
  SystemParameterAssociation, HitsItem
} from './models/view-mileage-elasticresponse.interface';
import { QueryMock } from './models/view-mileage.interface';
import { CreateMileageUtility } from '../create-mileage/service/create-mileage-utility';

@Component({
  selector: 'app-view-mileage',
  templateUrl: './view-mileage.component.html',
  styleUrls: ['./view-mileage.component.scss'],
  providers: [ViewMileageService],
})
export class ViewMileageComponent implements OnDestroy, OnInit {
  @Input()
  agreementID: number;
  @ViewChild('downloadExcel') downloadExcel: ElementRef;
  viewMileageModel: ViewMileageModel;
  constructor(private router: Router, private readonly messageService: MessageService,
    private readonly changeDetector: ChangeDetectorRef, private readonly viewMileageService: ViewMileageService,
    private readonly localStore: LocalStorageService, private readonly shared: BroadcasterService) {
    this.viewMileageModel = new ViewMileageModel();
  }

  ngOnInit() {
    this.localStore.setItem('agreementDetails', 'create', 'Mileage', true);
    this.getMockJson();
    this.localStore.setItem('agreementDetails', 'create', 'Mileage', true);
  }

  ngOnDestroy() {
    this.viewMileageModel.subscriberFlag = false;
  }
  getMockJson() {
    this.viewMileageModel.pageLoading = true;
    this.viewMileageService.getMockJson().pipe(takeWhile(() =>
      this.viewMileageModel.subscriberFlag)).subscribe((data: QueryMock) => {
        this.viewMileageModel.sourceData = data;
        if (data) {
          this.viewMileageModel.pageLoading = false;
          const fetchGridDetailsReqParam =
            ViewMileageQuery.viewMileageGridQuery(this.viewMileageModel.sourceData,
              String(this.agreementID), 0, this.viewMileageModel.gridSize);
          ViewMileageService.setElasticparam(fetchGridDetailsReqParam);

          this.fetchMilleagePreferenceFromElastic();
          this.viewMileageModel.menuItemList = [
            {
              label: 'Export to Excel',
              command: (onclick): void => {
                this.exportToExcel();
              }
            }
          ];
        }
      });
  }
  fetchMilleagePreferenceFromElastic() {
    this.viewMileageModel.pageLoading = true;

    const fetchGridDetailsReqParam = ViewMileageService.getElasticparam();
    this.viewMileageService.getMileagePreference(fetchGridDetailsReqParam).pipe(takeWhile(() => this.viewMileageModel.subscriberFlag))
      .subscribe((response: ElasticViewResponseModel) => {
        if (!utils.isEmpty(response && response.hits)) {
          const framedGridArray = [];
          response.hits.hits.forEach((eachHits: HitsItem) => {
            framedGridArray.push(this.viewMileageGridFramer(eachHits));
          });
          this.viewMileageModel.gridRows = framedGridArray;
          this.viewMileageModel.gridDataLength = response.hits.total;
          this.viewMileageModel.noResultFoundFlag = (this.viewMileageModel.gridRows.length === 0);
        } else {
          this.viewMileageModel.noResultFoundFlag = true;
          this.viewMileageModel.gridRows.length = 0;
        }
        this.viewMileageModel.pageLoading = false;
        this.changeDetector.detectChanges();
      }, (error: Error) => {
        this.viewMileageModel.noResultFoundFlag = true;
        this.handleErrorMessageForViewMileageGrid(error.message);
      });
  }
  handleErrorMessageForViewMileageGrid(erroMessage: string) {
    CreateMileageUtility.toastMessage(this.messageService, 'error', 'Error', erroMessage);
    this.viewMileageModel.pageLoading = false;
    this.changeDetector.detectChanges();
  }
  viewMileageGridFramer(gridResponse: HitsItem) {
    const gridObj = {};
    gridObj['mileageCalculationTypeName'] = gridResponse._source.mileageCalculationTypeName;
    gridObj['mileageProgramName'] = gridResponse._source.mileageProgramName;
    gridObj['agreementDefaultIndicator'] = gridResponse._source.agreementDefaultIndicator;
    gridObj['contracts'] = this.contractFramer(gridResponse._source.customerMileageProgramContractAssociations);
    gridObj['sections'] = this.sectionFramer(gridResponse._source.customerMileageProgramSectionAssociations);
    gridObj['businessUnits'] = this.businessUnitFramer(gridResponse._source.customerMileageProgramBusinessUnits);
    gridObj['carriers'] = this.carrierFramer(gridResponse._source.customerMileageProgramCarrierAssociations);
    gridObj['system'] = gridResponse._source.mileageSystemName;
    gridObj['mileageSystemVersionName'] = gridResponse._source.mileageSystemVersionName;
    gridObj['systemParameters'] = this.systemParameterFramer(gridResponse._source.mileageSystemParameters);
    gridObj['unitOfDistanceMeasurementCode'] = gridResponse._source.unitOfDistanceMeasurementCode;
    gridObj['geographyType'] = gridResponse._source.geographyType;
    gridObj['mileageRouteTypeName'] = gridResponse._source.mileageRouteTypeName;
    gridObj['decimalPrecisionIndicator'] = gridResponse._source.decimalPrecisionIndicator;
    gridObj['status'] = gridResponse['fields']['Status'];
    gridObj['borderCrossingParameter'] = gridResponse._source.mileageBorderMileParameterTypeName;
    gridObj['effectiveDate'] = gridResponse._source.effectiveDate;
    gridObj['expirationDate'] = gridResponse._source.expirationDate;
    gridObj['mileageProgramNoteText'] = gridResponse._source.mileageProgramNoteText;
    gridObj['viewMoreDisplay'] = false;
    gridObj['UniqueDocID'] = gridResponse._source;
    return gridObj;
  }
  contractFramer(contractAssociations: ContractAssociation[]): string[] {
    const contractFramerArray = [];
    if (!utils.isEmpty(contractAssociations)) {
      contractAssociations.forEach((eachContract: ContractAssociation) => {
        contractFramerArray.push(`${eachContract.customerContractDisplayName}${' '}`);
      });
    }

    return contractFramerArray;
  }
  sectionFramer(sectionAssociations: SectionAssociation[]): string[] {
    const sectionFramerArray = [];
    if (!utils.isEmpty(sectionAssociations)) {
      sectionAssociations.forEach((eachSection: SectionAssociation) => {
        sectionFramerArray.push(`${eachSection.customerAgreementContractSectionName}${' '}`);
      });
    }
    return sectionFramerArray;
  }
  businessUnitFramer(businesUnitAssociations: BusinessUnitAssociation[]): string[] {
    const businessUnitFramerArray = [];
    if (!utils.isEmpty(businesUnitAssociations)) {
      businesUnitAssociations.forEach((eachBusinessUnit: BusinessUnitAssociation) => {
        businessUnitFramerArray.push(`${eachBusinessUnit.financeBusinessUnitCode}${' '}`);
      });
    }
    return businessUnitFramerArray;
  }
  carrierFramer(carrierAssociations: CarrierAssociation[]): string[] {
    const carrierFramerArray = [];
    if (!utils.isEmpty(carrierAssociations)) {
      carrierAssociations.forEach((eachCarrier: CarrierAssociation) => {
        carrierFramerArray.push(`${eachCarrier.carrierDisplayName}${' '}`);
      });
    }
    return carrierFramerArray;
  }
  systemParameterFramer(systemParameterAssociations: SystemParameterAssociation[]): string[] {
    const systemParameterFramerArray = [];
    if (!utils.isEmpty(systemParameterAssociations)) {
      systemParameterAssociations.forEach((eachSystemParameter: SystemParameterAssociation) => {
        if (eachSystemParameter['mileageParameterSelectIndicator'] === 'Y') {
          systemParameterFramerArray.push(`${eachSystemParameter.mileageSystemParameterName}${' '}`);
        }
      });
    }
    return systemParameterFramerArray;
  }
  onClickCreateMileage() {
    this.shared.broadcast('editMileageDetails', {
      editMileageData: null,
      isMileageEdit: false,
      mileageID: null
    });
    this.router.navigate(['/viewagreement/createmileage'], { queryParams: { id: this.agreementID } });
  }
  exportToExcel() {
    const fetchGridDetailsReqParam = ViewMileageService.getElasticparam();
    this.viewMileageModel.pageLoading = true;
    this.viewMileageService.downloadExcel(fetchGridDetailsReqParam).subscribe(data => {
      this.downloadFiles(data, this.downloadExcel);
      this.viewMileageModel.pageLoading = false;
      this.toastMessage(this.messageService, 'success', 'Mileage Program(s) Exported',
        `${'You have successfully exported '}${this.viewMileageModel.gridDataLength}${' Mileage Program(s).'}`);
      this.changeDetector.detectChanges();
    }, (excelError: Error) => {
      if (excelError) {
        this.viewMileageExcelDownloadError(excelError);
      }
    });
  }
  viewMileageExcelDownloadError(excelError) {
    this.viewMileageModel.pageLoading = false;
    this.toastMessage(this.messageService, 'error', 'Error', excelError['error']['errors'][0]['errorMessage']);
    this.changeDetector.detectChanges();
  }
  downloadFiles(data: object, downloadExcel: ElementRef) {
    const fileName = `Program ${moment().format('YYYY-MM-DD')} at ${moment().format('hh.mm.ss A')}.xlsx`;
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(data, fileName);
    } else {
      downloadExcel.nativeElement.href = URL.createObjectURL(data);
      downloadExcel.nativeElement.download = fileName;
      downloadExcel.nativeElement.click();
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
  formatDate(date: string | Date) {
    return moment(date).format('YYYY-MM-DD');
  }

  onFilterClick() {
    this.viewMileageModel.filterFlag = !this.viewMileageModel.filterFlag;
    this.viewMileageModel.isSplitView = false;
    this.viewMileageModel.isFilterEnabled = !this.viewMileageModel.isFilterEnabled;
  }
  filterGridData(event: Event) {
    this.fetchMilleagePreferenceFromElastic();
    this.viewMileageModel.isEmptySearch = true;
  }


  loadGridData(event: Event) {
    if (event && this.viewMileageModel.allowPagination) {
      const elasticQuery = ViewMileageService.getElasticparam();
      elasticQuery['size'] = event['rows'];
      elasticQuery['from'] = event['first'];
      this.viewMileageModel.tableSize = event['rows'];
      this.sortGridData(elasticQuery, event);
      ViewMileageService.setElasticparam(elasticQuery);
      this.fetchMilleagePreferenceFromElastic();
    }
    this.viewMileageModel.allowPagination = true;
  }

  sortGridData(elasticQuery: object, event) {
    if (event && event['sortField'] === 'Status') {
      elasticQuery['sort'] = [];
      elasticQuery['sort'].push(ViewMileageQuery.statusSortQuery(this.viewMileageModel.sourceData));
      elasticQuery['sort'][0]['_script']['order'] = event['sortOrder'] === 1 ? 'asc' : 'desc';
    } else if (event && event['sortField'] && event['sortOrder']) {
      const field = this.viewMileageModel.mileageFieldNames[event['sortField']];
      const rootVal = this.viewMileageModel.mileageNestedRootVal[event['sortField']];
      elasticQuery['sort'] = [];
      elasticQuery['sort'][0] = {};
      elasticQuery['sort'][0][field] = {};
      elasticQuery['sort'][0][field]['order'] = event['sortOrder'] === 1 ? 'asc' : 'desc';
      elasticQuery['sort'][0][field]['missing'] = event['sortOrder'] === 1 ? '_first' : '_last';
      if (rootVal) {
        this.setNestedQuery(elasticQuery, event, field, rootVal);
      }
    }
  }
  setNestedQuery(elasticQuery: object, event, field, rootVal) {
    if (event['sortField'] === 'System Parameters') {
      elasticQuery['sort'][0][field]['nested'] = ViewMileageQuery.systemParameterNestedQuery();
    } else {
      elasticQuery['sort'][0][field]['nested_path'] = rootVal;
    }
    elasticQuery['sort'][0][field]['mode'] = 'min';
  }

  getGridValues(event) {
    const enteredValue = (event.target && event.target['value']) ? event.target['value'] : '';
    this.viewMileageModel.isEmptySearch = true;
    const currentQuery = ViewMileageService.getElasticparam();
    if (currentQuery['query']['bool']['must'][7]['bool']['should'].length > 6) {
      currentQuery['query']['bool']['must'][7]['bool']['should'].pop();
    }
    currentQuery['from'] = 0;
    this.frameSearchQuery(currentQuery, enteredValue);
    ViewMileageService.setElasticparam(currentQuery);
    this.fetchMilleagePreferenceFromElastic();
    this.changeDetector.detectChanges();
  }
  frameSearchQuery(currentQuery, enteredValue: string) {
    this.viewMileageModel.isSplitView = false;
    utils.forEach(currentQuery['query']['bool']['must'][7]['bool']['should'], (query) => {
      if (query['nested'] && query['nested']['path'] === 'mileageSystemParameters') {
        query['nested']['query']['bool']['should'][0]['query_string']['query'] = `*${enteredValue.replace(
          /[!?:\\['^~=\//\\{},.&&||<>()"+ *\]]/g, '\\$&')}*`;
      } else if (query['nested']) {
        query['nested']['query']['query_string']['query'] = `*${enteredValue.replace(
          /[!?:\\['^~=\//\\{},.&&||<>()"+ *\]]/g, '\\$&')}*`;
      } else {
        query['query_string']['query'] = `*${enteredValue.replace(/[!?:\\["^~=\//\\{}&&|| <>()+*\]-]/g, '\\$&')}*`;
      }
    });
    if (enteredValue.toLowerCase() === 'active') {
      currentQuery['query']['bool']['must'][7]['bool']['should'].push(ViewMileageQuery.getStatusQuery('gte', 'N', 'Active'));
    }
    if (enteredValue.toLowerCase() === 'inactive') {
      currentQuery['query']['bool']['must'][7]['bool']['should']
        .push(ViewMileageQuery.getStatusQuery('lt', 'Y OR N', 'Active OR Inactive'));
    }
    if (enteredValue.toLowerCase() === 'deleted') {
      currentQuery['query']['bool']['must'][7]['bool']['should'].push(ViewMileageQuery.getDeletedRecords('*', 'Deleted'));
    }
  }

  onRowSelect(event: any) {
    if (event.type === 'row' && !utils.isEmpty(event['data'])) {
      this.viewMileageModel.isSplitView = true;
      this.viewMileageModel.UniqueDocID = event['data']['UniqueDocID']['uniqueDocID'];
      this.viewMileageModel.isFilterEnabled = false;
      this.viewMileageModel.filterFlag = false;
    }
  }
  closeClick(event: Event) {
    this.viewMileageModel.isSplitView = false;
  }
  onClickMileageOverflowIcon(menu, event) {
    if (!this.viewMileageModel.noResultFoundFlag) {
      menu.toggle(event);
    }
  }
  setPaginator() {
    if (this.viewMileageModel.gridDataLength) {
      return true;
    } else {
      return false;
    }
  }

}
