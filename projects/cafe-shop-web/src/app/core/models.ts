// 後端 AppResponse<T>：{ code, message, data }
export interface AppResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface LoginResult {
  token: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  sortOrder: number;
}

export interface ProductSummary {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  status: 'ON_SALE' | 'OFF_SHELF';
  soldOut: boolean;
}

export interface Variant {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

export interface ProductDetail extends Omit<ProductSummary, 'soldOut'> {
  sortOrder: number;
  variants: Variant[];
}

export interface CartItem {
  variantId: number;
  productId: number;
  productName: string;
  variantName: string;
  imageUrl: string | null;
  price: number;
  stock: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  itemsAmount: number;
  shippingFee: number;
  totalAmount: number;
  freeShippingGap: number;
}

// 訪客購物車存在 localStorage 的格式
export interface GuestCartItem {
  variantId: number;
  quantity: number;
  // 顯示用（後端合併時只看 variantId、quantity）
  productId: number;
  productName: string;
  variantName: string;
  imageUrl: string | null;
  price: number;
  stock: number;
}

export type OrderStatus = 'PENDING_PAYMENT' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';

export interface OrderSummary {
  orderNo: string;
  status: OrderStatus;
  statusLabel: string;
  totalAmount: number;
  itemCount: number;
  receiverName: string;
  createdAt: string;
}

export interface OrderItem {
  productId: number;
  variantId: number;
  productName: string;
  variantName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Payment {
  merchantTradeNo: string;
  provider: string;
  amount: number;
  status: string;
  tradeNo: string | null;
  rtnCode: string | null;
  rtnMsg: string | null;
  simulatePaid: boolean;
  paidAt: string | null;
  createdAt: string;
}

export interface OrderDetail {
  orderNo: string;
  status: OrderStatus;
  statusLabel: string;
  itemsAmount: number;
  shippingFee: number;
  totalAmount: number;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  note: string | null;
  trackingNo: string | null;
  createdAt: string;
  paidAt: string | null;
  shippedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  items: OrderItem[];
  payments: Payment[] | null; // 只有後台有
  warning: string | null;     // 只有後台有
}

export interface CheckoutRequest {
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  note: string;
}

export interface EcpayForm {
  action: string;
  fields: Record<string, string>;
}

export interface VariantRequest {
  id: number | null;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

export interface ProductRequest {
  categoryId: number;
  name: string;
  description: string;
  imageUrl: string | null;
  sortOrder: number;
  variants: VariantRequest[];
}

export interface DailySales {
  salesDate: string;
  orderCount: number;
  revenue: number;
}

export interface ProductRank {
  productId: number;
  productName: string;
  quantity: number;
  revenue: number;
}

export interface CategorySales {
  categoryId: number;
  categoryName: string;
  quantity: number;
  revenue: number;
}

export interface Dashboard {
  todayRevenue: number;
  todayOrders: number;
  pendingShipCount: number;
  last7Days: DailySales[];
  top5: ProductRank[];
}

export interface SalesReport {
  from: string;
  to: string;
  totalRevenue: number;
  totalOrders: number;
  daily: DailySales[];
  categories: CategorySales[];
  products: ProductRank[];
}

export interface EcpayQuery {
  merchantTradeNo: string;
  tradeStatus: string;
  message: string;
  orderStatus: string;
}
