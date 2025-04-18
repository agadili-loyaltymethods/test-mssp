import { Component, Inject, inject, OnDestroy } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { ActivityService } from '../../../services/activity.service';
import { ExternalCoupons } from '../../../enums/external-coupons';
import { Store } from '@ngrx/store';
import { LoaderComponent } from "../../loader/loader.component";
import { AlertService } from '../../../services/alert/alert.service';
import { CommonModule } from '@angular/common';
import { SpendCategory } from '../../../enums/spend-category';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-sweepstake',
  standalone: true,
  imports: [FlexLayoutModule, MatButtonModule, MatIconModule, RouterModule, LoaderComponent, CommonModule],
  templateUrl: './modal-sweepstake.component.html',
  styleUrl: './modal-sweepstake.component.scss'
})
export class ModalSweepstakeComponent implements OnDestroy{
  private store = inject(Store);

  status: null | "won" | "lost" = null;
  isLoading: boolean = false;
  loyaltyId: any;
  earnedPoints: number = 0;
  subscriptions: Subscription[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private alertService: AlertService, public dialogRef: MatDialogRef<ModalSweepstakeComponent>, private router: Router, private activityService: ActivityService) { }

  ngOnInit() {
    this.subscriptions.push(
    this.store.select('member').subscribe({
      next: (member) => {
        this.loyaltyId = member.loyaltyId;
      },
      error: (error) => {
        this.alertService.errorAlert(error?.error?.error || error?.message);
      }
    })
  )
  }

  submit() {
    this.isLoading = true;
    const payload = {
      "type": "Sweepstakes",
      "date": new Date().toISOString(),
      "srcChannelType": "Web",
      "loyaltyID": this.loyaltyId,
      "couponCode": ExternalCoupons.SWEEPSTAKES,
    };

    this.activityService.getActivity(payload, true).subscribe({
      next: (result: any) => {
        if (result.data.sweepStakesPoints > 0) {
          const pointsPurse = result.data.purses.find((purse) => purse.name === SpendCategory.POINTS);
          this.earnedPoints = pointsPurse.new - pointsPurse.prev;
          if (this.earnedPoints) {
            this.status = 'won';
          } else {
            this.dialogRef.close();
          }
        } else{
          this.status = 'lost';
        }
      },
      error: (error) => {
        this.dialogRef.close();
        this.alertService.errorAlert(error?.error?.error || error?.message);
      }
    }).add(() => {
      this.isLoading = false;
    });
  }

  redirect() {
    this.dialogRef.close(true);
    this.router.navigate(['/rewards'], { fragment: 'Vouchers' });
  }

  close(emit?) {
    this.dialogRef.close(emit)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe())
  }
}
