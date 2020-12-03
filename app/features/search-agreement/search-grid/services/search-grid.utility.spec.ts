import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { SearchAgreementModule } from '../../search-agreement.module';
import { SearchGridUtility } from './search-grid.utility';
import { AppModule } from '../../../../app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SearchGridUtility', () => {

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SearchAgreementModule, HttpClientTestingModule],
      providers: [SearchGridUtility, { provide: APP_BASE_HREF, useValue: '/' }],
    });
  });

  it('should be created', inject([SearchGridUtility], (service: SearchGridUtility) => {
    expect(service).toBeTruthy();
  }));
});
