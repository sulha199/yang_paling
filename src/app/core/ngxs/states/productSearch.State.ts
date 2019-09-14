import { MarketplaceService } from './../../services/marketplace/marketplace.service';
// tslint:disable-next-line:max-line-length
import { ProductSearchStateModel, DEFAULT_PRODUCT_SEARCH_STATE, ProductSearchParamsModel, ProductSearchResultModel } from 'src/app/core/model/marketplace/productSearch.model';
import { State, Action, StateContext } from '@ngxs/store';
import { SearchStart, SearchReset, SearchUpdateSortBy, SearchUpdatePriceRange } from '../actions/productSearch.actions';
import { forkJoin, Observable, pipe } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { routesList } from 'src/app/app-routing.module';

@State<ProductSearchStateModel>({
  name: 'productSearch',
  defaults: DEFAULT_PRODUCT_SEARCH_STATE
})
export class ProductSearchState {
  constructor(
    private marketplaceService: MarketplaceService,
    private router: Router
  ) {}

  @Action(SearchStart)
  start(ctx: StateContext<ProductSearchStateModel>, action: SearchStart) {
    ctx.dispatch(new SearchReset());
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
        results: all
      });
    });
  }

  @Action(SearchReset)
  reset(ctx: StateContext<ProductSearchStateModel>, action: SearchReset) {
    ctx.setState(DEFAULT_PRODUCT_SEARCH_STATE);
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

  // @Action()
  performSearch(state: ProductSearchStateModel): Observable<ProductSearchResultModel[][]> {
    const results$ = this.marketplaceService.members
      .filter(marketplace => !!marketplace.productSearch)
      .map(
        marketplace => marketplace.productSearch.productSearch(state.searchValue).pipe(
          map(results => results.map(result => ({ ...result, origin: marketplace.name} as ProductSearchResultModel)))
        )
      );
    return forkJoin(results$);
  }
}
