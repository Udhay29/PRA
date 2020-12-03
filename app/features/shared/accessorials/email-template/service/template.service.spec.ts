import { TestBed } from '@angular/core/testing';

import { TemplateService } from './template.service';

xdescribe('TemplateServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TemplateService = TestBed.get(TemplateService);
    expect(service).toBeTruthy();
  });
});
