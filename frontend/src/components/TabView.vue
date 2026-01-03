<template>
  <div class="tabview">
    <div class="tab-buttons-container">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        class="tab-button"
        :class="{ active: activeTab === index }"
        @click="activeTab = index"
      >
        {{ tab }}
      </button>
    </div>
    <div class="tab-content-container">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        class="tab-content"
        :class="{ active: activeTab === index }"
      >
        <slot :name="tab"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'TabView',
  setup() {
    const tabs = ['Components', 'Instances'];
    const activeTab = ref(0);

    return {
      tabs,
      activeTab
    };
  }
});
</script>

<style lang="scss" scoped>
.tabview {
  height: 100%;
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

  .tab-content-container {
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
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

