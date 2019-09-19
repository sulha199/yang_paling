import { BUKALAPAK_INFO, BukalapakProductSearch } from './bukalapak.model';
import { MarketPlaceModel } from './marketPlace.model';
import { HttpClient } from '@angular/common/http';
import { TOKOPEDIA_INFO, TokopediaProductSearch } from './tokopedia.model';

export const members: ((http: HttpClient) => MarketPlaceModel)[] = [
  (http) => ({
    basicInfo: BUKALAPAK_INFO,
    productSearch: new BukalapakProductSearch(http)
  }),
  (http) => ({
    basicInfo: TOKOPEDIA_INFO,
    productSearch: new TokopediaProductSearch(http),
  })
];

export const MARKETPLACES_RECORDS = {
  [BUKALAPAK_INFO.name]: BUKALAPAK_INFO,
  [TOKOPEDIA_INFO.name]: TOKOPEDIA_INFO
};

export * from './marketPlace.model';
export * from './bukalapak.model';
export * from './tokopedia.model';
