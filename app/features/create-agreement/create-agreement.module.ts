import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { LocalStorageService } from '../../shared/jbh-app-services/local-storage.service';
import { CommonImportModule } from '../../shared/common-import.module';
import { BroadcasterService } from '../../shared/jbh-app-services/broadcaster.service';
import { WebSocketService } from '../../shared/jbh-app-services/web-socket.service';
import { MessageModule } from 'primeng/message';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { CreateAgreementRoutingModule } from './create-agreement-routing.module';
import { CreateAgreementComponent } from './create-agreement.component';
import { AgreementDetailsComponent } from './agreement-details/agreement-details.component';
import { AddContractsComponent } from './add-contracts/add-contracts.component';
import { AddSectionComponent } from './add-section/add-section.component';
import { JbhLoaderModule } from '../../shared/jbh-loader/jbh-loader.module';
import { AddCargoComponent } from './add-cargo/add-cargo.component';
import { CreateCargoComponent } from './add-cargo/create-cargo/create-cargo.component';
import { CarrierAgreementComponent } from './carrier-agreement/carrier-agreement.component';

@NgModule({
  imports: [
    CreateAgreementRoutingModule,
    CommonImportModule,
    JbhLoaderModule,
    DirectivesModule,
    MessageModule
  ],
  declarations: [
    CreateAgreementComponent,
    AgreementDetailsComponent,
    AddContractsComponent,
    AddSectionComponent,
    AddCargoComponent,
    CreateCargoComponent,
    CarrierAgreementComponent
  ],
  providers: [
    LocalStorageService,
    BroadcasterService,
    WebSocketService
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class CreateAgreementModule { }
