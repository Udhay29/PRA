import { BusinessUnitFilterInterface,
   ServiceOfferingInterface, ChargeTypeFilterInterface, StatusInterface, QuantityRequiredInterface,
    UsageInterface, ApplicationLevel, RateTypeFilterInterface } from './charges-filter.interface';

export class ChargesFilterConfigModel {
  chargeType: ChargeTypeFilterInterface;
  rateType: RateTypeFilterInterface;
  businessUnit: BusinessUnitFilterInterface;
  serviceOfferings: ServiceOfferingInterface;
  status: StatusInterface;
  quantityRequired: QuantityRequiredInterface;
  usageType: UsageInterface;
  applicationLevel: ApplicationLevel;

}
