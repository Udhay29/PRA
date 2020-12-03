import { Component, OnInit, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { GroupModel } from './model/group.model';
import { GroupsService } from './service/groups.service';
import { LineHaulPriorityGroups, LineHaulPriorityGroupsItem, LinehaulPriorityGroupValue } from './model/group.interface';
import { isEmpty, takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';
import { Router } from '@angular/router';
import { LinehaulPriorityModel } from '../model/linehaul-priority.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Validators, FormBuilder } from '@angular/forms';
import { group } from '@angular/animations';
import { LinehaulPriorityService } from '../service/linehaul-priority.service';
import { debug } from 'util';
@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})

export class GroupsComponent implements OnInit, OnDestroy {
  @Input() linehaulPrioritymodel: LinehaulPriorityModel;
  groupmodel: GroupModel;
  isDuplicateExists: boolean;
  groupNames: string[];
  groupMap: Map<number, string[]>;
  constructor(private readonly changeDetector: ChangeDetectorRef, private readonly router: Router,
    private readonly groupService: GroupsService, private readonly messageService: MessageService,
    private readonly formBuilder: FormBuilder, private readonly linehaulPriorityService: LinehaulPriorityService) {
    this.groupmodel = new GroupModel();
    this.isDuplicateExists = true;
    this.groupNames = [];
    this.groupMap = new Map<number, string[]>();
  }

  ngOnInit() {
    if (this.linehaulPrioritymodel.groupsFirstLoading) {
      this.getPriorityGroupList();
    } else {
      this.loadPriorityGroupList();
    }
  }

  ngOnDestroy() {
    this.groupmodel.subsrciberFlag = false;
  }
  getPriorityGroupList() {
    this.groupmodel.loading = true;
    this.groupService.getPriorityGroupList().pipe(takeWhile(() => this.groupmodel.subsrciberFlag)).
      subscribe((response: LineHaulPriorityGroups) => {
        const list: Array<LineHaulPriorityGroupsItem> = response._embedded.lineHaulPriorityGroups;
        if (!utils.isEmpty(list)) {
          list.forEach((element: LineHaulPriorityGroupsItem) => {
            this.linehaulPriorityService.setGroupValues(element);
            const groupNames = element.lineHaulPriorityGroupName.split(',');
            const groups = [];
            groupNames.forEach(name => groups.push(name.trim().toLowerCase()));
            this.linehaulPrioritymodel.groupMap.set(element.lineHaulPriorityGroupID, groups);
            this.groupmodel.tableValue.push({
              lineHaulGroupPriorityNumber: element.lineHaulGroupPriorityNumber,
              lineHaulPriorityGroupName: element.lineHaulPriorityGroupName,
              lineHaulPriorityGroupID: element.lineHaulPriorityGroupID
            });
          });
        }
        this.groupmodel.loading = false;
      }, (error: Error) => {
        this.groupmodel.loading = false;
      });
    this.changeDetector.detectChanges();
    this.linehaulPrioritymodel.groupsFirstLoading = false;
  }

  loadPriorityGroupList() {
    const dataList: LineHaulPriorityGroupsItem[] = this.linehaulPriorityService.getGroupValues();
    if (!utils.isEmpty(dataList)) {
      dataList.forEach((element: LineHaulPriorityGroupsItem) => {
        const groupNames = element.lineHaulPriorityGroupName.split(',');
        const groups = [];
        groupNames.forEach(name => groups.push(name.trim().toLowerCase()));
        this.groupmodel.tableValue.push({
          lineHaulGroupPriorityNumber: element.lineHaulGroupPriorityNumber,
          lineHaulPriorityGroupName: element.lineHaulPriorityGroupName,
          lineHaulPriorityGroupID: element.lineHaulPriorityGroupID
        });
      });
    }
    this.groupmodel.editValues = this.linehaulPrioritymodel.editedGroupValues;
    this.groupmodel.duplicateGroupIds = this.linehaulPrioritymodel.duplicateGroupIds;
  }

  onCellValueChange(rowData, rowIndex, event) {
    const splittedGroups = [];
    const data: LineHaulPriorityGroupsItem = {
      'lineHaulGroupPriorityNumber': rowData.lineHaulGroupPriorityNumber,
      'lineHaulPriorityGroupID': rowData.lineHaulPriorityGroupID,
      'lineHaulPriorityGroupName': rowData.lineHaulPriorityGroupName,
      '_links': rowData._links
    };
    this.linehaulPriorityService.changeGroupValues(data, rowData, this.linehaulPrioritymodel.groupMap);
    rowData.lineHaulPriorityGroupName.split(',').forEach(name => splittedGroups.push(name.trim().toLowerCase()));
    this.groupmodel.editedGroupIDs = utils.pull(this.groupmodel.editedGroupIDs, rowData.lineHaulPriorityGroupID);
    this.linehaulPrioritymodel.editedGroupIDs = this.groupmodel.editedGroupIDs;
    this.requestFramer(rowData);
  }

