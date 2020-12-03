import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from './../../../../../config/app.config';

import { SettingsService } from './../../service/settings.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent implements OnInit {

  constructor(private readonly settingsService: SettingsService, private readonly http: HttpClient) { }

  settingForm: FormGroup;
  branchesList: any[];
  endpoints: any;
  documentationTypesList: any[];
  ngOnInit() {
    this.settingForm = this.settingsService.getBusinessConfigurables();
    this.endpoints = AppConfig.getConfig().api;
    this.documentationTypesList = [];
  }
  getBranches(query) {
    this.getBranchesUrl(query).subscribe((response: Array<object>) => {
      this.branchesList = this.getBranchesList(response);
    });
  }
  getBranchesUrl(fleetTypo: string): Observable<Response[]> {
    const url = this.endpoints.owo.getFleetName + '?fleetCode=' + fleetTypo;
    return this.http.get<any>(url);
  }

  getBranchesList(response: Array<object>): Array<object> {
    if (response) {
      return response.map((element: any) => {
        return {
          operationalGroupCode: element.operationalGroupCode,
          operationalGroupName: element.operationalGroupCode
        };
      });
    }
    return [];
  }

}
