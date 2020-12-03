import { Component, OnInit , Input} from '@angular/core';
import { LocalStorageService } from './../../../shared/jbh-app-services/local-storage.service';

@Component({
  selector: 'app-standard-accessorial',
  templateUrl: './standard-accessorial.component.html',
  styleUrls: ['./standard-accessorial.component.scss']
})
export class StandardAccessorialComponent implements OnInit {
  accessorialtype: string;
  @Input() set accessorialType(value) {
    this.accessorialtype = value.toLowerCase();
  }
  constructor( private readonly localStore: LocalStorageService) { }

  ngOnInit() {
    this.localStore.setItem('agreementDetails', 'create', 'Accessorials', true);

  }

}
