import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';

import { ViewAgreementDetailsModule } from '../../view-agreement-details.module';
import { AppModule } from './../../../../app.module';
import { of } from 'rxjs';

import { ViewRatingRuleDetailComponent } from './view-rating-rule-detail.component';
import { RatingRuleService } from '../service/rating-rule.service';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';

describe('ViewRatingRuleDetailComponent', () => {
  let component: ViewRatingRuleDetailComponent;
  let fixture: ComponentFixture<ViewRatingRuleDetailComponent>;
  let ratingRuleService: RatingRuleService;
  let shared: BroadcasterService;
  let ratingRuleInactivateForm: FormGroup;
  const formBuilder: FormBuilder = new FormBuilder();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, RatingRuleService, BroadcasterService]
    });
  });

  beforeEach(() => {
    ratingRuleService = TestBed.get(RatingRuleService);
    shared = TestBed.get(BroadcasterService);
    fixture = TestBed.createComponent(ViewRatingRuleDetailComponent);
    component = fixture.componentInstance;
    component.ratingsModel.ratingRulesDetail = {
      customerRatingRuleID: 0,
      citySubstitutionIndicator: 'Y',
      citySubstitutionRadiusValue: 0,
      citySubstitutionUnitofLengthMesurement: 0,
      effectiveDate: 'null',
      expirationDate: 'null',
      customerRatingRuleConfigurationViewDTOs: [],
      agreementDefaultFlag: 'null',
      businessUnitServiceOfferingViewDTOs: [],
      customerAgreementContractAssociationViewDTOs: [],
      customerAgreementContractSectionAssociationViewDTOs: []
    };
    ratingRuleInactivateForm = formBuilder.group({
      expirationDate: ['', Validators.required]
    });
    component.ratingsModel.ratingRuleInactivateForm = ratingRuleInactivateForm;
    component.ratingsModel.ratingRuleInactivateForm.controls.expirationDate.setValue('01/01/2019');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    component.ngOnInit();
    component.formIntialisation();
    component.detailsFetch();
  });
  it('should call formIntialisation', () => {
    component.formIntialisation();
  });

  it('should call detailsFetch', () => {
    const response = {
      'customerRatingRuleID': 226,
      'citySubstitutionIndicator': 'Y',
      'citySubstitutionRadiusValue': 9.0000,
      'effectiveDate': '2019-04-09',
      'expirationDate': '2019-04-30',
      'agreementDefaultFlag': 'No',
      'status': 'deleted',
      'customerRatingRuleConfigurationViewDTOs': [{
        'ruleCriteriaID': 1,
        'ruleCriteriaName': 'Congestion Charge',
        'ruleCriteriaValueID': 1,
        'ruleCriteriaValueName': 'On intermediate stops'
      }],
      'customerAgreementContractSectionAssociationViewDTOs': null,
      'businessUnitServiceOfferingViewDTOs': [{
        'financeBusinessUnitServiceOfferingAssociationID': 1,
        'financeBusinessUnitCode': 'JBT',
        'serviceOfferingCode': 'OTR'
      }]
    };
    spyOn(RatingRuleService.prototype, 'getRateDetails').and.returnValues(of(response));
    component.detailsFetch();
  });

  it('should call onInactivatePopUpOpen', () => {
    component.onInactivatePopUpOpen();
  });

  it('should call onInactivatePopUpClose', () => {
    component.onInactivatePopUpClose();
  });

  it('should call onClickConfirmInactivate', () => {
    component.ratingsModel.ratingRuleInactivateForm.controls['expirationDate'].setValue(new Date());
    component.ratingRuleId = 124;
    component.agreementId = 2;
    const inactivateResponse = {
      'status': 'Success',
      'message': 'You have inactivated the rating rule successfully'
    };
    spyOn(RatingRuleService.prototype, 'inactivateRatingRule').and.returnValues(of(inactivateResponse));
    component.onClickConfirmInactivate();
  });
  it('should call onClickConfirmInactivate', () => {
    component.ratingsModel.ratingRuleInactivateForm.controls['expirationDate'].setValue('');
    component.ratingsModel.ratingRuleInactivateForm.controls['expirationDate'].markAsTouched();
    component.onClickConfirmInactivate();
  });

  it('should call errorScenarioOnInactivate', () => {
    const error = {
      error: {
        errors: [
          { errorMessage: 'test' }
        ]
      }
    };
    component.errorScenarioOnInactivate(error);
  });

  it('should call inactivateRatingRule', () => {
    const inactivateResponse = {
      'status': 'Success',
      'message': 'You have inactivated the rating rule successfully'
    };
    component.inactivateRatingRule(inactivateResponse);
  });

  it('should call closeSplitOnInactivate', () => {
    component.closeSplitOnInactivate();
  });

  it('should call navigateToEdit', () => {
    component.ratingsModel.ratingRulesDetail.agreementDefaultFlag = 'Yes';
    component.navigateToEdit();
  });

  it('should call onBlurDateValidate', () => {
    component.ratingsModel.maxDate = new Date('01/01/2019');
    component.ratingsModel.ratingRulesDetail['effectiveDate'] = '12/30/2018';
    component.onBlurDateValidate('01/01/2019');
  });
  it('should call onBlurDateValidate', () => {
    component.onBlurDateValidate('');
  });
  it('should call onBlurDateValidate', () => {
    component.onBlurDateValidate('abc');
  });

  it('should call onTypeDate', () => {
    component.onTypeDate('01/01/2019');
    component.ratingsModel.expDate = new Date('01/01/2019');
  });
  it('should call onTypeDate', () => {
    component.onTypeDate('ab');
  });

  it('should call onSelectDateValidate', () => {
    component.onSelectDateValidate('01/01/2019');
  });

  it('should create General Date format', () => {
    const date = '03/20/2019';
    component.formateDate(date);
    expect(component.formateDate).toBeTruthy();
  });


});
