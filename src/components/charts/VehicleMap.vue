<template>
  <MapContainer :points="points" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MapContainer from '@/components/common/MapContainer.vue';
import { vehicleTypeLabels, type VehicleType } from '@/constants/enums';
import type { VehicleLive } from '@/types/vehicle';

const props = defineProps<{ vehicles: VehicleLive[]; filterType?: VehicleType }>();

const points = computed(() => props.vehicles
  .filter((item) => !props.filterType || item.type === props.filterType)
  .map((item) => ({
    id: item.id,
    lat: item.lat,
    lng: item.lng,
    label: `${item.plateNumber} ${vehicleTypeLabels[item.type]} ${item.speed}km/h`,
    kind: 'vehicle' as const
  })));
</script>
