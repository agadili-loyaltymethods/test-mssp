import { Component, Inject, inject, OnDestroy } from '@angular/core';
import { ExternalCoupons } from '../../../enums/external-coupons';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { ActivityService } from '../../../services/activity.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../../loader/loader.component";
import { AlertService } from '../../../services/alert/alert.service';
import { SpendCategory } from '../../../enums/spend-category';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-quiz',
  standalone: true,
  imports: [FlexLayoutModule, MatButtonModule, MatIconModule, RouterModule, MatRadioModule, FormsModule, CommonModule, LoaderComponent],
  templateUrl: './modal-quiz.component.html',
  styleUrl: './modal-quiz.component.scss'
})
export class ModalQuizComponent implements OnDestroy{
  private store = inject(Store);
  radioOptions = ["Monte Carlo", "Las Vegas", "Macau", "Atlantic City"]
  selectedOption = '';
  status: null | "won" | "lost" = null;
  isLoading: boolean = false;
  loyaltyId: any;
  earnedPoints: number = 0;
  subscriptions: Subscription[] = [];

  constructor(private alertService: AlertService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ModalQuizComponent>, private router: Router, private activityService: ActivityService) { }

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
      "type": "Quiz",
      "date": new Date().toISOString(),
      "srcChannelType": "Web",
      "loyaltyID": this.loyaltyId,
      "couponCode": ExternalCoupons.QUIZ_WON,
    };

    const valid = this.selectedOption === 'Las Vegas';
    if (valid) {
      this.activityService.getActivity({ ...payload, ...(valid && { couponCode: ExternalCoupons.QUIZ_WON }) }, true).subscribe({
        next: (res: any) => {
          this.status = 'won';
          const pointsPurse = res.data.purses.find((purse) => purse.name === SpendCategory.POINTS);
          this.earnedPoints = pointsPurse.new - pointsPurse.prev;
          if (!this.earnedPoints) {
            this.dialogRef.close();
          }
        },
        error: (error) => {
          this.dialogRef.close();
          this.alertService.errorAlert(error?.error?.error || error?.message);
        }
      }).add(() => {
        this.isLoading = false;
      });
    } else {
      this.status = 'lost';
      this.isLoading = false;
    }

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
