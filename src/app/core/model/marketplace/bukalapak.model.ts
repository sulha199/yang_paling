import { ProductSearchParamsModel, ProductSearchClassModel, SortBy, ProductSearchResultModel } from './productSearch.model';
import { MarketPlaceModel, MarketPlaceInfoModel } from './marketPlace.model';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface BukalapakProductSearchResponse {
  data: {
    products: {
      name: string;
      small_images: string[];
      seller_name: string;
      city: string;
      price: number;
      condition: string;
      url: string;
    }[]
  };
}

export const BUKALAPAK_INFO: MarketPlaceInfoModel = {
  name: 'Bukalapak',
  shortName: 'BL',
  logo: 'bl.png',
  mainColor: '#ff0000',
  currency: 'IDR'
};

export class BukalapakProductSearch extends ProductSearchClassModel<string> {
  sortOptions = {
    [SortBy.priceAsc]: 'Termurah',
    [SortBy.priceDesc]: 'Termahal',
    [SortBy.newest]: 'Terbaru',
    [SortBy.mostSelling]: ''
  };

  buildRequestUrl(params: ProductSearchParamsModel) {
    const url = 'https://www.bukalapak.com/products';
    const urlParams = new HttpParams()
      .append('utf8', '✓')
      .append('source', 'navbar')
      .append('search[keywords]', params.text)
      .append('search[sort_by]', this.sortOptions[params.sortBy])
      .append('search[price_min]', params.priceMin.toString())
      .append('search[price_max]', params.priceMax.toString());

    return { url, params: urlParams };
  }

  parseProductSearchResult(apiResponse: string) {
    return [];
    // const $ = load(apiResponse);

    // return $('li.product--sem article.product-display').toArray().map(html => {
    //   const element = load(html);
    //   return ({
    //     title: element('a.title').text(),
    //     location: element('.product-seller .user-city .user-city__txt').text(),
    //     price: parseFloat(element('.product-price .amount').text()),
    //     productUrl: element('a.title').attr().href,
    //     sellerName: element('.product-seller .user__name a').text(),
    //     thumbnail: element('.product-picture .product-media__img').attr().src,
    //   } as ProductSearchResultModel);
    // });
  }
}


