import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';
import * as moment from 'moment';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { DetailedViewModel } from './model/detailed-view-model';
import { DetailedViewService } from './services/detailed-view.service';
import { LineHaulValues, AgreementDetailsInterface, EquipmentTypeInterface } from './model/detailed-view.interface';
import { ViewAgreementDetailsUtility } from './../../service/view-agreement-details-utility';
import { OverviewService } from '../add-line-haul/overview/services/overview.service';
import { ServiceofferingInterface, OperationalService } from '../add-line-haul/overview/model/overview.interface';
import { MessageService } from 'primeng/components/common/messageservice';
import { HttpResponseBase } from '@angular/common/http';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-line-haul-detailed-view',
  templateUrl: './line-haul-detailed-view.component.html',
  styleUrls: ['./line-haul-detailed-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineHaulDetailedViewComponent implements OnInit, OnDestroy {
  detailedViewModel: DetailedViewModel;
  agreementData: AgreementDetailsInterface;
  agreementId: string;
  overflowMenuList(detailedViewModel: DetailedViewModel): MenuItem[] {
    return [{
      label: 'Inactivate Line Haul Rate',
      command: (onclick) => {
        detailedViewModel.inactivatePopup = true;
        this.formIntialisation();
      }
    }];
  }
  constructor(private readonly detailedViewService: DetailedViewService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly formBuilder: FormBuilder,
    private readonly utilityService: ViewAgreementDetailsUtility,
    private readonly route: ActivatedRoute,
    private readonly messageService: MessageService,
    private readonly overviewService: OverviewService) {
    this.route.queryParams.subscribe((params: Params) => {
      this.agreementId = String(params['id']);
      this.detailedViewModel = new DetailedViewModel(this.agreementId);
    });
    this.formIntialisation();
  }

  ngOnInit() {
    this.agreementData = this.utilityService.getAgreementDetails();
    this.getLineHaulOverview();
    this.getOverflowMenuList();
  }
  ngOnDestroy() {
    this.detailedViewModel.subscriberFlag = false;
  }
  formIntialisation() {
    this.detailedViewModel.inactivateForm = this.formBuilder.group({
      expirationDate: ['', Validators.required]
    });
  }
  getOverflowMenuList() {
    this.detailedViewModel.overflowMenuList = this.overflowMenuList(this.detailedViewModel);
    this.changeDetector.detectChanges();
  }
  getLineHaulOverview() {
    this.detailedViewModel.pageLoading = true;
    const currentDate = this.getCurrentDate();
    if (this.agreementData) {
      this.detailedViewService.getLineHaulOverView(this.agreementData['lineHaulConfigurationID'], currentDate)
        .pipe(takeWhile(() => this.detailedViewModel.subscriberFlag)).subscribe((data: LineHaulValues) => {
          if (!utils.isEmpty(data)) {
            this.detailedViewModel.lineHaulOverview = data;
            this.detailedViewModel.lineHaulOverview.overriddenPriority =
              (this.detailedViewModel.lineHaulOverview['overiddenPriorityLevelNumber'] !== null) ?
                this.detailedViewModel.lineHaulOverview['overiddenPriorityLevelNumber'].toString() : '- -';
            this.detailedViewModel.lineHaulOverview.customerAgreementContractName = (data.customerAgreementContractNumber) ?
              `${data['customerAgreementContractNumber']} (${data['customerAgreementContractName']})`
              : `(Transactional) - ${data['customerAgreementContractName']}`;
            this.detailedViewModel.operationalServices = [];
            this.detailedViewModel.maxDate = new Date(this.detailedViewModel.lineHaulOverview['expirationDate']);
            this.detailedViewModel.serviceOffering = data['serviceOfferingDescription'];
            this.setOperationalSerivces(data);
            this.changeDetector.markForCheck();
            this.detailedViewModel.pageLoading = false;
          }
        }, (error: Error) => {
          this.detailedViewModel.pageLoading = false;
          this.changeDetector.detectChanges();
        });
    }
  }
  setOperationalSerivces(lineHaulOverview: LineHaulValues) {
    this.detailedViewModel.operationalServices = [];
    if (!utils.isEmpty(lineHaulOverview['operationalServices'])) {
      lineHaulOverview.operationalServices.forEach(element => {
        this.detailedViewModel.operationalServices.push(element['serviceTypeDescription']);
      });
      this.changeDetector.markForCheck();
    }
  }

  onBlurDateValidate(event) {
    const regex = new RegExp('^(1[0-2]|0?[1-9])/(3[01]|[12][0-9]|0?[1-9])/?[0-9]{4}$');
    if (event.srcElement['value'] && regex.test(event.srcElement['value'].trim())
      && (new Date(event.srcElement['value']) <= new Date(this.detailedViewModel.maxDate))) {
      const expDate = new Date(event.srcElement['value']);
      this.detailedViewModel.inactivateForm.controls['expirationDate'].setValue(expDate);
    } else if (event.srcElement['value'] === '') {
      this.detailedViewModel.inactivateForm.controls['expirationDate'].setValidators([Validators.required]);
    } else {
      this.detailedViewModel.inactivateForm.controls.expirationDate.setErrors({ invalid: true });
    }
  }
  inactivateLineHaul(lineHauls: string) {
    this.detailedViewService.inactivateLineHauls(lineHauls,
      moment(this.detailedViewModel.inactivateForm.controls['expirationDate'].value)
        .format(this.detailedViewModel.dateFormatString))
      .pipe(takeWhile(() => this.detailedViewModel.subscriberFlag)).subscribe((inactivateLineHaul) => {
        if (inactivateLineHaul['status'] === 'success') {
          this.toastMessage(this.messageService, 'success', 'Line Haul inactivate', 'You have successfully inactivated the Line Haul.');
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: inactivateLineHaul['message'] });
        }
        this.getLineHaulOverview();
        this.detailedViewModel.inactivatePopup = false;
        this.changeDetector.detectChanges();
      }, (err: Error) => {
        this.toastMessage(this.messageService, 'error', 'Error', err['error']['errors'][0]['errorMessage']);
        this.detailedViewModel.inactivatePopup = false;
        this.changeDetector.detectChanges();
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
  getCurrentDate() {
    const date = new Date();
    return moment(date).format(this.detailedViewModel.dateFormatString);
  }
  onClickInactivate() {
    if (this.detailedViewModel.inactivateForm.controls.expirationDate.valid) {
      const lineHaulID = (this.agreementData['lineHaulConfigurationID']).toString();
      if (this.detailedViewModel.inactivateForm.controls['expirationDate'].value <
        (new Date(this.detailedViewModel.lineHaulOverview['effectiveDate'])) &&
        this.getCurrentDate() < (moment(this.detailedViewModel.lineHaulOverview['effectiveDate']))
          .format(this.detailedViewModel.dateFormatString)) {
        this.toastMessage(this.messageService, 'info',
          'Cannot inactivate', 'Linehaul cannot be inactivated since it is not currently active');
      } else if (this.detailedViewModel.inactivateForm.controls['expirationDate'].value <
        (new Date(this.detailedViewModel.lineHaulOverview['effectiveDate'])) &&
        this.getCurrentDate() >= (moment(this.detailedViewModel.lineHaulOverview['effectiveDate']))
          .format(this.detailedViewModel.dateFormatString)) {
        this.detailedViewModel.showPopupForPriorEffDate = true;
        this.detailedViewModel.inactivatePopup = false;
      } else {
        this.inactivateLineHaul(lineHaulID);
      }
    } else {
      this.detailedViewModel.inactivateForm.controls['expirationDate'].markAsTouched();
      this.detailedViewModel.inactivateForm.controls['expirationDate'].setValidators([Validators.required]);
      this.toastMessage(this.messageService, 'error', 'Line Haul inactivate',
        'New expiration required to inactivate.  Please provide date or cancel if inactivation is not needed');
    }
  }
  onClickCancel(from?: string) {
    if (from !== 'Cancel Inactivation') {
      this.detailedViewModel.inactivatePopup = false;
    } else {
      this.detailedViewModel.inactivatePopup = true;
      this.detailedViewModel.showPopupForPriorEffDate = false;
    }
  }
  onClickProceed() {
    const lineHaulID = (this.agreementData['lineHaulConfigurationID']).toString();
    this.inactivateLineHaul(lineHaulID);
    this.detailedViewModel.showPopupForPriorEffDate = false;
  }
  onTypeDate(event) {
    const regex = new RegExp('^(1[0-2]|0?[1-9])/(3[01]|[12][0-9]|0?[1-9])/?[0-9]{4}$');
    if (event.srcElement['value'] && regex.test(event.srcElement['value'].trim())) {
      this.detailedViewModel.expDate = event.srcElement['value'];
    }
  }
}
