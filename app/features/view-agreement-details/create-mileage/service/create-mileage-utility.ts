import { CreateMileageModel } from '../models/create-mileage.model';
import { MessageService } from 'primeng/components/common/messageservice';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import * as utils from 'lodash';
import { CustomerAgreementContracts, HitsArray } from '../models/create-mileage.interface';

export class CreateMileageUtility {

    static createMileageFormInitialization(model, formBuilder) {
        model.createMileageForm = formBuilder.group({
            programName: ['', Validators.required],
            system: ['', Validators.required],
            systemVersion: ['', Validators.required],
            distanceUnit: ['', Validators.required],
            geographyType: ['', Validators.required],
            routeType: ['', Validators.required],
            calculationType: ['', Validators.required],
            effectiveDate: ['', Validators.required],
            expirationDate: ['', Validators.required],
            carrier: [''],
            decimalPrecision: [''],
            agreementDefault: [''],
            selectContract: [''],
            contract: [''],
            businessUnit: [''],
            sectionsRowDataField: [''],
            notes: [''],
            systemdd: [''],
            systemParameters: [''],
            mileageLevel: ['', Validators.required],
            borderMile: ['']
        });
        model.createMileageForm.controls['mileageLevel'].setValue('Agreement');
    }
    static validateDateFormat(event: Event, dateStatus: string, model): boolean | undefined {
        const date = event.srcElement['value'];
        const datePat = /^(\d{1,2})(\/)(\d{1,2})\2(\d{4}|\d{4})$/;
        const matchArray = date.trim().match(datePat);
        if (matchArray == null) {
            switch (dateStatus) {
                case 'effectiveDate':
                    model.inCorrectEffDateFormat = true;
                    model.effDate = new Date();
                    break;
                case 'expirationDate':
                    model.expDate = new Date();
                    model.inCorrectExpDateFormat = true;
                    break;
            }
            return false;
        } else {
            this.setDateValues(model, dateStatus, date);
        }
    }
    static setDateValues(model, dateStatus, typedDate) {
        switch (dateStatus) {
            case 'effectiveDate':
                model.effDate = new Date(typedDate);
                break;
            case 'expirationDate':
                model.expDate = new Date(typedDate);
                break;
        }
    }
    static getValidDate(model: CreateMileageModel) {
        model.isNotValidDate = false;
        const effDateValue = model.createMileageForm.controls['effectiveDate'].value;
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
        model.inCorrectEffDateFormat = (effDateValue.getTime() < model.effectiveMinDate.setHours(0, 0, 0, 0));
        if (todayDate.getDate() === effDateValue.getDate()) {
            effDateValue.setHours(0, 0, 0, 0);
        }
        if (effDateValue && model.createMileageForm.controls['expirationDate'].value) {
            model.isNotValidDate = (effDateValue.getTime() > model.createMileageForm.controls['expirationDate'].value.setHours(0, 0, 0, 0)
                || effDateValue.getTime() > model.expirationMaxDate.setHours(0, 0, 0, 0));
        }
    }

    static onSelectExpDate(model: CreateMileageModel) {
        model.inCorrectExpDateFormat = false;
        if (model.createMileageForm.controls['effectiveDate'].value) {
            this.getValidDate(model);
        }
        const expDateValue = model.createMileageForm.controls['expirationDate'].value.setHours(0, 0, 0, 0);
        model.inCorrectExpDateFormat = (expDateValue > model.expirationMaxDate.setHours(0, 0, 0, 0) ||
            expDateValue < model.effectiveMinDate.setHours(0, 0, 0, 0));
    }

    static setFormErrors(model: CreateMileageModel) {
        const effError = (model.inCorrectEffDateFormat || model.isNotValidDate);
        const expError = (model.inCorrectExpDateFormat || model.isNotValidDate);
        model.createMileageForm.controls.effectiveDate.setErrors(effError ? { invalid: true } : null);
        model.createMileageForm.controls.expirationDate.setErrors(expError ? { invalid: true } : null);
    }

    static toastMessage(messageService: MessageService, key: string, type: string, data: string) {
        const message = {
            severity: key,
            summary: type,
            detail: data
        };
        messageService.clear();
        messageService.add(message);
    }

