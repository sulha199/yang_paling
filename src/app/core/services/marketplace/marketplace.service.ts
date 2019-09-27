import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MarketPlaceModel, members as  MarketPlaceMembers} from 'src/app/core/model/marketplace';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
  members: MarketPlaceModel[];
  productSearchMembers: MarketPlaceModel[];

  constructor(
    private http: HttpClient
  ) {
    this.members = MarketPlaceMembers.map(marketplace => marketplace(http));
    this.productSearchMembers = this.members.filter(member => !!member.productSearch);
  }
}
