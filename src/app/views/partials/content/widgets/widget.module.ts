import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MatButtonModule,
  MatIconModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
} from '@angular/material';
import {CoreModule} from '../../../../core/core.module';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
// Datatable
import {DataTableComponent} from './general/data-table/data-table.component';
// General widgets
import {Widget5Component} from './widget5/widget5.component';
import {Widget26Component} from './widget26/widget26.component';
import {Timeline2Component} from './timeline2/timeline2.component';

@NgModule({
  declarations: [
    DataTableComponent,
    // Widgets
    Widget5Component,
    Widget26Component,
    Timeline2Component,
  ],
  exports: [
    DataTableComponent,
    // Widgets
    Widget5Component,
    Widget26Component,
    Timeline2Component,
  ],
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    MatTableModule,
    CoreModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
  ]
})
export class WidgetModule {
}
