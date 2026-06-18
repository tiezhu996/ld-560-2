import type { VehicleType } from '@/constants/enums';

export interface OrderTypeStat {
  type: VehicleType;
  total: number;
  revenue: number;
}

export interface OrderStats {
  date: string;
  totalOrders: number;
  completedRate: number;
  avgDistance: number;
  avgDuration: number;
  revenue: number;
  byType: OrderTypeStat[];
}

export interface OrderStreamItem {
  id: string;
  type: VehicleType;
  origin: string;
  destination: string;
  amount: number;
  time: string;
}
