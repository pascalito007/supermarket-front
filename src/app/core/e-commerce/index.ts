// Models and Consts
export { CustomerModel } from './_models/customer.model';
export { ProductModel } from './_models/product.model';

// DataSources
export { CustomersDataSource } from './_data-sources/customers.datasource';
export { ProductsDataSource } from './_data-sources/products.datasource';

// Actions
// Customer Actions =>
export {
    CustomerActionTypes,
    CustomerActions,
    CustomerOnServerCreated,
    CustomerCreated,
    CustomerUpdated,
    CustomersStatusUpdated,
    OneCustomerDeleted,
    ManyCustomersDeleted,
    CustomersPageRequested,
    CustomersPageLoaded,
    CustomersPageCancelled,
    CustomersPageToggleLoading
} from './_actions/customer.actions';
// Product actions =>
export {
    ProductActionTypes,
    ProductActions,
    ProductOnServerCreated,
    ProductCreated,
    ProductUpdated,
    ProductsStatusUpdated,
    OneProductDeleted,
    ManyProductsDeleted,
    ProductsPageRequested,
    ProductsPageLoaded,
    ProductsPageCancelled,
    ProductsPageToggleLoading,
    ProductsActionToggleLoading
} from './_actions/product.actions';


// Effects
export { CustomerEffects } from './_effects/customer.effects';
export { ProductEffects } from './_effects/product.effects';

// Reducers
export { customersReducer } from './_reducers/customer.reducers';
export { productsReducer } from './_reducers/product.reducers';

// Selectors
// Customer selectors =>
export {
    selectCustomerById,
    selectCustomersInStore,
    selectCustomersPageLoading,
    selectLastCreatedCustomerId,
    selectCustomersActionLoading,
    selectCustomersShowInitWaitingMessage
} from './_selectors/customer.selectors';
// Product selectors
export {
    selectProductById,
    selectProductsInStore,
    selectProductsPageLoading,
    selectProductsPageLastQuery,
    selectLastCreatedProductId,
    selectHasProductsInStore,
    selectProductsActionLoading,
    selectProductsInitWaitingMessage
} from './_selectors/product.selectors';

// Services
export { CustomersService } from './_services/';
export { ProductsService } from './_services/';
