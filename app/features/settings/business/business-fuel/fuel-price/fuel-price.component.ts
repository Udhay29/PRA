import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { takeWhile, finalize } from 'rxjs/operators';
import { CurrencyPipe, DatePipe } from '@angular/common';
import * as moment from 'moment';
import { MessageService } from 'primeng/components/common/messageservice';

import { HitsModel, FuelPriceTableColumn, ElasticResponseModel } from './model/fuel-price.interface';
import { FuelPriceModel } from './model/fuel-price.model';
import { FuelPriceQuery } from './query/fuel-price-query';
import { FuelPriceService } from './service/fuel-price.service';
import { FuelPriceUtilService } from './service/fuel-price-util.service';
@Component({
  selector: 'app-fuel-price',
  templateUrl: './fuel-price.component.html',
  styleUrls: ['./fuel-price.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe]
})
export class FuelPriceComponent implements OnInit, OnDestroy {
  fuelPriceModel: FuelPriceModel;
  @ViewChild('downloadExcel') downloadExcel: ElementRef;
  @Input()
  set initGrid(value: string) {
    this.gridInit = value;
    this.loadGrid();
  }
  get initGrid(): string {
    return this.gridInit;
  }
  private gridInit;
  constructor(private readonly changeDetector: ChangeDetectorRef, private readonly fuelPriceService: FuelPriceService,
    private readonly fuelPriceUtilService:
      FuelPriceUtilService, private readonly currencyPipe: CurrencyPipe,
    private readonly messageService: MessageService, private readonly datePipe: DatePipe) {
    this.fuelPriceModel = new FuelPriceModel();
  }
  ngOnInit() {
    this.fuelPriceModel.multiSortMeta.push({ field: 'effectiveDate', order: -1 });
    this.fuelPriceModel.totalRecords = 0;
    this.fuelPriceModel.subscribeFlag = true;
    this.getOverflowList();
  }
  getOverflowList() {
    this.fuelPriceModel.menuItemList = [
      {
        label: 'Export to Excel',
        command: (onclick): void => {
          this.exportToExcel();
        }
      },
      {
        label: 'Manage Columns'
      }
    ];
  }

  ngOnDestroy() {
    this.fuelPriceModel.subscribeFlag = false;
  }
  loadGrid() {
    this.fuelPriceModel.loading = true;
    this.fuelPriceModel.fuelPriceQuery = FuelPriceQuery.getFuelPriceQuery(this.fuelPriceModel.filterDetails);
    this.fuelPriceService.getFuelPriceList(this.fuelPriceModel.fuelPriceQuery).pipe(takeWhile(() =>
      this.fuelPriceModel.subscribeFlag), finalize(() => {
        this.changeDetector.detectChanges();
      })).subscribe((data: ElasticResponseModel) => {
        const arr = [];
        if (data && data.hits && data.hits.hits) {
          this.fuelPriceModel.loading = false;
          this.fuelPriceModel.totalRecords = data['hits']['total'];
          data.hits.hits.forEach((dataObject: HitsModel) => {
            arr.push(this.fuelPriceUtilService.parsingGridData(dataObject._source, this.currencyPipe));
          });
          this.fuelPriceModel.gridListValues = arr;
          this.fuelPriceModel.noResultFlag = (this.fuelPriceModel.gridListValues.length === 0);
        }
        this.changeDetector.detectChanges();
      }, (error: Error) => {
        this.fuelPriceModel.gridListValues = [];
        this.fuelPriceModel.noResultFlag = true;
        this.fuelPriceModel.loading = false;
        this.changeDetector.detectChanges();
      });
  }
  loadConfigValuesLazy(event: Event) {
    this.fuelPriceModel.filterDetails['from'] = event['first'];
    this.fuelPriceModel.filterDetails['size'] = event['rows'];
    this.fuelPriceModel.sortOrder = (event['multiSortMeta'][0]['order'] === 1) ? 'asc' : 'desc';
  }
  onPage() {
    this.loadGrid();
  }
  onSortSelect(column: FuelPriceTableColumn) {
    this.fuelPriceModel.multiSortMeta = [];
    this.fuelPriceModel.multiSortMeta.push({ field: column['property'], order: (this.fuelPriceModel.sortOrder === 'desc') ? -1 : 1 });
    this.fuelPriceModel.sortFlag = true;
    this.fuelPriceModel.filterDetails.sordDetails['field'] = column['property'];
    this.fuelPriceModel.filterDetails.sordDetails['order'] = this.fuelPriceModel.sortOrder;
    this.loadGrid();
  }
  onFilterClick() {
    this.fuelPriceModel.filterFlag = !this.fuelPriceModel.filterFlag;
  }
  loadGridBasedOnFilter(event) {
    this.fuelPriceModel.filterNoresultFlag = true;
    this.fuelPriceModel.filterDetails['fuelPriceSourceTypeName'] = this.queryDataFramer(event['fuelPriceSourceTypeName']);
    this.fuelPriceModel.filterDetails['fuelRegionName'] = this.queryDataFramer(event['fuelRegionName']);
    this.fuelPriceModel.filterDetails['fuelPriceAmount'] = this.fuelAmountFormator(event['fuelPriceAmount']);
    this.fuelPriceModel.filterDetails['unitOfVolumeMeasurementCode'] = this.queryDataFramer(event['unitOfVolumeMeasurementCode']);
    this.fuelPriceModel.filterDetails['currencyCode'] = this.queryDataFramer(event['currencyCode']);
    this.fuelPriceModel.filterDetails['pricingCountryCode'] = this.queryDataFramer(event['pricingCountryCode']);
    this.fuelPriceModel.filterDetails['fuelTypeName'] = this.queryDataFramer(event['fuelTypeName']);
    this.fuelPriceModel.filterDetails['createUserID'] = this.queryDataFramer(event['createUserID']);
    this.fuelPriceModel.filterDetails['createProgramName'] = this.queryDataFramer(event['createProgramName']);
    this.fuelPriceModel.filterDetails['lastUpdateUserID'] = this.queryDataFramer(event['lastUpdateUserID']);
    this.fuelPriceModel.filterDetails['lastUpdateProgramName'] = this.queryDataFramer(event['lastUpdateProgramName']);
    this.fuelPriceModel.filterDetails['lastUpdateTimestamp'] = `${'*'}${event['lastUpdateTimestamp']}${'*'}`;
    this.fuelPriceModel.filterDetails['createTimestamp'] = `${'*'}${event['createTimestamp']}${'*'}`;
    this.fuelPriceModel.filterDetails['from'] = 0;
    this.fuelPriceModel.filterDetails['size'] = 25;
    this.effectiveDateFramer(event);
    this.expirationDateFramer(event);
    this.loadGrid();
  }
  fuelAmountFormator(price) {
    let obj = {};
    if (price && price.includes('.')) {
      const data = price.split('.');
      const length = data[1].length;
      switch (length) {
        case 0:
        case 1:
          obj = {
            'maxAmt': Number(price) + 0.0999,
            'minAmt': price
          };
          break;
        case 2:
          obj = {
            'maxAmt': Number(price) + 0.0099,
            'minAmt': price
          };
          break;
        case 3:
          obj = {
            'maxAmt': Number(price) + 0.0009,
            'minAmt': price
          };
          break;
        default:
          const a = price.slice(5) * 0.0001;
          price = price - a;
          obj = {
            'maxAmt': Number(price) + 0.0009,
            'minAmt': price
          };
          break;
      }
    } else if (price) {
      obj = {
        'maxAmt': Number(price) + 0.9999,
        'minAmt': Number(price) + 0.0
      };
    }
    return obj;
  }
  effectiveDateFramer(event) {
    if (event && event['effectiveDate'] && event['effectiveDate']['type']) {
      switch (event['effectiveDate']['type']) {
        case 'effectiveDateRange':
        case 'effectiveExactMatch':
          this.fuelPriceModel.filterDetails['effectiveDateStart'] = event['effectiveDate']['gte'];
          this.fuelPriceModel.filterDetails['effectiveDateEnd'] = event['effectiveDate']['lte'];
          this.fuelPriceModel.filterDetails['effectiveType'] = event['effectiveDate']['type'];
          break;
        case 'effectiveNonMatch':
          this.fuelPriceModel.filterDetails['effectiveType'] = event['effectiveDate']['type'];
          this.fuelPriceModel.filterDetails['effectiveNonMatchDate'] = event['effectiveDate']['lte'];
          this.fuelPriceModel.filterDetails['effectiveDateStart'] = 'now-1y';
          this.fuelPriceModel.filterDetails['effectiveDateEnd'] = 'now';
          break;
        default:
          break;
      }
    } else {
      this.fuelPriceModel.filterDetails['effectiveDateStart'] = 'now-1y';
      this.fuelPriceModel.filterDetails['effectiveDateEnd'] = 'now';
      this.fuelPriceModel.filterDetails['effectiveType'] = '*';
    }
  }
  expirationDateFramer(event) {
    if (event && event['expirationDate'] && event['expirationDate']['type']) {
      if (event['expirationDate']['type'] === 'expirationExactMatch' ||
        event['expirationDate']['type'] === 'expirationDateRange') {
        this.fuelPriceModel.filterDetails['expireDateStart'] = event['expirationDate']['gte'];
        this.fuelPriceModel.filterDetails['expireDateEnd'] = event['expirationDate']['lte'];
        this.fuelPriceModel.filterDetails['expirationType'] = event['expirationDate']['type'];
      } else if (event['expirationDate']['type'] === 'expirationNonMatch') {
        this.fuelPriceModel.filterDetails['expirationType'] = event['expirationDate']['type'];
        this.fuelPriceModel.filterDetails['expirationNonMatchDate'] = event['expirationDate']['lte'];
        this.fuelPriceModel.filterDetails['expireDateStart'] = '1995-01-01';
        this.fuelPriceModel.filterDetails['expireDateEnd'] = '2099-12-31';
      }
    } else {
      this.fuelPriceModel.filterDetails['expireDateStart'] = '1995-01-01';
      this.fuelPriceModel.filterDetails['expireDateEnd'] = '2099-12-31';
      this.fuelPriceModel.filterDetails['expirationType'] = '*';
    }
  }
  queryDataFramer(data) {
    let queryData = '';
    if (data) {
      queryData = data.toString();
      queryData = queryData.replace(/,/g, this.fuelPriceModel.queryString);
    }
    return queryData;
  }
  exportToExcel() {
    this.fuelPriceModel.loading = true;
    this.fuelPriceModel.fuelPriceQuery['size'] = this.fuelPriceModel.totalRecords;
    if (!this.fuelPriceModel.sortFlag) {
      this.fuelPriceModel.fuelPriceQuery['sort'] = FuelPriceQuery.defaultSort();
    }
    this.fuelPriceService.downloadExcel(this.fuelPriceModel.fuelPriceQuery).subscribe(data => {
      this.fuelPriceModel.loading = false;
      this.downloadFiles(data, this.downloadExcel);
      this.toastMessage(this.messageService, 'success', 'Fuel Price Exported',
        'You have successfully exported Fuel Price.');
      this.changeDetector.detectChanges();
    }, (error: Error) => {
      this.fuelPriceModel.loading = false;
      this.toastMessage(this.messageService, 'error', 'Export Failed',
        'Data to export exceeds Excel limitations. Please apply filter(s) and try again.');
      this.changeDetector.detectChanges();
    });
  }
  downloadFiles(data: object, downloadExcel: ElementRef) {
    const date = new Date();
    const fileName = `Fuel Price ${this.datePipe.transform(date, 'yyyy-MM-dd')} at ${this.datePipe.transform(date, 'hh.mm.ss a')}.xlsx`;
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
}
