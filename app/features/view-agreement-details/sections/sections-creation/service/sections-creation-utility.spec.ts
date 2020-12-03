import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';
import { SectionsCreationUtility } from '../service/sections-creation-utility';
import { SectionsCreationComponent } from '../sections-creation.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SectionsCreationUtility', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, HttpClientTestingModule],
      providers: [SectionsCreationUtility, { provide: APP_BASE_HREF, useValue: '/' }],
    });
  });

  it('should be created', inject([SectionsCreationUtility], (service: SectionsCreationUtility) => {
    expect(service).toBeTruthy();
  }));
});
