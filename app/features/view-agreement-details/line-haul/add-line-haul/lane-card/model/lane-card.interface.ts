export interface ListItemInterface {
  value: number;
  label: string;
}
export interface AddressValuesInterface {
  value: number;
  label: string;
  dtoValues: Array<object>;
}
export interface CountryDataInterface {
  value: string;
  label: string;
}
export interface CountryInterface {
  countryCode: string;
  countryName: string;
}
export interface HitsInterface {
  total: number;
  max_score: number;
  hits: HitsItem[];
}
export interface HitsItem {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: Array<object>;
}
export interface GeographicPointType {
  geographicPointTypeID: number;
  geographicPointTypeName: string;
}
