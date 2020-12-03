import { Injectable } from '@angular/core';
import * as utils from 'lodash';
import { MenuItem } from 'primeng/api';
import { ListItem, RootObject, Hit } from '../model/cargo-filter.interface';

@Injectable({
  providedIn: 'root'
})
export class CargoFilterUtility {
  constructor() { }
  static dataFramer(data: RootObject, key: string) {
    let dataArray = [];
    if (data && data['hits'] && data['hits']['hits']) {
      utils.forEach(data['hits']['hits'], (element: Hit) => {
        utils.forEach(element['_source'][key], (section) => {
          dataArray.push({
            label: element['_source'][key],
            value: element['_source'][key]
          });
        });
      });

    }
    dataArray = utils.unionBy(dataArray, 'label');
    return dataArray;
  }
  businessUnitFramer(data): ListItem[] {
    let businessUnitArray = [];
    if (data && data['_embedded']) {
      businessUnitArray = data['_embedded']['serviceOfferingBusinessUnitTransitModeAssociations']
        .map(businessValue => {
          return {
            label: businessValue['financeBusinessUnitServiceOfferingAssociation']['financeBusinessUnitCode'],
            value: businessValue['financeBusinessUnitServiceOfferingAssociation']['financeBusinessUnitCode']
          };
        });
    }
    return businessUnitArray;
  }
  sectionFramer(data): ListItem[] {
    let sectionArray = [];
    const tempArray = [];
    if (data && data['hits'] && data['hits']['hits']) {
      utils.forEach(data['hits']['hits'], (sectionData: Hit) => {
        tempArray.push(sectionData['_source']['sectionAssociation']);
      });
      utils.forEach(tempArray, (element) => {
        sectionArray.push({
          label: element['customerAgreementContractSectionName'],
          value: element['customerAgreementContractSectionID']
        });
      });
    }
    sectionArray = utils.unionBy(sectionArray, 'label');
    return sectionArray;
  }
  contractDataFramer(data): ListItem[] {
    let contractDataArray = [];
    const tempArray = [];
    if (data && data['hits'] && data['hits']['hits']) {
      utils.forEach(data['hits']['hits'], (contractData: Hit) => {
        tempArray.push(contractData['_source']['contractAssociation']);
      });
      utils.forEach(tempArray, (contract) => {
        contractDataArray.push({
          label: contract['contractDisplayName'],
          value: contract['contractDisplayName'],
        });
      });
    }
    contractDataArray = utils.unionBy(contractDataArray, 'label');
    return contractDataArray;
  }
  createdProgramFramer(data): Array<MenuItem> {
    return CargoFilterUtility.dataFramer(data, 'createProgramName');
  }
  lastUpdateProgramFramer(data): Array<MenuItem> {
    return CargoFilterUtility.dataFramer(data, 'lastUpdateProgramName');
  }
  LastUpdateUserFramer(data): Array<MenuItem> {
    return CargoFilterUtility.dataFramer(data, 'lastUpdateUserId');
  }
  createdUserFramer(data): Array<MenuItem> {
    return CargoFilterUtility.dataFramer(data, 'createUserId');
  }
}
