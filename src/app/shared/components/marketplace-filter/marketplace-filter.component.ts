import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MarketPlaceModel } from 'src/app/core/model/marketplace';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-marketplace-filter',
  templateUrl: './marketplace-filter.component.html',
  styleUrls: ['./marketplace-filter.component.scss']
})
export class MarketplaceFilterComponent implements OnInit {
  @Input() marketplaces: MarketPlaceModel[];
  @Input() getProgressCallback: (marketplace: MarketPlaceModel) => Observable<boolean>;

  @Output() marketplacesStates = new EventEmitter<Record<string, boolean>>();

  currentState: Record<string, boolean> = {};
  isInProgressStates$: Record<string, Observable<boolean>> = {};

  constructor() { }

  ngOnInit() {
    (this.marketplaces || []).forEach(marketplace => {
      this.currentState[marketplace.basicInfo.name] = true;
      this.isInProgressStates$[marketplace.basicInfo.name] = this.isInProgress(marketplace.basicInfo.name).pipe(
        tap(value => console.log(marketplace.basicInfo.name + value))
      );
    });

  }

  togggle(marketplace: MarketPlaceModel) {
    this.currentState[marketplace.basicInfo.name] = !this.currentState[marketplace.basicInfo.name];
    this.marketplacesStates.emit(this.currentState);
  }

  isInProgress(marketplaceName: string) {
    const currentMarketplace = this.marketplaces.find(marketplace => marketplace.basicInfo.name === marketplaceName);
    return (typeof this.getProgressCallback === 'function' && this.getProgressCallback(currentMarketplace))
      || of (false);
  }

}
