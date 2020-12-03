import { TestBed, inject } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { RatingRuleFilterUtilityService } from './rating-rule-filter.utility.service';
import { servicesVersion } from 'typescript';
import { APP_BASE_HREF } from '@angular/common';

describe('RatingRuleFilter.UtilityService', () => {
  let service: RatingRuleFilterUtilityService;

  configureTestSuite(() => TestBed.configureTestingModule({
    providers: [ RatingRuleFilterUtilityService ],
  }));

  service = new RatingRuleFilterUtilityService();
  it('should be created', inject([RatingRuleFilterUtilityService], () => {
    expect(service).toBeTruthy();
  }));

  const data = {
    '_embedded' : {
      'serviceOfferingBusinessUnitTransitModeAssociations' : [ {
        'financeBusinessUnitServiceOfferingAssociation' : {
          'financeBusinessUnitServiceOfferingAssociationID' : 1,
          'financeBusinessUnitCode' : 'JBT',
          'serviceOfferingCode' : 'OTR',
          'effectiveTimestamp' : '2016-01-01T00:00',
          'expirationTimestamp' : '2199-12-31T23:59:59',
          'lastUpdateTimestampString' : '2017-11-20T08:24:31.8980803'
        }
      }
    ]
  }
};

  it('should call businessUnitFramer', () => {
    const response = [
      {
        label: 'JBT',
        value: 'JBT'
      }
    ];
    expect(service.businessUnitFramer(data)).toEqual(response);
  });

  it('should call serviceOfferingFramer', () => {
    const response = [
      {
        label: 'JBT - OTR',
        value: 'JBT - OTR'
      }
    ];
    expect(service.serviceOfferingFramer(data)).toEqual(response);
  });

const contractData = {
    'hits': {
    'total': 5,
    'max_score': null,
    'hits': [
      {
        '_index': 'pricing-customer-ratingrule',
        '_type': 'doc',
        '_id': '380',
        '_score': null,
        '_source': {
          'AgreementID': 1002,
          'ContractAssociations': [
            {
              'ContractDisplayName': 'ACSAE4 - ACSAE4'
            }
          ]
        },
        'sort': [
          'ACSAE4 - ACSAE4'
        ]
      }
    ]
  }
};

xit('should call contractsFramer', () => {
  const response = [
    {
      label: 'ACSAE4 - ACSAE4',
      value: 'ACSAE4 - ACSAE4'
    }
  ];
  expect(service.contractsFramer(contractData)).toEqual(response);
});

const sectionData = {
  'hits': {
    'total': 3,
    'max_score': null,
    'hits': [
      {
        '_index': 'pricing-customer-ratingrule',
        '_type': 'doc',
        '_id': '427',
        '_score': null,
        '_source': {
          'AgreementID': 1094,
          'RatingRuleType': 'Section-BU',
          'RatingRuleInvalidReasonType': 'Active',
          'SectionAssociations': [
            {
              'SectionName': 'NELOB1_1',
              'SectionID': 712
            }
          ],
          'AgreementDefaultIndicator': 'No',
          'RatingRuleInvalidIndicator': 'N'
        }
      }
    ]
  }
};

xit('should call sectionsFramer', () => {
  const response = [
    {
      label: 'NELOB1_1',
      value: 'NELOB1_1'
    }
  ];
  expect(service.sectionsFramer(sectionData)).toEqual(response);
});

});

