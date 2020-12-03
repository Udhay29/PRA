
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit,
  Output
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';
import { MessageService } from 'primeng/components/common/messageservice';
import { Message } from 'primeng/api';

import { AdvanceSearchService } from './services/advance-search.service';
import { AdvanceSearchUtilityService } from './services/advance-search-utility.service';
import { AdvanceSearchModel } from './model/advance-search.model';
import { AdvanceSearchQuery } from './query/advance-search.query';
import {
  AgreementTypesResponse, AgreementResultList, AgreementTypesItem, BillToResultList, Buckets, ContractResultList, CarrierNameList,
   RootObject,
  ByContractName, HitsItem
} from './model/advance-search-interface';
import { SearchGridQuery } from './../search-grid/query/search-grid.query';

@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvanceSearchComponent implements OnInit, OnDestroy {
  @Output() searchCall: EventEmitter<object> = new EventEmitter<object>();
  @Output() resetCall: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() resetTable: EventEmitter<boolean> = new EventEmitter<boolean>();
  advanceSearchModel: AdvanceSearchModel;
  searchGridQuery: SearchGridQuery;
  msgs: Message[] = [];
  constructor(private readonly advanceSearchService: AdvanceSearchService, private readonly messageService: MessageService,
    private readonly changeDetector: ChangeDetectorRef, private readonly formBuilder: FormBuilder) {
    this.advanceSearchModel = new AdvanceSearchModel();
    this.searchGridQuery = new SearchGridQuery;
  }
  ngOnInit() {
    this.advanceSearchModel.advanceSearchForm = AdvanceSearchUtilityService.getAdvanceSearchForm(this.formBuilder);
    this.getAgreementTypeList();
    this.getCodeStatusList();
    this.getAgreementStatusList();
    this.onSearchTeamsList();
  }
  ngOnDestroy() {
    this.advanceSearchModel.isSubscriberFlag = false;
  }

  onClearSearch() {
    this.advanceSearchModel.advanceSearchForm.reset();
    this.advanceSearchModel.isShowError = false;
    this.advanceSearchModel.isCarrierFlag = false;
    this.resetCall.emit(true);
    this.resetMandatoryFields();
    AdvanceSearchUtilityService.getAdvanceSearchForm(this.formBuilder);
    this.getAgreementTypeList();
    this.changeDetector.detectChanges();
  }
  onSearchTeamsRemove(event: string, controlName: string) {
    if (this.advanceSearchModel.advanceSearchForm.controls[controlName].value &&
      !event) {
      this.advanceSearchModel.advanceSearchForm.controls[controlName].setValue(null);
    }
  }
  onClickSearch() {
    this.onChangeSearchFields();
    if (!this.advanceSearchModel.isShowError && this.advanceSearchModel.advanceSearchForm.valid) {
      this.resetTable.emit(true);
      this.searchAgreement();
    } else {
      this.msgs = [];
      this.msgs.push({
        severity: 'error',
        summary: 'Missing Required Information',
        detail: 'Provide at least one of the highlighted fields'
      });
      this.resetCall.emit(true);
    }
  }
  searchAgreement() {
    if (!this.advanceSearchModel.isCarrierFlag) {
      const query = AdvanceSearchUtilityService.createQuery(this.advanceSearchModel.advanceSearchForm,
        this.searchGridQuery.searchQuery, this.searchGridQuery.findKeyString, this.advanceSearchModel);
        query['from'] = 0;
      this.searchCall.emit({ 'query': query, 'errorMsg': this.advanceSearchModel.advanceSearchFormValue ,
       'carrierFlag' : this.advanceSearchModel.isCarrierFlag});
      this.resetCall.emit(false);
      } else {
        const query = SearchGridQuery.getCarrierSearchQuery();
        AdvanceSearchUtilityService.createCarrierSearchQuery(this.advanceSearchModel.
          advanceSearchForm, query, this.searchGridQuery.findkeyCarrierString, this.advanceSearchModel);
          this.searchCall.emit({ 'query': query, 'errorMsg': this.advanceSearchModel.advanceSearchFormValue,
          'carrierFlag' : this.advanceSearchModel.isCarrierFlag });
          this.resetCall.emit(false);
      }
  }
  onSearchAgreementType(event: string) {
    this.advanceSearchModel.validateFlag = false;
    this.advanceSearchModel.isAgreementType = false;
    this.advanceSearchModel.filteredAgreementType = AdvanceSearchUtilityService.searchAgreementType(event,
      this.advanceSearchModel, 'agreementTypeList');
    this.fieldValidation('agreementType', this.advanceSearchModel.validateFlag);
  }
  onSearchCodeStatus(event: string) {
    this.advanceSearchModel.filteredCodeStatus = AdvanceSearchUtilityService.searchAgreementType(event,
      this.advanceSearchModel, 'codeStatusList');
  }
  onSearchTeams(event: string) {
    this.advanceSearchModel.filteredTeamsList = AdvanceSearchUtilityService.searchTeams(event, this.advanceSearchModel);
  }
  onSearchAgreementStatus(event: string) {
    this.advanceSearchModel.filteredAgreementStatus = AdvanceSearchUtilityService.searchAgreementType(event,
      this.advanceSearchModel, 'agreementStatusList');
  }
  onSearchCarrierStatus(event: string, fieldName: string) {
    (fieldName === 'carrierStatus') ? this.advanceSearchModel.carrierFilteredCarrierStatus =
     AdvanceSearchUtilityService.searchAgreementType(event,
      this.advanceSearchModel, 'carrierStatus') : this.advanceSearchModel.carrierFilteredAgreementStatus =
       AdvanceSearchUtilityService.searchAgreementType(event,
        this.advanceSearchModel, 'agreementStatus' );
  }

  getCodeStatusList() {
    this.advanceSearchService.getCodeStatus('customerAgreementSection').pipe(takeWhile(() => this.advanceSearchModel.isSubscriberFlag))
      .subscribe((data: string[]) => {
        if (!utils.isEmpty(data)) {
          this.advanceSearchModel.codeStatusList = utils.
            cloneDeep(AdvanceSearchUtilityService.getStatus(data));
        }
        this.changeDetector.detectChanges();
      }, (error: Error) => {
        this.advanceSearchModel.codeStatusList = [];
        this.changeDetector.detectChanges();
      });
    this.advanceSearchModel.filteredCodeStatus = utils.cloneDeep(this.advanceSearchModel.codeStatusList);
  }

  getAgreementStatusList() {
    this.advanceSearchService.getCodeStatus('customerAgreement').pipe(takeWhile(() => this.advanceSearchModel.isSubscriberFlag)).
      subscribe((data: string[]) => {
        if (!utils.isEmpty(data)) {
          this.advanceSearchModel.agreementStatusList = utils.
            cloneDeep(AdvanceSearchUtilityService.getStatus(data));
        }
        this.changeDetector.detectChanges();
      }, (error: Error) => {
        this.advanceSearchModel.agreementStatusList = [];
        this.changeDetector.detectChanges();
      });
    this.advanceSearchModel.filteredAgreementStatus = utils.cloneDeep(this.advanceSearchModel.agreementStatusList);
  }
  getCarrierStatusList(value: string) {
    const field = `${value}Status`;
    const filterField = `carrierFiltered${value}Status`;
    const params = value === 'carrier' ? value : 'carrierAgreement';
    this.advanceSearchService.getCarrierStatus(params).pipe(takeWhile(() => this.advanceSearchModel.isSubscriberFlag))
    .subscribe((data: string[]) => {
      if (!utils.isEmpty(data)) {
        this.advanceSearchModel[field] = utils.cloneDeep(AdvanceSearchUtilityService.getStatus(data));
      }
      this.advanceSearchModel[filterField] = utils.cloneDeep(this.advanceSearchModel[field]);
      AdvanceSearchUtilityService.setDefaultstatus(this.advanceSearchModel, field);
      if (value === 'carrier') {
        this.advanceSearchModel.carrierStatusFlag = false;
      }
      this.changeDetector.detectChanges();
    }, (error: Error) => {
      this.advanceSearchModel[field] = [];
      this.changeDetector.detectChanges();
    });
  }
  getAgreementTypeList() {
    this.advanceSearchModel.isPageLoading = true;
    this.advanceSearchService.getAgreementType().pipe(takeWhile(() => this.advanceSearchModel.isSubscriberFlag)).
      subscribe((data: AgreementTypesResponse) => {
        this.advanceSearchModel.isPageLoading = false;
        if (!utils.isEmpty(data) && !utils.isEmpty(data._embedded) && !utils.isEmpty(data._embedded['agreementTypes'])) {
          utils.forEach(data._embedded['agreementTypes'], (value: AgreementTypesItem) => {
            this.advanceSearchModel.agreementTypeList = utils.
              cloneDeep(AdvanceSearchUtilityService.getAgreement(data['_embedded'].agreementTypes));
          });
        }
        AdvanceSearchUtilityService.setDefaultAgreementType(this.advanceSearchModel);
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.advanceSearchModel.isPageLoading = false;
        this.advanceSearchModel.agreementTypeList = [];
        if (error && error.status >= 500) {
          AdvanceSearchUtilityService.toastMessage(this.messageService, 'error',
           'Pricing Configuration System is currently unavailable.  Contact help desk');
        } else {
        AdvanceSearchUtilityService.toastMessage(this.messageService, 'error', error.message);
        }
        this.changeDetector.detectChanges();
      });
    this.advanceSearchModel.filteredAgreementType = utils.cloneDeep(this.advanceSearchModel.agreementTypeList);
  }

  onChangeSearchFields() {
    const formFields = this.advanceSearchModel.isCarrierFlag ? ['carrierAgreement', 'carrier'] :
     ['agreement', 'contract', 'billTo', 'carrierCode', 'operationalTeam'];
    utils.forEach(formFields, (controlName: string) => {
      if (this.advanceSearchModel.advanceSearchForm.get(controlName).value) {
        this.advanceSearchModel.isMandatoryFlag = true;
        return false;
      } else {
        this.advanceSearchModel.isMandatoryFlag = false;
      }
    });
    AdvanceSearchUtilityService.checkMandatoryFields(this.advanceSearchModel, formFields);
  }

  onClearValue(event: string, controlName: string) {
    if (utils.isEmpty(event)) {
      this.advanceSearchModel.advanceSearchForm.controls[controlName].setValue(null);
    }
    if (controlName === 'carrier') {
      this.advanceSearchModel.carrierStatusFlag = true;
      this.advanceSearchModel.advanceSearchForm.controls['carrierStatus'].reset();
    }
  }
  onClearAgreementType(event: string) {
    if (utils.isEmpty(event)) {
      this.advanceSearchModel.isAgreementType = true;
    }
  }

  onSearchAgreementName(event: string) {
    const query = AdvanceSearchQuery.getAgreementNameQuery(event);
    this.advanceSearchService.getSearchResults(query).pipe(takeWhile(() => this.advanceSearchModel.isSubscriberFlag)).
      subscribe((data: RootObject) => {
        const resultList = [];
        if (!utils.isEmpty(data) && !utils.isEmpty(data.aggregations) && !utils.isEmpty(data.aggregations.group_by_description) &&
          !utils.isEmpty(data.aggregations.group_by_description.buckets) && data.aggregations.group_by_description.buckets.length) {
          utils.forEach(data.aggregations.group_by_description.buckets, (result: Buckets) => {
            resultList.push(this.formatAgreementName(result));
          });
        }
        this.advanceSearchModel.agreementNameList = resultList;
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.advanceSearchModel.agreementNameList = [];
        AdvanceSearchUtilityService.toastMessage(this.messageService, 'error', error.message);
        this.changeDetector.detectChanges();
      });
  }

  formatAgreementName(result: Buckets): AgreementResultList {
    const resultSet = {
      AgreementName: ''
    };
    if (!utils.isEmpty(result) && !utils.isEmpty(result.key)) {
      resultSet.AgreementName = result.key;
    }
    return resultSet;
  }

  onSearchContract(event: string) {
    let query: object;
    query = AdvanceSearchQuery.getContractNameQuery(event);
    this.advanceSearchService.getSearchResults(query).pipe(takeWhile(() => this.advanceSearchModel.isSubscriberFlag)).
      subscribe((data: RootObject) => {
        this.advanceSearchModel.contractNameList = [];
        if (!utils.isEmpty(data) && !utils.isEmpty(data.aggregations) && !utils.isEmpty(data.aggregations.nesting)
          && !utils.isEmpty(data.aggregations.nesting.by_contractName) && !utils.isEmpty(data.aggregations.
            nesting.by_contractName.buckets) && data.aggregations.nesting.by_contractName.buckets.length) {
          this.advanceSearchModel.contractNameList = this.formatContract(data.aggregations.nesting.by_contractName.buckets);
        }
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.advanceSearchModel.contractNameList = [];
        AdvanceSearchUtilityService.toastMessage(this.messageService, 'error', error.message);
        this.changeDetector.detectChanges();
      });
  }

  formatContract(resultList: Array<object>): ContractResultList[] {
    const resultData = [];
    utils.forEach(resultList, (data: Buckets) => {
      let resultSet = {
        Contract: ''
      };
      if (!utils.isEmpty(data.by_ContractNumber) && !utils.isEmpty(data.by_ContractNumber.buckets) &&
        data.by_ContractNumber.buckets.length) {
        utils.forEach(data.by_ContractNumber.buckets, (value: Buckets) => {
          resultSet.Contract = value.key;
          resultData.push(resultSet);
          resultSet = JSON.parse(JSON.stringify(resultSet));
        });
      }
    });
    return resultData;
  }

  onSearchBillTo(event: string) {
    const query = AdvanceSearchQuery.getBillToQuery(event);
    this.advanceSearchService.getSearchResults(query).pipe(takeWhile(() => this.advanceSearchModel.isSubscriberFlag)).
      subscribe((data: RootObject) => {
        const resultList = [];
        if (!utils.isEmpty(data) && !utils.isEmpty(data.aggregations) && !utils.isEmpty(data.aggregations.nesting) &&
          !utils.isEmpty(data.aggregations.nesting.by_BillingPartyCode.by_BillingPartyName) &&
          !utils.isEmpty(data.aggregations.nesting.by_BillingPartyCode.by_BillingPartyName.
            buckets) && data.aggregations.nesting.by_BillingPartyCode.by_BillingPartyName.buckets.length) {
          this.advanceSearchModel.billToList = this.formatBillTo(data.aggregations.nesting.by_BillingPartyCode.by_BillingPartyName.buckets);
        } else {
          this.advanceSearchModel.billToList = [];
        }
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.advanceSearchModel.billToList = [];
        AdvanceSearchUtilityService.toastMessage(this.messageService, 'error', error.message);
        this.changeDetector.detectChanges();
      });
  }

  formatBillTo(dataList: Buckets[]): BillToResultList[] {
    const resultData = [];
    utils.forEach(dataList, (result: Buckets) => {
      let resultSet = {
        BillToCode: '',
        PartyName: '',
        PartyCode: ''
      };
      if (!utils.isEmpty(result) && !utils.isEmpty(result.key)) {
        resultSet.PartyName = result.key;
        if (!utils.isEmpty(result.by_BillingPartyCode) && !utils.isEmpty(result.by_BillingPartyCode.buckets)) {
          utils.forEach(result.by_BillingPartyCode.buckets, (value: Buckets) => {
            resultSet.PartyCode = value.key;
            resultSet.BillToCode = `${resultSet.PartyName} (${resultSet.PartyCode})`;
            resultData.push(resultSet);
            resultSet = JSON.parse(JSON.stringify(resultSet));
          });
        }
      }
    });
    return resultData;
  }

  onSearchTeamsList() {
    const query = AdvanceSearchQuery.getTeamsQuery();
    this.advanceSearchService.getSearchResults(query).pipe(takeWhile(() => this.advanceSearchModel.isSubscriberFlag))
      .subscribe((data: RootObject) => {
        const resultList = [];
        if (!utils.isEmpty(data) && !utils.isEmpty(data.aggregations) && !utils.isEmpty(data.aggregations.nesting) &&
          !utils.isEmpty(data.aggregations.nesting.by_teamName) && !utils.isEmpty(data.aggregations.nesting.by_teamName.buckets)
          && data.aggregations.nesting.by_teamName.buckets.length) {
          utils.forEach(data.aggregations.nesting.by_teamName.buckets, (result: Buckets) => {
            resultList.push(this.formatTeams(result));
          });
        }
        this.advanceSearchModel.teamsList = resultList;
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.advanceSearchModel.teamsList = [];
        AdvanceSearchUtilityService.toastMessage(this.messageService, 'error', error.message);
        this.changeDetector.detectChanges();
      });
    this.advanceSearchModel.filteredTeamsList = utils.cloneDeep(this.advanceSearchModel.teamsList);
  }

  formatTeams(result: Buckets) {
    const resultSet = {
      label: '',
      value: ''
    };
    if (!utils.isEmpty(result) && !utils.isEmpty(result.key)) {
      resultSet.label = result.key;
      resultSet.value = result.key;
      return resultSet;
    }
  }
  fieldValidation(formcontrol: string, validateFlag: boolean) {
    if (validateFlag) {
      AdvanceSearchUtilityService.checkValidation(formcontrol, this.advanceSearchModel, false, false);
    } else {
      AdvanceSearchUtilityService.checkValidation(formcontrol, this.advanceSearchModel, true, true);
    }
  }
  onChangeAgreementType(event) {
    if (event && event.label.toLowerCase() === 'carrier') {
      this.advanceSearchModel.isCarrierFlag = true;
      this.advanceSearchModel.carrierStatusFlag = true;
      this.getCarrierStatusList('agreement');
    } else {
      this.advanceSearchModel.isCarrierFlag = false;
    }
    this.resetMandatoryFields();
    const advancedFormControl = this.advanceSearchModel.advanceSearchForm.controls;
    for (const controlName in advancedFormControl) {
      if (advancedFormControl[controlName] && advancedFormControl[controlName].value &&
        controlName !== 'agreementType' && (controlName !== 'CarrierAgreementStatus' || event.label.toLowerCase() !== 'carrier')) {
          advancedFormControl[controlName].reset();
          this.advanceSearchModel.isShowError = false;
        }
    }
  }
  resetMandatoryFields() {
    const formFields = ['carrierAgreement', 'carrier', 'agreement', 'contract', 'billTo', 'carrierCode', 'operationalTeam'];
    utils.forEach(formFields, (value: string) => {
        this.advanceSearchModel.advanceSearchForm.controls[value].setValidators([]);
        this.advanceSearchModel.advanceSearchForm.controls[value].updateValueAndValidity();
        this.advanceSearchModel.isShowError = false;
      });
  }
  onSearchCarrierAgreementName(event: string) {
    const query = AdvanceSearchQuery.getCarrierAgreementNameQuery(event);
    this.advanceSearchService.getCarrierSearchResults(query).pipe(takeWhile(() => this.advanceSearchModel.isSubscriberFlag)).
      subscribe((data: RootObject) => {
        const resultList = [];
        if (!utils.isEmpty(data) && !utils.isEmpty(data.hits) && !utils.isEmpty(data.hits.hits) && data.hits.hits.length) {
          utils.forEach(data.hits.hits, (result: HitsItem) => {
            resultList.push(this.formatCarrierAgreementName(result));
          });
        }
        this.advanceSearchModel.carrierAgreementNameList = resultList;
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.advanceSearchModel.carrierAgreementNameList = [];
        AdvanceSearchUtilityService.toastMessage(this.messageService, 'error', error.message);
        this.changeDetector.detectChanges();
      });
  }
  formatCarrierAgreementName(result: HitsItem): CarrierNameList {
    const resultSet = {
      CarrierAgreementName: ''
    };
    if (!utils.isEmpty(result) && !utils.isEmpty(result._source) && !utils.isEmpty(result._source.carrierAgreementName)) {
      resultSet.CarrierAgreementName = result._source.carrierAgreementName;
    }
    return resultSet;
  }
  onSearchCarrier(event: string) {
    const query = AdvanceSearchQuery.getCarrierNameQuery(event);
    this.advanceSearchService.getCarrierSearchResults(query).pipe(takeWhile(() => this.advanceSearchModel.isSubscriberFlag)).
      subscribe((data: any) => {
        this.advanceSearchModel.carrierList = [];
        if (!utils.isEmpty(data) && !utils.isEmpty(data.aggregations) && !utils.isEmpty(data.aggregations.nesting) &&
          !utils.isEmpty(data.aggregations.nesting.by_BillingPartyCode.by_BillingPartyName.buckets)
          && data.aggregations.nesting.by_BillingPartyCode.by_BillingPartyName.buckets.length) {
            this.advanceSearchModel.carrierList =
            this.formatCarrierName(data.aggregations.nesting.by_BillingPartyCode.by_BillingPartyName.buckets);
        }
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.advanceSearchModel.carrierList = [];
        AdvanceSearchUtilityService.toastMessage(this.messageService, 'error', error.message);
        this.changeDetector.detectChanges();
      });
  }
  formatCarrierName(result: any): CarrierNameList[] {
    const resultData = [];
    utils.forEach(result, (data: any) => {
      if (data && data.hits && data.hits.hits && data.hits.hits.hits && data.hits.hits.hits.length &&
        data.hits.hits.hits[0]._source && data.hits.hits.hits[0]._source.carrierDisplayName) {
          resultData.push({
            CarrierName: data.hits.hits.hits[0]._source.carrierDisplayName
          });
        }
    });
    return resultData;
  }
  onSelectCarrier(event) {
    this.getCarrierStatusList('carrier');
  }
}
