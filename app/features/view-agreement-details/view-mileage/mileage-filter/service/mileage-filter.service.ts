import { Injectable } from '@angular/core';

import { AppConfig } from '../../../../../../config/app.config';
import { MileageFilterConfig } from '../model/mileage-filter.config';
import { MileageFilterUtilityService } from './mileage-filter-utility.service';
import { MileageFilterQuery } from '../query/mileage-filter.query';


@Injectable({
  providedIn: 'root'
})
export class MileageFilterService {
  endpoints: any;
  mileageProgramName = 'mileageProgramName';
  mileageProgramKey = 'mileageProgramName.keyword';
  mileageSystemName = 'mileageSystemName';
  mileageSystemKeyword = 'mileageSystemName.keyword';
  mileageSystemVersionName = 'mileageSystemVersionName';
  mileageSystemText = 'mileageSystemVersionName.text';
  mileageBorderMileParameterTypeName = 'mileageBorderMileParameterTypeName';
  mileageBorderMileKeyWord = 'mileageBorderMileParameterTypeName.keyword';
  unitOfDistanceMeasurementCode = 'unitOfDistanceMeasurementCode';
  unitOfDistanceKeyWord = 'unitOfDistanceMeasurementCode.keyword';
  mileageRouteTypeName = 'mileageRouteTypeName';
  mileageRouteTypeNameKeyWord = 'mileageRouteTypeName.keyword';
  geographyType = 'geographyType';
  geographyTypeKeyWord = 'geographyType.keyword';
  mileageCalculationTypeName = 'mileageCalculationTypeName';
  mileageCalculationKeyword = 'mileageCalculationTypeName.keyword';
  decimalPrecisionIndicator = 'decimalPrecisionIndicator';
  decimalPrecisionKeyword = 'decimalPrecisionIndicator.keyword';
  lastUpdateUserID = 'lastUpdateUserID';
  lastUpdateKey = 'lastUpdateUserID.keyword';
  lastUpdateProgram = 'lastUpdateProgramName';
  lastUpdateProgramKey = 'lastUpdateProgramName.keyword';
  createUserID = 'createUserID';
  createUserKey = 'createUserID.keyword';
  createProgramName = 'createProgramName';
  createProgramNameKey = 'createProgramName.keyword';
  contractPath = 'customerMileageProgramContractAssociations';
  contractSource = 'customerMileageProgramContractAssociations.customerContractDisplayName';
  contractField = 'customerMileageProgramContractAssociations.customerContractDisplayName.keyword';
  sectionPath = 'customerMileageProgramSectionAssociations';
  sectionSource = 'customerMileageProgramSectionAssociations.customerAgreementContractSectionName';
  sectionField = 'customerMileageProgramSectionAssociations.customerAgreementContractSectionName.keyword';
  carrierSource = 'customerMileageProgramCarrierAssociations.carrierDisplayName';
  carrierPath = 'customerMileageProgramCarrierAssociations';
  carrierField = 'customerMileageProgramCarrierAssociations.carrierDisplayName.keyword';
  paramPath = 'mileageSystemParameters';
  paramSource = 'mileageSystemParameters.mileageSystemParameterName';
  paramField = 'mileageSystemParameters.mileageSystemParameterName.keyword';
  carrierBy = 'by_carriercode';
  parameterBy = 'by_parametername';

