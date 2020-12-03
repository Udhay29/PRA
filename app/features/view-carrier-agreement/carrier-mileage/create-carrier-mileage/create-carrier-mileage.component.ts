import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormsModule } from '@angular/forms';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute, Params } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';
import * as moment from 'moment';
import { MessageService } from 'primeng/components/common/messageservice';
import { Observable, timer } from 'rxjs';
import { CreateCarrierMileageModel } from './models/create-carrier-mileage.model';
import { CreateCarrierMileageService } from './service/create-carrier-mileage.service';
import {
  AgreementDetails, BusinessUnitServiceOffering, CalculationType,
  DomainAttributesType,
  DropdownListType, GeographicPointType, MileageSystem, MileageSystemParameters,
  MileageSystemVersions, MileageUnit, MockSectionsType, HitsArray, RootObject, RouteType,
  ServiceOfferingBusinessUnitTransitModeAssociations, LengthMeasurementCode, MockSectionColumnsType,
  DistanceUnit, BusinessUnitDropdownListType, CarrierSegmentTypesItem, RootObjectCarrier, CarrierAgreementType
} from './models/create-carrier-mileage.interface';
import { MultiSelect } from '../../../../../../node_modules/primeng/multiselect';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';
import { CreateCarrierMileageUtility } from './service/create-carrier-mileage-utility';
import { CanDeactivateGuardService } from '../../../../shared/jbh-app-services/can-deactivate-guard.service';
import { NavigationAlert } from '../../../create-agreement/model/create-agreement.interface';
import { LocalStorageService } from './../../../../shared/jbh-app-services/local-storage.service';
import { LoggerConfig } from 'ngx-logger';
import { SelectItem } from 'primeng/api';
import { parse } from 'path';
import { Messages } from '../../../../../../src/config/messages.config';
@Component({
  selector: 'app-create-carrier-mileage',
  templateUrl: './create-carrier-mileage.component.html',
  styleUrls: ['./create-carrier-mileage.component.scss'],
  providers: [Messages]
})
export class CreateCarrierMileageComponent implements OnInit, OnDestroy {
  createMileageModel: CreateCarrierMileageModel;
  agreementURL: string;
  viewMileageURL: string;
  agreementID: string;
  @ViewChild('effectiveCal') effectiveCal;
  @ViewChild('expirationCal') expirationCal;
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly formBuilder: FormBuilder,
    private readonly messageService: MessageService,
    private readonly createMileageService: CreateCarrierMileageService,
    private readonly shared: BroadcasterService, private readonly store: LocalStorageService,
    private readonly messages: Messages) {
    this.viewMileageURL = '/viewcarrierdetails';
    this.route.paramMap.pipe()
      .subscribe((params: any) => {
        this.agreementID = String(params.get('id'));
        this.agreementURL = `/viewcarrierdetails/${this.agreementID}`;
        this.createMileageModel = new CreateCarrierMileageModel(this.agreementID);
      }, (error) => {
        CreateCarrierMileageUtility.toastMessage
          (this.messageService, 'error', error.error.errors[0].errorType, error.error.errors[0].errorMessage);
      });
  }
  ngOnInit() {
    this.createMileageFormInitialization();
    this.getAgreementDetails(Number(this.agreementID));
    this.populateInputFields();
  }
  ngOnDestroy() {
    this.createMileageModel.isSubscriberFlag = false;
  }
  onSelectDropdown(event, selectedField: string) {
    const id = `${selectedField}ID`;
    const name = `${selectedField}Name`;
    switch (selectedField) {
      case 'distanceUnit':
        this.createMileageModel.createRequestParam[selectedField] = {
          code: event['label'],
          description: event['value']
        };
        break;
      case 'carrierSegment':
        this.createMileageModel.createRequestParam[selectedField] = {
          carrierSegmentID: event['label'],
          carrierSegmentName: event['value']
        };
        break;
      default:
        this.createMileageModel.createRequestParam[selectedField] = {
          [id]: event['label'],
          [name]: event['value']
        };
    }
  }
  onClearDropDown(control: string) {
    this.createMileageModel.createMileageForm.controls[control].setValue('');
    if (control === 'financeBusinessUnitCode') {
      this.createMileageModel.createRequestParam['financeBusinessUnitCode'] = '';
    }
    if (control === 'system') {
      this.createMileageModel.systemVersion = [];
      this.createMileageModel.systemVersionList = [];
      this.createMileageModel.createMileageForm['controls']['systemVersion'].setValue('');
      this.createMileageModel.systemParameters = [];
      this.createMileageModel.isSystemParametersFlag = false;
    }
  }
  onSelectCarrierSegment(event) {
    this.createMileageModel.carrierSegmentsClone['_embedded']['carrierSegmentTypes'].forEach(elm => {
      if (elm.carrierSegmentTypeName === event.value) {
        const findedBu = this.createMileageModel.businessUnitList.find(BuElem => BuElem.value === elm.defaultBusinessUnitCode);
        this.createMileageModel.createMileageForm['controls']['financeBusinessUnitCode'].setValue(findedBu);
        this.createMileageModel.createRequestParam['financeBusinessUnitCode'] = findedBu.value;
      }
    });
  }
  onSelectSystemName(event) {
    this.createMileageModel.systemVersion = [];
    this.createMileageModel.createMileageForm['controls']['systemVersion'].setValue('');
    this.createMileageModel.createRequestParam['mileageSystem'] = {
      'mileageSystemID': event['label'],
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
      label: element['mileageSystemVersionID'],
      value: element['mileageSystemVersionName']
    });
    this.createMileageModel.systemVersionList = utils.cloneDeep(this.createMileageModel.systemVersion);
  }
  onSelectSystemVersion(event) {
    this.createMileageModel.createRequestParam['mileageSystemVersion'] = {
      'mileageSystemVersionID': event['label'],
      'mileageSystemVersionName': event['value']
    };
  }
  onChangedecimalPrecisionIndicator(event) {
    this.createMileageModel.createRequestParam['decimalPrecisionIndicator'] = event['checked'] ? 'Y' : 'N';
  }
  onChangeAgreementDefault(event) {
    if (event['checked']) {
      this.createMileageModel.isSectionDisplayFlag = false;
      this.createMileageModel.isBusinessUnitFlag = false;
      this.createMileageModel.createRequestParam['agreementDefaultIndicator'] = 'Y';
      const effective = new Date(this.createMileageModel.carrierAgreement.effectiveDate.replace(/-/g, '\/').replace(/T.+/, ''));
      const expirationDate = new Date(this.createMileageModel.carrierAgreement.expirationDate
        .replace(/-/g, '\/').replace(/T.+/, ''));
      this.createMileageModel.createMileageForm.controls['effectiveDate'].setValue(effective);
      this.createMileageModel.createMileageForm.controls['expirationDate'].setValue(expirationDate);
      this.createMileageModel.effectiveDate = this.createMileageModel.carrierAgreement.effectiveDate;
      this.createMileageModel.expirationDate = this.createMileageModel.carrierAgreement.expirationDate;
    } else {
      this.createMileageModel.isBusinessUnitFlag = true;
      this.createMileageModel.createRequestParam['agreementDefaultIndicator'] = 'N';
    }
  }
  onDateSelected(event, selectedDateField: string) {
    const dateFormat = 'YYYY-MM-DD';
    const dateFormatWithSlash = 'DD/MM/YYYY';
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
  }
  onChangeCheckboxValue(event: Event, data: MileageSystemParameters) {
    if (event) {
      this.createMileageModel.createRequestParam['mileageSystemParameters'].push({
        'mileageSystemParameterID': data['label'],
        'mileageSystemParameterName': data['value']
      });
    } else {
      utils.remove(this.createMileageModel.createRequestParam['mileageSystemParameters'], {
        'mileageSystemParameterID': data['label'],
        'mileageSystemParameterName': data['value']
      });
    }
  }
  onClickBorderMilesParameter(event) {
    this.createMileageModel.createRequestParam['borderCrossingParameter'] = {
      'borderCrossingParameterID': event.mileageBorderMileParameterTypeID,
      'borderCrossingParameterName': event.mileageBorderMileParameterTypeName
    };
    this.createMileageModel.createMileageForm.markAsDirty();
  }
  onChangeBusinessUnit(event) {
    if (event['value'].length === this.createMileageModel.businessUnitList.length) {
      this.createMileageModel.isTopAdded = true;
    } else {
      this.createMileageModel.isTopAdded = false;
    }
    this.createMileageModel.createRequestParam['financeBusinessUnitCode'] = event['value'];
  }
  onSelectCarrier(event) {
    this.createMileageModel.createMileageForm.markAsDirty();
    const datais = event.data;
    this.createMileageModel.createRequestParam['carriers'].push({
      carrierName: datais['value'],
      carrierID: datais['label']['id'],
      carrierCode: datais['label']['code']
    });
    this.createMileageModel.carrierCheckCounter++;
    if (this.createMileageModel.carrierList.length === this.createMileageModel.carrierCheckCounter) {
      this.createMileageModel.isCarrierSelectionFlag = true;
    }
  }
  onDeSelectCarrier(event) {
    const datais = event.data;
    this.createMileageModel.createMileageForm.markAsDirty();
    utils.remove(this.createMileageModel.createRequestParam['carriers'], { 'carrierName': datais['value'] });
    this.createMileageModel.carrierCheckCounter--;
    this.createMileageModel.isCarrierSelectionFlag = false;
  }
  checkCarrierList() {
    if (this.createMileageModel.createRequestParam['carriers'].length === 0) {
      this.createMileageModel.createRequestParam['carriers'] = [];
      utils.forEach(this.createMileageModel.carrierList, (carrierList) => {
        this.createMileageModel.createRequestParam['carriers'].push({
          carrierName: carrierList['value'],
          carrierID: carrierList['label']['id'],
          carrierCode: carrierList['label']['code']
        });
      });
    }
  }
  onClickCreate() {
    this.createMileageModel.isPageLoaded = true;
    this.changeDetector.detectChanges();
    this.createMileageModel.createRequestParam['notes'] = this.createMileageModel.createMileageForm.get('notes').value;
    this.createMileageModel.mandatoryFields.forEach((control: string) => {
      this.createMileageModel.createMileageForm.controls[control].markAsTouched();
    });
    this.createMileageModel.isSystemParametersCheckFlag = false;
    this.checkCarrierList();
    if (this.createMileageModel.createMileageForm.valid &&
      !this.createMileageModel.isSystemParametersCheckFlag &&
      !this.createMileageModel.isCarrierSelectionFlag) {
      this.onConditionSave();
    } else {
      if (this.createMileageModel.createMileageForm.controls['effectiveDate'].invalid ||
        this.createMileageModel.createMileageForm.controls['expirationDate'].invalid) {
        this.messageService.add({
          severity: 'error', summary: this.createMileageModel.errMsg,
          detail: Messages.getMessage().warningMessage.dateRange
        });
      }
      if (!this.createMileageModel.isSystemParametersCheckFlag) {
        this.checkValidFieldFilled();
      }
      this.createMileageModel.isPageLoaded = false;
      this.changeDetector.detectChanges();
    }
  }
  onConditionSave() {
    this.createMileageModel.createRequestParam['carrierAgreementName'] = this.createMileageModel.carrierAgreement.agreementName;
    this.createMileageModel.createRequestParam['mileageProgramName'] =
      this.createMileageModel.createMileageForm.controls['mileageProgramName'].value;
    this.createMileageModel.createRequestParam['agreementTypeName'] = this.createMileageModel.carrierAgreement.agreementType;
    const agreementID = parseInt(this.agreementID, 10);
    this.createMileageModel.createRequestParam['carrierAgreementID'] = agreementID;
    this.createMileageService.postMileagePreference(this.createMileageModel.createRequestParam, agreementID)
      .pipe(takeWhile(() => this.createMileageModel.isSubscriberFlag))
      .subscribe((response) => {
        this.messageDetails(response);
      }, (error) => {
        this.createMileageModel.isPageLoaded = false;
        CreateCarrierMileageUtility.toastMessage
          (this.messageService, 'error', error.error.errors[0].errorType, error.error.errors[0].errorMessage);
        this.changeDetector.detectChanges();
      });
  }
  messageDetails(response) {
    if (response['status'] === 'info') {
      this.messageService.add({
        severity: 'info', summary: Messages.getMessage().headerMessage.informationMessage,
        detail: Messages.getMessage().carrierMessage.esSyncMessage
      });
    } else if (response['status'] === 'success') {
      this.messageService.add({
        severity: 'success', summary: Messages.getMessage().headerMessage.programCreated,
        detail: Messages.getMessage().carrierMessage.programCreated
      });
    }
    this.sourceSubscriber();
  }
  sourceSubscriber() {
    this.shared.broadcast('mileageCreate', 'success');
    this.createMileageModel.isDetailsSaved = true;
    this.changeDetector.detectChanges();
    this.store.setItem('agreementDetails', 'create', 'Mileage', true);
    this.router.navigate(['viewcarrierdetails', this.createMileageModel.createRequestParam['carrierAgreementID']]);
    this.createMileageModel.isPageLoaded = false;
    this.changeDetector.detectChanges();
  }
  checkValidFieldFilled() {
    this.messageService.add({
      severity: 'error', summary: this.createMileageModel.errMsg,
      detail: Messages.getMessage().warningMessage.mandatoryFields
    });
  }
  createMileageFormInitialization() {
    const createMileageForm = this.formBuilder.group({
      carrierSegment: ['', Validators.required],
      financeBusinessUnitCode: [''],
      mileageProgramName: ['', Validators.required],
      system: ['', Validators.required],
      systemVersion: ['', Validators.required],
      distanceUnit: ['', Validators.required],
      geographyType: ['', Validators.required],
      routeType: ['', Validators.required],
      calculationType: ['', Validators.required],
      effectiveDate: ['', Validators.required],
      expirationDate: ['', Validators.required],
      carrier: [''],
      decimalPrecisionIndicator: [''],
      agreementDefaultIndicator: [''],
      borderCrossingParameter: [''],
      sectionsRowDataField: [''],
      notes: [''],
      systemdd: [''],
      mileageSystemParameters: [''],
      mileageLevel: [''],
    });
    this.createMileageModel.createMileageForm = createMileageForm;
    this.createMileageModel.selectedMileageLevel = 'No Affiliation';
  }
  getAgreementDetails(agreementId: number) {
    this.createMileageService.fetchAgreementDetailsBycarrierAgreementId(agreementId)
      .pipe(takeWhile(() => this.createMileageModel.isSubscriberFlag))
      .subscribe((response: AgreementDetails) => {
        this.createMileageModel.carrierAgreement = response;
        this.getCarrierList(response);
        this.createMileageModel.effectiveMinDate = new Date(response['agreementEffectiveDate'].replace(/-/g, '\/').replace(/T.+/, ''));
        this.createMileageModel.effectiveMaxDate = new Date(response['agreementExpirationDate'].replace(/-/g, '\/').replace(/T.+/, ''));
        this.createMileageModel.expirationMinDate = new Date(response['agreementEffectiveDate'].replace(/-/g, '\/').replace(/T.+/, ''));
        this.createMileageModel.expirationMaxDate = new Date(response['agreementExpirationDate'].replace(/-/g, '\/').replace(/T.+/, ''));
        this.createMileageModel.createMileageForm.controls['effectiveDate'].setValue(this.createMileageModel.effectiveMinDate);
        this.createMileageModel.createMileageForm.controls['expirationDate'].setValue(this.createMileageModel.effectiveMaxDate);
        this.createMileageModel.createRequestParam['effectiveDate'] = response['agreementEffectiveDate'];
        this.createMileageModel.createRequestParam['expirationDate'] = response['agreementExpirationDate'];
        this.createMileageModel.effectiveDate = response['agreementEffectiveDate'];
        this.createMileageModel.expirationDate = response['agreementExpirationDate'];
        this.changeDetector.detectChanges();
      }, (error) => {
        CreateCarrierMileageUtility.toastMessage
          (this.messageService, 'error', error.error.errors[0].errorType, error.error.errors[0].errorMessage);
      });
  }
  populateInputFields() {
    this.getLengthMeasurementCode();
    this.getGeographyPointTypes();
    this.getBusinessUnitList();
    this.getDomainAttributes();
  }
  setDefaults() {
    this.patchDefaultValues();
    this.createMileageModel.createMileageForm.controls['decimalPrecisionIndicator'].setValue(false);
    this.createMileageModel.createRequestParam['decimalPrecisionIndicator'] = 'N';
    this.createMileageModel.createRequestParam['agreementDefaultIndicator'] = 'Y';
    this.createMileageModel.createRequestParam['copied'] = 'N';
    this.createMileageModel.createRequestParam['lineHaulOverrideIndicator'] = 'N';
    this.changeDetector.detectChanges();
    this.createMileageModel.borderCrossingParameter = 1;
    this.createMileageModel.isBusinessUnitFlag = false;
    this.createMileageModel.createRequestParam['borderCrossingParameter'] = {
      'borderCrossingParameterID': this.createMileageModel.borderParameter[0].mileageBorderMileParameterTypeID,
      'borderCrossingParameterName': this.createMileageModel.borderParameter[0].mileageBorderMileParameterTypeName,
    };
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
    this.changeDetector.detectChanges();
  }
  getDomainAttributes() {
    this.createMileageService.getMileageDomainAttributes().pipe(takeWhile(() => this.createMileageModel.isSubscriberFlag))
      .subscribe((response: DomainAttributesType) => {
        this.createMileageModel.domainAttributes = response;
        this.createMileageModel.systemList = [];
        this.createMileageModel.calculationType = [];
        this.createMileageModel.routeType = [];
        if (!utils.isEmpty(response) && !utils.isEmpty(response['mileageSystems'])) {
          this.createMileageModel.borderParameter = response['borderCrossingParameters'];

          response['mileageSystems'].forEach((systemValue: MileageSystem) => {
            this.createMileageModel.systemList.push({
              label: systemValue['mileageSystemID'],
              value: systemValue['mileageSystemName']
            });
          });
          response['mileageCalculationTypes'].forEach((calculationType: CalculationType) => {
            this.createMileageModel.calculationType.push({
              label: calculationType['mileageCalculationTypeID'],
              value: calculationType['mileageCalculationTypeName']
            });
          });
          this.createMileageModel.calculationTypeList = utils.cloneDeep(this.createMileageModel.calculationType);
          response['mileageRouteTypes'].forEach((routeType: RouteType) => {
            this.createMileageModel.routeType.push({
              label: routeType['mileageRouteTypeID'],
              value: routeType['mileageRouteTypeName']
            });
          });
        }
        this.changeDetector.detectChanges();
        this.setDefaults();
      }, (error) => {
        CreateCarrierMileageUtility.toastMessage
          (this.messageService, 'error', error.error.errors[0].errorType, error.error.errors[0].errorMessage);
        this.changeDetector.detectChanges();
      });
  }
  getGeographyPointTypes() {
    this.createMileageService.getMileageGeographyAttributes('Mileage Preference')
      .pipe(takeWhile(() => this.createMileageModel.isSubscriberFlag))
      .subscribe((response: GeographicPointType[]) => {
        this.createMileageModel.geographyType = [];
        response.forEach((geographyType: GeographicPointType) => {
          this.createMileageModel.geographyType.push({
            label: geographyType['geographicPointTypeID'],
            value: geographyType['geographicPointTypeName']
          });
        });
        this.createMileageModel.geographyTypeList = utils.cloneDeep(this.createMileageModel.geographyType);
      }, (error) => {
        CreateCarrierMileageUtility.toastMessage
          (this.messageService, 'error', error.error.errors[0].errorType, error.error.errors[0].errorMessage);
      });
  }
  getLengthMeasurementCode() {
    this.createMileageService.getUnitOfLengthMeasurement('Mileage Preference')
      .pipe(takeWhile(() => this.createMileageModel.isSubscriberFlag))
      .subscribe((response: LengthMeasurementCode[]) => {
        this.createMileageModel.distanceUnit = [];
        response.forEach((distanceUnit: LengthMeasurementCode) => {
          this.createMileageModel.distanceUnit.push({
            label: distanceUnit['pricingFunctionalAreaID'],
            value: distanceUnit['unitOfLengthMeasurementCode']
          });
        });
        this.createMileageModel.distanceUnitList = utils.cloneDeep(this.createMileageModel.distanceUnit);
      }, (error) => {
        CreateCarrierMileageUtility.toastMessage
          (this.messageService, 'error', error.error.errors[0].errorType, error.error.errors[0].errorMessage);
      });
  }
  getBusinessUnitList() {
    this.createMileageService.getBusinessUnit().pipe(takeWhile(() => this.createMileageModel.isSubscriberFlag))
      .subscribe((response: BusinessUnitServiceOffering) => {
        const businessUnits = response['_embedded']['serviceOfferingBusinessUnitTransitModeAssociations'];
        businessUnits.forEach((element: ServiceOfferingBusinessUnitTransitModeAssociations) => {
          this.createMileageModel.businessUnitList.push({
            label: element['financeBusinessUnitServiceOfferingAssociation']['financeBusinessUnitCode'],
            value: element['financeBusinessUnitServiceOfferingAssociation']['financeBusinessUnitCode']
          });
        });
        this.changeDetector.detectChanges();
        this.getCarrierSegment();
      },
        (error) => {
          CreateCarrierMileageUtility.toastMessage
            (this.messageService, 'error', error.error.errors[0].errorType, error.error.errors[0].errorMessage);
        });
  }
  getBusinessUnitDataList(event) {
    this.createMileageModel.businessUnitDataList = [];
    this.createMileageModel.businessUnitList.forEach((element: BusinessUnitDropdownListType) => {
      if (element.value && element.value.toString().toLowerCase().indexOf(event['query'].toLowerCase()) > -1) {
        this.createMileageModel.businessUnitDataList.push({
          label: element.label,
          value: element.value
        });
      }
    });
  }
  getCarrierList(response) {
    const carriers = response['carriers'];
    this.createMileageModel.carrierValidationMessage = Messages.getMessage().carrierMessage.carrierValidation;
    carriers.forEach((element: HitsArray) => {
      this.createMileageModel.carrierList.push({
        label: {
          'id': element['carrierID'],
          'code': element['carrierCode']
        },
        value: element['carrierName'],
        displayName: `${element['carrierName']} ( ${element['carrierCode']})`
      });
      this.changeDetector.detectChanges();
    });
    if (this.createMileageModel.carrierList.length === 1) {
      this.createMileageModel.createRequestParam['carriers'].push({
        carrierName: this.createMileageModel.carrierList[0]['value'],
        carrierID: this.createMileageModel.carrierList[0]['label']['id'],
        carrierCode: this.createMileageModel.carrierList[0]['label']['code']
      });
    }
    this.createMileageModel.isNoResultFoundFlag = (this.createMileageModel.carrierList.length === 0);
  }
  onCheckCarrierLength(event) {
    this.createMileageModel.carrierList.forEach(elm => {
      if (elm.displayName.indexOf(event.target.value) >= -1) {
        this.createMileageModel.isNoResultFoundFlag = true;
      }
    });
  }
  onTypeCarrierValue(event: Event) {
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
  getMileageUnitsList(event) {
    this.createMileageModel.distanceUnitList = [];
    this.createMileageModel.distanceUnit.forEach((element: any) => {
      if (element.value && element.value.toString().toLowerCase().indexOf(event['query'].toLowerCase()) > -1) {
        this.createMileageModel.distanceUnitList.push({
          label: element.label,
          value: element.value
        });
      }
    });
  }
  getCalculationTypeList(event) {
    this.createMileageModel.calculationTypeList = [];
    this.createMileageModel.calculationType.forEach((element: DropdownListType) => {
      if (element.value && element.value.toString().toLowerCase().indexOf(event['query'].toLowerCase()) > -1) {
        this.createMileageModel.calculationTypeList.push({
          label: element.label,
          value: element.value
        });
      }
    });
  }
  getGeographyTypeList(event) {
    this.createMileageModel.geographyTypeList = [];
    this.createMileageModel.geographyType.forEach((element: DropdownListType) => {
      if (element.value && element.value.toString().toLowerCase().indexOf(event['query'].toLowerCase()) > -1) {
        this.createMileageModel.geographyTypeList.push({
          label: element.label,
          value: element.value
        });
      }
    });
  }
  getRouteTypeList(event) {
    this.createMileageModel.routeTypeList = [];
    this.createMileageModel.routeType.forEach((element: DropdownListType) => {
      if (element.value && element.value.toString().toLowerCase().indexOf(event['query'].toLowerCase()) > -1) {
        this.createMileageModel.routeTypeList.push({
          label: element.label,
          value: element.value
        });
      }
    });
  }
  fetchSystemParameters(systemParameters: MileageSystemParameters[]) {
    this.createMileageModel.systemParameters = [];
    this.createMileageModel.isSystemParametersFlag = false;
    systemParameters.forEach((element: MileageSystemParameters) => {
      this.createMileageModel.systemParameters.push({
        'label': element['mileageSystemParameterID'],
        'value': element['mileageSystemParameterName']
      });
    });
    const cloned = JSON.parse(JSON.stringify(this.createMileageModel.systemParameters));
    this.createMileageModel.systemParametersClone = utils.cloneDeep(cloned);
    if (this.createMileageModel.systemParameters.length > 0) {
      this.createMileageModel.isSystemParametersFlag = true;
    }
    this.changeDetector.detectChanges();
  }
  onTypeDate(event, fieldName: string) {
    const regex = new RegExp('^(1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])\/[0-9]{4}$');
    switch (fieldName) {
      case 'effectiveDate':
        if (event.srcElement['value'] && regex.test(event.srcElement['value'].trim())) {
          this.createMileageModel.isCorrectEffDateFormat = false;
          const effDate = new Date(event.srcElement['value']);
          this.createMileageModel.createMileageForm.controls['effectiveDate'].setValue(effDate);
          this.onSelectEffDate();
          CreateCarrierMileageUtility.setFormErrors(this.createMileageModel);
          this.onDateSelected(event.srcElement['value'], 'effectiveDate');
        } else {
          this.createMileageModel.expirationMinDate = new Date(this.createMileageModel.defaultMinDate);
          this.createMileageModel.disabledExpDatesList = [];
        }
        CreateCarrierMileageUtility.validateDateFormat(event, fieldName, this.createMileageModel);
        break;
      case 'expirationDate':
        if (event.srcElement['value'] && regex.test(event.srcElement['value'].trim())) {
          this.createMileageModel.isCorrectExpDateFormat = false;
          const expDate = new Date(event.srcElement['value']);
          this.createMileageModel.createMileageForm.controls['expirationDate'].setValue(expDate);
          CreateCarrierMileageUtility.onSelectExpDate(this.createMileageModel);
          CreateCarrierMileageUtility.setFormErrors(this.createMileageModel);
          this.onDateSelected(event.srcElement['value'], 'expirationDate');
        } else {
          this.createMileageModel.effectiveMaxDate = new Date(this.createMileageModel.defaultMaxDate);
          this.createMileageModel.disabledEffDatesList = [];
        }
        CreateCarrierMileageUtility.validateDateFormat(event, fieldName, this.createMileageModel);
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
    CreateCarrierMileageUtility.getValidDate(this.createMileageModel);
  }
  onCancel() {
    this.createMileageModel.popupMessage = Messages.getMessage().cancelDiscardMsgs.discardMessage;
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
      this.createMileageModel.popupMessage = Messages.getMessage().cancelDiscardMsgs.discardMessage;
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
      this.router.navigate([this.agreementURL]);
    } else {
      this.router.navigate([this.createMileageModel.routingUrl]);
    }
  }
  onChangeMileageLevel(MileageLevelChangeValue) {
    const MileageLevelChangedValue = MileageLevelChangeValue['value'];
    this.createMileageModel.selectedMileageLevel = MileageLevelChangedValue;
    this.createMileageModel.selectedOption = MileageLevelChangeValue['value'];
    this.createMileageModel.isNoRecordMsgFlag = false;
    this.createMileageModel.selectedAffiliationValue = MileageLevelChangeValue['value'];
    this.onChangeMileageChange(MileageLevelChangeValue['value']);
  }
  onChangeMileageChange(value: string) {
    switch (value) {
      case 'No Affiliation':
        CreateCarrierMileageUtility.carrierMileageChangeAgreement(this.createMileageModel);
        break;
      case 'section':
        CreateCarrierMileageUtility.carrierMileageChangeSection(this.createMileageModel);
        break;
      case 'Bill to Account':
        CreateCarrierMileageUtility.carrierMileageChangeBillTo(this.createMileageModel);
        break;
      default: break;
    }
  }
  getCarrierSegment() {
    this.createMileageService.getCarrierSegmentTypes().pipe(takeWhile(() => this.createMileageModel.isSubscriberFlag))
      .subscribe((segmentType: MileageUnit) => {
        this.createMileageModel.carrierSegmentList = [];
        this.createMileageModel.isViewCarrierMileageModel = false;
        const cloned = JSON.parse(JSON.stringify(segmentType));
        this.createMileageModel.carrierSegmentsClone = utils.cloneDeep(cloned);
        this.onSelectCarrierSegment(this.createMileageModel.defaultFieldValues['carrierSegment']);
        if (!utils.isEmpty(segmentType) && !utils.isEmpty(segmentType['_embedded'])) {
          segmentType['_embedded']['carrierSegmentTypes'].forEach((carrierSegment: CarrierSegmentTypesItem) => {
            this.createMileageModel.carrierSegmentList.push({
              label: carrierSegment['carrierSegmentTypeID'],
              value: carrierSegment['carrierSegmentTypeName']
            });
          });
          this.createMileageModel.carrierSegmentFilteredList = utils.cloneDeep(this.createMileageModel.carrierSegmentList);
        }
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.createMileageModel.carrierSegmentList = [];
        this.createMileageModel.carrierSegmentFilteredList = [];
        this.changeDetector.detectChanges();
      });
  }
  getCarrierSegmentList() {
    this.createMileageModel.carrierSegmentFilteredList = [];
    this.createMileageModel.carrierSegmentList.forEach((carrierSegment) => {
      this.createMileageModel.carrierSegmentFilteredList.push({
        label: carrierSegment.label,
        value: carrierSegment.value
      });
    });
  }
}
