import {InstanceDto} from "../../../../shared/types";
import "./instance-info.element.scss"
import {AbstractCmElement} from "../common/abstract-cm-element.element";
import {InstancesGroupElement} from "./instances-group.element";
import {ScannedInstance} from "../../scanned-nodes";

export class InstanceInfoElement extends AbstractCmElement {
    private parentGroup!: InstancesGroupElement;
    private data!: ScannedInstance;

    static register() {
        window.customElements.define('app-instance-info', InstanceInfoElement);
    }


    updateForData(data: ScannedInstance, parentGroup: InstancesGroupElement) {
        this.parentGroup = parentGroup;
        this.data = data;
        this.innerHTML = data.displayName;
        this.setupAsSearchableElement();
    }

    public getSearchInputSelector(): string {
        return "#instances-search-input";
    }

    public getSearchableText(): string {
        return this.data.displayName;
    }

    // If the group is hit by search, we want to always show all instances inside the group.
    public optionalSearchCondition(): boolean {
        return this.parentGroup.isHitBySearch();
    }

}