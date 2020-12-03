import { Component, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  translatedText: string;
  constructor() { }

  ngOnInit() {
  }
}
