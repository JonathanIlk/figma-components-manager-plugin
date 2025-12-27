import {BackendMessageType, MessageToBackend, ResizeMessage} from "../../shared/types";
import {DocumentSearcher} from "./document-searcher";
import {WindowManager} from "./window-manager";

/**
 * Handles messages received from the UI (e.g. button clicks) and performs corresponding actions in the Figma document.
 */
export class BackendMessageReceiver {

    public init() {
        figma.ui.onmessage = async (msg: MessageToBackend) => {
            switch(msg.type) {
                case BackendMessageType.NAVIGATE_TO_NODE: {
                    await this.onNavigateToNode(msg);
                    break;
                }
                case BackendMessageType.RESIZE: {
                    const message = msg as ResizeMessage;
                    WindowManager.getInstance().resize(message.payload.width, message.payload.height);
                    break;
                }
            }
            if (msg.type === BackendMessageType.NAVIGATE_TO_NODE) {
                await this.onNavigateToNode(msg);
            }
        };
    }

    protected async onNavigateToNode(message: MessageToBackend) {
        const nodeId = message.payload as string;
        const node = await figma.getNodeByIdAsync(nodeId) as SceneNode;
        if (node) {
            // If the node is not in the current page, we should switch to the page where the node is located
            const pageNode = DocumentSearcher.findPageForNode(node);
            if (!pageNode) {
                console.error("Could not find the page for the node");
                return;
            }
            if(pageNode && pageNode.type === "PAGE" && figma.currentPage !== pageNode as PageNode) {
                await figma.setCurrentPageAsync(pageNode as PageNode);
            }

            figma.currentPage.selection = [node];
            figma.viewport.scrollAndZoomIntoView([node]);
        }
    }
}