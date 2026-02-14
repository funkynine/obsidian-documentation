export type OrderStatus =
  | 'new'
  | 'contacted'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type City = 'Вінниця' | 'Жмеринка' | 'Бар';

export interface Variety {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  variety_id: string;
  quantity: number;
  city: City;
  delivery_date: string;
  delivery_time: string | null;
  status: OrderStatus;
  notes: string | null;
  manager_notes: string | null;
  created_at: string;
}

export interface OrderWithVariety extends Order {
  varieties: Variety | null;
}
