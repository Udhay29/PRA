import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddStairStepComponent } from './add-stair-step/add-stair-step.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule, AutoCompleteModule, TableModule, MessagesModule, MessageModule, CheckboxModule,
    FormsModule, ReactiveFormsModule, InputTextModule
  ],
  declarations: [AddStairStepComponent],
  exports: [AddStairStepComponent]
})
export class StairStepModule { }
