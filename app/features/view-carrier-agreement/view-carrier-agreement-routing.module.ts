import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanDeactivateGuardService } from '../../shared/jbh-app-services/can-deactivate-guard.service';

import { ViewCarrierAgreementComponent } from './view-carrier-agreement.component';
import { CreateCarrierMileageComponent } from './carrier-mileage/create-carrier-mileage/create-carrier-mileage.component';

const routes: Routes = [{
  path: ':id',
  component: ViewCarrierAgreementComponent,
  canDeactivate: [CanDeactivateGuardService]
},
{
  path: ':id/createcarriermileage',
  component: CreateCarrierMileageComponent,
  canDeactivate: [CanDeactivateGuardService]
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CanDeactivateGuardService]
})
export class ViewCarrierAgreementRoutingModule { }
