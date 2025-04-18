import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMiniSkeletonComponent } from './card-mini-skeleton.component';

describe('CardMiniskeletonComponent', () => {
  let component: CardMiniSkeletonComponent;
  let fixture: ComponentFixture<CardMiniSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardMiniSkeletonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardMiniSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
