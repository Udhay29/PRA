import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorPageComponent } from './error-page/error-page.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ ErrorPageComponent ],
  exports: [ ErrorPageComponent ]
})
export class ErrorsModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ErrorsModule,
      providers: []
    };
  }

}
