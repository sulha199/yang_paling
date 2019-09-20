import { ProductSearchParamsModel, ProductSearchClassModel, SortBy, ProductSearchResultModel } from './productSearch.model';
import { MarketPlaceModel, MarketPlaceInfoModel } from './marketPlace.model';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

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
  logo: 'assets/marketplace/bl.png',
  mainColor: '#D71149',
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
    const url = 'https://still-lowlands-56721.herokuapp.com/api/bl';
    const urlParams = new HttpParams()
      .set('search[keywords]', params.text)
      .set('search[sort_by]', this.sortOptions[params.sortBy])
      .set('search[price_min]', params.priceMin.toString())
      .set('search[price_max]', params.priceMax.toString());

    return { url, params: urlParams };
  }

  sendRequest(url: string, params: HttpParams) {
    return this.http.get<string>(url, { responseType: 'text' as 'json', params});
  }

  parseProductSearchResult(htmlString: string) {
    const htmlResponse = document.createElement('html');
    htmlResponse.innerHTML = htmlString;
    return Array.from(htmlResponse.querySelectorAll('li.product--sem article.product-display')).map(element => {
      return ({
        title: element.querySelector('a.product__name').getAttribute('title') || element.querySelector('a.product__name').innerHTML,
        location: element.querySelector('.product-seller .user-city .user-city__txt').innerHTML,
        price: parseFloat(element.querySelector('.product-price .amount').innerHTML),
        productUrl: element.querySelector('a.product__name').getAttribute('href'),
        sellerName: element.querySelector('.product-seller .user__name a').innerHTML,
        thumbnail: element.querySelector('.product-picture .product-media__img').getAttribute('src'),
      } as ProductSearchResultModel);
    });
  }
}


