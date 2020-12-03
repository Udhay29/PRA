import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfirmationService } from 'primeng/api';

import { BroadcasterService } from '../../../shared/jbh-app-services/broadcaster.service';
import { ChargesModel } from './models/charges.model';
import { CanDeactivateGuardService } from '../../../shared/jbh-app-services/can-deactivate-guard.service';
import { ValuesComponent } from './values/values.component';
import { CreateChargesComponent } from './create-charges/create-charges.component';

@Component({
  selector: 'app-charges',
  templateUrl: './charges.component.html',
  styleUrls: ['./charges.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChargesComponent implements OnInit {
  chargesModel: ChargesModel;

  @ViewChild(ValuesComponent) valuesComponent: ValuesComponent;
  @ViewChild(CreateChargesComponent) createChargesComponent: CreateChargesComponent;
  @ViewChild('tabOneRef') tabRef0;
  @ViewChild('tabTwoRef') tabRef1;

  constructor (private readonly shared: BroadcasterService, private readonly changeDetector: ChangeDetectorRef,
    private readonly confirmationService: ConfirmationService,
    private readonly router: Router) { }

  ngOnInit() {
    this.chargesModel = new ChargesModel();
  }
  onPopupNo() {
    this.chargesModel.isPopupVisible = false;
    this.chargesModel.isChangesSaving = false;
    if (this.chargesModel.selectedIndex === 0) {
      this.shared.broadcast('needToSaveValues', true);
    }
  }

  onPopupYes() {
    this.chargesModel.isPopupVisible = false;
    this.chargesModel.isChangesSaving = true;
    if (this.chargesModel.selectedIndex === 0) {
      this.shared.broadcast('needToSaveValues', false);
    } else {
      this.shared.broadcast('needToSaveCreateCharges', false);
    }
    this.shared.broadcast('isValuesCancel', true);
    this.router.navigate([this.chargesModel.routingUrl]);
  }
  canDeactivate(component: CanDeactivateGuardService, route: ActivatedRouteSnapshot, state: RouterStateSnapshot,
    nextState: RouterStateSnapshot): Observable<boolean> | boolean {
    this.shared.broadcast('navigationStarts', nextState);
    this.chargesModel.routingUrl = nextState.url;
    const tabDirty = (this.chargesModel.selectedIndex === 0) ? this.tabRef0.valuesModel.valuesForm.dirty :
    this.tabRef1.viewChargesModel.createChargesForm.dirty;
    if (!this.chargesModel.isChangesSaving && tabDirty) {
      this.chargesModel.isPopupVisible = true;
      this.chargesModel.popupMessage = 'You are about to lose all the changes. Do you want to proceed?';
    } else {
      this.chargesModel.isChangesSaving = true;
    }
    this.changeDetector.detectChanges();
    return this.chargesModel.isChangesSaving;
  }
  handleChange(selectedTab: number, tabPanelView) {
    if (this.chargesModel.selectedIndex === 0) {
    this.chargesModel.lastEditedFormFlag = this['tabRef' + this.chargesModel.selectedIndex].valuesModel.valuesForm.dirty;
    } else {
    this.chargesModel.lastEditedFormFlag = this['tabRef' + this.chargesModel.selectedIndex].viewChargesModel.createChargesForm.dirty;
    }
    this.chargesModel.lastSelectedIndex = this.chargesModel.selectedIndex;
    this.chargesModel.selectedIndex = selectedTab;
    if (this.chargesModel.lastEditedFormFlag) {
      this.confirm();
    }
  }
  confirm() {
    this.confirmationService.confirm({
      message: 'You are about to lose all the changes. Do you want to proceed?',
      header: 'Confirmation',
      reject: (): void => {
        this.chargesModel.selectedIndex = this.chargesModel.lastSelectedIndex;
      }, accept: () => {
        this.chargesModel.lastEditedFormFlag = false;
        if (this.chargesModel.lastSelectedIndex === 0) {
          this['tabRef' + this.chargesModel.lastSelectedIndex].valuesModel.valuesForm.markAsUntouched();
          this['tabRef' + this.chargesModel.lastSelectedIndex].valuesModel.valuesForm.markAsPristine();
          this['tabRef' + this.chargesModel.lastSelectedIndex].valuesModel.valuesForm.updateValueAndValidity();
        } else {
          const createForm = this['tabRef' + this.chargesModel.lastSelectedIndex].viewChargesModel.createChargesForm;
          this['tabRef' + this.chargesModel.lastSelectedIndex].viewChargesModel.createChargesForm.markAsUntouched();
          this['tabRef' + this.chargesModel.lastSelectedIndex].viewChargesModel.createChargesForm.markAsPristine();
          this['tabRef' + this.chargesModel.lastSelectedIndex].viewChargesModel.createChargesForm.updateValueAndValidity();
          this.shared.broadcast('setErrorsNull', true);
          for (const key in this['tabRef' + this.chargesModel.lastSelectedIndex].viewChargesModel.createChargesForm.controls) {
            if (this['tabRef' + this.chargesModel.lastSelectedIndex].viewChargesModel.createChargesForm.controls.hasOwnProperty(key)) {
              createForm['controls'][key].setErrors(null);
            }
          }
        }
      }
    });
  }

}
