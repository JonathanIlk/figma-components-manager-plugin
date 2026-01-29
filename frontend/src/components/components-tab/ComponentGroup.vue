<template>
  <div class="component-group">
    <div class="group-header" @click="toggleExpand">
      <div class="group-title">{{ pageName }}</div>
      <div class="expand-collapse-icon" :class="{ expanded: isExpanded }">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </div>
    <div
      class="expandable-content"
      ref="expandableContent"
      :class="{ visible: isExpanded }"
    >
      <div class="components-list-container">
        <ComponentInfoCard
          v-for="component in components"
          :key="component.nodeId"
          :component="component"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted, onUnmounted } from 'vue';
import { ScannedComponent } from "../../scanned-nodes";
import ComponentInfoCard from "./ComponentInfoCard.vue";
import { useExpandableAnimation } from "../common/util";

export default defineComponent({
  name: 'ComponentGroup',
  components: {
    ComponentInfoCard
  },
  props: {
    pageName: {
      type: String,
      required: true
    },
    components: {
      type: Array as PropType<ScannedComponent[]>,
      required: true
    }
  },
  setup() {
    const isExpanded = ref(true);
    const expandableContent = ref<HTMLElement | null>(null);

    const toggleExpand = () => {
      isExpanded.value = !isExpanded.value;
    };

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
      isExpanded,
      toggleExpand,
      expandableContent
    };
  }
});
</script>

<style lang="scss" scoped>
.component-group {
  display: flex;
  flex-direction: column;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;

  &:hover .group-title {
     color: var(--figma-color-text);
  }
}

.group-title {
  font-size: 0.8rem;
  color: var(--figma-color-text-secondary);
  font-weight: 500;
  transition: color 0.15s ease;
}

.expand-collapse-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--figma-color-text-secondary);
  transform: rotate(0deg);

  // Adjusted transition for smooth rotation
  transition: transform 0.3s ease;

  // When expanded, icon usually points up or behaves as a toggle.
  // Standard chevron-down (points down).
  // If "expanded", maybe it should remain down? Or rotate up to indicate "click to collapse"?
  // InstancesInfoCard uses: expanded { rotate(180deg) }.
  // Icon is polyline points="6 9 12 15 18 9" -> This is a Down Arrow (V shape).
  // If expanded (visible), it is rotated 180deg -> Points Up.
  // This means "Click to collapse (fold up)".
  // When collapsed (hidden), it points down -> "Click to expand (drop down)".
  // Yes, matching InstancesInfoCard logic.

  &.expanded {
    transform: rotate(180deg);
  }

  svg {
    width: 100%;
    height: 100%;
  }
}

.expandable-content {
  transition: all 0.25s ease-in-out;
  overflow: hidden;
  height: auto; // Start as auto because default is expanded
  opacity: 1;

  &.visible {
    margin-top: 8px;
  }
}

.components-list-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>

