import { ProductSearchParamsModel, ProductSearchClassModel } from './productSearch.model';
import { MarketPlaceModel } from './marketPlace.model';
import { HttpClient } from '@angular/common/http';

export class BukalapakProductSearch extends ProductSearchClassModel {

  buildRequestUrl(params: ProductSearchParamsModel) {
    return '';
  }

  parseProductSearchResult<BukalapakProductSearchResponse>(apiResponse: BukalapakProductSearchResponse) {
    return [];
  }
}

export class BukalapakModel implements MarketPlaceModel {
  name = 'Bukalapak';
  shortName = 'BL';
  logo = 'bl.png';
  mainColor = '#ff0000';
  productSearch: ProductSearchClassModel;

  constructor(
    private http: HttpClient
  ) {
    this.productSearch = new BukalapakProductSearch(this.http);
  }
}

export interface BukalapakProductSearchResponse {
  title: string;
}

