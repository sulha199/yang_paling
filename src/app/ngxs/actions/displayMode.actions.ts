import { DisplayModeModel } from 'src/app/model/displayMode.model';

export class SwitchDisplayMode {
  static readonly type = '[Display Mode] switch';
  constructor(public mode: DisplayModeModel) {}
}
