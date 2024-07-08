import {InstanceDto, ScanResultDto} from "../../../../shared/types";
import {InstanceInfoElement} from "./instance-info.element";
import "./instances-list.element.scss";
import {AbstractCmElement} from "../common/abstract-cm-element.element";

interface InstanceInfosGroup {
    groupName: string;
    groupNodeId: string;
    instances: InstanceDto[];
}

export class InstancesListElement extends AbstractCmElement {

    static register() {
        window.customElements.define('app-instances-list', InstancesListElement);
    }


    updateForScanResult(data: ScanResultDto) {
        this.innerHTML = "";
        const instances: InstanceInfosGroup[] = this.getGroupedInstances(data);
        for (const group of instances) {
            if (group.instances.length === 0) {
                continue;
            }

            const groupElement = document.createElement('div');
            groupElement.classList.add('group-header');
            groupElement.setAttribute("navigatable-node-id", group.groupNodeId);
            groupElement.textContent = group.groupName;
            this.insertAdjacentElement('beforeend', groupElement);

            for (const instance of group.instances) {
                const instanceInfo: InstanceInfoElement = this.insertAdjacentElement('beforeend', document.createElement('app-instance-info')) as InstanceInfoElement;
                instanceInfo.updateForData(instance);
            }
        }

        this.setupInteractiveElements();
    }

    private getGroupedInstances(data: ScanResultDto) {
        const groups: InstanceInfosGroup[] = [];
        for (const component of data.components) {
            if(component.type === "COMPONENT_SET") {
                for(const variant of component.variants) {
                    // For sets we categorize by variant
                    groups.push({
                        groupName: `${component.nodeName} - ${variant.displayName}`,
                        groupNodeId: variant.nodeId,
                        instances: variant.instances,
                    });
                }
            } else if(component.type === "COMPONENT") {
                // Component without variants
                groups.push({
                    groupName: `${component.nodeName}`,
                    groupNodeId: component.nodeId,
                    instances: component.instances,
                });
            }
        }
        return groups;
    }
}