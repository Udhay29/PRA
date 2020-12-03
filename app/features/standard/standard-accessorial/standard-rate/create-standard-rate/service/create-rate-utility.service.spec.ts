import { TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from '../../../../../../app.module';
import { CreateStandardRateComponent } from '../create-standard-rate.component';
import { ViewAgreementDetailsModule } from './../../../../../view-agreement-details/view-agreement-details.module';
import { CreateStandardRateUtilityService } from './create-rate-utility.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { StandardModule } from '../../../../standard.module';
import { AddRatesComponent } from '../../../../../view-agreement-details/accessorials/rates/add-rates/add-rates.component';
// tslint:disable-next-line:max-line-length
import { RatesOptionalAttributesComponent } from '../../../../../view-agreement-details/accessorials/rates/rates-optional-attributes/rates-optional-attributes.component';
import { AddStairStepModel } from './../../../../../shared/accessorials/stair-step/add-stair-step/model/add-stair-step.model';
import {
  AdditionalChargesModel
} from './../../../../../shared/accessorials/additional-charges/additional-charges/model/additional-charges-model';
import { configureTestSuite } from 'ng-bullet';

describe('CreateDocumentationUtilsService', () => {
  let service: CreateStandardRateUtilityService;
  let http: HttpClient;
  let component: CreateStandardRateComponent;
  let addRateComponent: AddRatesComponent;
  let optionalAttribute: RatesOptionalAttributesComponent;
  let fixture: ComponentFixture<CreateStandardRateComponent>;
  let fixtureaddRateComponent: ComponentFixture<AddRatesComponent>;
  let fixtureOptionalRateComponent: ComponentFixture<RatesOptionalAttributesComponent>;
  const formBuilder: FormBuilder = new FormBuilder();
  let formGroup: FormGroup;
  const addRateFormBuilder: FormBuilder = new FormBuilder();
  let addRateFormGroup: FormGroup;
  const optionalRateFormBuilder: FormBuilder = new FormBuilder();
  let optionalRateFormGroup: FormGroup;
  const rateSetUpFormBuilder: FormBuilder = new FormBuilder();
  let rateSetUpFormGroup: FormGroup;
  const addStairStepModel = new AddStairStepModel;
  const addChargesModel = new AdditionalChargesModel;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [CreateStandardRateUtilityService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStandardRateComponent);
    component = fixture.componentInstance;
    fixtureaddRateComponent = TestBed.createComponent(AddRatesComponent);
    addRateComponent = fixtureaddRateComponent.componentInstance;
    fixtureOptionalRateComponent = TestBed.createComponent(RatesOptionalAttributesComponent);
    optionalAttribute = fixtureOptionalRateComponent.componentInstance;
    service = TestBed.get(CreateStandardRateUtilityService);
    http = TestBed.get(HttpClient);
    const amountPattern = '[-0-9., ]*';
    formGroup = formBuilder.group({
      quantity: ['5', [Validators.pattern(amountPattern)]],
      quantityType: ['Hour'],
      alternateChargeType: ['BOBTAIL']
    });
    addRateFormGroup = addRateFormBuilder.group({
      rates: new FormArray([new FormGroup({
        rateType: new FormControl(''),
        rateAmount: new FormControl('1', [Validators.pattern(amountPattern)]),
        minAmount: new FormControl('2', [Validators.pattern(amountPattern)]),
        maxAmount: new FormControl('3', [Validators.pattern(amountPattern)]),
        rounding: new FormControl('Down', [])
      }), new FormGroup({
        rateType: new FormControl(''),
        rateAmount: new FormControl('1', [Validators.pattern(amountPattern)]),
        minAmount: new FormControl('2', [Validators.pattern(amountPattern)]),
        maxAmount: new FormControl('3', [Validators.pattern(amountPattern)]),
        rounding: new FormControl('Down', [])
      })
      ]),
      groupRateType: new FormControl(''),
      isGroupRateItemize: new FormControl(true)
    });
    optionalRateFormGroup = optionalRateFormBuilder.group({
      businessUnit: [[{
        financeBusinessUnitServiceOfferingAssociationID: 1,
        financeBusinessUnitCode: 'JCI',
        serviceOfferingDescription: 'TRANSPORT'
      }]],
      serviceLevel: [[{ label: 'test', value: 'test' }]],
      requestedService: [['test']],
      equipmentCategory: [''],
      equipmentType: [''],
      equipmentLength: [''],
      carriers: [[{ value: { id: '1', code: 'test' }, label: 'test' }]],
      waived: [''],
      calculateRate: [''],
      passThrough: [''],
      rollUp: ['']
    });
    rateSetUpFormGroup = rateSetUpFormBuilder.group({
      effectiveDate: ['080919', Validators.required],
      expirationDate: ['080919', Validators.required],
      groupName: ['', Validators.required],
      chargeType: ['hgjg', Validators.required],
      customerName: ['ggg'],
      currency: ['dgdgdg', Validators.required],
      waived: ['true'],
      calculateRate: ['true'],
      passThrough: ['true'],
      rollUp: ['true']
    });
    addStairStepModel.addStairStepForm = formBuilder.group({
      rateType: new FormControl('', [Validators.required]),
      minAmount: new FormControl('2'),
      maxAmount: new FormControl('4'),
      rounding: new FormControl('Down', []),
      maxApplidedWhen: new FormControl('Steps Are Exceeded'),
      itemizeRates: new FormControl(false),
      stepsArray: new FormArray([new FormGroup({
        step: new FormControl('1', [Validators.required]),
        fromQuantity: new FormControl('2', [Validators.required]),
        toQuantity: new FormControl('4', [Validators.required]),
        rateAmount: new FormControl('2.00', [Validators.pattern(amountPattern)])
      }),
      new FormGroup({
        step: new FormControl('2', [Validators.required]),
        fromQuantity: new FormControl('5', [Validators.required]),
        toQuantity: new FormControl('7', [Validators.required]),
        rateAmount: new FormControl('5.00', [Validators.pattern(amountPattern)])
      })
      ])
    });
    const form = new FormGroup({
      chargeType: new FormControl('', [Validators.required]),
      rateType: new FormControl('', [Validators.required]),
      rateAmount: new FormControl('', [Validators.required, Validators.pattern('[-0-9., ]*')])
    });
    addChargesModel.addChargesForm = new FormGroup({
      charges: new FormArray([form])
    });
    // tslint:disable-next-line:max-line-length
    (addChargesModel.addChargesForm.get('charges') as FormArray).controls[0]['controls']['chargeType'].setValue({label: 'test', value: 'test', description: 'test'});
    fixture.detectChanges();
  });

  it('should be created', inject([CreateStandardRateUtilityService], () => {
    expect(service).toBeTruthy();
  }));
  it('should call methods having createRateModel as parameter', inject([CreateStandardRateUtilityService], () => {
    component.createRatesModel.ratesForm = formGroup;
    service.getAlternateChargeDetails(component.createRatesModel);
    service.getAlternateChargeObject(component.createRatesModel, '5');
    service.getRateLevel(component.createRatesModel);
  }));
  it('should call methods having addRateModel as parameter', inject([CreateStandardRateUtilityService], () => {
    addRateComponent.addRatesModel.addRateForm = addRateFormGroup;
    service.getRateDetails(addRateComponent.addRatesModel);
    service.isGroupRateItemizeIndicator('Sum', addRateComponent.addRatesModel);
  }));
  it('should call onRefreshRatePostFramer', inject([CreateStandardRateUtilityService], () => {
    component.createRatesModel.ratesForm = formGroup;
    optionalAttribute.optionalAttributesModel.optionalForm = optionalRateFormGroup;
    component.createRatesModel.setUpForm = rateSetUpFormGroup;
    service.onRefreshRatePostFramer(component.createRatesModel, optionalAttribute.optionalAttributesModel, component.createRatesModel);
  }));
  it('should call ratePostFramer', inject([CreateStandardRateUtilityService], () => {
    component.createRatesModel.ratesForm = formGroup;
    optionalAttribute.optionalAttributesModel.optionalForm = optionalRateFormGroup;
    component.createRatesModel.setUpForm = rateSetUpFormGroup;
    addRateComponent.addRatesModel.addRateForm = addRateFormGroup;
    component.createRatesModel.checkBoxValue = [{ value: 'Waived', label: 'Waived' },
    { value: 'Calculate Rate Manually', label: 'Calculate Rate Manually' },
    { value: 'Pass Through', label: 'Pass Through' }, { value: 'Roll Up', label: 'Roll Up' }];
    // tslint:disable-next-line:max-line-length
    service.ratePostFramer(component.createRatesModel, optionalAttribute.optionalAttributesModel, component.createRatesModel, addRateComponent.addRatesModel, addStairStepModel, addChargesModel);
  }));
  it('should call methods having optionalModel as parameter', inject([CreateStandardRateUtilityService], () => {
    optionalAttribute.optionalAttributesModel.optionalForm = optionalRateFormGroup;
    optionalAttribute.optionalAttributesModel.serviceLevelValues = [{ value: 'test', label: 'test' }];
    service.isBU(optionalAttribute.optionalAttributesModel);
    service.iterateRequestedService(optionalAttribute.optionalAttributesModel);
    service.iterateCarriers(optionalAttribute.optionalAttributesModel);
  }));
  it('should call iterateBusinessUnitValues', inject([CreateStandardRateUtilityService], () => {
    optionalAttribute.optionalAttributesModel.optionalForm = optionalRateFormGroup;
    optionalAttribute.optionalAttributesModel.serviceLevelValues = [{ value: 'test', label: 'test' }];
    optionalAttribute.optionalAttributesModel.serviceLevelResponse = [{
      serviceLevel: {
        serviceLevelCode: 'test',
        serviceLevelDescription: 'test'
      },
      financeBusinessUnitServiceOfferingAssociation: {
        financeBusinessUnitServiceOfferingAssociationID: 1,
        financeBusinessUnitCode: 'test',
        serviceOfferingCode: 'test',
        serviceOfferingDescription: 'test',
        effectiveTimestamp: 'test',
        expirationTimestamp: 'test',
        lastUpdateTimestampString: 'test'
      },
      lastUpdateTimestampString: 'test',
      serviceLevelBusinessUnitServiceOfferingAssociationID: 'test',
      _links: {}
    }];
    service.iterateBusinessUnitValues(optionalAttribute.optionalAttributesModel);
  }));
  it('should call isInvalidChargeTypeError', inject([CreateStandardRateUtilityService], () => {
    component.createRatesModel.isAddRateClicked = true;
    component.addRates = addRateComponent;
    component.addRates.addRatesModel.addRateForm = addRateFormGroup;
    service.isInvalidChargeTypeError(component);
    component.createRatesModel.isAddRateClicked = false;
    service.isInvalidChargeTypeError(component);
  }));
});
