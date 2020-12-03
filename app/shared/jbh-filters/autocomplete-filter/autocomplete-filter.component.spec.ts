import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JbhFiltersModule } from '../jbh-filters.module';
import { AppModule } from '../../../app.module';
import { AutocompleteFilterComponent } from './autocomplete-filter.component';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';

describe('AutocompleteFilterComponent', () => {
  let component: AutocompleteFilterComponent;
  let fixture: ComponentFixture<AutocompleteFilterComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, JbhFiltersModule, AppModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.config = {
      url: 'http:test',
      callback: () => ({}),
      query: 'jbh'
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set config', () => {
    component.config = {
      url: 'http:test',
      callback: () => ({}),
      query: 'jbh'
    };
  });
  it('should call ngOnInit', () => {
    component.ngOnInit();
  });
  it('should call ngOnDestroy', () => {
    component.ngOnDestroy();
  });
  it('should call closePanel', () => {
    component.closePanel();
  });
  it('should call onSearch', () => {
    const data = 'jbh';
    spyOn(HttpClient.prototype, 'post').and.returnValues(of(data));
    component.onSearch('jbh');
  });
  it('should call onSuggestionSelect', () => {
    const selectedItem = [{
      value: 'jbh001'
    },
    {
      value: 'jbh002'
    }];
    component.onSuggestionSelect(selectedItem);
  });
  it('should call onReset', () => {
    component.onReset();
  });
  it('should call getQuery', () => {
    component.getQuery('jbh');
  });
  it('should call onClearSuggestion', () => {
    component.onClearSuggestion();
  });
});
