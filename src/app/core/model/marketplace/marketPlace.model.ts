import { ProductSearchClassModel } from './productSearch.model';

export interface MarketPlaceModel {
  basicInfo: MarketPlaceInfoModel;
  readonly productSearch?: ProductSearchClassModel<any>;
}

export interface MarketPlaceInfoModel {
  readonly name: string;
  readonly shortName: string;
  readonly logo: string;
  readonly mainColor: string;
  readonly currency: string;
}
