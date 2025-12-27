export type ComponentsSearchResult = {
    // Components without Variants
    components: { [id: string]: ComponentNode };

    // Component Sets are Components with Variants
    componentSets: { [id: string]: ComponentSetNode };
}

/**
 * Searches through the figma document to find components and their instances.
 */
export class DocumentSearcher {

    public static findAllComponents(): ComponentsSearchResult {
        // COMPONENT_SET = Component with Variants, COMPONENT = Variant/Component without Variants
        const allComponentNodes: (ComponentSetNode | ComponentNode)[] = figma.root.findAll()
            .filter(node => node.type === 'COMPONENT_SET' || node.type === "COMPONENT") as (ComponentSetNode | ComponentNode)[];
        return this.findComponentsInNodes(allComponentNodes);
    }

    public static findComponentsInNodes(nodes: (PageNode | SceneNode)[]): ComponentsSearchResult {
        const searchResult: ComponentsSearchResult = {
            components: {},
            componentSets: {}
        };
        for (const node of nodes) {
            if (node.type === "COMPONENT") {
                searchResult.components[node.id] = node as ComponentNode;
            } else if (node.type === "COMPONENT_SET") {
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