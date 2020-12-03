import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConfig } from '../../../../../config/app.config';
import { RootObject, BillToOwnerDetails } from '../model/manage-teams.interface';

@Injectable({
  providedIn: 'root'
})
export class ManageTeamsService {
  endpoints: object;
  /**
   *Creates an instance of ManageTeamsService.
   * @memberof ManageTeamsService
   */
  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getOwnershipDetails(billTo: string): Observable<BillToOwnerDetails> {
    return this.http.get<BillToOwnerDetails>(`${this.endpoints['viewAgreement'].getOwnerDetails}${billTo}`);
  }
  getBillToList(teamValue: object): Observable<string[]> {
    return this.http.get<string[]>(`${this.endpoints['viewAgreement'
    ].getAgreementDetails}${teamValue['agreementId']}/billtocodehierarchy/${teamValue['parentId']}`);
  }
  getTeams(params: object): Observable<RootObject> {
    return this.http.post<RootObject>(this.endpoints['createAgreement'].getTeams, params);
  }
  getTeamsData(params: object): Observable<object> {
    return this.http.get<string[]>(`${this.endpoints['viewAgreement'
    ].getTaskIdList}?customerAgreementID=${params['agreementId']}&activeBy=${params['expirationDate']}`);
  }
  getElasticResponse(query: object): Observable<object> {
    return this.http.post<object>(this.endpoints['viewAgreement'].getElasticResponse, query);
  }
  saveTeamsData(saveData: Array<object>, customerAgreementID: number): Observable<object> {
    return this.http.put<object>(`${this.endpoints['viewAgreement'].getAgreementDetails}${customerAgreementID}/teams`, saveData);
  }
}
