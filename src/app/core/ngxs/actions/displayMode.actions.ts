import { DisplayModeModel } from 'src/app/core/model/displayMode.model';

export class SwitchDisplayMode {
  static readonly type = '[Display Mode] switch';
  constructor(public mode: DisplayModeModel) {}
}
