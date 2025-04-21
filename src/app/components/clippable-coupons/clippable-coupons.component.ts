import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { Subscription, switchMap } from 'rxjs';
import { Segment } from '../../models/segment';
import { AlertService } from '../../services/alert/alert.service';
import { SegmentService } from '../../services/segment/segment.service';
import { CardMiniSkeletonComponent } from "../card-mini-skeleton/card-mini-skeleton.component";
import { NoDataComponent } from "../common/no-data/no-data.component";

@Component({
  selector: 'app-clippable-coupons',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatButtonModule, FlexLayoutModule, CommonModule, CardMiniSkeletonComponent, NoDataComponent],
  templateUrl: './clippable-coupons.component.html',
  styleUrl: './clippable-coupons.component.scss'
})
export class ClippableCouponsComponent implements OnDestroy {
  store = inject(Store);
  memberInfo: any;
  segmentFormCtrl: FormControl = new FormControl(null, [Validators.required]);
  subscriptions: Subscription[] = [];
  segments: any = [];
  memberSegments: any = [];
  isLoading: boolean = true;



  constructor(private segmentService: SegmentService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.store.select('member').subscribe({
        next: (member) => {
          this.isLoading = true;
          this.memberInfo = member;
          this.getSegments();
        },
        error: (error) => {
          this.alertService.errorAlert(error?.error?.error || error?.message);
        }
      })
    )
  }

  getSegments() {
    this.isLoading = true;

    this.segmentService.getAllSegments(JSON.stringify({ "ext.marketing": true }))
      .pipe(
        switchMap((res: Segment[]) => {
          this.segments = res;
          return this.segmentService.getMemberSegments(5, this.getQuery());
        })
      )
      .subscribe({
        next: (memberRes: any) => {
          this.memberSegments = memberRes;
          this.isLoading = false;
        },
        error: (error) => {
          this.alertService.errorAlert(error?.error?.error || error?.message);
          this.isLoading = false;
        }
      });
  }


  getQuery() {
    return JSON.stringify({
      member: this.memberInfo._id,
      segment: { $in: this.segments.map((segment) => segment._id) }
    })
  }

  isClaimed = (segmentId: string) => !!this.memberSegments.find(x => x.segment === segmentId);

  updateSegment(segmentId: string) {
    const existingSegment = this.memberSegments.findIndex(x => x.segment === segmentId)
    if (existingSegment > -1) {
      this.segmentService.deleteMemberSegment(this.memberSegments[existingSegment]._id).subscribe({
        next: () => {
          this.memberSegments.splice(existingSegment, 1);
          this.alertService.successAlert('Coupon has been successfully deactivated.')
        },
        error: (error) => {
          this.alertService.errorAlert(error?.error?.error || error?.message);
        },
      })
    } else {
      this.segmentService.addMemberSegment(this.memberInfo._id, segmentId).subscribe({
        next: (res) => {
          this.memberSegments.push(res);
          this.alertService.successAlert('Coupon has been successfully activated.')
        },
        error: (error) => {
          this.alertService.errorAlert(error?.error?.error || error?.message);
        },
      })
    }


  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }
}
