import {Util} from "../shared/util";
import {BackendMessageReceiver} from "./src/backend-message-receiver";
import {RefreshHandler} from "./src/refresh-handler";
import {WindowService} from "./src/services/window-service";
import {SettingsService} from "./src/services/settings-service";

export const util = new Util("CM-Backend");

class Backend {
    private static messageReceiver: BackendMessageReceiver;
    private static viewUpdater: RefreshHandler;

    public static async startBackend() {
        await figma.loadAllPagesAsync();
        this.messageReceiver = new BackendMessageReceiver();
        this.messageReceiver.init();
        this.viewUpdater = new RefreshHandler();

        // Initialize Singleton Managers
        WindowService.getInstance().initialize();
        await SettingsService.getInstance().initialize();

        await this.viewUpdater.fullComponentsRefresh();

        this.subscribeToDocumentChanges();
    }

    private static subscribeToDocumentChanges() {
        figma.on("documentchange", (event: DocumentChangeEvent) => {
            if (!SettingsService.getInstance().shouldAutoRefresh()) {
                return;
            }
            this.viewUpdater.refreshForDocumentChangeEvent(event);
        });
    }
}

Backend.startBackend();