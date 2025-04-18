import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { GeneralConstants } from '../../constants/general-constants';
import { AlertService } from '../../services/alert/alert.service';
import { MemberService } from '../../services/member/member.service';
import { CardMiniSkeletonComponent } from "../card-mini-skeleton/card-mini-skeleton.component";
import { ModalSweepstakeComponent } from '../modals/modal-sweepstake/modal-sweepstake.component';
import { Subscription } from 'rxjs';
import { ExpiryCheckPipe } from "../../pipes/expiry-check.pipe";
import { SweepstakesConstant } from '../../constants/sweepstakes.constants';
import { NoDataComponent } from "../common/no-data/no-data.component";

@Component({
  selector: 'app-sweepstakes',
  standalone: true,
  imports: [FlexLayoutModule, CommonModule, MatCardModule, MatButtonModule, MatDialogModule, CardMiniSkeletonComponent, ExpiryCheckPipe, NoDataComponent],
  templateUrl: './sweepstakes.component.html',
  styleUrl: './sweepstakes.component.scss'
})
export class SweepstakesComponent implements OnDestroy {
  private store = inject(Store);
  isLoading = false;
  sweepstakes: any = SweepstakesConstant;
  claimedTimes = 0;
  claimLimit = GeneralConstants.externalCouponsLimit;
  memberPoints: any = 0;
  subscriptions: Subscription[] = [];

  constructor(public dialog: MatDialog, private memberService: MemberService, private alertService: AlertService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.store.select('member').subscribe({
        next: (member) => {
          // this.isLoading = true;
          this.memberPoints = member.purses[0].availBalance;
        },
        error: (error) => {
          this.alertService.errorAlert(error?.error?.error || error?.message);
        }
      })
    )
  }

  showSweepstake(sweepstake) {
    setTimeout(() => {
      this.dialog.open(ModalSweepstakeComponent, {
        disableClose: true,
        data: sweepstake
      }).afterClosed().subscribe((result) => {
        if (result) {
          this.claimedTimes++;
          this.memberService.refreshMember();
        }
      })
    }, 1)
  }

  
  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

}
