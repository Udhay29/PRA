import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../app.module';
import { ViewAgreementDetailsModule } from '../../view-agreement-details.module';
import { ManageTeamsService } from './manage-teams.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { combineAll } from 'rxjs/operators';

describe('ManageTeamsService', () => {
  let service: ManageTeamsService;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [ManageTeamsService, { provide: APP_BASE_HREF, useValue: '/' }],
    });
  });
  beforeEach(() => {
    service = TestBed.get(ManageTeamsService);
 });

  it('should be created', () => {
    const services: ManageTeamsService = TestBed.get(ManageTeamsService);
    expect(services).toBeTruthy();
  });
  it('should call getOwnershipDetails', () => {
    service.getOwnershipDetails('MALOM');
  });
  it('should call getBillToList', () => {
    const arg = {
      agreementId: 48,
      agreementName: 'Malnove Incorporated Of Ut (MACLEJ)',
      effectiveDate: '1995-01-01',
      expirationDate: '2099-12-31',
      parentId: 147643
    };
    service.getBillToList(arg);
  });
  it('should call getTeams', () => {
    const arg = {
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'fields': [
                  'taskGroupName'
                ],
                'query': 'Pricing',
                'split_on_whitespace': false
              }
            },
            {
              'query_string': {
                'fields': [
                  'teamMemberTaskAssignmentRoleAssociationDTOs.teamName'
                ],
                'query': 'a*',
                'default_operator': 'AND',
                'analyze_wildcard': true
              }
            }
          ]
        }
      },
      'from': 0,
      'size': 10,
      '_source': [
        'taskAssignmentID',
        'orderOwnershipID',
        'taskAssignmentName',
        'taskGroupID',
        'taskGroupName',
        'teamMemberTaskAssignmentRoleAssociationDTOs'
      ]
    };
    service.getTeams(arg);
  });
  it('should call getTeamsData', () => {
    const arg = {
      agreementId: 48,
      expirationDate: '2019-07-29'
    };
    service.getTeamsData(arg);
  });
  it('should call getElasticResponse', () => {
    const arg = {
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'fields': [
                  'taskGroupName'
                ],
                'query': 'Pricing',
                'split_on_whitespace': false
              }
            },
            {
              'query_string': {
                'fields': [
                  'teamMemberTaskAssignmentRoleAssociationDTOs.teamName'
                ],
                'query': 'a*',
                'default_operator': 'AND',
                'analyze_wildcard': true
              }
            }
          ]
        }
      },
      'from': 0,
      'size': 10,
      '_source': [
        'taskAssignmentID',
        'orderOwnershipID',
        'taskAssignmentName',
        'taskGroupID',
        'taskGroupName',
        'teamMemberTaskAssignmentRoleAssociationDTOs'
      ]
    };
    service.getElasticResponse(arg);
  });
  it('should call saveTeamsData', () => {
    const arg = [
      {
        'teamName': 'Pricing Team 1',
        'teamID': 390,
        'taskAssignmentID': 868,
        'customerAgreementOwnershipID': 82,
        'effectiveDate': '1995-01-01',
        'expirationDate': '2099-12-31',
        'isRemoved': false
      },
      {
        'teamName': 'Pricing Team 1A',
        'teamID': 391,
        'taskAssignmentID': 697,
        'customerAgreementOwnershipID': 90,
        'effectiveDate': '1995-01-01',
        'expirationDate': '2099-12-31',
        'isRemoved': false
      },
      {
        'teamName': 'Pricing Team',
        'teamID': 375,
        'taskAssignmentID': 695,
        'customerAgreementOwnershipID': 84,
        'effectiveDate': '1995-01-01',
        'expirationDate': '2099-12-31',
        'isRemoved': false
      }
    ];
    service.saveTeamsData(arg, 48);
  });
});
