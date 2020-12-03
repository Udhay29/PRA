import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { TemplateModel } from '../model/template/template-model.model';
import { TemplateTypeData, TemplateType, TemplateDataElements } from '../model/template/template-interface';
import { EmailTemplateService } from '../service/email-template.service';
import { EmailTemplateUtilsService } from '../service/email-template-utils.service';
import { BatchingExcelComponent } from '../../../shared/accessorials/email-template/batching-excel/batching-excel.component';
import { DefaultExcelComponent } from '../../../shared/accessorials/email-template/default-excel/default-excel.component';
import { LocalStorageService } from '../../../../shared/jbh-app-services/local-storage.service';

@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.scss']
})
export class CreateTemplateComponent implements OnInit {

  @ViewChild(BatchingExcelComponent) batchingComponent: BatchingExcelComponent;
  @ViewChild(DefaultExcelComponent) defaultComponent: DefaultExcelComponent;
  @ViewChild('downloadExcel') downloadExcel: ElementRef;
  templateModel: TemplateModel;

  constructor(private readonly fb: FormBuilder, private readonly emailService: EmailTemplateService,
    private readonly emailUtils: EmailTemplateUtilsService, private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute, private readonly localStore: LocalStorageService) {
    this.templateModel = new TemplateModel();
  }

  ngOnInit() {
    this.getTemplateTypeParam();
    this.getEmailTemplateTypes();
    this.getEmailTemplatePartTypes();
    this.templateModel.batchOverflow = [
      {
        label: 'Copy from Default Attachment',
        command: (onclick): void => {
          this.showPopUp('copy');
        }
      }
    ];
    this.templateModel.defaultOverflow = [
      {
        label: 'View Mapping',
        command: (onclick): void => {
          this.downloadExce('valuesFromDefault', 'Default');
        }
      }
    ];

  }

  showPopUp(control: string) {
    this.templateModel.isShowPopUp = true;
    this.templateModel.popUpHeader = this.templateModel['headerMessages'][control]['header'];
    // tslint:disable-next-line:max-line-length
    this.templateModel.popUpText = this.templateModel['headerMessages'][control]['text'];
  }

  setDefaultElements(defaultElements) {
    this.templateModel.valuesFromDefault = defaultElements;
  }

  setBatchElements(defaultElements) {
    this.templateModel.valuesFromBatch = defaultElements;
  }

  getTemplateTypeParam() {
    this.activatedRoute.queryParamMap.subscribe(params => {
      const param = { ...params.keys, ...params };
      this.templateModel.activeRoute = param['params']['templateName'];
    });
    if (this.templateModel.activeRoute === 'default') {
      this.getMasterTemplateDetails();
    }
    this.templateModel.header = this.templateModel.activeRoute === 'master' ? 'CREATE MASTER EMAIL TEMPLATE' :
      'CREATE DEFAULT EMAIL TEMPLATE';
    this.initForm();
  }

  getMasterTemplateDetails() {
    this.emailService.getMasterTemplateDetails().subscribe(res => {
      this.templateModel.masterTemplateData = this.emailUtils.formatMasterTemplateData(res);
      this.checkValidations(this.templateModel.masterTemplateData);
    });
  }

  checkValidations(masterData) {
    if (!masterData['subjectText']['length']) {
      this.templateModel.templateForm.controls.subjectText.setValidators([Validators.required]);
    }
    if (!masterData['subjectDataElements']['length']) {
      this.templateModel.templateForm.controls.subjectDataElements.setValidators([Validators.required]);
    }
    if (masterData['introParagraph']['length']) {
      this.templateModel.templateForm.controls.introParagraph['controls'][0]['controls']['text'].clearValidators();
      this.templateModel.templateForm.controls.introParagraph['controls'][0]['controls']['text'].updateValueAndValidity();
    }
    if (masterData['conclusionParagraph']['length']) {
      this.templateModel.templateForm.controls.conclusionParagraph['controls'][0]['controls']['text'].clearValidators();
      this.templateModel.templateForm.controls.conclusionParagraph['controls'][0]['controls']['text'].updateValueAndValidity();
    }
    if (!masterData['bodyDataElements']['length']) {
      this.templateModel.templateForm.controls.bodyDataElements.setValidators([Validators.required]);
      this.templateModel.templateForm.controls.bodyDataElements.updateValueAndValidity();
    }
    if (!masterData['signatureLine']['length']) {
      this.templateModel.templateForm.controls.signatureLine['controls'][0]['controls']['text'].setValidators([Validators.required]);
      this.templateModel.templateForm.controls.signatureLine['controls'][0]['controls']['text'].updateValueAndValidity();
    }
  }

