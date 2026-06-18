import { onBeforeUnmount, onMounted, type Ref } from 'vue';
import * as echarts from 'echarts';
import { chartPalette, chartTextStyle } from '@/constants/chart-theme';

export function useChartTheme(el: Ref<HTMLElement | null>) {
  let chart: echarts.ECharts | null = null;

  function init() {
    if (!el.value) return null;
    chart = echarts.init(el.value, undefined, { renderer: 'canvas' });
    return chart;
  }

  function resize() {
    chart?.resize();
  }

  onMounted(() => window.addEventListener('resize', resize));
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resize);
    chart?.dispose();
  });

  return { init, resize, palette: chartPalette, textStyle: chartTextStyle };
}
