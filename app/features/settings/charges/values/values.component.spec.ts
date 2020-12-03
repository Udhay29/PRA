import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ChargesModel } from './../models/charges.model';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';

import { AppModule } from '../../../../app.module';
import { SettingsModule } from '../../settings.module';
import { ValuesComponent } from './values.component';
import { ValuesService } from './service/values.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { Router, RouterStateSnapshot } from '@angular/router';
import { ValuesModel } from './models/values-model';
import { utils } from 'protractor';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';
describe('ValuesComponent', () => {
  let component: ValuesComponent;
  let fixture: ComponentFixture<ValuesComponent>;
  let service: ValuesService;
  let toastMessage: MessageService;
  const formBuilder = new FormBuilder();
  let formGroup: FormGroup;
  let broadcasterService: BroadcasterService;
  let valuesModel: ValuesModel;
  let chargesModel: ChargesModel;
  const responseusage = {
    '_embedded': {
      'chargeUsageTypes': [{
        'chargeUsageTypeName': 'lhlh',
        'chargeUsageTypeID': 68,
        '_links': {
          'self': {
            'href': 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/chargeusagetypes/68'
          },
          'chargeUsageType': {
            'href': 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/chargeusagetypes/68{?projection}',
            'templated': true
          }
        }
      }]
    }
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' },
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuesComponent);
    component = fixture.componentInstance;
    service = TestBed.get(ValuesService);
    toastMessage = TestBed.get(MessageService);
    broadcasterService = TestBed.get(BroadcasterService);
    valuesModel = new ValuesModel;
    chargesModel = new ChargesModel;
    component.chargesModel = chargesModel;
    component.valuesModel = valuesModel;
    formGroup = formBuilder.group({
      usage: [''],
      applicationLevel: ['']
    });
    component.valuesModel.valuesForm = formGroup;
    component.valuesModel.usageDuplicateValues = [];
    component.valuesModel.applicationLevelDuplicateValues = [];
    component.valuesModel.chargeCodeConfigurables = {
      chargeUsageTypes: [],
      chargeApplicationLevelTypes: []
    };
    component.valuesModel.routeUrl = '/settings';
     fixture.detectChanges();
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
  it('should call onAdd case usage', () => {
    component.valuesModel.usageDuplicateValues = [{
      'chargeUsageTypeName': 'lhlh',
      'chargeUsageTypeID': 68
    }];
    const event = {
      value: 'lhlh'
    };
    component.onAdd(event, 'usage');
  });
  it('should call onAdd case applicationLevel', () => {
    component.valuesModel.applicationLevelDuplicateValues = [{
      'chargeApplicationLevelTypeID': 12,
      'chargeApplicationLevelTypeName': 'abc'
    }];
    const event = {
      value: 'abc'
    };
    component.onAdd(event, 'applicationLevel');
  });
  it('should call onRemoval case usage for if in removeUsageType', () => {
    component.valuesModel.usageDuplicateValues = [{
      'chargeUsageTypeName': 'lhlh',
      'chargeUsageTypeID': 68
    }];
    const event = {
      value: 'lhlh',
    };
    formGroup.controls.usage.setValue('lhlh', 68);
    component.onRemoval(event, 'usage');
  });
  it('should call onRemoval case usage for else in removeUsageType', () => {
    component.valuesModel.usageDuplicateValues = [{
      'chargeUsageTypeName': 'lhlh',
      'chargeUsageTypeID': 68
    }];
    const event = {
      value: 'lhlhl'
    };
    component.valuesModel.chargeUsageValues = [];
    formGroup.controls.usage.setValue('lhlh', 68);
    component.valuesModel.chargeUsageValuesDataList = [{
      chargeUsageTypeName: 'lhlhl',
      chargeUsageTypeID: 0,
      _links: {
        self: {
          href: 'string'
      },
        link: {
          href: 'string',
          templated: true
      }
    }
  }];
    component.onRemoval(event, 'usage');
  });
  it('should call onRemoval case usage for else and if in removeUsageType', () => {
    component.valuesModel.usageDuplicateValues = [{
      'chargeUsageTypeName': 'lhlh',
      'chargeUsageTypeID': 68
    }];
    const event = {
      value: 'lhlhl'
    };
    component.valuesModel.chargeUsageValues = [];
    formGroup.controls.usage.setValue('lhlh', 68);
    component.valuesModel.chargeUsageValuesDataList = [{
      chargeUsageTypeName: 'lhlhl',
      chargeUsageTypeID: 123,
      _links: {
        self: {
          href: 'string'
      },
        link: {
          href: 'string',
          templated: true
      }
    }
  }];
    component.onRemoval(event, 'usage');
  });
  it('should call onRemoval case applicationLevel', () => {
    component.valuesModel.applicationLevelDuplicateValues = [{
      'chargeApplicationLevelTypeID': 12,
      'chargeApplicationLevelTypeName': 'abc'
    }];
    const event = {
      value: 'abc'
    };
    component.onRemoval(event, 'applicationLevel');
  });
  it('should call getApplicationLevelTypes', () => {
    const param = {
      _embedded: {
        chargeApplicationLevelTypes: [{
          chargeApplicationLevelTypeName: 'string',
          chargeApplicationLevelTypeID: 123,
          _links: {
            self: {
              href: 'string'
          },
            link: {
              href: 'string',
              templated: true
          }
        }
      }]
    }
  };
    spyOn(service, 'getApplicationLevelTypes').and.returnValue(of(param));
    component.getApplicationLevelTypes();
  });
  it('should  call getChargeTypes', () => {
    const chargeTypes = {
      _embedded: {
        chargeUsageTypes: [
          {
            chargeUsageTypeName: 'string',
            chargeUsageTypeID: 123,
            _links: null
        }
        ]
    }
    };
    spyOn(service, 'getChargeTypeValues').and.returnValue(of(chargeTypes));
    component.getChargeTypes();
  });
  it('should call navigationSubscription for true', () => {
    const data = {
      'key': true,
      'message': 'You have unsaved data. Do you want to save?'
    };
    spyOn(broadcasterService, 'on').and.returnValue(of(true));
    spyOn(broadcasterService, 'broadcast');
    component.navigationSubscription();
  });
  it('should call navigationSubscription for false', () => {
    const data = {
      'key': false,
      'message': 'You have unsaved data. Do you want to save?'
    };
    spyOn(broadcasterService, 'on').and.returnValue(of(false));
    spyOn(broadcasterService, 'broadcast');
    component.navigationSubscription();
  });
  it('should call saveSubscription for true', () => {
    spyOn(broadcasterService, 'on').and.returnValue(of(true));
    component.saveSubscription();
  });
  xit('should call saveSubscription for false', () => {
    spyOn(broadcasterService, 'on').and.returnValue(of(false));
    component.subscription.unsubscribe();
    component.saveSubscription();
  });
  xit('should call saveSubscription for false with subscription true', () => {
    spyOn(broadcasterService, 'on').and.returnValue(of(false));
    component.subscription = broadcasterService.on<RouterStateSnapshot>('navigationStarts').subscribe((value: RouterStateSnapshot) => {});
    component.saveSubscription();
  });
  it('should call saveChargeCodeConfigurables if', () => {
    const usageDuplicateValue = [{
      chargeUsageTypeName: 'string',
      chargeUsageTypeID: 123
  }];
    const applicationLevelDuplicateValue = [{
      chargeApplicationLevelTypeID: 123,
      chargeApplicationLevelTypeName: 'string'
  }];
  component.chargesModel.isChangesSaving = false;
  component.valuesModel.usageDuplicateValues = usageDuplicateValue;
  component.valuesModel.applicationLevelDuplicateValues = applicationLevelDuplicateValue;
  component.valuesModel.chargeCodeConfigurables = {
    chargeUsageTypes: [],
    chargeApplicationLevelTypes: []
};
    component.saveChargeCodeConfigurables();
  });
it('should call saveChargeCodeConfigurables else if', () => {
    const usageDuplicateValue = [{
      chargeUsageTypeName: 'string',
      chargeUsageTypeID: 123
  }];
    const applicationLevelDuplicateValue = [{
      chargeApplicationLevelTypeID: 123,
      chargeApplicationLevelTypeName: 'string'
  }];
  component.valuesModel.chargeUsageValues = usageDuplicateValue;
  component.valuesModel.applicationLevelTypes = applicationLevelDuplicateValue;
  spyOn(service, 'saveChargeCodeConfigurables').and.returnValue(of(true));
  component.valuesModel.usageDuplicateValues = [];
  component.valuesModel.applicationLevelDuplicateValues = [];
    component.saveChargeCodeConfigurables();
  });
it('should call saveChargeCodeConfigurables else', () => {
    component.valuesModel.valuesForm = formGroup;
    component.valuesModel.usageDuplicateValues = [];
    component.valuesModel.applicationLevelDuplicateValues = [];
    component.valuesModel.chargeCodeConfigurables = {
    chargeUsageTypes: [],
    chargeApplicationLevelTypes: []
  };
    component.saveChargeCodeConfigurables();
  });
  it('should call ngOnDestroy', () => {
    component.subscription = broadcasterService.on<RouterStateSnapshot>('navigationStarts').subscribe((value: RouterStateSnapshot) => {});
    component.ngOnDestroy();
  });
  it('should call ngOnDestroy with else', () => {
    component.subscription = broadcasterService.on<RouterStateSnapshot>('navigationStarts').subscribe((value: RouterStateSnapshot) => {});
    component.subscription.unsubscribe();
    component.ngOnDestroy();
  });
  it('should call onSave', () => {
    component.onSave();
  });
  it('should call onChanges for true', () => {
    component.chargesModel.isChangesSaving = true;
    component.valuesModel.valuesForm.markAsDirty();
    component.valuesModel.valuesForm = formGroup;
    component.onChanges();
  });
  it('should call onChanges for false', () => {
  component.chargesModel.isChangesSaving = false;
  component.onChanges();
  });
  it('should call getValuesForm', () => {
    component.getValuesForm();
  });
  it('should call onClickCancel', () => {
    component.onClickCancel();
  });
  it('should call ngAfterViewInit', () => {
  component.chargesModel.isChangesSaving = false;
  component.ngAfterViewInit();
  });

});
