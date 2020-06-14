// RxJS
import {Observable, of} from 'rxjs';
import {catchError, finalize, tap, debounceTime, delay, distinctUntilChanged, map} from 'rxjs/operators';
// NGRX
// CRUD
import {BaseDataSource} from '../../_base/crud';
// State
// Selectirs
import {AngularFireDatabase} from '@angular/fire/database';

export class RolesDataSource extends BaseDataSource {
  constructor(private db: AngularFireDatabase) {
    super();
  }

  connect(): Observable<any[]> {
    const items: Observable<any[]> = this.db.list('roles')
      .snapshotChanges().pipe(
        map(changes =>
          changes.map((c: any) => {
            const product = c.payload.val();
            return ({key: c.payload.key, ...product});
          })
        ));
    return items;
  }

  disconnect(): void {
  }
}
