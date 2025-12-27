import {Util} from "../shared/util";
import {BackendMessageReceiver} from "./src/backend-message-receiver";
import {RefreshHandler} from "./src/refresh-handler";
import {WindowManager} from "./src/window-manager";

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
        WindowManager.getInstance().initialize();

        this.viewUpdater.fullComponentsRefresh();

        this.subscribeToDocumentChanges();
    }

    private static subscribeToDocumentChanges() {
        figma.on("documentchange", (event: DocumentChangeEvent) => {
            this.viewUpdater.partialComponentsRefresh(event);
        });
    }
}

Backend.startBackend();