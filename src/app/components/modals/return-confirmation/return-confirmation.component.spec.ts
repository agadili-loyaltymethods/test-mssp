import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnConfirmationComponent } from './return-confirmation.component';

describe('ReturnConfirmationComponent', () => {
  let component: ReturnConfirmationComponent;
  let fixture: ComponentFixture<ReturnConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnConfirmationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReturnConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
