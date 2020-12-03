import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableKeynavDirective } from './table-keynav.directive';
import { SecureDirective } from './secure.directive';
import { ShortcutDirective } from './shortcut.directive';
import { MenuOverlayDirective } from './menu-overlay.directive';
import { DialogShortcutDirective } from './dialog-shortcut.directive';
import { TooltipClassDirective } from './tooltip-class.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TableKeynavDirective, SecureDirective, ShortcutDirective, MenuOverlayDirective,
    DialogShortcutDirective, TooltipClassDirective],
  exports: [TableKeynavDirective, SecureDirective, ShortcutDirective, MenuOverlayDirective,
    DialogShortcutDirective, TooltipClassDirective]
})
export class DirectivesModule { }
