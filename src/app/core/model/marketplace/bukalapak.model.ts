import { ProductSearchParamsModel, ProductSearchClassModel, SortBy, ProductSearchResultModel } from './productSearch.model';
import { MarketPlaceModel } from './marketPlace.model';
import { HttpClient, HttpParams } from '@angular/common/http';

export class BukalapakProductSearch extends ProductSearchClassModel<BukalapakProductSearchResponse> {
  sortOptions = {
    [SortBy.priceAsc]: 'Termurah',
    [SortBy.priceDesc]: 'Termahal',
    [SortBy.newest]: 'Terbaru',
    [SortBy.mostSelling]: ''
  };

  buildRequestUrl(params: ProductSearchParamsModel) {
    const url = 'https://api.bukalapak.com/v2/products.json';
    const urlParams = new HttpParams().append('keywords', params.text)
      .append('per_page', params.perPage.toString())
      .append('sort_by', this.sortOptions[params.sortBy])
      .append('price_min', params.priceMin.toString())
      .append('price_max', params.priceMax.toString());

    return { url: url, params: urlParams };
  }

  parseProductSearchResult(apiResponse: BukalapakProductSearchResponse) {
    return apiResponse.data.products.map(product => ({
      title: product.name,
      location: product.city,
      price: product.price,
      productUrl: product.url,
      sellerName: product.seller_name,
      thumbnail: product.small_images[0].replace('/small/', '/s-190-190/'),
    } as ProductSearchResultModel));
  }
}

export class BukalapakModel implements MarketPlaceModel {
  name = 'Bukalapak';
  shortName = 'BL';
  logo = 'bl.png';
  mainColor = '#ff0000';
  productSearch: ProductSearchClassModel<BukalapakProductSearchResponse>;

  constructor(
    private http: HttpClient
  ) {
    // this.productSearch = new BukalapakProductSearch(this.http);
  }
}

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

