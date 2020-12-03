import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { CreateAgreementComponent } from './create-agreement.component';
import { CanDeactivateGuardService } from '../../shared/jbh-app-services/can-deactivate-guard.service';

const routes: Routes = [{
  path: '',
  component: CreateAgreementComponent,
  canDeactivate: [CanDeactivateGuardService]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CanDeactivateGuardService]
})
export class CreateAgreementRoutingModule { }
