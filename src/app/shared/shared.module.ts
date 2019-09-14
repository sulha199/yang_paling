import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './modules/material.module';
import { FormsModule } from '@angular/forms';
import { LetDirective } from './directives/let/let.directive';
import { ProductCardComponent } from './components/product-card/product-card.component';

@NgModule({
  declarations: [
    LetDirective,
    ProductCardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
  ],
  exports: [
    LetDirective,
    ProductCardComponent,
    FormsModule,
    MaterialModule,
  ]
})
export class SharedModule { }
