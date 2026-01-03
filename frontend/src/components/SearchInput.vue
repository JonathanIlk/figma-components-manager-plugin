<template>
  <div class="search-input">
    <input
      type="text"
      placeholder="Search"
      :value="modelValue"
      @input="onInput"
    />
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

    return {
      onInput
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

  input {
    width: 100%;
    padding: 4px;
    border-radius: 8px;
    border: none;

    background: var(--figma-color-bg-secondary);
    color: var(--figma-color-text);

    &:focus {
      outline: none;
      background: var(--figma-color-bg-tertiary);
    }
  }
}
</style>

