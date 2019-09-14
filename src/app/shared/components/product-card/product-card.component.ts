import { Store } from '@ngxs/store';
import { ProductSearchResultModel } from './../../../core/model/marketplace/productSearch.model';
import { Component, OnInit, Input } from '@angular/core';
import { OpenIframe } from 'src/app/core/ngxs/actions/iframe.actions';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input() item: ProductSearchResultModel;

  constructor(
    private store: Store,
  ) { }

  ngOnInit() {
  }

  openIframe() {
    window.open(this.item.productUrl, '_blank');
  }

}
