import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit,
   AfterViewChecked, Output, EventEmitter, Input} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as utils from 'lodash';
import { MessageService } from 'primeng/components/common/messageservice';
import { MenuItem } from 'primeng/api';
import { Router, RouterStateSnapshot  } from '@angular/router';
import { HttpResponseBase, HttpErrorResponse } from '@angular/common/http';
import { takeWhile } from 'rxjs/operators';
import * as moment from 'moment';
import { BroadcasterService } from '../../../shared/jbh-app-services/broadcaster.service';
import { LocalStorageService } from './../../../shared/jbh-app-services/local-storage.service';

import { AddContractsModel } from './model/add-contracts.model';
import { AddContractsService } from './service/add-contracts.service';
import { RootObject, RowEvent, SaveResponse } from './model/add-contracts.interface';
import { AddContractsUtility } from './service/add-contracts-utility';

@Component({
  selector: 'app-add-contracts',
  templateUrl: './add-contracts.component.html',
  styleUrls: ['./add-contracts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddContractsComponent implements OnInit, OnDestroy, AfterViewChecked {
  addContractsModel: AddContractsModel;
  @Input() isIndexChange: number;
  @Output() contractFormCheck: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private readonly shared: BroadcasterService, private readonly formBuilder: FormBuilder,
    private readonly service: AddContractsService, private readonly router: Router, private readonly changeDetector: ChangeDetectorRef,
    private readonly localStore: LocalStorageService, private readonly messageService: MessageService) {
    this.addContractsModel = new AddContractsModel();
  }
  ngOnInit() {
    this.createContractForm();
    this.checkStore();
    this.getContractTypeList();
    this.valueChangesSubscription();
    this.saveSubscription();
  }
  ngOnDestroy() {
    this.addContractsModel.isSubscribe = false;
  }
  ngAfterViewChecked() {
    if (this.addContractsModel.contractForm.dirty) {
      this.contractFormCheck.emit(true);
    } else {
      this.contractFormCheck.emit(false);
    }
  }
  saveSubscription() {
    this.shared.on<boolean>('needToSave').pipe(takeWhile(() => this.addContractsModel.isSubscribe)).subscribe((value: boolean) => {
      if (value) {
        this.onSave();
      } else {
        this.addContractsModel.nextStep = 'navigate';
        this.onDontSave();
      }
    });
  }
  valueChangesSubscription() {
    this.shared.on<RouterStateSnapshot>('navigationStarts').pipe(takeWhile(() => this.addContractsModel.isSubscribe))
    .subscribe((value: RouterStateSnapshot) => {
      this.addContractsModel.routeUrl = value.url;
      this.savedBroadcast();
      this.changeDetector.detectChanges();
    });
  }
  savedBroadcast() {
    const data = { key: true, message: 'You made changes to the agreement that were not saved' };
    if (this.addContractsModel.isSplitView && this.addContractsModel.contractForm.dirty && this.addContractsModel.contractForm.touched) {
      data.key = false;
    }
    this.shared.broadcast('saved', data);
  }
  checkStore() {
    if (!utils.isUndefined(this.localStore.getItem('createAgreement', 'detail'))) {
      this.addContractsModel.createAgreement = this.localStore.getItem('createAgreement', 'detail');
      AddContractsUtility.initialDate(this.addContractsModel);
      if (this.addContractsModel.createAgreement && this.addContractsModel.createAgreement['customerAgreementID']) {
        this.addContractsModel.isTableDataLoading = true;
        this.service.getContractList(this.addContractsModel.createAgreement['customerAgreementID']).pipe(takeWhile(() =>
        this.addContractsModel.isSubscribe)).subscribe((data: any) => {
          this.addContractsModel.isTableDataLoading = false;
          if (data && data['_embedded'] && data['_embedded']['customerAgreementContractVersions'] &&
          !utils.isEmpty(data['_embedded']['customerAgreementContractVersions'])) {
            utils.forEach(data['_embedded']['customerAgreementContractVersions'], (value: SaveResponse) => {
              value = AddContractsUtility.getContractList(value, this.addContractsModel);
              this.addContractsModel.contractsList.push(value);
              this.changeDetector.detectChanges();
            });
          } else {
            this.changeDetector.detectChanges();
          }
        }, (error: HttpErrorResponse) => {
          this.addContractsModel.isTableDataLoading = false;
          this.changeDetector.detectChanges();
        });
      }
    }
  }
  onTypeDate(event: string, fieldName: string) {
    switch (fieldName) {
      case 'effective':
        if (this.addContractsModel.contractForm.controls['effectiveDate'].value) {
          this.addContractsModel.inCorrectEffDateFormat = false;
          this.onSelectEffDate();
          this.addContractsModel.expirationMinDate = this.addContractsModel.contractForm.controls['effectiveDate'].value;
        }
        break;
      case 'expiration':
        if (this.addContractsModel.contractForm.controls['expirationDate'].value) {
          this.addContractsModel.inCorrectExpDateFormat = false;
          AddContractsUtility.onSelectExpDate(this.addContractsModel);
          this.addContractsModel.effectiveMaxDate = this.addContractsModel.contractForm.controls['expirationDate'].value;
        }
        break;
      default: break;
    }
    AddContractsUtility.validateDateFormat(event, fieldName, this.addContractsModel);
    AddContractsUtility.setFormErrors(this.addContractsModel);
  }
  onContractTypeSelected(event: MenuItem, key?: string) {
    const edit = (key === 'edit' || AddContractsUtility.checkTariff(this.addContractsModel, event));
    this.addContractsModel.isTransactional = false;
    this.addContractsModel.isContractTypeDisabled = false;
    this.addContractsModel.contractForm.controls.effectiveDate.setValue(null);
    this.addContractsModel.contractForm.controls.contractId.setValidators(Validators.required);
    this.contractTypeManipulation(event, edit);
    this.onDateSelected(new Date(this.addContractsModel.createAgreement.expirationDate.replace(/-/g, '\/').replace(/T.+/, '')), 1);
    this.addContractsModel.contractForm.controls.expirationDate.setValue(new Date(
      this.addContractsModel.createAgreement.expirationDate.replace(/-/g, '\/').replace(/T.+/, '')));
    this.addContractsModel.contractForm.controls.contractId.updateValueAndValidity();
    this.addContractsModel.effectiveMaxDate = this.addContractsModel.contractForm.controls['expirationDate'].value;
    this.addContractsModel.expirationMinDate = null;
  }
  getContractId() {
    this.addContractsModel.isContractTypeDisabled = true;
    if (utils.isEmpty(this.addContractsModel.tariffContractId)) {
      this.addContractsModel.pageLoading = true;
      this.service.getContractId().pipe(takeWhile(() => this.addContractsModel.isSubscribe)).subscribe((data: number) => {
        this.addContractsModel.tariffContractId = data.toString();
        this.addContractsModel.contractForm.controls.contractId.setValue(this.addContractsModel.tariffContractId);
        this.addContractsModel.contractForm.controls.contractId.setValidators(null);
        this.addContractsModel.pageLoading = false;
        this.changeDetector.detectChanges();
      }, (error: Error) => {
        this.addContractsModel.pageLoading = false;
        AddContractsUtility.toastMessage(this.messageService, 'error', error.message);
        this.changeDetector.detectChanges();
      });
    } else {
      this.addContractsModel.contractForm.controls.contractId.setValue(this.addContractsModel.tariffContractId);
      this.addContractsModel.contractForm.controls.contractId.setValidators(null);
    }
  }
  onRowSelect(value: RowEvent) {
    this.addContractsModel.nextStep = '';
    AddContractsUtility.hideDateErrors(this.addContractsModel);
    this.addContractsModel.isCheckboxClick = value.originalEvent ?
    value.originalEvent.target['classList'].contains('checkbox-column') : value.type === 'checkbox';
    if (!this.addContractsModel.isCheckboxClick && this.addContractsModel.contractForm.pristine) {
      this.addContractsModel.selectedContractsList = [];
      this.addContractsModel.selectedRowContract = [value.data];
      this.addContractsModel.isSaved = false;
      this.patchContractDetail(value.data);
    } else if (!this.addContractsModel.isCheckboxClick && !this.addContractsModel.contractForm.pristine) {
      this.addContractsModel.selectedContractsList = this.addContractsModel.selectedRowContract;
      this.addContractsModel.isSaved = false;
      this.addContractsModel.isSaveChanges = true;
    }
    this.addContractsModel.isSplitView = !this.addContractsModel.isCheckboxClick;
    this.changeDetector.detectChanges();
    this.changeDetector.markForCheck();
  }
  focusOnlyCheckbox(event) {
    event.stopPropagation();
  }
  patchContractDetail(formValues: SaveResponse) {
    const contractValue = { label: formValues.customerAgreementContractTypeName, value: formValues.customerAgreementContractTypeID };
    this.onContractTypeSelected(contractValue, 'edit');
    this.onDateSelected(new Date(formValues.effectiveDate), 0);
    this.onDateSelected(new Date(formValues.expirationDate), 1);
    AddContractsUtility.getPatchValues(this. addContractsModel, contractValue, formValues);
  }
  onSelectEffDate() {
    AddContractsUtility.getValidDate(this.addContractsModel);
  }
  onAddContract() {
    this.createContractForm();
    AddContractsUtility.initialDate(this.addContractsModel);
    AddContractsUtility.resetVariables(this.addContractsModel);
  }
  getContractTypeList() {
    this.addContractsModel.pageLoading = true;
    this.service.getContractType().subscribe((data: RootObject) => {
      this.addContractsModel.pageLoading = false;
      if (!utils.isEmpty(data) && !utils.isEmpty(data['_embedded']) && !utils.isEmpty(data['_embedded'].contractTypes)) {
        this.addContractsModel.pageLoading = false;
        this.addContractsModel.contractTypeList = utils.cloneDeep(AddContractsUtility.getContractType(data['_embedded'].contractTypes));
      }
      this.changeDetector.detectChanges();
    }, (error: HttpErrorResponse) => {
      this.addContractsModel.pageLoading = false;
      this.addContractsModel.contractTypeList = [];
      if (error.status && error.status >= 500) {
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: 'Error', detail: 'Pricing Configuration System is currently unavailable.  Contact help desk'
        });
      }
      this.changeDetector.detectChanges();
    });
  }
  createContractForm() {
    AddContractsUtility.hideDateErrors(this.addContractsModel);
    AddContractsUtility.getFormControls(this.formBuilder, this.addContractsModel);
  }
  onClose() {
    this.addContractsModel.nextStep = '';
    if (this.addContractsModel.contractForm.dirty && this.addContractsModel.contractForm.touched) {
      this.addContractsModel.isSaveChanges = true;
    } else {
      this.onDontSave();
    }
  }
  onDontSave() {
    this.addContractsModel.isSaveChanges = false;
    this.contractFormCheck.emit(false);
    AddContractsUtility.viewReset(this.addContractsModel);
    this.navigationCheck();
  }
  navigationCheck() {
    if (!utils.isEmpty(this.addContractsModel.nextStep)) {
      switch (this.addContractsModel.nextStep) {
        case 'next':
          if (utils.isEmpty(this.addContractsModel.contractsList)) {
            AddContractsUtility.toastMessage(this.messageService, 'error',
            'You need to have atleast one Contract before moving to next step');
          } else {
            this.shared.broadcast('stepIndexChange', this.addContractsModel.nextStep);
          }
          break;
        case 'back':
          this.shared.broadcast('stepIndexChange', this.addContractsModel.nextStep);
          break;
        case 'navigate':
        if (!utils.isNaN(this.isIndexChange)) {
          this.shared.broadcast('stepIndexChange', this.addContractsModel.nextStep);
        } else {
          this.router.navigate([this.addContractsModel.routeUrl]);
        }
          break;
        default: break;
      }
    }
  }
  onDelete() {
    this.addContractsModel.isDelete = false;
    const contractid = AddContractsUtility.splitScreenCheck(this.addContractsModel);
    this.addContractsModel.pageLoading = true;
    this.service.deleteContract(this.addContractsModel.createAgreement.customerAgreementID, contractid)
    .pipe(takeWhile(() => this.addContractsModel.isSubscribe))
    .subscribe((value: HttpResponseBase) => {
      this.addContractsModel.pageLoading = false;
     AddContractsUtility.onSuccessDeleteContract(value, this.messageService, this.addContractsModel);
     this.changeDetector.detectChanges();
    }, (error: HttpErrorResponse) => {
      AddContractsUtility.handleError(error, this.addContractsModel, this.messageService, this.changeDetector);
    });
  }
  onPrevious() {
    if (!this.addContractsModel.isSplitView) {
      this.shared.broadcast('stepIndexChange', 'back');
    } else {
      if (this.addContractsModel.contractForm.dirty) {
        this.addContractsModel.nextStep = 'back';
        this.addContractsModel.isSaveChanges = true;
      } else {
        this.shared.broadcast('stepIndexChange', 'back');
      }
    }
  }
  onDateSelected(value: Date, key: number) {
    if (key === 0) {
      this.addContractsModel.expirationMinDate = new Date(value);
    } else {
      this.addContractsModel.effectiveMaxDate = new Date(value);
    }
    if (this.addContractsModel.contractForm.controls.effectiveDate.value &&
      this.addContractsModel.contractForm.controls.expirationDate.value) {
      const fieldName = (key === 0) ? 'effective' : 'expiration';
      this.onTypeDate(moment(value).format('MM/DD/YYYY'), fieldName);
    }
  }
  onSaveExit() {
    if (!this.addContractsModel.isSplitView) {
      this.router.navigate([this.addContractsModel.searchUrl]);
    } else {
      if (this.addContractsModel.contractForm.dirty) {
        this.onSave('search');
      } else {
        this.router.navigate([this.addContractsModel.searchUrl]);
      }
    }
  }
  editSave(formValues: SaveResponse, screen?: string) {
    const index = utils.findIndex(this.addContractsModel.contractsList, this.addContractsModel.selectedRowContract[0]);
    const contractId = this.addContractsModel.selectedRowContract[0].customerAgreementContractID;
    formValues.customerAgreementContractID = contractId;
    formValues.customerAgreementContractVersionID = this.addContractsModel.selectedRowContract[0].customerAgreementContractVersionID;
    this.addContractsModel.pageLoading = true;
    this.service.contractEditSave(this.addContractsModel.createAgreement.customerAgreementID, contractId, formValues)
    .pipe(takeWhile(() => this.addContractsModel.isSubscribe)).subscribe((data: SaveResponse) => {
      if (!utils.isEmpty(data)) {
        this.addContractsModel.pageLoading = false;
        this.addContractsModel.isSaveChanges = false;
        this.addContractsModel.selectedContractsList = [];
        AddContractsUtility.toastMessage(this.messageService, 'success', 'Contract Edited successfully');
        AddContractsUtility.viewReset(this.addContractsModel);
        this.addContractsModel.tariffContractId = (data.customerContractNumber === this.addContractsModel.tariffContractId) ? '' :
        this.addContractsModel.tariffContractId;
        data = AddContractsUtility.getContractList(data, this.addContractsModel);
        this.addContractsModel.contractsList[index] = data;
        this.changeDetector.detectChanges();
        this.screenNavigation(screen);
      }
    }, (error: HttpErrorResponse) => {
      AddContractsUtility.handleError(error, this.addContractsModel, this.messageService, this.changeDetector);
    });
  }
  onSave(screen?: string) {
    if (this.addContractsModel.contractForm.valid && this.addContractsModel.contractForm.dirty) {
      const idMatchIndex = AddContractsUtility.matchedIndex(this.addContractsModel, 'customerContractNumber', 'contractId');
      const descriptionMatchIndex = AddContractsUtility.matchedIndex(this.addContractsModel, 'customerContractName', 'description');
      const formValues = AddContractsUtility.saveRequest(this.addContractsModel);
      this.checkEditSave(formValues, idMatchIndex, descriptionMatchIndex, screen);
    } else if (!this.addContractsModel.contractForm.valid && this.addContractsModel.isSplitView) {
      AddContractsUtility.formFieldsTouched(this.addContractsModel, this.messageService);
    } else if (this.addContractsModel.contractForm.pristine && this.addContractsModel.isSplitView) {
      AddContractsUtility.warningMessage(this.messageService);
    }
  }
  onNextStep() {
    if (!utils.isEmpty(this.addContractsModel.contractsList) ||
    (this.addContractsModel.isSplitView && this.addContractsModel.contractForm.touched)) {
      this.nextCheck();
    } else {
      AddContractsUtility.toastMessage(this.messageService, 'error', 'You need to have atleast one Contract before moving to next step');
    }
  }
  checkEditSave(formValues: SaveResponse, idMatchIndex: number, descriptionMatchIndex: number, screen?: string) {
    if (!utils.isEmpty(this.addContractsModel.selectedRowContract)) {
      this.editSave(formValues, screen);
    } else {
      this.duplicateCheck(idMatchIndex, descriptionMatchIndex, formValues, screen);
    }
  }
  duplicateCheck(idMatchIndex: number, descriptionMatchIndex: number, formValues: SaveResponse, screen?: string) {
    this.addContractsModel.isSaveChanges = false;
    if (idMatchIndex > -1 || descriptionMatchIndex > -1) {
      AddContractsUtility.duplicateCheckError(idMatchIndex, descriptionMatchIndex, this.messageService);
    } else {
      this.addContractsModel.pageLoading = true;
      this.service.contractSave(formValues, this.addContractsModel.createAgreement.customerAgreementID)
      .pipe(takeWhile(() => this.addContractsModel.isSubscribe)).subscribe((data: SaveResponse) => {
        if (!utils.isEmpty(data)) {
          this.addContractsModel.pageLoading = false;
          this.addContractsModel.selectedContractsList = [];
          AddContractsUtility.toastMessage(this.messageService, 'success', 'Contract Added successfully');
          AddContractsUtility.viewReset(this.addContractsModel);
          this.addContractsModel.tariffContractId = (data.customerContractNumber === this.addContractsModel.tariffContractId) ? '' :
          this.addContractsModel.tariffContractId;
          data = AddContractsUtility.getContractList(data, this.addContractsModel);
          this.addContractsModel.contractsList.push(data);
          this.screenNavigation(screen);
          this.changeDetector.detectChanges();
        }
      }, (error: HttpErrorResponse) => {
        AddContractsUtility.handleError(error, this.addContractsModel, this.messageService, this.changeDetector);
      });
    }
  }
  screenNavigation(screen: string) {
    if (screen) {
      this.router.navigate([this.addContractsModel.searchUrl]);
    }
  }
  contractTypeManipulation(event: MenuItem, edit: boolean) {
    switch (true) {
      case (event.label.toLowerCase() === 'transactional'):
        AddContractsUtility.transactionalType(this.addContractsModel);
        break;
      case (event.label.toLowerCase() === 'tariff' && !edit) :
        this.getContractId();
        break;
      case (event.label.toLowerCase() === 'legal') :
        this.addContractsModel.contractForm.controls.contractId.setValue(null);
        break;
      case (event.label.toLowerCase() === 'tariff' && edit) :
        this.addContractsModel.isContractTypeDisabled = true;
        this.addContractsModel.contractForm.controls.contractId.setValue(this
        .addContractsModel.selectedRowContract[0].customerContractNumber);
        this.addContractsModel.contractForm.controls.contractId.setValidators(null);
        break;
      default: break;
    }
  }
  nextCheck() {
    if (this.addContractsModel.isSplitView && this.addContractsModel.contractForm.dirty) {
      this.addContractsModel.nextStep = 'next';
      this.addContractsModel.isSaveChanges = true;
    } else {
      this.shared.broadcast('stepIndexChange', 'next');
    }
  }
  headerCheckboxToggle() {
    if (this.addContractsModel.isSplitView) {
      this.onClose();
    }
  }
}
