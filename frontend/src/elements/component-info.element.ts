import {ComponentDto, VariantDto} from "../../../shared/types";
import {util} from "../../frontend";
import "./component-info.element.scss";

export class ComponentInfoElement extends HTMLElement {

    static register() {
        window.customElements.define('app-component-info', ComponentInfoElement);
    }

    static get observedAttributes() {
        return ["component-data"];
    }

    constructor() {
        super();
    }

    protected connectedCallback() {

    }

    protected attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        util.log("Components-Manager#ComponentInfo: Attribute Changed", name, oldValue, newValue);
        if (name === "component-data") {
            const data = JSON.parse(newValue);
            this.initForComponent(data);
        }
    }

    protected initForComponent(data: ComponentDto) {
        util.log("Components-Manager#ComponentInfo: Creating Component Info", data, this);
        this.innerHTML = `
            <div class="header">
                <div class="title-container">
                    <div class="component-name" navigatable-node-id="${data.nodeId}">${data.nodeName}</div>
                    <div class="expand-collapse-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                </div>
                <div class="sub-header">
                    <span class="tag-element">
                        <span class="variants-count">${data.variants.length}</span> variants
                    </span>
                    <span class="tag-element">
                        <span class="instances-count">${data.instances.length}</span> instances
                    </span>
                </div>
            </div>
            <div class="expandable-content">
                ${this.getVariantsListHtml(data.variants)}
            </div>
        `;
        this.setupInteractiveElements(data);
        if(data.variants.length === 0) {
            const expandCollapseIcon: HTMLElement = this.querySelector(".expand-collapse-icon")!;
            expandCollapseIcon.style.display = "none";
        }
    }

    private setupInteractiveElements(data: ComponentDto) {
        // // when the header is clicked send a message to the backend to navigate to the node
        // this.querySelector(".component-name")?.addEventListener("click", () => {
        //     parent.postMessage({pluginMessage: {type: "navigate-to-node", payload: data.nodeId}}, '*');
        // });

        // when an element with attribute navigatable-node-id is clicked send a message to the backend to navigate to the node
        this.querySelectorAll("[navigatable-node-id]").forEach((element) => {
            element.addEventListener("click", () => {
                const nodeId = element.getAttribute("navigatable-node-id");
                parent.postMessage({pluginMessage: {type: "navigate-to-node", payload: nodeId}}, '*');
            });
        });

        // when the expand-collapse icon is clicked toggle the expandable-content
        const expandCollapseIcon = this.querySelector(".expand-collapse-icon")!;
        expandCollapseIcon.addEventListener("click", () => {
            const expandableContent = this.querySelector(".expandable-content")!;
            if (expandableContent.classList.contains("visible")) {
                this.collapseContent();
            } else {
                this.expandContent();
            }
        });
    }

    public expandContent() {
        // Can't animate to auto height so we set the height to the scrollHeight for the css transition
        const expandableContent: HTMLElement = this.querySelector(".expandable-content")!;
        const expandCollapseIcon = this.querySelector(".expand-collapse-icon")!;
        expandableContent.style.height = expandableContent.scrollHeight + "px";
        expandableContent.classList.add("visible");
        expandCollapseIcon.classList.add("expanded");
    }

    public collapseContent() {
        const expandableContent = this.querySelector(".expandable-content")!;
        const expandCollapseIcon = this.querySelector(".expand-collapse-icon")!;
        expandableContent.classList.remove("visible");
        expandCollapseIcon.classList.remove("expanded");
    }

    private getVariantsListHtml(variants: VariantDto[]): string {
        return variants.map(variant => {
            return `
                <div class="variant-entry">
                    <span class="variant-name" navigatable-node-id="${variant.nodeId}">${variant.displayName}</span>
                    <span class="subtle-text">(<span class="instances-count">${variant.instances.length}</span> instances)</span>
                </div>
            `;
        }).join("");
    }
}
