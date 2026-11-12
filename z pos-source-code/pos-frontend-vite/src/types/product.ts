export interface Category {
  id: number;
  name: string;
  description?: string;
  storeId?: number;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string;
  mrp: number;
  sellingPrice: number;
  brand?: string;
  image?: string;
  category?: Category;
  storeId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductCreateDTO {
  name: string;
  sku: string;
  description?: string;
  mrp: number;
  sellingPrice: number;
  brand?: string;
  image?: string;
  categoryId: number;
  storeId: number;
}

