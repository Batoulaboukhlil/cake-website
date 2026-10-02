export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  pickupDate: string;
  pickupTime: string;
  productName: string;
  creamOption: string;
  quantityOrSize: string;
  totalPrice: number;
  status: 'Nieuw' | 'In behandeling' | 'Gereed voor afhalen' | 'Voltooid' | 'Geannuleerd';
  notes?: string;
  createdAt: string;
}
