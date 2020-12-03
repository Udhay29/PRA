import { Injectable, ChangeDetectorRef } from '@angular/core';
import * as utils from 'lodash';
import { MessageService } from 'primeng/components/common/messageservice';
import { DrayGroupModel } from '../model/dray-group.model';

@Injectable({
  providedIn: 'root'
})
export class DrayGroupUtilsService {

  constructor() { }

  handleError(error, model: DrayGroupModel, messageService: MessageService,
    changeDetector: ChangeDetectorRef) {
    model.isPageLoading = false;
    if (!utils.isEmpty(error.error) && !utils.isEmpty(error.error.errors)) {
      messageService.clear();
      if (error.error.errors[0].code === 'DRAY_GROUP_CODE_DUPLICATION_EXCEPTION') {
        messageService.add({ severity: 'error', summary: 'Group Name Exists', detail: error.error.errors[0].errorMessage });
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
}
