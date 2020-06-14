// RxJS
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
// NGRX
import {Store} from '@ngrx/store';
// CRUD
import {BaseDataSource} from '../../_base/crud';
// State
import {AppState} from '../../../core/reducers';
import {AngularFireDatabase} from '@angular/fire/database';


export class UsersDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>, private db: AngularFireDatabase) {
    super();
  }

  connect() {
    const items: Observable<any[]> = this.db.list('users')
      .snapshotChanges().pipe(
        map(changes =>
          changes.map((c: any) => {
            const user = c.payload.val();
            console.log({key: c.payload.key, _user: user});
            return ({key: c.payload.key, ...user});
          })
        ));
    return items;
  }


  disconnect(): void {
  }
}
