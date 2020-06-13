// RxJS
// CRUD
import {BaseDataSource} from '../../_base/crud';
// State
// Selectors
import {AngularFireDatabase} from '@angular/fire/database';
import {map, take} from 'rxjs/operators';
import {v4 as uuid} from 'uuid';
import {Observable, of} from 'rxjs';

export class ProductsDataSource extends BaseDataSource {
  totalSize: Observable<number>;

  constructor(private db: AngularFireDatabase) {
    super();
  }

  connect() {
    const items: Observable<any[]> = this.db.list('products')
      .snapshotChanges().pipe(
        map(changes =>
          changes.map((c: any) => {
            const product = c.payload.val();
            if (product.uniq_id) {
              product.uniq_id = product.uniq_id.substring(0, 8);
            }
            if (product.product_name) {
              product.product_name = product.product_name.substring(0, 20);
            }
            return ({key: c.payload.key, ...product});
          })
        ));
    return items;
  }

  disconnect(): void {
  }
}
