import {InstanceDto} from "../../../../shared/types";
import {AbstractCmElement} from "../common/abstract-cm-element.element";
import {InstanceInfoElement} from "./instance-info.element";
import "./instances-group.element.scss";

export interface InstanceGroupData {
    groupName: string;
    groupNodeId: string;
    instances: InstanceDto[];
}

export class InstancesGroupElement extends AbstractCmElement {
    private instanceInfos: InstanceInfoElement[] = [];
    private data!: InstanceGroupData;

    static register() {
        window.customElements.define('app-instances-group', InstancesGroupElement);
    }

    connectedCallback() {
        super.connectedCallback();
        this.classList.add("card");
    }

    updateForData(data: InstanceGroupData) {
        this.instanceInfos = [];
        this.data = data;

        const groupHeaderElement = document.createElement('div');
        groupHeaderElement.classList.add('card-header');
        this.insertAdjacentElement('beforeend', groupHeaderElement);

        const title = document.createElement('div');
        title.classList.add('title');
        title.innerText = data.groupName;
        title.setAttribute('navigatable-node-id', data.groupNodeId);
        groupHeaderElement.insertAdjacentElement('beforeend', title);

        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');
        this.insertAdjacentElement('beforeend', cardContent);

        for (const instance of data.instances) {
            const instanceInfo: InstanceInfoElement = cardContent.insertAdjacentElement('beforeend', document.createElement('app-instance-info')) as InstanceInfoElement;
            instanceInfo.updateForData(instance, this);
            this.instanceInfos.push(instanceInfo);
        }
        this.setupAsSearchableElement();
    }

    public getSearchInputSelector(): string {
        return "#instances-search-input";
    }

    public getSearcheableText(): string {
        return this.data.groupName;
    }

    // If any InstanceInfoElement is hit by search, we want to show the group.
    protected optionalSearchCondition(): boolean {
        return this.instanceInfos.some(instanceInfo => instanceInfo.isHitBySearch());
    }
}