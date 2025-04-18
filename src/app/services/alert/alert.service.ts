import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  snackBarRef: MatSnackBarRef<unknown> | undefined;

  constructor(private _snackBar: MatSnackBar) {}

  successAlert(message: string, action?: string, duration?: number) {
    action = action || 'Dismiss';
    this.snackBarRef = this._snackBar.open(message, action, {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: 'snack-success',
      duration: duration || 1500,
    });

    return this.snackBarRef;
  }

  errorAlert(message: string, action?: string, duration?: number) {
    action = action || 'Dismiss';
    this.snackBarRef = this._snackBar.open(message, action, {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: 'snack-warn',
      duration: duration || 0,
    });

    return this.snackBarRef;
  }

  infoAlert(message: string, action?: string) {
    action = action || 'Dismiss';
    this.snackBarRef = this._snackBar.open(message, action, {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: 'snack-info',
    });

    return this.snackBarRef;
  }

  closeAlert() {
    return this._snackBar.dismiss();
  }
}
