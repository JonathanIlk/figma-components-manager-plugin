<template>
  <div id="components-list">
    <ComponentGroup
      v-for="group in groupedComponents"
      :key="group.pageName"
      :page-name="group.pageName"
      :components="group.components"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import { FrontendStateService } from '../../frontend-state-service';
import { ScannedComponent } from "../../scanned-nodes";
import {IComponentListConfig} from "./types";
import ComponentGroup from "./ComponentGroup.vue";

export default defineComponent({
  name: 'ComponentsList',
  components: {
    ComponentGroup
  },
  props: {
    config: {
      type: Object as PropType<IComponentListConfig>,
      required: true
    }
  },
  setup(props) {
    const scanResultsManager = FrontendStateService.getInstance();

    const filteredComponents = computed(() => {
      const components = Object.values(scanResultsManager.state.scanResults.components);

      let result = components;

      // Filter by Search term
      if (props.config.searchTerm) {
        const lowerSearch = props.config.searchTerm.toLowerCase();
        result = result.filter(c => c.searchTerm.toLowerCase().includes(lowerSearch));
      }

      // Sort according to active column
      const { sortColumn, sortDirection } = props.config;

      return result.sort((a, b) => {
        let valA: string | number = 0;
        let valB: string | number = 0;

        if (sortColumn === 'name') {
           valA = a.displayName;
           valB = b.displayName;
        } else if (sortColumn === 'instances') {
           // Calculate total instances (component instances + variant instances)
           const countA = a.allDescendantInstances.length;
           const countB = b.allDescendantInstances.length;
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

    const groupedComponents = computed(() => {
      if (!props.config.groupByPage) {
        return [{
          pageName: 'All Components',
          components: filteredComponents.value
        }];
      }

      const groups: Record<string, ScannedComponent[]> = {};

      for (const component of filteredComponents.value) {
        const pageName = component.pageName || 'Unknown Page';
        if (!groups[pageName]) {
          groups[pageName] = [];
        }
        groups[pageName].push(component);
      }

      const sortedPageNames = Object.keys(groups).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

      return sortedPageNames.map(pageName => ({
        pageName,
        components: groups[pageName]
      }));
    });

    return {
      groupedComponents
    };
  }
});
</script>

<style lang="scss" scoped>
#components-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
