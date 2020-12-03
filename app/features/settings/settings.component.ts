import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, CanDeactivate, Router, RouterStateSnapshot } from '@angular/router';

import { SettingsModel } from './models/settings.model';
import { BroadcasterService } from '../../shared/jbh-app-services/broadcaster.service';
import { CanComponentDeactivate, IndexType } from '../settings/models/setting-interface';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit, OnDestroy {
  @ViewChild('tabOneRef') tabRef0;
  @ViewChild('tabTwoRef') tabRef1;
  settingsModel: SettingsModel;
  constructor(private readonly confirmationService: ConfirmationService,
    private readonly shared: BroadcasterService,
    private readonly changeDetector: ChangeDetectorRef, private readonly router: Router) { }

  ngOnInit() {
    this.settingsModel = new SettingsModel(null);
    this.checkChargesTab();
  }

  ngOnDestroy() {
    this.settingsModel.isSubscribe = false;
  }

  onSave() {
    this.settingsModel.isPopupVisible = false;
    this.settingsModel.isChangesSaving = true;
    this.shared.broadcast('needToSave', true);
  }

  onDontSave() {
    this.settingsModel.isPopupVisible = false;
    this.settingsModel.isChangesSaving = true;
    this.shared.broadcast('needToSave', false);
    this.router.navigate([this.settingsModel.routingUrl]);
  }
  checkChargesTab() {
    this.shared.on<boolean>('isValuesCancel').subscribe((value: boolean) => {
      if (value) {
        this.settingsModel.selectedIndex = 1;
      }
    });
  }

  canDeactivate(component: CanComponentDeactivate, route: ActivatedRouteSnapshot, state: RouterStateSnapshot,
    nextState: RouterStateSnapshot): Observable<boolean> | boolean {
    this.shared.broadcast('navigationStarts', nextState);
    this.settingsModel.routingUrl = nextState.url;
    const tabDirty = (this.settingsModel.selectedIndex === 0) ? this.tabRef0.settingForm.dirty : this.tabRef1.settingForm.dirty;
    if (!this.settingsModel.isChangesSaving && tabDirty) {
      this.settingsModel.isPopupVisible = true;
      this.settingsModel.popupMessage = 'You have unsaved data. Do you want to save?';
    } else {
      this.settingsModel.isChangesSaving = true;
    }
    this.changeDetector.detectChanges();
    return this.settingsModel.isChangesSaving;
  }

  handleChange(selectedTab: number, tabPanelView) {
    this.settingsModel.lastEditedFormFlag = this['tabRef' + this.settingsModel.selectedIndex].settingForm.dirty;
    this.settingsModel.lastSelectedIndex = this.settingsModel.selectedIndex;
    this.settingsModel.selectedIndex = selectedTab;
    if (this.settingsModel.lastEditedFormFlag) {
      this.confirm();
    }
  }
  confirm() {
    this.confirmationService.confirm({
      message: 'You are about to lose all the changes. Do you want to proceed?',
      header: 'Confirmation',
      reject: (): void => {
        this.settingsModel.selectedIndex = this.settingsModel.lastSelectedIndex;
      }, accept: () => {
        this.settingsModel.lastEditedFormFlag = false;
      }
    });
  }
}
