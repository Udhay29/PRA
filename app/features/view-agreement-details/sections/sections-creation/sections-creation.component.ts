import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';
import * as moment from 'moment';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { SectionsCreationModel } from './model/sections-creation.model';
import {
  BillToList, CustomerAgreementContractsItem, InitialStructure, SplitScreenDetails, TableDisplayFormat, ImpactCount
} from './../model/sections.interface';
import { SectionsService } from './../service/sections.service';
import { SectionsCreationUtility } from './service/sections-creation-utility';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';
import { LocalStorageService } from '../../../../shared/jbh-app-services/local-storage.service';

@Component({
  selector: 'app-sections-creation',
  templateUrl: './sections-creation.component.html',
  styleUrls: ['./sections-creation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionsCreationComponent implements OnInit, OnDestroy {
  sectionsCreationModel: SectionsCreationModel;
  dateFormat: string;
  sectionAccountId: string;
  @Input() set splitScreenData(splitScreenData: SplitScreenDetails) {
    this.sectionsCreationModel.splitViewDetails = splitScreenData;
  }
  @Output() splitCloseEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() loaderEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private readonly formBuilder: FormBuilder, private readonly service: SectionsService,
    private readonly changeDetector: ChangeDetectorRef, private readonly messageService: MessageService,
    private readonly shared: BroadcasterService, private readonly store: LocalStorageService) {
    this.sectionsCreationModel = new SectionsCreationModel();
    this.dateFormat = 'YYYY-MM-DD';
    this.sectionAccountId = 'rowDetail.customerAgreementContractSectionAccountID';
  }
  ngOnInit() {
    this.createForm();
    this.getDatesForRole();
    this.getSectionTypeList();
    this.getCurrencyList();
    this.getContractList();
    this.getBillToList();
    this.navigationSubscription();
    this.saveSubscription();
    this.setEditFormDetails();
    this.valueChangesSubscription();
  }
  ngOnDestroy() {
    this.sectionsCreationModel.isSubscribe = false;
  }
  /** function to check form fields based on navigation
   * @memberof SectionsCreationComponent */
  navigationSubscription() {
    this.shared.on<boolean>('navigationStarts').pipe(takeWhile(() => this.sectionsCreationModel.isSubscribe))
      .subscribe((value: boolean) => {
        this.shared.broadcast('saved', this.sectionsCreationModel.sectionForm.touched &&
          this.sectionsCreationModel.sectionForm.dirty);
        this.changeDetector.detectChanges();
      });
  }
  /** function to make all the formfield as pristine and untounched
   * @memberof SectionsCreationComponent */
  saveSubscription() {
    this.shared.on<boolean>('loseChanges').subscribe((value: boolean) => {
      this.sectionsCreationModel.sectionForm.markAsPristine();
      this.sectionsCreationModel.sectionForm.markAsUntouched();
      this.changeDetector.detectChanges();
    });
  }
  valueChangesSubscription() {
    this.sectionsCreationModel.sectionForm.valueChanges.subscribe(val => {
      const valuesChanged = this.sectionsCreationModel.sectionForm.dirty &&
        this.sectionsCreationModel.sectionForm.touched;
      this.store.setItem('createSection', 'valueChanges', valuesChanged, true);
    });
  }
  onClose() {
    if (this.sectionsCreationModel.sectionForm.dirty || this.sectionsCreationModel.sectionForm.touched) {
      this.sectionsCreationModel.isShowPopup = true;
      this.changeDetector.detectChanges();
    } else {
      this.sectionsCreationModel.selectedCodesList = [];
      this.store.clearItem('createSection', 'valueChanges', true);
      this.splitCloseEvent.emit(false);
    }
  }
  popupCancel() {
    this.sectionsCreationModel.isShowPopup = false;
  }
  popupYes() {
    this.sectionsCreationModel.sectionForm.reset();
    this.sectionsCreationModel.isShowPopup = false;
    this.sectionsCreationModel.selectedCodesList = [];
    this.store.clearItem('createSection', 'valueChanges', true);
    this.splitCloseEvent.emit(false);
  }
  createForm() {
    this.sectionsCreationModel.sectionForm = this.formBuilder.group({
      sectionName: ['', Validators.required],
      sectionType: ['', Validators.required],
      currency: ['', Validators.required],
      contractId: ['', Validators.required],
      effectiveDate: ['', Validators.required],
      expirationDate: ['', Validators.required]
    });
    this.sectionsCreationModel.popupFormGroup = this.formBuilder.group({
      billtoEffective: ['', Validators.required],
      billtoExpiration: ['', Validators.required]
    });
    this.defaultPatch();
  }
  getSectionTypeList() {
    this.sectionsCreationModel.sectionTypeList = [];
    this.service.getSectionType().pipe(takeWhile(() => this.sectionsCreationModel.isSubscribe)).subscribe((data: InitialStructure) => {
      if (!utils.isEmpty(data) && !utils.isEmpty(data._embedded) && !utils.isEmpty(data._embedded.sectionTypes)) {
        this.sectionsCreationModel.sectionTypeList = SectionsCreationUtility.getSectionType(data._embedded.sectionTypes);
      }
      this.sectionsCreationModel.filteredSectionType = this.sectionsCreationModel.sectionTypeList;
      this.changeDetector.detectChanges();
    }, (error: HttpErrorResponse) => {
      this.changeDetector.detectChanges();
    });
  }
  getCurrencyList() {
    this.sectionsCreationModel.currencyList = [];
    this.service.getCurrency().pipe(takeWhile(() => this.sectionsCreationModel.isSubscribe)).subscribe((data: string[]) => {
      if (!utils.isEmpty(data)) {
        this.sectionsCreationModel.currencyList = SectionsCreationUtility.getCurrencyList(data);
      }
      this.sectionsCreationModel.filteredCurrency = this.sectionsCreationModel.currencyList;
      this.changeDetector.detectChanges();
    }, (error: HttpErrorResponse) => {
      this.changeDetector.detectChanges();
    });
  }
  getContractList() {
    this.sectionsCreationModel.contractIdList = [];
    this.service.getContract(this.sectionsCreationModel.splitViewDetails.agreementId)
      .pipe(takeWhile(() => this.sectionsCreationModel.isSubscribe)).subscribe((data: CustomerAgreementContractsItem[]) => {
        if (data) {
          this.sectionsCreationModel.contractIdList = SectionsCreationUtility.getContractList(data, this.sectionsCreationModel);
        }
        this.sectionsCreationModel.filteredContract = this.sectionsCreationModel.contractIdList;
        if (!this.sectionsCreationModel.splitViewDetails.isCreate) {
          this.editFrameContractObj();
          this.sectionsCreationModel.editContractDisable = true;
        }
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.changeDetector.detectChanges();
      });
  }
  onAutoCompleteClear(value: string, controlName: string) {
    if (utils.isEmpty(value)) {
      this.sectionsCreationModel.sectionForm.controls[controlName].setValue(value);
      this.sectionsCreationModel.sectionForm.updateValueAndValidity();
    }
  }
  onAutoCompleteSearch(value: string, fullKey: string, filteredkey: string) {
    const filteredList = [];
    utils.forEach(this.sectionsCreationModel[fullKey], (result: MenuItem) => {
      if (result.label.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        filteredList.push(result);
      }
    });
    this.sectionsCreationModel[filteredkey] = filteredList;
  }
  defaultPatch() {
    if (this.sectionsCreationModel.splitViewDetails.isCreate) {
      this.sectionsCreationModel.sectionForm.patchValue({
        currency: { label: 'USD', value: 'USD' },
        effectiveDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
        expirationDate: new Date(this.sectionsCreationModel.splitViewDetails.agreementDeatils
          .expirationDate.replace(/-/g, '\/').replace(/T.+/, ''))
      });
    }
  }
  onTypeDate(event: string, fieldName: string) {
    if (event !== '') {
      const fieldObj = {
        formFieldName: (fieldName === 'effective') ? 'effectiveDate' : 'expirationDate',
        key: (fieldName === 'effective') ? 0 : 1
      };
      SectionsCreationUtility.validateDateFormat(event, fieldName, this.sectionsCreationModel);
      SectionsCreationUtility.setFormErrors(this.sectionsCreationModel);
      this.onDateSelected(this.sectionsCreationModel.sectionForm.controls[fieldObj['formFieldName']].value, fieldObj['key']);
      this.dateValidation('sectionForm', 'effectiveDate', 'expirationDate');
    }
  }
  dateValidation(formName: string, effectiveDate: string, expirationDate: string) {
    const effDate = this.sectionsCreationModel[formName].controls[effectiveDate].value;
    const expDate = this.sectionsCreationModel[formName].controls[expirationDate].value;
    if (effDate && !expDate) {
      this.sectionsCreationModel[formName].controls[expirationDate].setErrors(Validators.required);
    } else if (!effDate && expDate) {
      this.sectionsCreationModel[formName].controls[effectiveDate].setErrors(Validators.required);
    } else if (!effDate && !expDate) {
      this.sectionsCreationModel[formName].controls[effectiveDate].setErrors(Validators.required);
      this.sectionsCreationModel[formName].controls[expirationDate].setErrors(Validators.required);
    }
    this.sectionsCreationModel[formName].controls[expirationDate].updateValueAndValidity();
    this.sectionsCreationModel[formName].controls[effectiveDate].updateValueAndValidity();
  }
  onBillToTypeDate(event: string, fieldName: string) {
    if (event !== '') {
      const fieldObj = {
        formFieldName: (fieldName === 'effective') ? 'billtoEffective' : 'billtoExpiration',
        key: (fieldName === 'effective') ? 0 : 1
      };
      SectionsCreationUtility.validateDateFormat(event, fieldName, this.sectionsCreationModel);
      SectionsCreationUtility.setBillToFormErrors(this.sectionsCreationModel);
      this.onBillToDateSelected(this.sectionsCreationModel.popupFormGroup.controls[fieldObj['formFieldName']].value, fieldObj['key']);
      this.dateValidation('popupFormGroup', 'billtoEffective', 'billtoExpiration');
    }
  }
  onSave() {
    if (this.sectionsCreationModel.sectionForm.valid) {
      this.checkSectionName();
    } else {
      SectionsCreationUtility.formErrorCheck(this.sectionsCreationModel, this.messageService);
    }
  }
  checkValidDate(): boolean | undefined {
    const effectiveDate = this.sectionsCreationModel.sectionForm.controls['effectiveDate'].value;
    const expirationDate = this.sectionsCreationModel.sectionForm.controls['expirationDate'].value;
    const message = 'The effective date should be before or equal to the expiration date';
    if (effectiveDate && expirationDate) {
      if (effectiveDate.setHours(0, 0, 0, 0) > expirationDate.setHours(0, 0, 0, 0)) {
        SectionsCreationUtility.toastMessage(this.messageService, 'error', 'Error', message);
      } else {
        return true;
      }
    }
  }
  getBillToList() {
    this.sectionsCreationModel.codesList = [];
    this.sectionsCreationModel.filteredCodesList = [];
    let idObject = null;
    if (!this.sectionsCreationModel.splitViewDetails.isCreate) {
      this.sectionsCreationModel.editBillToList = true;
      const sectionIdValue = this.sectionsCreationModel.splitViewDetails.sectionDetails.customerAgreementContractSectionID.toString();
      const sectionverId = this.sectionsCreationModel.splitViewDetails.sectionDetails.customerAgreementContractSectionVersionID.toString();
      idObject = {
        sectionId: sectionIdValue,
        sectionVerId: sectionverId
      };
    }
    this.service.getCreateSectionBillTo(this.sectionsCreationModel.splitViewDetails.agreementId,
      this.sectionsCreationModel.editBillToList, idObject)
      .pipe(takeWhile(() => this.sectionsCreationModel.isSubscribe)).subscribe((data: BillToList[]) => {
        if (!utils.isEmpty(data)) {
          this.sectionsCreationModel.isBillToLoaded = false;
          this.sectionsCreationModel.codesList = SectionsCreationUtility.getBillToCodes(data);
          this.sectionsCreationModel.filteredCodesList = this.sectionsCreationModel.codesList;
          if (!this.sectionsCreationModel.splitViewDetails.isCreate) {
            this.setValueforBillToCodeGrid();
            const length = utils.uniqBy(this.sectionsCreationModel.selectedCodesList, this.sectionAccountId);
            this.sectionsCreationModel.billToLength = length.length;
          } else {
            const length = utils.uniqBy(this.sectionsCreationModel.codesList, 'rowDetail.billingPartyID');
            this.sectionsCreationModel.billToLength = length.length;
          }
        } else {
          this.sectionsCreationModel.isBillToLoaded = false;
        }
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.sectionsCreationModel.isBillToLoaded = false;
        this.changeDetector.detectChanges();
      });
  }
  contractSelected(event: CustomerAgreementContractsItem) {
    this.sectionsCreationModel.selectedContract = event;
    this.sectionsCreationModel.contractEffDate = new Date(event.effectiveDate.replace(/-/g, '\/').replace(/T.+/, ''));
    this.sectionsCreationModel.contractExpDate = new Date(event.expirationDate.replace(/-/g, '\/').replace(/T.+/, ''));
  }
  onDateSelected(value: Date, key: number) {
    if (key === 0) {
      this.sectionsCreationModel.expirationMinDate = new Date(value);
    } else {
      this.sectionsCreationModel.effectiveMaxDate = new Date(value);
    }
  }
  onBillToDateSelected(value: Date, key: number) {
    if (key === 0) {
      this.sectionsCreationModel.billToExpirationMinDate = this.sectionsCreationModel.sectionForm.get('effectiveDate').value;
    } else {
      this.sectionsCreationModel.billToEffectiveMaxDate = this.sectionsCreationModel.sectionForm.get('expirationDate').value;
    }
  }
  checkSectionName() {
    if (this.sectionsCreationModel.splitViewDetails.isCreate) {
      const matchedObject = utils.filter(this.sectionsCreationModel.splitViewDetails.tableDeatils, ['SectionName',
        this.sectionsCreationModel.sectionForm.get('sectionName').value]);
      if (!utils.isEmpty(matchedObject)) {
        const message = 'A section with the same section Name already exists. No duplicates allowed';
        SectionsCreationUtility.toastMessage(this.messageService, 'error', 'Error', message);
      } else {
        this.createDateValidation(true);
      }
    } else {
      const isBillToChecked = SectionsCreationUtility.isBillToChanged(this.sectionsCreationModel);
      if (this.sectionsCreationModel.sectionForm.pristine && isBillToChecked) {
        const message = 'You have not made any changes to save the data';
        SectionsCreationUtility.toastMessage(this.messageService, 'info', 'No Changes Found', message);
      } else {
        this.editSectionValidate();
      }
    }
  }
  editSectionValidate() {
    if (this.checkValidDate()) {
      this.editcontractDateValidation();
    }
  }

  editcontractDateValidation() {
    if (this.contractDateValidate()) {
      this.createDateValidation(true);
    }
  }

  getImpactChildCount() {
    const oldSectionDate = moment(this.sectionsCreationModel.splitViewDetails.sectionDetails.expirationDate).format(this.dateFormat);
    const newSectionDate = moment(this.sectionsCreationModel.sectionForm.get('expirationDate').value).format(this.dateFormat);
    const expirationDateCheck = (newSectionDate) === (oldSectionDate);
    if (expirationDateCheck) {
      this.checkEditBillToChangesList();
    } else {
      this.sectionsCreationModel.sectionName = this.sectionsCreationModel.splitViewDetails.sectionDetails.
        customerAgreementContractSectionName;
      this.sectionsCreationModel.agreementName = this.sectionsCreationModel.splitViewDetails.agreementDeatils.customerAgreementName;
      this.loaderEvent.emit(true);
      this.sectionsCreationModel.countErrorData = [];
      const expDate = this.sectionsCreationModel.sectionForm.get('expirationDate').value.toISOString().split('T')[0];
      const sectionId = this.sectionsCreationModel.splitViewDetails.sectionDetails.customerAgreementContractSectionID;
      this.service.getImpactCount(sectionId, expDate).pipe(takeWhile(() =>
        this.sectionsCreationModel.isSubscribe)).subscribe((data: ImpactCount) => {
          this.loaderEvent.emit(false);
          const childCountExit = SectionsCreationUtility.checkImpactChildCount(data, this.sectionsCreationModel);
          if (childCountExit) {
            this.sectionsCreationModel.countErrorData.push(data);
            this.sectionsCreationModel.isShowChildEntityPopup = true;
          } else {
            this.checkEditBillToChangesList();
          }
        }, (error: HttpErrorResponse) => {
          this.loaderEvent.emit(false);
          this.changeDetector.detectChanges();
        });
    }
  }

  contractDateValidate(): boolean {
    const effectiveDateCheck = new Date(this.sectionsCreationModel.sectionForm.get('effectiveDate').value) >=
      new Date(this.sectionsCreationModel.selectedContract.effectiveDate.replace(/-/g, '\/').replace(/T.+/, ''));
    const expirationDateCheck = new Date(this.sectionsCreationModel.sectionForm.get('expirationDate').value) <=
      new Date(this.sectionsCreationModel.selectedContract.expirationDate.replace(/-/g, '\/').replace(/T.+/, ''));
    if (effectiveDateCheck && expirationDateCheck) {
      return true;
    } else {
      const message = 'Section Date Range should be within the Contract date range';
      SectionsCreationUtility.toastMessage(this.messageService, 'error', 'Error', message);
      return false;
    }
  }

  checkBillToForSave() {
    if (this.checkValidDate()) {
      if (!utils.isEmpty(this.sectionsCreationModel.selectedCodesList)) {
        this.checkContractDate();
        this.sectionsCreationModel.isAssigned = this.checkBillToAssignment(this.sectionsCreationModel.selectedCodesList);
      } else {
        this.saveSection();
      }
    }
  }
  checkBillToAssignment(selectedList: TableDisplayFormat[]): boolean {
    let assignFlag = false;
    utils.forEach(selectedList, (rowData: TableDisplayFormat) => {
      if (rowData.rowDetail.customerAgreementContractSectionID && rowData.rowDetail.customerAgreementContractSectionName) {
        assignFlag = true;
      }
    });
    return assignFlag;
  }
  checkContractDate() {
    if (this.sectionsCreationModel.splitViewDetails.isCreate && this.contractDateValidate()) {
      this.constructAssignBillToChange(this.sectionsCreationModel.createSectionPopupText);
    } else {
      this.constructAssignBillToChange(this.sectionsCreationModel.editSectionPopupText);
    }
  }

  constructAssignBillToChange(popupText: string) {
    this.sectionsCreationModel.popupFormGroup.patchValue({
      billtoEffective: this.sectionsCreationModel.sectionForm.get('effectiveDate').value,
      billtoExpiration: this.sectionsCreationModel.sectionForm.get('expirationDate').value
    });
    this.sectionsCreationModel.billToEffectiveMinDate = this.sectionsCreationModel.sectionForm.get('effectiveDate').value;
    this.sectionsCreationModel.billToExpirationMaxDate = this.sectionsCreationModel.sectionForm.get('expirationDate').value;
    this.onBillToDateSelected(this.sectionsCreationModel.popupFormGroup.get('billtoEffective').value, 0);
    this.onBillToDateSelected(this.sectionsCreationModel.popupFormGroup.get('billtoExpiration').value, 1);
    this.sectionsCreationModel.popupText = popupText;
    this.sectionsCreationModel.isbillToAssignmentPopup = true;
  }
  getDatesForRole() {
    const param = 'Super User Back Date Days, Super User Future Date Days';
    this.service.getDatesByRole(param).pipe(takeWhile(() => this.sectionsCreationModel.isSubscribe))
      .subscribe((data: InitialStructure) => {
        if (!utils.isEmpty(data) && !utils.isEmpty(data._embedded) && !utils.isEmpty(data._embedded.configurationParameterDetails)) {
          SectionsCreationUtility.getDates(data._embedded.configurationParameterDetails, this.sectionsCreationModel);
        }
        if (this.sectionsCreationModel.splitViewDetails.isCreate) {
          this.sectionsCreationModel.effectiveMinDate = new Date(this.sectionsCreationModel.splitViewDetails.agreementDeatils
            .effectiveDate.replace(/-/g, '\/').replace(/T.+/, ''));
          this.onDateSelected(this.sectionsCreationModel.sectionForm.get('effectiveDate').value, 0);
          this.onDateSelected(this.sectionsCreationModel.sectionForm.get('expirationDate').value, 1);
        }
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.changeDetector.detectChanges();
      });
  }
  billToDateSave() {
    if (this.sectionsCreationModel.popupFormGroup.valid) {
      this.saveSection();
    } else {
      SectionsCreationUtility.formErrorCheck(this.sectionsCreationModel, this.messageService);
    }
  }
  createDateValidation(isValidate: boolean) {
    let saveRequest = null;
    if (this.sectionsCreationModel.splitViewDetails.isCreate) {
      saveRequest = SectionsCreationUtility.createSaveRequest(this.sectionsCreationModel, isValidate);
    } else {
      saveRequest = SectionsCreationUtility.editSaveRequest(this.sectionsCreationModel, isValidate);
    }
    this.sectionValidation(saveRequest, isValidate);
  }

  sectionValidation(saveRequest: object, isValidate: boolean) {
    const idObject = {
      agreementId: this.sectionsCreationModel.splitViewDetails.agreementId,
      contractId: this.sectionsCreationModel.sectionForm.get('contractId').value.customerAgreementContractID
    };
    this.loaderEvent.emit(true);
    this.service.sectionSave(saveRequest, idObject, isValidate).pipe(takeWhile(() => this.sectionsCreationModel.isSubscribe))
      .subscribe((data) => {
        this.loaderEvent.emit(false);
        this.validationResponse(isValidate);
      }, (error: HttpErrorResponse) => {
        this.loaderEvent.emit(false);
        if (error.status === 400 && error.error.errors[0].errorMessage === 'max_size_violation') {
          this.messageService.clear();
          this.messageService.add({
            severity: 'error', summary: 'Error',
            detail: 'Exceeds Permissible Limit'
          });
        } else if (error.status && error.status >= 500) {
          this.messageService.clear();
          this.messageService.add({
            severity: 'error', summary: 'Error',
            detail: 'Pricing Configuration System is currently unavailable.  Contact help desk'
          });
        }
        this.changeDetector.detectChanges();
      });
  }

  validationResponse(isValidate: boolean) {
    if (this.sectionsCreationModel.splitViewDetails.isCreate) {
      if (isValidate) {
        this.checkBillToForSave();
      } else {
        this.saveSuccessResponse('Section Created!', 'You have created the section successfully.');
      }
    } else {
      this.getImpactChildCount();
    }
  }
  saveSection() {
    if (this.sectionsCreationModel.splitViewDetails.isCreate) {
      this.createDateValidation(false);
    } else {
      this.editsectionSave(false);
    }
  }

  editsectionSave(isvalidate: boolean) {
    this.loaderEvent.emit(true);
    const editsaveRequest = SectionsCreationUtility.editSaveRequest(this.sectionsCreationModel, isvalidate);
    const idObject = {
      agreementId: this.sectionsCreationModel.splitViewDetails.agreementId,
      contractId: editsaveRequest.customerAgreementContractDTO.customerAgreementContractID,
      sectionId: this.sectionsCreationModel.splitViewDetails.sectionDetails.customerAgreementContractSectionID,
      versionId: this.sectionsCreationModel.splitViewDetails.sectionDetails.customerAgreementContractSectionVersionID
    };
    this.service.sectionEditSave(editsaveRequest, idObject).pipe(takeWhile(() => this.sectionsCreationModel.isSubscribe))
      .subscribe((data) => {
        this.saveSuccessResponse('Section Edited!', 'You have updated the section successfully.');
      }, (error: HttpErrorResponse) => {
        this.loaderEvent.emit(false);
        this.changeDetector.detectChanges();
      });
  }

  setEditFormDetails() {
    if (!this.sectionsCreationModel.splitViewDetails.isCreate) {
      this.sectionsCreationModel.sectionForm.patchValue({
        currency: {
          label: this.sectionsCreationModel.splitViewDetails.sectionDetails.currencyCode,
          value: this.sectionsCreationModel.splitViewDetails.sectionDetails.currencyCode
        },
        effectiveDate: new Date(this.sectionsCreationModel.splitViewDetails.sectionDetails
          .effectiveDate.replace(/-/g, '\/').replace(/T.+/, '')),
        expirationDate: new Date(this.sectionsCreationModel.splitViewDetails.sectionDetails
          .expirationDate.replace(/-/g, '\/').replace(/T.+/, '')),
        sectionName: this.sectionsCreationModel.splitViewDetails.sectionDetails.customerAgreementContractSectionName,
        sectionType: {
          label: this.sectionsCreationModel.splitViewDetails.sectionDetails.customerAgreementContractSectionTypeName,
          value: this.sectionsCreationModel.splitViewDetails.sectionDetails.customerAgreementContractSectionTypeID
        },
      });
    }
  }

  editFrameContractObj() {
    let contractDetails = null;
    contractDetails = utils.find(this.sectionsCreationModel.filteredContract,
      {
        'customerContractName': this.sectionsCreationModel.
          splitViewDetails.sectionDetails.customerContractName
      });
    this.sectionsCreationModel.sectionForm.get('contractId').
      setValue(contractDetails);
    this.contractSelected(contractDetails);
  }

  setValueforBillToCodeGrid() {
    if (!utils.isEmpty(this.sectionsCreationModel.splitViewDetails.sectionDetails.customerAgreementContractSectionAccountDTOs)) {
      utils.each(this.sectionsCreationModel.splitViewDetails.sectionDetails.customerAgreementContractSectionAccountDTOs, (value) => {
        utils.each(this.sectionsCreationModel.filteredCodesList, (filterValue) => {
          if (filterValue.rowDetail['customerAgreementContractSectionAccountID'] === value['customerAgreementContractSectionAccountID']) {
            this.sectionsCreationModel.selectedCodesList.push(filterValue);
            this.sectionsCreationModel.selectedCodeListCopy.push(filterValue);
          }
        });
      });
    }
  }

  checkEditBillToChangesList() {
    this.sectionsCreationModel.selectedCodeListCopy =
      utils.sortBy(this.sectionsCreationModel.selectedCodeListCopy, this.sectionAccountId);
    this.sectionsCreationModel.selectedCodesList =
      utils.sortBy(this.sectionsCreationModel.selectedCodesList, this.sectionAccountId);
    let newlySelectedValues = utils.differenceBy(this.sectionsCreationModel.selectedCodesList,
      this.sectionsCreationModel.selectedCodeListCopy, this.sectionAccountId);
    const deSelectedValues = utils.differenceBy(this.sectionsCreationModel.selectedCodeListCopy,
      this.sectionsCreationModel.selectedCodesList, this.sectionAccountId);
    const billToListDateCheckList = this.checkSelectedBillToList();
    newlySelectedValues = newlySelectedValues.concat(billToListDateCheckList);
    const editSelectedList = SectionsCreationUtility.frameEditBillToCodeList(newlySelectedValues, deSelectedValues);
    this.sectionsCreationModel.editSelectedBillToList = editSelectedList;
    if (this.sectionsCreationModel.editSelectedBillToList.length) {
      const selectedListBillTo = utils.differenceBy(this.sectionsCreationModel.selectedCodeListCopy,
        this.sectionsCreationModel.editSelectedBillToList, this.sectionAccountId);
      this.sectionsCreationModel.editSelectedBillToList =
        SectionsCreationUtility.setSelectedBillToList(selectedListBillTo, this.sectionsCreationModel);
    }
    if (newlySelectedValues.length) {
      this.sectionsCreationModel.isAssigned = this.checkBillToAssignment(newlySelectedValues);
      this.checkContractDate();
    } else {
      this.saveSection();
    }
  }

  saveSuccessResponse(successMsg: string, successDetailMsg: string) {
    this.sectionsCreationModel.isbillToAssignmentPopup = false;
    SectionsCreationUtility.toastMessage(this.messageService, 'success', successMsg,
      successDetailMsg);
    this.store.clearItem('createSection', 'valueChanges', true);
    this.changeDetector.detectChanges();
    this.splitCloseEvent.emit(false);
    this.loaderEvent.emit(false);
  }

  countpopupCancel() {
    this.sectionsCreationModel.isShowChildEntityPopup = false;
  }

  countpopupContinue() {
    this.sectionsCreationModel.isShowChildEntityPopup = false;
    this.checkEditBillToChangesList();
  }

  checkSelectedBillToList() {
    const billToCheckedList = [];
    const oldSectionDate = moment(this.sectionsCreationModel.splitViewDetails.sectionDetails.expirationDate).format(this.dateFormat);
    const newSectionDate = moment(this.sectionsCreationModel.sectionForm.get('expirationDate').value).format(this.dateFormat);
    const expirationDateCheck = (newSectionDate) > (oldSectionDate);
    if (expirationDateCheck) {
      const newSelectedEffDate = moment(this.sectionsCreationModel.sectionForm.get('effectiveDate').value).format(this.dateFormat);
      utils.each(this.sectionsCreationModel.selectedCodesList, (value) => {
        if (value.rowDetail.expirationDate !== null) {
          const billToExpDate = moment(value.rowDetail.expirationDate).format(this.dateFormat);
          if (newSelectedEffDate > billToExpDate) {
            value.rowDetail.customerAgreementContractSectionAccountID = null;
            billToCheckedList.push(value);
          }
        }
      });
    }
    return billToCheckedList;
  }
}
