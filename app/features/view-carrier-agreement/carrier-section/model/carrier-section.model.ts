import { CarrierDetails } from '../create-carrier-section/model/create-carrier-section.interface';
export class CarrierSectionModel {
  agreement: CarrierDetails;
  isSplitView: boolean;

  constructor() {
    this.isSplitView = false;
  }
}
