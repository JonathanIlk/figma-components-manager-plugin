import {SearchInputElement} from "./search-input.element";

/**
 *
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
                parent.postMessage({pluginMessage: {type: "navigate-to-node", payload: nodeId}}, '*');
            });
        });
    }

    /**
     * Call this with the id of a search input and the relevant search text of the element to make it searchable.
     * It will hide the element if the searchText from the input does not match the relevant search text of the element.
     */
    protected setupAsSearchableElement() {
        if (this.getSearchInputSelector().length === 0) return;

        const searchInput = document.querySelector(this.getSearchInputSelector()) as SearchInputElement;
        if (!searchInput) {
            return;
        }

        searchInput.addEventListener("search", (event: Event) => {
            const searchText = (event as CustomEvent).detail.toLowerCase();
            if (this.getSearcheableText().toLowerCase().includes(searchText) || searchText.length === 0) {
                this.classList.remove("search-hidden");
            } else {
                this.classList.add("search-hidden");
            }

        });
    }

    public getSearchInputSelector(): string {
        return "";
    }

    public getSearcheableText(): string {
        return this.innerHTML;
    }
}