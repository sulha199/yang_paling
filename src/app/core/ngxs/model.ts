import { ProductSearchStateModel } from '../model/marketplace/productSearch.model';
import { DisplayModeModel } from '../model/displayMode.model';
import { IframePageModel } from '../model/iframePage.model';

export enum AppStatesType {
  productSearch = 'productSearch',
  iframePage = 'iframePage',
  displayMode = 'displayMode'
}

export interface AppState {
  [AppStatesType.productSearch]: ProductSearchStateModel;
  [AppStatesType.displayMode]: DisplayModeModel;
  [AppStatesType.iframePage]: IframePageModel;
}
