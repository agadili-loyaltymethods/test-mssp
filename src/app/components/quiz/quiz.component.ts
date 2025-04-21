import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { GeneralConstants } from '../../constants/general-constants';
import { ExpiryCheckPipe } from "../../pipes/expiry-check.pipe";
import { AlertService } from '../../services/alert/alert.service';
import { MemberService } from '../../services/member/member.service';
import { CardMiniSkeletonComponent } from "../card-mini-skeleton/card-mini-skeleton.component";
import { ModalSurveyComponent } from '../modals/modal-survey/modal-survey.component';
import { NoDataComponent } from "../common/no-data/no-data.component";
import { SurveyConstant } from '../../constants/survey.constants';

enum SurveyOrQuiz {
  SURVEY = 'Survey',
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [FlexLayoutModule, CommonModule, MatCardModule, MatButtonModule, CardMiniSkeletonComponent, ExpiryCheckPipe, NoDataComponent],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss'
})
export class QuizComponent {
  private store = inject(Store);
  isLoading = false;
  surveys: any = [SurveyConstant];

  surveyClaimedTimes = 0;
  claimLimit = GeneralConstants.externalCouponsLimit;
  quizClaimedTimes = 0;

  constructor(public dialog: MatDialog, private memberService: MemberService, private alertService: AlertService) { }

  openDialog(item) {
    this.alertService.closeAlert();
    const modalComponent: any =  ModalSurveyComponent;
    this.dialog.open(modalComponent, {
      disableClose: true,
      data: item
    }).afterClosed().subscribe((result) => {
      if(result){
        if(item.type === SurveyOrQuiz.SURVEY){
          this.surveyClaimedTimes++;
        }else{
          this.quizClaimedTimes++;
        }
        this.memberService.refreshMember();
      }
    })
  }

}
