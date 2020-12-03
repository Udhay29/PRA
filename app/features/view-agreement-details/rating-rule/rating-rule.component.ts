import { DatePipe } from '@angular/common';
import { Component, ChangeDetectorRef, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as utils from 'lodash';
import * as moment from 'moment';
import { MessageService } from 'primeng/components/common/messageservice';
import { takeWhile } from 'rxjs/operators';
import { isArray } from 'util';
import { Router } from '@angular/router';

import { RatingsModel } from './model/rating.model';
import { RatingRuleService } from './service/rating-rule.service';
import { RatingRuleQuery } from './query/rating-rule.query';
import { RootObject, HitItems, Associations, Source, CheckRatingRuleParam } from './model/rating.interface';
import { BroadcasterService } from '../../../shared/jbh-app-services/broadcaster.service';
@Component({
    selector: 'app-rating-rule',
    templateUrl: './rating-rule.component.html',
    styleUrls: ['./rating-rule.component.scss'],
    providers: [RatingRuleService, DatePipe]
})
export class RatingRuleComponent implements OnInit {
    @ViewChild('downloadExcel') downloadExcel: ElementRef;
    ratingsModel: RatingsModel;
    constructor(private readonly changeDetector: ChangeDetectorRef, private readonly shared: BroadcasterService,
        public router: Router, private readonly messageService: MessageService,
        private readonly ratingRuleService: RatingRuleService,
        private readonly datePipe: DatePipe) {
        this.ratingsModel = new RatingsModel();
    }

    ngOnInit() {
        this.ratingsModel.agreementID = this.router['currentUrlTree'].queryParams.id;
        RatingRuleService.setElasticparam(RatingRuleQuery.getRatingRuleListQuery(this.ratingsModel.agreementID));
        this.getRateRuleListData();
        this.getOverflowList();
    }
    getOverflowList() {
        this.ratingsModel.dropdownValue = [
            {
                label: 'Manage Column',
                command: (onclick): void => {
                }
            },
            {
                label: 'Export to Excel',
                command: (onclick): void => {
                    this.exportToExcel();
                }
            }
        ];
    }
    exportToExcel() {
        this.ratingsModel.isPageLoading = true;
        const elasticQuery = utils.cloneDeep(RatingRuleService.getElasticparam());
        elasticQuery['size'] = this.ratingsModel.gridDataLength;
        elasticQuery['from'] = 0;
        this.ratingRuleService.downloadRatingRuleExcel(elasticQuery).subscribe(data => {
            this.ratingsModel.isPageLoading = false;
            this.downloadFiles(data, this.downloadExcel);
            this.exportToExcelToastMessage('success', 'Rating Rule Exported',
                'You have successfully exported Rating Rule.');
            this.changeDetector.detectChanges();
        }, (error: Error) => {
            this.ratingsModel.isPageLoading = false;
            this.exportToExcelToastMessage('error', 'Export Failed',
                'Data to export exceeds Excel limitations. Please apply filter(s) and try again.');
            this.changeDetector.detectChanges();
        });
    }
    downloadFiles(data: object, downloadExcel: ElementRef) {
        const convertedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        const fileName = `Rating Rule ${convertedDate} at ${this.datePipe.transform(new Date(), 'hh.mm.ss a')}.xlsx`;
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(data, fileName);
        } else {
            downloadExcel.nativeElement.href = URL.createObjectURL(data);
            downloadExcel.nativeElement.download = fileName;
            downloadExcel.nativeElement.click();
        }
    }
    exportToExcelToastMessage(severityType: string, title: string, messageDetail: string) {
        const message = {
            severity: severityType,
            summary: title,
            detail: messageDetail
        };
        this.messageService.clear();
        this.messageService.add(message);
    }

    getRateRuleListData() {
        const params = RatingRuleService.getElasticparam();
        this.ratingsModel.ratingList = [];
        this.ratingsModel.isShowLoader = true;
        this.ratingRuleService.getRateList(params).pipe(takeWhile(() =>
            this.ratingsModel.isSubscriberFlag)).subscribe((data: RootObject) => {
                this.populateGridData(data);
                this.ratingsModel.isPageLoading = false;
                this.changeDetector.detectChanges();
            }, (error: Error) => {
                this.ratingsModel.ratingList = [];
                this.ratingsModel.noResultFoundFlag = true;
                this.ratingsModel.isPageLoading = false;
                this.toastMessage('error', error.message);
                this.ratingsModel.isShowLoader = false;
                this.changeDetector.detectChanges();
            });
    }

    populateGridData(data: RootObject) {
        if (data && data['hits'] && isArray(data['hits']['hits'])) {
            this.ratingsModel.gridDataLength = data['hits']['total'];
            if (this.ratingsModel.onLoadindicator && this.ratingsModel.gridDataLength) {
                this.ratingsModel.onLoadindicator = false;
            }
            this.ratingsModel.ratingList = this.getFormatedList(data['hits']['hits']);
            this.ratingsModel.noResultFoundFlag = (this.ratingsModel.ratingList.length === 0);
            this.ratingsModel.isShowLoader = false;
            this.changeDetector.detectChanges();
        }
    }
    getFormatedList(data: HitItems[]): HitItems[] {
        const resultset = [];
        utils.forEach(data, (response: HitItems) => {
            if (response && response['_source']) {
                response['_source']['Contract'] = this.getMergedList(response['_source']['contractAssociations'], 'contractDisplayName');
                response['_source']['citySubstitutionMesurementUnit'] = this.getCityMesurement(response['_source']);
                response['_source']['BusinessUnitServiceOffering'] = this.getMergedList(
                    response['_source']['financeBusinessUnitServiceOfferingAssociations'], 'financeBusinessUnitServiceOfferingDisplayName');
                response['_source']['SectionName'] = this.getMergedList(response['_source']['sectionAssociations']
                    , 'customerAgreementContractSectionName');
                response['_source']['RatingRuleEffectiveDate'] =
                    moment(response['_source']['effectiveDate']).format('MM/DD/YYYY');
                response['_source']['RatingRuleExpirationDate'] =
                    moment(response['_source']['expirationDate']).format('MM/DD/YYYY');
                resultset.push(response['_source']);
            }
        });
        return resultset;
    }
    getCityMesurement(cityVal: Source): string {
        const cityUnit = (cityVal['citySubstitutionRadiusValue']) ? cityVal['citySubstitutionRadiusValue'] : '';
        const cityMeasure = (cityVal['citySubstitutionMeasurementUnit']) ? cityVal['citySubstitutionMeasurementUnit'] : '';
        if (cityUnit) {
            return `${cityUnit} ${cityMeasure} Radius`;
        } else {
            return 'No';
        }
    }
    getMergedList(data: Associations[], currentKey: string) {
        const tempList = [];
        utils.forEach(data, (response: Associations) => {
            if (response && response[currentKey]) {
                tempList.push(response[currentKey]);
            }
        });
        return tempList;
    }
    loadGridData(event: Event) {
        if (event && this.ratingsModel.allowPagination) {
            const elasticQuery = RatingRuleService.getElasticparam();
            elasticQuery['size'] = event['rows'];
            elasticQuery['from'] = event['first'];
            this.ratingsModel.tableSize = event['rows'];
            this.sortGridData(elasticQuery, event);
            RatingRuleService.setElasticparam(elasticQuery);
            this.getRateRuleListData();
        }
        this.ratingsModel.allowPagination = true;
    }
    sortGridData(elasticQuery: object, event: Event) {
        if (event && event['sortField'] && event['sortOrder']) {
            const field = this.ratingsModel.getFieldNames[event['sortField']];
            const rootVal = this.ratingsModel.getNestedRootVal[event['sortField']];
            elasticQuery['sort'] = [];
            elasticQuery['sort'][0] = {};
            elasticQuery['sort'][0][field] = {};
            elasticQuery['sort'][0][field]['order'] = event['sortOrder'] === 1 ? 'asc' : 'desc';
            elasticQuery['sort'][0][field]['missing'] = event['sortOrder'] === 1 ? '_first' : '_last';
            if (rootVal) {
                elasticQuery['sort'][0][field]['nested_path'] = rootVal;
                elasticQuery['sort'][0][field]['mode'] = 'min';
            }
        }
    }
    toastMessage(key: string, data: string, messageTobeDisplaye?: string) {
        const message = {
            severity: key,
            summary: (key === 'error') ? 'Error' : 'Success',
            detail: data
        };
        this.messageService.clear();
        this.messageService.add(message);
    }
    createRatingRule(defaultFlag: boolean, createFlag: boolean) {
        this.shared.broadcast('ratingruledetails', {
            agreementId: this.ratingsModel.agreementID,
            isAgreementDefault: defaultFlag,
            isCreate: createFlag
        });
        this.router.navigate(['/viewagreement/ratingrule'], { skipLocationChange: true });
    }

    onRowSelect(event) {
        this.ratingsModel.uniqueDocID = event.data['uniqueDocID'];
        this.ratingsModel.filterFlag = false;
        if (event.type === 'row' && !utils.isEmpty(event['data'])) {
            this.ratingsModel.isSplitView = true;
        }
    }

    closeClick(event: Event) {
        this.ratingsModel.isSplitView = false;
    }
    closeOnInactivate(event) {
        this.ratingsModel.isSplitView = false;
        this.getRateRuleListData();
    }

    checkRatingRule() {
        const param: CheckRatingRuleParam = { customerAgreementID: this.ratingsModel.agreementID };
        this.ratingRuleService.checkRatingRule(param).pipe(takeWhile(() =>
            this.ratingsModel.isSubscriberFlag)).subscribe((exist: boolean) => {
                this.createRatingRule(!exist, true);
                this.changeDetector.detectChanges();
            });
    }

    onFilterClick() {
        this.ratingsModel.filterFlag = !this.ratingsModel.filterFlag;
        this.ratingsModel.isSplitView = false;
    }
    onLoadFilter(event) {
        this.getRateRuleListData();
    }
    getGridValues(event) {
        this.ratingsModel.isSplitView = false;
        const enteredValue = (event.target && event.target['value']) ? event.target['value'] : '';
        const currentQuery = RatingRuleService.getElasticparam();
        currentQuery['from'] = 0;
        utils.forEach(currentQuery['query']['bool']['must'][2]['bool']['should'], (query) => {
            if (query['nested']) {
                query['nested']['query']['query_string']['query'] = `*${enteredValue.replace(/[^a-zA-Z0-9]/gi, '\\$&')}*`;
            } else {
                query['query_string']['query'] = `*${enteredValue.replace(/[^a-zA-Z0-9]/gi, '\\$&')}*`;
            }
        });
        RatingRuleService.setElasticparam(currentQuery);
        this.getRateRuleListData();
    }
    setDateRange(field, enteredValue, query, matchArray) {
        if (enteredValue && matchArray !== null && Array.isArray(matchArray) && moment(enteredValue).isValid()) {
            query['range'][field]['gte'] =
                `*${enteredValue.replace(/[!?:\\['^~=\//\\{},.&&||<>()+*\]]/g, ' ')}*`;
            query['range'][field]['lte'] =
                `*${enteredValue.replace(/[!?:\\['^~=\//\\{},.&&||<>()+*\]]/g, ' ')}*`;
        } else {
            query['range'][field]['gte'] = this.ratingsModel.defaultStartDate;
            query['range'][field]['lte'] = this.ratingsModel.defaultEndDate;
        }
    }
    frameDateSearchQuery(enteredValue: string, query: RootObject) {
        query[0]['query_string']['query'] = `${enteredValue}*`;
        query[0]['query_string']['fields'] = this.ratingsModel.defaultSearchFields;
        query[4] = this.ratingsModel.effectiveDateRange;
        query[4].range['RatingRuleEffectiveDate'].gte = enteredValue;
        query[4].range['RatingRuleEffectiveDate'].lte = enteredValue;
        query[5] = this.ratingsModel.expirationDateRange;
        query[5].range['RatingRuleExpirationDate'].gte = enteredValue;
        query[5].range['RatingRuleExpirationDate'].lte = enteredValue;
    }
    onClickRatingRuleOverflowIcon(menu, event) {
        if (!this.ratingsModel.noResultFoundFlag) {
            menu.toggle(event);
        }
    }
    setPaginator() {
        if (this.ratingsModel.gridDataLength) {
            return true;
        } else {
            return false;
        }
    }
}
