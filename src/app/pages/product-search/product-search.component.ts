import { Select, Store } from '@ngxs/store';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductSearchState } from 'src/app/core/ngxs/states/productSearch.State';
import { Observable } from 'rxjs';
import { ProductSearchStateModel } from 'src/app/core/model/marketplace/productSearch.model';
import { SearchUpdateFilterMarketPlace, SearchNextPage } from 'src/app/core/ngxs/actions/productSearch.actions';
import { MarketPlaceModel } from 'src/app/core/model/marketplace';
import { MarketplaceService } from 'src/app/core/services/marketplace/marketplace.service';
import { MarketplaceFilterComponent } from 'src/app/shared/components/marketplace-filter/marketplace-filter.component';
import { map, filter, take } from 'rxjs/operators';
import { SCROLL_VALUE_TO_LOAD } from 'src/app/core/const/config';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent implements OnInit {
  @Select(ProductSearchState) productResults$: Observable<ProductSearchStateModel>;

  @ViewChild('marketplaceFilter', { static: true}) marketplaceFilter: MarketplaceFilterComponent;
  @ViewChild('productList', { static: true, read: ElementRef}) productListRef: ElementRef;

  members: MarketPlaceModel[];
  isNoResult$: Observable<boolean>;
  isEndResult$: Observable<boolean>;
  searchingStatusCallback = (marketplace: MarketPlaceModel) => marketplace.productSearch.isProcessing$;

  constructor(
    private store: Store,
    private marketplaceService: MarketplaceService
  ) {
    this.members = this.marketplaceService.productSearchMembers;
  }

  ngOnInit() {
    this.isNoResult$ = this.productResults$.pipe(
      map(state => state.status === 'no-result')
    );
    this.isEndResult$ = this.productResults$.pipe(
      map(state => state.status === 'end-of-result')
    );
  }

  updateMarketPlaceFilter(value: Record<string, boolean>) {
    this.store.dispatch(new SearchUpdateFilterMarketPlace(value));
  }

  next() {
    this.productResults$.pipe(
      filter(state => state.status === 'normal' && state.showedResults.length > 0),
      take(1)
    ).subscribe((s) => {
      const element = this.productListRef.nativeElement;
      if (element.scrollHeight - element.scrollTop - element.clientHeight < SCROLL_VALUE_TO_LOAD) {
        const scrollTop = element.scrollTop;
        this.store.dispatch(new SearchNextPage());
        element.scrollTop = scrollTop - 50;
        element.scrollTop = scrollTop;
      }
    });
  }
}
