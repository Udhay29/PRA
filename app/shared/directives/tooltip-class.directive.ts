import { Directive, HostListener, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[appTooltipClass]'
})
export class TooltipClassDirective {

  @Input() className = 'tooltipClass';

  constructor (private readonly renderer: Renderer2) { }

  @HostListener('mouseover', ['$event']) onMouseOver (event) {
    this.renderer.addClass(document.body, this.className);
  }

  @HostListener('mouseout', ['$event']) onMouseOut (event) {
    this.renderer.removeClass(document.body, this.className);
  }
}