  requestFramer(rowData: any) {
    const isDuplicate = this.validateGroups(rowData);
    const isDataEdited = this.isGroupEdited(rowData);
    if (utils.isEmpty(this.groupmodel.editValues)
      && utils.isEmpty(this.groupmodel.duplicateGroupIds)
      && utils.isEmpty(this.groupmodel.editedGroupIDs)
    ) {
      this.linehaulPrioritymodel.groupEditFlag = false;
      this.linehaulPrioritymodel.groupsFirstLoading = true;
    }
    const existingGroupIndex = utils.findIndex(this.groupmodel.editValues,
      { 'lineHaulPriorityGroupID': rowData.lineHaulPriorityGroupID });

    const data = {
      lineHaulGroupPriorityNumber: rowData.lineHaulGroupPriorityNumber,
      lineHaulPriorityGroupName: rowData.lineHaulPriorityGroupName,
      lineHaulPriorityGroupID: rowData.lineHaulPriorityGroupID
    };
    if (existingGroupIndex !== -1) {
      this.groupmodel.editValues.splice(existingGroupIndex);
      this.linehaulPrioritymodel.editedGroupValues = this.groupmodel.editValues;
    }
    if (!isDuplicate && !isDataEdited) {
      this.linehaulPrioritymodel.groupEditFlag = true;
      this.linehaulPrioritymodel.groupsFirstLoading = false;
      this.groupmodel.editValues.push(data);
      this.linehaulPrioritymodel.editedGroupValues = this.groupmodel.editValues;
    }
    if (!utils.isEmpty(this.groupmodel.editValues)
      || !utils.isEmpty(this.groupmodel.duplicateGroupIds)
      || !utils.isEmpty(this.groupmodel.editedGroupIDs)
    ) {
      this.linehaulPrioritymodel.groupEditFlag = true;
    }
  }

  isGroupEdited(rowData: LineHaulPriorityGroupsItem) {
    let isEdited = false;
    const existingGroups = this.linehaulPrioritymodel.groupMap.get(rowData.lineHaulPriorityGroupID);
    const currentArraay = [];
    rowData.lineHaulPriorityGroupName.toString().split(',').forEach(name => {
      if (name.trim() !== '' || name.trim != null) {
        currentArraay.push(name.trim().toLowerCase());
      }
    });
    existingGroups.forEach(priorityGroupName => {
      if (!currentArraay.includes(priorityGroupName)) {
        isEdited = true;
      }
    });
    if (isEdited) {
      this.groupmodel.editedGroupIDs.push(rowData.lineHaulPriorityGroupID);
      this.linehaulPrioritymodel.editedGroupIDs = this.groupmodel.editedGroupIDs;
    } else {
      this.groupmodel.editedGroupIDs = utils.pull(this.groupmodel.editedGroupIDs, rowData.lineHaulPriorityGroupID);
      this.linehaulPrioritymodel.editedGroupIDs = this.groupmodel.editedGroupIDs;
    }
    if (!isEdited && existingGroups.length === currentArraay.length) {
      isEdited = true;
    }
    return isEdited;
  }

  validateGroups(rowData: LineHaulPriorityGroupsItem) {
    this.groupmodel.duplicateGroupIds = [];
    this.linehaulPrioritymodel.duplicateGroupIds = [];
    let isDuplicate = false;
    const groupIds = [];
    this.groupmodel.tableValue.forEach(groupValue => groupIds.push(groupValue.lineHaulPriorityGroupID));
    groupIds.forEach(groupId => {
      const otherGroups = this.groupmodel.tableValue.filter(groupValue => groupValue.lineHaulPriorityGroupID !== groupId);
      const currentGroup = utils.find(this.groupmodel.tableValue, { 'lineHaulPriorityGroupID': groupId });
      const splitGroups = [];
      currentGroup['lineHaulPriorityGroupName'].split(',').forEach(name => splitGroups.push(name.trim().toLowerCase()));
      if (!utils.isEmpty(this.getNewDuplicates(splitGroups)) && rowData.lineHaulPriorityGroupID === groupId) {
        isDuplicate = true;
        this.groupmodel.duplicateGroupIds.push(rowData.lineHaulPriorityGroupID);
        this.linehaulPrioritymodel.duplicateGroupIds.push(rowData.lineHaulPriorityGroupID);
      } else if (!utils.isEmpty(this.getNewDuplicates(splitGroups))) {
        this.groupmodel.duplicateGroupIds.push(groupId);
        this.linehaulPrioritymodel.duplicateGroupIds.push(groupId);
      }
      isDuplicate = this.checkDuplicate(splitGroups, otherGroups, rowData, groupId, isDuplicate);
    });
    return isDuplicate;
  }

