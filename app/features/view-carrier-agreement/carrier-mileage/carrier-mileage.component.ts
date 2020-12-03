import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs/operators';

import { MessageService } from 'primeng/components/common/messageservice';
import * as utils from 'lodash';
import * as moment from 'moment';

import { LocalStorageService } from '../../../shared/jbh-app-services/local-storage.service';
import { ViewCarrierMileageModel } from './model/carrier-mileage.model';
import { ViewCarrierMileageQuery } from './query/carrier-mileage.query';
import { CarrierMileageService } from './service/carrier-mileage.service';
import {
  ElasticViewResponseModel, BillToAccountsAssociations, SectionAssociation, CarrierAssociation,
  SystemParameterAssociation, HitsItem
} from './model/carrier-mileage-elasticresponse.interface';
import { QueryMock } from './model/carrier-mileage.interface';
import { CarrierMileageUtility } from './service/carrier-mileage-utility';

@Component({
  selector: 'app-carrier-mileage',
  templateUrl: './carrier-mileage.component.html',
  styleUrls: ['./carrier-mileage.component.scss'],
  providers: [CarrierMileageService, CarrierMileageUtility],
})
export class CarrierMileageComponent implements OnDestroy, OnInit {
  @Output() loaderEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  viewCarrierMileageModel: ViewCarrierMileageModel;
  constructor(private readonly router: Router, private readonly messageService: MessageService,
    private readonly changeDetector: ChangeDetectorRef, private readonly viewCarrierMileageService: CarrierMileageService,
    private readonly localStore: LocalStorageService, private readonly route: ActivatedRoute,
    private readonly carrierMileageUtility: CarrierMileageUtility) {
    this.viewCarrierMileageModel = new ViewCarrierMileageModel();
  }

  ngOnInit() {
    this.route.paramMap.pipe(takeWhile(() => this.viewCarrierMileageModel.isSubscriberFlag))
      .subscribe((params: any) => {
        this.viewCarrierMileageModel.agreementID = Number(params.get('id'));
      });
    this.localStore.setItem('agreementDetails', 'create', 'Mileage', true);
    this.getMockJson();
    this.localStore.setItem('agreementDetails', 'create', 'Mileage', true);
  }

  ngOnDestroy() {
    this.viewCarrierMileageModel.isSubscriberFlag = false;
  }
  getMockJson() {
    this.viewCarrierMileageModel.isPageLoading = true;
    this.viewCarrierMileageService.getMockJson().pipe(takeWhile(() =>
      this.viewCarrierMileageModel.isSubscriberFlag)).subscribe((data: QueryMock) => {
        this.viewCarrierMileageModel.sourceData = data;
        if (data) {
          this.viewCarrierMileageModel.isPageLoading = false;
          const fetchGridDetailsReqParam =
            ViewCarrierMileageQuery.viewCarrierMileageGridQuery(this.viewCarrierMileageModel.sourceData,
              String(this.viewCarrierMileageModel.agreementID), 0, this.viewCarrierMileageModel.gridSize);
          CarrierMileageService.setElasticparam(fetchGridDetailsReqParam);

          this.fetchMilleagePreferenceFromElastic();
        }
      });
  }
  fetchMilleagePreferenceFromElastic() {
    this.viewCarrierMileageModel.isPageLoading = true;
    const fetchGridDetailsReqParam = CarrierMileageService.getElasticparam();
    this.viewCarrierMileageService.getMileagePreference(fetchGridDetailsReqParam)
      .pipe(takeWhile(() => this.viewCarrierMileageModel.isSubscriberFlag))
      .subscribe((response: ElasticViewResponseModel) => {
        if (!utils.isEmpty(response && response.hits)) {
          const framedGridArray = [];
          response.hits.hits.forEach((eachHits: HitsItem) => {
            framedGridArray.push(this.carrierMileageUtility.viewMileageGridFramer(eachHits));
          });
          this.viewCarrierMileageModel.gridRows = framedGridArray;
          this.viewCarrierMileageModel.gridDataLength = response.hits.total;
          this.viewCarrierMileageModel.noResultFoundFlag = (this.viewCarrierMileageModel.gridRows.length === 0);
        } else {
          this.viewCarrierMileageModel.noResultFoundFlag = true;
          this.viewCarrierMileageModel.gridRows.length = 0;
        }
        this.viewCarrierMileageModel.isPageLoading = false;
        this.changeDetector.detectChanges();
      }, (error: Error) => {
        this.viewCarrierMileageModel.noResultFoundFlag = true;
        this.handleErrorMessageForViewMileageGrid(error.message);
      });
  }
  handleErrorMessageForViewMileageGrid(erroMessage: string) {
    CarrierMileageUtility.toastMessage(this.messageService, 'error', erroMessage);
    this.viewCarrierMileageModel.isPageLoading = false;
    this.changeDetector.detectChanges();
  }
  onClickCreateMileage() {
    this.router.navigate(['viewcarrierdetails', this.viewCarrierMileageModel.agreementID, 'createcarriermileage']);
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

  loadGridData(event: Event) {
    if (event && this.viewCarrierMileageModel.isAllowPagination) {
      const elasticQuery = CarrierMileageService.getElasticparam();
      elasticQuery['size'] = this.viewCarrierMileageModel.size;
      elasticQuery['from'] = this.viewCarrierMileageModel.from;
      this.viewCarrierMileageModel.tableSize = this.viewCarrierMileageModel.size;
      CarrierMileageService.setElasticparam(elasticQuery);
      this.fetchMilleagePreferenceFromElastic();
    }
    this.viewCarrierMileageModel.isAllowPagination = true;
  }

  frameSearchQuery(currentQuery, enteredValue: string) {
    this.viewCarrierMileageModel.isSplitView = false;
    utils.forEach(currentQuery['query']['bool']['must'][2]['bool']['should'], (query) => {
      if (query['nested']) {
        query['nested']['query']['query_string']['query'] = `*${enteredValue.replace(
          /[!?:\\['^~=\//\\{},.&&||<>()"+ *\]]/g, '\\$&')}*`;
      } else {
        query['query_string']['query'] = `*${enteredValue.replace(/[!?:\\["^~=\//\\{}&&|| <>()+*\]-]/g, '\\$&')}*`;
      }
    });
    if (enteredValue.toLowerCase() === 'inactive') {
      currentQuery['query']['bool']['must'][2]['bool']['should']
        .push(ViewCarrierMileageQuery.getStatusQuery('lte', 'Y OR N', 'Active OR Inactive'));
    }
    if (enteredValue.toLowerCase() === 'deleted') {
      currentQuery['query']['bool']['must'][2]['bool']['should'].push(ViewCarrierMileageQuery.getDeletedRecords());
    }
  }

  onClickMileageOverflowIcon(menu, event) {
    if (!this.viewCarrierMileageModel.noResultFoundFlag) {
      menu.toggle(event);
    }
  }
  setPaginator() {
    if (this.viewCarrierMileageModel.gridDataLength) {
      return true;
    } else {
      return false;
    }
  }
  loadMileageValuesLazy(event: Event) {
    this.viewCarrierMileageModel.from = event['first'];
    this.viewCarrierMileageModel.size = event['rows'];
    this.viewCarrierMileageModel.sortOrder = (event['sortOrder'] === 1) ? 'asc' : 'desc';
  }
  /** function to show or hide loader
   * @param {boolean} event
   * @memberof CarrierSectionComponent */
  loader(event: boolean) {
    this.loaderEvent.emit(event);
  }
}
