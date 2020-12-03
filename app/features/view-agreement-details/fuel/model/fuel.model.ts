import { Source, TableColumnModel, QueryMock } from './fuel.interface';
export class FuelModel {
  agreementId: number;
  isSubscribe: boolean;
  loading: boolean;
  tableSize: number;
  tableColumns: Array<object>;
  fuelList: Source[];
  isPaginatorFlag: boolean;
  isShowLoader: boolean;
  gridDataLength: number;
  pageStart: number;
  filterFlag: boolean;
  noResultFoundFlag: boolean;
  getFieldNames: object;
  getNestedRootVal: object;
  getNestedNestedRootVal: object;
  dropdownValue: TableColumnModel[];
  contractList: Array<string>;
  carrierList: Array<string>;
  busoList: Array<string>;
  sectionList: Array<string>;
  billtoList: Array<string>;
  buso: string;
  billToAccount: string;
  createdOn: string;
  updatedBy: string;
  updatedOn: string;
  createdBy: string;
  progName: string;
  fuelCalcType: string;
  fuelType: string;
  roundingDigit: string;
  chargeType: string;
  rateType: string;
  drayDiscount: string;
  calcType: string;
  calcMethod: string;
  rollup: string;
  fuelSurchargeAmount: string;
  fuelSurcharge: string;
  incCharge: string;
  ImpPrice: string;
  IncInterval: string;
  distanceBasis: string;
  fuelBasis: string;
  disFuelQuan: string;
  addonAmount: string;
  disPerHour: string;
  disRoundType: string;
  burnRate: string;
  loadUnloadHrs: string;
  serviceHrAddon: string;
  addHrDist: string;
  serviceRoundType: string;
  priceSource: string;
  priceChangeOccur: string;
  priceChangeWeek: string;
  priceChangeMonth: string;
  delayForHoliday: string;
  customFuleCalendar: string;
  useFuel: string;
  weekinAvg: string;
  monthInAvg: string;
  useDefinedReg: string;
  fuelProgram: string;
  searchFlag: boolean;
  regionList: Array<string>;
  sourceData: QueryMock;
  constructor() {
    this.isSubscribe = true;
    this.dropdownValue = [];
    this.pageStart = 0;
    this.tableSize = 25;
    this.isPaginatorFlag = true;
    this.searchFlag = false;
    this.initiateColumnName();
    this.tableColumns = [
      { name: this.progName, property: 'FuelProgramName' },
      { name: 'Agreement', property: 'AgreementName' },
      { name: 'Contract', property: 'Contract' },
      { name: 'Section', property: 'Section' },
      { name: this.buso, property: 'BusinessUnitsandServiceOffering', width: '200px',  colWidth: '210px' },
      { name: this.billToAccount, property: 'BillToAccount' },
      { name: 'Carrier', property: 'Carrier' },
      { name: 'Conditions', property: 'Conditions' },
      { name: 'Effective Date', property: 'EffectiveDate' },
      { name: 'Expiration Date', property: 'ExpirationDate' },
      { name: this.fuelCalcType, property: 'FuelCalculationDateType' },
      { name: this.fuelType, property: 'FuelType' },
      { name: this.roundingDigit, property: 'RoundingDigit' },
      { name: this.chargeType, property: 'ChargeType' },
      { name: this.rateType, property: 'RateType' },
      { name: this.drayDiscount, property: 'DrayDiscount' },
      { name: 'Currency', property: 'Currency' },
      { name: this.calcType, property: 'CalculationType' },
      { name: this.calcMethod, property: 'CalculationMethod' },
      { name: this.rollup, property: 'RollUp' },
      { name: this.fuelSurchargeAmount, property: 'FuelSurchargeAmount' },
      { name: this.fuelSurcharge, property: 'FuelSurchargeFactor' },
      { name: this.incCharge, property: 'IncrementalCharge' },
      { name: this.ImpPrice, property: 'ImplementationPrice' },
      { name: this.IncInterval, property: 'IncrementInterval' },
      { name: 'Cap', property: 'Cap' },
      { name: this.distanceBasis, property: 'DistanceBasis' },
      { name: this.fuelBasis, property: 'FuelQuantityBasis' },
      { name: this.disFuelQuan, property: 'DistancePerFuelQuantity' },
      { name: this.addonAmount, property: 'AddonAmount' },
      { name: this.disPerHour, property: 'DistancePerHour' },
      { name: this.disRoundType, property: 'DistanceRoundType' },
      { name: this.burnRate, property: 'BurnRatePerHour' },
      { name: this.loadUnloadHrs, property: 'Loading/UnloadingHour' },
      { name: this.serviceHrAddon, property: 'ServiceHourAddon' },
      { name: this.addHrDist, property: 'AddHourAfterDistance' },
      { name: this.serviceRoundType, property: 'ServiceHourRoundType' },
      { name: this.priceSource, property: 'PriceSource' },
      { name: this.priceChangeOccur, property: 'PriceChangeOccurrence' },
      { name: this.priceChangeWeek, property: 'PriceChangeDayofWeek' },
      { name: this.priceChangeMonth, property: 'PriceChangeDayofMonth' },
      { name: this.delayForHoliday, property: 'DelayforHoliday' },
      { name: this.customFuleCalendar, property: 'CustomFuelCalendar' },
      { name: this.useFuel, property: 'UseFuelPriceAsOf' },
      { name: this.weekinAvg, property: 'WeeksinAverage' },
      { name: this.monthInAvg, property: 'MonthsinAverage' },
      { name: 'Region', property: 'Region' },
      { name: this.useDefinedReg, property: 'UseDefinedRegionStates' },
      { name: 'Averaging', property: 'Averaging' },
      { name: this.updatedBy, property: 'UpdatedBy' },
      { name: this.updatedOn, property: 'UpdatedOn' },
      { name: this.createdBy, property: 'CreatedBy' },
      { name: this.createdOn, property: 'CreatedOn' }
    ];
    this.getFieldNames = {
      [this.progName]: 'FuelProgram.FuelProgramName.keyword',
      'Agreement': 'AgreementDefaultIndicator.raw',
      'Contract': 'ContractAssociations.ContractDisplayName.raw',
      'Section': 'SectionAssociations.SectionName.raw',
      [this.buso]: 'FinanceBusinessUnitServiceOfferingAssociations.FinanceBusinessUnitServiceOfferingDisplayName.keyword',
      [this.billToAccount]: 'BillToAccountAssociations.BillingPartyName.raw',
      'Carrier': 'CarrierAssociations.CarrierName.raw',
      'Conditions': 'FuelProgram.Conditions.raw',
      'Effective Date': 'EffectiveDate.keyword',
      'Expiration Date': 'ExpirationDate.keyword',
      [this.fuelCalcType]: 'FuelProgram.FuelCalculationDetails.FuelCalculationDateTypeName.raw',
      [this.fuelType]: 'FuelProgram.FuelCalculationDetails.FuelTypeName.raw',
      [this.roundingDigit]: 'FuelProgram.FuelCalculationDetails.FuelRoundingDecimalNumber.integer',
      [this.chargeType]: 'FuelProgram.FuelCalculationDetails.ChargeTypeName.raw',
      [this.rateType]: 'FuelProgram.FuelCalculationDetails.FuelRateTypeName.raw',
      [this.drayDiscount]: 'FuelProgram.FuelCalculationDetails.FuelDiscountTypeName.raw',
      'Currency': 'FuelProgram.FuelCalculationDetails.CurrencyCode.raw',
      [this.calcType]: 'FuelProgram.FuelCalculationDetails.FuelCalculationTypeName.raw',
      [this.calcMethod]: 'FuelProgram.FuelCalculationDetails.FuelCalculationMethodTypeName.raw',
      [this.rollup]: 'FuelProgram.FuelCalculationDetails.FuelRollUpIndicator.raw',
      [this.fuelSurchargeAmount]: 'FuelProgram.FuelCalculationDetails.FuelFlat.FuelSurchargeAmount.integer',
      [this.fuelSurcharge]: 'FuelProgram.FuelCalculationDetails.FuelFormula.FuelSurchargeFactorAmount.float',
      [this.incCharge]: 'FuelProgram.FuelCalculationDetails.FuelFormula.IncrementChargeAmount.float',
      [this.ImpPrice]: 'FuelProgram.FuelCalculationDetails.FuelFormula.ImplementationAmount.float',
      [this.IncInterval]: 'FuelProgram.FuelCalculationDetails.FuelFormula.IncrementIntervalAmount.float',
      'Cap': 'FuelProgram.FuelCalculationDetails.FuelFormula.CapAmount.float',
      [this.distanceBasis]: 'FuelProgram.FuelCalculationDetails.FuelQuantity.PricingUnitOfLengthMeasurementCode.raw',
      [this.fuelBasis]: 'FuelProgram.FuelCalculationDetails.FuelQuantity.PricingUnitOfVolumeMeasurementCode.raw',
      [this.disFuelQuan]: 'FuelProgram.FuelCalculationDetails.FuelQuantity.DistancePerFuelQuantity.integer',
      [this.addonAmount]: 'FuelProgram.FuelCalculationDetails.FuelQuantity.AddonAmount.float',
      [this.disPerHour]: 'FuelProgram.FuelCalculationDetails.FuelReefer.DistancePerHourQuantity.keyword',
      [this.disRoundType]: 'FuelProgram.FuelCalculationDetails.FuelReefer.TravelTimeHourRoundingTypeName.raw',
      [this.burnRate]: 'FuelProgram.FuelCalculationDetails.FuelReefer.BurnRatePerHourQuantity.float',
      [this.loadUnloadHrs]: 'FuelProgram.FuelCalculationDetails.FuelReefer.LoadUnloadHourQuantity.keyword',
      [this.serviceHrAddon]: 'FuelProgram.FuelCalculationDetails.FuelReefer.ServiceHourAddonQuantity.integer',
      [this.addHrDist]: 'FuelProgram.FuelCalculationDetails.FuelReefer.ServiceHourAddonDistanceQuantity.keyword',
      [this.serviceRoundType]: 'FuelProgram.FuelCalculationDetails.FuelReefer.ServiceHourRoundingTypeName.raw',
      [this.priceSource]: 'FuelProgram.FuelPriceBasis.FuelPriceSourceTypeName.raw',
      [this.priceChangeOccur]: 'FuelProgram.FuelPriceBasis.FuelPriceChangeOccurenceTypeName.raw',
      [this.priceChangeWeek]: 'FuelProgram.FuelPriceBasis.PriceChangeWeekDayName.raw',
      [this.priceChangeMonth]: 'FuelProgram.FuelPriceBasis.PriceChangeMonthDayNumber.integer',
      [this.delayForHoliday]: 'FuelProgram.FuelPriceBasis.HolidayDelayIndicator.raw',
      [this.customFuleCalendar]: 'FuelProgram.FuelPriceBasis.CustomFuelCalendar.raw',
      [this.useFuel]: 'FuelProgram.FuelPriceBasis.FuelPriceFactorTypeName.raw',
      [this.weekinAvg]: 'FuelProgram.FuelPriceBasis.AverageWeekQuantity.integer',
      [this.monthInAvg]: 'FuelProgram.FuelPriceBasis.AverageMonthQuantity.integer',
      'Region': 'FuelProgram.FuelPriceBasis.FuelPriceRegionAssociations.DistrictName.raw',
      [this.useDefinedReg]: 'FuelProgram.FuelPriceBasis.UseDefinedRegionStates.raw',
      'Averaging': 'FuelProgram.FuelPriceBasis.AverageFuelFactorIndicator.raw',
      [this.updatedBy]: 'FuelProgram.LastUpdateProgramName.keyword',
      [this.updatedOn]: 'FuelProgram.LastUpdateDate.keyword',
      [this.createdBy]: 'FuelProgram.CreateProgramName.keyword',
      [this.createdOn]: 'FuelProgram.CreatedDate.keyword'
    };

    this.getNestedRootVal = {
      'Contract': 'ContractAssociations',
      'Section': 'SectionAssociations',
      [this.buso]: 'FinanceBusinessUnitServiceOfferingAssociations',
      [this.billToAccount]: 'BillToAccountAssociations',
      'Carrier': 'CarrierAssociations',
      [this.progName]: this.fuelProgram,
      [this.fuelCalcType]: this.fuelProgram,
      [this.fuelType]: this.fuelProgram,
      [this.roundingDigit]: this.fuelProgram,
      [this.chargeType]: this.fuelProgram,
      [this.rateType]: this.fuelProgram,
      [this.drayDiscount]: this.fuelProgram,
      'Currency': this.fuelProgram,
      [this.calcType]: this.fuelProgram,
      [this.calcMethod]: this.fuelProgram,
      [this.rollup]: this.fuelProgram,
      [this.fuelSurchargeAmount]: this.fuelProgram,
      [this.fuelSurcharge]: this.fuelProgram,
      [this.incCharge]: this.fuelProgram,
      [this.ImpPrice]: this.fuelProgram,
      [this.IncInterval]: this.fuelProgram,
      'Cap': this.fuelProgram,
      [this.distanceBasis]: this.fuelProgram,
      [this.fuelBasis]: this.fuelProgram,
      [this.disFuelQuan]: this.fuelProgram,
      [this.addonAmount]: this.fuelProgram,
      [this.disPerHour]: this.fuelProgram,
      [this.disRoundType]: this.fuelProgram,
      [this.burnRate]: this.fuelProgram,
      [this.loadUnloadHrs]: this.fuelProgram,
      [this.serviceHrAddon]: this.fuelProgram,
      [this.addHrDist]: this.fuelProgram,
      [this.serviceRoundType]: this.fuelProgram,
      [this.priceSource]: this.fuelProgram,
      [this.priceChangeOccur]: this.fuelProgram,
      [this.priceChangeWeek]: this.fuelProgram,
      [this.priceChangeMonth]: this.fuelProgram,
      [this.delayForHoliday]: this.fuelProgram,
      [this.customFuleCalendar]: this.fuelProgram,
      [this.useFuel]: this.fuelProgram,
      [this.weekinAvg]: this.fuelProgram,
      [this.monthInAvg]: this.fuelProgram,
      'Region': 'FuelProgram.FuelPriceBasis.FuelPriceRegionAssociations',
      [this.useDefinedReg]: this.fuelProgram,
      'Averaging': this.fuelProgram,
      [this.updatedBy]: this.fuelProgram,
      [this.updatedOn]: this.fuelProgram,
      [this.createdBy]: this.fuelProgram,
      [this.createdOn]: this.fuelProgram,
      'Conditions': this.fuelProgram
    };
  }
  initiateColumnName() {
    this.buso = 'Business Units and Service Offering';
    this.billToAccount = 'Bill to Account';
    this.progName = 'Program Name';
    this.fuelCalcType = 'Fuel Calculation Date Type';
    this.fuelType = 'Fuel Type';
    this.roundingDigit = 'Rounding Digit';
    this.chargeType = 'Charge Type';
    this.rateType = 'Rate Type';
    this.drayDiscount = 'Dray Discount';
    this.calcType = 'Calculation Type';
    this.calcMethod = 'Calculation Method';
    this.rollup = 'Roll Up';
    this.fuelSurchargeAmount = 'Fuel Surcharge Amount';
    this.fuelSurcharge = 'Fuel  Surcharge Factor';
    this.incCharge = 'Incremental Charge';
    this.ImpPrice = 'Implementation Price';
    this.IncInterval = 'Increment Interval';
    this.createdOn = 'Created On';
    this.updatedBy = 'Updated By';
    this.updatedOn = 'Updated On';
    this.createdBy = 'Created By';
    this.distanceBasis = 'Distance Basis';
    this.fuelBasis = 'Fuel Quantity Basis';
    this.disFuelQuan = 'Distance Per Fuel Quantity';
    this.addonAmount = 'Addon Amount';
    this.disPerHour = 'Distance Per Hour';
    this.disRoundType = 'Distance Round Type';
    this.burnRate = 'Burn Rate Per Hour';
    this.loadUnloadHrs = 'Loading/Unloading Hour';
    this.serviceHrAddon = 'Service Hour Add-on';
    this.addHrDist = 'Add Hour After Distance';
    this.serviceRoundType = 'Service Hour Round Type';
    this.priceSource = 'Price Source';
    this.priceChangeOccur = 'Price Change Occurrence';
    this.priceChangeWeek = 'Price Change Day of Week';
    this.priceChangeMonth = 'Price Change Day of Month';
    this.delayForHoliday = 'Delay for Holiday';
    this.customFuleCalendar = 'Custom Fuel Calendar';
    this.useFuel = 'Use Fuel Price As Of';
    this.weekinAvg = 'Weeks in Average';
    this.monthInAvg = 'Months in Average';
    this.useDefinedReg = 'Use Defined Region States';
    this.fuelProgram = 'FuelProgram';
  }

}