  checkDuplicate(splitGroups: any[], otherGroups: LinehaulPriorityGroupValue[],
    rowData: LineHaulPriorityGroupsItem, groupId: any, isDuplicate: boolean) {
    let duplicateValue = isDuplicate;
    splitGroups.forEach(groupName => {
      otherGroups.forEach(otherGroup => {
        const otherSplitGroups = [];
        otherGroup.lineHaulPriorityGroupName.split(',').forEach(name => otherSplitGroups.push(name.trim().toLowerCase()));
        otherSplitGroups.forEach(otherGroupName => {
          if (otherGroupName.trim().toLowerCase() === groupName.trim().toLowerCase()) {
            if (rowData.lineHaulPriorityGroupID === groupId) {
              duplicateValue = true;
            }
            this.groupmodel.duplicateGroupIds.push(otherGroup.lineHaulPriorityGroupID);
            this.linehaulPrioritymodel.duplicateGroupIds.push(otherGroup.lineHaulPriorityGroupID);
          }
        });
      });
    });
    return duplicateValue;
  }

  getNewDuplicates(groups: string[]): string[] {
    return groups.reduce(function (accumulator, currenetElemet, index, array) {
      if (array.indexOf(currenetElemet) !== index && accumulator.indexOf(currenetElemet) < 0) {
        accumulator.push(currenetElemet);
      }
      return accumulator;
    }, []);
  }

  onClickSave() {
    this.groupmodel.loading = true;
    this.messageService.clear();
    if (utils.isEmpty(this.groupmodel.duplicateGroupIds)
      && utils.isEmpty(this.groupmodel.editedGroupIDs) && !utils.isEmpty(this.groupmodel.editValues)) {
      this.groupService.savePriorityGroupList(this.groupmodel.editValues).pipe(takeWhile(() => this.groupmodel.subsrciberFlag)).
        subscribe(() => {
          const successMessage = 'You have edited Point Type';
          this.messageService.add({ severity: 'success', summary: 'Point Type Edited', detail: successMessage });
          this.changeDetector.detectChanges();
          this.groupmodel.tableValue = [];
          this.linehaulPrioritymodel.groupMap = new Map<number, string[]>();
          this.groupmodel.editedGroupIDs = [];
          this.groupmodel.duplicateGroupIds = [];
          this.linehaulPrioritymodel.duplicateGroupIds = [];
          this.groupmodel.emptyGroupIds = [];
          this.groupmodel.editValues = [];
          this.linehaulPrioritymodel.editedGroupValues = [];
          this.getPriorityGroupList();
          this.linehaulPrioritymodel.groupsFirstLoading = true;
          this.groupmodel.loading = false;
          this.linehaulPrioritymodel.groupEditFlag = false;
        }, (error: HttpErrorResponse) => {
          this.handleError(error);
          this.groupmodel.loading = false;
          this.changeDetector.detectChanges();
        });
    } else if (!utils.isEmpty(this.groupmodel.duplicateGroupIds)) {
      const errorMessage = 'Duplicates are not allowed';
      this.messageService.add({ severity: 'error', summary: 'Please remove duplicates to proceed', detail: errorMessage });
      this.groupmodel.loading = false;
    } else if (!utils.isEmpty(this.groupmodel.editedGroupIDs)) {
      const errorMessage = 'Edit is not allowed';
      this.messageService.add({ severity: 'error', summary: 'Please add only new data', detail: errorMessage });
      this.groupmodel.loading = false;
    } else if (utils.isEmpty(this.groupmodel.editValues)) {
      const errorMessage = 'You have not made any changes to data';
      this.messageService.add({ severity: 'info', summary: 'No Changes Found', detail: errorMessage });
      this.groupmodel.loading = false;
    }
  }

  handleError(error: HttpErrorResponse) {
    if (!utils.isEmpty(error.error) && !utils.isEmpty(error.error.errors)) {
      this.messageService.clear();
      this.messageService.add({
        severity: 'error',
        summary: error.error.errors[0].errorType,
        detail: error.error.errors[0].errorMessage
      });
    }
  }
  onCancel() {
    this.linehaulPrioritymodel.routingUrl = '/settings';
    if (this.linehaulPrioritymodel.groupEditFlag) {
      this.linehaulPrioritymodel.isPopupVisible = true;
      this.groupmodel.isSaveChanges = true;
    } else {
      this.onClickYes();
    }
  }

  onClickYes() {
    this.linehaulPrioritymodel.groupEditFlag = false;
    this.linehaulPrioritymodel.isPopupVisible = false;
    this.router.navigate([this.linehaulPrioritymodel.routingUrl]);
    this.linehaulPriorityService.clearGroupValues();
    this.changeDetector.detectChanges();
  }

  onClickNo() {
    this.linehaulPrioritymodel.isPopupVisible = false;
  }
}
