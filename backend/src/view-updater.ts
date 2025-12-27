import {ComponentsSearchResult, DocumentSearcher} from "./document-searcher";
import {SearchResultConverter} from "./search-result-converter";
import {MessageToUiType} from "../../shared/types";

export class ViewUpdater {

    /**
     * Scan the entire document for components, variants, instances and send the result to the UI.
     */
    public async fullComponentsRefresh() {
        const searchResult: ComponentsSearchResult = DocumentSearcher.findAllComponents();
        const scanResultDto = await new SearchResultConverter(searchResult).convert();
        figma.ui.postMessage({type: MessageToUiType.FULL_COMPONENTS_REFRESH, payload: scanResultDto});
    }

    public async updateForDocumentChanges(changes: DocumentChange[]) {
    }
}