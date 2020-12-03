import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';
import * as utils from 'lodash';
import { takeWhile } from 'rxjs/operators';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';

import { ContractItemModel } from './models/contract-item.model';
import { ListItem, CanComponentDeactivate } from './models/contract-item.interface';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';
import { LocalStorageService } from '../../../../shared/jbh-app-services/local-storage.service';
import { ContractItemService } from './services/contract-item.service';
import { ContractItemUtility } from './services/contract-item.utility';

@Component({
  selector: 'app-contract-item',
  templateUrl: './contract-item.component.html',
  styleUrls: ['./contract-item.component.scss']
})
export class ContractItemComponent implements OnInit {
  @Input() dataFlag;
  @ViewChild('effectiveCal') effectiveCal;
  @ViewChild('expirationCal') expirationCal;
  @Output() closeClickEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() closeClickOnCreate: EventEmitter<string> = new EventEmitter<string>();
  @Input() agreementID: number;
  contractItemModel: ContractItemModel;

  constructor(private readonly formBuilder: FormBuilder, private readonly contractItemService: ContractItemService,
    public readonly changeDetector: ChangeDetectorRef,
    private readonly messageService: MessageService, private readonly router: Router, private readonly shared: BroadcasterService,
    private readonly store: LocalStorageService) {
    this.contractItemModel = new ContractItemModel();
  }

