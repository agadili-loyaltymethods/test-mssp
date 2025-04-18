import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollQuestComponent } from './enroll-quest.component';

describe('EnrollQuestComponent', () => {
  let component: EnrollQuestComponent;
  let fixture: ComponentFixture<EnrollQuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollQuestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnrollQuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
