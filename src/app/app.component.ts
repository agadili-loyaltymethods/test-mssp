import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, map, Observable, of, Subscription } from 'rxjs';
import { HeaderComponent } from './components/header/header.component';
import { customIconPath, customIcons } from './constants/custom-icons';
import { AlertService } from './services/alert/alert.service';
import { AuthService } from './services/auth/auth.service';
import { MemberService } from './services/member/member.service';
import { addMember } from './states/actions/member.action';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    CommonModule,
    FlexLayoutModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  private readonly subscriptions: Subscription[] = [];
  private store = inject(Store);
  hasMember = false;
  isLogin = false;

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer, private auth: AuthService, private alertService: AlertService, private router: Router, private memberService: MemberService) {
    this.isAuthenticated$ = this.auth.isAuthenticated$;
    this.subscriptions.push(
      this.router?.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.isLogin = true;
          if (this.alertService.snackBarRef) {
            if (
              this.alertService.snackBarRef.containerInstance.snackBarConfig
                .panelClass !== 'snack-success'
            ) {
              this.alertService.closeAlert();
            }
          }
        } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
          this.isLogin = false; // Hide loader once navigation ends
        }
      }));

    customIcons.forEach(icon => {
      this.matIconRegistry.addSvgIcon(
        icon,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`${customIconPath}${icon}.svg`)
      );
    })
  }

  ngOnInit(): void {
    this.memberService.getMember(localStorage.getItem('loyaltyId') || '1001').pipe(
      map((member: any) => {
        member = member;
        this.store.dispatch(addMember({ member }));
        localStorage.setItem('loyaltyId', member.loyaltyId);
      }),
      catchError((error) => {
        this.alertService.errorAlert(error?.error?.error || error?.message);
        return of(false);
      })
    ).subscribe();
  }

}