import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AveragingRulesComponent } from './averaging-rules/averaging-rules.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';

@NgModule({
  imports: [
    CommonModule, AutoCompleteModule, TableModule, MessagesModule, MessageModule, CheckboxModule,
    FormsModule, ReactiveFormsModule, InputTextModule, RadioButtonModule
  ],
  declarations: [AveragingRulesComponent],
  exports: [AveragingRulesComponent]
})
export class RuleSharedModule { }
