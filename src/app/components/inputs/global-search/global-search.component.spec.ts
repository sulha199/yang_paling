import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { GlobalSearchComponent } from './global-search.component';
import { MaterialModule } from 'src/app/modules/material.module';
import { FormsModule } from '@angular/forms';
import { NgxsModule, Store } from '@ngxs/store';
import { GlobalSearchState } from 'src/app/ngxs/states/globalSearch.State';
import { SearchStart } from 'src/app/ngxs/actions/globalSearch.actions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

fdescribe('GlobalSearchComponent', () => {
  let component: GlobalSearchComponent;
  let fixture: ComponentFixture<GlobalSearchComponent>;
  let store: Store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalSearchComponent ],
      imports: [
        MaterialModule,
        FormsModule,
        NgxsModule.forRoot([GlobalSearchState]),
        BrowserAnimationsModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.get(Store);
    spyOn(store, 'dispatch');
  });

  it('should dispatch Start Search on Search', fakeAsync(() => {
    spyOn(component, 'search').and.callThrough();

    component.searchValue = 'x';
    component.iconRef.nativeElement.click();
    fixture.detectChanges();

    expect(component.search).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(new SearchStart({
      text: component.searchValue,
      sortBy: component.sortValue,
    }));
  }));

  it('should show dropdown on input click', fakeAsync(() => {
    component.inputRef.nativeElement.click();
    fixture.detectChanges();

    expect(component.isOptionsVisible$.value).toBe(true);
  }));

  xit('should hide dropdown on input leave', fakeAsync(() => {
    spyOn(component, 'blur').and.callThrough();

    component.searchValue = '';
    component.inputRef.nativeElement.click();
    fixture.detectChanges();
    component.iconRef.nativeElement.click();
    fixture.detectChanges();

    expect(component.blur).toHaveBeenCalled();
    expect(component.isOptionsVisible$.value).toBe(false);
  }));
});
