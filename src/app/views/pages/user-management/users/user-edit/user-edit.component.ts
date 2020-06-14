// Angular
import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// RxJS
import {BehaviorSubject, Observable, of, Subscription} from 'rxjs';
// NGRX
import {Store, select} from '@ngrx/store';
import {Update} from '@ngrx/entity';
import {AppState} from '../../../../../core/reducers';
// Layout
import {SubheaderService, LayoutConfigService} from '../../../../../core/_base/layout';
import {LayoutUtilsService, MessageType} from '../../../../../core/_base/crud';
// Services and Models
import {
  User,
  UserUpdated,
  UserOnServerCreated,
  selectLastCreatedUserId,
  selectUsersActionLoading
} from '../../../../../core/auth';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'kt-user-edit',
  templateUrl: './user-edit.component.html',
})
export class UserEditComponent implements OnInit, OnDestroy {
  // Public properties
  user: User;
  userId$: Observable<number>;
  oldUser: User;
  selectedTab = 0;
  loading$: Observable<boolean>;
  rolesSubject = new BehaviorSubject<number[]>([]);
  userForm: FormGroup;
  hasFormErrors = false;
  // Private properties
  private subscriptions: Subscription[] = [];


  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private userFB: FormBuilder,
              private subheaderService: SubheaderService,
              private layoutUtilsService: LayoutUtilsService,
              private store: Store<AppState>,
              private layoutConfigService: LayoutConfigService,
              private afAuth: AngularFireAuth, private db: AngularFireDatabase,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.loading$ = this.store.pipe(select(selectUsersActionLoading));

