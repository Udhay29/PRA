import { Component, OnInit } from '@angular/core';
import { BusinessFuelModel } from './model/business-fuel.model';

@Component({
  selector: 'app-business-fuel',
  templateUrl: './business-fuel.component.html',
  styleUrls: ['./business-fuel.component.scss']
})
export class BusinessFuelComponent implements OnInit {
  businessFuelModel: BusinessFuelModel;
  constructor() {
    this.businessFuelModel = new BusinessFuelModel();
  }
  ngOnInit() {
    this.businessFuelModel.selectedIndex = 1;
  }
}
