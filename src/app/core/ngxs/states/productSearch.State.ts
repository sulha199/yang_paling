import { MarketplaceService } from './../../services/marketplace/marketplace.service';
// tslint:disable-next-line:max-line-length
import { ProductSearchStateModel, DEFAULT_PRODUCT_SEARCH_STATE, ProductSearchParamsModel, ProductSearchResultModel, ProductSearchFilter, SortBy } from 'src/app/core/model/marketplace/productSearch.model';
import { State, Action, StateContext, Selector } from '@ngxs/store';
// tslint:disable-next-line:max-line-length
import { SearchStart, SearchReset, SearchUpdateSortBy, SearchUpdatePriceRange, SearchUpdateFilterMarketPlace } from '../actions/productSearch.actions';
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
    const state  = {
      ...ctx.getState(),
      searchValue: { ...DEFAULT_PRODUCT_SEARCH_STATE.searchValue, ...action.searchValue},
      result: [],
      showedResults: []
    };
    ctx.setState(state);
    this.router.navigate([routesList.productSearch]);
    let results: ProductSearchResultModel[] = [];
    this.createSearchObservables(state).map(search => search.subscribe(result => {
      results = results.concat(result);
      this.sortResults(state.searchValue.sortBy, results);
      ctx.setState({
        ...state,
        results,
        showedResults: this.filterResults(state.filter, results)
      });
    }));
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

  createSearchObservables(state: ProductSearchStateModel) {
    const results$ = this.marketplaceService.productSearchMembers.map(
      marketplace => marketplace.productSearch.productSearch(state.searchValue).pipe(
        map(results => results.map(result => ({ ...result, origin: marketplace.basicInfo.name} as ProductSearchResultModel)))
      )
    );
    return results$;
  }

  filterResults(filter: ProductSearchFilter, rows: ProductSearchResultModel[]) {
    return rows.filter(row => filter.marketplaces[row.origin]);
  }

  sortResults(sortBy: SortBy, rows: ProductSearchResultModel[]) {
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
}
