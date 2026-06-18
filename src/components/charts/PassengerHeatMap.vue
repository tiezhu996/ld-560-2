<template>
  <div ref="el" class="chart-box"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useChartTheme } from '@/hooks/useChartTheme';
import type { RouteMonitor } from '@/types/route';

const props = defineProps<{ routes: RouteMonitor[] }>();
const el = ref<HTMLElement | null>(null);
const { init, textStyle } = useChartTheme(el);
let chart: ReturnType<typeof init> = null;

function render() {
  const hours = ['6', '8', '10', '12', '14', '16', '18', '20'];
  chart?.setOption({
    tooltip: {},
    grid: { left: 82, right: 18, top: 20, bottom: 36 },
    xAxis: { type: 'category', data: hours, axisLabel: textStyle },
    yAxis: { type: 'category', data: props.routes.map((item) => item.name), axisLabel: textStyle },
    visualMap: { min: 20, max: 100, show: false, inRange: { color: ['#123d3a', '#40c6a4', '#f2c14e'] } },
    series: [{
      type: 'heatmap',
      data: props.routes.flatMap((route, y) => hours.map((_, x) => [x, y, Math.round(route.passengerLoad * (0.72 + Math.random() * 0.48))]))
    }]
  });
}

onMounted(() => {
  chart = init();
  render();
});
watch(() => props.routes, render, { deep: true });
</script>
