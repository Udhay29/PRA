import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';
import { isArray } from 'util';
import { MenuItem } from 'primeng/api';

import { ManageTeamsModel } from './model/manage-teams.model';
import { ManageTeamsService } from './service/manage-teams.service';
import { ManageTeamsUtility } from './service/manage-teams.utility';
import { ManageTeamsQuery } from './query/manage-teams.query';
import { BillToOwnerDetails, RootObject, HitsItem, ResponseData, OwnershipDetails } from './model/manage-teams.interface';

@Component({
  selector: 'app-manage-teams',
  templateUrl: './manage-teams.component.html',
  styleUrls: ['./manage-teams.component.scss'],
  providers: [ManageTeamsUtility],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageTeamsComponent implements OnInit, OnDestroy {
  @Output() closeTeams: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isTeamSaved: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input()
  set ManageTeams(value) {
    this.manageTeamsModel.teamValue = value;
  }
  manageTeamsModel: ManageTeamsModel;
  constructor(private readonly formBuilder: FormBuilder, private readonly service: ManageTeamsService,
    private readonly messageService: MessageService, private readonly changeDetector: ChangeDetectorRef) {
    this.manageTeamsModel = new ManageTeamsModel();
  }
  ngOnInit() {
    this.createFormControl();
    this.getDataPopulate();
    this.getBillToList();
  }
  ngOnDestroy() {
    this.manageTeamsModel.isSubscribe = false;
  }
  createFormControl() {
    this.manageTeamsModel.teamsForm = this.formBuilder.group({
      billTo: [''],
      teams: ['']
    });
  }
  getDataPopulate() {
    const param = {
      agreementId: this.manageTeamsModel.teamValue.agreementId,
      expirationDate: new Date().toISOString().split('T')[0]
    };
    this.manageTeamsModel.isPageLoading = true;
    this.service.getTeamsData(param).pipe(takeWhile(() =>
      this.manageTeamsModel.isSubscribe)).subscribe((response: ResponseData) => {
        const taskIdList = [];
        if (response && response['_embedded'] && isArray(response['_embedded']['customerAgreementOwnerships'])) {
          utils.forEach(response['_embedded']['customerAgreementOwnerships'], (taskVal: OwnershipDetails) => {
            taskIdList.push(taskVal['taskAssignmentID']);
          });
          this.manageTeamsModel.teamsTotalDtoList = response['_embedded']['customerAgreementOwnerships'];
          ManageTeamsUtility.dataPopulate(this.service, taskIdList, this.manageTeamsModel, this.changeDetector);
        }
        this.manageTeamsModel.isPageLoading = false;
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.errorHandle(error);
      });
  }
  errorHandle(error: HttpErrorResponse) {
    this.manageTeamsModel.isPageLoading = false;
    ManageTeamsUtility.saveError(this.messageService, error);
    this.changeDetector.detectChanges();
  }
  onTeamsSave() {
    this.manageTeamsModel.isSaveChanges = false;
    const valueChanged = !utils.isEqual(this.manageTeamsModel.teamSelectedValue,
    this.manageTeamsModel.teamsForm.controls.teams.value);
    if (this.manageTeamsModel.teamsForm.dirty && valueChanged && this.manageTeamsModel.teamValue) {
      this.manageTeamsModel.isPageLoading = true;
      this.service.saveTeamsData(this.manageTeamsModel.teamSelectedDetailListCopy,
      this.manageTeamsModel.teamValue.agreementId).pipe(takeWhile(() =>
      this.manageTeamsModel.isSubscribe)).subscribe((response) => {
        this.manageTeamsModel.isPageLoading = false;
        this.manageTeamsModel.teamsModifiedFalg = false;
        this.isTeamSaved.emit(true);
        this.onTeamsCancel();
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.errorHandle(error);
      });
    } else {
      ManageTeamsUtility.checkFields(this.messageService, valueChanged);
    }
  }
  onTeamsCancel() {
    this.manageTeamsModel.isShowTeams = false;
    this.closeTeams.emit(false);
  }
  getBillToList() {
    this.service.getBillToList(this.manageTeamsModel.teamValue).pipe(takeWhile(() =>
      this.manageTeamsModel.isSubscribe)).subscribe((billToList: string[]) => {
        this.manageTeamsModel.billToList = [];
        if (!utils.isEmpty(billToList)) {
          utils.forEach(billToList, (billTo: string) => {
            this.manageTeamsModel.billToList.push({
              label: billTo, value: billTo
            });
          });
          this.manageTeamsModel.teamsForm.controls.billTo.setValue(this.manageTeamsModel.billToList[0].value);
          this.onBillToChange(this.manageTeamsModel.billToList[0]);
        }
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.manageTeamsModel.billToList = [];
        ManageTeamsUtility.toastMessage(this.messageService, 'error', error.message);
        this.changeDetector.detectChanges();
      });
  }
  onBillToChange(event: MenuItem) {
    if (!utils.isEmpty(event['value'])) {
      this.manageTeamsModel.isPageLoading = true;
      this.service.getOwnershipDetails(event['value']).pipe(takeWhile(() => this.manageTeamsModel.isSubscribe)).
      subscribe((detail: BillToOwnerDetails) => {
        if (!utils.isEmpty(detail)) {
          this.manageTeamsModel.ownershipDetails = detail;
          this.manageTeamsModel.isViewOwnersDetail = true;
        }
        this.manageTeamsModel.isPageLoading = false;
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.manageTeamsModel.isPageLoading = false;
        this.manageTeamsModel.ownershipDetails = null;
        ManageTeamsUtility.toastMessage(this.messageService, 'error', error.message);
        this.changeDetector.detectChanges();
      });
    }
  }
  onSearchTeam(event: Event) {
    const teamNameList = [];
    const query = ManageTeamsQuery.getTeamsQuery(event['query']);
    this.service.getTeams(query).pipe(takeWhile(() => this.manageTeamsModel.isSubscribe)).subscribe((data: RootObject) => {
      this.manageTeamsModel.teamsList = [];
      const effectiveDate = (this.manageTeamsModel.teamValue) ? this.manageTeamsModel.teamValue.effectiveDate : '';
      const expirationDate = (this.manageTeamsModel.teamValue) ? this.manageTeamsModel.teamValue.expirationDate : '';
      if (!utils.isEmpty(data) && !utils.isEmpty(data.hits) && !utils.isEmpty(data.hits.hits)) {
        utils.forEach(data.hits.hits, (value: HitsItem) => {
          if (!utils.isEmpty(value._source) && !utils.isEmpty(value._source.teamMemberTaskAssignmentRoleAssociationDTOs)) {
            teamNameList.push({
              teamName: value._source.teamMemberTaskAssignmentRoleAssociationDTOs[0].teamName,
              teamID: value._source.teamMemberTaskAssignmentRoleAssociationDTOs[0].teamID,
              taskAssignmentID: value._source.teamMemberTaskAssignmentRoleAssociationDTOs[0].taskAssignmentID,
              customerAgreementOwnershipID: ManageTeamsUtility.getCustomerAgreementOwnershipID(value, this.manageTeamsModel),
              effectiveDate: effectiveDate,
              expirationDate: expirationDate,
              isRemoved: false
            });
          }
        });
      }
      this.manageTeamsModel.teamsList = teamNameList;
      this.changeDetector.detectChanges();
    }, (error: Error) => {
      this.manageTeamsModel.teamsList = [];
      ManageTeamsUtility.toastMessage(this.messageService, 'error', error.message);
      this.changeDetector.detectChanges();
    });
  }
  onSearchTeamSelect(event: Event) {
    let isnewVal = true;
    utils.forEach(this.manageTeamsModel.teamSelectedDetailListCopy, (value: OwnershipDetails) => {
      if (value && (value['taskAssignmentID'] === event['taskAssignmentID'])) {
        value['isRemoved'] = false;
        isnewVal = false;
      }
    });
    if (isnewVal) {
      this.manageTeamsModel.teamsModifiedFalg = true;
      this.manageTeamsModel.teamSelectedDetailListCopy.push(event);
    }
  }
  onSearchTeamRemove(event: Event) {
    this.manageTeamsModel.teamsModifiedFalg = true;
    const filteredObject = utils.filter(this.manageTeamsModel.teamSelectedValue, ['taskAssignmentID', event['taskAssignmentID']]);
    const matchedIndex = utils.findIndex(this.manageTeamsModel.teamSelectedDetailListCopy, ['taskAssignmentID', event['taskAssignmentID']]);
    if (!utils.isEmpty(filteredObject) && matchedIndex > -1) {
      this.manageTeamsModel.teamSelectedDetailListCopy[matchedIndex]['isRemoved'] = true;
    } else if (utils.isEmpty(filteredObject) && matchedIndex > -1) {
      this.manageTeamsModel.teamSelectedDetailListCopy.splice(matchedIndex, 1);
    }
  }
  hideTeams() {
    const valueChanged = !utils.isEqual(this.manageTeamsModel.teamSelectedValue,
    this.manageTeamsModel.teamsForm.controls.teams.value);
    if (this.manageTeamsModel.teamsForm.touched && this.manageTeamsModel.teamsForm.dirty && valueChanged) {
      this.manageTeamsModel.isShowTeams = true;
      this.closeTeams.emit(true);
      this.manageTeamsModel.isSaveChanges = true;
    } else {
      this.onTeamsCancel();
    }
    this.changeDetector.detectChanges();
  }
  onDontSave() {
    this.manageTeamsModel.teamsModifiedFalg = false;
    this.manageTeamsModel.isSaveChanges = false;
    this.onTeamsCancel();
  }
}
