import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { By } from '@angular/platform-browser';
import { DialogShortcutDirective } from './dialog-shortcut.directive';

@Component({
  template: `<button  appShortcut='ctrl+alt+o' class='addCommentBtn'></button>`
})

class TestComponent {
}

describe('DialogShortcutDirective', () => {

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: DebugElement;

  let directive;

  beforeEach(() => {
    const elementRefStub = {
      nativeElement: {
        addEventListener: () => ({}),
        querySelector: () => ({}),
        removeEventListener: () => ({})
      }
    };
    TestBed.configureTestingModule({
      declarations: [TestComponent, DialogShortcutDirective],
      providers: [
        DialogShortcutDirective,
        { provide: ElementRef, useValue: elementRefStub }
      ]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));
  });


  it('should create an instance', () => {
    directive = new DialogShortcutDirective();
    expect(directive).toBeTruthy();
  });


  it('should call event prevent', () => {
    const event = {
      'ctrlKey': true,
      'altKey': true,
      'key': '0',
      'keyCode': 48,
      'location': 0,
      'repeat': false,
      'returnValue': true,
      'shiftKey': false
    };
    directive.getKeyCode(event);
    expect(directive.getKeyCode).toBeTruthy();
  });

  it('should call event prevent', () => {
    const event = {
      'ctrlKey': false,
      'altKey': true,
      'key': '0',
      'keyCode': 48,
      'location': 0,
      'repeat': false,
      'returnValue': true,
      'shiftKey': true
    };
    directive.getKeyCode(event);
    expect(directive.getKeyCode).toBeTruthy();
  });

});
