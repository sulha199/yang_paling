import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './modules/material.module';
import { FormsModule } from '@angular/forms';
import { LetDirective } from './directives/let/let.directive';

@NgModule({
  declarations: [
    LetDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
  ],
  exports: [
    LetDirective,
    FormsModule,
    MaterialModule,
  ]
})
export class SharedModule { }
