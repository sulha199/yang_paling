import { Select } from '@ngxs/store';
import { Component, OnInit } from '@angular/core';
import { ProductSearchState } from 'src/app/core/ngxs/states/productSearch.State';
import { Observable } from 'rxjs';
import { ProductSearchStateModel } from 'src/app/core/model/marketplace/productSearch.model';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent implements OnInit {
  @Select(ProductSearchState) productResults$: Observable<ProductSearchStateModel>;

  constructor() { }

  ngOnInit() {
  }

}
