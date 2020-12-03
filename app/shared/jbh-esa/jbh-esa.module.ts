import { APP_INITIALIZER, Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule, LOCATION_INITIALIZED } from '@angular/common';

import { EsaService } from './esa.service';
import { UserService } from './user.service';

export function initializationFactory(esaService: EsaService, injector: Injector) {
  return () => new Promise((resolve) => {
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    locationInitialized.then(() => {
      esaService.load().then(() => resolve(null));
    });
  });

}

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [EsaService, {
    provide: APP_INITIALIZER,
    useFactory: initializationFactory,
    deps: [EsaService, Injector],
    multi: true
  }]
})

export class JbhEsaModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: JbhEsaModule,
      providers: [EsaService, UserService]
    };
  }
}
