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
import { stat } from 'fs';
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
    const state: ProductSearchStateModel = { ...ctx.getState(), searchValue: action.searchValue};
    forkJoin(this.createSearchObservables(state).map(search => search.pipe(
      tap(rows => {
        if (!!rows[0]) {
          state.resultMap[rows[0].origin] = [ rows ];
          ctx.setState(state);
        }
      })
    ))).subscribe(arrayOfRows => {
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
    });
  }

  @Action(SearchUpdateFilterMarketPlace)
  updateFilterMarketPlace(ctx: StateContext<ProductSearchStateModel>, action: SearchUpdateFilterMarketPlace) {
    const state = ctx.getState();
    const filter: ProductSearchFilter = { ...state.filter, marketplaces: action.records };
    ctx.setState({
      ...state,
      filter,
      showedResults: this.filterResults(filter, state.results)
    });
  }

  @Action(SearchNextPage)
  nextPage(ctx: StateContext<ProductSearchStateModel>) {
    const state = ctx.getState();
    state.searchValue.pageNumber++;
    forkJoin(this.createSearchObservables(state).map(search => search.pipe(
      tap(rows => {
        if (!!rows[0]) {
          state.resultMap[rows[0].origin][state.searchValue.pageNumber] = rows;
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

  createSearchObservables(state: ProductSearchStateModel) {
    const results$ = this.marketplaceService.productSearchMembers.map(
      marketplace => marketplace.productSearch.productSearch(state.searchValue).pipe(
        map(results => results.map(result => ({ ...result, origin: marketplace.basicInfo.name} as ProductSearchResultModel))),
        shareReplay(1)
      )
    );
    return results$;
  }

  filterResults(filter: ProductSearchFilter, rows: ProductSearchResultModel[]) {
    return rows.filter(row => filter.marketplaces[row.origin]);
  }

  sortResults(sortBy: SortBy, rows: ProductSearchResultModel[]): ProductSearchResultModel[] {
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

  createPaginationCombiner(store: Store, params: ProductSearchParamsModel) {
    const currentState = store.selectSnapshot((state: AppState) => state.productSearch);
    const sorting = this.sortingMap[params.sortBy];
    const getters = Object.keys(currentState.resultMap).map(marketplaceName => {
      return (page: number) => store.selectSnapshot((state: AppState) => state.productSearch).resultMap[marketplaceName][page];
    });
    return combinePagination({
      getters,
      sortKey: sorting.sortKey,
      sortDirection: sorting.sortDirection
    });
  }


  loadPaginationCombiner(ctx: StateContext<ProductSearchStateModel>) {
    this.paginationCombiner.getNext().then((rows: ProductSearchResultModel[]) => {
      const state = ctx.getState();
      const results = state.results.concat(rows);
      ctx.patchState({
        results,
        showedResults: this.filterResults(state.filter, results),
      });
    });
  }
}
