<template>
  <div ref="el" class="chart-box"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useChartTheme } from '@/hooks/useChartTheme';

const props = defineProps<{ value: number; name: string; max?: number }>();
const el = ref<HTMLElement | null>(null);
const { init, palette } = useChartTheme(el);
let chart: ReturnType<typeof init> = null;

function render() {
  chart?.setOption({
    series: [{
      type: 'gauge',
      min: 0,
      max: props.max || 100,
      progress: { show: true, width: 12, itemStyle: { color: palette[0] } },
      axisLine: { lineStyle: { width: 12, color: [[1, 'rgba(219,231,223,.12)']] } },
      detail: { valueAnimation: true, color: '#eef6ef', fontSize: 24 },
      title: { color: '#9fb5a8', fontSize: 13 },
      data: [{ value: props.value, name: props.name }]
    }]
  });
}

onMounted(() => {
  chart = init();
  render();
});
watch(() => props.value, render);
</script>
