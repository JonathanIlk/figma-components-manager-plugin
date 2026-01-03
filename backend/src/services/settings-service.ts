import {util} from "../../backend";
import {MessageToUiType, SettingsUpdatePayload} from "../../../shared/types";

/**
 * Singleton Service to manage user settings, persist them in Figma's clientStorage, and communicate changes to the UI.
 */
export class SettingsService {
    private static instance: SettingsService;
    private static STORAGE_KEY_AUTO_REFRESH = "settings_auto_refresh";
    private static STORAGE_KEY_FONT_SIZE = "settings_font_size";

    private autoRefresh: boolean = true; // Default to true
    private fontSize: number = 16; // Default to 16px

    private constructor() {
    }

    public static getInstance() {
        if (!SettingsService.instance) {
            SettingsService.instance = new SettingsService();
        }
        return SettingsService.instance;
    }

    public async initialize() {
        try {
            const storedAutoRefresh = await figma.clientStorage.getAsync(SettingsService.STORAGE_KEY_AUTO_REFRESH);
            if (storedAutoRefresh !== undefined) {
                this.autoRefresh = storedAutoRefresh;
            }
            const storedFontSize = await figma.clientStorage.getAsync(SettingsService.STORAGE_KEY_FONT_SIZE);
            if (storedFontSize !== undefined) {
                this.fontSize = storedFontSize;
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
            await figma.clientStorage.setAsync(SettingsService.STORAGE_KEY_AUTO_REFRESH, enabled);
        } catch (err) {
            util.logError("Error saving settings to clientStorage", err);
        }
        this.sendSettingsToUi();
    }

    public async setFontSize(size: number) {
        this.fontSize = size;
        try {
            await figma.clientStorage.setAsync(SettingsService.STORAGE_KEY_FONT_SIZE, size);
        } catch (err) {
            util.logError("Error saving settings to clientStorage", err);
        }
        this.sendSettingsToUi();
    }

    public sendSettingsToUi() {
        const payload: SettingsUpdatePayload = {
            autoRefresh: this.autoRefresh,
            fontSize: this.fontSize
        };
        figma.ui.postMessage({type: MessageToUiType.SETTINGS_UPDATE, payload: payload});
    }
}
