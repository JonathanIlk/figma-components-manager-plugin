/**
 *
 */
export abstract class AbstractCmElement extends HTMLElement {

    /**
     * Call this in the child classes to enable interactivity for certain elements (if used).
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
}