import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTimerComponent } from './app-timer.component';

describe('AppTimerComponent', () => {
  let component: AppTimerComponent;
  let fixture: ComponentFixture<AppTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTimerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
