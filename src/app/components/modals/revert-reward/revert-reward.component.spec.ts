import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevertRewardComponent } from './revert-reward.component';

describe('RevertRewardComponent', () => {
  let component: RevertRewardComponent;
  let fixture: ComponentFixture<RevertRewardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevertRewardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RevertRewardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
