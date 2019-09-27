import { ProductSearchParamsModel, SortBy, ProductSearchResultModel } from 'src/app/core/model/marketplace/productSearch.model';
import { MarketplaceService } from './../../services/marketplace/marketplace.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TestBed, async, inject } from '@angular/core/testing';
import { MARKETPLACES_RECORDS } from '.';
import { MarketPlaceModel } from './marketPlace.model';

const mockSearchParams: ProductSearchParamsModel = {
  text: 'baju',
  pageNumber: 1,
  perPage: 20,
  priceMin: 0,
  priceMax: 9999999999,
  sortBy: SortBy.priceAsc
};
const keyworwordInclusionLimitRatio = 0.75;
const ratingorderLimitRatio = 0.5;

describe('Product Search from All MarketPlaces', () => {
  let http: HttpClient;
  let marketplaceService: MarketplaceService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        MarketplaceService,
      ],
      imports: [
        HttpClientModule
      ]
    }).compileComponents();
    http = TestBed.get(HttpClient);
    marketplaceService = TestBed.get(MarketplaceService);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  }));

  Object.keys(MARKETPLACES_RECORDS).forEach(marketplaceName => {
    describe(`${marketplaceName}`, () => {

      it('should search sort by price asc', done => {
        const marketplace = getMarketPlaceByName(marketplaceName, marketplaceService);
        mockSearchParams.sortBy = SortBy.priceAsc;
        marketplace.productSearch.productSearch(mockSearchParams).subscribe(results => {
          expect(results.length).toBe(mockSearchParams.perPage);
          expect(
            countKeywordIncludedInTitles(mockSearchParams.text, results) / mockSearchParams.perPage
          ).toBeGreaterThan(keyworwordInclusionLimitRatio);
          expect(isRowsOrderedByPrice(results, 'asc')).toBe(true);
          done();
        });
      });

      it('should search sort by price desc', done => {
        const marketplace = getMarketPlaceByName(marketplaceName, marketplaceService);
        mockSearchParams.sortBy = SortBy.priceDesc;
        marketplace.productSearch.productSearch(mockSearchParams).subscribe(results => {
          expect(results.length).toBe(mockSearchParams.perPage);
          expect(
            countKeywordIncludedInTitles(mockSearchParams.text, results) / mockSearchParams.perPage
          ).toBeGreaterThan(keyworwordInclusionLimitRatio);
          expect(isRowsOrderedByPrice(results, 'desc')).toBe(true);
          done();
        });
      });

      it('should search sort by rating desc', done => {
        const marketplace = getMarketPlaceByName(marketplaceName, marketplaceService);
        mockSearchParams.sortBy = SortBy.rating;
        marketplace.productSearch.productSearch(mockSearchParams).subscribe(results => {
          expect(results.length).toBe(mockSearchParams.perPage);
          expect(
            countKeywordIncludedInTitles(mockSearchParams.text, results) / mockSearchParams.perPage
          ).toBeGreaterThan(keyworwordInclusionLimitRatio);
          expect(isRowsHaveHighRatings(results)).toBe(true);
          expect(countRowOrderedByRating(results) / mockSearchParams.perPage).toBeGreaterThan(ratingorderLimitRatio);
          done();
        });
      });

    });
  });

});

function getMarketPlaceByName(name: string, service: MarketplaceService): MarketPlaceModel  {
  return service.productSearchMembers.find(marketplace => marketplace.basicInfo.name === name);
}

function countKeywordIncludedInTitles(keyword: string, results: ProductSearchResultModel[]): number {
  return results.filter(row => row.title.toLowerCase().includes(keyword.toLowerCase())).length;
}

function isRowsOrderedByPrice(results: ProductSearchResultModel[], sortingType: 'asc' | 'desc') {
  let previousValue = sortingType === 'asc' ? 0 : 9999999999;
  return results.every(row => {
    const compareResult = sortingType === 'asc' ? row.price >= previousValue : row.price <= previousValue;
    previousValue = row.price;
    return compareResult;
  });
}

function countRowOrderedByRating(results: ProductSearchResultModel[]): number {
  let previousValue = 20;
  return results.filter(row => {
    const rating = Math.floor((row.rating || 0) / 5);
    const compareResult = rating <= previousValue;
    previousValue = rating;
    return compareResult;
  }).length;
}

function isRowsHaveHighRatings(results: ProductSearchResultModel[]): boolean {
  return results.every(row => row.rating || 0 > 90);
}