    static viewReset(model: CreateMileageModel) {
        model.createMileageForm.reset();
    }
    static editRequestParam(model) {
        return {
            agreementName: model.customerAgreement['customerAgreementName'],
            mileageProgramName: model.createMileageForm.get('programName').value,
            id: model.mileageId,
            agreementDefaultIndicator: this.setAgreementDefaultForEditParam(model),
            contractDefault: null,
            businessUnitCodes: utils.isEmpty(model.createMileageForm.get('businessUnit').value) ? null :
                model.createMileageForm.get('businessUnit').value,
            customerAgreementContracts: utils.isEmpty(model.createMileageForm.get('contract').value) ? [] :
                model.createMileageForm.get('contract').value,
            customerAgreementSections: model.selectedSections,
            carriers: this.frameCarriers(model.createMileageForm.get('carrier').value),
            distanceUnit: model.createMileageForm.get('distanceUnit').value.label,
            decimalPrecisionIndicator: (model.createMileageForm.get('decimalPrecision').value) ? 'Y' : 'N',
            mileageBorderMileParameterType: model.borderMileParameter,
            effectiveDate: model.createMileageForm.get('effectiveDate').value.toISOString().split('T')[0],
            expirationDate: model.createMileageForm.get('expirationDate').value.toISOString().split('T')[0],
            mileageProgramNoteText: model.createMileageForm.get('notes').value,
            geographicPointType: model.createMileageForm.get('geographyType').value.label,
            mileageRouteType: model.createMileageForm.get('routeType').value.label,
            mileageCalculationType: model.createMileageForm.get('calculationType').value.label,
            mileageSystem: model.createMileageForm.get('system').value.label,
            mileageSystemVersion: model.createMileageForm.get('systemVersion').value.label,
            mileageSystemParameters: this.frameSystemParameterReq(model)
        };
    }
    static frameSystemParameterReq(model) {
        const parameters = [];
        model.systemParameters.forEach(element => {
            parameters.push(element['label']);
        });
        return parameters;
    }
    static frameCarriers(model) {
        const carrierList = [];
        model.forEach(element => {
            carrierList.push(element['label']);
        });
        return carrierList;
    }
    static patchValuesForEdit(mileageData, model) {
        model.effectiveDate = mileageData['effectiveDate'];
        model.expirationDate = mileageData['expirationDate'];
        model.createMileageForm.patchValue({
            programName: mileageData['mileageProgramName'],
            system: this.patchFieldValues(mileageData['mileageSystemID'],
                mileageData['mileageSystemName'], 'mileageSystemID', 'mileageSystemName'),
            systemVersion: this.patchFieldValues(mileageData['mileageSystemVersionID'],
                mileageData['mileageSystemVersionName'], 'mileageSystemVersionID', 'mileageSystemVersionName'),
            distanceUnit: this.patchFieldValues(mileageData['unitOfDistanceMeasurementCode'],
                mileageData['unitOfDistanceMeasurementCode'], 'code', 'description'),
            geographyType: this.patchFieldValues(mileageData['geographicPointTypeID'],
                mileageData['geographicPointTypeName'], 'geographicPointTypeID', 'geographicPointTypeName'),
            routeType: this.patchFieldValues(mileageData['mileageRouteTypeID'],
                mileageData['mileageRouteTypeName'], 'mileageRouteTypeID', 'mileageRouteTypeName'),
            calculationType: this.patchFieldValues(mileageData['mileageCalculationTypeID'],
                mileageData['mileageCalculationTypeName'], 'mileageCalculationTypeID', 'mileageCalculationTypeName'),
            effectiveDate: new Date(this.formatDate(mileageData['effectiveDate'])),
            expirationDate: new Date(this.formatDate(mileageData['expirationDate'])),
            agreementDefault: this.setAgreementDefaultValue(mileageData),
            notes: mileageData['mileageProgramNoteText'],
            carrier: this.patchCarrierValue(mileageData['carrierAssociations']),
            mileageLevel: this.setAffliation(mileageData, model)
        });
        if (mileageData.agreementDefaultIndicator === 'Y') {
            model.agreementExpirationDate = this.formatDate(mileageData['expirationDate']);
        }
    }
    static patchFieldValues(label, value, id, name) {
        return {
            'label': {
                [id]: label,
                [name]: value
            },
            'value': value
        };
    }
    static patchCarrierValue(carriers) {
        const editCarrierList = [];
        carriers.forEach(carrier => {
            editCarrierList.push({
                label: carrier,
                value: carrier['name']
            });
        });
        return editCarrierList;
    }
    static setBusinessUnitForEdit(model, changeDetector) {
        model.createMileageForm.controls.businessUnit
            .patchValue(model.editDetails['financeBusinessUnitAssociations']);
        changeDetector.detectChanges();
    }
    static setAgreementDefaultValue(mileageData) {
        if (mileageData['agreementDefaultIndicator'] === 'Y') {
            return true;
        } else {
            return false;
        }
    }
    static setAgreementDefaultForEditParam(model) {
        if (model.createMileageForm.get('agreementDefault').value) {
            return 'Y';
        } else {
            return 'N';
        }
    }
    static setAffliation(mileageData, model) {
        return (mileageData['contractAssociations'] &&
            mileageData['contractAssociations'].length > 0) ?
            'Contract' : ((mileageData['sectionAssociations'] &&
                mileageData['sectionAssociations']
                    .length > 0) ? 'Section' : 'Agreement');
    }
    static formatDate(value: string | Date) {
        return moment(value).format('MM/DD/YYYY');
    }
    static setContractValidatorsToEmpty(model) {
        model.createMileageForm.controls.contract.setValidators(null);
        model.createMileageForm.controls.contract.updateValueAndValidity();
        model.createMileageForm.controls['contract'].markAsUntouched();
    }
    static setCarrierRequest(event, model) {
        model.createRequestParam['carriers'].push({
            name: event['label']['name'],
            id: event['label']['id'],
            code: event['label']['code']
        });
    }
    static setAutocompleteList(event, listArray, existingList, model) {
        model[listArray] = [];
        model[existingList].forEach((element: any) => {
            if (element.value && element.value.toString().toLowerCase().indexOf(event['query'].toLowerCase()) > -1) {
                model[listArray].push({
                    label: element.label,
                    value: element.value
                });
            }
        });
    }
    static getContractSectionList(tabValue, component) {
        if (tabValue === 'Contract') {
            component.getContractsList(false);
        } else if (tabValue === 'Section') {
            component.getSectionsGrid(false);
        }
    }

