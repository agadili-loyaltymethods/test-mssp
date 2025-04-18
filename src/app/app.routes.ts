import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PurchaseHistoryComponent } from './components/purchase-history/purchase-history.component';
import { PurchaseComponent } from './components/purchase/purchase.component';
import { RewardsComponent } from './components/rewards/rewards.component';

import { CheckoutComponent } from './components/checkout/checkout.component';
import { PurchaseConfirmationComponent } from './components/purchase-confirmation/purchase-confirmation.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    { path: 'page-not-found', component: PageNotFoundComponent },
    {
        path: '',
        canActivateChild: [
            authGuard
        ],
        //Guarded routes
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'purchase', component: PurchaseComponent },
            { path: 'rewards', component: RewardsComponent },
            { path: 'purchase-history', component: PurchaseHistoryComponent },
            { path: 'checkout', component: CheckoutComponent },
            { path: 'purchase-confirmation', component: PurchaseConfirmationComponent },
        ]
    },
    { path: '**', redirectTo: 'page-not-found' },

];
