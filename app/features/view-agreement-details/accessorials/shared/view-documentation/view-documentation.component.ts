import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import * as utils from 'lodash';
import * as moment from 'moment';
import { LocalStorageService } from './../../../../../shared/jbh-app-services/local-storage.service';

import { ViewDocumentationModel } from './models/view-documentation.model';
import { CreateRateUtilityService } from '../../rates/create-rates/service/create-rate-utility.service';
import { OptionalUtilityService } from '../../shared/services/optional-utility.service';
import { CreateRateService } from '../../rates/create-rates/service/create-rate.service';
import { TimeZoneService } from '../../../../../shared/jbh-app-services/time-zone.service';

@Component({
  selector: 'app-view-documentation',
  templateUrl: './view-documentation.component.html',
  styleUrls: ['./view-documentation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewDocumentationComponent {

  @Output() validateFormFields: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() createDocumentation: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() formfieldsValue;
  @Input() optionalFields;
  @Input() billTo;
  @Input() agreementID;
  @Input() documenationContext;
  @Input() fieldValues;
  @Input()
  set isEditFlagEnabled(isEditFlagEnabled: boolean) {
    this.viewDocumentationModel.isEditRateClicked = isEditFlagEnabled;
  }
  viewDocumentationModel: ViewDocumentationModel;

  constructor(
    private readonly createRateUtilityService: CreateRateUtilityService,
    private readonly optionalUtilityService: OptionalUtilityService,
    private readonly createRateService: CreateRateService,
    private readonly router: Router,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly localStore: LocalStorageService,
    private readonly timeZone: TimeZoneService
  ) {
    this.viewDocumentationModel = new ViewDocumentationModel();
  }

  onRefresh() {
    this.validateFormFields.emit(true);
    const refreshedDocument = this.optionalUtilityService.getDocumentationValid();
    if (refreshedDocument['refreshed'] && refreshedDocument['validForm']) {
      this.refreshDocument();
    }
  }
  refreshDocument() {
    const params = this.createRateUtilityService.
      onRefreshRatePostFramer(this.fieldValues, this.formfieldsValue, this.optionalFields['optionalAttributesModel'],
        this.billTo['billToModel'], this.agreementID);
    this.createRateService.getRatesDocumentation(params, this.agreementID)
      .subscribe((documentation) => {
        this.refreshData(documentation);
        this.changeDetector.detectChanges();
      });
  }
  refreshData(documentation) {
    if (documentation.length === 2) {
      this.legalInstructionalDocumentation(documentation);
    } else if (documentation.length === 1) {
      this.legalOrInstructionalDocumentation(documentation);
    } else {
      this.viewDocumentationModel.noDocumentationFound = true;
    }
  }
  legalInstructionalDocumentation(documentation) {
    let legalRef = null;
    let instructionalRef = null;
    this.viewDocumentationModel.attachments = [];
    if (documentation[0]['accessorialDocumentTypeName'] === 'Legal') {
      this.viewDocumentationModel.documentTypeID = documentation[0]['customerAccessorialDocumentTextId'];
      legalRef = documentation[0];
      instructionalRef = documentation[1];
    } else {
      legalRef = documentation[1];
      instructionalRef = documentation[0];
    }
    if (legalRef.attachments) {
      this.viewDocumentationModel.legalAttachments = legalRef.attachments;
    }
    if (instructionalRef.attachments) {
      this.viewDocumentationModel.instructionalAttachments = instructionalRef.attachments;
    }
    this.setAttachment();
    this.viewDocumentationModel.docIsLegalText = true;
    this.viewDocumentationModel.docIsInstructionalText = true;
    this.viewDocumentationModel.legalTextArea = legalRef['text'];
    this.viewDocumentationModel.instructionalTextArea = instructionalRef['text'];
    this.viewDocumentationModel.legalStartDate = this.dateFormatter(legalRef['effectiveDate']);
    this.viewDocumentationModel.legalEndDate = this.dateFormatter(legalRef['expirationDate']);
    this.viewDocumentationModel.instructionStartDate = this.dateFormatter(instructionalRef['effectiveDate']);
    this.viewDocumentationModel.instructionEndDate = this.dateFormatter(instructionalRef['expirationDate']);
    this.changeDetector.detectChanges();
  }
  legalOrInstructionalDocumentation(documentation) {
    let legalRef = null;
    let instructionalRef = null;
    this.viewDocumentationModel.attachments = [];
    if (documentation[0]['accessorialDocumentTypeName'] === 'Legal') {
      legalRef = documentation[0];
      this.viewDocumentationModel.legalTextArea = legalRef['text'];
      this.viewDocumentationModel.docIsLegalText = true;
      this.viewDocumentationModel.legalStartDate = this.dateFormatter(legalRef['effectiveDate']);
      this.viewDocumentationModel.legalEndDate = this.dateFormatter(legalRef['expirationDate']);
      if (legalRef.attachments) {
        this.viewDocumentationModel.legalAttachments = legalRef.attachments;
      }
    } else {
      instructionalRef = documentation[0];
      this.viewDocumentationModel.instructionalTextArea = instructionalRef['text'];
      this.viewDocumentationModel.noDocumentationFound = true;
      this.viewDocumentationModel.docIsInstructionalText = true;
      this.viewDocumentationModel.instructionStartDate = this.dateFormatter(instructionalRef['effectiveDate']);
      this.viewDocumentationModel.instructionEndDate = this.dateFormatter(instructionalRef['expirationDate']);
      if (instructionalRef.attachments) {
        this.viewDocumentationModel.instructionalAttachments = instructionalRef.attachments;
      }
    }
    this.setAttachment();
    this.changeDetector.detectChanges();
  }
  setAttachment() {
    this.viewDocumentationModel.attachments = this.viewDocumentationModel.legalAttachments
    .concat(this.viewDocumentationModel.instructionalAttachments);
  }
  noDocFoundPopupYes() {
    this.createDocumentation.emit(true);
    this.localStore.setAccessorialTab('accessType', 'create', { id: 1, text: 'documentation' });
    this.router.navigate(['/viewagreement/documentation'], { queryParams: { id: this.agreementID } });
    const scrollableElement = document.body.querySelector('.router-container');
    if (scrollableElement) {
      scrollableElement.scrollTop = 0;
    }
  }
  noDocFoundPopupNo() {
    this.viewDocumentationModel.noDocumentationFound = false;
  }
  removeDocument(field: string) {
    if (field === 'legal') {
      this.viewDocumentationModel.docIsLegalText = false;
      this.viewDocumentationModel.legalTextArea = '';
      this.viewDocumentationModel.legalStartDate = '';
      this.viewDocumentationModel.legalEndDate = '';
      this.viewDocumentationModel.attachments =
      utils.differenceBy(this.viewDocumentationModel.attachments, this.viewDocumentationModel.legalAttachments, 'documentNumber');
      this.viewDocumentationModel.legalAttachments = [];
    } else {
      this.viewDocumentationModel.docIsInstructionalText = false;
      this.viewDocumentationModel.instructionalTextArea = '';
      this.viewDocumentationModel.instructionStartDate = '';
      this.viewDocumentationModel.instructionEndDate = '';
      this.viewDocumentationModel.attachments =
      utils.differenceBy(this.viewDocumentationModel.attachments, this.viewDocumentationModel.instructionalAttachments, 'documentNumber');
      this.viewDocumentationModel.instructionalAttachments = [];
    }
    this.changeDetector.detectChanges();
  }
  dateFormatter(value: string | Date): string {
    return moment(value).format('MM/DD/YYYY');
  }
}
