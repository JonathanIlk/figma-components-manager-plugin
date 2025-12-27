import {BackendMessageType} from "../../../../shared/types";
import "./settings-bar.element.scss";

export class SettingsBarElement extends HTMLElement {
    private autoRefreshToggle: HTMLInputElement | null = null;

    static register() {
        window.customElements.define('app-settings-bar', SettingsBarElement);
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="settings-bar-container">
                <div class="left-section">
                    <label class="toggle-switch" title="Enable/Disable automatic refresh on document changes">
                        <input type="checkbox" id="auto-refresh-toggle">
                        <span class="slider round"></span>
                    </label>
                    <span class="label-text">Auto Refresh</span>
                </div>
                <div class="right-section">
                    <button id="manual-refresh-btn" class="icon-button" title="Manually refresh the document scan">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.64 2.35C12.19 0.9 10.2 0 8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C11.73 16 14.84 13.45 15.73 10H13.65C12.83 12.33 10.61 14 8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C9.66 2 11.14 2.69 12.22 3.78L9 7H16V0L13.64 2.35Z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        this.autoRefreshToggle = this.querySelector('#auto-refresh-toggle');
        const manualRefreshBtn = this.querySelector('#manual-refresh-btn');

        if (this.autoRefreshToggle) {
            this.autoRefreshToggle.addEventListener('change', (e) => {
                const target = e.target as HTMLInputElement;
                this.sendAutoRefreshUpdate(target.checked);
            });
        }

        if (manualRefreshBtn) {
            manualRefreshBtn.addEventListener('click', () => {
                this.sendManualRefresh();
            });
        }
    }

    public setAutoRefreshState(enabled: boolean) {
        if (this.autoRefreshToggle) {
            this.autoRefreshToggle.checked = enabled;
        }
    }

    private sendAutoRefreshUpdate(enabled: boolean) {
        parent.postMessage({
            pluginMessage: {
                type: BackendMessageType.SET_AUTO_REFRESH,
                payload: {
                    autoRefresh: enabled
                }
            }
        }, '*');
    }

    private sendManualRefresh() {
        parent.postMessage({
            pluginMessage: {
                type: BackendMessageType.MANUAL_REFRESH,
                payload: {}
            }
        }, '*');
    }
}

