import { FormGroup } from '@angular/forms';
import {
  DropDownInterface, ChargeCodeResponseInterface, ChargeCodeInterface,
  OperationalService, CurrencyCodeInterface, BusinessUnitInterface,
  EquipmentTypeList, EquipmentLengthDropDown, CarriersInterface, ServiceLevelAssociation
} from './optional-attributes.interface';

export class OptionalAttributesModel {
  loading: boolean;
  chargeTypes: DropDownInterface[];
  waivedFlag: boolean;
  subscriberFlag: boolean;
  optionalForm: FormGroup;
  businessUnitData: BusinessUnitInterface[];
  businessUnitFiltered: BusinessUnitInterface[];
  serviceLevel: CurrencyCodeInterface[];
  serviceLevelValues: CurrencyCodeInterface[];
  serviceLevelFiltered: CurrencyCodeInterface[];
  operationalService: CurrencyCodeInterface[];
  equipmentCategory: CurrencyCodeInterface[];
  equipmentCategoryFiltered: CurrencyCodeInterface[];
  equipmentType: EquipmentTypeList[];
  equipmentTypeFiltered: EquipmentTypeList[];
  equipmentLength: EquipmentLengthDropDown[];
  equipmentLengthFiltered: EquipmentLengthDropDown[];
  carriersList: CarriersInterface[];
  serviceLevelResponse: ServiceLevelAssociation[];
  customerName: string;
  businessUnitAdded: boolean;
  serviceLevelAdded: boolean;
  operationalServiceAdded: boolean;
  carrierSuggestions: CarriersInterface[];
  chargeType: ChargeCodeInterface[];
  chargeCodeBUCombination: ChargeCodeResponseInterface;
  chargeTypeFiltered: ChargeCodeInterface[];
  operationalArray: string[];
  equipTypeId: any;
  selectedChargeType: ChargeCodeInterface;

  constructor() {
    this.waivedFlag = true;
    this.subscriberFlag = true;
    this.businessUnitAdded = false;
    this.serviceLevelAdded = false;
    this.operationalServiceAdded = false;
    this.operationalArray = [];
    this.selectedChargeType = null;
  }
}
