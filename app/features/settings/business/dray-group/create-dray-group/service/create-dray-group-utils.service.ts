import { Injectable, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { CreateDrayGroupService } from './create-dray-group.service';
import { DrayGroupModel } from '../models/dray-group.model';
import { MessageService } from 'primeng/components/common/messageservice';
import * as utils from 'lodash';

@Injectable()
export class CreateDrayGroupUtilsService {

  constructor(private readonly drayGrpService: CreateDrayGroupService) {
  }

  toastMessage(messageService: MessageService, key: string, data: string) {
    const message = {
      severity: key,
      summary: (key === 'error') ? 'Error' : 'Dray Group Created!',
      detail: data
    };
    messageService.clear();
    messageService.add(message);
  }

  fieldValidationMessage(messageService: MessageService, key: string, data: string) {
    const message = {
      severity: key,
      summary: 'Missing Required Information',
      detail: data
    };
    messageService.clear();
    messageService.add(message);
  }

  handleError(error, model: DrayGroupModel, messageService: MessageService,
    changeDetector: ChangeDetectorRef) {
    model.isPageLoading = false;
    if (!utils.isEmpty(error.error) && !utils.isEmpty(error.error.errors)) {
      messageService.clear();
      if (error.error.errors[0].code === 'DRAY_GROUP_CODE_DUPLICATION_EXCEPTION') {
        messageService.add({ severity: 'error', summary: 'Group Code Exists', detail: error.error.errors[0].errorMessage });
      } else if (error.error.errors[0].code === 'DRAY_GROUP_NAME_DUPLICATION_EXCEPTION') {
        messageService.add({ severity: 'error', summary: 'Group Name Exists', detail: error.error.errors[0].errorMessage });
      } else if (error.error.errors[0].code === 'DRAY_GROUP_NAME_AND_CODE_DUPLICATION_EXCEPTION') {
        messageService.add({ severity: 'error', summary: 'Group Name and Code Exists', detail: error.error.errors[0].errorMessage });
      } else {
        messageService.add({ severity: 'error', summary: error.error.errors[0].errorType, detail: error.error.errors[0].errorMessage });
      }
    }
    changeDetector.detectChanges();
  }

  saveRequestDateFormatter(value: string | Date): string {
    return moment(value).format('YYYY-MM-DD');
  }

  drayGroupPostFramer(draygroupModel) {
    return {
      drayGroupName: draygroupModel.drayGroupForm.controls['drayGroupName'].value.trim(),
      drayGroupCode: draygroupModel.drayGroupForm.controls['drayGroupCode'].value.trim(),
      rateScopeTypeName: draygroupModel.scopeObj[0]['drayGroupCountryName'],
      rateScopeTypeID: draygroupModel.scopeObj[0]['drayGroupCountryCode'],
      effectiveDate: this.saveRequestDateFormatter
        (draygroupModel.drayGroupForm.controls['effectiveDate'].value),
      expirationDate: this.saveRequestDateFormatter
        (draygroupModel.drayGroupForm.controls['expirationDate'].value),
      drayGroupCountries: utils.orderBy(draygroupModel.drayGroupForm.controls['drayGroupCountries'].value,
      ['drayGroupCountryName'], ['asc'])
    };
  }
}
