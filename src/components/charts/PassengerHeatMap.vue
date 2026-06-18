<template>
  <div ref="el" class="chart-box"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useChartTheme } from '@/hooks/useChartTheme';
import type { RouteMonitor } from '@/types/route';

const props = defineProps<{
  routes: RouteMonitor[];
  highlightRoutes?: { routeId: string; level: 'warning' | 'critical' }[];
}>();
const el = ref<HTMLElement | null>(null);
const { init, textStyle } = useChartTheme(el);
let chart: ReturnType<typeof init> = null;

function render() {
  const hours = ['6', '8', '10', '12', '14', '16', '18', '20'];
  const highlightMap = new Map(
    (props.highlightRoutes || []).map((item) => [item.routeId, item.level])
  );

  const yAxisLabels = props.routes.map((route) => {
    const level = highlightMap.get(route.routeId);
    if (level === 'critical') return `{critical|${route.name}}`;
    if (level === 'warning') return `{warning|${route.name}}`;
    return route.name;
  });

  chart?.setOption({
    tooltip: {},
    grid: { left: 110, right: 18, top: 20, bottom: 36 },
    xAxis: { type: 'category', data: hours, axisLabel: textStyle },
    yAxis: {
      type: 'category',
      data: yAxisLabels,
      axisLabel: {
        ...textStyle,
        rich: {
          critical: {
            color: '#f46d75',
            fontWeight: 'bold',
            padding: [2, 6],
            backgroundColor: 'rgba(244,109,117,.12)',
            borderRadius: 3
          },
          warning: {
            color: '#f2c14e',
            fontWeight: 'bold',
            padding: [2, 6],
            backgroundColor: 'rgba(242,193,78,.12)',
            borderRadius: 3
          }
        }
      }
    },
    visualMap: { min: 20, max: 100, show: false, inRange: { color: ['#123d3a', '#40c6a4', '#f2c14e'] } },
    series: [{
      type: 'heatmap',
      data: props.routes.flatMap((route, y) => {
        const level = highlightMap.get(route.routeId);
        return hours.map((_, x) => {
          const value = Math.round(route.passengerLoad * (0.72 + Math.random() * 0.48));
          const item: any = [x, y, value];
          if (level === 'critical') {
            item.itemStyle = {
              borderColor: '#f46d75',
              borderWidth: 1
            };
          } else if (level === 'warning') {
            item.itemStyle = {
              borderColor: '#f2c14e',
              borderWidth: 1
            };
          }
          return item;
        });
      })
    }]
  });
}

onMounted(() => {
  chart = init();
  render();
});
watch(() => [props.routes, props.highlightRoutes], render, { deep: true });
</script>
