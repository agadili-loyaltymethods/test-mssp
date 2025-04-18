import { Component, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { AlertService } from '../../services/alert/alert.service';
import { LocationService } from '../../services/location/location.service';
import { setLocation } from '../../states/actions/location.action';
import { UnsubscribeComponent } from '../common/unsubscribe/unsubscribe.component';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [FlexLayoutModule, MatButtonModule, MatMenuModule, MatIconModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.scss'
})
export class LocationsComponent extends UnsubscribeComponent {

  private locationService = inject(LocationService);
  private alertService = inject(AlertService);
  private store = inject(Store);

  formCtrl: FormControl = new FormControl('');
  allLocations: any = [];

  constructor() {
    super();
  }

  ngOnInit() {
    this.locationService.getLocations().pipe(take(1)).subscribe({
      next: (locations) => {
        this.allLocations = locations.filter((location) => !location.ext.hideInMSSP);
        this.formCtrl.setValue(this.allLocations[0].name);
        this.setLocation();
      },
      error: (error) => {
        this.alertService.errorAlert(error?.error?.error || error?.message);
      }
    });
  }

  setLocation() {
    this.store.dispatch(setLocation({ location: this.allLocations.find((location) => location.name === this.formCtrl.value).number }));
  }

}
