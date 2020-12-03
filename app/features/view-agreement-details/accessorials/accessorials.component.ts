import { Component, OnInit, Input } from '@angular/core';

import { LocalStorageService } from './../../../shared/jbh-app-services/local-storage.service';

@Component({
  selector: 'app-accessorials',
  templateUrl: './accessorials.component.html',
  styleUrls: ['./accessorials.component.scss']
})
export class AccessorialsComponent implements OnInit {
  accessorialtype: string;
  @Input() set accessorialType(value) {
    this.accessorialtype = value.toLowerCase();
  }
  @Input() agreementId;
  constructor(
    private readonly localStore: LocalStorageService) { }

  ngOnInit() {
    this.localStore.setItem('agreementDetails', 'create', 'Accessorials', true);
  }
}
