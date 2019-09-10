import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MarketPlaceModel, members as  MarketPlaceMembers} from 'src/app/core/model/marketplace';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
  members: MarketPlaceModel[];

  constructor(
    private http: HttpClient
  ) {
    this.members = MarketPlaceMembers.map(model => new model(http));
  }
}
