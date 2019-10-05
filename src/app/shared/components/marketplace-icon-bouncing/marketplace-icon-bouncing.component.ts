import { Component, OnInit, Input } from '@angular/core';
import { MarketPlaceModel } from 'src/app/core/model/marketplace';
import { Observable, of, combineLatest } from 'rxjs';
import { map, share, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-marketplace-icon-bouncing',
  templateUrl: './marketplace-icon-bouncing.component.html',
  styleUrls: ['./marketplace-icon-bouncing.component.scss']
})
export class MarketplaceIconBouncingComponent implements OnInit {
  @Input() marketplaces: MarketPlaceModel[];
  @Input() getProgressCallback: (marketplace: MarketPlaceModel) => Observable<boolean>;

  isInProgressStates$: Record<string, Observable<boolean>> = {};
  isShowDots$: Observable<boolean>;
  constructor() { }

  ngOnInit() {
    (this.marketplaces || []).forEach(marketplace => {
      this.isInProgressStates$[marketplace.basicInfo.name] = this.isInProgress(marketplace.basicInfo.name);
    });
    this.isShowDots$ = combineLatest(Object.values(this.isInProgressStates$)).pipe(
      map(values => values.some(value => !!value)),
      shareReplay(2)
    );
  }

  isInProgress(marketplaceName: string) {
    const currentMarketplace = this.marketplaces.find(marketplace => marketplace.basicInfo.name === marketplaceName);
    return (typeof this.getProgressCallback === 'function' && this.getProgressCallback(currentMarketplace))
      || of (true);
  }

}
