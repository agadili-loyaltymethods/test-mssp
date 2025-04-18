import { Component, Inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { LoaderComponent } from '../../loader/loader.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { StandardCurrencyPipe } from "../../../pipes/standard-currency/standard-currency.pipe";


@Component({
  selector: 'app-stylist-appointment',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, LoaderComponent, FlexLayoutModule, MatButtonModule, MatRadioModule, StandardCurrencyPipe],
  templateUrl: './stylist-appointment.component.html',
  styleUrl: './stylist-appointment.component.scss'
})
export class StylistAppointmentComponent {

  isLoading = true;
  products = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<StylistAppointmentComponent>, private fb: FormBuilder,) { }

  ngOnInit() {
    this.isLoading = false;
    this.products = this.data.products.filter((item) => item.name === 'Stylist Appointment');
  }

  submit() {
    this.dialogRef.close(true)
  }

  close(emit?) {
    this.dialogRef.close(false)
  }
}
