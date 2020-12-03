import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterStateSnapshot, Router, ActivatedRouteSnapshot } from '@angular/router';
import { FormBuilder, Validators, FormArray, FormGroup, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';
import * as moment from 'moment';
import * as utils from 'lodash';
import { takeWhile } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { LocalStorageService } from './../../../../../shared/jbh-app-services/local-storage.service';
import { CreateDocumentationModel } from './model/create-standard-doucmentation.model';
import { CreateStandardDocumentationService } from './service/create-standard-documentation.service';
import {
  DocumentationTypeValues, DocumentationResponse, GroupNameTypeValues, GroupNamesTypesItem
} from './model/create-standard-documenation.interface';
import { CreateStandardDocumentationUtilityService } from './service/create-standard-documentation-utility.service';
import {
  CanComponentDeactivate,
  UploadFileServiceData
} from '../../../standard-accessorial/standard-documentation/create-standard-documentation/model/create-standard-documenation.interface';
import { DateValidation } from './../../../../../shared/jbh-app-services/date-validation';
@Component({
  selector: 'app-create-standard-documentation',
  templateUrl: './create-standard-documentation.component.html',
  styleUrls: ['./create-standard-documentation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateStandardDocumentationComponent implements OnInit, AfterViewInit {
  createDocumentationModel: CreateDocumentationModel;
  @ViewChild('optionalFields') optionalFields: any;
  @ViewChild('top') topElemRef: ElementRef;
  @ViewChild('documentationCategory') documentationCategory: any;

  constructor(private readonly formBuilder: FormBuilder, private readonly localStore: LocalStorageService,
    private readonly changeDetector: ChangeDetectorRef, private readonly messageService: MessageService,
    private readonly createDocumentationUtilsService: CreateStandardDocumentationUtilityService,
    private readonly createDocumentationService: CreateStandardDocumentationService,
    private readonly router: Router) {
    this.createDocumentationModel = new CreateDocumentationModel();
  }
  ngOnInit() {
    this.createDocumentationForm();
    this.setDocumentType();
    this.getGroupNames();
    this.setDateValue();
    this.createDocumentationUtilsService.setSuperUserBackDateDays(this.createDocumentationModel);
    this.createDocumentationUtilsService.setSuperUserFutureDateDays(this.createDocumentationModel);
  }
  ngAfterViewInit() {
    this.onFormValueChange();
  }
  createDocumentationForm() {
    this.createDocumentationModel.documentationForm = this.formBuilder.group({
      documentationType: ['', Validators.required],
      groupName: ['', Validators.required],
      effectiveDate: ['', Validators.required],
      expirationDate: ['', Validators.required],
      documentCategorySelect: [],
      textName: ['', Validators.required],
      textArea: ['', Validators.required],
      attachment: new FormArray([])
    });
    this.setInitialFormValues();
  }
  onFormValueChange() {
    const formFields = ['effectiveDate', 'expirationDate'];
    formFields.forEach(fieldName => {
      this.createDocumentationModel.documentationForm.controls[fieldName].valueChanges.subscribe(val => {
        this.createDocumentationModel.msgs = [];
      });
    });
    this.optionalFields.standardOptionalAttributesModel.optionalForm.valueChanges.subscribe(val => {
      this.createDocumentationModel.msgs = [];
    });
  }
  setInitialFormValues() {
    this.createDocumentationModel.documentationForm.controls['documentCategorySelect'].setValue('Text Only');
  }
  setDocumentType() {
    this.createDocumentationModel.loading = true;
    this.createDocumentationService.getDocumentationType().pipe(takeWhile(() => this.createDocumentationModel.isSubscribeFlag))
      .subscribe((documentationType: DocumentationTypeValues) => {
        this.createDocumentationModel.loading = false;
        this.populateDocumentType(documentationType);
      }, (documentationTypeError: Error) => {
        this.createDocumentationModel.loading = false;
        this.createDocumentationUtilsService
          .toastMessage(this.messageService, 'error', 'Error', documentationTypeError['error']['errors']['errorMessage']);
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
  formCheck(docLevelChangeVal) {
    const attachmentControl = this.createDocumentationModel.documentationForm.controls['attachment'] as FormArray;

    if (this.optionalFields['standardOptionalAttributesModel']['optionalForm'].dirty ||
      this.createDocumentationModel.documentationForm.controls['textArea'].dirty ||
      this.createDocumentationModel.documentationForm.controls['textName'].dirty || attachmentControl.length > 0 ||
      this.createDocumentationModel.isDateChanged || this.createDocumentationModel.fileCount) {
      this.createDocumentationModel.documentationLevelChange = true;
    } else {
      this.createDocumentationModel.documentationChange = docLevelChangeVal;
    }
  }

  setDateValue() {
    this.createDocumentationModel.documentationForm.controls['effectiveDate']
      .setValue(this.createDocumentationUtilsService.dateFormatter(new Date()));
    this.createDocumentationModel.documentationForm.controls['expirationDate']
      .setValue(this.createDocumentationUtilsService.dateFormatter(new Date(this.createDocumentationModel.setExpirationDate)));
    this.createDocumentationModel.agreementEffectiveDate = this.createDocumentationModel.documentationForm.controls['effectiveDate'].value;
    this.createDocumentationModel.agreementEndDate = this.createDocumentationModel.documentationForm.controls['expirationDate'].value;
  }
  getGroupNames() {
    this.createDocumentationModel.loading = true;
    this.createDocumentationService.getGroupNames().pipe(takeWhile(() => this.createDocumentationModel.isSubscribeFlag))
    .subscribe((res: GroupNameTypeValues) => {
      this.createDocumentationModel.loading = false;
      this.createDocumentationModel.groupNameValues = res._embedded.accessorialGroupTypes.map((value: GroupNamesTypesItem) => {
        return {
          label : value.accessorialGroupTypeName,
          value : value.accessorialGroupTypeId
        };
      });
      this.populateGroupName();
    }, (groupNameError: Error) => {
      this.createDocumentationModel.loading = false;
      this.createDocumentationUtilsService
          .toastMessage(this.messageService, 'error', 'Error', groupNameError['error']['errors']['errorMessage']);
    });
  }
  populateGroupName() {
    if (this.createDocumentationModel.groupNameValues) {
      this.createDocumentationModel.documentationForm.controls['groupName'].
      setValue(this.createDocumentationModel.groupNameValues[0]);
      this.changeDetector.detectChanges();
    }
  }
  onTypeGroupName(event) {
    this.createDocumentationModel.groupNameSuggestions = [];
    if (this.createDocumentationModel.groupNameValues) {
      this.createDocumentationModel.groupNameValues.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.createDocumentationModel.groupNameSuggestions.push({
            label: element.label,
            value: element.value
          });
        }
      });
      this.createDocumentationModel.groupNameSuggestions =  utils.sortBy(this.createDocumentationModel.groupNameSuggestions, ['label']);
    }
  }
  onautoCompleteBlur(event, controlName: string) {
    if (this.createDocumentationModel.documentationForm.controls[controlName].value &&
      !event.target['value']) {
      this.createDocumentationModel.documentationForm.controls[controlName].setValue(null);
    }
  }
  typedDateValidate(event: Event, fieldName: string) {
    const regex = new RegExp('^(|(0[1-9])|(1[0-2]))\/((0[1-9])|(1[0-9])|(2[0-9])|(3[0-1]))\/(([0-9]{4}))$');
    switch (fieldName) {
      case 'effectiveDate':
        if (event.srcElement['value'] && regex.test(event['srcElement']['value'].trim())
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
        if (event.srcElement['value'] && regex.test(event.srcElement['value'].trim()) &&
        this.createDocumentationModel.documentationForm.controls['expirationDate'].value) {
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
  onDateSelected(selectedDate: Date, selectedType: string) {
    this.createDocumentationModel.isCorrectEffDateFormat = false;
    this.createDocumentationModel.isCorrectExpDateFormat = false;
    if (selectedType.toLowerCase() === 'effectivedate') {
      this.validateEffectiveDate();
      this.createDocumentationModel.effectiveDate = this.createDocumentationUtilsService.dateFormatter(selectedDate);
      this.createDocumentationModel.expirationMinDate = new Date(selectedDate);
      this.createDocumentationModel.disabledExpirationDate = [new Date(selectedDate)];
      this.validateDate(this.createDocumentationModel.expirationMinDate, selectedType);
      this.setFormErrors();
      this.setValidation('expirationDate');
    } else if (selectedType.toLowerCase() === 'expirationdate') {
      this.validateEffectiveDate();
      this.createDocumentationModel.expirationDate = this.createDocumentationUtilsService.dateFormatter(selectedDate);
      this.createDocumentationModel.effectiveMaxDate = new Date(selectedDate);
      this.createDocumentationModel.disabledEffectiveDate = [new Date(selectedDate)];
      this.validateDate(this.createDocumentationModel.effectiveMaxDate, selectedType);
      this.setFormErrors();
      this.setValidation('effectiveDate');
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
  onSaveDocumentation() {
    this.createDocumentationModel.documentationForm.controls.attachment['controls'].forEach(element => {
      element['controls'].attachmentType.markAsTouched();
    });
    this.onValidateForm();
  }
  onValidateForm() {
    const serviceLevel = this.optionalFields.standardOptionalAttributesModel.optionalForm.controls.serviceLevel;
    if (this.createDocumentationModel.documentationForm.valid) {
      if (serviceLevel.invalid) {
        serviceLevel.markAsTouched();
        this.optionalFields.changeDetector.detectChanges();
        this.messageService.clear();
        this.messageService.add({
          severity: 'error', summary: this.createDocumentationModel.missingInfo,
          detail: 'Provide a Service Level'
        });
        return;
      }
      this.createDocumentationModel.isShowSavePopup = true;
      this.changeDetector.detectChanges();
    } else {
      this.formFieldsTouched();
    }
  }
  saveDocumentation() {
    if (this.createDocumentationModel.documentationForm.controls['documentCategorySelect'].value ===
      this.createDocumentationModel.documentTypeCompare) {
      this.createDocumentationModel.documentationForm.controls['textName'].setValue(null);
      this.createDocumentationModel.documentationForm.controls['textArea'].setValue(null);
    } else if (this.createDocumentationModel.documentationForm.controls['documentCategorySelect'].value === 'Text Only') {
      this.createDocumentationModel.documentationForm.controls['attachment'].reset();
    }
    const params = this.createDocumentationUtilsService.
      documentationPostFramer(this.createDocumentationModel, this.optionalFields['standardOptionalAttributesModel']);
    this.createDocumentationService.postDocumentationData(params)
      .pipe(takeWhile(() => this.createDocumentationModel.isSubscribeFlag))
      .subscribe((documentationDate: DocumentationResponse) => {
        this.createDocumentationModel.isDetailsSaved = true;
        this.createDocumentationModel.msgs = [];
        if (documentationDate.customerAccessorialDocumentConfigurationId === null) {
          this.createDocumentationModel.msgs.push({
            severity: 'error', summary: 'Duplicate Documentation already exists'
          });
          this.changeDetector.detectChanges();
        } else {
          this.createDocumentationUtilsService.
            toastMessage(this.messageService, 'success', 'Documentation Saved', 'The documentation has been successfully saved.');
          this.localStore.setAccessorialTab('accessType', 'create', { id: 1, text: 'documentation' });
          this.router.navigateByUrl('/standard');
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
      this.createDocumentationUtilsService.
            toastMessage(this.messageService, 'error', 'Error', documentationError['error']['errors'][0]['errorMessage']);
    }
  }
  formFieldsTouched() {
    utils.forIn(this.createDocumentationModel.documentationForm.controls, (value, name: string) => {
      if (!value['value'] && !utils.isEmpty(value.errors)) {
        this.createDocumentationModel.documentationForm.controls[name].markAsTouched();
      }
    });
    this.messageService.clear();
    this.messageService.add({
      severity: 'error', summary: this.createDocumentationModel.missingInfo,
      detail: 'Provide the required information in the highlighted fields and submit the form again'
    });
    if ((this.createDocumentationModel.documentationForm.controls['documentCategorySelect'].value ===
      this.createDocumentationModel.documentTypeCompare)
      && !this.createDocumentationModel.fileCount) {
      this.messageService.clear();
      this.messageService.add({
        severity: 'error', summary: this.createDocumentationModel.missingInfo,
        detail: 'Please specify attachment to proceed.'
      });
    } else if (this.createDocumentationModel.documentationForm.controls['documentCategorySelect'].value === 'Both') {
      this.toastMessageForAtaachment();
    }
    this.documentationCategory.changeDetector.detectChanges();
    this.changeDetector.detectChanges();
  }
  toastMessageForAtaachment() {
    if (!(this.createDocumentationModel.documentationForm.controls['textName'].value) ||
      !(this.createDocumentationModel.documentationForm.controls['textArea'].value) ||
      !this.createDocumentationModel.fileCount) {
      this.messageService.clear();
      this.messageService.add({
        severity: 'error', summary: this.createDocumentationModel.missingInfo,
        detail: ' Please specify both text and attachment to proceed.'
      });
    } else {
      this.messageService.clear();
      this.messageService.add({
        severity: 'error', summary: this.createDocumentationModel.missingInfo,
        detail: 'Provide the required information in the highlighted fields and submit the form again.'
      });
    }
  }
  onHideCancelPop(keyName: string) {
    this.createDocumentationModel[keyName] = false;
  }
  onDontSave() {
    this.clearFormArray();
    this.createDocumentationModel.documentationCancel = false;
    this.createDocumentationModel.isDetailsSaved = true;
    this.localStore.setAccessorialTab('accessType', 'create', { id: 1, text: 'documentation' });
    this.router.navigateByUrl('/standard');
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
    const attachmentControl = this.createDocumentationModel.documentationForm.controls['attachment'] as FormArray;
    if ((this.optionalFields['standardOptionalAttributesModel']['optionalForm'].dirty ||
     this.createDocumentationModel['documentationForm'].dirty ||
      this.createDocumentationModel.documentationForm.controls['textArea'].dirty || attachmentControl.length > 0 ||
      this.createDocumentationModel.documentationForm.controls['textName'].dirty)
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
    this.createDocumentationModel.isDetailsSaved = true;
    this.createDocumentationModel.documentationCancel = false;
    this.createDocumentationModel.isChangesSaving = true;
    this.createDocumentationModel.documentationNavigateCancel = false;
    this.router.navigate([this.createDocumentationModel.routingUrl]);
  }
  onDocumentationCancel() {
    const attachmentControl = this.createDocumentationModel.documentationForm.controls['attachment'] as FormArray;
    if (this.optionalFields['standardOptionalAttributesModel']['optionalForm'].dirty ||
      this.createDocumentationModel.documentationForm.controls['textArea'].dirty ||
      this.createDocumentationModel.documentationForm.controls['textName'].dirty || this.createDocumentationModel.documentationForm.dirty ||
      this.createDocumentationModel.fileCount || attachmentControl.length > 0) {
      this.createDocumentationModel.documentationCancel = true;
    } else {
      this.onDontSave();
    }
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
        docClass: 'STANDARD'
      };
      attachmentControl.removeAt(0);
      this.createDocumentationService.deleteUploadedFiles(params)
        .pipe(takeWhile(() => this.createDocumentationModel.isSubscribeFlag))
        .subscribe((data: boolean) => {
          this.changeDetector.detectChanges();
        }, (error: HttpErrorResponse) => {
          this.createDocumentationUtilsService.handleError(error, this.messageService);
        });
    }
  }
  onChangeDocumentType(event: Event) {
    this.createDocumentationModel.isDateChanged = false;
    this.createDocumentationModel.isShowDocumentTypePopup = false;
    this.dateCheck();
    const attachmentControl = this.createDocumentationModel.documentationForm.controls['attachment'] as FormArray;
    if (this.optionalFields['standardOptionalAttributesModel']['optionalForm'].dirty ||
      this.createDocumentationModel.documentationForm.controls['textArea'].dirty ||
      this.createDocumentationModel.documentationForm.controls['textName'].dirty ||
      this.createDocumentationModel.isDateChanged || this.createDocumentationModel.fileCount ||
      attachmentControl.length > 0) {
      this.createDocumentationModel.isShowDocumentTypePopup = true;
    } else {
      this.createDocumentationModel.selectedDocumentType = event['value'];
    }
  }
  dateCheck() {
    if (this.createDocumentationModel.agreementEffectiveDate !==
      this.createDocumentationModel.documentationForm.controls['effectiveDate'].value ||
      this.createDocumentationModel.agreementEndDate !==
      this.createDocumentationModel.documentationForm.controls['expirationDate'].value) {
      this.createDocumentationModel.isDateChanged = true;
    }
  }
  documentTypePopupNo() {
    this.createDocumentationModel.documentationForm.controls['documentationType']
      .setValue(this.createDocumentationModel.selectedDocumentType);
    this.createDocumentationModel.isShowDocumentTypePopup = false;
  }
  documentTypePopupYes() {
    this.dateReset();
    this.createDocumentationModel.selectedDocumentType = this.createDocumentationModel
      .documentationForm.controls['documentationType'].value;
    this.createDocumentationModel.documentationForm.controls['documentCategorySelect'].setValue('Text Only');
    this.createDocumentationModel.documentationForm.controls['textName'].reset();
    this.createDocumentationModel.documentationForm.controls['textArea'].reset();
    this.clearFormArray();
    this.createDocumentationModel.documentationForm.controls['attachment'].reset();
    this.createDocumentationModel.documentationForm.markAsPristine();
    this.optionalFields['standardOptionalAttributesModel']['optionalForm'].reset();
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
}


