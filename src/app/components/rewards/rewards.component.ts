import { Component, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Reward } from '../../enums/reward';
import { OffersComponent } from '../offers/offers.component';
import { EarnedBenefitsComponent } from '../earned-benefits/earned-benefits.component';
import { ClippableCouponsComponent } from '../clippable-coupons/clippable-coupons.component';
import { SweepstakesComponent } from "../sweepstakes/sweepstakes.component";
import { RewardsWalletComponent } from '../rewards-wallet/rewards-wallet.component';
import { QuizComponent } from '../quiz/quiz.component';

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [
    FlexLayoutModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    FormsModule,
    EarnedBenefitsComponent,
    RewardsWalletComponent,
    OffersComponent,
    ClippableCouponsComponent,
    SweepstakesComponent,
    QuizComponent
],
  templateUrl: './rewards.component.html',
  styleUrl: './rewards.component.scss'
})
export class RewardsComponent implements OnInit {
  tabUrl: string[] = Object.values(Reward);
  selectedIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.fragment.subscribe((fragment) => {
      const tabIndex = this.tabUrl.findIndex((tab) => tab === fragment);
      this.selectedIndex = tabIndex > 0 ? tabIndex : 0;
      this.router.navigate([], { fragment: this.tabUrl[this.selectedIndex] })
    });
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
    this.router.navigate([], { fragment: this.tabUrl[this.selectedIndex] })
  }

}
