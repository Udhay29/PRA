import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { MessageService } from 'primeng/components/common/messageservice';
import * as utils from 'lodash';
import * as moment from 'moment-timezone';
import { BroadcasterService } from '../../shared/jbh-app-services/broadcaster.service';
import { LocalStorageService } from './../../shared/jbh-app-services/local-storage.service';
import {StandardModel} from './model/standard-model';
import { StandardService } from './service/standard.service';

@Component({
  selector: 'app-standard',
  templateUrl: './standard.component.html',
  styleUrls: ['./standard.component.scss']
})
export class StandardComponent implements OnInit, OnDestroy {
  standardModel: StandardModel;

  constructor(private readonly route: ActivatedRoute, private readonly service: StandardService,
    private readonly changeDetector: ChangeDetectorRef, private readonly shared: BroadcasterService,
    private readonly messageService: MessageService, private readonly localStore: LocalStorageService,
    private readonly router: Router) {
    this.standardModel = new StandardModel();

  }

  ngOnInit() {
    this.standardModel.isShowAccessorialFlag = true;
    if (this.localStore.getAccessorialTab('accessType', 'create')) {
      this.setTabIndex(this.localStore.getAccessorialTab('accessType', 'create'));
    }
    this.getDocumentationConfiguration();
  }

  ngOnDestroy() {
    this.standardModel.isSubscribe = false;
  }
  toastMessage(severity: string, summary: string, detail: string) {
    this.messageService.clear();
    this.messageService.add({
      severity: `${severity}`,
      summary: `${summary}`,
      detail: `${detail}`
    });
  }
  loader(event: boolean) {
    this.standardModel.isPageLoaded = event;
  }
  onTabChange(event: Event) {
    this.standardModel.accesorialType = event['originalEvent'].srcElement.innerText.toLowerCase();
  }
  setTabIndex(event) {
    this.standardModel.accessTabIndex = event.id;
    this.standardModel.accesorialType = event.text;
    if (this.standardModel.accesorialType === 'documentation' || this.standardModel.accesorialType === 'rules'
    || this.standardModel.accesorialType === 'emails') {
      this.standardModel.rateTabflag = false;
    }
  }
  getDocumentationConfiguration() {
    this.service.getDocumentationConfiguration().pipe(takeWhile(() => this.standardModel.isSubscribe))
      .subscribe((data: Object) => {
        const configurationDocumentation = data['_embedded']['customerAccessorialDocumentConfigurations'];
        this.standardModel.isShowDocumentationTab = true;
        if (configurationDocumentation.length > 0) {
          this.standardModel.isShowAllTab = true;
          if (this.standardModel.rateTabflag) {
          this.standardModel.accesorialType = 'rates';
          }
        } else {
          this.standardModel.accesorialType = 'documentation';
        }
        this.changeDetector.detectChanges();
      }, (error: Error) => {
        this.messageService.clear();
        this.messageService.add({severity: 'error', summary: `Pricing Accessorials Down`,
        detail: `Pricing Accessorials is down. Please contact JBH Helpdesk`});
      });
  }
}
