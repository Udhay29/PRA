import { Injectable } from '@angular/core';
import * as utils from 'lodash';
import { LineHaulPriorityGroupsItem } from '../groups/model/group.interface';

@Injectable({
  providedIn: 'root'
})
export class LinehaulPriorityService {
  lineHaulPriorityGroupsItem: LineHaulPriorityGroupsItem[];
  foundFlag: boolean;

  constructor() {
    this.lineHaulPriorityGroupsItem = [];
    this.foundFlag = false;
  }

  setGroupValues(lineHaulgroupsItem: LineHaulPriorityGroupsItem) {
    this.foundFlag = false;
    if (utils.isEmpty(this.lineHaulPriorityGroupsItem)) {
      this.lineHaulPriorityGroupsItem.push(lineHaulgroupsItem);
    } else {
      this.lineHaulPriorityGroupsItem.forEach((element: LineHaulPriorityGroupsItem) => {
        if (element.lineHaulPriorityGroupID === lineHaulgroupsItem.lineHaulPriorityGroupID) {
          this.foundFlag = true;
          element.lineHaulPriorityGroupName = lineHaulgroupsItem.lineHaulPriorityGroupName;
        }
      });
      if (!this.foundFlag) {
        this.lineHaulPriorityGroupsItem.push(lineHaulgroupsItem);
      }
    }
  }

  getGroupValues() {
    return this.lineHaulPriorityGroupsItem;
  }

  changeGroupValues(lineHaulgroupsItem: LineHaulPriorityGroupsItem, rowData, groupMap: Map<number, string[]>) {
    let addedGroups = '';
    let newGroupList = '';
    const capitalList = [];
    const existingGroups = groupMap.get(rowData.lineHaulPriorityGroupID);
    const currentArraay = [];
    rowData.lineHaulPriorityGroupName.toString().split(',').forEach(name => {
      if (name.trim() !== '' || name.trim != null) {
        currentArraay.push(name.trim().toLowerCase());
      }
    });
    currentArraay.forEach(priorityGroupName => {
      if (!existingGroups.includes(priorityGroupName)) {
        addedGroups = `${addedGroups}, ${priorityGroupName}`;
      }
    });
    existingGroups.forEach((element: string) => {
      capitalList.push(element.charAt(0).toUpperCase() + element.slice(1));
    });
    newGroupList = capitalList.join(', ') + addedGroups;
    this.lineHaulPriorityGroupsItem.forEach((element: LineHaulPriorityGroupsItem) => {
      if (element.lineHaulPriorityGroupID === rowData.lineHaulPriorityGroupID) {
        element.lineHaulPriorityGroupName = newGroupList;
      }
    });

  }
  clearGroupValues() {
    this.lineHaulPriorityGroupsItem = [];
  }
}

