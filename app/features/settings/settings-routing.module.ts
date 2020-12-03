import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { CanDeactivateGuardService } from './../../shared/jbh-app-services/can-deactivate-guard.service';
import { ChargesComponent } from './charges/charges.component';
import { DefaultRatingRuleComponent } from './business/default-rating-rule/default-rating-rule.component';
import { BusinessFuelComponent } from './business/business-fuel/business-fuel.component';
import { BusinessDefaultValuesComponent } from './business/business-default-values/business-default-values.component';
import { LinehaulPriorityComponent } from './business/linehaul-priority/linehaul-priority.component';
import { DrayGroupComponent } from './business/dray-group/dray-group.component';


const routes: Routes = [{
  path: '',
  component: SettingsComponent,
  canDeactivate: [CanDeactivateGuardService]
}, {
  path: 'charges',
  component: ChargesComponent,
  canDeactivate: [CanDeactivateGuardService]
}, {
  path: 'draygroup',
  component: DrayGroupComponent,
  canDeactivate: [CanDeactivateGuardService]
}, {
  path: 'defaultratingrule',
  component: DefaultRatingRuleComponent,
  canDeactivate: [CanDeactivateGuardService]
},
{
  path: 'business-fuel',
  component: BusinessFuelComponent
}, {
  path: 'defaultvalues',
  component: BusinessDefaultValuesComponent,
  canDeactivate: [CanDeactivateGuardService]
}, {
  path: 'precedence',
  component: LinehaulPriorityComponent,
  canDeactivate: [CanDeactivateGuardService]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CanDeactivateGuardService]
})
export class SettingsRoutingModule { }
