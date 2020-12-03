import { AdditionalChargesComponent } from './additional-charges/additional-charges.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';

@NgModule({
  imports: [
    CommonModule, AutoCompleteModule, TableModule, MessagesModule, MessageModule, CheckboxModule,
    FormsModule, ReactiveFormsModule, InputTextModule, DialogModule, ConfirmDialogModule
  ],
  providers: [ConfirmationService],
  declarations: [AdditionalChargesComponent],
  exports: [AdditionalChargesComponent]
})
export class AdditionalChargesModule { }
