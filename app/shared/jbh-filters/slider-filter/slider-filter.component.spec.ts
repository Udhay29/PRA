import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JbhFiltersModule } from '../jbh-filters.module';
import { AppModule } from '../../../app.module';
import { SliderFilterComponent } from './slider-filter.component';
import { configureTestSuite } from 'ng-bullet';

describe('SliderFilterComponent', () => {
  let component: SliderFilterComponent;
  let fixture: ComponentFixture<SliderFilterComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, JbhFiltersModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.filterConfig = {
      min: 0,
      max: 100,
      range: true,
      hideRange: false,
      default: {
        length: 0
      }
    };
  });
  it('should set config', () => {
    component.config = {
      min: 0,
      max: 100,
      range: true,
      hideRange: false,
      default: {
        length: 0
      }
    };
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call ngOnInit', () => {
    component.ngOnInit();
  });
  it('should call ngOnDestroy', () => {
    component.ngOnDestroy();
  });
  it('should call loadFilterData', () => {
    component.loadFilterData();
  });
  it('should call loadSliderValue else loop', () => {
    component.range = false;
    component.loadSliderValue();
  });
  it('should call closePanel', () => {
    component.closePanel();
  });
  it('should call onReset if loop', () => {
    component.onReset();
  });
  it('should call onReset else loop', () => {
    component.range = false;
    component.onReset();
  });
  it('should call handleChange', () => {
    const event = {
      value: 'jbh001',
      targe: {
        value: 'jbh001'
      }
    };
    component.handleChange(event, true);
  });
});
