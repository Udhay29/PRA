import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalChargesComponent } from './additional-charges.component';
import { ViewAgreementDetailsModule } from './../../../../view-agreement-details/view-agreement-details.module';
import { AppModule } from './../../../../../app.module';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { AdditionalChargesService } from './service/additional-charges.service';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RateTypeInterface, BuSoAssociation } from './model/additional-charges-interface';

describe('AdditionalChargesComponent', () => {
  let component: AdditionalChargesComponent;
  let fixture: ComponentFixture<AdditionalChargesComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalChargesComponent);
    component = fixture.componentInstance;
    const formGroup = new FormGroup({
      chargeType: new FormControl('', [Validators.required]),
      rateType: new FormControl('', [Validators.required]),
      rateAmount: new FormControl('', [Validators.required, Validators.pattern('[-0-9., ]*')])
    });
    component.addChargesModel.addChargesForm = new FormGroup({
      charges: new FormArray([formGroup])
    });
    fixture.detectChanges();
  });

  const rateTypeResponse: RateTypeInterface[] = [{
    rateTypeId: 51,
    rateTypeName: '% Accessorial',
    effectiveDate: '2019-04-25',
    expirationDate: '2099-12-31',
    lastUpdateTimestampString: '2019-04-25T06:57:47.4072553'
  }];
  const buSOResponse: BuSoAssociation[] = [{
    financeBusinessUnitServiceOfferingAssociationID: 1,
    serviceOfferingCode: 'AM',
    serviceOfferingDescription: 'mock',
    transitModeId: 1,
    transitModeCode: 'string',
    transitModeDescription: 'string',
    financeBusinessUnitCode: 'string'
  }];
  const chargeType1 = { 'label': 'Congestion Charge (CONGESTION)', 'value': 62, 'description': 'CONGESTION' };
  const chargeType2 = { 'label': 'Deadhead Miles (DEADHDMILE)', 'description': 'DEADHDMILE', 'value': 78 };
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    component.addChargesModel.buSoIds = [];
    component.addChargesModel.subscribeFlag = true;
    spyOn(AdditionalChargesService.prototype, 'getRateTypes').and.returnValues(of(rateTypeResponse));
    component.ngOnInit();
  });
  it('should call onSelectChargeCode', () => {
    component.selectedChargeType = chargeType1;
    spyOn(AdditionalChargesService.prototype, 'getBUbasedOnChargeType').and.returnValues(of(buSOResponse));
    component.onSelectChargeType(chargeType1, 0);
  });
  it('should call validateSelectedChargeType', () => {
    const chargeTypeRef = (component.addChargesModel.addChargesForm.get('charges') as FormArray).at(0).get('chargeType');
    chargeTypeRef.setValue(chargeType1);
    component.addChargesModel.selectedChargeType = chargeType1;
    component.validateSelectedChargeType(chargeType1);
  });
  it('should call onTypeChargeType', () => {
    component.addChargesModel.chargeType = [chargeType1, chargeType2];
    const element = fixture.debugElement.query(By.css('[formControlName="chargeType"]'));
    element.triggerEventHandler('completeMethod', { 'query': 's' });
  });
  it('should call addAdditonalChargesRow', () => {
    component.addAdditionalChargeRow(0);
  });
  it('should call isAdditionalChargesEmpty', () => {
    component.isAdditionalChargesEmpty();
  });
  it('should call onTypeRateType', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="rateType"]'));
    element.triggerEventHandler('completeMethod', { 'query': 's' });
  });
  it('should call validateRateAmount', () => {
    component.addChargesModel.rateAmountValues[0] = 1.1;
    component.validateRateAmount('1.1', 0);
  });
  it('should call formatAmount', () => {
    component.formatAmount('0.00', (component.addChargesModel.addChargesForm.get('charges') as FormArray).at(0));
  });
  it('should call filterChargeTypeBasedOnBuSo', () => {
    component.addChargesModel.chargeCodeResponse = [{
      'chargeTypeID': 42,
      'chargeTypeCode': 'BOBTAIL',
      'chargeTypeName': 'Bobtail',
      'chargeTypeDescription': null,
      'chargeTypeBusinessUnitServiceOfferingAssociations': [{
        'chargeTypeBusinessUnitServiceOfferingAssociationID': 536,
        'chargeTypeID': null,
        'financeBusinessUnitServiceOfferingAssociation': {
          'financeBusinessUnitServiceOfferingAssociationID': 4,
          'financeBusinessUnitCode': 'DCS',
          'serviceOfferingCode': 'Backhaul'
        },
        'financeChargeUsageTypeID': 1,
        'effectiveDate': '2018-12-01',
        'expirationDate': '2099-12-31'
      }, {
        'chargeTypeBusinessUnitServiceOfferingAssociationID': 542,
        'chargeTypeID': null,
        'financeBusinessUnitServiceOfferingAssociation': {
          'financeBusinessUnitServiceOfferingAssociationID': 1,
          'financeBusinessUnitCode': 'JBT',
          'serviceOfferingCode': 'OTR'
        },
        'financeChargeUsageTypeID': 1,
        'effectiveDate': '2018-12-01',
        'expirationDate': '2099-12-31'
      }]
    }];
    component.filterChargeTypeBasedOnBuSo([1, 2]);
  });

  it('should call onPopNo', () => {
    component.onPopNo();
  });

  it('should call removeAllCharges', () => {
    component.removeAllCharges();
  });

  it('should call filterChargeTypeBasedOnBuSo when no data', () => {
    component.filterChargeTypeBasedOnBuSo([]);
  });

  it('should call validateSelectedChargeType when no data', () => {
    component.validateSelectedChargeType(null);
  });

  it('should call removeCharge', () => {
    component.removeCharge(0);
  });

  it('should call onSelectChargeType for else', () => {
    spyOn(AdditionalChargesService.prototype, 'getBUbasedOnChargeType').and.returnValues(of(buSOResponse));
    component.addChargesModel.selectedChargeType = { label: 'test', value: 1, description: null};
    const element = fixture.debugElement.query(By.css('[formControlName="chargeType"]'));
    element.triggerEventHandler('onSelect', { label: 'test1', value: 1 });
    fixture.detectChanges();
  });

  it('should call onInputChargeType for if', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="chargeType"]'));
    element.triggerEventHandler('input', { data: null});
    fixture.detectChanges();
  });

  it('should call onAutoCompleteBlur', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="chargeType"]'));
    element.triggerEventHandler('onBlur', { target: { value: 'test' }});
    fixture.detectChanges();
  });
});
