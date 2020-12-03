import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { JbhLoaderModule } from '../../shared/jbh-loader/jbh-loader.module';
import { MessageModule } from 'primeng/message';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GrowlModule } from 'primeng/growl';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { ChipsModule } from 'primeng/chips';
import { AccordionModule } from 'primeng/accordion';
import { TabViewModule } from 'primeng/tabview';
import { PipesModule } from '../../shared/pipes/pipes.module';
import { MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MessagesModule } from 'primeng/messages';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TooltipModule } from 'primeng/tooltip';
import { FileUploadModule } from 'primeng/fileupload';
import { OverlayPanelModule } from 'primeng/overlaypanel';

import { CommonImportModule } from './../../shared/common-import.module';
import { StairStepModule } from './../shared/accessorials/stair-step/stair-step.module';
import { RuleSharedModule } from './../shared/accessorials/rule-shared/rule-shared.module';
import { ViewAgreementDetailsRoutingModule } from './view-agreement-details-routing.module';
import { ViewAgreementDetailsComponent } from './view-agreement-details.component';
import { ManageTeamsComponent } from './manage-teams/manage-teams.component';
import { ViewMileageComponent } from './view-mileage/view-mileage.component';
import { CreateMileageComponent } from './create-mileage/create-mileage.component';
import { BroadcasterService } from '../../shared/jbh-app-services/broadcaster.service';
import { CargoReleaseComponent } from './cargo-release/cargo-release.component';
import { ViewCargoReleaseComponent } from './cargo-release/view-cargo-release/view-cargo-release.component';
import { CargoReleaseFilterComponent } from './cargo-release/cargo-release-filter/cargo-release-filter.component';
import { JbhFiltersModule } from '../../shared/jbh-filters/jbh-filters.module';
import { LocalStorageService } from './../../shared/jbh-app-services/local-storage.service';
import { CargoFilterQuery } from './cargo-release/cargo-release-filter/query/cargo-filter.query';
import { ContractsFilterQuery } from './contracts/query/contracts-list.query';
import { ContractsDetailComponent } from './contracts/contracts-detail/contracts-detail.component';
import { ContractsComponent } from './contracts/contracts.component';
import { ContractsFilterComponent } from './contracts/contracts-filter/contracts-filter.component';
import { LineHaulComponent } from './line-haul/line-haul.component';
import { CreateLineHaulComponent } from './line-haul/create-line-haul/create-line-haul.component';
import { AddLineHaulComponent } from './line-haul/add-line-haul/add-line-haul.component';
import { LaneCardComponent } from './line-haul/add-line-haul/lane-card/lane-card.component';
import { OverviewComponent } from './line-haul/add-line-haul/overview/overview.component';
import { AdditionalInfoComponent } from './line-haul/add-line-haul/additional-info/additional-info.component';
import { StopsComponent } from './line-haul/add-line-haul/stops/stops.component';
import { RatingRuleComponent } from './rating-rule/rating-rule.component';
import { RatingRulesComponent } from './rating-rules/rating-rules.component';
import { SectionFilterUtility } from './sections/sections-filter/services/sections-filter.utility';
import { SectionsFilterService } from './sections/sections-filter/services/sections-filter.service';
import { SectionListUtility } from './sections/service/section-list.utility';

