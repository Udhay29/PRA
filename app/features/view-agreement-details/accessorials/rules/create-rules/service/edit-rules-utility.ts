import { DocumentationDate } from './../../../documentation/create-documentation/model/create-documentation.interface';
import * as utils from 'lodash';
import * as moment from 'moment';
import {
  takeWhile
} from 'rxjs/operators';
import {
  CreateRuleModel
} from '../model/create-rules.model';
import {
  EditAdditionalChargeResponse
} from './../../../../../shared/accessorials/additional-charges/additional-charges/model/additional-charges-interface';
import {
  OptionalAttributesModel
} from './../../../shared/models/optional-attributes.model';
import {
  BuSoAssociation,
  ServiceLevel
} from './../../../shared/models/optional-attributes.interface';
import {
  EditRequestedServiceResponse
} from './../model/create-rules.interface';


export class EditRuleUtility {
  static setValuesToAccessorialRuleForm(editRuleData: object, createRuleModel: CreateRuleModel,
    optionalAttributesModel: OptionalAttributesModel, optionsalComp, parentScope, documentationComp) {
    createRuleModel.isEditAccessorialRuleClicked = true;
    this.setValuesForDatesAndChargeTypes(editRuleData, createRuleModel, parentScope,
      optionalAttributesModel, optionsalComp, documentationComp);
  }
  static setValuesForDatesAndChargeTypes(editRuleData: object, createRuleModel: CreateRuleModel, parentScope,
    optionalAttributesModel, optionsalComp, documentationComp) {
    const chargeTypeName = editRuleData['chargeTypeName'];
    const chargeTypeCode = editRuleData['chargeTypeCode'];
    const chargeTypeinEdit = `${chargeTypeName} (${chargeTypeCode})`;
    createRuleModel.rulesForm.controls['chargeType'].setValue({
      label: chargeTypeinEdit,
      value: editRuleData['chargeTypeId'],
      description: editRuleData['chargeTypeCode']
    });
    this.getBUbasedOnChargeType(createRuleModel.rulesForm.controls['chargeType']['value']['value'], parentScope, editRuleData,
      optionalAttributesModel, optionsalComp, documentationComp);
    createRuleModel.rulesForm.controls['effectiveDate'].setValue(this.dateFormatter(this.dateFormatter(editRuleData['effectiveDate'])));
    createRuleModel.rulesForm.controls['expirationDate'].
      setValue(this.dateFormatter(editRuleData['expirationDate']));
    this.setAgreementLevelDate(parentScope);
  }
  static getBUbasedOnChargeType(chargeTypeId: number, parentScope, editRuleData,
    optionalAttributesModel, optionsalComp, documentationComp) {
    parentScope.createRulesService.getBUbasedOnChargeType(chargeTypeId).pipe(takeWhile(() =>
      parentScope.createRuleModel.isSubscribeFlag))
      .subscribe((buResponseBasedOnChargeType) => {
        if (!utils.isEmpty(buResponseBasedOnChargeType)) {
          if (utils.isEmpty(editRuleData.serviceLevelBusinessUnitServiceOfferings)) {
            parentScope.createRuleModel.buSoBasedOnChargeType = buResponseBasedOnChargeType;
          }
          this.setValuesForEquipments(editRuleData, optionalAttributesModel, optionsalComp);
          this.setCarrierValues(editRuleData, optionalAttributesModel);
          parentScope.optionalFields.optionalAttributesModel.businessUnitData =
            this.getBusinessUnitServiceOfferingList(buResponseBasedOnChargeType, editRuleData, optionsalComp, parentScope);
        }
      });
  }
  static getBusinessUnitServiceOfferingList(buResponseBasedOnChargeType, editRuleData, optionsalComp, parentScope) {
    const referenceDataList = [];
    this.setBusinessUnitServiceOfferingValues(buResponseBasedOnChargeType, editRuleData, optionsalComp, parentScope);
    if (!utils.isEmpty(buResponseBasedOnChargeType)) {
      utils.forEach(buResponseBasedOnChargeType,
        (associationList) => {
          const dataObject = associationList;
          const objectFormat = {
            value: {
              financeBusinessUnitServiceOfferingAssociationID: dataObject.financeBusinessUnitServiceOfferingAssociationID,
              chargeTypeBusinessUnitServiceOfferingAssociationID: dataObject.chargeTypeBusinessUnitServiceOfferingAssociationID,
              financeBusinessUnitCode: dataObject.financeBusinessUnitCode,
              serviceOfferingDescription: dataObject.serviceOfferingDescription,
              financeBusinessUnitServiceOfferingDisplayName:
                `${dataObject.financeBusinessUnitCode} - ${dataObject.serviceOfferingDescription}`
            },
            label: `${dataObject.financeBusinessUnitCode} - ${dataObject.serviceOfferingDescription}`
          };
          referenceDataList.push(objectFormat);
        });
    }
    return utils.sortBy(referenceDataList, ['value.financeBusinessUnitCode', 'value.serviceOfferingDescription']);
  }
  static setBusinessUnitServiceOfferingValues(buResponseBasedOnChargeType: BuSoAssociation[], editRuleData, optionsalComp, parentScope) {
    const busoPatchValues = [];
    const serviceLevelPatchValues = [];
    const editBusinessArray = [];
    const editChargeBusinessArray = [];
    if (!utils.isEmpty(editRuleData.serviceLevelBusinessUnitServiceOfferings)) {
      utils.forEach(buResponseBasedOnChargeType,
        (associationList: BuSoAssociation) => {
          utils.forEach(editRuleData.serviceLevelBusinessUnitServiceOfferings,
            (eachBU: BuSoAssociation) => {
              if (associationList.financeBusinessUnitServiceOfferingAssociationID ===
                eachBU['serviceLevelBusinessUnitServiceOfferingAssociationId']) {
                const objectFormat = {
                  financeBusinessUnitServiceOfferingAssociationID: associationList.financeBusinessUnitServiceOfferingAssociationID,
                  chargeTypeBusinessUnitServiceOfferingAssociationID: associationList.chargeTypeBusinessUnitServiceOfferingAssociationID,
                  financeBusinessUnitCode: associationList.financeBusinessUnitCode,
                  serviceOfferingDescription: associationList.serviceOfferingDescription,
                  financeBusinessUnitServiceOfferingDisplayName:
                    `${associationList.financeBusinessUnitCode} - ${associationList.serviceOfferingDescription}`

                };
                busoPatchValues.push(objectFormat);
                editBusinessArray.push(associationList['financeBusinessUnitServiceOfferingAssociationID']);
                editChargeBusinessArray.push(associationList['chargeTypeBusinessUnitServiceOfferingAssociationID']);
                optionsalComp.optionalAttributesModel.operationalArray.
                  push(`${associationList['financeBusinessUnitCode']} ${associationList['serviceOfferingDescription']}`);
              }
            });
        });
      const uniqueBuSoResponse = utils.uniqBy(busoPatchValues, 'financeBusinessUnitServiceOfferingAssociationID');
      optionsalComp.optionalAttributesModel.optionalForm.controls.businessUnit.setValue(uniqueBuSoResponse);
      optionsalComp.optionalAttributesModel.businessUnitAdded = true;
      optionsalComp.getOperationalService();
      this.setRequestedServices(optionsalComp.optionalAttributesModel, parentScope);
      this.setServiceLevelDocumentValues(parentScope, editRuleData, editBusinessArray, serviceLevelPatchValues, optionsalComp);
    } else {
      this.setLegalDocValues(parentScope);
      this.setRuleTypeForm(editRuleData, parentScope);
    }
    optionsalComp.emitbuSo(editChargeBusinessArray);
    optionsalComp.selectedBuSo.emit(editBusinessArray);
  }
  static setServiceLevelDocumentValues(parentScope, editRuleData, editBusinessArray, serviceLevelPatchValues, optionsalComp) {
    parentScope.optionalFields.optionalAttributesModel.serviceLevel = [];
    parentScope.optionalFields.optionalAttributesModel.loading = true;
    const param = `?financeBusinessUnitServiceOfferingAssociationIds=${editBusinessArray}`;
    parentScope.optionalFields.rateAttributesService.getServiceLevel
      (param).pipe(takeWhile(() => parentScope.optionalFields.optionalAttributesModel.subscriberFlag))
      .subscribe((response: ServiceLevel) => {
        parentScope.optionalFields.optionalAttributesModel.loading = false;
        if (!utils.isEmpty(response)) {
          const dataValues = response['_embedded']['serviceLevelBusinessUnitServiceOfferingAssociations'];
          parentScope.optionalFields.optionalAttributesModel.serviceLevelValues = dataValues.map(value => {
            return {
              label: value['serviceLevel']['serviceLevelDescription'],
              value: value['serviceLevelBusinessUnitServiceOfferingAssociationID']
            };
          });
          parentScope.optionalFields.optionalAttributesModel.serviceLevelResponse = dataValues;
          parentScope.optionalFields.optionalAttributesModel.serviceLevel =
            utils.uniqBy(parentScope.optionalFields.optionalAttributesModel.serviceLevelValues, 'label');
          parentScope.optionalFields.optionalAttributesModel.serviceLevel =
            utils.sortBy(parentScope.optionalFields.optionalAttributesModel.serviceLevel, ['label']);
          parentScope.optionalFields.changeDetector.detectChanges();
          parentScope.optionalFields.optionalAttributesModel.serviceLevel.forEach(value => {
            utils.forEach(editRuleData.serviceLevelBusinessUnitServiceOfferings,
              (eachBU: BuSoAssociation) => {
                if (value['value'] === eachBU['customerAccessorialServiceLevelBusinessUnitServiceOfferingId']) {
                  const serviceLevelObjectFormat = {
                    label: value['label'],
                    value: value['value']
                  };
                  serviceLevelPatchValues.push(serviceLevelObjectFormat);
                }
              });
          });
          optionsalComp.optionalAttributesModel.serviceLevelAdded = true;
        } else {
          optionsalComp.optionalAttributesModel.serviceLevelAdded = false;
        }
        const uniqueServiceLevelResponse = utils.uniqBy
          (serviceLevelPatchValues, 'label');
        parentScope.optionalFields.optionalAttributesModel.optionalForm.controls.serviceLevel.setValue(uniqueServiceLevelResponse);
        this.setLegalDocValues(parentScope);
        this.setRuleTypeForm(editRuleData, parentScope);
      });
  }
  static setRequestedServices(optionalAttributesModel, parentScope) {

    const requestedServicePatch = [];
    const editReqService = parentScope.createRuleModel.editAccessorialWholeResponse.requestServices;
    if (!utils.isEmpty(editReqService) && (editReqService.length) > 0 && (editReqService !== null)) {
      editReqService.forEach((eachRequestedService: EditRequestedServiceResponse) => {
        requestedServicePatch.push(
          `${eachRequestedService['requestedServiceTypeCode']}:${eachRequestedService['serviceTypeDescription']}`);
      });
      optionalAttributesModel.operationalServiceAdded = true;
    } else {
      optionalAttributesModel.operationalServiceAdded = false;
    }
    optionalAttributesModel.optionalForm.controls.requestedService.setValue(requestedServicePatch);
    parentScope.changeDetector.detectChanges();
  }
  static dateFormatter(value: string | Date): string {
    return moment(value).format('MM/DD/YYYY');
  }
  static setValuesForEquipments(editRuleData, optionalAttributesModel: OptionalAttributesModel, optionsalComp) {
    if (editRuleData.equipmentCategoryCode) {
      optionalAttributesModel.optionalForm.controls.equipmentCategory.setValue({
        label: editRuleData.equipmentCategoryCode,
        value: editRuleData.equipmentCategoryCode
      });
      optionsalComp.getEquipmentType(optionalAttributesModel.optionalForm.controls.equipmentCategory.value);
    }
    if (editRuleData.equipmentType) {
      optionalAttributesModel.optionalForm.controls.equipmentType.setValue({
        label: editRuleData.equipmentType,
        value: editRuleData.equipmentType
      });
      optionsalComp.getEquipmentLength(optionalAttributesModel.optionalForm.controls.equipmentType.value);
    }
    if (editRuleData.equipmentLength) {
      optionalAttributesModel.optionalForm.controls.equipmentLength.setValue({
        label: editRuleData['equipmentLength'],
        value: `${editRuleData['equipmentLength']} ${editRuleData['equipmentLengthDescription']} in Length`,
        id: editRuleData['equipmentLengthId']
      });
    }
  }
  static setCarrierValues(editRuleData, optionalAttributesModel) {
    if (!utils.isEmpty(editRuleData.carriers) && (editRuleData.carriers).length > 0) {
      const carrierValuesinEdit = [];
      editRuleData.carriers.forEach(eachCarrier => {
        carrierValuesinEdit.push({
          label: `${eachCarrier['carrierName']}${' '}${'('}${eachCarrier['carrierCode']}${')'}`,
          value: {
            code: eachCarrier['carrierCode'],
            id: eachCarrier['carrierId'],
            name: eachCarrier['carrierName']
          }
        });
      });
      optionalAttributesModel.optionalForm.controls.carriers.setValue(carrierValuesinEdit);
    }
  }
  static setAgreementLevelDate(parentScope) {
    parentScope.createRuleModel.loading = true;
    parentScope.createDocumentationService.getAgreementLevelDate(parentScope.agreementID,
      parentScope.createRuleModel.selectedRuleLevel)
      .pipe(takeWhile(() => parentScope.createRuleModel.isSubscribeFlag))
      .subscribe((documentationDate: DocumentationDate) => {
        parentScope.createRuleModel.loading = false;
        this.populateAgreementLevelData(documentationDate, parentScope);
      }, (agreementLevelError: Error) => {
        parentScope.createRuleModel.loading = false;
        parentScope.createRuleUtilityService.
          toastMessage(parentScope.messageService, 'error', 'Error', agreementLevelError['error']['errors'][0]['errorMessage']);
      });
  }
  static populateAgreementLevelData(documentationDate: DocumentationDate, scope) {
    if (documentationDate) {
      scope.createRuleModel.expirationDate = scope.createRuleModel.editAccessorialWholeResponse.expirationDate;
      scope.createRuleModel.effectiveDate = scope.createRuleModel.editAccessorialWholeResponse.effectiveDate;
      scope.createRuleModel.agreementEffectiveDate = this.dateFormatter(new Date());
      scope.createRuleModel.agreementExpirationDate = documentationDate.agreementExpirationDate;
      scope.changeDetector.detectChanges();
    }
  }
  static checkRulesLevel(editRuleData, createRuleModel) {
    switch (editRuleData.level) {
      case 'Agreement':
        this.setAgreementLevel(editRuleData, createRuleModel);
        break;
      case 'Contract':
        this.setContractLevel(editRuleData, createRuleModel);
        break;
      case 'Section':
        createRuleModel.rulesForm.controls['ruleLevel'].setValue('section');
        createRuleModel.selectedRuleLevel = 'section';
        if (!utils.isEmpty(editRuleData['sections']) && (editRuleData['sections']).length > 0) {
          createRuleModel.editSectionValues = editRuleData['sections'];
        }
        if (!utils.isEmpty(editRuleData['billToAccounts']) && (editRuleData['billToAccounts']).length > 0) {
          createRuleModel.editBillToValues = editRuleData['billToAccounts'];
        }
        break;
      default: break;
    }
  }
  static setAgreementLevel(editRuleData, createRuleModel) {
    createRuleModel.rulesForm.controls['ruleLevel'].setValue('Agreement');
    createRuleModel.selectedRuleLevel = 'Agreement';
    if (!utils.isEmpty(editRuleData['billToAccounts']) && (editRuleData['billToAccounts']).length > 0) {
      createRuleModel.editBillToValues = editRuleData['billToAccounts'];
    }
  }
  static setContractLevel(editRuleData, createRuleModel) {
    createRuleModel.rulesForm.controls['ruleLevel'].setValue('contract');
    createRuleModel.selectedRuleLevel = 'contract';
    if (!utils.isEmpty(editRuleData['contracts']) && (editRuleData['contracts']).length > 0) {
      createRuleModel.editContractValues = editRuleData['contracts'];
    }
    if (!utils.isEmpty(editRuleData['billToAccounts']) && (editRuleData['billToAccounts']).length > 0) {
      createRuleModel.editBillToValues = editRuleData['billToAccounts'];
    }
  }
  static setRuleTypeForm(editRuleData: object, parentScope) {
    if (editRuleData['pricingAveragePeriodTypeName'] === 'Free') {
      this.setFreeRules(editRuleData, parentScope);
    }
  }
  static setFreeRules(editRuleData: object, parentScope) {
    const ruleTypeValue = {
      label: editRuleData['pricingAveragePeriodTypeName'],
      value: editRuleData['pricingAveragePeriodTypeId']
    };
    const freeRuleType = {
      label: editRuleData['accessorialFreeRuleTypeName'],
      value: editRuleData['accessorialFreeRuleTypeId']
    };
    parentScope.createRuleModel.rulesForm.controls['ruleType'].setValue(ruleTypeValue);
    parentScope.onChangeRuleType(ruleTypeValue);
    parentScope.changeDetector.detectChanges();
    parentScope.freeRuleTab.freeRuleModel.freeRulesForm.controls['freeRuleType'].setValue(freeRuleType);
    parentScope.freeRuleTab.onSelectFreeType(freeRuleType);
    if (freeRuleType.value === parentScope.freeRuleTab.freeRuleModel.freeRuleTypeQuantity['accessorialFreeRuleTypeID']) {
      const freeRuleQuantityResponse = editRuleData['accessorialFreeRuleQuantityTypes'];
      const quantityTypeSelectedValue = {
        label: freeRuleQuantityResponse['accessorialFreeRuleQuantityTypeName'],
        value: freeRuleQuantityResponse['accessorialFreeRuleQuantityTypeID']
      };
      const distanceTypeSelectedValue = {
        label: freeRuleQuantityResponse['freeRuleQuantityDistanceTypeCode'],
        value: freeRuleQuantityResponse['freeRuleQuantityDistanceTypeId']
      };
      const timeTypeSelectedValue = {
        label: freeRuleQuantityResponse['freeRuleQuantityTimeTypeCode'],
        value: freeRuleQuantityResponse['freeRuleQuantityTimeTypeId']
      };
      const quantityValue = freeRuleQuantityResponse['accessorialFreeQuantity'];
      const deliveryDateValue = (freeRuleQuantityResponse['requestedDeliveryDateIndicator'] === 'Yes');
      parentScope.freeRuleTab.onSelectQuantityType(quantityTypeSelectedValue);
      parentScope.freeRuleTab.freeRuleModel.freeRulesForm.patchValue({
        quantityType: quantityTypeSelectedValue,
        distanceType: distanceTypeSelectedValue,
        timeType: timeTypeSelectedValue,
        quantity: quantityValue,
        requestedDeliveryDate: deliveryDateValue
      });
      parentScope.freeRuleTab.changeDetector.detectChanges();
    } else if (freeRuleType.value === parentScope.freeRuleTab.freeRuleModel.freeRuleTypeCalendar['accessorialFreeRuleTypeID']) {
      this.setFreeRuleCalendarTypeForm(parentScope, editRuleData);
    } else if (freeRuleType.value === parentScope.freeRuleTab.freeRuleModel.freeRuleTypeEvent['accessorialFreeRuleTypeID']) {
      const freeRuleEventResponse = editRuleData['accessorialFreeRuleEventTypes'];
      const EventTypeSelectedValue = {
        label: freeRuleEventResponse['accessorialFreeRuleTypeName'],
        value: freeRuleEventResponse['accessorialFreeRuleEventTypeID']
      };
      parentScope.freeRuleTab.freeTypeEventTab.freeEventTypeModel.freeEventTypeForm.controls['freeTypeEventName']
        .setValue(EventTypeSelectedValue);
      const eventTimeFrameTypeNameSelectedValue = {
        label: freeRuleEventResponse['accessorialFreeRuleEventTimeFrameTypeName'],
        value: freeRuleEventResponse['accessorialFreeRuleEventTimeframeTypeID']
      };
      parentScope.freeRuleTab.freeTypeEventTab.freeEventTypeModel.freeEventTypeForm.controls['freeTimeEvent']
        .setValue(eventTimeFrameTypeNameSelectedValue);
      parentScope.freeRuleTab.freeTypeEventTab.onSelectEventFreeTime(eventTimeFrameTypeNameSelectedValue);

      const eventModifierTypeNameSelectedValue1 = {
        label: freeRuleEventResponse['accessorialDayOfEventFreeRuleModifierName'],
        value: freeRuleEventResponse['accessorialDayOfEventFreeRuleModifierId']
      };
      parentScope.freeRuleTab.freeTypeEventTab.freeEventTypeModel.freeEventTypeForm.controls['freeAmountFirstEvent']
        .setValue(eventModifierTypeNameSelectedValue1);
      const pickatimeFirst =
        freeRuleEventResponse['accessorialDayOfEventFreeRuleModifierTime'] ?
        new Date(freeRuleEventResponse['accessorialDayOfEventFreeRuleModifierTime']) : null;
         parentScope.freeRuleTab.freeTypeEventTab.freeEventTypeModel.freeEventTypeForm.controls['pickatimefirst']
        .setValue(pickatimeFirst);
        parentScope.freeRuleTab.freeTypeEventTab.onSelectFreeAmountFirst(eventModifierTypeNameSelectedValue1);
              const eventModifierTypeNameSelectedValue2 = {
        label: freeRuleEventResponse['accessorialDayAfterEventFreeRuleModifierName'],
        value: freeRuleEventResponse['accessorialDayAfterEventFreeRuleModifierId']
      };
      parentScope.freeRuleTab.freeTypeEventTab.freeEventTypeModel.freeEventTypeForm.controls['freeAmountSecondEvent']
        .setValue(eventModifierTypeNameSelectedValue2);
      const pickatimeSecond =
      freeRuleEventResponse['accessorialDayAfterEventFreeRuleModifierTime'] ?
        new Date(freeRuleEventResponse['accessorialDayAfterEventFreeRuleModifierTime']) : null;
      parentScope.freeRuleTab.freeTypeEventTab.freeEventTypeModel
        .freeEventTypeForm.controls['pickatimesecond'].setValue(pickatimeSecond);
        parentScope.freeRuleTab.freeTypeEventTab.onSelectFreeAmountSecond(eventModifierTypeNameSelectedValue2);
      parentScope.freeRuleTab.freeTypeEventTab.changeDetector.detectChanges();
    }

  }
  static setFreeRuleCalendarTypeForm(parentScope, editRuleData) {
    const freeRuleCalendarResponse = editRuleData['accessorialFreeRuleCalenderTypes'];
    const calendarTypeSelectedValue = this.getFormControlValue(freeRuleCalendarResponse['accessorialFreeRuleCalendarTypeId'],
      freeRuleCalendarResponse['accessorialFreeRuleCalendarTypeName']);
    const applyIfSelectedValue = this.getFormControlValue(freeRuleCalendarResponse['accessorialFreeRuleCalendarApplyTypeId'],
      freeRuleCalendarResponse['accessorialFreeRuleCalendarApplyTypeName']);

    const eventSelectedValue = this.getFormControlValue(freeRuleCalendarResponse['accessorialFreeRuleEventTypeId'],
      freeRuleCalendarResponse['accessorialFreeRuleEventTypeName']);
    const calendarMonth = freeRuleCalendarResponse['customerAccessorialFreeRuleCalendarMonth'];
    const monthSelectedValue = calendarMonth && calendarMonth.length ?
      {
        label: calendarMonth[0]['calendarMonth'],
        value: calendarMonth[0]['calendarMonth']
      } : null;
    if (freeRuleCalendarResponse['accessorialFreeRuleCalendarTypeId'] ===
      parentScope.freeRuleTab.freeTypeCalendarTab.freeCalendarModel.specificCalendarType.calendarTypeId) {
      const dayOfMonth = freeRuleCalendarResponse['customerAccessorialFreeRuleCalendarMonth'][0]
      ['customerAccessorialFreeRuleCalendarDay'];
      const dayofMonthSelectedValue = {
        label: dayOfMonth.length ? String(dayOfMonth[0]) : null,
        value: dayOfMonth.length ? dayOfMonth[0] : null
      };
      const timeFrameSelectedValue = this.getFormControlValue(freeRuleCalendarResponse['pricingAveragePeriodTypeId'],
      freeRuleCalendarResponse['pricingAveragePeriodTypeName'] );
      parentScope.freeRuleTab.freeTypeCalendarTab.onSelectCalendarType(freeRuleCalendarResponse['accessorialFreeRuleCalendarTypeId']);
      parentScope.freeRuleTab.freeTypeCalendarTab.onSelectApplyIf(
        freeRuleCalendarResponse['accessorialFreeRuleCalendarApplyTypeId']);
      parentScope.freeRuleTab.freeTypeCalendarTab.freeCalendarModel.freeCalendarForm.patchValue({
        calendarType: calendarTypeSelectedValue,
        applyIf: applyIfSelectedValue,
        months: monthSelectedValue,
        dayOfMonth: dayofMonthSelectedValue,
        eventTypes: eventSelectedValue,
        timeFrame: timeFrameSelectedValue,
        year: freeRuleCalendarResponse['calendarYear'],
        holidayName: freeRuleCalendarResponse['calendarDayDescription'],
        cannotBeFirstChargeableDay: (freeRuleCalendarResponse['firstDayChargeableIndicator'] === 'True')
      });
    } else if (freeRuleCalendarResponse['accessorialFreeRuleCalendarTypeId'] ===
      parentScope.freeRuleTab.freeTypeCalendarTab.freeCalendarModel.relativeCalendarType.calendarTypeId) {
      const isWeekly = (freeRuleCalendarResponse['pricingAveragePeriodTypeId'] ===
        parentScope.freeRuleTab.freeTypeCalendarTab.freeCalendarModel.relativeTimeFrameWeekly.pricingAveragePeriodTypeId);
      const timeFrameValue = this.getFormControlValue(freeRuleCalendarResponse['pricingAveragePeriodTypeId'],
        freeRuleCalendarResponse['pricingAveragePeriodTypeName']);
      parentScope.freeRuleTab.freeTypeCalendarTab.onSelectCalendarType(freeRuleCalendarResponse['accessorialFreeRuleCalendarTypeId']);
      parentScope.freeRuleTab.freeTypeCalendarTab.onSelectTimeFrame(
        freeRuleCalendarResponse['pricingAveragePeriodTypeId']);
      parentScope.freeRuleTab.freeTypeCalendarTab.onSelectApplyIf(
        freeRuleCalendarResponse['accessorialFreeRuleCalendarApplyTypeId']);
      parentScope.freeRuleTab.freeTypeCalendarTab.freeCalendarModel.freeCalendarForm.patchValue({
        calendarType: calendarTypeSelectedValue,
        applyIf: applyIfSelectedValue,
        timeFrame: timeFrameValue,
        months: monthSelectedValue,
        dayOfWeek: this.getDayOfWeekValues(freeRuleCalendarResponse, isWeekly),
        occurrence: this.getOccurenceList(freeRuleCalendarResponse, isWeekly),
        appliesToOccurrence: this.getOccurenceList(freeRuleCalendarResponse, isWeekly),
        eventTypes: eventSelectedValue,
        cannotBeFirstChargeableDay: (freeRuleCalendarResponse['firstDayChargeableIndicator'] === 'True')
      });
    }
  }
  static getFormControlValue(selectedValue, selectedLabel) {
    return {
      label: selectedLabel,
      value: selectedValue
    };
  }
  static getDayOfWeekValues(freeRuleCalendarResponse, isWeekly) {
    const dayOfWeeks = [];
    if ( freeRuleCalendarResponse['customerAccessorialFreeRuleCalendarWeekDay']) {
      freeRuleCalendarResponse['customerAccessorialFreeRuleCalendarWeekDay'].forEach(weekDay => {
        dayOfWeeks.push(
          {
            value: weekDay['calendarWeekDay'],
            label: weekDay['calendarWeekDay']
          });
      });
    }
    return isWeekly ? dayOfWeeks : dayOfWeeks[0];
  }
  static getOccurenceList(freeRuleCalendarResponse, isWeekly) {
    const occurenceValues = [];
    if (freeRuleCalendarResponse['customerAccessorialFreeRuleCalendarDayOccurrences']) {
      freeRuleCalendarResponse['customerAccessorialFreeRuleCalendarDayOccurrences'].forEach(occurence => {
        occurenceValues.push({
          value: occurence['accessorialFrequencyTypeId'],
          label: occurence['accessorialFrequencyTypeName']
        });
      });
    }
    return isWeekly ? occurenceValues : occurenceValues[0];
  }
  static setLegalDocValues(parentScope) {
    if (!utils.isEmpty(parentScope.createRuleModel.refreshDocumentResponse)
      && parentScope.createRuleModel.refreshDocumentResponse.length > 0) {
      parentScope.documentation.refreshData(parentScope.createRuleModel.refreshDocumentResponse);
    }
  }
}
