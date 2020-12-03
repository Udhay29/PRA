import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { CreateDrayGroupComponent } from './create-dray-group.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '../../../../../app.module';
import { SettingsModule } from '../../../settings.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreateDrayGroupService } from './service/create-dray-group.service';
import { APP_BASE_HREF } from '@angular/common';
import { By } from '@angular/platform-browser';
import { DrayGroupModel } from './models/dray-group.model';
import { of } from 'rxjs';
import { CreateDrayGroupUtilsService } from './service/create-dray-group-utils.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

describe('CreateDrayGroupComponent', () => {
  let component: CreateDrayGroupComponent;
  let fixture: ComponentFixture<CreateDrayGroupComponent>;
  let createdrayGroupService: CreateDrayGroupService;
  let createDrayGroupUtilsService: CreateDrayGroupUtilsService;
  const model = new DrayGroupModel();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      declarations: [],
      providers: [CreateDrayGroupService, CreateDrayGroupUtilsService, { provide: APP_BASE_HREF, useValue: '/' }]
    });
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDrayGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    createdrayGroupService = TestBed.get(CreateDrayGroupService);
    createDrayGroupUtilsService = TestBed.get(CreateDrayGroupUtilsService);
    component.drayGroupModel = model;
  });



  const rateScopeResponse = {
    '_embedded': {
      'rateScopeTypes': [{
        'rateScopeTypeID': 1,
        'rateScopeTypeName': 'One-Way',
        'defaultIndicator': 'N',
        '_links': {
          'self': {
            'href': 'http://172.26.120.4:8080/pricingconfigurationservices/rateScopeTypes/1'
          },
          'rateScopeType': {
            'href': 'http://172.26.120.4:8080/pricingconfigurationservices/rateScopeTypes/1{?projection}',
            'templated': true
          }
        }
      }, {
        'rateScopeTypeID': 2,
        'rateScopeTypeName': 'Two-Way',
        'defaultIndicator': 'Y',
        '_links': {
          'self': {
            'href': 'http://172.26.120.4:8080/pricingconfigurationservices/rateScopeTypes/2'
          },
          'rateScopeType': {
            'href': 'http://172.26.120.4:8080/pricingconfigurationservices/rateScopeTypes/2{?projection}',
            'templated': true
          }
        }
      }]
    },
    '_links': {
      'self': {
        'href': 'http://172.26.120.4:8080/pricingconfigurationservices/rateScopeTypes{?page,size,sort,projection}',
        'templated': true
      },
      'profile': {
        'href': 'http://172.26.120.4:8080/pricingconfigurationservices/profile/rateScopeTypes'
      },
      'search': {
        'href': 'http://172.26.120.4:8080/pricingconfigurationservices/rateScopeTypes/search'
      }
    },
    'page': {
      'size': 50,
      'totalElements': 2,
      'totalPages': 1,
      'number': 0
    }
  };

  it('should create', () => {
    expect(component).toBeTruthy();
    spyOn(component, 'initializeForm');
    spyOn(component, 'setSuperUserBackDateDays');
    spyOn(component, 'setSuperUserFutureDateDays');
    spyOn(component, 'countryList');
    spyOn(component, 'getRateScopeLabel');
    component.ngOnInit();
    expect(component.initializeForm).toHaveBeenCalled();
    expect(component.setSuperUserBackDateDays).toHaveBeenCalled();
    expect(component.setSuperUserFutureDateDays).toHaveBeenCalled();
    expect(component.countryList).toHaveBeenCalled();
    expect(component.getRateScopeLabel).toHaveBeenCalled();
  });

  it('should call initializeForm', () => {
    component.initializeForm();
  });

  it('should call onrateScopeChange for One-Way', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="rateScopeTypeName"]'));
    element.triggerEventHandler('onChange', { checked: true });
  });
  it('should call onrateScopeChange for Two-Way', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="rateScopeTypeName"]'));
    element.triggerEventHandler('onChange', { checked: false });
  });

  it('should call onFormValueChange if', () => {
    const formFields = 'drayGroupName';
    component.drayGroupModel.drayGroupForm.controls[formFields].markAsDirty();
    component.EnablePopup.emit(true);
    component.onFormValueChange();
  });

  it('should call countryList', () => {
    const countryResponse = {
      '_embedded': {
        'countryTypes': [{
          'countryCode': 'CAN',
          'countryName': 'Canada',
          'countryID': 31,
          '_links': {
            'self': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/countries/31'
            },
            'countryType': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/countries/31{?projection}',
              'templated': true
            }
          }
        }]
      },
      '_links': {
        'self': {
          'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/countries{?page,size,sort,projection}',
          'templated': true
        },
        'profile': {
          'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/profile/countries'
        }
      },
      'page': {
        'size': 50,
        'totalElements': 3,
        'totalPages': 1,
        'number': 0
      }
    };
    spyOn(createdrayGroupService, 'getCountries').and.returnValues(of(countryResponse));
    component.countryList();
  });

  it('should call onTypeCountries', () => {
    component.drayGroupModel.countries = [{
      drayGroupCountryCode: 1,
      drayGroupCountryName: 'USA'
    }];
    const element = fixture.debugElement.query(By.css('[formControlName="drayGroupCountries"]'));
    element.triggerEventHandler('completeMethod', { query: 'u' });
  });

  it('it should call removeSelectedCountryFromSugg', () => {
    component.removeSelectedCountryFromSugg();
  });

  it('it should call validateDate', () => {
    const currentEffectiveDate = component.drayGroupModel.drayGroupValidation.currentDate;
    component.validateDate('20-08-2099', 'effectiveDate');
  });

  it('it should call validateDate else', () => {
    component.validateDate('25-06-2099', 'endDate');
  });

  it('should call getRateScopeLabel', () => {
    spyOn(createdrayGroupService, 'getRateScopeLabel').and.returnValues(of(rateScopeResponse));
    component.getRateScopeLabel();
  });

  it('should call getRateScopeLabel if condition', () => {
    rateScopeResponse['_embedded']['rateScopeTypes'] = [
      {
        'defaultIndicator': 'Y',
        'rateScopeTypeName': 'One-Way',
        'rateScopeTypeID': 1,
        '_links': {
          'self': {
            'href': 'http://172.26.125.245:8080/pricingconfigurationservices/rateScopeTypes/1'
          },
          'rateScopeType': {
            'href': 'http://172.26.125.245:8080/pricingconfigurationservices/rateScopeTypes/1{?projection}',
            'templated': true
          }
        }
      }, {
        'defaultIndicator': 'N',
        'rateScopeTypeName': 'Two-Way',
        'rateScopeTypeID': 2,
        '_links': {
          'self': {
            'href': 'http://172.26.125.245:8080/pricingconfigurationservices/rateScopeTypes/2'
          },
          'rateScopeType': {
            'href': 'http://172.26.125.245:8080/pricingconfigurationservices/rateScopeTypes/2{?projection}',
            'templated': true
          }
        }
      }
    ];
    spyOn(createdrayGroupService, 'getRateScopeLabel').and.returnValues(of(rateScopeResponse));
    component.getRateScopeLabel();
  });

  it('should call onDateSelected for effective date', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="effectiveDate"]'));
    element.triggerEventHandler('onSelect', { srcElement: { value: '08/08/2019' } });
  });

  it('should call onDateSelected for expiration date', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="expirationDate"]'));
    element.triggerEventHandler('onSelect', { srcElement: { value: '08/08/2019' } });
  });

  it('should call typedDateValidate for effective date - Back Date', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="effectiveDate"]'));
    element.triggerEventHandler('onBlur', { srcElement: { value: '08/08/2017' } });
  });

  it('should call typedDateValidate for expiration date', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="expirationDate"]'));
    element.triggerEventHandler('onBlur', { srcElement: { value: '08/08/2019' } });
  });

  it('should call onClose', () => {
    component.drayGroupModel.drayGroupForm.markAsDirty();
    component.drayGroupModel.drayGroupForm.markAsTouched();
    component.onClose();
  });

  it('should call onClose -else', () => {
    component.drayGroupModel.drayGroupForm.markAsUntouched();
    component.onClose();
  });

  it('should call onCreateClose', () => {
    component.onCreateClose();
  });

  it('should call onClickPopupNo', () => {
    component.drayGroupModel.isShowPopup = false;
    component.onClickPopupNo();
  });

  it('should call onClickPopupYes', () => {
    component.drayGroupModel.isShowPopup = true;
    component.drayGroupModel.drayGroupForm.controls['drayGroupName'].setValue('Dray group Name');
    component.onClickPopupYes();
  });

  it('should call setExpirationDate', () => {
    component.drayGroupModel.defaultExpirationDate = '12/31/2099';
    component.setExpirationDate();
  });

  it('should call saveDrayGroup', () => {
    const saveResponse = {
      'status': 'Warning',
      'message': 'DrayGroup Updates still processing.  Newly created or updated data may not appear in view listing screens.',
      'carrierDrayGroupId': 72
    };
    component.drayGroupModel.drayGroupForm.controls['drayGroupName'].setValue('value');
    component.drayGroupModel.drayGroupForm.controls['drayGroupCode'].setValue('value');
    spyOn(createdrayGroupService, 'postDrayGroup').and.returnValues(of(saveResponse));
    component.saveDrayGroup();
  });

  it('should call validateExpirationDate if', () => {
    component.drayGroupModel.drayGroupForm.controls['effectiveDate'].setValue('07/08/2019');
    component.validateExpirationDate('07/08/2019');
  });

  it('should call validateEffectiveDate', () => {
    component.validateEffectiveDate();
  });

  it('should call setFormErrors', () => {
    component.setFormErrors();
  });

  it('should call setValidation', () => {
    component.setValidation('effectiveDate');
  });

  it('it should call saveContractOnSuccess', () => {
     const response = {
       'status': 'Success',
     };
     component.saveContractOnSuccess(response);
  });

  it('it should call saveContractOnSuccess if', () => {
    const response = {
      'status': 'Success',
    };
    spyOn(createDrayGroupUtilsService, 'toastMessage').and.returnValues(of(response));
    component.saveContractOnSuccess(response);
 });

  it('it should call saveContractOnSuccess else', () => {
    const response = {
      'status': 'Info',
    };
    spyOn(createDrayGroupUtilsService, 'toastMessage').and.returnValues(of(response));
    component.saveContractOnSuccess(response);
  });

});
