// Models and Consts
export { ProductModel } from './_models/product.model';

// DataSources
export { ProductsDataSource } from './_data-sources/products.datasource';

// Actions
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
export { ProductEffects } from './_effects/product.effects';

// Reducers
export { productsReducer } from './_reducers/product.reducers';

// Selectors
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
export { ProductsService } from './_services/';
