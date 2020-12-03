import { APP_BASE_HREF } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { configureTestSuite } from 'ng-bullet';

import { BrowserTitleService } from './browser-title.service';

describe('BrowserTitleService', () => {
  let service: BrowserTitleService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [BrowserTitleService, { provide: APP_BASE_HREF, useValue: '/' }]
    });
    service = TestBed.get(BrowserTitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call setPageTitle', () => {
    service.setPageTitle();
  });
});
