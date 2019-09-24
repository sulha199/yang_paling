import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatSelect } from '@angular/material';
import { Store } from '@ngxs/store';
import { SearchStart } from 'src/app/core/ngxs/actions/productSearch.actions';
import { SortBy } from 'src/app/core/model/marketplace/productSearch.model';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GlobalSearchComponent implements OnInit {
  @ViewChild('icon', {static: true, read: ElementRef}) iconRef: ElementRef<HTMLElement>;
  @ViewChild('input', {static: true, read: ElementRef}) inputRef: ElementRef<HTMLElement>;

  searchValue = '';
  sortOptions: Array<{key: SortBy, label: string}> = [
    { key: SortBy.priceAsc, label: 'murah'},
    { key: SortBy.priceDesc, label: 'mahal'},
    // { key: SortBy.mostSelling, label: 'laris'},
    // { key: SortBy.newest, label: 'baru'}
    { key: SortBy.rating, label: 'bagus reviewnya'}
  ];
  sortValue = this.sortOptions[0].key;

  isOptionsVisible$ = new BehaviorSubject(false);

  constructor(
    private store: Store,
  ) { }

  ngOnInit() {
  }

  focus() {
    this.isOptionsVisible$.next(true);
  }

  blur() {
    this.isOptionsVisible$.next(this.searchValue !== '');
  }

  search() {
    if (this.searchValue !== '') {
      this.store.dispatch(new SearchStart({
        text: this.searchValue,
        sortBy: this.sortValue,
      }));
    }
  }

}
