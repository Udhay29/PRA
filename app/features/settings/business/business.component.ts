import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { SettingsService } from '../service/settings.service';
import { BusinessModel } from './model/business.model';
import { SettingsModel } from './../models/settings.model';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss']
})
export class BusinessComponent implements OnInit {
  @Input() settingsModel: SettingsModel;
  businessModel: BusinessModel;
  settingForm: FormGroup;
  constructor(private readonly settingsService: SettingsService, private readonly router: Router) {
    this.businessModel = new BusinessModel();
  }
  ngOnInit() {
    this.settingForm = this.settingsService.getBusinessConfigurables();
  }
  onClickRow(rowData: string) {
    let route = '';
    if (rowData.toLowerCase() === 'fuel') {
      route = '/settings/business-fuel';
    } else if (rowData.toLowerCase() === 'default rating rule') {
      route = '/settings/defaultratingrule';
    } else if (rowData.toLowerCase() === 'precedence') {
      route = '/settings/precedence';
    } else if (rowData.toLowerCase() === 'dray group') {
      route = '/settings/draygroup';
    } else {
      route = '/settings/defaultvalues';
    }
    this.router.navigate([route]);
  }
}
