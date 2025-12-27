import {Util} from "../shared/util";
import {BackendMessageReceiver} from "./src/backend-message-receiver";
import {ViewUpdater} from "./src/view-updater";
import {WindowManager} from "./src/window-manager";

export const util = new Util("CM-Backend");

class Backend {
    private static messageReceiver: BackendMessageReceiver;
    private static viewUpdater: ViewUpdater;

    public static async startBackend() {
        await figma.loadAllPagesAsync();
        this.messageReceiver = new BackendMessageReceiver();
        this.messageReceiver.init();
        this.viewUpdater = new ViewUpdater();

        // Initialize Singleton Managers
        WindowManager.getInstance().initialize();

        this.viewUpdater.updateComponents();

        this.subscribeToDocumentChanges();
    }

    private static subscribeToDocumentChanges() {
        figma.on("documentchange", (event: DocumentChangeEvent) => {
           this.viewUpdater.updateComponents();
        });
    }
}
Backend.startBackend();