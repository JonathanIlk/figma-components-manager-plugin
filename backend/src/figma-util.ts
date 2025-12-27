import {util} from "../backend";

export class FigmaUtil {
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