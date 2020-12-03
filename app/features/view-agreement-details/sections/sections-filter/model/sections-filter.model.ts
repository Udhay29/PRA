import { FormGroup } from '@angular/forms';

const SectionRangeEffDate = 'SectionRanges.SectionEffectiveDate';
const SectionRangeExpDate = 'SectionRanges.SectionExpirationDate';
export class SectionsFilterModel {
      filterForm: FormGroup;
      isPanelClosed: boolean;
      statusList: Array<object>;
      sourceData: object;
      agreementID: number;
      isInputFlag: boolean;
      selectedList: Array<string>;
      filterParams: object;
      selectedTransitMode: string[];
      isSubscribeFlag: boolean;
      selectedBU;
      tempArray: string[];
      tempAllBU: string[];
      tempFilterValue: string[];
      createdOnDate: string;
      createdOnTime: string;
      updatedOnDate: string;
      updatedOnTime: string;
      isCreatedFlag: boolean;
      isUpdatedFlag: boolean;
      createTimeStamp: string;
      esDateFormat: string;
      esDateTimeFormat: string;
      dateFormat: string;
      dateTimeFormat: string;
      lastUpdateTimestamp: string;
      statusSelectedList: Array<object>;
      isStatusFilter: boolean;
      filterDefaultFields:  Array < object >;
      isStatus: boolean;

      constructor() {
        this.createTimeStamp = 'SectionRanges.CreateTimestamp';
        this.lastUpdateTimestamp = 'SectionRanges.LastUpdateTimestamp';
            this.isInputFlag = true;
            this.selectedList = [];
            this.filterParams = {};
            this.tempArray = [];
            this.tempFilterValue = [];
            this.tempAllBU = [];
            this.isCreatedFlag = false;
            this.isUpdatedFlag = false;
            this.esDateFormat = 'yyyy-MM-dd';
            this.esDateTimeFormat = `yyyy-MM-dd'T'HH:mm`;
            this.dateFormat = 'YYYY-MM-DD';
            this.dateTimeFormat = 'YYYY-MM-DDTHH:mm';
            this.isPanelClosed = true;
            this.statusList = [
            ];
            this.isStatusFilter = true;
            this.filterDefaultFields = [
                  {
                        'name': 'SectionName',
                        'defaultField': 'SectionRanges.SectionName.keyword'
                  },
                  {
                        'name': 'SectionType',
                        'defaultField': 'SectionRanges.SectionTypeName.keyword'
                  },
                  {
                        'name': 'CurrencyCode',
                        'defaultField': 'SectionRanges.SectionCurrencyCode.keyword'
                  },
                  {
                        'name': 'ContractDisplayName',
                        'defaultField': 'SectionRanges.contractDisplayName.keyword'
                  },
                  {
                        'name': 'LastUpdateUser',
                        'defaultField': 'SectionRanges.LastUpdateUser.keyword'
                  },
                  {
                        'name': 'LastUpdateProgram',
                        'defaultField': 'SectionRanges.LastUpdateProgram.keyword'
                  },
                  {
                        'name': 'CreateUser',
                        'defaultField': 'SectionRanges.CreateUser.keyword'
                  },
                  {
                        'name': 'CreateProgram',
                        'defaultField': 'SectionRanges.CreateProgram.keyword'
                  },
                  {
                        'name': 'LastUpdateProgram',
                        'defaultField': 'SectionRanges.LastUpdateProgram.keyword'
                  },
                  {
                        'name': 'CreateTimeStamp',
                        'defaultField': this.createTimeStamp
                  },
                  {
                        'name': 'LastUpdateTimestamp',
                        'defaultField': this.lastUpdateTimestamp
                  },
                  {
                        'name': 'BillingPartyDisplayName',
                        'defaultField': 'SectionRanges.BillToCodes.billingPartyDisplayName.keyword'
                  }

            ];
      }
}
