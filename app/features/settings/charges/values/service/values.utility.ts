import { MessageService } from 'primeng/components/common/messageservice';
import * as moment from 'moment';
import { ValuesModel } from '../models/values-model';
import * as utils from 'lodash';

export class ValuesUtility {
    static toastMessage(messageService: MessageService, key: string, data: string) {
        if ( key === 'error') {
            const message = {
            severity: key,
            summary: (key === 'error') ? 'Error' : 'Success',
            detail: data
        };
        messageService.clear();
        messageService.add(message);
        } else {
            const message = {
                severity: key,
                summary: 'No Changes Found',
                detail: data
              };
              messageService.clear();
              messageService.add(message);
        }
    }
    static getCurrentDate(): any {
        const dateFormat = 'YYYY-MM-DD';
        return `${moment(new Date()).format(dateFormat)}`;
    }

    static checkDuplicates(valuesModel: ValuesModel, event: any, type: string): boolean {
        let isDuplicate = false;
        switch (type) {
            case 'usage':
                valuesModel.chargeUsageValuesDataList.forEach(value => {
                    if (value.chargeUsageTypeName.toString().toLowerCase() === event['value'].toString().toLowerCase().trim()) {
                        isDuplicate = true;
                    }
                });
                break;
            case 'applicationLevel':
                valuesModel.applicationLevelTypesDataList.forEach(value => {
                    if (value.chargeApplicationLevelTypeName.toString().toLowerCase() === event['value'].toString().toLowerCase().trim()) {
                        isDuplicate = true;
                    }
                });
                break;
            default:
                break;
        }
        return isDuplicate;

    }

    static removeValues(valuesModel: ValuesModel , event: any, type: string) {
        switch (type) {
            case 'usage':
             utils.remove(valuesModel.chargeUsageValuesDataList, {'chargeUsageTypeName': event['value'].toLowerCase().trim()});
                break;
            case 'applicationLevel':
                  utils.remove(valuesModel.applicationLevelTypesDataList,
                    {'chargeApplicationLevelTypeName': event['value'].toLowerCase().trim()});
                break;
            default:
                break;
        }
    }
}
