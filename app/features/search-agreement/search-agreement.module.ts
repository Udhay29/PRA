import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ChipsModule } from 'primeng/chips';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { JbhLoaderModule } from '../../shared/jbh-loader/jbh-loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ConfirmationService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';

import { GrowlModule } from 'primeng/growl';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SpinnerModule } from 'primeng/spinner';

import { TooltipModule } from 'primeng/tooltip';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { DialogModule } from 'primeng/dialog';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

import { DragDropModule } from 'primeng/dragdrop';
import { OrderListModule } from 'primeng/orderlist';
import { GMapModule } from 'primeng/gmap';
import { SearchAgreementRoutingModule } from './search-agreement-routing.module';


import { SearchAgreementComponent } from './search-agreement.component';
import { AdvanceSearchComponent } from './advance-search/advance-search.component';
import { AdvanceSearchService } from './advance-search/services/advance-search.service';
import { SearchService } from './services/search.service';
import { SearchGridUtility } from './search-grid/services/search-grid.utility';
import { SearchGridComponent } from './search-grid/search-grid.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DirectivesModule } from '../../shared/directives/directives.module';

@NgModule({
  imports: [
    SearchAgreementRoutingModule,
    AutoCompleteModule,
    BreadcrumbModule,
    ButtonModule,
    CommonModule,
    CheckboxModule,
    ConfirmDialogModule,
    MessageModule,
    MessagesModule,
    FormsModule,
    InputTextModule,
    MenuModule,
    PanelModule,
    ReactiveFormsModule,
    RadioButtonModule,
    SpinnerModule,
    SelectButtonModule,
    MultiSelectModule,
    DragDropModule,
    TabViewModule,
    TooltipModule,
    OrderListModule,
    DropdownModule,
    GMapModule,
    ScrollPanelModule,
    DialogModule,
    ProgressSpinnerModule,
    DirectivesModule,
    GrowlModule,
    CalendarModule,
    TableModule,
    ChipsModule,
    InputSwitchModule,
    InputTextareaModule,
    JbhLoaderModule
  ],
  declarations: [AdvanceSearchComponent, SearchGridComponent, SearchAgreementComponent],
  providers: [ConfirmationService, DatePipe, AdvanceSearchService, SearchService, SearchGridUtility],
  schemas: [NO_ERRORS_SCHEMA]
})

export class SearchAgreementModule { }
