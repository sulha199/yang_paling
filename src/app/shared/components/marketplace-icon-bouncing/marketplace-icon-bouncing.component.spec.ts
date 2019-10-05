import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceIconBouncingComponent } from './marketplace-icon-bouncing.component';
import { MaterialModule } from '../../modules/material.module';
import { BUKALAPAK_INFO, MarketPlaceModel } from 'src/app/core/model/marketplace';

describe('MarketplaceIconBouncingComponent', () => {
  let component: MarketplaceIconBouncingComponent;
  let fixture: ComponentFixture<MarketplaceIconBouncingComponent>;
  let iconElement: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplaceIconBouncingComponent ],
      imports: [ MaterialModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceIconBouncingComponent);
    component = fixture.componentInstance;
    component.marketplaces = [
      { basicInfo: BUKALAPAK_INFO } as MarketPlaceModel
    ];
    fixture.detectChanges();
    iconElement = fixture.nativeElement.querySelector('.main-icon');
  });

  it('should load marketplace', () => {
    expect(component).toBeTruthy();
    expect(iconElement.getAttribute('alt')).toBe(BUKALAPAK_INFO.name);
  });
});
