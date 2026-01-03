<template>
  <div class="search-input">
    <div class="input-wrapper">
      <div class="icon-wrapper">
        <template v-if="icon === 'search'">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round"
               class="icon icon-tabler icons-tabler-outline icon-tabler-search">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"/>
            <path d="M21 21l-6 -6"/>
          </svg>
        </template>
        <template v-else-if="icon === 'filter'">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               class="icon icon-tabler icons-tabler-outline icon-tabler-filter-2">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M4 6h16"/>
            <path d="M6 12h12"/>
            <path d="M9 18h6"/>
          </svg>
        </template>
      </div>
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
    },
    icon: {
      type: String as () => 'search' | 'filter',
      default: 'search',
      validator: (value: string) => ['search', 'filter'].includes(value)
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

  .icon-wrapper {
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    display: flex;
    align-items: center;
    color: var(--figma-color-text-tertiary, #b3b3b3);
    z-index: 1;
    width: 14px;
    height: 14px;
  }

  input {
    width: 100%;
    padding: 4px;
    padding-left: 26px;
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

