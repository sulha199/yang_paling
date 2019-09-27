import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { ProductCardComponent } from './product-card.component';
import { MaterialModule } from '../../modules/material.module';
import { ProductSearchResultModel } from 'src/app/core/model/marketplace/productSearch.model';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeId from '@angular/common/locales/id';

registerLocaleData(localeId, 'id');

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  const item: ProductSearchResultModel = {
    title: 'a',
    location: 'jakarta',
    price: 5000,
    productUrl: '',
    origin: 'Bukalapak',
    rating: 90,
    sellerName: 'ss',
    sellingCount: 44,
    thumbnail: 's',
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductCardComponent ],
      imports: [ MaterialModule, CommonModule  ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.item = item;
    fixture.detectChanges();
  });

  it('should load item', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.currency').innerHTML).toBe('Rp5.000');
  });

  it('should open window', fakeAsync(() => {
    spyOn(window, 'open');
    fixture.nativeElement.querySelector('.currency').click();
    fixture.detectChanges();

    expect(window.open).toHaveBeenCalled();
  }));
});
