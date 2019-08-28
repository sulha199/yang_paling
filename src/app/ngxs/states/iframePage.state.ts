import { State, Action, StateContext, Selector } from '@ngxs/store';
import { OpenIframe, CloseIframe, ToggleIframe } from '../actions/iframe.actions';
import { SwitchDisplayMode } from '../actions/displayMode.actions';
import { DISPLAY_MODE_NORMAL } from 'src/app/model/displayMode.model';
import { IframePageModel, EMPTY_IFRAME_PAGE } from 'src/app/model/iframePage.model';

@State<IframePageModel>({
  name: 'iframePage',
  defaults: EMPTY_IFRAME_PAGE
})
export class IFramePageState {

  @Selector()
  static isIframeAvailable(state: IframePageModel): boolean {
    return !!state.url && state.url !== '';
  }

  @Selector()
  static isIframeOpen(state: IframePageModel): boolean {
    return !!state.isOpen;
  }

  @Action(OpenIframe)
  openIframe(ctx: StateContext<IframePageModel>, action: OpenIframe) {
    ctx.setState({...ctx.getState(), url: action.url, isOpen: true});
    ctx.dispatch(new SwitchDisplayMode(DISPLAY_MODE_NORMAL));
  }

  @Action(CloseIframe)
  closeIframe(ctx: StateContext<IframePageModel>, action: CloseIframe) {
    ctx.setState({url: null, isOpen: false});
  }

  @Action(ToggleIframe)
  toggleIframe(ctx: StateContext<IframePageModel>, action: ToggleIframe) {
    const state = ctx.getState();
    ctx.setState({ ...state, isOpen: !state.isOpen});
  }
}
