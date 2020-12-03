import { MessageService } from 'primeng/components/common/messageservice';
import { HitsItem } from '../model/carrier-mileage-elasticresponse.interface';
import * as utils from 'lodash';
import { TimeZoneService } from '../../../../shared/jbh-app-services/time-zone.service';
import { Injectable } from '@angular/core';
@Injectable()

export class CarrierMileageUtility {
  constructor(private readonly timeZoneService: TimeZoneService) {
  }
  static toastMessage(messageService: MessageService, key: string, data: string) {
    const message = {
      severity: key,
      summary: (key === 'error') ? 'Error' : 'Success',
      detail: data
    };
    messageService.clear();
    messageService.add(message);
  }
  viewMileageGridFramer(gridResponse: HitsItem) {
    const gridObj = {};
    gridObj['carrierSegment'] = gridResponse._source.carrierSegmentTypeName;
    gridObj['calculationType'] = gridResponse._source.calculationType;
    gridObj['mileageName'] = gridResponse._source.carrierMileageProgramName;
    gridObj['billToAccounts'] = this.dataFramer(gridResponse._source.billToAccountsAssociations, 'billToAccountName');
    gridObj['sections'] = this.dataFramer(gridResponse._source.sectionAssociations, 'sectionName');
    gridObj['businessUnit'] = gridResponse._source.financeBusinessUnitCode;
    gridObj['carriers'] = this.dataFramer(gridResponse._source.carrierAssociations, 'carrierName');
    gridObj['system'] = gridResponse._source.mileageSystemName;
    gridObj['systemVersion'] = gridResponse._source.mileageSystemVersionName;
    gridObj['systemParameters'] = this.dataFramer(gridResponse._source.mileageSystemParameterAssociations, 'mileageSystemParameterName');
    gridObj['distanceUnit'] = gridResponse._source.distanceUnit;
    gridObj['geographyType'] = gridResponse._source.geographyType;
    gridObj['routeType'] = gridResponse._source.routeType;
    gridObj['decimalPrecision'] = gridResponse._source.decimalPrecision;
    gridObj['status'] = gridResponse['fields']['Status'];
    gridObj['borderMilesParameter'] = gridResponse._source.borderMilesParameter;
    gridObj['effectiveDate'] = gridResponse._source.effectiveDate;
    gridObj['expirationDate'] = gridResponse._source.expirationDate;
    gridObj['notes'] = gridResponse._source.programNote;
    gridObj['viewMoreDisplay'] = false;
    gridObj['UniqueDocID'] = gridResponse._id;
    gridObj['originalEffectiveDate'] = gridResponse._source.originalEffectiveDate;
    gridObj['originalExpirationDate'] = gridResponse._source.originalExpirationDate;
    gridObj['createdBy'] = gridResponse._source.createdBy;
    gridObj['createdOn'] = this.timeZoneService.convertToLocalMilitaryTime(gridResponse._source.createdOn);
    gridObj['createdProgrameName'] = gridResponse._source.createdProgramName;
    gridObj['updatedBy'] = gridResponse._source.updatedBy;
    gridObj['updatedOn'] = this.timeZoneService.convertToLocalMilitaryTime(gridResponse._source.updatedOn);
    gridObj['updatedProgrameName'] = gridResponse._source.updatedProgramName;
    gridObj['copied'] = gridResponse._source.copyIndicator;
    return gridObj;
  }
  dataFramer(data: Object[], key: string): string[] {
    const dataFramerArray = [];
    if (data) {
      utils.forEach(data, (value) => {
        if (value[key]) {
          dataFramerArray.push(value[key]);
        }
      });
    }
    dataFramerArray.sort(function (element, value) {
      return element.toLowerCase().localeCompare(value.toLowerCase());
    });
    return dataFramerArray;
  }
}
