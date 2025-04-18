import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSurveyComponent } from './modal-survey.component';

describe('ModalSurveyComponent', () => {
  let component: ModalSurveyComponent;
  let fixture: ComponentFixture<ModalSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSurveyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
