import {
  ColumnInterface, LineHaulValues, RateValuesInterface, Stop, OriginDestinationInterface, CarrierInterface
} from './line-haul-details.interface';

export class LineHaulDetailsModel {
  cityStateText: string;
  tableColumnHeaders: ColumnInterface[];
  rateTableColumnHeaders: ColumnInterface[];
  stopTableColumnHeaders: ColumnInterface[];
  subscriberFlag: boolean;
  lineHaulValues: LineHaulValues;
  rateValues: RateValuesInterface[];
  operationalServices: string[];
  postalZip: any;
  originDestinationDetails: OriginDestinationInterface[];
  stopList: Stop[];
  carriersData: CarrierInterface[];
  stopChargeIndicator: boolean;
  countryCode: string;
  stopTypes: string[];
  stopDataList: object;
  constructor() {
    const cityState = 'City State';
    this.stopDataList = {
      'Address': [],
      'State': [],
      'zipValues': [],
      'locationValues': [],
      'Country': [],
      [cityState]: []
    };
    this.cityStateText = cityState;
    this.stopTypes = [cityState, 'Address', 'State', 'zipValues', 'locationValues', 'Country'];
    this.tableColumnHeaders = [{
      'name': 'Origin/Destination',
      'queryKey': 'origindestination'
    }, {
      'name': 'Type',
      'queryKey': 'type'
    }, {
      'name': 'Country',
      'queryKey': 'country'
    }, {
      'name': 'Point',
      'queryKey': 'point'
    }, {
      'name': 'Description',
      'queryKey': 'description'
    }, {
      'name': 'Vendor Identifier',
      'queryKey': 'vendor'
    }
    ];
    this.rateTableColumnHeaders = [{
      'name': 'Type',
      'queryKey': 'chargeUnitTypeName'
    }, {
      'name': 'Amount',
      'queryKey': 'amount'
    }, {
      'name': 'Minimum Amount',
      'queryKey': 'minimumamount'
    }, {
      'name': 'Maximum Amount',
      'queryKey': 'maximumamount'
    }, {
      'name': 'Currency',
      'queryKey': 'currencyCode'
    }
    ];
    this.stopTableColumnHeaders = [{
      'name': 'Stop',
      'queryKey': 'stop'
    }, {
      'name': 'Type',
      'queryKey': 'type'
    },
    {
      'name': 'Country',
      'queryKey': 'country'
    },
    {
      'name': 'Point',
      'queryKey': 'point'
    },
    {
      'name': 'Vendor Identifier',
      'queryKey': 'vendor'
    }];
    this.subscriberFlag = true;

  }
}
