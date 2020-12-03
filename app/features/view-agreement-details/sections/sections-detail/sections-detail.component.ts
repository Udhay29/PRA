import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SectionsModel } from '../model/sections.model';
import { SectionsDetailService } from './service/sections-detail.service';
import { Section, SectionDetails } from '../model/sections.interface';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';
import { UserService } from '../../../../shared/jbh-esa/user.service';
import { TimeZoneService } from '../../../../shared/jbh-app-services/time-zone.service';
import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-sections-detail',
  templateUrl: './sections-detail.component.html',
  styleUrls: ['./sections-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionsDetailComponent implements OnDestroy {
  @Input() set viewScreenData(viewScreenData: Section) {
    this.rowData = viewScreenData;
    this.getSectionDetails();
  }
  @Output() closeClickEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() loaderEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() sectionEditEvent: EventEmitter<SectionDetails> = new EventEmitter<SectionDetails>();
  rowData: Section;
  sectionsDetailModel: SectionsModel;
  cols = [];
  billToCodes = [];
  constructor(private readonly userService: UserService, private readonly service: SectionsDetailService,
    private readonly changeDetector: ChangeDetectorRef, private readonly shared: BroadcasterService,
    private readonly timeZoneService: TimeZoneService) {
    this.sectionsDetailModel = new SectionsModel();
  }

  /** @memberof SectionsDetailComponent */
  ngOnDestroy() {
    this.sectionsDetailModel.isSubscriberFlag = false;
  }
  hasAccess(url: string): boolean {
    return this.userService.hasAccess(url, 'C');
  }
  /** function that subcribe the sections detail
 * @memberof SectionsDetailComponent */
  getSectionDetails() {
    this.loaderEvent.emit(true);
    this.service.getSectionDetail(this.rowData).pipe(takeWhile(() => this.sectionsDetailModel.isSubscriberFlag))
      .subscribe((data: SectionDetails) => {
        if (!utils.isEmpty(data)) {
          this.sectionsDetailModel.splitButtonMenu = this.getButtonMenu(data);
          this.sectionsDetailModel.sectionViewDetails = this.constructViewDetail(data);
        }
        this.loaderEvent.emit(false);
        this.setEditButtonDisabled( this.sectionsDetailModel.sectionViewDetails);
        this.changeDetector.detectChanges();
      }, (error: Error) => {
        this.loaderEvent.emit(false);
        this.changeDetector.detectChanges();
      });
  }
  constructViewDetail(data: SectionDetails): SectionDetails {
    data.status = data.status ? utils.capitalize(data.status) : '--';
    data.displayEffectiveDate = new Date(data.effectiveDate.replace(/-/g, '\/').replace(/T.+/, ''));
    data.displayExpirationDate = new Date(data.expirationDate.replace(/-/g, '\/').replace(/T.+/, ''));
    data.displayCreatedOn = this.timeZoneService.convertToLocal(data.createTimestamp);
    data.displayUpdatedOn = this.timeZoneService.convertToLocal(data.lastUpdateTimestamp);
    data.displayOriginalEffectiveDate = new Date(data.originalEffectiveDate.replace(/-/g, '\/').replace(/T.+/, ''));
    data.displayOriginalExpirationDate = new Date(data.originalExpirationDate.replace(/-/g, '\/').replace(/T.+/, ''));
    utils.forEach(data['customerAgreementContractSectionAccountDTOs'], (element) => {
      const displayEffectiveDate = element.effectiveDate ? moment(element.effectiveDate.replace(/-/g, '\/').replace(/T.+/, ''))
        .format('MM/DD/YYYY') : '';
      const displayExpirationDate = element.expirationDate ? moment(element.expirationDate.replace(/-/g, '\/').replace(/T.+/, ''))
        .format('MM/DD/YYYY') : '';
      element.assignedDateRange = `${displayEffectiveDate} - ${displayExpirationDate}`;
      element.billToCodes = `${element.billingPartyName} (${element.billingPartyCode})`;
    });
    if (data && data.customerAgreementContractSectionAccountDTOs) {
      data.associatedCodesLength = data.customerAgreementContractSectionAccountDTOs.length;
    }
    const keySets = Object.keys(data);
    utils.forEach(keySets, (key: string) => {
      data[key] = data[key] ? data[key] : '0';
    });
    return data;
  }
  getButtonMenu(data: SectionDetails): MenuItem[] {
    return [{
      label: (data.status && data.status.toLowerCase() === 'active') ? 'Inactivate' : 'Active'
    }, {
      label: 'Delete'
    }];
  }
  /** function that emits close event of the splitview
  * @memberof SectionDetailsComponent */
  onClose() {
    this.closeClickEvent.emit('close');
  }
  onSectionEdit() {
    this.sectionEditEvent.emit(this.sectionsDetailModel.sectionViewDetails);
  }
  setEditButtonDisabled(sectionData: SectionDetails) {
    if (sectionData.status !== 'Active') {
      this.sectionsDetailModel.editButtonDisable = true;
    } else {
      this.sectionsDetailModel.editButtonDisable = false;
    }
  }
}
