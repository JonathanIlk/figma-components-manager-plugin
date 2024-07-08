import {InstanceDto} from "../../../../shared/types";
import "./instance-info.element.scss"
import {AbstractCmElement} from "../common/abstract-cm-element.element";
import {InstancesGroupElement} from "./instances-group.element";

export class InstanceInfoElement extends AbstractCmElement {
    private parentGroup!: InstancesGroupElement;
    private data!: InstanceDto;

    static register() {
        window.customElements.define('app-instance-info', InstanceInfoElement);
    }


    updateForData(data: InstanceDto, parentGroup: InstancesGroupElement) {
        this.parentGroup = parentGroup;
        this.data = data;
        this.innerHTML = data.nodeName;
        this.setupAsSearchableElement();
    }

    public getSearchInputSelector(): string {
        return "#instances-search-input";
    }

    public getSearcheableText(): string {
        return this.data.nodeName;
    }

    // If the group is hit by search, we want to always show all instances inside the group.
    public optionalSearchCondition(): boolean {
        return this.parentGroup.isHitBySearch();
    }

}