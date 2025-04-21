import { Component, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert/alert.service';
import { CardMiniSkeletonComponent } from "../card-mini-skeleton/card-mini-skeleton.component";
import { State, Store } from '@ngrx/store';
import { NoDataComponent } from "../common/no-data/no-data.component";
import { Member } from '../../models/member';
import { MemberService } from '../../services/member/member.service';
import { ExpiryCheckPipe } from "../../pipes/expiry-check.pipe";
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-earned-benefits',
  standalone: true,
  imports: [
    FlexLayoutModule,
    MatCardModule,
    CommonModule,
    CardMiniSkeletonComponent,
    NoDataComponent,
    MatCardModule,
    ExpiryCheckPipe,
  ],
  templateUrl: './earned-benefits.component.html',
  styleUrl: './earned-benefits.component.scss'
})
export class EarnedBenefitsComponent {
  store = inject(Store);
  state = inject(State);
  alertService = inject(AlertService);
  memberService = inject(MemberService);

  private readonly personalization = 'Personalization';

  isLoading: boolean = true;
  memberBenefits: any = [];
  memberInfo!: Member;
  location: any;
  subscriptions: Subscription[] = [];

  ngOnInit() {
    this.subscriptions.push(
      this.store.select('location').subscribe((location) => {
        this.location = location.location;
        if(this.memberInfo?._id){
          this.getMemberBenefits();
        }
      }),

      this.store.select('member').subscribe({
        next: (member) => {
          this.memberInfo = member;
          if(this.memberInfo?._id){
            this.getMemberBenefits()
          }
        },
        error: (error) => {
          this.alertService.errorAlert(error?.error?.error || error?.message);
        }
      })
    )
  }

  getMemberBenefits() {
    this.memberService.getOffers(this.memberInfo?._id, this.location.number ?? this.location).subscribe({
      next: (offers: any) => {
        this.memberBenefits = offers.filter((offer) => offer.ext?.isBenefit);
        this.isLoading = false;
      },
      error: (error) => {
        this.alertService.errorAlert(error?.error?.error || error?.message);
        this.isLoading = false;
      }
    })
  }

  getActivityPayload(locationNum: string) {
    return {
      type: this.personalization,
      date: new Date().toISOString(),
      srcChannelType: 'Web',
      srcChannelID: locationNum,
      couponCode: 'Tier Benefit',
      loyaltyID: this.state.getValue().member.loyaltyId
    };
  }
}
