<template>
  <div
    class="instance-info card-clickable-element"
    @click="navigateToNode"
  >
    {{ instance.displayName }}
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ScannedInstance } from '../../scanned-nodes';
import { BackendMessageType } from '../../../../shared/types';

export default defineComponent({
  name: 'InstanceInfo',
  props: {
    instance: {
      type: Object as PropType<ScannedInstance>,
      required: true
    }
  },
  setup(props) {
    const navigateToNode = () => {
      parent.postMessage({
        pluginMessage: {
          type: BackendMessageType.NAVIGATE_TO_NODE,
          payload: props.instance.nodeId,
        }
      }, '*');
    };

    return {
      navigateToNode
    };
  }
});
</script>

<style lang="scss" scoped>
.instance-info {
  font-size: 0.8rem;
  color: var(--figma-color-text-secondary);
}
</style>

