import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

export interface ProductSearchStateModel {
  searchValue: ProductSearchParamsModel;
  results: ProductSearchResultModel[];
  sourceStates: boolean[];
}

export interface ProductSearchParamsModel {
  text: string;
  sortBy: SortBy;
  priceMin?: number;
  priceMax?: number;
  perPage?: number;
  pageNumber?: number;
}

export interface ProductSearchResultModel {
  title: string;
}

export abstract class ProductSearchClassModel {
  abstract buildRequestUrl(searchValue: ProductSearchParamsModel): string;
  abstract parseProductSearchResult<T>(apiResponse: T): ProductSearchResultModel[];

  constructor(
    private http: HttpClient
  ) {}

  productSearch<T>(searchValue: ProductSearchParamsModel) {
    return this.http.get<T>(this.buildRequestUrl(searchValue)).pipe(
      map(response => this.parseProductSearchResult(response))
    );
  }
}

export enum SortBy {
  priceAsc = 'price-asc',
  priceDesc = 'price-desc',
  newest = 'newest',
  mostSelling = 'most_selling'
}

export const DEFAULT_PRODUCT_SEARCH_STATE = {
  searchValue: {
    text: '',
    sortBy: SortBy.priceAsc,
    pageNumber: 0,
    perPage: 20,
    priceMin: 0,
    priceMax: 9999999999
  },
  results: []
} as ProductSearchStateModel;

