import { Store } from '@ngxs/store';
import { ProductSearchResultModel } from './../../../core/model/marketplace/productSearch.model';
import { Component, OnInit, Input } from '@angular/core';
import { OpenIframe } from 'src/app/core/ngxs/actions/iframe.actions';
import { MARKETPLACES_RECORDS } from 'src/app/core/model/marketplace';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input() item: ProductSearchResultModel;
  scaledRating: number;

  readonly marketplaceRecords = MARKETPLACES_RECORDS;

  constructor() { }

  ngOnInit() {
    this.scaledRating = (this.item.rating || 0) / 20;
  }

  openIframe() {
    window.open(this.item.productUrl, '_blank');
  }

}
