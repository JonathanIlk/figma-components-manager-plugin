<template>
  <div class="settings-bar">
    <div class="settings-bar-container">
      <div class="left-section">
        <ToggleSwitch
          v-model="autoRefresh"
          title="Enable/Disable automatic refresh on document changes"
          label="Auto Refresh"
        />
      </div>
      <div class="center-section">
        <a href="https://github.com/JonathanIlk/figma-components-manager-plugin" target="_blank" rel="noopener noreferrer" class="github-link" title="View on GitHub">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" fill="currentColor"/>
          </svg>
        </a>
      </div>
      <div class="right-section">
        <button class="icon-button" title="Toggle font size" @click="toggleFontSize">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.5 14H2.5L3.2 11.5H6.8L7.5 14H9.5L5.5 2H4.5L0.5 14ZM5 4.5L6.2 10H3.8L5 4.5ZM10.5 14H12L12.4 12.5H14.6L15 14H16.5L13.5 6H12.5L10.5 14ZM13.5 8L14.2 11.5H12.8L13.5 8Z" fill="currentColor"/>
          </svg>
        </button>
        <button class="icon-button" title="Manually refresh the document scan" @click="sendManualRefresh">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.64 2.35C12.19 0.9 10.2 0 8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C11.73 16 14.84 13.45 15.73 10H13.65C12.83 12.33 10.61 14 8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C9.66 2 11.14 2.69 12.22 3.78L9 7H16V0L13.64 2.35Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { FrontendStateService } from '../frontend-state-service';
import { BackendMessageType } from '../../../shared/types';
import ToggleSwitch from './common/ToggleSwitch.vue';

export default defineComponent({
  name: 'SettingsBar',
  components: {
    ToggleSwitch
  },
  setup() {
    const scanResultsManager = FrontendStateService.getInstance();

    const autoRefresh = computed({
      get: () => scanResultsManager.state.settings.autoRefresh,
      set: (value: boolean) => {
        parent.postMessage({
          pluginMessage: {
            type: BackendMessageType.SET_AUTO_REFRESH,
            payload: {
              autoRefresh: value
            }
          }
        }, '*');
      }
    });

    const sendManualRefresh = () => {
      parent.postMessage({
        pluginMessage: {
          type: BackendMessageType.MANUAL_REFRESH,
          payload: {}
        }
      }, '*');
    };

    const toggleFontSize = () => {
      const currentSize = scanResultsManager.state.settings.fontSize;
      const newSize = currentSize === 16 ? 14 : 16;
      parent.postMessage({
        pluginMessage: {
          type: BackendMessageType.SET_FONT_SIZE,
          payload: {
            fontSize: newSize
          }
        }
      }, '*');
    };

    return {
      autoRefresh,
      sendManualRefresh,
      toggleFontSize
    };
  }
});
</script>

<style lang="scss" scoped>
.settings-bar {
  width: 100%;
  background-color: var(--figma-color-bg);
  border-top: 1px solid var(--figma-color-border);
  z-index: 900; /* Below resize corner (1000) */
  height: 40px;
  flex-shrink: 0;
}

.settings-bar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 16px;
  box-sizing: border-box;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.center-section {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.right-section {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  gap: 4px;
}

.github-link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  color: var(--figma-color-icon);
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--figma-color-bg-hover);
    color: var(--figma-color-text);
    transform: scale(1.1);
  }
}


/* Icon Button */
.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: var(--figma-color-icon);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-button:hover {
  background-color: var(--figma-color-bg-hover);
}
</style>
