import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';
import { MessageService } from 'primeng/components/common/messageservice';
import { ActivatedRoute, ActivatedRouteSnapshot, Params, Router, RouterStateSnapshot } from '@angular/router';

import { LocalStorageService } from '../../../../shared/jbh-app-services/local-storage.service';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';

import { CreateFuelProgramModel } from './model/create-fuel-program.model';
import { CreateFuelProgramService } from './service/create-fuel-program.service';
import { AgreementDetails, CanComponentDeactivate } from './model/create-fuel-program.interface';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-create-fuel-program',
  templateUrl: './create-fuel-program.component.html',
  styleUrls: ['./create-fuel-program.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateFuelProgramComponent implements OnInit, OnDestroy {
  createFuelProgramModel: CreateFuelProgramModel;
  constructor(
    private readonly route: ActivatedRoute, private readonly localStore: LocalStorageService, private readonly router: Router,
    private readonly service: CreateFuelProgramService, private readonly shared: BroadcasterService,
    private readonly changeDetector: ChangeDetectorRef, private readonly messageService: MessageService) {
    this.createFuelProgramModel = new CreateFuelProgramModel();
  }
  /** ngOnInit life cycle hook of CreateFuelProgramComponent
   * @memberof CreateFuelProgramComponent
   */
  ngOnInit() {
    this.getAgreementId();
    this.showComponents();
    this.stepIndexSubscription();
    this.localStore.setItem('agreementDetails', 'create', 'Fuel', true);
  }
  /** ngOnDestroy life cycle hook of CreateFuelProgramComponent
   * @memberof CreateFuelProgramComponent
   */
  ngOnDestroy() {
    this.createFuelProgramModel.isSubscribe = false;
  }
  canDeactivate(component: CanComponentDeactivate, route: ActivatedRouteSnapshot, state: RouterStateSnapshot,
  nextState: RouterStateSnapshot): Observable<boolean> | boolean {
    this.createFuelProgramModel.routingUrl = nextState.url;
    this.shared.broadcast('navigationStarts', nextState);
    this.shared.on<boolean>('isChanged').subscribe((value: boolean) => {
      this.createFuelProgramModel.isChangesAvailable = value;
    });
    this.createFuelProgramModel.isSaveChanges = this.createFuelProgramModel.isChangesAvailable;
    this.changeDetector.detectChanges();
    return !this.createFuelProgramModel.isChangesAvailable;
  }
  /** function to get agreement id and fetch agreement details
   * @memberof CreateFuelProgramComponent
   */
  getAgreementId() {
    this.route.queryParams.subscribe((params: Params) => {
      this.createFuelProgramModel.agreementId = Number(params['id']);
      this.createFuelProgramModel.isPageLoading = true;
      this.service.getAgreementDetails(this.createFuelProgramModel.agreementId).pipe(takeWhile(() =>
      this.createFuelProgramModel.isSubscribe)).subscribe((agreementDetails: AgreementDetails) => {
        this.createFuelProgramModel.isPageLoading = false;
        if (!utils.isEmpty(agreementDetails)) {
          this.createFuelProgramModel.agreementName = `- ${agreementDetails.customerAgreementName}`;
          this.shared.broadcast('agreementDetailsforFuel', agreementDetails);
        }
        this.changeDetector.detectChanges();
      }, (error: Error) => {
        this.createFuelProgramModel.isPageLoading = false;
        this.toastMessage('error', 'Error', error['error'].errors[0].errorMessage);
        this.changeDetector.detectChanges();
      });
    });
  }
  /** function called when index changed for step component
   * @param {number} event
   * @memberof CreateFuelProgramComponent
   */
  onIndexChange(event: number) {
    if (this.createFuelProgramModel.stepsList[event]['visible']) {
      this.createFuelProgramModel.activeIndex = event;
    }
    this.showComponents();
  }
  /** broadcast subscription to identify the change in step index
   * @memberof CreateFuelProgramComponent
   */
  stepIndexSubscription() {
    this.shared.on<string>('fuelStepIndexChange').pipe(takeWhile(() => this.createFuelProgramModel.isSubscribe))
    .subscribe((index: string) => {
      if (index === 'next') {
        this.createFuelProgramModel.stepsList[this.createFuelProgramModel.activeIndex]['visible'] = true;
        this.createFuelProgramModel.activeIndex = this.createFuelProgramModel.activeIndex + 1;
      } else {
        this.createFuelProgramModel.activeIndex = this.createFuelProgramModel.activeIndex - 1;
      }
      this.onIndexChange(this.createFuelProgramModel.activeIndex);
      this.changeDetector.detectChanges();
    });
  }
  /** reset all the component on view
   * @memberof CreateFuelProgramComponent
   */
  resetComponents() {
    this.createFuelProgramModel.isShowFuelSummary = false;
    this.createFuelProgramModel.isShowFuelCalculationDetails = false;
    this.createFuelProgramModel.isShowFuelPriceBasis = false;
  }
  /** fucntion to load component based on the step index
   * @memberof CreateFuelProgramComponent
   */
  showComponents() {
    this.resetComponents();
    switch (this.createFuelProgramModel.activeIndex) {
      case 0:
        this.createFuelProgramModel.isShowFuelSummary = true;
        break;
      case 1:
        this.createFuelProgramModel.isShowFuelCalculationDetails = true;
        break;
      case 2:
        this.createFuelProgramModel.isShowFuelPriceBasis = true;
        break;
      default:
        break;
    }
  }
  /** function to display toast message
   * @param {string} type
   * @param {string} title
   * @param {string} message
   * @memberof CreateFuelProgramComponent
   */
  toastMessage(type: string, title: string, message: string) {
    this.messageService.clear();
    this.messageService.add({
      severity: type,
      summary: title,
      detail: message
    });
  }
  /** function called when no is clicked in popup
   * @memberof CreateFuelProgramComponent
   */
  onPopupCancel() {
    this.createFuelProgramModel.isSaveChanges = false;
  }
  /** function called when yes is clicked in popup
   * @memberof CreateFuelProgramComponent
   */
  onPopupYes() {
    this.shared.broadcast('loseChanges', true);
    if (this.createFuelProgramModel.routingUrl.includes('viewagreement')) {
      this.router.navigate(['/viewagreement'], {queryParams: {id: this.createFuelProgramModel.agreementId}});
    } else {
      this.router.navigate([this.createFuelProgramModel.routingUrl]);
    }
  }
  /** loader event emitted form the child component
   * @param {boolean} event
   * @memberof CreateFuelProgramComponent
   */
  loader(event: boolean) {
    this.createFuelProgramModel.isPageLoading = event;
  }
}
