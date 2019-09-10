import { ProductSearchStateModel, DEFAULT_PRODUCT_SEARCH_STATE, ProductSearchParamsModel } from 'src/app/model/marketplace/productSearch.model';
import { State, Action, StateContext } from '@ngxs/store';
import { SearchStart, SearchReset, SearchUpdateSortBy, SearchUpdatePriceRange } from '../actions/productSearch.actions';

@State<ProductSearchStateModel>({
  name: 'productSearch',
  defaults: DEFAULT_PRODUCT_SEARCH_STATE
})
export class ProductSearchState {
  @Action(SearchStart)
  start(ctx: StateContext<ProductSearchStateModel>, action: SearchStart) {
    ctx.dispatch(new SearchReset());
    ctx.setState({
      ...ctx.getState(),
      searchValue: { ...DEFAULT_PRODUCT_SEARCH_STATE.searchValue, ...action.searchValue}
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
}
