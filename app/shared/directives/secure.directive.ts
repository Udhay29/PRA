import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { UserService } from './../jbh-esa';

@Directive({
  selector: '[appSecure]'
})
export class SecureDirective implements OnInit {

  // tslint:disable-next-line:no-input-rename
  @Input('appSecure') appSecure: any;
  constructor(private readonly el: ElementRef,
    private readonly renderer: Renderer2,
    private readonly userService: UserService) {
  }

  ngOnInit(): void {
    if (this.appSecure && !this.userService.hasAccess(this.appSecure.url, this.appSecure.operation)) {
      this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
    }
  }

}
