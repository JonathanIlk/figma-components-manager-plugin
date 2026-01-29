<template>
  <div class="instances-list">
    <InstancesGroup
      v-for="group in groupedInstances"
      :key="group.groupNodeId"
      :group-name="group.groupName"
      :group-node-id="group.groupNodeId"
      :instances="group.instances"
      :search-term="searchTerm"
    />
    <div v-if="groupedInstances.length === 0" class="no-instances-text">
      No instances found.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { FrontendStateService, StoredScanResults } from '../../frontend-state-service';
import { ScannedInstance } from '../../scanned-nodes';
import InstancesGroup from './InstancesGroup.vue';

interface InstanceGroupData {
  groupName: string;
  groupNodeId: string;
  instances: ScannedInstance[];
}

export default defineComponent({
  name: 'InstancesList',
  components: {
    InstancesGroup
  },
  props: {
    searchTerm: {
      type: String,
      default: ''
    }
  },
  setup() {
    const scanResultsManager = FrontendStateService.getInstance();

    const groupedInstances = computed(() => {
      const scanResults = scanResultsManager.state.scanResults;
      const groups: InstanceGroupData[] = [];

      for (const component of Object.values(scanResults.components)) {
        if (component.type === "COMPONENT_SET") {
          for (const variant of component.variants) {
            // For sets we categorize by variant
            if (variant.instances.length > 0) {
              groups.push({
                groupName: `${component.displayName} - ${variant.displayName}`,
                groupNodeId: variant.nodeId,
                instances: variant.instances,
              });
            }
          }
        } else if (component.type === "COMPONENT") {
          // Component without variants
          if (component.directInstances.length > 0) {
            groups.push({
              groupName: `${component.displayName}`,
              groupNodeId: component.nodeId,
              instances: component.directInstances,
            });
          }
        }
      }
      return groups;
    });

    return {
      groupedInstances
    };
  }
});
</script>

<style lang="scss" scoped>
.instances-list {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .no-instances-text {
    font-size: 0.8rem;
  }
}
</style>

