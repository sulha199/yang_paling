import { MarketplaceService } from './../../services/marketplace/marketplace.service';
import { ProductSearchState } from 'src/app/core/ngxs/states/productSearch.State';
import { SearchStart, SearchUpdateFilterMarketPlace, SearchReset } from './../actions/productSearch.actions';
import { ProductSearchParamsModel, SortBy } from 'src/app/core/model/marketplace/productSearch.model';
// tslint:disable-next-line:max-line-length
import { ProductSearchResultModel, ProductSearchStateModel, DEFAULT_PRODUCT_SEARCH_STATE } from './../../model/marketplace/productSearch.model';
import { BUKALAPAK_INFO } from './../../model/marketplace/bukalapak.model';
import { TestBed } from '@angular/core/testing';
import { MarketPlaceModel } from '../../model/marketplace';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';

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
const mockProductSearchMembers = [ {
 basicInfo: BUKALAPAK_INFO,
 productSearch: { productSearch: jasmine.createSpy('productSearch').and.returnValue(of(mockSearchResult)) }
} ];
const mockSearchParam: ProductSearchParamsModel = {
  sortBy: SortBy.priceAsc,
  text: 'a'
};

describe('Product Search State', () => {
  let store: Store;
  let router: Router;
  let productSearchState: ProductSearchState;

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
    productSearchState = new ProductSearchState(TestBed.get(MarketplaceService), router);
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

  it('should search and sort by price asc', () => {
    store.dispatch(new SearchStart({ ...mockSearchParam, sortBy: SortBy.priceAsc}));
    const currentState = store.selectSnapshot((state: { productSearch: ProductSearchStateModel}) => state.productSearch);
    const sortedResult = productSearchState.sortResults(SortBy.priceAsc, mockSearchResult);
    expect(currentState.results).toEqual(sortedResult);
    expect(currentState.showedResults).toEqual(sortedResult);
  });

  it('should search and sort by price desc', () => {
    store.dispatch(new SearchStart({ ...mockSearchParam, sortBy: SortBy.priceDesc}));
    const currentState = store.selectSnapshot((state: { productSearch: ProductSearchStateModel}) => state.productSearch);
    const sortedResult = productSearchState.sortResults(SortBy.priceDesc, mockSearchResult);
    expect(currentState.results).toEqual(sortedResult);
    expect(currentState.showedResults).toEqual(sortedResult);
  });

  it('should search and sort by rating desc', () => {
    store.dispatch(new SearchStart({ ...mockSearchParam, sortBy: SortBy.rating}));
    const currentState = store.selectSnapshot((state: { productSearch: ProductSearchStateModel}) => state.productSearch);
    const sortedResult = productSearchState.sortResults(SortBy.rating, mockSearchResult);
    expect(currentState.results).toEqual(sortedResult);
    expect(currentState.showedResults).toEqual(sortedResult);
  });

  it('should search and filter by marketplace', () => {
    store.dispatch(new SearchStart({ ...mockSearchParam, sortBy: SortBy.priceAsc}));
    store.dispatch(new SearchUpdateFilterMarketPlace({[BUKALAPAK_INFO.name]: false}));
    const sortedResult = productSearchState.sortResults(SortBy.priceAsc, mockSearchResult);
    const currentState = store.selectSnapshot((state: { productSearch: ProductSearchStateModel}) => state.productSearch);
    expect(currentState.results).toEqual(sortedResult);
    expect(currentState.showedResults).toEqual([]);
  });

});
