import {BaseModel} from '../../_base/crud';

export class ProductModel extends BaseModel {
  id: string;
  model: string;
  manufacture: string;
  modelYear: number;
  mileage: number;
  description: string;
  color: string;
  price: number;
  condition: number;
  status: number;
  VINCode: string;


  uniq_id: string;
  product_name: string;
  manufacturer: string;
  //price;
  number_available_in_stock: string;
  number_of_reviews: string;
  number_of_answered_questions: string;
  average_review_rating: string;
  amazon_category_and_sub_category: string;
  customers_who_bought_this_item_also_bought: string;
  //description;
  product_information: string;
  product_description: string;
  items_customers_buy_after_viewing_this_item: string;
  customer_questions_and_answers: string;
  customer_reviews: string;
  sellers: string;

  clear() {
    this.model = '';
    this.manufacture = '';
    this.modelYear = 2000;
    this.mileage = 0;
    this.description = '';
    this.color = 'Black';
    this.price = 1000;
    this.condition = 0;
    this.status = 0;
    this.VINCode = '';


    this.uniq_id = '';
    this.product_name = '';
    this.manufacturer = '';
    //price;
    this.number_available_in_stock = '';
    this.number_of_reviews = '';
    this.number_of_answered_questions = '';
    this.average_review_rating = '';
    this.amazon_category_and_sub_category = '';
    this.customers_who_bought_this_item_also_bought = '';
    //description;
    this.product_information = '';
    this.product_description = '';
    this.items_customers_buy_after_viewing_this_item = '';
    this.customer_questions_and_answers = '';
    this.customer_reviews = '';
    this.sellers = '';
  }
}
