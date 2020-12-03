export interface CustomerAccessorialAdditionalChargeDTOs {
    customerAccessorialAdditionalChargeId: number;
    chargeTypeId: number;
    chargeTypeName: string;
    accessorialRateTypeName: string;
    accessorialRateTypeId: number;
    rateAmount: number;
}

export interface CustomerAccessorialStairRateDTO {
    customerAccessorialStairRateId: number;
    accessorialRateTypeId: number;
    accessorialRateTypeName: string;
    accessorialRateRoundingTypeId: number;
    accessorialRateRoundingTypeName: string;
    accessorialMaximumRateApplyTypeId: number;
    accessorialMaximumRateApplyTypeName: string;
    minimumAmount: number;
    maximumAmount: number;
    customerAccessorialStairStepRateDTOs: CustomerAccessorialStairStepRateDTOs[];
}

export interface CustomerAccessorialStairStepRateDTOs {
    customerAccessorialStairStepRateId: number;
    fromRateTypeQuantity: number;
    toRateTypeQuantity: number;
    stairStepRateAmount: number;
    stepNumber: number;
}
