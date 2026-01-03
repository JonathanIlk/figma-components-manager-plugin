<template>
  <div class="tabview">
    <div class="tab-buttons-container">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="tab-button"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>
    <div
      v-for="tab in tabs"
      :key="tab"
      class="tab-content content-container"
      :class="{ active: activeTab === tab }"
    >
      <slot :name="tab"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeUpdate } from 'vue';

export default defineComponent({
  name: 'TabView',
  setup(props, { slots }) {
    const tabs = ref(Object.keys(slots));
    const activeTab = ref(tabs.value[0]);

    onBeforeUpdate(() => {
      tabs.value = Object.keys(slots);
      if (!tabs.value.includes(activeTab.value) && tabs.value.length > 0) {
        activeTab.value = tabs.value[0];
      }
    });

    return {
      tabs,
      activeTab
    };
  }
});
</script>

<style lang="scss" scoped>
.tabview {
  display: flex;
  flex-direction: column;
  height: 100%; /* Ensure it takes full height of parent */

  .tab-buttons-container {
    display: flex;
    justify-content: space-around;
    flex-shrink: 0; /* Prevent shrinking */

    .tab-button {
      flex-grow: 1;
      padding: 8px 16px;
      cursor: pointer;
      border: none;
      background-color: var(--figma-color-bg-secondary);
      color: var(--figma-color-text-tertiary);
      transition: all 0.2s;
      font-weight: bold;

      &:hover {
        color: var(--figma-color-text);
      }

      &.active {
        background-color: var(--figma-color-bg-secondary-active);
        color: var(--figma-color-text);
      }
    }
  }

  .tab-content {
    display: none;
    flex: 1;
    overflow-y: auto;
    min-height: 0; /* Important for nested flex scrolling */

    &.active {
      display: block;
    }
  }
}
</style>

