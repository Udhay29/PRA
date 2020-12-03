import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment-timezone';

import { TimeZoneService } from '../../../../../shared/jbh-app-services/time-zone.service';
import { FuelSummaryViewModel } from './model/fuel-summary-view.model';
import { FuelSummaryQuery } from './query/fuel-summary.query';
import { FuelSummaryService } from './services/fuel-summary.service';
import { LocalStorageService } from './../../../../../shared/jbh-app-services/local-storage.service';

@Component({
  selector: 'app-fuel-summary-view',
  templateUrl: './fuel-summary-view.component.html',
  styleUrls: ['./fuel-summary-view.component.scss']
})
export class FuelSummaryViewComponent implements OnInit {

  summaryModel: FuelSummaryViewModel;
  fuelProgramId: number;
  constructor(private readonly summaryService: FuelSummaryService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly localStore: LocalStorageService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly timeZoneService: TimeZoneService) {
    this.route.queryParams.subscribe((params) => {
      this.fuelProgramId = params['id'];
    });
    this.summaryModel = new FuelSummaryViewModel();
    this.summaryModel.agreementData = this.localStore.getAgreementDetails();
  }
  ngOnInit() {
    this.getFuelSummaryData();
    this.getFuelSummaryNotes();
  }
  getFuelSummaryData() {
    if (this.summaryModel.agreementData['customerAgreementID']) {
      const params = {
        'agreementID': this.summaryModel.agreementData['customerAgreementID'],
        'programID': this.fuelProgramId
      };
      const query = FuelSummaryQuery.getFuelSummaryQuery(params);
      this.summaryService.getFuelList(query).pipe(takeWhile(() => this.summaryModel.subscribeFlag)).subscribe((data) => {
        this.summaryDataFramer(data);
      });
    }
  }
  summaryDataFramer(data) {
    if (!utils.isEmpty(data)) {
      utils.forEach(data['hits']['hits'], (response) => {
        this.summaryModel.summaryData = response['_source'];
        this.summaryResponseFramer();
      });
    }
    this.changeDetector.detectChanges();
  }
  summaryResponseFramer() {
    this.summaryModel.summaryData['businessUnit'] =
      this.businessUnitFramer(this.summaryModel.summaryData['FinanceBusinessUnitServiceOfferingAssociations']);
    this.summaryModel.summaryData['carrier'] = this.dataFramer(this.summaryModel.summaryData['CarrierAssociations'], 'CarrierName');
    this.summaryModel.summaryData['ContractAssociations'] =
      this.dataFramer(this.summaryModel.summaryData['ContractAssociations'], 'ContractDisplayName');
    this.summaryModel.summaryData['SectionAssociations'] =
      this.dataFramer(this.summaryModel.summaryData['SectionAssociations'], 'SectionName');
    this.summaryModel.summaryData['BillToAccountAssociations'] =
      this.billtoFramer(this.summaryModel.summaryData['BillToAccountAssociations']);
    this.summaryModel.summaryData['EffectiveDate'] = moment(this.summaryModel.summaryData['EffectiveDate']).format('MM/DD/YYYY');
    this.summaryModel.summaryData['ExpirationDate'] = moment(this.summaryModel.summaryData['ExpirationDate']).format('MM/DD/YYYY');
  }
  getFuelSummaryNotes() {
    this.summaryService.getFuelNotes(this.fuelProgramId).pipe(takeWhile(() => this.summaryModel.subscribeFlag)).subscribe((data) => {
      if (!utils.isEmpty(data)) {
        this.summaryModel.fuelNote = data['fuelProgramNotes'];
        this.summaryModel.summaryData['FuelProgram']['CreatedDate'] =
          this.timeZoneService.convertToLocal(data['createTimestamp']);
        this.summaryModel.summaryData['FuelProgram']['LastUpdateDate'] =
          this.timeZoneService.convertToLocal(data['lastUpdateTimestamp']);
      }
      this.changeDetector.detectChanges();
    });
  }
  noteFramer(data) {
    this.summaryModel.fuelNote = data['fuelProgramNotes'];
    this.summaryModel.summaryData['FuelProgram']['CreatedDate'] =
      this.timeZoneService.convertToLocal(data['createTimestamp']);
    this.summaryModel.summaryData['FuelProgram']['LastUpdateDate'] =
      this.timeZoneService.convertToLocal(data['lastUpdateTimestamp']);
  }
  businessUnitFramer(data: Array<object>) {
    const dataArray = [];
    if (data) {
      for (const value of data) {
        dataArray.push(value['FinanceBusinessUnitServiceOfferingDisplayName']);
      }
    }
    return dataArray;
  }
  dataFramer(data: Array<object>, key: string) {
    const dataArray = [];
    if (data) {
      data = utils.uniqBy(data, key);
      for (const value of data) {
        this.responseFramer(value, dataArray, key);
      }
    }
    return dataArray;
  }
  responseFramer(value, dataArray, key) {
    if (value[key]) {
      dataArray.push(value[key]);
    }
  }
  billtoFramer(data: Array<object>) {
    const dataArray = [];
    if (data) {
      data = utils.uniqBy(data, 'BillingPartyCode');
      for (const value of data) {
        this.billToDataFormater(value, dataArray);
      }
    }
    return dataArray;
  }
  billToDataFormater(value, dataArray) {
    if (value['BillingPartyName']) {
      dataArray.push(`${value['BillingPartyName']}${' ('}${value['BillingPartyCode']}${')'}`);
    }
  }
  fuelPriceNavigate() {
    this.router.navigateByUrl('/settings/business-fuel');
  }
}
