import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsideComponent } from './aside.component';
import { AsideNavComponent } from './nav/aside-nav.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [AsideComponent, AsideNavComponent],
  providers: [],
  exports: [AsideComponent]
})
export class AsideModule { }
