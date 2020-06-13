// RxJS
import {of} from 'rxjs';
import {catchError, finalize, tap, debounceTime, delay, distinctUntilChanged} from 'rxjs/operators';
// NGRX
import {Store} from '@ngrx/store';
// CRUD
import {BaseDataSource} from '../../_base/crud';
// State
import {AppState} from '../../../core/reducers';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireDatabase} from '@angular/fire/database';


export class UsersDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>, private db: AngularFireDatabase) {
    super();
  }

  connect() {
    return this.db.list('users').valueChanges();
  }


  disconnect(): void {
  }
}
