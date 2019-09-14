import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Store, NgxsModule } from '@ngxs/store';
import { DisplayModeState } from './core/ngxs/states/displayMode.states';
import { HeaderNavbarComponent } from './core/layouts/header-navbar/header-navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IFramePageState } from './core/ngxs/states/iframePage.state';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { IndexComponent } from './pages/index/index.component';
import { ProductSearchComponent } from './pages/product-search/product-search.component';
import { ProductSearchState } from './core/ngxs/states/productSearch.State';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    ProductSearchComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    NgxsModule.forRoot([
      DisplayModeState,
      IFramePageState,
      ProductSearchState,
    ]),
    SharedModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
