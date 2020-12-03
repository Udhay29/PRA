import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { CheckboxModule } from 'primeng/checkbox';
import { SliderModule } from 'primeng/slider';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AutocompleteFilterComponent } from './autocomplete-filter/autocomplete-filter.component';
import { ListingFilterComponent } from './listing-filter/listing-filter.component';
import { SliderFilterComponent } from './slider-filter/slider-filter.component';
import { RadioFilterComponent } from './radio-filter/radio-filter.component';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { DateFilterComponent } from './date-filter/date-filter.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PanelModule,
    AccordionModule,
    AutoCompleteModule,
    ScrollPanelModule,
    CheckboxModule,
    SliderModule,
    InputTextModule,
    RadioButtonModule,
    CalendarModule,
    TooltipModule
  ],
  declarations: [AutocompleteFilterComponent, ListingFilterComponent, SliderFilterComponent, DateFilterComponent, RadioFilterComponent],
  exports: [AutocompleteFilterComponent, ListingFilterComponent, SliderFilterComponent, DateFilterComponent, RadioFilterComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class JbhFiltersModule { }
