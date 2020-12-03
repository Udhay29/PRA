import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from '../../../../../../app.module';
import { StandardModule } from '../../../../../standard/standard.module';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ViewtemplateService } from './viewtemplate.service';


describe('ViewtemplateService', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, AppModule, StandardModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  it('should be created', () => {
    const service: ViewtemplateService = TestBed.get(ViewtemplateService);
    expect(service).toBeTruthy();
  });
});
