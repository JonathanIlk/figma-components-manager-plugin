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
import { defineComponent, computed } from 'vue';
import { FrontendStateService } from '../frontend-state-service';
import ComponentInfo from './ComponentInfo.vue';

export default defineComponent({
  name: 'ComponentsList',
  components: {
    ComponentInfo
  },
  props: {
    searchTerm: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const scanResultsManager = FrontendStateService.getInstance();

    const filteredComponents = computed(() => {
      const components = Object.values(scanResultsManager.state.scanResults.components);
      if (!props.searchTerm) {
        return components;
      }
      const lowerSearch = props.searchTerm.toLowerCase();
      return components.filter(c => c.searchTerm.toLowerCase().includes(lowerSearch));
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

