import { Select, Store } from '@ngxs/store';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductSearchState } from 'src/app/core/ngxs/states/productSearch.State';
import { Observable } from 'rxjs';
import { ProductSearchStateModel } from 'src/app/core/model/marketplace/productSearch.model';
import { SearchUpdateFilterMarketPlace, SearchNextPage } from 'src/app/core/ngxs/actions/productSearch.actions';
import { MarketPlaceModel } from 'src/app/core/model/marketplace';
import { MarketplaceService } from 'src/app/core/services/marketplace/marketplace.service';
import { MarketplaceFilterComponent } from 'src/app/shared/components/marketplace-filter/marketplace-filter.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent implements OnInit {
  @Select(ProductSearchState) productResults$: Observable<ProductSearchStateModel>;

  @ViewChild('marketplaceFilter', { static: true}) marketplaceFilter: MarketplaceFilterComponent;

  members: MarketPlaceModel[];
  isLoadingResult$: Observable<boolean>;
  searchingStatusCallback = (marketplace: MarketPlaceModel) => marketplace.productSearch.isProcessing$;

  constructor(
    private store: Store,
    private marketplaceService: MarketplaceService
  ) {
    this.members = this.marketplaceService.productSearchMembers;
  }

  ngOnInit() {
    this.isLoadingResult$ = this.productResults$.pipe(map(state => state.status === 'receiving' || state.status === 'requesting'));
  }

  updateMarketPlaceFilter(value: Record<string, boolean>) {
    this.store.dispatch(new SearchUpdateFilterMarketPlace(value));
  }

  next() {
    this.store.dispatch(new SearchNextPage());
  }
}
