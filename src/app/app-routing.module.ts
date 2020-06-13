// Angular
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
// Components
import {BaseComponent} from './views/theme/base/base.component';
import {ErrorPageComponent} from './views/theme/content/error-page/error-page.component';
// Auth
import {AngularFireAuthGuard, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {OrdersListComponent} from './views/pages/apps/e-commerce/orders/orders-list/orders-list.component';

const redirectUnAuthorizedToLogin = () => redirectUnauthorizedTo(['/auth/login']);
const routes: Routes = [
  {path: 'auth', loadChildren: () => import('app/views/pages/auth/auth.module').then(m => m.AuthModule)},

  {
    path: '',
    component: BaseComponent,
    children: [
      {
        path: 'dashboard',
        canActivate: [AngularFireAuthGuard],
        data: {authGuardPipe: redirectUnAuthorizedToLogin},
        loadChildren: () => import('app/views/pages/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'ecommerce',
        loadChildren: () => import('app/views/pages/apps/e-commerce/e-commerce.module').then(m => m.ECommerceModule),
      },
      {
        path: 'user-management',
        loadChildren: () => import('app/views/pages/user-management/user-management.module').then(m => m.UserManagementModule)
      },
      {
        path: 'orders',
        component: OrdersListComponent
      },
      {
        path: 'error/403',
        component: ErrorPageComponent,
        data: {
          type: 'error-v6',
          code: 403,
          title: '403... Access forbidden',
          desc: 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator'
        }
      },
      {path: 'error/:type', component: ErrorPageComponent},
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
    ]
  },

  {path: '**', redirectTo: 'error/403', pathMatch: 'full'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
