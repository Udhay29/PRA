import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, Input, ElementRef,
  OnDestroy
} from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';
import * as utils from 'lodash';
import { takeWhile } from 'rxjs/operators';


import { LocalStorageService } from './../../../../../../shared/jbh-app-services/local-storage.service';
import { CreateStandardDocumentationService } from '.././service/create-standard-documentation.service';
import { CreateStandardDocumentationUtilityService } from '.././service/create-standard-documentation-utility.service';
import { CreateDocumentationModel } from '../model/create-standard-doucmentation.model';
import {
  CanComponentDeactivate,
  UploadFileServiceData
} from '../model/create-standard-documenation.interface';
@Component({
  selector: 'app-documentation-category',
  templateUrl: './documentation-category.component.html',
  styleUrls: ['./documentation-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class DocumentationCategoryComponent implements OnInit {
  createDocumentationModel: CreateDocumentationModel;
  @ViewChild('optionalFields') optionalFields: any;
  @Input() documentCategory: FormGroup;
  @Input() optionalForm: FormGroup;
  @Input() selectedDocumentType: any;
  constructor(private readonly changeDetector: ChangeDetectorRef, private readonly messageService: MessageService,
    private readonly createDocumentationUtilsService: CreateStandardDocumentationUtilityService,
    private readonly createDocumentationService: CreateStandardDocumentationService) {
    this.createDocumentationModel = new CreateDocumentationModel();
  }
  ngOnInit() {
    this.loadAttachmentType();
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
  moreFileAndSize() {
    if (this.createDocumentationModel.fileCount
      + this.createDocumentationModel.numberOfFilesInDragAndDrop > 10) {
      this.createDocumentationUtilsService.toastMessage(this.messageService, 'error', 'Error', 'Exceeds More Files than Required.');
    }
  }
  onFilesUpload(event) {
    if (utils.isEmpty(this.documentCategory.controls['groupName'].value)) {
      this.createDocumentationUtilsService.toastMessage(this.messageService, 'error', 'Select Group Name', 'Provide a Group Name.');
      return;
    }
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
      this.createDocumentationUtilsService.toastMessage(this.messageService, 'error', 'Business Validation Error',
        'Document attachment must have a different file name; Please rename attachment and try again.');
    }
    resultFiles.forEach((fileDetails: any) => {
      const extension = fileDetails.name.split('.').pop();
      if (this.createDocumentationModel.allowedAttahcmentFormat.indexOf(extension.toLowerCase()) === -1 || fileDetails.size > 10485760) {
        const message = this.createDocumentationModel.allowedAttahcmentFormat.indexOf(extension.toLowerCase()) === -1 ?
          'File Type not supported.' :
          'Document exceeds max size allowed; Please attach document of a smaller size or break into multiple smaller documents.';
        this.createDocumentationUtilsService.toastMessage(this.messageService, 'error', 'Error', message);
        return;
      }
      const fileIndex =
        (this.documentCategory.controls.attachment as FormArray)
          .controls.findIndex(attachment => {
            const attachedFileName = attachment.get('filename').value
              .substring(0, attachment.get('filename').value.lastIndexOf('.')).toLowerCase();
            const filenameToAttach = fileDetails.name
              .substring(0, fileDetails.name.lastIndexOf('.')).toLowerCase();
            return attachedFileName === filenameToAttach;
          });
      if (fileIndex !== -1) {
        this.createDocumentationUtilsService.toastMessage(this.messageService, 'error', 'Business Validation Error',
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
    const dataTOBeDeleted = this.documentCategory.controls.attachment['controls']
    [attachmentPosition]['controls']['documentId']['value'];
    const params = {
      documentId: dataTOBeDeleted,
      ecmObjectStore: 'PRICING',
      docClass: 'STANDARD'
    };
    this.createDocumentationService.deleteUploadedFiles(params)
      .pipe(takeWhile(() => this.createDocumentationModel.isSubscribeFlag))
      .subscribe((data: boolean) => {
        this.createDocumentationModel.loaderOnRemove = false;
        (this.documentCategory.controls.attachment as FormArray).removeAt(attachmentPosition);
        this.createDocumentationModel.fileCount--;
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.createDocumentationModel.loaderOnRemove = false;
        this.createDocumentationUtilsService.handleError(error, this.messageService);
      });
  }
  postFileDetail(fileDetails, convertedarray): void {
    this.createDocumentationModel.loadings = true;
    const fileName = fileDetails.name.lastIndexOf('.');
    const fileTitle = fileDetails.name.substring(0, fileName);
    const params = {
      fileName: fileDetails.name,
      documentTitle: fileTitle,
      mimeType: fileDetails.name.split('.').pop(),
      byteStream: convertedarray,
      documentType: this.selectedDocumentType['label'].toUpperCase(),
      ecmObjectStore: 'PRICING',
      docClass: 'STANDARD',
      category: 'Accessorial',
      chargeCodeIds: utils.map(this.optionalForm.controls['chargeType'].value, 'value'),
      groupId: this.documentCategory.controls['groupName'].value.value
    };
    this.createDocumentationService.postFileDetails(convertedarray, params)
      .pipe(takeWhile(() => this.createDocumentationModel.isSubscribeFlag))
      .subscribe((data: UploadFileServiceData) => {
        this.createDocumentationModel.fileCount++;
        this.createDocumentationModel.loadings = false;
        (this.documentCategory.controls.attachment as FormArray)
          .push(this.createAttachmentItem(fileDetails.name, data.documentId));
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.createDocumentationModel.loadings = false;
        this.createDocumentationUtilsService.handleError(error, this.messageService);
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
    utils.forIn(this.documentCategory.controls.attachment['controls'], (value: FormControl, name: string) => {
      value['controls']['attachmentType'].setValidators([Validators.required]);
      value['controls']['attachmentType'].updateValueAndValidity();
    });
  }
  removeaAttachementTypeFormcontrolValidation() {
    utils.forIn(this.documentCategory.controls.attachment['controls'], (value: FormControl, name: string) => {
      value['controls']['attachmentType'].setValidators(null);
      value['controls']['attachmentType'].updateValueAndValidity();
    });
  }
  textOnlyRequired() {
    this.documentCategory.controls['textName'].setValidators([Validators.required]);
    this.documentCategory.controls['textName'].updateValueAndValidity();
    this.documentCategory.controls['textArea'].setValidators([Validators.required]);
    this.documentCategory.controls['textArea'].updateValueAndValidity();
  }
  attachmentOnlyRequired() {
    this.documentCategory.controls['attachment'].setValidators([Validators.required]);
    this.documentCategory.controls['attachment'].updateValueAndValidity();
  }
  attachmentOnlyRequiredRemove() {
    this.documentCategory.controls['attachment'].setValidators(null);
    this.documentCategory.controls['attachment'].updateValueAndValidity();
  }
  textOnlyRequiredRemove() {
    this.documentCategory.controls['textName'].setValidators(null);
    this.documentCategory.controls['textName'].updateValueAndValidity();
    this.documentCategory.controls['textArea'].setValidators(null);
    this.documentCategory.controls['textArea'].updateValueAndValidity();
  }
  documentTypePopupYes() {
    const optionalForm = this.optionalFields['standardOptionalAttributesModel']['optionalForm'];
    this.selectedDocumentType = this.createDocumentationModel
      .documentationCategoryForm.controls['documentationType'].value;
    this.documentCategory.controls['documentCategorySelect'].setValue('Text Only');
    this.documentCategory.controls['textName'].reset();
    this.documentCategory.controls['textArea'].reset();
    this.clearFormArray();
    this.documentCategory.controls['attachment'].reset();
    this.documentCategory.markAsPristine();
    optionalForm.reset();
    this.createDocumentationModel.isShowDocumentTypePopup = false;
    this.changeDetector.detectChanges();
  }
  documentTypePopupNo() {
    this.createDocumentationModel.documentationForm.controls['documentationType']
      .setValue(this.selectedDocumentType);
    this.createDocumentationModel.isShowDocumentTypePopup = false;
  }
  clearFormArray() {
    this.createDocumentationModel.fileCount = 0;
    const attachmentControl = this.documentCategory.controls['attachment'] as FormArray;
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
    if (this.optionalFields['standardOptionalAttributesModel']['optionalForm'].dirty ||
      this.documentCategory.controls['textArea'].dirty ||
      this.documentCategory.controls['textName'].dirty ||
      this.createDocumentationModel.fileCount) {
      this.createDocumentationModel.isShowDocumentTypePopup = true;
    } else {
      this.selectedDocumentType = event['value'];
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

  onBlurAttachmentType(event, index: number) {
    if (utils.isEmpty(event.target.value)) {
    this.documentCategory.controls.attachment['controls'][index]['controls']['attachmentType'].setValue('');
    }
  }
}
