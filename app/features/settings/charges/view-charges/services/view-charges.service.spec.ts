import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';
import { SettingsModule } from './../../../settings.module';
import { ViewChargesService } from './view-charges.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ViewChargesService', () => {

  configureTestSuite(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
    providers: [ViewChargesService, { provide: APP_BASE_HREF, useValue: '/' }],
  }));
});
