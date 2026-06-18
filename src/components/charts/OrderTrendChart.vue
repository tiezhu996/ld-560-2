<template>
  <div ref="el" class="chart-box"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { gridStyle } from '@/constants/chart-theme';
import { useChartTheme } from '@/hooks/useChartTheme';
import type { OrderStats } from '@/types/order';

const props = defineProps<{ stats: OrderStats[]; mode?: 'orders' | 'revenue' }>();
const el = ref<HTMLElement | null>(null);
const { init, palette, textStyle } = useChartTheme(el);
let chart: ReturnType<typeof init> = null;

function render() {
  const revenue = props.mode === 'revenue';
  chart?.setOption({
    color: [revenue ? palette[1] : palette[0]],
    grid: gridStyle,
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: props.stats.map((item) => item.date), axisLabel: textStyle },
    yAxis: { type: 'value', axisLabel: textStyle, splitLine: { lineStyle: { color: 'rgba(219,231,223,.12)' } } },
    series: [{
      type: 'line',
      smooth: true,
      areaStyle: revenue ? { opacity: 0.22 } : undefined,
      data: props.stats.map((item) => revenue ? item.revenue : item.totalOrders)
    }]
  });
}

onMounted(() => {
  chart = init();
  render();
});
watch(() => [props.stats, props.mode], render, { deep: true });
</script>
