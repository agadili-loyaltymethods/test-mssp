import { Component, Inject, inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ExternalCoupons } from '../../../enums/external-coupons';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { ActivityService } from '../../../services/activity.service';
import { AlertService } from '../../../services/alert/alert.service';
import { LoaderComponent } from '../../loader/loader.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-revert-reward',
  standalone: true,
  imports: [FlexLayoutModule, MatButtonModule, LoaderComponent],
  templateUrl: './revert-reward.component.html',
  styleUrl: './revert-reward.component.scss'
})
export class RevertRewardComponent implements OnDestroy{
  private store = inject(Store);

  isLoading: boolean = false;
  loyaltyId: any;
  subscriptions: Subscription[] = [];

  constructor(private alertService: AlertService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<RevertRewardComponent>, private router: Router, private activityService: ActivityService) { }

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
      "type": "Cancellation",
      "date": new Date().toISOString(),
      "srcChannelType": "Web",
      "loyaltyID": this.loyaltyId,
      "couponCode": this.data.activity,
    };

    this.activityService.getActivity(payload, true).subscribe({
      next: (data) => {
        this.isLoading = false;
        this.redirect();
      },
      error: (error) => {
        this.alertService.errorAlert(error?.error?.error || error?.message);
        this.isLoading = false
      }
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
