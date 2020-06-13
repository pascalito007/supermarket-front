// Angular
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
// Translate Module
import {TranslateModule} from '@ngx-translate/core';
// NGRX
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
// UI
import {PartialsModule} from '../../../partials/partials.module';
// Core
// Auth
import {ModuleGuard} from '../../../../core/auth';
// Core => Services
import {
  productsReducer,
  ProductEffects,
  ProductsService,
} from '../../../../core/e-commerce';
// Core => Utils
import {
  HttpUtilsService,
  TypesUtilsService,
  InterceptService,
  LayoutUtilsService
} from '../../../../core/_base/crud';
// Shared
import {
  ActionNotificationComponent,
  DeleteEntityDialogComponent,
  FetchEntityDialogComponent,
  UpdateStatusDialogComponent
} from '../../../partials/content/crud';
// Components
import {ECommerceComponent} from './e-commerce.component';
// Products
import {ProductsListComponent} from './products/products-list/products-list.component';
import {ProductEditComponent} from './products/product-edit/product-edit.component';
// Orders
import {OrdersListComponent} from './orders/orders-list/orders-list.component';
// Material
import {
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatSelectModule,
  MatMenuModule,
  MatProgressBarModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatTabsModule,
  MatNativeDateModule,
  MatCardModule,
  MatRadioModule,
  MatIconModule,
  MatDatepickerModule,
  MatAutocompleteModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatSnackBarModule,
  MatTooltipModule
} from '@angular/material';
import {environment} from '../../../../../environments/environment';
import {CoreModule} from '../../../../core/core.module';
import {NgbProgressbarModule, NgbProgressbarConfig} from '@ng-bootstrap/ng-bootstrap';
import {NgxPermissionsModule} from 'ngx-permissions';

// tslint:disable-next-line:class-name
const routes: Routes = [
  {
    path: '',
    component: ECommerceComponent,
    // canActivate: [ModuleGuard],
    // data: { moduleName: 'ecommerce' },
    children: [
      {path: '', redirectTo: 'customers', pathMatch: 'full'},
      {path: 'orders', component: OrdersListComponent},
      {path: 'products', component: ProductsListComponent},
      {path: 'products/add', component: ProductEditComponent},
      {path: 'products/edit', component: ProductEditComponent},
      {path: 'products/edit/:id', component: ProductEditComponent},
    ]
  }
];

@NgModule({
  imports: [
    MatDialogModule,
    CommonModule,
    HttpClientModule,
    PartialsModule,
    NgxPermissionsModule.forChild(),
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    MatButtonModule,
    MatMenuModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatIconModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,
    NgbProgressbarModule,
    StoreModule.forFeature('products', productsReducer),
    EffectsModule.forFeature([ProductEffects]),
  ],
  providers: [
    ModuleGuard,
    InterceptService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptService,
      multi: true
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        panelClass: 'kt-mat-dialog-container__wrapper',
        height: 'auto',
        width: '900px'
      }
    },
    TypesUtilsService,
    LayoutUtilsService,
    HttpUtilsService,
    ProductsService,
    TypesUtilsService,
    LayoutUtilsService
  ],
  entryComponents: [
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
  ],
  declarations: [
    ECommerceComponent,
    // Orders
    OrdersListComponent,
    // Products
    ProductsListComponent,
    ProductEditComponent,
  ]
})
export class ECommerceModule {
}
