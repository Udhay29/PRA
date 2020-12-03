import { FormGroup } from '@angular/forms';
import { MenuItem, Message } from 'primeng/api';
import {
   DocumentationTypeInterface, DocumentationLevelInterface,
  UploadedFiles,
  GroupNameInterface
} from './create-standard-documenation.interface';

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
  selectedDocumentType: DocumentationTypeInterface;
  documentationType: DocumentationTypeInterface[];
  breadCrumbList: MenuItem[];
  documentationForm: FormGroup;
  documentationCategoryForm: FormGroup;
  documentCategorySelect: DocumentationLevelInterface[];
  agreementID: string;
  agreementURL: string;
  lineHaulUrl: string;
  msgs: Message[];
  documentationCancel: boolean;
  documentationLevelChange: boolean;
  documentationChange: string;
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
  setExpirationDate: string;
  missingInfo: string;
  superUserBackDateDays: number;
  superUserFutureDateDays: number;
  groupNameSuggestions: Array<GroupNameInterface>;
  groupNameValues: Array<GroupNameInterface>;
  attachmentTypeFiltered: DocumentationLevelInterface[];
  constructor() {
    this.documentationNavigateCancel = false;
    this.isDetailsSaved = false;
    this.isPopupYesClicked = false;
    this.isShowDocumentTypePopup = false;
    this.isShowSavePopup = false;
    this.setInitialValues();
    this.isSubscribeFlag = true;
    this.documentationType = [];
    this.groupNameSuggestions = [];
    this.groupNameValues = [];
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
    this.documentCategorySelect = [
      { label: 'Text Only', value: 'Text Only' },
      { label: 'Attachments Only', value: 'Document Only' },
      { label: 'Both', value: 'Both' }
    ];
    this.setExpirationDate = '12/31/2099';
    this.missingInfo = 'Missing Required Information';

  }
  setInitialValues() {
    this.breadCrumbList = [{
      label: 'Pricing',
      routerLink: ['/dashboard']
    }, {
      label: 'Standards',
      routerLink: ['/standard']
    }, {
      label: 'Create Standard Documentation'
    }];
  }
}
