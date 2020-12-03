import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConfig } from '../../../../../config/app.config';
import {
  AgreementDetails, BusinessUnitServiceOffering, CarrierReqQuery, CustomerAgreementContractsDetails, DomainAttributesType, MileageUnit,
  MockSectionsType, RootObject, CustomerAgreementContracts, CustomerAgreementContractSections, GeographicPointType, LengthMeasurementCode
} from '../models/create-mileage.interface';
import { CreateMileageModel } from '../models/create-mileage.model';

@Injectable({
  providedIn: 'root'
})
export class CreateMileageService {
  endpoints: any;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getMileageDomainAttributes(): Observable<DomainAttributesType> {
    const domainAttributesUrl = this.endpoints.mileage.getDomainAttributes;
    return this.http.get<DomainAttributesType>(domainAttributesUrl);
  }
  fetchAgreementDetailsByCustomerAgreementId(agreementID: number): Observable<AgreementDetails> {
    const agreementDetailUrl = `${this.endpoints.mileage.getAgreementDetailsByCustomerAgreementId}/${agreementID}`;
    return this.http.get<AgreementDetails>(agreementDetailUrl);
  }
  getContractsByAgreementId(createMileageModel: CreateMileageModel): Observable<CustomerAgreementContracts[]> {
    const params = `contracts?effectiveDate=${createMileageModel.effectiveDate}&expirationDate=${createMileageModel.expirationDate}`;
    const agreementID = createMileageModel.customerAgreement.customerAgreementID;
    const contractListUrl = `${this.endpoints.mileage.getContractsList}/${agreementID}/${params}`;
    return this.http.get<CustomerAgreementContracts[]>(contractListUrl);
  }
  getCarriers(reqParam: CarrierReqQuery): Observable<RootObject> {
    const carrierDetailsUrl = this.endpoints.mileage.getCarrierList;
    return this.http.post<RootObject>(carrierDetailsUrl, reqParam);
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
    const postPreferenceUrl = `${this.endpoints.mileage.saveMileagePreference}/${agreementID}/mileagepreferences`;
    return this.http.post<BusinessUnitServiceOffering>(postPreferenceUrl, createRequestParam);
  }
  getSectionsData(createMileageModel: CreateMileageModel): Observable<CustomerAgreementContractSections[]> {
    const params = `sections?effectiveDate=${createMileageModel.effectiveDate}&expirationDate=${createMileageModel.expirationDate}`;
    const sectionsUrl = `${this.endpoints.mileage.getSectionData}/${createMileageModel.customerAgreement.customerAgreementID}/${params}`;
    return this.http.get<CustomerAgreementContractSections[]>(sectionsUrl);
  }
  getSectionsSearchResult(createMileageModel: CreateMileageModel, searchText: String): Observable<CustomerAgreementContractSections[]> {
    const params = `sections?effectiveDate=${createMileageModel.effectiveDate}&expirationDate=${createMileageModel.expirationDate}`;
    const searchURL = `${params}&searchText=${searchText}`;
    const sectionsUrl = `${this.endpoints.mileage.getSectionData}/${createMileageModel.customerAgreement.customerAgreementID}/${searchURL}`;
    return this.http.get<CustomerAgreementContractSections[]>(sectionsUrl);
  }
  getAgreementDefault(agreementID: number): Observable<boolean> {
    const params = '/customerMileageProgramVersions/search/existsByAgreementID?agreementID=';
    const agreementDefaultUrl = `${this.endpoints.mileage.getAgreementDefault}${params}${agreementID}&agreementDefaultIndicator=Y`;
    return this.http.get<boolean>(agreementDefaultUrl);
  }
  getUnitOfLengthMeasurement(pricingFunctionalAreaName:  string):  Observable<LengthMeasurementCode[]> {
    const  unitOfLengthMeasurementUrl  =
    `${this.endpoints.mileage.getUnitOfLengthMeasurement}?pricingFunctionalAreaName=${pricingFunctionalAreaName}`;
    return  this.http.get<LengthMeasurementCode[]>(unitOfLengthMeasurementUrl);
  }
  editMileageService(editReqParam, agreementID, mileageID, versionID) {
    const editMileageUrl = `${this.endpoints.mileage.saveMileagePreference}/${
      agreementID}/mileageprogram/${mileageID}?versionID=${versionID}`;
    return this.http.put<BusinessUnitServiceOffering>(editMileageUrl, editReqParam);
  }
}
