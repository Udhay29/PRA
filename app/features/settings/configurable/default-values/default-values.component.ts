import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SettingsService } from './../../service/settings.service';

@Component({
  selector: 'app-default-values',
  templateUrl: './default-values.component.html',
  styleUrls: ['./default-values.component.scss']
})
export class DefaultValuesComponent implements OnInit {

  dropDownTypes = [];
  gridHeadeList = [];
  gridDataList = [];
  documentationTypesList = [];
  settingForm: FormGroup;
  constructor(private readonly settingsService: SettingsService) { }

  ngOnInit() {
    this.settingForm = this.settingsService.getBusinessConfigurables();
    this.setData();
    this.getgridHeadeList();
  }
  setData() {
    this.dropDownTypes = [
      { label: 'Reposition', value: 'Reposition' },
      { label: 'Intermodal', value: 'Intermodal' },
      { label: 'Backhaul', value: 'Backhaul' }
    ];
  }
  getgridHeadeList() {
    this.gridHeadeList = [
      { field: 'defaultRateType', header: 'Default Rate Type' },
      { field: 'ibu', header: 'IBU' },
      { field: 'chargeCode', header: 'Charge Code' }
    ];
    this.gridDataList = [
      { 'defaultRateType': 'Lorem Ipsum', 'ibu': 'JBI', 'chargeCode': 'LOR1' },
      { 'defaultRateType': 'Lorem Ipsum1', 'ibu': 'JBI', 'chargeCode': 'LOR1' },
      { 'defaultRateType': 'Lorem Ipsum2', 'ibu': 'JBI', 'chargeCode': 'LOR1' },
      { 'defaultRateType': 'Lorem Ipsum3', 'ibu': 'JBI', 'chargeCode': 'LOR1' },
    ];
  }

}
