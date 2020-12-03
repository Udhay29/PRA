import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter,
  ElementRef, ViewChild, OnInit, Input, Output
} from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MessageService } from 'primeng/components/common/messageservice';
import { HttpResponseBase } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';
import * as moment from 'moment';
import * as utils from 'lodash';

import { UserService } from '../../../shared/jbh-esa/user.service';
import { LocalStorageService } from './../../../shared/jbh-app-services/local-storage.service';
import { LineHaulModel } from './model/line-haul.model';
import { LineHaulService } from './service/line-haul.service';
import { ManualLineHaulQuery } from './query/manual-line-haul.query';
import {
  LineHaulGridDto, HitsItem, LineHaulDetailsItem, OperationalServicesItem,
  StopsItem, InactiveResponseDto
} from './model/line-haul.interface';
import { ViewAgreementDetailsUtility } from './../service/view-agreement-details-utility';
import { timer } from 'rxjs';

@Component({
  selector: 'app-line-haul',
  templateUrl: './line-haul.component.html',
  styleUrls: ['./line-haul.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineHaulComponent implements OnInit {
  lineHaulModel: LineHaulModel;

  @Input() agreementId: number;
  @ViewChild('lineHaulTable') lineHaulTable: any;
  @ViewChild('downloadExcel') downloadExcel: ElementRef;
  @Input()
  set isReview(value) {
    if (value) {
      this.lineHaulModel.isLineHaulChecked = true;
    }
  }
  @Input() screen: string;
  @Input() status: string;
  @Output() isChecked: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly messageService: MessageService,
    private readonly lineHaulService: LineHaulService,
    private readonly userService: UserService,
    private readonly utilityService: ViewAgreementDetailsUtility,
    private readonly localStore: LocalStorageService,
    private currencyPipe: CurrencyPipe) {
    this.lineHaulModel = new LineHaulModel();
    this.formIntialisation();
  }

  ngOnInit() {
    this.lineHaulModel.lineHaulSearchValue = '';
    this.loadLineHaulGridRecords();
    this.localStore.setItem('agreementDetails', 'create', 'Line Haul', true);
    this.lineHaulModel.menuItemList = [
      {
        label: 'Export to Excel',
        command: (onclick): void => {
          this.exportToExcel();
        }
      }
    ];
    if (this.screen !== 'review') {
      this.localStore.emptyLineHaulIds();
    }
  }
  formIntialisation() {
    this.lineHaulModel.lineHaulInactivateForm = this.formBuilder.group({
      expirationDate: ['', Validators.required]
    });
  }
  loadLineHaulGridRecords() {
    const linehaulstatus = (this.status) ? this.status : 'published';
    if (this.screen === 'review') {
      this.lineHaulModel.isReview = true;
      if (!utils.isEmpty(this.userService.getDetails())) {
        this.lineHaulModel.createdUser = this.userService.getUserId();
        this.lineHaulService.setQueryParam(ManualLineHaulQuery.
          getLineHaulQuery(this.agreementId, linehaulstatus, this.lineHaulModel.isReview,
            this.lineHaulModel.tableSize, this.lineHaulModel.lineHaulSearchValue, this.lineHaulModel.createdUser));
      }
    } else {
      this.lineHaulModel.isReview = false;
      this.lineHaulService.setQueryParam(ManualLineHaulQuery.
        getLineHaulQuery(this.agreementId, linehaulstatus, this.lineHaulModel.isReview,
          this.lineHaulModel.tableSize, this.lineHaulModel.lineHaulSearchValue, ''));
    }
    this.loadGridRecords();
  }
  loadGridRecords() {
    this.lineHaulModel.loading = true;
    this.lineHaulModel.isDelete = false;
    this.lineHaulModel.selectedLineHaulData = [];
    this.lineHaulModel.isTableDataLoading = true;
    const lineHaulQuery = this.lineHaulService.getQueryParam();
    this.lineHaulService.getLineHaulData(lineHaulQuery)
      .pipe(takeWhile(() => this.lineHaulModel.isSubscribeFlag)).subscribe((lineHaulData: LineHaulGridDto) => {
        if (lineHaulData) {
          this.lineHaulModel.loading = false;
          this.lineHaulModel.isTableDataLoading = false;
          this.lineHaulModel.selectedLineHaulData = [];
          this.lineHaulModel.gridDataLength = lineHaulData['hits']['total'];
          if (this.screen === 'review' && this.lineHaulModel.gridDataLength === 0) {
            this.utilityService.setreviewCancelStatus(false);
          } else if (this.screen === 'review' && this.lineHaulModel.gridDataLength > 0) {
            this.utilityService.setreviewCancelStatus(true);
          }
          if (this.lineHaulModel.gridDataLength !== 0 || this.lineHaulModel.isLineHaulSearch) {
            this.lineHaulModel.isPaginatorFlag = true;
          } else {
            this.lineHaulModel.isPaginatorFlag = false;
          }
          this.iterateGridRecords(lineHaulData);
          this.changeDetector.detectChanges();
        }
      }, (lineHaulDataError: Error) => {
        this.lineHaulModel.loading = false;
        this.lineHaulModel.isTableDataLoading = false;
        this.lineHaulModel.lineHaulList = [];
        this.changeDetector.detectChanges();
      });
  }
  sortClick(event: Event, elasticQuery: object) {
    if (event && event['sortField'] && event['sortOrder'] && this.lineHaulModel.sortColumns[event['sortField']]) {
      const field = this.lineHaulModel.sortColumns[event['sortField']];
      const rootVal = this.lineHaulModel.nestedColumns[event['sortField']];
      elasticQuery['sort'] = [];
      elasticQuery['sort'][0] = {};
      elasticQuery['sort'][0][field] = {};
      elasticQuery['sort'][0][field]['order'] = event['sortOrder'] === 1 ? 'asc' : 'desc';
      elasticQuery['sort'][0][field]['missing'] = event['sortOrder'] === -1 ? '_first' : '_last';
      if (rootVal) {
        elasticQuery['sort'][0][field]['nested'] = {};
        elasticQuery['sort'][0][field]['nested']['path'] = rootVal;
      }
    }
    this.sortAdditionalField(event, elasticQuery);
  }
  sortAdditionalField(event, elasticQuery: object) {
    let rootVal;
    switch (event['sortField']) {
      case 'contractName':
        this.sortQueryFramer(elasticQuery,
          'customerAgreementContractName.keyword', event);
        break;
      case 'unitOfEquipmentLengthMeasurementCode':
        this.sortQueryFramer(elasticQuery,
          'unitOfEquipmentLengthMeasurementCode.keyword', event);
        break;
      case 'billToCode':
        rootVal = 'billTos';
        this.sortQueryFramer(elasticQuery,
          'billTos.billToCode.keyword', event, rootVal);
        break;
      case 'carrierCode':
        rootVal = 'carriers';
        this.sortQueryFramer(elasticQuery,
          'carriers.carrierCode.keyword', event, rootVal);
        break;
      case 'mileageRange':
        rootVal = 'mileagePreference';
        this.sortQueryFramer(elasticQuery,
          'mileagePreference.lineHaulMileageRangeMaxQuantity', event, rootVal);
        break;
      case 'weightRange':
        rootVal = 'unitOfMeasurement';
        this.sortQueryFramer(elasticQuery,
          'unitOfMeasurement.lineHaulWeightRangeMaxQuantity', event, rootVal);
        break;
      case 'originPoint':
        rootVal = 'origin.points';
        this.sortQueryFramer(elasticQuery, 'origin.points.pointDisplayName.keyword', event, rootVal);
        break;
      case 'destinationPoint':
        rootVal = 'destination.points';
        this.sortQueryFramer(elasticQuery, 'destination.points.pointDisplayName.keyword', event, rootVal);
        break;
      default:
        break;
    }
  }
  sortQueryFramer(elasticQuery: object, field: string, event: Event, rootVal?: string) {
    elasticQuery['sort'][1] = {};
    elasticQuery['sort'][1][field] = {};
    elasticQuery['sort'][1][field]['order'] = event['sortOrder'] === 1 ? 'asc' : 'desc';
    elasticQuery['sort'][1][field]['missing'] = event['sortOrder'] === -1 ? '_first' : '_last';
    if (rootVal) {
      elasticQuery['sort'][1][field]['nested_path'] = rootVal;
    }
  }
  loadGridData(event) {
    if (event && this.lineHaulModel.lineHaulList && this.lineHaulModel.lineHaulList.length) {
      const lineHaulStatus = (this.status) ? this.status : 'published';
      let lineHaulQuery;
      if (this.screen === 'review') {
        this.lineHaulModel.isReview = true;
        lineHaulQuery = ManualLineHaulQuery
          .getLineHaulQuery(this.agreementId, lineHaulStatus, this.lineHaulModel.isReview,
            this.lineHaulModel.tableSize, this.lineHaulModel.lineHaulSearchValue, this.lineHaulModel.createdUser);
      } else {
        this.lineHaulModel.isReview = false;
        lineHaulQuery = ManualLineHaulQuery.getLineHaulQuery(this.agreementId, lineHaulStatus, this.lineHaulModel.isReview,
          this.lineHaulModel.tableSize, this.lineHaulModel.lineHaulSearchValue, '');
      }
      lineHaulQuery['size'] = event['rows'];
      lineHaulQuery['from'] = event['first'];
      this.lineHaulModel.tableSize = event['rows'];
      this.sortClick(event, lineHaulQuery);
      this.lineHaulService.setQueryParam(lineHaulQuery);
      this.changeDetector.detectChanges();
    }
    this.loadGridRecords();
  }
  searchGridRecords(lineHaulSearchValue) {
    this.lineHaulModel.selectedLineHaulData = [];
    this.lineHaulModel.hasChecked = false;
    this.lineHaulModel.isDelete = false;
    const lineHaulStatus = (this.status) ? this.status : 'published';
    this.lineHaulModel.lineHaulSearchValue = lineHaulSearchValue ? lineHaulSearchValue['currentTarget']['value'] : '';
    this.lineHaulModel.isLineHaulSearch = true;
    let lineHaulQuery;
    if (this.screen === 'review') {
      this.lineHaulModel.isReview = true;
      lineHaulQuery = ManualLineHaulQuery
        .getLineHaulQuery(this.agreementId, lineHaulStatus, this.lineHaulModel.isReview,
          this.lineHaulModel.tableSize, this.lineHaulModel.lineHaulSearchValue, this.lineHaulModel.createdUser);
    } else {
      this.lineHaulModel.isReview = false;
      lineHaulQuery = ManualLineHaulQuery.getLineHaulQuery(this.agreementId, lineHaulStatus,
        this.lineHaulModel.isReview, this.lineHaulModel.tableSize, this.lineHaulModel.lineHaulSearchValue);
    }
    if (lineHaulSearchValue !== '') {
      lineHaulQuery['from'] = 0;
    } else {
      this.lineHaulModel.isLineHaulSearch = false;
    }
    this.lineHaulService.setQueryParam(lineHaulQuery);
    this.lineHaulTable.reset();
  }
  iterateGridRecords(lineHaulData: LineHaulGridDto) {
    if (!utils.isEmpty(lineHaulData['hits']['hits'])) {
      this.lineHaulModel.lineHaulList = [];
      this.lineHaulModel.loading = false;
      lineHaulData['hits']['hits'].forEach((lineHaulListItem: HitsItem) => {
        this.lineHaulModel.lineHaulList.push(this.loadGridFields(lineHaulListItem['_source']));
        this.changeDetector.detectChanges();
      });
    } else {
      this.lineHaulModel.lineHaulList = [];
      this.lineHaulModel.loading = false;
      this.changeDetector.detectChanges();
    }
  }
  loadGridFields(lineHaulDetails: LineHaulDetailsItem): LineHaulDetailsItem {
    lineHaulDetails['contractName'] = (lineHaulDetails['customerAgreementContractDisplayName']);
    lineHaulDetails['sectionName'] = (lineHaulDetails['customerAgreementContractSectionName']);
    lineHaulDetails['unitOfEquipmentLengthMeasurementCode'] = (lineHaulDetails['equipmentLengthDisplayName']) ?
      `${lineHaulDetails['equipmentLengthDisplayName']}` : '--';
    lineHaulDetails['overriddenPriority'] = (lineHaulDetails['overiddenPriorityLevelNumber'] !== null) ?
      lineHaulDetails['overiddenPriorityLevelNumber'] : '--';
    lineHaulDetails['numberOfStops'] = lineHaulDetails['stops'].length;
    lineHaulDetails['originPoint'] = utils.join(this.originDestinationFramer(lineHaulDetails['origin']), ',');
    lineHaulDetails['destinationPoint'] = utils.join(this.originDestinationFramer(lineHaulDetails['destination']), ',');
    lineHaulDetails['originDescription'] = (lineHaulDetails['origin']['description']) ? lineHaulDetails['origin']['description'] : '--';
    lineHaulDetails['destinationDescription'] = (lineHaulDetails['destination']['description']) ?
      lineHaulDetails['destination']['description'] : '--';
    lineHaulDetails['businessUnit'] = lineHaulDetails['financeBusinessUnitName'];
    lineHaulDetails['awardStatus'] = lineHaulDetails['lineHaulAwardStatusTypeName'];
    lineHaulDetails['priorityNumber'] = lineHaulDetails['priorityLevelNumber'];
    this.iterateLineHaulStops(lineHaulDetails);
    this.iterateLineHaulRate(lineHaulDetails);
    this.lineHaulDetailsMileageValues(lineHaulDetails);
    this.iterateLineHaulFields(lineHaulDetails);
    return lineHaulDetails;
  }
  originDestinationFramer(originDestinationData) {
    const dataArray = [];
    if (originDestinationData && originDestinationData.points) {
      utils.forEach(originDestinationData.points, (point) => {
        dataArray.push(point.pointDisplayName);
      });
    }
    return dataArray;
  }
  iterateLineHaulStops(lineHaulDetails: LineHaulDetailsItem): LineHaulDetailsItem {
    lineHaulDetails['stopChargeIncluded'] = lineHaulDetails['stopChargeIncludedIndicator']  ?
    lineHaulDetails['stopChargeIncludedIndicator'] : '--';
    lineHaulDetails['originVendorId'] = (lineHaulDetails['origin']['vendorID']) ? lineHaulDetails['origin']['vendorID'] : '--';
    lineHaulDetails['destinationVendorId'] =
      (lineHaulDetails['destination']['vendorID']) ? lineHaulDetails['destination']['vendorID'] : '--';
    const carrierValue = [];
    this.iterateBillToDetails(lineHaulDetails);
    if (lineHaulDetails['carriers']) {
      lineHaulDetails['carriers'].forEach(carrierElements => {
        carrierValue.push((carrierElements['carrierName']) ?
          `${carrierElements['carrierDisplayName']}` : '--');
      });
    }
    if (utils.isEmpty(lineHaulDetails['carriers']) || lineHaulDetails['carriers'] == null) {
      lineHaulDetails['carrierCode'] = [];
    } else {
      lineHaulDetails['carrierCode'] = carrierValue;
    }
    return lineHaulDetails;
  }

  stopChargeFramer(stopsItem: StopsItem[], isStopChargeIncluded: string) {
    if (stopsItem.length) {
      if (isStopChargeIncluded === 'Yes') {
        return 'Yes';
      }
      return 'No';
    }
    return '--';
  }
  iterateBillToDetails(lineHaulDetails: LineHaulDetailsItem): LineHaulDetailsItem {
    const billToValue = [];
    if (lineHaulDetails['billTos'] && lineHaulDetails['billTos'].length) {
      lineHaulDetails['billTos'].forEach(billToElements => {
        billToValue.push((billToElements['billToName']) ? `${billToElements['billingPartyDisplayName']}` : '--');
      });
    }
    if (utils.isEmpty(lineHaulDetails['billTos']) || lineHaulDetails['billTos'] === null) {
      lineHaulDetails['billToCode'] = [];
    } else {
      lineHaulDetails['billToCode'] = billToValue;
    }
    return lineHaulDetails;
  }
  iterateLineHaulRate(lineHaulDetails: LineHaulDetailsItem): LineHaulDetailsItem {
    lineHaulDetails['hazmatIncluded'] = lineHaulDetails['hazmatIncludedIndicator'];
    lineHaulDetails['fuelIncluded'] = lineHaulDetails['fuelIncludedIndicator'];
    lineHaulDetails['autoInvoice'] = lineHaulDetails['autoInvoiceIndicator'];
    lineHaulDetails['groupRateType'] = (lineHaulDetails['groupRateType']) ? lineHaulDetails['groupRateType'] : '--';
    lineHaulDetails['equipmentTypeCodeDescription'] = (lineHaulDetails['equipmentTypeCodeDescription']) ?
      lineHaulDetails['equipmentTypeCodeDescription'] : '--';
    lineHaulDetails['groupRateItemize'] = this.groupRateItemizeView(lineHaulDetails['groupRateType'],
      lineHaulDetails['groupRateItemizeIndicator']);
    lineHaulDetails['sourceID'] = (lineHaulDetails['sourceID']) ? lineHaulDetails['sourceID'] : '--';
    lineHaulDetails['sourceLineHaulID'] = (lineHaulDetails['sourceLineHaulID']) ? lineHaulDetails['sourceLineHaulID'] : '--';
    lineHaulDetails['serviceLevel'] = (lineHaulDetails['serviceLevelCode']) ? lineHaulDetails['serviceLevelCode'] : '--';
    return lineHaulDetails;
  }

  groupRateItemizeView(groupRateType: string, isGroupRateItemize: string) {
    if (groupRateType === 'Sum') {
      if (isGroupRateItemize === 'Yes') {
        return 'Yes';
      }
      return 'No';
    }
    return '--';
  }

  lineHaulDetailsMileageValues(lineHaulDetails: LineHaulDetailsItem): LineHaulDetailsItem {
    if (lineHaulDetails['mileagePreference']) {
      lineHaulDetails['mileagePreferences'] = (lineHaulDetails['mileagePreference']['mileagePreferenceName']) ?
        lineHaulDetails['mileagePreference']['mileagePreferenceName'] : '--';
      lineHaulDetails['mileageRange'] = lineHaulDetails['mileagePreference']['mileagePreferenceDisplayName'] ?
        lineHaulDetails['mileagePreference']['mileagePreferenceDisplayName'] : '--';
    } else if (lineHaulDetails['mileagePreference'] === null) {
      lineHaulDetails['mileagePreferences'] = '--';
      lineHaulDetails['mileageRange'] = '--';
    }
    lineHaulDetails['weightRange'] = lineHaulDetails['unitOfMeasurement'] ?
      lineHaulDetails['unitOfMeasurement']['weightRangeDisplayName'] : '--';
    lineHaulDetails['weightUnitOfMeasure'] = (lineHaulDetails['unitOfMeasurement']) ?
      lineHaulDetails['unitOfMeasurement']['description'] : '--';
    return lineHaulDetails;
  }
  iterateLineHaulFields(lineHaulDetails: LineHaulDetailsItem): LineHaulDetailsItem {
    lineHaulDetails['type'] = [];
    lineHaulDetails['minimum'] = [];
    lineHaulDetails['maximum'] = [];
    lineHaulDetails['currency'] = [];
    lineHaulDetails['amount'] = [];
    lineHaulDetails['rates'].forEach((rateItems) => {
      lineHaulDetails['type'].push(rateItems['chargeUnitTypeName']);
      lineHaulDetails['minimum'].push((rateItems['minDisplayAmount']) ? rateItems['minDisplayAmount'] : '--');
      lineHaulDetails['maximum'].push((rateItems['maxDisplayAmount']) ? rateItems['maxDisplayAmount'] : ' --');
      lineHaulDetails['currency'] = rateItems['currencyCode'];
      lineHaulDetails['amount'].push((rateItems['rateDisplayAmount']) ? rateItems['rateDisplayAmount'] : ' --');
    });
    const operationService = [];
    if (lineHaulDetails['operationalServices']) {
      lineHaulDetails['operationalServices'].forEach((operationalElements: OperationalServicesItem) => {
        operationService.push(operationalElements['serviceTypeDescription']);
      });
    }
    lineHaulDetails['operationalService'] = operationService;
    const stopPoint = [];
    lineHaulDetails['stops'].forEach(stopElements => {
      stopPoint.push(stopElements['stopPoint']);
    });
    return lineHaulDetails;
  }
  onAddLineHaul(createNew: boolean) {
    this.lineHaulModel.isEmptyLineHaul = createNew;
    this.lineHaulModel.isAddLineHaul = true;
    this.utilityService.setEditLineHaulData(undefined);
    this.lineHaulModel.reviewWizardStatus = {
      'isLineHaulReviewed': true,
      'isAdditionalInfo': true,
      'isLaneCardInfo': true
    };
    this.utilityService.setreviewwizardStatus(this.lineHaulModel.reviewWizardStatus);
    this.router.navigate(['/viewagreement/linehaul'], { queryParams: { id: this.agreementId } });
  }
  onHeaderCheckboxToggle(checkedRowData: Event) {
    if (checkedRowData['checked'] === true) {
      this.lineHaulModel.isDelete = this.screenValidation();
      this.lineHaulModel.hasChecked = this.rowCheckValidation();
      this.isChecked.emit(this.lineHaulModel.isDelete);
      this.lineHaulModel.selectedLineHaulData.forEach((selectedLineHaulRow: LineHaulDetailsItem) => {
        this.lineHaulModel.selectedLineHaulConfigurationId.push(selectedLineHaulRow['customerLineHaulConfigurationID']);
      });
    } else {
      this.lineHaulModel.isDelete = false;
      this.lineHaulModel.hasChecked = false;
      this.isChecked.emit(this.lineHaulModel.isDelete);
      this.lineHaulModel.selectedLineHaulConfigurationId = [];
      this.lineHaulModel.selectedLineHaulData = [];
    }
  }
  screenValidation() {
    let isReviewScreen = false;
    if (this.screen === 'review') {
      isReviewScreen = true;
    }
    return isReviewScreen;
  }
  rowCheckValidation() {
    let isRowChecked;
    if (this.screen === 'review') {
      isRowChecked = false;
    } else {
      isRowChecked = true;
    }
    return isRowChecked;
  }
  onRowSelect(selectedRowData: Event) {
    if (selectedRowData.type === 'row') {
      this.showLineHaulDetails(selectedRowData);
    } else if (selectedRowData.type === 'checkbox') {
      this.lineHaulModel.isDelete = this.screenValidation();
      this.lineHaulModel.hasChecked = this.rowCheckValidation();
      this.isChecked.emit(this.lineHaulModel.isDelete);
      this.lineHaulModel.selectedLineHaulConfigurationId.push(selectedRowData['data'].customerLineHaulConfigurationID);
    }
  }
  showLineHaulDetails(selectedRowData) {
    if (this.screen === 'review') {
      this.lineHaulModel.selectedLineHaulConfigurationId.push(selectedRowData['data'].customerLineHaulConfigurationID);
      this.lineHaulModel.customerAgreementData = {
        'customerAgreementName': selectedRowData['data'].customerAgreementName,
        'customerLineHaulConfigurationID': selectedRowData['data'].customerLineHaulConfigurationID
      };
      this.lineHaulModel.editLineHaulDetails = {
        'isEditFlag': true,
        'lineHaulDetails': selectedRowData['data']['customerLineHaulConfigurationID']
      };
      this.utilityService.setEditLineHaulData(this.lineHaulModel.editLineHaulDetails);
      this.utilityService.setConfigurationID(this.lineHaulModel.customerAgreementData);
      this.lineHaulModel.reviewWizardStatus = {
        'isLineHaulReviewed': false,
        'isAdditionalInfo': false,
        'isLaneCardInfo': false
      };
      this.utilityService.setreviewwizardStatus(this.lineHaulModel.reviewWizardStatus);
      this.lineHaulModel.isEmptyLineHaul = false;
      this.lineHaulModel.isAddLineHaul = true;
      this.router.navigate(['/viewagreement/linehaul'], { queryParams: { id: selectedRowData['data'].customerAgreementID } });
    } else {
      this.lineHaulModel.isDelete = false;
      this.isChecked.emit(this.lineHaulModel.isDelete);
      this.utilityService.setAgreementDetails({
        customerAgreementName: selectedRowData['data']['customerAgreementName'],
        lineHaulConfigurationID: selectedRowData['data']['customerLineHaulConfigurationID'],
        agreementId: selectedRowData['data']['customerAgreementID']
      });
      this.router.navigate(['/viewagreement/detailedView'],
        { queryParams: { id: selectedRowData['data']['customerAgreementID'] } });
    }
  }
  onRowUnselect(unSelectedRowData: Event) {
    let reviewScreenValue = false;
    if (this.screen === 'review') {
      reviewScreenValue = true;
    }
    this.lineHaulModel.isDelete = (reviewScreenValue && utils.isEmpty(this.lineHaulModel.selectedLineHaulData)) ?
      false : this.lineHaulModel.isDelete;
    this.lineHaulModel.hasChecked = this.isDeleteValidation();
    this.isChecked.emit(this.lineHaulModel.isDelete);
    const unselectedRowId = [];
    const unselectedData = [];
    this.lineHaulModel.selectedLineHaulConfigurationId.forEach((configurationId: number) => {
      if (configurationId !== unSelectedRowData['data'].customerLineHaulConfigurationID) {
        unselectedRowId.push(configurationId);
      }
    });
    this.lineHaulModel.selectedLineHaulData.forEach((selectedLineHaulRow: LineHaulDetailsItem) => {
      if (selectedLineHaulRow !== unSelectedRowData['data']) {
        unselectedData.push(selectedLineHaulRow);
      }
    });
    this.lineHaulModel.selectedLineHaulConfigurationId = unselectedRowId;
    this.lineHaulModel.selectedLineHaulData = unselectedData;
  }
  isDeleteValidation() {
    let isDeleteLine;
    if (this.screen === 'review' || utils.isEmpty(this.lineHaulModel.selectedLineHaulData)) {
      isDeleteLine = false;
    } else {
      isDeleteLine = true;
    }
    return isDeleteLine;
  }

  onLineHaulDelete() {
    this.lineHaulService.deleteLineHaulRecords(this.lineHaulModel.selectedLineHaulConfigurationId).
      pipe(takeWhile(() => this.lineHaulModel.isSubscribeFlag)).subscribe((deletedLineHaul: InactiveResponseDto) => {
        timer(1000).subscribe(timerData => {
          if (deletedLineHaul.status === 'warning') {
            this.toastMessage(this.messageService, 'warn', 'Warning', deletedLineHaul.message);
          } else {
            this.toastMessage(this.messageService, 'success', 'Line Haul Deleted', 'You have successfully deleted the Line Haul.');
          }
          this.loadLineHaulGridRecords();
          this.lineHaulModel.isLineHaulDelete = false;
          this.lineHaulModel.selectedLineHaulConfigurationId = [];
        });
      }, (deletedData: Error) => {
        this.toastMessage(this.messageService, 'error', 'Error', deletedData['error']['errors'][0]['errorMessage']);
      });
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
  onLineHaulDeleteSelected() {
    this.lineHaulModel.isLineHaulDelete = true;
  }
  onLineHaulDeleteCancel() {
    this.lineHaulModel.isLineHaulDelete = false;
    this.lineHaulModel.selectedLineHaulData = [];
    this.lineHaulModel.isDelete = false;
  }
  showInactivatePopup() {
    this.lineHaulModel.inactivatePopup = true;
    const effDateArr = [];
    this.lineHaulModel.maxDate = null;
    for (const inactivateValue of this.lineHaulModel.selectedLineHaulData) {
      effDateArr.push(new Date(inactivateValue.expirationDate));
      this.lineHaulModel.maxDate = new Date(Math.max.apply(null, effDateArr));
    }
    this.formIntialisation();
  }
  onBlurDateValidate(event: Event) {
    const regex = new RegExp('^(1[0-2]|0?[1-9])/(3[01]|[12][0-9]|0?[1-9])/?[0-9]{4}$');
    if (event.srcElement['value'] && regex.test(event.srcElement['value'].trim()) &&
      (new Date(event.srcElement['value']) <= new Date(this.lineHaulModel.maxDate))) {
      const expDate = new Date(event.srcElement['value']);
      this.lineHaulModel.lineHaulInactivateForm.controls['expirationDate'].setValue(expDate);
    } else if (event.srcElement['value'] === '') {
      this.lineHaulModel.lineHaulInactivateForm.controls['expirationDate'].setValidators([Validators.required]);
    } else {
      this.lineHaulModel.lineHaulInactivateForm.controls.expirationDate.setErrors({ invalid: true });
    }
  }
  inactivateLineHaul(lineHauls: string) {
    this.lineHaulModel.loading = true;
    if (lineHauls !== '') {
      this.lineHaulService.inactivateLineHauls(lineHauls,
        moment(this.lineHaulModel.lineHaulInactivateForm.controls['expirationDate'].value).format(this.lineHaulModel.dateFormat))
        .pipe(takeWhile(() => this.lineHaulModel.isSubscribeFlag)).subscribe((inactivateLineHaul: InactiveResponseDto) => {
          timer(1000).subscribe(timerData => {
            if (inactivateLineHaul.status === 'warning') {
              this.toastMessage(this.messageService, 'warn', 'Warning', inactivateLineHaul.message);
            } else {
              this.toastMessage(this.messageService, 'success', 'Line Haul inactivate',
                'You have successfully inactivated the Line Haul Rate(s)');
            }
            this.loadLineHaulGridRecords();
          });
          this.changeDetector.detectChanges();
        }, (err: Error) => {
          this.toastMessage(this.messageService, 'error', 'Error', err['error']['errors'][0]['errorMessage']);
          this.lineHaulModel.loading = false;
          this.changeDetector.detectChanges();
        });
    } else {
      this.toastMessage(this.messageService, 'info', 'Cannot inactivate', 'No linehaul is inactivated');
      this.lineHaulModel.loading = false;
      this.changeDetector.detectChanges();
    }
    this.lineHaulModel.selectedLineHaulData = [];
    this.lineHaulModel.selectedLineHaulConfigurationId = [];
    this.lineHaulModel.showconformationPopup = false;
    this.lineHaulModel.inactivatePopup = false;
    this.lineHaulModel.hasChecked = false;
    this.changeDetector.detectChanges();
  }
  getCurrentDate(): string {
    const date = new Date();
    return moment(date).format(this.lineHaulModel.dateFormat);
  }
  onClickInactivate() {
    if (this.lineHaulModel.lineHaulInactivateForm.controls.expirationDate.valid) {
      this.lineHaulModel.preceedingEffDate = 0;
      this.lineHaulModel.exceedingExpDate = 0;
      this.lineHaulModel.canDeleteCount = 0;
      this.lineHaulModel.priorEffDateFlag = false;
      this.lineHaulModel.priorExpDateFlag = false;
      this.lineHaulModel.canDeleteFlag = false;
      let lineHauls = [];
      lineHauls = (this.lineHaulModel.selectedLineHaulConfigurationId);
      this.lineHaulInactivate(lineHauls);
      if (!this.lineHaulModel.priorEffDateFlag && !this.lineHaulModel.priorExpDateFlag && !this.lineHaulModel.canDeleteFlag) {
        this.inactivateLineHaul(lineHauls.toString());
      }
    } else {
      this.lineHaulModel.lineHaulInactivateForm.controls['expirationDate'].markAsTouched();
      this.lineHaulModel.lineHaulInactivateForm.controls['expirationDate'].setValidators([Validators.required]);
      this.toastMessage(this.messageService, 'error', 'Line Haul inactivate',
        'New expiration required to inactivate.  Please provide date or cancel if inactivation is not needed');
    }
  }
  lineHaulInactivate(lineHauls: any) {
    for (const selectedLineHaul of this.lineHaulModel.selectedLineHaulData) {
      if (this.lineHaulModel.lineHaulInactivateForm.controls['expirationDate'].value <
        (new Date(selectedLineHaul.effectiveDate)) &&
        this.getCurrentDate() < (moment(selectedLineHaul.effectiveDate))
          .format(this.lineHaulModel.dateFormat)) {
        this.lineHaulModel.showconformationPopup = true;
        this.lineHaulModel.inactivatePopup = false;
        this.lineHaulInactivateInfo();
        this.lineHaulModel.priorEffDateFlag = true;
        this.lineHaulModel.preceedingEffDate++;
        if (!this.lineHaulModel.inactiveLHFlag) {
          lineHauls = utils.pull(lineHauls, selectedLineHaul.customerLineHaulConfigurationID);
        }
      } else if (this.lineHaulModel.lineHaulInactivateForm.controls['expirationDate'].value <
        (new Date(selectedLineHaul.effectiveDate)) &&
        this.getCurrentDate() >= (moment(selectedLineHaul.effectiveDate))
          .format(this.lineHaulModel.dateFormat)) {
        this.lineHaulModel.showconformationPopup = true;
        this.lineHaulModel.inactivatePopup = false;
        this.lineHaulModel.canDeleteFlag = true;
        this.lineHaulModel.canDeleteCount++;
      }
      if (this.lineHaulModel.lineHaulInactivateForm.controls['expirationDate'].value >
        (new Date(selectedLineHaul.expirationDate))) {
        this.lineHaulModel.showconformationPopup = true;
        this.lineHaulModel.priorExpDateFlag = true;
        this.lineHaulModel.inactivatePopup = false;
        this.lineHaulModel.exceedingExpDate++;
        lineHauls = utils.pull(lineHauls, selectedLineHaul.customerLineHaulConfigurationID);
      }
    }
    return lineHauls;
  }
  lineHaulInactivateInfo() {
    if (this.lineHaulModel.selectedLineHaulData.length === 1) {
      this.lineHaulModel.showconformationPopup = false;
      this.lineHaulModel.inactivatePopup = true;
      this.lineHaulModel.inactiveLHFlag = true;
      this.toastMessage(this.messageService, 'info', 'Cannot inactivate',
        'Linehaul cannot inactivated since it is not currently active');
    } else {
      this.lineHaulModel.inactiveLHFlag = false;
    }
  }
  onClickCancel(from?: string) {
    if (from !== 'Cancel Inactivation') {
      this.lineHaulModel.inactivatePopup = false;
    } else {
      this.lineHaulModel.inactivatePopup = true;
      this.lineHaulModel.showconformationPopup = false;
    }
  }
  onClickProceed() {
    const lineHauls = (this.lineHaulModel.selectedLineHaulConfigurationId).toString();
    this.inactivateLineHaul(lineHauls);
    this.lineHaulModel.showconformationPopup = false;
  }
  onTypeDate(event: Event) {
    const regex = new RegExp('^(1[0-2]|0?[1-9])/(3[01]|[12][0-9]|0?[1-9])/?[0-9]{4}$');
    if (event.srcElement['value'] && regex.test(event.srcElement['value'].trim())) {
      this.lineHaulModel.expDate = event.srcElement['value'];
    }
  }
  exportToExcel() {
    const linehaulstatus = (this.status) ? this.status : 'published';
    if (this.screen === 'review') {
      this.lineHaulModel.isReview = true;
    } else {
      this.lineHaulModel.isReview = false;
    }
    const query = ManualLineHaulQuery.
      getLineHaulQuery(this.agreementId, linehaulstatus, this.lineHaulModel.isReview,
        this.lineHaulModel.gridDataLength, this.lineHaulModel.lineHaulSearchValue, this.lineHaulModel.createdUser);
    this.lineHaulModel.loading = true;
    this.lineHaulService.downloadExcel(query).subscribe(data => {
      this.lineHaulModel.loading = false;
      this.downloadFiles(data, this.downloadExcel);
      this.toastMessage(this.messageService, 'success', 'Line Haul Rates Exported',
        `${'You have successfully exported '}${this.lineHaulModel.gridDataLength}${' Line Haul Rates.'}`);
      this.changeDetector.detectChanges();
    }, (excelError: Error) => {
      this.lineHaulModel.loading = false;
      if (excelError) {
        this.toastMessage(this.messageService, 'error', 'Error', excelError['error']['errors'][0]['errorMessage']);
        this.changeDetector.detectChanges();
      }
    });
  }
  downloadFiles(data: object, downloadExcel: ElementRef) {
    const fileName = `Line Haul ${moment().format(this.lineHaulModel.dateFormat)} at ${moment().format('hh.mm.ss A')}.xlsx`;
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(data, fileName);
    } else {
      downloadExcel.nativeElement.href = URL.createObjectURL(data);
      downloadExcel.nativeElement.download = fileName;
      downloadExcel.nativeElement.click();
    }
  }
}
