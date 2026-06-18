import type { VehicleStatus, VehicleType } from '@/constants/enums';

export interface VehicleLive {
  id: string;
  plateNumber: string;
  type: VehicleType;
  lat: number;
  lng: number;
  speed: number;
  direction: number;
  status: VehicleStatus;
  lastUpdate: string;
}

export interface VehicleTrendPoint {
  hour: string;
  onlineRate: number;
}