  addDefaultExcel() {
    this.templateModel.isDefaultExcel = true;
  }

  initForm() {
    this.templateModel.templateForm = this.fb.group({
      subjectText: [''],
      subjectDataElements: [''],
      introParagraph: this.fb.array([this.returnFormArray()]),
      bodyDataElements: [''],
      conclusionParagraph: this.fb.array([this.returnFormArray()]),
      signatureLine: this.fb.array([this.returnFormArray('signatureLine')]),
      chargeType: ['', (this.templateModel.activeRoute === 'default') ? [Validators.required] : []],
      notificationType: ['', (this.templateModel.activeRoute === 'default') ? [Validators.required] : []]
    });
  }

  returnFormArray(controlName?: string): FormGroup {
    return this.fb.group({
      text: ['', (controlName && controlName === 'signatureLine') ? [] : [Validators.required]]
    });
  }

  getEmailTemplateTypes() {
    this.emailService.getEmailTemplateTypes().subscribe(res => {
      this.templateModel.templateTypes = this.getTemplateTypeData(res['_embedded']['emailTemplateTypes'], 'emailTemplateTypeId',
        'emailTemplateTypeName');
    });
  }

  getEmailTemplatePartTypes() {
    this.emailService.getEmailTemplatePartTypes().subscribe(res => {
      this.templateModel.isLoading = false;
      this.templateModel.templatePartTypes = this.getTemplateTypeData(res['_embedded']['emailTemplatePartTypes'], 'emailTemplatePartTypeId',
        'emailTemplatePartTypeName');
      this.getElements('Subject', 'Email Body', 'subjectElements', 'BodyElements');
    });
  }

  getDataElements(id: number, modelName: string) {
    this.emailService.getDataElements(id).subscribe(res => {
      this.templateModel[modelName] = this.returnDataElements(res['_embedded']['emailTemplateAttributeAssociations']);
      if (modelName === 'subjectElements' && this.templateModel.activeRoute === 'master') {
        this.removeInvalidElements('subjectElements');
      }
    });
  }

  removeInvalidElements(element: string) {
    this.templateModel[element] = this.templateModel[element].filter(dataElement => (dataElement.name !== 'Charge Type' &&
    dataElement.name !== 'Notification Type'));
  }

  getTemplateTypeData(data: TemplateTypeData[], idName: string, textName: string): TemplateType[] {
    const emailTypeData = [];
    data.forEach(emailData => {
      emailTypeData.push({
        'id': emailData[idName],
        'name': emailData[textName]
      });
    });
    return emailTypeData;
  }

  returnDataElements(dataElements: TemplateDataElements[]): TemplateType[] {
    const templateDataElements = [];
    dataElements.forEach(dataElement => {
      if (dataElement['emailTemplateAttribute']['emailTemplateAttributeName'] !== 'Reference Number') {
        templateDataElements.push({
          'id': dataElement['emailTemplateAttribute']['emailTemplateAttributeId'],
          'name': dataElement['emailTemplateAttribute']['emailTemplateAttributeName'],
          'association': dataElement['emailTemplateAttributeAssociationId']
        });
      }
    });
    return templateDataElements;
  }

  saveTemplate() {
    this.templateModel.isLoading = true;
    if (this.templateModel.templateForm.valid && this.isAttachmentsValid()) {
      this.emailService.saveEmailTemplate(this.emailUtils.getQuery(this.templateModel)).subscribe(response => {
        this.templateModel.isLoading = false;
        this.emailUtils.showGrowl = true;
        this.emailUtils.emailType = this.templateModel.activeRoute === 'default' ? 'Default' : 'Master';
        this.localStore.setAccessorialTab('accessType', 'create', { id: 3, text: 'emails' });
        this.router.navigateByUrl('/standard');
      }, (error: Error) => {
        this.templateModel.isLoading = false;
      });
    } else {
      this.templateModel.isLoading = false;
      this.templateModel.popUpHeader = 'Missing Information';
      this.templateModel.popUpText = 'This template contains missing information. Fill in all required fields before saving.';
      this.templateModel.isShowPopUp = true;
      this.markFormTouched();
      this.templateModel.submitStatus.status = true;
      this.templateModel.submitStatus.introParagraph = false;
      this.templateModel.submitStatus.conclusionParagraph = false;
      this.templateModel.submitStatus.batchingExcel = false;
      this.templateModel.submitStatus.defaultExcel = false;
      this.markSaveControlsToTrue();
      if (this.templateModel.activeRoute === 'default') {
        this.isAttachmentsValid();
      }
    }
  }

