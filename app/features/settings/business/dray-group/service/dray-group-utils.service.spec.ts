import { TestBed, ComponentFixture } from '@angular/core/testing';

import { DrayGroupUtilsService } from './dray-group-utils.service';
import { DrayGroupComponent } from '../dray-group.component';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/components/common/messageservice';
import { DrayGroupModel } from '../model/dray-group.model';
import { ChangeDetectorRef } from '@angular/core';
import { configureTestSuite } from 'ng-bullet';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '../../../../../app.module';
import { SettingsModule } from '../../../settings.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';

describe('DrayGroupUtilsService', () => {

  let fixture: ComponentFixture<DrayGroupComponent>;
  let service: DrayGroupUtilsService;
  let messageService: MessageService;
  const model = new DrayGroupModel();
  let changeDetector: ChangeDetectorRef;

  configureTestSuite(() => {
    const changeDetectorRefStub = { detectChanges: () => ({}) };
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      providers: [
        DrayGroupUtilsService, HttpClient, { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ChangeDetectorRef, useValue: changeDetectorRefStub }
      ]
    });
  });

  const error = {
    error: {
      errors: [{
        'fieldErrorFlag': false,
        'errorMessage': 'Specified dray group name and dray code is already defined for the specified date period. Change dray group name',
        'errorType': 'Business Validation Error',
        'fieldName': null,
        'code': 'DRAY_GROUP_NAME_DUPLICATION_EXCEPTION',
        'errorSeverity': 'ERROR'
      }]
    }
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(DrayGroupComponent);
    service = TestBed.get(DrayGroupUtilsService);
    changeDetector = TestBed.get(ChangeDetectorRef);
    messageService = TestBed.get(MessageService);
    fixture.detectChanges();
   });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call handleError', () => {
    service.handleError(error, model, messageService, changeDetector);
  });

  it('should call handleError', () => {
    error.error.errors[0].code = 'DRAY_GROUP_CODE_DUPLICATION_EXCEPTION';
    service.handleError(error, model, messageService, changeDetector);
  });

  it('should call handleError', () => {
    error.error.errors[0].code = 'DRAY_GROUP_NAME_AND_CODE_DUPLICATION_EXCEPTION';
    service.handleError(error, model, messageService, changeDetector);
  });
});
