<template>
  <div id="app">
    <TabView>
      <template #Components>
        <div class="content-container tab-content">
          <ComponentsListHeader />
          <SearchInput v-model="componentsSearch" />
          <ComponentsList :search-term="componentsSearch" />
        </div>
      </template>
      <template #Instances>
        <div class="content-container tab-content">
          <SearchInput v-model="instancesSearch" />
          <InstancesList :search-term="instancesSearch" />
        </div>
      </template>
    </TabView>
    <SettingsBar />
    <ResizeCorner />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import TabView from './components/TabView.vue';
import ComponentsListHeader from './components/ComponentsListHeader.vue';
import SearchInput from './components/SearchInput.vue';
import ComponentsList from './components/ComponentsList.vue';
import InstancesList from './components/InstancesList.vue';
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
@import "./styles.scss";

#app {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>

