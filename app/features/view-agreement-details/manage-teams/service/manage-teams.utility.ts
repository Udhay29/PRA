import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as utils from 'lodash';
import { takeWhile } from 'rxjs/operators';
import { MessageService } from 'primeng/components/common/messageservice';

import { ManageTeamsQuery } from '../query/manage-teams.query';
import { ManageTeamsModel } from '../model/manage-teams.model';
import { ManageTeamsService } from '../service/manage-teams.service';
import { HitsItem, RootObject } from '../model/manage-teams.interface';
import { isArray } from 'util';

@Injectable({
  providedIn: 'root'
})
export class ManageTeamsUtility {
  constructor() {}
  static saveError(service: MessageService, error: HttpErrorResponse) {
    service.clear();
    if (error && isArray(error.error.errors)) {
      service.add({
        severity: 'error',
        summary: error.error.errors[0].errorType,
        detail: error.error.errors[0].errorMessage
      });
    }
  }
  static dataPopulate(service: ManageTeamsService, taskIdList: Array<number>, manageTeamsModel: ManageTeamsModel,
     changeDetector: ChangeDetectorRef) {
    manageTeamsModel.isPageLoading = true;
    service.getElasticResponse(ManageTeamsQuery.getTaskIdQuery(taskIdList)).pipe(takeWhile(() =>
    manageTeamsModel.isSubscribe)).subscribe((esResponse: RootObject) => {
      if (esResponse && esResponse['hits'] && isArray(esResponse['hits']['hits'])) {
        manageTeamsModel.teamSelectedValue = [];
        manageTeamsModel.teamSelectedDetailList = [];
        this.nestedFramming(esResponse['hits']['hits'], manageTeamsModel);
        manageTeamsModel.teamSelectedDetailListCopy = JSON.parse(JSON.stringify(manageTeamsModel.teamSelectedValue));
        manageTeamsModel.teamsForm.controls.teams.setValue(manageTeamsModel.teamSelectedValue);
        manageTeamsModel.isPageLoading = false;
        changeDetector.detectChanges();
      }
    }, (error: Error) => {
      manageTeamsModel.isPageLoading = false;
      changeDetector.detectChanges();
    });
  }
  static nestedFramming(responseList: HitsItem[], manageTeamsModel: ManageTeamsModel) {
    utils.forEach(responseList, (taskVal: HitsItem) => {
      if (taskVal && taskVal['_source'] && taskVal['_source']['teamMemberTaskAssignmentRoleAssociationDTOs'] &&
        taskVal['_source']['teamMemberTaskAssignmentRoleAssociationDTOs'][0]) {
        const teamrepVal = taskVal['_source']['teamMemberTaskAssignmentRoleAssociationDTOs'][0];
        manageTeamsModel.teamSelectedValue.push({
          teamName: teamrepVal['teamName'],
          teamID: teamrepVal['teamID'],
          taskAssignmentID: teamrepVal['taskAssignmentID'],
          customerAgreementOwnershipID: this.getOwnerShipId(teamrepVal['taskAssignmentID'], manageTeamsModel),
          effectiveDate: (manageTeamsModel.teamValue) ? manageTeamsModel.teamValue.effectiveDate : '',
          expirationDate: (manageTeamsModel.teamValue) ? manageTeamsModel.teamValue.expirationDate : '',
          isRemoved: false
        });
        manageTeamsModel.teamSelectedDetailList.push({
          teamName: teamrepVal['teamName'],
          teamDatil: this.teamAssociationForamt(taskVal['_source']['teamMemberTaskAssignmentRoleAssociationDTOs'])
        });
      }
    });
  }
  static toastMessage(messageService: MessageService, key: string, data: string) {
    const message = {
      severity: key,
      summary: (key === 'error') ? 'Error' : 'Success',
      detail: data
    };
    messageService.clear();
    messageService.add(message);
  }
  static getOwnerShipId(taskAssignmentID: number, manageTeamsModel: ManageTeamsModel): number {
    let customerAgreementOwnershipID = null;
    utils.forEach(manageTeamsModel.teamsTotalDtoList, (taskVal: object) => {
      if (taskVal && (taskVal['taskAssignmentID'] === taskAssignmentID)) {
        customerAgreementOwnershipID = taskVal['customerAgreementOwnershipID'];
      }
    });
    return customerAgreementOwnershipID;
  }
  static teamAssociationForamt(teamAssociationList: Array<object>): Array<object> {
    utils.forEach(teamAssociationList, (taskVal: object) => {
      if (taskVal && taskVal['teamMemberName'] && taskVal['teamMemberName'].split(',')) {
        const splitVal = taskVal['teamMemberName'].split(',');
        taskVal['teamMemberName'] = splitVal[0];
        taskVal['roleTypeCode'] = splitVal[1];
      }
    });
    return teamAssociationList;
  }
  static checkFields(messageService: MessageService, valueChanged: boolean) {
    if (!valueChanged) {
      messageService.clear();
      messageService.add({
        severity: 'info',
        summary: 'No Changes Found',
        detail: 'You have not made any changes to save the data'
      });
    }
  }
  static getCustomerAgreementOwnershipID(value: HitsItem, model: ManageTeamsModel): string | null {
    const matchedObject = utils.filter(model.teamSelectedValue, ['taskAssignmentID', value._source
    .teamMemberTaskAssignmentRoleAssociationDTOs[0].taskAssignmentID]);
    if (!utils.isEmpty(matchedObject)) {
      return matchedObject[0]['customerAgreementOwnershipID'];
    } else {
      return null;
    }
  }
}
