import { DropDownInterface, DropDownBatchTimeInterface } from './notify-when.interface';
import { FormGroup } from '@angular/forms';

export class NotifyWhenModel {
    isSubscribeFlag: boolean;
    minuteErrorMessage: boolean;
    notifyWhenForm: FormGroup;
    timeFrame: DropDownInterface[];
    frequency: DropDownInterface[];
    eventName: DropDownInterface[];
    eventOccurrenceTime: DropDownInterface[];
    accessorialNotificationRequiredTypes: DropDownInterface[];
    suggestionResult: DropDownInterface[];
    batchTime: DropDownBatchTimeInterface[];
    inputCheckForMinute: number[];
    constructor() {
        this.inputCheckForMinute = [15, 30, 45];
        this.isSubscribeFlag = true;
        this.minuteErrorMessage = false;
        this.batchTime = [];
    }
}