    static getMissingField(model) {
        let checkMandate = false;
        Object.keys(model.createMileageForm.controls).forEach(key => {
            if ((key !== 'contract') && (model.createMileageForm.controls[key].errors !== null) &&
                (model.createMileageForm.controls[key].errors['required'])) {
                checkMandate = true;
            }
        });
        return checkMandate;
    }

    static getIsSectionValid(model, selectedSections) {
        const isSectionLevel = model.createMileageForm.controls[`mileageLevel`].value === 'Section';
        return isSectionLevel ? (selectedSections.length > 0) : true;
    }

    static getIsSectionModified(model, selectedSections) {
        const isSectionLevel = model.createMileageForm.controls[`mileageLevel`].value === 'Section';
        const sectionsAdded = utils.differenceBy(selectedSections,
            model.sectionListCopy, 'customerAgreementContractSectionID');
        const sectionsRemoved = utils.differenceBy(model.sectionListCopy,
            selectedSections, 'customerAgreementContractSectionID');
        return isSectionLevel && (sectionsAdded.length > 0 || sectionsRemoved.length > 0);
    }

    static frameContractList(model, response) {
        const contractArray = [];
        response.forEach((contracts: CustomerAgreementContracts) => {
            contractArray.push({
                label: (contracts.customerContractNumber) ?
                    `${contracts.customerContractNumber} (${contracts.customerContractName})` :
                    `Transactional (${contracts.customerContractName})`,
                value: {
                    customerAgreementContractID: contracts.customerAgreementContractID,
                    customerContractName: contracts.customerContractName,
                    customerAgreementContractTypeName: contracts.contractTypeName,
                    customerContractNumber: contracts.customerContractNumber
                }
            });
        });
        return model.contractsList = utils.cloneDeep(contractArray);
    }
    static systemParameterFramer(model, element) {
        model.systemParameters.push({
            'label': {
                'mileageSystemParameterID': element['mileageSystemParameterID'],
                'mileageSystemParameterAssociationID': element['mileageSystemParameterAssociationID'],
                'mileageSystemParameterName': element['mileageSystemParameterName'],
                'mileageParameterSelectIndicator': element['mileageParameterSelectIndicator'] ?
                    element['mileageParameterSelectIndicator'] : 'N'
            },
            'value': element['mileageSystemParameterName']
        });
    }
    static carrierFramer(carriers, model) {
        carriers.forEach((element: HitsArray) => {
            model.carrierList.push({
                label: {
                    'id': element['_source']['CarrierID'],
                    'code': element['_source']['CarrierCode'],
                    'name': element['_source']['LegalName']
                },
                value: `${element['_source']['LegalName']} (${element['_source']['CarrierCode']})`
            });
        });
    }
}
