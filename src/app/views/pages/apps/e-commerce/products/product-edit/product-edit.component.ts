// Angular
import {Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// Material
import {MatDialog} from '@angular/material';
// RxJS
import {Observable, BehaviorSubject, Subscription, of} from 'rxjs';
import {map, startWith, delay, first} from 'rxjs/operators';
// NGRX
import {Store, select} from '@ngrx/store';
import {Dictionary, Update} from '@ngrx/entity';
import {AppState} from '../../../../../../core/reducers';
// Layout
import {SubheaderService, LayoutConfigService} from '../../../../../../core/_base/layout';
// CRUD
import {LayoutUtilsService, TypesUtilsService, MessageType} from '../../../../../../core/_base/crud';
// Services and Models
import {
  selectLastCreatedProductId,
  selectProductById,
  ProductModel,
  ProductOnServerCreated,
  ProductUpdated,
  ProductsService, selectProductsInStore
} from '../../../../../../core/e-commerce';
import {v4 as uuid} from 'uuid';
import {uniq} from 'lodash';
import {AngularFireDatabase} from '@angular/fire/database';

const AVAILABLE_MANUFACTURES: string[] =
  ['Pontiac', 'Subaru', 'Mitsubishi', 'Oldsmobile', 'Chevrolet', 'Chrysler', 'Suzuki', 'GMC', 'Cadillac', 'Mercury', 'Dodge',
    'Ram', 'Lexus', 'Lamborghini', 'Honda', 'Nissan', 'Ford', 'Hyundai', 'Saab', 'Toyota'];

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'kt-product-edit',
  templateUrl: './product-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductEditComponent implements OnInit, OnDestroy {
  // Public properties
  product: ProductModel;
  productId$: Observable<number>;
  oldProduct: ProductModel;
  selectedTab = 0;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  productForm: FormGroup;
  hasFormErrors = false;
  availableYears: number[] = [];
  filteredManufactures: Observable<string[]>;
  // Private password
  private componentSubscriptions: Subscription;
  // sticky portlet header margin
  private headerMargin: number;
  private products: ProductModel[];


  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private typesUtilsService: TypesUtilsService,
    private productFB: FormBuilder,
    public dialog: MatDialog,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    private layoutConfigService: LayoutConfigService,
    private productService: ProductsService,
    private cdr: ChangeDetectorRef, private db: AngularFireDatabase) {
  }


  ngOnInit() {
    this.productService.getAllProducts().subscribe(products => {
      this.products = products;

      this.filteredManufactures = this.productForm.controls.manufacturer.valueChanges
        .pipe(
          startWith(''),
          map(val => this.filterManufacture(val.toString()))
        );
    });


    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(true);
    this.activatedRoute.params.subscribe(params => {
      const id = params.id;
      if (id && id >= 0) {
        this.loadProd(id);
        /*this.store.pipe(
          select(selectProductById(id))
        ).subscribe(result => {
          if (!result) {
            this.loadProductFromService(id);
            return;
          }

          this.loadProduct(result);
        });*/
      } else {
        const newProduct = new ProductModel();
        newProduct.clear();
        this.loadProduct(newProduct);
      }
    });

    // sticky portlet header
    window.onload = () => {
      const style = getComputedStyle(document.getElementById('kt_header'));
      this.headerMargin = parseInt(style.height, 0);
    };
  }

  async loadProd(id: string) {
    await this.db.object('products/' + id).valueChanges().subscribe((product: any) => {
      this.product = product;
      this.productId$ = of(product.id);
      this.productId$.subscribe(console.log);
      this.oldProduct = Object.assign({}, product);
      this.initProduct();
      this.cdr.detectChanges();
    });
  }

  loadProduct(_product, fromService: boolean = false) {
    if (!_product) {
      this.goBack('');
    }
    this.product = _product;
    this.productId$ = of(_product.id);
    this.productId$.subscribe(console.log);
    this.oldProduct = Object.assign({}, _product);
    this.initProduct();
    if (fromService) {
      this.cdr.detectChanges();
    }
  }

  // If product didn't find in store
  loadProductFromService(productId) {
    this.productService.getProductById(productId).subscribe(res => {
      this.loadProduct(res, true);
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy() {
    if (this.componentSubscriptions) {
      this.componentSubscriptions.unsubscribe();
    }
  }

  /**
   * Init product
   */
  initProduct() {
    this.createForm();
    this.loadingSubject.next(false);
    if (!this.product.id) {
      this.subheaderService.setBreadcrumbs([
        {title: 'supermarche', page: `/ecommerce`},
        {title: 'catalogue produits', page: `/ecommerce/products`},
        {title: 'ajout produit', page: `/ecommerce/products/add`}
      ]);
      return;
    }
    this.subheaderService.setTitle('Edit product');
    this.subheaderService.setBreadcrumbs([
      {title: 'supermarche', page: `/ecommerce`},
      {title: 'catalogue produits', page: `/ecommerce/products`},
      {title: 'modifier produit', page: `/ecommerce/products/edit`, queryParams: {id: this.product.id}}
    ]);
  }

  /**
   * Create form
   */
  createForm() {
    this.productForm = this.productFB.group({
      product_name: [this.product.product_name, Validators.required],
      manufacturer: [this.product.manufacturer, Validators.required],
      photoUrl: [this.product.photoUrl],
      number_available_in_stock: [this.product.number_available_in_stock, Validators.required],
      price: [this.product.price, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      product_description: [this.product.product_description],
    });
  }

  /**
   * Filter manufacture
   *
   * @param val: string
   */
  filterManufacture(val: string): string[] {
    return this.products && this.products.length > 0 ? uniq(this.products
      .map(product => product.manufacturer)).filter(option =>
      option.toLowerCase().includes(val.toLowerCase())) : [''];
  }


  /**
   * Go back to the list
   *
   * @param id: any
   */
  goBack(id) {
    this.loadingSubject.next(false);
    const url = `/ecommerce/products?id=${id}`;
    this.router.navigateByUrl(url, {relativeTo: this.activatedRoute});
  }

  goBackWithoutId() {
    this.router.navigateByUrl('/ecommerce/products', {relativeTo: this.activatedRoute});
  }

  /**
   * Refresh product
   *
   * @param isNew: boolean
   * @param id: number
   */
  refreshProduct(isNew: boolean = false, id = '') {
    this.loadingSubject.next(false);
    let url = this.router.url;
    if (!isNew) {
      this.router.navigate([url], {relativeTo: this.activatedRoute});
      return;
    }

    url = `/ecommerce/products/edit/${id}`;
    this.router.navigateByUrl(url, {relativeTo: this.activatedRoute});
  }

  /**
   * Reset
   */
  reset() {
    this.product = Object.assign({}, this.oldProduct);
    this.createForm();
    this.hasFormErrors = false;
    this.productForm.markAsPristine();
    this.productForm.markAsUntouched();
    this.productForm.updateValueAndValidity();
  }

  /**
   * Save data
   *
   * @param withBack: boolean
   */
  onSumbit(withBack: boolean = false) {
    this.hasFormErrors = false;
    const controls = this.productForm.controls;
    /** check form */
    if (this.productForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      this.selectedTab = 0;
      return;
    }

    // tslint:disable-next-line:prefer-const
    let editedProduct: ProductModel = this.prepareProduct();

    if (editedProduct.id) {
      this.updateProduct(editedProduct, withBack);
      return;
    }

    this.addProduct(editedProduct, withBack);
  }

  /**
   * Returns object for saving
   */
  prepareProduct(): ProductModel {
    const controls = this.productForm.controls;
    const _product = new ProductModel();
    _product.id = this.product.id;
    _product.uniq_id = this.product.uniq_id;
    _product.product_name = controls.product_name.value;
    _product.manufacturer = controls.manufacturer.value;
    _product.number_available_in_stock = controls.number_available_in_stock.value;
    _product.price = controls.price.value;
    _product.photoUrl = controls.photoUrl.value;
    return _product;
  }

  /**
   * Add product
   *
   * @param _product: ProductModel
   * @param withBack: boolean
   */
  async addProduct(_product: ProductModel, withBack: boolean = false) {
    this.loadingSubject.next(true);
    _product.id = uuid();
    _product.uniq_id = uuid();
    const id = await this.db.createPushId();
    await this.db.list('products/').push(Object.assign({}, _product));
    this.store.dispatch(new ProductOnServerCreated({product: _product}));
    this.componentSubscriptions = this.store.pipe(
      delay(1000),
      select(selectLastCreatedProductId)
    ).subscribe(newId => {
      this.loadingSubject.next(false);
      const message = `Nouveau produit correctement ajouté.`;
      this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
      this.refreshProduct(true, newId + '');
    });
  }

  /**
   * Update product
   *
   * @param _product: ProductModel
   * @param withBack: boolean
   */
  updateProduct(_product: ProductModel, withBack: boolean = false) {
    this.loadingSubject.next(true);

    const updateProduct: Update<ProductModel> = {
      id: _product.id,
      changes: _product
    };

    this.store.dispatch(new ProductUpdated({
      partialProduct: updateProduct,
      product: _product
    }));

    of(undefined).pipe(delay(3000)).subscribe(() => { // Remove this line
      if (withBack) {
        this.goBack(_product.id);
      } else {
        const message = `Produit correctement enregistré.`;
        this.layoutUtilsService.showActionNotification(message, MessageType.Update, 10000, true, true);
        this.refreshProduct(false);
      }
    }); // Remove this line
  }

  /**
   * Returns component title
   */
  getComponentTitle() {
    let result = 'Ajouter produit';
    if (!this.product || !this.product.id) {
      return result;
    }

    result = `Modifier produit - ${this.product.manufacture}`;
    return result;
  }

  /**
   * Close alert
   *
   * @param $event
   */
  onAlertClose($event) {
    this.hasFormErrors = false;
  }
}
