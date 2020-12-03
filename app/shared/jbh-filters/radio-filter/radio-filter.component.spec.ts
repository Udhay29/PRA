import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JbhFiltersModule } from '../jbh-filters.module';
import { AppModule } from '../../../app.module';
import { configureTestSuite } from 'ng-bullet';
import { RadioFilterComponent } from './radio-filter.component';

describe('RadioFilterComponent', () => {
  let component: RadioFilterComponent;
  let fixture: ComponentFixture<RadioFilterComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, JbhFiltersModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set config', () => {
    component.config = {
      data: ['jbh001', 'jbh002']
    };
  });
  it('should call ngOnInit', () => {
    component.ngOnInit();
  });
  it('should call closePanel', () => {
    component.closePanel();
  });
  it('should call onReset', () => {
    component.onReset();
  });
});
