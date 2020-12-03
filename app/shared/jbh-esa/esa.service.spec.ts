import { inject, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from '../../app.module';

import { EsaService } from './esa.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EsaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, HttpClientTestingModule],
      providers: [EsaService, { provide: APP_BASE_HREF, useValue: '/' }],
    });
  });

  it('should be created', inject([EsaService], (service: EsaService) => {
    expect(service).toBeTruthy();
  }));
});
