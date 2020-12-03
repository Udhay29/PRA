import { Injectable } from '@angular/core';
import { CargoDetailListItem } from '../models/add-cargo-interface';

@Injectable({
  providedIn: 'root'
})
export class AddCargoUtilsService {

  constructor() { }
  getESDocIDs(deletePayload: Array<CargoDetailListItem>) {
    const IdList = [];
    for (const data of deletePayload) {
      IdList.push(data['uniqueDocID']);
    }
    return IdList;
  }
  deletePayloadFramer(deletePayload: Array<CargoDetailListItem>) {
    const deleteList = [];
    for (const data of deletePayload) {
      switch (data['cargoType']) {
        case 'contract':
        case 'Contract':
          const contractObj = {};
          contractObj['cargoReleaseType'] = data['cargoType'];
          contractObj['cargoId'] = data['customerAgreementCargoIDs'][0];
          deleteList.push(contractObj);
          break;
        case 'section':
        case 'Section':
          const sectionObj = {};
          sectionObj['cargoReleaseType'] = data['cargoType'];
          sectionObj['cargoId'] = data['customerAgreementCargoIDs'][0];
          deleteList.push(sectionObj);
          break;
        case 'agreementBU':
        case 'AgreementBU':
        case 'contractBU':
        case 'ContractBU':
        case 'sectionBU':
        case 'SectionBU':
          for (const list of data['customerAgreementCargoIDs']) {
            const agreementObj = {};
            agreementObj['cargoReleaseType'] = data['cargoType'];
            agreementObj['cargoId'] = list;
            deleteList.push(agreementObj);
          }
          break;
        default:
          break;
      }
    }
    return deleteList;
  }
}
