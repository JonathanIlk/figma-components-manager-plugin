import {InstanceDto} from "../../../../shared/types";
import "./instance-info.element.scss"
import {AbstractCmElement} from "../common/abstract-cm-element.element";

export class InstanceInfoElement extends AbstractCmElement {
    private data!: InstanceDto;

    static register() {
        window.customElements.define('app-instance-info', InstanceInfoElement);
    }


    updateForData(data: InstanceDto) {
        this.data = data;
        this.setAttribute("navigatable-node-id", data.nodeId);
        this.innerHTML = data.nodeName;
        this.setupAsSearchableElement();
    }

    public getSearchInputSelector(): string {
        return "#instances-search-input";
    }

    public getSearcheableText(): string {
        return this.data.nodeName;
    }

}