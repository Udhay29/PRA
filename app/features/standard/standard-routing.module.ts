import { NgModule } from '@angular/core';
import { StandardComponent } from './standard.component';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from './../../shared/jbh-app-services/can-activate-guard.service';
import { CanDeactivateGuardService } from '../../shared/jbh-app-services/can-deactivate-guard.service';
import {
  CreateStandardDocumentationComponent
} from './standard-accessorial/standard-documentation/create-standard-documentation/create-standard-documentation.component';
import { CreateStandardRateComponent } from './standard-accessorial/standard-rate/create-standard-rate/create-standard-rate.component';
import { CreateTemplateComponent } from './email-template/create-template/create-template.component';
import { EmailTemplateComponent } from './email-template/email-template.component';
import { CreateStandardRulesComponent } from './standard-accessorial/standard-rules/create-rules/standard-create-rules.component';
import { ViewListTemplateComponent } from '../shared/accessorials/email-template/view-list-template/view-list-template.component';

const routes: Routes = [{
  path: '',
  component: StandardComponent
},
{
  path: 'documentation',
  component: CreateStandardDocumentationComponent,
  canDeactivate: [CanDeactivateGuardService]
},
{
  path: 'rates',
  component: CreateStandardRateComponent,
  canDeactivate: [CanDeactivateGuardService]
},
{
  path: 'create-template',
  component: CreateTemplateComponent,
  canDeactivate: [CanDeactivateGuardService]
},
{
  path: 'email-templates',
  component: EmailTemplateComponent
},
{
  path: 'view-list-template',
  component: ViewListTemplateComponent,
  canDeactivate: [CanDeactivateGuardService]
},
{
  path: 'rule',
  component: CreateStandardRulesComponent,
  canDeactivate: [CanDeactivateGuardService]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CanDeactivateGuardService, CanActivateGuardService]

})
export class StandardRoutingModule { }
