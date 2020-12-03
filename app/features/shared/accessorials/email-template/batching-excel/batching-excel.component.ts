import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EmailTemplateModel } from '../model/email-template-model.model';
import { TemplateUtilsService } from '../service/template-utils.service';
import * as utils from 'lodash';
import { empty } from 'rxjs';

@Component({
  selector: 'app-batching-excel',
  templateUrl: './batching-excel.component.html',
  styleUrls: ['./batching-excel.component.scss']
})
export class BatchingExcelComponent implements OnInit {

  emailTemplateModel: EmailTemplateModel;
  @Input() dataElements;
  @Output() setBatchElements: EventEmitter<any> = new EventEmitter<any>();
  @Input() submitStatus;

  constructor(private readonly templateUtils: TemplateUtilsService) {
    this.emailTemplateModel = new EmailTemplateModel();
  }

  ngOnInit() {
    this.emailTemplateModel.batchingExcelValues = [{ id: null, name: '', invalid: false }];
  }

  filterBatchExcelData(event: Event) {
    this.emailTemplateModel.batchingExcelSuggestions = this.templateUtils.filterDataElements(this.dataElements, event);
    const batchExcelValues = this.emailTemplateModel.batchingExcelValues.map(batch => batch.name);
    this.emailTemplateModel.batchingExcelSuggestions = utils.differenceBy(this.emailTemplateModel.batchingExcelSuggestions,
      batchExcelValues, 'id');
  }

  checkDuplicateBatch(event: Event) {
    this.setBatchElements.emit(this.emailTemplateModel.batchingExcelValues);
  }

  addBatchExcelElement() {
    const emptyElements = this.emailTemplateModel.batchingExcelValues.filter(value => !value.name);
    if (!emptyElements.length) {
      this.emailTemplateModel.batchingExcelValues.push({ id: null, name: '', invalid: false });
      this.emailTemplateModel.isBatchAdding = false;
      this.submitStatus['batchingExcel'] = false;
      this.submitStatus['batchSave'] = false;
    } else {
      this.emailTemplateModel.isBatchAdding = true;
      this.submitStatus['batchingExcel'] = true;
    }
  }

  getErrorMessage(batchExcelValue) {
    const message = 'Provide heading';
    if (this.submitStatus['status']) {
      if (this.submitStatus['batchingExcel']) {
        return 'Provide heading before adding';
      } else if (!this.submitStatus['batchSave']) {
        return message;
      }
      return this.emailTemplateModel.batchingExcelValues.length > 1 ? 'Provide heading or remove field' : message;
    } else {
      return !this.submitStatus['batchingExcel'] ? message : 'Provide heading before adding';
    }
  }

  onBatchValueChange(event: Event, batchValue) {
    if (utils.isEmpty(event['target']['value'])) {
      batchValue['name'] = '';
    }
    batchValue['invalid'] = !batchValue['name'];
  }

  setFromDefault(dataElements) {
    const suggestions = this.templateUtils.filterDataElements(this.dataElements, { query: '' });
    dataElements.forEach(data => {
      const association = suggestions.find(
        suggestion => suggestion.id === data['name']['id']
      );
      data['name']['association'] = association['association'];
    });
    this.emailTemplateModel.batchingExcelValues = dataElements;
    this.setBatchElements.emit(this.emailTemplateModel.batchingExcelValues);
  }

  removeBatchExcelElement(index: number) {
    this.emailTemplateModel.isBatchAdding = false;
    this.emailTemplateModel.batchingExcelValues.splice(index, 1);
    this.submitStatus['batchSave'] = false;
    this.setBatchElements.emit(this.emailTemplateModel.batchingExcelValues);
  }

  submit() {
    const emptyElements = this.emailTemplateModel.batchingExcelValues.filter(value => !value.name);
    if (emptyElements.length) {
      this.emailTemplateModel.batchingExcelValues.forEach(batchValue => {
        batchValue['invalid'] = true;
      });
    }
    return !emptyElements.length;
  }

}
