import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { DefaultRatingRuleUtilityService } from './default-rating-rule-utility.service';

describe('DefaultRatingRuleUtilityService', () => {
  configureTestSuite();

  configureTestSuite(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DefaultRatingRuleUtilityService = TestBed.get(DefaultRatingRuleUtilityService);
    expect(service).toBeTruthy();
  });
});
