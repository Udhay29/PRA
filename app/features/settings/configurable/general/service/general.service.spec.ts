import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';
import { SettingsModule} from '../../../settings.module';
import { GeneralService } from './general.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GeneralService', () => {

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      providers: [GeneralService, { provide: APP_BASE_HREF, useValue: '/' }],
    });
  });

  it('should be created', () => {
    const service: GeneralService = TestBed.get(GeneralService);
    expect(service).toBeTruthy();
  });
});
