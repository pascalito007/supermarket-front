import {NgxPermissionsModule} from 'ngx-permissions';
// Angular
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
// Angular Material
import {MatButtonModule, MatProgressBarModule, MatTabsModule, MatTooltipModule} from '@angular/material';
// NgBootstrap
import {NgbProgressbarModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
// Translation
import {TranslateModule} from '@ngx-translate/core';
// Loading bar
import {LoadingBarModule} from '@ngx-loading-bar/core';
// NGRX
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
// Perfect Scrollbar
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
// SVG inline
import {InlineSVGModule} from 'ng-inline-svg';
// Core Module
import {CoreModule} from '../../core/core.module';
import {HeaderComponent} from './header/header.component';
import {SubheaderComponent} from './subheader/subheader.component';
import {BrandComponent} from './brand/brand.component';
import {TopbarComponent} from './header/topbar/topbar.component';
import {MenuHorizontalComponent} from './header/menu-horizontal/menu-horizontal.component';
import {PartialsModule} from '../partials/partials.module';
import {BaseComponent} from './base/base.component';
import {PagesModule} from '../pages/pages.module';
import {HtmlClassService} from './html-class.service';
import {HeaderMobileComponent} from './header/header-mobile/header-mobile.component';
import {ErrorPageComponent} from './content/error-page/error-page.component';
import {RoleEffects, rolesReducer} from '../../core/auth';

@NgModule({
  declarations: [
    BaseComponent,

    // headers
    HeaderComponent,
    BrandComponent,
    HeaderMobileComponent,

    // subheader
    SubheaderComponent,

    // topbar components
    TopbarComponent,

    // horizontal menu components
    MenuHorizontalComponent,

    ErrorPageComponent,
  ],
  exports: [
    BaseComponent,

    // headers
    HeaderComponent,
    BrandComponent,
    HeaderMobileComponent,

    // subheader
    SubheaderComponent,

    // topbar components
    TopbarComponent,

    // horizontal menu components
    MenuHorizontalComponent,

    ErrorPageComponent,
  ],
  providers: [
    HtmlClassService,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgxPermissionsModule.forChild(),
    StoreModule.forFeature('roles', rolesReducer),
    EffectsModule.forFeature([RoleEffects]),
    PagesModule,
    PartialsModule,
    CoreModule,
    PerfectScrollbarModule,
    FormsModule,
    MatProgressBarModule,
    MatTabsModule,
    MatButtonModule,
    MatTooltipModule,
    TranslateModule.forChild(),
    LoadingBarModule,
    InlineSVGModule,

    // ng-bootstrap modules
    NgbProgressbarModule,
    NgbTooltipModule,
  ]
})
export class ThemeModule {
}
