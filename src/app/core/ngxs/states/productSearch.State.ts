import { Observable } from 'rxjs/index';
import { MarketplaceService } from './../../services/marketplace/marketplace.service';
// tslint:disable-next-line:max-line-length
import { ProductSearchStateModel, DEFAULT_PRODUCT_SEARCH_STATE, ProductSearchParamsModel, ProductSearchResultModel, ProductSearchFilter, SortBy } from 'src/app/core/model/marketplace/productSearch.model';
import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
// tslint:disable-next-line:max-line-length
import { SearchStart, SearchReset, SearchUpdateSortBy, SearchUpdatePriceRange, SearchUpdateFilterMarketPlace, SearchNextPage } from '../actions/productSearch.actions';
import { map, take, shareReplay, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AppRoutesList } from 'src/app/app-routing.module';
import { forkJoin } from 'rxjs';
import { AppStatesType, AppState } from '../model';
const combinePagination = require('combine-pagination').default;

@State<ProductSearchStateModel>({
  name: AppStatesType.productSearch,
  defaults: DEFAULT_PRODUCT_SEARCH_STATE
})
export class ProductSearchState {
  readonly sortingMap: Record<string, { sortKey: 'price' | 'rating', sortDirection: 'asc' | 'desc' }> = {
    [SortBy.priceAsc]: { sortKey: 'price', sortDirection: 'asc' },
    [SortBy.priceDesc]: { sortKey: 'price', sortDirection: 'desc'},
    [SortBy.rating]: { sortKey: 'rating', sortDirection: 'desc' }
  };
  // sortingCallbacks: Record<string, any> = {
  //   [SortBy.priceAsc]: (a: ProductSearchResultModel, b: ProductSearchResultModel) => a.price - b.price,
  //   [SortBy.priceDesc]: (a: ProductSearchResultModel, b: ProductSearchResultModel) => b.price - a.price,
  //   [SortBy.rating]: (a: ProductSearchResultModel, b: ProductSearchResultModel) => b.rating - a.rating,
  // };
  paginationCombiner: any;

  constructor(
    private marketplaceService: MarketplaceService,
    private router: Router,
    private store: Store,
  ) {}

  ngxsOnInit(ctx: StateContext<ProductSearchStateModel>) {
    const marketplaceWithProductSearch = this.marketplaceService.productSearchMembers;
    const state: ProductSearchStateModel = {
      ...DEFAULT_PRODUCT_SEARCH_STATE,
      filter: {
        marketplaces: marketplaceWithProductSearch.reduce((obj, marketplace) => {
          obj[marketplace.basicInfo.name] = true;
          return obj;
        }, {})
      }
    };
    ctx.setState(state);
  }

  @Action(SearchStart)
  start(ctx: StateContext<ProductSearchStateModel>, action: SearchStart) {
    this.reset(ctx);
    this.router.navigate([AppRoutesList.productSearch]);
    const state: ProductSearchStateModel = {
      ...ctx.getState(),
      searchValue: action.searchValue,
      status: 'requesting',
    };
    ctx.setState(state);
    const searchMap = this.createSearchObservables(state);
    forkJoin(Object.keys(searchMap).map(marketplaceName => searchMap[marketplaceName].pipe(
      tap(rows => {
        if (!!rows[0]) {
          state.resultMap[marketplaceName] = [ rows ];
          state.status = 'receiving';
          ctx.setState(state);
        }
      })
    ))).subscribe(rows => {
      this.paginationCombiner = this.createPaginationCombiner(this.store, state.searchValue);
      this.loadPaginationCombiner(ctx);
    });
  }

  @Action(SearchReset)
  reset(ctx: StateContext<ProductSearchStateModel>) {
    ctx.setState({
      ...ctx.getState(),
      results: [],
      resultMap: {},
      showedResults: [],
      status: 'normal',
    });
  }

  @Action(SearchUpdateFilterMarketPlace)
  updateFilterMarketPlace(ctx: StateContext<ProductSearchStateModel>, action: SearchUpdateFilterMarketPlace) {
    let state = ctx.getState();
    const filter: ProductSearchFilter = { ...state.filter, marketplaces: action.records };
    this.paginationCombiner = this.createPaginationCombiner(this.store, state.searchValue);
    state = {
      ...state,
      status: 'receiving',
      searchValue: { ...state.searchValue, pageNumber: 0},
      filter,
      showedResults: [],
      results: [],
    };
    ctx.setState(state);
    this.loadPaginationCombiner(ctx);
  }

