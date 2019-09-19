import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MarketPlaceModel } from 'src/app/core/model/marketplace';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-marketplace-filter',
  templateUrl: './marketplace-filter.component.html',
  styleUrls: ['./marketplace-filter.component.scss']
})
export class MarketplaceFilterComponent implements OnInit {
  @Input() marketplaces: MarketPlaceModel[];
  @Input() getProgressCallback: (marketplace: MarketPlaceModel) => boolean;

  @Output() marketplacesStates = new EventEmitter<Record<string, boolean>>();

  currentState: Record<string, boolean>;

  constructor() { }

  ngOnInit() {
    this.currentState = (this.marketplaces || []).reduce((obj, marketplace) => {
      obj[marketplace.basicInfo.name] = true;
      return obj;
    }, {});
  }

  togggle(marketplace: MarketPlaceModel) {
    this.currentState[marketplace.basicInfo.name] = !this.currentState[marketplace.basicInfo.name];
    this.marketplacesStates.emit(this.currentState);
  }

  isInProgress(marketplaceName: string) {
    const currentMarketplace = this.marketplaces.find(marketplace => marketplace.basicInfo.name === marketplaceName);
    return !!this.getProgressCallback ? false : this.getProgressCallback(currentMarketplace);
  }

}
