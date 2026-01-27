import {BackendMessageType, MessageToBackend, ResizeMessage, SetAutoRefreshMessage, SetFontSizeMessage} from "../../shared/types";
import {FigmaDocumentUtil} from "./figma-document-util";
import {WindowService} from "./services/window-service";
import {SettingsService} from "./services/settings-service";
import {RefreshHandler} from "./refresh-handler";
import {util} from "../backend";

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
                case BackendMessageType.CYCLE_THROUGH_INSTANCES: {
                    await this.onCycleThroughInstances(msg);
                    break;
                }
                case BackendMessageType.RESIZE: {
                    const message = msg as ResizeMessage;
                    WindowService.getInstance().resize(message.payload.width, message.payload.height);
                    break;
                }
                case BackendMessageType.SET_AUTO_REFRESH: {
                    const message = msg as SetAutoRefreshMessage;
                    await SettingsService.getInstance().setAutoRefresh(message.payload.autoRefresh);
                    break;
                }
                case BackendMessageType.SET_FONT_SIZE: {
                    const message = msg as SetFontSizeMessage;
                    await SettingsService.getInstance().setFontSize(message.payload.fontSize);
                    break;
                }
                case BackendMessageType.MANUAL_REFRESH: {
                    await new RefreshHandler().fullComponentsRefresh();
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
            await this.focusNode(node);
        }
    }

    protected async onCycleThroughInstances(message: MessageToBackend) {
        const nodeId = message.payload as string;
        const node = await figma.getNodeByIdAsync(nodeId) as ComponentNode | ComponentSetNode;
        if (!node) return;

        if (node.type === "COMPONENT") {
            const instances = await node.getInstancesAsync();
            if (instances.length === 0) return;

            // Check if any of the instances is currently selected
            const currentSelection = figma.currentPage.selection;
            let nextIndex = 0;

            if (currentSelection.length > 0) {
                const selectedNode = currentSelection[0];
                const currentIndex = instances.findIndex((instance: InstanceNode) => instance.id === selectedNode.id);
                if (currentIndex !== -1) {
                    nextIndex = (currentIndex + 1) % instances.length;
                }
            }

            const nextInstance = instances[nextIndex];
            await this.focusNode(nextInstance);
        }
    }

    private async focusNode(node: SceneNode) {
        // If the node is not in the current page, we should switch to the page where the node is located
        const pageNode = FigmaDocumentUtil.findPageForNode(node);
        if (!pageNode) {
            util.logError("Could not find the page for the node");
            return;
        }
        if(pageNode && pageNode.type === "PAGE" && figma.currentPage !== pageNode as PageNode) {
            await figma.setCurrentPageAsync(pageNode as PageNode);
        }

        figma.currentPage.selection = [node];
        figma.viewport.scrollAndZoomIntoView([node]);
    }
}