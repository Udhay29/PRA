import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { isArray } from 'util';

import { AppConfig } from '../../../../../config/app.config';
import { AdminType } from '../model/admin-interface';

import { AdminUtility } from '../service/admin.utility';
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  appConfig: AppConfig = AppConfig.getConfig();
  baseUrl = this.appConfig['api'];
  constructor(private readonly http: HttpClient) { }

  getITConfDtoService(): Observable<AdminType> {
    const url = this.baseUrl.settings.systemValues;
    return this.http.get<AdminType>(url);
  }
  saveITConfDtoService(param: object): Observable<AdminType> {
    const url = this.baseUrl.settings.systemValues;
    return this.http.put<AdminType>(url, param);
  }
  populateData(adminForm: FormGroup, parentRef: any) {
    parentRef.componentValues = {};
    parentRef.adminModel.pageLoading = true;
    this.getITConfDtoService().subscribe((response: AdminType) => {
      parentRef.adminModel.pageLoading = false;
      if (response && parentRef && parentRef.adminModel) {
        AdminUtility.setValuesforEachField(parentRef, response, adminForm);
      }
    }, (error: Error) => {
      parentRef.adminModel.pageLoading = false;
      parentRef.changeDetector.detectChanges();
    });
  }
}
