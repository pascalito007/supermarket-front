import {BaseModel} from '../../_base/crud';

export class ProductModel extends BaseModel {
  id: string;
  manufacture: string;
  description: string;
  price: number;
  status: number;
  uniq_id: string;
  product_name: string;
  manufacturer: string;
  number_available_in_stock: string;
  product_information: string;
  product_description: string;
  photoUrl: string;

  clear() {
    this.manufacture = '';
    this.description = '';
    this.price = 1000;
    this.status = 0;
    this.uniq_id = '';
    this.product_name = '';
    this.manufacturer = '';
    this.number_available_in_stock = '';
    this.product_information = '';
    this.product_description = '';
  }
}
