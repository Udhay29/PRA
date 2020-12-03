import { Validators } from '@angular/forms';
import { DocumentationDate } from './../../../documentation/create-documentation/model/create-documentation.interface';
import * as utils from 'lodash';
import * as moment from 'moment';
import { takeWhile } from 'rxjs/operators';

import { CreateRatesModel } from '../model/create-rates.model';
import {
    EditAdditionalChargeResponse
} from './../../../../../shared/accessorials/additional-charges/additional-charges/model/additional-charges-interface';
import { OptionalAttributesModel } from './../../../shared/models/optional-attributes.model';
import { BuSoAssociation, ServiceLevel } from './../../../shared/models/optional-attributes.interface';
import { EditRequestedServiceResponse, AddRateEditResponse, EditAlternateChargeResponse } from './../model/create-rates.interface';


export class EditRateUtility {
    static setValuesToAccessorialRateForm(editRateData: object, createRatesModel: CreateRatesModel,
        optionalAttributesModel: OptionalAttributesModel, optionsalComp, parentScope, documentationComp) {
        createRatesModel.isEditAccessorialRateClicked = true;
        this.setValuesForDatesAndChargeTypes(editRateData, createRatesModel, parentScope,
            optionalAttributesModel, optionsalComp, documentationComp);
        this.setValuesForAlternateCharge(editRateData['customerAccessorialRateAlternateChargeViewDTO'], createRatesModel, parentScope);
        this.checkAccessorialRates(createRatesModel);
        this.checkAccessorialStairStepRates(createRatesModel);
        this.checkAccessorialAdditionalCharge(createRatesModel);
    }
    static setValuesForDatesAndChargeTypes(editRateData: object, createRatesModel: CreateRatesModel, parentScope,
        optionalAttributesModel, optionsalComp, documentationComp) {
        const chargeTypeName = editRateData['chargeTypeName'];
        const chargeTypeCode = editRateData['chargeTypeCode'];
        const chargeTypeinEdit = `${chargeTypeName} (${chargeTypeCode})`;
        createRatesModel.ratesForm.controls['chargeType'].setValue({
            label: chargeTypeinEdit,
            value: editRateData['chargeTypeId'],
            description: editRateData['chargeTypeCode']
        });
        this.getBUbasedOnChargeType(createRatesModel.ratesForm.controls['chargeType']['value']['value'], parentScope, editRateData,
            optionalAttributesModel, optionsalComp, documentationComp);
        createRatesModel.ratesForm.controls['customerName'].setValue(editRateData['customerChargeName']);
        createRatesModel.ratesForm.controls['effectiveDate'].setValue(this.dateFormatter
            (this.dateFormatter(editRateData['effectiveDate'])));
        createRatesModel.ratesForm.controls['expirationDate'].
            setValue(this.dateFormatter(editRateData['expirationDate']));
        this.setAgreementLevelDate(parentScope);
    }
    static setAgreementLevelDate(parentScope) {
        parentScope.createRatesModel.loading = true;
        parentScope.createDocumentationService.getAgreementLevelDate(parentScope.agreementID,
            parentScope.createRatesModel.ratesDocumentLevel)
            .pipe(takeWhile(() => parentScope.createRatesModel.createRatesValidation.isSubscribeFlag))
            .subscribe((documentationDate: DocumentationDate) => {
                parentScope.createRatesModel.loading = false;
                this.populateAgreementLevel(documentationDate, parentScope);
            }, (agreementLevelError: Error) => {
                parentScope.createRatesModel.loading = false;
                parentScope.createRateUtilityService.
                    toastMessage(parentScope.messageService, 'error', 'Error', agreementLevelError['error']['errors'][0]['errorMessage']);
            });
    }
    static populateAgreementLevel(documentationDate: DocumentationDate, scope) {
        if (documentationDate) {
            scope.createRatesModel.createRatesValidation.expirationDate =
                scope.createRatesModel.editAccessorialWholeResponse.expirationDate;
            scope.createRatesModel.createRatesValidation.effectiveDate =
                scope.createRatesModel.editAccessorialWholeResponse.effectiveDate;
            scope.createRatesModel.createRatesValidation.agreementEffectiveDate =
                scope.dateFormatter(new Date());
            scope.createRatesModel.createRatesValidation.agreementEndDate = documentationDate.agreementExpirationDate;
            scope.changeDetector.detectChanges();
        }
    }
    static getBUbasedOnChargeType(chargeTypeId: number, parentScope, editRateData,
        optionalAttributesModel, optionsalComp, documentationComp) {
        parentScope.createRateService.getBUbasedOnChargeType(chargeTypeId).pipe(takeWhile(() =>
            parentScope.createRatesModel.createRatesValidation.isSubscribeFlag))
            .subscribe((buResponseBasedOnChargeType) => {
                if (!utils.isEmpty(buResponseBasedOnChargeType)) {
                    if (utils.isEmpty(editRateData.businessUnitServiceOfferingDTOs)) {
                        parentScope.createRatesModel.buSoBasedOnChargeType = buResponseBasedOnChargeType;
                    }
                    parentScope.optionalFields.optionalAttributesModel.businessUnitData =
                        this.getBusinessUnitServiceOfferingList(buResponseBasedOnChargeType, editRateData, optionsalComp, parentScope);
                    this.setCheckBoxAttributes(editRateData, parentScope);
                    this.setValuesForEquipments(editRateData, optionalAttributesModel, optionsalComp);
                    this.setCarrierValues(editRateData, optionalAttributesModel);
                }
            });
    }

