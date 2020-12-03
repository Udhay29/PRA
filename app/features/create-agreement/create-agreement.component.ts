import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';

import { BroadcasterService } from '../../shared/jbh-app-services/broadcaster.service';
import { LocalStorageService } from '../../shared/jbh-app-services/local-storage.service';

import { CreateAgreementModel } from './model/create-agreement.model';
import { CanComponentDeactivate, NavigationAlert } from './model/create-agreement.interface';

@Component({
  selector: 'app-create-agreement',
  templateUrl: './create-agreement.component.html',
  styleUrls: ['./create-agreement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateAgreementComponent implements OnInit, OnDestroy {
  createAgreementModel: CreateAgreementModel;
  constructor(private readonly shared: BroadcasterService, private readonly router: Router,
    private readonly changeDetector: ChangeDetectorRef, private readonly store: LocalStorageService) {
    this.createAgreementModel = new CreateAgreementModel();
  }
  ngOnInit() {
    this.stepIndexSubscription();
    this.showComponents();
    this.agreementNameSubscription();
    this.agreementTypeSubscription();
  }
  ngOnDestroy() {
    this.createAgreementModel.isSubscribe = false;
  }
  /** function called when index is changed
   * @param {number} event
   * @memberof CreateAgreementComponent */
  onIndexChange(event: number) {
    this.createAgreementModel.clickedIndex = event;
    if (this.createAgreementModel.formChanged) {
      this.createAgreementModel.formChangedPopup = true;
    } else {
      if (this.createAgreementModel.stepsList[event]['visible']) {
        this.createAgreementModel.activeIndex = event;
      }
      this.showComponents();
    }
  }
  formCheck(event: boolean) {
    this.createAgreementModel.formChanged = event;
  }
  /** function to reset component for component view
   * @memberof CreateAgreementComponent */
  resetComponents() {
    this.createAgreementModel.isShowAgreementDetails = false;
    this.createAgreementModel.isShowContract = false;
    this.createAgreementModel.isShowSection = false;
    this.createAgreementModel.isShowCargo = false;
  }
  /** function to show component based on index
   * @memberof CreateAgreementComponent */
  showComponents() {
    this.resetComponents();
    switch (this.createAgreementModel.activeIndex) {
      case 0:
        this.createAgreementModel.isShowAgreementDetails = true;
        break;
      case 1:
        this.createAgreementModel.isShowContract = true;
        break;
      case 2:
        this.createAgreementModel.isShowSection = true;
        break;
      case 3:
        this.createAgreementModel.isShowCargo = true;
        break;
      default:
        break;
    }
  }
  /** function called when yes button is clicked
   * @memberof CreateAgreementComponent */
  clickYes() {
    this.createAgreementModel.isPopupVisible = false;
    this.createAgreementModel.isChangesSaving = true;
    this.shared.broadcast('carrierSave', false);
    this.router.navigate([this.createAgreementModel.routingUrl]);
  }
  /** function called when no button is clicked
   * @memberof CreateAgreementComponent */
  clickNo() {
    this.createAgreementModel.isPopupVisible = false;
    this.createAgreementModel.isChangesSaving = true;
  }
  /** function called when save button is clicked
   * @memberof CreateAgreementComponent */
  onSave() {
    this.createAgreementModel.formChangedPopup = false;
    this.createAgreementModel.isPopupVisible = false;
    this.createAgreementModel.isChangesSaving = true;
    this.shared.broadcast('needToSave', true);
  }
  /** function called when don't save button is clicked
   * @memberof CreateAgreementComponent */
  onDontSave() {
    this.createAgreementModel.formChangedPopup = false;
    this.createAgreementModel.isPopupVisible = false;
    this.createAgreementModel.isChangesSaving = true;
    this.shared.broadcast('needToSave', false);
    this.store.clearAllItems();
    if (utils.isNaN(this.createAgreementModel.clickedIndex)) {
      this.router.navigate([this.createAgreementModel.routingUrl]);
    }
  }
  onDonotSave() {
    this.createAgreementModel.formChangedPopup = false;
    this.createAgreementModel.isChangesSaving = true;
    this.shared.broadcast('needToSave', false);
  }
  /** function to get the agreement name
   * @memberof CreateAgreementComponent */
  agreementNameSubscription() {
    this.shared.on<string>('agreementName').pipe(takeWhile(() => this.createAgreementModel.isSubscribe)).subscribe((name: string) => {
      this.createAgreementModel.agreementName = utils.isEmpty(name) ? '' : `- ${name}`;
      this.changeDetector.detectChanges();
    });
  }
  /** function to get the agreement type
   * @memberof CreateAgreementComponent */
  agreementTypeSubscription() {
    this.shared.on<string>('agreementType').pipe(takeWhile(() => this.createAgreementModel.isSubscribe)).subscribe((name: string) => {
      if (name === 'carrier') {
        this.resetComponents();
        this.createAgreementModel.agreementName = '';
        this.createAgreementModel.isCarrierAgreement = true;
        this.createAgreementModel.isShowAgreementDetails = true;
      } else {
        this.createAgreementModel.isCarrierAgreement = false;
      }
      this.changeDetector.detectChanges();
    });
  }
  /** candeactivate function called when routing starts
   * @param {CanComponentDeactivate} component
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @param {RouterStateSnapshot} nextState
   * @returns {(Observable<boolean> | boolean)}
   * @memberof CreateAgreementComponent */
  canDeactivate(component: CanComponentDeactivate, route: ActivatedRouteSnapshot, state: RouterStateSnapshot,
    nextState: RouterStateSnapshot): Observable<boolean> | boolean {
    this.createAgreementModel.clickedIndex = null;
    this.shared.broadcast('navigationStarts', nextState);
    this.createAgreementModel.routingUrl = nextState.url;
    this.shared.on<NavigationAlert>('saved').pipe(takeWhile(() => this.createAgreementModel.isSubscribe))
      .subscribe((index: NavigationAlert) => {
        this.createAgreementModel.agreementType = index.type;
        this.createAgreementModel.isChangesSaving = index.key;
        this.createAgreementModel.popupMessage = index.message;
      });
    this.createAgreementModel.isPopupVisible = !this.createAgreementModel.isChangesSaving;
    if (this.createAgreementModel.isChangesSaving) {
      this.store.clearAllItems();
    }
    this.changeDetector.detectChanges();
    return this.createAgreementModel.isChangesSaving;
  }
  /** function called when step index is changed
   * @memberof CreateAgreementComponent */
  stepIndexSubscription() {
    this.shared.on<string>('stepIndexChange').pipe(takeWhile(() => this.createAgreementModel.isSubscribe)).subscribe((index: string) => {
      if (index === 'next') {
        this.indexChange();
      } else if (index === 'navigation') {
        this.createAgreementModel.activeIndex = this.createAgreementModel.clickedIndex;
      } else {
        this.createAgreementModel.activeIndex = this.createAgreementModel.activeIndex - 1;
      }
      this.onIndexChange(this.createAgreementModel.activeIndex);
      this.changeDetector.detectChanges();
    });
  }
  /** function called on index change
   * @memberof CreateAgreementComponent */
  indexChange() {
    if (this.createAgreementModel.activeIndex === 2) {
      this.createAgreementModel.stepsList[this.createAgreementModel.activeIndex]['visible'] = true;
      this.createAgreementModel.stepsList[this.createAgreementModel.activeIndex + 1]['visible'] = true;
      this.createAgreementModel.activeIndex = this.createAgreementModel.activeIndex + 1;
    } else {
      this.createAgreementModel.stepsList[this.createAgreementModel.activeIndex]['visible'] = true;
      this.createAgreementModel.activeIndex = this.createAgreementModel.activeIndex + 1;
    }
  }
}
