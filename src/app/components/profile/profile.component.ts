import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { Member } from '../../models/member';
import { AlertService } from '../../services/alert/alert.service';
import { AuthService } from '../../services/auth/auth.service';
import { MemberService } from '../../services/member/member.service';
import { addMember, clearMember } from '../../states/actions/member.action';
import { UnsubscribeComponent } from '../common/unsubscribe/unsubscribe.component';
import { MatDividerModule } from '@angular/material/divider';
import { clearCart } from '../../states/actions/cart.action';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FlexLayoutModule, ReactiveFormsModule, MatMenuModule, CommonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule,MatDividerModule,],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent extends UnsubscribeComponent {
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  
  private store = inject(Store);
  private memberService = inject(MemberService);
  private alertService = inject(AlertService);
  private auth = inject(AuthService);
  private router = inject(Router);

  memberInfo
  memberTier
  isFetching = false;
  totalPoints = 0;
  loyaltyIdControl = new FormControl();

  constructor() { super(); }

  ngOnInit() {
    this.subscriptions.push(
      this.memberService.isFetching$.subscribe({
        next: (status) => this.isFetching = status,
        error: (error) => {
          this.alertService.errorAlert(error?.error?.error || error?.message);
        }
      }),
      this.memberService.refreshMember$.subscribe(
        () => this.switchMember()),
      this.store.select('member').subscribe((member) => {
        if (Object.keys(member).length) {
          this.memberInfo = member;
          this.totalPoints = this.memberInfo.purses.find(x => x.name ==='Anywhere Points').availBalance ?? 0
          localStorage.setItem('loyaltyId', member.loyaltyId);
          this.memberTier = this.memberInfo.tiers[0].level.name;
          this.loyaltyIdControl.setValue(member.loyaltyId);
        }
      }),
    )
  }

  switchMember() {
    const oldVal = localStorage.getItem('loyaltyId') ?? null;
    if (this.loyaltyIdControl.value) {
      localStorage.setItem('loyaltyId', this.loyaltyIdControl.value);
      this.memberService.updateFetchingStatus(true);
      this.memberService.getMember(this.loyaltyIdControl.value).pipe(take(1)).subscribe({
        next: (member: Member) => {
          this.store.dispatch(addMember({ member }))
        },
        error: (error) => {
          localStorage.setItem('loyaltyId', oldVal || '');
          this.loyaltyIdControl.setValue(oldVal);
          this.alertService.errorAlert(error?.error?.error || error?.message);
        }
      }).add(() => {
        this.memberService.updateFetchingStatus(false);
        this.trigger.closeMenu();
      });
    }
  }
  clearStore() {
    this.store.dispatch(clearMember());
    this.store.dispatch(clearCart());
  }
}
