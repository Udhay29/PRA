import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild,
   Output, Input, EventEmitter, AfterViewChecked } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MessageService } from 'primeng/components/common/messageservice';
import { Message } from 'primeng/api';
import { Router, RouterStateSnapshot } from '@angular/router';
import * as utils from 'lodash';
import * as moment from 'moment';
import { timer } from 'rxjs';

import { takeWhile } from 'rxjs/operators';

import { BroadcasterService } from './../../../shared/jbh-app-services/broadcaster.service';
import { LocalStorageService } from './../../../shared/jbh-app-services/local-storage.service';

import { AddCargoModel } from './models/add-cargo.model';
import { AddCargoService } from './services/add-cargo.service';
import { AddCargoUtilsService } from './services/add-cargo-utils.service';
import { CreateCargoComponent } from './create-cargo/create-cargo.component';
import { RowData, DeleteAgreement, CargoDetailListItem } from './models/add-cargo-interface';
import { AddCargoQuery } from './query/add-cargo.query';

@Component({
  selector: 'app-add-cargo',
  templateUrl: './add-cargo.component.html',
  styleUrls: ['./add-cargo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CurrencyPipe]
})
export class AddCargoComponent implements OnInit, OnDestroy {
  @ViewChild(CreateCargoComponent) createCargo: CreateCargoComponent;
  @Input() isIndexChange: number;
  @Output() cargoFormStatus: EventEmitter<boolean> = new EventEmitter<boolean>();
  addCargoModel: AddCargoModel;
  msgs: Message[] = [];
  constructor(
    private readonly addCargoService: AddCargoService,
    private readonly utilsService: AddCargoUtilsService,
    private readonly shared: BroadcasterService,
    private readonly localStore: LocalStorageService,
    private readonly messageService: MessageService,
    private readonly router: Router,
    private readonly changeDetector: ChangeDetectorRef,
    private currencyPipe: CurrencyPipe) {
    this.addCargoModel = new AddCargoModel();
    this.addCargoModel.agreementId = this.localStore.getItem('createAgreement', 'detail');
  }
  ngOnInit() {
    this.getGridValues();
    this.valueChangesSubscription();
    this.saveSubscription();
  }
  ngOnDestroy() {
    this.addCargoModel.isSubscribe = false;
  }
  isCargoFormDirty(event: boolean) {
    this.cargoFormStatus.emit(event);
  }

  saveSubscription() {
    this.shared.on<boolean>('needToSave').pipe(takeWhile(() => this.addCargoModel.isSubscribe)).subscribe((value: boolean) => {
      if (value) {
        this.createCargo.onSave();
      } else {
        this.addCargoModel.isSplitView = false;
        this.createCargo.createCargoModel.cargoReleaseForm.markAsPristine();
        this.createCargo.createCargoModel.cargoReleaseForm.markAsUntouched();
        if (utils.isNaN(this.isIndexChange)) {
          this.router.navigate([this.addCargoModel.routeUrl]);
        }
      }
      this.changeDetector.detectChanges();
    });
  }
  valueChangesSubscription() {
    this.shared.on<RouterStateSnapshot>('navigationStarts').pipe(takeWhile(() => this.addCargoModel.isSubscribe))
      .subscribe((value: RouterStateSnapshot) => {
        this.addCargoModel.routeUrl = value.url;
        const data = {
          key: !(this.addCargoModel.isSplitView && this.createCargo.createCargoModel.cargoReleaseForm.dirty &&
            this.createCargo.createCargoModel.cargoReleaseForm.touched),
          message: 'You made changes to the agreement that were not saved'
        };
        this.shared.broadcast('saved', data);
        this.changeDetector.detectChanges();
      });
  }
  /**
   * @memberof AddCargoComponent
   */
  getGridValues() {
    this.addCargoModel.pageLoader = true;
    if (this.addCargoModel.agreementId) {
      const query = AddCargoQuery.getTableQuery(this.addCargoModel.agreementId.customerAgreementID);
      this.addCargoService.getCargoGrid(query).pipe(takeWhile(() =>
        this.addCargoModel.isSubscribe)).subscribe((data: any) => {
          if (data && !utils.isEmpty(data.hits) && !utils.isEmpty(data.hits.hits)) {
            const dataList = [];
            data.hits.hits.forEach((element, index) => {
              this.setGridValues(element._source, index);
              dataList.push(element._source);
            });
            this.addCargoModel.cargoList = dataList;
            this.addCargoModel.pageLoader = false;
            this.changeDetector.detectChanges();
          } else {
            this.addCargoModel.pageLoader = false;
            this.changeDetector.detectChanges();
          }
        }, (gridError: Error) => {
          this.addCargoModel.pageLoader = false;
          this.toastMessage(this.messageService, 'error', gridError['error']['errors'][0]['errorMessage']);
        });
    }
  }
  setGridValues(element: any, index: number) {
    element['cargoAmount'] = this.currencyPipe.transform(element['cargoReleaseAmount'], 'USD', 'symbol', '1.2-2');
    element['index'] = index;
    this.iterateRowData(element);
    element['customerContractName'] = element.contractAssociation ? this.iterateContractValue(element.contractAssociation) : '--';
    element['customerSectionName'] = (element.sectionAssociation) ?
    element.sectionAssociation['customerAgreementContractSectionName'] : '--';
  }
  iterateContractValue(element: CargoDetailListItem): string {
    let contractValue;
    if (element) {
    if (element['customerContractNumber'] && element['customerContractName']) {
      contractValue = `${element['customerContractNumber']}-${element['customerContractName']}`;
    } else if (utils.isEmpty(element['customerContractNumber']) && element['customerContractName']) {
      contractValue = `(Transactional)-${element['customerContractName']}`;
    } else {
      contractValue = '--';
    }
  }
  return contractValue;
}
  amountFormatter(amount: string): string {
    let cargoAmountValue;
    if (amount) {
      const value = amount.toLocaleString();
      if (value.includes('.')) {
        cargoAmountValue = value;
      } else {
        const dataVal = `${value}${'.00'}`;
        cargoAmountValue = dataVal;
      }
    }
    return cargoAmountValue;
  }
  deleteUpdated() {
    this.getGridValues();
    this.toastMessage(this.messageService, 'success', 'Deleted successfully');
    this.addCargoModel.isSplitView = false;
  }
  iterateRowData(rowValues) {
    switch (rowValues['cargoType']) {
      case 'Agreement':
        this.localStore.setDefaultAmount(rowValues['cargoAmount']);
        rowValues['businessUnitCode'] = ['--'];
        break;
      case 'Contract':
      case 'Section':
        rowValues['businessUnitCode'] = ['--'];
        break;
      case 'AgreementBU':
        const agreementbusinessValues = [];
        rowValues['financeBusinessUnitAssociations'].forEach((element, index) => {
          agreementbusinessValues.push(element['financeBusinessUnitCode']);
          rowValues['cargoAmount'] = this.currencyPipe.transform(rowValues['cargoReleaseAmount'], 'USD', 'symbol', '1.2-2');
        });
        rowValues['businessUnitCode'] = agreementbusinessValues;
        break;
      case 'ContractBU':
        const contractbusinessValues = [];
        rowValues['financeBusinessUnitAssociations'].forEach((element, index) => {
          contractbusinessValues.push(element['financeBusinessUnitCode']);
          rowValues['cargoAmount'] = this.currencyPipe.transform(rowValues['cargoReleaseAmount'], 'USD', 'symbol', '1.2-2');
        });
        rowValues['businessUnitCode'] = contractbusinessValues;
        break;
      case 'SectionBU':
        const sectionbusinessValues = [];
        rowValues['financeBusinessUnitAssociations'].forEach((element, index) => {
          sectionbusinessValues.push(element['financeBusinessUnitCode']);
          rowValues['cargoAmount'] = this.currencyPipe.transform(rowValues['cargoReleaseAmount'], 'USD', 'symbol', '1.2-2');
        });
        rowValues['businessUnitCode'] = sectionbusinessValues;
        break;
    }
    return rowValues;
  }
  dateFormatter(value: string): string {
    return moment(value).format('MM/DD/YYYY');
  }
  /**
   * @param {RowData} event
   * @memberof AddCargoComponent
   */
  onRowSelect(event: RowData) {
    this.addCargoModel.rowValue = [];
    if (event.type === 'row' && ((this.createCargo &&
      this.createCargo.createCargoModel.cargoReleaseForm.pristine) || (!this.createCargo))) {
      this.addCargoModel.isSplitView = true;
      this.addCargoModel.isCargoDelete = false;
      this.addCargoModel.selectedCargoList = [];
      this.addCargoModel.deletedCargoList = [];
      this.screenFinder(event);
      this.defaultCargoValue(event['data']);
      this.addCargoModel.rowValue.push(event['data']);
      this.changeDetector.detectChanges();
    } else if (event.type === 'checkbox') {
      this.addCargoModel.isCargoDelete = true;
      this.addCargoModel.isSplitView = false;
      this.addCargoModel.deletedCargoList.push(event['data']);
    } else if (event.type === 'row' && this.createCargo && !this.createCargo.createCargoModel.cargoReleaseForm.pristine) {
      this.addCargoModel.confirmDialog = true;
      this.addCargoModel.selectedCargoList = [];
    }
    this.changeDetector.detectChanges();
  }
  screenFinder(event) {
    this.addCargoModel.index = this.addCargoModel.index + 1;
    if (event['data']['contractAssociation']) {
      this.addCargoModel.screen = `${'editContract'}${this.addCargoModel.index}`;
    } else if (event['data']['sectionAssociation']) {
      this.addCargoModel.screen = `${'editContract'}${this.addCargoModel.index}`;
    } else {
      this.addCargoModel.screen = `${'edit'}${this.addCargoModel.index}`;
    }
  }
  defaultCargoValue(rowValue: CargoDetailListItem) {
    if (rowValue['agreementDefaultIndicator'] === 'Yes') {
      this.addCargoModel.isDefault = true;
    } else {
      this.addCargoModel.isDefault = false;
    }
  }
  /**
   * @param {Event} event
   * @memberof AddCargoComponent
   */
  onRowUnselect(event: Event) {
    const index = this.addCargoModel.deletedCargoList.findIndex(value => value['index'] === event['data']['index']);
    if (index !== -1) {
      this.addCargoModel.deletedCargoList.splice(index, 1);
    }
    if (this.addCargoModel.deletedCargoList.length === 0) {
      this.addCargoModel.isCargoDelete = false;
    }
    this.addCargoModel.isSplitView = false;
  }
  /**
   * @memberof AddCargoComponent
   */
  onAddCargo() {
    this.addCargoModel.isSplitView = true;
    if (utils.isEmpty(this.addCargoModel.cargoList)) {
      this.addCargoModel.isDefault = true;
      this.addCargoModel.screen = 'createDefault';
    } else {
      this.addCargoModel.isDefault = false;
      this.addCargoModel.screen = 'create';
    }
  }
  onClickDelete() {
    this.addCargoModel.isDelete = true;
  }
  /**
     * @memberof AddCargoComponent
     */
  onDelete() {
    this.addCargoModel.isDelete = false;
    const index = this.addCargoModel.deletedCargoList.findIndex(value => value['agreementDefaultIndicator'] === 'Yes');
    if (index === -1) {
      this.addCargoModel.pageLoader = true;
      const deleteParam = {
        existingESDocIDs: this.utilsService.getESDocIDs(this.addCargoModel.deletedCargoList),
        cargoReleaseTypeDTOList: this.utilsService.deletePayloadFramer(this.addCargoModel.deletedCargoList)
      };
      this.addCargoService.deleteGridData(deleteParam, this.addCargoModel.agreementId['customerAgreementID'])
        .pipe(takeWhile(() =>
          this.addCargoModel.isSubscribe)).subscribe((data: Array<DeleteAgreement>) => {
            this.addCargoModel.pageLoader = false;
            this.getGridValues();
            this.onCancel();
            this.toastMessage(this.messageService, 'success', 'Deleted successfully');
          }, (deleteError: Error) => {
            if (deleteError) {
              this.addCargoModel.pageLoader = false;
              this.toastMessage(this.messageService, 'error', deleteError['error']['errors'][0]['errorMessage']);
            }
          });
    } else {
      this.toastMessage(this.messageService, 'error', 'You cannot delete the Default Agreement Cargo Release');
    }
  }
  /**
   * @param {Event} event
   * @memberof AddCargoComponent
   */
  onHeaderCheckboxToggle(event: Event): void {
    if (event['checked'] === true) {
      this.addCargoModel.isCargoDelete = true;
      this.addCargoModel.deletedCargoList = this.addCargoModel.selectedCargoList;
    } else {
      this.addCargoModel.isCargoDelete = false;
      this.addCargoModel.deletedCargoList = [];
    }
  }
  /**
   * @memberof AddCargoComponent
   */
  onCancel() {
    this.addCargoModel.selectedCargoList = [];
    this.addCargoModel.isCargoDelete = false;
  }
  /**
   * @memberof AddCargoComponent
   */
  closeSplitView() {
    this.addCargoModel.confirmDialog = false;
    this.addCargoModel.isSplitView = false;
    this.getGridValues();
    this.addCargoModel.selectedCargoList = [];
    this.addCargoModel.rowValue = [];
  }
  /**
   * @memberof AddCargoComponent
   */
  onBack() {
    if (this.createCargo && (this.addCargoModel.screen === 'createDefault' ||
      !this.createCargo.createCargoModel.cargoReleaseForm.pristine)) {
      this.cargoFormStatus.emit(true);
      this.addCargoModel.isCancel = true;
    } else {
      this.cargoFormStatus.emit(false);
      this.shared.broadcast('stepIndexChange', 'back');
    }
  }

  /**
   * @memberof AddCargoComponent
   */
  onCreateAgreement() {
    this.messageService.clear();
    if (!utils.isEmpty(this.addCargoModel.cargoList) && this.addCargoModel.agreementId) {
      this.validateAgreement();
    } else {
      this.toastMessage(this.messageService, 'error', 'You need to have atleast Agreement Cargo Release for Agreement to be created');
    }
  }
  validateAgreement() {
    if (this.createCargo && (this.addCargoModel.screen === 'createDefault' ||
      !this.createCargo.createCargoModel.cargoReleaseForm.pristine)) {
      this.addCargoModel.isAgreementCancel = true;
    } else {
      this.addCargoModel.pageLoader = true;
      this.onCreateNewAgreement();
    }
  }
  /**
   * @memberof AddCargoComponent
   */
  onCreateNewAgreement() {
    this.addCargoService.createNewAgreement(this.addCargoModel.agreementId['customerAgreementID']).pipe(takeWhile(() =>
      this.addCargoModel.isSubscribe)).subscribe((data: number) => {
        this.addCargoModel.pageLoader = false;
        if (data) {
          this.router.navigate(['/searchagreement']);
          this.toastMessage(this.messageService, 'success',
            `You have successfully created agreement for ${this.addCargoModel.agreementId['customerAgreementName']}`);
        }
      }, (agreementError: Error) => {
        this.addCargoModel.pageLoader = false;
        if (agreementError) {
          this.toastMessage(this.messageService, 'error', agreementError['error']['errors'][0]['errorMessage']);
        }
      });
  }
  /**
   * @memberof AddCargoComponent
   */
  onSave() {
    this.router.navigate(['/searchagreement']);
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
  onClickYes(value: string) {
    switch (value) {
      case 'delete':
        this.onDelete();
        break;
      case 'cancel':
        const timerValue = timer(200);
        timerValue.subscribe((timerData) => {
          this.createCargo.onSave();
        });
        this.addCargoModel.isCancel = false;
        if (utils.isEmpty(this.createCargo.createCargoModel.saveError) && this.createCargo.createCargoModel.isSaveChanges) {
          this.shared.broadcast('stepIndexChange', 'back');
        } else {
          break;
        }
    }
  }
  onClickNo(value: string) {
    switch (value) {
      case 'delete':
        this.addCargoModel.isDelete = false;
        this.addCargoModel.selectedCargoList = [];
        this.addCargoModel.deletedCargoList = [];
        this.addCargoModel.isCargoDelete = false;
        break;
      case 'cancel':
        this.addCargoModel.isCancel = false;
        this.cargoFormStatus.emit(false);
        this.shared.broadcast('stepIndexChange', 'back');
        break;
    }
  }
  onClickCancel() {
    this.addCargoModel.isAgreementCancel = false;
    this.cargoFormStatus.emit(false);
    this.onCreateNewAgreement();
  }
  onClickSave() {
    this.addCargoModel.confirmDialog = false;
    const timerValue = timer(200);
    timerValue.subscribe((timerData) => {
      this.createCargo.onSave();
    });
    this.addCargoModel.isAgreementCancel = false;
    if (utils.isEmpty(this.createCargo.createCargoModel.saveError) && this.createCargo.createCargoModel.isSaveChanges) {
      this.onCreateNewAgreement();
    }
  }
}
