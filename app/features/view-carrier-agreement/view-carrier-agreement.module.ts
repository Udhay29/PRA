
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayPanelModule } from 'primeng/overlaypanel';

import { CommonImportModule } from '../../shared/common-import.module';
import { LocalStorageService } from './../../shared/jbh-app-services/local-storage.service';
import { BroadcasterService } from '../../shared/jbh-app-services/broadcaster.service';

import { ViewCarrierAgreementRoutingModule } from './view-carrier-agreement-routing.module';
import { ViewCarrierAgreementComponent } from './view-carrier-agreement.component';
import { CreateCarrierSectionComponent } from './carrier-section/create-carrier-section/create-carrier-section.component';
import { CarrierSectionComponent } from './carrier-section/carrier-section.component';
import { CarrierMileageComponent } from './carrier-mileage/carrier-mileage.component';
import { CreateCarrierMileageComponent } from './carrier-mileage/create-carrier-mileage/create-carrier-mileage.component';
import { TimeZoneService } from '../../shared/jbh-app-services/time-zone.service';

@NgModule({
  declarations: [ViewCarrierAgreementComponent, CarrierSectionComponent,
    CreateCarrierSectionComponent, CarrierMileageComponent, CreateCarrierMileageComponent],
  imports: [
    CommonModule, CommonImportModule, OverlayPanelModule,
    ViewCarrierAgreementRoutingModule
  ],
  providers: [LocalStorageService, BroadcasterService, TimeZoneService]
})
export class ViewCarrierAgreementModule { }
