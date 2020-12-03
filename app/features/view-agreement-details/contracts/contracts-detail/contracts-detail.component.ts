import { MenuItem } from 'primeng/api';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';
import * as moment from 'moment-timezone';

import { UserService } from '../../../../shared/jbh-esa/user.service';
import { ContractsModel } from '../model/contracts.model';
import { ContractsDetailService } from './service/contracts-detail.service';
import { Contract, ContractDetails } from '../model/contracts.interface';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';
import { TimeZoneService } from '../../../../shared/jbh-app-services/time-zone.service';

@Component({
  selector: 'app-contracts-detail',
  templateUrl: './contracts-detail.component.html',
  styleUrls: ['./contracts-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractsDetailComponent implements OnInit, OnDestroy {
  @Input() set viewScreenData(viewScreenData: Contract) {
    this.rowData = viewScreenData;
    this.getContractDetails();
  }
  @Output() closeClickEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() loaderEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  rowData: Contract;
  contractsDetailModel: ContractsModel;
  constructor(private readonly userService: UserService, private readonly service: ContractsDetailService,
    private readonly changeDetector: ChangeDetectorRef, private readonly shared: BroadcasterService,
    private readonly timeZoneService: TimeZoneService) {
    this.contractsDetailModel = new ContractsModel();
  }
  /** @memberof ContractsDetailComponent */
  ngOnInit() {}
  /** @memberof ContractsDetailComponent */
  ngOnDestroy() {
    this.contractsDetailModel.isSubscriberFlag = false;
  }
  hasAccess(url: string): boolean {
    return this.userService.hasAccess(url, 'C');
  }
  /** function that subcribe the contracts detail
   * @memberof ContractsDetailComponent */
  getContractDetails() {
    this.loaderEvent.emit(true);
    const currdate = moment().format('YYYY-MM-DD');
    this.service.getContractDetail(this.rowData, currdate).pipe(takeWhile(() => this.contractsDetailModel.isSubscriberFlag))
    .subscribe((data: ContractDetails) => {
      if (!utils.isEmpty(data)) {
        this.contractsDetailModel.splitButtonMenu = this.getButtonMenu(data);
        this.contractsDetailModel.contractViewDetails = this.constructViewDetail(data);
      }
      this.loaderEvent.emit(false);
      this.changeDetector.detectChanges();
    }, (error: Error) => {
      this.loaderEvent.emit(false);
      this.changeDetector.detectChanges();
    });
  }
  constructViewDetail(data: ContractDetails): ContractDetails {
    data.status = utils.capitalize(data.status);
    data.displayEffectiveDate = new Date(data.effectiveDate.replace(/-/g, '\/').replace(/T.+/, ''));
    data.displayExpirationDate = new Date(data.expirationDate.replace(/-/g, '\/').replace(/T.+/, ''));
    data.displayCreatedOn = this.timeZoneService.convertToLocal(data.createTimestamp);
    data.displayUpdatedOn = this.timeZoneService.convertToLocal(data.lastUpdateTimestamp);
    data.displayOriginalEffectiveDate = new Date(data.originalEffectiveDate.replace(/-/g, '\/').replace(/T.+/, ''));
    data.displayOriginalExpirationDate = new Date(data.originalExpirationDate.replace(/-/g, '\/').replace(/T.+/, ''));
    return data;
  }
  getButtonMenu(data: ContractDetails): MenuItem[] {
    return [{
      label: (data.status.toLowerCase() === 'active') ? 'Inactivate' : 'Active'
    }, {
      label: 'Delete'
    }];
  }
  /** function that emits close event of the splitview
   * @memberof ContractsDetailComponent */
  onClose() {
    this.closeClickEvent.emit('close');
  }
}
