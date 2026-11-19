// 後端 API 的資料格式（見 specs/CAFE-SPEC.md §6）
export interface Category {
  id: number;
  name: string;
  sortOrder: number;
}

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
}

export interface ReservationRequest {
  name: string;
  phone: string;
  email: string;
  reserveDate: string; // yyyy-MM-dd
  reserveTime: string; // HH:mm
  people: number | null;
  note: string;
}

export interface Reservation {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  reserveDate: string;
  reserveTime: string;
  people: number;
  note: string | null;
}

// 後端錯誤回應：{ message, fields: { 欄位: 訊息 } }
export interface ApiError {
  message: string;
  fields: Record<string, string>;
}
