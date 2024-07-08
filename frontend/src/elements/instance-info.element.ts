import {InstanceDto} from "../../../shared/types";

export class InstanceInfoElement extends HTMLElement {

    static register() {
        window.customElements.define('app-instance-info', InstanceInfoElement);
    }


    updateForData(data: InstanceDto) {
        this.setAttribute("navigatable-node-id", data.nodeId);
        this.innerHTML = data.nodeName;
    }
}