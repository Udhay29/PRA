import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import * as utils from 'lodash';

import { TemplateUtilsService } from '../service/template-utils.service';
import { EmailTemplateModel } from '../model/email-template-model.model';

@Component({
  selector: 'app-template-body',
  templateUrl: './template-body.component.html',
  styleUrls: ['./template-body.component.scss']
})
export class TemplateBodyComponent implements OnInit {

  @Input() bodyForm: FormGroup;
  @Input() dataElements;
  @Input() submitStatus;
  emailTemplateModel: EmailTemplateModel;
  @Input() masterData;

  constructor(private readonly fb: FormBuilder, private readonly templateUtils: TemplateUtilsService) {
    this.emailTemplateModel = new EmailTemplateModel();
  }

  ngOnInit() {
  }

  addControl(controlName: string, saveControl: string) {
    const form = {
      'text': ['', [Validators.required]]
    };
    const control = this.bodyForm.get(controlName) as FormArray;
    control.controls.forEach(emailBodyControl => {
      emailBodyControl['controls']['text'].setValidators([Validators.required]);
      emailBodyControl['controls']['text'].markAsTouched();
      emailBodyControl['controls']['text'].updateValueAndValidity();
    });
    if (control.getRawValue().filter(value => value.text === '').length) {
      this.submitStatus[controlName] = true;
    } else {
      this.submitStatus[controlName] = false;
      this.submitStatus[saveControl] = false;
      control.push(this.fb.group(form));
    }
  }

  removeControl(index: number, controlName: string, saveControl: string) {
    this.emailTemplateModel.isShowPopUp = true;
    this.emailTemplateModel.popUpHeader = 'Remove Paragraph';
    this.emailTemplateModel.popUpText = `Are you sure you would like to remove Paragraph ${index + 1} from the
    ${controlName === 'conclusionParagraph' ? 'Conclusion' : 'Introduction'}?`;
    this.emailTemplateModel.controlNameToRemove = controlName;
    this.emailTemplateModel.saveControlToRemove = saveControl;
    this.emailTemplateModel.indexToRemove = index;
  }

  filterSubjectData(event: Event) {
    this.emailTemplateModel.bodyElements = this.templateUtils.filterDataElements(this.dataElements, event);
    if (this.masterData && this.masterData['bodyDataElements']) {
      this.emailTemplateModel.bodyElements = utils.differenceBy(this.emailTemplateModel.bodyElements,
        this.masterData['bodyDataElements'], 'id');
    }
    this.emailTemplateModel.bodyElements = utils.differenceBy(this.emailTemplateModel.bodyElements,
      this.bodyForm.controls.bodyDataElements.value, 'id');
  }

  getIntroError(controlName: string, saveControl: string): string {
    return this.templateUtils.returnErrorMessage(this.submitStatus, controlName, this.bodyForm, 'paragraph', saveControl);
  }

  onCancel() {
    this.emailTemplateModel.isShowPopUp = false;
  }

  onProceed() {
    this.emailTemplateModel.isShowPopUp = false;
    const control = this.bodyForm.get(this.emailTemplateModel.controlNameToRemove) as FormArray;
    control.controls.splice(this.emailTemplateModel.indexToRemove, 1);
    this.submitStatus[this.emailTemplateModel.controlNameToRemove] = false;
    this.submitStatus[this.emailTemplateModel.saveControlToRemove] = false;
    if (this.masterData && this.masterData[this.emailTemplateModel.controlNameToRemove]['length'] && control['length'] === 1) {
      control.controls.forEach(emailBodyControl => {
        emailBodyControl['controls']['text'].clearValidators();
        emailBodyControl['controls']['text'].updateValueAndValidity();
      });
      control.updateValueAndValidity();
    }
  }

  checkRequiredStatus(controlName: string, index: number) {
    const control = this.bodyForm.get(controlName) as FormArray;
    const field = control['controls'][index]['controls']['text'];
    return !(field['validator'] && field['validator']['length']);
  }

  checkElementRequiredStatus(controlName: string) {
    const control = this.bodyForm.get(controlName);
    return !(control['validator'] && control['validator']['length']);
  }

}
