import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormsModule, FormControl } from '@angular/forms';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';
import * as moment from 'moment';
import { ActivatedRoute, Params } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { Observable, timer } from 'rxjs';
import { CreateMileageModel } from './models/create-mileage.model';
import { CreateMileageQuery } from './query/create-mileage.query';
import { CreateMileageService } from './service/create-mileage.service';
import {
    AgreementDetails, BusinessUnitServiceOffering, CalculationType, CustomerAgreementContracts, CustomerAgreementContractsDetails,
    DomainAttributesType, DropdownListType, GeographicPointType, MileageSystem, MileageSystemParameters,
    MileageSystemVersions, HitsArray, RootObject, RouteType,
    ServiceOfferingBusinessUnitTransitModeAssociations, LengthMeasurementCode, MockSectionColumnsType,
    CustomerAgreementContractSections, TabEventInterface
} from './models/create-mileage.interface';
import { BroadcasterService } from '../../../shared/jbh-app-services/broadcaster.service';
import { CreateMileageUtility } from './service/create-mileage-utility';
import { CanDeactivateGuardService } from '../../../shared/jbh-app-services/can-deactivate-guard.service';
import { LocalStorageService } from './../../../shared/jbh-app-services/local-storage.service';
import { TimeZoneService } from '../../../shared/jbh-app-services/time-zone.service';
import { Messages } from '../../../../config/messages.config';

