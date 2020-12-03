import { TestBed } from '@angular/core/testing';

import { PriorityService } from './priority.service';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../../app.module';
import { SettingsModule } from '../../../../settings.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PriorityService', () => {

  configureTestSuite(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
    providers: [PriorityService, { provide: APP_BASE_HREF, useValue: '/' }]
  }));


  it('should be created', () => {
    const service: PriorityService = TestBed.get(PriorityService);
    expect(service).toBeTruthy();
  });
});
