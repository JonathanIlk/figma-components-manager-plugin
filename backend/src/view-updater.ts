import {ScanResultDto} from "../../shared/types";
import {InformationScanner} from "./information-scanner";

export type UiMessage = {
    type: "components";
    payload: object;
}


/**
 * Sends messages to the frontend.
 */
export class ViewUpdater {

    protected sendToUi(message: UiMessage) {
        figma.ui.postMessage(message);
    }

    public async updateComponents() {
        const scanResult: ScanResultDto = await InformationScanner.fullScan();
        this.sendToUi({type: "components", payload: scanResult});
    }
}