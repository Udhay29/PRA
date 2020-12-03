import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, RouterStateSnapshot, Router, ActivatedRouteSnapshot } from '@angular/router';
import { FormBuilder, Validators, FormArray, FormGroup, FormControl } from '@angular/forms';

import { MessageService } from 'primeng/components/common/messageservice';

import * as moment from 'moment';
import * as utils from 'lodash';
import { takeWhile } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { LocalStorageService } from './../../../../../shared/jbh-app-services/local-storage.service';
import { BroadcasterService } from './../../../../../shared/jbh-app-services/broadcaster.service';

import { DateValidation } from './../../../../../shared/jbh-app-services/date-validation';
import { CreateDocumentationModel } from './model/create-documentation.model';
import { CreateDocumentationService } from './service/create-documentation.service';
import { DocumentationDate, DocumentationTypeValues, DocumentationResponse } from './model/create-documentation.interface';
import { CreateDocumentationUtilsService } from './service/create-documentation-utils.service';
import {
  CanComponentDeactivate, UploadFileServiceData
} from '../../../accessorials/documentation/create-documentation/model/create-documentation.interface';

@Component({
  selector: 'app-create-documentation',
  templateUrl: './create-documentation.component.html',
  styleUrls: ['./create-documentation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateDocumentationComponent implements OnInit, AfterViewInit {

  createDocumentationModel: CreateDocumentationModel;
  agreementID: string;
  agreementURL: string;
  lineHaulUrl: string;
  @ViewChild('optionalFields') optionalFields: any;
  @ViewChild('contractListModel') contractListModel: any;
  @ViewChild('sectionListModel') sectionListModel: any;
  @ViewChild('billTo') billTo: any;
  @ViewChild('top') topElemRef: ElementRef;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly localStore: LocalStorageService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly messageService: MessageService,
    private readonly createDocumentationUtilsService: CreateDocumentationUtilsService,
    private readonly createDocumentationService: CreateDocumentationService,
    private readonly router: Router,
    private readonly shared: BroadcasterService) {
    this.lineHaulUrl = '/viewagreement';
    this.route.queryParams.subscribe((params: Params) => {
      this.agreementID = String(params['id']);
      this.agreementURL = `/viewagreement?id=${this.agreementID}`;
      this.createDocumentationModel = new CreateDocumentationModel(this.agreementID);
    }, (error: Error) => {
      this.toastMessage(this.messageService, 'error', 'Error', error.message);
    });
  }

  ngOnInit() {
    this.createDocumentationModel.agreementDetails = this.localStore.getAgreementDetails();
    this.createDocumentationForm();
    this.setAgreementLevelDate();
    this.setDocumentType();
    this.loadAttachmentType();
    this.createDocumentationUtilsService.setSuperUserBackDateDays(this.createDocumentationModel);
    this.createDocumentationUtilsService.setSuperUserFutureDateDays(this.createDocumentationModel);
  }
  ngAfterViewInit() {
    this.onFormValueChange();
  }
  loadAttachmentType() {
    this.createDocumentationService.getAttachmentType().subscribe((data: any) => {
      if (data) {
        const eventObj = data['_embedded']['accessorialAttachmentTypes'].map(element => {
          return {
            label: element['accessorialAttachmentTypeName'],
            value: element['accessorialAttachmentTypeName'],
            id: element['accessorialAttachmentTypeId']
          };
        });

        this.createDocumentationModel.attachmentTypeValue = utils.sortBy(eventObj, 'label');
      }
      this.changeDetector.detectChanges();
    });
  }

  createDocumentationForm() {
    this.createDocumentationModel.documentationForm = this.formBuilder.group({
      documentationType: ['', Validators.required],
      effectiveDate: ['', Validators.required],
      expirationDate: ['', Validators.required],
      documentationLevel: ['', Validators.required],
      documentCategorySelect: [],
      textName: ['', Validators.required],
      textArea: ['', Validators.required],
      attachment: new FormArray([])
    });
    this.setInitialFormValues();
  }
  setInitialFormValues() {
    this.createDocumentationModel.documentationForm.controls['documentCategorySelect'].setValue('Text Only');
    this.createDocumentationModel.documentationForm.controls['documentationLevel'].setValue('Agreement');
    this.createDocumentationModel.documentLevel = 'Agreement';
    this.createDocumentationModel.documentationChange = 'Agreement';
  }
  setAgreementLevelDate() {
    this.createDocumentationModel.loading = true;
    this.createDocumentationService.getAgreementLevelDate(this.agreementID, this.createDocumentationModel.documentLevel)
      .pipe(takeWhile(() => this.createDocumentationModel.isSubscribeFlag))
      .subscribe((documentationDate: DocumentationDate) => {
        this.createDocumentationModel.loading = false;
        this.populateAgreementLevel(documentationDate);
      }, (agreementLevelError: Error) => {
        this.createDocumentationModel.loading = false;
        this.toastMessage(this.messageService, 'error', 'Error', agreementLevelError['error']['errors'][0]['errorMessage']);
      });
  }
  populateAgreementLevel(documentationDate: DocumentationDate) {
    if (documentationDate) {
      this.createDocumentationModel.documentationForm.controls['expirationDate'].
        setValue(this.dateFormatter(documentationDate['agreementExpirationDate']));
      this.createDocumentationModel.documentationForm.controls['effectiveDate'].setValue(this.dateFormatter(new Date()));
      this.createDocumentationModel.expirationDate = this.dateFormatter(documentationDate['agreementExpirationDate']);
      this.createDocumentationModel.effectiveDate = this.dateFormatter(new Date());
      this.createDocumentationModel.agreementEffectiveDate = this.createDocumentationModel.effectiveDate;
      this.createDocumentationModel.agreementEndDate = this.createDocumentationModel.expirationDate;
      this.changeDetector.detectChanges();
    }
  }
  setDocumentType() {
    this.createDocumentationModel.loading = true;
    this.createDocumentationService.getDocumentationType().pipe(takeWhile(() => this.createDocumentationModel.isSubscribeFlag))
      .subscribe((documentationType: DocumentationTypeValues) => {
        this.populateDocumentType(documentationType);
        this.createDocumentationModel.loading = false;
      }, (documentationTypeError: Error) => {
        this.toastMessage(this.messageService, 'error', 'Error', documentationTypeError['error']['errors'][0]['errorMessage']);
        this.createDocumentationModel.loading = false;
      });
  }
  populateDocumentType(documentationType: DocumentationTypeValues) {
    if (documentationType) {
      const documentationTypes = documentationType['_embedded']['accessorialDocumentTypes'];
      const documentationTypeValues = documentationTypes.map((documentationTypeValue) => {
        return {
          label: documentationTypeValue.accessorialDocumentTypeName,
          value: documentationTypeValue.accessorialDocumentTypeId
        };
      });
      this.createDocumentationModel.documentationForm.controls['documentationType'].setValue(documentationTypeValues[0]['value']);
      this.createDocumentationModel.selectedDocumentType = documentationTypeValues[0];
      this.createDocumentationModel.documentationType = documentationTypeValues;
      this.changeDetector.detectChanges();
    }
  }
  onChangeDocumentLevel(event: Event) {
    this.createDocumentationModel.contractChecked = false;
    this.createDocumentationModel.sectionChecked = false;
    this.createDocumentationModel.isPopupYesClicked = false;
    this.createDocumentationModel.isDateChanged = false;
    const docLevelChangeVal = event['option']['value'];
    this.dateCheck();
    if (docLevelChangeVal === this.createDocumentationModel.documentationForm.controls['documentationLevel'].value) {
      return;
    }
    this.checkContractSection(docLevelChangeVal);
    this.changeDetector.detectChanges();
  }
  checkContractSection(docLevelChangeVal) {
    if (this.contractListModel) {
      this.contractListModel.dataSelected = [];
      this.contractListCheck();
    } else if (this.sectionListModel) {
      this.sectionListModel.dataSelected = [];
      this.sectionListCheck();
    }
    this.formCheck(docLevelChangeVal);
  }
  onPopupClose() {
    if (!this.createDocumentationModel.isPopupYesClicked) {
      this.onHidePop('documentationLevelChange');
    }
  }
  formCheck(docLevelChangeVal) {
    this.createDocumentationModel.documentationChange = docLevelChangeVal;
    this.createDocumentationModel.documentLevel = this.createDocumentationModel.documentationChange;
  }
  contractListCheck() {
    this.createDocumentationModel.contractChecked = false;
    if (this.createDocumentationModel.selectedContractValue &&
      this.createDocumentationModel.selectedContractValue.length) {
      this.createDocumentationModel.selectedContractValue = [];
      this.createDocumentationModel.contractChecked = true;
    }
  }
  sectionListCheck() {
    this.createDocumentationModel.sectionChecked = false;
    if (this.createDocumentationModel.selectedSectionValue &&
      this.createDocumentationModel.selectedSectionValue.length) {
        this.createDocumentationModel.selectedSectionValue = [];
      this.createDocumentationModel.sectionChecked = true;
    }
  }
  onDocumentationLevelChange() {
    this.createDocumentationModel.documentationLevelChange = false;
    this.createDocumentationModel.isPopupYesClicked = true;
    this.optionalFields['optionalAttributesModel']['optionalForm'].reset();
    this.optionalFields['optionalAttributesModel'].serviceLevelAdded = false;
    this.optionalFields['optionalAttributesModel'].businessUnitAdded = false;
    this.optionalFields['optionalAttributesModel'].operationalServiceAdded = false;
    this.createDocumentationModel.documentationForm.controls['documentCategorySelect'].setValue('Text Only');
    this.onChangedocumentCategory(this.createDocumentationModel.documentationForm.controls['documentCategorySelect'].value);
    this.createDocumentationModel.documentLevel = this.createDocumentationModel
      .documentationForm.controls['documentationLevel'].value;
    this.createDocumentationModel.documentationChange = this.createDocumentationModel.documentLevel;
    this.createDocumentationModel.contractChecked = false;
    this.createDocumentationModel.sectionChecked = false;
    this.clearFormArray();
    this.dateReset();
    this.createDocumentationModel.documentationForm.controls['textArea'].reset();
    this.createDocumentationModel.documentationForm.controls['textName'].reset();
    this.createDocumentationModel.documentationForm.controls['attachment'].reset();
    this.changeDetector.detectChanges();
  }

  clearFormArray() {
    this.createDocumentationModel.fileCount = 0;
    const attachmentControl = this.createDocumentationModel.documentationForm.controls['attachment'] as FormArray;
    while (attachmentControl.length) {
      const dataTOBeDeleted = attachmentControl['controls']
      [0]['controls']['documentId']['value'];
      const params = {
        documentId: dataTOBeDeleted,
        ecmObjectStore: 'PRICING',
        docClass: 'AGREEMENT'
      };
      attachmentControl.removeAt(0);
      this.createDocumentationService.deleteUploadedFiles(params)
        .pipe(takeWhile(() => this.createDocumentationModel.isSubscribeFlag))
        .subscribe((data: boolean) => {
          this.changeDetector.detectChanges();
        }, (error: HttpErrorResponse) => {
          this.handleError(error);
        });
    }
  }
  onChangeDocumentType(event: Event) {
    this.createDocumentationModel.isDateChanged = false;
    this.createDocumentationModel.isShowDocumentTypePopup = false;
    this.dateCheck();
    this.contractListCheck();
    this.sectionListCheck();
    this.createDocumentationModel.selectedDocumentType = event['value'];
  }
  dateCheck() {
    if (this.createDocumentationModel.agreementEffectiveDate !== this.createDocumentationModel.effectiveDate ||
      this.createDocumentationModel.agreementEndDate !== this.createDocumentationModel.expirationDate) {
      this.createDocumentationModel.isDateChanged = true;
    }
  }
  onDateSelected(selectedDate: Date, selectedType: string) {
    this.createDocumentationModel.isCorrectEffDateFormat = false;
    this.createDocumentationModel.isCorrectExpDateFormat = false;
    if (selectedType === 'effectiveDate') {
      this.validateEffectiveDate();
      this.createDocumentationModel.effectiveDate = this.dateFormatter(selectedDate);
      this.createDocumentationModel.expirationMinDate = new Date(selectedDate);
      this.createDocumentationModel.disabledExpirationDate = [new Date(selectedDate)];
      this.validateDate(this.createDocumentationModel.expirationMinDate, selectedType);
      this.setFormErrors();
      this.setValidation('expirationDate');
    } else if (selectedType === 'expirationDate') {
      this.validateEffectiveDate();
      this.createDocumentationModel.expirationDate = this.dateFormatter(selectedDate);
      this.createDocumentationModel.effectiveMaxDate = new Date(selectedDate);
      this.createDocumentationModel.disabledEffectiveDate = [new Date(selectedDate)];
      this.validateDate(this.createDocumentationModel.effectiveMaxDate, selectedType);
      this.setFormErrors();
      this.setValidation('effectiveDate');
    }
  }
  typedDateValidate(event, fieldName: string) {
    const regex = new RegExp('^(|(0[1-9])|(1[0-2]))\/((0[1-9])|(1[0-9])|(2[0-9])|(3[0-1]))\/(([0-9]{4}))$');
    switch (fieldName) {
      case 'effectiveDate':
        if (event && event.srcElement['value'] && regex.test(event['srcElement']['value'].trim())
          && this.createDocumentationModel.documentationForm.controls['effectiveDate'].value) {
          this.createDocumentationModel.isCorrectEffDateFormat = false;
          const effDate = new Date(event.srcElement['value']);
          this.createDocumentationModel.documentationForm.controls['effectiveDate'].setValue(effDate);
          this.validateDate(effDate, fieldName);
          this.onDateSelected(event.srcElement['value'], 'effectiveDate');
          this.setFormErrors();
        } else {
          this.createDocumentationModel.isCorrectEffDateFormat = true;
        }
        break;
      case 'expirationDate':
        if (event && event.srcElement['value'] && regex.test(event.srcElement['value'].trim())
          && this.createDocumentationModel.documentationForm.controls['expirationDate'].value) {
          this.createDocumentationModel.isCorrectExpDateFormat = false;
          const expDate = new Date(event.srcElement['value']);
          this.createDocumentationModel.documentationForm.controls['expirationDate'].setValue(expDate);
          this.validateDate(expDate, fieldName);
          this.onDateSelected(event.srcElement['value'], 'expirationDate');
          this.setFormErrors();
        } else {
          this.createDocumentationModel.isCorrectExpDateFormat = true;
        }
        break;
      default: break;
    }
  }
  validateDate(date, fieldName: string) {
    const agreementEffectiveDate = this.createDocumentationModel.agreementEffectiveDate;
    const agreementEndDate = this.createDocumentationModel.agreementEndDate;
    switch (fieldName) {
      case 'effectiveDate':
        if (date > new Date(agreementEndDate) ||
          date < moment(agreementEffectiveDate).subtract(this.createDocumentationModel.superUserBackDateDays, 'days') ||
          date > moment(agreementEndDate).add(this.createDocumentationModel.superUserFutureDateDays, 'days')) {
          this.createDocumentationModel.inValidEffDate = true;
          break;
        } else {
          this.createDocumentationModel.inValidEffDate = false;
          break;
        }
      case 'expirationDate':
        if (date > new Date(agreementEndDate) ||
          date <= moment(new Date()).subtract(this.createDocumentationModel.superUserBackDateDays, 'days')) {
          this.createDocumentationModel.inValidExpDate = true;
          break;
        } else {
          this.createDocumentationModel.inValidExpDate = false;
          break;
        }
    }
  }
  setValidation(fieldName: string) {
    if (!this.createDocumentationModel.documentationForm.controls[fieldName].value) {
      this.createDocumentationModel.documentationForm.controls[fieldName].setErrors({
        'required': true
      });
    }
  }
  validateEffectiveDate() {
    if (this.createDocumentationModel.documentationForm.controls['effectiveDate'].value &&
      this.createDocumentationModel.documentationForm.controls['expirationDate'].value &&
      (new Date(this.createDocumentationModel.documentationForm.controls['effectiveDate'].value) >
        new Date(this.createDocumentationModel.documentationForm.controls['expirationDate'].value))) {
      this.createDocumentationModel.inValidDate = true;
    } else {
      this.createDocumentationModel.inValidDate = false;
    }
  }
  setFormErrors() {
    const effError = (this.createDocumentationModel.inValidEffDate || this.createDocumentationModel.inValidDate);
    const expError = (this.createDocumentationModel.inValidExpDate || this.createDocumentationModel.inValidDate);
    this.createDocumentationModel.documentationForm.controls.effectiveDate.setErrors(
      DateValidation.setDateFieldError(this.createDocumentationModel.documentationForm.controls['effectiveDate'].errors,
        this.createDocumentationModel.documentationForm.controls['effectiveDate'].value,
        effError));
    this.createDocumentationModel.documentationForm.controls.expirationDate.setErrors(
      DateValidation.setDateFieldError(this.createDocumentationModel.documentationForm.controls['expirationDate'].errors,
        this.createDocumentationModel.documentationForm.controls['expirationDate'].value,
        expError));
  }
  dateFormatter(value: string | Date): string {
    return moment(value).format('MM/DD/YYYY');
  }
  onSaveDocumentation() {
    this.createDocumentationModel.documentationForm.controls.attachment['controls'].forEach(element => {
      element['controls'].attachmentType.markAsTouched();
    });
    this.onValidateForm();
  }
  checkContractValidity(parentComponent) {
    let inactiveContract;
    if (parentComponent) {
      inactiveContract = parentComponent.contractListModel.selectedContract.find(value =>
        (value['status'] === 'Inactive'));
      return inactiveContract;
    }
    return false;
  }
  checkSectionValidity(sectionComponent) {
    let inactiveSection;
    if (sectionComponent) {
      inactiveSection = sectionComponent.sectionsModel.dataSelected.find(value =>
        (value['status'] === 'Inactive'));
      return inactiveSection;
    }
    return false;
  }
  checkBillToValidity(billToComponent) {
    let inactiveBillTo;
    if (billToComponent.billTo) {
      inactiveBillTo = billToComponent.billToModel.dataSelected.find(value =>
        (value['status'] === 'Inactive'));
      return inactiveBillTo;
    }
    return false;
  }
  invalidSelections() {
    const inactiveContract = this.checkContractValidity(this.contractListModel);
    const inactiveSection = this.checkSectionValidity(this.sectionListModel);
    const inactiveBillTo = this.checkBillToValidity(this.billTo);
    if ((inactiveContract) || (inactiveSection) || (inactiveBillTo)) {
      this.toastMessage(this.messageService, 'error', 'Date Range Mismatch',
        inactiveBillTo ? 'Some of the Bill To Accounts selected are not valid for the specified date range. Please uncheck to proceed' :
          'Some of the Contracts(or Sections) selected are not valid for the specified date range. Please uncheck to proceed');
      return true;
    }
    return false;
  }
  onValidateForm() {
    const documentationLevel = this.createDocumentationModel.documentationForm.value.documentationLevel;
    const serviceLevel = this.optionalFields.optionalAttributesModel.optionalForm.controls.serviceLevel;
    if (this.createDocumentationModel.documentationForm.valid) {
      if (serviceLevel.invalid) {
        serviceLevel.markAsTouched();
        this.optionalFields.changeDetector.detectChanges();
        this.messageService.clear();
        this.messageService.add({
          severity: 'error', summary: 'Missing Required Information',
          detail: 'Provide a Service Level'
        });
        return;
      }
      const invalidSelection = this.invalidSelections();
      if (invalidSelection) {
        return;
      }
      if ((documentationLevel === 'contract' && !this.isContractSelected()) ||
        (documentationLevel === 'section' && !this.isSectionSelected())) {
        return;
      }
      this.createDocumentationModel.isShowSavePopup = true;
      this.changeDetector.detectChanges();
    } else {
      this.formFieldsTouched();
    }
  }

  isContractSelected(): boolean {
    if (this.contractListModel.contractListModel.selectedContract.length) {
      return true;
    }

    this.messageService.clear();
    this.messageService.add({
      severity: 'error', summary: 'Missing Required Information',
      detail: 'Please select a Contract'
    });
    return false;
  }

  isSectionSelected(): boolean {
    if (this.sectionListModel.sectionsModel.selectedSection.length) {
      return true;
    }

    this.messageService.clear();
    this.messageService.add({
      severity: 'error', summary: 'Missing Required Information',
      detail: 'Please select a Section'
    });
    return false;
  }
  saveDocumentation() {
    if (this.createDocumentationModel.documentationForm.controls['documentCategorySelect'].value ===
      this.createDocumentationModel.documentTypeCompare) {
      this.createDocumentationModel.documentationForm.controls['textName'].setValue(null);
      this.createDocumentationModel.documentationForm.controls['textArea'].setValue(null);
    } else if (this.createDocumentationModel.documentationForm.controls['documentCategorySelect'].value === 'Text Only') {
      this.clearFormArray();
      this.createDocumentationModel.documentationForm.controls['attachment'].reset();
    }
    const params = this.createDocumentationUtilsService.
      documentationPostFramer(this.createDocumentationModel, this.optionalFields['optionalAttributesModel'],
        this.billTo['billToModel']);
    this.createDocumentationService.postDocumentationData(params, this.agreementID)
      .pipe(takeWhile(() => this.createDocumentationModel.isSubscribeFlag))
      .subscribe((documentationDate: DocumentationResponse) => {
        this.createDocumentationModel.isDetailsSaved = true;
        this.createDocumentationModel.msgs = [];
        if (documentationDate.customerAccessorialDocumentConfigurationId !== null) {
          this.toastMessage(this.messageService, 'success', 'Documentation Saved', 'The documentation has been successfully saved.');
          this.localStore.setAccessorialTab('accessType', 'create', { id: 1, text: 'documentation' });
          this.router.navigate(['/viewagreement'], { queryParams: { id: this.agreementID } });
        }
      }, (documentationError: Error) => {
        this.accessorialDocumentationErrorScenario(documentationError);
      });
  }
  accessorialDocumentationErrorScenario(documentationError: Error) {
    if (documentationError['error'] && documentationError['error']['errors'][0] &&
      documentationError['error']['errors'][0]['errorMessage']) {
      this.createDocumentationModel.loading = false;
      this.showDuplicateRateError(documentationError);
      this.changeDetector.detectChanges();
    }
  }
  showDuplicateRateError(documentationError: Error) {
    this.messageService.clear();
    if (documentationError['error'] && documentationError['error']['errors'][0] &&
      documentationError['error']['errors'][0]['code'] === 'DUPLICATE_EXISTS') {
      this.createDocumentationModel.msgs = [];
      this.createDocumentationModel.msgs.push({
        severity: 'error', summary: 'Duplicate Documentation already exists'
      });
      this.topElemRef.nativeElement.scrollIntoView();
    } else {
      this.toastMessage(this.messageService, 'error', 'Error', documentationError['error']['errors'][0]['errorMessage']);
    }
  }
  onFormValueChange() {
    const formFields = ['effectiveDate', 'expirationDate'];
    formFields.forEach(fieldName => {
      this.createDocumentationModel.documentationForm.controls[fieldName].valueChanges.subscribe(val => {
        this.createDocumentationModel.msgs = [];
      });
    });
    this.optionalFields.optionalAttributesModel.optionalForm.valueChanges.subscribe(val => {
      this.createDocumentationModel.msgs = [];
    });
  }
  formFieldsTouched() {
    utils.forIn(this.createDocumentationModel.documentationForm.controls, (value, name: string) => {
      if (!value['value'] && !utils.isEmpty(value.errors)) {
        this.createDocumentationModel.documentationForm.controls[name].markAsTouched();
      }
    });
    this.messageService.clear();
    this.messageService.add({
      severity: 'error', summary: 'Missing Required Information',
      detail: 'Provide the required information in the highlighted fields and submit the form again'
    });
    if ((this.createDocumentationModel.documentationForm.controls['documentCategorySelect'].value ===
      this.createDocumentationModel.documentTypeCompare)
      && !this.createDocumentationModel.fileCount) {
      this.messageService.clear();
      this.messageService.add({
        severity: 'error', summary: 'Missing Required Information',
        detail: 'Please specify attachment to proceed.'
      });
    } else if (this.createDocumentationModel.documentationForm.controls['documentCategorySelect'].value === 'Both') {
      this.toastMessageForAtaachment();
    }
    this.changeDetector.detectChanges();
  }
  toastMessageForAtaachment() {
    if (!(this.createDocumentationModel.documentationForm.controls['textName'].value) ||
      !(this.createDocumentationModel.documentationForm.controls['textArea'].value) ||
      !this.createDocumentationModel.fileCount) {
      this.messageService.clear();
      this.messageService.add({
        severity: 'error', summary: 'Missing Required Information',
        detail: ' Please specify both text and attachment to proceed.'
      });
    } else {
      this.messageService.clear();
      this.messageService.add({
        severity: 'error', summary: 'Missing Required Information',
        detail: 'Provide the required information in the highlighted fields and submit the form again.'
      });
    }
  }
  toastMessage(messageService: MessageService, key: string, type: string, data: string) {
    const message = {
      severity: key,
      summary: type,
      detail: data
    };
    messageService.clear();
    messageService.add(message);
  }
  onDocumentationCancel() {
    if (this.contractListModel) {
      this.contractListCheck();
    } else if (this.sectionListModel) {
      this.sectionListCheck();
    }
    this.cancelCheck();
  }
  cancelCheck() {
    if (this.optionalFields['optionalAttributesModel']['optionalForm'].dirty ||
      this.createDocumentationModel.documentationForm.controls['textArea'].dirty ||
      this.createDocumentationModel.documentationForm.controls['textName'].dirty || this.createDocumentationModel.contractChecked
      || this.createDocumentationModel.sectionChecked || this.createDocumentationModel.fileCount
      || this.createDocumentationModel.documentationForm.dirty) {
      this.createDocumentationModel.documentationCancel = true;
    } else {
      this.onDontSave();
    }
  }
  onHidePop(keyName: string) {
    this.createDocumentationModel.isPopupYesClicked = false;
    this.createDocumentationModel[keyName] = false;
    this.createDocumentationModel.documentationForm.controls['documentationLevel']
      .setValue(this.createDocumentationModel.documentationChange);
  }
  onHideCancelPop(keyName: string) {
    this.createDocumentationModel[keyName] = false;
  }
  onDontSave() {
    this.clearFormArray();
    this.createDocumentationModel.documentationCancel = false;
    this.createDocumentationModel.isDetailsSaved = true;
    this.localStore.setAccessorialTab('accessType', 'create', { id: 1, text: 'documentation' });
    this.router.navigate(['/viewagreement'], { queryParams: { id: this.agreementID } });
  }
  getContractDetails(event) {
    this.createDocumentationModel.selectedContractValue = event;
    this.changeDetector.detectChanges();
  }
  getsectionDetails(event) {
    this.createDocumentationModel.selectedSectionValue = event;
  }
  documentTypePopupNo() {
    this.createDocumentationModel.documentationForm.controls['documentationType']
      .setValue(this.createDocumentationModel.selectedDocumentType);
    this.createDocumentationModel.isShowDocumentTypePopup = false;
  }

  documentTypePopupYes() {
    this.dateReset();
    if (this.contractListModel) {
      this.contractListModel.contractListModel.selectedContract = [];
      this.contractListModel.changeDetector.detectChanges();
    } else if (this.sectionListModel) {
      this.sectionListModel.sectionsModel.selectedSection = [];
      this.sectionListModel.changeDetector.detectChanges();
    } else if (this.billTo['billToModel']['selectedBillTo'].length) {
      this.billTo['billToModel']['selectedBillTo'] = [];
      this.billTo.changeDetector.detectChanges();
    }
    const optionalForm = this.optionalFields['optionalAttributesModel']['optionalForm'];
    this.createDocumentationModel.selectedDocumentType = this.createDocumentationModel
      .documentationForm.controls['documentationType'].value;
    this.createDocumentationModel.documentationForm.controls['documentCategorySelect'].setValue('Text Only');
    this.createDocumentationModel.documentationForm.controls['textName'].reset();
    this.createDocumentationModel.documentationForm.controls['textArea'].reset();
    this.clearFormArray();
    this.createDocumentationModel.documentationForm.controls['attachment'].reset();
    this.createDocumentationModel.documentationForm.markAsPristine();
    optionalForm.reset();
    this.createDocumentationModel.isShowDocumentTypePopup = false;
    this.changeDetector.detectChanges();
  }
  dateReset() {
    this.createDocumentationModel.documentationForm.controls['effectiveDate']
      .setValue(this.createDocumentationModel.agreementEffectiveDate);
    this.createDocumentationModel.documentationForm.controls['expirationDate'].setValue(this.createDocumentationModel.agreementEndDate);
    this.createDocumentationModel.effectiveDate = this.createDocumentationModel.agreementEffectiveDate;
    this.createDocumentationModel.expirationDate = this.createDocumentationModel.agreementEndDate;
  }
  savePopupYes() {
    this.createDocumentationModel.isShowSavePopup = false;
    this.saveDocumentation();
  }

  savePopupNo() {
    this.createDocumentationModel.isShowSavePopup = false;
  }

  canDeactivate(component: CanComponentDeactivate, route: ActivatedRouteSnapshot, state: RouterStateSnapshot,
    nextState: RouterStateSnapshot): Observable<boolean> | boolean {
    this.createDocumentationModel.routingUrl = nextState.url;
    if ((this.optionalFields['optionalAttributesModel']['optionalForm'].dirty ||
      this.createDocumentationModel['documentationForm'].dirty ||
      this.createDocumentationModel.documentationForm.controls['textArea'].dirty ||
      this.createDocumentationModel.documentationForm.controls['textName'].dirty || this.createDocumentationModel.contractChecked
      || this.createDocumentationModel.sectionChecked)
      && !this.createDocumentationModel.isDetailsSaved) {
      this.createDocumentationModel.isChangesSaving = false;
    } else {
      this.createDocumentationModel.isChangesSaving = true;
    }
    this.createDocumentationModel.documentationNavigateCancel = !this.createDocumentationModel.isChangesSaving;
    this.changeDetector.detectChanges();
    return this.createDocumentationModel.isChangesSaving;
  }
  onDontSaveNavigate() {
    this.clearFormArray();
    this.createDocumentationModel.isDetailsSaved = true;
    this.createDocumentationModel.documentationNavigateCancel = false;
    this.createDocumentationModel.isChangesSaving = true;
    if (this.createDocumentationModel.routingUrl === this.agreementURL) {
      this.router.navigate([this.lineHaulUrl], {
        queryParams:
          { id: this.agreementID }
      });
    } else {
      this.router.navigate([this.createDocumentationModel.routingUrl]);
    }
  }
  moreFileAndSize() {
    if (this.createDocumentationModel.fileCount
      + this.createDocumentationModel.numberOfFilesInDragAndDrop > 10) {
      this.toastMessage(this.messageService, 'error', 'Error', 'Exceeds More Files than Required.');
    }
  }
  onFilesUpload(event) {
    this.createDocumentationModel.numberOfFilesInDragAndDrop = event.files.length;
    this.moreFileAndSize();
    this.createDocumentationModel.uploadedFiles = [];
    Array.from(event.files).forEach((fileDetails: any) => {
      this.createDocumentationModel.uploadedFiles.push(fileDetails);
    });
    const groupped = utils.groupBy(this.createDocumentationModel.uploadedFiles, function (fileName) {
      return fileName.name.substring(0, fileName.name.lastIndexOf('.'));
    });
    const result = utils.uniq(utils.flatten(utils.filter(groupped, function (duplicateCheck) {
      return duplicateCheck.length > 1;
    })));
    const resultFiles = utils.difference(this.createDocumentationModel.uploadedFiles, result);
    if (result.length > 0) {
      this.toastMessage(this.messageService, 'error', 'Business Validation Error',
        'Document attachment must have a different file name; Please rename attachment and try again.');
    }
    resultFiles.forEach((fileDetails: any) => {
      const extension = fileDetails.name.split('.').pop();
      if (this.createDocumentationModel.allowedAttahcmentFormat.indexOf(extension.toLowerCase()) === -1 || fileDetails.size > 10485760) {
        const message = this.createDocumentationModel.allowedAttahcmentFormat.indexOf(extension.toLowerCase()) === -1 ?
          'File Type not supported.' :
          'Document exceeds max size allowed; Please attach document of a smaller size or break into multiple smaller documents.';
        this.toastMessage(this.messageService, 'error', 'Error', message);
        return;
      }
      const fileIndex =
        (this.createDocumentationModel.documentationForm.controls.attachment as FormArray)
          .controls.findIndex(attachment => {
            const attachedFileName = attachment.get('filename').value
              .substring(0, attachment.get('filename').value.lastIndexOf('.')).toLowerCase();
            const filenameToAttach = fileDetails.name
              .substring(0, fileDetails.name.lastIndexOf('.')).toLowerCase();
            return attachedFileName === filenameToAttach;
          });
      if (fileIndex !== -1) {
        this.toastMessage(this.messageService, 'error', 'Business Validation Error',
          'Document attachment must have a different file name; Please rename attachment and try again.');
        return;
      }
      if ((this.createDocumentationModel.fileCount
        + this.createDocumentationModel.numberOfFilesInDragAndDrop <= 10)
        && (fileDetails.size <= 10485760)) {
        const formData = new FormData();
        formData.append('file', event.files[0], event.files[0].name);
        this.postFileDetail(fileDetails, formData);
      }
    });
  }
  removeAttachment(attachmentPosition: number) {
    this.createDocumentationModel.loaderOnRemove = true;
    const dataTOBeDeleted = this.createDocumentationModel.documentationForm.controls.attachment['controls']
    [attachmentPosition]['controls']['documentId']['value'];
    const params = {
      documentId: dataTOBeDeleted,
      ecmObjectStore: 'PRICING',
      docClass: 'AGREEMENT'
    };
    this.createDocumentationService.deleteUploadedFiles(params)
      .pipe(takeWhile(() => this.createDocumentationModel.isSubscribeFlag))
      .subscribe((data: boolean) => {
        this.createDocumentationModel.loaderOnRemove = false;
        (this.createDocumentationModel.documentationForm.controls.attachment as FormArray).removeAt(attachmentPosition);
        this.createDocumentationModel.fileCount--;
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.createDocumentationModel.loaderOnRemove = false;
        this.handleError(error);
      });
  }
  postFileDetail(fileDetails, convertedarray): void {
    this.createDocumentationModel.loadings = true;
    const fileName = fileDetails.name.lastIndexOf('.');
    const fileTitle = fileDetails.name.substring(0, fileName);
    const params = {
      fileName: fileDetails.name,
      agreementType: this.createDocumentationModel['selectedDocumentType']['label'].toUpperCase(),
      agreementId: Number(this.agreementID),
      documentTitle: fileTitle,
      mimeType: fileDetails.name.split('.').pop(),
      byteStream: convertedarray,
      documentType: this.createDocumentationModel['selectedDocumentType']['label'].toUpperCase(),
      ecmObjectStore: 'PRICING',
      docClass: 'AGREEMENT',
      chargeCodeIds: utils.map(this.optionalFields.optionalAttributesModel.optionalForm.controls['chargeType'].value, 'value')
    };
    this.createDocumentationService.postFileDetails(convertedarray, this.agreementID, params)
      .pipe(takeWhile(() => this.createDocumentationModel.isSubscribeFlag))
      .subscribe((data: UploadFileServiceData) => {
        this.createDocumentationModel.fileCount++;
        this.createDocumentationModel.loadings = false;
        (this.createDocumentationModel.documentationForm.controls.attachment as FormArray)
          .push(this.createAttachmentItem(fileDetails.name, data.documentId));
        this.changeDetector.detectChanges();
        this.onChangedocumentCategory(this.createDocumentationModel.documentationForm.controls['documentCategorySelect'].value);
      }, (error: HttpErrorResponse) => {
        this.createDocumentationModel.loadings = false;
        this.handleDownError(error);
        this.changeDetector.detectChanges();
      });
    this.changeDetector.detectChanges();
  }

  createAttachmentItem(filename: string, documentId: string): FormGroup {
    return new FormGroup({
      attachmentType: new FormControl('', Validators.required),
      filename: new FormControl(filename),
      documentId: new FormControl(documentId),
    });
  }
  onChangedocumentCategory(selectedDocumentValue: string) {
    if (selectedDocumentValue === 'Text Only') {
      this.textOnlyRequired();
      this.attachmentOnlyRequiredRemove();
      this.removeaAttachementTypeFormcontrolValidation();
    } else if (selectedDocumentValue === this.createDocumentationModel.documentTypeCompare) {
      this.attachmentOnlyRequired();
      this.attachemntTypeFormControlRequied();
      this.textOnlyRequiredRemove();
    } else {
      this.textOnlyRequired();
      this.attachmentOnlyRequired();
      this.attachemntTypeFormControlRequied();
    }
    this.changeDetector.detectChanges();
  }
  attachemntTypeFormControlRequied() {
    utils.forIn(this.createDocumentationModel.documentationForm.controls.attachment['controls'], (value: FormControl, name: string) => {
      value['controls']['attachmentType'].setValidators([Validators.required]);
      value['controls']['attachmentType'].updateValueAndValidity();
    });
  }
  removeaAttachementTypeFormcontrolValidation() {
    utils.forIn(this.createDocumentationModel.documentationForm.controls.attachment['controls'], (value: FormControl, name: string) => {
      value['controls']['attachmentType'].setValidators(null);
      value['controls']['attachmentType'].updateValueAndValidity();
    });
  }
  textOnlyRequired() {
    this.createDocumentationModel.documentationForm.controls['textName'].setValidators([Validators.required]);
    this.createDocumentationModel.documentationForm.controls['textName'].updateValueAndValidity();
    this.createDocumentationModel.documentationForm.controls['textArea'].setValidators([Validators.required]);
    this.createDocumentationModel.documentationForm.controls['textArea'].updateValueAndValidity();
  }
  attachmentOnlyRequired() {
    this.createDocumentationModel.documentationForm.controls['attachment'].setValidators([Validators.required]);
    this.createDocumentationModel.documentationForm.controls['attachment'].updateValueAndValidity();
  }
  attachmentOnlyRequiredRemove() {
    this.createDocumentationModel.documentationForm.controls['attachment'].setValidators(null);
    this.createDocumentationModel.documentationForm.controls['attachment'].updateValueAndValidity();
  }
  textOnlyRequiredRemove() {
    this.createDocumentationModel.documentationForm.controls['textName'].setValidators(null);
    this.createDocumentationModel.documentationForm.controls['textName'].updateValueAndValidity();
    this.createDocumentationModel.documentationForm.controls['textArea'].setValidators(null);
    this.createDocumentationModel.documentationForm.controls['textArea'].updateValueAndValidity();
  }

  handleError(error: HttpErrorResponse) {
    if (!utils.isEmpty(error.error) && !utils.isEmpty(error.error.errors)) {
      this.messageService.clear();
      this.messageService.add({
        severity: 'error',
        summary: error.error.errors[0].errorType,
        detail: error.error.errors[0].errorMessage
      });
    }
  }
  handleDownError(response: HttpErrorResponse) {
    if ((response.status) && (response.error) && ((response.status === 503) || (response.status === 403))) {
      this.messageService.clear();
      const statusText = 'FileNet application is down. Please contact JBH Helpdesk';
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: statusText
      });
    } else {
      this.handleError(response);
    }
  }
  onBlurAttachmentType(event, rowIndex) {
    if (utils.isEmpty(event.target.value)) {
      this.createDocumentationModel.documentationForm.controls['attachment']
      ['controls'][rowIndex]['controls']['attachmentType'].setValue(null);
    }
  }
  onTypeAttachmentType(event) {
    this.createDocumentationModel.attachmentTypeFiltered = [];
    if (this.createDocumentationModel.attachmentTypeValue) {
      this.createDocumentationModel.attachmentTypeValue.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.createDocumentationModel.attachmentTypeFiltered.push({
            label: element.label,
            value: element.value,
            id: element.id
          });
        }
      });
    }
    this.createDocumentationModel.attachmentTypeFiltered.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);
    this.changeDetector.detectChanges();
  }
}
