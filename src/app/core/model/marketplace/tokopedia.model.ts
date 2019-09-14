import { ProductSearchParamsModel, ProductSearchClassModel, SortBy, ProductSearchResultModel } from './productSearch.model';
import { MarketPlaceModel } from './marketPlace.model';
import { HttpClient, HttpParams } from '@angular/common/http';

export class TokopediaProductSearch extends ProductSearchClassModel<TokopediaProductSearchResponse> {
  sortOptions = {
    [SortBy.priceAsc]: '3',
    [SortBy.priceDesc]: '4',
    [SortBy.newest]: '9',
    [SortBy.mostSelling]: ''
  };

  buildRequestUrl(params: ProductSearchParamsModel) {
    const url = 'https://still-lowlands-56721.herokuapp.com/api/tp';
    const urlParams = new HttpParams().append('keywords', params.text)
      .append('st', 'product')
      .append('image_size', '100')
      .append('image_square', 'true')
      .append('q', params.text)

      .append('rows', params.perPage.toString())
      .append('ob', this.sortOptions[params.sortBy])
      .append('pmin', params.priceMin.toString())
      .append('pmax', params.priceMax.toString());

    return { url: url, params: urlParams };
  }

  parseProductSearchResult(apiResponse: TokopediaProductSearchResponse) {
    return apiResponse.data.map(product => ({
      title: product.name,
      location: product.shop.location,
      price: parseFloat(product.price.replace(/[Rp .]+/g, '')),
      productUrl: product.uri,
      sellerName: product.shop.name,
      thumbnail: product.image_uri_700,
    } as ProductSearchResultModel));
  }
}

export class TokopediaModel implements MarketPlaceModel {
  name = 'Tokopedia';
  shortName = 'BL';
  logo = 'bl.png';
  mainColor = '#ff0000';
  productSearch: ProductSearchClassModel<TokopediaProductSearchResponse>;

  constructor(
    private http: HttpClient
  ) {
    this.productSearch = new TokopediaProductSearch(this.http);
  }
}

export interface TokopediaProductSearchResponse {
  data: {
    name: string;
    image_uri_700: string;
    shop: { name: string; location: string }
    price: string;
    condition: string;
    uri: string;
  }[];
}

