import {util} from "../backend";
import {MessageToUiType, SettingsUpdatePayload} from "../../shared/types";

export class SettingsManager {
    private static instance: SettingsManager;
    private static STORAGE_KEY_AUTO_REFRESH = "settings_auto_refresh";

    private autoRefresh: boolean = true; // Default to true

    private constructor() {
    }

    public static getInstance() {
        if (!SettingsManager.instance) {
            SettingsManager.instance = new SettingsManager();
        }
        return SettingsManager.instance;
    }

    public async initialize() {
        try {
            const storedAutoRefresh = await figma.clientStorage.getAsync(SettingsManager.STORAGE_KEY_AUTO_REFRESH);
            if (storedAutoRefresh !== undefined) {
                this.autoRefresh = storedAutoRefresh;
            }
        } catch (err) {
            util.logError("Error loading settings from clientStorage", err);
        }
        this.sendSettingsToUi();
    }

    public shouldAutoRefresh(): boolean {
        return this.autoRefresh;
    }

    public async setAutoRefresh(enabled: boolean) {
        this.autoRefresh = enabled;
        try {
            await figma.clientStorage.setAsync(SettingsManager.STORAGE_KEY_AUTO_REFRESH, enabled);
        } catch (err) {
            util.logError("Error saving settings to clientStorage", err);
        }
        this.sendSettingsToUi();
    }

    public sendSettingsToUi() {
        const payload: SettingsUpdatePayload = {
            autoRefresh: this.autoRefresh
        };
        figma.ui.postMessage({type: MessageToUiType.SETTINGS_UPDATE, payload: payload});
    }
}

