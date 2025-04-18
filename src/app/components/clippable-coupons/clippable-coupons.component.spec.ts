import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClippableCouponsComponent } from './clippable-coupons.component';

describe('ClippableCouponsComponent', () => {
  let component: ClippableCouponsComponent;
  let fixture: ComponentFixture<ClippableCouponsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClippableCouponsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClippableCouponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
