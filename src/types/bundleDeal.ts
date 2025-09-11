export interface BundleDeal {
  id: string;
  product_id: string;
  bundle_type: 'get2' | 'get3' | 'get4' | 'get5';
  discount_percentage: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  products?: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
}

export interface BundleDealFormData {
  product_id: string;
  bundle_type: 'get2' | 'get3' | 'get4' | 'get5';
  discount_percentage: number;
  is_active: boolean;
}
