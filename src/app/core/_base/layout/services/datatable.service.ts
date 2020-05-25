// Angular
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
// RxJS
import {Observable} from 'rxjs';
// Models
import {map} from 'rxjs/operators';
import {v4 as uuid} from 'uuid';
import {ProductModel} from '../../../e-commerce';

const API_DATATABLE_URL = 'api/cars';
const DATATABLE_URL = 'http://localhost:8080/products';

@Injectable()
export class DataTableService {

  constructor(private http: HttpClient) {
  }


  getAllItems(): Observable<ProductModel[]> {
    return this.http.get<any>(DATATABLE_URL).pipe(map(res => {
      return res._embedded.products.map((product: ProductModel) => {
        product.id = uuid();
        product.uniq_id = product.uniq_id.substring(0, 8);
        product.product_name = product.product_name.substring(0, 10)
        return product;
      }).slice(0, 6);
    }));
  }
}
