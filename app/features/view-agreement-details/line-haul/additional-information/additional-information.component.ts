import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { TimeZoneService } from '../../../../shared/jbh-app-services/time-zone.service';
import * as moment from 'moment';
import * as utils from 'lodash';
import { LineHaulValues } from '../additional-information/line-haul-overview/model/line-haul-overview.interface';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';

import { CanDeactivateGuardService } from '../../../../shared/jbh-app-services/can-deactivate-guard.service';
import { AdditionalInfoComponent } from '../add-line-haul/additional-info/additional-info.component';
import { AdditionalInformationModel } from './model/additional-information.model';
import { ViewAgreementDetailsUtility } from './../../service/view-agreement-details-utility';
import { LineHaulOverviewService } from '../additional-information/line-haul-overview/services/line-haul-overview.service';

@Component({
  selector: 'app-additional-information',
  templateUrl: './additional-information.component.html',
  styleUrls: ['./additional-information.component.scss']
})
export class AdditionalInformationComponent implements OnInit {
  additionalInformationModel: AdditionalInformationModel;

  @ViewChild('addtionalInfoComponent') addtionalInfoComponentRef;

  private lineHaulDetails: LineHaulValues;

  constructor(private readonly utilityService: ViewAgreementDetailsUtility,
    private readonly lineHaulOverviewService: LineHaulOverviewService, private readonly shared: BroadcasterService,
    private readonly dateshared: TimeZoneService) {
    this.additionalInformationModel = new AdditionalInformationModel();

  }

  ngOnInit() {
    this.getLineHaulConfigurationID();
    this.getLineHaulOverview();
    this.additionalInfoWizardEnable();
  }
  getLineHaulConfigurationID() {
    this.additionalInformationModel.nameConfigurationDetails = this.utilityService.getConfigurationID();
  }

  canDeactivate(component: CanDeactivateGuardService, route: ActivatedRouteSnapshot, state: RouterStateSnapshot,
    nextState: RouterStateSnapshot): Observable<boolean> | boolean {
    this.addtionalInfoComponentRef.additionalInfoModel.routingUrl = nextState.url;
    if (!this.addtionalInfoComponentRef.additionalInfoModel.isDetailsSaved) {
      this.addtionalInfoComponentRef.additionalInfoModel.isChangesSaving = false;
    } else {
      this.addtionalInfoComponentRef.additionalInfoModel.isChangesSaving = true;
    }
    this.addtionalInfoComponentRef.additionalInfoModel.showCancelPopup =
      !this.addtionalInfoComponentRef.additionalInfoModel.isChangesSaving;
    this.addtionalInfoComponentRef.changeDetector.detectChanges();
    return this.addtionalInfoComponentRef.additionalInfoModel.isChangesSaving;
  }
  getLineHaulOverview() {
    const currentDate = this.dateshared.getCurrentDate();
    this.lineHaulDetails = null;
    this.lineHaulOverviewService.getLineHaulOverView(this.additionalInformationModel
      .nameConfigurationDetails.customerLineHaulConfigurationID,
      currentDate).pipe(takeWhile(() => this.additionalInformationModel.subscribeFlag)).subscribe((lineHaulDetail: LineHaulValues) => {
        this.lineHaulDetails = lineHaulDetail;
        this.shared.broadcast('linehaulOverView', this.lineHaulDetails);
        this.additionalInformationModel.isBroadcastCallFlag = this.additionalInformationModel.isBroadcastCallFlag === undefined
         ? true : !this.additionalInformationModel.isBroadcastCallFlag;
      });
  }


  additionalInfoWizardEnable() {
    const getWizardStatus = this.utilityService.getreviewwizardStatus();
    if (getWizardStatus !== undefined) {
      utils.each(this.additionalInformationModel.stepsList, (stepListData) => {
        if (stepListData['label'] === 'Line Haul Details') {
          stepListData['disabled'] = getWizardStatus.isLaneCardInfo;
        } else if (stepListData['label'] === 'Review') {
          stepListData['disabled'] = getWizardStatus.isLineHaulReviewed;
        }
      });
    }
  }

  onIndexChange(event: number) {
    this.showComponents(event);
  }

  showComponents(index) {
    switch (index) {
      case 0:
        this.navigateToLaneCardPage();
        break;
      case 2:
        this.navigateToReviewPage();
        break;
      default:
        break;
    }
  }

  navigateToLaneCardPage() {
    this.addtionalInfoComponentRef.onClickBack();
  }

  navigateToReviewPage() {
    this.addtionalInfoComponentRef.onClickReview();
  }

}
