<template>
  <button class="toggle-switch" :class="{ 'is-enabled': modelValue }" :title="title" @click="toggle" type="button">
    <slot name="on" v-if="modelValue">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-check"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10" /></svg>
    </slot>
    <slot name="off" v-else>
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
    </slot>
    <span v-if="label" class="label">{{ label }}</span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ToggleSwitch',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const toggle = () => {
      emit('update:modelValue', !props.modelValue);
    };

    return {
      toggle
    };
  }
});
</script>

<style lang="scss" scoped>
.toggle-switch {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  padding: 4px 8px;
  color: var(--figma-color-icon);
  gap: 6px;

  &:hover {
    background-color: var(--figma-color-bg-tertiary);
  }

  &.is-enabled {
    border-color: var(--figma-color-bg-brand);
  }
}

.label {
  font-size: 11px;
  color: var(--figma-color-text);
  user-select: none;
}
</style>
