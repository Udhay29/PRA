import { MenuOverlayDirective } from './menu-overlay.directive';
import { TestBed } from '@angular/core/testing';
import { PaginatorModule } from 'primeng/primeng';
import { Menu, MenuModule } from 'primeng/menu';
import { DomHandler } from 'primeng/api';
import { ObjectUtils } from 'primeng/components/utils/objectutils';
import { ElementRef, Renderer2 } from '@angular/core';
import { pipe } from 'rxjs';
import { element } from '@angular/core/src/render3/instructions';

describe('MenuOverlayDirective', () => {
  let directive: MenuOverlayDirective;
  const selectedDiv = document.createElement('div');
  const elementRefStub = {
    nativeElement: {
      addEventListener: () => ({}),
      querySelector: () => selectedDiv,
      querySelectorAll: () => ({}),
      removeEventListener: () => ({})
    }
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PaginatorModule],
      declarations: [MenuOverlayDirective],
      providers: [
        MenuOverlayDirective, Menu, DomHandler, ObjectUtils, MenuModule,
        { provide: ElementRef, useValue: elementRefStub }
      ]
    });
    directive = TestBed.get(MenuOverlayDirective);
  });
  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
  xit('should invoke keyboard event for ctrl,alt,r on button', () => {

    const event: KeyboardEvent = new KeyboardEvent('keyup', {
      ctrlKey: true, altKey: true, key: '40', code: '40'
    });
    directive.onKeyUp(event);
    expect(directive.onKeyUp).toBeTruthy();
  });
});
