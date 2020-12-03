import { TestBed } from '@angular/core/testing';

import { GroupsService } from './groups.service';
import { AppModule } from '../../../../../../app.module';
import { SettingsModule } from '../../../../settings.module';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

describe('GroupsService', () => {

  configureTestSuite(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
    providers: [GroupsService, { provide: APP_BASE_HREF, useValue: '/' }]
  }));


  it('should be created', () => {
    const service: GroupsService = TestBed.get(GroupsService);
    expect(service).toBeTruthy();
  });

});
