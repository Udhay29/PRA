import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AgreementSearchModel } from './model/search-agreement.model';

import { SearchService } from './services/search.service';
@Component({
  selector: 'app-search-agreement',
  templateUrl: './search-agreement.component.html',
  styleUrls: ['./search-agreement.component.scss']
})
export class SearchAgreementComponent implements OnInit {
  asideFlag: boolean;
  agreementSearchModel: AgreementSearchModel;
  constructor(private readonly searchService: SearchService
  ) {
    this.asideFlag = true;
    this.agreementSearchModel = new AgreementSearchModel();
  }

  ngOnInit() {

  }
  searchCall(event) {
    if (event) {
      SearchService.setElasticparam(event['query']);
      const elasticQuery = event;
      this.searchService.getElasticData(elasticQuery, this.agreementSearchModel);
    }
  }
  onPageLoad(event) {
    this.searchService.getElasticData(event, this.agreementSearchModel);
  }
  asideToggle(event) {
    this.asideFlag = event;
  }
  resetCall(event: boolean) {
    this.agreementSearchModel.isResetGrid = event;
  }
  resetTable(event: boolean) {
    this.searchService.setResetGrid(event);
  }
}
