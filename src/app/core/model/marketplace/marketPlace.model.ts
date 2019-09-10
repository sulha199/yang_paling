import { ProductSearchClassModel } from './productSearch.model';

export interface MarketPlaceModel {
  readonly name: string;
  readonly shortName: string;
  readonly logo: string;
  readonly productSearch?: ProductSearchClassModel;
  readonly mainColor: string;
}
