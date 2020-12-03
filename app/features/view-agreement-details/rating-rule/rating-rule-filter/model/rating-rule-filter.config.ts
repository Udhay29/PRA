import { AgreementDefaultInterface, ContractInterface, SectionInterface,
    BusinessUnitnterface, ServiceOfferingsInterface, HazmatChargeRuleInterface,
    CongestionChargeInterface, FlatRateWithStopsInterface, StatusInterface} from './rating-rule-filter.interface';
export class RatingRuleFilterConfig {
    agreementDefault: AgreementDefaultInterface;
    contract: ContractInterface;
    section: SectionInterface;
    businessUnit: BusinessUnitnterface;
    serviceOfferings: ServiceOfferingsInterface;
    hazmatChargeRule: HazmatChargeRuleInterface;
    congestionCharge: CongestionChargeInterface;
    flatRateWithStops: FlatRateWithStopsInterface;
    status: StatusInterface;
    constructor() {
    }
}
