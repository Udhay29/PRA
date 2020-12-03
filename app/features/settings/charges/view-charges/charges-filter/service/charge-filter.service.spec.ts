import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ChargesFilterModel } from '../model/charges-filter.model';
import { ChargesFilterService } from './charge-filter.service';
import { configureTestSuite } from 'ng-bullet';

describe('ChargesFilterService', () => {
  let service: ChargesFilterService;

  configureTestSuite(() => {
    const httpClientStub = {};
    const chargesFilterModelStub = { chargeTypeID: {} };
    TestBed.configureTestingModule({
      providers: [
        ChargesFilterService,
        { provide: HttpClient, useValue: httpClientStub },
        { provide: ChargesFilterModel, useValue: chargesFilterModelStub }
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(ChargesFilterService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
});
