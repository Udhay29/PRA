import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SettingsService } from './../service/settings.service';
import { SettingsModel } from './../models/settings.model';

@Component({
    selector: 'app-precedence',
    templateUrl: './precedence.component.html',
    styleUrls: ['./precedence.component.scss']
})
export class PrecedenceComponent implements OnInit {
    originTypeList: any[];
    IbuList: any[];
    precedenceForm: FormGroup;
    accessorialsForm: FormGroup;
    settingsModel: SettingsModel;
    originDestTypeList: any[];
    minStartDate = new Date();

    constructor(private readonly settingsService: SettingsService) { }

    ngOnInit() {
        this.settingsModel = new SettingsModel(null);
        this.precedenceForm = this.settingsService.getBusinessConfigurables();
        this.accessorialsForm = this.settingsService.getBusinessConfigurables();
        this.getOriginType();
    }
    getOriginType() {
        if (this.settingsModel.originTypeList) {
            this.originDestTypeList = this.settingsModel.originTypeList.map((element: any) => {
                return ({
                    label: element.description, value: element.code
                });
            });
        }
    }
}