import { RateComponent } from './line-haul/add-line-haul/rate/rate.component';
import { AdditionalInformationComponent } from './line-haul/additional-information/additional-information.component';
import { LineHaulOverviewComponent } from './line-haul/additional-information/line-haul-overview/line-haul-overview.component';
import { ViewAgreementDetailsUtility } from './service/view-agreement-details-utility';
import { ReviewComponent } from './line-haul/review/review.component';
import { LineHaulDetailedViewComponent } from './line-haul/line-haul-detailed-view/line-haul-detailed-view.component';
import { LineHaulDetailsComponent } from './line-haul/line-haul-details/line-haul-details.component';
import { SectionListComponent } from './sections/sections.component';
import { SectionsDetailComponent } from './sections/sections-detail/sections-detail.component';
import { AccessorialsComponent } from './accessorials/accessorials.component';
import { DocumentationComponent } from './accessorials/documentation/documentation.component';
import { RatesComponent } from './accessorials/rates/rates.component';
import { BilltoListComponent } from './accessorials/shared/billto-list/billto-list.component';
import { ContractListComponent } from './accessorials/shared/contract-list/contract-list.component';
import { SectionsComponent } from './accessorials/shared/sections/sections.component';
import { ContractListService } from './accessorials/shared/contract-list/service/contract-list.service';
import { OptionalAttributesComponent } from './accessorials/documentation/optional-attributes/optional-attributes.component';
import { RatesOptionalAttributesComponent } from './accessorials/rates/rates-optional-attributes/rates-optional-attributes.component';
import { CreateDocumentationComponent } from './accessorials/documentation/create-documentation/create-documentation.component';
import { CreateRatesComponent } from './accessorials/rates/create-rates/create-rates.component';
import { TimeZoneService } from '../../shared/jbh-app-services/time-zone.service';
import { ViewRatingRuleDetailComponent } from './rating-rule/view-rating-rule-detail/view-rating-rule-detail.component';
import { FuelComponent } from './fuel/fuel.component';
import { CreateFuelProgramComponent } from './fuel/create-fuel-program/create-fuel-program.component';
import { FuelSummaryComponent } from './fuel/fuel-summary/fuel-summary.component';
import { FuelCalculationDetailsComponent } from './fuel/fuel-calculation-details/fuel-calculation-details.component';
import { FuelPriceBasisComponent } from './fuel/fuel-price-basis/fuel-price-basis.component';
import { AddRatesComponent } from './accessorials/rates/add-rates/add-rates.component';
import { RulesComponent } from './accessorials/rules/rules.component';
import { CreateRulesComponent } from './accessorials/rules/create-rules/create-rules.component';
import { ReferencedataListComponent } from './accessorials/rules/referencedata-list/referencedata-list.component';
import { ViewDocumentationComponent } from './accessorials/shared/view-documentation/view-documentation.component';
import { RatingRuleFilterComponent } from './rating-rule/rating-rule-filter/rating-rule-filter.component';
import { FreeRuleComponent } from './accessorials/rules/free-rule/free-rule.component';
import { ContractItemComponent } from './contracts/contract-item/contract-item.component';
import { FreeEventTypeComponent } from './accessorials/rules/free-rule/free-event-type/free-event-type.component';
import { RatesDetailedViewComponent } from './accessorials/rates/rates-detailed-view/rates-detailed-view.component';
import { RulesDetailedViewComponent } from './accessorials/rules/rules-detailed-view/rules-detailed-view.component';
import { FuelProgramsDetailViewComponent } from './fuel/fuel-programs-detail-view/fuel-programs-detail-view.component';
import { FuelSummaryViewComponent } from './fuel/fuel-programs-detail-view/fuel-summary-view/fuel-summary-view.component';
import { FuelPriceViewComponent } from './fuel/fuel-programs-detail-view/fuel-price-view/fuel-price-view.component';
import { FuelCalculationViewComponent } from './fuel/fuel-programs-detail-view/fuel-calculation-view/fuel-calculation-view.component';
import { FuelIncrementalViewComponent } from './fuel/fuel-programs-detail-view/fuel-incremental-view/fuel-incremental-view.component';
import { SectionsCreationComponent } from './sections/sections-creation/sections-creation.component';
import { FreeCalendarComponent } from './accessorials/rules/free-rule/free-calendar/free-calendar.component';
// tslint:disable-next-line:max-line-length
import { RatesStairStepViewComponent } from './accessorials/rates/rates-detailed-view/rates-stair-step-view/rates-stair-step-view.component';
// tslint:disable-next-line:max-line-length
import { DocumentationDetailedViewComponent } from './accessorials/documentation/documentation-detailed-view/documentation-detailed-view.component';
// tslint:disable-next-line: max-line-length
import { FreeRulesDetailedViewComponent } from './accessorials/rules/rules-detailed-view/free-rules-detailed-view/free-rules-detailed-view.component';
import { MileageDetailsComponent } from './view-mileage/mileage-details/mileage-details.component';
import { MileageFilterComponent } from './view-mileage/mileage-filter/mileage-filter.component';
import { RatesFilterComponent } from './accessorials/rates/rates-filter/rates-filter.component';
import { DocumentationFilterComponent } from './accessorials/documentation/documentation-filter/documentation-filter.component';
import { SectionsFilterComponent } from './sections/sections-filter/sections-filter.component';
import { NotificationModule } from './../shared/accessorials/notification/notification.module';
import { AdditionalChargesModule } from './../shared/accessorials/additional-charges/additional-charges.module';
import { SharedModule } from './../../shared/shared.module';

