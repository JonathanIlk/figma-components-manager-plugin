<template>
  <div class="card instances-group" v-if="isVisible">
    <div class="card-header">
      <div
        class="title clickable-text"
        @click="navigateToNode"
      >
        {{ groupName.split(" - ")[0] || groupName }}
        <span class="tag-element">
          {{ groupName.split(" - ").slice(1).join(" - ") || 'All Variants' }}
        </span>
      </div>
    </div>
    <div class="card-content">
      <InstanceEntry
        v-for="instance in visibleInstances"
        :key="instance.nodeId"
        :instance="instance"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { ScannedInstance } from '../../scanned-nodes';
import { BackendMessageType } from '../../../../shared/types';
import InstanceEntry from "./InstanceEntry.vue";

export default defineComponent({
  name: 'InstancesGroup',
  components: {
    InstanceEntry
  },
  props: {
    groupName: {
      type: String,
      required: true
    },
    groupNodeId: {
      type: String,
      required: true
    },
    instances: {
      type: Array as PropType<ScannedInstance[]>,
      required: true
    },
    searchTerm: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const isGroupMatch = computed(() => {
      if (!props.searchTerm) return true;
      return props.groupName.toLowerCase().includes(props.searchTerm.toLowerCase());
    });

    const visibleInstances = computed(() => {
      if (!props.searchTerm) return props.instances;
      if (isGroupMatch.value) return props.instances;

      const lowerSearch = props.searchTerm.toLowerCase();
      return props.instances.filter(i => i.displayName.toLowerCase().includes(lowerSearch));
    });

    const isVisible = computed(() => {
      if (!props.searchTerm) return true;
      return isGroupMatch.value || visibleInstances.value.length > 0;
    });

    const navigateToNode = () => {
      parent.postMessage({
        pluginMessage: {
          type: BackendMessageType.NAVIGATE_TO_NODE,
          payload: props.groupNodeId,
        }
      }, '*');
    };

    return {
      isVisible,
      visibleInstances,
      navigateToNode
    };
  }
});
</script>

<style lang="scss" scoped>
.card .card-header .title {
  display: flex;
  justify-content: flex-start;
  gap: 8px;
}

.instances-group {
  .card-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 4px;
  }
}
</style>

