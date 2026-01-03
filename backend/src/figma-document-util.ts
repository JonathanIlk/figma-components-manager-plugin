import {util} from "../backend";

/**
 * A list of all component relevant figma nodes found in the document.
 */
export interface DocumentComponentFindings {
    // Components without Variants
    components: { [id: string]: ComponentNode };

    // Component Sets are Components with Variants
    componentSets: { [id: string]: ComponentSetNode };
}

/**
 * Provides utility functions to traverse and analyze the Figma document structure.
 */
export class FigmaDocumentUtil {

    public static findAllComponents(): DocumentComponentFindings {
        // COMPONENT_SET = Component with Variants, COMPONENT = Variant/Component without Variants
        const allComponentNodes: (ComponentSetNode | ComponentNode)[] = figma.root.findAll()
            .filter(node => node.type === 'COMPONENT_SET' || node.type === "COMPONENT") as (ComponentSetNode | ComponentNode)[];
        return this.findComponentsInNodes(allComponentNodes);
    }

    public static findComponentsInNodes(nodes: (PageNode | SceneNode)[]): DocumentComponentFindings {
        const searchResult: DocumentComponentFindings = {
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

    /**
     * Returns the root node from which we start the search for updates for a given node.
     * i.e. returns the root node from which we need to re-scan components for variants & instances when the given node changes.
     */
    public static async findRootComponentNode(node: BaseNode): Promise<ComponentNode | ComponentSetNode | undefined> {
        if (node.type === "COMPONENT_SET") {
            // We are already at the root.
            return node as ComponentSetNode;
        }
        if (node.type === "COMPONENT") {
            const parentNode = node.parent as ComponentSetNode | null;
            if (parentNode?.type === "COMPONENT_SET") {
                // The parent is a ComponentSet, so this component is a variant.
                return parentNode as ComponentSetNode;
            }
            // This Component is not part of a ComponentSet, so it is the root. (Component without variants)
            return node as ComponentNode;
        }
        if (node.type === "INSTANCE") {
            const mainComponent = await node.getMainComponentAsync();
            if (!mainComponent) {
                return undefined;
            }
            return this.findRootComponentNode(mainComponent);
        }
        return undefined;
    }

    public static findAllChildrenRecursively(node: SceneNode): BaseNode[] {
        const allChildren: BaseNode[] = [];

        function recurse(currentNode: SceneNode) {
            allChildren.push(currentNode);
            if ("children" in currentNode) {
                for (const child of currentNode.children) {
                    recurse(child);
                }
            }
        }

        recurse(node);
        return allChildren;
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

    /**
     * In some cases getting information from certain nodes can lead to errors, we will simply ignore such nodes.
     */
    public static isNodeValid(node: PageNode | SceneNode) {
        try {
            // Accessing variantProperties will call `getVariantProperties` internally which can throw errors for invalid nodes.
            (node as ComponentNode).variantProperties;
        } catch (e) {
            util.logWarn("Invalid node encountered during search, skipping it:", node, e);
            return false;
        }

        return true;
    }
}