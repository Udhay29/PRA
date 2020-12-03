import { Injectable } from '@angular/core';
import * as utils from 'lodash';

import { HitsItem } from '../model/rating-rule-filter.interface';
import { RatingRuleFilterModel } from '../model/rating-rule-filter.model';



@Injectable({
  providedIn: 'root'
})
export class RatingRuleFilterUtilityService {
  static filterModel: RatingRuleFilterModel;
  constructor() { }
  businessUnitFramer(data) {
    let tempArray = [];
    if (data && data['_embedded']['serviceOfferingBusinessUnitTransitModeAssociations']) {
      const dataValues = data['_embedded']['serviceOfferingBusinessUnitTransitModeAssociations'];
      dataValues.forEach(element => {
        tempArray.push({
          label: element['financeBusinessUnitServiceOfferingAssociation']['financeBusinessUnitCode'],
          value: element['financeBusinessUnitServiceOfferingAssociation']['financeBusinessUnitCode']
        });
      });
    }
    tempArray = utils.uniqBy(tempArray, 'label');
    return tempArray;
  }

  serviceOfferingFramer(data) {
    let tempArray = [];
    if (data && data['_embedded']['serviceOfferingBusinessUnitTransitModeAssociations']) {
      const dataValues = data['_embedded']['serviceOfferingBusinessUnitTransitModeAssociations'];
      dataValues.forEach(element => {
        tempArray.push({
          label: `${element['financeBusinessUnitServiceOfferingAssociation']
          ['financeBusinessUnitCode']} - ${element['financeBusinessUnitServiceOfferingAssociation']['serviceOfferingCode']}` ,
          value: `${element['financeBusinessUnitServiceOfferingAssociation']
          ['financeBusinessUnitCode']} - ${element['financeBusinessUnitServiceOfferingAssociation']['serviceOfferingCode']}`
        });
      });
    }
    tempArray = utils.uniqBy(tempArray, 'label');
    return tempArray;
  }
  contractsFramer(data) {
    let contractDataArray = [];
    if (data && data['aggregations'] && (data['aggregations']['nesting']['doc_count'])) {
      utils.forEach(data['aggregations']['nesting']['by_contract']['contract']['buckets'], (contractData: HitsItem) => {
        utils.forEach(contractData['hits']['hits']['hits'], (contract) => {
          contractDataArray.push({
            label: contract['_source']['contractDisplayName'],
            value: contract['_source']['contractDisplayName']
          });
        });
      });
    }
    contractDataArray = utils.unionBy(contractDataArray, 'label');
    return contractDataArray;
  }
  sectionsFramer(data) {
    let sectionDataArray = [];
    if (data && data['aggregations'] && (data['aggregations']['nesting']['doc_count'])) {
      utils.forEach(data['aggregations']['nesting']['by_sec']['section']['buckets'], (sectionData: HitsItem[]) => {
        utils.forEach(sectionData['hits']['hits']['hits'], (section) => {
          sectionDataArray.push({
            label: section['_source']['customerAgreementContractSectionName'],
            value: section['_source']['customerAgreementContractSectionName']
          });
        });
      });
    }
    sectionDataArray = utils.unionBy(sectionDataArray, 'label');
    return sectionDataArray;
  }
}
