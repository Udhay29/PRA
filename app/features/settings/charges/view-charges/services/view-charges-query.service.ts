import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViewChargesQueryService {

  static elasticParam: object = {};
  constructor() {}
  static setElasticparam(elasticParam: object) {
    this.elasticParam = elasticParam;
  }
  static getElasticparam(): object {
    return this.elasticParam;
  }
}
