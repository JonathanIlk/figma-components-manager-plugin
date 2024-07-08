import {ScanResultDto} from "../../../../shared/types";
import "./components-list-header.element.scss";

export class ComponentsListHeaderElement extends HTMLElement {

    static register() {
        window.customElements.define('app-components-list-header', ComponentsListHeaderElement);
    }

    connectedCallback() {
    }

    updateForScanResult(data: ScanResultDto) {
        this.innerHTML = `
            <span class="tag-element subtle-text">
                <span class="instances-count">${data.allInstances.length}</span> instances in total
            </span>
        `;
    }
}