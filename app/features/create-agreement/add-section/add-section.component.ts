import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, AfterViewChecked,
  EventEmitter, Output, Input, ViewChild
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as utils from 'lodash';
import { Router, RouterStateSnapshot } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { LocalStorageService } from '../../../shared/jbh-app-services/local-storage.service';
import { BroadcasterService } from '../../../shared/jbh-app-services/broadcaster.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { Table } from 'primeng/table';
import * as moment from 'moment';
import { AddSectionModel } from './model/add-section.model';
import { AddSectionService } from './service/add-section.service';
import {
  CodesResponse, CustomerAgreementContractsItem,
  SaveResponse, RootObject, RowEvent, ESObject, HitsItem, SaveRequest
} from './model/add-section.interface';
import { AddSectionUtility } from './service/add-section-utility';
import { AddSectionQuery } from './query/add-section.query';
@Component({
  selector: 'app-add-section',
  templateUrl: './add-section.component.html',
  styleUrls: ['./add-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddSectionComponent implements OnInit, OnDestroy, AfterViewChecked {
  addSectionModel: AddSectionModel;
  @Input() isIndexChange: number;
  @Output() sectionFormCheck: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('codestable') codestable: Table;
  constructor(
    private readonly service: AddSectionService, private readonly localStore: LocalStorageService,
    private readonly shared: BroadcasterService, private readonly formBuilder: FormBuilder, private readonly messageService: MessageService,
    private readonly router: Router, private readonly changeDetector: ChangeDetectorRef) {
    this.addSectionModel = new AddSectionModel();
  }
  ngOnInit() {
    this.createSectionForm();
    this.checkStore();
    this.getSectionTypeList();
    this.getCurrencyList();
    this.valueChangesSubscription();
    this.saveSubscription();
    this.getDatesForRole();
  }
  ngOnDestroy() {
    this.addSectionModel.isSubscribe = false;
  }
  ngAfterViewChecked() {
    if (this.addSectionModel.sectionForm.dirty) {
      this.sectionFormCheck.emit(true);
    } else {
      this.sectionFormCheck.emit(false);
    }
  }
  saveSubscription() {
    this.shared.on<boolean>('needToSave').pipe(takeWhile(() => this.addSectionModel.isSubscribe)).subscribe((value: boolean) => {
      this.changeDetector.detectChanges();
      if (value) {
        this.onSave();
      } else {
        this.addSectionModel.changeText = 'navigate';
        this.onDontSave();
      }
    });
  }
  onDontSave() {
    this.addSectionModel.isSaveChanges = false;
    this.addSectionModel.effError = false;
    this.addSectionModel.expError = false;
    this.sectionFormCheck.emit(false);
    AddSectionUtility.viewReset(this.addSectionModel);
    this.navigationCheck();
  }
  navigationCheck() {
    switch (this.addSectionModel.changeText) {
      case 'next':
        if (utils.isEmpty(this.addSectionModel.sectionsList)) {
          AddSectionUtility.toastMessage(this.messageService, 'error', 'Error',
            'You need to have atleast one Section before moving to next step');
        } else {
          this.shared.broadcast('stepIndexChange', this.addSectionModel.changeText);
        }
        break;
      case 'back':
        this.shared.broadcast('stepIndexChange', this.addSectionModel.changeText);
        break;
      case 'navigate':
        if (!utils.isNaN(this.isIndexChange)) {
          this.shared.broadcast('stepIndexChange', this.addSectionModel.changeText);
        } else {
          this.router.navigate([this.addSectionModel.routeUrl]);
        }
        break;
      default: break;
    }
  }
  valueChangesSubscription() {
    this.shared.on<RouterStateSnapshot>('navigationStarts').pipe(takeWhile(() => this.addSectionModel.isSubscribe))
      .subscribe((value: RouterStateSnapshot) => {
        this.addSectionModel.routeUrl = value.url;
        AddSectionUtility.savedBroadcast(this.addSectionModel, this.shared);
        this.changeDetector.detectChanges();
      });
  }
  getContractList() {
    this.addSectionModel.contractIdList = [];
    this.addSectionModel.pageLoading = true;
    this.service.getContract(this.addSectionModel.createAgreement.customerAgreementID).pipe(takeWhile(() =>
      this.addSectionModel.isSubscribe)).subscribe((data: CustomerAgreementContractsItem[]) => {
        this.addSectionModel.pageLoading = false;
        if (data) {
          this.addSectionModel.contractIdList = AddSectionUtility.getContractList(data, this.addSectionModel);
        }
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.addSectionModel.pageLoading = false;
        this.changeDetector.detectChanges();
      });
  }
  checkStore() {
    if (!utils.isUndefined(this.localStore.getItem('createAgreement', 'detail'))) {
      this.addSectionModel.createAgreement = this.localStore.getItem('createAgreement', 'detail');
      this.getContractList();
      this.getSectionTableList();
    }
  }
  getSectionTableList() {
    this.addSectionModel.isTableDataLoading = true;
    this.addSectionModel.sectionsList = [];
    const query = AddSectionQuery.getTableQuery(this.addSectionModel.createAgreement.customerAgreementID);
    this.service.getSectionList(query).pipe(takeWhile(() =>
      this.addSectionModel.isSubscribe)).subscribe((data: ESObject) => {
        if (!utils.isEmpty(data) && !utils.isEmpty(data.hits) && !utils.isEmpty(data.hits.hits)) {
          this.addSectionModel.sectionTableData = data.hits.hits;
          utils.forEach(this.addSectionModel.sectionTableData, (rowDetail: HitsItem) => {
            this.addSectionModel.sectionsList.push(AddSectionUtility.fetchTableformat(rowDetail));
          });
        }
        this.addSectionModel.isTableDataLoading = false;
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.addSectionModel.isTableDataLoading = false;
        AddSectionUtility.toastMessage(this.messageService, 'error', 'Error', 'ES data is currently unavailable. Contact help desk');
        this.changeDetector.detectChanges();
      });
  }
  onContractIdChanged(value: string, isEditDatePatch: boolean) {
    const contractDetails = utils.filter(this.addSectionModel.contractIdList, ['customerContractName', value]);
    if (!utils.isEmpty(contractDetails)) {
      const effDate = new Date(contractDetails[0].effectiveDate.replace(/-/g, '\/').replace(/T.+/, ''));
      const expDate = new Date(contractDetails[0].expirationDate.replace(/-/g, '\/').replace(/T.+/, ''));
      this.addSectionModel.selectedContractId = contractDetails[0].customerAgreementContractID;
      this.addSectionModel.effectiveMinDate = (isEditDatePatch) ? effDate :
        AddSectionUtility.getDatesValue(this.addSectionModel, effDate, 'min');
      this.addSectionModel.expirationMaxDate = expDate;
      if (isEditDatePatch) {
        this.addSectionModel.sectionForm.patchValue({ effectiveDate: effDate, expirationDate: expDate });
        this.onDateSelected(effDate, 0);
        this.onDateSelected(expDate, 1);
      }
    }
  }
  createSectionForm() {
    this.addSectionModel.sectionForm = this.formBuilder.group({
      sectionName: ['', Validators.required],
      sectionType: ['', Validators.required],
      currency: ['', Validators.required],
      contractId: ['', Validators.required],
      effectiveDate: ['', Validators.required],
      expirationDate: ['', Validators.required]
    });
    AddSectionUtility.dateVariablesReset(this.addSectionModel);
  }
  getSectionTypeList() {
    this.addSectionModel.sectionTypeList = [];
    this.addSectionModel.pageLoading = true;
    this.service.getSectionType().pipe(takeWhile(() => this.addSectionModel.isSubscribe)).subscribe((data: RootObject) => {
      this.addSectionModel.pageLoading = false;
      if (!utils.isEmpty(data) && !utils.isEmpty(data._embedded) && !utils.isEmpty(data._embedded.sectionTypes)) {
        this.addSectionModel.sectionTypeList = AddSectionUtility.getSectionType(data._embedded.sectionTypes);
      }
      this.changeDetector.detectChanges();
    }, (error: HttpErrorResponse) => {
      this.addSectionModel.pageLoading = false;
      if (error.status && error.status >= 500) {
        this.messageService.clear();
        this.messageService.add({
          severity: 'error', summary: 'Error',
          detail: 'Pricing Configuration System is currently unavailable.  Contact help desk'
        });
      }
      this.changeDetector.detectChanges();
    });
  }
  getCurrencyList() {
    this.addSectionModel.currencyList = [];
    this.addSectionModel.pageLoading = true;
    this.service.getCurrency().pipe(takeWhile(() => this.addSectionModel.isSubscribe)).subscribe((data: string[]) => {
      this.addSectionModel.pageLoading = false;
      if (!utils.isEmpty(data)) {
        this.addSectionModel.currencyList = AddSectionUtility.getCurrencyList(data);
      }
      this.changeDetector.detectChanges();
    }, (error: HttpErrorResponse) => {
      this.addSectionModel.pageLoading = false;
      this.changeDetector.detectChanges();
    });
  }
  getBillToCodes() {
    this.addSectionModel.filteredCodesList = [];
    this.addSectionModel.selectedCodesList = [];
    if (this.addSectionModel.sectionForm.controls['effectiveDate'].valid && this.addSectionModel.sectionForm
      .controls['expirationDate'].valid && this.addSectionModel.selectedContractId &&
      this.addSectionModel.sectionForm.controls['effectiveDate'].value && this.addSectionModel.sectionForm
        .controls['expirationDate'].value) {
      this.addSectionModel.isBillToLoading = true;
      const param = AddSectionUtility.getCodesParam(this.addSectionModel);
      this.service.getCodes(param).pipe(takeWhile(() => this.addSectionModel.isSubscribe)).subscribe((data: CodesResponse[]) => {
        AddSectionUtility.billToCodesList(this.addSectionModel, data);
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.billToError(error);
      });
    }
  }
  getEditBillToCodes() {
    this.addSectionModel.filteredCodesList = [];
    this.addSectionModel.codesList = [];
    if (this.addSectionModel.sectionForm.controls['effectiveDate'].valid && this.addSectionModel.sectionForm
      .controls['expirationDate'].valid && this.addSectionModel.selectedContractId &&
      this.addSectionModel.sectionForm.controls['effectiveDate'].value && this.addSectionModel.sectionForm
        .controls['expirationDate'].value) {
      this.addSectionModel.isBillToLoading = true;
      const param = AddSectionUtility.getCodesParam(this.addSectionModel);
      param['sectionId'] = this.addSectionModel.selectedEditSection[0].sectionId;
      this.service.getEditCodes(param).pipe(takeWhile(() => this.addSectionModel.isSubscribe)).subscribe((data: CodesResponse[]) => {
        AddSectionUtility.billToCodesList(this.addSectionModel, data);
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.billToError(error);
      });
    }
  }
  billToError(error: HttpErrorResponse) {
    this.addSectionModel.isBillToLoading = false;
    if (error && error.status >= 500) {
      AddSectionUtility.toastMessage(this.messageService, 'error', 'Error',
        'Pricing Agreement System is currently unavailable.  Contact help desk');
    } else {
      AddSectionUtility.toastMessage(this.messageService, 'error', error.error.errors[0].errorType, error.error.errors[0].errorMessage);
    }
    this.changeDetector.detectChanges();
  }
  onDateSelected(value: Date, key: number) {
    AddSectionUtility.disableDates(this.addSectionModel, value, key);
    this.addSectionModel.isBillToLoading = false;
    const fieldName = (key === 0) ? 'effective' : 'expiration';
    this.onTypeDate(moment(value).format('MM/DD/YYYY'), fieldName);
    if (utils.isEmpty(this.addSectionModel.selectedEditSection)) {
      this.getBillToCodes();
    } else {
      this.getEditBillToCodes();
    }
  }
  onTypeDate(event: string, fieldName: string) {
    switch (fieldName) {
      case 'effective':
        if (this.addSectionModel.sectionForm.controls['effectiveDate'].value) {
          this.addSectionModel.inCorrectEffDateFormat = false;
          this.onSelectEffDate();
        }
        break;
      case 'expiration':
        if (this.addSectionModel.sectionForm.controls['expirationDate'].value) {
          this.addSectionModel.inCorrectExpDateFormat = false;
          AddSectionUtility.onSelectExpDate(this.addSectionModel);
        }
        break;
    }
    if (utils.isEmpty(this.addSectionModel.selectedEditSection)) {
      this.getBillToCodes();
    } else {
      this.getEditBillToCodes();
    }
    const fieldObj = {
      formFieldName: (fieldName === 'effective') ? 'effectiveDate' : 'expirationDate',
      key: (fieldName === 'effective') ? 0 : 1
    };
    AddSectionUtility.disableDates(this.addSectionModel,
      this.addSectionModel.sectionForm.controls[fieldObj['formFieldName']].value, fieldObj['key']);
    AddSectionUtility.validateDateFormat(event, fieldName, this.addSectionModel);
  }
  onSelectEffDate() {
    AddSectionUtility.getValidDate(this.addSectionModel);
  }
  onPreviousClick() {
    this.addSectionModel.changeText = 'back';
    if (this.addSectionModel.sectionForm.touched) {
      this.addSectionModel.isSaveChanges = true;
    } else {
      this.shared.broadcast('stepIndexChange', 'back');
    }
  }
  onSaveExit() {
    if (this.addSectionModel.sectionForm.dirty) {
      this.onSave('search');
    } else {
      this.router.navigate([this.addSectionModel.searchUrl]);
    }
  }
  nextStepNavigation() {
    if (!utils.isEmpty(this.addSectionModel.sectionsList)) {
      this.shared.broadcast('stepIndexChange', this.addSectionModel.changeText);
    } else {
      AddSectionUtility.toastMessage(this.messageService, 'error', 'Error',
        'You need to have atleast one Section before moving to next step');
    }
  }
  onNextStep() {
    this.addSectionModel.changeText = 'next';
    if (this.addSectionModel.isSplitView && this.addSectionModel.sectionForm.touched) {
      this.addSectionModel.isSaveChanges = true;
    } else {
      this.nextStepNavigation();
    }
  }
  onAddSection() {
    this.addSectionModel.searchInputValue = '';
    this.createSectionForm();
    this.addSectionModel.selectedCodesList = [];
    this.addSectionModel.filteredCodesList = [];
    this.addSectionModel.codesList = [];
    this.addSectionModel.isSplitView = true;
    this.addSectionModel.sectionForm.patchValue({ currency: 'USD' });
  }
  onClose() {
    this.addSectionModel.searchInputValue = '';
    if (this.addSectionModel.sectionForm.dirty && this.addSectionModel.sectionForm.touched) {
      this.addSectionModel.isSaveChanges = true;
    } else {
      this.onDontSave();
    }
  }
  billToCodeCheck() {
    this.addSectionModel.sectionForm.markAsTouched();
    this.addSectionModel.sectionForm.markAsDirty();
  }
  onSave(screen?: string) {
    this.addSectionModel.isSaveChanges = false;
    this.addSectionModel.effError = false;
    this.addSectionModel.expError = false;
    if (this.addSectionModel.sectionForm.valid && !utils.isEmpty(this.addSectionModel.selectedCodesList) &&
      this.addSectionModel.sectionForm.dirty && !this.addSectionModel.isNotValidDate) {
      const descriptionIndex = AddSectionUtility.matchedIndex(this.addSectionModel, 'customerAgreementContractSectionName', 'sectionName');
      if (descriptionIndex > -1) {
        const message = 'A section with the same Name already exists. No duplicates allowed';
        AddSectionUtility.toastMessage(this.messageService, 'error', 'Error', message);
      } else {
        this.saveSection(screen);
      }
    } else {
      AddSectionUtility.formErrorCheck(this.addSectionModel, this.messageService);
      this.dateValidation();
      this.changeDetector.detectChanges();
    }
  }

  dateValidation() {
    if (this.addSectionModel.sectionForm.valid && this.addSectionModel.isNotValidDate) {
      AddSectionUtility.setFormErrors(this.addSectionModel);
      AddSectionUtility.toastMessage(this.messageService, 'error', 'Error',
        'The effective date should be before or equal to the expiration date');
    }
  }

  saveSection(screen: string) {
    const formData = AddSectionUtility.createRequest(this.addSectionModel);
    const idObject = {
      agreementId: this.addSectionModel.createAgreement.customerAgreementID,
      contractId: this.addSectionModel.selectedContractId, sectionId: !utils.isEmpty(this.addSectionModel.selectedEditSection) ?
        this.addSectionModel.selectedEditSection[0].sectionId : null, versionId: !utils.isEmpty(this.addSectionModel.selectedEditSection) ?
          this.addSectionModel.selectedEditSection[0].sectionVersionID : null
    };
    this.addSectionModel.pageLoading = true;
    this.service.sectionSave(formData, idObject).pipe(takeWhile(() => this.addSectionModel.isSubscribe)).subscribe((data: object) => {
      if (this.codestable) {
        AddSectionUtility.clearTableFilterData(this.codestable, this.addSectionModel);
      }
      AddSectionUtility.viewReset(this.addSectionModel);
      this.addSectionModel.pageLoading = false;
      this.getSectionTableList();
      AddSectionUtility.toastMessage(this.messageService, 'success', 'Success', (this
        .addSectionModel.saveEditFlag) ? 'Section Added successfully' : 'Section Edited successfully');
      this.addSectionModel.selectedSectionsList = [];
      this.changeDetector.detectChanges();
      AddSectionUtility.handleSuccess(screen, this.router, this.shared, this.addSectionModel);
      this.addSectionModel.effError = false;
      this.addSectionModel.expError = false;
    }, (error: HttpErrorResponse) => {
      this.addSectionModel.pageLoading = false;
      this.changeDetector.detectChanges();
      AddSectionUtility.toastMessage(this.messageService, 'error', error.error.errors[0].errorType, error.error.errors[0].errorMessage);
    });
  }

  focusOnlyCheckbox(event) {
    event.stopPropagation();
  }

  rowSelect(event: RowEvent) {
    this.addSectionModel.changeText = '';
    if (this.codestable) {
      AddSectionUtility.clearTableFilterData(this.codestable, this.addSectionModel);
    }
    AddSectionUtility.hideDateErrors(this.addSectionModel);
    this.addSectionModel.isCheckboxClick = event.originalEvent ?
      event.originalEvent.target['classList'].contains('checkbox-column') : event.type === 'checkbox';
      this.addSectionModel.saveEditFlag = true;
    if (!this.addSectionModel.isCheckboxClick && this.addSectionModel.sectionForm.pristine) {
      this.addSectionModel.selectedSectionsList = [];
      this.addSectionModel.selectedEditSection = [event.data];
      this.addSectionModel.pageLoading = true;
      this.service.editSection(event.data).pipe(takeWhile(() => this.addSectionModel.isSubscribe))
        .subscribe((data: SaveResponse) => {
          this.addSectionModel.saveEditFlag = false;
          AddSectionUtility.patchData(data, this.addSectionModel);
          this.onContractIdChanged(data.customerContractName, false);
          this.getEditBillToCodes();
          this.changeDetector.detectChanges();
        }, (error: HttpErrorResponse) => {
          this.addSectionModel.pageLoading = false;
          this.changeDetector.detectChanges();
        });
    } else if (!this.addSectionModel.isCheckboxClick && !this.addSectionModel.sectionForm.pristine) {
      this.addSectionModel.selectedSectionsList = this.addSectionModel.selectedEditSection;
      this.addSectionModel.isSaved = false;
      this.addSectionModel.isSaveChanges = true;
      this.addSectionModel.saveEditFlag = false;
    }
    this.addSectionModel.isSplitView = !this.addSectionModel.isCheckboxClick;
    this.changeDetector.detectChanges();
    this.changeDetector.markForCheck();
  }
  getDatesForRole() {
    this.addSectionModel.pageLoading = true;
    const param = 'Super User Back Date Days, Super User Future Date Days';
    this.service.getDatesByRole(param).pipe(takeWhile(() => this.addSectionModel.isSubscribe))
      .subscribe((data: RootObject) => {
        if (!utils.isEmpty(data) && !utils.isEmpty(data._embedded) && !utils.isEmpty(data._embedded.configurationParameterDetails)) {
          AddSectionUtility.getDates(data._embedded.configurationParameterDetails, this.addSectionModel);
        }
        this.addSectionModel.pageLoading = false;
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.addSectionModel.pageLoading = false;
        this.changeDetector.detectChanges();
      });
  }
  headerCheckboxToggle() {
    if (this.addSectionModel.isSplitView) {
      this.onClose();
    }
  }
}
