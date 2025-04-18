import { Component, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-common-modal',
  standalone: true,
  imports: [MatDialogModule, FlexLayoutModule, MatButtonModule,],
  templateUrl: './common-modal.component.html',
  styleUrl: './common-modal.component.scss'
})
export class CommonModalComponent {
  data: {
    title?: string,
    body: string,
    primaryBtnLabel?: string,
    secondaryBtnLabel?:string,
  } = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<CommonModalComponent>)

  confirm(){
    this.dialogRef.close(true);
  }

}
