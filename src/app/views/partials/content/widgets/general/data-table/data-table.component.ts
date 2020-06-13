// Angular
import {Component, OnInit, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator, MatSort} from '@angular/material';
// RXJS
import {QueryParamsModel} from '../../../../../../core/_base/crud';
// Layout
import {DataTableItemModel} from '../../../../../../core/_base/layout';
import {DataTableDataSource} from './data-table.data-source';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'kt-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  // Public properties
  dataSource: DataTableDataSource;
  displayedColumns = ['uniq_id', 'product_name', 'manufacturer', 'number_available_in_stock', 'price'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  selection = new SelectionModel<DataTableItemModel>(true, []);


  constructor(private db: AngularFireDatabase) {
  }


  ngOnInit() {
    // Init DataSource
    this.dataSource = new DataTableDataSource(this.db);
    // First load
    this.loadItems(true);
  }

  /**
   * Load items
   *
   * @param firstLoad: boolean
   */
  loadItems(firstLoad: boolean = false) {
    const queryParams = new QueryParamsModel(
      {},
      this.sort.direction,
      this.sort.active,
      this.paginator && this.paginator.pageIndex,
      firstLoad ? 6 : this.paginator.pageSize
    );
    this.selection.clear();
  }

  /* UI */

  /**
   * Returns item status
   *
   * @param status: number
   */
  getItemStatusString(status: number = 0): string {
    switch (status) {
      case 0:
        return 'Selling';
      case 1:
        return 'Sold';
    }
    return '';
  }

  /**
   * Returens item CSS Class Name by status
   *
   * @param status: number
   */
  getItemCssClassByStatus(status: number = 0): string {
    switch (status) {
      case 0:
        return 'success';
      case 1:
        return 'info';
    }
    return '';
  }

  /**
   * Returns item condition
   *
   * @param condition: number
   */
  getItemConditionString(condition: number = 0): string {
    switch (condition) {
      case 0:
        return 'New';
      case 1:
        return 'Used';
    }
    return '';
  }

  /**
   * Returns CSS Class name by condition
   *
   * @param condition: number
   */
  getItemCssClassByCondition(condition: number = 0): string {
    switch (condition) {
      case 0:
        return 'success';
      case 1:
        return 'info';
    }
    return '';
  }
}
