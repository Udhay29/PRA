import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReturnInitialsFromNamePipe } from './return-initials-from-name.pipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [ReturnInitialsFromNamePipe],
  exports: [ReturnInitialsFromNamePipe]
})
export class PipesModule { }
