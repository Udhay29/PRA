import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from './../../../../../../app.module';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { NotifyWhenService } from './notify-when.service';
import { APP_BASE_HREF } from '@angular/common';

describe('NotifyWhenService', () => {
  configureTestSuite(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, AppModule, HttpClientTestingModule],
    providers: [NotifyWhenService, { provide: APP_BASE_HREF, useValue: '/' }],
  }));

  it('should be created', () => {
    const service: NotifyWhenService = TestBed.get(NotifyWhenService);
    expect(service).toBeTruthy();
  });
});
