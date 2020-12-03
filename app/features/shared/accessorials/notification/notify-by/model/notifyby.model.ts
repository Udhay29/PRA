import { DropDownInterface } from './notify-by.interface';
import { FormGroup } from '@angular/forms';

export class NotifyByModel {
    notifyByForm: FormGroup;
    NotificationType: DropDownInterface[];
    CheckBoxData: DropDownInterface[];
    TemplateType: DropDownInterface[];
    suggestionResult: DropDownInterface[];
    isSubscribeFlag: boolean;
    defaultNotifyCheck: string[] = ['Email'];
    validUrlCheck: boolean;
    websiteLimt: number;
    rEx = new RegExp(['(((^https?)|(^ftp)):\/\/',
        '((([\\-\\w]+\\.)+\\w{2,3}(\/[%\\-\\w]+(\\.\\w{2,})?)*',
        '(([\\w\\-\\.\\?\\\\\/+@&#;`~=%!]*)(\\.\\w{2,})?)*)|(localhost|LOCALHOST))\/?)'].join(''), 'i');

    constructor() {
        this.websiteLimt = 4000;
        this.isSubscribeFlag = true;
        this.validUrlCheck = false;
    }
}
