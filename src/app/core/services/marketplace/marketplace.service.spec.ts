import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { MarketplaceService } from './marketplace.service';

describe('MarketplaceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [],
    imports: [
      HttpClientTestingModule
    ]
  }));

  it('should be created', () => {
    const service: MarketplaceService = TestBed.get(MarketplaceService);
    expect(service).toBeTruthy();
  });
});
