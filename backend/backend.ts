import {ScanResultDto} from "../shared/types";
import {Util} from "../shared/util";
import {InformationScanner} from "./src/information-scanner";
import {MessageReceiver} from "./src/message-receiver";
import {ViewUpdater} from "./src/view-updater";

export const util = new Util("CM-Backend");

class Backend {
    private static messageReceiver: MessageReceiver;
    private static viewUpdater: ViewUpdater;

    public static async startBackend() {
        await figma.loadAllPagesAsync();
        this.messageReceiver = new MessageReceiver();
        this.messageReceiver.init();
        this.viewUpdater = new ViewUpdater();
        
        figma.showUI(__html__, {themeColors: true, width: 400, height: 500});
        this.viewUpdater.updateComponents();
    }


}
Backend.startBackend();