import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceIconBouncingComponent } from './marketplace-icon-bouncing.component';

describe('MarketplaceIconBouncingComponent', () => {
  let component: MarketplaceIconBouncingComponent;
  let fixture: ComponentFixture<MarketplaceIconBouncingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplaceIconBouncingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceIconBouncingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
