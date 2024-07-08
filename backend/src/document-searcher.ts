export type ComponentsSearchResult = {
    components: { [id: string]: ComponentNode };
    componentSets: { [id: string]: ComponentSetNode };
}

export class DocumentSearcher {

    public static findAllComponents(): ComponentsSearchResult {
        const searchResult: ComponentsSearchResult = {
            components: {},
            componentSets: {}
        };
        // COMPONENT_SET = Component with Variants, COMPONENT = Variant/Component without Variants
        const allNodes = figma.root.findAll(node => node.type === 'COMPONENT_SET' || node.type === "COMPONENT");
        for (const node of allNodes) {
            if(node.type === "COMPONENT") {
                searchResult.components[node.id] = node as ComponentNode;
            } else {
                searchResult.componentSets[node.id] = node as ComponentSetNode;
            }
        }
        return searchResult;
    }

    public static findPageForNode(node: BaseNode): PageNode | undefined {
        let pageNode = node.parent;
        for (let i = 0; i < 20; i++) {
            if(!pageNode) break;
            if (pageNode.type === "PAGE") {
                // yay we found the page somewhere in the hierarchy
                return pageNode as PageNode;
            }
            pageNode = pageNode.parent;
        }
        return undefined;
    }
}