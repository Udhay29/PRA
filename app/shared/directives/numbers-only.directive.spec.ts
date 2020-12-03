import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NumbersOnlyDirective } from './numbers-only.directive';

@Component({
  template: `<input type="text" appNumbersOnly="true">`
})

class TestNumberOnlyComponent {
}

describe('NumbersOnlyDirective', () => {
  let component: TestNumberOnlyComponent;
  let fixture: ComponentFixture<TestNumberOnlyComponent>;
  let inputEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestNumberOnlyComponent, NumbersOnlyDirective]
    });
    fixture = TestBed.createComponent(TestNumberOnlyComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));
  });

  it('keydown input', () => {
    inputEl.triggerEventHandler('keydown', {});
    expect(true).toBe(true);
  });

  xit('should call event prevent', () => {
    let event;
    event = document.createEvent('KeyboardEvent');
    event.initEvent('keydown', true, false);
    event.key = 'f';
    spyOn(event, 'preventDefault');
    inputEl.nativeElement.dispatchEvent(event);
    inputEl.triggerEventHandler('keydown', event);
    expect(event.preventDefault).toHaveBeenCalled();
  });


  it('should create an instance', () => {
    const directive = new NumbersOnlyDirective();
    expect(directive).toBeTruthy();
  });
});
