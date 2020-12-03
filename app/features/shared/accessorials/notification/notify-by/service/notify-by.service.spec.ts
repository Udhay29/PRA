import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from './../../../../../../app.module';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { NotifyByService } from './notify-by.service';
import { APP_BASE_HREF } from '@angular/common';

describe('NotifyByService', () => {
  configureTestSuite(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, AppModule, HttpClientTestingModule],
    providers: [NotifyByService, { provide: APP_BASE_HREF, useValue: '/' }],
  }));

  it('should be created', () => {
    const service: NotifyByService = TestBed.get(NotifyByService);
    expect(service).toBeTruthy();
  });
});
