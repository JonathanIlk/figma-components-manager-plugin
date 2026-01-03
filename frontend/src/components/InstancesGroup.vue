<template>
  <div class="card instances-group" v-if="isVisible">
    <div class="card-header">
      <div
        class="title"
        @click="navigateToNode"
      >
        {{ groupName }}
      </div>
    </div>
    <div class="card-content">
      <InstanceInfo
        v-for="instance in visibleInstances"
        :key="instance.nodeId"
        :instance="instance"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { ScannedInstance } from '../scanned-nodes';
import InstanceInfo from './InstanceInfo.vue';
import { BackendMessageType } from '../../../shared/types';

export default defineComponent({
  name: 'InstancesGroup',
  components: {
    InstanceInfo
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
.instances-group {
  .card-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 4px;
  }
}
</style>

