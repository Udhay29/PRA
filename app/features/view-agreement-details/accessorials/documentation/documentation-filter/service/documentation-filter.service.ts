import { Injectable } from '@angular/core';

import { AppConfig } from '../../../../../../../config/app.config';

import { DocumenationFilterConfig } from '../model/documentation-filter.config';
import { DoumentationFilterQuery } from '../query/documentation-filter.query';
import { DocumenationFilterUtilityService } from '../service/documenation-filter-utility.service';

@Injectable()
export class DocumentationFilterService {
  endpoints: object;
  constructor(private readonly documentationUtility: DocumenationFilterUtilityService) {
    const appConfig: any = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getFilterConfig(agreementId: number, parentRef): DocumenationFilterConfig {
    const chargeTypeName = 'customerAccessorialDocumentChargeTypes.chargeTypeName';
    const chargeTypeKey = 'customerAccessorialDocumentChargeTypes.chargeTypeName.keyword';
    const contractName = 'customerAccessorialAccounts.customerAgreementContractName';
    const sectionName = 'customerAccessorialAccounts.customerAgreementContractSectionName';
    const sectionKey = 'customerAccessorialAccounts.customerAgreementContractSectionName.keyword';
    const contractKey = 'customerAccessorialAccounts.customerAgreementContractName.keyword';
    const customerAccessorialAccounts = 'customerAccessorialAccounts';
    const byContract = 'by_contractname';
    const contract = 'contract';
    return {
      documentationType: {
        title: 'Documentation Type',
        url: this.endpoints['accessorial'].getDocumentList,
        query: DoumentationFilterQuery.frameListingQuery('accessorialDocumentType.keyword', agreementId),
        callback: this.documentationUtility.listingFramer,
        inputFlag: true,
        isToggleHidden: true
      },
      chargeType: {
        title: 'Charge Type',
        url: this.endpoints['accessorial'].getDocumentList,
        query: DoumentationFilterQuery.frameNestedListingQuery(agreementId, 'customerAccessorialDocumentChargeTypes',
          chargeTypeName, chargeTypeKey, 'by_chargetype', 'carriercode', true),
        callback: this.documentationUtility.chargeTypeFramer,
        inputFlag: true,
        isToggleHidden: true
      },
      contract: {
        title: 'Contract',
        url: this.endpoints['accessorial'].getDocumentList,
        query: DoumentationFilterQuery.frameNestedListingQuery(agreementId, customerAccessorialAccounts,
          contractName, contractKey, byContract, contract),
        callback: this.documentationUtility.contractFramer,
        inputFlag: true,
        isToggleHidden: true
      },
      section: {
        title: 'Section',
        url: this.endpoints['accessorial'].getDocumentList,
        query: DoumentationFilterQuery.frameNestedListingQuery(agreementId, customerAccessorialAccounts,
          sectionName, sectionKey, byContract, contract),
        callback: this.documentationUtility.sectionFramer,
        inputFlag: true,
        isToggleHidden: true
      },
      businessUnit: {
        title: 'Business Unit and Service Offering',
        url: this.endpoints['accessorial'].getDocumentList,
        query: DoumentationFilterQuery.frameNestedListingQuery(agreementId, 'customerAccessorialServiceLevelBusinessUnitServiceOfferings',
          'customerAccessorialServiceLevelBusinessUnitServiceOfferings.businessUnitDisplayName',
          'customerAccessorialServiceLevelBusinessUnitServiceOfferings.businessUnitDisplayName.keyword', 'by_BU', 'BU'),
        callback: this.documentationUtility.buFramer,
        inputFlag: true,
        isToggleHidden: true
      },
      carrier: {
        title: 'Carrier (Code)',
        url: this.endpoints['accessorial'].getDocumentList,
        query: DoumentationFilterQuery.frameNestedListingQuery(agreementId, 'customerAccessorialCarriers',
          'customerAccessorialCarriers.carrierDisplayName', 'customerAccessorialCarriers.carrierDisplayName.keyword', byContract, contract),
        callback: this.documentationUtility.carrierFramer,
        inputFlag: true,
        isToggleHidden: true
      },
      billToAccount: {
        title: 'Bill To Account',
        url: this.endpoints['accessorial'].getDocumentList,
        query: DoumentationFilterQuery.frameNestedListingQuery(agreementId, customerAccessorialAccounts,
          'customerAccessorialAccounts.customerAgreementContractSectionAccountName',
          'customerAccessorialAccounts.customerAgreementContractSectionAccountName.keyword', 'by_billtoacc', 'bill_to_acc'),
        callback: this.documentationUtility.billToAccountFramer,
        inputFlag: true,
        isToggleHidden: true
      },
      status: {
        title: 'Status',
        url: `${this.endpoints['ratingRules'].getStatus}?entityType=customerRatingRule`,
        callback: parentRef.statusFramer,
        isToggleHidden: true
      },
    };
  }
}
