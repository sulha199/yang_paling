import { ProductSearchParamsModel, ProductSearchClassModel, SortBy, ProductSearchResultModel } from './productSearch.model';
import { MarketPlaceModel, MarketPlaceInfoModel } from './marketPlace.model';
import { HttpClient, HttpParams } from '@angular/common/http';

export const TOKOPEDIA_INFO = {
  name: 'Tokopedia',
  shortName: 'TP',
  logo: 'assets/marketplace/toped.png',
  mainColor: '#42B549',
  currency: 'IDR'
} as MarketPlaceInfoModel;

export class TokopediaProductSearch extends ProductSearchClassModel<TokopediaProductSearchResponse> {
  sortOptions = {
    [SortBy.priceAsc]: '3',
    [SortBy.priceDesc]: '4',
    [SortBy.newest]: '9',
    [SortBy.relevance]: '',
    [SortBy.rating]: '5'
  };

  buildRequestUrl(params: ProductSearchParamsModel) {
    const url = 'https://still-lowlands-56721.herokuapp.com/api/tp';
    const urlParams = new HttpParams().append('keywords', params.text)
      .append('st', 'product')
      .append('page', (params.pageNumber + 1).toString())
      .append('image_size', '100')
      .append('image_square', 'true')
      .append('q', params.text)

      .append('rows', params.perPage.toString())
      .append('ob', this.sortOptions[params.sortBy])
      .append('pmin', params.priceMin.toString())
      .append('pmax', params.priceMax.toString());

    return {url, params: urlParams };
  }

  parseProductSearchResult(apiResponse: TokopediaProductSearchResponse) {
    return apiResponse.data.map(product => ({
      title: product.name,
      location: product.shop.location,
      price: parseFloat(product.price.replace(/[Rp .]+/g, '')),
      productUrl: product.uri,
      sellerName: product.shop.name,
      thumbnail: product.image_uri_700,
      rating: product.rating,
    } as ProductSearchResultModel));
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
    rating: number;
  }[];
}

