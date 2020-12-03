import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { LinehaulPriorityService } from './linehaul-priority.service';

describe('LinehaulPriorityService', () => {

  configureTestSuite(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LinehaulPriorityService = TestBed.get(LinehaulPriorityService);
    expect(service).toBeTruthy();
  });
});
