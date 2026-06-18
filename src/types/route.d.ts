import type { VehicleLive } from '@/types/vehicle';

export interface RouteStation {
  name: string;
  lat: number;
  lng: number;
}

export interface RouteMonitor {
  routeId: string;
  name: string;
  vehicles: VehicleLive[];
  avgSpeed: number;
  passengerLoad: number;
  delayMinutes: number;
  stations: RouteStation[];
}

export interface RouteDelayAlert {
  id: string;
  routeId: string;
  routeName: string;
  message: string;
  level: 'warning' | 'critical';
  delayMinutes: number;
  time: string;
  confirmed: boolean;
}
