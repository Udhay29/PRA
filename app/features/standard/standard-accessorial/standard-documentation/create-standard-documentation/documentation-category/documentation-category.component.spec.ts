import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AppModule } from './../../../../../../app.module';
import { StandardModule } from '../../../../standard.module';
import { APP_BASE_HREF } from '@angular/common';
import { DocumentationCategoryComponent } from './documentation-category.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { CreateStandardDocumentationService } from '.././service/create-standard-documentation.service';
import { configureTestSuite } from 'ng-bullet';



describe('DocumentationCategoryComponent', () => {
  let component: DocumentationCategoryComponent;
  let fixture: ComponentFixture<DocumentationCategoryComponent>;
  const fb = new FormBuilder();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentationCategoryComponent);
    component = fixture.componentInstance;
    component.optionalForm = fb.group({
      chargeType: [[{ 'label': 'test', 'value': 1 }], Validators.required],
    });
    component.documentCategory = fb.group({
      documentationType: ['Legal', Validators.required],
      effectiveDate: ['2013-09-29', Validators.required],
      expirationDate: ['2099-12-31', Validators.required],
      documentCategorySelect: ['Text Only'],
      textName: ['test', Validators.required],
      textArea: ['test', Validators.required],
      groupName: [{ 'label': 'test', 'value': 'test' }, Validators.required],
      attachment: new FormArray([
        fb.group({
          documentId: [123],
          filename: 'doc.xls',
          attachemntType: { 'label': 'test', 'value': 'test' }
        })
      ])
    });
    component.optionalForm = fb.group({
      chargeType: [[{ 'label': 'test', 'value': 1 }], Validators.required],
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadAttachmentType', () => {
    const response = {
      _embedded: {
        accessorialAttachmentTypes: [
          {
            accessorialAttachmentTypeName: 'name',
            accessorialAttachmentTypeId: 1
          }
        ]
      }
    };
    const result = [{ label: 'name', value: 'name', id: 1 }];
    spyOn(CreateStandardDocumentationService.prototype, 'getAttachmentType').and.returnValue(of(response));
    component.loadAttachmentType();
    expect(component.createDocumentationModel.attachmentTypeValue).toEqual(result);
  });

  it('should call moreFileAndSize', () => {
    component.moreFileAndSize();
  });

  it('should call onFilesUpload', () => {
    const event = { files: [{ name: 'foo.xls', size: 500001 }] };
    const response = {
      byteStream: '',
      docClass: '',
      documentId: '',
      documentTitle: '',
      documentType: '',
      ecmObjectStore: '',
      fileName: '',
      mimeType: ''
    };
    component.createDocumentationModel.fileCount = 0;
    spyOn(CreateStandardDocumentationService.prototype, 'postFileDetails').and.returnValue(of(response));
    component.selectedDocumentType = { label: '', value: '' };
    component.onFilesUpload(event);
    expect(component.createDocumentationModel.fileCount).toEqual(1);
  });

  it('should call onFilesUpload when duplicate', () => {
    const event = { files: [{ name: 'doc.xls', size: 500001 }] };
    component.selectedDocumentType = { label: '', value: '' };
    component.createDocumentationModel.fileCount = 0;
    component.onFilesUpload(event);
    expect(component.createDocumentationModel.fileCount).toEqual(0);
  });

  it('should call onFilesUpload when unsupported format', () => {
    const event = { files: [{ name: 'doc.xln', size: 500001 }] };
    component.selectedDocumentType = { label: '', value: '' };
    component.createDocumentationModel.fileCount = 0;
    component.onFilesUpload(event);
    expect(component.createDocumentationModel.fileCount).toEqual(0);
  });

  it('should call removeAttachment', () => {
    component.createDocumentationModel.isSubscribeFlag = true;
    spyOn(CreateStandardDocumentationService.prototype, 'deleteUploadedFiles').and.returnValue(of(true));
    component.removeAttachment(0);
    expect(component.createDocumentationModel.loaderOnRemove).toEqual(false);
  });

  it('should call createAttachmentItem', () => {
    component.createAttachmentItem('filename', '123');
  });

  it('should call textonlyrequired', () => {
    component.textOnlyRequired();
  });

  it('should call attachmentOnlyRequired', () => {
    component.attachmentOnlyRequired();
  });

  it('should call attachmentOnlyRequiredRemove', () => {
    component.attachmentOnlyRequiredRemove();
  });

  it('should call textOnlyRequiredRemove', () => {
    component.textOnlyRequiredRemove();
  });

  it('should call clearFormArray', () => {
    component.createDocumentationModel.isSubscribeFlag = true;
    spyOn(CreateStandardDocumentationService.prototype, 'deleteUploadedFiles').and.returnValue(of(true));
    component.clearFormArray();
    expect(component.createDocumentationModel.fileCount).toEqual(0);
  });

  it('should call clearFormArray with error', () => {
    component.createDocumentationModel.isSubscribeFlag = true;
    spyOn(CreateStandardDocumentationService.prototype, 'deleteUploadedFiles').and.returnValue(throwError({}));
    component.clearFormArray();
  });

  it('should call onChangedocumentCategory when Text Only', () => {
    component.documentCategory.controls.attachment = new FormArray([]);
    component.onChangedocumentCategory('Text Only');
    component.documentCategory.controls['textName'].setValue('');
    component.documentCategory.controls['textArea'].setValue('');
    expect(component.documentCategory.controls['textName'].valid).toBeFalsy();
    expect(component.documentCategory.controls['textArea'].valid).toBeFalsy();
  });

  it('should call onChangedocumentCategory when Document Only', () => {
    component.documentCategory.controls.attachment = new FormArray([]);
    component.createDocumentationModel.documentTypeCompare = 'Document Only';
    component.onChangedocumentCategory('Document Only');
    expect(component.documentCategory.controls['textName'].valid).toBeTruthy();
    expect(component.documentCategory.controls['textArea'].valid).toBeTruthy();
  });

  it('should call onChangedocumentCategory when empty', () => {
    component.documentCategory.controls.attachment = new FormArray([]);
    component.onChangedocumentCategory('');
  });

  it('should call documentTypePopupNo', () => {
    component.selectedDocumentType = 'legal';
    component.createDocumentationModel.documentationForm = fb.group({
      documentationType: []
    });
    component.documentTypePopupNo();
    expect(component.createDocumentationModel.documentationForm.controls['documentationType']['value']).toEqual('legal');
    expect(component.createDocumentationModel.isShowDocumentTypePopup).toEqual(false);
  });
  it('should cal onTypeAttachmentType', () => {
    const response = {
      query: 'O'
    };
    component.createDocumentationModel.attachmentTypeValue = [{ label: 'On', value: '12' }];
    component.onTypeAttachmentType(response);
  });
  it('should cal onTypeAttachmentTypeElse', () => {
    const response = {
      query: 'O'
    };
    component.createDocumentationModel.attachmentTypeValue = null;
    component.onTypeAttachmentType(response);
  });
  it('should cal onTypeAttachmentTypeElse', () => {
    const response = {
      query: 'Order'
    };
    component.createDocumentationModel.attachmentTypeValue = [{ label: 'On', value: '12' }];
    component.onTypeAttachmentType(response);
  });
  it('should call onFilesUpload return', () => {
    const event = { files: [{ name: 'doc.xls', size: 500001 }] };
    component.documentCategory.controls['groupName'].setValue('');
    component.onFilesUpload(event);
  });
});
