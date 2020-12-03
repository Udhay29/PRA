import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as utils from 'lodash';
import { MessageService } from 'primeng/components/common/messageservice';

import { CreateDocumentationModel } from '../model/create-standard-doucmentation.model';
import { OptionalAttributesModel
 } from '../../../../../view-agreement-details/accessorials/shared/models/optional-attributes.model';
import { HttpErrorResponse } from '@angular/common/http';
import { CreateStandardDocumentationService } from './create-standard-documentation.service';
import { takeWhile } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CreateStandardDocumentationUtilityService {
  constructor(private readonly createDocumentationService: CreateStandardDocumentationService) {
  }
  documentationPostFramer(documentationModel: CreateDocumentationModel,
    optionalModel: OptionalAttributesModel) {
  return {
      customerAccessorialDocumentConfigurationId: null,
      effectiveDate: this.postDateFormatter(documentationModel.documentationForm.controls['effectiveDate'].value),
      expirationDate: this.postDateFormatter(documentationModel.documentationForm.controls['expirationDate'].value),
      customerAgreementId: null,
      accessorialDocumentTypeId: documentationModel.selectedDocumentType['value'],
      accessorialDocumentType: documentationModel.selectedDocumentType['label'],
      accessorialGroupTypeId: (documentationModel.documentationForm.controls['groupName'].value) ?
        documentationModel.documentationForm.controls['groupName'].value['value'] : null,
      accessorialGroupTypeName: (documentationModel.documentationForm.controls['groupName'].value) ?
        documentationModel.documentationForm.controls['groupName'].value['label'] : null,
      documentationCategory: documentationModel.documentationForm.controls['documentCategorySelect'].value,
      equipmentCategoryCode: (optionalModel.optionalForm.controls['equipmentCategory'].value) ?
        optionalModel.optionalForm.controls['equipmentCategory'].value['value'] : null,
      equipmentTypeCode: (optionalModel.optionalForm.controls['equipmentType'].value) ?
        optionalModel.optionalForm.controls['equipmentType'].value['value'] : null,
      equipmentLengthId: (optionalModel.optionalForm.controls['equipmentLength'].value) ?
        optionalModel.optionalForm.controls['equipmentLength'].value['id'] : null,
      equipmentTypeId: (optionalModel.optionalForm.controls['equipmentType'].value) ?
      optionalModel.equipTypeId : null,
      customerAccessorialAccountDTOs: null,
      equipmentLengthDescription: (optionalModel.optionalForm.controls['equipmentLength'].value) ?
      optionalModel.optionalForm.controls['equipmentLength'].value['value'] : null,
      businessUnitServiceOfferingDTOs: (!utils.isEmpty(optionalModel.serviceLevelValues)) ?
        this.iterateBusinessUnitValues(optionalModel) : null,
        customerAccessorialDocumentChargeTypeDTOs: (!utils.isEmpty(optionalModel.optionalForm.controls['chargeType'].value)) ?
        this.iterateChargeTypeValues(optionalModel) : null,
      requestServiceDTOs: (!utils.isEmpty(optionalModel.optionalForm.controls['requestedService'].value)) ?
        this.iterateRequestedService(optionalModel) : null,
      carrierDTOs: (!utils.isEmpty(optionalModel.optionalForm.controls['carriers'].value)) ? this.iterateCarriers(optionalModel) : null,
      customerAccessorialTextDTO: (documentationModel.documentationForm.controls['documentCategorySelect'].value === 'Document Only')
        ? null : {
          customerAccessorialDocumentTextId: null,
          textName: documentationModel.documentationForm.controls['textName'].value,
          text: documentationModel.documentationForm.controls['textArea'].value
        },
      customerAccessorialAttachmentDTOs: (!utils.isEmpty(documentationModel.documentationForm.controls.attachment.value))
        ? this.customerAccessorialAttachmentDTOs(documentationModel) : null
    };
  }
  customerAccessorialAttachmentDTOs(documentationModel: CreateDocumentationModel) {
    let AttachmentDTO = [];
    if (!utils.isEmpty(documentationModel.documentationForm.controls.attachment.value)) {
      documentationModel.documentationForm.controls.attachment.value.forEach(attachmentElementValue => {
        AttachmentDTO.push({
          accessorialAttachmentTypeDTO: {
            accessorialAttachmentTypeId: attachmentElementValue.attachmentType.id,
            accessorialAttachmentTypeName: attachmentElementValue.attachmentType.value
          },
          documentNumber: attachmentElementValue.documentId,
          documentName: attachmentElementValue.filename

        });
      });
    }
    AttachmentDTO = utils.sortBy(AttachmentDTO, 'documentName');
    return AttachmentDTO;
  }
  iterateChargeTypeValues(optionalModel: OptionalAttributesModel) {
    let chargeTypeValues = [];
    if (!utils.isEmpty(optionalModel.optionalForm.controls['chargeType'].value)) {
      optionalModel.optionalForm.controls['chargeType'].value.forEach(chargeTypeElement => {
        chargeTypeValues.push({
          chargeTypeId: Number(chargeTypeElement.value),
          chargeTypeName: chargeTypeElement.label
        });
      });
    }
    chargeTypeValues = utils.sortBy(chargeTypeValues, 'chargeTypeName');
    return chargeTypeValues;
  }
  iterateBusinessUnitValues(optionalModel: OptionalAttributesModel) {
    let businessUnits = [];
    if (!utils.isEmpty(optionalModel.serviceLevelValues && optionalModel.optionalForm.controls['businessUnit'].value)) {
      optionalModel.optionalForm.controls['businessUnit'].value.forEach(businessUnitValues => {
        optionalModel.serviceLevelResponse.forEach((serviceLevel) => {
          const businessUnit = {
            customerAccessorialServiceLevelBusinessUnitServiceOfferingId: null,
            serviceLevelBusinessUnitServiceOfferingAssociationId: null,
            businessUnit: businessUnitValues['financeBusinessUnitCode'],
            serviceOffering: businessUnitValues['serviceOfferingDescription'],
            serviceOfferingCode:  businessUnitValues['serviceOfferingCode'],
            businessUnitDisplayName:
             `${businessUnitValues['financeBusinessUnitCode']} - ${businessUnitValues['serviceOfferingDescription']}`,
            serviceLevel: null
          };
          const businessData = this.serviceLevelValidation(businessUnitValues, optionalModel, serviceLevel, businessUnit);
          if (!utils.isEmpty(businessData)) {
            businessUnits.push(businessData);
          }
        });
      });
    }
    businessUnits = utils.sortBy(businessUnits, 'businessUnitDisplayName');
    return businessUnits;
  }
  serviceLevelValidation(businessUnitValues, optionalModel, serviceLevel, businessUnit) {
    let businessUnits;
    const businessAssocicationId = businessUnitValues.financeBusinessUnitServiceOfferingAssociationID;
    const serviceAssociationId =
      serviceLevel.financeBusinessUnitServiceOfferingAssociation.financeBusinessUnitServiceOfferingAssociationID;
    if (businessAssocicationId === serviceAssociationId && !utils.isEmpty(optionalModel.optionalForm.controls['serviceLevel'].value)) {
      optionalModel.optionalForm.controls['serviceLevel'].value.forEach(element => {
        if (element.label.toLowerCase() === serviceLevel.serviceLevel['serviceLevelDescription'].toLowerCase()) {
          businessUnit.serviceLevel = serviceLevel.serviceLevel.serviceLevelDescription;
          businessUnit.serviceLevelCode = serviceLevel.serviceLevel.serviceLevelCode;
          businessUnit.serviceLevelBusinessUnitServiceOfferingAssociationId =
            serviceLevel.serviceLevelBusinessUnitServiceOfferingAssociationID;
          businessUnits = businessUnit;
        }
      });
    }
    return businessUnits;
  }
  iterateRequestedService(optionalModel: OptionalAttributesModel) {
    let requestedServices = [];
    if (!utils.isEmpty(optionalModel.optionalForm.controls['requestedService'].value)) {
      optionalModel.optionalForm.controls['requestedService'].value.forEach(requestedServicesElement => {
        requestedServices.push({
          customerAccessorialRequestServiceId: null,
          requestedServiceTypeId: null,
          requestedServiceTypeCode: requestedServicesElement
        });
      });
    }
    requestedServices = utils.sortBy(requestedServices, 'requestedServiceTypeCode');
    return requestedServices;
  }
  iterateCarriers(optionalModel: OptionalAttributesModel) {
    let carriers = [];
    if (!utils.isEmpty(optionalModel.optionalForm.controls['carriers'].value)) {
      optionalModel.optionalForm.controls['carriers'].value.forEach(carriersElement => {
        carriers.push({
          customerAccessorialRequestServiceId: null,
          carrierId: Number(carriersElement.value['id']),
          carrierCode: carriersElement.value['code'],
          carrierDisplayName: `${carriersElement.value['name']} (${carriersElement.value['code']})`
        });
      });
    }
    carriers = utils.sortBy(carriers, 'carrierDisplayName');
    return carriers;
  }
  postDateFormatter(value: string | Date): string {
    return moment(value).format('YYYY-MM-DD');
  }
  toastMessage(messageService: MessageService, key: string, type: string, data: string) {
    const message = {
      severity: key,
      summary: type,
      detail: data
    };
    messageService.clear();
    messageService.add(message);
  }
  handleError(error: HttpErrorResponse, messageService: MessageService) {
    if (!utils.isEmpty(error.error) && !utils.isEmpty(error.error.errors)) {
      messageService.clear();
      messageService.add({
        severity: 'error',
        summary: error.error.errors[0].errorType,
        detail: error.error.errors[0].errorMessage
      });
    }
  }
  dateFormatter(value: string | Date): string {
    return moment(value).format('MM/DD/YYYY');
  }
  setSuperUserBackDateDays(createDocumentationModel: CreateDocumentationModel) {
    this.createDocumentationService.getSuperUserBackDate()
    .pipe(takeWhile(() => createDocumentationModel.isSubscribeFlag))
    .subscribe((backDateRes) => {
      createDocumentationModel.superUserBackDateDays =
        +backDateRes['_embedded']['configurationParameterDetails'][0]['configurationParameterValue'];
    });
  }

  setSuperUserFutureDateDays(createDocumentationModel: CreateDocumentationModel) {
    this.createDocumentationService.getSuperFutureBackDate()
    .pipe(takeWhile(() => createDocumentationModel.isSubscribeFlag))
    .subscribe((backDateRes) => {
      createDocumentationModel.superUserFutureDateDays =
        +backDateRes['_embedded']['configurationParameterDetails'][0]['configurationParameterValue'];
    });
  }
}
