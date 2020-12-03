import { MenuItem } from 'primeng/api';
import { SaveResponseDto } from './../../create-line-haul/model/create-line-haul.interface';
import { CustomerAgreementNameConfigurationID,
  EditLineHaulData } from '../../../../view-agreement-details/model/view-agreement-details.interface';
import { ContractInterface } from '../overview/model/overview.interface';
import {LineHaulValues} from '../../additional-information/line-haul-overview/model/line-haul-overview.interface';
import {LineHaulstatus, ReviewWizardStatus} from '../../review/model/review.interface';

export class AddLineHaulModel {
  stepsList: MenuItem[];
  activeIndex: number;
  isCancel: boolean;
  subscribeFlag: boolean;
  isBack: boolean;
  isSaveDraft: boolean;
  isLineHaulContinue: boolean;
  loading: boolean;
  sectionValues: Array<SaveResponseDto>;
  typeId: object;
  lineHaulIds: Array<number>;
  nameConfigurationDetails: CustomerAgreementNameConfigurationID;
  viewAgreementURL: string;
  selectedSection: ContractInterface;
  setEditLineHaulData: LineHaulValues;
  setEditSectionData: EditLineHaulData;
  isLaneCardBackClicked: boolean;
  isLaneCardContinueClicked: boolean;
  linehaulStatus: LineHaulstatus;
  reviewWizardStatus: ReviewWizardStatus;

  constructor() {
    this.viewAgreementURL = '/viewagreement';
    this.activeIndex = 0;
    this.subscribeFlag = true;
    this.isSaveDraft = false;
    this.loading = false;
    this.stepsList = [{
      label: 'Line Haul Details',
      disabled: false
    }, {
      label: 'Additional Information',
      disabled: true
    }, {
      label: 'Review',
      disabled : true
    }];
    this.isLaneCardBackClicked = false;
   this.setEditSectionData = {
     'isEditFlag': false,
     'lineHaulDetails': null
   };
   this.linehaulStatus = {
     'isLineHaulEdit': false,
   };
   this.isLaneCardContinueClicked = false;
   this.reviewWizardStatus = {
     'isAdditionalInfo': true,
     'isLineHaulReviewed': true,
     'isLaneCardInfo': true
   };
  }
}
