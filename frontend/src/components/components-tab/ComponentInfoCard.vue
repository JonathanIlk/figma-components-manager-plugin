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
          <span class="variants-count">{{ isExpanded ? sortedVariants.length : component.variants.length }}</span> variants
        </span>
        <span class="tag-element">
          <span class="instances-count">{{ component.allDescendantInstances.length }}</span> instances
        </span>
        <SearchInput v-model="searchTerm" icon="filter" placeholder="Filter variants" :class="{'filter-visible': isExpanded}"></SearchInput>
      </div>
    </div>

    <!-- Variants Grid -->
    <div
      class="card-content expandable-content variants-grid"
      :class="{ visible: isExpanded }"
      :style="gridStyle"
      ref="expandableContent"
    >
      <!-- Headers with Variant properties -->
      <div
        v-for="(variant, index) in component.variantProperties"
        :key="variant"
        class="subtle-text grid-header sortable-header"
        @click="toggleSort(index)"
      >
        {{ variant }}
        <span :class="{'visibility-hidden': sortColumn !== index}" class="sort-indicator">
          {{ sortDirection === 'asc' ? '▲' : '▼' }}
        </span>
      </div>

      <!-- Header for Instances Column -->
      <div
        class="subtle-text grid-header sortable-header"
        @click="toggleSort('instances')"
      >
        Instances
        <span class="sort-indicator" :class="{'visibility-hidden': sortColumn !== 'instances'}">
          {{ sortDirection === 'asc' ? '▲' : '▼' }}
        </span>
      </div>

      <!-- Actual content rows of the table -->
      <!-- Loop through all variants -->
      <template v-for="variant in sortedVariants" :key="variant.nodeId">
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
            <span>
              <span :class="{ 'instances-count': variant.instances.length > 0}">
                {{ variant.instances.length }}
              </span>
              {{ variant.instances.length === 1 ? 'instance' : 'instances' }}
            </span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { ScannedComponent } from '../../scanned-nodes';
import { BackendMessageType } from '../../../../shared/types';
import SearchInput from "../common/SearchInput.vue";
import { useExpandableAnimation } from "../common/util";

// Which element of a variant is being hovered
type HoverState = "variant" | "instances" | false;

export default defineComponent({
  name: 'ComponentInfoCard',
  components: {SearchInput},
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
    const searchTerm = ref('');

    // Sorting state
    const sortColumn = ref<number | 'instances'>(0); // 0-based index for properties, or 'instances'
    const sortDirection = ref<'asc' | 'desc'>('asc');

    const sortedVariants = computed(() => {
      let variants = [...props.component.variants];

      if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase();
        variants = variants.filter(v =>
          v.searchTerm.toLowerCase().includes(term)
        );
      }

      return variants.sort((a, b) => {
        let valA: string | number;
        let valB: string | number;

        if (sortColumn.value === 'instances') {
          valA = a.instances.length;
          valB = b.instances.length;
        } else {
          // Sort by property value
          valA = a.propertyValues[sortColumn.value] || '';
          valB = b.propertyValues[sortColumn.value] || '';
        }

        // Compare
        let comparison: number;
        if (typeof valA === 'number' && typeof valB === 'number') {
          comparison = valA - valB;
        } else {
          // Use numeric collation for strings like "Variant 2" vs "Variant 10"
          comparison = String(valA).localeCompare(String(valB), undefined, { numeric: true });
        }

        return sortDirection.value === 'asc' ? comparison : -comparison;
      });
    });

    const toggleSort = (column: number | 'instances') => {
      if (sortColumn.value === column) {
        // Toggle direction
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
      } else {
        // New column, default to ascending
        sortColumn.value = column;
        sortDirection.value = 'asc';
      }
    };

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

    useExpandableAnimation(isExpanded, expandableContent);

    return {
      isExpanded,
      gridStyle,
      toggleExpand,
      navigateToNode,
      cycleThroughInstances,
      setHover,
      hoverStates,
      expandableContent,
      sortedVariants,
      sortColumn,
      sortDirection,
      toggleSort,
      searchTerm
    };
  }
});
</script>

<style lang="scss" scoped>

.component-info {
  .expandable-content {
    transition: all 0.25s ease-in-out;
    overflow: hidden;
    height: 0;
    margin-top: 0;

    &.visible {
      margin-top: 0.75rem;
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

    .grid-header {
      font-size: 0.75rem;
      padding-left: $columnGap * 2;
    }

    .sortable-header {
      cursor: pointer;
      user-select: none;
      display: flex;
      align-items: center;
      gap: 4px;

      &:hover {
        color: var(--figma-color-text);
      }
    }

    .sort-indicator {
      padding-top: 2px;
      font-size: 0.4rem;
    }
  }

  .variant-instances {
    font-size: 0.75rem;
    margin-left: $columnGap;
  }

  .variant-row .card-clickable-element {
    padding: 0.25rem 8px;

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


@keyframes fadeInInput {
  0% {
    display: none;
    opacity: 0;
  }
  1% {
    display: inline-block;
    opacity: 0;
  }
  100% {
    display: inline-block;
    opacity: 1;
  }
}

.search-input {
  display: none;
  opacity: 0;
  pointer-events: none;

  &.filter-visible {
    display: inline-block;
    opacity: 1;
    pointer-events: auto;
    animation: fadeInInput 0.25s ease-in-out forwards;
  }
}

</style>

