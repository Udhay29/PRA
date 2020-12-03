import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input,
  OnInit, Output, AfterViewChecked
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import * as utils from 'lodash';

import { takeWhile } from 'rxjs/operators';

import { MessageService } from 'primeng/components/common/messageservice';
import { LocalStorageService } from './../../../../shared/jbh-app-services/local-storage.service';

import {
  CargoDetailListItem, GridRowData, ContractDropDown, CargoReleaseDefaultAmount,
  SectionCargoAgreement, ContactCargoAgreement, BusinessUnit, DeleteAgreement
} from './../models/add-cargo-interface';
import { AddCargoUtilsService } from './../services/add-cargo-utils.service';
import { CreateCargoModel } from './models/create-cargo.model';
import { CreateCargoService } from './services/create-cargo.service';
import { CreateCargoUtilsService } from './services/create-cargo-utils.service';

@Component({
  selector: 'app-create-cargo',
  templateUrl: './create-cargo.component.html',
  styleUrls: ['./create-cargo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateCargoComponent implements OnInit, AfterViewChecked {
  createCargoModel: CreateCargoModel;
  screensName: string;
  defaultAgreement: boolean;
  @Input() rowData: CargoDetailListItem;
  @Input()
  set defaultAgreementValue(value) {
    this.defaultAgreement = value;
  }
  @Input()
  set screenName(value) {
    this.screensName = value;
    switch (value) {
      case 'createDefault':
        this.getAgreementTimestamp();
        break;
      case 'create':
        this.createCargoReleaseAgreement();
        this.getBusinessUnitValues();
        break;
      default:
        this.getCargoDetails();
        break;
    }
  }
  @Output() addCargoRelease: EventEmitter<CargoDetailListItem> = new EventEmitter<CargoDetailListItem>();
  @Output() deleteGridRecord: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() cargoFormCheck: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly createCargoService: CreateCargoService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly utilsService: AddCargoUtilsService,
    private readonly createCargoUtilsService: CreateCargoUtilsService,
    private readonly localStore: LocalStorageService,
    private readonly messageService: MessageService) {
    this.createCargoModel = new CreateCargoModel();
    this.createCargoReleaseForm();
    this.createCargoModel.cargoDefaultAmount = this.localStore.getDefaultAmount();
    this.createCargoModel.agreementId = this.localStore.getItem('createAgreement', 'detail');
  }
  ngOnInit() {
    this.getSectionCargoValues();
    this.getContractCargoValues();
    this.getBusinessUnitValues();
    this.createCargoReleaseAgreement();
  }
  ngAfterViewChecked() {
    if (this.createCargoModel.cargoReleaseForm.dirty) {
      this.cargoFormCheck.emit(true);
    } else {
      this.cargoFormCheck.emit(false);
    }
  }
  createCargoReleaseForm() {
    this.createCargoModel.cargoReleaseForm = this.formBuilder.group({
      cargoValue: ['', Validators.required],
      selectContract: [''],
      agreementType: [''],
      contract: [''],
      businessUnit: [''],
      effectiveDate: [''],
      expirationDate: ['']
    });
    this.createCargoModel.cargoReleaseForm.updateValueAndValidity();
  }
  getAgreementTimestamp() {
    this.createCargoModel.isLoader = true;
    if (this.createCargoModel.agreementId && this.createCargoModel.agreementId['customerAgreementID']) {
      this.createCargoService.getAgreementTime(this.createCargoModel.agreementId['customerAgreementID']).pipe(takeWhile(() =>
        this.createCargoModel.isSubscribe)).subscribe((data: CargoReleaseDefaultAmount) => {
          if (data) {
            this.createCargoModel.effectiveDate = this.dateFormatter(data['agreementEffectiveDate']);
            this.createCargoModel.expirationDate = this.dateFormatter(data['agreementExpirationDate']);
            const localeValue = data['agreementDefaultAmount'].toLocaleString();
            this.createCargoModel.cargoReleaseForm.controls['cargoValue'].setValue(localeValue);
            this.validateCurrency(localeValue, 'cargoValue');
            this.localStore.setCargoAmount(data);
            this.createCargoModel.isLoader = false;
            this.changeDetector.detectChanges();
          }
        }, (error: Error) => {
          if (error) {
            this.createCargoModel.isLoader = false;
            this.toastMessage(this.messageService, 'error', error['error']['errors'][0]['errorMessage']);
          }
        });
    }
  }
  getCargoDetails() {
    if (this.createCargoModel.agreementId) {
      this.createCargoModel.rowValue = [];
      this.createCargoModel.isLoader = true;
      this.createCargoModel.cargoType = utils.upperFirst(this.rowData[0]['cargoType']);
      const cargoId = this.rowData[0]['customerAgreementCargoIDs'];
      this.createCargoService.getAgreementCargoDetails(this.createCargoModel.agreementId['customerAgreementID'],
        cargoId, this.createCargoModel.cargoType).pipe(takeWhile(() =>
          this.createCargoModel.isSubscribe)).subscribe((data: GridRowData) => {
            if (data) {
              this.createCargoModel.rowValue.push(data);
              this.populateValues();
              this.createCargoModel.isLoader = false;
              this.changeDetector.detectChanges();
            }
          }, (cargoError: Error) => {
            if (cargoError) {
              this.createCargoModel.isLoader = false;
              this.toastMessage(this.messageService, 'error', cargoError['error']['errors'][0]['errorMessage']);
            }
          });
    }
  }
  populateCargoReleaseTypes() {
    this.defaultAgreement = false;
    if (this.createCargoModel.rowValue[0] && this.createCargoModel.rowValue[0]['customerSectionName']) {
      this.getSectionCargoValues();
      this.populateSection();
    } else if (this.createCargoModel.rowValue[0] && this.createCargoModel.rowValue[0]['customerContractName']) {
      this.populateContract();
    } else {
      this.populateBusinessUnit();
    }
  }
  populateSection() {
    this.createCargoModel.isChanged = false;
    if (!utils.isEmpty(this.createCargoModel.rowValue[0]['customerSectionBusinessUnitCargo'])) {
      this.setBusinessUnitValue(this.createCargoModel.rowValue[0]['customerSectionBusinessUnitCargo']);
      this.createCargoModel.cargoReleaseForm.controls['agreementType'].setValue('section');
      this.agreementType('section');
    } else {
      this.createCargoModel.cargoReleaseForm.controls['businessUnit'].setValue(null);
      this.createCargoModel.cargoReleaseForm.controls['agreementType'].setValue('section');
      this.agreementType('section');
      const localeValue = this.createCargoModel.rowValue[0]['cargoAmount'].toLocaleString();
      this.createCargoModel.cargoReleaseForm.controls['cargoValue'].setValue(localeValue);
      this.validateCurrency(localeValue, 'cargoValue');
    }
  }
  populateContract() {
    this.createCargoModel.isChanged = false;
    if (this.createCargoModel.rowValue[0]['customerContractName'] &&
      this.createCargoModel.rowValue[0]['customerContractBusinessUnitCargoList']) {
      this.createCargoModel.cargoReleaseForm.controls['agreementType'].setValue('contract');
      this.agreementType('contract');
      this.setBusinessUnitValue(this.createCargoModel.rowValue[0]['customerContractBusinessUnitCargoList']);
    } else if (this.createCargoModel.rowValue[0]['customerContractName']) {
      this.createCargoModel.cargoReleaseForm.controls['businessUnit'].setValue(null);
      this.createCargoModel.cargoReleaseForm.controls['agreementType'].setValue('contract');
      this.agreementType('contract');
      const localeValue = this.createCargoModel.rowValue[0]['cargoAmount'].toLocaleString();
      this.createCargoModel.cargoReleaseForm.controls['cargoValue'].setValue(localeValue);
      this.validateCurrency(localeValue, 'cargoValue');
    }
  }
  populateBusinessUnit() {
    this.createCargoModel.isChanged = false;
    if (this.createCargoModel.rowValue[0]['customerAgreementBusinessUnitCargoList'] &&
      this.createCargoModel.rowValue[0]['customerAgreementBusinessUnitCargoList'].length > 0) {
      const localeValue =
        this.createCargoModel.rowValue[0]['customerAgreementBusinessUnitCargoList'][0]['agreementBusinessUnitCargoAmount'].toLocaleString();
      this.createCargoModel.cargoReleaseForm.controls['cargoValue'].setValue(localeValue);
      this.validateCurrency(localeValue, 'cargoValue');
      this.createCargoModel.cargoReleaseForm.controls['agreementType'].setValue('agreement');
      this.createCargoModel.cargoReleaseForm.controls['effectiveDate'].setValue(this.
        dateFormatter(this.createCargoModel.rowValue[0]['customerAgreementBusinessUnitCargoList'][0]['agreementBuEffectiveDate']));
      this.createCargoModel.cargoReleaseForm.controls['expirationDate'].setValue(this.
        dateFormatter(this.createCargoModel.rowValue[0]['customerAgreementBusinessUnitCargoList'][0]['agreementBuExpirationDate']));
      this.setBusinessUnitValue(this.createCargoModel.rowValue[0]['customerAgreementBusinessUnitCargoList']);
      this.createCargoModel.isOptional = false;
      this.createCargoModel.isSection = false;
      this.createCargoModel.isContract = false;
    }
  }
  getSectionCargoValues(callBackFn?) {
    this.createCargoModel.searchInputValue = '';
    if (this.createCargoModel.agreementId) {
      this.createCargoService.getSectionCargo(this.createCargoModel.agreementId['customerAgreementID']).pipe(takeWhile(() =>
        this.createCargoModel.isSubscribe)).subscribe((data: Array<SectionCargoAgreement>) => {
          this.createCargoModel.sectionsList = [];
          if (data && data['customerSectionDetailDTO'] && data['customerSectionDetailDTO'].length > 0) {
            data['customerSectionDetailDTO'].forEach(element => {
              element['customerContractName'] = (element['customerContractNumber']) ?
                `${element['customerContractNumber']}-${element['customerContractName']}` :
                `(Transactional)-${element['customerContractName']}`;
            });
            this.createCargoModel.sectionsList = data['customerSectionDetailDTO'];
            this.createCargoModel.filteredSectionsList = utils.clone(this.createCargoModel.sectionsList);
            if (this.createCargoModel.tabValue === 'section') {
              this.populateDefaultSection();
            }
            this.changeDetector.detectChanges();
          }
        }, (sectionError: Error) => {
          this.toastMessage(this.messageService, 'error', sectionError['error']['errors'][0]['errorMessage']);
        });
    }
    if (callBackFn) {
      callBackFn(this.createCargoModel.sectionsList);
    }
  }
  onRowSelect(rowData) {
    if (this.createCargoModel.rowValue && this.createCargoModel.rowValue[0] &&
      this.createCargoModel.rowValue[0].customerSectionID === rowData['data']['customerSectionID']) {
      this.createCargoModel.sectionSelectFlag = true;
    } else if (this.createCargoModel.rowValue && this.createCargoModel.rowValue[0] &&
      this.createCargoModel.rowValue[0].customerSectionID !== rowData['data']['customerSectionID']) {
      this.createCargoModel.sectionSelectFlag = true;
    }
    this.createCargoModel.selectedSectionsList = rowData['data'];
    this.createCargoModel.cargoReleaseForm.controls['effectiveDate'].setValue(this.dateFormatter(rowData.data['sectionEffectiveDate']));
    this.createCargoModel.cargoReleaseForm.controls['expirationDate'].setValue(this.dateFormatter(rowData.data['sectionExpirationDate']));
  }
  getContractCargoValues() {
    if (this.createCargoModel.agreementId) {
      this.createCargoService.getContractCargo(this.createCargoModel.agreementId['customerAgreementID']).pipe(takeWhile(() =>
        this.createCargoModel.isSubscribe)).subscribe((data: Array<ContactCargoAgreement>) => {
          this.createCargoModel.allContractCargoValues = [];
          if (data && !utils.isEmpty(data['customerContractDetailDTO'])) {
            data['customerContractDetailDTO'].forEach(element => {
              this.createCargoModel.allContractCargoValues.push({
                label: element,
                value: (element['customerContractNumber']) ? `${element['customerContractNumber']}-${element['customerContractName']}`
                  : `(Transactional)-${element['customerContractName']}`
              });
            });
          }
        }, (contractError: Error) => {
          if (contractError) {
            this.toastMessage(this.messageService, 'error', contractError['error']['errors'][0]['errorMessage']);
          }
        });
    }
  }
  onTypeContractCargo(event: Event) {
    this.createCargoModel.contractCargoValues = [];
    if (this.createCargoModel.allContractCargoValues) {
      this.createCargoModel.allContractCargoValues.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.createCargoModel.contractCargoValues.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    this.changeDetector.detectChanges();
  }
  onSelectContract(event: ContractDropDown) {
    this.createCargoModel.cargoReleaseForm.controls['effectiveDate'].setValue(this.dateFormatter(event.label['contractEffectiveDate']));
    this.createCargoModel.cargoReleaseForm.controls['expirationDate'].setValue(this.dateFormatter(event.label['contractExpirationDate']));
  }
  getBusinessUnitValues() {
    this.createCargoService.getBusinessUnit().pipe(takeWhile(() => this.createCargoModel.isSubscribe))
      .subscribe((data: Array<BusinessUnit>) => {
        const businessValues = [];
        if (data) {
          data['_embedded']['serviceOfferingBusinessUnitTransitModeAssociations'].forEach(element => {
            businessValues.push({
              label: element['financeBusinessUnitServiceOfferingAssociation']['financeBusinessUnitCode'],
              value: element['financeBusinessUnitServiceOfferingAssociation']['financeBusinessUnitCode']
            });
            this.createCargoModel.businessUnit = businessValues;
          });
          this.changeDetector.detectChanges();
        }
      }, (businessUnitError: Error) => {
        if (businessUnitError) {
          this.toastMessage(this.messageService, 'error', businessUnitError['error']['errors'][0]['errorMessage']);
        }
      });
  }
  createCargoReleaseAgreement() {
    if (this.defaultAgreement) {
      this.createCargoModel.isOptional = true;
      this.createCargoModel.cargoType = 'agreement';
    } else if (!this.defaultAgreement) {
      this.createCargoModel.isOptional = false;
      this.checkStore();
      this.createCargoModel.cargoReleaseForm.controls['cargoValue'].setValue(null);
      this.createCargoModel.cargoReleaseForm.controls['agreementType'].setValue('agreement');
      this.agreementType('agreement');
      this.createCargoModel.defaultCargoData = this.localStore.getCargoAmount();
    }
  }
  checkStore() {
    if (!utils.isUndefined(this.localStore.getItem('createAgreement', 'detail'))) {
      this.createCargoModel.agreementDetails = this.localStore.getItem('createAgreement', 'detail');
      this.initialDate();
    }
  }
  initialDate() {
    if (this.createCargoModel.agreementDetails) {
      this.createCargoModel.effectiveMinDate = new Date(this.createCargoModel.agreementDetails.effectiveDate
        .replace(/-/g, '\/').replace(/T.+/, ''));
      this.createCargoModel.effectiveMaxDate = new Date(this.createCargoModel.agreementDetails.expirationDate
        .replace(/-/g, '\/').replace(/T.+/, ''));
      this.createCargoModel.expirationMinDate = new Date(this.createCargoModel.agreementDetails.effectiveDate
        .replace(/-/g, '\/').replace(/T.+/, ''));
      this.createCargoModel.expirationMaxDate = new Date(this.createCargoModel.agreementDetails.expirationDate
        .replace(/-/g, '\/').replace(/T.+/, ''));
    }
  }
  /**
   *
   *
   * @param {Event} event
   * @memberof CreateCargoComponent
   */
  onSelectType(event) {
    this.createCargoModel.isChanged = true;
    this.agreementType(event['option'].value);
    this.createCargoModel.tabValue = event['option'].value;
    this.createCargoModel.effError = false;
    this.createCargoModel.expError = false;
    this.changeDetector.detectChanges();
  }


  buBlur(event: Event) {
    if (this.createCargoModel.tabValue === 'agreement') {
      this.createCargoModel.cargoReleaseForm.controls['businessUnit'].setValidators([Validators.required]);
    } else {
      this.createCargoModel.cargoReleaseForm.controls['businessUnit'].setValidators(null);
    }
    this.createCargoModel.cargoReleaseForm.controls['businessUnit'].updateValueAndValidity();
    this.changeDetector.detectChanges();
  }
  /**
   *
   *
   * @param {string} value
   * @memberof CreateCargoComponent
   */
  agreementType(value: string) {
    this.createCargoModel.tabValue = value;
    this.createCargoModel.cargoReleaseForm.controls['effectiveDate'].setValidators([Validators.required]);
    this.createCargoModel.cargoReleaseForm.controls['expirationDate'].setValidators([Validators.required]);
    switch (value) {
      case 'agreement':
        this.createCargoModel.isOptional = false;
        this.createCargoModel.isSection = false;
        this.createCargoModel.isContract = false;
        this.createCargoModel.cargoType = 'agreementBU';
        this.createCargoModel.cargoReleaseForm.controls['businessUnit'].setErrors(null);
        this.createCargoModel.cargoReleaseForm.controls['businessUnit'].setValidators(null);
        this.populateDefaultBusinessUnit();
        break;
      case 'contract':
        this.createCargoModel.isOptional = true;
        this.createCargoModel.isSection = false;
        this.createCargoModel.isContract = true;
        this.createCargoModel.cargoType = 'contract';
        if (this.createCargoModel.rowValue[0] &&
          !utils.isEmpty(this.createCargoModel.rowValue[0]['customerContractBusinessUnitCargoList'])) {
          this.populateContractBusinessUnit();
          this.createCargoModel.cargoReleaseForm.controls['businessUnit'].setErrors(null);
          this.createCargoModel.cargoReleaseForm.controls['businessUnit'].setValidators(null);
        } else {
          this.populateDefaultContract();
        }
        break;
      case 'section':
        this.createCargoModel.isOptional = true;
        this.createCargoModel.isSection = true;
        this.createCargoModel.isContract = false;
        this.createCargoModel.cargoType = 'section';
        if (this.createCargoModel.rowValue[0] &&
          !utils.isEmpty(this.createCargoModel.rowValue[0]['customerSectionBusinessUnitCargo'])) {
          this.populateSectionBusinessUnit();
          this.createCargoModel.cargoReleaseForm.controls['businessUnit'].setErrors(null);
          this.createCargoModel.cargoReleaseForm.controls['businessUnit'].setValidators(null);
        } else {
          this.populateDefaultSection();
        }
        break;
    }
  }
  /**
   *
   *
   * @memberof CreateCargoComponent
   */
  populateDefaultContract() {
    this.createCargoModel.cargoReleaseForm.controls['contract'].setValidators([Validators.required]);
    this.createCargoModel.cargoReleaseForm.controls['effectiveDate'].setValidators([Validators.required]);
    this.createCargoModel.cargoReleaseForm.controls['expirationDate'].setValidators([Validators.required]);
    this.createCargoModel.cargoReleaseForm.controls['businessUnit'].setErrors(null);
    this.createCargoModel.cargoReleaseForm.controls['businessUnit'].setValidators(null);
    if (this.createCargoModel.rowValue.length > 0 && !this.createCargoModel.isChanged) {
      this.createCargoModel.cargoReleaseForm.controls['contract'].setValue({
        label: this.createCargoModel.rowValue[0]['customerContractID'],
        value: (this.createCargoModel.rowValue[0]['customerContractNumber']) ?
          `${this.createCargoModel.rowValue[0]['customerContractNumber']}-${this.createCargoModel.rowValue[0]['customerContractName']}` :
          `(Transactional)-${this.createCargoModel.rowValue[0]['customerContractName']}`
      });
      this.createCargoModel.cargoReleaseForm.controls['effectiveDate'].
        setValue(this.dateFormatter(this.createCargoModel.rowValue[0]['effectiveDate']));
      this.createCargoModel.cargoReleaseForm.controls['expirationDate'].
        setValue(this.dateFormatter(this.createCargoModel.rowValue[0]['expirationDate']));
    } else {
      this.createCargoModel.cargoReleaseForm.controls['contract'].setValue(this.createCargoModel.allContractCargoValues[0]);
      this.createCargoModel.cargoReleaseForm.controls['effectiveDate'].
        setValue(this.dateFormatter(this.createCargoModel.allContractCargoValues[0]['label']['contractEffectiveDate']));
      this.createCargoModel.cargoReleaseForm.controls['expirationDate'].
        setValue(this.dateFormatter(this.createCargoModel.allContractCargoValues[0]['label']['contractExpirationDate']));
    }
  }
  populateContractBusinessUnit() {
    if (this.createCargoModel.rowValue && !utils.isEmpty(this.createCargoModel.rowValue[0]['customerContractBusinessUnitCargoList'])) {
      this.createCargoModel.cargoReleaseForm.controls['contract'].setValue({
        label: this.createCargoModel.rowValue[0]['customerContractID'],
        value: (this.createCargoModel.rowValue[0]['customerContractNumber']) ?
          `${this.createCargoModel.rowValue[0]['customerContractNumber']}-${this.createCargoModel.rowValue[0]['customerContractName']}` :
          `(Transactional)-${this.createCargoModel.rowValue[0]['customerContractName']}`
      });
      this.createCargoModel.cargoReleaseForm.controls['effectiveDate'].setValue(this.
        dateFormatter(this.createCargoModel.rowValue[0]['customerContractBusinessUnitCargoList'][0]['contractBuEffectiveDate']));
      this.createCargoModel.cargoReleaseForm.controls['expirationDate'].setValue(this.
        dateFormatter(this.createCargoModel.rowValue[0]['customerContractBusinessUnitCargoList'][0]['contractBuExpirationDate']));
      const localeValue =
        this.createCargoModel.rowValue[0]['customerContractBusinessUnitCargoList'][0]['contractBusinessUnitCargoAmount'].toLocaleString();
      this.createCargoModel.cargoReleaseForm.controls['cargoValue'].setValue(localeValue);
      this.validateCurrency(localeValue, 'cargoValue');
    }
  }
  populateSectionBusinessUnit() {
    if (this.createCargoModel.rowValue && !utils.isEmpty(this.createCargoModel.rowValue[0]['customerSectionBusinessUnitCargo'])) {
      this.createCargoModel.selectedSectionsList =
        this.createCargoUtilsService.sectionListDtoFormation(this.createCargoModel, 'edit');
      this.createCargoModel.cargoReleaseForm.controls['effectiveDate'].setValue(this.
        dateFormatter(this.createCargoModel.rowValue[0]['customerSectionBusinessUnitCargo'][0]['sectionBuEffectiveDate']));
      this.createCargoModel.cargoReleaseForm.controls['expirationDate'].setValue(this.
        dateFormatter(this.createCargoModel.rowValue[0]['customerSectionBusinessUnitCargo'][0]['sectionBuExpirationDate']));
      const localeValue =
        this.createCargoModel.rowValue[0]['customerSectionBusinessUnitCargo'][0]['sectionBusinessUnitCargoAmount'].toLocaleString();
      this.createCargoModel.cargoReleaseForm.controls['cargoValue'].setValue(localeValue);
      this.validateCurrency(localeValue, 'cargoValue');
    }
    this.changeDetector.detectChanges();
  }
  /**
   *
   *
   * @memberof CreateCargoComponent
   */
  populateDefaultSection() {
    this.createCargoModel.cargoReleaseForm.controls['businessUnit'].setErrors(null);
    this.createCargoModel.cargoReleaseForm.controls['businessUnit'].setValidators(null);
    if (this.createCargoModel.rowValue.length > 0 && !this.createCargoModel.isChanged) {
      this.createCargoModel.selectedSectionsList = this.createCargoUtilsService.
        sectionListDtoFormation(this.createCargoModel, 'edit');
      if (this.createCargoModel.filteredSectionsList) {
        this.createCargoModel.selectedSectionsList = utils.find(this.createCargoModel.filteredSectionsList,
          { customerSectionID: this.createCargoModel.rowValue[0].customerSectionID });
      }
      this.createCargoModel.cargoReleaseForm.controls['effectiveDate'].
        setValue(this.dateFormatter(this.createCargoModel.rowValue[0]['effectiveDate']));
      this.createCargoModel.cargoReleaseForm.controls['expirationDate'].
        setValue(this.dateFormatter(this.createCargoModel.rowValue[0]['expirationDate']));
    } else {
      this.createCargoModel.selectedSectionsList = this.createCargoModel.sectionsList[0];
      this.createCargoModel.cargoReleaseForm.controls['effectiveDate'].
        setValue(this.dateFormatter(this.createCargoModel.sectionsList[0]['sectionEffectiveDate']));
      this.createCargoModel.cargoReleaseForm.controls['expirationDate'].
        setValue(this.dateFormatter(this.createCargoModel.sectionsList[0]['sectionExpirationDate']));
    }
    this.changeDetector.detectChanges();
  }
  /**
   *
   *
   * @memberof CreateCargoComponent
   */
  populateDefaultBusinessUnit() {
    if (this.createCargoModel.rowValue.length > 0 && !this.createCargoModel.isChanged) {
      this.setBusinessUnitValue(this.createCargoModel.rowValue[0]['customerAgreementBusinessUnitCargos']);
      this.createCargoModel.cargoReleaseForm.controls['effectiveDate'].
        setValue(this.dateFormatter(this.createCargoModel.rowValue[0]['effectiveDate']));
      this.createCargoModel.cargoReleaseForm.controls['expirationDate'].
        setValue(this.dateFormatter(this.createCargoModel.rowValue[0]['expirationDate']));
    } else if (this.createCargoModel.defaultCargoData) {
      this.createCargoModel.cargoReleaseForm.controls['effectiveDate'].
        setValue(this.dateFormatter(this.createCargoModel.defaultCargoData['agreementEffectiveDate']));
      this.createCargoModel.cargoReleaseForm.controls['expirationDate'].
        setValue(this.dateFormatter(this.createCargoModel.defaultCargoData['agreementExpirationDate']));
    }
  }
  /**
   *
   *
   * @memberof CreateCargoComponent
   */
  setBusinessUnitValue(businessUnitList) {
    this.createCargoModel.IsPreValSetForBU = false;
    const businessValue = [];
    if (businessUnitList.length > 0) {
      businessUnitList.forEach(element => {
        businessValue.push({
          label: element.financeBusinessUnitCode,
          value: element.financeBusinessUnitCode
        });
      });
      this.createCargoModel.cargoReleaseForm.controls['businessUnit'].patchValue(businessValue);
      this.createCargoModel.IsPreValSetForBU = true;
    }
  }

  /**
   *
   *
   * @memberof CreateCargoComponent
   */
  populateValues() {
    if (this.createCargoModel.rowValue[0]['agreementDefault'] === 'Yes') {
      this.defaultAgreement = true;
      this.createCargoModel.isOptional = false;
      this.createCargoModel.cargoType = 'agreement';
      this.createCargoModel.cargoReleaseForm.controls['businessUnit'].setValidators(null);
      this.createCargoModel.cargoReleaseForm.controls['businessUnit'].setErrors(null);
      const localeValue = this.createCargoModel.rowValue[0]['cargoAmount'].toLocaleString();
      this.createCargoModel.cargoReleaseForm.controls['cargoValue'].setValue(localeValue);
      this.validateCurrency(localeValue, 'cargoValue');
      this.createCargoModel.effectiveDate = this.dateFormatter(this.createCargoModel.rowValue[0]['effectiveDate']);
      this.createCargoModel.expirationDate = this.dateFormatter(this.createCargoModel.rowValue[0]['expirationDate']);
    } else {
      this.populateCargoReleaseTypes();
    }

  }
  onBlurInput() {
    this.createCargoModel.cargoReleaseForm.controls['cargoValue'].toLocaleString();
  }
  /**
   *
   *
   * @memberof CreateCargoComponent
   */
  onClose() {
    if ((this.createCargoModel.cargoReleaseForm.touched && this.createCargoModel.cargoReleaseForm.dirty)
      || this.createCargoModel.sectionSelectFlag) {
      this.createCargoModel.isCancel = true;
    } else {
      this.addCargoRelease.emit();
    }
  }
  /**
   *
   *
   * @memberof CreateCargoComponent
   */
  onSave() {
    this.createCargoModel.effError = false;
    this.createCargoModel.expError = false;
    if (this.createCargoModel.cargoReleaseForm.valid && this.createCargoModel.cargoReleaseForm.dirty ||
      this.createCargoModel.sectionSelectFlag) {
      this.buSaveCheck();
    } else if (!this.createCargoModel.cargoReleaseForm.valid) {
      this.createCargoUtilsService.formFieldsTouched(this, this.messageService);
      if (this.createCargoModel.tabValue === 'agreement' &&
        !this.createCargoModel.cargoReleaseForm.controls['businessUnit'].value.length && !this.defaultAgreement) {
        this.setBuValidators();
      }
      this.changeDetector.detectChanges();
    } else if (this.createCargoModel.cargoReleaseForm.pristine) {
      this.checkPristine();
    }
  }

  buSaveCheck() {
    if (this.createCargoModel.tabValue === 'agreement' &&
      this.createCargoModel.cargoReleaseForm.controls['businessUnit'].value.length === 0 && !this.defaultAgreement) {
      this.setBuValidators();
      this.createCargoUtilsService.formFieldsTouched(this, this.messageService);
    } else {
      this.onSaveCargo();
    }
  }

  setBuValidators() {
    this.createCargoModel.cargoReleaseForm.controls['businessUnit'].setValidators([Validators.required]);
    this.createCargoModel.cargoReleaseForm.controls['businessUnit'].setErrors({
      'required': true
    });
  }
  checkPristine() {
    if (this.screensName !== 'createDefault') {
      this.createCargoUtilsService.warningMessage(this.messageService);
    } else {
      this.onSaveCargo();
    }
  }
  onSaveCargo() {
    this.dateValidation();
    this.createCargoModel.isSaveChanges = true;
    if (this.createCargoModel.agreementId && (this.screensName.toLowerCase() === 'createdefault'
      || this.screensName.toLowerCase() === 'create') && !this.createCargoModel.isNotValidDate) {
      this.onCreateSave();
    } else if (this.rowData[0] && this.createCargoModel.agreementId && !this.createCargoModel.isNotValidDate) {
      this.onEditSave();
    }
  }
  dateValidation() {
    if (this.createCargoModel.cargoReleaseForm.valid && this.createCargoModel.isNotValidDate) {
      this.setFormErrors();
      this.toastMessage(this.messageService, 'error', 'The effective date should be before or equal to the expiration date');
    }
  }
  /**
   *
   *
   * @memberof CreateCargoComponent
   */
  onCreateSave() {
    let formData;
    let url: string;
    this.createCargoModel.saveError = '';
    formData = this.createQueryType();
    url = `${this.createCargoModel.agreementId['customerAgreementID']}/cargoreleases?cargoReleaseType=${this.createCargoModel.cargoType}`;
    if (this.createCargoModel.sectionFlag) {
      this.createCargoService.saveCargo(url, formData).pipe(takeWhile(() => this.createCargoModel.isSubscribe)).
        subscribe((data: CargoDetailListItem) => {
          if (data) {
            this.toastMessage(this.messageService, 'success', 'You have successfully added the Cargo Release');
            this.addCargoRelease.emit();
          }
          this.createCargoModel.cargoReleaseFlag = false;
          this.cargoFormCheck.emit(false);
        }, (createError: Error) => {
          if (createError) {
            this.createCargoModel.saveError = createError['error']['errors'][0]['errorMessage'];
            this.toastMessage(this.messageService, 'error', createError['error']['errors'][0]['errorMessage']);
            const errCode = createError['error']['errors'][0]['code'];
            if (errCode === 'CARGO_VALUE_GREATER_THAN_MAX_VALUE' || errCode === 'CARGO_VALUE_LESS_THAN_DEFAULT_VALUE') {
              this.createCargoModel.cargoReleaseFlag = true;
            } else {
              this.createCargoModel.cargoReleaseFlag = false;
            }
            this.changeDetector.markForCheck();
          }
          this.createCargoModel.cargoType = this.createCargoModel.cargoType.replace('BU', '');
        });
    }
    this.changeDetector.detectChanges();
  }
  createQueryType() {
    let saveQuery;
    this.createCargoModel.sectionFlag = true;
    switch (this.createCargoModel.cargoType) {
      case 'agreement':
      case 'Agreement':
        this.createCargoModel.cargoType = 'Agreement';
        saveQuery = this.createCargoUtilsService.onCreateAgreementQuery(this);
        break;
      case 'agreementBU':
      case 'AgreementBU':
        this.createCargoModel.cargoType = 'AgreementBU';
        saveQuery = this.createCargoUtilsService.onCreateAgreementBuQuery(this);
        break;
      case 'contract':
      case 'Contract':
        if (this.createCargoModel.cargoReleaseForm.controls['businessUnit'].value &&
          this.createCargoModel.cargoReleaseForm.controls['businessUnit'].value.length > 0) {
          this.createCargoModel.cargoType = 'ContractBU';
          saveQuery = this.createCargoUtilsService.onCreateContractBuQuery(this);
          break;
        } else {
          this.createCargoModel.cargoType = 'Contract';
          saveQuery = this.createCargoUtilsService.onCreateContractQuery(this);
          break;
        }
      case 'section':
      case 'Section':
        saveQuery = this.sectionValidator();
        break;
      case 'contractBU':
      case 'ContractBU':
        this.createCargoModel.cargoType = 'ContractBU';
        saveQuery = this.createCargoUtilsService.onCreateContractBuQuery(this);
        break;
      case 'sectionBU':
      case 'SectionBU':
        saveQuery = this.sectionBUValidator();
        break;
    }
    this.changeDetector.detectChanges();
    return saveQuery;
  }
  sectionValidator() {
    let saveQuery;
    if (this.createCargoModel.selectedSectionsList !== null) {
      if (this.createCargoModel.cargoReleaseForm.controls['businessUnit'].value &&
        this.createCargoModel.cargoReleaseForm.controls['businessUnit'].value.length > 0) {
        this.createCargoModel.cargoType = 'SectionBU';
        saveQuery = this.createCargoUtilsService.onCreateSectionBuQuery(this);
      } else {
        this.createCargoModel.cargoType = 'Section';
        saveQuery = this.createCargoUtilsService.onCreateSectionQuery(this);
      }
      this.createCargoModel.sectionFlag = true;
    } else {
      this.toastMessage(this.messageService, 'error', 'Select Section for the Cargo Release');
      this.createCargoModel.sectionFlag = false;
    }
    return saveQuery;
  }
  sectionBUValidator() {
    let saveQuery;
    if (this.createCargoModel.selectedSectionsList) {
      this.createCargoModel.cargoType = 'SectionBU';
      saveQuery = this.createCargoUtilsService.onCreateSectionBuQuery(this);
      this.createCargoModel.sectionFlag = true;
    } else {
      this.toastMessage(this.messageService, 'error', 'Select Section for the Cargo Release');
      this.createCargoModel.sectionFlag = false;
    }
    return saveQuery;
  }
  onEditSave() {
    let formData;
    let url: string;
    url = `${this.createCargoModel.agreementId['customerAgreementID']}/cargoreleases`;
    this.createCargoModel.saveError = '';
    formData = this.createQueryType();
    if (this.createCargoModel.sectionFlag) {
      this.createCargoService.updateCargo(url, formData).pipe(takeWhile(() => this.createCargoModel.isSubscribe)).
        subscribe((data: CargoDetailListItem) => {
          if (data) {
            this.toastMessage(this.messageService, 'success', 'You have successfully edited the Cargo Release');
            this.addCargoRelease.emit();
            this.cargoFormCheck.emit(false);
          }
        }, (editError: Error) => {
          if (editError) {
            this.createCargoModel.saveError = editError['error']['errors'][0]['errorMessage'];
            this.toastMessage(this.messageService, 'error', editError['error']['errors'][0]['errorMessage']);
            const errCode = editError['error']['errors'][0]['code'];
            if (errCode === 'CARGO_VALUE_GREATER_THAN_MAX_VALUE' || errCode === 'CARGO_VALUE_LESS_THAN_DEFAULT_VALUE') {
              this.createCargoModel.cargoReleaseFlag = true;
            } else {
              this.createCargoModel.cargoReleaseFlag = false;
            }
            this.changeDetector.markForCheck();
          }
        });
    }
  }
  dateFormatter(value: string): string {
    return moment(value).format('MM/DD/YYYY');
  }
  onClickYes(dialog: string) {
    switch (dialog) {
      case 'cancel':
        this.onSave();
        this.createCargoModel.isCancel = false;
        break;
      case 'delete':
        this.onDelete();
        break;
    }
  }
  onClickNo(dialog: string) {
    switch (dialog) {
      case 'cancel':
        this.createCargoModel.isCancel = false;
        this.addCargoRelease.emit();
        break;
      case 'delete':
        this.createCargoModel.isDelete = false;
        break;
    }
  }
  onDateSelected(event, type: string) {
    this.createCargoModel.inCorrectExpDateFormat = false;
    if (type === 'effectiveDate') {
      this.createCargoModel.expirationMinDate = new Date(event);
      this.createCargoModel.cargoReleaseForm.controls['effectiveDate'].setValue(this.dateFormatter(event));
      this.validEffDate();
    } else {
      this.createCargoModel.effectiveMaxDate = new Date(event);
      this.createCargoModel.cargoReleaseForm.controls['expirationDate'].setValue(this.dateFormatter(event));
      this.validExpDate();
    }
  }
  onTypeDate(typedDate: string, fieldName: string) {
    switch (fieldName) {
      case 'effectiveDate':
        if (this.createCargoModel.cargoReleaseForm.controls['effectiveDate'].value) {
          this.createCargoModel.inCorrectEffDateFormat = false;
          this.validEffDate();
          this.onDateSelected(this.createCargoModel.cargoReleaseForm.controls['effectiveDate'].value, 'effectiveDate');
          this.validateDateFormat(typedDate, fieldName);
        } else {
          this.createCargoModel.cargoReleaseForm.controls.effectiveDate.setValidators([Validators.required]);
          this.createCargoModel.cargoReleaseForm.controls.effectiveDate.updateValueAndValidity();
          this.createCargoModel.effError = false;
        }
        break;
      case 'expirationDate':
        if (this.createCargoModel.cargoReleaseForm.controls['expirationDate'].value) {
          this.createCargoModel.inCorrectExpDateFormat = false;
          this.validExpDate();
          this.onDateSelected(this.createCargoModel.cargoReleaseForm.controls['expirationDate'].value, 'expirationDate');
          this.validateDateFormat(typedDate, fieldName);
        } else {
          this.createCargoModel.cargoReleaseForm.controls.expirationDate.setValidators([Validators.required]);
          this.createCargoModel.cargoReleaseForm.controls.expirationDate.updateValueAndValidity();
          this.createCargoModel.expError = false;
        }
        break;
      default: break;
    }
  }
  validateDateFormat(typedDate: string, dateStatus: string): boolean | undefined {
    const datePat = /^(1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])\/[0-9]{4}$/;
    const matchArray = typedDate.match(datePat);
    if (matchArray == null) {
      switch (dateStatus) {
        case 'effective':
          this.createCargoModel.inCorrectEffDateFormat = true;
          this.createCargoModel.effDate = new Date();
          break;
        case 'expiration':
          this.createCargoModel.inCorrectExpDateFormat = true;
          this.createCargoModel.expDate = new Date();
          break;
      }
      return false;
    } else {
      this.setDateValues(dateStatus, typedDate);
    }
  }
  setDateValues(dateStatus, typedDate) {
    switch (dateStatus) {
      case 'effective':
        this.createCargoModel.effDate = new Date(typedDate);
        break;
      case 'expiration':
        this.createCargoModel.expDate = new Date(typedDate);
        break;
    }
  }
  setFormErrors() {
    this.createCargoModel.effError = (this.createCargoModel.inCorrectEffDateFormat || this.createCargoModel.isNotValidDate);
    this.createCargoModel.expError = (this.createCargoModel.inCorrectExpDateFormat || this.createCargoModel.isNotValidDate);
  }
  validExpDate() {
    this.createCargoModel.inCorrectExpDateFormat = false;
    if (this.createCargoModel.cargoReleaseForm.controls['effectiveDate'].value) {
      this.validEffDate();
    }
    const expDate = new Date(this.createCargoModel.cargoReleaseForm.controls['expirationDate'].value);
    const expDateValue = expDate.setHours(0, 0, 0, 0);
    this.createCargoModel.inCorrectExpDateFormat = (expDateValue > this.createCargoModel.expirationMaxDate.setHours(0, 0, 0, 0));
  }
  validEffDate() {
    this.createCargoModel.isNotValidDate = false;
    const effDateValue = new Date(this.createCargoModel.cargoReleaseForm.controls['effectiveDate'].value);
    const expDateTest = new Date(this.createCargoModel.cargoReleaseForm.controls['expirationDate'].value);
    if (effDateValue && this.createCargoModel.cargoReleaseForm.controls['expirationDate'].value) {
      this.createCargoModel.isNotValidDate =
        (effDateValue.getTime() > expDateTest.setHours(0, 0, 0, 0)) ||
        (effDateValue.getTime() > this.createCargoModel.expirationMaxDate.setHours(0, 0, 0, 0));
    }
  }
  emptyFormValue() {
    this.createCargoModel.cargoReleaseForm.reset();
  }
  onClickDelete() {
    this.createCargoModel.isDelete = true;
  }
  onDelete() {
    this.createCargoModel.isDelete = false;
    const deleteParam = {
      existingESDocIDs: this.utilsService.getESDocIDs([this.rowData[0]]),
      cargoReleaseTypeDTOList: this.utilsService.deletePayloadFramer([this.rowData[0]])
    };
    this.createCargoService.deleteGridData(deleteParam, this.createCargoModel.agreementId['customerAgreementID'])
      .pipe(takeWhile(() =>
        this.createCargoModel.isSubscribe)).subscribe((data: Array<DeleteAgreement>) => {
          this.deleteGridRecord.emit(true);
        }, (deleteError: Error) => {
          if (deleteError) {
            this.toastMessage(this.messageService, 'error', deleteError['error']['errors'][0]['errorMessage']);
          }
        });

  }
  onSearch(event: Event) {
    const value = [];
    if (event.target['value'] && !utils.isEmpty(this.createCargoModel.sectionsList)) {
      utils.forEach(this.createCargoModel.sectionsList, (section) => {
        if (section.customerSectionName.toLowerCase().indexOf(event.target['value'].toLowerCase()) !== -1) {
          value.push(section);
        }
      });
    }
    this.createCargoModel.filteredSectionsList = (!event.target['value']) ? utils.clone(this.createCargoModel.sectionsList) : value;
  }
  toastMessage(messageService: MessageService, key: string, data: string) {
    const message = {
      severity: key,
      summary: (key === 'error') ? 'Error' : 'Success',
      detail: data
    };
    messageService.clear();
    messageService.add(message);
  }
  validateCurrency(fieldVal: string, formName: string) {
    if (this.createCargoModel.cargoReleaseForm.controls && this.createCargoModel.cargoReleaseForm.controls[formName]) {
      this.createCargoModel.cargoReleaseForm.controls[formName].setValue(fieldVal.trim());
    }
    if (this.createCargoModel.cargoReleaseForm.controls[formName] && this.createCargoModel.cargoReleaseForm.controls[formName].valid) {
      this.formatCurrency(fieldVal, formName);
    }
  }
  formatCurrency(fieldVal: string, formName: string) {
    const currency = parseFloat(fieldVal.toString().replace(/[,]/g, '')).toFixed(2);
    const remainingValue = (currency.toString() && currency.toString().split('.').length > 1) ? currency.toString().split('.')[1] : '';
    const currencyVal: string = (currency.toString().split('.'))[0].replace(/[,]/g, '');
    if (currencyVal && currencyVal !== 'NaN') {
      if (currencyVal.length > 3) {
        this.currenyValueFormatter(currencyVal, formName, remainingValue);
      } else {
        this.createCargoModel.cargoReleaseForm.controls[formName].setValue(`${currencyVal}.${remainingValue}`);
      }
    } else {
      this.createCargoModel.cargoReleaseForm.controls[formName].setValue('');
    }
    this.changeDetector.detectChanges();
  }
  currenyValueFormatter(currencyVal: string, formName: string, remainingValue: string) {
    const currencyLength: number = currencyVal.length;
    let mergingString = '';
    for (let i = currencyLength - 1, j = 1; i >= 0; i--) {
      if (j < 4) {
        mergingString += currencyVal[i];
        j++;
      } else {
        mergingString += ',';
        mergingString += currencyVal[i];
        j = 2;
      }
    }
    mergingString = mergingString.split('').reverse().join('');
    this.createCargoModel.cargoReleaseForm.controls[formName].setValue(`${mergingString}.${remainingValue}`);
    this.changeDetector.detectChanges();
  }
}
