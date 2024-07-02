import {ComponentsSearchResult} from "./document-searcher";
import {ComponentType, ComponentDto, ScanResultDto, VariantDto} from "../../shared/types";
import {util} from "../backend";

export class SearchResultConverter {

    constructor(protected searchResult: ComponentsSearchResult) {
    }

    public async convert(): Promise<ScanResultDto> {
        return {
            components: await this.extractComponents()
        }
    }

    protected async extractComponents() {
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

    protected async constructDtoForComponentSet(componentSet: ComponentSetNode): Promise<ComponentDto> {
        const variants: VariantDto[] = [];
        const instanceNodeIds: string[] = [];
        for (const child of componentSet.children) {
            if (this.isVariant(child as ComponentNode)) {
                variants.push(await this.constructDtoForVariant(child as ComponentNode));
                instanceNodeIds.push(...await this.findAllInstanceNodeIds(child as ComponentNode));
            }
        }

        return {
            nodeId: componentSet.id,
            nodeName: componentSet.name,
            type: ComponentType.COMPONENT_SET,
            variants: variants,
            instanceNodeIds: instanceNodeIds,
        }
    }

    private async findAllInstanceNodeIds(componentNode: ComponentNode): Promise<string[]> {
        // It is probably slow to call getInstancesAsync this could probably be improved
        const instances = await componentNode.getInstancesAsync();
        return instances.map(instance => instance.id);
    }


    private async constructDtoForComponent(component: ComponentNode): Promise<ComponentDto> {
        return {
            nodeId: component.id,
            nodeName: component.name,
            type: ComponentType.COMPONENT,
            variants: [],
            instanceNodeIds: await this.findAllInstanceNodeIds(component)
        }
    }

    private async constructDtoForVariant(node: ComponentNode): Promise<VariantDto> {
        util.log("Variant found:", node)
        return {
            nodeId: node.id,
            displayName: Object.values(node.variantProperties!)[0],
            instanceNodeIds: await this.findAllInstanceNodeIds(node)
        }
    }

    private isVariant(component: ComponentNode) {
        return component.variantProperties && component.variantProperties.key !== null;
    }
}