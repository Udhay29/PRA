import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepsModule } from 'primeng/steps';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { GrowlModule } from 'primeng/growl';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ChipsModule } from 'primeng/chips';
import { AccordionModule } from 'primeng/accordion';
import { TabViewModule } from 'primeng/tabview';
import { MessagesModule } from 'primeng/messages';
import { ScrollPanelModule } from 'primeng/scrollpanel';

import { JbhLoaderModule } from './jbh-loader/jbh-loader.module';
import { DirectivesModule } from './directives/directives.module';
import { PipesModule } from './pipes/pipes.module';


@NgModule({
  exports: [
    ScrollPanelModule,
    MessagesModule,
    ChipsModule,
    AccordionModule,
    TabViewModule,
    CommonModule,
    StepsModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    SelectButtonModule,
    AutoCompleteModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    CalendarModule,
    InputTextareaModule,
    DialogModule,
    MessageModule,
    GrowlModule,
    InputSwitchModule,
    MultiSelectModule,
    ConfirmDialogModule,
    TooltipModule,
    BreadcrumbModule,
    MenuModule,
    PanelModule,
    JbhLoaderModule,
    DirectivesModule,
    PipesModule,
    SplitButtonModule,
    CheckboxModule,
    RadioButtonModule
  ]
})
export class CommonImportModule { }
