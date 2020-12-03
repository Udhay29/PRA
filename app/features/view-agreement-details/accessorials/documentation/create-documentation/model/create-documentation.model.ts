import { FormGroup } from '@angular/forms';
import { MenuItem, Message } from 'primeng/api';
import {
  AgreementDetailsInterface, DocumentationTypeInterface, DocumentationLevelInterface,
  UploadedFiles
} from './create-documentation.interface';
import { ContractTypesItemInterface } from '../../../shared/contract-list/model/contract-list.interface';
import { SectionsGridResponseInterface } from '../../../shared/sections/model/sections-interface';

export class CreateDocumentationModel {
  inValidEffDate: boolean;
  inValidExpDate: boolean;
  inValidDate: boolean;
  loading: boolean;
  isCorrectEffDateFormat: boolean;
  isCorrectExpDateFormat: boolean;
  isSubscribeFlag: boolean;
  isShowDocumentTypePopup: boolean;
  isShowSavePopup: boolean;
  documentLevel: string;
  effectiveDate: string;
  expirationDate: string;
  effectiveMinDate: Date;
  expirationMinDate: Date;
  effectiveMaxDate: Date;
  expirationMaxDate: Date;
  disabledEffectiveDate: Date[];
  disabledExpirationDate: Date[];
  agreementDetails: AgreementDetailsInterface;
  selectedDocumentType: DocumentationTypeInterface;
  documentationType: DocumentationTypeInterface[];
  documentationLevel: DocumentationLevelInterface[];
  breadCrumbList: MenuItem[];
  documentationForm: FormGroup;
  documentCategorySelect: DocumentationLevelInterface[];
  agreementID: string;
  agreementURL: string;
  lineHaulUrl: string;
  msgs: Message[];
  documentationCancel: boolean;
  documentationLevelChange: boolean;
  documentationChange: string;
  contractChecked: boolean;
  sectionChecked: boolean;
  selectedContractValue: ContractTypesItemInterface[];
  selectedSectionValue: SectionsGridResponseInterface[];
  isPopupYesClicked: boolean;
  isDateChanged: boolean;
  agreementEffectiveDate: string;
  agreementEndDate: string;
  attachmentTypeValue: DocumentationLevelInterface[];
  uploadedFiles: any[];
  filesList: any[];
  uploadFileCount: number;
  fileCount: number;
  fileCanBeUploaded: number;
  numberOfFilesInDragAndDrop: number;
  byteArray: Uint8Array;
  allowedAttahcmentFormat: string[];
  scrollHeight: string;
  routingUrl: string;
  isChangesSaving: boolean;
  isDetailsSaved: boolean;
  documentationNavigateCancel: boolean;
  documentTypeCompare: string;
  loadings: boolean;
  loaderOnRemove: boolean;
  superUserBackDateDays: number;
  superUserFutureDateDays: number;
  attachmentTypeFiltered: DocumentationLevelInterface[];
  constructor(agreementID: string) {
    this.documentationNavigateCancel = false;
    this.isDetailsSaved = false;
    this.isPopupYesClicked = false;
    this.isShowDocumentTypePopup = false;
    this.isShowSavePopup = false;
    this.lineHaulUrl = '/viewagreement';
    this.agreementURL = '';
    this.agreementID = '';
    this.setInitialValues(agreementID);
    this.isSubscribeFlag = true;
    this.documentationType = [];
    this.msgs = [];
    this.documentationCancel = false;
    this.documentationLevelChange = false;
    this.documentationChange = '';
    this.isDateChanged = false;
    this.uploadedFiles = [];
    this.attachmentTypeValue = [];
    this.uploadFileCount = 0;
    this.fileCanBeUploaded = 0;
    this.fileCount = 0;
    this.numberOfFilesInDragAndDrop = 0;
    this.scrollHeight = '0px';
    this.documentTypeCompare = 'Document Only';
    this.allowedAttahcmentFormat = ['xlsx', 'xls', 'doc',
      'docx', 'png', 'jpg', 'tiff', 'pdf', 'txt'];
    this.loadings = false;
    this.loaderOnRemove = false;

    this.documentationLevel = [{
      label: 'Agreement',
      value: 'Agreement'
    },
    {
      label: 'Contract',
      value: 'contract'
    },
    {
      label: 'Section',
      value: 'section'
    }];
    this.documentCategorySelect = [
      { label: 'Text Only', value: 'Text Only' },
      { label: 'Attachments Only', value: 'Document Only' },
      { label: 'Both', value: 'Both' }
    ];
  }
  setInitialValues(agreementID: string) {
    this.breadCrumbList = [{
      label: 'Pricing',
      routerLink: ['/dashboard']
    }, {
      label: 'Search Agreements',
      routerLink: ['/searchagreement']
    }, {
      label: 'Agreement Details',
      routerLink: ['/viewagreement'],
      queryParams: { id: agreementID }
    }, {
      label: 'Create Documentation'
    }];
  }
}
