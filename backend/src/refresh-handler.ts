import {DocumentSearcher, RefreshStartInstructions} from "./document-searcher";
import {ScanResultBuilder} from "./scan-result-builder";
import {DocumentUpdatePayload, MessageToUiType} from "../../shared/types";
import {util} from "../backend";

const INTERESTED_NODE_CHANGE_PROPERTIES: NodeChangeProperty[] = [
    "variant" as NodeChangeProperty,
    "name",
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
        const searchResult: RefreshStartInstructions = DocumentSearcher.findAllComponents();
        const scanResultDto = await new ScanResultBuilder(searchResult).convert();

        const documentUpdatePayload: DocumentUpdatePayload = {
            scanResult: scanResultDto,
            removedNodeIds: []
        }

        figma.ui.postMessage({type: MessageToUiType.DOCUMENT_UPDATE, payload: documentUpdatePayload});
    }

    public async partialComponentsRefresh(event: DocumentChangeEvent) {
        const refreshInstructions: RefreshStartInstructions = {
            components: {},
            componentSets: {}
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
                removedNodeIds.push(...DocumentSearcher.findAllChildrenRecursively(documentChange.node as SceneNode).map(node => node.id));
            }

        }

        if (Object.keys(refreshInstructions.components).length === 0 && Object.keys(refreshInstructions.componentSets).length === 0 && removedNodeIds.length === 0) {
            // No relevant changes detected, skip refresh.
            return;
        }


        const scanResultDto = await new ScanResultBuilder(refreshInstructions).convert();

        const documentUpdatePayload: DocumentUpdatePayload = {
            scanResult: scanResultDto,
            removedNodeIds: removedNodeIds,
        }
        figma.ui.postMessage({type: MessageToUiType.DOCUMENT_UPDATE, payload: documentUpdatePayload});
    }

    /**
     * In any case we want to include the root component/component set node for the given node in the refresh instructions to be re-scanned.
     */
    private async addRootComponentNodeToRefreshInstructions(node: BaseNode, instructions: RefreshStartInstructions) {
        const relevantRootNode = await DocumentSearcher.findRootComponentNode(node as SceneNode);
        if (relevantRootNode?.type === "COMPONENT") {
            instructions.components[relevantRootNode.id] = relevantRootNode as ComponentNode;
        } else if (relevantRootNode?.type === "COMPONENT_SET") {
            instructions.componentSets[relevantRootNode.id] = relevantRootNode as ComponentSetNode;
        }
    }
}