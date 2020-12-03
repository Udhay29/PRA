import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../../app.module';
import { ViewAgreementDetailsModule } from '../../../../view-agreement-details.module';
import { AdditionalInfoService } from './additional-info.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('AdditionalInfoService', () => {
  let service: AdditionalInfoService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [AdditionalInfoService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient]
    });
  });

  beforeEach(() => {
    service = TestBed.get(AdditionalInfoService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getBillToCodes', () => {
    service.getBillToCodes('123', '2019-04-06', '2019-05-06');
  });

  it('should call getMileagePreferences', () => {
    service.getMileagePreferences('123');
  });

  it('should call getPriorityNumber', () => {
    service.getPriorityNumber(123);
  });

  it('should call saveDraftInfo', () => {
    service.saveDraftInfo('123');
  });

  it('should be getCarriers', () => {
    const data = {
      'query': {
        'bool': {
          'must': [
            {
              'match': {
                'CarrierStatus': 'A'
              }
            }
          ]
        }
      },
      'from': 0,
      'size': 100,
      '_source': [
        'LegalName',
        'CarrierCode',
        'CarrierID'
      ]
    };
    service.getCarriers(data);
  });

  it('should be saveAdditionalInfo', () => {
    const data = {
      'duplicateFlag': null,
      'overridenPriorityNumber': null,
      'existingOverriddenPriorityNumber': null,
      'duplicateErrorMessage': null,
      'priorityNumber': null,
      'billTos': [

      ],
      'carriers': [

      ],
      'mileagePreference': {
        'mileagePreferenceID': null,
        'mileagePreferenceName': null,
        'mileagePreferenceMinRange': '',
        'mileagePreferenceMaxRange': ''
      },
      'unitOfWeightMeasurement': {
        'code': null,
        'description': null,
        'minWeightRange': '',
        'maxWeightRange': ''
      },
      'hazmatIncludedIndicator': 'N',
      'fuelIncludedIndicator': 'N',
      'autoInvoiceIndicator': 'Y',
      'customerLineHaulConfigurationID': 412
    };
    service.saveAdditionalInfo(data, 412, 'N', 'N');
  });
});
