import { MarketplaceService } from './../../services/marketplace/marketplace.service';
import { ProductSearchState } from 'src/app/core/ngxs/states/productSearch.State';
import { SearchStart, SearchUpdateFilterMarketPlace, SearchReset, SearchNextPage } from './../actions/productSearch.actions';
import { ProductSearchParamsModel, SortBy } from 'src/app/core/model/marketplace/productSearch.model';
// tslint:disable-next-line:max-line-length
import { ProductSearchResultModel, ProductSearchStateModel, DEFAULT_PRODUCT_SEARCH_STATE } from './../../model/marketplace/productSearch.model';
import { BUKALAPAK_INFO } from './../../model/marketplace/bukalapak.model';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MarketPlaceModel } from '../../model/marketplace';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';
import { StaticSymbolResolver } from '@angular/compiler';
import { filter, take, skip } from 'rxjs/operators';

const mockSearchResult: ProductSearchResultModel[] = [
  {
    location: 'jkt',
    origin: 'Bukalapak',
    price: 10,
    productUrl: '',
    rating: 90,
    sellerName: 'seller',
    thumbnail: '',
    title: 'product'
  },
  {
    location: 'jkt',
    origin: 'Bukalapak',
    price: 11,
    productUrl: '',
    rating: 91,
    sellerName: 'seller',
    thumbnail: '',
    title: 'product'
  }
];
const mockSearchResult2: ProductSearchResultModel[] = [
  {
    location: 'jkt',
    origin: 'Bukalapak',
    price: 13,
    productUrl: '',
    rating: 91,
    sellerName: 'seller',
    thumbnail: '',
    title: 'product'
  }
];
const mockProductSearchMembers = [{
  basicInfo: BUKALAPAK_INFO,
  productSearch: {
    productSearch: (val: ProductSearchParamsModel) =>
      of(sortResults(val.sortBy, val.pageNumber === 0 ? mockSearchResult : mockSearchResult2))
  }
}];
const mockSearchParam: ProductSearchParamsModel = {
  sortBy: SortBy.priceAsc,
  text: 'a',
  perPage: 2,
};

