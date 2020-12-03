import { AgreementDetails, Source } from './fuel-summary-view.interface';
export class FuelSummaryViewModel {
    summaryData: Source;
    subscribeFlag: boolean;
    agreementData: AgreementDetails;
    fuelNote: string;
    constructor() {
        this.subscribeFlag = true;
    }
}
