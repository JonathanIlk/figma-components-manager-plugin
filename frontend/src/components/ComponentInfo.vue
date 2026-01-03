<template>
  <div class="card component-info">
    <div class="card-header">
      <div class="title">
        <div class="component-name clickable-text" @click="navigateToNode(component.nodeId)">{{ component.displayName }}</div>
        <div v-if="component.variants.length > 0" class="expand-collapse-icon" :class="{ expanded: isExpanded }" @click="toggleExpand">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
      <div class="sub-title">
        <span class="tag-element">
          <span class="variants-count">{{ component.variants.length }}</span> variants
        </span>
        <span class="tag-element">
          <span class="instances-count">{{ component.instances.length }}</span> instances
        </span>
      </div>
    </div>

    <!-- Variants Grid -->
    <div
      class="card-content expandable-content variants-grid"
      :class="{ visible: isExpanded }"
      :style="gridStyle"
      ref="expandableContent"
    >
      <!-- Header with Variant properties -->
      <div v-for="variant in component.variantProperties" :key="variant" class="subtle-text variant-property-header grid-header">
        {{ variant }}
      </div>
      <div class="subtle-text grid-header">Instances</div>

      <!-- Loop through all variants -->
      <template v-for="variant in component.variants" :key="variant.nodeId">
        <div class="variant-row">
          <div class="variant-properties-container">

            <!-- properties of the variant -->
            <div
              v-for="(property, index) in variant.propertyValues"
              :key="index"
              class="card-clickable-element variant-property"
              @click="navigateToNode(variant.nodeId)"
              @mouseenter="setHover(variant.nodeId, 'variant')"
              @mouseleave="setHover(variant.nodeId, false)"
              :class="{ hover: hoverStates[variant.nodeId] === 'variant' }"
            >
              {{ property }}
            </div>
          </div>

          <!-- Instance count of variant -->
          <div
            class="card-clickable-element variant-instances"
            @click="cycleThroughInstances(variant.nodeId)"
            @mouseenter="setHover(variant.nodeId, 'instances')"
            @mouseleave="setHover(variant.nodeId, false)"
            :class="{ hover: hoverStates[variant.nodeId] === 'instances', disabled: variant.instances.length === 0 }"
          >
            <span :class="{ 'instances-count': variant.instances.length > 0}">
              {{ variant.instances.length }}
            </span>
            {{variant.instances .length === 1 ? 'instance' : 'instances' }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { ScannedComponent } from '../scanned-nodes';
import { BackendMessageType } from '../../../shared/types';
import {util} from "../../frontend";

// Which element of a variant is being hovered
type HoverState = "variant" | "instances" | false;

export default defineComponent({
  name: 'ComponentInfo',
  props: {
    component: {
      type: Object as PropType<ScannedComponent>,
      required: true
    }
  },
  setup(props) {
    const isExpanded = ref(false);
    const expandableContent = ref<HTMLElement | null>(null);
    const hoverStates = ref<Record<string, HoverState>>({});

    const gridStyle = computed(() => {
      const propertyCount = props.component.variantProperties.length;
      const columns = propertyCount > 1
        ? `repeat(${propertyCount - 1}, max-content) 1fr 120px`
        : 'auto 120px';
      return {
        gridTemplateColumns: columns
      };
    });

    const toggleExpand = () => {
      isExpanded.value = !isExpanded.value;
    };

    const navigateToNode = (nodeId: string) => {
      parent.postMessage({
        pluginMessage: {
          type: BackendMessageType.NAVIGATE_TO_NODE,
          payload: nodeId,
        }
      }, '*');
    };

    const cycleThroughInstances = (nodeId: string) => {
      parent.postMessage({
        pluginMessage: {
          type: BackendMessageType.CYCLE_THROUGH_INSTANCES,
          payload: nodeId,
        }
      }, '*');
    };

    const setHover = (nodeId: string, newHoverState: HoverState) => {
      hoverStates.value[nodeId] = newHoverState;
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

    watch(isExpanded, (newValue) => {
      if (expandableContent.value) {
        if (newValue) {
          expandableContent.value.style.height = expandableContent.value.scrollHeight + "px";
        } else {
          expandableContent.value.style.height = "0px";
        }
      }
    });

    return {
      isExpanded,
      gridStyle,
      toggleExpand,
      navigateToNode,
      cycleThroughInstances,
      setHover,
      hoverStates,
      expandableContent
    };
  }
});
</script>

<style lang="scss" scoped>
@import "../styles.scss";

.component-info {
  .expandable-content {
    transition: all 0.3s ease-in-out;
    overflow: hidden;
    height: 0;
    margin-top: 0;

    &.visible {
      margin-top: 16px;
    }
  }

  $columnGap: 4px;
  $rowGap: 4px;

  .variants-grid {
    display: grid;
    //grid-template-columns -> set in TS based on number of properties
    row-gap: $rowGap;
    margin-bottom: 4px;
    font-size: 0.8rem;

    .variant-row {
      // Pass through grid styling to row children
      display: contents;
    }

    .variant-properties-container {
      display: contents;
    }

    .variant-property-header {
      padding-left: $columnGap * 2;
    }

    .grid-header {
      font-size: 0.75rem;
    }
  }

  .variant-instances {
    text-align: left;
    font-size: 0.75rem;
    margin-left: $columnGap;
  }

  .variant-row .card-clickable-element {
    padding: 4px 8px !important;

    &:last-child {
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;
    }

    &.variant-property {
      border-radius: 0;
      gap: 0;

      &:first-child {
        border-top-left-radius: 16px;
        border-bottom-left-radius: 16px;
        margin-left: 0;
      }
    }
  }
}
</style>

