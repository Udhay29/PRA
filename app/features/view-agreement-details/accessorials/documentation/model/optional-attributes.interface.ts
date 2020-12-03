export interface OptionalFieldInterface {
    label: string;
    value: string;
}
    export interface FinanceBusinessUnitServiceOfferingAssociation {
        financeBusinessUnitServiceOfferingAssociationID: number;
        financeBusinessUnitCode: string;
        serviceOfferingCode: string;
    }

    export interface ChargeTypeBusinessUnitServiceOfferingAssociation {
        chargeTypeBusinessUnitServiceOfferingAssociationID: number;
        chargeTypeID?: number;
        financeBusinessUnitServiceOfferingAssociation: FinanceBusinessUnitServiceOfferingAssociation;
        financeChargeUsageTypeID: number;
        effectiveDate: string;
        expirationDate: string;
    }