  markSaveControlsToTrue() {
    this.templateModel.submitStatus.introSave = true;
    this.templateModel.submitStatus.conclusionSave = true;
    this.templateModel.submitStatus.signatureSave = true;
    this.templateModel.submitStatus.batchSave = true;
    if (this.templateModel.isDefaultCreate) {
      this.templateModel.submitStatus.defaultSave = true;
    }
  }

  isAttachmentsValid() {
    if (this.templateModel.activeRoute === 'default') {
      const batchStatus = this.batchingComponent.submit();
      let defaultStatus = true;
      if (this.templateModel.isDefaultExcel) {
        defaultStatus =  this.defaultComponent.submit();
      }
      return batchStatus && defaultStatus;
    } else {
      return true;
    }
  }

  markFormTouched() {
    if (this.templateModel.activeRoute === 'default') {
      this.templateModel.partsToMark.push('signatureLine');
      this.markAllFields();
    }
    this.templateModel.partsToMark.forEach(partType => {
      const control = this.templateModel.templateForm.get(partType) as FormArray;
      control.controls.forEach(emailBodyControl => {
        emailBodyControl['controls']['text'].markAsTouched();
        emailBodyControl['controls']['text'].updateValueAndValidity();
      });
    });
  }

  markAllFields() {
    const controls = ['subjectText', 'subjectDataElements', 'bodyDataElements'];
    controls.forEach(control => {
      this.templateModel.templateForm.controls[control].markAsTouched();
      this.templateModel.templateForm.controls[control].updateValueAndValidity();
    });
  }

  closePopup() {
    this.templateModel.isShowPopUp = false;
  }

  cancelTemplate() {
    if (this.templateModel.templateForm.dirty) {
      this.templateModel.popUpHeader = 'Cancel Template Creation';
      this.templateModel.popUpText = 'Are you sure you would like to cancel and exit without saving?';
      this.templateModel.isShowPopUp = true;
    } else {
      this.localStore.setAccessorialTab('accessType', 'create', { id: 3, text: 'emails' });
      this.router.navigateByUrl('/standard');
    }
  }

  onProceed() {
    this.templateModel.isShowPopUp = false;
    this.localStore.setAccessorialTab('accessType', 'create', { id: 3, text: 'emails' });
    this.router.navigateByUrl('/standard');
  }

  changeDuplicateStatus(status: boolean) {
    this.templateModel.isDefaultCreate = !status;
    if (!this.templateModel.batchExcelElements) {
      this.getElements('Batch Excel', 'Default Excel', 'batchExcelElements', 'defaultExcelElements');
    }
  }

  getElements(batch: string, defaulted: string, batchValue: string, defaultValue: string) {
    this.templateModel.templatePartTypes.forEach(partType => {
      if (partType.name === batch || partType.name === defaulted) {
        this.getDataElements(partType.id, partType.name === defaulted ? defaultValue : batchValue);
      }
    });
  }

  onOverflowClick(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  downloadExce(type, name) {
    if (this.templateModel[type] && !this.emailUtils.isEmptyExist(this.templateModel[type])) {
      this.emailService.downloadExcel(this.emailUtils.getExcelQuery(this.templateModel[type])).subscribe((res: any) => {
        const fileName = `${name} Excel Attachment  ${moment().format('YYYY-MM-DD')} at ${moment().format('hh.mm.ss A')}.xlsx`;
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveBlob(res, fileName);
        } else {
          this.downloadExcel.nativeElement.href = URL.createObjectURL(res);
          this.downloadExcel.nativeElement.download = fileName;
          this.downloadExcel.nativeElement.click();
        }
      });
    }
  }
  afterToggle(collapsed: boolean) {
    this.templateModel.panelFlag = collapsed;
  }
  afterDefaultToggle(collapsed: boolean) {
    this.templateModel.panelDefaultFlag = collapsed;
  }

  onRemoveDefault() {
    this.templateModel.isShowPopUp = false;
    this.defaultComponent.removeDefaultExcelAttachment();
    this.templateModel.isDefaultExcel = false;
  }

  onCopyDefault() {
    this.templateModel.isShowPopUp = false;
    const defaultValues = JSON.parse(JSON.stringify(this.templateModel.valuesFromDefault));
    this.batchingComponent.setFromDefault(defaultValues);
  }

}
