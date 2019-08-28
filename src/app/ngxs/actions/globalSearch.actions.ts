import { GlobalSearchValueModel, SortBy } from 'src/app/model/globalSearch.model';

export class SearchStart {
  static readonly type = '[Global Search] start';
  constructor(public searchValue: GlobalSearchValueModel) {}
}

export class SearchReset {
  static readonly type = '[Global Search] reset';
  constructor() {}
}

export class SearchUpdateSortBy {
  static readonly type = '[Global Search] update sortBy';
  constructor(public sortBy: SortBy) {}
}

export class SearchUpdatePriceRange {
  static readonly type = '[Global Search] update price range';
  constructor(public priceMin: number, public priceMax: number) {}
}
