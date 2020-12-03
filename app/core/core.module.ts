import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { LoggerModule, NgxLoggerLevel, NGXLogger } from 'ngx-logger';

import { HeaderModule } from '../core/header/header.module';
import { AsideModule } from '../core/aside/aside.module';

import { JbhTransLoader } from './i18n/jbh-trans.loader';
import { JbhMissingTransHandler } from './i18n/jbh-missing-trans.handler';
import { HeaderInterceptor } from './http/header.interceptor';
import { ResponseInterceptor } from './http/response.interceptor';
import { ErrorHandlerService } from './http/error-handler.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new JbhTransLoader(httpClient);
}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    LoggerModule.forRoot({
      level: NgxLoggerLevel.LOG
    })
  ],
  exports: [
    AsideModule,
    HeaderModule
  ],
  providers: [
    NGXLogger,
    ErrorHandlerService,
    { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true }
  ]
})
export class CoreModule { }
