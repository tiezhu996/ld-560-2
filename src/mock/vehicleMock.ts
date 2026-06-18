import { VehicleStatus, VehicleType } from '@/constants/enums';
import type { VehicleLive, VehicleTrendPoint } from '@/types/vehicle';

const types = Object.values(VehicleType);
const statuses = Object.values(VehicleStatus);

export function createVehicles(count = 96): VehicleLive[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `veh-${index + 1}`,
    plateNumber: `沪${String.fromCharCode(65 + (index % 20))}${(70000 + index * 37).toString()}`,
    type: types[index % types.length],
    lat: 31.12 + Math.random() * 0.24,
    lng: 121.34 + Math.random() * 0.32,
    speed: Math.round(20 + Math.random() * 58),
    direction: Math.round(Math.random() * 360),
    status: statuses[index % statuses.length],
    lastUpdate: new Date().toISOString()
  }));
}

export function updateVehicles(source: VehicleLive[]): VehicleLive[] {
  return source.map((item) => {
    const status = Math.random() > 0.96 ? statuses[Math.floor(Math.random() * statuses.length)] : item.status;
    return {
      ...item,
      lat: item.lat + (Math.random() - 0.5) * 0.002,
      lng: item.lng + (Math.random() - 0.5) * 0.002,
      speed: status === VehicleStatus.FAULTY || status === VehicleStatus.PARKING ? 0 : Math.round(18 + Math.random() * 66),
      direction: (item.direction + Math.round(Math.random() * 18)) % 360,
      status,
      lastUpdate: new Date().toISOString()
    };
  });
}

export function createVehicleTrend(): VehicleTrendPoint[] {
  return Array.from({ length: 24 }, (_, hour) => ({
    hour: `${hour.toString().padStart(2, '0')}:00`,
    onlineRate: Math.round(78 + Math.sin(hour / 3) * 11 + Math.random() * 7)
  }));
}