  ngOnInit() {
    this.initializeForm();
    this.getAgreementData();
    this.getContractTypeList();
    this.navigationSubscription();
    this.saveSubscription();
    this.valueChangesSubscription();
  }
  initializeForm() {
    this.contractItemModel.contractForm = this.formBuilder.group({
      contractType: ['', Validators.required],
      contractId: ['', Validators.required],
      description: ['', Validators.required],
      effectiveDate: ['', Validators.required],
      expirationDate: ['', Validators.required],
      notes: ['']
    });
  }
  navigationSubscription() {
    this.shared.on<boolean>('navigationStarts').pipe(takeWhile(() => this.contractItemModel.subscriberFlag))
      .subscribe((value: boolean) => {
        this.shared.broadcast('saved', this.contractItemModel.contractForm.touched &&
          this.contractItemModel.contractForm.dirty);
        this.changeDetector.detectChanges();
      });
  }
  saveSubscription() {
    this.shared.on<boolean>('loseChanges').subscribe((value: boolean) => {
      this.contractItemModel.contractForm.markAsPristine();
      this.contractItemModel.contractForm.markAsUntouched();
      this.changeDetector.detectChanges();
    });
  }
  valueChangesSubscription() {
    this.contractItemModel.contractForm.valueChanges.subscribe(val => {
      const valuesChanged = this.contractItemModel.contractForm.dirty &&
        this.contractItemModel.contractForm.touched;
      this.store.setItem('createContract', 'valueChanges', valuesChanged, true);
    });
  }
  onClickPopupNo() {
    this.contractItemModel.isShowPopup = false;
    this.contractItemModel.routerUrl = '/viewagreement';
  }
  onClickPopupYes() {
    if (this.contractItemModel.isCancelClicked) {
      this.onDontSave();
    } else {
      this.clickPopUpOnRoute();
    }
  }
  clickPopUpOnRoute() {
    utils.forIn(this.contractItemModel.contractForm.controls, (value, name: string) => {
      this.contractItemModel.contractForm.controls[name].markAsPristine();
    });
    if (this.contractItemModel.routerUrl === '/viewagreement') {
      this.router.navigate([this.contractItemModel.routerUrl], {
        queryParams:
          { id: this.agreementID }
      });
    } else {
      this.router.navigateByUrl(this.contractItemModel.routerUrl);
    }
  }
  getAgreementData() {
    this.contractItemService.getAgreementDetails(this.agreementID)
      .pipe(takeWhile(() => this.contractItemModel.subscriberFlag)).subscribe((data) => {
        this.contractItemModel.pageLoading = false;
        if (!utils.isEmpty(data)) {
          this.contractItemModel.agreementDetails = data;
          ContractItemUtility.initialDate(this.contractItemModel);
        }
        this.changeDetector.detectChanges();
      }, (error: Error) => {
        this.contractItemModel.pageLoading = false;
        this.contractItemModel.agreementDetails = null;
        this.changeDetector.detectChanges();
      });
  }
  onContractTypeSelected(event: ListItem) {
    this.contractItemModel.isTransactional = false;
    this.contractItemModel.isContractTypeDisabled = false;
    this.contractItemModel.tariffContractId = '';
    this.contractTypeManipulation(event);
    utils.forEach(this.contractItemModel.changeControls, (control) => {
      this.contractItemModel.contractForm.controls[control].reset();
      this.contractItemModel.contractForm.controls[control].updateValueAndValidity();
    });
  }
  onSave() {
    this.checkDateFields();
    if (this.contractItemModel.contractForm.valid && this.contractItemModel.contractForm.dirty) {
      const formValues = ContractItemUtility.saveRequest(this.contractItemModel, this.agreementID);
      this.saveContract(formValues);
    } else if (!this.contractItemModel.contractForm.valid) {
      ContractItemUtility.formFieldsTouched(this.contractItemModel, this.messageService);
      this.contractItemModel.isShowPopup = false;
    } else if (this.contractItemModel.contractForm.pristine) {
      ContractItemUtility.warningMessage(this.messageService);
    }
  }
  checkDateFields() {
    if (!this.contractItemModel.contractForm.controls.effectiveDate.value) {
      this.contractItemModel.contractForm.controls.effectiveDate.setValidators([Validators.required]);
      this.contractItemModel.contractForm.controls.effectiveDate.updateValueAndValidity();
    }
    if (!this.contractItemModel.contractForm.controls.expirationDate.value) {
      this.contractItemModel.contractForm.controls.expirationDate.setValidators([Validators.required]);
      this.contractItemModel.contractForm.controls.expirationDate.updateValueAndValidity();
    }
  }
  setCalendarDate(field) {
    switch (field) {
      case 'effective':
        if (this.contractItemModel.effDate) {
          this.effectiveCal.currentMonth = this.contractItemModel.effDate.getMonth();
          this.effectiveCal.currentYear = this.contractItemModel.effDate.getFullYear();
        }
        break;
      case 'expiration':
        if (this.contractItemModel.expDate) {
          this.expirationCal.currentMonth = this.contractItemModel.expDate.getMonth();
          this.expirationCal.currentYear = this.contractItemModel.expDate.getFullYear();
        }
        break;
    }
  }
  onTypeDate(event: string, fieldName: string) {
    if (event !== '') {
      const fieldObj = {
        formFieldName: (fieldName === 'effective') ? 'effectiveDate' : 'expirationDate',
        key: (fieldName === 'effective') ? 0 : 1
      };
      this.onDateSelected(this.contractItemModel.contractForm.controls[fieldObj['formFieldName']].value, fieldObj['key']);
      this.dateValidation('contractForm', 'effectiveDate', 'expirationDate');
      ContractItemUtility.validateDateFormat(event, fieldName, this.contractItemModel);
      this.setCalendarDate(fieldName);
      this.changeDetector.detectChanges();
    }
  }
  onSelectEffDate() {
    ContractItemUtility.getValidDate(this.contractItemModel);
  }
  onDateSelected(value: Date, key: number) {
    if (key === 0) {
      this.contractItemModel.expirationMinDate = new Date(value);
    } else {
      this.contractItemModel.effectiveMaxDate = new Date(value);
    }
    this.dateValidation('contractForm', 'effectiveDate', 'expirationDate');
  }
  dateValidation(formName: string, effectiveDate: string, expirationDate: string) {
    const effDate = this.contractItemModel[formName].controls[effectiveDate].value;
    const expDate = this.contractItemModel[formName].controls[expirationDate].value;
    if (effDate && !expDate) {
      this.contractItemModel[formName].controls[expirationDate].setErrors(Validators.required);
      this.contractItemModel[formName].controls[expirationDate].updateValueAndValidity();
      this.contractItemModel[formName].controls[effectiveDate].updateValueAndValidity();
    } else if (!effDate && expDate) {
      this.contractItemModel[formName].controls[effectiveDate].setErrors(Validators.required);
      this.contractItemModel[formName].controls[expirationDate].updateValueAndValidity();
      this.contractItemModel[formName].controls[effectiveDate].updateValueAndValidity();
    } else if (!effDate && !expDate) {
      this.contractItemModel[formName].controls[effectiveDate].setErrors(Validators.required);
      this.contractItemModel[formName].controls[expirationDate].setErrors(Validators.required);
      this.contractItemModel[formName].controls[expirationDate].updateValueAndValidity();
      this.contractItemModel[formName].controls[effectiveDate].updateValueAndValidity();
    } else if (effDate && expDate) {
      ContractItemUtility.onSelectExpDate(this.contractItemModel);
    }
    this.defaultDateRangeValidation(formName, effectiveDate, expirationDate);
  }
  defaultDateRangeValidation(formName: string, effectiveDate: string, expirationDate: string) {
    const dateFormat = 'MM/DD/YYYY';
    const effectiveDateDefault = moment(this.contractItemModel.defaultStartDate, dateFormat);
    const expirationDateDefault = moment(this.contractItemModel.defaultEndDate, dateFormat);
    const effectiveDateEntered = moment(this.contractItemModel.contractForm.controls.effectiveDate.value, dateFormat);
    if (!effectiveDateEntered.isBetween(effectiveDateDefault, expirationDateDefault, 'days', '[]')) {
      this.contractItemModel[formName].controls[effectiveDate].setErrors({ invalid: true });
    }
    const expirationDateEntered = moment(this.contractItemModel.contractForm.controls.expirationDate.value, dateFormat);
    if (!expirationDateEntered.isBetween(effectiveDateDefault, expirationDateDefault, 'days', '[]')) {
      this.contractItemModel[formName].controls[expirationDate].setErrors({ invalid: true });
    }
  }
  getContractTypeList() {
    this.contractItemModel.pageLoading = true;
    this.contractItemService.getContractType().subscribe((data) => {
      this.contractItemModel.pageLoading = false;
      if (!utils.isEmpty(data) && !utils.isEmpty(data['_embedded']) && !utils.isEmpty(data['_embedded'].contractTypes)) {
        this.contractItemModel.pageLoading = false;
        this.contractItemModel.contractTypeList = utils.cloneDeep(ContractItemUtility.getContractType(data['_embedded'].contractTypes));
      }
      this.changeDetector.detectChanges();
    }, (error: Error) => {
      this.contractItemModel.pageLoading = false;
      this.contractItemModel.contractTypeList = [];
      this.changeDetector.detectChanges();
    });
  }
  saveContract(formValues) {
    this.contractItemModel.pageLoading = true;
    this.contractItemService.saveContracts(formValues, this.agreementID)
      .pipe(takeWhile(() => this.contractItemModel.subscriberFlag)).subscribe((data) => {
        if (!utils.isEmpty(data)) {
          this.saveContractOnSuccess(data);
        }
      }, (error) => {
        ContractItemUtility.handleError(error, this.contractItemModel, this.messageService, this.changeDetector);
      });
  }
  saveContractOnSuccess(data) {
    this.contractItemModel.pageLoading = false;
    let successMsg;
    if (data.customerAgreementContractTypeName === 'Transactional') {
      successMsg = `Contract (${data.customerAgreementContractTypeName}) ${
        data.customerContractName} has been created successfully.`;
    } else {
      successMsg = `Contract ${data.customerContractNumber} (${
        data.customerContractName}) has been created successfully.`;
    }
    ContractItemUtility.toastMessage(this.messageService, 'success', successMsg);
    this.closeContractOnCreate();
    this.changeDetector.detectChanges();
  }
  contractTypeManipulation(event: ListItem) {
    switch (true) {
      case (event.label.toLowerCase() === 'transactional'):
        this.contractItemModel.isTransactional = true;
        this.contractItemModel.contractForm.controls.contractId.setValue(null);
        this.contractItemModel.contractForm.controls.contractId.setValidators(null);
        break;
      case (event.label.toLowerCase() === 'tariff'):
        this.contractItemModel.isTransactional = false;
        this.getContractId();
        break;
      case (event.label.toLowerCase() === 'legal'):
        this.contractItemModel.isTransactional = false;
        this.contractItemModel.contractForm.controls.contractId.setValue(null);
        this.contractItemModel.contractForm.controls.contractId.setValidators([Validators.required]);
        break;
      default: break;
    }
  }
  getContractId() {
    this.contractItemModel.isContractTypeDisabled = true;
    if (utils.isEmpty(this.contractItemModel.tariffContractId)) {
      this.contractItemModel.pageLoading = true;
      this.contractItemService.getContractId().pipe(takeWhile(() => this.contractItemModel.subscriberFlag)).subscribe((data: number) => {
        this.contractItemModel.tariffContractId = data.toString();
        this.contractItemModel.contractForm.controls.contractId.setValue(this.contractItemModel.tariffContractId);
        this.contractItemModel.contractForm.controls.contractId.setValidators(null);
        this.contractItemModel.pageLoading = false;
        this.changeDetector.detectChanges();
      }, (error: Error) => {
        this.contractItemModel.pageLoading = false;
        ContractItemUtility.toastMessage(this.messageService, 'error', error.message);
        this.changeDetector.detectChanges();
      });
    } else {
      this.contractItemModel.contractForm.controls.contractId.setValue(this.contractItemModel.tariffContractId);
      this.contractItemModel.contractForm.controls.contractId.setValidators(null);
    }
  }
  onClose() {
    if (this.contractItemModel.contractForm.dirty && this.contractItemModel.contractForm.touched) {
      this.contractItemModel.isShowPopup = true;
      this.contractItemModel.isCancelClicked = true;
    } else {
      this.onDontSave();
    }
  }
  onDontSave() {
    this.store.clearItem('createContract', 'valueChanges', true);
    this.contractItemModel.isShowPopup = false;
    this.closeContract();
  }
  closeContract() {
    this.contractItemModel.contractForm.reset();
    this.closeClickEvent.emit('close');
  }
  closeContractOnCreate() {
    this.contractItemModel.contractForm.reset();
    this.store.clearItem('createContract', 'valueChanges', true);
    this.closeClickOnCreate.emit('close');
  }
}
