import { Injectable } from '@angular/core';
import { AppConfig } from '../../../../../../../config/app.config';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponseBase } from '@angular/common/http';
import { ViewTemplateModel } from '../model/viewtemplate.model';

@Injectable({
  providedIn: 'root'
})
export class ViewtemplateService {
  viewTemplateModel: ViewTemplateModel;
  endpoints: object;
  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
   }
   getDetailedView(id: number) {
    const url = `${this.endpoints['accessorial'].getDetailedView}/${id}`;
    return this.http.get(url);
  }

  getDetailedMasterView(param: string) {
    const url = `${this.endpoints['accessorial'].getDetailedView}${param}`;
    return this.http.get(url);
  }
}
