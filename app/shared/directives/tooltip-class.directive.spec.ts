import { TestBed } from '@angular/core/testing';
import { Renderer2 } from '@angular/core';

import { configureTestSuite } from 'ng-bullet';

import { TooltipClassDirective } from './tooltip-class.directive';

describe('TooltipClassDirective', () => {
  let directive: TooltipClassDirective;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [TooltipClassDirective],
      providers: [TooltipClassDirective, Renderer2]
    });
    directive = TestBed.get(TooltipClassDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
