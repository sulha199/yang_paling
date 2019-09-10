import { ProductSearchParamsModel, SortBy } from 'src/app/core/model/marketplace/productSearch.model';

export class SearchStart {
  static readonly type = '[Product Search] start';
  constructor(public searchValue: ProductSearchParamsModel) {}
}

export class SearchReset {
  static readonly type = '[Product Search] reset';
  constructor() {}
}

export class SearchUpdateSortBy {
  static readonly type = '[Product Search] update sortBy';
  constructor(public sortBy: SortBy) {}
}

export class SearchUpdatePriceRange {
  static readonly type = '[Product Search] update price range';
  constructor(public priceMin: number, public priceMax: number) {}
}
