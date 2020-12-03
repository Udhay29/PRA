import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LocalStorageService } from '../../shared/jbh-app-services/local-storage.service';
import { ViewCarrierAgreementComponent } from './view-carrier-agreement.component';
import { ViewCarrierAgreementService } from './service/view-carrier-agreement.service';
import { AppModule } from '../../app.module';
import { ViewCarrierAgreementModule } from './view-carrier-agreement.module';
import { FormGroup, FormBuilder} from '@angular/forms';
import { CarrierDetails } from './model/view-carrier-agreeement.interface';

describe('ViewCarrierAgreementComponent', () => {
  let component: ViewCarrierAgreementComponent;
  let fixture: ComponentFixture<ViewCarrierAgreementComponent>;
  let service: ViewCarrierAgreementService;
  const formBuilder = new FormBuilder();
  let formGroup: FormGroup;
  let carrierDetails: CarrierDetails;
  let detailsList: string[];
  let store: LocalStorageService;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewCarrierAgreementModule, HttpClientTestingModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    service = TestBed.get(ViewCarrierAgreementService);
    fixture = TestBed.createComponent(ViewCarrierAgreementComponent);
    component = fixture.componentInstance;
    store = TestBed.get(LocalStorageService);
    formGroup = formBuilder.group({
      dropdown: ['test']
    });
    carrierDetails = {
      'agreementName': 'ABC Agreement',
      'agreementStatus': 'Active',
      'agreementType': 'Carrier',
      'agreementEffectiveDate': '1995-01-01',
      'agreementExpirationDate': '2099-12-31',
      'carriers': [
        {
          'carrierID': 145,
          'carrierName': 'CMS Carrier',
          'carrierCode': 'SCAC01'
        },
        {
          'carrierID': 146,
          'carrierName': 'Walmart Carrier',
          'carrierCode': 'WALM01'
        }
      ]
    };
    detailsList = ['Line Haul', 'Accessorial', 'Fuel', ' Mileage', 'Section' ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call getAgreementId', () => {
    component.getAgreementId();
  });
  it('should call getAgreementDetails', () => {
    spyOn(service, 'getAgreementDetails').and.returnValue(of(carrierDetails));
    component.getAgreementDetails();
  });
  it('should call onClickOverlay', () => {
    component.onClickOverlay();
  });
  it('should call getDetailsList', () => {
    spyOn(service, 'getDetailsList').and.returnValue(of(detailsList));
    component.getDetailsList();
  });
  it('should call setDefaultValue', () => {
    const detailList = { 'value': 'Line Haul', 'label': 'Line Haul' };
    component.setDefaultValue();
  });
  it('should call setDropdownValue', () => {
    component.setDropdownValue('Line Haul', 'Sections');
  });
  it('should call onChangeValue for if condition', () => {
    store.setItem('createCarrierSection', 'valueChanges', true, true);
    component.onChangeValue('Line Haul');
  });
  it('should call onChangeValue for else condition', () => {
    component.onChangeValue('Line Haul');
  });
  it('should call resetVariables', () => {
    component.resetVariables();
  });
  it('should call popupCancel', () => {
    component.popupCancel();
  });
  it('should call popupYes for if condition', () => {
    component.viewCarrierAgreementModel.changedEvent = '';
    component.viewCarrierAgreementModel.routingUrl = '/dashboard';
    component.popupYes();
  });
  it('should call popupYes for else condition', () => {
    component.viewCarrierAgreementModel.changedEvent = 'Line Haul';
    component.popupYes();
  });
  it('should call loader', () => {
    component.loader(true);
  });
  it('should call ngOndestroy', () => {
    component.ngOnDestroy();
  });
});
