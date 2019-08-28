import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SortBy, GlobalSearchValueModel } from 'src/app/model/globalSearch.model';
import { MatSelect } from '@angular/material';
import { Store } from '@ngxs/store';
import { SearchStart } from 'src/app/ngxs/actions/globalSearch.actions';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GlobalSearchComponent implements OnInit {
  searchValue = '';
  sortOptions: Array<{key: SortBy, label: string}> = [
    { key: SortBy.price_asc, label: 'murah'},
    { key: SortBy.price_desc, label: 'mahal'},
    { key: SortBy.most_selling, label: 'laris'},
    { key: SortBy.newest, label: 'baru'}
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
