export interface Category {
    id: number;
    image: string;
    name: string;
    uuid: string
}

export interface Tenant {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    uuid: string;
    name: string;
    price: number;
    stock: number;
    image: string;
    category: Category;
    tenant: Tenant;
}

export interface Pageable {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
    sort: Sort;
}

export interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface ProductDataResponse {
    content: Product[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    size: number;
    totalElements: number;
    totalPages: number;
    pageable: Pageable;
    sort: Sort;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}


interface ProductStore {
    productId: number,
    qty: number,
}

export interface TransactionRequest {
    payment_amount: number;
    items: ProductStore[]
}

export interface TransactionData {
    id: number;
    uuid: string;
    totalAmount: number;
    totalQty: number;
    createdAt: string;
    details: any | null;
    userId: number | null;
    userName: string | null;
}

export interface TransactionResponse {
    success: boolean;
    message: string;
    data: TransactionData;
}


export type ProductListResponse = ApiResponse<ProductDataResponse>;