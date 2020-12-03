import { FormGroup } from '@angular/forms';
import { DropDownInterface, DropDownValues, TransitMode, SectionInterface, ServiceLevelDropDown } from './overview.interface';
import {
  BusinessUnit, SoBuAssociation
} from './../../../../../create-agreement/add-cargo/models/add-cargo-interface';
import {
  EquipmentLengthDropDown, OverriddenPriorityInterface, ContractInterface,
  BusinessUnitInterface, ServiceOfferingList
} from '../model/overview.interface';
import { SaveResponseDto } from '../../../create-line-haul/model/create-line-haul.interface';
export class OverviewModel {
  overviewForm: FormGroup;
  subscriberFlag: boolean;
  businessUnitList: BusinessUnitInterface[];
  businessUnitFiltered: BusinessUnitInterface[];
  selectedBu: string;
  serviceOfferingList: ServiceOfferingList[];
  selectedServiceOffering: string;
  serviceOfferingData: ServiceOfferingList[];
  transitMode: TransitMode;
  serviceLevelList: ServiceOfferingList[];
  serviceLevelData: ServiceOfferingList[];
  equipmentCategory: BusinessUnitInterface[];
  equipmentCategoryList: BusinessUnitInterface[];
  selectedCategory: string;
  equipmentType: BusinessUnitInterface[];
  equipmentTypeList: BusinessUnitInterface[];
  equipmentTypeAssociationId: number;
  equipmentLength: EquipmentLengthDropDown[];
  equipmentLengthList: EquipmentLengthDropDown[];
  operationalServices: BusinessUnitInterface[];
  awardStatus: SectionInterface[];
  awardStatusList: SectionInterface[];
  businessUnitServiceOffering: Array<SoBuAssociation>;
  sectionData: Array<SaveResponseDto>;
  sectionValues: SectionInterface[];
  sectionValuesList: SectionInterface[];
  overRiddenPriorityValues: OverriddenPriorityInterface[];
  overRiddenPriorityFiltered: OverriddenPriorityInterface[];
  contractName: ContractInterface;
  priorityLevelNumber: number;
  overriddenPriorityLevelNumber: number;
  serviceOfferingID: number;
  serviceLevelID: number;
  equipmentTypeCode: string;
  equipmentLengthQuantity: number;
  unitOfEquipmentLengthMeasurementCode: string;
  lineHaulAwardStatusTypeID: number;
  isEquipmentTypeRequired: boolean;
  equipmentRequirementSpecificationAssociationID: number;
  filterFlag: boolean;
  isOperationalService: boolean;
  isEditFlow: boolean;
  editEquipmentOperational: any[];
  editEquipmentType: any;
  editEquipmentLength: any;
  constructor() {
    this.subscriberFlag = true;
    this.isEditFlow = false;
    this.editEquipmentOperational = [];
    this.editEquipmentType = null;
    this.editEquipmentLength = null;
  }
}
