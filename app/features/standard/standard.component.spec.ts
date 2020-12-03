import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { StandardComponent } from './standard.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from './../../app.module';
import { StandardModule } from './standard.module';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('StandardComponent', () => {
  let component: StandardComponent;
  let fixture: ComponentFixture<StandardComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
      fixture = TestBed.createComponent(StandardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
