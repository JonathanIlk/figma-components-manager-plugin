<template>
  <div id="inner-app">
    <TabView class="main-tab-view">
      <template #Components>
          <ComponentsListHeader />
          <SearchInput v-model="componentsSearch" />
          <ComponentsList :search-term="componentsSearch" />
      </template>
      <template #Instances>
          <SearchInput v-model="instancesSearch" />
          <InstancesList :search-term="instancesSearch" />
      </template>
    </TabView>
    <SettingsBar />
    <ResizeCorner />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import TabView from './components/common/TabView.vue';
import ComponentsListHeader from './components/components-tab/ComponentsListHeader.vue';
import SearchInput from './components/common/SearchInput.vue';
import ComponentsList from './components/components-tab/ComponentsList.vue';
import InstancesList from './components/instances-tab/InstancesList.vue';
import SettingsBar from './components/SettingsBar.vue';
import ResizeCorner from './components/ResizeCorner.vue';

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

    return {
      componentsSearch,
      instancesSearch
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
</style>

