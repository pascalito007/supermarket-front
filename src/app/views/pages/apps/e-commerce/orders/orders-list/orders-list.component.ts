// Angular
import {Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
// Material
import {MatPaginator, MatSort, MatDialog} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
// RXJS
import {debounceTime, distinctUntilChanged, tap, skip, delay} from 'rxjs/operators';
import {fromEvent, merge, Observable, of, Subscription} from 'rxjs';
// NGRX
import {Store, select} from '@ngrx/store';
import {AppState} from '../../../../../../core/reducers';
// UI
import {SubheaderService} from '../../../../../../core/_base/layout';
// CRUD
import {LayoutUtilsService, MessageType, QueryParamsModel} from '../../../../../../core/_base/crud';
// Services and Models
import {
  ProductModel,
  ProductsDataSource,
  ProductsPageRequested,
  OneProductDeleted,
  ManyProductsDeleted,
  ProductsStatusUpdated,
  selectProductsPageLastQuery
} from '../../../../../../core/e-commerce';
import {AngularFireDatabase} from '@angular/fire/database';
import {FirebaseListObservable} from '@angular/fire/database-deprecated';
import {v4 as uuid} from 'uuid';
import {OrderModel} from '../../../../../../core/e-commerce/_models/order.model';
import {OrdersDataSource} from '../../../../../../core/e-commerce/_data-sources/orders.datasource';


@Component({
  selector: 'kt-orders-list',
  templateUrl: './orders-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersListComponent implements OnInit, OnDestroy {
  // Table fields
  dataSource: OrdersDataSource;
  displayedColumns = ['select', 'uniq_id', 'user_id', 'product_id', 'qte', 'unit_price', 'date_time', 'confirmed'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('sort1', {static: true}) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
  filterStatus = '';
  filterCondition = '';
  lastQuery: QueryParamsModel;
  // Selection
  selection = new SelectionModel<OrderModel>(true, []);
  productsResult: OrderModel[] = [];
  private subscriptions: Subscription[] = [];


  constructor(public dialog: MatDialog,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private subheaderService: SubheaderService,
              private layoutUtilsService: LayoutUtilsService,
              private store: Store<AppState>, private db: AngularFireDatabase) {
  }


  ngOnInit() {
    // If the user changes the sort order, reset back to the first page.
    const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.subscriptions.push(sortSubscription);


    const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => this.loadProductsList())
    )
      .subscribe();
    this.subscriptions.push(paginatorSubscriptions);

    // Filtration, bind to searchInput
    const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      debounceTime(150),
      distinctUntilChanged(),
      tap(() => {
        this.paginator.pageIndex = 0;
        this.loadProductsList();
      })
    )
      .subscribe();
    this.subscriptions.push(searchSubscription);

    // Set title to page breadCrumbs
    this.subheaderService.setTitle('Commandes Clients');

    // Init DataSource
    this.dataSource = new OrdersDataSource(this.db);
    const entitiesSubscription = this.dataSource.entitySubject.pipe(
      skip(1),
      distinctUntilChanged()
    ).subscribe(res => {
      this.productsResult = res;
    });
    this.subscriptions.push(entitiesSubscription);
    const lastQuerySubscription = this.store.pipe(select(selectProductsPageLastQuery)).subscribe(res => this.lastQuery = res);
    // Load last query from store
    this.subscriptions.push(lastQuerySubscription);

    // Read from URL itemId, for restore previous state
    const routeSubscription = this.activatedRoute.queryParams.subscribe(params => {
      if (params.id) {
        this.restoreState(this.lastQuery, +params.id);
      }

      // First load
      of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line, just loading imitation
        this.loadProductsList();
      }); // Remove this line, just loading imitation
    });
    this.subscriptions.push(routeSubscription);
  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  /**
   * Load Products List
   */
  loadProductsList() {
    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    // Call request from server
    this.store.dispatch(new ProductsPageRequested({page: queryParams}));
    this.selection.clear();
  }

  /**
   * Returns object for filter
   */
  filterConfiguration(): any {
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;

    if (this.filterStatus && this.filterStatus.length > 0) {
      filter.status = +this.filterStatus;
    }

    if (this.filterCondition && this.filterCondition.length > 0) {
      filter.condition = +this.filterCondition;
    }

    filter.model = searchText;

    filter.manufacture = searchText;
    filter.color = searchText;
    filter.VINCode = searchText;
    return filter;
  }

  /**
   * Restore state
   *
   * @param queryParams: QueryParamsModel
   * @param id: number
   */
  restoreState(queryParams: QueryParamsModel, id: number) {

    if (!queryParams.filter) {
      return;
    }

    if ('condition' in queryParams.filter) {
      this.filterCondition = queryParams.filter.condition.toString();
    }

    if ('status' in queryParams.filter) {
      this.filterStatus = queryParams.filter.status.toString();
    }

    if (queryParams.filter.model) {
      this.searchInput.nativeElement.value = queryParams.filter.model;
    }
  }

  /* UI */
  /**
   * Returns status string
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
   * Returns CSS Class by status
   *
   * @param status: number
   */
  getItemCssClassByStatus(status: number = 0): string {
    switch (status) {
      case 0:
        return 'success';
      case 1:
        return 'metal';
    }
    return '';
  }

  /**
   * Rerurns condition string
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
   * Returns CSS Class by condition
   *
   * @param condition: number
   */
  getItemCssClassByCondition(condition: number = 0): string {
    switch (condition) {
      case 0:
        return 'accent';
      case 1:
        return 'primary';
    }
    return '';
  }
}

