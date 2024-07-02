import {ComponentDto, VariantDto} from "../../shared/types";
import {util} from "../frontend";

export class ComponentInfoElement extends HTMLElement {

    static register() {
        window.customElements.define('app-component-info', ComponentInfoElement);
    }

    static get observedAttributes() {
        return ["component-data"];
    }

    get componentData(): ComponentDto {
        return JSON.parse(this.getAttribute("component-data") || "{}");
    }

    set componentData(value: ComponentDto) {
        this.setAttribute("component-data", JSON.stringify(value));
    }

    constructor() {
        super();
    }

    protected connectedCallback() {

    }

    protected attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        util.log("Components-Manager#ComponentInfo: Attribute Changed", name, oldValue, newValue);
        if(name === "component-data") {
            const data = JSON.parse(newValue);
            this.initForComponent(data);
        }
    }

    protected initForComponent(data: ComponentDto) {
        util.log("Components-Manager#ComponentInfo: Creating Component Info", data, this);
        this.innerHTML = `
            ${this.getStyle()}
            <div class="header">
                <div class="title-container">
                    <div class="component-name" navigatable-node-id="${data.nodeId}">${data.nodeName}</div>
                    <div class="expand-collapse-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                </div>
                <div class="sub-header subtle-text">
                    <span class="tag">
                        <span class="variants-count">${data.variants.length}</span> variants
                    </span>
                    <span class="tag">
                        <span class="instances-count">${data.instanceNodeIds.length}</span> instances
                    </span>
                </div>
            </div>
            <div class="expandable-content">
                ${this.getVariantsListHtml(data.variants)}
            </div>
        `;
        this.setupInteractiveElements(data);
        if(data.variants.length === 0) {
            this.querySelector(".expand-collapse-icon")?.style.display = "none";
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
        const expandableContent = this.querySelector(".expandable-content")!;
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

    private getStyle() {
        return `
            <style>
                app-component-info {
                    width: 100%;
                    background: var(--figma-color-bg-secondary);
                    border-radius: 12px;
                    padding: 12px;
                }
                app-component-info .title-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }
                app-component-info .component-name {
                    font-size: 1.2rem;
                    font-weight: bold;
                }
                app-component-info .sub-header {
                    margin-bottom: 8px;
                }
                app-component-info .subtle-text {
                    font-size: 0.8rem;
                    color: var(--figma-color-text-secondary);
                }
                app-component-info .tag {
                    background: var(--figma-color-bg-tertiary);
                    color: var(--figma-color-text-primary);
                    padding: 2px 8px;
                    border-radius: 4px;
                    margin-right: 4px;
                }
                app-component-info .variants-count {
                    font-weight: bold;
                    color: var(--figma-color-icon-component);
                }
                app-component-info .instances-count {
                    font-weight: bold;
                    color: var(--figma-color-text-success);
                }
                app-component-info .expand-collapse-icon {
                    width: 18px;
                    cursor: pointer;
                }
                
                app-component-info .expandable-content {
                    margin-top: 16px;
                    padding: 8px;
                    overflow: hidden;
                    transition: all 0.3s ease-in-out;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                }
                app-component-info .expandable-content:not(.visible) {
                    padding: 0 !important;
                    margin: 0 !important;
                    height: 0 !important;
                }
                app-component-info .expand-collapse-icon {
                    transition: all 0.3s ease-in-out;
                }
                app-component-info .expand-collapse-icon:hover svg {
                    stroke: var(--figma-color-icon-brand);
                }
                app-component-info .expand-collapse-icon.expanded {
                    transform: rotate(180deg);
                }
                app-component-info .variant-entry:not(:last-child) {
                    margin-bottom: 4px;
                }
                app-component-info [navigatable-node-id] {
                    cursor: pointer;
                }
                app-component-info [navigatable-node-id]:hover {
                    text-decoration: underline;
                }
            </style>
        `;
    }

    private getVariantsListHtml(variants: VariantDto[]): string {
        return variants.map(variant => {
            return `
                <div class="variant-entry">
                    <span class="variant-name" navigatable-node-id="${variant.nodeId}">${variant.displayName}</span>
                    <span class="subtle-text">(<span class="instances-count">${variant.instanceNodeIds.length}</span> instances)</span>
                </div>
            `;
        }).join("");
    }
}
