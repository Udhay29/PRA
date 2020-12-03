import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewAgreementDetailsComponent } from './view-agreement-details.component';
import { CreateMileageComponent } from './create-mileage/create-mileage.component';
import { CanDeactivateGuardService } from '../../shared/jbh-app-services/can-deactivate-guard.service';
import { CreateLineHaulComponent } from './line-haul/create-line-haul/create-line-haul.component';
import { RatingRulesComponent } from './rating-rules/rating-rules.component';
import { AdditionalInformationComponent } from './line-haul/additional-information/additional-information.component';
import { ReviewComponent } from './line-haul/review/review.component';
import { LineHaulDetailedViewComponent } from './line-haul/line-haul-detailed-view/line-haul-detailed-view.component';
import { ContractListComponent } from './accessorials/shared/contract-list/contract-list.component';
import { CreateDocumentationComponent } from './accessorials/documentation/create-documentation/create-documentation.component';
import { CreateRatesComponent } from './accessorials/rates/create-rates/create-rates.component';
import { CreateFuelProgramComponent } from './fuel/create-fuel-program/create-fuel-program.component';
import { CreateRulesComponent } from './accessorials/rules/create-rules/create-rules.component';
import { RatesDetailedViewComponent } from './accessorials/rates/rates-detailed-view/rates-detailed-view.component';
import { RulesDetailedViewComponent } from './accessorials/rules/rules-detailed-view/rules-detailed-view.component';
import { CanActivateGuardService } from './../../shared/jbh-app-services/can-activate-guard.service';
import { FuelProgramsDetailViewComponent } from './fuel/fuel-programs-detail-view/fuel-programs-detail-view.component';
// tslint:disable-next-line:max-line-length
import { DocumentationDetailedViewComponent } from './accessorials/documentation/documentation-detailed-view/documentation-detailed-view.component';

const routes: Routes = [{
  path: '',
  component: ViewAgreementDetailsComponent,
  canDeactivate: [CanDeactivateGuardService]
},
{
  path: 'createmileage',
  component: CreateMileageComponent,
  canDeactivate: [CanDeactivateGuardService]
},
{
  path: 'linehaul',
  component: CreateLineHaulComponent,
  canDeactivate: [CanDeactivateGuardService],
  canActivate: [CanActivateGuardService]
},
{
  path: 'ratingrule',
  component: RatingRulesComponent,
  canDeactivate: [CanDeactivateGuardService]
},
{
  path: 'editratingrule',
  component: RatingRulesComponent,
  canDeactivate: [CanDeactivateGuardService]
}, {
  path: 'additionalInfo',
  component: AdditionalInformationComponent,
  canDeactivate: [CanDeactivateGuardService],
  canActivate: [CanActivateGuardService]
},
{
  path: 'review',
  component: ReviewComponent,
  canDeactivate: [CanDeactivateGuardService],
  canActivate: [CanActivateGuardService]
}, {
  path: 'detailedView',
  component: LineHaulDetailedViewComponent,
  canDeactivate: [CanDeactivateGuardService],
  canActivate: [CanActivateGuardService]
},
{
  path: 'contractlist',
  component: ContractListComponent,
  canDeactivate: [CanDeactivateGuardService]
},
{
  path: 'documentation',
  component: CreateDocumentationComponent,
  canDeactivate: [CanDeactivateGuardService],
  canActivate: [CanActivateGuardService]
},
{
  path: 'documentationdetailedview',
  component: DocumentationDetailedViewComponent,
  canDeactivate: [CanDeactivateGuardService]
},
{
  path: 'rates',
  component: CreateRatesComponent,
  canDeactivate: [CanDeactivateGuardService],
  canActivate: [CanActivateGuardService]
},
{
  path: 'editrates',
  component: CreateRatesComponent,
  canDeactivate: [CanDeactivateGuardService],
  canActivate: [CanActivateGuardService]
},
{
  path: 'ratesdetailedview',
  component: RatesDetailedViewComponent,
  canDeactivate: [CanDeactivateGuardService],
  canActivate: [CanActivateGuardService]
},
{
  path: 'rulesdetailedview',
  component: RulesDetailedViewComponent,
  canDeactivate: [CanDeactivateGuardService],
  canActivate: [CanActivateGuardService]
},
{
  path: 'editrules',
  component: CreateRulesComponent,
  canDeactivate: [CanDeactivateGuardService],
  canActivate: [CanActivateGuardService]
},
{
  path: 'fuel',
  component: CreateFuelProgramComponent,
  canDeactivate: [CanDeactivateGuardService],
  canActivate: [CanActivateGuardService]
}, {
  path: 'fuel-details-view',
  component: FuelProgramsDetailViewComponent,
  canDeactivate: [CanDeactivateGuardService]
},
{
  path: 'rule',
  component: CreateRulesComponent,
  canDeactivate: [CanDeactivateGuardService],
  canActivate: [CanActivateGuardService]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CanDeactivateGuardService, CanActivateGuardService]
})
export class ViewAgreementDetailsRoutingModule { }
