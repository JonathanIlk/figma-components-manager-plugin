<template>
  <div class="search-input">
    <div class="input-wrapper">
      <input
        type="text"
        placeholder="Search"
        :value="modelValue"
        @input="onInput"
      />
      <button
        v-if="modelValue"
        class="clear-button"
        @click="onClear"
        title="Clear search"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SearchInput',
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const onInput = (event: Event) => {
      const input = event.target as HTMLInputElement;
      emit('update:modelValue', input.value);
    };

    const onClear = () => {
      emit('update:modelValue', '');
    };

    return {
      onInput,
      onClear
    };
  }
});
</script>

<style lang="scss" scoped>
.search-input {
  display: block;
  width: 100%;
  padding-top: 4px;
  padding-bottom: 8px;

  .input-wrapper {
    position: relative;
    width: 100%;
  }

  input {
    width: 100%;
    padding: 4px;
    padding-right: 26px;
    border-radius: 8px;
    border: none;

    background: var(--figma-color-bg-secondary);
    color: var(--figma-color-text);

    &:focus {
      outline: none;
      background: var(--figma-color-bg-tertiary);
    }
  }

  .clear-button {
    position: absolute;
    right: 2px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    padding: 0;
    border: none;
    background: var(--figma-color-bg-tertiary);
    color: var(--figma-color-text);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
    line-height: 1;
    border-radius: 4px;
    z-index: 1;

    &:hover {
      background: var(--figma-color-bg-hover);
      color: var(--figma-color-text);
    }

    &:active {
      background: var(--figma-color-bg-pressed);
    }
  }
}
</style>

