<template>
  <div ref="el" class="chart-box"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { pileStatusLabels, type PileStatus } from '@/constants/enums';
import { useChartTheme } from '@/hooks/useChartTheme';

const props = defineProps<{ data: { status: PileStatus; count: number }[] }>();
const el = ref<HTMLElement | null>(null);
const { init, palette, textStyle } = useChartTheme(el);
let chart: ReturnType<typeof init> = null;

function render() {
  chart?.setOption({
    color: palette,
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle },
    series: [{
      type: 'pie',
      radius: ['48%', '72%'],
      data: props.data.map((item) => ({ name: pileStatusLabels[item.status], value: item.count }))
    }]
  });
}

onMounted(() => {
  chart = init();
  render();
});
watch(() => props.data, render, { deep: true });
</script>
