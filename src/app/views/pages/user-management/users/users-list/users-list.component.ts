// Angular
import {Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
// Material
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator, MatSort} from '@angular/material';
// RXJS
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {fromEvent, merge, of, Subscription} from 'rxjs';
// LODASH
import {each, find} from 'lodash';
// NGRX
import {Store, select} from '@ngrx/store';
import {AppState} from '../../../../../core/reducers';

// Services
import {LayoutUtilsService, MessageType, QueryParamsModel} from '../../../../../core/_base/crud';
// Models
import {
  User,
  Role,
  UsersDataSource,
  UserDeleted,
  UsersPageRequested,
  selectAllRoles, AuthService
} from '../../../../../core/auth';
import {SubheaderService} from '../../../../../core/_base/layout';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'kt-users-list',
  templateUrl: './users-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent implements OnInit, OnDestroy {
  // Table fields
  dataSource: UsersDataSource;
  displayedColumns = ['select', 'userName', 'email', 'fullName', 'address', 'phone', '_roles', 'actions'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('sort1', {static: true}) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
  lastQuery: QueryParamsModel;
  // Selection
  selection = new SelectionModel<User>(true, []);
  usersResult: User[] = [];
  allRoles: Role[] = [];

  // Subscriptions
  private subscriptions: Subscription[] = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>,
    private router: Router,
    private layoutUtilsService: LayoutUtilsService,
    private subheaderService: SubheaderService, private userService: AuthService,
    private cdr: ChangeDetectorRef, private db: AngularFireDatabase) {
  }


  ngOnInit() {
    // load roles list
    const rolesSubscription = this.store.pipe(select(selectAllRoles)).subscribe(res => this.allRoles = res);
    this.subscriptions.push(rolesSubscription);

    // If the user changes the sort order, reset back to the first page.
    const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.subscriptions.push(sortSubscription);

    /* Data load will be triggered in two cases:
    - when a pagination event occurs => this.paginator.page
    - when a sort event occurs => this.sort.sortChange
    **/
    /*const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => {
        this.loadUsersList();
      })
    )
      .subscribe();
    this.subscriptions.push(paginatorSubscriptions);*/


    // Filtration, bind to searchInput
    const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      // tslint:disable-next-line:max-line-length
      debounceTime(150), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
      distinctUntilChanged(), // This operator will eliminate duplicate values
      tap(() => {
        this.paginator.pageIndex = 0;
        this.loadUsersList();
      })
    )
      .subscribe();
    this.subscriptions.push(searchSubscription);

    // Set title to page breadCrumbs
    this.subheaderService.setTitle('Gestion des utilisateurs');

    // Init DataSource
    this.dataSource = new UsersDataSource(this.store, this.db);
    const entitiesSubscription = this.dataSource.entitySubject.subscribe(res => {
      this.usersResult = res;
    });
    this.subscriptions.push(entitiesSubscription);

    // First Load
    // of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
    //   this.loadUsersList();
    // });
  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  /**
   * Load users list
   */
  loadUsersList() {
    // this.selection.clear();
    // const queryParams = new QueryParamsModel(
    //   this.filterConfiguration(),
    //   this.sort.direction,
    //   this.sort.active,
    //   //this.paginator.pageIndex,
    //   this.paginator.pageSize
    //);
    //this.store.dispatch(new UsersPageRequested({page: queryParams}));
    //this.selection.clear();
  }

  /** FILTRATION */
  filterConfiguration(): any {
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;

    filter.lastName = searchText;

    filter.username = searchText;
    filter.email = searchText;
    filter.fillname = searchText;
    return filter;
  }

  /** ACTIONS */
  /**
   * Delete user
   *
   * @param _item: User
   */
  deleteUser(_item: any) {
    const _title = 'Suppression Utilisateur';
    const _description = 'Etes vous sûr de supprimer cet Utilisateur?';
    const _waitDesciption = 'Suppression en cours...';
    const _deleteMessage = `Utilisateur supprimé`;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.store.dispatch(new UserDeleted({id: _item.key}));
      this.db.object('users/' + _item.key).remove();
      this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
    });
  }

  /**
   * Fetch selected rows
   */
  fetchUsers() {
    const messages = [];
    this.selection.selected.forEach(elem => {
      messages.push({
        text: `${elem.fullName}, ${elem.email}`,
        id: elem.id.toString(),
        status: elem.userName
      });
    });
    this.layoutUtilsService.fetchElements(messages);
  }

  /**
   * Check all rows are selected
   */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.usersResult.length;
    return numSelected === numRows;
  }

  /**
   * Toggle selection
   */
  masterToggle() {
    if (this.selection.selected.length === this.usersResult.length) {
      this.selection.clear();
    } else {
      this.usersResult.forEach(row => this.selection.select(row));
    }
  }

  /* UI */
  /**
   * Returns user roles string
   *
   * @param user: User
   */
  getUserRolesStr(user: User): string {
    let titles: string[] = [''];
    each(user.roles, (roleId: number) => {
      const _role = find(this.allRoles, (role: any) => role.key === roleId);
      if (_role) {
        titles.push(_role.name);
      }
    });
    return titles.join(', ');
  }

  /**
   * Redirect to edit page
   *
   * @param id
   */
  editUser(key) {
    this.router.navigate(['../users/edit', key], {relativeTo: this.activatedRoute});
  }
}
