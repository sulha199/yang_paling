import { GlobalSearchStateModel, DEFAULT_GLOBAL_SEARCH_STATE, GlobalSearchValueModel } from 'src/app/model/globalSearch.model';
import { State, Action, StateContext } from '@ngxs/store';
import { SearchStart, SearchReset, SearchUpdateSortBy, SearchUpdatePriceRange } from '../actions/globalSearch.actions';

@State<GlobalSearchStateModel>({
  name: 'globalSearch',
  defaults: DEFAULT_GLOBAL_SEARCH_STATE
})
export class GlobalSearchState {
  @Action(SearchStart)
  start(ctx: StateContext<GlobalSearchStateModel>, action: SearchStart) {
    ctx.dispatch(new SearchReset());
    ctx.setState({
      ...ctx.getState(),
      searchValue: { ...DEFAULT_GLOBAL_SEARCH_STATE.searchValue, ...action.searchValue}
    });
  }

  @Action(SearchReset)
  reset(ctx: StateContext<GlobalSearchStateModel>, action: SearchReset) {
    ctx.setState(DEFAULT_GLOBAL_SEARCH_STATE);
  }

  @Action(SearchUpdateSortBy)
  updateSortBy(ctx: StateContext<GlobalSearchStateModel>, action: SearchUpdateSortBy) {
    const searchValue: GlobalSearchValueModel = { ...ctx.getState().searchValue, sortBy: action.sortBy };
    ctx.dispatch(new SearchStart(searchValue));
  }

  @Action(SearchUpdatePriceRange)
  updatePriceRange(ctx: StateContext<GlobalSearchStateModel>, action: SearchUpdatePriceRange) {
    const searchValue: GlobalSearchValueModel = { ...ctx.getState().searchValue, priceMin: action.priceMin, priceMax: action.priceMax };
    ctx.dispatch(new SearchStart(searchValue));
  }
}
