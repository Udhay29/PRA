import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../../../../config/app.config';
import { Observable } from 'rxjs';
import { LineHaulPriorityGroups } from '../model/group.interface';



@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getPriorityGroupList(): Observable<LineHaulPriorityGroups> {
    const priorityGroupListUrl = this.endpoints['lineHaul'].getPriorityGroupList;
    return this.http.get<LineHaulPriorityGroups>(priorityGroupListUrl);
  }

  savePriorityGroupList(reqPayload) {
    const saveurl = this.endpoints['lineHaul'].savePriorityGroupList;
    return this.http.put(saveurl, reqPayload);
  }
}
