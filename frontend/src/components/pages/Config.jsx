// API URLS
const BASE_API_URL='https://smartpipes.cloud/api/'
// phases
export const API_URL_PHASES = BASE_API_URL+'production-line/phases/';
// production lines
export const API_URL_PL= BASE_API_URL+'production-line/production-lines/';
//factories
export const API_URL_FACTORIES= BASE_API_URL+'production-line/factories/';
//cities
export const API_URL_CITIES= BASE_API_URL+'inventory/city/';
//Users
export const  API_URL_USERS= BASE_API_URL+'users/users/';
export const API_URL_USER_LOGIN = BASE_API_URL+'users/login/';
//production phases
export const API_URL_PL_PH = BASE_API_URL+'production-line/production-phases/';
//production orders
export const API_URL_ORDERS = BASE_API_URL+"production-line/production-orders/";
//production 
export const API_URL_INV = BASE_API_URL+"inventory/inventory/"
export const API_URL_INVENTORYSUM = BASE_API_URL+"inventory/inventory-total-stock/"
//INVENTORY PRODUCTS
export const API_URL_PRODUCTS = BASE_API_URL+"inventory/products/";
//inventory warehouse
export const API_URL_WAREHOUSES = BASE_API_URL+"inventory/warehouse/";
export const API_URL_PO_DETAILS = BASE_API_URL+"production-line/production-order-details/";
export const API_URL_PO_RAWM_DETAILS = BASE_API_URL+"production-line/ProductionOrderWarehouseRetrievalDetail/"
export const API_URL_CATEGORIES = BASE_API_URL+"inventory/category/";
export const API_URL_SUPPLIERS = BASE_API_URL+"inventory/supplier/";
export const API_URL_RAW_MATERIALS = BASE_API_URL+"inventory/raw-materials/";
export const API_URL_OPERATION_LOG = BASE_API_URL+'inventory/operation-log/';
export const API_URL_RESTOCKREQUEST = BASE_API_URL+'inventory/restockrequest/';
export const API_URL = BASE_API_URL+'token/';
export const API_URL_PRO_ORDERS = BASE_API_URL+'production-line/production-orders/';
export const API_URL_PO_PHASES = BASE_API_URL+'production-line/production-order-phases/';

//inventory 
export const API_URL_RAWMLIST = BASE_API_URL+'inventory/product-raw-material-list/';

export const API_URL_RESTOCK_WH = BASE_API_URL+'inventory/Restock-Request-Warehouse/';
export const API_URL_RESTOCK_WH_DETAIL = BASE_API_URL+'inventory/Restock-Request-Warehouse-Rawm/';
export const API_URL_FAC_MANAGER = BASE_API_URL+'production-line/factory-managers/';
export const  API_URL_USR_DIV = BASE_API_URL+'users/divisions/';
export const API_URL_DIV_USR = BASE_API_URL+"users/division-users/";
// General API URLs
export const API_URL_DIVISIONS = BASE_API_URL + 'users/divisions/';
export const API_URL_DIVISION_USERS = BASE_API_URL + 'users/division-users/';
export const API_URL_PAYMENT_METHODS = BASE_API_URL + 'users/payment-methods/';

// Delivery API URLs
export const API_URL_DELIVERY_CARTS = BASE_API_URL + 'sales/carts/';
export const API_URL_DELIVERY_SALES = BASE_API_URL + 'sales/sales/';
export const API_URL_DELIVERY_PAYMENTS = BASE_API_URL + 'sales/payments/';
export const API_URL_DELIVERY_CART_DETAILS = BASE_API_URL + 'sales/cart-details/';
export const API_URL_DELIVERY_SALE_DETAILS = BASE_API_URL + 'sales/sale-details/';

// Delivery Orders API URLs
export const API_URL_DELIVERY_ORDERS = BASE_API_URL + 'delivery/delivery-orders/';
export const API_URL_DELIVERY_ORDER_DETAILS = BASE_API_URL + 'delivery/delivery-orders-detail/';

// Third-Party Services API URL
export const API_URL_THIRD_PARTY_SERVICES = BASE_API_URL + 'delivery/third-party-service/';
