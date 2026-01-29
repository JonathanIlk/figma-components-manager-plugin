<template>
  <div id="inner-app">
    <TabView class="main-tab-view">
      <template #Components>
          <ComponentsListHeader />
          <div class="components-filter-bar">
            <SearchInput v-model="componentsSearch" class="half-width-search"/>
            <div class="sort-buttons">
              <div
                class="sort-button subtle-text"
                :class="{ active: componentsSortColumn === 'name' }"
                @click="toggleComponentsSort('name')"
                title="Sort by Name"
              >
                Name
                <span class="sort-indicator" :class="{ 'visibility-hidden': componentsSortColumn !== 'name' }">
                    {{ componentsSortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </div>
              <div
                class="sort-button subtle-text"
                :class="{ active: componentsSortColumn === 'instances' }"
                @click="toggleComponentsSort('instances')"
                title="Sort by Instance Count"
              >
                Instances
                <span class="sort-indicator" :class="{ 'visibility-hidden': componentsSortColumn !== 'instances' }">
                    {{ componentsSortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </div>
            </div>
          </div>
          <ComponentsList :config="componentsListConfig" />
      </template>
      <template #Instances>
          <SearchInput v-model="instancesSearch" class="standalone-search"/>
          <InstancesList :search-term="instancesSearch" />
      </template>
    </TabView>
    <SettingsBar />
    <ResizeCorner />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import TabView from './components/common/TabView.vue';
import ComponentsListHeader from './components/components-tab/ComponentsListHeader.vue';
import SearchInput from './components/common/SearchInput.vue';
import InstancesList from './components/instances-tab/InstancesList.vue';
import SettingsBar from './components/SettingsBar.vue';
import ResizeCorner from './components/ResizeCorner.vue';
import ComponentsList from "./components/components-tab/ComponentsList.vue";
import {IComponentListConfig} from "./components/components-tab/types";

export default defineComponent({
  name: 'App',
  components: {
    TabView,
    ComponentsListHeader,
    SearchInput,
    ComponentsList,
    InstancesList,
    SettingsBar,
    ResizeCorner
  },
  setup() {
    const componentsSearch = ref('');
    const instancesSearch = ref('');

    // Sort state
    const componentsSortColumn = ref<'name' | 'instances'>('name');
    const componentsSortDirection = ref<'asc' | 'desc'>('asc');

    const componentsListConfig = computed((): IComponentListConfig => ({
      searchTerm: componentsSearch.value,
      sortColumn: componentsSortColumn.value,
      sortDirection: componentsSortDirection.value,
    }));

    const toggleComponentsSort = (column: 'name' | 'instances') => {
      if (componentsSortColumn.value === column) {
        componentsSortDirection.value = componentsSortDirection.value === 'asc' ? 'desc' : 'asc';
      } else {
        componentsSortColumn.value = column;
        componentsSortDirection.value = 'asc';
      }
    };

    return {
      componentsSearch,
      instancesSearch,
      componentsSortColumn,
      componentsSortDirection,
      componentsListConfig,
      toggleComponentsSort
    };
  }
});
</script>

<style lang="scss">
#inner-app {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-tab-view {
  flex: 1;
  min-height: 0; /* Important for nested flex scrolling */
}

.components-filter-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;

  .half-width-search {
    flex: 0 0 50%;
  }

  .sort-buttons {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    gap: 12px;

    .sort-button {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      user-select: none;
      transition: color 0.2s;

      &.active {
        color: var(--figma-color-text);
        font-weight: 500;
      }

      &:hover {
        color: var(--figma-color-text);
      }

      .sort-indicator {
        font-size: 0.6em;
      }

      .visibility-hidden {
        visibility: hidden;
      }
    }
  }
}
</style>
