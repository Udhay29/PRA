import { TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';

import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from 'ng-bullet';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from '../../../../../app.module';
import { SettingsModule } from '../../../../../features/settings/settings.module';
import { DrayGroupService } from './dray-group.service';
import { HttpClient } from '@angular/common/http';

describe('DrayGroupService', () => {
  let drayGroupService: DrayGroupService;
  let http: HttpClient;
  configureTestSuite(() => {
    const changeDetectorRefStub = { detectChanges: () => ({}) };
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      providers: [
        DrayGroupService, HttpClient, { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ChangeDetectorRef, useValue: changeDetectorRefStub }
      ]
    });
  });
  beforeEach(() => {
    drayGroupService = TestBed.get(DrayGroupService);
    http = TestBed.get(HttpClient);
  });
  it('should create', () => {
    expect(drayGroupService).toBeTruthy();
  });


  it('should call post method', () => {
    spyOn(http, 'post').and.returnValues('call post');
    drayGroupService.getDrayGroup({});
  });
});
