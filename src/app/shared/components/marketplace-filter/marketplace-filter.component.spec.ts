import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { MarketplaceFilterComponent } from './marketplace-filter.component';
import { MatCardModule } from '@angular/material';
import { BUKALAPAK_INFO, MarketPlaceModel } from '../../../core/model/marketplace/index';

describe('MarketplaceFilterComponent', () => {
  let component: MarketplaceFilterComponent;
  let fixture: ComponentFixture<MarketplaceFilterComponent>;
  let iconElement: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplaceFilterComponent ],
      imports: [ MatCardModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceFilterComponent);
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

  it('should emit marketplace state', fakeAsync(() => {
    spyOn(component.marketplacesStates, 'emit').and.callThrough();
    iconElement.click();
    fixture.detectChanges();

    expect(component.marketplacesStates.emit).toHaveBeenCalledWith({ [BUKALAPAK_INFO.name]: false });
  }));
});
