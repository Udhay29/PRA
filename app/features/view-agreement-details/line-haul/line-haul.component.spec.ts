import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ElementRef
} from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { MessageService } from 'primeng/components/common/messageservice';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LineHaulModel } from './model/line-haul.model';

import { AppModule } from '../../../app.module';
import { ViewAgreementDetailsModule } from '../view-agreement-details.module';

import { LineHaulComponent } from './line-haul.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LineHaulService } from './service/line-haul.service';
import {
  LineHaulGridDto, HitsItem, LineHaulDetailsItem, OperationalServicesItem,
  StopsItem, InactiveResponseDto
} from './model/line-haul.interface';
import { By } from '@angular/platform-browser';

describe('LineHaulComponent', () => {
  let component: LineHaulComponent;
  let fixture: ComponentFixture<LineHaulComponent>;
  let hitsInterface;
  let lineHauldetails;
  let messageService: MessageService;
  let lineHaulService: LineHaulService;
  let datareceive;
  let datafetch;
  let selectedData: LineHaulDetailsItem;
  const formBuilder = new FormBuilder();
  let lineHaulModel: LineHaulModel;
  const datasuccess = {
    took: 12,
    timed_out: true,
    _shards: {
      total: 1,
      successful: 2,
      skipped: 1,
      failed: 2
    },
    hits: {
      total: 1,
      max_score: 1,
      hits: [{
        _index: 'string',
        _type: 'string',
        _id: 'string',
        _score: 12,
        _source: {
          lineHaulConfigurationID: 12,
          laneID: 22,
          lineHaulSourceTypeID: 12,
          lineHaulSourceTypeName: 'string',
          origin: {
            type: 'string',
            typeID: 12,
            country: 'string',
            point: 'string',
            pointID: 11,
            description: 'string',
            vendorID: 'string'
          },
          destination: {
            type: 'string',
            typeID: 11,
            country: 'string',
            point: 'string',
            pointID: 12,
            description: 'string',
            vendorID: 'string'
          },
          stops: [{
            stopSequenceNumber: 12,
            stopTypeName: 'string',
            stopTypeID: 33,
            stopCountry: 'string',
            stopPoint: 'string',
            stopPointID: 11
          }],
          stopChargeIncludedIndicator: true,
          status: 'string',
          effectiveDate: '2019-05-09',
          expirationDate: '2099-05-09',
          agreementID: 11,
          agreementName: 'string',
          contractID: 123,
          contractNumber: 'string',
          contractName: 'string',
          sectionID: 33,
          sectionName: 'string',
          financeBusinessUnitServiceOfferingAssociationID: 45,
          businessUnit: 'string',
          serviceOffering: 'string',
          serviceOfferingDescription: 'string',
          serviceOfferingBusinessUnitTransitModeAssociationID: 2,
          transitMode: 'string',
          serviceLevelBusinessUnitServiceOfferingAssociationID: 4,
          serviceLevel: 'string',
          equipmentRequirementSpecificationAssociationID: 5,
          equipmentClassificationCode: 'string',
          equipmentTypeCode: 'string',
          equipmentLengthQuantity: 67,
          unitOfEquipmentLengthMeasurementCode: 'string',
          operationalServices: [{
            serviceTypeCode: 'string'
          }],
          priorityNumber: 7,
          overriddenPriority: 1,
          awardStatusID: 55,
          awardStatus: 'string',
          rates: [{
            customerLineHaulRateID: 12,
            customerLineHaulConfigurationID: 14,
            chargeUnitType: 'string',
            rateAmount: 778,
            minimumAmount: 90,
            maximumAmount: 88,
            currencyCode: 'string'
          }],
          groupRateType: 'string',
          groupRateItemIndicator: true,
          sourceID: 5,
          sourceLineHaulID: 66,
          overridenPriorityNumber: 223,
          billTos: [{
            billToID: 22,
            billToName: 'string',
            billToCode: 'string'
          }],
          carriers: [{
            carrierID: 11,
            carrierName: 'string',
            carrierCode: 'string'
          }],
          mileagePreference: {
            mileagePreferenceID: 44,
            mileagePreferenceName: 'string',
            mileagePreferenceMinRange: 55,
            mileagePreferenceMaxRange: 76
          },
          unitOfMeasurement: {
            code: 'string',
            description: 'string',
            minWeightRange: 34,
            maxWeightRange: 45
          },
          hazmatIncludedIndicator: true,
          fuelIncludedIndicator: true,
          autoInvoiceIndicator: true,
          recordStatus: 'string'
        }
      }]
    }
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, MessageService, LineHaulService]
    });
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(LineHaulComponent);
    messageService = TestBed.get(MessageService);
    lineHaulService = TestBed.get(LineHaulService);
    component = fixture.componentInstance;
    lineHaulModel = new LineHaulModel;
    const address = {
      country: 'string',
      postalCode: 'string',
      description: 'string',
      vendorID: 'string',
      type: 'string',
      point: 'string',
      pointID: 123,
      cityName: 'string',
      stateName: 'string',
      countryCode: 'string',
      addressLine1: 'string',
      typeID: 123,
      addressLine2: 'string',
      stateCode: 'string',
      countryName: 'string'
    };
    component.lineHaulModel = lineHaulModel;
    component.lineHaulModel.lineHaulInactivateForm = formBuilder.group({
      expirationDate: [new Date('04/06/1995')]
    });
    selectedData = {
      customerAgreementContractNumber: 'string',
      serviceOfferingBusinessUnitTransitModeAssociationID: 123,
      autoInvoiceIndicator: 'Yes',
      lineHaulAwardStatusTypeID: 123,
      groupRateItemizeIndicator: 'Yes',
      lineHaulAwardStatusTypeName: 'string',
      lineHaulSourceTypeName: 'string',
      transitModeDescription: 'string',
      equipmentTypeCode: 'string',
      unitOfMeasurement: null,
      equipmentClassificationCodeDescription: 'string',
      billTos: [],
      mileagePreference: null,
      priorityLevelNumber: 123,
      customerAgreementContractSectionID: 123,
      carriers: [],
      customerAgreementName: 'string',
      overiddenPriorityLevelNumber: 123,
      numberOfStops: 123,
      transitMode: 'string',
      serviceOfferingDescription: 'string',
      customerAgreementID: 123,
      stops: [],
      equipmentLengthDisplayName: 'string',
      status: 'string',
      serviceOfferingCode: 'string',
      lineHaulSourceTypeID: 123,
      serviceLevelDescription: 'string',
      equipmentClassificationCode: 'string',
      unitOfEquipmentLengthMeasurementCode: 'string',
      equipmentRequirementSpecificationAssociationID: 123,
      origin: address,
      destination: address,
      financeBusinessUnitName: 'string',
      financeBusinessUnitServiceOfferingAssociationID: 123,
      customerAgreementContractDisplayName: 'string',
      serviceLevelBusinessUnitServiceOfferingAssociationID: 123,
      operationalServices: [],
      stopChargeIncludedIndicator: 'Yes',
      hazmatIncludedIndicator: 'Yes',
      laneID: 123,
      customerAgreementContractName: 'string',
      dbSyncUpdateTimestamp: new Date(),
      sourceLineHaulID: 'string',
      customerAgreementContractID: 123,
      groupRateType: 'string',
      equipmentLengthQuantity: 123,
      expirationDate: '05/06/1994',
      sourceID: 'string',
      createdUserId: 'string',
      serviceLevelCode: 'string',
      lastUpdateUserId: 'string',
      rates: [],
      customerAgreementContractSectionName: 'string',
      equipmentTypeCodeDescription: 'string',
      recordStatus: 'string',
      fuelIncludedIndicator: true,
      customerLineHaulConfigurationID: 123,
      effectiveDate: '05/06/2022'
  };
    datareceive = {
      hits: {
        hits: [],
        max_score: null,
        total: 1,
      }
    };
    hitsInterface = {
      LineHaulGridDto: {
        took: 12,
        timed_out: true,
        shards: null,
        hits: []
      }
    };
    datafetch = {
      data: {
        _index: 'string',
        _type: 'string',
        _id: 'string',
        _score: 1,
        _source: []
      }
    };

    lineHauldetails = {
      customerLineHaulConfigurationID: 1814,
      laneID: 4488,
      lineHaulSourceTypeID: 4,
      lineHaulSourceTypeName: 'Manual ',
      origin: {
        country: null,
        description: null,
        point: null,
        pointID: 1686067,
        type: 'Address',
        typeID: 3,
        vendorID: null
      },
     destination: {
        country: null,
        description: null,
        point: null,
        pointID: 90894,
        type: 'Address',
        typeID: 3,
        vendorID: null
      },
      stops: [{
        stopSequenceNumber: 123,
        stopTypeName: 'aaa',
        stopTypeID: 123,
        stopCountry: 'USA',
        stopPoint: 'point',
        stopPointID: 123
      }],
      stopChargeIncludedIndicator: false,
      status: 'Draft',
      effectiveDate: '2019-05-09',
      expirationDate: '2019-05-28',
      customerAgreementID: 27,
      customerAgreementName: 'Adams Cable Equipment (ADLE59)',
      contractID: 47,
      contractNumber: null,
      contractName: 'Adams Contract',
      sectionID: 44,
      sectionName: 'AdamSection1',
      financeBusinessUnitServiceOfferingAssociationID: 7,
      businessUnit: 'ICS',
      serviceOffering: 'Brokerage',
      serviceOfferingBusinessUnitTransitModeAssociationID: 7,
      transitMode: 'Truck',
      serviceLevelBusinessUnitServiceOfferingAssociationID: null,
      serviceLevel: null,
      equipment: null,
      operationalServices: [],
      priorityNumber: 65,
      overriddenPriority: null,
      awardStatusID: 4,
      awardStatus: 'Tertiary',
      rates: [{
        chargeUnitType: 'Per Kilometer',
        currencyCode: 'USD',
        customerLineHaulConfigurationID: 1814,
        customerLineHaulRateID: 1957,
        maximumAmount: null,
        minimumAmount: null,
        rateAmount: 12,
      }],
      groupRateType: null,
      groupRateItemIndicator: false,
      sourceID: null,
      sourceLineHaulID: null,
      overridenPriorityNumber: null,
      billTos: null,
      carriers: [],
      mileagePreference: {
        mileagePreferenceID: null,
        mileagePreferenceMaxRange: 10,
        mileagePreferenceName: null,
        mileagePreferenceMinRange: 0
      },
      mileagePreferenceMinRange: 0,
      mileagePreferenceMaxRange: 10,
      unitOfMeasurement: {
        code: 'Kilograms',
        maxWeightRange: 12,
        description: 'Kilograms',
        minWeightRange: 0
      },
      hazmatIncludedIndicator: false,
      fuelIncludedIndicator: false,
      autoInvoiceIndicator: true,
      equipmentRequirementSpecificationAssociationID: 492,
      equipmentClassificationCode: 'Chassis',
      equipmentClassificationCodeDescription: 'CHASSIS',
      equipmentTypeCode: 'Chassis',
      equipmentTypeCodeDescription: 'CHASSIS',
      equipmentLengthQuantity: 6,
      unitOfEquipmentLengthMeasurementCode: 'Feet',
    };
    component.lineHaulModel.selectedLineHaulData = [];
    component.lineHaulModel.selectedLineHaulConfigurationId = [];
    component.lineHaulModel.lineHaulList = [];
    component.lineHaulModel.isLineHaulSearch = true;
    fixture.detectChanges();
  });

  it('should create 1', () => {
    component.screen = 'review';
    expect(component).toBeTruthy();
  });

  it('should create 1a', () => {
    expect(component).toBeTruthy();
  });

  it('loadGridFields 2', () => {
    component.loadGridFields(lineHauldetails);
  });

  it('loadGridFields 2a', () => {
    component.formIntialisation();
  });

  it('iterateLineHaulStops 3', () => {
    component.iterateLineHaulStops(lineHauldetails);
  });

  it('iterateBillToDetails 4', () => {
    component.iterateBillToDetails(lineHauldetails);
  });

  it('iterateLineHaulRate 5', () => {
    component.iterateLineHaulRate(lineHauldetails);
  });

  it('lineHaulDetailsMileageValues 7', () => {
    component.lineHaulDetailsMileageValues(lineHauldetails);
  });

  it('iterateLineHaulFields 8', () => {
    component.iterateLineHaulFields(lineHauldetails);
  });

  it('screenValidation 9', () => {
    component.screenValidation();
  });

  it('rowCheckValidation 10', () => {
    component.rowCheckValidation();
  });

  it('isDeleteValidation 11', () => {
    component.screen = 'review';
    component.isDeleteValidation();
  });

  it('isDeleteValidation else', () => {
    component.screen = 'rev';
    component.lineHaulModel.selectedLineHaulData = [];
    component.isDeleteValidation();
  });

  it('should call toastMessage 12', () => {
    component.toastMessage(messageService, 'error', 'b', 'c');
    expect(component.toastMessage).toBeTruthy();
  });

  it('onHeaderCheckboxToggle true 13', () => {
    const event = new Event('MyEvent');
    event['checked'] = true;
    component.screen = 'review';
    const element = fixture.debugElement.query(By.css('p-table'));
    element.triggerEventHandler('onHeaderCheckboxToggle', event);
  });
  it('onHeaderCheckboxToggle true', () => {
    const event = new Event('MyEvent');
    event['checked'] = true;
    component.screen = 'reviews';
    const element = fixture.debugElement.query(By.css('p-table'));
    element.triggerEventHandler('onHeaderCheckboxToggle', event);
  });


  it('onHeaderCheckboxToggle false 14', () => {
    const event = new Event('MyEvent');
    event['checked'] = false;
    component.lineHaulModel.isDelete = true;
    const element = fixture.debugElement.query(By.css('p-table'));
    element.triggerEventHandler('onHeaderCheckboxToggle', event);
  });

  it('sonRowSelect 15', () => {
    const event = new Event('MyEvent');
    component.onRowSelect(event);
  });

  it('onLineHaulDeleteSelected 16', () => {
    component.lineHaulModel.isLineHaulDelete = true;
    component.onLineHaulDeleteSelected();
  });

  it('onLineHaulDeleteCancel 17', () => {
    component.lineHaulModel.isLineHaulDelete = false;
    component.lineHaulModel.isDelete = false;
    component.onLineHaulDeleteCancel();
  });

  it('showInactivatePopup 18', () => {
    component.lineHaulModel.isLineHaulDelete = true;
    component.lineHaulModel.selectedLineHaulData = [selectedData];
    component.showInactivatePopup();
  });

  it('onLineHaulDelete 19', () => {
    const responsenow = {
      status: 'string',
      message: 'string',
      customerLineHaulConfigurationID: 12
    };
    spyOn(LineHaulService.prototype, 'deleteLineHaulRecords').and.returnValues(of(responsenow));
    component.onLineHaulDelete();
  });

  it('inactivateLineHaul 20', () => {
    const responsenow = {
      status: 'warning',
      message: 'string',
      customerLineHaulConfigurationID: 12
    };
    spyOn(LineHaulService.prototype, 'inactivateLineHauls').and.returnValues(of(responsenow));
    component.inactivateLineHaul('test');
  });

  it('inactivateLineHaul null 21', () => {
    const responsenow = {
      status: 'testdata',
      message: 'string',
      customerLineHaulConfigurationID: 12
    };
    spyOn(LineHaulService.prototype, 'inactivateLineHauls').and.returnValues(of(responsenow));
    component.inactivateLineHaul('');
  });

  it('exportToExcel', () => {
    component.exportToExcel();
  });

  it('onClickInactivate 26', () => {
    component.onClickInactivate();
  });
  it('onClickInactivate else 1', () => {
    component.lineHaulModel.priorEffDateFlag = true;
    component.lineHaulModel.priorExpDateFlag = true;
    component.onClickInactivate();
  });
  it('onClickInactivate else 2', () => {
    component.lineHaulModel.lineHaulInactivateForm.controls.expirationDate.setErrors({ error: true });
    component.onClickInactivate();
  });

  it('lineHaulInactivateInfo 27', () => {
    component.lineHaulModel.selectedLineHaulData.length = 1;
    component.lineHaulModel.showconformationPopup = false;
    component.lineHaulInactivateInfo();
  });
  it('lineHaulInactivateInfo Else', () => {
    component.lineHaulModel.selectedLineHaulData.length = 2;
    component.lineHaulModel.showconformationPopup = false;
    component.lineHaulInactivateInfo();
  });

  it('onClickCancel -ve 28', () => {
    const from = 'Cancel Inactivation';
    component.lineHaulModel.inactivatePopup = true;
    component.lineHaulModel.showconformationPopup = false;
    component.onClickCancel(from);
  });

  it('onClickCancel +ve 29', () => {
    const from = 'test';
    component.lineHaulModel.inactivatePopup = false;
    component.onClickCancel(from);
  });

  it('onClickProceed 30', () => {
    component.lineHaulModel.selectedLineHaulConfigurationId = [123];
    component.onClickProceed();
  });
  it('onRowSelect row', () => {
    const event: any = {
      originalEvent: {isTrusted: true },
      data: {
        lineHaulConfigurationID: 12,
        laneID: 22,
        lineHaulSourceTypeID: 12,
        lineHaulSourceTypeName: 'string',
        origin: {
          type: 'string',
          typeID: 12,
          country: 'string',
          point: 'string',
          pointID: 11,
          description: 'string',
          vendorID: 'string'
        },
        destination: {
          type: 'string',
          typeID: 11,
          country: 'string',
          point: 'string',
          pointID: 12,
          description: 'string',
          vendorID: 'string'
        },
        stops: [{
          stopSequenceNumber: 12,
          stopTypeName: 'string',
          stopTypeID: 33,
          stopCountry: 'string',
          stopPoint: 'string',
          stopPointID: 11
        }],
        stopChargeIncludedIndicator: true,
        status: 'string',
       effectiveDate: 'string',
        expirationDate: 'string',
        customerAgreementID: 11,
        customerAgreementName: 'string',
        customerAgreementContractID: 123,
        customerAgreementContractNumber: 'string',
        customerAgreementContractName: 'string',
        customerAgreementContractSectionID: 33,
        customerAgreementContractSectionName: 'string',
        financeBusinessUnitServiceOfferingAssociationID: 45,
        financeBusinessUnitName: 'string',
        serviceOfferingCode: 'string',
        serviceOfferingDescription: 'string',
        serviceOfferingBusinessUnitTransitModeAssociationID: 2,
        transitMode: 'string',
        serviceLevelBusinessUnitServiceOfferingAssociationID: 4,
        serviceLevelCode: 'string',
        equipmentRequirementSpecificationAssociationID: 5,
        equipmentClassificationCode: 'string',
        equipmentTypeCode: 'string',
        equipmentLengthQuantity: 67,
        unitOfEquipmentLengthMeasurementCode: 'string',
        operationalServices: [{
          serviceTypeCode: 'string'
        }],
        priorityLevelNumber: 7,
        overiddenPriorityLevelNumber: 1,
        lineHaulAwardStatusTypeID: 55,
        lineHaulAwardStatusTypeName: 'string',
        rates: [{
          customerLineHaulRateID: 12,
          customerLineHaulConfigurationID: 14,
          chargeUnitTypeName: 'string',
          rateAmount: 778,
          minimumAmount: 90,
          maximumAmount: 88,
          currencyCode: 'string'
        }],
        groupRateType: 'string',
        groupRateItemizeIndicator: true,
        sourceID: 5,
        sourceLineHaulID: 66,
        billTos: [{
         billToID: 22,
          billToName: 'string',
          billToCode: 'string'
        }],
        carriers: [{
          carrierID: 11,
          carrierName: 'string',
          carrierCode: 'string'
        }],
        mileagePreference: {
          mileagePreferenceID: 44,
          mileagePreferenceName: 'string',
          lineHaulMileageRangeMinQuantity: 55,
          lineHaulMileageRangeMaxQuantity: 76
        },
        unitOfMeasurement: {
          code: 'string',
          description: 'string',
          lineHaulWeightRangeMinQuantity: 34,
          lineHaulWeightRangeMaxQuantity: 45
        },
        hazmatIncludedIndicator: 'Yes',
        fuelIncludedIndicator: 'Yes',
        autoInvoiceIndicator: 'Yes',
        recordStatus: 'string'
      },
      type: 'row'
    };
    component.screen = 'reviews';
    const evtNeg = new CustomEvent('selectRow', event);
    component.onRowSelect(evtNeg);
  });
  it('onRowUnselect', () => {
    component.lineHaulModel.selectedLineHaulData = [selectedData];
    const event: any = {
      'originalEvent': { 'isTrusted': true }, 'data': {}, 'type': 'row'
    };
    component.screen = 'review';
    component.lineHaulModel.isDelete = true;
    const evtNeg = new CustomEvent('selectRow', event);
    component.onRowUnselect(evtNeg);
  });
  it('onRowUnselect else case', () => {
    component.lineHaulModel.selectedLineHaulData = [selectedData];
    const event: any = {
      'originalEvent': { 'isTrusted': true }, 'data': {}, 'type': 'row'
    };
    component.screen = 'reviews';
    component.lineHaulModel.isDelete = true;
    const evtNeg = new CustomEvent('selectRow', event);
    component.onRowUnselect(evtNeg);
  });

  it('showLineHaulDetails', () => {
    const event: any = {
      originalEvent: { 'isTrusted': true },
      data: {
        agreementName: 'string',
        agreementID: 12,
        lineHaulConfigurationID: 12
      },
      type: 'row'
    };
    component.screen = 'review';
    component.showLineHaulDetails(event);
  });

  it('showLineHaulDetails else condition', () => {
    const event = {
      originalEvent: { 'isTrusted': true },
      data: {
        agreementName: 'string',
        agreementID: 12,
        lineHaulConfigurationID: 12
      },
      type: 'row'
    };
    component.screen = 'reviews';
    component.showLineHaulDetails(event);
  });

  it('Form should be valid', async(() => {
    component.lineHaulModel.preceedingEffDate = 0;
    component.lineHaulModel.exceedingExpDate = 0;
    component.lineHaulModel.canDeleteCount = 0;
    component.lineHaulModel.priorEffDateFlag = false;
    component.lineHaulModel.priorExpDateFlag = false;
    component.lineHaulModel.canDeleteFlag = false;
    component.lineHaulModel.lineHaulInactivateForm.controls.expirationDate.setValue('12/31/2099');
    component.onClickInactivate();
    expect(component.lineHaulModel.lineHaulInactivateForm.valid).toBeTruthy();
  }));

  it('should call loadGridData for if', () => {
    const event = {
      sortOrder: 1,
      sortField: 'weightRange',
      rows: 25,
      first: 0
    };
    component.agreementId = 123;
    component.lineHaulModel.isReview = true;
    component.lineHaulModel.tableSize = 25;
    component.lineHaulModel.lineHaulSearchValue = 'string';
    component.lineHaulModel.createdUser = 'user';
    component.status = 'published';
    component.screen = 'review';
    component.lineHaulModel.lineHaulList = [selectedData];
    const element = fixture.debugElement.query(By.css('p-table'));
    element.triggerEventHandler('onLazyLoad', event);
  });
  it('loadGridData if case and inner else case', () => {
    const event = {
      sortOrder: 1,
      sortField: 'weightRange',
      rows: 25,
      first: 0
    };
    component.agreementId = 123;
    component.lineHaulModel.isReview = true;
    component.lineHaulModel.tableSize = 25;
    component.lineHaulModel.lineHaulSearchValue = 'string';
    component.lineHaulModel.createdUser = 'user';
    component.status = 'published';
    component.screen = 'rev';
    component.lineHaulModel.lineHaulList = [selectedData];
    const element = fixture.debugElement.query(By.css('p-table'));
    element.triggerEventHandler('onLazyLoad', event);
  });
  it('loadGridRecords if through loadGridData else case', () => {
    component.screen = 'review';
    component.lineHaulModel.gridDataLength = 0;
    component.lineHaulModel.isLineHaulSearch = false;
    const response = {
      took: 12,
      timed_out: false,
      _shards: null,
      hits: {
        total: 12,
        max_score: 12,
        hits: []
      }
    };
    spyOn(LineHaulService.prototype, 'getLineHaulData').and.returnValue(of(response));
    const element = fixture.debugElement.query(By.css('p-table'));
    element.triggerEventHandler('onLazyLoad', null);
  });
  xit('loadGridRecords else if through loadGridData else case', () => {
    component.screen = 'review';
    component.lineHaulModel.isLineHaulSearch = true;
    component.lineHaulModel.gridDataLength = 1;
    const response = {
      took: 12,
      timed_out: false,
      _shards: null,
      hits: {
        total: 12,
        max_score: 12,
        hits: []
      }
    };
    spyOn(LineHaulService.prototype, 'getLineHaulData').and.returnValue(of(response));
    const element = fixture.debugElement.query(By.css('p-table'));
    element.triggerEventHandler('onLazyLoad', null);
  });
  it('loadGridRecords else through loadGridData else case', () => {
    component.screen = 'rev';
    component.lineHaulModel.isLineHaulSearch = true;
    component.lineHaulModel.gridDataLength = 1;
    const response = {
      took: 12,
      timed_out: false,
      _shards: null,
      hits: {
        total: 12,
        max_score: 12,
        hits: []
      }
    };
    spyOn(LineHaulService.prototype, 'getLineHaulData').and.returnValue(of(response));
    const element = fixture.debugElement.query(By.css('p-table'));
    element.triggerEventHandler('onLazyLoad', null);
  });
  it('Should call lineHaulInactivate if condition', () => {
    const arr: number[] = [];
    component.lineHaulModel.lineHaulInactivateForm = formBuilder.group({
      expirationDate: [new Date('04/06/1995')]
    });
    component.lineHaulModel.dateFormat = 'YYYY-MM-DD';
    component.lineHaulModel.selectedLineHaulData = [selectedData];
    component.lineHaulInactivate(arr);
  });
  it('Should call lineHaulInactivate else if condition', () => {
    const arr: number[] = [];
    component.lineHaulModel.lineHaulInactivateForm = formBuilder.group({
      expirationDate: [new Date('04/06/1995')]
    });
    selectedData.effectiveDate = '06/05/2019';
    component.lineHaulModel.dateFormat = 'YYYY-MM-DD';
    component.lineHaulModel.selectedLineHaulData = [selectedData];
    component.lineHaulInactivate(arr);
  });
  it('Should call lineHaulInactivate else if condition', () => {
    const arr: number[] = [];
    component.lineHaulModel.lineHaulInactivateForm = formBuilder.group({
      expirationDate: [new Date('04/06/2050')]
    });
    selectedData.effectiveDate = '06/05/2019';
    selectedData.expirationDate = '06/05/2056';
    component.lineHaulModel.dateFormat = 'YYYY-MM-DD';
    component.lineHaulModel.selectedLineHaulData = [selectedData];
    component.lineHaulInactivate(arr);
    expect(lineHauldetails).toBeTruthy();
  });
  it('sortAdditionalField case 1', () => {
    const event = {
      sortOrder: 1,
      sortField: 'contractName'
    };
    const lineHaulQuery = lineHaulService.getQueryParam();
    component.sortAdditionalField(event, lineHaulQuery);
  });
  it('sortAdditionalField case 2', () => {
    const event = {
      sortOrder: 1,
      sortField: 'unitOfEquipmentLengthMeasurementCode'
    };
    const lineHaulQuery = lineHaulService.getQueryParam();
    component.sortAdditionalField(event, lineHaulQuery);
  });
  it('sortAdditionalField case 3', () => {
    const event = {
      sortOrder: 1,
      sortField: 'billToCode'
    };
    const lineHaulQuery = lineHaulService.getQueryParam();
    component.sortAdditionalField(event, lineHaulQuery);
  });
  it('sortAdditionalField case 4', () => {
    const event = {
      sortOrder: 1,
      sortField: 'carrierCode'
    };
    const lineHaulQuery = lineHaulService.getQueryParam();
    component.sortAdditionalField(event, lineHaulQuery);
  });
  it('sortAdditionalField case 5', () => {
    const event = {
      sortOrder: 1,
      sortField: 'mileageRange'
    };
    const lineHaulQuery = lineHaulService.getQueryParam();
    component.sortAdditionalField(event, lineHaulQuery);
  });
  it('sortAdditionalField case 6', () => {
    const event = {
      sortOrder: 1,
      sortField: 'weightRange'
    };
    const lineHaulQuery = lineHaulService.getQueryParam();
    component.sortAdditionalField(event, lineHaulQuery);
  });
  it('sortAdditionalField default case', () => {
    const event = {
      sortOrder: 1,
      sortField: 'weightsRange'
    };
    const lineHaulQuery = lineHaulService.getQueryParam();
    component.sortAdditionalField(event, lineHaulQuery);
  });
  it('should call onTypeDate if', () => {
    const event = {
      srcElement : {
        value : '01/01/2019'
      }
    };
    const element = fixture.debugElement.query(By.css('p-calendar'));
    element.triggerEventHandler('onInput', event);
  });
  it('should call onTypeDate else', () => {
    const event = {
      srcElement : {
        value : '01/01/20199'
      }
    };
    const element = fixture.debugElement.query(By.css('p-calendar'));
    element.triggerEventHandler('onInput', event);
  });
  it('should call onBlurDateValidate if', () => {
    const event = {
      srcElement : {
        value : '01/01/2019'
      }
    };
    const date = '04/07/2020';
    component.lineHaulModel.maxDate = new Date(date);
    const element = fixture.debugElement.query(By.css('p-calendar'));
    element.triggerEventHandler('onBlur', event);
  });
  it('should call onBlurDateValidate Elseif', () => {
    const event = {
      srcElement : {
        value : ''
      }
    };
    const element = fixture.debugElement.query(By.css('p-calendar'));
    element.triggerEventHandler('onBlur', event);
  });
  it('should call onBlurDateValidate Else', () => {
    const event = {
      srcElement : {
        value : '01/01/209999'
      }
    };
    const element = fixture.debugElement.query(By.css('p-calendar'));
    element.triggerEventHandler('onBlur', event);
  });
  it('groupRateItemizeView if inner if', () => {
    component.groupRateItemizeView('Sum', 'Yes');
  });
  it('groupRateItemizeView if inner else', () => {
    component.groupRateItemizeView('Sum', 'No');
  });
  it('groupRateItemizeView else', () => {
    component.groupRateItemizeView('Summ', 'Yes');
  });
  it('stopChargeFramer if inner if', () => {
    const param = [{
      customerLineHaulStopID: 123,
      geographicPointUsageLevelTypeAssociationID: 123,
      stopCountry: 'string',
      stopLocationPointID: 123,
      stopPoint: 'string',
      stopSequenceNumber: 123,
      stopTypeName: 123,
      vendorID: 123
  }];
    component.stopChargeFramer(param, 'Yes');
  });
  it('stopChargeFramer if inner else', () => {
    const param = [{
      customerLineHaulStopID: 123,
      geographicPointUsageLevelTypeAssociationID: 123,
      stopCountry: 'string',
      stopLocationPointID: 123,
      stopPoint: 'string',
      stopSequenceNumber: 123,
      stopTypeName: 123,
      vendorID: 123
  }];
    component.stopChargeFramer(param, 'No');
  });
  it('stopChargeFramer else', () => {
    component.stopChargeFramer([], 'Yes');
  });
  it('should call searchGridRecords', () => {
    const event = {
      currentTarget : {
        value : 'abc'
      }
    };
    component.screen = 'review';
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.searchbox'));
    element.triggerEventHandler('keyup', event);
    fixture.detectChanges();
  });
  it('should call searchGridRecords first else', () => {
    const event = {
      currentTarget : {
        value : 'abc'
      }
    };
    component.screen = 'reviews';
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.searchbox'));
    element.triggerEventHandler('keyup', event);
  });
  it('should call searchGridRecords second else', () => {
    const event = null;
    component.screen = 'reviews';
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.searchbox'));
    element.triggerEventHandler('keyup', event);
  });
});

