import { Component, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-return-confirmation',
  standalone: true,
  imports: [FlexLayoutModule, MatButtonModule, MatIconModule],
  templateUrl: './return-confirmation.component.html',
  styleUrl: './return-confirmation.component.scss'
})
export class ReturnConfirmationComponent {
  public dialogRef = inject(MatDialogRef<ReturnConfirmationComponent>);

  close(confirmed: boolean){
    this.dialogRef.close(confirmed);
  }
}
