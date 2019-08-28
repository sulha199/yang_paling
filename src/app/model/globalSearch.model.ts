export interface GlobalSearchStateModel {
  searchValue: GlobalSearchValueModel;
  results: GlobalSearchResultModel[];
  sourceStates: boolean[];
}

export interface GlobalSearchValueModel {
  text: string;
  sortBy: SortBy;
  priceMin?: number;
  priceMax?: number;
  per_page?: number;
  page_number?: number;
}

export interface GlobalSearchResultModel {
  title: string;
}

export enum SortBy {
  price_asc = 'price-asc',
  price_desc = 'price-desc',
  newest = 'newest',
  most_selling = 'most_selling'
}

export const DEFAULT_GLOBAL_SEARCH_STATE = {
  searchValue: {
    text: '',
    sortBy: SortBy.price_asc,
    page_number: 0,
    per_page: 20,
    priceMin: 0,
    priceMax: 9999999999
  },
  results: []
} as GlobalSearchStateModel;
