import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/components/common/messageservice';

import { ViewAgreementDetailsModel } from '../model/view-agreement-details.model';
import {
  CustomerAgreementNameConfigurationID,
  AgreementDetailsInterface, EditLineHaulData
} from '../../view-agreement-details/model/view-agreement-details.interface';
import { DateRangeValues } from '../line-haul/create-line-haul/model/create-line-haul.interface';
import { LineHaulDetailData } from '../line-haul/add-line-haul/additional-info/models/additional-info.interface';
import { LineHaulstatus, ReviewWizardStatus } from '../line-haul/review/model/review.interface';
export class ViewAgreementDetailsUtility {
  nameConfigurationDetails: CustomerAgreementNameConfigurationID;
  agreementDetails: AgreementDetailsInterface;
  LineHaulDetailData: LineHaulDetailData;
  editLineHaulData: EditLineHaulData;
  dateRangeValues: DateRangeValues;
  lineHaulStatus: LineHaulstatus;
  reviewCancelStatus: boolean;
  reviewwizardStatus: ReviewWizardStatus;

  constructor() {
    this.reviewCancelStatus = false;
  }
  static overflowMenuList(model: ViewAgreementDetailsModel): MenuItem[] {
    return [{
      label: 'Teams',
      command: (onclick) => {
        model.isManageTeams = true;
      }
    }, {
      label: 'Inactivate Agreement'
    }];
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
  setConfigurationID(nameConfigurationDetails: CustomerAgreementNameConfigurationID) {
    this.nameConfigurationDetails = {
      customerAgreementName: nameConfigurationDetails.customerAgreementName,
      customerLineHaulConfigurationID: nameConfigurationDetails.customerLineHaulConfigurationID
    };
  }
  getConfigurationID() {
    return this.nameConfigurationDetails;
  }
  setAgreementDetails(agreementData: AgreementDetailsInterface) {
    this.agreementDetails = agreementData;
  }
  getAgreementDetails() {
    return this.agreementDetails;
  }

  getLineHaulData() {
    return this.LineHaulDetailData;
  }

  setLineHaulData(lineHaulData: LineHaulDetailData) {
    this.LineHaulDetailData = lineHaulData;
  }

  getEditLineHaulData() {
    return this.editLineHaulData;
  }
  setEditLineHaulData(editlineHaulData: EditLineHaulData) {
    this.editLineHaulData = editlineHaulData;
  }
  setLineHaulDates(dateRangeValues: DateRangeValues) {
    this.dateRangeValues = dateRangeValues;
  }

  getLineHaulDates() {
    return this.dateRangeValues;
  }

  setlineHaulStatus(lineHaulStatus: LineHaulstatus) {
    this.lineHaulStatus = lineHaulStatus;
  }
  getlineHaulStatus() {
    return this.lineHaulStatus;
  }
  setreviewCancelStatus(reviewCancelStatus: boolean) {
    this.reviewCancelStatus = reviewCancelStatus;
  }
  getreviewCancelStatus() {
    return this.reviewCancelStatus;
  }
  setreviewwizardStatus(reviewwizardStatus: ReviewWizardStatus) {
    this.reviewwizardStatus = reviewwizardStatus;
  }
  getreviewwizardStatus() {
    return this.reviewwizardStatus;
  }
}
