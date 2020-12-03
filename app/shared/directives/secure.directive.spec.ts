import { SecureDirective } from './secure.directive';
import { Component, Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { UserService } from './../jbh-esa';
import { ComponentFixture, TestBed } from '@angular/core/testing';

@Component({
  template: `<p>Dashboard</p>`
})

class TestComponent { }

describe('Secure Directive Checking', () => {

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [SecureDirective, TestComponent],
      providers: [UserService]
    })
      .createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // initial binding
  });

  xit('should create secure directive', () => {
    expect(component).toBeTruthy();
  });

});
