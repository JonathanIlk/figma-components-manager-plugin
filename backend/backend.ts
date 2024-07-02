import {ComponentDto, MessageToBackend, ScanResultDto} from "../shared/types";
import {Util} from "../shared/util";
import {ComponentsSearchResult, DocumentSearcher} from "./src/document-searcher";
import {SearchResultConverter} from "./src/search-result-converter";

figma.showUI(__html__, {themeColors: true, width: 400, height: 500});
export const util = new Util("CM-Backend");

type UiMessage = {
    type: "components";
    payload: object;
}

function sendToUi(message: UiMessage) {
    figma.ui.postMessage(message);
}

class InformationScanner {

    public static async fullScan(): Promise<ScanResultDto> {
        const searchResult: ComponentsSearchResult = DocumentSearcher.findAllComponents();
        return new SearchResultConverter(searchResult).convert();
    }
}

async function init() {
    await figma.loadAllPagesAsync();
    const scanResult: ScanResultDto = await InformationScanner.fullScan();
    sendToUi({type: "components", payload: scanResult});
}

init();



figma.ui.onmessage = async (msg: MessageToBackend) => {
    if (msg.type === 'navigate-to-node') {
        const nodeId = msg.payload as string;
        const node = await figma.getNodeByIdAsync(nodeId) as SceneNode;
        if (node) {
            // If the node is not in the current page, we should switch to the page where the node is located
            let pageNode = node.parent;
            for (let i = 0; i < 20; i++) {
                if(!pageNode) break;
                if (pageNode.type === "PAGE") {
                    // yay we found the page somewhere in the hierarchy
                    break;
                }
                pageNode = pageNode.parent;
            }
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

};