  constructor(private readonly mileageFilterUtility: MileageFilterUtilityService) {
    const appConfig: any = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getFilterConfig(parentRef: any): MileageFilterConfig {
    const agreementID = parentRef['agreementID'];
    return {
      programName: {
        title: 'Program Name',
        url: this.endpoints.mileage.getProgramNamesList,
        query: MileageFilterQuery.frameListingQuery(agreementID, this.mileageProgramName, this.mileageProgramKey),
        callback: this.mileageFilterUtility.programNamesFramer,
        inputFlag: true
      },
      agreementDefault: {
        title: 'Agreement Default',
        url: this.endpoints.mileage.getAgreementdefaultValues,
        query: MileageFilterQuery.getAgreementDefaultQuery(),
        callback: this.mileageFilterUtility.agreementDefaultFramer,
        inputFlag: true
      },
      contract: {
        title: 'Contract',
        url: this.endpoints.mileage.getContractListValues,
        query: MileageFilterQuery.getContractSectionQuery(agreementID, this.contractPath, this.contractSource, this.contractField),
        callback: this.mileageFilterUtility.contractsFramer,
        inputFlag: true
      },
      section: {
        title: 'Section',
        url: this.endpoints.mileage.getSectionListValues,
        query: MileageFilterQuery.getContractSectionQuery(agreementID, this.sectionPath, this.sectionSource, this.sectionField),
        callback: this.mileageFilterUtility.sectionsFramer,
        inputFlag: true
      },
      status: {
        title: 'Status',
        url: `${this.endpoints['ratingRules'].getStatus}?entityType=customerRatingRule`,
        callback: parentRef.statusFramer,
        isStatus: true
      },
      businessUnit: {
        title: 'Business Unit',
        url: this.endpoints.mileage.getSectionListValues,
        query: MileageFilterQuery.businessUnitListingQuery(),
        callback: this.mileageFilterUtility.businessUnitFramer,
        inputFlag: true
      },
      carrier: {
        title: 'Carrier',
        url: this.endpoints.mileage.getSectionListValues,
        query: MileageFilterQuery.getCarrierSystemParameterQuery
          (agreementID, this.carrierPath, this.carrierSource, this.carrierField, this.carrierBy, false),
        callback: this.mileageFilterUtility.carrierFramer,
        inputFlag: true
      },
      system: {
        title: 'System',
        url: this.endpoints.mileage.getSectionListValues,
        query: MileageFilterQuery.frameListingQuery(agreementID, this.mileageSystemName, this.mileageSystemKeyword),
        callback: this.mileageFilterUtility.systemFramer,
        inputFlag: true
      },
      systemParameters: {
        title: 'System Parameters',
        url: this.endpoints.mileage.getSectionListValues,
        query: MileageFilterQuery.getCarrierSystemParameterQuery
          (agreementID, this.paramPath, this.paramSource, this.paramField, this.parameterBy, true),
        callback: this.mileageFilterUtility.systemParametersFramer,
        inputFlag: true
      },
      systemVersion: {
        title: 'System Version',
        url: this.endpoints.mileage.getSectionListValues,
        query: MileageFilterQuery.frameListingQuery(agreementID, this.mileageSystemVersionName, this.mileageSystemText),
        callback: this.mileageFilterUtility.systemVersionFramer,
        inputFlag: true
      },
      borderMilesParameter: {
        title: 'Border Miles Parameter',
        url: this.endpoints.mileage.getSectionListValues,
        query: MileageFilterQuery.frameListingQuery(agreementID, this.mileageBorderMileParameterTypeName,
          this.mileageBorderMileKeyWord),
        callback: this.mileageFilterUtility.borderMilesParameterFramer,
        inputFlag: true
      },
      distanceUnit: {
        title: 'Distance Unit',
        url: this.endpoints.mileage.getSectionListValues,
        query: MileageFilterQuery.frameListingQuery(agreementID, this.unitOfDistanceMeasurementCode,
          this.unitOfDistanceKeyWord),
        callback: this.mileageFilterUtility.distanceUnitFramer,
        inputFlag: true
      },
      routeType: {
        title: 'Route Type',
        url: this.endpoints.mileage.getSectionListValues,
        query: MileageFilterQuery.frameListingQuery(agreementID, this.mileageRouteTypeName, this.mileageRouteTypeNameKeyWord),
        callback: this.mileageFilterUtility.routeTypeFramer,
        inputFlag: true
      },
      geographyType: {
        title: 'Geography Type',
        url: this.endpoints.mileage.getSectionListValues,
        query: MileageFilterQuery.frameListingQuery(agreementID, this.geographyType, this.geographyTypeKeyWord),
        callback: this.mileageFilterUtility.geographyTypeFramer,
        inputFlag: true
      },
      calculationType: {
        title: 'Calculation Type',
        url: this.endpoints.mileage.getSectionListValues,
        query: MileageFilterQuery.frameListingQuery(agreementID, this.mileageCalculationTypeName,
          this.mileageCalculationKeyword),
        callback: this.mileageFilterUtility.calculationTypeFramer,
        inputFlag: true
      },
      decimalPrecision: {
        title: 'Decimal Precision',
        url: this.endpoints.mileage.getSectionListValues,
        query: MileageFilterQuery.frameListingQuery(agreementID, this.decimalPrecisionIndicator, this.decimalPrecisionKeyword),
        callback: this.mileageFilterUtility.decimalPrecisionFramer,
        inputFlag: true
      }
    };
  }
}