  @Action(SearchNextPage)
  nextPage(ctx: StateContext<ProductSearchStateModel>) {
    const state = ctx.getState();
    state.searchValue.pageNumber++;
    state.status = 'requesting';
    ctx.setState(state);
    if (Object.values(state.resultMap).every(maps => maps[state.searchValue.pageNumber])) {
      return this.loadPaginationCombiner(ctx);
    }
    const searchMap = this.createSearchObservables(state);
    forkJoin(Object.keys(searchMap).map(marketplaceName => searchMap[marketplaceName].pipe(
      tap(rows => {
        if (!!rows[0]) {
          state.resultMap[rows[0].origin][state.searchValue.pageNumber] = rows;
          state.status = 'receiving';
          ctx.setState(state);
        }
      })
    ))).subscribe(() => {
      this.loadPaginationCombiner(ctx);
    });
  }

  // @Action(SearchUpdateSortBy)
  // updateSortBy(ctx: StateContext<ProductSearchStateModel>, action: SearchUpdateSortBy) {
  //   const searchValue: ProductSearchParamsModel = { ...ctx.getState().searchValue, sortBy: action.sortBy };
  //   ctx.dispatch(new SearchStart(searchValue));
  // }

  // @Action(SearchUpdatePriceRange)
  // updatePriceRange(ctx: StateContext<ProductSearchStateModel>, action: SearchUpdatePriceRange) {
  //   const searchValue: ProductSearchParamsModel = {
  //     ...ctx.getState().searchValue,
  //     priceMin: action.priceMin,
  //     priceMax: action.priceMax
  //   };
  //   ctx.dispatch(new SearchStart(searchValue));
  // }

  createSearchObservables(state: ProductSearchStateModel): Record<string, Observable<ProductSearchResultModel[]>> {
    const resultMap = {};
    this.marketplaceService.productSearchMembers.forEach(marketplace => {
      if (state.searchValue.pageNumber === 0 || this.isPreviousResultMapFull(marketplace.basicInfo.name, state)) {
        resultMap[marketplace.basicInfo.name] = marketplace.productSearch.productSearch(state.searchValue).pipe(
          map(results => results.map(result => ({ ...result, origin: marketplace.basicInfo.name} as ProductSearchResultModel))),
          shareReplay(1)
        );
      }
    });
    return resultMap;
  }

  filterResults(filter: ProductSearchFilter, rows: ProductSearchResultModel[]) {
    return rows.filter(row => filter.marketplaces[row.origin]);
  }

  createPaginationCombiner(store: Store, params: ProductSearchParamsModel) {
    const currentState = store.selectSnapshot((state: AppState) => state.productSearch);
    const sorting = this.sortingMap[params.sortBy];
    const getters = Object.keys(currentState.resultMap).map(marketplaceName => {
      return (page: number) => {
        const callbackState = store.selectSnapshot((state: AppState) => state.productSearch);
        return callbackState.filter.marketplaces[marketplaceName] ? callbackState.resultMap[marketplaceName][page] : [];
      };
    });
    return combinePagination({
      getters,
      sort: false, // not use manual sorting
      sortKey: sorting.sortKey,
      sortDirection: sorting.sortDirection
    });
  }


  loadPaginationCombiner(ctx: StateContext<ProductSearchStateModel>) {
    this.paginationCombiner.getNext().then((rows: ProductSearchResultModel[]) => {
      const state = ctx.getState();
      const results = state.results.concat(rows);
      state.status = rows.length === 0
        ? 'no-result'
        : Object.values(state.resultMap).every(
            marketResult => marketResult[state.searchValue.pageNumber].length < state.searchValue.perPage
          )
            ? 'end-of-result' : 'normal';
      ctx.patchState({
        results,
        showedResults: this.filterResults(state.filter, results),
        status: state.status,
      });
    });
  }

  isPreviousResultMapFull(marketplaceName: string, state: ProductSearchStateModel): boolean {
    return !!state.resultMap[marketplaceName]
      && !!state.resultMap[marketplaceName][state.searchValue.pageNumber - 1]
      && state.resultMap[marketplaceName][state.searchValue.pageNumber - 1].length === state.searchValue.perPage;
  }
}
