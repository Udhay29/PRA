import { HttpErrorResponse } from '@angular/common/http';
import { SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import * as moment from 'moment';
import * as utils from 'lodash';

import { CreateCarrierSectionModel } from './../model/create-carrier-section.model';
import { CarrierSectionSaveRequest, HitsItem, BillToAccountItem, BillToParam } from '../model/create-carrier-section.interface';
export class CreateCarrierSectionUtility {
  static getSearchResults(dataList: HitsItem[]): SelectItem  {
    const resultList: SelectItem = {value: {}, label: ''};
    utils.forEach(dataList, (value: HitsItem) => {
      if (!utils.isEmpty(value._source) && value._source.OrganizationName) {
        resultList.label = `${value._source.OrganizationName.trim()} (${value._source.OrganizationCode.trim()})`;
        resultList.value = value._source;
      }
    });
    return resultList;
  }

  static createSaveRequest(model: CreateCarrierSectionModel): CarrierSectionSaveRequest {
    const buValue = model.carrierSectionForm.get('businessUnit').value;
    const billToList = this.getSelectedBillto(model);
    return {
      carrierAgreementID: model.agreementId.toString(),
      carrierAgreementName: model.carrierDetails.agreementName,
      carrierAgreementSectionID: null,
      carrierAgreementSectionName: model.carrierSectionForm.get('sectionName').value.trim(),
      carrierAgreementSectionSegmentType: model.carrierSectionForm.get('carrierSegment').value.label,
      carrierAgreementSectionBusinessUnit: (utils.isNull(buValue) || utils.isEmpty(buValue)) ? null : buValue.label,
      carrierAgreementSectionEffectiveDate: model.carrierSectionForm.get('effectiveDate').value.toISOString().split('T')[0],
      carrierAgreementSectionExpirationDate: model.carrierSectionForm.get('expirationDate').value.toISOString().split('T')[0],
      carrierAgreementSectionAccounts: utils.isEmpty(billToList) ? null : billToList,
      billToEndDate: false,
      impactSectionCount: null
    };
  }

  static getSelectedBillto(model: CreateCarrierSectionModel): BillToAccountItem[] {
    const selectedBilltoList = [];
    utils.forEach(model.selectedCodesList, (selectedCode) => {
      selectedBilltoList.push(selectedCode.rowDetail);
    });
    return selectedBilltoList;
  }

  static getRequestParam(model: CreateCarrierSectionModel): BillToParam {
    const buValue = model.carrierSectionForm.get('businessUnit').value;
    const segmentType = (!utils.isEmpty(model.carrierSectionForm.get('carrierSegment').value) ||
    !utils.isNull(model.carrierSectionForm.get('carrierSegment').value)) ? model.carrierSectionForm.get('carrierSegment').value : null;
    const param = {
      sectionEffectiveDate: null, sectionExpirationDate: null, carrierAgreementID: model.agreementId,
      carrierSegmentTypeID: (utils.isNull(segmentType) || utils.isEmpty(segmentType)) ? null : segmentType.value.carrierSegmentTypeID,
      carrierSegmentTypeName: (utils.isNull(segmentType) || utils.isEmpty(segmentType)) ? null : segmentType.value.carrierSegmentTypeName,
      financeBusinessUnitCode: (utils.isNull(buValue) || utils.isEmpty(buValue)) ? null : buValue.label,
      currentDate: moment(new Date()).format('YYYY-MM-DD')
    };
    if (model.carrierSectionForm.get('effectiveDate').valid && model.carrierSectionForm.get('expirationDate').valid
    && model.carrierSectionForm.get('effectiveDate').value <= model.carrierSectionForm.get('expirationDate').value) {
      param.sectionEffectiveDate = model.carrierSectionForm.get('effectiveDate').value.toISOString().split('T')[0];
      param.sectionExpirationDate = model.carrierSectionForm.get('expirationDate').value.toISOString().split('T')[0];
    }
    return param;
  }
  static clearTableData(model: CreateCarrierSectionModel, codesTable: Table) {
    if (codesTable && codesTable.filters && codesTable.filters.global && codesTable.filters.global.value) {
      codesTable.filters.global.value = '';
    }
    model.searchInputValue = '';
    model.filteredCodesList = [];
    model.selectedCodesList = [];
    model.billToCount = 0;
  }
  static handleError(error: HttpErrorResponse) {
    const errorObject = {
      title: 'Error', message: ''
    };
    if (!utils.isEmpty(error) && !utils.isEmpty(error.error) && !utils.isEmpty(error.error.errors)) {
      errorObject.message = error.error.errors[0].errorMessage;
      switch (error.error.errors[0].code) {
        case 'CARRIER_AGREEMENT_SECTION_NAME_DUPLICATE':
          errorObject.title = 'Section Already Exists';
        break;
        case 'SECTION_DATE_RANGE_SHOULD_BE_WITH_IN_AGREEMENT_DATE_RANGE':
          errorObject.title = 'Section Date Range';
        break;
        default: break;
      }
    }
    return errorObject;
  }
}
