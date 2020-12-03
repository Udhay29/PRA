import { Component, ChangeDetectorRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import * as utils from 'lodash';
import * as moment from 'moment-timezone';
import { takeWhile } from 'rxjs/operators';

import { ViewMileageModel } from '../models/view-mileage.model';
import { ViewMileageService } from '../services/view-mileage.service';
import { TimeZoneService } from '../../../../shared/jbh-app-services/time-zone.service';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';

@Component({
  selector: 'app-mileage-details',
  templateUrl: './mileage-details.component.html',
  styleUrls: ['./mileage-details.component.scss'],
  providers: [ViewMileageService],
})
export class MileageDetailsComponent {
  viewMileageModel: ViewMileageModel;
  @Output() closeClickEvent: EventEmitter<string> = new EventEmitter<string>();

  mileageID: number;
  agreementID: number;
  @Input() set uniqueDocID(mileageID: any) {
    this.mileageID = mileageID;
    this.getMileageDetails();
  }

  constructor(private readonly viewMileageService: ViewMileageService, private readonly messageService: MessageService,
    private readonly changeDetector: ChangeDetectorRef, private readonly timeZoneService: TimeZoneService,
    private readonly activeRoute: ActivatedRoute, private readonly router: Router,
    private readonly shared: BroadcasterService) {
    this.activeRoute.queryParams.subscribe((params) => {
      this.agreementID = params['id'];
    });
    this.viewMileageModel = new ViewMileageModel();
  }

  getMileageDetails() {
    this.viewMileageModel.pageLoading = true;
    const dateFormat = 'MM/DD/YYYY';
    this.viewMileageService.getMileageDetails(this.agreementID, this.mileageID)
      .pipe(takeWhile(() => this.viewMileageModel.subscriberFlag))
      .subscribe((response: any) => {
        if (!utils.isEmpty(response)) {
          if (response['responseStatus'] === 'PARTIAL') {
            const invaliderrorMessages = `${response['errorMessages'].toString().replace(/[,]/gi, '.<br>')}.`;
            const messages = {
              severity: 'warn',
              summary: 'Warning',
              detail: invaliderrorMessages
            };
            this.messageService.add(messages);
          }
          this.viewMileageModel.mileageDetailsForEdit = utils.cloneDeep(response);
          this.viewMileageModel.mileageDetails = utils.cloneDeep(response);
          this.viewMileageModel.mileageDetails['effectiveDate'] = response['effectiveDate'] ?
            moment(response['effectiveDate'].replace(/-/g, '\/').replace(/T.+/, '')).format(dateFormat) : '';
          this.viewMileageModel.mileageDetails['expirationDate'] = response['expirationDate'] ?
            moment(response['expirationDate'].replace(/-/g, '\/').replace(/T.+/, '')).format(dateFormat) : '';
          this.viewMileageModel.mileageDetails['createTimestamp'] = response.createTimestamp ?
            this.timeZoneService.convertToLocal(response.createTimestamp) : '';
          this.viewMileageModel.mileageDetails['mileageSystemParameters'] = this.systemParameterFramer(
            response['mileageSystemParameters']);
          this.setAuditFields(response, dateFormat);
          this.changeDetector.detectChanges();
        }
      }, (error: Error) => {
        this.viewMileageModel.pageLoading = false;
        this.toastMessage(this.messageService, 'error', 'Error', error.message);
        this.changeDetector.detectChanges();
      });
  }
  setAuditFields(response, dateFormat) {
    this.viewMileageModel.mileageDetails['originalEffectiveDate'] = response['originalEffectiveDate'] ?
      moment(response['originalEffectiveDate'].replace(/-/g, '\/').replace(/T.+/, '')).format(dateFormat) : '';
    this.viewMileageModel.mileageDetails['originalExpirationDate'] = response['originalExpirationDate'] ?
      moment(response['originalExpirationDate'].replace(/-/g, '\/').replace(/T.+/, '')).format(dateFormat) : '';
    this.viewMileageModel.mileageDetails['lastUpdateTimestamp'] = response['lastUpdateTimestamp'] ?
      this.timeZoneService.convertToLocal(response.lastUpdateTimestamp) : '';
    this.viewMileageModel.mileageDetails['borderCrossingParameter'] = response['mileageBorderMileParameterTypeID'] === 1 ?
      'Miles to border' : 'Miles include border crossing';
    this.viewMileageModel.mileageDetails['agreementDefaultIndicator'] = response['agreementDefaultIndicator'] === 'Y' ?
      'Yes' : 'No';
    this.viewMileageModel.mileageDetails['decimalPrecisionIndicator'] = response['decimalPrecisionIndicator'] === 'Y' ?
      'Yes' : 'No';

    this.viewMileageModel.pageLoading = false;
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
  onClose() {
    this.closeClickEvent.emit('close');
  }
  systemParameterFramer(response) {
    return utils.filter(response, item => item.mileageParameterSelectIndicator === 'Y');
  }
  onClickEdit() {
    this.shared.broadcast('editMileageDetails', {
      editMileageData: this.viewMileageModel.mileageDetailsForEdit,
      isMileageEdit: true,
      mileageID: this.mileageID
    });
    this.router.navigate(['/viewagreement/createmileage'], { queryParams: { id: this.agreementID } });
  }
}
