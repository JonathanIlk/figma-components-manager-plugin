import {SearchInputElement} from "./search-input.element";
import {BackendMessageType} from "../../../../shared/types";

/**
 * Abstract base class for all custom elements in the Components Manager plugin.
 * Provides common functionality such as search handling and interactive element setup.
 */
export abstract class AbstractCmElement extends HTMLElement {

    protected connectedCallback() {
        this.setupAsSearchableElement();
    }

    /**
     * Call this in the child classes to enable interactivity for certain elements (if used).
     * - Navigate to node on click when element has attribute [navigatable-node-id]
     */
    protected setupInteractiveElements() {
        // when an element with attribute [navigatable-node-id] is clicked send a message to the backend to navigate to the node
        this.querySelectorAll("[navigatable-node-id]").forEach((element) => {
            element.addEventListener("click", () => {
                const nodeId = element.getAttribute("navigatable-node-id");
                parent.postMessage({pluginMessage: {type: BackendMessageType.NAVIGATE_TO_NODE, payload: nodeId}}, '*');
            });
        });
    }

    protected setupAsSearchableElement() {
        if (this.getSearchInputSelector().length === 0) return;

        const searchInput = document.querySelector(this.getSearchInputSelector()) as SearchInputElement;

        searchInput.addEventListener("search", (event: Event) => {

            if (this.isHitBySearch() || this.optionalSearchCondition()) {
                this.classList.remove("search-hidden");
            } else {
                this.classList.add("search-hidden");
            }
        });
    }

    /**
     *
     * @final @sealed
     */
    public isHitBySearch() {
        const searchInput = document.querySelector(this.getSearchInputSelector()) as SearchInputElement;
        const searchText = searchInput.getSearchText().toLowerCase();
        return this.getSearchableText().toLowerCase().includes(searchText) || searchText.length === 0;
    }



    /**
     * Override this method in the child classes to return the selector of the search input element.
     */
    public getSearchInputSelector(): string {
        return "";
    }

    /**
     * Override this method in the child classes to return the text that should be accounted for when searching.
     */
    public getSearchableText(): string {
        return this.innerHTML;
    }

    /**
     * Override this to provide an optional search condition.
     * If this returns true the element will be shown even if it is not hit by the search.
     */
    protected optionalSearchCondition() {
        return false;
    }
}