// RxJS
// CRUD
import {BaseDataSource} from '../../_base/crud';
// State
// Selectors
import {AngularFireDatabase} from '@angular/fire/database';
import {map, take} from 'rxjs/operators';
import {v4 as uuid} from 'uuid';
import {Observable, of} from 'rxjs';

export class OrdersDataSource extends BaseDataSource {
  totalSize: Observable<number>;

  constructor(private db: AngularFireDatabase) {
    super();
  }

  connect() {
    return this.db.list('orders').valueChanges().pipe(
      map((orders: any) => {
        orders.forEach(order => {
          if (order.uniq_id) {
            order.uniq_id = order.uniq_id.substring(0, 8);
          }
          this.db.object('products/' + order.product_id).valueChanges().subscribe((product: any) => {
            order.product_id = product.product_name;
            if (order.product_id) {
              order.product_id = order.product_id.substring(0, 20);
            }
          });

          this.db.object('users/' + order.user_id).valueChanges().subscribe((user: any) => {
            order.user_id = user.fullName;
          });
        });
        this.totalSize = of(orders.length);
        return orders;
      }));
  }

  disconnect(): void {
  }
}
