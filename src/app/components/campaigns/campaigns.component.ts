import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivityService } from '../../services/activity.service';
import { LoaderComponent } from "../loader/loader.component";
import { AlertService } from '../../services/alert/alert.service';
import { NoDataComponent } from "../common/no-data/no-data.component";

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [
    FlexLayoutModule,
    MatCardModule,
    MatButtonModule,
    CommonModule,
    MatProgressBarModule,
    LoaderComponent,
    NoDataComponent
],
  templateUrl: './campaigns.component.html',
  styleUrl: './campaigns.component.scss'
})
export class CampaignsComponent {
  campaigns: any = [];
  isLoading: boolean = true;
  staticDate = new Date('10/11/2024');

  constructor(private activityService: ActivityService, private alertService: AlertService){}

  ngOnInit(){
    this.activityService.getCoupons().subscribe({
      next: (campaigns) => this.campaigns = campaigns,
      error: (error) => this.alertService.errorAlert(error?.error?.error || error?.message),
    }).add(() => this.isLoading = false);
  }

}