@NgModule({
  imports: [
    OverlayPanelModule,
    CommonModule,
    ViewAgreementDetailsRoutingModule,
    CommonImportModule,
    CheckboxModule,
    RadioButtonModule,
    InputSwitchModule,
    InputTextareaModule,
    PanelModule,
    ButtonModule,
    JbhLoaderModule,
    MessageModule,
    FormsModule,
    ReactiveFormsModule,
    GrowlModule,
    AutoCompleteModule,
    InputTextModule,
    MultiSelectModule,
    CalendarModule,
    TableModule,
    ChipsModule,
    TabViewModule,
    MenuModule,
    AccordionModule,
    TabViewModule,
    PipesModule,
    JbhFiltersModule,
    SplitButtonModule,
    MessagesModule,
    DirectivesModule,
    ScrollPanelModule,
    TooltipModule,
    FileUploadModule,
    SharedModule,
    StairStepModule,
    AdditionalChargesModule,
    NotificationModule,
    RuleSharedModule
  ],
  providers: [BroadcasterService, CargoFilterQuery, ContractsFilterQuery, LocalStorageService,
    ViewAgreementDetailsUtility, CurrencyPipe, ContractListService, TimeZoneService, DatePipe, SectionsFilterService, SectionFilterUtility,
    SectionListUtility],
  declarations: [ViewAgreementDetailsComponent, ViewMileageComponent, CreateMileageComponent, ManageTeamsComponent,
    CargoReleaseComponent, ViewCargoReleaseComponent, CargoReleaseFilterComponent, LineHaulComponent,
    CreateLineHaulComponent, AddLineHaulComponent, LaneCardComponent, ContractsDetailComponent, RatingRuleComponent,
    ContractsComponent, ContractsFilterComponent, OverviewComponent, StopsComponent, RateComponent, AdditionalInformationComponent,
    LineHaulOverviewComponent, RatingRulesComponent, AdditionalInfoComponent, ReviewComponent,
    LineHaulDetailedViewComponent, LineHaulDetailsComponent, AccessorialsComponent,
    DocumentationComponent, RatesComponent, ContractListComponent, SectionsComponent,
    BilltoListComponent, OptionalAttributesComponent, RatesOptionalAttributesComponent,
    CreateDocumentationComponent, CreateRatesComponent,
    SectionListComponent, SectionsDetailComponent, FuelComponent,
    CreateFuelProgramComponent, FuelSummaryComponent, AddRatesComponent,
    FuelCalculationDetailsComponent, FuelPriceBasisComponent, ViewRatingRuleDetailComponent,
    RulesComponent, CreateRulesComponent, ViewDocumentationComponent, RatingRuleFilterComponent,
    FreeRuleComponent, ReferencedataListComponent, ContractItemComponent, FreeEventTypeComponent,
    FuelProgramsDetailViewComponent,
    FuelSummaryViewComponent,
    FuelPriceViewComponent,
    FuelCalculationViewComponent,
    FuelIncrementalViewComponent,
    SectionsCreationComponent, FreeCalendarComponent, RatesDetailedViewComponent, RulesDetailedViewComponent, RatesStairStepViewComponent,
    DocumentationDetailedViewComponent, FreeRulesDetailedViewComponent, MileageDetailsComponent,
    MileageFilterComponent,
    RatesFilterComponent,
    DocumentationFilterComponent,
    SectionsFilterComponent],

  schemas: [NO_ERRORS_SCHEMA],
  exports: [RatesOptionalAttributesComponent, AddRatesComponent]
})
export class ViewAgreementDetailsModule { }
