import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { removeItem } from '../../states/actions/cart.action';
import { UnsubscribeComponent } from '../common/unsubscribe/unsubscribe.component';
import { StandardCurrencyPipe } from "../../pipes/standard-currency/standard-currency.pipe";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MatMenuModule, FlexLayoutModule, CommonModule, MatIconModule, MatButtonModule, RouterModule, StandardCurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent extends UnsubscribeComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  
  cartItems: any;
  totalItems = 0;
  totalPrice = 0;
  isFetching: boolean = false;

  constructor(){ super(); }

  ngOnInit() {
    this.subscriptions.push(
      this.store.select('cart').subscribe((cart) => {
        if (cart.items.length === 1 && cart.items[0]?.lineItems) {
          const lineItems = cart.items[0].lineItems.map((item) => {
            return {...(item.product), 'quantity': item.quantity}
          })
          this.cartItems = lineItems.filter(item => !item?.ext?.hideInMSSP)
        } else {
          this.cartItems = cart.items.filter(item => !item?.type);
        }
        if (this.cartItems.length) {
          this.totalItems = this.cartItems.reduce((totalItems, item) => totalItems + item.quantity, 0)
          this.totalPrice = this.cartItems.reduce((totalPrice, item) => totalPrice + (item.cost * item.quantity), 0);
        } else {
          this.totalItems = 0;
          this.totalPrice = 0;
        }
      })
    )
  }

  removeFromCart(product) {
    this.store.dispatch(removeItem({ itemId: product.sku }));
  }
}