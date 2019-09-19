import { MarketplaceService } from './../../services/marketplace/marketplace.service';
// tslint:disable-next-line:max-line-length
import { ProductSearchStateModel, DEFAULT_PRODUCT_SEARCH_STATE, ProductSearchParamsModel, ProductSearchResultModel, ProductSearchFilter } from 'src/app/core/model/marketplace/productSearch.model';
import { State, Action, StateContext, Selector } from '@ngxs/store';
// tslint:disable-next-line:max-line-length
import { SearchStart, SearchReset, SearchUpdateSortBy, SearchUpdatePriceRange, SearchUpdateFilterMarketPlace } from '../actions/productSearch.actions';
import { forkJoin, Observable, pipe } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { routesList } from 'src/app/app-routing.module';
import { MarketPlaceModel } from '../../model/marketplace';

@State<ProductSearchStateModel>({
  name: 'productSearch',
  defaults: DEFAULT_PRODUCT_SEARCH_STATE
})
export class ProductSearchState {
  constructor(
    private marketplaceService: MarketplaceService,
    private router: Router
  ) {}

  @Selector()
  static marketplaces(state: ProductSearchStateModel): MarketPlaceModel[] {
    return state.marketplace;
  }

  ngxsOnInit(ctx: StateContext<ProductSearchStateModel>) {
    const marketplaceWithProductSearch = this.marketplaceService.members.filter(marketplace => !!marketplace.productSearch);
    const state: ProductSearchStateModel = {
      ...DEFAULT_PRODUCT_SEARCH_STATE,
      marketplace: marketplaceWithProductSearch,
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
    const state  = {
      ...ctx.getState(),
      searchValue: { ...DEFAULT_PRODUCT_SEARCH_STATE.searchValue, ...action.searchValue}
    };
    ctx.setState(state);
    this.router.navigate([routesList.productSearch]);
    this.performSearch(state).pipe(
      map((results) => results.reduce((all: ProductSearchResultModel[], result) => all.concat(result))),
      take(1)
    ).subscribe(all => {
      ctx.setState({
        ...state,
        results: all,
        showedResults: this.filterResults(state.filter, all)
      });
    });
  }

  @Action(SearchReset)
  reset(ctx: StateContext<ProductSearchStateModel>, action: SearchReset) {
    ctx.setState({
      ...ctx.getState(),
      results: [],
      showedResults: [],
    });
  }

  @Action(SearchUpdateSortBy)
  updateSortBy(ctx: StateContext<ProductSearchStateModel>, action: SearchUpdateSortBy) {
    const searchValue: ProductSearchParamsModel = { ...ctx.getState().searchValue, sortBy: action.sortBy };
    ctx.dispatch(new SearchStart(searchValue));
  }

  @Action(SearchUpdatePriceRange)
  updatePriceRange(ctx: StateContext<ProductSearchStateModel>, action: SearchUpdatePriceRange) {
    const searchValue: ProductSearchParamsModel = { ...ctx.getState().searchValue, priceMin: action.priceMin, priceMax: action.priceMax };
    ctx.dispatch(new SearchStart(searchValue));
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

  performSearch(state: ProductSearchStateModel): Observable<ProductSearchResultModel[][]> {
    const results$ = state.marketplace.map(
      marketplace => marketplace.productSearch.productSearch(state.searchValue).pipe(
        map(results => results.map(result => ({ ...result, origin: marketplace.basicInfo.name} as ProductSearchResultModel)))
      )
    );
    return forkJoin(results$);
  }

  filterResults(filter: ProductSearchFilter, rows: ProductSearchResultModel[]) {
    return rows.filter(row => filter.marketplaces[row.origin]);
  }
}
