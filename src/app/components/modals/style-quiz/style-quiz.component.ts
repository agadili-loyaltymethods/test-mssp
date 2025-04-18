import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { LoaderComponent } from '../../loader/loader.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-style-quiz',
  standalone: true,
  imports: [MatSelectModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, LoaderComponent, FlexLayoutModule, MatButtonModule, MatRadioModule],
  templateUrl: './style-quiz.component.html',
  styleUrl: './style-quiz.component.scss'
})
export class StyleQuizComponent {
  isLoading: boolean = true;

  qtn1Options = [
    'Classic & Timeless: Structured blazers, tailored trousers, and neutral tones.',
    'Casual & Laid-Back: Comfy jeans, cozy sweaters, and sneakers.',
   'Trendy & Bold: Statement pieces, bright colors, and the latest fashion trends.',
   'Minimalist & Clean: Simple silhouettes, neutral colors, and versatile basics.'
  ]

  qtn2Options = [
    'A chic blazer with skinny jeans: Effortlessly polished yet casual.',
    'A comfy sweater with leggings: Relaxed and cozy.',
   'A floral sundress with sandals: Playful and feminine.',
   'An edgy leather jacket with boots: Cool and confident.'
  ]

  selectedQtn1Option = '';
  selectedQtn2Option = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<StyleQuizComponent>, private fb: FormBuilder,) { }

  ngOnInit() {
    this.isLoading = false;
  }

  submit() {
    this.dialogRef.close(true)
  }

  close(emit?) {
    this.dialogRef.close(false)
  }
}
