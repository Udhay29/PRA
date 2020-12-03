import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { HttpResponseBase, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup } from '@angular/forms';

import { FuelPriceBasisComponent } from './fuel-price-basis.component';
import { ViewAgreementDetailsModule } from '../../view-agreement-details.module';
import { AppModule } from '../../../../app.module';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';
import { FuelPriceService } from './service/fuel-price.service';
import { FuelPriceBasisUtility } from './service/fuel-price-basis-utility';
import { FuelPriceUtility } from './service/fuel-price-utility';
import { MessageService } from 'primeng/components/common/messageservice';
import { group } from '@angular/animations';

describe('FuelPriceBasisComponent', () => {
  let component: FuelPriceBasisComponent;
  let fixture: ComponentFixture<FuelPriceBasisComponent>;
  let shared: BroadcasterService;
  let service: FuelPriceService;
  let successResponse: HttpResponseBase;
  let formBuilder: FormBuilder;
  let messageService: MessageService;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [MessageService, { provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelPriceBasisComponent);
    component = fixture.componentInstance;
    shared = TestBed.get(BroadcasterService);
    service = TestBed.get(FuelPriceService);
    formBuilder = TestBed.get(FormBuilder);
    messageService = TestBed.get(MessageService);
    successResponse = {
      'headers': new HttpHeaders(),
      'ok': true,
      'status': 201,
      'statusText': 'Created',
      'type': 4,
      'url': ''
    };
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call navigationSubscription', () => {
    component.navigationSubscription();
  });
  it('should call saveSubscription', () => {
    spyOn(shared, 'on').and.returnValue(of(true));
    component.saveSubscription();
  });
  it('should call getFuelPriceBasisType', () => {
    const fuelPriceBasisType = {
      '_embedded': {
        'fuelProgramPriceBasisTypes': [{
          'fuelProgramPriceBasisTypeID': 1,
          'fuelProgramPriceBasisTypeName': 'Calendar',
          '_links': {
            'self': {
              'href': ''
            },
            'sectionType': {
              'href': '',
              'templated': true
            }
          }
        }, {
          'fuelProgramPriceBasisTypeID': 2,
          'fuelProgramPriceBasisTypeName': 'Price Change Occurrence',
          '_links': {
            'self': {
              'href': ''
            },
            'sectionType': {
              'href': '',
              'templated': true
            }
          }
        }],
        '_links': {
          'self': {
            'href': ''
          }
        }
      }
    };
    spyOn(service, 'getFuelPriceBasisType').and.returnValue(of(fuelPriceBasisType));
    component.getFuelPriceBasisType();
  });
  it('should call getWeekToApply', () => {
    const weekToApply = {
      '_embedded' : {
        'weekToApplyTypes' : [ {
          'weekToApplyTypeID' : 1,
          'weekToApplyTypeName' : 'Current',
          '_links' : {
            'self' : {
              'href' : ''
            },
            'sectionType' : {
              'href' : '',
              'templated' : true
            }
          }
        }, {
          'weekToApplyTypeID' : 2,
          'weekToApplyTypeName' : 'Previous',
          '_links' : {
            'self' : {
              'href' : ''
            },
            'sectionType' : {
              'href' : '',
              'templated' : true
            }
          }
        }, {
          'weekToApplyTypeID' : 3,
          'weekToApplyTypeName' : 'Next',
          '_links' : {
            'self' : {
              'href' : ''
            },
            'sectionType' : {
              'href' : '',
              'templated' : true
            }
          }
        }],
        '_links' : {
          'self' : {
            'href' : ''
          }
        }
      }
    };
    spyOn(service, 'getWeekToApply').and.returnValue(of(weekToApply));
    component.getWeekToApply();
  });
  it('should call getDayOfWeek', () => {
    const response = {
      'weeksInAverage': [ '1', '2', '3', '4', '5', '6' ],
      'priceChangeDayOfWeek': [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
      ]
    };
    spyOn(service, 'getDayOfWeek').and.returnValue(of(response));
    component.getDayOfWeek();
  });
  it('should call getPriceFactor', () => {
    const priceFactor = {
      '_embedded' : {
        'fuelPriceFactorTypes' : [{
          'fuelPriceFactorTypeID' : 1,
          'fuelPriceFactorTypeName' : 'Rolling Average',
          '_links' : {
            'self' : {
              'href' : ''
            },
            'sectionType' : {
              'href' : '',
              'templated' : true
            }
          }
        }, {
          'fuelPriceFactorTypeID' : 2,
          'fuelPriceFactorTypeName' : 'Rolling month',
          '_links' : {
            'self' : {
              'href' : ''
            },
            'sectionType' : {
              'href' : '',
              'templated' : true
            }
          }
        }, {
          'fuelPriceFactorTypeID' : 3,
          'fuelPriceFactorTypeName' : 'Specified fuel day',
          '_links' : {
            'self' : {
              'href' : ''
            },
            'sectionType' : {
              'href' : '',
              'templated' : true
            }
          }
        }],
        '_links' : {
          'self' : {
            'href' : ''
          }
        }
      }
    };
    spyOn(service, 'getPriceFactors').and.returnValue(of(priceFactor));
    component.getPriceFactor();
  });
  it('should call getPriceSource', () => {
    const priceSource = {
      '_embedded' : {
        'fuelPriceSourceTypes' : [ {
          'fuelPriceSourceTypeID' : 1,
          'fuelPriceSourceTypeName' : 'DOE',
          '_links' : {
            'self' : {
              'href' : ''
            },
            'sectionType' : {
              'href' : '',
              'templated' : true
            }
          }
        }],
        '_links' : {
          'self' : {
            'href' : ''
          }
        }
      }
    };
    spyOn(service, 'getPriceSource').and.returnValue(of(priceSource));
    component.getPriceSource();
  });
  it('should call getDayOfMonth', () => {
    const response = {
      'priceChangeDayOfMonth': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      'monthsInAverage': ['1', '2', '3', '4', '5', '6']
    };
    component.fuelPriceModel.selectedPriceFactor = 'Rolling Average';
    spyOn(service, 'getDayOfMonth').and.returnValue(of(response));
    FuelPriceUtility.setDefaultMonth(component.fuelPriceModel);
    component.getDayOfMonth();
  });
  it('should call onclickFuelRadio for Weekly case', () => {
    component.fuelPriceModel.selectedPriceFactor = 'Rolling Average';
    component.onclickFuelRadio({value: 1, label: 'Weekly'}, 0);
  });
  it('should call onclickFuelRadio for Monthly case', () => {
    component.onclickFuelRadio({value: 2, label: 'Monthly'}, 1);
  });
  it('should call onclickFuelRadio for Last Day of Month case', () => {
    component.onclickFuelRadio({value: 3, label: 'Last Day of Month'}, 2);
  });
  it('should call onChangePriceFactor', () => {
    const event = {value: {label: 'Rolling Average', value: 1}};
    component.onChangePriceFactor(event);
  });
  it('should call onClickCancel', () => {
    component.fuelPriceModel.agreementId = 123;
    component.onClickCancel();
  });
  it('should call saveSuccess', () => {
    component.fuelPriceModel.agreementId = 123;
    component.saveSuccess(successResponse);
  });
  it('should call onClickNext for if condition', () => {
    component.fuelPriceModel.fuelPriceForm.patchValue({
      averaging: true,
      customRegion: [{
        region: {
          fuelNationalDistrictID: 2,
          fuelNationalDistrictName: 'Midwest',
          fuelSubDistrictID: null,
          fuelSubDistrictName: null
        },
        regionStateOption: null,
        states: null
      }],
      dayOfMonth: '',
      dayOfWeek: {label: 'Monday', value: 'Monday'},
      delayForHoliday: {label: 'No', value: 'No'},
      fuelPriceBasisTypes: 1,
      fuelPriceType: 2,
      monthsInAverage: '',
      priceSource: {label: 'DOE', value: 1},
      regionType: {fuelPriceBasisRegionTypeID: 1, fuelPriceBasisRegionTypeName: 'Custom'},
      useFuelPriceAsOf: {label: 'Specified Fuel Day', value: 1},
      weekToApply: {label: 'Current', value: 1},
      weeksInAverage: ''
    });
    component.fuelPriceModel.fuelProgramId = 1;
    spyOn(service, 'fuelPriceSave').and.returnValue(of(successResponse));
    component.onClickNext();
  });
  it('should call onClickNext for else condition', () => {
    component.fuelPriceModel.fuelPriceForm.patchValue({
      averaging: true,
      customRegion: [{
        region: {
          fuelNationalDistrictID: 2,
          fuelNationalDistrictName: 'Midwest',
          fuelSubDistrictID: null,
          fuelSubDistrictName: null
        },
        regionStateOption: null,
        states: null
      }],
      dayOfMonth: '',
      dayOfWeek: '',
      delayForHoliday: {label: 'No', value: 'No'},
      fuelPriceBasisTypes: 1,
      fuelPriceType: 2,
      monthsInAverage: '',
      priceSource: {label: 'DOE', value: 1},
      regionType: {fuelPriceBasisRegionTypeID: 1, fuelPriceBasisRegionTypeName: 'Custom'},
      useFuelPriceAsOf: {label: 'Specified Fuel Day', value: 1},
      weekToApply: {label: 'Current', value: 1},
      weeksInAverage: ''
    });
    component.onClickNext();
  });
  it('should call getRegionType', () => {
    const regionType = {
      _embedded: {
        fuelPriceBasisRegionTypes: [
          {
            fuelPriceBasisRegionTypeName: 'Custom',
            fuelPriceBasisRegionTypeID: 1,
            _links: {
              self: {
                href: ''
              },
              fuelPriceBasisRegionType: {
                href: '',
                templated: true
              }
            }
          },
          {
            fuelPriceBasisRegionTypeName: 'National',
            fuelPriceBasisRegionTypeID: 2,
            _links: {
              self: {
                href: ''
              },
              fuelPriceBasisRegionType: {
                href: '',
                templated: true
              }
            }
          }
        ]
      },
      _links: {
        self: {
          href: ''
        }
      }
    };
    spyOn(service, 'getRegionType').and.returnValue(of(regionType));
    component.getRegionType();
  });
  it('should call regionTypeChanged for if and if condition', () => {
    const event = {
      value: {fuelPriceBasisRegionTypeID: 1, fuelPriceBasisRegionTypeName: 'Custom'}
    };
    component.regionTypeChanged(event);
  });
  it('should call regionTypeChanged for if and else condition', () => {
    const event = {
      value: {fuelPriceBasisRegionTypeID: 2, fuelPriceBasisRegionTypeName: 'National'}
    };
    component.fuelPriceModel.selectedRegionType = {
      fuelPriceBasisRegionTypeID: 2, fuelPriceBasisRegionTypeName: 'Custom'
    };
    component.fuelPriceModel.regionvalue = {
      fuelPriceBasisRegionTypeID: 1, fuelPriceBasisRegionTypeName: 'Custom'
    };
    component.fuelPriceModel.fuelPriceForm.controls['customRegion'].markAsDirty();
    component.fuelPriceModel.fuelPriceForm.patchValue({
      customRegion: [{
        region: {
          fuelNationalDistrictID: 2,
          fuelNationalDistrictName: 'Custom',
          fuelSubDistrictID: null,
          fuelSubDistrictName: null
        },
        regionStateOption: null,
        states: null
      }]
    });
    component.regionTypeChanged(event);
  });
  it('should call addNewRegion for if condition', () => {
    component.fuelPriceModel.fuelPriceForm.patchValue({
      customRegion: [{
        region: {
          fuelNationalDistrictID: 2,
          fuelNationalDistrictName: 'Custom',
          fuelSubDistrictID: null,
          fuelSubDistrictName: null
        },
        regionStateOption: null,
        states: null
      }, {
        region: {
          fuelNationalDistrictID: 3,
          fuelNationalDistrictName: 'Custom',
          fuelSubDistrictID: null,
          fuelSubDistrictName: null
        },
        regionStateOption: null,
        states: null
      }]
    });
    component.fuelPriceModel.fuelPriceForm.controls['customRegion'].markAsDirty();
    FuelPriceBasisUtility.duplicateCheck(component.fuelPriceModel);
    component.addNewRegion();
  });
  it('should call addNewRegion for else condition', () => {
    component.fuelPriceModel.fuelPriceForm.patchValue({
      averaging: true,
      customRegion: [{
        region: {
          fuelNationalDistrictID: 2,
          fuelNationalDistrictName: 'Midwest',
          fuelSubDistrictID: null,
          fuelSubDistrictName: null
        },
        regionStateOption: null,
        states: null
      }, {
        region: {
          fuelNationalDistrictID: 2,
          fuelNationalDistrictName: 'Midwest',
          fuelSubDistrictID: null,
          fuelSubDistrictName: null
        },
        regionStateOption: null,
        states: null
      }],
      dayOfMonth: '',
      dayOfWeek: '',
      delayForHoliday: {label: 'No', value: 'No'},
      fuelPriceBasisTypes: 1,
      fuelPriceType: 2,
      monthsInAverage: '',
      priceSource: {label: 'DOE', value: 1},
      regionType: {fuelPriceBasisRegionTypeID: 1, fuelPriceBasisRegionTypeName: 'Custom'},
      useFuelPriceAsOf: {label: 'Specified Fuel Day', value: 1},
      weekToApply: {label: 'Current', value: 1},
      weeksInAverage: ''
    });
    component.addNewRegion();
  });
  it('should call regionChangeYes', () => {
    component.regionChangeYes();
  });
  it('should call onAveragingChange', () => {
    FuelPriceBasisUtility.clearArrayControl(component.fuelPriceModel);
    component.onAveragingChange(true);
  });
  it('should call getDistrictList', () => {
    const districtList = [{
      fuelNationalDistrictID: 1,
      fuelNationalDistrictName: 'East Coast',
      fuelSubDistrictID: null,
      fuelSubDistrictName: null
    },
    {
      fuelNationalDistrictID: 1,
      fuelNationalDistrictName: 'East Coast',
      fuelSubDistrictID: 1,
      fuelSubDistrictName: 'New England'
    },
    {
      fuelNationalDistrictID: 1,
      fuelNationalDistrictName: 'East Coast',
      fuelSubDistrictID: 2,
      fuelSubDistrictName: 'Central Atlantic'
    },
    {
      fuelNationalDistrictID: 1,
      fuelNationalDistrictName: 'East Coast',
      fuelSubDistrictID: 3,
      fuelSubDistrictName: 'Lower Atlantic'
    },
    {
      fuelNationalDistrictID: 2,
      fuelNationalDistrictName: 'Midwest',
      fuelSubDistrictID: null,
      fuelSubDistrictName: null
    }];
    spyOn(service, 'getNationalDistrict').and.returnValue(of(districtList));
    component.getDistrictList();
  });
  it('should call removeRow', () => {
    component.fuelPriceModel.fuelPriceForm.patchValue({
      averaging: true,
      customRegion: [{
        region: {
          fuelNationalDistrictID: 2,
          fuelNationalDistrictName: 'Midwest',
          fuelSubDistrictID: null,
          fuelSubDistrictName: null
        },
        regionStateOption: null,
        states: null
      }],
      dayOfMonth: '',
      dayOfWeek: '',
      delayForHoliday: {label: 'No', value: 'No'},
      fuelPriceBasisTypes: 1,
      fuelPriceType: 2,
      monthsInAverage: '',
      priceSource: {label: 'DOE', value: 1},
      regionType: {fuelPriceBasisRegionTypeID: 1, fuelPriceBasisRegionTypeName: 'Custom'},
      useFuelPriceAsOf: {label: 'Specified Fuel Day', value: 1},
      weekToApply: {label: 'Current', value: 1},
      weeksInAverage: ''
    });
    component.removeRow(0);
  });
  it('should call checkRegion', () => {
    component.fuelPriceModel.fuelPriceForm = FuelPriceBasisUtility.getFormFields(formBuilder);
    component.addNewRegion();
    component.checkRegion(0);
  });
  it('should call getStates', () => {
    component.fuelPriceModel.fuelPriceForm = FuelPriceBasisUtility.getFormFields(formBuilder);
    component.addNewRegion();
    component.fuelPriceModel.fuelPriceForm.patchValue({
      averaging: null,
      customRegion: [{
        region: {
          fuelNationalDistrictID: 1,
          fuelNationalDistrictName: 'East Coast',
          fuelSubDistrictID: null,
          fuelSubDistrictName: null
        },
        regionStateOption: 'Defined Region States',
        states: null
      }],
      dayOfMonth: '',
      dayOfWeek: '',
      delayForHoliday: {label: 'No', value: 'No'},
      fuelPriceBasisTypes: 1,
      fuelPriceType: 2,
      monthsInAverage: '',
      priceSource: {label: 'DOE', value: 1},
      regionType: {fuelPriceBasisRegionTypeID: 1, fuelPriceBasisRegionTypeName: 'Custom'},
      useFuelPriceAsOf: {label: 'Specified Fuel Day', value: 1},
      weekToApply: {label: 'Current', value: 1},
      weeksInAverage: ''
    });
    spyOn(service, 'getStates').and.returnValue(of({associatedStates: 'Connecticut (CT), District Of Columbia (DC)'}));
    component.getStates(0);
  });
  it('should call onClickYes', () => {
    component.onClickYes();
  });
  it('should call showTable for if condition', () => {
    component.fuelPriceModel.fuelPriceForm.patchValue({
      averaging: true
    });
    component.showTable();
  });
  it('should call showTable for else condition', () => {
    component.fuelPriceModel.fuelPriceForm.patchValue({
      averaging: false
    });
    component.showTable();
  });
  it('should call regionChangeNo', () => {
    component.regionChangeNo();
  });
  it('should call onClickNo', () => {
    component.onClickNo();
  });
  it('should call saveSubscription for else', () => {
    FuelPriceUtility.saveSubscription(false, component.fuelPriceModel);
  });
  it('should call formatDayOfWeek for else', () => {
    const data = [];
    FuelPriceUtility.formatDayOfWeek(data);
  });
  it('should call setDefaultDayOfWeek for else', () => {
    component.fuelPriceModel.selectedValue = 2;
    component.fuelPriceModel.dayOfWeekList = [{
      label: 'Tuesday',
      value: { value: 'Tuesday'}
    }];
    FuelPriceUtility.setDefaultDayOfWeek(component.fuelPriceModel);
  });
  it('should call setDefaultMonth', () => {
    component.fuelPriceModel.selectedValue = 2;
    component.fuelPriceModel.dayOfMonthList = [{
      label: '1',
      value: { value: 'Tuesday'}
    }];
    FuelPriceUtility.setDefaultMonth(component.fuelPriceModel);
  });
  it('should call setDefaultMonth for else', () => {
    component.fuelPriceModel.selectedValue = 2;
    component.fuelPriceModel.dayOfMonthList = [{
      label: '2',
      value: { value: 'Tuesday'}
    }];
    FuelPriceUtility.setDefaultMonth(component.fuelPriceModel);
  });
  it('should call setDefaultPriceSource for else', () => {
    component.fuelPriceModel.priceSource = [{
      label: 'Notdoe',
      value: { value: 'Notdoe'}
    }];
    FuelPriceUtility.setDefaultPriceSource(component.fuelPriceModel);
  });
  it('should call isShowWeekAvg for case 2', () => {
    component.fuelPriceModel.selectedPriceFactor = 'rolling average';
    component.fuelPriceModel.selectedValue = 2;
    FuelPriceUtility.isShowWeekAvg(component.fuelPriceModel);
  });
  it('should call isShowWeekAvg for case 3', () => {
    component.fuelPriceModel.selectedPriceFactor = 'rolling average';
    component.fuelPriceModel.selectedValue = 3;
    FuelPriceUtility.isShowWeekAvg(component.fuelPriceModel);
  });
  it('should call isShowWeekAvg for case default', () => {
    component.fuelPriceModel.selectedPriceFactor = 'rolling average';
    component.fuelPriceModel.selectedValue = 4;
    FuelPriceUtility.isShowWeekAvg(component.fuelPriceModel);
  });
  it('should call isShowWeekAvg for else', () => {
    component.fuelPriceModel.selectedPriceFactor = 'not rolling average';
    FuelPriceUtility.isShowWeekAvg(component.fuelPriceModel);
  });
  it('should call showWeekAverage', () => {
    component.fuelPriceModel.fuelPriceForm.addControl('weeksInAverage', new FormControl('', Validators.required));
    component.fuelPriceModel.weeksInAverage = [{
      label: '4',
      value: { value: '4'}
    }];
    FuelPriceUtility.showWeekAverage(component.fuelPriceModel);
  });
  it('should call showWeekAverage for else', () => {
    component.fuelPriceModel.fuelPriceForm.addControl('weeksInAverage', new FormControl('', Validators.required));
    component.fuelPriceModel.weeksInAverage = [{
      label: '3',
      value: { value: '3'}
    }];
    FuelPriceUtility.showWeekAverage(component.fuelPriceModel);
  });
  it('should call showMonthAverage', () => {
    component.fuelPriceModel.fuelPriceForm.addControl('weeksInAverage', new FormControl('', Validators.required));
    component.fuelPriceModel.monthsInAverageList = [{
      label: '3',
      value: { value: '3'}
    }];
    FuelPriceUtility.showMonthAverage(component.fuelPriceModel);
  });
  it('should call showMonthAverage for else', () => {
    component.fuelPriceModel.fuelPriceForm.addControl('weeksInAverage', new FormControl('', Validators.required));
    component.fuelPriceModel.monthsInAverageList = [{
      label: '4',
      value: { value: '4'}
    }];
    FuelPriceUtility.showMonthAverage(component.fuelPriceModel);
  });
  it('should call formatRequestParam', () => {
    FuelPriceUtility.formatRequestParam(component.fuelPriceModel);
  });
  it('should call formatMonthDto', () => {
    FuelPriceUtility.formatMonthDto(component.fuelPriceModel);
  });
  it('should call getWeekAvg', () => {
    component.fuelPriceModel.fuelPriceForm.controls['dayOfWeek'].setValue({label: 'abc', value: 'abc'});
    FuelPriceUtility.getWeekAvg(component.fuelPriceModel, 'dayOfWeek');
  });
  it('should call formatProgramPrice', () => {
    component.fuelPriceModel.fuelPriceForm.controls['fuelPriceType'].setValue({label: 'USD', value: 'USD'});
    component.fuelPriceModel.fuelPriceType = [{label: 'USD', value: 'USD'}];
    FuelPriceUtility.formatProgramPrice(component.fuelPriceModel);
  });
  it('should call onClickNext', () => {
    component.fuelPriceModel.fuelPriceForm.patchValue({
      averaging: true,
      customRegion: [{
        region: {
          fuelNationalDistrictID: 2,
          fuelNationalDistrictName: 'Midwest',
          fuelSubDistrictID: null,
          fuelSubDistrictName: null
        },
        regionStateOption: null,
        states: null
      }],
      dayOfMonth: '',
      dayOfWeek: '',
      delayForHoliday: {label: 'No', value: 'No'},
      fuelPriceBasisTypes: 1,
      fuelPriceType: 2,
      monthsInAverage: '',
      priceSource: {label: 'DOE', value: 1},
      regionType: {fuelPriceBasisRegionTypeID: 1, fuelPriceBasisRegionTypeName: 'Custom'},
      useFuelPriceAsOf: {label: 'Specified Fuel Day', value: 1},
      weekToApply: {label: 'Current', value: 1},
      weeksInAverage: ''
    });
    FuelPriceUtility.onClickNext(component.fuelPriceModel, messageService);
  });

});
