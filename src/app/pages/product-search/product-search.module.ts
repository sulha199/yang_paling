import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductSearchComponent } from './product-search.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductSearchRoutingModule } from './product-search.routing.module';



@NgModule({
  declarations: [
    ProductSearchComponent,
  ],
  imports: [
    ProductSearchRoutingModule,
    CommonModule,
    SharedModule,
  ],
  exports: [
    ProductSearchComponent
  ]
})
export class ProductSearchModule { }