    static getBusinessUnitServiceOfferingList(buResponseBasedOnChargeType, editRateData, optionsalComp, parentScope) {
        const referenceDataList = [];
        this.setBusinessUnitServiceOfferingValues(buResponseBasedOnChargeType, editRateData, optionsalComp, parentScope);
        if (!utils.isEmpty(buResponseBasedOnChargeType)) {
            utils.forEach(buResponseBasedOnChargeType,
                (associationList) => {
                    const dataObject = associationList;
                    const objectFormat = {
                        value: {
                            financeBusinessUnitServiceOfferingAssociationID: dataObject.financeBusinessUnitServiceOfferingAssociationID,
                            chargeTypeBusinessUnitServiceOfferingAssociationID:
                                dataObject.chargeTypeBusinessUnitServiceOfferingAssociationID,
                            financeBusinessUnitCode: dataObject.financeBusinessUnitCode,
                            serviceOfferingDescription: dataObject.serviceOfferingDescription,
                            financeBusinessUnitServiceOfferingDisplayName:
                                `${dataObject.financeBusinessUnitCode} - ${dataObject.serviceOfferingDescription}`
                        }, label: `${dataObject.financeBusinessUnitCode} - ${dataObject.serviceOfferingDescription}`
                    };
                    referenceDataList.push(objectFormat);
                });
        }
        return utils.sortBy(referenceDataList, ['value.financeBusinessUnitCode', 'value.serviceOfferingDescription']);
    }
    static setBusinessUnitServiceOfferingValues(buResponseBasedOnChargeType: BuSoAssociation[], editRateData, optionsalComp, parentScope) {
        const busoPatchValues = [];
        const serviceLevelPatchValues = [];
        const editBusinessArray = [];
        const editChargeBusinessArray = [];
        if (!utils.isEmpty(editRateData.businessUnitServiceOfferingDTOs)) {
            utils.forEach(buResponseBasedOnChargeType,
                (associationList: BuSoAssociation) => {
                    utils.forEach(editRateData.businessUnitServiceOfferingDTOs,
                        (eachBU: BuSoAssociation) => {
                            if (associationList.financeBusinessUnitServiceOfferingAssociationID ===
                                eachBU.financeBusinessUnitServiceOfferingAssociationID) {
                                const objectFormat = {
                                    financeBusinessUnitServiceOfferingAssociationID:
                                        associationList.financeBusinessUnitServiceOfferingAssociationID,
                                    chargeTypeBusinessUnitServiceOfferingAssociationID:
                                        associationList.chargeTypeBusinessUnitServiceOfferingAssociationID,
                                    financeBusinessUnitCode: associationList.financeBusinessUnitCode,
                                    serviceOfferingDescription: associationList.serviceOfferingDescription,
                                    financeBusinessUnitServiceOfferingDisplayName:
                                        `${associationList.financeBusinessUnitCode} - ${associationList.serviceOfferingDescription}`

                                };
                                busoPatchValues.push(objectFormat);
                                editBusinessArray.push(associationList['financeBusinessUnitServiceOfferingAssociationID']);
                                editChargeBusinessArray.push(associationList['chargeTypeBusinessUnitServiceOfferingAssociationID']);
                                optionsalComp.optionalAttributesModel.operationalArray.push
                                    (`${associationList['financeBusinessUnitCode']} ${associationList['serviceOfferingDescription']}`);
                            }
                        });
                });
            const uniqueBuSoResponse = utils.uniqBy
                (busoPatchValues, 'financeBusinessUnitServiceOfferingAssociationID');
            optionsalComp.optionalAttributesModel.optionalForm.controls.businessUnit.setValue(uniqueBuSoResponse);
            optionsalComp.optionalAttributesModel.businessUnitAdded = true;
            optionsalComp.optionalAttributesModel.serviceLevelAdded = true;
            optionsalComp.getOperationalService();
            this.setRequestedServices(optionsalComp.optionalAttributesModel, parentScope);
            this.setServiceLevelDocumentValues(parentScope, editRateData, editBusinessArray, serviceLevelPatchValues);
        } else {
            this.setCurrencyCode(parentScope);
        }
        optionsalComp.emitbuSo(editChargeBusinessArray);
        optionsalComp.selectedBuSo.emit(editBusinessArray);
    }
    static setServiceLevelDocumentValues(parentScope, editRateData, editBusinessArray, serviceLevelPatchValues) {
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
                        utils.forEach(editRateData.businessUnitServiceOfferingDTOs,
                            (eachBU: BuSoAssociation) => {
                                if (value['value'] === eachBU['serviceLevelBusinessUnitServiceOfferingAssociationId']) {
                                    const serviceLevelObjectFormat = {
                                        label: value['label'],
                                        value: value['value']
                                    };
                                    serviceLevelPatchValues.push(serviceLevelObjectFormat);
                                }
                            });
                    });
                }
                const uniqueServiceLevelResponse = utils.uniqBy
                    (serviceLevelPatchValues, 'label');
                parentScope.optionalFields.optionalAttributesModel.optionalForm.controls.serviceLevel.setValue(uniqueServiceLevelResponse);
                this.setCurrencyCode(parentScope);
            });
    }
    static setCurrencyCode(parentScope) {
        const EditCurrencyValue = parentScope.createRatesModel.editAccessorialWholeResponse.currencyCode;
        parentScope.createDocumentationService.getCurrencyCodes().pipe(takeWhile(() =>
            parentScope.createRatesModel.createRatesValidation.isSubscribeFlag))
            .subscribe((data: [string]) => {
                if (data) {
                    parentScope.createRatesModel.currencyCodes = data.map((currencyCode: string, index: number) => {
                        return {
                            label: currencyCode,
                            value: currencyCode
                        };
                    });
                    parentScope.createRatesModel.ratesForm.controls['currency'].setValue({
                        label: EditCurrencyValue ? EditCurrencyValue : '',
                        value: EditCurrencyValue ? EditCurrencyValue : ''
                    });
                    parentScope.createRatesModel.currencyAdded = true;
                }
                this.setLegalDocValues(parentScope);
            });
    }
    static setCheckBoxAttributes(editRateData, parentScope) {
        parentScope.createRatesModel.ratesForm.controls.waived.setValue(editRateData.waived);
        parentScope.createRatesModel.ratesForm.controls.calculateRate.setValue(editRateData.calculateRateManually);
        parentScope.createRatesModel.ratesForm.controls.passThrough.setValue(editRateData.passThrough);
        parentScope.createRatesModel.ratesForm.controls.rollUp.setValue(editRateData.rateSetupStatus);
        if (editRateData.waived) {
            parentScope.createRatesModel.waivedFlag = false;
        }
        parentScope.createRatesModel.CheckBoxAttributes = {
            waived: editRateData.waived,
            calculateRate: editRateData.calculateRateManually,
            passThrough: editRateData.passThrough,
            rollUp: editRateData.rateSetupStatus
        };
    }
    static setValuesForEquipments(editRateData, optionalAttributesModel: OptionalAttributesModel, optionsalComp) {
        if (editRateData.equipmentCategoryCode) {
            optionalAttributesModel.optionalForm.controls.equipmentCategory.setValue({
                label: editRateData.equipmentCategoryCode,
                value: editRateData.equipmentCategoryCode
            });
            optionsalComp.getEquipmentType(optionalAttributesModel.optionalForm.controls.equipmentCategory.value);
        }
        if (editRateData.equipmentTypeDescription) {
            optionalAttributesModel.optionalForm.controls.equipmentType.setValue({
                label: editRateData.equipmentTypeDescription,
                value: editRateData.equipmentTypeDescription
            });
            optionsalComp.getEquipmentLength(optionalAttributesModel.optionalForm.controls.equipmentType.value);
        }
        if (editRateData.equipmentLengthId) {
            optionalAttributesModel.optionalForm.controls.equipmentLength.setValue({
                label: editRateData['equipmentLength'],
                value: `${editRateData['equipmentLength']} ${editRateData['equipmentLengthDescription']} in Length`,
                id: editRateData['equipmentLengthId']
            });
        }
    }

    static checkRatesLevel(editRateData, createRatesModel) {
        switch (editRateData.level) {
            case 'Agreement':
                this.setAgreementLevel(editRateData, createRatesModel);
                break;
            case 'Contract':
                this.setContractLevel(editRateData, createRatesModel);
                break;
            case 'Section':
                createRatesModel.ratesForm.controls['documentationLevel'].setValue('section');
                createRatesModel.ratesDocumentLevel = 'section';
                if (!utils.isEmpty(editRateData['sections']) && (editRateData['sections']).length > 0) {
                    createRatesModel.editSectionValues = editRateData['sections'];
                }
                if (!utils.isEmpty(editRateData['sectionAccounts']) && (editRateData['sectionAccounts']).length > 0) {
                    createRatesModel.editBillToValues = editRateData['sectionAccounts'];
                }
                break;
        }
    }
    static setAgreementLevel(editRateData, createRatesModel) {
        createRatesModel.ratesForm.controls['documentationLevel'].setValue('Agreement');
        createRatesModel.ratesDocumentLevel = 'Agreement';
        if (!utils.isEmpty(editRateData['sectionAccounts']) && (editRateData['sectionAccounts']).length > 0) {
            createRatesModel.editBillToValues = editRateData['sectionAccounts'];
        }
    }
    static setContractLevel(editRateData, createRatesModel) {
        createRatesModel.ratesForm.controls['documentationLevel'].setValue('contract');
        createRatesModel.ratesDocumentLevel = 'contract';
        if (!utils.isEmpty(editRateData['contracts']) && (editRateData['contracts']).length > 0) {
            createRatesModel.editContractValues = editRateData['contracts'];
        }
        if (!utils.isEmpty(editRateData['sectionAccounts']) && (editRateData['sectionAccounts']).length > 0) {
            createRatesModel.editBillToValues = editRateData['sectionAccounts'];
        }
    }
    static setCarrierValues(editRateData, optionalAttributesModel) {
        if (!utils.isEmpty(editRateData['carrierDTOs']) && (editRateData['carrierDTOs']).length > 0) {
            const carrierValuesinEdit = [];
            editRateData.carrierDTOs.forEach(eachCarrier => {
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
    static setRequestedServices(optionalAttributesModel, parentScope) {
        const requestedServicePatch = [];
        const editReqService = parentScope.createRatesModel.editRequestedServiceResponse;
        if (!utils.isEmpty(editReqService) && (editReqService.length) > 0) {
            editReqService.forEach((eachRequestedService: EditRequestedServiceResponse) => {
                requestedServicePatch.push(
                    `${eachRequestedService['code']}:${eachRequestedService['description']}`);
            });
        }
        optionalAttributesModel.optionalForm.controls.requestedService.setValue(requestedServicePatch);
        optionalAttributesModel.operationalServiceAdded = true;
        parentScope.changeDetector.detectChanges();
    }
    static dateFormatter(value: string | Date): string {
        return moment(value).format('MM/DD/YYYY');
    }
    static setValuesForAlternateCharge(customerAccessorialRateAlternateChargeDTO: EditAlternateChargeResponse,
        createRatesModel: CreateRatesModel, parentScope) {
        if (!utils.isEmpty(customerAccessorialRateAlternateChargeDTO)) {
            createRatesModel.alternateCharge = true;
            const thresholdQunatity = customerAccessorialRateAlternateChargeDTO.customerAlternateChargeThresholdQuantity;
            const convertedThresholdQunatity = thresholdQunatity ?
                parentScope.currencyPipe.transform(thresholdQunatity, '', '', '1.2-4') : '';
            createRatesModel.ratesForm.controls.quantity.
                setValue(convertedThresholdQunatity);
            createRatesModel.ratesForm.controls.quantityType.setValue({
                label: customerAccessorialRateAlternateChargeDTO.accessorialRateAlternateChargeQuantityTypeName,
                value: customerAccessorialRateAlternateChargeDTO.accessorialRateAlternateChargeQuantityTypeId
            });
            const alternateChargeTypeName = customerAccessorialRateAlternateChargeDTO.alternateChargeTypeName;
            const alternateChargeTypeCode = customerAccessorialRateAlternateChargeDTO.alternateChargeCode;
            const alternateChargeTypeinEdit = `${alternateChargeTypeName} (${alternateChargeTypeCode})`;
            createRatesModel.ratesForm.controls.alternateChargeType.setValue({
                label: alternateChargeTypeinEdit,
                value: customerAccessorialRateAlternateChargeDTO.alternateChargeTypeId,
                description: customerAccessorialRateAlternateChargeDTO.alternateChargeCode
            });
            createRatesModel.ratesForm.controls.alternateChargeType.setValidators(Validators.required);
            createRatesModel.ratesForm.controls.quantityType.setValidators(Validators.required);
            createRatesModel.ratesForm.controls.quantity.setValidators(Validators.required);
        }
    }
    static setLegalDocValues(parentScope) {
        if (!utils.isEmpty(parentScope.createRatesModel.refreshDocumentResponse)
            && parentScope.createRatesModel.refreshDocumentResponse.length > 0) {
            parentScope.documentation.refreshData(parentScope.createRatesModel.refreshDocumentResponse);
        }
    }
    static checkAccessorialRates(createRatesModel: CreateRatesModel) {
        const addRatesResponse: AddRateEditResponse[] = createRatesModel.editAccessorialWholeResponse.customerAccessorialRateChargeDTOs;
        if (!utils.isEmpty(addRatesResponse) && addRatesResponse.length > 0) {
            createRatesModel.isAddRateClicked = true;
            createRatesModel.addRateEditResponse = addRatesResponse;
        }
    }
    static checkAccessorialStairStepRates(createRatesModel: CreateRatesModel) {
        const stariStepDTO = createRatesModel.editAccessorialWholeResponse.customerAccessorialStairRateDTO;
        if (!utils.isEmpty(stariStepDTO)) {
            createRatesModel.isAddStairStepClicked = true;
            createRatesModel.addStairStepRateEditResponse = stariStepDTO;
        }
    }
    static checkAccessorialAdditionalCharge(createRatesModel: CreateRatesModel) {
        const additionalChargeDTO: EditAdditionalChargeResponse[] =
            createRatesModel.editAccessorialWholeResponse.customerAccessorialRateAdditionalChargeDTOs;
        if (!utils.isEmpty(additionalChargeDTO) && additionalChargeDTO.length > 0) {
            createRatesModel.isAdditionalChargesClicked = true;
            createRatesModel.editAdditionalChargeResponse = additionalChargeDTO;
        }
    }
}
