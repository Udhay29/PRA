import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { LineHaulPriorityGroups, LineHaulPriorityGroupsItem, EditedValueList } from './model/group.interface';
import {
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';
import { SettingsModule } from '../../../settings.module';
import { GroupsComponent } from './groups.component';
import { GroupModel } from './model/group.model';
import { LinehaulPriorityModel } from '../model/linehaul-priority.model';
import { GroupsService } from './service/groups.service';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { MessageService } from 'primeng/components/common/messageservice';

describe('GroupsComponent', () => {
  let component: GroupsComponent;
  let fixture: ComponentFixture<GroupsComponent>;
  let rowData: LineHaulPriorityGroupsItem;
  let duplicateGroupIds: number[];
  let editValues: EditedValueList[];
  let editedGroupIDs: number[];
  let lineHaulPriorityGroups: any;
  let groupModel: any;
  let linehaulPriorityModel: any;
  let sampleMap: Map<number, string[]>;
  let messageService: MessageService;


  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, MessageService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsComponent);
    component = fixture.componentInstance;
    messageService = TestBed.get(MessageService);
    component.groupmodel = new GroupModel();
    component.linehaulPrioritymodel = new LinehaulPriorityModel();
    duplicateGroupIds = [123, 234, 345];
    editedGroupIDs = [123, 234, 345];
    sampleMap = new Map<number, string[]>();
    sampleMap.set(1, ['abc', 'bcd', 'cde']);
    editValues = [{
      lineHaulGroupPriorityNumber: 1,
      lineHaulPriorityGroupName: 'string',
      lineHaulPriorityGroupID: 1
    }];
    rowData = {
      lineHaulGroupPriorityNumber: 8,
      lineHaulPriorityGroupID: 1,
      lineHaulPriorityGroupName: 'Address, Ramp, Yard, Location',
      _links: null
    };
    linehaulPriorityModel = {

      breadCrumbList: [{
        label: 'string',
        routerLink: ['a', 'b', 'c']
      }],
      selectedIndex: 1,
      lastSelectedIndex: 1,
      lastEditedFormFlag: true,
      loading: true,
      isValuesModified: true,
      groupEditFlag: true,
      groupRoutingUrl: 'string',
      routingUrl: 'string',
      isPopupVisible: true,
      popupMessage: 'string',
      tabChangePopup: true,
      tempTabIndex: 1,
      groupsFirstLoading: true,
      editedGroupValues: [{
        lineHaulGroupPriorityNumber: 'string',
        lineHaulPriorityGroupName: 1,
        lineHaulPriorityGroupID: 1
      }],
      duplicateGroupIds: [1, 1, 1],
      groupMap: sampleMap
    };
    groupModel = {
      column: null,
      tableValue: [
        {
          lineHaulGroupPriorityNumber: 1,
          lineHaulPriorityGroupName: 'string',
          lineHaulPriorityGroupID: 1
        }
      ],
      editValues: [
        {
          lineHaulGroupPriorityNumber: 'string',
          lineHaulPriorityGroupName: 1,
          lineHaulPriorityGroupID: 1
        }
      ],
      editedPriorityList: null,
      editflag: true,
      isSaveChanges: true,
      popupMessage: 'string',
      routingUrl: 'string',
      subsrciberFlag: true,
      duplicateGroupIds: [1, 1, 1],
      emptyGroupIds: [1, 1, 1],
      editedGroupIDs: [1, 1, 1],
      loading: true,
      initialValues: [rowData, rowData]
    };
    lineHaulPriorityGroups = {
      '_embedded': {
        'lineHaulPriorityGroups': [{
          'lineHaulPriorityGroupName': 'Address, Ramp, Yard, Location',
          'lineHaulGroupPriorityNumber': 8,
          'lineHaulPriorityGroupID': 1,
          '_links': {
            'self': {
              'href': 'htp://ricing-test.jbhunt.com'
            },
            'lineHaulPriorityGroup': {
              'href': 'htp://ricing-test.jbhunt.com',
              'templated': true
            }
          }
        }]
      },
      '_links': {
        'self': {
          'href': 'htp://ricing-test.jbhunt.com}',
          'templated': true
        },
        'profile': {
          'href': 'htp://ricing-test.jbhunt.com'
        }
      },
      'page': {
        'size': 50,
        'totalElements': 8,
        'totalPages': 1,
        'number': 0
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    component.linehaulPrioritymodel.groupsFirstLoading = true;
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    component.linehaulPrioritymodel.groupsFirstLoading = false;
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('it should call getPriorityGroupList', () => {
    const groupService: GroupsService = fixture.debugElement.injector.get(
      GroupsService
    );
    const response = lineHaulPriorityGroups;
    spyOn(groupService, 'getPriorityGroupList').and.returnValues(of(response));
    component.getPriorityGroupList();
  });
  it('it should call loadPriorityGroupList', () => {
    const groupService: GroupsService = fixture.debugElement.injector.get(
      GroupsService
    );
    const response = lineHaulPriorityGroups;
    component.groupmodel.tableValue.push({
      lineHaulGroupPriorityNumber: 1,
      lineHaulPriorityGroupName: 'string',
      lineHaulPriorityGroupID: 23
    });
    spyOn(groupService, 'getPriorityGroupList').and.returnValue(of(response));
    component.loadPriorityGroupList();
  });

  it('it should call onCellValueChange', () => {
    component.groupmodel.duplicateGroupIds = [];
    component.groupmodel.editedGroupIDs = [];
    component.groupmodel.editValues = [];
    component.groupmodel = groupModel;
    component.linehaulPrioritymodel = linehaulPriorityModel;
    component.onCellValueChange(rowData, 1, 'event');
  });

  it('checkDuplicate', () => {
  const splitGroups = ['address'];
  const otherGroups = [{
    lineHaulGroupPriorityNumber: 7,
    lineHaulPriorityGroupID: 2,
    lineHaulPriorityGroupName: '9-Zip, Address Region, temo'
  }];
  const groupId = 1;
  const isDuplicate = false;
  component.checkDuplicate(splitGroups, otherGroups,
    rowData, groupId, isDuplicate);
  });

  it('validateGroups', () => {
    component.groupmodel.tableValue = [{
      lineHaulGroupPriorityNumber: 8,
      lineHaulPriorityGroupID: 1,
      lineHaulPriorityGroupName: 'Address, Ramp, Yard, Location'
    }];
    component.validateGroups(rowData);
  });
  it('it should call isGroupEdited', () => {
    component.groupmodel = groupModel;
    component.linehaulPrioritymodel = linehaulPriorityModel;
    component.isGroupEdited(rowData);
  });

  it('it should call isGroupEdited', () => {
    const groupService: GroupsService = fixture.debugElement.injector.get(
      GroupsService
    );
    const responsenow = {
       _embedded : {
          lineHaulPriorityGroups : [ {
            lineHaulPriorityGroupID : 1,
            lineHaulGroupPriorityNumber : 8,
            lineHaulPriorityGroupName : 'Address, Ramp, Yard, Location',
            _links : {
              self : {
                href : 'https://pricing-test.jbhunt.com/pricinglinehaulservices/linehaulprioritygroups/1'
              },
              lineHaulPriorityGroup : {
                href : 'https://pricing-test.jbhunt.com/pricinglinehaulservices/linehaulprioritygroups/1{?projection}',
                templated : true
              }
            }
          }, {
            lineHaulPriorityGroupID : 2,
            lineHaulGroupPriorityNumber : 7,
            lineHaulPriorityGroupName : '9-Zip, Address Region',
            _links : {
              self : {
                href : 'https://pricing-test.jbhunt.com/pricinglinehaulservices/linehaulprioritygroups/2'
              },
              lineHaulPriorityGroup : {
                href : 'https://pricing-test.jbhunt.com/pricinglinehaulservices/linehaulprioritygroups/2{?projection}',
                templated : true
              }
            }
          }, {
            lineHaulPriorityGroupID : 3,
            lineHaulGroupPriorityNumber : 6,
            lineHaulPriorityGroupName : '5-Zip, 6-Zip',
            _links : {
              self : {
                href : 'https://pricing-test.jbhunt.com/pricinglinehaulservices/linehaulprioritygroups/3'
              },
              lineHaulPriorityGroup : {
                href : 'https://pricing-test.jbhunt.com/pricinglinehaulservices/linehaulprioritygroups/3{?projection}',
                templated : true
              }
            }
          }, {
            lineHaulPriorityGroupID : 4,
            lineHaulGroupPriorityNumber : 5,
            lineHaulPriorityGroupName : 'City State, 9-Zip Range, 9-Zip Region',
            _links : {
              self : {
                href : 'https://pricing-test.jbhunt.com/pricinglinehaulservices/linehaulprioritygroups/4'
              },
              lineHaulPriorityGroup : {
                href : 'https://pricing-test.jbhunt.com/pricinglinehaulservices/linehaulprioritygroups/4{?projection}',
                templated : true
              }
            }
          }, {
            lineHaulPriorityGroupID : 5,
            lineHaulGroupPriorityNumber : 4,
            lineHaulPriorityGroupName : '3-Zip, 5-Zip Range, 6-Zip Range, 5-Zip Region, City State Region',
            _links : {
              self : {
                href : 'https://pricing-test.jbhunt.com/pricinglinehaulservices/linehaulprioritygroups/5'
              },
              lineHaulPriorityGroup : {
                href : 'https://pricing-test.jbhunt.com/pricinglinehaulservices/linehaulprioritygroups/5{?projection}',
                templated : true
              }
            }
          }, {
            lineHaulPriorityGroupID : 6,
            lineHaulGroupPriorityNumber : 3,
            lineHaulPriorityGroupName : '2-Zip, 3-Zip Range, 3-Zip Region',
            _links : {
              self : {
                href : 'https://pricing-test.jbhunt.com/pricinglinehaulservices/linehaulprioritygroups/6'
              },
              lineHaulPriorityGroup : {
                href : 'https://pricing-test.jbhunt.com/pricinglinehaulservices/linehaulprioritygroups/6{?projection}',
                templated : true
              }
            }
          }, {
            lineHaulPriorityGroupID : 7,
            lineHaulGroupPriorityNumber : 2,
            lineHaulPriorityGroupName : '2-Zip Range, Region, State',
            _links : {
              self : {
                href : 'https://pricing-test.jbhunt.com/pricinglinehaulservices/linehaulprioritygroups/7'
              },
              lineHaulPriorityGroup : {
                href : 'https://pricing-test.jbhunt.com/pricinglinehaulservices/linehaulprioritygroups/7{?projection}',
                templated : true
              }
            }
          }, {
            lineHaulPriorityGroupID : 8,
            lineHaulGroupPriorityNumber : 1,
            lineHaulPriorityGroupName : 'Country, State Region',
            _links : {
              self : {
                href : 'https://pricing-test.jbhunt.com/pricinglinehaulservices/linehaulprioritygroups/8'
              },
              lineHaulPriorityGroup : {
                href : 'https://pricing-test.jbhunt.com/pricinglinehaulservices/linehaulprioritygroups/8{?projection}',
                templated : true
              }
            }
          } ]
        },
        _links : {
          self : {
            href : 'https://pricing-test.jbhunt.com/pricinglinehaulservices/linehaulprioritygroups{?page,size,sort,projection}',
            templated : true
          },
          profile : {
            href : 'https://pricing-test.jbhunt.com/pricinglinehaulservices/profile/linehaulprioritygroups'
          }
        },
        page : {
          size : 50,
          totalElements : 8,
          totalPages : 1,
          number : 0
        }
      };
    component.groupmodel.editValues = [{
      lineHaulGroupPriorityNumber: 6,
      lineHaulPriorityGroupID: 3,
      lineHaulPriorityGroupName: '5-Zip, 6-Zip, furniture'
    }];
    component.groupmodel.editedGroupIDs = [];
    component.groupmodel.duplicateGroupIds = [];
    component.linehaulPrioritymodel.groupsFirstLoading = true;
    spyOn(groupService, 'savePriorityGroupList').and.returnValue(of(responsenow));
    component.onClickSave();
  });
  it('it should call onClickSave', () => {
    component.groupmodel.loading = false;
    component.groupmodel.editedGroupIDs = [];
    component.groupmodel.editValues = [];
    component.groupmodel.duplicateGroupIds = [];
    component.onClickSave();
  });

  it('it should call onClickSave', () => {
    component.groupmodel.loading = false;
    component.groupmodel.editedGroupIDs = [];
    component.groupmodel.editValues = [];
    component.groupmodel.duplicateGroupIds = [5];
    component.onClickSave();
  });

  it('it should call onCancel', () => {
    component.onCancel();
  });
  xit('it should call onClickYes', () => {
    component.onClickYes();
  });
  it('it should call onClickNo', () => {
    component.onClickNo();
  });
});
