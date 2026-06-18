import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { VehicleStatus, VehicleType } from '@/constants/enums';
import type { VehicleLive } from '@/types/vehicle';
import { createVehicleTrend } from '@/mock/vehicleMock';

export const useVehicleStore = defineStore('vehicle', () => {
  const vehicles = ref<VehicleLive[]>([]);
  const trend = ref(createVehicleTrend());

  const byType = computed(() => Object.values(VehicleType).map((type) => ({
    type,
    count: vehicles.value.filter((item) => item.type === type).length
  })));

  const byStatus = computed(() => Object.values(VehicleStatus).map((status) => ({
    status,
    count: vehicles.value.filter((item) => item.status === status).length
  })));

  const faultyCount = computed(() => vehicles.value.filter((item) => item.status === VehicleStatus.FAULTY).length);
  const runningCount = computed(() => vehicles.value.filter((item) => item.status === VehicleStatus.RUNNING).length);

  function setVehicles(payload: VehicleLive[]) {
    vehicles.value = payload;
  }

  return { vehicles, trend, byType, byStatus, faultyCount, runningCount, setVehicles };
});
