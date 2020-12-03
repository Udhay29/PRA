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
import { CommonImportModule } from './../../shared/common-import.module';
import { OrderListModule } from 'primeng/orderlist';

import { JbhFiltersModule } from '../../shared/jbh-filters/jbh-filters.module';
import { RuleSharedModule } from './../shared/accessorials/rule-shared/rule-shared.module';
import { LocalStorageService } from './../../shared/jbh-app-services/local-storage.service';
import { BroadcasterService } from '../../shared/jbh-app-services/broadcaster.service';
import { TimeZoneService } from '../../shared/jbh-app-services/time-zone.service';

import { StairStepModule } from './../shared/accessorials/stair-step/stair-step.module';
import { StandardRoutingModule } from './standard-routing.module';
import { StandardComponent } from '../standard/standard.component';
import { StandardAccessorialComponent } from './standard-accessorial/standard-accessorial.component';
import { StandardDocumentationComponent } from './standard-accessorial/standard-documentation/standard-documentation.component';
import { StandardRateComponent } from './standard-accessorial/standard-rate/standard-rate.component';
import {
  CreateStandardDocumentationComponent
} from './standard-accessorial/standard-documentation/create-standard-documentation/create-standard-documentation.component';
import {
  StandardOptionalAttributesComponent
  // tslint:disable-next-line:import-spacing
}
from
// tslint:disable-next-line:max-line-length
'./standard-accessorial/standard-documentation/create-standard-documentation/standard-optional-attributes/standard-optional-attributes.component';
import {
  DocumentationCategoryComponent
  // tslint:disable-next-line:import-spacing
}
from
// tslint:disable-next-line:max-line-length
'./standard-accessorial/standard-documentation/create-standard-documentation/documentation-category/documentation-category.component';
import { CreateStandardRateComponent } from './standard-accessorial/standard-rate/create-standard-rate/create-standard-rate.component';
import { AddRatesComponent } from './standard-accessorial/standard-rate/create-standard-rate/add-rates/add-rates.component';
import { RateSetupComponent } from './standard-accessorial/standard-rate/create-standard-rate/rate-setup/rate-setup.component';
import {
  RatesOptionalAttributesComponent
  // tslint:disable-next-line:import-spacing
}
  from
  // tslint:disable-next-line:max-line-length
  './standard-accessorial/standard-rate/create-standard-rate/rates-optional-attributes/rates-optional-attributes.component';
import { CreateTemplateComponent } from './email-template/create-template/create-template.component';
import { EmailSetupComponent } from '../shared/accessorials/email-template/email-setup/email-setup.component';
import { TemplateSubjectComponent } from '../shared/accessorials/email-template/template-subject/template-subject.component';
import { TemplateBodyComponent } from '../shared/accessorials/email-template/template-body/template-body.component';
import { TemplateSignatureComponent } from '../shared/accessorials/email-template/template-signature/template-signature.component';
import { EmailTemplateComponent } from './email-template/email-template.component';
import { CreateStandardRulesComponent } from './standard-accessorial/standard-rules/create-rules/standard-create-rules.component';
import { StandardRulesComponent } from './standard-accessorial/standard-rules/standard-rules.component';
import {
  StandardViewDocumentationComponent
} from './standard-accessorial/standard-rules/view-documentation/standard-view-documentation.component';
import { AdditionalChargesModule } from './../shared/accessorials/additional-charges/additional-charges.module';
import { FreeEventTypeStandardComponent } from './standard-accessorial/standard-rules/free-rule/free-event-type/free-event-type.component';
import { ReferencedataListComponent } from './standard-accessorial/standard-rules/referencedata-list/referencedata-list.component';
import { FreeRuleComponent } from './standard-accessorial/standard-rules/free-rule/free-rule.component';
import { FreeCalendarComponent } from './standard-accessorial/standard-rules/free-rule/free-calendar/free-calendar.component';

import { BatchingExcelComponent } from '../shared/accessorials/email-template/batching-excel/batching-excel.component';
import { DefaultExcelComponent } from '../shared/accessorials/email-template/default-excel/default-excel.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ViewListTemplateComponent } from '../shared/accessorials/email-template/view-list-template/view-list-template.component';
import { NotificationModule } from './../shared/accessorials/notification/notification.module';


@NgModule({
  imports: [
    CommonModule,
    StandardRoutingModule,
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
    StairStepModule,
    AdditionalChargesModule,
    OrderListModule,
    OverlayPanelModule,
    NotificationModule,
    RuleSharedModule

  ],
  providers: [BroadcasterService, LocalStorageService, CurrencyPipe, TimeZoneService, DatePipe],
  declarations: [StandardComponent, StandardAccessorialComponent, StandardDocumentationComponent, StandardRateComponent
    , CreateStandardDocumentationComponent, StandardOptionalAttributesComponent,
    DocumentationCategoryComponent, CreateStandardRateComponent, AddRatesComponent,
    RateSetupComponent, RatesOptionalAttributesComponent, CreateStandardRulesComponent, StandardRulesComponent,
    StandardViewDocumentationComponent, FreeCalendarComponent,
    FreeEventTypeStandardComponent , FreeRuleComponent, ReferencedataListComponent, CreateTemplateComponent,
    EmailSetupComponent, TemplateSubjectComponent, TemplateBodyComponent, TemplateSignatureComponent, EmailTemplateComponent,
    BatchingExcelComponent, DefaultExcelComponent, ViewListTemplateComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class StandardModule { }
