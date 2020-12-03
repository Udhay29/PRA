import { FormGroup } from '@angular/forms';
import { ListItemInterface, CountryDataInterface, AddressValuesInterface } from './lane-card.interface';
import { LineHaulValues } from '../../../additional-information/line-haul-overview/model/line-haul-overview.interface';
import { Message } from 'primeng/components/common/api';

export class LaneCardModel {
  laneCardForm: FormGroup;
  geographyValues: ListItemInterface[];
  subscribeFlag: boolean;
  countries: CountryDataInterface[];
  countryFiltered: CountryDataInterface[];
  type: string;
  responseData: AddressValuesInterface[];
  isCancel: boolean;
  isCountryDefault: boolean;
  isBack: boolean;
  destinationType: boolean;
  originType: boolean;
  originID: number;
  destinationID: number;
  originPoint: string;
  originPointFrom: string;
  originPointTo: string;
  destinationPoint: string;
  destinationPointFrom: string;
  destinationPointTo: string;
  geographyValuesTyped: ListItemInterface[];
  originValues: Array<object>;
  destinationValues: Array<object>;
  isOriginRangeSelected: boolean;
  isDestinationRangeSelected: boolean;
  isOriginRangeError: boolean;
  isDestinationRangeError: boolean;
  isoriginPointRangeError: boolean;
  isdestinationPointRangeError: boolean;
  isShowMultipleFieldOrigin: boolean;
  isShowMultipleFieldDestination: boolean;
  isShowAddRangePopup: boolean;
  zipRangeForm: FormGroup;
  selectedPoint: string;
  stripErrorMessage: Message[];
  isRangeError: boolean;
  isShowOriginLink: boolean;
  isShowDestinationLink: boolean;
  editLineHaulData: LineHaulValues;
  threeZipRange: string;

  constructor() {
    this.subscribeFlag = true;
    this.geographyValues = [];
    this.countries = [];
    this.responseData = [];
    this.originValues = [];
    this.destinationValues = [];
    this.isShowMultipleFieldOrigin = false;
    this.isShowMultipleFieldDestination = false;
    this.isShowAddRangePopup = false;
    this.selectedPoint = '';
    this.stripErrorMessage = [];
    this.isRangeError = false;
    this.isShowOriginLink = false;
    this.isShowDestinationLink = false;
    this.threeZipRange = '3-Zip Range';
  }
}
