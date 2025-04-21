import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { filter, take } from 'rxjs';
import { ProductHelper } from '../../helpers/product/product.helper';
import { AlertService } from '../../services/alert/alert.service';
import { ProductService } from '../../services/product/product.service';
import { ProductComponent } from '../product/product.component';
import { UnsubscribeComponent } from '../common/unsubscribe/unsubscribe.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NoDataComponent } from "../common/no-data/no-data.component";

@Component({
  selector: 'app-purchase',
  standalone: true,
  imports: [MatChipsModule, ProductComponent, FlexLayoutModule, MatIconModule, MatButtonModule, MatCardModule, CommonModule, NoDataComponent],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.scss'
})
export class PurchaseComponent extends UnsubscribeComponent implements OnInit, OnDestroy {
  private productService: ProductService = inject(ProductService);
  private alertService: AlertService = inject(AlertService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);

  allProducts: any = [];
  filteredProducts:any = [];
  allCategories: string[] = [];
  selectedCategory:string = '';
  isLoading = false;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.isLoading = true;
    // Using take(1) to unsubscribe after taking 1 value
    this.productService.getProducts().pipe(take(1)).subscribe({
      next: (products) => {
        // Process products
        this.allCategories = ProductHelper.getCategories(products);
        this.allProducts = products;
    
        // Navigate to the first category (if exists)
        if (this.allCategories.length > 0) {
          this.router.navigate([], { fragment: this.allCategories[0] });
        }
    
        // Subscribe to fragment changes
        const fragmentSubscription = this.route.fragment.pipe(filter(Boolean)).subscribe((fragment) => {
          this.selectCategory(fragment);
        });
    
        // Add subscription to the subscription array
        this.subscriptions.push(fragmentSubscription);
      },
      error: (error) => {
        this.alertService.errorAlert(error?.error?.error || error?.message);
      }
    }).add(() => this.isLoading = false);

    
  }
  selectCategory(category: string) {
    this.selectedCategory = category;
    this.router.navigate([], { fragment: category });
    this.filteredProducts = this.allProducts.filter(x => x.category === category)
  }

}
