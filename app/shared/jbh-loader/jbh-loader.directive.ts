import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  HostBinding,
  Input,
  Renderer2,
  ViewContainerRef
} from '@angular/core';
import { LoaderComponent } from './loader/loader.component';

@Directive({
  selector: '[appJbhLoader]'
})
export class JbhLoaderDirective {

  /**
 * Input that takes the loading config then creates or destorys overlay
 * @memberOf LoadingDirective
 */
  @Input('appJbhLoader') public set appJbhLoader(loading: boolean) {
    (loading) ? this.startLoading() : this.stopLoading();
  }

  @Input() public set loaderText(loadingText: string) {
    loadingText = (loadingText) ? loadingText : 'Loading';
    this.componentRef.instance.loadingText = loadingText;
  }

  @Input() public set loaderZIndex(zIndex: number) {
    zIndex = (zIndex) ? zIndex : 950;
    this.componentRef.instance.zIndex = zIndex;
  }

  @HostBinding('style.position')
  private readonly position = 'relative';

  private readonly componentRef: ComponentRef<LoaderComponent>;

  constructor(
    private readonly vcRef: ViewContainerRef,
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly renderer: Renderer2) {
    const factory =
      this.componentFactoryResolver.resolveComponentFactory(LoaderComponent);
    this.componentRef = this.vcRef.createComponent(factory);
    const mainElement = this.vcRef.element.nativeElement;
    this.renderer.appendChild(mainElement, this.componentRef.location.nativeElement);
  }

  /**
   * Generates loading overlay with config options
   * Sets parent positona and overlow
   * @private
   * @returns nothing
   *
   * @memberOf LoadingDirective
   */
  private startLoading() {
    this.componentRef.instance.display = '';
  }

  /**
   * Destroys loading overlay
   * Resets overflow and position of parent
   * @private
   * @returns nothing
   *
   * @memberOf LoadingDirective
   */
  private stopLoading() {
    this.componentRef.instance.display = 'hidden';
  }

}
