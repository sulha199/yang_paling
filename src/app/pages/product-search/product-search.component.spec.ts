import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { ProductSearchComponent } from './product-search.component';
import { MarketplaceService } from 'src/app/core/services/marketplace/marketplace.service';
import { NgxsModule, Store } from '@ngxs/store';
import { ProductSearchState } from 'src/app/core/ngxs/states/productSearch.State';
import { MarketplaceFilterComponent } from 'src/app/shared/components/marketplace-filter/marketplace-filter.component';
import { ProductCardComponent } from 'src/app/shared/components/product-card/product-card.component';
import { MatCardModule } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { ProductSearchResultModel, ProductSearchStateModel, DEFAULT_PRODUCT_SEARCH_STATE } from 'src/app/core/model/marketplace/productSearch.model';
import { SearchUpdateFilterMarketPlace, SearchNextPage } from 'src/app/core/ngxs/actions/productSearch.actions';
import { MarketplaceIconBouncingComponent } from 'src/app/shared/components/marketplace-icon-bouncing/marketplace-icon-bouncing.component';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { By } from 'selenium-webdriver';

const mockProducts: ProductSearchResultModel[] = [
  {
    title: 'a',
    location: 'jkt',
    origin: 'Bukalapak',
    price: 1000,
    productUrl: '',
    rating: 100,
    sellerName: 'a',
    thumbnail: ''

  }
];

describe('ProductSearchComponent', () => {
  let component: ProductSearchComponent;
  let fixture: ComponentFixture<ProductSearchComponent>;
  let store: Store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProductSearchComponent,
        MarketplaceFilterComponent,
        ProductCardComponent,
        MarketplaceIconBouncingComponent
      ],
      providers: [
        MarketplaceService,
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') }
        },
      ],
      imports: [
        NgxsModule.forRoot([ProductSearchState]),
        MatCardModule,
        HttpClientTestingModule,
        MaterialModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSearchComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
    spyOn(store, 'select').and.returnValue(of({ showedResults: mockProducts, state: 'normal' }));
    spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should load component and products', () => {
    expect(component).toBeTruthy();
    expect(document.querySelectorAll('.product-card.mat-card').length).toBe(1);
  });

  it('should dispatch market filter', fakeAsync(() => {
    const mockMarketFIlter = { Bukalapak: true};
    component.marketplaceFilter.marketplacesStates.emit(mockMarketFIlter);
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(new SearchUpdateFilterMarketPlace(mockMarketFIlter));
  }));

  it('should load next page', fakeAsync(() => {
    const mockState: ProductSearchStateModel = {
      ...DEFAULT_PRODUCT_SEARCH_STATE,
      showedResults: mockProducts,
      status: 'normal',
    };
    const mockStore = new BehaviorSubject<ProductSearchStateModel>(mockState);
    spyOnProperty(component, 'productResults$').and.returnValue(mockStore);
    component.productListRef.nativeElement.style.height = '10px';
    fixture.detectChanges();
    component.productListRef.nativeElement.scrollTop = 1000;
    fixture.detectChanges();

    component.next();
    mockStore.next(mockState);
    expect(store.dispatch).toHaveBeenCalledWith(new SearchNextPage());
  }));
});
