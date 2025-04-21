import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Store } from '@ngrx/store';
import { forkJoin } from 'rxjs';
import { TokenDetailsHelper } from '../../helpers/token-details/token-details.helper';
import { ExpiryCheckPipe } from "../../pipes/expiry-check.pipe";
import { AlertService } from '../../services/alert/alert.service';
import { MemberService } from '../../services/member/member.service';
import { CardMiniSkeletonComponent } from "../card-mini-skeleton/card-mini-skeleton.component";
import { NoDataComponent } from "../common/no-data/no-data.component";
import { Member } from '../../models/member';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [
    FlexLayoutModule,
    MatCardModule,
    MatButtonModule,
    CommonModule,
    MatProgressBarModule,
    CardMiniSkeletonComponent,
    ExpiryCheckPipe,
    NoDataComponent
  ],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.scss'
})
export class OffersComponent implements OnInit {
  store = inject(Store);
  memberService = inject(MemberService);
  alertService = inject(AlertService);
  tokenDetailsHelper = inject(TokenDetailsHelper)

  offers: any = [];
  isLoading: boolean = true;
  staticDate = new Date('10/11/2024');
  memberInfo!: Member;
  location: any;

  ngOnInit() {
    this.store.select('member').subscribe((member) => {
      this.memberInfo = member;
      this.getOffers();
    }
    );
    this.store.select('location').subscribe((location) => {
      this.location = location.location;
      this.getOffers();
    });
  }

  getOffers() {
    if (this.memberInfo._id) {
      forkJoin([
        this.memberService.getPromo(this.memberInfo._id, this.location.number ?? this.location),
        this.memberService.getOffers(this.memberInfo._id, this.location.number ?? this.location)
      ]).subscribe({
        next: (results) => {
          const [promo, globalOffers] = results;
          this.offers = [...promo, ...globalOffers.filter((offer) => !offer.ext?.isPerk && !offer.ext?.isBenefit)];
        },
        error: (error) => {
          this.alertService.errorAlert(error?.error?.error || error?.message);
        }
      }).add(() => this.isLoading = false);
    }
  }

  openExternalLink(path: string, query: string = '') {
    this.tokenDetailsHelper.openExternalLink(path, query);
  }

}