    const routeSubscription = this.activatedRoute.params.subscribe(params => {
      const id = params.id;
      if (id && id.length > 0) {
        this.loadUser(id);
        // this.store.pipe(select(selectUserById(id))).subscribe(res => {
        //   if (res) {
        //     this.user = res;
        //     //this.rolesSubject.next(this.user.roles);
        //     //this.addressSubject.next(this.user.address);
        //     //this.soicialNetworksSubject.next(this.user.socialNetworks);
        //     this.oldUser = Object.assign({}, this.user);
        //     this.initUser();
        //   }
        // });
      } else {
        this.user = new User();
        this.user.clear();
        //this.rolesSubject.next(this.user.roles);
        this.oldUser = Object.assign({}, this.user);
        this.initUser();
      }
    });
    this.subscriptions.push(routeSubscription);
  }

  async loadUser(key: string) {
    await this.db.object('users/' + key).valueChanges().subscribe((res: any) => {
      this.user = res;
      //this.rolesSubject.next(this.user.roles);
      this.oldUser = Object.assign({}, this.user);
      this.initUser(key);
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  /**
   * Init user
   */
  initUser(key: string = '') {
    this.createForm();
    if (!key) {
      this.subheaderService.setTitle('Ajouter un utilisateur');
      this.subheaderService.setBreadcrumbs([
        {title: 'Gestion des utilisateurs', page: `user-management`},
        {title: 'Utilisateurs', page: `user-management/users`},
        {title: 'Créer un utilisateur', page: `user-management/users/add`}
      ]);
      return;
    }
    this.subheaderService.setTitle('Modifier un utilisateur');
    this.subheaderService.setBreadcrumbs([
      {title: 'Gestion des utilisateurs', page: `user-management`},
      {title: 'Utilisateurs', page: `user-management/users`},
      {title: 'Modifier un utilisateur', page: `user-management/users/edit`, queryParams: {id: this.user.id}}
    ]);
    this.cdr.detectChanges();
  }

  /**
   * Create form
   */
  createForm() {
    this.userForm = this.userFB.group({
      userName: [this.user.userName, Validators.required],
      fullName: [this.user.fullName, Validators.required],
      address: [this.user.address],
      password: [this.user.password, Validators.required],
      email: [this.user.email, Validators.email],
      phone: [this.user.phone]
    });
  }

  /**
   * Redirect to list
   *
   */
  goBackWithId() {
    const url = `/user-management/users`;
    this.router.navigateByUrl(url, {relativeTo: this.activatedRoute});
  }

  goBackWithoutId() {
    this.router.navigateByUrl('/user-management/users', {relativeTo: this.activatedRoute});
  }

  /**
   * Refresh user
   *
   * @param isNew: boolean
   * @param id: number
   */
  refreshUser(isNew: boolean = false, id = 0) {
    let url = this.router.url;
    if (!isNew) {
      this.router.navigate([url], {relativeTo: this.activatedRoute});
      return;
    }

    url = `/user-management/users/edit/${id}`;
    this.router.navigateByUrl(url, {relativeTo: this.activatedRoute});
  }

  /**
   * Reset
   */
  reset() {
    this.user = Object.assign({}, this.oldUser);
    this.createForm();
    this.hasFormErrors = false;
    this.userForm.markAsPristine();
    this.userForm.markAsUntouched();
    this.userForm.updateValueAndValidity();
  }

  /**
   * Save data
   *
   * @param withBack: boolean
   */
  onSumbit(withBack: boolean = false) {
    this.hasFormErrors = false;
    const controls = this.userForm.controls;
    /** check form */
    if (this.userForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      this.selectedTab = 0;
      return;
    }

    const editedUser = this.prepareUser();

    if (editedUser.id > 0) {
      this.updateUser(editedUser, withBack);
      return;
    }

    this.addUser(editedUser, withBack);
  }

  /**
   * Returns prepared data for save
   */
  prepareUser(): User {
    const controls = this.userForm.controls;
    const _user = new User();
    _user.clear();
    _user.accessToken = this.user.accessToken;
    _user.refreshToken = this.user.refreshToken;
    _user.userName = controls.userName.value;
    _user.email = controls.email.value;
    _user.fullName = controls.fullName.value;
    _user.phone = controls.phone.value;
    _user.address = controls.address.value;
    _user.password = controls.password.value;
    return _user;
  }

  /**
   * Add User
   *
   * @param _user: User
   * @param withBack: boolean
   */
  async addUser(_user: User, withBack: boolean = false) {
    const response = await this.afAuth.auth.createUserWithEmailAndPassword(_user.email, _user.password);
    _user.password = null;
    _user.accessToken = null;
    _user.refreshToken = null;
    await this.db.object('users/' + response.user.email.replace('.', ',')).set(Object.assign({}, _user));
    await response.user.updateProfile({displayName: _user.fullName});
    this.store.dispatch(new UserOnServerCreated({user: _user}));
    const user = await this.afAuth.auth.currentUser;
    //await this.afs.doc('users/' + this.afs.createId()).set(Object.assign({}, _user));
    const addSubscription = this.store.pipe(select(selectLastCreatedUserId)).subscribe(newId => {
      const message = `Nouvel utilisateur correctement enregistré.`;
      this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
      if (newId) {
        if (withBack) {
          this.goBackWithId();
        } else {
          this.refreshUser(true, newId);
        }
      }
    });
    this.subscriptions.push(addSubscription);
  }

  /**
   * Update user
   *
   * @param _user: User
   * @param withBack: boolean
   */
  updateUser(_user: User, withBack: boolean = false) {
    // Update User
    // tslint:disable-next-line:prefer-const

    const updatedUser: Update<User> = {
      id: _user.id,
      changes: _user
    };
    this.store.dispatch(new UserUpdated({partialUser: updatedUser, user: _user}));
    const message = `Utilisateur correctement enregistré.`;
    this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
    if (withBack) {
      this.goBackWithId();
    } else {
      this.refreshUser(false);
    }
  }

  /**
   * Returns component title
   */
  getComponentTitle() {
    let result = 'Ajout utilisateur';
    if (!this.user || !this.user.id) {
      return result;
    }

    result = `Modification utilisateur - ${this.user.fullName}`;
    return result;
  }

  /**
   * Close Alert
   *
   * @param $event: Event
   */
  onAlertClose($event) {
    this.hasFormErrors = false;
  }
}
