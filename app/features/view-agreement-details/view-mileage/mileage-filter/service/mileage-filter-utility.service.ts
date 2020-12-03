import { Injectable } from '@angular/core';
import * as utils from 'lodash';

import { HitsItem } from '../model/mileage-filter.interface';
import { MileageFilterModel } from '../model/mileage-filter.model';


@Injectable({
  providedIn: 'root'
})
export class MileageFilterUtilityService {
  static filterModel: MileageFilterModel;
  constructor() { }
  static listingFramer(fieldName, data) {
    let programNameDataArray = [];
    if (data && data['hits'] && data['hits']['hits']) {
      utils.forEach(data['hits']['hits'], (programNameData: HitsItem) => {
        programNameDataArray.push({
          label: programNameData['_source'][fieldName],
          value: programNameData['_source'][fieldName]
        });
      });
    }
    programNameDataArray = utils.unionBy(programNameDataArray, 'label');
    return programNameDataArray;
  }
  static nestedListingFramer(data, byName: string, byCode: string, fieldName: string) {
    let contractDataArray = [];
    if (data && data['aggregations'] && data['aggregations']['nesting']
      && data['aggregations']['nesting'][byCode][byName]['buckets']) {
      utils.forEach(data['aggregations']['nesting'][byCode][byName]['buckets'], (contractData: any) => {
        contractDataArray.push({
          label: contractData['displayname']['hits']['hits'][0]['_source'][fieldName],
          value: contractData['displayname']['hits']['hits'][0]['_source'][fieldName]
        });
      });
    }
    contractDataArray = utils.unionBy(contractDataArray, 'label');
    return contractDataArray;
  }
  static innerNestedListingFramer(data, byName: string, byCode: string, fieldName: string) {
    let carrierDataArray = [];
    if (data && data['aggregations'] && data['aggregations']['nesting']
      && data['aggregations']['nesting'][byCode][byName]['buckets']) {
      utils.forEach(data['aggregations']['nesting'][byCode][byName]['buckets'], (carrierData: any) => {
        carrierDataArray.push({
          label: carrierData['hits']['hits']['hits'][0]['_source'][fieldName],
          value: carrierData['hits']['hits']['hits'][0]['_source'][fieldName]
        });
      });
    }
    carrierDataArray = utils.unionBy(carrierDataArray, 'label');
    return carrierDataArray;
  }
  programNamesFramer(data) {
    return MileageFilterUtilityService.listingFramer('mileageProgramName', data);
  }
  agreementDefaultFramer(data) {
    return MileageFilterUtilityService.listingFramer('agreementDefaultIndicator', data);
  }

  contractsFramer(data) {
    return MileageFilterUtilityService.nestedListingFramer(data, 'by_BillingPartyName',
      'by_BillingPartyCode', 'customerContractDisplayName');
  }
  sectionsFramer(data) {
    return MileageFilterUtilityService.nestedListingFramer(data, 'by_BillingPartyName',
      'by_BillingPartyCode', 'customerAgreementContractSectionName');
  }
  carrierFramer(data) {
    return MileageFilterUtilityService.innerNestedListingFramer(data, 'carriercode',
      'by_carriercode', 'carrierDisplayName');
  }
  systemFramer(data) {
    return MileageFilterUtilityService.listingFramer('mileageSystemName', data);
  }
  systemVersionFramer(data) {
    return MileageFilterUtilityService.listingFramer('mileageSystemVersionName', data);
  }
  systemParametersFramer(data) {
    return MileageFilterUtilityService.innerNestedListingFramer(data, 'carriercode',
      'by_parametername', 'mileageSystemParameterName');
  }
  borderMilesParameterFramer(data) {
    return MileageFilterUtilityService.listingFramer('mileageBorderMileParameterTypeName', data);
  }
  distanceUnitFramer(data) {
    return MileageFilterUtilityService.listingFramer('unitOfDistanceMeasurementCode', data);
  }
  routeTypeFramer(data) {
    return MileageFilterUtilityService.listingFramer('mileageRouteTypeName', data);
  }
  geographyTypeFramer(data) {
    return MileageFilterUtilityService.listingFramer('geographyType', data);
  }
  calculationTypeFramer(data) {
    return MileageFilterUtilityService.listingFramer('mileageCalculationTypeName', data);
  }
  decimalPrecisionFramer(data) {
    return MileageFilterUtilityService.listingFramer('decimalPrecisionIndicator', data);
  }
  businessUnitFramer(data) {
    return MileageFilterUtilityService.innerNestedListingFramer(data, 'bu',
      'by_businessunit', 'financeBusinessUnitCode');
  }
}
