import { ProductSearchResultModel } from './productSearch.model';
import { map, tap } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { MarketPlaceModel } from './marketPlace.model';

export interface ProductSearchFilter {
  marketplaces: Record<string, boolean>;
}

export interface ProductSearchStateModel {
  searchValue: ProductSearchParamsModel;
  results: ProductSearchResultModel[];
  showedResults: ProductSearchResultModel[];
  sourceStates: boolean[];
  marketplace: MarketPlaceModel[];
  filter: ProductSearchFilter;
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
  thumbnail: string;
  sellerName: string;
  location: string;
  price: number;
  productUrl: string;
  origin?: string;
}

export abstract class ProductSearchClassModel<T> {
  isProcessing$ = new BehaviorSubject(false);

  constructor(
    protected http: HttpClient
  ) {}

  abstract buildRequestUrl(searchValue: ProductSearchParamsModel): { url: string; params: HttpParams };
  abstract parseProductSearchResult(apiResponse: T): ProductSearchResultModel[];

  sendRequest(url: string, params: HttpParams) {
    return this.http.get<T>(url, { params});
  }

  productSearch(searchValue: ProductSearchParamsModel): Observable<ProductSearchResultModel[]> {
    this.isProcessing$.next(true);
    const { url, params} = this.buildRequestUrl(searchValue);
    return this.sendRequest(url, params).pipe(
      map(response => this.parseProductSearchResult(response)),
      tap(() => this.isProcessing$.next(false))
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
  results: [],
} as ProductSearchStateModel;

