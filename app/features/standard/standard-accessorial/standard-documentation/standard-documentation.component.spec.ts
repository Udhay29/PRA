import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardDocumentationComponent } from './standard-documentation.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from './../../../../app.module';
import { StandardModule } from '../../standard.module';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

describe('StandardDocumentationComponent', () => {
  let component: StandardDocumentationComponent;
  let fixture: ComponentFixture<StandardDocumentationComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
      fixture = TestBed.createComponent(StandardDocumentationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
