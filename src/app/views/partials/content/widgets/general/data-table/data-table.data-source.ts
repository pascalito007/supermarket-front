// Angular
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
// RxJS
import {Observable, BehaviorSubject, of} from 'rxjs';
import {catchError, finalize, map, tap} from 'rxjs/operators';
// CRUD
import {QueryParamsModel, QueryResultsModel, HttpExtenstionsModel, BaseDataSource} from '../../../../../../core/_base/crud';
import {DataTableService, DataTableItemModel} from '../../../../../../core/_base/layout';
import {AngularFireDatabase} from '@angular/fire/database';

export class DataTableDataSource extends BaseDataSource {

  /**
   * Data-Source Constructor
   *
   * @param dataTableService: DataTableService
   */
  constructor(private db: AngularFireDatabase) {
    super();
  }

  /**
   * Connect data-source
   *
   * @param collectionViewer: CollectionViewer
   */
  connect(collectionViewer: CollectionViewer): Observable<any[]> {
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
            }),
          map((response: any) => {
            return response.slice(response, 0, 5);
          })
        ));
    return items;
  }

  /**
   * Disconnect data-source
   *
   * @param collectionViewer: CollectionViewer
   */
  disconnect(): void {
  }

}
