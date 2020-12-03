import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { GrowlModule } from 'primeng/growl';
import { MessageService } from 'primeng/components/common/messageservice';
import { NavigationMenuModule, NAV_MENU_SERVICE, DefaultNavigationMenuService } from 'lib-platform-components';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { ErrorsModule } from './shared/errors/index';
import { JbhEsaModule, UserService } from './shared/jbh-esa';
UserService.URL = 'mock/esaorder.json';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ErrorsModule,
    FormsModule,
    GrowlModule,
    HttpClientModule,
    NavigationMenuModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    JbhEsaModule.forRoot()
  ],
  providers: [
    UserService,
    MessageService,
    {
      provide: NAV_MENU_SERVICE,
      useClass: DefaultNavigationMenuService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
