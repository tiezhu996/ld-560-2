import { onBeforeUnmount, onMounted, ref } from 'vue';

export function useAutoResize(baseWidth = 1920, baseHeight = 1080) {
  const scale = ref(1);

  function update() {
    scale.value = Math.min(window.innerWidth / baseWidth, window.innerHeight / baseHeight);
    document.documentElement.style.setProperty('--screen-scale', String(scale.value));
  }

  onMounted(() => {
    update();
    window.addEventListener('resize', update);
  });

  onBeforeUnmount(() => window.removeEventListener('resize', update));

  return { scale };
}
