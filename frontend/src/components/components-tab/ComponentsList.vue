<template>
  <div id="components-list">
    <ComponentInfo
      v-for="component in filteredComponents"
      :key="component.nodeId"
      :component="component"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import { FrontendStateService } from '../../frontend-state-service';
import ComponentInfo from './ComponentInfo.vue';

export interface ComponentListConfig {
  searchTerm: string;
  sortColumn: 'name' | 'instances';
  sortDirection: 'asc' | 'desc';
}

export default defineComponent({
  name: 'ComponentsList',
  components: {
    ComponentInfo
  },
  props: {
    config: {
      type: Object as PropType<ComponentListConfig>,
      required: true
    }
  },
  setup(props) {
    const scanResultsManager = FrontendStateService.getInstance();

    const filteredComponents = computed(() => {
      const components = Object.values(scanResultsManager.state.scanResults.components);

      let result = components;

      if (props.config.searchTerm) {
        const lowerSearch = props.config.searchTerm.toLowerCase();
        result = result.filter(c => c.searchTerm.toLowerCase().includes(lowerSearch));
      }

      const { sortColumn, sortDirection } = props.config;

      return result.sort((a, b) => {
        let valA: string | number = 0;
        let valB: string | number = 0;

        if (sortColumn === 'name') {
           valA = a.displayName;
           valB = b.displayName;
        } else if (sortColumn === 'instances') {
           // Calculate total instances (component instances + variant instances)
           const countA = a.instances.length + a.variants.reduce((sum, v) => sum + v.instances.length, 0);
           const countB = b.instances.length + b.variants.reduce((sum, v) => sum + v.instances.length, 0);
           valA = countA;
           valB = countB;
        }

        let comparison = 0;
        if (typeof valA === 'number' && typeof valB === 'number') {
            comparison = valA - valB;
        } else {
            comparison = String(valA).localeCompare(String(valB), undefined, { numeric: true });
        }

        return sortDirection === 'asc' ? comparison : -comparison;
      });
    });

    return {
      filteredComponents
    };
  }
});
</script>

<style lang="scss" scoped>
#components-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
