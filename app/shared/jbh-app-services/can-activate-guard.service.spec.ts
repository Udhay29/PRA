import { TestBed, inject } from '@angular/core/testing';
import { Router } from '@angular/router';

import { CanActivateGuardService } from './can-activate-guard.service';

describe('CanActivateGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanActivateGuardService, {
        provide: Router,
        useClass: class { navigate = jasmine.createSpy('navigate'); }
      }]
    });
  });

  it('should ...', inject([CanActivateGuardService], (service: CanActivateGuardService) => {
    expect(service).toBeTruthy();
  }));
});
