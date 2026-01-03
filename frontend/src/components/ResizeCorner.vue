<template>
  <div class="resize-corner">
    <svg
      ref="corner"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style="display: block;"
      @pointerdown="handlePointerDown"
      @pointerup="handlePointerUp"
    >
      <path d="M16 0V16H0L16 0Z" fill="white" />
      <path d="M6.22577 16H3L16 3V6.22576L6.22577 16Z" fill="#8C8C8C" />
      <path d="M11.8602 16H8.63441L16 8.63441V11.8602L11.8602 16Z" fill="#8C8C8C" />
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { BackendMessageType } from '../../../shared/types';

export default defineComponent({
  name: 'ResizeCorner',
  setup() {
    const corner = ref<SVGElement | null>(null);

    const requestResize = (e: PointerEvent) => {
      const width = Math.max(50, Math.floor(e.clientX + 5));
      const height = Math.max(50, Math.floor(e.clientY + 5));

      parent.postMessage({
        pluginMessage: {
          type: BackendMessageType.RESIZE,
          payload: {
            width: width,
            height: height
          }
        }
      }, '*');
    };

    const handlePointerDown = (e: PointerEvent) => {
      const el = corner.value;
      if (!el) return;

      el.setPointerCapture(e.pointerId);
      el.addEventListener('pointermove', requestResize);
    };

    const handlePointerUp = (e: PointerEvent) => {
      const el = corner.value;
      if (!el) return;

      el.releasePointerCapture(e.pointerId);
      el.removeEventListener('pointermove', requestResize);
    };

    return {
      corner,
      handlePointerDown,
      handlePointerUp
    };
  }
});
</script>

<style lang="scss" scoped>
.resize-corner {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 1000;
  cursor: nwse-resize;
}
</style>