@Component({
    selector: 'app-create-mileage',
    templateUrl: './create-mileage.component.html',
    styleUrls: ['./create-mileage.component.scss'],
    providers: [CreateMileageService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateMileageComponent implements OnInit, OnDestroy {
    createMileageModel: CreateMileageModel;
    selectedValue = 'Miles to border';
    errMsg = 'Error Message';
    cols: MockSectionColumnsType[];
    selectedSections: CustomerAgreementContractSections[];
    agreementURL: string;
    viewMileageURL: string;
    agreementID: string;
    isDateChangedFlag: boolean;
    agreementDefaultExists: boolean;
    @ViewChild('effectiveCal') effectiveCal;
    @ViewChild('expirationCal') expirationCal;

    @ViewChild('programName') programNameRef;
    constructor(
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly changeDetector: ChangeDetectorRef,
        private readonly formBuilder: FormBuilder,
        private readonly messageService: MessageService,
        private readonly createMileageService: CreateMileageService,
        private readonly shared: BroadcasterService, private readonly store: LocalStorageService,
        private readonly timeZoneService: TimeZoneService) {
        this.selectedSections = [];
        this.viewMileageURL = '/viewagreement';
        this.route.queryParams.subscribe((params: Params) => {
            this.agreementID = String(params['id']);
            this.agreementURL = `/viewagreement?id=${this.agreementID}`;
            this.createMileageModel = new CreateMileageModel(this.agreementID);
        }, (error: Error) => {
            CreateMileageUtility.toastMessage(this.messageService, 'error', 'Error', error.message);
        });
    }
    ngOnInit() {
        CreateMileageUtility.createMileageFormInitialization(this.createMileageModel, this.formBuilder);
        this.getAgreementDetails(Number(this.agreementID));
        this.cols = [
            { fieldName: 'customerAgreementContractSectionName', displayName: 'Sections' },
            { fieldName: 'customerContractName', displayName: 'Contracts' }
        ];
        this.onFormValueChange();
    }
    onFormValueChange() {
        this.createMileageModel.createMileageForm.controls['mileageLevel'].valueChanges.subscribe(val => {
            if (val === 'Contract') {
                this.createMileageModel.createMileageForm.controls.contract.setValidators(Validators.required);
                this.createMileageModel.createMileageForm.controls.contract.updateValueAndValidity();
            }
        });
    }
    ngOnDestroy() {
        this.createMileageModel.subscriberFlag = false;
    }
    subscribeMileageDetails() {
        this.shared.on<any>('editMileageDetails').pipe(takeWhile(() => this.createMileageModel.subscriberFlag))
            .subscribe((data) => {
                if (data && data.isMileageEdit) {
                    this.createMileageModel.mileageId = data.mileageID;
                    this.createMileageModel.breadCrumbList[3]['label'] = 'Edit Program';
                    this.createMileageModel.editFlag = data.isMileageEdit;
                    this.createMileageModel.editDetails = data['editMileageData'];
                    CreateMileageUtility.patchValuesForEdit(data['editMileageData'], this.createMileageModel);
                    this.patchInputFields(data['editMileageData']);
                    this.setAuditDetails();
                } else {
                    this.setContractDefault(this.createMileageModel.customerAgreement.customerAgreementID);
                }
                this.populateInputFields();
                this.getCarrierList();
                this.dateValueChange();
            });
    }
    dateValueChange() {
        this.createMileageModel.createMileageForm.controls['effectiveDate'].valueChanges.subscribe((selectedValue) => {
            if (Date.parse(selectedValue) !== Date.parse(this.createMileageModel.createMileageForm.value.effectiveDate)) {
                this.isDateChangedFlag = true;
            }
        }
        );
        this.createMileageModel.createMileageForm.controls['expirationDate'].valueChanges.subscribe((selectedValue) => {
            if (Date.parse(selectedValue) !== Date.parse(this.createMileageModel.createMileageForm.value.expirationDate)) {
                this.isDateChangedFlag = true;
            }
        }
        );
    }
    patchInputFields(mileageData) {
        this.createMileageModel.systemParameters = [];
        this.createMileageModel.systemParametersList = [];
        this.createMileageModel.systemParametersFlag = true;
        this.selectedValue = mileageData['mileageBorderMileParameterTypeName'];
        if (mileageData.decimalPrecisionIndicator === 'Y') {
            this.createMileageModel.createMileageForm.controls.decimalPrecision.setValue(true);
        } else {
            this.createMileageModel.createMileageForm.controls.decimalPrecision.setValue(false);
        }
        this.patchSystemParameterInput(mileageData);
        this.checkMileageLevel();
        this.changeDetector.detectChanges();
    }
    checkMileageLevel() {
        switch (this.createMileageModel.createMileageForm.controls.mileageLevel.value) {
            case 'Contract':
                this.setContractDefault(this.createMileageModel.customerAgreement.customerAgreementID);
                break;
            case 'Section':
                this.getSectionsGrid(true);
        }
    }
    patchSystemParameterInput(mileageData) {
        mileageData['mileageSystemParameters'].forEach(systemParameter => {
            this.createMileageModel.systemParameters.push({
                'label': {
                    'mileageSystemParameterID': systemParameter['mileageSystemParameterID'],
                    'mileageSystemParameterAssociationID': systemParameter['mileageSystemParameterAssociationID'],
                    'mileageSystemParameterName': systemParameter['mileageSystemParameterName'],
                    'mileageParameterSelectIndicator': systemParameter['mileageParameterSelectIndicator']
                },
                'value': systemParameter['mileageSystemParameterName']
            });
            if (systemParameter['mileageParameterSelectIndicator'] === 'Y') {
                this.createMileageModel.systemParametersList.push(systemParameter['mileageSystemParameterID'].toString());
            }
        });
    }
    setBusinessUnitForEdit() {
        if (this.createMileageModel.editDetails['financeBusinessUnitAssociations'].length) {
            this.createMileageModel.isTopAdded = true;
        }
        this.createMileageModel.createMileageForm.controls.businessUnit
            .patchValue(this.createMileageModel.editDetails['financeBusinessUnitAssociations']);
        this.changeDetector.detectChanges();
    }
    setAuditDetails() {
        this.createMileageModel.editDetails['createTimestamp'] =
            this.timeZoneService.convertToLocal(this.createMileageModel.editDetails.createTimestamp);
        this.createMileageModel.editDetails['lastUpdateTimestamp'] =
            this.timeZoneService.convertToLocal(this.createMileageModel.editDetails.lastUpdateTimestamp);
        this.changeDetector.detectChanges();
    }
    loadSystemVersionForEdit() {
        const matchedSystem = utils.find(this.createMileageModel.domainAttributes['mileageSystems'],
            { 'mileageSystemID': this.createMileageModel.editDetails.mileageSystemID });
        matchedSystem['mileageSystemVersions'].forEach((mileageElem: MileageSystemVersions) => {
            this.setMileageSystem(mileageElem);
        });
    }
    setBorderParameter() {
        this.createMileageModel.borderMileParameter = {
            'mileageBorderMileParameterTypeID': this.createMileageModel.editDetails['mileageBorderMileParameterTypeID'],
            'mileageBorderMileParameterTypeName': this.createMileageModel.editDetails['mileageBorderMileParameterTypeName']
        };
    }
    onSelectDropdown(event, selectedField: string) {
        const id = `${selectedField}ID`;
        const name = `${selectedField}Name`;
        switch (selectedField) {
            case 'distanceUnit':
                this.createMileageModel.createRequestParam[selectedField] = {
                    code: event['label']['code'],
                    description: event['value']
                };
                break;
            default:
                this.createMileageModel.createRequestParam[selectedField] = {
                    [id]: event['label'][id],
                    [name]: event['value']
                };
        }
    }
    onClearDropDown(control: string) {
        this.createMileageModel.createMileageForm.controls[control].setValue('');
        if (control === 'system') {
            this.createMileageModel.systemVersion = [];
            this.createMileageModel.systemVersionList = [];
            this.createMileageModel.createMileageForm['controls']['systemVersion'].setValue('');
            this.createMileageModel.systemParameters = [];
            this.createMileageModel.systemParametersFlag = false;
        }
    }
    onSelectSystemName(event) {
        this.createMileageModel.systemVersion = [];
        this.createMileageModel.createMileageForm['controls']['systemVersion'].setValue('');
        this.createMileageModel.createRequestParam['mileageSystem'] = {
            'mileageSystemID': event['label']['mileageSystemID'],
            'mileageSystemName': event['value']
        };
        const matchedSystem = utils.find(this.createMileageModel.domainAttributes['mileageSystems'],
            { 'mileageSystemName': event['value'] });
        matchedSystem['mileageSystemVersions'].forEach((mileageElem: MileageSystemVersions) => {
            this.setMileageSystem(mileageElem);
        });
        this.changeDetector.detectChanges();
        this.fetchSystemParameters(matchedSystem['mileageSystemParameters']);
    }
    private setMileageSystem(element: MileageSystemVersions) {
        this.createMileageModel.systemVersion.push({
            label: {
                mileageSystemVersionID: element['mileageSystemVersionID'],
                mileageSystemVersionName: element['mileageSystemVersionName']
            },
            value: element['mileageSystemVersionName']
        });
        this.createMileageModel.systemVersionList = utils.cloneDeep(this.createMileageModel.systemVersion);
    }
    onSelectSystemVersion(event) {
        this.createMileageModel.createRequestParam['mileageSystemVersion'] = {
            'mileageSystemVersionID': event['label']['mileageSystemVersionID'],
            'mileageSystemVersionName': event['value']
        };
    }
    onChangeDecimalPrecision(event) {
        this.createMileageModel.createRequestParam['decimalPrecisionIndicator'] = event['checked'] ? 'Y' : 'N';
    }
    onChangeAgreementDefault(event) {
        this.createMileageModel.agreementDefaulFlag = true;
        if (event['checked']) {
            this.createMileageModel.createRequestParam['agreementDefaultIndicator'] = 'Y';
            this.createMileageModel.createMileageForm.controls['selectContract'].setValue(false);
            this.createMileageModel.createMileageForm.controls['contract'].setValue('');
            this.createMileageModel.contractsList = [];
            this.createMileageModel.createMileageForm.controls.contract.setValidators([]);
            this.createMileageModel.createMileageForm.controls.contract.updateValueAndValidity();
            this.createMileageModel.createMileageForm.controls.contract.markAsUntouched();
            const effective = new Date(this.createMileageModel.customerAgreement.effectiveDate.replace(/-/g, '\/').replace(/T.+/, ''));
            const expirationDate = new Date(this.createMileageModel.customerAgreement.expirationDate
                .replace(/-/g, '\/').replace(/T.+/, ''));
            this.createMileageModel.createMileageForm.controls['effectiveDate'].setValue(effective);
            this.createMileageModel.createMileageForm.controls['expirationDate'].setValue(expirationDate);
            this.createMileageModel.effectiveDate = this.createMileageModel.customerAgreement.effectiveDate;
            this.createMileageModel.expirationDate = this.createMileageModel.customerAgreement.expirationDate;
        } else {
            this.createMileageModel.createMileageForm.controls['selectContract'].setValue(true);
            this.createMileageModel.createRequestParam['agreementDefaultIndicator'] = 'N';
            this.getContractsList(false);
        }
    }
    onDateSelected(event, selectedDateField: string) {
        const dateFormat = 'YYYY-MM-DD';
        const dateFormatWithSlash = 'YYYY/MM/DD';
        const date = `${moment(event).format(dateFormat)}`;
        this.createMileageModel.createRequestParam[selectedDateField] = date;
        const dateValue = new Date(event);
        if (selectedDateField === 'effectiveDate') {
            this.createMileageModel.effectiveDate = date;
            dateValue.setDate(dateValue.getDate() - 1);
            this.createMileageModel.expirationMinDate = new Date(`${moment(event).format(dateFormatWithSlash)}`);
            this.createMileageModel.disabledExpDatesList = [new Date(`${moment(dateValue).format(dateFormatWithSlash)}`)];
        }
        if (selectedDateField === 'expirationDate') {
            this.createMileageModel.expirationDate = date;
            dateValue.setDate(dateValue.getDate() + 1);
            this.createMileageModel.effectiveMaxDate = new Date(`${moment(event).format(dateFormatWithSlash)}`);
            this.createMileageModel.disabledEffDatesList = [new Date(`${moment(dateValue).format(dateFormatWithSlash)}`)];
        }
        if ((this.createMileageModel.effectiveDate !== '') && (this.createMileageModel.expirationDate !== '') &&
            this.createMileageModel.createMileageForm.controls.effectiveDate.valid &&
            this.createMileageModel.createMileageForm.controls.expirationDate.valid && this.isDateChangedFlag) {
            this.createMileageModel.contractsList = [];
            this.createMileageModel.createMileageForm.controls.contract.setValue([]);
            this.getContractsList(false);
            if (this.createMileageModel.createMileageForm.controls.effectiveDate.valid &&
                this.createMileageModel.createMileageForm.controls.expirationDate.valid) {
                this.createMileageModel.sectionsList = [];
                this.createMileageModel.createMileageForm.controls.contract.setValue([]);
                this.getSectionsGrid(false);
            }
            this.isDateChangedFlag = false;
        } else if (this.isDateChangedFlag) {
            this.createMileageModel.contractsList = [];
            this.createMileageModel.createMileageForm.controls.contract.setValue([]);
            this.createMileageModel.sectionsList = [];
            this.isDateChangedFlag = false;
        }
        this.changeDetector.detectChanges();
    }
    onChangeCheckboxValue(event: boolean, data) {
        this.createMileageModel.createRequestParam.mileageSystemParameters.forEach(element => {
            if (element['mileageSystemParameterID'] === data['label']['mileageSystemParameterID']) {
                element['mileageParameterSelectIndicator'] = (event) ? 'Y' : 'N';
            }
        });
        this.createMileageModel.systemParameters.forEach(parameter => {
            if (parameter['label']['mileageSystemParameterID'] === data['label']['mileageSystemParameterID']) {
                parameter['label']['mileageParameterSelectIndicator'] = (event) ? 'Y' : 'N';
            }
        });
    }
    onClickBorderMilesParameter(event, value, id: number) {
        if (!this.createMileageModel.editFlag) {
            this.createMileageModel.createRequestParam['mileageBorderMileParameterType'] = {
                'mileageBorderMileParameterTypeID': id,
                'mileageBorderMileParameterTypeName': value
            };
        } else {
            this.createMileageModel.borderMileParameter = {
                'mileageBorderMileParameterTypeID': id,
                'mileageBorderMileParameterTypeName': value
            };
        }
    }
    onChangeBusinessUnit(event) {
        if (event['value'].length) {
            this.createMileageModel.isTopAdded = true;
        } else {
            this.createMileageModel.isTopAdded = false;
        }
        this.createMileageModel.createRequestParam['businessUnitCodes'] = event['value'];
        this.changeDetector.detectChanges();
    }
    onChangeContracts(event) {
        this.selectedSections = [];
        if (event['value'].length === this.createMileageModel.contractsList.length) {
            this.createMileageModel.isTopAddedContract = true;
        } else {
            this.createMileageModel.isTopAddedContract = false;
        }
        this.createMileageModel.createRequestParam['customerAgreementContracts'] = event['value'];
    }
    onSelectCarrier(event) {
        this.createMileageModel.createRequestParam['carriers'].push({
            name: event['label']['name'],
            id: event['label']['id'],
            code: event['label']['code']
        });
    }
    onCarrierRemoval(event) {
        utils.remove(this.createMileageModel.createRequestParam['carriers'], { 'id': event['label']['id'] });
    }
    onClickCreate() {
        if (!this.createMileageModel.editFlag) {
            this.createMileageModel.isPageLoaded = true;
            this.changeDetector.detectChanges();
            this.frameCreateReqParam();
            const notes = this.createMileageModel.createMileageForm.get('notes').value;
            this.createMileageModel.createRequestParam['mileageProgramNoteText'] = notes ? notes : null;
            this.affliationValidation();
            this.createMileageModel.mandatoryFields.forEach((control: string) => {
                this.createMileageModel.createMileageForm.controls[control].markAsTouched();
            });
            if (this.createMileageModel.createMileageForm.valid && !this.createMileageModel.sectionErrorFlag) {
                this.createMileageProgram();
            } else {
                this.mileageValidations();
            }
        } else {
            this.frameEditReqParam();
        }
    }
    affliationValidation() {
        if (!utils.isEmpty(this.selectedSections)) {
            this.createMileageModel.createRequestParam['customerAgreementSections'] = this.selectedSections;
            this.createMileageModel.createRequestParam['agreementDefaultIndicator'] = 'N';
        }
        if (this.createMileageModel.createMileageForm.controls.mileageLevel.value === 'Section' &&
            utils.isEmpty(this.selectedSections)) {
            this.createMileageModel.sectionErrorFlag = true;
        } else {
            this.createMileageModel.sectionErrorFlag = false;
        }
        if (this.createMileageModel.createMileageForm.controls.mileageLevel.value === 'Contract') {
            this.createMileageModel.isContractAfflitation = true;
            this.createMileageModel.createMileageForm.controls.contract.setValidators(Validators.required);
            this.createMileageModel.createMileageForm.controls.contract.updateValueAndValidity();
            this.createMileageModel.createMileageForm.controls['contract'].markAsTouched();
        }
    }
    frameCreateReqParam() {
        this.createMileageModel.createRequestParam.agreementDefaultIndicator =
            (this.createMileageModel.createMileageForm.controls.agreementDefault.value) ? 'Y' : 'N';
    }
    frameEditReqParam() {
        this.affliationValidation();
        const isSectionChanged = CreateMileageUtility.getIsSectionModified(this.createMileageModel, this.selectedSections);
        const isSectionValid = CreateMileageUtility.getIsSectionValid(this.createMileageModel, this.selectedSections);
        if ((this.createMileageModel.createMileageForm.valid && this.createMileageModel.createMileageForm.dirty && isSectionValid) ||
            (isSectionChanged && isSectionValid)) {
            const requestParam = CreateMileageUtility.editRequestParam(this.createMileageModel);
            requestParam['customerAgreementSections'] = this.selectedSections;
            this.editMileageProgram(requestParam);
        } else if (this.createMileageModel.createMileageForm.dirty ||
            (this.createMileageModel.createMileageForm.controls.mileageLevel.value === 'Section' && this.selectedSections.length === 0)) {
            this.createMileageModel.mandatoryFields.forEach((control: string) => {
                this.createMileageModel.createMileageForm.controls[control].markAsTouched();
            });
            this.mileageValidations();
        } else {
            const messages = Messages.getMessage();
            CreateMileageUtility.toastMessage(this.messageService, 'info', 'No Changes Found',
                messages.noChangesMessage.message);
        }
    }
    createMileageProgram() {
        this.createMileageModel.createRequestParam['agreementName'] =
            this.createMileageModel.customerAgreement['customerAgreementName'];
        this.createMileageModel.createRequestParam['mileageProgramName'] = this.createMileageModel.createMileageForm
            .controls['programName'].value;
        const agreementID = this.createMileageModel.customerAgreement.customerAgreementID;
        this.createMileageService.postMileagePreference(this.createMileageModel.createRequestParam, agreementID)
            .pipe(takeWhile(() => this.createMileageModel.subscriberFlag))
            .subscribe((response) => {
                this.navigateOnSuccess(response, 'Program Created', response['message']);
            }, (error: HttpErrorResponse) => {
                this.handleError(error);
            });
    }
    editMileageProgram(requestParam) {
        this.createMileageModel.isPageLoaded = true;
        this.createMileageService.editMileageService(requestParam, this.createMileageModel.customerAgreement.customerAgreementID,
            this.createMileageModel.editDetails.customerMileageProgramID,
            this.createMileageModel.editDetails.customerMileageProgramVersionID)
            .pipe(takeWhile(() => this.createMileageModel.subscriberFlag))
            .subscribe((response) => {
                this.navigateOnSuccess(response, 'Program Edited', response['message']);
            }, (error: HttpErrorResponse) => {
                this.handleError(error);
            });
    }
    navigateOnSuccess(response, successMessageType, successMessage) {
        this.createMileageModel.isPageLoaded = false;
        if (response['status'] === 'Warning') {
            CreateMileageUtility.toastMessage(this.messageService, 'warn', 'Warning',
                response['message']);
        } else {
            CreateMileageUtility.toastMessage(this.messageService, 'success', successMessageType, successMessage);
        }
        this.changeDetector.detectChanges();
        this.removeDirty();
    }
    removeDirty() {
        this.createMileageModel.isPageLoaded = false;
        utils.forIn(this.createMileageModel.createMileageForm.controls, (value: FormControl, name: string) => {
            this.createMileageModel.createMileageForm.controls[name].markAsPristine();
        });
        this.shared.broadcast('mileageCreate', 'success');
        this.createMileageModel.isDetailsSaved = true;
        this.changeDetector.detectChanges();
        this.store.setItem('agreementDetails', 'create', 'Mileage', true);
        this.router.navigate([this.viewMileageURL], {
            queryParams:
                { id: this.createMileageModel.customerAgreement.customerAgreementID }
        });
        this.createMileageModel.breadCrumbList[3]['label'] = this.createMileageModel.createBreadCrumbValue;
        this.createMileageModel.editFlag = false;
    }
    handleError(error) {
        this.createMileageModel.isPageLoaded = false;
        this.changeDetector.detectChanges();
        if (!utils.isEmpty(error.error) && !utils.isEmpty(error.error.errors)) {
            CreateMileageUtility.toastMessage(this.messageService, 'error', error.error.errors[0].errorType,
                error.error.errors[0].errorMessage);
        }
    }
    mileageValidations() {
        const errorMsg = 'Missing Required Information';
        if (CreateMileageUtility.getMissingField(this.createMileageModel)) {
            CreateMileageUtility.toastMessage(this.messageService, 'error', errorMsg,
                'Provide the required information in the highlighted fields and submit the form again ');
        } else if (this.createMileageModel.createMileageForm.controls['effectiveDate'].invalid ||
            this.createMileageModel.createMileageForm.controls['expirationDate'].invalid) {
            CreateMileageUtility.toastMessage(this.messageService, 'error', this.errMsg,
                'Enter a valid date range');
        } else if (this.createMileageModel.sectionErrorFlag) {
            CreateMileageUtility.toastMessage(this.messageService, 'error', errorMsg,
                'Please select atleast one section');
        } else if (this.createMileageModel.isContractAfflitation) {
            CreateMileageUtility.toastMessage(this.messageService, 'error', errorMsg,
                'Please select atleast one contract');
        }
        this.createMileageModel.isPageLoaded = false;
        this.changeDetector.detectChanges();
    }
    getAgreementDetails(agreementId: number) {
        this.createMileageService.fetchAgreementDetailsByCustomerAgreementId(agreementId)
            .pipe(takeWhile(() => this.createMileageModel.subscriberFlag))
            .subscribe((response: AgreementDetails) => {
                this.createMileageModel.customerAgreement = response;
                this.createMileageModel.effectiveMinDate = new Date(response['effectiveDate'].replace(/-/g, '\/').replace(/T.+/, ''));
                this.createMileageModel.effectiveMaxDate = new Date(response['expirationDate'].replace(/-/g, '\/').replace(/T.+/, ''));
                this.createMileageModel.expirationMinDate = new Date(response['effectiveDate'].replace(/-/g, '\/').replace(/T.+/, ''));
                this.createMileageModel.expirationMaxDate = new Date(response['expirationDate'].replace(/-/g, '\/').replace(/T.+/, ''));
                this.createMileageModel.createMileageForm.controls['effectiveDate'].setValue(this.createMileageModel.effectiveMinDate);
                this.createMileageModel.createMileageForm.controls['expirationDate'].setValue(this.createMileageModel.expirationMaxDate);
                this.createMileageModel.effDate = this.createMileageModel.effectiveMinDate;
                this.setCalendarDate('effectiveDate');
                this.createMileageModel.expDate = this.createMileageModel.expirationMaxDate;
                this.setCalendarDate('expirationDate');
                this.createMileageModel.createRequestParam['effectiveDate'] = response['effectiveDate'];
                this.createMileageModel.createRequestParam['expirationDate'] = response['expirationDate'];
                this.createMileageModel.effectiveDate = response['effectiveDate'];
                this.createMileageModel.expirationDate = response['expirationDate'];
                this.changeDetector.detectChanges();
                this.subscribeMileageDetails();
            }, (error: Error) => {
                CreateMileageUtility.toastMessage(this.messageService, 'error', 'Error', error.message);
            });
    }
    populateInputFields() {
        this.getLengthMeasurementCode();
        this.getDomainAttributes();
        this.getGeographyPointTypes();
        this.getBusinessUnitList();
    }
    setDefaults(agreementId: number) {
        this.patchDefaultValues();
        this.createMileageModel.createMileageForm.controls['decimalPrecision'].setValue(false);
        this.createMileageModel.createRequestParam['decimalPrecisionIndicator'] = 'N';
        this.createMileageModel.createRequestParam['agreementDefaultIndicator'] = 'Y';
        this.changeDetector.detectChanges();
        this.createMileageModel.createRequestParam['mileageBorderMileParameterType'] = {
            'mileageBorderMileParameterTypeID': 1,
            'mileageBorderMileParameterTypeName': this.selectedValue
        };
    }
    setContractDefault(agreementId: number) {
        this.createMileageService.getAgreementDefault(agreementId).subscribe(value => {
            this.agreementDefaultExists = value;
            if (value) {
                this.createMileageModel.createMileageForm.controls['agreementDefault'].setValue(false);
                this.createMileageModel.createRequestParam['agreementDefaultIndicator'] = 'N';
                this.createMileageModel.createMileageForm.controls['selectContract'].setValue(true);
                this.changeDetector.detectChanges();
                this.getContractsList(true);
            } else {
                this.createMileageModel.createMileageForm.controls['agreementDefault'].setValue(true);
                this.createMileageModel.createRequestParam['agreementDefaultIndicator'] = 'Y';
                this.changeDetector.detectChanges();
            }
        }, (error: Error) => {
            CreateMileageUtility.toastMessage(this.messageService, 'error', 'Error', error.message);
        });
    }
    patchDefaultValues() {
        this.createMileageModel.defaultFields.forEach(element => {
            this.createMileageModel.createMileageForm.patchValue({
                [element]: {
                    label: this.createMileageModel.defaultFieldValues[element]['label'],
                    value: this.createMileageModel.defaultFieldValues[element]['value']
                }
            });
            this.onSelectDropdown(this.createMileageModel.defaultFieldValues[element],
                this.createMileageModel.defaultFieldValues[element]['reqKey']);
        });
        this.createMileageModel.defaultSystemVersions.forEach((element: MileageSystemVersions) => {
            this.setMileageSystem(element);
        });
        this.changeDetector.detectChanges();
        this.fetchSystemParameters(this.createMileageModel.defaultSystemParameters);
    }
    getDomainAttributes() {
        this.createMileageService.getMileageDomainAttributes().pipe(takeWhile(() => this.createMileageModel.subscriberFlag))
            .subscribe((response: DomainAttributesType) => {
                this.createMileageModel.domainAttributes = response;
                this.createMileageModel.systemList = [];
                this.createMileageModel.calculationType = [];
                this.createMileageModel.routeType = [];
                if (!utils.isEmpty(response)) {
                    this.loadDomainAttributes(response);
                    if (!this.createMileageModel.editFlag) {
                        this.setDefaults(Number(this.agreementID));
                    } else {
                        this.loadSystemVersionForEdit();
                        this.setBorderParameter();
                    }
                }
            }, (error: Error) => {
                CreateMileageUtility.toastMessage(this.messageService, 'error', 'Error', error.message);
                this.changeDetector.detectChanges();
            });
    }
    loadDomainAttributes(response) {
        if (!utils.isEmpty(response['mileageSystems'])) {
            response['mileageSystems'].forEach((systemValue: MileageSystem) => {
                this.createMileageModel.systemList.push({
                    label: {
                        mileageSystemID: systemValue['mileageSystemID'],
                        mileageSystemName: systemValue['mileageSystemName']
                    },
                    value: systemValue['mileageSystemName']
                });
            });
            response['mileageCalculationTypes'].forEach((calculationType: CalculationType) => {
                this.createMileageModel.calculationType.push({
                    label: {
                        mileageCalculationTypeID: calculationType['mileageCalculationTypeID'],
                        mileageCalculationTypeName: calculationType['mileageCalculationTypeName']
                    },
                    value: calculationType['mileageCalculationTypeName']
                });
            });
            this.createMileageModel.calculationTypeList = utils.cloneDeep(this.createMileageModel.calculationType);
            response['mileageRouteTypes'].forEach((routeType: RouteType) => {
                this.createMileageModel.routeType.push({
                    label: {
                        mileageRouteTypeID: routeType['mileageRouteTypeID'],
                        mileageRouteTypeName: routeType['mileageRouteTypeName']
                    },
                    value: routeType['mileageRouteTypeName']
                });
            });
            this.setDefaultSystemValues();
        }
        this.changeDetector.detectChanges();
    }
    setDefaultSystemValues() {
        const matchedSystemParameters = utils.find(this.createMileageModel.domainAttributes['mileageSystems'],
            { 'mileageSystemID': 1 });
        this.createMileageModel.defaultSystemParameters = matchedSystemParameters['mileageSystemParameters'];
        this.createMileageModel.defaultSystemVersions = matchedSystemParameters['mileageSystemVersions'];
    }
    getGeographyPointTypes() {
        this.createMileageService.getMileageGeographyAttributes('Mileage Preference')
            .pipe(takeWhile(() => this.createMileageModel.subscriberFlag))
            .subscribe((response: GeographicPointType[]) => {
                this.createMileageModel.geographyType = [];
                response.forEach((geographyType: GeographicPointType) => {
                    this.createMileageModel.geographyType.push({
                        label: {
                            geographicPointTypeID: geographyType['geographicPointTypeID'],
                            geographicPointTypeName: geographyType['geographicPointTypeName']
                        },
                        value: geographyType['geographicPointTypeName']
                    });
                });
                this.createMileageModel.geographyTypeList = utils.cloneDeep(this.createMileageModel.geographyType);
            }, (error: Error) => {
                CreateMileageUtility.toastMessage(this.messageService, 'error', 'Error', error.message);
            });
    }
    getLengthMeasurementCode() {
        this.createMileageService.getUnitOfLengthMeasurement('Mileage Preference')
            .pipe(takeWhile(() => this.createMileageModel.subscriberFlag))
            .subscribe((response: LengthMeasurementCode[]) => {
                this.createMileageModel.distanceUnit = [];
                response.forEach((distanceUnit: LengthMeasurementCode) => {
                    this.createMileageModel.distanceUnit.push({
                        label: {
                            code: distanceUnit['unitOfLengthMeasurementCode'],
                            description: distanceUnit['unitOfLengthMeasurementCode']
                        },
                        value: distanceUnit['unitOfLengthMeasurementCode']
                    });
                });
                this.createMileageModel.distanceUnitList = utils.cloneDeep(this.createMileageModel.distanceUnit);
            }, (error: Error) => {
                CreateMileageUtility.toastMessage(this.messageService, 'error', 'Error', error.message);
            });
    }
    getContractsList(isCalledOnInit) {
        this.createMileageModel.createMileageForm.controls.contract.setValue(null);
        this.createMileageService.getContractsByAgreementId(this.createMileageModel)
            .pipe(takeWhile(() => this.createMileageModel.subscriberFlag))
            .subscribe((response: CustomerAgreementContracts[]) => {
                if (response && !utils.isEmpty(response)) {
                    CreateMileageUtility.frameContractList(this.createMileageModel, response);
                    this.changeDetector.detectChanges();
                    if (this.createMileageModel.editFlag && isCalledOnInit) {
                        this.setSelectedContractList();
                    }
                }
            }, (error: Error) => {
                CreateMileageUtility.toastMessage(this.messageService, 'error', 'Error', error.message);
            });
    }
    getBusinessUnitList() {
        this.createMileageService.getBusinessUnit().pipe(takeWhile(() => this.createMileageModel.subscriberFlag))
            .subscribe((response: BusinessUnitServiceOffering) => {
                const businessUnits = response['_embedded']['serviceOfferingBusinessUnitTransitModeAssociations'];
                businessUnits.forEach((element: ServiceOfferingBusinessUnitTransitModeAssociations) => {
                    this.createMileageModel.businessUnitList.push({
                        label: element['financeBusinessUnitServiceOfferingAssociation']['financeBusinessUnitCode'],
                        value: element['financeBusinessUnitServiceOfferingAssociation']['financeBusinessUnitCode']
                    });
                });
                this.changeDetector.detectChanges();
                if (this.createMileageModel.editFlag) {
                    this.setBusinessUnitForEdit();
                }
            }, (error: Error) => {
                CreateMileageUtility.toastMessage(this.messageService, 'error', 'Error', error.message);
            });
    }
    getCarrierList() {
        const carrierParam = CreateMileageQuery.createMileageCarrierData();
        this.createMileageService.getCarriers(carrierParam).pipe(takeWhile(() => this.createMileageModel.subscriberFlag))
            .subscribe((response: RootObject) => {
                this.createMileageModel.carrierList = [];
                const carriers = response['hits']['hits'];
                CreateMileageUtility.carrierFramer(carriers, this.createMileageModel);
                this.changeDetector.detectChanges();
            }, (error: Error) => {
                CreateMileageUtility.toastMessage(this.messageService, 'error', 'Error', error.message);
            });
    }
    onTypeCarrierValue(event) {
        this.createMileageModel.carrierSuggestions = [];
        if (this.createMileageModel.carrierList) {
            this.createMileageModel.carrierList.forEach(element => {
                if (element.value && element.value.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
                    this.createMileageModel.carrierSuggestions.push({
                        label: element.label,
                        value: element.value
                    });
                }
            });
        }
        this.createMileageModel.carrierSuggestions = utils.differenceBy(this.createMileageModel.carrierSuggestions,
            this.createMileageModel.createMileageForm.controls['carrier'].value, 'value');
        this.createMileageModel.carrierSuggestions = utils.sortBy(this.createMileageModel.carrierSuggestions, ['value']);
        this.changeDetector.detectChanges();
    }
    getSystemDataList(event) {
        this.createMileageModel.systemDataList = [];
        this.createMileageModel.systemList.forEach((element: DropdownListType) => {
            if (element.value && element.value.toString().toLowerCase().indexOf(event['query'].toLowerCase()) > -1) {
                this.createMileageModel.systemDataList.push({
                    label: element.label,
                    value: element.value
                });
            }
        });
    }
    getSystemVersionList(event) {
        this.createMileageModel.systemVersionList = [];
        this.createMileageModel.systemVersion.forEach((element: DropdownListType) => {
            if (element.value && element.value.toString().toLowerCase().indexOf(event['query'].toLowerCase()) > -1) {
                this.createMileageModel.systemVersionList.push({
                    label: element.label,
                    value: element.value
                });
            }
        });
    }
    onCompleteDropdown(event, listArray, existingList) {
        CreateMileageUtility.setAutocompleteList(event, listArray, existingList, this.createMileageModel);
    }
    fetchSystemParameters(systemParameters: MileageSystemParameters[]) {
        this.createMileageModel.systemParameters = [];
        this.createMileageModel.systemParametersList = [];
        this.createMileageModel.systemParametersFlag = true;
        systemParameters = utils.sortBy(systemParameters, 'mileageSystemParameterName');
        systemParameters.forEach((element: MileageSystemParameters) => {
            CreateMileageUtility.systemParameterFramer(this.createMileageModel, element);
        });
        this.iterateSystemParameters(systemParameters);
        this.changeDetector.detectChanges();
    }
    iterateSystemParameters(systemParameters: MileageSystemParameters[]) {
        this.createMileageModel.createRequestParam.mileageSystemParameters = systemParameters;
        this.createMileageModel.createRequestParam.mileageSystemParameters.forEach(element => {
            element['mileageParameterSelectIndicator'] = 'N';
        });
    }
    onTypeDate(event, fieldName: string) {
        const regex = new RegExp('^(1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])\/[0-9]{4}$');
        switch (fieldName) {
            case 'effectiveDate':
                if (event.srcElement['value'] && regex.test(event.srcElement['value'].trim()) &&
                    this.isDateChangedFlag) {
                    this.createMileageModel.inCorrectEffDateFormat = false;
                    const effDate = new Date(event.srcElement['value']);
                    this.createMileageModel.createMileageForm.controls['effectiveDate'].setValue(effDate);
                    this.onSelectEffDate();
                    CreateMileageUtility.setFormErrors(this.createMileageModel);
                    this.onDateSelected(event.srcElement['value'], 'effectiveDate');
                } else {
                    this.createMileageModel.expirationMinDate = new Date(this.createMileageModel.defaultMinDate);
                    this.createMileageModel.disabledExpDatesList = [];
                }
                CreateMileageUtility.validateDateFormat(event, fieldName, this.createMileageModel);
                break;
            case 'expirationDate':
                if (event.srcElement['value'] && regex.test(event.srcElement['value'].trim()) &&
                    this.isDateChangedFlag) {
                    this.createMileageModel.inCorrectExpDateFormat = false;
                    const expDate = new Date(event.srcElement['value']);
                    this.createMileageModel.createMileageForm.controls['expirationDate'].setValue(expDate);
                    CreateMileageUtility.onSelectExpDate(this.createMileageModel);
                    CreateMileageUtility.setFormErrors(this.createMileageModel);
                    this.onDateSelected(event.srcElement['value'], 'expirationDate');
                } else {
                    this.createMileageModel.effectiveMaxDate = new Date(this.createMileageModel.defaultMaxDate);
                    this.createMileageModel.disabledEffDatesList = [];
                }
                CreateMileageUtility.validateDateFormat(event, fieldName, this.createMileageModel);
                break;
            default: break;
        }
        this.setCalendarDate(fieldName);
    }
    setCalendarDate(field) {
        switch (field) {
            case 'effectiveDate':
                if (this.createMileageModel.effDate) {
                    this.effectiveCal.currentMonth = this.createMileageModel.effDate.getMonth();
                    this.effectiveCal.currentYear = this.createMileageModel.effDate.getFullYear();
                }
                break;
            case 'expirationDate':
                if (this.createMileageModel.expDate) {
                    this.expirationCal.currentMonth = this.createMileageModel.expDate.getMonth();
                    this.expirationCal.currentYear = this.createMileageModel.expDate.getFullYear();
                }
                break;
        }
    }
    onSelectEffDate() {
        CreateMileageUtility.getValidDate(this.createMileageModel);
    }
    getSectionsGrid(isFromOnInit) {
        this.createMileageService.getSectionsData(this.createMileageModel).pipe(takeWhile(() => this.createMileageModel.subscriberFlag))
            .subscribe((response: CustomerAgreementContractSections[]) => {
                if (response && !utils.isEmpty(response)) {
                    this.createMileageModel.sectionsList = utils.cloneDeep(response);
                    this.createMileageModel.sectionRowData = this.createMileageModel.sectionsList;
                    if (this.createMileageModel.editFlag && isFromOnInit) {
                        this.setSelectedSections();
                    }
                }
                this.changeDetector.detectChanges();
            }, (error: Error) => {
                CreateMileageUtility.toastMessage(this.messageService, 'error', 'Error', error.message);
                this.createMileageModel.sectionsList = [];
                this.changeDetector.detectChanges();
            });
    }
    setSelectedSections() {
        const sections = [];
        this.createMileageModel.editDetails.sectionAssociations.forEach(element => {
            const matchedSection = utils.find(this.createMileageModel.sectionsList,
                { 'customerAgreementContractSectionID': element['customerAgreementContractSectionID'] });
            sections.push(matchedSection);
        });
        this.selectedSections = sections;
        this.createMileageModel.sectionListCopy = sections;
        this.changeDetector.detectChanges();
    }
    onSearch(event) {
        const value = [];
        if (event.target['value'] === '') {
            this.createMileageModel.sectionsList = this.createMileageModel.sectionRowData;
        }
        if (event.target['value'] && !utils.isEmpty(this.createMileageModel.sectionsList)) {
            utils.forEach(this.createMileageModel.sectionsList, (section: CustomerAgreementContractSections) => {
                if (section.customerAgreementContractSectionName.toLowerCase()
                    .indexOf(event.target['value'].toLowerCase()) >= 0
                    || section.customerContractName.toLocaleLowerCase().indexOf(event.target['value'].toLowerCase()) >= 0) {
                    value.push(section);
                }
            });
            this.createMileageModel.sectionsList = value;
        }
    }
    onCancel() {
        this.createMileageModel.popupMessage = 'You are about to lose all the changes. Do you want to proceed?';
        this.createMileageModel.routingUrl = this.agreementURL;
        if (this.createMileageModel.createMileageForm.dirty && this.createMileageModel.createMileageForm.touched) {
            this.createMileageModel.isSaveChanges = true;
        } else {
            this.onPopupYes();
        }
    }
    canDeactivate(component: CanDeactivateGuardService, route: ActivatedRouteSnapshot, state: RouterStateSnapshot,
        nextState: RouterStateSnapshot): Observable<boolean> | boolean {
        this.createMileageModel.routingUrl = nextState.url;
        if (this.createMileageModel.createMileageForm.dirty && !this.createMileageModel.isDetailsSaved) {
            this.createMileageModel.isChangesSaving = false;
            this.createMileageModel.popupMessage = 'You are about to lose all the changes. Do you want to proceed?';
        } else {
            this.createMileageModel.isChangesSaving = true;
        }
        this.createMileageModel.isSaveChanges = !this.createMileageModel.isChangesSaving;
        this.changeDetector.detectChanges();
        return this.createMileageModel.isChangesSaving;
    }
    onPopupNo() {
        this.createMileageModel.isSaveChanges = false;
        this.createMileageModel.isChangesSaving = true;
    }
    onPopupYes() {
        this.createMileageModel.isDetailsSaved = true;
        this.createMileageModel.isSaveChanges = false;
        this.createMileageModel.isChangesSaving = true;
        if (this.createMileageModel.routingUrl === this.agreementURL) {
            this.router.navigate([this.viewMileageURL], {
                queryParams:
                    { id: this.createMileageModel.customerAgreement.customerAgreementID }
            });
        } else {
            this.router.navigate([this.createMileageModel.routingUrl]);
        }
    }
    onMileageTabChange(tabChangeEvent: TabEventInterface): boolean | undefined {
        this.createMileageModel.tabChangeValue = tabChangeEvent.option.value;
        CreateMileageUtility.getContractSectionList(tabChangeEvent.option.value, this);
        if (this.createMileageModel.createMileageForm.controls.mileageLevel.value === this.createMileageModel.tabChangeValue) {
            return false;
        } else {
            switch (this.createMileageModel.createMileageForm.controls.mileageLevel.value) {
                case 'Agreement':
                    this.checkValuesOfEachControls('Agreement');
                    break;
                case 'Contract':
                    this.checkValuesOfEachControls('Contract');
                    break;
                case 'Section':
                    this.checkValuesOfEachControls('Section');
                    break;
            }
            CreateMileageUtility.setContractValidatorsToEmpty(this.createMileageModel);
        }
    }
    checkValuesOfEachControls(formControlName: string) {
        const mileageForm = this.createMileageModel.createMileageForm;
        this.createMileageModel.controlsInMileageTab.forEach(eachControl => {
            if (this.createMileageModel.agreementDefaulFlag || !utils.isEmpty(this.selectedSections) ||
                !utils.isEmpty(mileageForm.controls[eachControl].value)) {
                this.createMileageModel.createMileagePopUp = true;
                this.createMileageModel.createMileageForm.controls.mileageLevel.setValue(formControlName);
            }
        });
    }
    onClickCreateMileagePopupYes() {
        this.createMileageModel.createMileagePopUp = false;
        this.createMileageModel.agreementDefaulFlag = false;
        this.createMileageModel.controlsInMileageTab.forEach(eachControl => {
            if (eachControl !== 'carrier') {
                this.createMileageModel.createMileageForm.controls[eachControl].setValue('');
                this.createMileageModel.createMileageForm.controls[eachControl].updateValueAndValidity();
            }
            this.createMileageModel.isTopAdded = false;
        });
        this.createMileageModel.isTopAddedContract = false;
        this.createMileageModel.isTopAdded = false;
        this.createMileageModel.createRequestParam['customerAgreementContracts'] = [];
        this.createMileageModel.createRequestParam['customerAgreementSections'] = [];
        this.createMileageModel.createRequestParam['businessUnitCodes'] = [];
        this.createMileageModel.isTopAddedContract = false;
        this.createMileageModel.isTopAdded = false;
        this.selectedSections = [];
        this.createMileageModel.createMileageForm.controls.mileageLevel.setValue(this.createMileageModel.tabChangeValue);
        CreateMileageUtility.setContractValidatorsToEmpty(this.createMileageModel);
    }
    onClickCreateMileagePopupNo() {
        this.createMileageModel.createMileagePopUp = false;
    }
    setSelectedContractList() {
        const selectedContractList = [];
        this.createMileageModel.editDetails.contractAssociations.forEach(contract => {
            selectedContractList.push({
                customerAgreementContractID: contract.contractID,
                customerContractName: contract.contractName,
                customerAgreementContractTypeName: contract.contractType,
                customerContractNumber: contract.contractNumber
            });
        });
        this.createMileageModel.createMileageForm.controls.contract.setValue(selectedContractList);
        this.changeDetector.detectChanges();
    }
}
