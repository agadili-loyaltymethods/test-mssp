import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StylistAppointmentComponent } from './stylist-appointment.component';

describe('StylistAppointmentComponent', () => {
  let component: StylistAppointmentComponent;
  let fixture: ComponentFixture<StylistAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StylistAppointmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StylistAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
