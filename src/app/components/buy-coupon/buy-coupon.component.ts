import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { ActivityService } from '../../services/activity.service';
import { Member } from '../../models/member';
import { Coupon } from '../../models/coupon';
import { AlertService } from '../../services/alert/alert.service';
import { CommonModule } from '@angular/common';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-buy-coupon',
  standalone: true,
  imports: [
    MatButtonModule,
    FlexLayoutModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './buy-coupon.component.html',
  styleUrl: './buy-coupon.component.scss',
})
export class BuyCouponComponent implements OnChanges {
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() memberInfo!: Member;
  @Input() refresh = false;

  couponList: Coupon[] = [];

  constructor(
    private activityService: ActivityService,
    private alertService: AlertService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['memberInfo'] && changes['memberInfo'].currentValue) {
      this.getCoupons();
    }
    if (changes['refresh']) {
      this.clearCoupons();
    }
  }

  clearCoupons() {
    this.couponList.forEach((coupon) => (coupon.count = 0));
  }

  getCoupons() {
    this.activityService.getCoupons().subscribe({
      next: (couponList: Coupon[]) => {
        this.couponList = couponList;
      },
      error: (error) => {
        this.alertService.errorAlert(error?.error?.error || error?.message);
      },
    });
  }

  hasCoupons = () => this.couponList.find((coupon) => coupon.count);
  totalPoints = () =>
    this.couponList.reduce(
      (acc, c) => (c.count ?? 0) * c.ext.rewardCost + acc,
      0
    );

  reduceCount(coupon: Coupon) {
    coupon.count = coupon.count ? --coupon.count : 0;
  }

  increaseCount(coupon: Coupon) {
    coupon.count = coupon.count ? ++coupon.count : 1;
  }

  createPayload(couponCode: string) {
    return {
      type: 'Redemption',
      date: new Date(),
      srcChannelType: 'Web',
      loyaltyID: +this.memberInfo.loyaltyId,
      couponCode: couponCode,
    };
  }

  buyCoupon() {
    if (this.totalPoints() > this.memberInfo.purses[0].availBalance) {
      this.alertService.errorAlert(
        'Not enough points to buy the selected coupons'
      );
      return;
    }
    let requests: Observable<any>[] = [];
    this.couponList
      .filter((coupon) => coupon.count)
      .forEach((coupon) => {
        for (let c = 0; c < (coupon.count ?? 0); c++) {
          requests.push(
            this.activityService.getActivity(this.createPayload(coupon.name))
          );
        }
      });
    forkJoin(requests).subscribe({
      next: () => {
        this.closeDrawer(true);
      },
      error: (error) => this.alertService.errorAlert(error?.error?.error || error?.message)
    });
  }

  closeDrawer(refresh: boolean = false) {
    this.close.emit(refresh);
  }
}
