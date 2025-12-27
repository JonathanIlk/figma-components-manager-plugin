import {util} from "../../../frontend";
import "./component-info.element.scss";
import {AbstractCmElement} from "../common/abstract-cm-element.element";
import {ScannedComponent, ScannedVariant} from "../../scanned-nodes";

/**
 * Displays a card with information about a component:
 * - Name, number of variants, number of instances
 * - Expandable list of variants with their instance counts
 */
export class ComponentInfoElement extends AbstractCmElement {
    private component!: ScannedComponent;

    static register() {
        window.customElements.define('app-component-info', ComponentInfoElement);
    }

    constructor() {
        super();
    }

    protected connectedCallback() {
        super.connectedCallback();
        this.classList.add("card");
    }

    public initForComponent(component: ScannedComponent) {
        this.component = component;

        util.log("Components-Manager#ComponentInfo: Creating Component Info", component, this);
        this.innerHTML = `
            <div class="card-header">
                <div class="title">
                    <div class="component-name" navigatable-node-id="${component.nodeId}">${component.displayName}</div>
                    <div class="expand-collapse-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                </div>
                <div class="sub-title">
                    <span class="tag-element">
                        <span class="variants-count">${component.variants.length}</span> variants
                    </span>
                    <span class="tag-element">
                        <span class="instances-count">${component.instances.length}</span> instances
                    </span>
                </div>
            </div>
            <div class="card-content expandable-content">
                ${this.getVariantsListHtml(component.variants)}
            </div>
        `;
        this.setupInteractiveElements();
        if(component.variants.length === 0) {
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

    private getVariantsListHtml(variants: ScannedVariant[]): string {
        return variants.map(variant => {
            const hasInstances = variant.instances.length > 0;
            return `
                <div class="variant-row">
                    <div class="card-clickable-element" navigatable-node-id="${variant.nodeId}" title="Focus on variant">
                        ${variant.displayName}
                    </div>
                    <div class="card-clickable-element variant-instances ${hasInstances ? '' : 'disabled'}" cycle-through-instances="${variant.nodeId}" title="Cycle through instances">
                        <span class="${hasInstances ? 'instances-count' : 'subtle-text'}">${variant.instances.length}</span> 
                        <span class="subtle-text">instances</span>
                    </div>
                </div>
            `;
        }).join("");
    }

    public getSearchInputSelector(): string {
        return "#components-search-input";
    }

    public getSearchableText(): string {
        return `${this.component.displayName}${this.component.variants.map(variant => variant.displayName).join("")}`;
    }
}
