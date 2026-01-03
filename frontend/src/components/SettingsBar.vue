<template>
  <div class="settings-bar">
    <div class="settings-bar-container">
      <div class="left-section">
        <label class="toggle-switch" title="Enable/Disable automatic refresh on document changes">
          <input type="checkbox" v-model="autoRefresh">
          <span class="slider round"></span>
        </label>
        <span class="label-text">Auto Refresh</span>
      </div>
      <div class="right-section">
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
import { ScanResultsManager } from '../scan-results-manager';
import { BackendMessageType } from '../../../shared/types';

export default defineComponent({
  name: 'SettingsBar',
  setup() {
    const scanResultsManager = ScanResultsManager.getInstance();

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

    return {
      autoRefresh,
      sendManualRefresh
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
}

.label-text {
  font-size: 11px;
  color: var(--figma-color-text);
  user-select: none;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 28px;
  height: 16px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--figma-color-bg-tertiary);
  transition: .4s;
  border: 1px solid var(--figma-color-border);
}

.slider:before {
  position: absolute;
  content: "";
  height: 12px;
  width: 12px;
  left: 1px;
  bottom: 1px;
  background-color: var(--figma-color-icon);
  transition: .4s;
}

input:checked + .slider {
  background-color: var(--figma-color-bg-brand);
  border-color: var(--figma-color-bg-brand);
}

input:checked + .slider:before {
  transform: translateX(12px);
  background-color: white;
}

.slider.round {
  border-radius: 16px;
}

.slider.round:before {
  border-radius: 50%;
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

