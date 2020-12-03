import { MenuItem } from 'primeng/api';
import { AgreementDetails, CustomerAgreementNameConfigurationID, LineHaulstatus,
    EditLineHaulData, ReviewWizardStatus} from './review.interface';

export class ReviewModel {
    isReview: boolean;
    isLineHaulChecked: boolean;
    isCancel: boolean;
    subscribeFlag: boolean;
    isChangesSaved: boolean;
    isDeleteLineHaul: boolean;
    isLineHaulPublish: boolean;
    customerAgreementId: number;
    activeIndex: number;
    routingUrl: string;
    agreementUrl: string;
    stepsList: MenuItem[];
    lineHaulConfigurationIds: Array<number>;
    agreementDetails: AgreementDetails;
    isBackClicked: boolean;
    customerAgreementData: CustomerAgreementNameConfigurationID;
    linehaulStatus: LineHaulstatus;
    editlinehaulData: EditLineHaulData;
    reviewWizardStatus: ReviewWizardStatus;
    populateFlag: boolean;

    constructor() {
        this.isReview = true;
        this.populateFlag = true;
        this.isLineHaulChecked = false;
        this.isCancel = false;
        this.subscribeFlag = true;
        this.isDeleteLineHaul = false;
        this.activeIndex = 2;
        this.lineHaulConfigurationIds = [];
        this.stepsList = [{
            label: 'Line Haul Details'
        }, {
            label: 'Additional Information'
        }, {
            label: 'Review'
        }];
        this.isBackClicked = false;
        this.customerAgreementData = {
            'customerAgreementName': null,
            'customerLineHaulConfigurationID': null
        };
        this.linehaulStatus = {
            'isLineHaulEdit': false,
        };
        this.editlinehaulData = {
            'isEditFlag': false,
            'lineHaulDetails': null,
        };
        this.reviewWizardStatus = {
            'isLineHaulReviewed': true,
            'isAdditionalInfo': true,
            'isLaneCardInfo': true
        };
    }
}
