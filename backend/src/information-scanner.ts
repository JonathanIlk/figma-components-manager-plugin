import {ScanResultDto} from "../../shared/types";
import {ComponentsSearchResult, DocumentSearcher} from "./document-searcher";
import {SearchResultConverter} from "./search-result-converter";

export class InformationScanner {

    public static async fullScan(): Promise<ScanResultDto> {
        const searchResult: ComponentsSearchResult = DocumentSearcher.findAllComponents();
        return new SearchResultConverter(searchResult).convert();
    }
}