import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EmailTemplateModel } from '../model/email-template-model.model';
import { TemplateUtilsService } from '../service/template-utils.service';
import * as utils from 'lodash';

@Component({
  selector: 'app-default-excel',
  templateUrl: './default-excel.component.html',
  styleUrls: ['./default-excel.component.scss']
})
export class DefaultExcelComponent implements OnInit {

  emailTemplateModel: EmailTemplateModel;
  @Input() dataElements;
  @Output() setDefaultElements: EventEmitter<any> = new EventEmitter<any>();
  @Input() submitStatus;

  constructor(private readonly templateUtils: TemplateUtilsService) {
    this.emailTemplateModel = new EmailTemplateModel();
  }

  ngOnInit() {
    this.emailTemplateModel.defaultExcelValues = [{id: 1, name: '', invalid: false}];
  }

  filterDefaultExcelData(event: Event) {
    this.emailTemplateModel.defaultExcelSuggestions = this.templateUtils.filterDataElements(this.dataElements, event);
    const defaultExcelValues = this.emailTemplateModel.defaultExcelValues.map(batch => batch.name);
    this.emailTemplateModel.defaultExcelSuggestions = utils.differenceBy(this.emailTemplateModel.defaultExcelSuggestions,
      defaultExcelValues, 'id');
  }

  checkDuplicateDefault(event: Event) {
    this.setDefaultElements.emit(this.emailTemplateModel.defaultExcelValues);
  }

  addDefaultExcelElement() {
    const emptyElements = this.emailTemplateModel.defaultExcelValues.filter(value => !value.name);
    if (!emptyElements.length) {
      this.emailTemplateModel.defaultExcelValues.push({id: null, name: '', invalid: false});
      this.emailTemplateModel.isDefaultAdding = false;
      this.submitStatus['defaultExcel'] = false;
      this.submitStatus['defaultSave'] = false;
    } else {
      this.emailTemplateModel.isBatchAdding = true;
      this.submitStatus['defaultExcel'] = true;
    }
  }

  getErrorMessage(batchExcelValue) {
    const message = 'Provide heading';
    if (this.submitStatus['status']) {
      if (this.submitStatus['defaultExcel']) {
        return 'Provide heading before adding';
      } else if (!this.submitStatus['batchSave']) {
        return message;
      }
      return this.emailTemplateModel.defaultExcelValues.length > 1 ? 'Provide heading or remove field' : message;
    } else {
      return !this.submitStatus['defaultExcel'] ? message : 'Provide heading before adding';
    }
  }

  onBatchValueChange(event: Event, batchValue) {
    if (utils.isEmpty(event['target']['value'])) {
      batchValue['name'] = '';
    }
    batchValue['invalid'] = !batchValue['name'];
  }

  removeDefaultExcelElement(index: number) {
    this.emailTemplateModel.isDefaultAdding = false;
    this.emailTemplateModel.defaultExcelValues.splice(index, 1);
    this.submitStatus['defaultSave'] = false;
    this.setDefaultElements.emit(this.emailTemplateModel.defaultExcelValues);
  }

  removeDefaultExcelAttachment() {
    this.emailTemplateModel.defaultExcelValues = [];
    this.setDefaultElements.emit(this.emailTemplateModel.defaultExcelValues);
  }

  submit() {
    const emptyElements = this.emailTemplateModel.defaultExcelValues.filter(value => !value.name);
    if (emptyElements.length) {
      this.emailTemplateModel.defaultExcelValues.forEach(defaultValue => {
        defaultValue['invalid'] = true;
      });
    }
    return !emptyElements.length;
  }

}
