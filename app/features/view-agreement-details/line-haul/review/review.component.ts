import { LineHaulModel } from './../model/line-haul.model';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, Output, OnInit } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpResponseBase } from '@angular/common/http';

import { takeWhile } from 'rxjs/operators';
import { Observable, timer } from 'rxjs';

import { MessageService } from 'primeng/components/common/messageservice';

import { LocalStorageService } from './../../../../shared/jbh-app-services/local-storage.service';
import { CanDeactivateGuardService } from '../../../../shared/jbh-app-services/can-deactivate-guard.service';

import { ReviewModel } from './model/review.model';
import { LineHaulService } from '../service/line-haul.service';
import { ViewAgreementDetailsUtility } from '../../../view-agreement-details/service/view-agreement-details-utility';
import * as utils from 'lodash';
import { PublishResponseDto } from '../review/model/review.interface';
import { LineHaulDetailData } from '../add-line-haul/additional-info/models/additional-info.interface';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewComponent {

  reviewModel: ReviewModel;

  @ViewChild('linehaul') linehaul: any;

  constructor(
    private readonly router: Router,
    private readonly messageService: MessageService,
    private readonly localStore: LocalStorageService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly lineHaulService: LineHaulService,
    private readonly lineHaulUtilityService: ViewAgreementDetailsUtility) {
    this.reviewModel = new ReviewModel();
    this.reviewModel.agreementDetails = this.localStore.getAgreementDetails();
    this.setAgreementId();
  }

  setAgreementId() {
    if (this.reviewModel.agreementDetails) {
      this.reviewModel.customerAgreementId = this.reviewModel.agreementDetails.customerAgreementID;
      this.reviewModel.agreementUrl = '/viewagreement';
    }
  }
  getConfigurationIds() {
    this.linehaul.lineHaulModel.lineHaulList.forEach(lineHaulListItem => {
      this.reviewModel.lineHaulConfigurationIds.push(lineHaulListItem['customerLineHaulConfigurationID']);
    });
  }
  /**
   *
   *
   * @param {boolean} isLineHaulSelected
   * @memberof ReviewComponent
   */
  onSelectLineHaul(isLineHaulSelected: boolean) {
    this.reviewModel.isLineHaulChecked = isLineHaulSelected;
  }

  /**
   *
   *
   * @memberof ReviewComponent
   */
  onLineHaulPublish() {
    this.reviewModel.isLineHaulPublish = true;
    if (this.linehaul.lineHaulModel.lineHaulList.length > 0) {
      this.getConfigurationIds();
      if (this.reviewModel.populateFlag) {
      this.saveLineHaulRecords('published');
      }
    }
  }
  /**
   *
   *
   * @memberof ReviewComponent
   */
  onSelectLineHaulCancel() {
    if (this.linehaul.lineHaulModel.lineHaulList.length > 0) {
      this.reviewModel.isCancel = true;
      this.getConfigurationIds();
    } else {
      this.reviewModel.isCancel = false;
      this.reviewModel.isDeleteLineHaul = true;
      const agreementNavigationUrl: string = (this.reviewModel.routingUrl) ?
        this.reviewModel.routingUrl : this.reviewModel.agreementUrl;
      this.router.navigate([agreementNavigationUrl], { queryParams: { id: this.reviewModel.customerAgreementId } });
    }
  }
  deleteLineHaulData() {
    this.getConfigurationIds();
    if (this.reviewModel.lineHaulConfigurationIds) {
      this.lineHaulService.deleteLineHaulRecords(this.reviewModel.lineHaulConfigurationIds)
        .pipe(takeWhile(() => this.reviewModel.subscribeFlag)).subscribe((deletedData: PublishResponseDto) => {
          if (deletedData.status === 'warning') {
            this.toastMessage(this.messageService, 'warn', 'Warning', deletedData.message);
          } else {
            this.toastMessage(this.messageService, 'success', 'Line Haul Canceled', 'You have successfully canceled a Manual Line Haul.');
          }
          this.lineHaulUtilityService.setreviewCancelStatus(false);
          const agreementNavigationUrl: string = (this.reviewModel.routingUrl) ?
            this.reviewModel.routingUrl : this.reviewModel.agreementUrl;
          timer(1000).subscribe(timerData => {
            this.router.navigate([agreementNavigationUrl], { queryParams: { id: this.reviewModel.customerAgreementId } });
          });
        });
    } else {
      const agreementNavigationUrl: string = (this.reviewModel.routingUrl) ?
        this.reviewModel.routingUrl : this.reviewModel.agreementUrl;
      this.router.navigate([agreementNavigationUrl], { queryParams: { id: this.reviewModel.customerAgreementId } });
    }
  }
  /**
   *
   *
   * @memberof ReviewComponent
   */
  onLineHaulDeleteData() {
    this.reviewModel.isCancel = false;
    this.reviewModel.isDeleteLineHaul = true;
    this.deleteLineHaulData();
  }
  /**
   *
   *
   * @memberof ReviewComponent
   */
  onLineHaulSaveData() {
    this.reviewModel.isCancel = false;
    this.saveLineHaulRecords('draft');
  }

  growlMessage(publishedData: PublishResponseDto, isDraft: boolean) {
    if (publishedData.status === 'warning') {
      this.toastMessage(this.messageService, 'warn', 'Warning', publishedData.message);
    } else if (isDraft) {
      this.toastMessage(this.messageService, 'success', 'Line Haul Saved',
        'Line Haul saved as draft.');
    } else {
      this.toastMessage(this.messageService, 'success',
        'Manual Line Haul Published', 'You have successfully published a Manual Line Haul.');
    }
  }
  /**
   *
   *
   * @param {string} status
   * @memberof ReviewComponent
   */
  saveLineHaulRecords(lineHaulDetailStatus: string) {
    this.reviewModel.populateFlag = false;
    this.getConfigurationIds();
    this.lineHaulService.publishLineHaulRecords(this.reviewModel.lineHaulConfigurationIds, lineHaulDetailStatus)
      .pipe(takeWhile(() => this.reviewModel.subscribeFlag)).subscribe((publishedData: PublishResponseDto) => {
        if (publishedData) {
          this.reviewModel.isDeleteLineHaul = true;
          timer(1000).subscribe(timerData => {
            const agreementNavigationUrl: string = (this.reviewModel.routingUrl) ?
              this.reviewModel.routingUrl : this.reviewModel.agreementUrl;
            this.router.navigate([agreementNavigationUrl], { queryParams: { id: this.reviewModel.customerAgreementId } });
            this.lineHaulUtilityService.setreviewCancelStatus(false);
            if (lineHaulDetailStatus === 'draft') {
              this.growlMessage(publishedData, true);
            } else {
              this.growlMessage(publishedData, false);
            }
          });
          this.changeDetector.detectChanges();
        }
      }, (lineHaulDataError: Error) => {
        this.toastMessage(this.messageService, 'error', 'Error', lineHaulDataError['error']['errors'][0]['errorMessage']);
      });
  }
  /**
   *
   *
   * @param {MessageService} messageService
   * @param {string} severityType
   * @param {string} messageDetail
   * @memberof ReviewComponent
   */
  toastMessage(messageService: MessageService, severityType: string, title: string, messageDetail: string) {
    const message = {
      severity: severityType,
      summary: title,
      detail: messageDetail
    };
    messageService.clear();
    messageService.add(message);
  }
  canDeactivate(component: CanDeactivateGuardService, route: ActivatedRouteSnapshot, state: RouterStateSnapshot,
    nextState: RouterStateSnapshot): Observable<boolean> | boolean {
    this.reviewModel.routingUrl = nextState.url;
    this.reviewModel.isChangesSaved = false;
    this.reviewModel.isDeleteLineHaul = (this.linehaul.lineHaulModel.isEmptyLineHaul ||
      this.linehaul.lineHaulModel.isAddLineHaul || this.reviewModel.isLineHaulPublish) ? true : this.reviewModel.isDeleteLineHaul;
    if (this.reviewModel.isDeleteLineHaul) {
      this.reviewModel.isChangesSaved = true;
    } else {
      this.reviewModel.isChangesSaved = false;
    }
    this.reviewModel.isCancel = !this.reviewModel.isChangesSaved;
    this.changeDetector.detectChanges();
    return this.reviewModel.isChangesSaved;
  }

  onClickLineHaulBack() {
    if (this.linehaul.lineHaulModel.selectedLineHaulData.length > 1) {
      this.toastMessage(this.messageService, 'warn', 'Warning', 'Select one Record  to Edit');
    } else if (this.linehaul.lineHaulModel.selectedLineHaulData.length === 1) {
      this.linehaul.lineHaulModel.isEmptyLineHaul = true;
      this.linehaul.lineHaulModel.isAddLineHaul = true;
      this.reviewModel.isLineHaulPublish = true;
      this.reviewModel.isBackClicked = true;
      this.reviewModel.customerAgreementData = {
        'customerAgreementName': this.linehaul.lineHaulModel.selectedLineHaulData[0].customerAgreementName,
        'customerLineHaulConfigurationID': this.linehaul.lineHaulModel.selectedLineHaulData[0].customerLineHaulConfigurationID
      };
      this.lineHaulUtilityService.setConfigurationID(this.reviewModel.customerAgreementData);
      this.reviewModel.linehaulStatus = {
        'isLineHaulEdit': true,
      };
      this.lineHaulUtilityService.setlineHaulStatus(this.reviewModel.linehaulStatus);
      this.reviewModel.editlinehaulData = {
        'isEditFlag': true,
        'lineHaulDetails': this.reviewModel.customerAgreementData['lineHaulConfigurationID']
      };
      this.lineHaulUtilityService.setEditLineHaulData(this.reviewModel.editlinehaulData);
      this.reviewModel.reviewWizardStatus = {
        'isLineHaulReviewed': false,
        'isAdditionalInfo': false,
        'isLaneCardInfo': false
      };
      this.lineHaulUtilityService.setreviewwizardStatus(this.reviewModel.reviewWizardStatus);
      this.router.navigate(['/viewagreement/additionalInfo'], {
        queryParams: {
          id: this.linehaul.lineHaulModel.selectedLineHaulData[0].customerAgreementID,
          sectionID: this.linehaul.lineHaulModel.selectedLineHaulData[0].customerAgreementContractSectionID,
        }
      });
    } else {
      this.navigateToAdditionalInfo();
    }
  }

  navigateToAdditionalInfo() {
    this.linehaul.lineHaulModel.isEmptyLineHaul = true;
    this.linehaul.lineHaulModel.isAddLineHaul = true;
    this.reviewModel.isLineHaulPublish = true;
    this.reviewModel.isBackClicked = true;
    const lineHaulDetailsData = this.lineHaulUtilityService.getLineHaulData();
    this.reviewModel.customerAgreementData = {
      'customerAgreementName': lineHaulDetailsData.customerAgreementName,
      'customerLineHaulConfigurationID': lineHaulDetailsData.customerLineHaulConfigurationID
    };
    const linehaul = utils.find(this.linehaul.lineHaulModel.lineHaulList,
       { 'customerLineHaulConfigurationID': this.reviewModel.customerAgreementData.customerLineHaulConfigurationID });
    if (!utils.isEmpty(linehaul)) {
      this.lineHaulUtilityService.setConfigurationID(this.reviewModel.customerAgreementData);
      this.reviewModel.linehaulStatus = {
        'isLineHaulEdit': true,
      };
      this.lineHaulUtilityService.setlineHaulStatus(this.reviewModel.linehaulStatus);
      this.reviewModel.editlinehaulData = {
        'isEditFlag': true,
        'lineHaulDetails': this.reviewModel.customerAgreementData['customerLineHaulConfigurationID']
      };
      this.lineHaulUtilityService.setEditLineHaulData(this.reviewModel.editlinehaulData);
      this.reviewModel.reviewWizardStatus = {
        'isLineHaulReviewed': false,
        'isAdditionalInfo': false,
        'isLaneCardInfo': false
      };
      this.lineHaulUtilityService.setreviewwizardStatus(this.reviewModel.reviewWizardStatus);
      this.router.navigate(['/viewagreement/additionalInfo'], {
        queryParams: {
          id: lineHaulDetailsData.customerAgreementID,
          sectionID: lineHaulDetailsData.customerAgreementContractSectionID
        }
      });
    } else {
      this.toastMessage(this.messageService, 'error', 'Error', 'Created Linehaul is deleted or not exist');
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
      case 1:
        this.navigateToAdditionalInfo();
        break;
      default:
        break;
    }
  }

  navigateToLaneCardPage() {
    this.linehaul.lineHaulModel.isEmptyLineHaul = false;
    this.linehaul.lineHaulModel.isAddLineHaul = true;
    const lineHaulDetailsData = this.lineHaulUtilityService.getLineHaulData();
    this.reviewModel.customerAgreementData = {
      'customerAgreementName': lineHaulDetailsData.customerAgreementName,
      'customerLineHaulConfigurationID': lineHaulDetailsData.customerLineHaulConfigurationID
    };
    const linehaul = utils.find(this.linehaul.lineHaulModel.lineHaulList,
      { 'customerLineHaulConfigurationID': this.reviewModel.customerAgreementData.customerLineHaulConfigurationID });
   if (!utils.isEmpty(linehaul)) {
      this.lineHaulUtilityService.setConfigurationID(this.reviewModel.customerAgreementData);
      this.reviewModel.linehaulStatus = {
        'isLineHaulEdit': true,
      };
      this.lineHaulUtilityService.setlineHaulStatus(this.reviewModel.linehaulStatus);
      this.reviewModel.editlinehaulData = {
        'isEditFlag': true,
        'lineHaulDetails': this.reviewModel.customerAgreementData['customerLineHaulConfigurationID']
      };
      this.lineHaulUtilityService.setEditLineHaulData(this.reviewModel.editlinehaulData);
      this.reviewModel.reviewWizardStatus = {
        'isLineHaulReviewed': false,
        'isAdditionalInfo': false,
        'isLaneCardInfo': false
      };
      this.lineHaulUtilityService.setreviewwizardStatus(this.reviewModel.reviewWizardStatus);
      this.router.navigate(['/viewagreement/linehaul'], { queryParams: { id: lineHaulDetailsData.customerAgreementID } });
    } else {
      this.toastMessage(this.messageService, 'error', 'Error', 'Created Linehaul is deleted or not exist');
    }
  }

}
