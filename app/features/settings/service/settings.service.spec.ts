import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../app.module';
import { SettingsModule} from './../settings.module';
import { SettingsService } from './settings.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SettingsService', () => {

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      providers: [SettingsService, { provide: APP_BASE_HREF, useValue: '/' }],
    });
  });
});
