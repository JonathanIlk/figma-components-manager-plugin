import {ComponentsSearchResult} from "./document-searcher";
import {ComponentType, ComponentDto, ScanResultDto, VariantDto, InstanceDto} from "../../shared/types";
import {util} from "../backend";
import {FigmaUtil} from "./figma-util";

/**
 * Converts a ComponentsSearchResult into a ScanResultDto for transfer to the frontend, to be displayed in the UI.
 */
export class SearchResultConverter {

    constructor(protected searchResult: ComponentsSearchResult) {
    }

    public async convert(): Promise<ScanResultDto> {
        util.log(`Converting scan result of ${Object.keys(this.searchResult.components).length} components and ${Object.keys(this.searchResult.componentSets).length} component sets to DTOs`);
        const components = await this.extractComponents();
        const allInstanceNodeIds: InstanceDto[] = components.flatMap(component => component.instances);

        return {
            allInstances: allInstanceNodeIds,
            components: await this.extractComponents()
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
        const instanceNodeIds: InstanceDto[] = [];
        for (const child of componentSet.children) {
            if (this.isVariant(child as ComponentNode)) {
                variants.push(await this.constructDtoForVariant(child as ComponentNode));
                instanceNodeIds.push(...await this.findAllInstances(child as ComponentNode));
            }
        }

        return {
            nodeId: componentSet.id,
            nodeName: componentSet.name,
            type: ComponentType.COMPONENT_SET,
            variants: variants,
            instances: instanceNodeIds,
        }
    }

    private async findAllInstances(componentNode: ComponentNode): Promise<InstanceDto[]> {
        // It is probably slow to call getInstancesAsync this could probably be improved
        const instances = await componentNode.getInstancesAsync();
        return instances.map(instance => {
            return {
                nodeId: instance.id,
                nodeName: instance.name
            }
        });
    }


    private async constructDtoForComponent(component: ComponentNode): Promise<ComponentDto> {
        return {
            nodeId: component.id,
            nodeName: component.name,
            type: ComponentType.COMPONENT,
            variants: [],
            instances: await this.findAllInstances(component)
        }
    }

    private async constructDtoForVariant(node: ComponentNode): Promise<VariantDto> {
        util.log("Variant found:", node)
        return {
            nodeId: node.id,
            displayName: Object.values(node.variantProperties!).join(", "),
            instances: await this.findAllInstances(node)
        }
    }

    private isVariant(component: ComponentNode) {
        if(!FigmaUtil.isNodeValid(component)) {
            return false;
        }

        return component.variantProperties && component.variantProperties.key !== null;
    }
}