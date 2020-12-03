import { of } from 'rxjs/index';
import { APP_BASE_HREF } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';
import { MessageService } from 'primeng/components/common/messageservice';

import { AppModule } from '../../../../app.module';

import { MileageDetailsComponent } from './mileage-details.component';
import { ViewAgreementDetailsModule } from '../../view-agreement-details.module';
import { ViewMileageService } from '../services/view-mileage.service';
import { ViewMileageModel } from '../models/view-mileage.model';
import { TimeZoneService } from '../../../../shared/jbh-app-services/time-zone.service';

describe('MileageDetailsComponent', () => {
  let component: MileageDetailsComponent;
  let fixture: ComponentFixture<MileageDetailsComponent>;
  let viewMileageService: ViewMileageService;
  let messageService: MessageService;
  let timeZoneService: TimeZoneService;
  let debugElement: DebugElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, ViewMileageService, MessageService, TimeZoneService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MileageDetailsComponent);
    debugElement = fixture.debugElement;
    viewMileageService = debugElement.injector.get(ViewMileageService);
    messageService = TestBed.get(MessageService);
    timeZoneService = TestBed.get(TimeZoneService);
    component = fixture.componentInstance;
    component.viewMileageModel = new ViewMileageModel();
    component.viewMileageModel.sourceData = {
      'sourceData': 'sourceMock'
    };
    component.viewMileageModel.gridSize = 3;
    component.mileageID = 2;
    component.agreementID = 2;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getMileageDetails', () => {
    const viewMileageDetailsResponse = {
      'customerMileageProgramID' : 496,
      'customerMileageProgramVersionID' : 514,
      'customerAgreementID' : 902,
      'customerAgreementName' : 'H.M.T. Services Corp (HMHOAD)',
      'mileageProgramName' : 'Agreement Default Program',
      'mileageType' : 'Agreement',
      'financeBusinessUnitAssociations' : [ ],
      'agreementDefaultIndicator' : 'Y',
      'contractAssociations' : [ ],
      'sectionAssociations' : [ ],
      'mileageSystemID' : 1,
      'mileageSystemName' : 'Rand McNally',
      'mileageSystemVersionID' : 6,
      'mileageSystemVersionName' : '18',
      'unitOfDistanceMeasurementCode' : 'Miles',
      'geographicPointTypeID' : 1,
      'geographicPointTypeName' : 'City State',
      'mileageRouteTypeID' : 1,
      'mileageRouteTypeName' : 'Practical',
      'mileageCalculationTypeID' : 1,
      'mileageCalculationTypeName' : 'Construct',
      'mileageBorderMileParameterTypeID' : 1,
      'mileageBorderMileParameterTypeName' : 'Miles to border',
      'decimalPrecisionIndicator' : 'N',
      'carrierAssociations' : [ {
        'name' : 'Test Carrier 1',
        'id' : 101,
        'code' : 'TCR1'
      } ],
      'mileageSystemParameters' : [ {
        'mileageSystemParameterID' : 2,
        'mileageSystemParameterAssociationID' : 2,
        'mileageSystemParameterName' : 'Border Open',
        'mileageParameterSelectIndicator' : 'N'
      }, {
        'mileageSystemParameterID' : 1,
        'mileageSystemParameterAssociationID' : 1,
        'mileageSystemParameterName' : 'Mixed Geography',
        'mileageParameterSelectIndicator' : 'Y'
      }, {
        'mileageSystemParameterID' : 4,
        'mileageSystemParameterAssociationID' : 4,
        'mileageSystemParameterName' : 'Override Restrictions',
        'mileageParameterSelectIndicator' : 'Y'
      }, {
        'mileageSystemParameterID' : 3,
        'mileageSystemParameterAssociationID' : 3,
        'mileageSystemParameterName' : 'Tolls',
        'mileageParameterSelectIndicator' : 'N'
      } ],
      'effectiveDate' : '2019-08-01',
      'expirationDate' : '2019-08-19',
      'customerMileageProgramNoteID' : 165,
      'mileageProgramNoteText' : 'test Default....',
      'createUserId' : 'jcnt253',
      'createTimestamp' : null,
      'createProgramName' : 'Swedha Ravi',
      'originalEffectiveDate' : '2019-08-01',
      'originalExpirationDate' : '2019-08-19',
      'invalidIndicator' : 'N',
      'invalidReasonType' : 'Inactive',
      'inactivateLevelID' : null,
      'lastUpdateUserId' : 'jcnt253',
      'lastUpdateTimestamp' : null,
      'lastUpdateProgramName' : 'Swedha Ravi'
    };
    spyOn(ViewMileageService.prototype, 'getMileageDetails').and.returnValues(of(viewMileageDetailsResponse));
    component.getMileageDetails();
  });
  it('should call getMileageDetails', () => {
    const viewMileageDetailsResponseWithTimeStamp = {
      'customerMileageProgramID' : 496,
      'customerMileageProgramVersionID' : 514,
      'customerAgreementID' : 902,
      'customerAgreementName' : 'H.M.T. Services Corp (HMHOAD)',
      'mileageProgramName' : 'Agreement Default Program',
      'mileageType' : 'Agreement',
      'financeBusinessUnitAssociations' : [ ],
      'agreementDefaultIndicator' : 'Y',
      'contractAssociations' : [ ],
      'sectionAssociations' : [ ],
      'mileageSystemID' : 1,
      'mileageSystemName' : 'Rand McNally',
      'mileageSystemVersionID' : 6,
      'mileageSystemVersionName' : '18',
      'unitOfDistanceMeasurementCode' : 'Miles',
      'geographicPointTypeID' : 1,
      'geographicPointTypeName' : 'City State',
      'mileageRouteTypeID' : 1,
      'mileageRouteTypeName' : 'Practical',
      'mileageCalculationTypeID' : 1,
      'mileageCalculationTypeName' : 'Construct',
      'mileageBorderMileParameterTypeID' : 1,
      'mileageBorderMileParameterTypeName' : 'Miles to border',
      'decimalPrecisionIndicator' : 'N',
      'carrierAssociations' : [ {
        'name' : 'Test Carrier 1',
        'id' : 101,
        'code' : 'TCR1'
      } ],
      'mileageSystemParameters' : [ {
        'mileageSystemParameterID' : 2,
        'mileageSystemParameterAssociationID' : 2,
        'mileageSystemParameterName' : 'Border Open',
        'mileageParameterSelectIndicator' : 'N'
      }, {
        'mileageSystemParameterID' : 1,
        'mileageSystemParameterAssociationID' : 1,
        'mileageSystemParameterName' : 'Mixed Geography',
        'mileageParameterSelectIndicator' : 'Y'
      }, {
        'mileageSystemParameterID' : 4,
        'mileageSystemParameterAssociationID' : 4,
        'mileageSystemParameterName' : 'Override Restrictions',
        'mileageParameterSelectIndicator' : 'Y'
      }, {
        'mileageSystemParameterID' : 3,
        'mileageSystemParameterAssociationID' : 3,
        'mileageSystemParameterName' : 'Tolls',
        'mileageParameterSelectIndicator' : 'N'
      } ],
      'effectiveDate' : '2019-08-01',
      'expirationDate' : '2019-08-19',
      'customerMileageProgramNoteID' : 165,
      'mileageProgramNoteText' : 'test Default....',
      'createUserId' : 'jcnt253',
      'createTimestamp' : '2019-08-20T13:44:40.542',
      'createProgramName' : 'Swedha Ravi',
      'originalEffectiveDate' : '2019-08-01',
      'originalExpirationDate' : '2019-08-19',
      'invalidIndicator' : 'N',
      'invalidReasonType' : 'Inactive',
      'inactivateLevelID' : null,
      'lastUpdateUserId' : 'jcnt253',
      'lastUpdateTimestamp' : '2019-08-20T13:45:18.94',
      'lastUpdateProgramName' : 'Swedha Ravi'
    };
    spyOn(ViewMileageService.prototype, 'getMileageDetails').and.returnValues(of(viewMileageDetailsResponseWithTimeStamp));
    component.getMileageDetails();
  });
  it('should call onClose', () => {
    component.onClose();
  });
  it('should call toastMessage', () => {
    component.toastMessage(messageService, 'test', 'test', 'test');
  });
  it('should call onClickEdit', () => {
    component.onClickEdit();
  });
});
