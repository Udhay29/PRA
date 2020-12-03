
import { FuelCalculationDetails, IncrementalData } from '../model/fuel-calculation-detail.interface';
export class FuelCalculationDetailModel {
    fuelProgramID: number;
    fuelCalulationDetails: FuelCalculationDetails;
    totalRecords: number;
    loading: boolean;
    chargeType: string;
    incrementalDetails: IncrementalData[];
    cols = [];
    isPageLoading: boolean;
    constructor() {
        this.initializeTableColumns();
        this.totalRecords = 0;
        this.loading = false;
        this.chargeType = '';
        this.incrementalDetails = [];
        this.isPageLoading = false;
    }

    initializeTableColumns() {
        this.cols = [
            { field: 'fuelBeginAmount', header: 'Fuel Begin' },
            { field: 'fuelEndAmount', header: 'Fuel End' },
            { field: 'fuelSurchargeAmount', header: 'Charge Amount' },
        ];
    }

}
