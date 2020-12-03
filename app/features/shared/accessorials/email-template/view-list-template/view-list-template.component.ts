import { MessageService } from 'primeng/components/common/messageservice';
import { Component, OnInit } from '@angular/core';
import { ViewTemplateModel } from './model/viewtemplate.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ViewtemplateService } from '../view-list-template/service/viewtemplate.service';
import { ListingDetails } from '../view-list-template/model/viewtemplate.interface';
import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';
import { TimeZoneService } from '../../../../../shared/jbh-app-services/time-zone.service';
import { LocalStorageService } from './../../../../../shared/jbh-app-services/local-storage.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-list-template',
  templateUrl: './view-list-template.component.html',
  styleUrls: ['./view-list-template.component.scss']
})
export class ViewListTemplateComponent implements OnInit {

  viewTemplateModel: ViewTemplateModel;

  constructor(private readonly fb: FormBuilder
    , private readonly viewtemplateService: ViewtemplateService,
    private readonly messageService: MessageService,
    private readonly timeZoneService: TimeZoneService, private readonly localStore: LocalStorageService,
    private readonly router: Router, private readonly activatedRoute: ActivatedRoute) {
    this.viewTemplateModel = new ViewTemplateModel();
    this.viewTemplateModel.idParam = this.activatedRoute.queryParams['_value']['templateId'];
  }

  ngOnInit() {
    this.viewTemplateModel.header = 'VIEW MASTER EMAIL TEMPLATE';
    this.viewTemplateModel.defaultHeader = 'VIEW DEFAULT EMAIL TEMPLATE';
    this.initForm();
    this.loadMasterDetails();
    this.loadListDetails();
    this.viewTemplateModel.overflowMenuList = this.overflowMenuList();
  }

  initForm() {
    this.viewTemplateModel.templateForm = this.fb.group({
      subjectText: [''],
      subjectDataElements: [''],
      introParagraph: this.fb.array([this.returnFormArray()]),
      bodyDataElements: [''],
      conclusionParagraph: this.fb.array([this.returnFormArray()]),
      signatureLine: ['']
    });
  }

  overflowMenuList() {
    return [{
      label: 'Edit'
    }];
  }

  returnFormArray(): FormGroup {
    return this.fb.group({
      name: ['']
    });
  }

  loadMasterDetails() {
    const param = '?emailTemplateTypeName=Master';
    this.viewtemplateService.getDetailedMasterView(param).pipe(takeWhile(() =>
      this.viewTemplateModel.subscriberFlag)).subscribe((response: ListingDetails) => {
        if (!utils.isEmpty(response)) {
          this.viewTemplateModel.viewMasterTemplateDetails = response;
        }
      });
  }

  loadListDetails() {
    this.viewtemplateService.getDetailedView(this.viewTemplateModel.idParam).pipe(takeWhile(() =>
      this.viewTemplateModel.subscriberFlag)).subscribe((response: ListingDetails) => {
        if (!utils.isEmpty(response)) {
          if (response['responseStatus'] === 'PARTIAL') {
            const invaliderrorMessages = `${response['errorMessages'].toString().replace(/[,]/gi, '.<br>')}.`;
            const messages = {
              severity: 'warn',
              summary: 'Warning',
              detail: invaliderrorMessages
            };
            this.messageService.add(messages);
          }
          this.viewTemplateModel.viewTemplateDetails = response;
          if (response.emailTemplateType.emailTemplateTypeName === 'Default') {
            this.textInputValues(this.viewTemplateModel.viewMasterTemplateDetails);
            this.textInputValues(this.viewTemplateModel.viewTemplateDetails);
            this.dataElementValues(this.viewTemplateModel.viewMasterTemplateDetails);
            this.dataElementValues(this.viewTemplateModel.viewTemplateDetails);
          } else {
            this.textInputValues(this.viewTemplateModel.viewTemplateDetails);
            this.dataElementValues(this.viewTemplateModel.viewTemplateDetails);
          }
          const dateValue = response['lastUpdateTimestamp'].toString();
          this.viewTemplateModel.viewTemplateDetails.lastUpdateTimestamp =
            this.timeZoneService.convertToLocalMilitaryUpdatedTime(dateValue);
        }
      });
  }

  textInputValues(response) {
    if (!utils.isEmpty(response['emailTemplateTexts'])) {
      const dataInlineEmail = response['emailTemplateTexts'];
      dataInlineEmail.forEach(data => {
        if (data.emailTemplatePartType.emailTemplatePartTypeName === 'Subject' && data.emailTemplateText !== '') {
          this.viewTemplateModel.subjectArray.push(data.emailTemplateText);
        } else if (data.emailTemplatePartType.emailTemplatePartTypeName === 'Email Body Introduction') {
          this.viewTemplateModel.introArray.push(data.emailTemplateText);
        } else if (data.emailTemplatePartType.emailTemplatePartTypeName === 'Email Body Conclusion') {
          this.viewTemplateModel.conclusionArray.push(data.emailTemplateText);
        } else if (data.emailTemplateText !== '' && data.emailTemplatePartType.emailTemplatePartTypeName === 'Signature') {
          this.signatureValue(response, data);
        }
      });
    }
  }

  dataElementValues(response) {
    if (!utils.isEmpty(response['emailTemplatePartAttributes'])) {
      const checkSignatureEmail = response['emailTemplatePartAttributes'];
      checkSignatureEmail.forEach(data => {
        if (data.emailTemplateAttributeAssociation.emailTemplatePartType.emailTemplatePartTypeName === 'Subject') {
          this.viewTemplateModel.subjectValueArr.push
            (data.emailTemplateAttributeAssociation.emailTemplateAttribute.emailTemplateAttributeName);
        } else if (data.emailTemplateAttributeAssociation.emailTemplatePartType.emailTemplatePartTypeName === 'Email Body') {
          this.viewTemplateModel.emailBodyValueArr.push
            (data.emailTemplateAttributeAssociation.emailTemplateAttribute.emailTemplateAttributeName);
        } else if (data.emailTemplateAttributeAssociation.emailTemplatePartType.emailTemplatePartTypeName === 'Batch Excel') {
          this.viewTemplateModel.batchExcelArr.push
            (data.emailTemplateAttributeAssociation.emailTemplateAttribute.emailTemplateAttributeName);
        } else if (data.emailTemplateAttributeAssociation.emailTemplatePartType.emailTemplatePartTypeName === 'Default Excel') {
          this.viewTemplateModel.defaultExcelArr.push
            (data.emailTemplateAttributeAssociation.emailTemplateAttribute.emailTemplateAttributeName);
        }
      });
    }
  }

  signatureValue(response, data) {
    if (response.emailTemplateType.emailTemplateTypeName === 'Default') {
      this.viewTemplateModel.defaultSignatureArray.push(data.emailTemplateText);
    } else {
      this.viewTemplateModel.masterSignatureArray.push(data.emailTemplateText);
    }
  }

  onClickClose() {
    this.localStore.setAccessorialTab('accessType', 'create', { id: 3, text: 'emails' });
    this.router.navigateByUrl('/standard');
  }
}
