import { FormGroup } from '@angular/forms';
import {
  DropDownInterface, ChargeCodeResponseInterface, ChargeCodeInterface,
  OperationalService, CurrencyCodeInterface, BusinessUnitInterface, BuSoAssociation,
  EquipmentTypeList, EquipmentLengthDropDown, CarriersInterface, ServiceLevelAssociation, ContentInterface
} from './standard-optional-attributes.interface';
import {
   DocumentationLevelInterface,
 UploadedFiles
} from '../standard-documentation/create-standard-documentation/model/create-standard-documenation.interface';
export class StandardOptionalAttributesModel {
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
  chargeCodeBUCombination: ContentInterface[];
  chargeTypeFiltered: ChargeCodeInterface[];
  operationalArray: string[];
  documentTypeCompare: string;
  loadings: boolean;
  loaderOnRemove: boolean;
  attachmentTypeValue: DocumentationLevelInterface[];
  uploadedFiles: any[];
  filesList: any[];
  uploadFileCount: number;
  fileCount: number;
  fileCanBeUploaded: number;
  numberOfFilesInDragAndDrop: number;
  byteArray: Uint8Array;
  allowedAttahcmentFormat: string[];
  documentationCategoryForm: FormGroup;
  documentCategorySelect: DocumentationLevelInterface[];
  buSoBasedOnChargeType: BuSoAssociation[];
  equipTypeId: any;
  chargeTypeList: Array<number>;
  buSoListOriginal: Array<object>;

  constructor() {
    this.waivedFlag = true;
    this.subscriberFlag = true;
    this.businessUnitAdded = false;
    this.serviceLevelAdded = false;
    this.operationalServiceAdded = false;
    this.operationalArray = [];
    this.documentTypeCompare = 'Document Only';
    this.allowedAttahcmentFormat = ['xlsx', 'xls', 'doc',
      'docx', 'png', 'jpg', 'tiff', 'pdf', 'txt'];
    this.loadings = false;
    this.loaderOnRemove = false;
    this.documentCategorySelect = [
      { label: 'Text Only', value: 'Text Only' },
      { label: 'Attachments Only', value: 'Document Only' },
      { label: 'Both', value: 'Both' }
    ];
    this.uploadedFiles = [];
    this.attachmentTypeValue = [];
    this.uploadFileCount = 0;
    this.fileCanBeUploaded = 0;
    this.fileCount = 0;
    this.numberOfFilesInDragAndDrop = 0;
    this.chargeTypeList = [];
    this.buSoListOriginal = [];
  }
}
