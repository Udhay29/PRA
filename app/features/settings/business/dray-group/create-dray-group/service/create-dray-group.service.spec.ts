import { TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';

import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from 'ng-bullet';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { CreateDrayGroupService } from './create-dray-group.service';
import { AppModule } from '../../../../../../app.module';
import { SettingsModule } from '../../../../../../features/settings/settings.module';
import { HttpClient } from '@angular/common/http';

describe('CreateDrayGroupService', () => {
  let createDrayGroupService: CreateDrayGroupService;
  let http: HttpClient;
  configureTestSuite(() => {
    const changeDetectorRefStub = { detectChanges: () => ({}) };
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      providers: [
        CreateDrayGroupService, HttpClient, { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ChangeDetectorRef, useValue: changeDetectorRefStub }
      ]
    });
  });

  beforeEach(() => {
    createDrayGroupService = TestBed.get(CreateDrayGroupService);
    http = TestBed.get(HttpClient);
  });

  it('should create', () => {
    expect(createDrayGroupService).toBeTruthy();
  });

  it('should call getSuperUserBackDate method', () => {
    createDrayGroupService.getSuperUserBackDate();
  });

  it('should call getSuperFutureBackDate method', () => {
    createDrayGroupService.getSuperFutureBackDate();
  });

  it('should call getCountries method', () => {
    createDrayGroupService.getCountries();
  });

  it('should call getRateScopeLabel method', () => {
    createDrayGroupService.getRateScopeLabel();
  });

  it('should call post method', () => {
    spyOn(http, 'post').and.returnValues('call post');
    createDrayGroupService.postDrayGroup({});
  });
});