describe('Product Search State', () => {
  let store: Store;
  let router: Router;
  let productSearchState: ProductSearchState;
  let marketplaceService: MarketplaceService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        {
          provide: MarketplaceService,
          useValue: { productSearchMembers: mockProductSearchMembers }
        },
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') }
        }
      ],
      imports: [
        NgxsModule.forRoot([ ProductSearchState ])
      ]
    }).compileComponents();
    router = TestBed.get(Router);
    store = TestBed.get(Store);
    marketplaceService = TestBed.get(MarketplaceService);
    productSearchState = new ProductSearchState(TestBed.get(MarketplaceService), router, store);
  });

  it('should load default state and filter on init', () => {
    const currentState = store.selectSnapshot((state: { productSearch: ProductSearchStateModel}) => state.productSearch);
    expect(currentState).toEqual({
      ...DEFAULT_PRODUCT_SEARCH_STATE,
      filter: { marketplaces: {[BUKALAPAK_INFO.name]: true}},
    });
  });

  it('should reset state', () => {
    store.dispatch(new SearchReset());
    const currentState = store.selectSnapshot((state: { productSearch: ProductSearchStateModel}) => state.productSearch);
    expect(currentState).toEqual({
      ...DEFAULT_PRODUCT_SEARCH_STATE,
      filter: { marketplaces: {[BUKALAPAK_INFO.name]: true}},
      results: [],
      showedResults: [],
    });
  });

  it('should start search and assign resultMap', ((done) => {
    store.dispatch(new SearchStart({ ...mockSearchParam, sortBy: SortBy.priceAsc}));
    setTimeout(() => {
      const currentState = store.selectSnapshot((state: { productSearch: ProductSearchStateModel}) => state.productSearch);
      const resultMap = {[BUKALAPAK_INFO.name]: [mockSearchResult ]};
      expect(currentState.resultMap).toEqual(resultMap);
      done();
    });
  }));

  it('should search and sort by price asc', ((done) => {
    const sortedResult = sortResults(SortBy.priceAsc, mockSearchResult);
    store.dispatch(new SearchStart({ ...mockSearchParam, sortBy: SortBy.priceAsc}));
    store.select<ProductSearchStateModel>(state => state.productSearch).pipe(
      filter(searchState => searchState.status === 'normal')
    ).subscribe(currentState => {
      expect(currentState.results).toEqual(sortedResult);
      expect(currentState.showedResults).toEqual(sortedResult);
      done();
    });
  }));

  it('should search and sort by price desc', ((done) => {
    const sortedResult = sortResults(SortBy.priceDesc, mockSearchResult);
    store.dispatch(new SearchStart({ ...mockSearchParam, sortBy: SortBy.priceDesc}));
    store.select<ProductSearchStateModel>(state => state.productSearch).pipe(
      filter(searchState => searchState.status === 'normal')
    ).subscribe(currentState => {
      expect(currentState.results).toEqual(sortedResult);
      expect(currentState.showedResults).toEqual(sortedResult);
      done();
    });
  }));

  it('should search and sort by price rating', ((done) => {
    const sortedResult = sortResults(SortBy.rating, mockSearchResult);
    store.dispatch(new SearchStart({ ...mockSearchParam, sortBy: SortBy.rating}));
    store.select<ProductSearchStateModel>(state => state.productSearch).pipe(
      filter(searchState => searchState.status === 'normal')
    ).subscribe(currentState => {
      expect(currentState.results).toEqual(sortedResult);
      expect(currentState.showedResults).toEqual(sortedResult);
      done();
    });
  }));

  it('should search and filter by marketplace', ((done) => {
    store.dispatch(new SearchStart({ ...mockSearchParam, sortBy: SortBy.priceAsc}));
    // load 1st page and dispatch filter when complete
    store.select<ProductSearchStateModel>(state => state.productSearch).pipe(
      filter(searchState => searchState.status === 'normal'),
      take(1)
    ).subscribe(() => {
      store.dispatch(new SearchUpdateFilterMarketPlace({[BUKALAPAK_INFO.name]: false}));
    });
    // assert the filtered result
    store.select<ProductSearchStateModel>(state => state.productSearch).pipe(
      filter(searchState => searchState.status === 'no-result'),
    ).subscribe(currentState => {
      expect(currentState.results.length).toBe(0);
      expect(currentState.showedResults.length).toBe(0);
      done();
    });
  }));

  it('should load next page order by price asc', (done) => {
    const sortedResult = sortResults(SortBy.priceAsc, mockSearchResult.concat(mockSearchResult2));
    // load first page, when complete the dispatch next page
    store.dispatch(new SearchStart({ ...mockSearchParam, sortBy: SortBy.priceAsc}));
    store.select<ProductSearchStateModel>(state => state.productSearch).pipe(
      filter(searchState => searchState.status === 'normal')
    ).subscribe(currentState => store.dispatch(new SearchNextPage()));
    // assert 2nd page result
    store.select<ProductSearchStateModel>(state => state.productSearch).pipe(
      filter(searchState => searchState.status === 'end-of-result')
    ).subscribe(currentState => {
      expect(currentState.results).toEqual(sortedResult);
      expect(currentState.showedResults).toEqual(sortedResult);
      done();
    });

  });

});

function sortResults(sortBy: SortBy, rows: ProductSearchResultModel[]): ProductSearchResultModel[] {
  switch (sortBy) {
    case SortBy.priceAsc:
      return rows.sort((a, b) => a.price - b.price);
    case SortBy.priceDesc:
      return rows.sort((a, b) => b.price - a.price);
    case SortBy.rating:
          return rows.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    default:
      return rows;
  }
}
