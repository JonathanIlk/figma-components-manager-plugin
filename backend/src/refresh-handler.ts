import {FigmaDocumentUtil, DocumentComponentFindings} from "./figma-document-util";
import {DocumentScanConverter} from "./document-scan-converter";
import {DocumentUpdatePayload, DocumentUpdateSeriesInformation, MessageToUiType} from "../../shared/types";
import {util} from "../backend";

const INTERESTED_NODE_CHANGE_PROPERTIES: NodeChangeProperty[] = [
    "variant" as NodeChangeProperty,
    "name",
    "componentPropertyDefinitions", // Occurs when deleting a variant
    "parent", // Occurs when restoring after deleting them previously (ctrl+Z)
];

/**
 * Can be used to trigger a refresh to the UI based on document changes.
 */
export class RefreshHandler {

    /**
     * Used at the start to do a full scan of the document and send the results to the UI.
     * Scan the entire document for components, variants, instances and send the result to the UI.
     */
    public async fullComponentsRefresh() {
        let currentPageNumber = 1;
        const pageCount = figma.root.children.length;
        // We look for components page by page to avoid loading too many nodes into memory at once.
        for (const page of figma.root.children) {
            util.log(`Full refresh: Scanning page "${page.name}" (${currentPageNumber}/${figma.root.children.length}) for components...`);
            await page.loadAsync();

            const seriesInfo: DocumentUpdateSeriesInformation = {
                updateType: "series-segment",
                currentUpdateIndex: currentPageNumber,
                updatesExpectedInSeries: pageCount,
            }
            if(currentPageNumber === 1) {
                seriesInfo.updateType = "series-start";
            } else if(currentPageNumber === pageCount) {
                seriesInfo.updateType = "final-series-update";
            }

            await this.partialRefreshForPage(page, seriesInfo);

            // Give the event loop a moment to flush the postMessage and handle UI updates
            await new Promise(resolve => setTimeout(resolve, 50));
            currentPageNumber++;
        }

    }

    protected async partialRefreshForPage(page: PageNode, seriesInfo: DocumentUpdateSeriesInformation) {
        const searchResults: DocumentComponentFindings = FigmaDocumentUtil.findAllComponentsOnPage(page);
        const scanResultDto = await new DocumentScanConverter(searchResults).convert();

        const documentUpdatePayload: DocumentUpdatePayload = {
            scanResult: scanResultDto,
            removedNodeIds: [],
            updateSeriesInformation: seriesInfo,
        }
        figma.ui.postMessage({type: MessageToUiType.DOCUMENT_UPDATE, payload: documentUpdatePayload});
    }

    /**
     * Processes a DocumentChangeEvent and sends a partial refresh update to the UI if relevant changes are detected.
     */
    public async refreshForDocumentChangeEvent(event: DocumentChangeEvent) {
        util.log("RefreshHandler: Detected document changes, processing for partial refresh...", event);

        const refreshInstructions: DocumentComponentFindings = {
            components: {},
            componentSets: {},
            instances: {},
        };
        const removedNodeIds: string[] = [];

        for (const documentChange of event.documentChanges) {
            if (documentChange.type === "PROPERTY_CHANGE") {
                if (!INTERESTED_NODE_CHANGE_PROPERTIES.some(interestedProp => documentChange.properties.includes(interestedProp))) {
                    // The changed properties MUST include at least one of the interested properties to trigger a refresh.
                    // Otherwise we skip this change.
                    continue;
                }
                await this.addRootComponentNodeToRefreshInstructions(documentChange.node as SceneNode, refreshInstructions);
            } else if (documentChange.type === "CREATE") {
                await this.addRootComponentNodeToRefreshInstructions(documentChange.node as SceneNode, refreshInstructions);
            } else if (documentChange.type === "DELETE") {
                // For deletions, we cannot re-scan the component, as it is gone.
                // Instead, we just inform the UI that this node and all of its children are gone.
                if (documentChange.node.removed) {
                    removedNodeIds.push(documentChange.node.id);
                }
                removedNodeIds.push(...FigmaDocumentUtil.findAllChildrenRecursively(documentChange.node as SceneNode).map(node => node.id));
            }

        }

        if (Object.keys(refreshInstructions.components).length === 0 && Object.keys(refreshInstructions.componentSets).length === 0 && removedNodeIds.length === 0) {
            // No relevant changes detected, skip refresh.
            return;
        }


        const scanResultDto = await new DocumentScanConverter(refreshInstructions).convert();

        const documentUpdatePayload: DocumentUpdatePayload = {
            scanResult: scanResultDto,
            removedNodeIds: removedNodeIds,
        }
        figma.ui.postMessage({type: MessageToUiType.DOCUMENT_UPDATE, payload: documentUpdatePayload});
    }

    /**
     * In any case we want to include the root component/component set node for the given node in the refresh instructions to be re-scanned.
     */
    private async addRootComponentNodeToRefreshInstructions(node: BaseNode, instructions: DocumentComponentFindings) {
        const relevantRootNode = await FigmaDocumentUtil.findRootComponentNode(node as SceneNode);
        if (relevantRootNode?.type === "COMPONENT") {
            instructions.components[relevantRootNode.id] = relevantRootNode as ComponentNode;
        } else if (relevantRootNode?.type === "COMPONENT_SET") {
            instructions.componentSets[relevantRootNode.id] = relevantRootNode as ComponentSetNode;
        }
    }
}