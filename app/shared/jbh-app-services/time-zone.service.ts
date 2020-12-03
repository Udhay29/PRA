import { Injectable } from '@angular/core';
import * as moment from 'moment-timezone';
@Injectable({
  providedIn: 'root'
})
export class TimeZoneService {
  dateformat: string;
  timeFormat: string;
  updatedDateFormat: string;
  timeFormatWithoutZone: string;
  updatedDateOnlyFormat: string;
  globalDateValue: string;
  private gettimezone = moment.tz.guess();
  zoneValue: string;
  constructor() {
    this.dateformat = 'YYYY-MM-DDTHH:mm';
    this.timeFormat = 'HH:mm z';
    this.updatedDateFormat = 'MM/DD/YYYYTHH:mm';
    this.timeFormatWithoutZone = 'HH:mm:ss';
    this.zoneValue = ' GMT+0000 (Greenwich Mean Time)';
    this.updatedDateOnlyFormat = 'MM/DD/YYYY';
    this.globalDateValue = 'YYYY-MM-DD';
  }

  convertDateTimetoUTC(date: string) {
    return moment.tz(date, this.dateformat, this.gettimezone).utc().format(this.dateformat);
  }
  convertUpdatedDateTimetoUTC(date: string) {
    return moment.tz(date, this.updatedDateFormat, this.gettimezone).utc().format(this.updatedDateFormat);
  }
  convertUpdatedOnlyDatetoUTC(date: string) {
    return moment.tz(date, this.updatedDateFormat, this.gettimezone).utc().format(this.updatedDateOnlyFormat);
  }
  convertTimeOnlytoUTC(time: string) {
    return moment.tz(time, this.timeFormatWithoutZone, this.gettimezone).utc().format(this.timeFormatWithoutZone);
  }
  convertDateOnlytoUTC(datealone: string) {
    const startingDate = moment(moment(datealone).format(this.globalDateValue) + 'T00:00').format(this.dateformat);
    const endingDate = moment(startingDate).add(23.99, 'hours').format(this.dateformat);
    return [this.convertDateTimetoUTC(startingDate), this.convertDateTimetoUTC(endingDate)];
  }
  convertToLocal(data: string) {
    const shownDate = moment(data).format('llll') + this.zoneValue;
    return moment(shownDate).tz(this.gettimezone).format('MM/DD/YYYY hh:mm A z');
  }
  convertToLocalMilitaryTime(data: string) {
    const shownDate = moment(data).format('llll') + this.zoneValue;
    return moment(shownDate).tz(this.gettimezone).format('MM/DD/YYYY HH:mm z');
  }
  convertToLocalMilitaryUpdatedTime(data: string) {
    return moment(data).tz(this.gettimezone).format('MM/DD/YYYY HH:mm z');
  }
  formatTimeOnlyToLocalMilitaryTime(data: string) {
    const shownDate = moment(data).format('llll') + this.zoneValue;
    return moment(shownDate).tz(this.gettimezone).format('HH:mm z');
  }
  getTimeZoneAbbrevation() {
    return  moment.tz(this.gettimezone).format('z');
  }
  getCurrentDate(): string {
    const date = new Date();
    return moment(date).format(this.globalDateValue);
  }
  convertUpdatedDateOnlytoUTC(datealone: string) {
    const startingDate = moment(moment(datealone).format(this.globalDateValue) + 'T00:00').format(this.updatedDateFormat);
    const endingDate = moment(datealone).add(23.99, 'hours').format(this.updatedDateFormat);
    return [this.convertUpdatedOnlyDatetoUTC(startingDate), this.convertUpdatedOnlyDatetoUTC(endingDate)];
  }
}
