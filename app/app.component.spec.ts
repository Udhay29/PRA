import { TestBed, ComponentFixture } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        RouterTestingModule,
        HttpClientModule
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    });
  });

  beforeEach(() => {

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
