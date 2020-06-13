// Angular
import {Component, Input, OnInit} from '@angular/core';
// RxJS
import {Observable} from 'rxjs';
// NGRX
import {select, Store} from '@ngrx/store';
// State
import {AppState} from '../../../../../core/reducers';
import {currentUser, Logout, User} from '../../../../../core/auth';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'kt-user-profile3',
  templateUrl: './user-profile3.component.html',
})
export class UserProfile3Component implements OnInit {
  // Public properties
  user$: Observable<User>;

  @Input() avatar = true;
  @Input() greeting = true;
  @Input() badge: boolean;
  @Input() icon: boolean;


  constructor(private store: Store<AppState>, public afAuth: AngularFireAuth) {
  }


  ngOnInit(): void {
  }

  logout() {
    this.afAuth.auth.signOut();
    this.store.dispatch(new Logout());
  }
}
