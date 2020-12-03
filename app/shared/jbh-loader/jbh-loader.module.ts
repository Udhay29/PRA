import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { JbhLoaderDirective } from './jbh-loader.directive';

@NgModule({
  imports: [
    CommonModule,
    ProgressSpinnerModule
  ],
  declarations: [JbhLoaderDirective, LoaderComponent],
  exports: [JbhLoaderDirective],
  entryComponents: [LoaderComponent]
})
export class JbhLoaderModule { }
