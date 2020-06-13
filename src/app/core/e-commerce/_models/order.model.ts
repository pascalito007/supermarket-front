import {BaseModel} from '../../_base/crud';

export class OrderModel extends BaseModel {
  uniq_id: string;
  unit_price: string;
  product_id: string;
  date_time: string;
  qte: string;
  total_price: string;
  user_id: string;
  confirmed: string;

  clear() {
    this.uniq_id = '';
    this.unit_price = '';
    this.product_id = 'Black';
    this.date_time = 'Black';
    this.qte = '';
    this.total_price = 'Black';
    this.unit_price = 'Black';
    this.user_id = 'Black';
    this.confirmed = 'Black';
  }
}
