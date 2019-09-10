import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockGlobalSearchComponent } from './component/global-search.mock.component';

@NgModule({
  declarations: [
    MockGlobalSearchComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MockGlobalSearchComponent
  ]
})
export class MocksModule { }
