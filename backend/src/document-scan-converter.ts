import {DocumentComponentFindings, FigmaDocumentUtil} from "./figma-document-util";
import {ComponentDto, ComponentType, InstanceDto, ScanResultDto, VariantDto} from "../../shared/types";
import {util} from "../backend";

/**
 * Converts DocumentComponentFindings into a ScanResultDto for transfer to the frontend, to be displayed in the UI.
 */
export class DocumentScanConverter {

    constructor(protected searchResult: DocumentComponentFindings) {
    }

    /**
     * Takes all the found components, variants and instances and converts them into DTOs suitable for transfer to the UI.
     */
    public async convert(): Promise<ScanResultDto> {
        util.log(`Converting scan result of ${Object.keys(this.searchResult.components).length} components | ${Object.keys(this.searchResult.componentSets).length} component sets | ${Object.keys(this.searchResult.instances).length} instances into DTOs...`);
        const allComponentDtos = await this.extractComponents();

        const variantDtos: VariantDto[] = await Promise.all(Object.values(this.searchResult.componentSets)
            .flatMap(componentSet => componentSet.children as ComponentNode[])
            .filter(component => this.isVariant(component))
            .map(async component => {
                return await this.constructDtoForVariant(component);
            }));

        const instanceDtos: InstanceDto[] = await Promise.all(Object.values(this.searchResult.instances).map(async instance => {
            return {
                nodeId: instance.id,
                nodeName: instance.name,
                mainComponentNodeId: (await instance.getMainComponentAsync())?.id,
            };
        }));

        return {
            components: allComponentDtos,
            variants: variantDtos,
            instances: instanceDtos,
        }
    }

    private async extractComponents() {
        const componentDtos: ComponentDto[] = [];

        // first add all ComponentSets as Components
        for (const componentSet of Object.values(this.searchResult.componentSets)) {
            componentDtos.push(await this.constructDtoForComponentSet(componentSet));
        }

        // then add all Components that are not part of a ComponentSet (Components without Variants)
        for (const component of Object.values(this.searchResult.components)) {
            if (this.isVariant(component)) {
                continue;
            }
            componentDtos.push(await this.constructDtoForComponent(component));
        }
        return componentDtos;
    }

    private async constructDtoForComponentSet(componentSet: ComponentSetNode): Promise<ComponentDto> {
        const variants: VariantDto[] = [];
        for (const child of componentSet.children) {
            if (this.isVariant(child as ComponentNode)) {
                variants.push(await this.constructDtoForVariant(child as ComponentNode));
            }
        }

        let variantPropertyKeys: string[] = [];
        try {
            variantPropertyKeys = Object.keys(componentSet.variantGroupProperties);
        } catch(e) {
            // Happens for invalid component sets, then we just leave it empty
        }

        return {
            nodeId: componentSet.id,
            nodeName: componentSet.name,
            type: ComponentType.COMPONENT_SET,
            variantIds: variants.map(variant => variant.nodeId),
            variantProperties: variantPropertyKeys,
        }
    }



    private async constructDtoForComponent(component: ComponentNode): Promise<ComponentDto> {
        return {
            nodeId: component.id,
            nodeName: component.name,
            type: ComponentType.COMPONENT,
            variantIds: [], // single components do not have variants
            variantProperties: [], // single components do not have variant properties
        }
    }

    private async constructDtoForVariant(node: ComponentNode): Promise<VariantDto> {
        return {
            nodeId: node.id,
            displayName: Object.values(node.variantProperties!).join(", "),
            propertyValues: Object.values(node.variantProperties!),
        }
    }

    private isVariant(component: ComponentNode) {
        if (!FigmaDocumentUtil.isNodeValid(component)) {
            return false;
        }

        return component.variantProperties && component.variantProperties.key !== null;
    }
}