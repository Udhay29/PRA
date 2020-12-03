import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { LinehaulPriorityModel } from './model/linehaul-priority.model';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { CanDeactivateGuardService } from '../../../../shared/jbh-app-services/can-deactivate-guard.service';
import { LinehaulPriorityService } from './service/linehaul-priority.service';
import { PriorityComponent } from './priority/priority.component';
import { GroupsComponent } from './groups/groups.component';
import * as utils from 'lodash';

@Component({
  selector: 'app-linehaul-priority',
  templateUrl: './linehaul-priority.component.html',
  styleUrls: ['./linehaul-priority.component.scss']
})
export class LinehaulPriorityComponent implements OnInit {

  @ViewChild(PriorityComponent) PriorityComponent: PriorityComponent;
  @ViewChild(GroupsComponent) groupsComponent?: GroupsComponent;
  @ViewChild('tabOneRef') tabRef0;
  @ViewChild('tabTwoRef') tabRef1;
  linehaulPrioritymodel: LinehaulPriorityModel;

  constructor(private readonly shared: BroadcasterService,
    private readonly linehaulPriorityService: LinehaulPriorityService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly router: Router) {
  }

  ngOnInit() {
    this.linehaulPrioritymodel = new LinehaulPriorityModel();
    this.checkGroupsTab();
  }

  checkGroupsTab() {
    this.shared.on<boolean>('isValuesCancel').subscribe((value: boolean) => {
      if (value) {
        this.linehaulPrioritymodel.selectedIndex = 1;
      }
    });
  }
  handleChange(selectedTab: number) {
    if ((this.linehaulPrioritymodel.selectedIndex !== selectedTab)
      && (this.linehaulPrioritymodel.selectedIndex === 1) && (this.linehaulPrioritymodel.groupEditFlag)) {
      this.linehaulPrioritymodel.lastSelectedIndex = this.linehaulPrioritymodel.selectedIndex;
      this.linehaulPrioritymodel.selectedIndex = 0;
      if (!utils.isEmpty(this.groupsComponent) && (!utils.isEmpty(this.groupsComponent.groupmodel.editValues) ||
        !utils.isEmpty(this.groupsComponent.groupmodel.duplicateGroupIds)
        || !utils.isEmpty(this.groupsComponent.groupmodel.editedGroupIDs))
      ) {
        this.linehaulPrioritymodel.tabChangePopup = true;
      }

    } else {
      this.linehaulPrioritymodel.tabChangePopup = false;
      this.linehaulPrioritymodel.lastSelectedIndex = this.linehaulPrioritymodel.selectedIndex;
      this.linehaulPrioritymodel.selectedIndex = selectedTab;
    }
  }
  canDeactivate(component: CanDeactivateGuardService, route: ActivatedRouteSnapshot, state: RouterStateSnapshot,
    nextState: RouterStateSnapshot): boolean {
    this.linehaulPrioritymodel.routingUrl = nextState.url;
    if (!utils.isEmpty(this.groupsComponent) && (!utils.isEmpty(this.groupsComponent.groupmodel.editValues)
      || !utils.isEmpty(this.groupsComponent.groupmodel.duplicateGroupIds)
      || !utils.isEmpty(this.groupsComponent.groupmodel.editedGroupIDs))
    ) {
      this.linehaulPrioritymodel.isPopupVisible = true;
    }
    this.changeDetector.detectChanges();
    return !this.linehaulPrioritymodel.groupEditFlag;
  }
  onClickYes() {
    this.linehaulPrioritymodel.groupsFirstLoading = true;
    this.linehaulPrioritymodel.groupEditFlag = false;
    this.linehaulPrioritymodel.tabChangePopup = false;
    this.linehaulPriorityService.clearGroupValues();
    this.changeDetector.detectChanges();
  }

  onClickNo() {
    this.linehaulPrioritymodel.groupEditFlag = true;
    this.linehaulPrioritymodel.selectedIndex = this.linehaulPrioritymodel.lastSelectedIndex;
    this.linehaulPrioritymodel.tabChangePopup = false;
    this.changeDetector.detectChanges();
  }

}
