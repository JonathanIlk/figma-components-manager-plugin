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

  .tab-buttons-container {
    display: flex;
    justify-content: space-around;

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
    height: 100%;
    overflow-y: auto;

    &.active {
      display: block;
    }
  }
}
</style>

