import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LetDirective } from './directives/let/let.directive';
import { Store, NgxsModule } from '@ngxs/store';
import { DisplayModeState } from './ngxs/states/displayMode.states';
import { HeaderNavbarComponent } from './components/layouts/header-navbar/header-navbar.component';
import { MaterialModule } from './modules/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TextInputComponent } from './components/inputs/text-input/text-input.component';
import { GlobalSearchComponent } from './components/inputs/global-search/global-search.component';
import { IFramePageState } from './ngxs/states/iframePage.state';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LetDirective,
    HeaderNavbarComponent,
    TextInputComponent,
    GlobalSearchComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    NgxsModule.forRoot([
      DisplayModeState,
      IFramePageState,
    ])
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
