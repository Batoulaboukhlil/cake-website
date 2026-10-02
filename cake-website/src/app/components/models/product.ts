export interface Product {
  id: number;
  name: string;
  category: 'cakes' | 'mini-sweets';
  description: string;
  longDescription: string;
  price: number;
  image: string;
  badge?: string;
  creams: string[];
  sizes?: string[];
  prepTime: string;
  inStock: boolean;
}
