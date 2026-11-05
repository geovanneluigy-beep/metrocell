export type PhoneBrand = 'Samsung' | 'Apple' | 'Motorola' | 'Xiaomi' | 'Outro';

export type PhoneCondition = 
  | 'Novo Lacrado' 
  | 'Seminovo Impecável' 
  | 'Seminovo Revisado' 
  | 'Seminovo com Marcas';

export interface Product {
  id: string;
  model: string;
  brand: PhoneBrand;
  condition: PhoneCondition;
  storage: string;
  color: string;
  batteryHealth?: number; // e.g. 88
  price: number;
  originalPrice?: number;
  stock: number;
  image: string;
  warranty: string;
  itemsIncluded: string[];
  featured?: boolean;
  notes?: string;
}

export interface RepairQuoteRequest {
  brand: string;
  model: string;
  problem: string;
  additionalDetails?: string;
  serviceType: 'balcao' | 'motoboy';
  customerName?: string;
}

export interface StoreSettings {
  whatsappNumber: string;
  storeName: string;
  storeAddress: string;
  pixKey: string;
  workingHours: string;
}
