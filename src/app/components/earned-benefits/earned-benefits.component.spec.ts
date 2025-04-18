import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarnedBenefitsComponent } from './earned-benefits.component';

describe('EarnedBenefitsComponent', () => {
  let component: EarnedBenefitsComponent;
  let fixture: ComponentFixture<EarnedBenefitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EarnedBenefitsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EarnedBenefitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
