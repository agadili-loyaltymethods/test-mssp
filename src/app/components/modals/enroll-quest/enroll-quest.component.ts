import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { LoaderComponent } from '../../loader/loader.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-enroll-quest',
  standalone: true,
  imports: [MatSelectModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, LoaderComponent, FlexLayoutModule, MatButtonModule],
  templateUrl: './enroll-quest.component.html',
  styleUrl: './enroll-quest.component.scss'
})
export class EnrollQuestComponent {


  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XLL'];
  brands: string[] = [];
  selectedBrand = new FormControl('');
  selectedSize = new FormControl('');

  brandsForm: FormGroup = this.fb.group({});
  isLoading: boolean = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EnrollQuestComponent>, private fb: FormBuilder,) { }

  ngOnInit() {
    this.brands = this.data.products.map((product) => product.style).filter(Boolean);
    this.brands = Array.from(new Set(this.brands));
    this.brandsForm = this.fb.group({
      brand: ['', [Validators.required]],
      size: ['', [Validators.required]]
    });
    this.isLoading = false;
  }

  close(emit?) {
    this.dialogRef.close(emit)
  }

}
