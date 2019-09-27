import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { GlobalSearchComponent } from './global-search.component';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { FormsModule } from '@angular/forms';
import { NgxsModule, Store } from '@ngxs/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchStart } from '../../ngxs/actions/productSearch.actions';
import { ProductSearchState } from '../../ngxs/states/productSearch.State';

describe('GlobalSearchComponent', () => {
  let component: GlobalSearchComponent;
  let fixture: ComponentFixture<GlobalSearchComponent>;
  let store: Store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalSearchComponent ],
      imports: [
        MaterialModule,
        FormsModule,
        NgxsModule.forRoot(),
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
    spyOn(component, 'focus').and.callThrough();
    component.isOptionsVisible$.next(false);
    fixture.detectChanges();
    component.inputRef.nativeElement.focus();
    fixture.detectChanges();
    tick(500);

    expect(component.focus).toHaveBeenCalled();
    expect(component.isOptionsVisible$.value).toBe(true);
  }));

  it('should hide dropdown on input leave', fakeAsync(() => {
    spyOn(component, 'blur').and.callThrough();
    component.searchValue = '';
    component.isOptionsVisible$.next(false);
    component.inputRef.nativeElement.focus();
    fixture.detectChanges();

    component.inputRef.nativeElement.blur();
    fixture.detectChanges();
    tick(500);

    expect(component.blur).toHaveBeenCalled();
    expect(component.isOptionsVisible$.value).toBe(false);
  }));
});
