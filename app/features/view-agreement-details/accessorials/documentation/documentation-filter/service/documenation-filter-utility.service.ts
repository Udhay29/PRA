import { Injectable } from '@angular/core';

import * as utils from 'lodash';
const contract = 'contract';
const byContractName = 'by_contractname';

@Injectable()

export class DocumenationFilterUtilityService {
  static nestedListingFramer(data, byName: string, byCode: string, fieldName: string) {
    let nestedFieldArray = [];
    if (data && data['aggregations'] && data['aggregations']['nesting']
      && data['aggregations']['nesting'][byCode][byName]['buckets']) {
      utils.forEach(data['aggregations']['nesting'][byCode][byName]['buckets'], (contractData: object) => {
        nestedFieldArray.push({
          label: contractData['hits']['hits']['hits'][0]['_source'][fieldName],
          value: contractData['hits']['hits']['hits'][0]['_source'][fieldName]
        });
      });
    }
    nestedFieldArray = utils.unionBy(nestedFieldArray, 'label');
    return nestedFieldArray;
  }
  listingFramer(data) {
    let documentTypeArray = [];
    if (data && data['hits'] && data['hits']['hits']) {
      documentTypeArray = data['hits']['hits'].map((documetType) => {
        return {
          label: documetType['_source']['accessorialDocumentType'],
          value: documetType['_source']['accessorialDocumentType']
        };
      });
    }
    documentTypeArray = utils.unionBy(documentTypeArray, 'label');
    return documentTypeArray;
  }
  chargeTypeFramer(data) {
    return DocumenationFilterUtilityService.nestedListingFramer(data,
      'carriercode', 'by_chargetype', 'chargeTypeName');
  }
  contractFramer(data) {
    return DocumenationFilterUtilityService.nestedListingFramer(data,
      contract, byContractName, 'customerAgreementContractName');
  }
  sectionFramer(data) {
    return DocumenationFilterUtilityService.nestedListingFramer(data,
      contract, byContractName, 'customerAgreementContractSectionName');
  }
  buFramer(data) {
    return DocumenationFilterUtilityService.nestedListingFramer(data,
      'BU', 'by_BU', 'businessUnitDisplayName');
  }
  carrierFramer(data) {
    return DocumenationFilterUtilityService.nestedListingFramer(data,
      contract, byContractName, 'carrierDisplayName');
  }
  billToAccountFramer(data) {
    return DocumenationFilterUtilityService.nestedListingFramer(data,
      'bill_to_acc', 'by_billtoacc', 'customerAgreementContractSectionAccountName');
  }
}
