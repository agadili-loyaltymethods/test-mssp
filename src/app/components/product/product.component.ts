import { Component, Input, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { addItem, removeItem } from '../../states/actions/cart.action';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AlertService } from '../../services/alert/alert.service';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { UnsubscribeComponent } from '../common/unsubscribe/unsubscribe.component';
import { StandardCurrencyPipe } from "../../pipes/standard-currency/standard-currency.pipe";
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [FlexLayoutModule, CommonModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatSelectModule, StandardCurrencyPipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent extends UnsubscribeComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  readonly hemming = 'Hemming';
  @Input() product;
  cartItems: any[] = [];
  quantity: number = 1;

  constructor(private alertService: AlertService) {
    super();
    this.subscriptions.push(
      this.store.select('cart').subscribe((cart) => {
        this.cartItems = cart.items;
        if (this.product?.sku && this.isInCart()) {
          this.quantity = this.cartItems.find(x => x.sku === this.product.sku).quantity
        }else{
          this.quantity = 1;
        }
      })
    )
  }

  ngOnInit() {
    this.subscriptions.push(
      this.store.select('cart').subscribe((cart) => {
        this.cartItems = cart.items;
        if (this.product?.sku && this.isInCart() ) {
          this.quantity = this.cartItems.find(x => x.sku === this.product.sku).quantity
        }else{
          this.quantity = 1;
        }
      })
    )
  }


  addToCart() {
    this.store.dispatch(addItem({ item: {...this.product, quantity: this.quantity} }));
    this.alertService.successAlert(`Item successfully added to your cart.`, 'Go to Cart')
    .onAction()
    .subscribe(() => this.router.navigate(['checkout']));
  }

  removeFromCart() {
    this.quantity = 1;
    this.store.dispatch(removeItem({ itemId: this.product.sku }));
    this.alertService.successAlert(`Item successfully removed from your cart.`, 'Go to Cart')
    .onAction()
    .subscribe(() => this.router.navigate(['checkout']));
  }

  isInCart(): boolean {
    return !!this.cartItems.find(x => x.sku === this.product.sku)
  }

  onSelectionChange(event: MatSelectChange, product) {
    product.quantity = event.value;
    this.store.dispatch(addItem({ item: { ...this.product, quantity: this.quantity } }))
  }

}
