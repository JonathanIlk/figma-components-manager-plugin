import {ComponentDto, VariantDto} from "../../../../shared/types";
import {util} from "../../../frontend";
import "./component-info.element.scss";
import {AbstractCmElement} from "../common/abstract-cm-element.element";

export class ComponentInfoElement extends AbstractCmElement {
    private data!: ComponentDto;

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
        super.connectedCallback();
        this.classList.add("card");
    }

    protected attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        util.log("Components-Manager#ComponentInfo: Attribute Changed", name, oldValue, newValue);
        if (name === "component-data") {
            const data = JSON.parse(newValue);
            this.initForComponent(data);
        }
    }

    protected initForComponent(data: ComponentDto) {
        this.data = data;

        util.log("Components-Manager#ComponentInfo: Creating Component Info", data, this);
        this.innerHTML = `
            <div class="card-header">
                <div class="title">
                    <div class="component-name" navigatable-node-id="${data.nodeId}">${data.nodeName}</div>
                    <div class="expand-collapse-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                </div>
                <div class="sub-title">
                    <span class="tag-element">
                        <span class="variants-count">${data.variants.length}</span> variants
                    </span>
                    <span class="tag-element">
                        <span class="instances-count">${data.instances.length}</span> instances
                    </span>
                </div>
            </div>
            <div class="card-content expandable-content">
                ${this.getVariantsListHtml(data.variants)}
            </div>
        `;
        this.setupInteractiveElements();
        if(data.variants.length === 0) {
            const expandCollapseIcon: HTMLElement = this.querySelector(".expand-collapse-icon")!;
            expandCollapseIcon.style.display = "none";
        }
    }

    protected setupInteractiveElements() {
        super.setupInteractiveElements();
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

    public getSearchInputSelector(): string {
        return "#components-search-input";
    }

    public getSearcheableText(): string {
        return `${this.data.nodeName}${this.data.variants.map(variant => variant.displayName).join("")}`;
    }
}
