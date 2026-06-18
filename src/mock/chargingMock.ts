import { PileStatus, PileType } from '@/constants/enums';
import type { ChargingAlert, ChargingPileLive, TrendPoint } from '@/types/charging';

const pileTypes = Object.values(PileType);
const statuses = Object.values(PileStatus);

export function createChargingPiles(count = 54): ChargingPileLive[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `pile-${index + 1}`,
    code: `CHG-${(1000 + index).toString()}`,
    lat: 31.13 + Math.random() * 0.22,
    lng: 121.33 + Math.random() * 0.34,
    type: pileTypes[index % pileTypes.length],
    status: statuses[index % statuses.length],
    currentPower: Math.round(15 + Math.random() * 150),
    todayUsage: Math.round(80 + Math.random() * 460),
    queueCount: Math.floor(Math.random() * 9)
  }));
}

export function updateChargingPiles(source: ChargingPileLive[]): ChargingPileLive[] {
  return source.map((item) => {
    const status = Math.random() > 0.88 ? statuses[Math.floor(Math.random() * statuses.length)] : item.status;
    return {
      ...item,
      status,
      currentPower: status === PileStatus.CHARGING ? Math.round(40 + Math.random() * 140) : 0,
      todayUsage: item.todayUsage + Math.round(Math.random() * 8),
      queueCount: status === PileStatus.CHARGING ? Math.floor(Math.random() * 12) : Math.floor(Math.random() * 3)
    };
  });
}

export function createChargingAlerts(piles: ChargingPileLive[]): ChargingAlert[] {
  return piles
    .filter((pile) => pile.status === PileStatus.FAULTY || pile.status === PileStatus.MAINTENANCE)
    .slice(0, 8)
    .map((pile) => ({
      id: `alert-${pile.id}`,
      pileCode: pile.code,
      message: pile.status === PileStatus.FAULTY ? '输出电流异常，已派发检修' : '计划维护中，暂停接单',
      level: pile.status === PileStatus.FAULTY ? 'critical' : 'warning',
      time: new Date().toLocaleTimeString(),
      confirmed: false
    }));
}

export function createQueueTrend(): TrendPoint[] {
  return Array.from({ length: 12 }, (_, index) => ({
    label: `${index * 2}:00`,
    value: Math.round(18 + Math.sin(index) * 8 + Math.random() * 12)
  }));
}
