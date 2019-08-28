import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HeaderNavbarComponent } from './components/layouts/header-navbar/header-navbar.component';
import { MaterialModule } from './modules/material.module';
import { LetDirective } from './directives/let/let.directive';
import { GlobalSearchComponent } from './components/inputs/global-search/global-search.component';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { NgxsModule, Store } from '@ngxs/store';
import { DisplayModeState } from './ngxs/states/displayMode.states';
import { IFramePageState } from './ngxs/states/iframePage.state';

@Component({
  selector: 'app-header-navbar',
  template: '',
})
class MockAppHeader{}

fdescribe('AppComponent', () => {
  let store: Store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MaterialModule,
        FormsModule,
        NgxsModule.forRoot([DisplayModeState, IFramePageState])
      ],
      declarations: [
        AppComponent,
        MockAppHeader,
        LetDirective,
        GlobalSearchComponent,
      ],
    }).compileComponents();
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
  }));

  it('should create the app and dispatch DISPLAY_MODE_SHOW_FEATURED onInit', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    fixture.detectChanges();

    expect(app).toBeTruthy();
    expect(store.dispatch).toHaveBeenCalled();
  });
});
