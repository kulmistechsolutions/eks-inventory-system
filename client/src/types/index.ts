export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales_tech';
  isActive: boolean;
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  cost: number;
  quantity: number;
  minStock: number;
  supplier?: string;
  sku: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  product: string;
  productName: string;
  quantity: number;
  price: number;
  cost: number;
  subtotal: number;
  profit: number;
}

export interface Sale {
  _id: string;
  saleNumber: string;
  items: SaleItem[];
  customerName?: string;
  customerPhone?: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  totalProfit: number;
  paymentMethod: 'cash' | 'card' | 'mobile' | 'evc_plus' | 'e_dahab' | 'jeeb' | 'bank';
  soldBy: User;
  createdAt: string;
}

export interface Repair {
  _id: string;
  repairNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  mobileBrand: string;
  mobileModel: string;
  imei?: string;
  issueDescription: string;
  repairCost: number;
  amountPaid: number;
  remainingBalance: number;
  status: 'waiting' | 'processing' | 'completed';
  deliveryTime?: string;
  notes?: string;
  completedAt?: string;
  addedBy: User;
  assignedTo?: User;
  completedBy?: User;
  completionProofImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  _id: string;
  expenseNumber: string;
  name: string;
  description?: string;
  category: 'equipment' | 'tools' | 'materials' | 'rent' | 'utilities' | 'salaries' | 'marketing' | 'other';
  amount: number;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'mobile' | 'evc_plus' | 'e_dahab' | 'jeeb' | 'bank';
  receipt?: string;
  recordedBy: User;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'sales_tech';
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

export interface Debt {
  _id: string;
  customerName: string;
  phone: string;
  whatsapp?: string;
  amountOwed: number;
  amountPaid: number;
  balance: number;
  dueAt: string;
  status: 'UNPAID' | 'PARTIAL' | 'SETTLED';
  contextType: 'SALE' | 'REPAIR' | 'OTHER';
  contextId?: string;
  notes?: string;
  createdBy: User;
  lastSharedAt?: string;
  lastShareChannel?: 'SMS' | 'WHATSAPP';
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  debtId: string;
  amount: number;
  method: 'CASH' | 'MOBILE_MONEY' | 'CARD' | 'EVC_PLUS' | 'E_DAHAB' | 'JEEB' | 'BANK';
  note?: string;
  createdBy: User;
  createdAt: string;
}

export interface MessageConfig {
  _id: string;
  smsEnabled: boolean;
  whatsappEnabled: boolean;
  smsSenderId?: string;
  whatsappBusinessNumber?: string;
  shopName: string;
  defaultTemplate: string;
  footer: string;
  currency: string;
  updatedAt: string;
}



