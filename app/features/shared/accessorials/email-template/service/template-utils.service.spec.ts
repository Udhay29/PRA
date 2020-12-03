import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from './../../../../../app.module';
import { StandardModule } from './../../../../standard/standard.module';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TemplateUtilsService } from './template-utils.service';

describe('TemplateUtilsService', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, AppModule, StandardModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  it('should be created', () => {
    const service: TemplateUtilsService = TestBed.get(TemplateUtilsService);
    expect(service).toBeTruthy();
  });
});
