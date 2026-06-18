export enum VehicleType {
  BUS = 'BUS',
  TAXI = 'TAXI',
  RIDE_HAILING = 'RIDE_HAILING',
  LOGISTICS = 'LOGISTICS'
}

export enum VehicleStatus {
  RUNNING = 'RUNNING',
  PARKING = 'PARKING',
  FAULTY = 'FAULTY',
  IDLE = 'IDLE'
}

export enum PileType {
  FAST = 'FAST',
  SLOW = 'SLOW'
}

export enum PileStatus {
  IDLE = 'IDLE',
  CHARGING = 'CHARGING',
  FAULTY = 'FAULTY',
  MAINTENANCE = 'MAINTENANCE'
}

export const vehicleTypeLabels: Record<VehicleType, string> = {
  [VehicleType.BUS]: '公交',
  [VehicleType.TAXI]: '出租',
  [VehicleType.RIDE_HAILING]: '网约车',
  [VehicleType.LOGISTICS]: '物流'
};

export const vehicleStatusLabels: Record<VehicleStatus, string> = {
  [VehicleStatus.RUNNING]: '行驶中',
  [VehicleStatus.PARKING]: '停靠',
  [VehicleStatus.FAULTY]: '故障',
  [VehicleStatus.IDLE]: '空载'
};

export const pileTypeLabels: Record<PileType, string> = {
  [PileType.FAST]: '快充',
  [PileType.SLOW]: '慢充'
};

export const pileStatusLabels: Record<PileStatus, string> = {
  [PileStatus.IDLE]: '空闲',
  [PileStatus.CHARGING]: '充电中',
  [PileStatus.FAULTY]: '故障',
  [PileStatus.MAINTENANCE]: '维护'
};
