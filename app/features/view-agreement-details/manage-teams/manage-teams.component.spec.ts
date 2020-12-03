import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { of, throwError } from 'rxjs';

import { ManageTeamsModel } from './model/manage-teams.model';
import { AppModule } from '../../../app.module';
import { ViewAgreementDetailsModule } from '../view-agreement-details.module';
import { ManageTeamsComponent } from './manage-teams.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/components/common/messageservice';
import { ManageTeamsService } from './service/manage-teams.service';
import { ManageTeamsUtility } from './service/manage-teams.utility';
import { ViewData } from './model/manage-teams.interface';
import { ChangeDetectorRef } from '@angular/core';
import { RootObject } from '../../create-agreement/agreement-details/model/agreement-details.interface';

describe('ManageTeamsComponent', () => {
  let component: ManageTeamsComponent;
  let fixture: ComponentFixture<ManageTeamsComponent>;
  let service: ManageTeamsService;
  let msg: MessageService;
  let testData: ViewData;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [ManageTeamsUtility, { provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTeamsComponent);
    component = fixture.componentInstance;
    testData = {
      agreementName: 'test',
      parentId: 123,
      agreementId: 123,
      effectiveDate: '2018/12/12',
      expirationDate: '2018/12/12'
    };
    service  = TestBed.get(ManageTeamsService);
    msg = TestBed.get(MessageService);

    component.manageTeamsModel = new ManageTeamsModel;

    // pretend that it was wired to something that supplied
    component.ManageTeams = testData;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.manageTeamsModel.teamValue = testData;
    // fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should call createFormControl', () => {
    // fixture.detectChanges();
    component.createFormControl();
  });
  it('should call hideTeams', () => {
    component.manageTeamsModel.teamSelectedValue = [{a: 'a'}];
    component.manageTeamsModel.teamsForm.controls.teams.setValue([{a: 'b'}]);
    component.hideTeams();
  });
  it('should call onDontSave', () => {
    component.onDontSave();
  });
  it('should call teamAssociationForamt', () => {
    const teamAssociationList = [{
      teamMemberName: 'avbc,efg',
      roleTypeCode: '123'
    }];
    ManageTeamsUtility.teamAssociationForamt(teamAssociationList);
  });
  it('should call getOwnerShipId in utility', () => {
    component.manageTeamsModel.teamsTotalDtoList = [{
      taskAssignmentID: 12,
      customerAgreementOwnershipID: 123
    }];
    ManageTeamsUtility.getOwnerShipId(12, component.manageTeamsModel);
  });
  it('should call getOwnerShipId in utility with else', () => {
    component.manageTeamsModel.teamsTotalDtoList = [{
      taskAssignmentID: 11,
      customerAgreementOwnershipID: 123
    }];
    ManageTeamsUtility.getOwnerShipId(12, component.manageTeamsModel);
  });
  it('should call getDataPopulate', () => {
    const res = {
      '_embedded': {
        'customerAgreementOwnerships': [{'test': 'test'}]
      },
      '_links': {
        'self': {
          'href':
            'https://pricing-dev.jbhunt.com/pricingagreem/customeragreemps/search/custwnerships?cusrAgreementID=1091&activeBy=2019-06-04',
        }
      }
    };
    const res1 = [{
      _index: 'string',
      _type: 'string',
      _id: 'string',
      _score: 12,
      _source: {
        OrganizationName: 'string',
        OrganizationCode: 'string'}
    }];
    const res2 = [{
      '_source':
          {'teamMemberTaskAssignmentRoleAssociationDTOs': 'test'}
    }];
    spyOn(service, 'getTeamsData').and.returnValue(of(res));
    ManageTeamsUtility.teamAssociationForamt(res2);
    ManageTeamsUtility.getOwnerShipId(12, component.manageTeamsModel);
    ManageTeamsUtility.nestedFramming(res1, component.manageTeamsModel);
    component.getDataPopulate();
  });
  it('should call getDataPopulate error', () => {
    const err = {
      error: {
      'traceid' : '343481659c77ad99',
      'errors' : [ {
        'fieldErrorFlag' : false,
        'errorMessage' : 'Failed to convert undefined into java.lang.Integer!',
        'errorType' : 'System Runtime Error',
        'fieldName' : null,
        'code' : 'ServerRuntimeError',
        'errorSeverity' : 'ERROR'
      } ]
    }
  };
    spyOn(service, 'getTeamsData').and.returnValue(throwError(err));
    component.getDataPopulate();
  });
  it('should call onTeamsSave', () => {
    component.manageTeamsModel.teamsForm.markAsDirty();
    component.manageTeamsModel.teamValue = {
      agreementId: 1091,
      agreementName: 'La Terra Fina, Inc (LAUN3)',
      effectiveDate: '1995-01-01',
      expirationDate: '2099-12-31',
      parentId: 142581
    };
    const res = {
      '_embedded': {
        'customerAgreementOwnerships': []
      },
      '_links': {
        'self': {
          'href':
            'https://pricing-dev.jbhunt.com/pricingagreem/customeragreemps/search/custwnerships?cusrAgreementID=1091&activeBy=2019-06-04',
        }
      }
    };
    spyOn(service, 'saveTeamsData').and.returnValue(of(res));
    component.onTeamsSave();
  });
  it('should call onTeamsSave else', () => {
    component.manageTeamsModel.teamValue = {
      agreementName: null,
      parentId: null,
      agreementId: null,
      effectiveDate: null,
      expirationDate: null
    };
    ManageTeamsUtility.checkFields(msg, true);
    component.onTeamsSave();
    ManageTeamsUtility.checkFields(msg, false);
  });
  it('should call onTeamsSave error', () => {
    component.manageTeamsModel.teamsForm.markAsDirty();
    component.manageTeamsModel.teamValue = {
      agreementId: 1091,
      agreementName: 'La Terra Fina, Inc (LAUN3)',
      effectiveDate: '1995-01-01',
      expirationDate: '2099-12-31',
      parentId: 142581
    };
    const res = {
      'traceid' : 'df3a4bbe0ab5abe7',
      'errors' : [ {
        'fieldErrorFlag' : false,
        'errorMessage' : 'Failed to convert undefined into java.lang.Integer!',
        'errorType' : 'System Runtime Error',
        'fieldName' : null,
        'code' : 'ServerRuntimeError',
        'errorSeverity' : 'ERROR'
      } ]
    };
    spyOn(service, 'saveTeamsData').and.returnValue(of(res));
    component.onTeamsSave();
  });
  it('should call onTeamsCancel', () => {
    component.onTeamsCancel();
  });
  it('should call getBillToList', () => {
    spyOn(service, 'getBillToList').and.returnValue(of(['LAUN3']));
    component.getBillToList();
  });
  xit('should call nestedFramming in utility', () => {
    const res1 = [{
      _index: 'string',
      _type: 'string',
      _id: 'string',
      _score: 12,
      _source: {
        teamMemberTaskAssignmentRoleAssociationDTOs: [
          {
            teamMemberTaskAssignmentRoleAssociationID: 123,
            alternateRoleIndicator: 'string',
            taskAssignmentID: 123,
            teamID: 123,
            teamName: 'string',
            teamMemberTeamAssignmentID: 123,
            teamMemberID: '123',
            teamMemberName: 'string',
            taskGroupRoleTypeAssociationID: 123,
            roleTypeCode: '123',
            roleTypeName: 'string',
            teamTeamMemberId: '123',
            effectiveTimestamp: '2019-05-24T14:14:16.639',
            expirationTimestamp: '2019-05-24T14:14:16.639'
          }
        ],
        OrganizationName: 'string',
        OrganizationCode: 'string'}
    }];
    component.manageTeamsModel.teamSelectedDetailList = [];
    ManageTeamsUtility.nestedFramming(res1, component.manageTeamsModel);
  });
  it('should call dataPopulate in manage-teams.utility if condition', () => {
    const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
             ChangeDetectorRef
             );
    const response: RootObject = {
      took: 123,
      timed_out: true,
      _shards: {
        total: 123,
        successful: 123,
        skipped: 123,
        failed: 123,
      },
      hits: {
        total: 123,
        max_score: 123,
        hits: [
          {
            _index: 'string',
            _type: 'string',
            _id: 'string',
            _score: 12,
            _source: {}
          }
        ]
      },
    };
    spyOn(service, 'getElasticResponse').and.returnValue(of(response));
    ManageTeamsUtility.dataPopulate(service, [1, 3, 4], component.manageTeamsModel, changeDetectorRefStub);
  });
  it('should call dataPopulate in manage-teams.utility else condition', () => {
    const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
             ChangeDetectorRef
             );
    const response: RootObject = {
      took: 123,
      timed_out: true,
      _shards: {
        total: 123,
        successful: 123,
        skipped: 123,
        failed: 123,
      },
      hits: {
        total: 123,
        max_score: 123,
        hits: []
      },
    };
    spyOn(service, 'getElasticResponse').and.returnValue(of(response));
    ManageTeamsUtility.dataPopulate(service, [1, 3, 4], component.manageTeamsModel, changeDetectorRefStub);
  });
  it('should call getBillToList error', () => {
    const res = {
      'traceid' : 'df3a4bbe0ab5abe7',
      'errors' : [ {
        'fieldErrorFlag' : false,
        'errorMessage' : 'Failed to convert undefined into java.lang.Integer!',
        'errorType' : 'System Runtime Error',
        'fieldName' : null,
        'code' : 'ServerRuntimeError',
        'errorSeverity' : 'ERROR'
      } ]
    };
    spyOn(service, 'getBillToList').and.returnValue(of(res));
    component.getBillToList();
  });
  it('should call onBillToChange', () => {
    const eve = {
      label: 'LAUN3',
      value: 'LAUN3'
    };
    const res = {
      'billToName': 'LA TERRA FINA, INC',
      'currency': 'USD',
      'billToCode': 'LAUN3',
      'salesPersonUid': 'JBRO2023',
      'salesPersonName': 'Robert Koenig',
      'salesPersonPosId': '00151051',
      'prePdaUid': 'JPRC694',
      'prePdaName': 'Reagan Doerstling',
      'prePdaPosId': '00211077',
      'invoicingPdaUid': 'JPRC520',
      'invoicingPdaName': 'Ashley Hartz',
      'invoicingPdaPosId': '00209461',
      'postPdaUid': 'BROUSE',
      'postPdaName': 'Regina Hudgins',
      'postPdaPosId': '00001006',
      'pdmUid': 'JPRC143',
      'pdmName': 'Karen Willis',
      'pdmPosId': '00001954'
    };
    spyOn(service, 'getOwnershipDetails').and.returnValue(of(res));
    component.onBillToChange(eve);
  });
  it('should call onBillToChange error', () => {
    const eve = {
      label: 'LAUN3',
      value: 'LAUN3'
    };
    const res = {
      'traceid' : 'df3a4bbe0ab5abe7',
      'errors' : [ {
        'fieldErrorFlag' : false,
        'errorMessage' : 'Failed to convert undefined into java.lang.Integer!',
        'errorType' : 'System Runtime Error',
        'fieldName' : null,
        'code' : 'ServerRuntimeError',
        'errorSeverity' : 'ERROR'
      } ]
    };
    spyOn(service, 'getOwnershipDetails').and.returnValue(of(res));
    component.onBillToChange(eve);
  });
  it('should call onSearchTeam', () => {
    const event: any = {
      originalEvent: {},
      query: 'a'
    };
    const res = {
      'took': 14,
      'timed_out': false,
      '_shards': {
        'total': 5,
        'successful': 5,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 0,
        'max_score': null,
        'hits': [{'source': {
          'teamMemberTaskAssignmentRoleAssociationDTOs': 'test'
        }}]
      }
    };
    component.manageTeamsModel.teamValue = {
      agreementName: 'test',
      parentId: 10,
      agreementId: 1091,
      effectiveDate: '2019-06-03',
      expirationDate: '2019-06-03'
    };
    const hititem = {
      _index: 'string',
      _type: 'string',
      _id: 'string',
      _score: 12,
      _source: {
        OrganizationName: 'string',
        OrganizationCode: 'string'
      }
    };
    spyOn(service, 'getTeams').and.returnValue(of(res));
    component.onSearchTeam(event);
  });
  it('should call onSearchTeam error', () => {
    const event: any = {
      originalEvent: {},
      query: 'a'
    };
    const res = {
      'traceid' : 'df3a4bbe0ab5abe7',
      'errors' : [ {
        'fieldErrorFlag' : false,
        'errorMessage' : 'Failed to convert undefined into java.lang.Integer!',
        'errorType' : 'System Runtime Error',
        'fieldName' : null,
        'code' : 'ServerRuntimeError',
        'errorSeverity' : 'ERROR'
      } ]
    };
    component.manageTeamsModel.teamValue = {
      agreementName: 'test',
      parentId: 10,
      agreementId: 1091,
      effectiveDate: '2019-06-03',
      expirationDate: '2019-06-03'
    };
    spyOn(service, 'getTeams').and.returnValue(throwError(res));
    component.onSearchTeam(event);
  });
  it('should call onSearchTeamSelect', () => {
    const event: any = {
      originalEvent: {
        bubbles: false,
        cancelBubble: false,
        cancelable: false,
        composed: true,
        currentTarget: null,
        data: 'a',
        dataTransfer: null,
        defaultPrevented: false,
        detail: 0,
        eventPhase: 0,
        inputType: 'insertText',
        isComposing: false,
        isTrusted: true,
        path: [],
        returnValue: true,
        sourceCapabilities: null,
        srcElement: {},
        target: {},
        timeStamp: 22881320.635,
        type: 'input',
        view: null,
        which: 0
      },
      query: 'a'
    };
    component.manageTeamsModel.teamSelectedDetailListCopy = [];
    component.onSearchTeamSelect(event);
  });
  it('should call onSearchTeamRemove', () => {
    const event: any = {
      originalEvent: {
        bubbles: false,
        cancelBubble: false,
        cancelable: false,
        composed: true,
        currentTarget: null,
        data: 'a',
        dataTransfer: null,
        defaultPrevented: false,
        detail: 0,
        eventPhase: 0,
        inputType: 'insertText',
        isComposing: false,
        isTrusted: true,
        path: [],
        returnValue: true,
        sourceCapabilities: null,
        srcElement: {},
        target: {},
        timeStamp: 22881320.635,
        type: 'input',
        view: null,
        which: 0
      },
      query: 'a'
    };
    component.onSearchTeamRemove(event);
  });
});
