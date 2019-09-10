import { DisplayModeModel, DISPLAY_MODE_NORMAL } from 'src/app/model/displayMode.model';
import { State, Action, StateContext } from '@ngxs/store';
import { SwitchDisplayMode } from '../actions/displayMode.actions';

@State<DisplayModeModel>({
  name: 'displayMode',
  defaults: DISPLAY_MODE_NORMAL
})
export class DisplayModeState {
  @Action(SwitchDisplayMode)
  switchMode(ctx: StateContext<DisplayModeModel>, action: SwitchDisplayMode) {
    ctx.setState({ ...action.mode });
  }
}
