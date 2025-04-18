// src/app/services/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthHelper } from '../../helpers/auth/auth.helper';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(AuthHelper.isAuthenticated());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.updateAuthStatus();
  }

  updateAuthStatus(): void {
    const isAuthenticated = AuthHelper.isAuthenticated();
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  login(token: string): void {
    AuthHelper.setToken(token);
    this.updateAuthStatus();
  }

  logout(): void {
    AuthHelper.removeToken();
    this.updateAuthStatus();
  }
}