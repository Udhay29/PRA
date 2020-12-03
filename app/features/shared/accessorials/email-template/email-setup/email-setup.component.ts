import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TemplateService } from '../service/template.service';
import { EmailTemplateModel } from '../model/email-template-model.model';
import { TemplateUtilsService } from '../service/template-utils.service';
import { FormGroup } from '@angular/forms';
import * as utils from 'lodash';


@Component({
  selector: 'app-email-setup',
  templateUrl: './email-setup.component.html',
  styleUrls: ['./email-setup.component.scss']
})
export class EmailSetupComponent implements OnInit {

  emailTemplateModel: EmailTemplateModel;
  @Input() setUpForm: FormGroup;
  @Output() duplicateCheck: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private readonly templateService: TemplateService, private readonly templateUtils: TemplateUtilsService) {
    this.emailTemplateModel = new EmailTemplateModel();
  }

  ngOnInit() {
    this.getNotificationTypes();
    this.getChargeTypes();
  }

  getNotificationTypes() {
    this.templateService.getNotificationTypes().subscribe(res => {
      this.emailTemplateModel.notificationTypes = this.getSuggestions(res['_embedded']['accessorialNotificationTypes'],
        'accessorialNotificationTypeId', 'accessorialNotificationTypeName');
    });
  }

  getChargeTypes() {
    this.templateService.getChargeTypes().subscribe(res => {
      this.emailTemplateModel.chargeTypes = this.getSuggestions(res, 'chargeTypeID', 'chargeTypeName', 'chargeTypeCode');
    });
  }

  getSuggestions(data, id: string, name: string, code?: string) {
    const suggestions = [];
    data.forEach(dataElement => {
      suggestions.push({
        'id': dataElement[id],
        'name': dataElement[name],
        'code': dataElement[code],
        'label': `${dataElement[name]} (${dataElement[code]})`
      });
    });
    return suggestions;
  }

  getFilteredSuggestions(event: Event, control: string) {
    const baseControl = control === 'filteredChargeTypes' ? 'chargeTypes' : 'notificationTypes';
    this.emailTemplateModel[control] = this.templateUtils.filterDataElements(this.emailTemplateModel[baseControl], event);
  }

  checkDuplicate() {
    const notificationType = this.setUpForm.get('notificationType').value,
      chargeType = this.setUpForm.get('chargeType').value;
    if (notificationType && chargeType) {
      this.templateService.checkDefaultTemplateExists(notificationType['id'], chargeType['id']).subscribe(res => {
        if (res) {
          this.emailTemplateModel.duplicateMessages = [];
          this.emailTemplateModel.duplicateMessages.push({
            severity: 'error', summary: 'Default Template Already Exists',
            // tslint:disable-next-line:max-line-length
            detail: 'This combination of options are identical to an existing Default template. Cancel creating this template or make changes to the existing fields.'
          });
          this.duplicateCheck.emit(true);
        } else {
          this.emailTemplateModel.duplicateMessages = [];
          this.duplicateCheck.emit(false);
        }
      });
    }
  }

  onBlur(event: Event, control: string) {
    if (utils.isEmpty(event['target']['value'])) {
      this.setUpForm.controls[control].setValue('');
      this.setUpForm.controls[control].updateValueAndValidity();
    }
  }

}
