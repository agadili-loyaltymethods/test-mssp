import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TokenDetailsHelper } from '../../helpers/token-details/token-details.helper';
import { LocationsComponent } from "../locations/locations.component";
import { ProfileComponent } from "../profile/profile.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FlexLayoutModule, RouterModule, MatIconModule, LocationsComponent, ProfileComponent, MatButtonModule, ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private tokenDetailsHelper: TokenDetailsHelper) {}
  openExternalLink(path: string, query: string = ''){
    this.tokenDetailsHelper.openExternalLink(path, query);
  }
}
