<template>
  <div class="components-list-header">
    <span class="tag-element subtle-text">
      <span class="instances-count">{{ instancesCount }}</span> instances in total
    </span>
    <span v-if="updateSeriesInformation?.updateType !== 'final-series-update'">
        <span class="update-spinner-tag tag-element subtle-text">
          <LoadingSpinner></LoadingSpinner>
          <span class="series-counter">{{updateSeriesInformation?.currentUpdateIndex}}/{{updateSeriesInformation?.updatesExpectedInSeries}}</span>
          Scanning document...
        </span>
    </span>
    <span class="expand-collapse-icon" :class="{ expanded: isAllExpanded }" @click="toggleExpandCollapseAll">
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" fill="none" viewBox="0 0 24 24">
        <path d="m8 7 4 4 4-4m-8 6 4 4 4-4"/>
      </svg>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { FrontendStateService } from '../../frontend-state-service';
import LoadingSpinner from "../common/LoadingSpinner.vue";

export default defineComponent({
  name: 'ComponentsListHeader',
  components: {LoadingSpinner},
  setup() {
    const scanResultsManager = FrontendStateService.getInstance();
    const isAllExpanded = ref(false);

    const instancesCount = computed(() => {
      return Object.values(scanResultsManager.state.scanResults.components).flatMap(component => component.allDescendantInstances).length;
    });

    const updateSeriesInformation = computed(() => {
      return scanResultsManager.state.other.lastDocumentUpdateSeriesInfo;
    })

    const toggleExpandCollapseAll = () => {
      isAllExpanded.value = !isAllExpanded.value;
      // Dispatch a custom event to be handled by the parent or use a global event bus
      // For simplicity, we can use a global event bus or a shared state for expansion
      // Here we will emit an event on the window object for simplicity in this migration
      window.dispatchEvent(new CustomEvent('toggle-expand-collapse-all', { detail: isAllExpanded.value }));
    };

    return {
      instancesCount,
      updateSeriesInformation,
      isAllExpanded,
      toggleExpandCollapseAll
    };
  }
});
</script>

<style lang="scss" scoped>
.components-list-header {
  padding-bottom: 8px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  position: relative;

  .expand-collapse-icon {
    position: absolute;
    right: 0;
    top: 0;
    width: 24px;
    cursor: pointer;
    transition: transform 0.2s;

    &.expanded {
      transform: rotate(180deg);
    }
  }
}

.update-spinner-tag {
  display: flex;
  align-items: center;
  gap: 4px;

  .series-counter {
    font-weight: 600;
    margin-left: 4px;
  }
}
</style>

