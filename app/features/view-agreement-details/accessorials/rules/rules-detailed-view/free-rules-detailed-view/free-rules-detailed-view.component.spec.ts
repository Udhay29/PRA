import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FreeRuleDetailModel } from './model/free-rule-detailed-view-model';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from '../../../../../../app.module';
import { ViewAgreementDetailsModule } from '.././../../../view-agreement-details.module';
import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from 'ng-bullet';
import * as utils from 'lodash';
import * as moment from 'moment';
import { of } from 'rxjs';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { FreeRulesDetailedViewComponent } from './free-rules-detailed-view.component';

describe('FreeRulesDetailedViewComponent', () => {
  let component: FreeRulesDetailedViewComponent;
  let fixture: ComponentFixture<FreeRulesDetailedViewComponent>;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [HttpClientTestingModule, AppModule, ViewAgreementDetailsModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeRulesDetailedViewComponent);
    component = fixture.componentInstance;
    component.detailedViewResponse =  component.detailedViewResponse = {
      'documentationTypeId' : null,
      'documentationType' : null,
      'level' : 'Agreement',
      'effectiveDate' : '2019-07-19',
      'expirationDate' : '2099-12-31',
      'customerAgreementId' : 48,
      'equipmentLengthId' : null,
      'equipmentLength' : null,
      'equipmentLengthDescription' : null,
      'chargeTypeId' : 64,
      'chargeTypeName' : null,
      'chargeTypeCode' : null,
      'status' : 'Active',
      'equipmentCategoryCode' : null,
      'equipmentCategoryDescription' : null,
      'equipmentTypeId' : null,
      'equipmentType' : null,
      'customerAccessorialFreeRuleConfigurationId' : 861,
      'pricingAveragePeriodTypeId' : null,
      'pricingAveragePeriodTypeName' : 'Free',
      'accessorialFreeRuleTypeId' : 1,
      'accessorialFreeRuleTypeName' : 'Calendar',
      'accessorialFreeRuleQuantityTypes' : null,
      'accessorialFreeRuleEventTypes' : null,
      'accessorialFreeRuleCalenderTypes' : {
        'customerAccessorialFreeRuleCalendarId' : 354,
        'customerAccessorialFreeRuleConfigurationId' : 861,
        'accessorialFreeRuleCalendarTypeId' : 3,
        'accessorialFreeRuleCalendarTypeName' : 'Relative',
        'accessorialFreeRuleCalendarApplyTypeId' : 3,
        'accessorialFreeRuleCalendarApplyTypeName' : 'Day After Event',
        'accessorialFreeRuleEventTypeId' : null,
        'accessorialFreeRuleEventTypeName' : 'Deramp',
        'pricingAveragePeriodTypeId' : 1,
        'pricingAveragePeriodTypeName' : 'Weekly',
        'calendarYear' : null,
        'calendarDayDescription' : null,
        'firstDayChargeableIndicator' : 'False',
        'firstDayChargeableIndicatorES' : null,
        'customerAccessorialFreeRuleCalendarWeekDay' : [ {
          'customerAccessorialFreeRuleCalendarWeekDayId' : 242,
          'customerAccessorialFreeRuleCalendarId' : null,
          'calendarWeekDay' : 'Sunday',
          'pricingAveragePeriodTypeId' : null,
          'pricingAveragePeriodTypeName' : null,
          'accessorialFreeRuleCalendarTypeId' : null,
          'accessorialFreeRuleCalendarTypeName' : null
        } ],
        'customerAccessorialFreeRuleCalendarMonth' : null,
        'customerAccessorialFreeRuleCalendarDayOccurrences' : [ {
          'accessorialFrequencyTypeId' : 1,
          'accessorialFrequencyTypeName' : 'First',
          'effectiveDate' : null,
          'expirationDate' : null,
          'pricingAveragePeriodTypeId' : null,
          'pricingAveragePeriodTypeName' : null,
          'accessorialFreeRuleCalendarTypeId' : null,
          'accessorialFreeRuleCalendarTypeName' : null
        }, {
          'accessorialFrequencyTypeId' : 3,
          'accessorialFrequencyTypeName' : 'Third',
          'effectiveDate' : null,
          'expirationDate' : null,
          'pricingAveragePeriodTypeId' : null,
          'pricingAveragePeriodTypeName' : null,
          'accessorialFreeRuleCalendarTypeId' : null,
          'accessorialFreeRuleCalendarTypeName' : null
        } ]
      },
      'customerAccessorialText' : null,
      'serviceLevelBusinessUnitServiceOfferings' : null,
      'contracts' : null,
      'sections' : null,
      'carriers' : null,
      'billToAccounts' : null,
      'requestServices' : null,
      'attachments' : null
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call CheckFreeRule', () => {
    component.CheckFreeRule();
  });
  it('should call getHourMinute ', () => {
    component.getHourMinute('1970-01-01 10:14:10.0');
  });
  it('should call getFreeRuleCalendar', () => {
    component.getFreeRuleCalendar(component.detailedViewResponse);
    component.getOcuurenceLIst(component.detailedViewResponse);
    component.getcalendarDayofMonth(component.detailedViewResponse);
    component.getcalendarDayofWeek(component.detailedViewResponse);
    component.getcalendarMonth(component.detailedViewResponse);
  });
  it('should call getFreeRuleCalendar', () => {
    component.detailedViewResponse = {
      'documentationTypeId' : null,
      'documentationType' : null,
      'level' : 'Agreement',
      'effectiveDate' : '2019-07-12',
      'expirationDate' : '2099-12-31',
      'customerAgreementId' : 48,
      'equipmentLengthId' : null,
      'equipmentLength' : null,
      'equipmentLengthDescription' : null,
      'chargeTypeId' : 42,
      'chargeTypeName' : null,
      'chargeTypeCode' : null,
      'status' : 'Active',
      'equipmentCategoryCode' : null,
      'equipmentCategoryDescription' : null,
      'equipmentTypeId' : null,
      'equipmentType' : null,
      'customerAccessorialFreeRuleConfigurationId' : 698,
      'pricingAveragePeriodTypeId' : null,
      'pricingAveragePeriodTypeName' : 'Free',
      'accessorialFreeRuleTypeId' : 2,
      'accessorialFreeRuleTypeName' : 'Event',
      'accessorialFreeRuleQuantityTypes' : null,
      'accessorialFreeRuleEventTypes' : {
        'customerAccessorialFreeRuleConfigurationID' : 698,
        'accessorialFreeRuleEventTypeID' : 3,
        'accessorialFreeRuleTypeName' : 'Empty',
        'accessorialFreeRuleEventTimeframeTypeID' : 2,
        'accessorialFreeRuleEventTimeFrameTypeName' : 'Day of Event and Day After',
        'accessorialDayOfEventFreeRuleModifierId' : 2,
        'accessorialDayOfEventFreeRuleModifierName' : 'Day Free if Event Time After',
        'accessorialDayOfEventFreeRuleModifierTime' : '1970-01-01 23:26:35.0',
        'accessorialDayAfterEventFreeRuleModifierId' : 2,
        'accessorialDayAfterEventFreeRuleModifierName' : 'Day Free if Event Time After',
        'accessorialDayAfterEventFreeRuleModifierTime' : '1970-01-01 23:26:41.0'
      },
      'accessorialFreeRuleCalenderTypes' : null,
      'customerAccessorialText' : null,
      'serviceLevelBusinessUnitServiceOfferings' : [ {
        'customerAccessorialServiceLevelBusinessUnitServiceOfferingId' : null,
        'serviceLevelBusinessUnitServiceOfferingAssociationId' : 5,
        'businessUnit' : 'DCS',
        'serviceOffering' : 'Dedicated',
        'serviceLevel' : 'Standard'
      } ],
      'contracts' : [ ],
      'sections' : [ ],
      'carriers' : null,
      'billToAccounts' : [ {
        'customerAgreementID' : 48,
        'customerAgreementName' : 'Malnove Incorporated Of Ut (MACLEJ)',
        'effectiveDate' : '1995-01-01',
        'expirationDate' : '2099-12-31',
        'customerAgreementContractSectionAccountID' : 281,
        'billingPartyID' : 578,
        'customerAgreementContractSectionID' : 215,
        'customerAgreementContractSectionName' : 'datetestsec',
        'customerAgreementContractID' : 86,
        'customerContractName' : 'test',
        'billToID' : null,
        'billToCode' : null,
        'billToName' : 'Agencia Aduanal Melchor',
        'contractNumber' : '123rest'
      }, {
        'customerAgreementID' : 48,
        'customerAgreementName' : 'Malnove Incorporated Of Ut (MACLEJ)',
        'effectiveDate' : '1995-01-01',
        'expirationDate' : '2099-12-31',
        'customerAgreementContractSectionAccountID' : 104,
        'billingPartyID' : 578,
        'customerAgreementContractSectionID' : 106,
        'customerAgreementContractSectionName' : 'Section1',
        'customerAgreementContractID' : 86,
        'customerContractName' : 'test',
        'billToID' : null,
        'billToCode' : null,
        'billToName' : 'Agencia Aduanal Melchor',
        'contractNumber' : '123rest'
      }, {
        'customerAgreementID' : 48,
        'customerAgreementName' : 'Malnove Incorporated Of Ut (MACLEJ)',
        'effectiveDate' : '1995-01-01',
        'expirationDate' : '2099-12-31',
        'customerAgreementContractSectionAccountID' : 190,
        'billingPartyID' : 578,
        'customerAgreementContractSectionID' : 149,
        'customerAgreementContractSectionName' : 'Section2231',
        'customerAgreementContractID' : 108,
        'customerContractName' : 'Description: ID: 52067794675494',
        'billToID' : null,
        'billToCode' : null,
        'billToName' : 'Agencia Aduanal Melchor',
        'contractNumber' : 'ID: 5206779'
      } ],
      'requestServices' : null,
      'attachments' : null
    };
    component.getFreeRuleEvent(component.detailedViewResponse);
  });
});
