import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { EmailTemplateModel } from '../model/email-template-model.model';
import { TemplateUtilsService } from '../service/template-utils.service';

@Component({
  selector: 'app-template-signature',
  templateUrl: './template-signature.component.html',
  styleUrls: ['./template-signature.component.scss']
})
export class TemplateSignatureComponent implements OnInit {

  @Input() signatureForm: FormGroup;
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
    const control = this.signatureForm.get(controlName) as FormArray;
    control.controls.forEach(emailBodyControl => {
      emailBodyControl['controls']['text'].setValidators([Validators.required]);
      emailBodyControl['controls']['text'].markAsTouched();
      emailBodyControl['controls']['text'].updateValueAndValidity();
    });
    if (control.getRawValue().filter(value => value.text === '').length) {
      this.submitStatus[controlName] = true;
    } else {
      control.push(this.fb.group(form));
      this.submitStatus[controlName] = false;
      this.submitStatus[saveControl] = false;
    }
    control.updateValueAndValidity();
  }

  removeControl(index: number, controlName: string, saveControl: string) {
    this.emailTemplateModel.isShowPopUp = true;
    this.emailTemplateModel.popUpHeader = 'Remove Line';
    this.emailTemplateModel.popUpText = `Are you sure you would like to remove Line ${index + 1} from the Signature?`;
    this.emailTemplateModel.controlNameToRemove = controlName;
    this.emailTemplateModel.saveControlToRemove = saveControl;
    this.emailTemplateModel.indexToRemove = index;
  }

  getSignatureError(controlName: string, saveControl: string): string {
    return this.templateUtils.returnErrorMessage(this.submitStatus, controlName, this.signatureForm, 'line', saveControl);
  }

  onCancel() {
    this.emailTemplateModel.isShowPopUp = false;
  }

  onProceed() {
    this.emailTemplateModel.isShowPopUp = false;
    const control = this.signatureForm.get(this.emailTemplateModel.controlNameToRemove) as FormArray;
    control.controls.splice(this.emailTemplateModel.indexToRemove, 1);
    this.submitStatus[this.emailTemplateModel.controlNameToRemove] = false;
    this.submitStatus[this.emailTemplateModel.saveControlToRemove] = false;
    if (control.length === 1 &&
      (!this.masterData || (this.masterData && this.masterData[this.emailTemplateModel.controlNameToRemove]['length']))) {
      control.controls.forEach(emailBodyControl => {
        emailBodyControl['controls']['text'].clearValidators();
        emailBodyControl['controls']['text'].updateValueAndValidity();
      });
    }
    control.updateValueAndValidity();
  }

  checkRequiredLineStatus(controlName: string, index: number) {
    const control = this.signatureForm.get(controlName) as FormArray;
    const field = control['controls'][index]['controls']['text'];
    return !(field['validator'] && field['validator']['length']);
  }

}
