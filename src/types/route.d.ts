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
