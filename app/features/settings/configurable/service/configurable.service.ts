import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConfig } from '../../../../../config/app.config';
import { ConfigGeneralType, GeneralType } from '../model/configurables-interface';
@Injectable({
  providedIn: 'root'
})
export class ConfigurableService {

  appConfig: AppConfig = AppConfig.getConfig();
  baseUrl = this.appConfig['api'];

  constructor(private readonly http: HttpClient) { }
  getBuConfDtoService(): Observable<GeneralType[]> {
    const url = this.baseUrl.settings.configurables;
    return this.http.get<GeneralType[]>(url);
  }
  saveBuConfDtoService(param: object): Observable<GeneralType[]> {
    const url = this.baseUrl.settings.configurables;
    return this.http.put<GeneralType[]>(url, param);
  }
  getData(parentRef: any) {
    parentRef.componentValues = {};
    parentRef.configurableModel.pageLoading = true;
    this.getBuConfDtoService().subscribe((response: Array<GeneralType>) => {
      parentRef.configDataList = response;
      parentRef.configurableModel.pageLoading = false;
      parentRef.changeDetector.detectChanges();
    }, (error: Error) => {
      parentRef.configurableModel.pageLoading = false;
      parentRef.changeDetector.detectChanges();
    });
  }
}
