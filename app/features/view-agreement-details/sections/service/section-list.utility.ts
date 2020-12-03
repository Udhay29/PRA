import { Injectable } from '@angular/core';
import * as utils from 'lodash';

import { MenuItem } from 'primeng/api';
import { Section, VersionBillToList, Hits } from '../model/sections.interface';
import * as moment from 'moment';
import { TimeZoneService } from '../../../../shared/jbh-app-services/time-zone.service';
import { SectionsModel } from '../model/sections.model';

@Injectable()
export class SectionListUtility {
  sectionsModel: SectionsModel;
  constructor(
    private readonly timeZoneService: TimeZoneService,
  ) {
    this.sectionsModel = new SectionsModel();
  }
  getSectionRangesDetails(response: Hits) {
    const sectionDetails = [];
    utils.forEach(response['inner_hits']['SectionRanges']['hits']['hits'], (sectionRanges: Section, index) => {
      const sectionSource = sectionRanges['_source'];
      let resultSetSectionRanges = null;
      resultSetSectionRanges = this.formatListData(sectionSource);
      const billToCodes = this.getSelectedCodes(sectionSource.BillToCodes);
      resultSetSectionRanges['ContractTypeDisplay'] = sectionSource['contractDisplayName'];
      resultSetSectionRanges['Status'] = this.getStatusData(sectionSource);
      resultSetSectionRanges['AgreementID'] = response['_source']['AgreementID'];
      resultSetSectionRanges['ContractNumber'] = response['_source']['ContractNumber'];
      resultSetSectionRanges['ContractID'] = response['_source']['ContractID'];
      resultSetSectionRanges['SectionID'] = response['_source']['SectionID'];
      resultSetSectionRanges['toolTipForBillTo'] = billToCodes.length > 0 ? billToCodes.join('\n') : '--';
      resultSetSectionRanges['BillingPartyCode'] = billToCodes.length > 0 ? billToCodes : ['--'];
      sectionDetails.push(resultSetSectionRanges);
    });
    return sectionDetails;
  }
  formatListData(resultSetDataSectionRanges: Section): Section {
    const keySets = Object.keys(resultSetDataSectionRanges);
    utils.forEach(keySets, (key: string) => {
      resultSetDataSectionRanges[key] = resultSetDataSectionRanges[key] ? resultSetDataSectionRanges[key] : '--';
    });
    resultSetDataSectionRanges.SectionEffectiveDate = resultSetDataSectionRanges.SectionEffectiveDate
      ? moment(resultSetDataSectionRanges.SectionEffectiveDate).format(this.sectionsModel.dateFormat) : '--';
    resultSetDataSectionRanges.SectionExpirationDate = resultSetDataSectionRanges.SectionExpirationDate
      ? moment(resultSetDataSectionRanges.SectionExpirationDate).format(this.sectionsModel.dateFormat) : '--';
      resultSetDataSectionRanges.SectionOriginalEffectiveDate = resultSetDataSectionRanges.SectionOriginalEffectiveDate
      ? moment(resultSetDataSectionRanges.SectionOriginalEffectiveDate).format(this.sectionsModel.dateFormat) : '--';
      resultSetDataSectionRanges.SectionOriginalExpirationDate = resultSetDataSectionRanges.SectionOriginalExpirationDate
      ? moment(resultSetDataSectionRanges.SectionOriginalExpirationDate).format(this.sectionsModel.dateFormat) : '--';

      resultSetDataSectionRanges.LastUpdateTimestamp = this.timeZoneService.convertToLocalMilitaryTime
      (resultSetDataSectionRanges.LastUpdateTimestamp);
      resultSetDataSectionRanges.CreateTimestamp = this.timeZoneService.convertToLocalMilitaryTime
      (resultSetDataSectionRanges.CreateTimestamp);

    return resultSetDataSectionRanges;
  }
  getSelectedCodes(data: VersionBillToList[]): string[] {
    const selectedCode = [];
    if (!utils.isEmpty(data)) {
      utils.forEach(data, (list: VersionBillToList) => {
        selectedCode.push(`${list.billingPartyDisplayName}`);
      });
    }
    return selectedCode;
  }
  getStatusData(sectionSource: Section) {
    const expirationDate = new Date(sectionSource['SectionExpirationDate']);
    const currDate = new Date();
    const prevDate = new Date();
    prevDate.setDate(prevDate.getDate() - 1);
    currDate.setHours(0, 0, 0, 0);
    prevDate.setHours(0, 0, 0, 0);
    const sourceSection = {
      invalidReasonTypeActive: 'Active',
      invalidReasonTypeInactive: 'Inactive',
      invalidReasonTypeDeleted: 'Deleted',
      invalidIndicatorYes: 'Y',
      invalidIndicatorNo: 'N',
    };
    if (sectionSource['SectionInvalidReasonType'] === sourceSection['invalidReasonTypeActive']
      && sectionSource['SectionInvalidIndicator'] === sourceSection['invalidIndicatorNo'] && expirationDate >= currDate) {
      return sourceSection['invalidReasonTypeActive'];
    } else if ((sectionSource['SectionInvalidReasonType'] === sourceSection['invalidReasonTypeActive'] ||
      sectionSource['SectionInvalidReasonType'] === sourceSection['invalidReasonTypeInactive'])
      && (sectionSource['SectionInvalidIndicator'] === sourceSection['invalidIndicatorNo']
        || sectionSource['SectionInvalidIndicator'] === sourceSection['invalidIndicatorYes'])
      && expirationDate <= prevDate) {
      return sourceSection['invalidReasonTypeInactive'];
    } else if ((sectionSource['SectionInvalidReasonType'] === sourceSection['invalidReasonTypeDeleted'])
      && (sectionSource['SectionInvalidIndicator'] === sourceSection['invalidIndicatorNo'] ||
        sectionSource['SectionInvalidIndicator'] === sourceSection['invalidIndicatorYes'])) {
      return sourceSection['invalidReasonTypeDeleted'];
    }
    return null;
  }
}
