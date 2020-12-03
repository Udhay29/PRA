import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchAgreementComponent } from './search-agreement.component';

const routes: Routes = [{
  path: '',
  component: SearchAgreementComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchAgreementRoutingModule { }
