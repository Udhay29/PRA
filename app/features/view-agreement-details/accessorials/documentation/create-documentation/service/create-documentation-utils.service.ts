import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as utils from 'lodash';
import { CreateDocumentationModel } from '../model/create-documentation.model';
import { OptionalAttributesModel } from '../../../shared/models/optional-attributes.model';
import { BillToModel } from '../../../shared/billto-list/model/bill-to.model';
import { takeWhile } from 'rxjs/operators';
import { CreateDocumentationService } from './create-documentation.service';

@Injectable({
  providedIn: 'root'
})
export class CreateDocumentationUtilsService {

  constructor(private readonly createDocumentationService: CreateDocumentationService) {
  }

  documentationPostFramer(documentationModel: CreateDocumentationModel,
    optionalModel: OptionalAttributesModel, billToModel: BillToModel) {
    const framerObject = {
      customerAccessorialDocumentConfigurationId: null,
      effectiveDate: this.postDateFormatter(documentationModel.documentationForm.controls['effectiveDate'].value),
      expirationDate: this.postDateFormatter(documentationModel.documentationForm.controls['expirationDate'].value),
      customerAgreementId: documentationModel.agreementDetails['customerAgreementID'],
      accessorialDocumentTypeId: documentationModel.selectedDocumentType['value'],
      accessorialDocumentType: documentationModel.selectedDocumentType['label'],
      documentationCategory: documentationModel.documentationForm.controls['documentCategorySelect'].value,
      equipmentCategoryCode: (optionalModel.optionalForm.controls['equipmentCategory'].value) ?
        optionalModel.optionalForm.controls['equipmentCategory'].value['value'] : null,
      equipmentTypeCode: (optionalModel.optionalForm.controls['equipmentType'].value) ?
        optionalModel.optionalForm.controls['equipmentType'].value['value'] : null,
      equipmentLengthId: (optionalModel.optionalForm.controls['equipmentLength'].value) ?
        optionalModel.optionalForm.controls['equipmentLength'].value['id'] : null,
      equipmentTypeId: (optionalModel.optionalForm.controls['equipmentType'].value) ?
      optionalModel.equipTypeId : null,
      equipmentLengthDisplayName: (optionalModel.optionalForm.controls['equipmentLength'].value) ?
      optionalModel.optionalForm.controls['equipmentLength'].value['value'] : null,
      equipmentLength: (optionalModel.optionalForm.controls['equipmentLength'].value) ?
      optionalModel.optionalForm.controls['equipmentLength'].value['label'] : null,
      customerAccessorialDocumentChargeTypeDTOs: (!utils.isEmpty(optionalModel.optionalForm.controls['chargeType'].value)) ?
      this.iterateChargeTypeValues(optionalModel) : null,
      customerAccessorialAccountDTOs: this.iterateContractSection(documentationModel, billToModel),
      businessUnitServiceOfferingDTOs: (!utils.isEmpty(optionalModel.serviceLevelValues)) ?
        this.iterateBusinessUnitValues(optionalModel) : null,
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
    return framerObject;
  }
  customerAccessorialAttachmentDTOs(documentationModel: CreateDocumentationModel) {
    let AttachmentDTO = [];
    if (!utils.isEmpty(documentationModel.documentationForm.controls.attachment.value) &&
    (documentationModel.documentationForm.controls['documentCategorySelect'].value !== 'Text Only')) {
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
  iterateContractSection(documentationModel: CreateDocumentationModel, billToModel: BillToModel) {
    let contract;
    if (billToModel['selectedBillTo'] && billToModel['selectedBillTo'].length) {
      contract = this.iterateBillTos(documentationModel, billToModel);
    } else {
      contract = this.iterateContractSectionBillTo(documentationModel);
    }
    contract = utils.uniqWith(contract, utils.isEqual);
    contract = utils.sortBy(contract);
    return contract;
  }
  iterateBillTos(documentationModel: CreateDocumentationModel, billToModel: BillToModel) {
    let contract;
    if (utils.isEmpty(documentationModel['selectedContractValue']) && utils.isEmpty(documentationModel['selectedSectionValue'])) {
      contract = this.iterateAgreementBillTo(documentationModel, billToModel);
    } else {
      if (documentationModel['selectedContractValue'] && documentationModel['selectedContractValue'].length) {
        contract = this.iterateBillToContract(documentationModel, billToModel);
      } else if (documentationModel['selectedSectionValue'] && documentationModel['selectedSectionValue'].length) {
        contract = this.iterateBillToSection(documentationModel, billToModel);
      }
    }
    contract = utils.uniqWith(contract, utils.isEqual);
    contract = utils.sortBy(contract);
    return contract;
  }
  iterateAgreementBillTo(documentationModel: CreateDocumentationModel, billToModel: BillToModel) {
    let accountDetails = [];
    billToModel['selectedBillTo'] = utils.uniq(billToModel['selectedBillTo']);
    billToModel['selectedBillTo'].forEach((selectedBillToElement) => {
      accountDetails.push({
        customerAccessorialAccountId: null,
        customerAgreementContractSectionId: null,
        customerAgreementContractSectionName: null,
        customerAgreementContractId: null,
        customerAgreementContractName: null,
        customerAgreementContractSectionAccountId: selectedBillToElement['customerAgreementContractSectionAccountID'],
        customerAgreementContractSectionAccountName: selectedBillToElement['billToDetails']
      });
    });
    accountDetails = utils.sortBy(accountDetails);
    return accountDetails;
  }
  iterateBillToContract(documentationModel: CreateDocumentationModel, billToModel: BillToModel) {
    let accountDetails = [];
    billToModel['selectedBillTo'] = utils.uniq(billToModel['selectedBillTo']);
    billToModel['selectedBillTo'].forEach((selectedBillToElement) => {
      documentationModel['selectedContractValue'].forEach((contractElement) => {
        if (selectedBillToElement['customerAgreementContractID'] === contractElement['customerAgreementContractID']) {
          accountDetails.push({
            customerAccessorialAccountId: null,
            customerAgreementContractSectionId: null,
            customerAgreementContractSectionName: null,
            customerAgreementContractId: selectedBillToElement['customerAgreementContractID'],
            customerAgreementContractName: selectedBillToElement['customerContractName'],
            customerAgreementContractSectionAccountId: selectedBillToElement['customerAgreementContractSectionAccountID'],
            customerAgreementContractSectionAccountName: selectedBillToElement['billToDetails']
          });
        } else if (selectedBillToElement['customerAgreementContractID'] !== contractElement['customerAgreementContractID']) {
          contractElement['customerContractNumber'] = (contractElement['customerContractNumber']) ?
            contractElement['customerContractNumber'] : 'Transactional';
          accountDetails.push({
            customerAccessorialAccountId: null,
            customerAgreementContractSectionId: null,
            customerAgreementContractSectionName: null,
            customerAgreementContractId: contractElement['customerAgreementContractID'],
            customerAgreementContractName: `${contractElement['customerContractNumber']} (${contractElement['customerContractName']})`,
            customerAgreementContractSectionAccountId: null,
            customerAgreementContractSectionAccountName: contractElement['billToDetails']
          });
        }
      });
    });
    accountDetails = utils.sortBy(accountDetails);
    return accountDetails;
  }
  iterateBillToSection(documentationModel: CreateDocumentationModel, billToModel: BillToModel) {
    let accountDetails = [];
    billToModel['selectedBillTo'] = utils.uniq(billToModel['selectedBillTo']);
    billToModel['selectedBillTo'].forEach((selectedBillToElement) => {
      documentationModel['selectedSectionValue'].forEach((sectionElement) => {
        sectionElement['customerContractNumber'] = (sectionElement['customerContractNumber']) ?
        sectionElement['customerContractNumber'] : 'Transactional';
        if (selectedBillToElement['customerAgreementContractID'] === sectionElement['customerAgreementContractID']) {
          accountDetails.push({
            customerAccessorialAccountId: null,
            customerAgreementContractSectionId: sectionElement['customerAgreementContractSectionID'],
            customerAgreementContractSectionName: sectionElement['customerAgreementContractSectionName'],
            customerAgreementContractId: sectionElement['customerAgreementContractID'],
            customerAgreementContractName: `${sectionElement['customerContractNumber']} (${sectionElement['customerContractName']})`,
            customerAgreementContractSectionAccountId: selectedBillToElement['customerAgreementContractSectionAccountID'],
            customerAgreementContractSectionAccountName: selectedBillToElement['billToDetails']
          });
        } else if (selectedBillToElement['customerAgreementContractID'] !== sectionElement['customerAgreementContractID']) {
          accountDetails.push({
            customerAccessorialAccountId: null,
            customerAgreementContractSectionId: sectionElement['customerAgreementContractSectionID'],
            customerAgreementContractSectionName: sectionElement['customerAgreementContractSectionName'],
            customerAgreementContractId: sectionElement['customerAgreementContractID'],
            customerAgreementContractName: sectionElement['customerContractName'],
            customerAgreementContractSectionAccountId: null,
            customerAgreementContractSectionAccountName: sectionElement['billToDetails']
          });
        }
      });
    });
    accountDetails = utils.sortBy(accountDetails);
    return accountDetails;
  }
  iterateContractSectionBillTo(documentationModel: CreateDocumentationModel) {
    let accountDetails = [];
    if (documentationModel['selectedContractValue']) {
      accountDetails = this.iterateContractBillTo(documentationModel['selectedContractValue']);
    } else if (documentationModel['selectedSectionValue']) {
      accountDetails = this.iterateContractBillTo(documentationModel['selectedSectionValue']);
    }
    accountDetails = utils.sortBy(accountDetails);
    return accountDetails;
  }
  iterateContractBillTo(selectedValues) {
    let accountDetails = [];
    selectedValues.forEach((sectionElement) => {
      if (sectionElement) {
        sectionElement['customerContractNumber'] = (sectionElement['customerContractNumber']) ?
          sectionElement['customerContractNumber'] : 'Transactional';
        accountDetails.push({
          customerAccessorialAccountId: null,
          customerAgreementContractSectionId: (sectionElement['customerAgreementContractSectionID']) ?
            sectionElement['customerAgreementContractSectionID'] : null,
          customerAgreementContractSectionName: (sectionElement['customerAgreementContractSectionName']) ?
            sectionElement['customerAgreementContractSectionName'] : null,
          customerAgreementContractId: sectionElement['customerAgreementContractID'],
          customerAgreementContractName: `${sectionElement['customerContractNumber']} (${sectionElement['customerContractName']})`,
          customerAgreementContractSectionAccountId: null,
          customerAgreementContractSectionAccountName: sectionElement['billToDetails']
        });
      }
    });
    accountDetails = utils.sortBy(accountDetails);
    return accountDetails;
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
            serviceLevel: null,
            businessUnitDisplayName:
             `${businessUnitValues['financeBusinessUnitCode']} - ${businessUnitValues['serviceOfferingDescription']}`
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
          carrierName: carriersElement.value['name'],
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
