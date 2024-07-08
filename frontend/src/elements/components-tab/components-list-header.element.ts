import {ScanResultDto} from "../../../../shared/types";
import "./components-list-header.element.scss";
import {ComponentInfoElement} from "./component-info.element";

export class ComponentsListHeaderElement extends HTMLElement {

    private isAllExpanded = false;

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
            <span class="expand-collapse-icon">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" fill="none" viewBox="0 0 24 24">
                  <path  d="m8 7 4 4 4-4m-8 6 4 4 4-4"/>
                </svg>
            </span>
        `;

        this.querySelector(".expand-collapse-icon")?.addEventListener("click", () => {
            this.toggleExpandCollapseAll();
        });
    }

    private toggleExpandCollapseAll() {
        this.isAllExpanded = !this.isAllExpanded;
        const allComponentInfoElements: ComponentInfoElement[] = Array.from(document.querySelectorAll("app-component-info"));
        const expandCollapseIcon = this.querySelector(".expand-collapse-icon") as HTMLElement;
        allComponentInfoElements.forEach((componentInfoElement) => {
            if (this.isAllExpanded) {
                componentInfoElement.expandContent();
                expandCollapseIcon.classList.add("expanded");
            } else {
                componentInfoElement.collapseContent();
                expandCollapseIcon.classList.remove("expanded");
            }
        });
    }
}