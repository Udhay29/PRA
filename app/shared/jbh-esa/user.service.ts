import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';

@Injectable()
export class UserService {
    static URL: string;
    userDetails: any;

    hasAccess(url: string, operation: string) {
        let status = false;
        let record: any;
        let accessLevel: number;

        if (this.userDetails && this.userDetails.urlAccessList) {
            url = url.split('?')[0];
            url = url.split(';jsessionid=')[0];
            record = _.filter(this.userDetails.urlAccessList, function (o: any) {
                return o.uri === url;
            });
            if (record.length < 1) {
                return status;
            }
            accessLevel = record[0].accessLevel;
            if (operation === 'R' && accessLevel >= 1) {
                status = true;
            } else if (operation === 'PU' && accessLevel >= 2) {
                status = true;
            } else if ((operation === 'FU' ||
                operation === 'C' ||
                operation === 'D') && accessLevel >= 3) {
                status = true;
            }
        }

        return status;
    }

    hasPowerAccess(operation?: string) {
        const powerUrl = '/.*';
        let record: any;
        let accessLevel: number;
        let status = false;
        if (this.userDetails && this.userDetails.urlAccessList) {
            record = _.filter(this.userDetails.urlAccessList, function (o: any) {
                return o.uri === powerUrl;
            });
            if (record.length > 0) {
                accessLevel = record[0].accessLevel;
                if (operation === 'R' && accessLevel >= 1) {
                    status = true;
                } else if (operation === 'PU' && accessLevel >= 2) {
                    status = true;
                } else if ((operation === 'FU' ||
                    operation === 'C' ||
                    operation === 'D') && accessLevel >= 3) {
                    status = true;
                }
                return status;
            }
        }
        return false;
    }

    getDetails() {
        return this.userDetails;
    }

    getUserId() {
        return this.userDetails['userId'];
    }

    getAuthenticationStatus() {
        if (this.userDetails.urlAccessList && this.userDetails.urlAccessList.length > 0) {
            return 200;
        }
        return this.userDetails.status;
    }
    getUserLang(): string {
        return 'en';
    }

}
