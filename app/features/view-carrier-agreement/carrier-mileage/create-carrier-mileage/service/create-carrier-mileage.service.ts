import {
  Injectable
} from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';
import {
  Observable
} from 'rxjs';
import {
  AppConfig
} from '../../../../../../config/app.config';
import {
  AgreementDetails,
  BusinessUnitServiceOffering,
  CarrierReqQuery,
  DomainAttributesType,
  MileageUnit,
  MockSectionsType,
  RootObject,
  GeographicPointType,
  LengthMeasurementCode
} from '../models/create-carrier-mileage.interface';
import {
  CreateCarrierMileageModel
} from '../models/create-carrier-mileage.model';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CreateCarrierMileageService {

  endpoints: any;
  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getMileageDomainAttributes(): Observable<DomainAttributesType> {
    const domainAttributesUrl = this.endpoints.mileage.getDomainAttributes;
    return this.http.get<DomainAttributesType>(domainAttributesUrl);
  }
  fetchAgreementDetailsBycarrierAgreementId(agreementId: number): Observable<AgreementDetails> {
    const date = moment(new Date()).format('YYYY-MM-DD');
    return this.http.get<AgreementDetails>(`${this.endpoints['viewCarrierAgreement']
      .getAgreementDetails}${agreementId}?currentDate=${date}`);
  }
  getMileageGeographyAttributes(levelType: string): Observable<GeographicPointType[]> {
    const geographyTypeUrl = `${this.endpoints.searchAgreement.getGeographyPointType}?levelTypeName=${levelType}`;
    return this.http.get<GeographicPointType[]>(geographyTypeUrl);
  }
  getBusinessUnit(): Observable<BusinessUnitServiceOffering> {
    const url = '/search/fetchBusinessUnitCode';
    const businessUnitUrl = this.endpoints.mileage.getBusinessUnitList + url;
    return this.http.get<BusinessUnitServiceOffering>(businessUnitUrl);
  }
  postMileagePreference(createRequestParam, agreementID): Observable<BusinessUnitServiceOffering> {
    const postPreferenceUrl = `${this.endpoints.mileage.saveCarrierMileagePreference}/${agreementID}/mileageprogram`;
    return this.http.post<BusinessUnitServiceOffering>(postPreferenceUrl, createRequestParam);
  }
  getAgreementDefault(agreementID: number): Observable<boolean> {
    const params = '/mileagePreferencecarrierAgreementAssociations/search/existsByAgreementID?agreementID=';
    const agreementDefaultUrl = `${this.endpoints.mileage.getAgreementDefault}${params}${agreementID}&defaultIndicator=Y`;
    return this.http.get<boolean>(agreementDefaultUrl);
  }
  getUnitOfLengthMeasurement(pricingFunctionalAreaName: string): Observable<LengthMeasurementCode[]> {
    const unitOfLengthMeasurementUrl =
      `${this.endpoints.mileage.getUnitOfLengthMeasurement}?pricingFunctionalAreaName=${pricingFunctionalAreaName}`;
    return this.http.get<LengthMeasurementCode[]>(unitOfLengthMeasurementUrl);
  }
  getCarrierSegmentTypes(): Observable<MileageUnit> {
    return this.http.get<MileageUnit>(this.endpoints['viewCarrierAgreement'].getCarrierSegmentType);
  }
}
