import { ProductSearchParamsModel, SortBy, DEFAULT_PRODUCT_SEARCH_STATE } from 'src/app/core/model/marketplace/productSearch.model';

export class SearchStart {
  static readonly type = '[Product Search] start';
  constructor(public searchValue: ProductSearchParamsModel) {
    this.searchValue = { ...DEFAULT_PRODUCT_SEARCH_STATE.searchValue, ...searchValue };
  }
}

export class SearchNextPage {
  static readonly type = '[Product Search] next page';
  constructor() {}
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

export class SearchUpdateFilterMarketPlace {
  static readonly type = '[Product Search] update filter marketplace';
  constructor(public records: Record<string, boolean>) {}
}
