import { Select, Store } from '@ngxs/store';
import { Component, OnInit } from '@angular/core';
import { ProductSearchState } from 'src/app/core/ngxs/states/productSearch.State';
import { Observable } from 'rxjs';
import { ProductSearchStateModel } from 'src/app/core/model/marketplace/productSearch.model';
import { SearchUpdateFilterMarketPlace } from 'src/app/core/ngxs/actions/productSearch.actions';
import { MarketPlaceModel } from 'src/app/core/model/marketplace';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent implements OnInit {
  @Select(ProductSearchState) productResults$: Observable<ProductSearchStateModel>;

  constructor(
    private store: Store
  ) { }

  ngOnInit() {
  }

  updateMarketPlaceFilter(value: Record<string, boolean>) {
    this.store.dispatch(new SearchUpdateFilterMarketPlace(value));
  }

  searchingStatusCallback(marketplace: MarketPlaceModel) {
    return marketplace.productSearch.isProcessing$.value;
  }

}
