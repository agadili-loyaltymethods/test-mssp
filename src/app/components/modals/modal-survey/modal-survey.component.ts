import { Component, Inject, inject, OnDestroy } from '@angular/core';
import { ExternalCoupons } from '../../../enums/external-coupons';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { ActivityService } from '../../../services/activity.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { LoaderComponent } from "../../loader/loader.component";
import { AlertService } from '../../../services/alert/alert.service';
import { SpendCategory } from '../../../enums/spend-category';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-survey',
  standalone: true,
  imports: [FlexLayoutModule, MatButtonModule, MatChipsModule, MatIconModule, RouterModule, CommonModule, MatButton, MatRadioModule, MatFormFieldModule, FormsModule, LoaderComponent],
  templateUrl: './modal-survey.component.html',
  styleUrl: './modal-survey.component.scss'
})
export class ModalSurveyComponent implements OnDestroy{
  private store = inject(Store);

  isCompleted = false;
  isLoading: boolean = false;
  loyaltyId: any;
  radioOptions = ["Upto $2,500","$2,501 to $5,000", "$5,001 to $10,000", "Above $10,000"]
  selectedOption = '';
  selectedChip = '';
  earnedPoints: number = 0;
  subscriptions: Subscription[] = [];


  constructor(private alertService: AlertService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ModalSurveyComponent>, private router: Router, private activityService: ActivityService) { }

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
      "type": "Survey",
      "date": new Date().toISOString(),
      "srcChannelType": "Web",
      "loyaltyID": this.loyaltyId,
      "couponCode": ExternalCoupons.SURVEY,
    };

    this.activityService.getActivity(payload, true).subscribe({
      next: (res: any) => {
        const pointsPurse = res.data.purses.find((purse) => purse.name === SpendCategory.ANY_WHERE_POINTS);
        if (pointsPurse) {
          this.earnedPoints = pointsPurse.new - pointsPurse.prev;
          if (res.data?.streakBonus) {
            this.earnedPoints = this.earnedPoints - res.data.streakBonus;
          }
          if (this.earnedPoints) {
            this.isCompleted = true;
          } else {
            this.dialogRef.close();
          }
        } else {
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
