import {ScanResultDto} from "../../../shared/types";
import {InstanceInfoElement} from "./instance-info.element";
import "./instances-list.element.scss";

export class InstancesListElement extends HTMLElement {

    static register() {
        window.customElements.define('app-instances-list', InstancesListElement);
    }


    updateForScanResult(data: ScanResultDto) {
        const instances = data.allInstances;
        for (const instance of instances) {
            const instanceInfo: InstanceInfoElement = this.insertAdjacentElement('beforeend', document.createElement('app-instance-info')) as InstanceInfoElement;
            instanceInfo.updateForData(instance);
        }
    }
}