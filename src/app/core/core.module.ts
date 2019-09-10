import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderNavbarComponent } from './layouts/header-navbar/header-navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { GlobalSearchComponent } from './layouts/global-search/global-search.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    GlobalSearchComponent,
    HeaderNavbarComponent,
  ],
  providers: [
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    SharedModule,
  ],
  exports: [
    GlobalSearchComponent,
    HeaderNavbarComponent,
  ]
})
export class CoreModule { }
