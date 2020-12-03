import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { AccordionModule } from 'primeng/accordion';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { StepsModule } from 'primeng/steps';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TabViewModule } from 'primeng/tabview';
import { SpinnerModule } from 'primeng/spinner';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ChipsModule } from 'primeng/chips';
import { GrowlModule } from 'primeng/growl';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';

import { DirectivesModule } from '../../shared/directives/directives.module';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { ConfigurableComponent } from './configurable/configurable.component';
import { QuotesComponent } from './configurable/quotes/quotes.component';
import { GeneralComponent } from './configurable/general/general.component';
import { PrecedenceComponent } from './precedence/precedence.component';
import { DefaultValuesComponent } from './configurable/default-values/default-values.component';
import { AdminComponent } from './admin/admin.component';
import { SettingsService } from './service/settings.service';
import { AppConfig } from './../../../config/app.config';
import { BroadcasterService } from '../../shared/jbh-app-services/broadcaster.service';
import { AdminUtility } from './admin/service/admin.utility';
import { JbhLoaderModule } from '../../shared/jbh-loader/jbh-loader.module';
import { ChargesComponent } from './charges/charges.component';
import { ViewChargesComponent } from './charges/view-charges/view-charges.component';
import { CreateChargesComponent } from './charges/create-charges/create-charges.component';
import { ValuesComponent } from './charges/values/values.component';
import { BusinessComponent } from './business/business.component';
import { DefaultRatingRuleComponent } from './business/default-rating-rule/default-rating-rule.component';
import { BusinessFuelComponent } from './business/business-fuel/business-fuel.component';
import { FuelPriceComponent } from './business/business-fuel/fuel-price/fuel-price.component';
import { BusinessDefaultValuesComponent } from './business/business-default-values/business-default-values.component';
import { LinehaulPriorityComponent } from './business/linehaul-priority/linehaul-priority.component';
import { PriorityComponent } from './business/linehaul-priority/priority/priority.component';
import { GroupsComponent } from './business/linehaul-priority/groups/groups.component';
import { FuelFilterComponent } from './business/business-fuel/fuel-filter/fuel-filter.component';
import { CommonImportModule } from './../../shared/common-import.module';
import { JbhFiltersModule } from '../../shared/jbh-filters/jbh-filters.module';
import { ChargesFilterComponent } from '../settings/charges/view-charges/charges-filter/charges-filter.component';
import { DrayGroupComponent } from './business/dray-group/dray-group.component';
import { CreateDrayGroupComponent } from './business/dray-group/create-dray-group/create-dray-group.component';
import { DrayGroupService } from './business/dray-group/service/dray-group.service';
import { CreateDrayGroupService } from './business/dray-group/create-dray-group/service/create-dray-group.service';
import { CreateDrayGroupUtilsService } from './business/dray-group/create-dray-group/service/create-dray-group-utils.service';

@NgModule({
  imports: [
    CommonImportModule,
    JbhFiltersModule,
    CommonModule,
    MessagesModule,
    ConfirmDialogModule,
    MessageModule,
    TableModule,
    PanelModule,
    AccordionModule,
    TabViewModule,
    BreadcrumbModule,
    JbhLoaderModule,
    TooltipModule,
    ReactiveFormsModule,
    InputSwitchModule,
    CalendarModule,
    FormsModule,
    ButtonModule,
    RadioButtonModule,
    MultiSelectModule,
    StepsModule,
    DropdownModule,
    SpinnerModule,
    AutoCompleteModule,
    InputTextModule,
    SettingsRoutingModule,
    ChipsModule,
    DirectivesModule,
    GrowlModule,
    DialogModule,
    SelectButtonModule,
    CheckboxModule,
    InputTextareaModule
  ],
  declarations: [SettingsComponent, ConfigurableComponent, QuotesComponent, GeneralComponent, PrecedenceComponent,
    DefaultValuesComponent, AdminComponent, ChargesComponent, ValuesComponent, ViewChargesComponent, CreateChargesComponent,
    BusinessComponent,
    DefaultRatingRuleComponent,
    BusinessFuelComponent,
    FuelPriceComponent,
    BusinessDefaultValuesComponent, LinehaulPriorityComponent,
    PriorityComponent, GroupsComponent, FuelFilterComponent, ChargesFilterComponent, DrayGroupComponent, CreateDrayGroupComponent],
  providers: [SettingsService, ConfirmationService, AppConfig, BroadcasterService, AdminUtility,
    CurrencyPipe, DrayGroupService, CreateDrayGroupService, CreateDrayGroupUtilsService]
})
export class SettingsModule { }
