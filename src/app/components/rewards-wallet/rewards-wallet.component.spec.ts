import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardsWalletComponent } from './rewards-wallet.component';

describe('RewardsWalletComponent', () => {
  let component: RewardsWalletComponent;
  let fixture: ComponentFixture<RewardsWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RewardsWalletComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RewardsWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
