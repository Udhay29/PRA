import { FormGroup } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { AgreementDetails, LineHaulSourceList, ErrorMessage, SaveResponseDto, DateRangeValues } from './create-line-haul.interface';

export class CreateLineHaulModel {
  isCancel: boolean;
  errorMsg: boolean;
  isChangesSaving: boolean;
  isDetailsSaved: boolean;
  inCorrectEffDateFormat: boolean;
  inCorrectExpDateFormat: boolean;
  inValidEffDate: boolean;
  inValidExpDate: boolean;
  isSubscribeFlag: boolean;
  laneCardFlag: boolean;
  inValidDate: boolean;
  isContinue: boolean;
  isSaveDraft: boolean;
  agreementId: number;
  effectiveDate: string;
  expirationDate: string;
  routingUrl: string;
  inlineErrormessage: Array<ErrorMessage>;
  effectiveMinDate: Date;
  expirationMaxDate: Date;
  effectiveMaxDate: Date;
  expirationMinDate: Date;
  breadCrumbList: Array<MenuItem>;
  agreementDetails: AgreementDetails;
  lineHaulSourceType: Array<LineHaulSourceList>;
  disabledEffectiveDate: Array<Date>;
  disabledExpirationDate: Array<Date>;
  lineHaulForm: FormGroup;
  sectionData: Array<SaveResponseDto>;
  confirmationFlag: boolean;
  sourceValue: string;
  dateRangeValues: DateRangeValues;


  constructor(agreementID: string) {
    this.initialValues(agreementID);
    this.isSubscribeFlag = true;
    this.isDetailsSaved = false;
    this.confirmationFlag = true;
    this.isSaveDraft = false;
    this.dateRangeValues = {
      effectiveDate: null,
      expirationDate: null
    };
  }
  initialValues(agreementID: string) {
    this.breadCrumbList = [{
      label: 'Pricing',
      routerLink: ['/dashboard']
    }, {
      label: 'Search Agreements',
      routerLink: ['/searchagreement']
    }, {
      label: 'Agreement Details',
      routerLink: ['/viewagreement'],
      queryParams: { id: agreementID }
    }, {
      label: 'Add Line Haul'
    }];
  }
}
