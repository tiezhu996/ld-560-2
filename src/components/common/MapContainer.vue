<template>
  <section class="map-panel">
    <div ref="mapRoot" class="map-root"></div>
    <div v-if="!mapReady" class="fallback-map">
      <p>{{ mapFallbackNotice }}</p>
      <div class="geo-grid">
        <span v-for="point in points" :key="point.id" :class="['geo-point', point.kind]" :style="point.style" :title="point.label"></span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader';
import { computed, onMounted, ref, watch } from 'vue';
import { AMAP_SECURITY_CONFIG, MAP_CENTER, MAP_ZOOM, mapFallbackNotice } from '@/constants/map-config';

interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  label: string;
  kind: 'vehicle' | 'charging' | 'station';
}

const props = defineProps<{ points: MapPoint[] }>();
const mapRoot = ref<HTMLElement | null>(null);
const mapReady = ref(false);
let map: any;
let markers: any[] = [];

const points = computed(() => props.points.map((point) => ({
  ...point,
  style: {
    left: `${Math.min(94, Math.max(4, (point.lng - 121.28) * 190))}%`,
    top: `${Math.min(92, Math.max(5, (31.42 - point.lat) * 260))}%`
  }
})));

function renderMarkers(AMap: any) {
  markers.forEach((marker) => marker.setMap(null));
  markers = props.points.map((point) => new AMap.Marker({
    position: [point.lng, point.lat],
    title: point.label,
    content: `<div class="amap-dot ${point.kind}"></div>`
  }));
  map?.add(markers);
}

onMounted(async () => {
  const key = import.meta.env.VITE_AMAP_KEY;
  if (!key || !mapRoot.value) return;
  try {
    const AMap = await AMapLoader.load({ key, ...AMAP_SECURITY_CONFIG });
    map = new AMap.Map(mapRoot.value, { zoom: MAP_ZOOM, center: MAP_CENTER, viewMode: '2D' });
    mapReady.value = true;
    renderMarkers(AMap);
    watch(() => props.points, () => renderMarkers(AMap), { deep: true });
  } catch {
    mapReady.value = false;
  }
});
</script>
