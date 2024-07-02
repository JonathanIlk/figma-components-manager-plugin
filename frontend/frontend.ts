import {ComponentDto, MessageToUi, ScanResultDto} from "../shared/types";
import {ComponentInfoElement} from "./src/component-info.element";
import {Util} from "../shared/util";

ComponentInfoElement.register();
export const util = new Util("CM-Frontend");

function createComponentInfo(data: ComponentDto) {
    const componentInfo: ComponentInfoElement = document.createElement('app-component-info') as ComponentInfoElement;
    componentInfo.setAttribute("component-data", JSON.stringify(data));
    return componentInfo;
}

function onReceiveComponentsMessage(payload: ScanResultDto) {
    const container = document.getElementById('components-list') as HTMLElement;
    container.innerHTML = "";

    for (const component of payload.components) {
        const componentInfo = createComponentInfo(component);
        container.appendChild(componentInfo);
    }
}

onmessage = (event) => {
    const message: MessageToUi = event.data.pluginMessage;
    util.log("Components-Manager: UI Received Message", message);
    if (message.type === "components") {
        onReceiveComponentsMessage(message.payload as ScanResultDto);
    }
}

util.log("Components-Manager: Frontend Loaded");