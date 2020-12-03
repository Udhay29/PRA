import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../app.module';
import { ViewAgreementDetailsModule } from '../../view-agreement-details.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs/index';

import { LineHaulDetailedViewComponent } from './line-haul-detailed-view.component';
import { MessageService } from 'primeng/components/common/messageservice';
import { DetailedViewService } from './services/detailed-view.service';
import { DetailedViewModel } from './model/detailed-view-model';
import { OverviewService } from '../add-line-haul/overview/services/overview.service';
import { ServiceofferingInterface, OperationalService } from '../add-line-haul/overview/model/overview.interface';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';

describe('LineHaulDetailedViewComponent', () => {
  let component: LineHaulDetailedViewComponent;
  let fixture: ComponentFixture<LineHaulDetailedViewComponent>;
  let lineHaulOverview;
  let messageService: MessageService;
  let detailedViewService: DetailedViewService;
  let overviewService: OverviewService;
  let agreementData;
  let serviceOfferingValues: ServiceofferingInterface[];
  let inactivateForm: FormGroup;
  const formBuilder: FormBuilder = new FormBuilder();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, MessageService, DetailedViewService, OverviewService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineHaulDetailedViewComponent);
    messageService = TestBed.get(MessageService);
    detailedViewService = TestBed.get(DetailedViewService);
    overviewService = TestBed.get(OverviewService);
    component = fixture.componentInstance;
    agreementData = {
      customerAgreementName: 'string',
      lineHaulConfigurationID: 123,
      agreementId: 123
    };
    inactivateForm = formBuilder.group({
      expirationDate: new FormControl('06/24/1996', Validators.required)
    });
    lineHaulOverview = {
      customerLineHaulConfigurationID: 123,
      laneID: 12,
      lineHaulSourceTypeID: 12,
      lineHaulSourceTypeName: 'string',
      origin: {
        type: 'string',
        typeID: 123,
        country: 'string',
        point: 'string',
        pointID: 123,
        description: 'string',
        vendorID: 'string'
      },
      destination: null,
      stops: [],
      stopChargeIncludedIndicator: true,
      status: 'string',
      effectiveDate: new Date('05/05/1995'),
      expirationDate: new Date('05/05/1995'),
      customerAgreementID: 123,
      customerAgreementName: 'string',
      customerAgreementContractID: 123,
      customerAgreementContractNumber: 'string',
      customerAgreementContractName: 'string',
      customerAgreementContractSectionID: 123,
      customerAgreementContractSectionName: 'string',
      financeBusinessUnitServiceOfferingAssociationID: 123,
      financeBusinessUnitName: 'string',
      serviceOfferingCode: 'string',
      serviceOfferingBusinessUnitTransitModeAssociationID: 123,
      transitMode: 'string',
      serviceLevelBusinessUnitServiceOfferingAssociationID: 123,
      serviceLevelCode: 'string',
      equipment: '',
      operationalServices: [],
      priorityLevelNumber: 123,
      overriddenPriority: 'string',
      lineHaulAwardStatusTypeID: 123,
      lineHaulAwardStatusTypeName: 'string',
      rates: [],
      groupRateType: 'string',
      groupRateItemizeIndicator: true,
      sourceID: 123,
      sourceLineHaulID: 123,
      overiddenPriorityLevelNumber: 123,
      lineHaulMileageRangeMinQuantity: 123,
      lineHaulMileageRangeMaxQuantity: 123,
      billTos: [{
        billToID: 123
      }],
      carriers: [{
        carrierID: 123
      }],
      mileagePreference: {
        range: 'abc',
        mileagePreferenceID: 12,
        mileagePreferenceName: 'abc'
      },
      unitOfMeasurement: {
        code: 'abc',
        lineHaulWeightRangeMinQuantity: '123',
        lineHaulWeightRangeMaxQuantity: '1,000'
      },
      hazmatIncludedIndicator: true,
      fuelIncludedIndicator: true,
      autoInvoiceIndicator: true,
      equipmentRequirementSpecificationAssociationID: 123,
      equipmentClassificationCode: 'string',
      equipmentClassificationCodeDescription: 'string',
      equipmentTypeCode: 'string',
      equipmentClassificationDescription: 'string',
      equipmentTypeCodeDescription: 'string',
      equipmentLengthQuantity: 123,
      unitOfEquipmentLengthMeasurementCode: 'string'
  };
    component.detailedViewModel.lineHaulOverview = lineHaulOverview;
    component.agreementData = agreementData;
    serviceOfferingValues = [{
      financeBusinessUnitServiceOfferingAssociationID: 12,
      serviceOfferingCode: 'Brokerage',
      serviceOfferingDescription: 'AAA',
      transitModeId: 123,
      transitModeCode: 'bbb',
      transitModeDescription: 'BBB'
    }];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    spyOn(component, 'getLineHaulOverview');
    spyOn(component, 'getOverflowMenuList');
    component.ngOnInit();
    expect(component.getLineHaulOverview).toHaveBeenCalled();
    expect(component.getOverflowMenuList).toHaveBeenCalled();
  });

  it('should call ngOnDestroy', () => {
    component.ngOnDestroy();
  });

  it('should call formIntialisation', () => {
    component.formIntialisation();
  });

  it('should call getOverflowMenuList', () => {
    component.getOverflowMenuList();
  });

  it('should call getLineHaulOverview', () => {
    component.agreementData = agreementData;
    spyOn(DetailedViewService.prototype, 'getLineHaulOverView').and.returnValue(of(lineHaulOverview));
    component.getLineHaulOverview();
  });

  it('should call getLineHaulOverview1', () => {
    component.agreementData = agreementData;
    component.detailedViewModel.lineHaulOverview['overriddenPriority'] = null;
    spyOn(DetailedViewService.prototype, 'getLineHaulOverView').and.returnValue(of(lineHaulOverview));
    component.getLineHaulOverview();
  });

  it('should call getLineHaulOverview2', () => {
    component.agreementData = agreementData;
    component.detailedViewModel.lineHaulOverview['overriddenPriority'] = null;
    lineHaulOverview = {};
    spyOn(DetailedViewService.prototype, 'getLineHaulOverView').and.returnValue(of(lineHaulOverview));
    component.getLineHaulOverview();
  });

  it('should call setOperationalSerivces', () => {
    const data = [{
      serviceTypeCode: '123',
      serviceCategoryCode: '123',
      chargeCode: 1,
      serviceTypeDescription: 'aaaa',
      effectiveTimestamp: '05/15/2019',
      expirationTimestamp: '12/15/2019',
      lastUpdateTimestampString: '05/15/2019',
    }];
    component.setOperationalSerivces(lineHaulOverview);
  });

  it('should call onBlurDateValidate', () => {
    const event = {
      srcElement: {
        value: '06/24/1996'
      }
    };
    component.detailedViewModel.maxDate = new Date('06/25/1996');
    component.onBlurDateValidate(event);
  });

  it('should call onBlurDateValidate', () => {
    const event = {
      srcElement: {
        value: ''
      }
    };
    component.onBlurDateValidate(event);
  });

  it('should call onBlurDateValidate', () => {
    const event = {
      srcElement: {
        value: '06/24/1996'
      }
    };
    component.onBlurDateValidate(event);
  });

  it('should call inactivateLineHaul', () => {
    const inactivateLineHaul = {
      customerLineHaulConfigurationID: 2319,
      message: 'Success',
      status: 'success'
    };
    spyOn(DetailedViewService.prototype, 'inactivateLineHauls').and.returnValue(of(inactivateLineHaul));
    component.inactivateLineHaul('a');
  });

  it('should call inactivateLineHaul', () => {
    const inactivateLineHaul = {
      customerLineHaulConfigurationID: 2319,
      message: 'Warning',
      status: 'warn'
    };
    spyOn(DetailedViewService.prototype, 'inactivateLineHauls').and.returnValue(of(inactivateLineHaul));
    component.inactivateLineHaul('a');
  });

  it('should call getCurrentDate', () => {
    component.getCurrentDate();
  });

  it('should call onClickInactivate', () => {
    component.detailedViewModel.inactivateForm.controls['expirationDate'].setValue(new Date('06/24/2019'));
    component.detailedViewModel.lineHaulOverview.effectiveDate = '06/29/2019';
    component.agreementData = {
      customerAgreementName: 'string',
      lineHaulConfigurationID: 2319,
      agreementId: 27,
    };
    component.onClickInactivate();
  });

  it('should call onClickInactivate', () => {
    component.detailedViewModel.inactivateForm.controls['expirationDate'].setValue(new Date('06/24/2019'));
    component.detailedViewModel.lineHaulOverview.effectiveDate = '06/26/2019';
    component.agreementData = {
      customerAgreementName: 'string',
      lineHaulConfigurationID: 2319,
      agreementId: 27,
    };
    component.onClickInactivate();
  });

  it('should call onClickInactivate', () => {
    component.toastMessage(messageService, 'error', 'Line Haul inactivate',
      'New expiration required to inactivate.  Please provide date or cancel if inactivation is not needed');
    spyOn(component, 'toastMessage');
    expect(component.toastMessage).toBeTruthy();
    component.onClickInactivate();
  });

  it('should call onClickCancel', () => {
    component.onClickCancel();
  });

  it('should call onClickCancel', () => {
    component.onClickCancel('Cancel Inactivation');
  });

  it('should call onClickProceed', () => {
    component.agreementData = agreementData;
    component.onClickProceed();
  });

  it('should call toastMessage', () => {
    component.toastMessage(messageService, 'error', 'b', 'c');
  });

  it('should call onTypeDate', () => {
    const event = {
      srcElement: {
        value: '06/24/1996'
      }
    };
    component.onTypeDate(event);
  });

  it('should call onTypeDate', () => {
    const event = {
      srcElement: {
        value: ''
      }
    };
    component.onTypeDate(event);
  });
});
