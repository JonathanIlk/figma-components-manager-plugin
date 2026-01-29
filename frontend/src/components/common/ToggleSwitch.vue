<template>
  <label class="toggle-switch" :title="title">
    <input type="checkbox" :checked="modelValue" @change="updateValue">
    <span class="slider round"></span>
  </label>
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
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const updateValue = (event: Event) => {
      const target = event.target as HTMLInputElement;
      emit('update:modelValue', target.checked);
    };

    return {
      updateValue
    };
  }
});
</script>

<style lang="scss" scoped>
/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 28px;
  height: 16px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--figma-color-bg-tertiary);
  transition: .4s;
  border: 1px solid var(--figma-color-border);
}

.slider:before {
  position: absolute;
  content: "";
  height: 12px;
  width: 12px;
  left: 1px;
  bottom: 1px;
  background-color: var(--figma-color-icon);
  transition: .4s;
}

input:checked + .slider {
  background-color: var(--figma-color-bg-brand);
  border-color: var(--figma-color-bg-brand);
}

input:checked + .slider:before {
  transform: translateX(12px);
  background-color: white;
}

.slider.round {
  border-radius: 16px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>

