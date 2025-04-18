import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StyleQuizComponent } from './style-quiz.component';

describe('StyleQuizComponent', () => {
  let component: StyleQuizComponent;
  let fixture: ComponentFixture<StyleQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StyleQuizComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StyleQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
