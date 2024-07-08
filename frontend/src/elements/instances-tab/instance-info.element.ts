import {InstanceDto} from "../../../../shared/types";
import "./instance-info.element.scss"
import {AbstractCmElement} from "../common/abstract-cm-element.element";

export class InstanceInfoElement extends AbstractCmElement {

    static register() {
        window.customElements.define('app-instance-info', InstanceInfoElement);
    }


    updateForData(data: InstanceDto) {
        this.setAttribute("navigatable-node-id", data.nodeId);
        this.innerHTML = data.nodeName;
        this.setupSearch(data);
    }

    private setupSearch(data: InstanceDto) {
        this.setupAsSearchableElement("#instances-search-input", data.nodeName);
    }
}