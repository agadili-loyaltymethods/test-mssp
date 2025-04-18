import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSweepstakeComponent } from './modal-sweepstake.component';

describe('ModalSweepstakeComponent', () => {
  let component: ModalSweepstakeComponent;
  let fixture: ComponentFixture<ModalSweepstakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSweepstakeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalSweepstakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
