import { VehicleType } from '@/constants/enums';
import type { OrderStats, OrderStreamItem } from '@/types/order';

const types = Object.values(VehicleType);
const places = ['虹桥枢纽', '人民广场', '张江园区', '陆家嘴', '前滩中心', '徐家汇'];

export function createOrderStats(days = 14): OrderStats[] {
  return Array.from({ length: days }, (_, index) => {
    const totalOrders = Math.round(7800 + index * 185 + Math.random() * 1200);
    return {
      date: `06-${(index + 1).toString().padStart(2, '0')}`,
      totalOrders,
      completedRate: Number((0.86 + Math.random() * 0.11).toFixed(2)),
      avgDistance: Number((7 + Math.random() * 8).toFixed(1)),
      avgDuration: Number((18 + Math.random() * 16).toFixed(1)),
      revenue: Math.round(totalOrders * (18 + Math.random() * 9)),
      byType: types.map((type, typeIndex) => ({
        type,
        total: Math.round(totalOrders * (0.18 + typeIndex * 0.035 + Math.random() * 0.05)),
        revenue: Math.round(totalOrders * (4 + typeIndex * 1.5 + Math.random() * 3))
      }))
    };
  });
}

export function updateOrderStats(source: OrderStats[]): OrderStats[] {
  const latest = source[source.length - 1];
  return [
    ...source.slice(1),
    {
      ...latest,
      totalOrders: latest.totalOrders + Math.round(20 + Math.random() * 80),
      completedRate: Number(Math.min(0.99, latest.completedRate + (Math.random() - 0.45) * 0.01).toFixed(2)),
      revenue: latest.revenue + Math.round(800 + Math.random() * 2800)
    }
  ];
}

export function createOrderStream(count = 28): OrderStreamItem[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `ord-${Date.now()}-${index}`,
    type: types[index % types.length],
    origin: places[index % places.length],
    destination: places[(index + 2) % places.length],
    amount: Math.round(18 + Math.random() * 126),
    time: new Date(Date.now() - index * 45000).toLocaleTimeString()
  }));
}
