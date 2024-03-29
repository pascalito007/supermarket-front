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
import {v4 as uuid} from 'uuid';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'kt-products-list',
  templateUrl: './products-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsListComponent implements OnInit, OnDestroy {
  // Table fields
  dataSource: ProductsDataSource;
  displayedColumns = ['select', 'uniq_id', 'product_name', 'manufacturer', 'number_available_in_stock', 'price', 'actions'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('sort1', {static: true}) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
  filterStatus = '';
  filterCondition = '';
  lastQuery: QueryParamsModel;
  // Selection
  selection = new SelectionModel<ProductModel>(true, []);
  productsResult: ProductModel[] = [];
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
    this.subheaderService.setTitle('Produits');

    // Init DataSource
    this.dataSource = new ProductsDataSource(this.db);
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

    filter.manufacture = searchText;
    filter.product_name = searchText;
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
  }

  /** ACTIONS */
  /**
   * Delete product
   *
   * @param _item: ProductModel
   */
  deleteProduct(_item: any) {
    const _title = 'Supprimer Pruit';
    const _description = 'Etes vous sur de supprimer le produit ?';
    const _waitDesciption = 'Suppression en cours...';
    const _deleteMessage = `Le Produit a été supprimé`;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.store.dispatch(new OneProductDeleted({id: _item.id}));
      this.db.object('products/' + _item.key).remove();
      this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
    });
  }

  /**
   * Delete products
   */
  deleteProducts() {
    const _title = 'Suppression Produit';
    const _description = 'Etes vous sur de supprimer les produits sélectionnés ?';
    const _waitDesciption = 'Suppression en cours...';
    const _deleteMessage = 'Produit(s) sélectionné(s) supprimé(s)';

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      const idsForDeletion: string[] = [];
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.selection.selected.length; i++) {
        idsForDeletion.push(this.selection.selected[i].id);
      }
      this.store.dispatch(new ManyProductsDeleted({ids: idsForDeletion}));
      this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
      this.selection.clear();
    });
  }

  /**
   * Fetch selected products
   */
  fetchProducts() {
    // tslint:disable-next-line:prefer-const
    let messages = [];
    this.selection.selected.forEach(elem => {
      messages.push({
        text: `${elem.manufacture}`,
        status: elem.status
      });
    });
    this.layoutUtilsService.fetchElements(messages);
  }

  /**
   * Update status dialog
   */
  updateStatusForProducts() {
    const _title = 'Update status for selected products';
    const _updateMessage = 'Status has been updated for selected products';
    const _statuses = [{value: 0, text: 'Selling'}, {value: 1, text: 'Sold'}];
    const _messages = [];

    this.selection.selected.forEach(elem => {
      _messages.push({
        text: `${elem.manufacture}`,
        status: elem.status,
        statusTitle: this.getItemStatusString(elem.status),
        statusCssClass: this.getItemCssClassByStatus(elem.status)
      });
    });

    const dialogRef = this.layoutUtilsService.updateStatusForEntities(_title, _statuses, _messages);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        this.selection.clear();
        return;
      }

      this.store.dispatch(new ProductsStatusUpdated({
        status: +res,
        products: this.selection.selected
      }));

      this.layoutUtilsService.showActionNotification(_updateMessage, MessageType.Update);
      this.selection.clear();
    });
  }

  /**
   * Redirect to edit page
   *
   * @param id: any
   */
  editProduct(id) {
    this.router.navigate(['../products/edit', id], {relativeTo: this.activatedRoute});
  }

  createProduct() {
    this.router.navigateByUrl('/ecommerce/products/add');
  }

  /**
   * Check all rows are selected
   */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.productsResult.length;
    return numSelected === numRows;
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection
   */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.productsResult.forEach(row => this.selection.select(row));
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
