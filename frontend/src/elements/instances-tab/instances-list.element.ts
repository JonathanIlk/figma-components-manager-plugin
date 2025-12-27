import {ScanResultDto} from "../../../../shared/types";
import "./instances-list.element.scss";
import {AbstractCmElement} from "../common/abstract-cm-element.element";
import {InstanceGroupData, InstancesGroupElement} from "./instances-group.element";
import {StoredScanResults} from "../../scan-results-manager";

export class InstancesListElement extends AbstractCmElement {

    static register() {
        window.customElements.define('app-instances-list', InstancesListElement);
    }


    updateForScanResult(scanResults: StoredScanResults) {
        this.innerHTML = "";
        const instances: InstanceGroupData[] = this.getGroupedInstances(scanResults);
        for (const group of instances) {
            if (group.instances.length === 0) {
                continue;
            }

            const groupContainerElement = document.createElement('app-instances-group') as InstancesGroupElement;
            groupContainerElement.updateForData(group);
            this.insertAdjacentElement('beforeend', groupContainerElement);
        }

        this.setupInteractiveElements();
    }

    private getGroupedInstances(scanResults: StoredScanResults) {
        const groups: InstanceGroupData[] = [];
        for (const component of Object.values(scanResults.components)) {
            if(component.type === "COMPONENT_SET") {
                for(const variant of component.variants) {
                    // For sets we categorize by variant
                    groups.push({
                        groupName: `${component.displayName} - ${variant.displayName}`,
                        groupNodeId: variant.nodeId,
                        instances: variant.instances,
                    });
                }
            } else if(component.type === "COMPONENT") {
                // Component without variants
                groups.push({
                    groupName: `${component.displayName}`,
                    groupNodeId: component.nodeId,
                    instances: component.instances,
                });
            }
        }
        return groups;
    }
}