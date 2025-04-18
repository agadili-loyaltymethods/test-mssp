import { Component, inject, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { clearCart } from '../../states/actions/cart.action';

@Component({
  selector: 'app-purchase-confirmation',
  standalone: true,
  imports: [
    RouterModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './purchase-confirmation.component.html',
  styleUrl: './purchase-confirmation.component.scss'
})
export class PurchaseConfirmationComponent implements OnInit{
  private store = inject(Store);

  ngOnInit(){
    this.store.dispatch(clearCart());
  }

}
