import { FormGroup } from '@angular/forms';

import { PriorityList } from './additional-info.interface';
import {
    BillToCodeList, BillToDropdown, MileageAutoCompleteDropdown,
    ReqParam, WeightAutoCompleteDropdown, LineHaulDetailData
} from './additional-info.interface';
import { CustomerAgreementNameConfigurationID, EditLineHaulData} from '../../../../model/view-agreement-details.interface';
import { ReviewWizardStatus } from '../../../review/model/review.interface';
import { LineHaulValues } from '../../../additional-information/line-haul-overview/model/line-haul-overview.interface';
export class AdditionalInfoModel {
    additionalInformationForm: FormGroup;
    overrideForm: FormGroup;
    showDuplicatePopup: boolean;
    showConfirmOverridePopup: boolean;
    priorityList: PriorityList[];
    duplicateMessage: string;
    availablePriorityOrder: number;
    availableOverriddenPriorityNumber: number;
    checkBoxList: string[];
    checkBoxValue: string[];
    showCancelPopup: boolean;
    subscriberFlag: boolean;
    billToCodeList: BillToDropdown[];
    carrierList: any;
    additionalInfoReqParam: ReqParam;
    MileageList: MileageAutoCompleteDropdown[];
    mileagePreferenceList: MileageAutoCompleteDropdown[];
    billToCodes: any;
    carriers: any;
    weightUnit: WeightAutoCompleteDropdown[];
    weightUnitList: WeightAutoCompleteDropdown[];
    mileagePreferenceMinRange: number;
    mileagePreferenceMaxRange: number;
    weightMinRange: number;
    weightMaxRange: number;
    unitOfWeight: string;
    showMileageRangeFields: boolean;
    routingUrl: string;
    isDetailsSaved: boolean;
    isChangesSaving: boolean;
    filteredList = [];
    isCancelClickedonOverride: boolean;
    customerAgreementId: string;
    sectionId: string;
    lineHaulConfigurationDetails: CustomerAgreementNameConfigurationID;
    lineHaulConfigurationId: number;
    disableBackFlag: boolean;
    filterOverride: any;
    isDraft: string;
    isPageLoaded: boolean;
    maxLimit: number;
    isCancelClicked: boolean;
    mileageInputFlag: boolean;
    weightInputFlag: boolean;
    mileageInvalidFlag: boolean;
    weightInvalidFlag: boolean;
    linehaulDetailData: LineHaulDetailData;
    isbackBtnclicked: boolean;
    editLineHaulData: EditLineHaulData;
    reviewWizardStatus: ReviewWizardStatus;
    linehaulOverviewData: LineHaulValues;
    isSaveDraftClicked: boolean;
    isReviewBtnClicked: boolean;

    constructor() {
        this.isPageLoaded = false;
        this.subscriberFlag = true;
        this.disableBackFlag = true;
        this.isDraft = 'N';
        this.checkBoxList = ['Hazmat Included', 'Fuel Included', 'Auto Invoice'];
        this.checkBoxValue = [];
        this.priorityList = [];
        this.availablePriorityOrder = null;
        this.availableOverriddenPriorityNumber = null;
        this.duplicateMessage = '';
        this.billToCodeList = [];
        this.MileageList = [];
        this.mileagePreferenceList = [];
        this.billToCodes = [];
        this.carriers = [];
        this.weightUnit = [];
        this.weightUnitList = [];
        this.maxLimit = 2147483647;
        this.additionalInfoReqParam = {
            duplicateFlag: null,
            overridenPriorityNumber: null,
            existingOverriddenPriorityNumber: null,
            duplicateErrorMessage: null,
            priorityNumber: null,
            billTos: [],
            carriers: [],
            mileagePreference: null,
            unitOfWeightMeasurement: null,
            hazmatIncludedIndicator: 'N',
            fuelIncludedIndicator: 'N',
            autoInvoiceIndicator: '',
            customerLineHaulConfigurationID: null,
        };
        this.linehaulDetailData = {
            'customerAgreementID': null,
            'customerAgreementName': null,
            'customerLineHaulConfigurationID': null,
            'customerAgreementContractSectionID': null

        };
        this.isbackBtnclicked = false;

        this.editLineHaulData = {
            'isEditFlag': false,
            'lineHaulDetails': null
          };

          this.reviewWizardStatus = {
              'isAdditionalInfo': true,
              'isLineHaulReviewed': true,
              'isLaneCardInfo': true
          };
          this.isSaveDraftClicked = false;
          this.isReviewBtnClicked = false;
    }
}
