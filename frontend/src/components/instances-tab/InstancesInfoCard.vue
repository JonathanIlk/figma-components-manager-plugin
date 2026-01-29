<template>
  <div class="card instances-group" v-if="isVisible">
    <div class="card-header">
      <div class="title">
        <div
          class="clickable-text"
          @click="navigateToNode"
        >
          {{ groupName.split(" - ")[0] || groupName }}
          <span class="tag-element">
            {{ groupName.split(" - ").slice(1).join(" - ") || 'All Variants' }}
          </span>
        </div>
        <div class="expand-collapse-icon" :class="{ expanded: isExpanded }" @click="toggleExpand">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
      <div class="sub-title">
        <span class="tag-element">
          <span class="instances-count">{{ visibleInstances.length }}</span> instances
        </span>
      </div>
    </div>
    <div
      class="card-content expandable-content instance-entries-grid"
      ref="expandableContent"
      :class="{ visible: isExpanded }"
    >
      <InstanceEntry
        v-for="instance in visibleInstances"
        :key="instance.nodeId"
        :instance="instance"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, onMounted, onUnmounted } from 'vue';
import { ScannedInstance } from '../../scanned-nodes';
import { BackendMessageType } from '../../../../shared/types';
import InstanceEntry from "./InstanceEntry.vue";
import { useExpandableAnimation } from "../common/util";
import SearchInput from "../common/SearchInput.vue";

export default defineComponent({
  name: 'InstancesGroup',
  components: {
    SearchInput,
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
    const isExpanded = ref(false);
    const expandableContent = ref<HTMLElement | null>(null);

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

    const toggleExpand = () => {
      isExpanded.value = !isExpanded.value;
    };

    // Listen for global expand/collapse event
    const handleGlobalExpandCollapse = (event: Event) => {
      const customEvent = event as CustomEvent;
      isExpanded.value = customEvent.detail;
    };

    onMounted(() => {
      window.addEventListener('toggle-expand-collapse-all', handleGlobalExpandCollapse);
    });

    onUnmounted(() => {
      window.removeEventListener('toggle-expand-collapse-all', handleGlobalExpandCollapse);
    });

    useExpandableAnimation(isExpanded, expandableContent);

    return {
      isVisible,
      visibleInstances,
      navigateToNode,
      isExpanded,
      toggleExpand,
      expandableContent
    };
  }
});
</script>

<style lang="scss" scoped>
.card .card-header .title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;

  .clickable-text {
    flex-grow: 1;
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.instances-group {
  .expandable-content {
    transition: all 0.25s ease-in-out;
    overflow: hidden;
    height: 0;
    margin-top: 0;

    &.visible {
      margin-top: 0.75rem;
    }
  }

  .instance-entries-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 4px;
  }
}
</style>
