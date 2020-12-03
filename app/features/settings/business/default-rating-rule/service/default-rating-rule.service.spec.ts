import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';
import { SettingsModule} from '../../../settings.module';
import { DefaultRatingRuleService } from './default-rating-rule.service';

describe('DefaultRatingRuleService', () => {
  let service: DefaultRatingRuleService;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      providers: [DefaultRatingRuleService, { provide: APP_BASE_HREF, useValue: '/' }],
    });
  });
  beforeEach(() => {
     service = TestBed.get(DefaultRatingRuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should be created', () => {
    service.getPopulateData();
  });
  it('should be created', () => {
    service.getRules();
  });
  it('should be created', () => {
    const req = {
      citySubstitutionIndicator: 'test',
      citySubstitutionRadiusValue: 10,
      effectiveDate: '2019-05-01',
      expirationDate: '2019-05-01',
      attributeChanged: true
    };
    service.saveRules(req, 10);
  });
});
