import {ComponentDto, MessageToUi, ScanResultDto} from "../shared/types";
import {ComponentInfoElement} from "./src/elements/component-info.element";
import {Util} from "../shared/util";
import {ComponentsListHeaderElement} from "./src/elements/components-list-header.element";
import "./src/styles.scss";
import {TabviewElement} from "./src/elements/tabview.element";
import {InstancesListElement} from "./src/elements/instances-list.element";
import {InstanceInfoElement} from "./src/elements/instance-info.element";
import {SearchInputElement} from "./src/elements/search-input.element";

ComponentInfoElement.register();
ComponentsListHeaderElement.register();
TabviewElement.register();
InstancesListElement.register();
InstanceInfoElement.register();
SearchInputElement.register();

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

    const header: ComponentsListHeaderElement = document.getElementById('components-list-header') as ComponentsListHeaderElement;
    header.updateForScanResult(payload);

    const instancesList: InstancesListElement = document.getElementsByTagName('app-instances-list')[0] as InstancesListElement;
    instancesList.updateForScanResult(payload);

}

onmessage = (event) => {
    const message: MessageToUi = event.data.pluginMessage;
    util.log("Components-Manager: UI Received Message", message);
    if (message.type === "components") {
        onReceiveComponentsMessage(message.payload as ScanResultDto);
    }
}

util.log("Components-Manager: Frontend Loaded");