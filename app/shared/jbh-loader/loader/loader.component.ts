import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  public loadingText;

  @HostBinding('style.visibility')
  public display = 'hidden';

  @HostBinding('style.z-index')
  public zIndex = 950;

  constructor() { }

  ngOnInit() {
  }

}
