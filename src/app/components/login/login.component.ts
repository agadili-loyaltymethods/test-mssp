import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlertService } from '../../services/alert/alert.service';
import { LoginService } from '../../services/login/login.service';
import { MemberInfo } from '../../models/member-info';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { filter, Subscription } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FlexLayoutModule,
    MatCheckboxModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    RouterModule,
    MatProgressBarModule,
    MatCardModule,
    MatDividerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  // route = inject(ActivatedRoute);
  // showLoginProgress: boolean = false;
  // loginForm: FormGroup = this.fb.group({});
  // private queryParamSub: Subscription | undefined;

  // constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router, private alert: AlertService) { }

  // ngOnInit(): void {
  //   localStorage.clear();
  //   this.loginForm = this.fb.group({
  //     username: ['', [Validators.required, Validators.email]],
  //     password: ['', [Validators.required]]
  //   });
  //   this.queryParamSub = this.route.queryParamMap.pipe(
  //     filter(params => params.has('email'))
  //   ).subscribe(params => {
  //     this.loginForm.get(['username'])?.setValue(atob(params.get('email') || ''));
  //   });
  // }

  // onSubmit() {
  //   this.showLoginProgress = true;
  //   this.loginForm.disable();
  //   this.loginService
  //     .login(this.loginForm.value)
  //     .subscribe({
  //       next: (res: MemberInfo) => {
  //         localStorage.setItem('accessToken', res.accessToken);
  //         localStorage.setItem('idToken', res.idToken);
  //         localStorage.setItem('refreshToken', res.refreshToken);
  //         this.router.navigate(['/dashboard']);
  //       },
  //       error: (error) => {
  //         this.alert.errorAlert(error?.error?.error || error?.message);
  //         this.showLoginProgress = false;
  //         this.loginForm.enable();
  //       },
  //     })
  // }

  // ngOnDestroy(): void {
  //   if (this.queryParamSub) {
  //     this.queryParamSub.unsubscribe();
  //   }
  // }
}
