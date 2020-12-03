import { FormGroup } from '@angular/forms';
import { TeamsList, BillToOwnerDetails, ViewData } from './manage-teams.interface';
import { MenuItem } from 'primeng/api';

export class ManageTeamsModel {
  isPageLoading: boolean;
  isSaveChanges: boolean;
  isShowTeams: boolean;
  isSubscribe: boolean;
  isViewOwnersDetail: boolean;
  ownershipDetails: BillToOwnerDetails;
  teamsForm: FormGroup;
  teamValue: ViewData;
  teamsList: TeamsList[];
  teamSelectedValue: Array<object>;
  teamSelectedDetailList: Array<object>;
  teamSelectedDetailListCopy: Array<object>;
  teamsModifiedFalg: boolean;
  teamsTotalDtoList: Array<object>;
  billToList: any;
  constructor() {
    this.isPageLoading = true;
    this.isSaveChanges = false;
    this.billToList = [];
    this.isShowTeams = true;
    this.isSubscribe = true;
    this.teamsList = [];
    this.teamsTotalDtoList = [];
    this.isViewOwnersDetail = false;
  }
}
