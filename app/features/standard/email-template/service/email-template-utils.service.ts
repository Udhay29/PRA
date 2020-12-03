import { Injectable } from '@angular/core';
import { TemplateModel } from '../model/template/template-model.model';
import { FormArray } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class EmailTemplateUtilsService {

  showGrowl: boolean;
  emailType: string;

  constructor() { }

  getQuery(templateModel: TemplateModel) {
    return {
      'emailTemplateType': {
        'emailTemplateTypeId': (templateModel.activeRoute === 'default') ? 2 : 1,
        'emailTemplateTypeName': (templateModel.activeRoute === 'default') ? 'Default' : 'Master'
      },
      'accessorialNotificationType': (templateModel.activeRoute === 'default') ? this.getNotificationData(templateModel) : undefined,
      'emailTemplateTexts': this.getEmailTemplateTexts(templateModel),
      'emailTemplatePartAttributes': this.getEmailTemplateDataElements(templateModel),
      'chargeTypeId': (templateModel.activeRoute === 'default') ? templateModel.templateForm.get('chargeType').value.id : undefined,
      'defaultAttachment': (templateModel.activeRoute === 'default') ? this.getDefaultAttachmentStatus(templateModel) : undefined,
      'chargeTypeDisplayName': (templateModel.activeRoute === 'default') ?
        `${templateModel.templateForm.get('chargeType').value.name} (${templateModel.templateForm.get('chargeType').value.code})` :
        undefined,
      'chargeTypeCode': (templateModel.activeRoute === 'default') ? templateModel.templateForm.get('chargeType').value.code : undefined
    };
  }

  getDefaultAttachmentStatus(templateModel: TemplateModel) {
    return (templateModel.valuesFromDefault && templateModel.valuesFromDefault['length']) ? 'Yes' : 'No';
  }

  getNotificationData(templateModel: TemplateModel) {
    const dataValues = templateModel.templateForm.get('notificationType').value;
    return {
      accessorialNotificationTypeId: dataValues['id'],
      accessorialNotificationTypeName: dataValues['name']
    };
  }

  getEmailTemplateDataElements(templateModel: TemplateModel) {
    const dataElements = [];
    templateModel.dataElements.forEach(dataElement => {
      const dataValues = templateModel.templateForm.get(dataElement).value;
      if (dataValues) {
        dataValues.forEach((dataValue, index) => {
          dataElements.push({
            emailTemplateAttributeAssociation: {
              emailTemplateAttributeAssociationId: dataValue.association,
              emailTemplatePartType: {
                emailTemplatePartTypeId: templateModel.templatePartTypes.filter(type => type.name ===
                  templateModel.partTypes[dataElement])[0]['id'],
                emailTemplatePartTypeName: templateModel.partTypes[dataElement]
              }, emailTemplateAttribute: {
                emailTemplateAttributeId: dataValue.id,
                emailTemplateAttributeName: dataValue.name
              }
            }, emailTemplateAttributeSequenceNumber: index + 1
          });
        });
      }
    });
    if (templateModel.activeRoute === 'default') {
      const defaultAttributes = [{ name: 'valuesFromBatch', type: 'Batch Excel' },
      { name: 'valuesFromDefault', type: 'Default Excel' }];
      defaultAttributes.forEach(defaultAttribute => {
        const defaultValues = templateModel[defaultAttribute['name']];
        if (defaultValues) {
          defaultValues.forEach((defaultValue, defaultIndex) => {
            dataElements.push({
              emailTemplateAttributeAssociation: {
                emailTemplateAttributeAssociationId: defaultValue['name']['association'],
                emailTemplatePartType: {
                  emailTemplatePartTypeId: templateModel.templatePartTypes.filter(type => type.name ===
                    defaultAttribute['type'])[0]['id'],
                  emailTemplatePartTypeName: defaultAttribute['type']
                }, emailTemplateAttribute: {
                  emailTemplateAttributeId: defaultValue['name']['id'],
                  emailTemplateAttributeName: defaultValue['name']['name']
                }
              }, emailTemplateAttributeSequenceNumber: defaultIndex + 1
            });
          });
        }
      });
    }
    return dataElements;
  }

  getEmailTemplateTexts(templateModel: TemplateModel) {
    const texts = [];
    templateModel.partsToMark.forEach(controlName => {
      const control = templateModel.templateForm.get(controlName) as FormArray;
      control.controls.forEach((emailBodyControl, index) => {
        texts.push({
          emailTemplatePartType: {
            emailTemplatePartTypeId: templateModel.templatePartTypes.filter(type => type.name ===
              templateModel.partTypes[controlName])[0]['id'],
            emailTemplatePartTypeName: templateModel.partTypes[controlName]
          },
          emailTemplateText: emailBodyControl['controls']['text']['value'],
          emailTemplateTextSequenceNumber: index + 1
        });
      });
    });
    texts.push({
      emailTemplatePartType: {
        emailTemplatePartTypeId: templateModel.templatePartTypes.filter(type => type.name ===
          templateModel.partTypes['subjectText'])[0]['id'],
        emailTemplatePartTypeName: templateModel.partTypes['subjectText']
      },
      emailTemplateText: templateModel.templateForm.get('subjectText')['value'],
      emailTemplateTextSequenceNumber: 1
    });
    return texts;
  }

  getExcelQuery(data) {
    const response = [];
    data.forEach(queryData => {
      response.push({
        excelFieldName: queryData['name']['name'],
        dataType: 'String',
        length: 200
      });
    });
    return response;
  }

  formatMasterTemplateData(data) {
    const masterTemplate = {
      bodyDataElements: [],
      subjectDataElements: [],
      introParagraph: [],
      conclusionParagraph: [],
      signatureLine: [],
      subjectText: []
    };
    const attributes = [{
      element: { name: 'Email Body', value: 'bodyDataElements' }
    },
    {
      element: { name: 'Subject', value: 'subjectDataElements' }
    }];
    const texts = [
      { element: { name: 'Email Body Introduction', value: 'introParagraph' } },
      { element: { name: 'Email Body Conclusion', value: 'conclusionParagraph' } },
      { element: { name: 'Signature', value: 'signatureLine' } },
      { element: { name: 'Subject', value: 'subjectText' } }
    ];
    if (data['emailTemplatePartAttributes']) {
      data['emailTemplatePartAttributes'].forEach(emailTemplateAttribute => {
        attributes.forEach(attribute => {
          if ((attribute['element']['name'] ===
            emailTemplateAttribute['emailTemplateAttributeAssociation']['emailTemplatePartType']['emailTemplatePartTypeName']) &&
            emailTemplateAttribute['emailTemplateAttributeAssociation']['emailTemplateAttribute']['emailTemplateAttributeName']) {
            masterTemplate[attribute['element']['value']].push({
              id: emailTemplateAttribute['emailTemplateAttributeAssociation']['emailTemplateAttribute']['emailTemplateAttributeId'],
              name: emailTemplateAttribute['emailTemplateAttributeAssociation']['emailTemplateAttribute']['emailTemplateAttributeName']
            });
          }
        });
      });
    }
    data['emailTemplateTexts'].forEach(emailTemplateText => {
      texts.forEach(text => {
        if ((text['element']['name'] === emailTemplateText['emailTemplatePartType']['emailTemplatePartTypeName']) &&
          emailTemplateText['emailTemplateText']) {
          masterTemplate[text['element']['value']].push({
            id: emailTemplateText['emailTemplateTextId'],
            name: emailTemplateText['emailTemplateText']
          });
        }
      });
    });
    return masterTemplate;
  }

  isEmptyExist(excelValues) {
    let emptyStatus = false;
    excelValues.forEach(excelValue => {
      if (!excelValue['name']['name']) {
        emptyStatus = true;
      }
    });
    return emptyStatus;
  }
}
