import { Component, inject, OnDestroy } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from '../../services/alert/alert.service';
import { LoginService } from '../../services/login/login.service';


@Component({
  selector: 'app-enroll',
  standalone: true,
  imports: [FlexLayoutModule, MatCardModule, ReactiveFormsModule, RouterModule,  MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule, MatDividerModule],
  templateUrl: './enroll.component.html',
  styleUrl: './enroll.component.scss'
})
export class EnrollComponent {
  // route = inject(ActivatedRoute);
  // alert = inject(AlertService);
  // router = inject(Router);
  // loginService = inject(LoginService);
  // dialog = inject(MatDialog)
  
  // formGroup: FormGroup = new FormGroup({})
  // private queryParamSub: Subscription | undefined;

  // constructor() {
  //   this.initForm();
  // }

  // initForm(){
  //   this.formGroup = new FormGroup({
  //     email: new FormControl(null, [Validators.required, Validators.email]),
  //     password: new FormControl(null, [Validators.required]),
  //     confirmPassword: new FormControl(null, [Validators.required]),
  //     firstName: new FormControl(null, [Validators.required]),
  //     lastName: new FormControl(null, [Validators.required]),
  //   }, {
  //     validators:  this.passwordMatchValidator('password', 'confirmPassword')
  //   })
  // }

  // passwordMatchValidator(password: string, confirmPassword: string): ValidatorFn {
  //   return (formGroup: AbstractControl): ValidationErrors | null => {
  //     const passwordControl = formGroup.get(password);
  //     const confirmPasswordControl = formGroup.get(confirmPassword);
  
  //     if (!passwordControl || !confirmPasswordControl) {
  //       return null;
  //     }
  
  //     const isMatch = passwordControl.value === confirmPasswordControl.value;
  //     return isMatch ? null : { passwordMismatch: true };
  //   };
  // }

  // submit(){
  //   if (this.formGroup.valid) {
  //     this.loginService.enroll(this.formGroup.value).subscribe(
  //       {
  //         next: (res: { status: string }) => {
  //           if (res.status === 'success') {
  //             this.alert.successAlert('Enrollment successful. Please proceed to log in.');
  //             this.router.navigate(['login'], { queryParams: {email: btoa(this.formGroup.value.email)}});
  //           }
  //         },
  //         error: (error) => {
  //           this.alert.errorAlert(error?.error?.error || error?.message);
  //         },
  //       }
  //     )
  //   }
  // }

  // ngOnDestroy(): void {
  //   if (this.queryParamSub) {
  //     this.queryParamSub.unsubscribe();
  //   }
  // }
}